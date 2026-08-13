'use strict';
/**
 * post · 质检引擎(可选依赖 ffmpeg/ffprobe)
 *
 * 只保留交付必需的最小能力:产物级质量门 + 字幕烧录兜底。
 * 配音/混音(VO)不在此引擎内:音频已由 prompt 直出(M6 §6),不再做后期 TTS 拼接。
 *
 * 能力:
 *  - C 产物级质量门(主):用 ffprobe 客观校验(时长/宽高/帧率)+ 抽帧供人工审「违背常理」。
 *  - B 字幕烧录(兜底):字幕已默认 prompt 直出,仅当模型直出不稳时才 SRT 烧录(A1 §6.2)。
 *
 * 依赖可降级:
 *  - probe / frames / burn 需要 ffmpeg 与 ffprobe(缺失时报能力缺口,不伪造)。
 *
 * 用法:
 *   node core/post.cjs probe  <video> [--expect-duration 15] [--expect-width 720] [--expect-height 1280] [--expect-fps 24]
 *   node core/post.cjs frames <video> --out <dir> [--every 1.0]
 *   node core/post.cjs burn   <video> --srt <file.srt> --out <out.mp4>
 *   node core/post.cjs verify <video> [--expect-*] [--frames-out <dir>]
 */
const { execFile } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execFileAsync = promisify(execFile);

// ---------------- 纯函数: 解析与构图 ----------------

/** ms -> "HH:MM:SS,mmm"(SRT 时间) */
function msToSrt(ms) {
  const total = Math.max(0, Math.round(ms));
  const h = Math.floor(total / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const mm = total % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(mm).padStart(3, '0')}`;
}

/** "HH:MM:SS,mmm" -> ms */
function parseSrtTime(str) {
  const match = /^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})$/.exec(String(str).trim());
  if (!match) return null;
  const [, hh, mm, ss, mi] = match;
  return Number(hh) * 3600000 + Number(mm) * 60000 + Number(ss) * 1000 + Number(mi.padEnd(3, '0'));
}

/**
 * 解析标准 SRT 文本 -> [{ index, start, end, text }]
 * 校验严格: 时间行必须为 "-->" 且两端可解析;失败抛错(不静默吞掉格式问题)。
 */
function parseSrt(text) {
  const blocks = String(text).replace(/^\uFEFF/, '').trim().split(/\r?\n\r?\n+/);
  const entries = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter((l) => l.trim() !== '');
    if (lines.length === 0) continue;
    let idxLine = 0;
    let index = entries.length + 1;
    if (/^\d+$/.test(lines[0].trim())) {
      index = Number(lines[0].trim());
      idxLine = 1;
    }
    const timeLine = lines[idxLine];
    const tm = /^([\d:,.]+)\s*-->\s*([\d:,.]+)/.exec(timeLine);
    if (!tm) {
      throw new Error(`Invalid SRT time line: "${timeLine}"`);
    }
    const start = parseSrtTime(tm[1]);
    const end = parseSrtTime(tm[2]);
    if (start === null || end === null) {
      throw new Error(`Invalid SRT time value: "${timeLine}"`);
    }
    const text = lines.slice(idxLine + 1).join('\n');
    entries.push({ index, start, end, text });
  }
  return entries;
}

/** 标准 SRT 文本生成(供 agent 伴生文档直接产出) */
function formatSrt(entries) {
  return entries
    .map((e, i) => `${e.index ?? i + 1}\n${msToSrt(e.start)} --> ${msToSrt(e.end)}\n${e.text}\n`)
    .join('\n')
    .trim() + '\n';
}

/** 从 CLI --expect-* 解析期望值 */
function parseExpected(args) {
  const expected = {};
  const map = {
    '--expect-duration': 'duration',
    '--expect-width': 'width',
    '--expect-height': 'height',
    '--expect-fps': 'fps'
  };
  for (let i = 0; i < args.length; i += 1) {
    const key = map[args[i]];
    if (key) {
      const v = Number(args[i + 1]);
      if (Number.isFinite(v)) expected[key] = v;
    }
  }
  return expected;
}

/**
 * 校验 ffprobe JSON 与期望值。
 * @returns {{ ok:boolean, checks:Array<{name,expected,actual,status}>, meta:object }}
 */
function validateProbe(probe, expected = {}) {
  const format = probe?.format ?? {};
  const video = (probe?.streams ?? []).find((s) => s.codec_type === 'video');
  const fpsOf = (s) => {
    if (!s) return NaN;
    const m = /^(\d+)\/(\d+)$/.exec(s.r_frame_rate || s.avg_frame_rate || '');
    return m ? Number(m[1]) / Number(m[2]) : NaN;
  };
  const actual = {
    duration: format.duration !== undefined ? Number(format.duration) : NaN,
    width: video ? Number(video.width) : NaN,
    height: video ? Number(video.height) : NaN,
    fps: fpsOf(video),
    codec: video ? video.codec_name : null
  };
  const checks = [];
  if (expected.duration !== undefined) {
    const ok = Number.isFinite(actual.duration) && Math.abs(actual.duration - expected.duration) <= 0.5;
    checks.push({ name: 'duration', expected: expected.duration, actual: actual.duration, status: ok ? 'pass' : 'fail' });
  }
  if (expected.width !== undefined) {
    const ok = Number.isFinite(actual.width) && actual.width === expected.width;
    checks.push({ name: 'width', expected: expected.width, actual: actual.width, status: ok ? 'pass' : 'fail' });
  }
  if (expected.height !== undefined) {
    const ok = Number.isFinite(actual.height) && actual.height === expected.height;
    checks.push({ name: 'height', expected: expected.height, actual: actual.height, status: ok ? 'pass' : 'fail' });
  }
  if (expected.fps !== undefined) {
    const ok = Number.isFinite(actual.fps) && Math.abs(actual.fps - expected.fps) <= 1;
    checks.push({ name: 'fps', expected: expected.fps, actual: actual.fps, status: ok ? 'pass' : 'fail' });
  }
  if (checks.length === 0) {
    checks.push({ name: 'readable', expected: 'video stream', actual: actual.codec || 'none', status: actual.codec ? 'pass' : 'fail' });
  }
  return { ok: checks.every((c) => c.status === 'pass'), checks, meta: actual };
}

// ---------------- 命令构图(纯函数,便于测试) ----------------

/** ffprobe 到 JSON 的参数 */
function buildProbeArgs(video) {
  return ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', video];
}

/** 字幕烧录: -vf subtitles=<escaped>。Windows 路径需转义冒号与反斜杠。 */
function escapeSubtitlePath(p) {
  return p.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'");
}
function buildBurnArgs(video, srt, out, opts = {}) {
  const style = opts.style || 'FontName=Source Han Sans SC Bold,FontSize=18,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,BorderStyle=1,Outline=2';
  const filter = `subtitles=${escapeSubtitlePath(srt)}:force_style='${style.replace(/'/g, "\\'")}'`;
  return ['-y', '-i', video, '-vf', filter, '-c:a', 'copy', out];
}

