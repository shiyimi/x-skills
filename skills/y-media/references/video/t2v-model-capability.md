# t2v 模型能力边界 · Model Capability Constraints

> 本文件记录 t2v(text-to-video)模型的**已知能力限制**,以及这些限制如何改变 prompt 的写法。写 prompt 前必读,否则精心设计的参数会被模型直接忽略。
>
> 核心结论:**分镜表用数字(展示层),prompt 用语义化(执行层),音频移出 prompt(仅对不支持音频的 Provider,见 M6 边界)。**

---

## 1. 六大模型能力缺陷(M1-M6)

### M1 镜头塌缩(最严重 ★★★★★)

**症状**: 单段内写 6 个 Shot,模型只生成 1-2 个景别,中间全塌缩。

**根因**: t2v 模型的"注意力窗口"有限,长段内处理不了多次景别切换。镜头越多,每镜分到的生成预算越少,信息熵过高,模型选择"最安全的 1-2 个景别"覆盖全程。

**修复**:

| 时长 | 最大镜头数 | 单镜最短时长 |
| --- | --- | --- |
| ≤ 5s | 1-2 镜 | ≥ 2.5s |
| 5-10s | 2-3 镜 | ≥ 3s |
| 10-15s(常用规划刻度) | 3-4 镜 | ≥ 4s |
| 15s - `capability_limits[<capability>].maxSingleSegmentDuration`(动态封顶) | 3 镜 | ≥ 4s |
| > `capability_limits[<capability>].maxSingleSegmentDuration` | 拆分为多段;**生成前先问用户** split-or-merge(见 [storyboard-methodology.md](storyboard-methodology.md) §7.1) | 每段独立 |

**铁律**: 单段 ≤3 镜,单镜 ≥4s,每个时间段用时间锚点标注。规划时首选 15s 留安全裕量到 Provider 实际封顶(由 `capability_limits` 读取,见 §5)。

### M2 元素都在但不同时在(★★★★★)

**症状**: prompt 里写了主体、蝴蝶、花海、逆光,但画面里蝴蝶和花海从不同时出现。

**根因**: 信息熵过高。模型能理解每个元素,但无法在单帧内同时渲染过多独立元素。

**修复**: 每个时间段聚焦 **1 个主体动作 + 1 个关键环境元素 + 1 个光影方向**,删除非核心装饰元素。

### M3 动作与摄影参数混写导致僵硬(★★★★)

**症状**: 小马动作僵硬、像 3D 模型平移,不是活物。

**根因**: 情绪动作(欢快嘶鸣)与摄影参数(4500K 光比 3:1)写在一起,模型把精力分给参数解读,动作生成预算被压缩。

**修复**:
1. 动作段只写动作 + micro-action(耳朵抖动、眨眼、呼吸、尾巴轻扬)
2. 摄影参数语义化降级到光影段(见 §2)
3. 约束焊死在末尾(防变形)

### M4 数字技术参数被忽略(★★★★)

**症状**: 写了 `4500K·光比3:1·95BPM·-18dB`,模型生成的画面跟没写一样。

**根因**: t2v 模型的训练语料里,色温K值/dB/BPM/光比数字极少,模型不理解这些数字的语义,直接当噪声忽略。

**修复**: 数字参数在 prompt 中用语义化替代(见 §2 展示层→执行层对照表)。

### M5 开场没冲击力(★★★)

**症状**: 前 3 秒画面平淡,观众划走,完播率低。

**根因**: 开场写"远景建立环境",没有即时视觉钩子。

**修复**: 开场必须有视觉钩子——运动(主体入画/运镜推入)或光影(逆光剪影/体积光)。参考 [prompt-structure-formula.md](prompt-structure-formula.md) 钩子类型。

### M6 音频策略无效(★★★)

**症状**: prompt 里写了 BGM 节奏、环境音拟声词、dB 值,生成的视频没有任何对应音频。

**根因**: 当前已注册的 Provider(Agnes video v2.0)不生成分时音频,BPM/dB/拟声词对画面生成无效。**边界**:该限制只对不支持音频的模型成立——Seedance 1.5 Pro/2.5、Wan3.0 等新模型已支持音画同出(方言/音效/对白),未来接入此类 Provider 时须重新评估音频策略,不能套用本节"音频移出 prompt"的普适写法。

**修复**: 音频信息从 prompt 中移出,放到 `Notes for downstream audio` 段,供后期音频制作参考。(若 Provider 支持音画同出,音频可写回 prompt,并按 Provider 参考文档的音频参数传递)

---

## 2. 展示层 vs 执行层对照表

分镜表(展示层)记录人可理解的具体数字;prompt(执行层)用 t2v 模型能理解的语义化描述。**两层不可混用**——混用 = 数字变噪声(M4)。

