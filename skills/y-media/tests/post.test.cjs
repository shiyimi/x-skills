const assert = require('node:assert/strict');
const test = require('node:test');

const {
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
  runtimeCapabilities,
  hasTool,
  burn
} = require('../core/post.cjs');

test('msToSrt pads hours, minutes, seconds, and milliseconds', () => {
  assert.equal(msToSrt(500), '00:00:00,500');
  assert.equal(msToSrt(3661000), '01:01:01,000');
  assert.equal(msToSrt(0), '00:00:00,000');
  assert.equal(msToSrt(-5), '00:00:00,000');
});

test('parseSrtTime reads comma or dot milliseconds', () => {
  assert.equal(parseSrtTime('00:00:00,500'), 500);
  assert.equal(parseSrtTime('00:00:01.250'), 1250);
  assert.equal(parseSrtTime('01:02:03,004'), 3723004);
  assert.equal(parseSrtTime('not-a-time'), null);
});

test('parseSrt parses standard blocks and infers index when absent', () => {
  const text = [
    '1',
    '00:00:00,000 --> 00:00:01,500',
    '钩子 今天推荐一款',
    '',
    '00:00:01,600 --> 00:00:03,000',
    '数据 全网最低价'
  ].join('\n');
  const entries = parseSrt(text);
  assert.equal(entries.length, 2);
  assert.deepEqual(entries[0], { index: 1, start: 0, end: 1500, text: '钩子 今天推荐一款' });
  assert.deepEqual(entries[1], { index: 2, start: 1600, end: 3000, text: '数据 全网最低价' });
});

test('parseSrt rejects an invalid time line instead of swallowing it', () => {
  assert.throws(
    () => parseSrt('1\nNOT-ATIME --> 00:00:02,000\ntext'),
    /Invalid SRT time line/
  );
});

test('formatSrt round-trips parsed entries', () => {
  const entries = [
    { index: 1, start: 0, end: 1500, text: 'A' },
    { index: 2, start: 1600, end: 3000, text: 'B' }
  ];
  const out = formatSrt(entries);
  assert.equal(out, [
    '1',
    '00:00:00,000 --> 00:00:01,500',
    'A',
    '',
    '2',
    '00:00:01,600 --> 00:00:03,000',
    'B',
    ''
  ].join('\n'));
  assert.deepEqual(parseSrt(out).map((e) => e.text), ['A', 'B']);
});

test('parseExpected maps --expect-* flags to numeric expectations', () => {
  assert.deepEqual(parseExpected(['--expect-duration', '15', '--expect-fps', '24']), {
    duration: 15,
    fps: 24
  });
  assert.deepEqual(parseExpected(['--expect-duration', 'nope']), {});
});

test('validateProbe checks duration, dimensions, and fps with tolerance', () => {
  const probe = {
    format: { duration: '15.2' },
    streams: [
      { codec_type: 'video', codec_name: 'h264', width: 720, height: 1280, r_frame_rate: '24/1' }
    ]
  };
  const ok = validateProbe(probe, { duration: 15, width: 720, height: 1280, fps: 24 });
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.meta, { duration: 15.2, width: 720, height: 1280, fps: 24, codec: 'h264' });

  const bad = validateProbe(probe, { duration: 30 });
  assert.equal(bad.ok, false);
  assert.equal(bad.checks.find((c) => c.name === 'duration').status, 'fail');
});

test('validateProbe falls back to a readable-stream check when no expectations are given', () => {
  const ok = validateProbe({ format: {}, streams: [{ codec_type: 'video', codec_name: 'av1' }] });
  assert.equal(ok.ok, true);
  assert.equal(ok.checks[0].name, 'readable');
});

test('buildVerdict routes objective pass/fail and frame-review availability', () => {
  const pass = { ok: true, checks: [] };
  const fail = { ok: false, checks: [] };
  assert.deepEqual(buildVerdict(fail, []), { action: 'regenerate', reason: 'objective checks failed, see checks.' });
  assert.deepEqual(buildVerdict(pass, ['a', 'b', 'c', 'd']).action, 'human_review');
  assert.deepEqual(buildVerdict(pass, null).action, 'accept');
  assert.deepEqual(buildVerdict(pass, ['a', 'b']).action, 'accept');
});

test('escapeSubtitlePath escapes colons for the ffmpeg subtitles filter', () => {
  assert.equal(escapeSubtitlePath('C:\\clips\\my.srt'), 'C\\:/clips/my.srt');
  const args = buildBurnArgs('in.mp4', 'C:\\clips\\my.srt', 'out.mp4');
  assert.equal(args[0], '-y');
  assert.ok(args.join(' ').includes('subtitles=C\\:/clips/my.srt'));
  assert.ok(args.join(' ').includes('force_style'));
  assert.ok(args.includes('out.mp4'));
});

test('buildFramesArgs shapes its filter graph', () => {
  const frames = buildFramesArgs('in.mp4', 'C:/frames', 1.0);
  assert.ok(frames.includes('fps=1/1'));
  assert.ok(frames.join(' ').includes('frame_%03d.jpg'));
});

test('buildProbeArgs requests JSON format and streams', () => {
  const args = buildProbeArgs('in.mp4');
  assert.deepEqual(args, ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', 'in.mp4']);
});

test('runtimeCapabilities reports subtitles and frames from the ffmpeg filter list', async () => {
  function fakeExecFile(bin, args) {
    if (bin === 'where' || bin === 'which') return Promise.resolve({ stdout: '' });
    if (args.includes('-filters')) {
      return Promise.resolve({ stdout: [
        ' ...',
        ' ..F. subtitles   V->V ..... Render text subtitles onto input video.',
        ' ..F. volume       A->A ..... Change input volume.',
        ' ..F. amix         AACCC    Audio mixing.',
        ' ..F. adelay       A->A     Delay audio',
        ' ..F. fps          V->V     Force constant framerate.'
      ].join('\n') });
    }
    if (args.includes('-formats')) return Promise.resolve({ stdout: ' DE lavfi  ...' });
    return Promise.resolve({ stdout: '' });
  }
  const caps = await runtimeCapabilities({ execFile: fakeExecFile });
  assert.equal(caps.ffmpeg, true);
  assert.equal(caps.ffprobe, true);
  assert.equal(caps.subtitles, true);
  assert.equal(caps.frames, true);
  assert.equal(caps.lavfi, true);
});

test('burn throws a capability_gap with a recipe when subtitles filter is missing', async () => {
  function fakeExecFile(bin, args) {
    if (bin === 'where' || bin === 'which') return Promise.resolve({ stdout: '' });
    if (args.includes('-filters')) {
      return Promise.resolve({ stdout: ' ..F. volume A->A ...\n ..F. fps     V->V ...\n' });
    }
    if (args.includes('-formats')) return Promise.resolve({ stdout: 'DE lavfi ...\n' });
    return Promise.resolve({ stdout: '' });
  }
  await assert.rejects(
    burn('in.mp4', 'C:\\s.srt', 'out.mp4', {}, { execFile: fakeExecFile }),
    (error) => error.kind === 'capability_gap' && typeof error.recipe === 'string'
  );
});

test('hasTool returns false when the binary probe fails', async () => {
  const ctx = { env: {}, execFile: async () => { throw new Error('missing'); } };
  assert.equal(await hasTool('ffmpeg', ctx), false);
});