/** 抽帧联系表: 每 every 秒 1 帧 */
function buildFramesArgs(video, outDir, every = 1.0) {
  fs.mkdirSync(outDir, { recursive: true });
  const pattern = path.join(outDir, 'frame_%03d.jpg');
  return ['-y', '-i', video, '-vf', `fps=1/${every}`, '-q:v', '2', pattern];
}

// ---------------- 运行层(可注入 execFile 便于测试) ----------------

function runtimeContext(ctx = {}) {
  return {
    execFile: ctx.execFile ?? execFileAsync,
    env: ctx.env ?? process.env,
    cwd: ctx.cwd ?? process.cwd()
  };
}

async function hasTool(bin, ctx) {
  const probeCmd = process.platform === 'win32' ? 'where' : 'which';
  try {
    await ctx.execFile(probeCmd, [bin], { env: ctx.env });
    return true;
  } catch {
    return false;
  }
}

/**
 * 探测本机 ffmpeg 实际能力(不假设)。不同构建可能缺滤镜/输入源。
 * 返回独立可用的后期能力,缺失的如实报告并给出降级路径。
 */
async function runtimeCapabilities(ctx = {}) {
  const rt = runtimeContext(ctx);
  const hasBin = await hasTool('ffmpeg', rt);
  const hasProbe = await hasTool('ffprobe', rt);
  const filters = new Set();
  let hasLavfi = false;
  if (hasBin) {
    try {
      const { stdout } = await rt.execFile('ffmpeg', ['-hide_banner', '-filters'], { env: rt.env });
      for (const line of stdout.split(/\r?\n/)) {
        const m = / ([A-Za-z0-9_]+) +V\.\.\.| ([A-Za-z0-9_]+) +A\.\.\./.exec(line);
        const name = m ? (m[1] || m[2]) : /^\s*[A-Z.]+\s+([a-z0-9_]+)\s/.exec(line)?.[1];
        if (name) filters.add(name);
      }
    } catch { /* ignore */ }
  }
  if (hasBin) {
    try {
      const { stdout } = await rt.execFile('ffmpeg', ['-hide_banner', '-formats'], { env: rt.env });
      hasLavfi = /^\s*[DE]{0,2}\s+lavfi\b/s.test(stdout);
    } catch { /* ignore */ }
  }
  // 字幕烧录需要 subtitles 滤镜
  const hasSubtitles = filters.has('subtitles') || filters.has('ass');
  return {
    ffmpeg: hasBin,
    ffprobe: hasProbe,
    lavfi: hasLavfi,
    subtitles: hasSubtitles,
    frames: hasBin && filters.has('fps'),
    filters: [...filters].sort()
  };
}

/** B·字幕烧录的降级菜谱(在任何完整 ffmpeg / 剪映 上可执行) */
function burnRecipe(video, srt, out) {
  return [
    '# 字幕烧录(本机 ffmpeg 缺 subtitles 滤镜,请用完整版 ffmpeg 或剪映):',
    `ffmpeg -i "${video}" -vf "subtitles=${escapeSubtitlePath(srt)}:force_style='FontName=Source Han Sans SC Bold,FontSize=18,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,BorderStyle=1,Outline=2'" -c:a copy "${out}"`
  ].join('\n');
}