| 字段 | 展示层(分镜表,人读) | 执行层(prompt,模型读) |
| --- | --- | --- |
| 色温 | 4500K | `soft golden morning backlight` / `cool blue hour diffused light` |
| 光比 | 3:1 | (删除,模型不理解数字光比)用光源方向替代: `rim/backlight with soft sky fill` |
| 光质 | 柔光 / 硬光 | `soft diffused light` / `hard direct light` |
| 光位 | 45°侧光 / 150°逆光 | `side light from the left` / `backlight from behind` |
| 饱和度 | 饱和度+10 | (删除)用风格标签替代: `vibrant colors` / `muted tones` |
| 音量 | -18dB | (移出 prompt,进 Notes for downstream audio) |
| BPM | 95BPM | (移出 prompt,进 Notes for downstream audio) |
| 音效拟声 | 嗒嗒/唰/噗噗 | (移出 prompt,进 Notes for downstream audio) |
| 主体月龄 | 约6个月大 | `a 6-month-old ... foal`(保留,模型理解年龄描述) |
| 焦段 | 16mm-85mm | (作为风格参考保留: `shot on ARRI Alexa with shallow depth of field`) |
| 运镜速度 | 0.3m/s | (删除)用运镜方向替代: `slow dolly-in` / `fast tracking` |
| 帧数 | 361(8n+1) | (不写进 prompt,提交时进 API 参数) |

### 降级规则

1. **K 值 → 光源描述**: 4500K → `soft golden morning light`; 6500K → `cool overcast daylight`; 3200K → `warm golden hour glow`
2. **光比 → 光源方向**: 光比大 → 强调单一主光源方向;光比小 → `soft diffused fill from all directions`
3. **dB/BPM → 移出**: 全部移到 `Notes for downstream audio`,不进 prompt
4. **拟声词 → 移出**: 同上
5. **速度数值 → 慢/快描述**: 0.3m/s → `slow`; 1.2m/s → `moderate`; 2.0m/s → `fast`
6. **焦段 → 摄影机/风格标签**: `shot on ARRI Alexa` / `shot on 16mm Bolex` / `shot on iPhone`

---

## 3. 时间表达方式(与镜头数协同)

| 方式 | 强度 | 写法 | 适用 |
| --- | --- | --- | --- |
| 精确时间锚点 | 最强 | `0.0-5.0s: ...` / `5.0-11.0s: ...` | 10-18s,3-4镜 |
| 画面编号 | 中等 | `Scene 1: ...` / `Scene 2: ...` | 5-10s,2-3镜 |
| 动作流连接词 | 弱/自然 | `then` / `suddenly` / `as` | ≤5s,1-2镜 |

### 协同规则

| 时长 | 推荐镜数 | 时间表达 |
| --- | --- | --- |
| ≤ 5s | 1-2 镜 | 动作流连接词 |
| 5-10s | 2-3 镜 | 画面编号 |
| 10-15s(常用规划刻度) | 3-4 镜 | 精确时间锚点 |
| 15s - `capability_limits[<capability>].maxSingleSegmentDuration`(动态封顶) | 3 镜 | 精确时间锚点 |
| > `capability_limits[<capability>].maxSingleSegmentDuration` | 拆分多段;**生成前问用户 split-or-merge**(见 [storyboard-methodology.md](storyboard-methodology.md) §7.1) | 各段独立 |

---

## 4. 竖屏特有约束

竖屏 9:16 与横屏 16:9 的模型行为不同:

| 约束 | 原因 | 修复 |
| --- | --- | --- |
| 避极远景 + 远山 | 竖屏纵向压缩,远景信息密度不够 | 改中远景起步,远景只用于收尾 |
| 主体必须居中或三分线下 | 竖屏横向空间少,偏移=出画 | 显式写 `subject centered` / `subject on lower-third line` |
| 前景虚焦必写 | 竖屏无前景=扁平 | 每段写 `with foreground blurred [具体物体]` |
| 运镜少用大范围横摇 | 竖屏横向窄,大范围 pan 画面空洞 | 用 dolly-in/out 替代 |

---

## 5. Agnes video v2.0 关键参数(真相源 = `capability_limits`)

下表的数值仅作 **当前快照**,**权威值**来自 `listCapabilities` 输出中的 `providers[].capability_limits[capability]` 字段(注册在 [providers/manifest.cjs](../../providers/manifest.cjs) 的 `capability_limits` 段)。**禁止把表里的数字硬编码到 prompt / storyboard / 决策树中**。