async function probe(video, ctx = {}) {
  const rt = runtimeContext(ctx);
  const { stdout } = await rt.execFile('ffprobe', buildProbeArgs(video), { env: rt.env });
  return JSON.parse(stdout);
}

async function frames(video, outDir, every, ctx = {}) {
  const rt = runtimeContext(ctx);
  await rt.execFile('ffmpeg', buildFramesArgs(video, outDir, every), { env: rt.env });
  return fs.readdirSync(outDir).filter((f) => /\.jpe?g$/i.test(f)).sort();
}

async function burn(video, srt, out, opts, ctx = {}) {
  const rt = runtimeContext(ctx);
  const caps = await runtimeCapabilities(rt);
  if (!caps.ffmpeg) {
    const err = new Error('ffmpeg unavailable: cannot burn subtitles.');
    err.kind = 'capability_gap';
    err.recipe = burnRecipe(video, srt, out);
    throw err;
  }
  if (!caps.subtitles) {
    const err = new Error('This ffmpeg lacks the subtitles filter; cannot burn subtitles here.');
    err.kind = 'capability_gap';
    err.recipe = burnRecipe(video, srt, out);
    throw err;
  }
  await rt.execFile('ffmpeg', buildBurnArgs(video, srt, out, opts), { env: rt.env });
  return out;
}

/** 质检门: 能力报告 + probe(客观校验) + 可选抽帧(人工审「违背常理」) + 决策清单 */
async function verify(video, opts = {}, ctx = {}) {
  const rt = runtimeContext(ctx);
  const expected = opts.expected || {};
  const report = {
    file: video,
    capabilities: await runtimeCapabilities(rt),
    format: null,
    frames: null,
    decision: null
  };
  if (!report.capabilities.ffprobe) {
    report.error = 'ffprobe unavailable: cannot run objective checks.';
    return report;
  }
  const data = await probe(video, rt);
  const validation = validateProbe(data, expected);
  report.format = validation.meta;
  report.checks = validation.checks;
  if (opts.framesOut) {
    if (report.capabilities.frames) {
      report.frames = await frames(video, opts.framesOut, opts.every || 1.0, rt);
    } else {
      report.frames = { skipped: true, reason: 'this ffmpeg lacks the fps filter.' };
    }
  }
  report.decision = buildVerdict(validation, report.frames);
  return report;
}

/** 违背常理无法自动判定:客观失败 -> 重生成;通过 -> 人工审帧后「重生成 / 后修 / 接受」 */
function buildVerdict(validation, framesList) {
  if (!validation.ok) {
    return { action: 'regenerate', reason: 'objective checks failed, see checks.' };
  }
  if (framesList && framesList.length >= 4) {
    return {
      action: 'human_review',
      reason: 'objective checks passed. Review extracted frames for 违背常理 (anatomy/physics/continuity), then decide regenerate / patch / accept.',
      frames: framesList
    };
  }
  return { action: 'accept', reason: 'objective checks passed; no frame review requested.' };
}

// ---------------- CLI ----------------

function printProbeSummary(report) {
  console.log(JSON.stringify({ ok: report.ok, checks: report.checks, meta: report.meta }, null, 2));
}

async function main(argv) {
  const [cmd, ...rest] = argv;
  const flag = (name, dflt) => {
    const i = rest.indexOf(name);
    return i >= 0 ? rest[i + 1] : dflt;
  };
  try {
    switch (cmd) {
      case 'probe': {
        const video = rest[0];
        const data = await probe(video);
        const validation = validateProbe(data, parseExpected(rest));
        console.log(JSON.stringify({ ok: validation.ok, checks: validation.checks, meta: validation.meta }, null, 2));
        return;
      }
      case 'frames': {
        const video = rest[0];
        const outDir = flag('--out');
        const every = Number(flag('--every', '1.0'));
        const list = await frames(video, outDir, every);
        console.log(JSON.stringify({ ok: true, frames: list.length, dir: outDir }, null, 2));
        return;
      }
      case 'burn': {
        const video = rest[0];
        const srt = flag('--srt');
        const out = flag('--out');
        await burn(video, srt, out, {});
        console.log(JSON.stringify({ ok: true, out }, null, 2));
        return;
      }
      case 'verify': {
        const video = rest[0];
        const framesOut = flag('--frames-out');
        const report = await verify(video, { expected: parseExpected(rest), framesOut });
        console.log(JSON.stringify(report, null, 2));
        return;
      }
      default:
        console.error('Usage:\n  probe/frames/burn/verify <video> [options]');
        process.exitCode = 2;
    }
  } catch (error) {
    console.error(`post: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = {
  msToSrt,
  parseSrtTime,
  parseSrt,
  formatSrt,
  parseExpected,
  validateProbe,
  buildProbeArgs,
  escapeSubtitlePath,
  buildBurnArgs,
  buildFramesArgs,
  buildVerdict,
  runtimeContext,
  runtimeCapabilities,
  hasTool,
  probe,
  frames,
  burn,
  verify
};