| 项 | 值(快照) | 权威源 |
| --- | --- | --- |
| Provider | agnes(y-media 已注册) | manifest `id` |
| Model | agnes-video-v2.0 | `supports()` 校验,不进 manifest |
| 默认画幅 | 1152×768(横屏) / 竖屏建议 720×1280 | `supports()` 默认值 |
| 默认帧数/帧率 | 121 / 24fps | `capability_limits[<capability>].maxFrames` / `defaultFrameRate` |
| 帧数硬上限 | 441(8n+1) | `capability_limits[<capability>].maxFrames` + `frameCountRule` |
| 单段硬上限 | ~18s | `capability_limits[<capability>].maxSingleSegmentDuration` |
| 帧率范围 | 1-60 fps | `capability_limits[<capability>].minFrameRate` / `maxFrameRate` |
| 常用规划刻度 | 15s(留 3.4s 安全裕量到 18s 硬上限) | 派生:封顶 - 10% |
| 15s 帧数 | 361(=8×45+1) | 派生:(秒数 × fps − 1) 满足 8n+1 |
| 18s 帧数(封顶档) | 433(=8×54+1,接近 441 硬上限) | 派生:同上 |
| 多段接续能力 | keyframes-to-video:首帧=前段末帧,Provider 内部接续 | `capability_limits['keyframes-to-video']` |
| 拆分前行为 | 见 [storyboard-methodology.md](storyboard-methodology.md) §7.1:生成前先问用户 split-or-merge | — |
| 输入形态 | text-to-video / image-to-video / keyframes-to-video | `capability_limits[*].requiresImageInput(s)` |
| 关键限制 | 本地路径/Data URI 不支持,必须公网 HTTPS URL | `supports()` |

### 5.1 读取 `capability_limits` 的方式

通过 `listCapabilities` 获取,输出形如:

```json
{
  "ok": true,
  "providers": [
    {
      "id": "agnes",
      "enabled": true,
      "priority": 100,
      "capabilities": ["text-to-video", "image-to-video", "keyframes-to-video"],
      "capability_limits": {
        "text-to-video": {
          "maxSingleSegmentDuration": 18,
          "maxFrames": 441,
          "defaultFrameRate": 24,
          "minFrameRate": 1,
          "maxFrameRate": 60,
          "supportedAspectRatios": ["16:9", "9:16", "1:1"],
          "frameCountRule": "8n+1"
        }
      }
    }
  ]
}
```

### 5.2 未来 Provider 的注册样板(Seedance 2.5 / Wan3.0 / Sora 1.0 / Veo 2.0)

| Provider | maxSingleSegmentDuration | maxFrames | frameCountRule |
| --- | --- | --- | --- |
| Agnes video v2.0(已注册) | 18s | 441 | 8n+1 |
| Seedance 2.5(强 i2v,音画同出) | 30s | 721(推算) | 8n+1(推算) |
| Wan3.0(多模态参考,4K 直出) | 30s | 721(推算) | 8n+1(推算) |
| Sora 1.0(长段支持好) | 20s | 481 | 8n+1 |
| Veo 2.0(短段细节好) | 8s | 193 | 8n+1 |

这些数**不写进文档**,只作为新 Provider 注册到 `manifest.cjs` 的 `capability_limits` 时的参考值。标注"(推算)"的值(Seedance 2.5 / Wan3.0)基于公开能力信息估算,注册前须以官方 API 文档核实。

---

## 6. 自检清单(提交 prompt 前)

- [ ] **M1 防塌缩**: 单段 ≤3 镜,单镜 ≥4s?(默认规划 15s,封顶取自 `capability_limits[<capability>].maxSingleSegmentDuration`)
- [ ] **M2 防信息过载**: 每段 1 主体动作 + 1 环境元素 + 1 光影方向?
- [ ] **M3 防僵硬**: 动作段含 micro-action(耳朵/眼睛/尾巴/呼吸)?
- [ ] **M4 防数字噪声**: prompt 中无 K/dB/BPM/光比数字?
- [ ] **M5 防平淡开场**: 前 3s 有视觉钩子?
- [ ] **M6 防音频无效**(对不支持音频的 Provider,如已注册的 Agnes): prompt 中无 BGM/音效/dB/BPM 描述?若 Provider 支持音画同出,音频可回写 prompt
- [ ] **展示层 vs 执行层**: 分镜表用数字,prompt 用语义化?
- [ ] **音频分离**: 音频信息在 `Notes for downstream audio` 段?
- [ ] **多段 split-or-merge**: `target_duration > capability_limits[<capability>].maxSingleSegmentDuration` 时,**生成前已问用户** ① 分开 / ② 合并+菜谱?(不能默默拆)
- [ ] **约束焊死**: 末尾有 `stable frame / no flicker / natural anatomy / no mutation / no text`?
