# Media Rules · 模型能力 + Provider 参数 + 提交前自检

> 本文件是 **5 步流程的"评审过审"过门**的主文档。负责定义模型能力边界(M1-M6)、Provider 关键参数、提交前的模型/格式自检。
>
> **核心结论**: **分镜表用数字(展示层),prompt 用语义化(执行层),音频移出 prompt(对不支持音频的 Provider)**。
>
> **不负责**: 角色四层([character.md](character.md))、场景三层/降级/竖屏([scene.md](scene.md))、骨架与镜头结构([storyboard.md](storyboard.md))、写作执行与拼接([prompt-craft.md](prompt-craft.md))。
>
> **配套**: 14 镜头库、避坑三陷阱、5 铁律见 [prompt-craft.md §3 §4 §5](prompt-craft.md);展示层/执行层降级见 [scene.md §2](scene.md);竖屏约束见 [scene.md §4](scene.md)。

---

## §1 六大模型能力缺陷(M1-M6)

### M1 镜头结构不清(★★★★★)

**症状**: prompt 中写了多个 Shot,但生成结果只稳定呈现其中 1-2 个景别,或中间转场和主体动作丢失。

**根因**: t2v 模型对多主体、多动作、多景别切换的注意力分配有限。镜头边界、主体动作或转场表达不清时,模型会选择最稳定的少数画面覆盖全程。

**修复**:
- 镜头边界用时间锚点、画面编号或动作流连接词明确每段的主体、动作、转场
- **默认每个镜号一个时间锚点(1:1 对应 [storyboard.md §5 表格](storyboard.md))**,不主动合并相邻镜头
- 总时长超过 `capability_limits[<capability>].maxSingleSegmentDuration` 时拆分多段;**生成前先问用户** split-or-merge

### M2 元素都在但不同时在(★★★★★)

**症状**: prompt 里写了主体、蝴蝶、花海、逆光,但画面里蝴蝶和花海从不同时出现。

**根因**: 信息熵过高。模型能理解每个元素,但无法在单帧内同时渲染过多独立元素。

**修复**: 每个时间段聚焦 **1 个主体动作 + 1 个关键环境元素 + 1 个光影方向**,删除非核心装饰元素。

### M3 动作与摄影参数混写导致僵硬(★★★★)

**症状**: 小马动作僵硬、像 3D 模型平移,不是活物。

**根因**: 情绪动作(欢快嘶鸣)与摄影参数(4500K 光比 3:1)写在一起,模型把精力分给参数解读,动作生成预算被压缩。

**修复**:
1. 动作段只写动作 + micro-action(耳朵抖动、眨眼、呼吸、尾巴轻扬)
2. 摄影参数语义化降级到光影段(见 [scene.md §2](scene.md))
3. 约束焊死在末尾(防变形)

### M4 数字技术参数被忽略(★★★★)

**症状**: 写了 `4500K·光比3:1·95BPM·-18dB`,模型生成的画面跟没写一样。

**根因**: t2v 模型的训练语料里,色温K值/dB/BPM/光比数字极少,模型不理解这些数字的语义,直接当噪声忽略。

**修复**: 数字参数在 prompt 中用语义化替代(见 [scene.md §2 降级表](scene.md))。

### M5 开场没冲击力(★★★)

**症状**: 前 3 秒画面平淡,观众划走,完播率低。

**根因**: 开场写"远景建立环境",没有即时视觉钩子。

**修复**: 开场必须有视觉钩子——运动(主体入画/运镜推入)或光影(逆光剪影/体积光)。参考 [prompt-craft.md §6 钩子类型](prompt-craft.md)。

### M6 音频策略无效(★★★)

**症状**: prompt 里写了 BGM 节奏、环境音拟声词、dB 值,生成的视频没有任何对应音频。

**根因**: 当前已注册的 Provider(Agnes video v2.0)不生成分时音频,BPM/dB/拟声词对画面生成无效。**边界**:该限制只对不支持音频的模型成立——Seedance 1.5 Pro/2.5、Wan3.0 等新模型已支持音画同出(方言/音效/对白),未来接入此类 Provider 时须重新评估音频策略,不能套用本节"音频移出 prompt"的普适写法。

**修复**: 音频信息从 prompt 中移出,放到 `Notes for downstream audio` 段,供后期音频制作参考。(若 Provider 支持音画同出,音频可写回 prompt,并按 Provider 参考文档的音频参数传递)

---

## §2 时间表达方式(按镜头结构选择)

| 方式 | 强度 | 写法 | 适用 |
| --- | --- | --- | --- |
| 精确时间锚点 | 最强 | `0.0-5.0s: ...` / `5.0-11.0s: ...` | 需要明确动作阶段或转场时 |
| 画面编号 | 中等 | `Scene 1: ...` / `Scene 2: ...` | 需要区分多个画面单元时 |
| 动作流连接词 | 弱/自然 | `then` / `suddenly` / `as` | 单一连续动作或短段落 |

### 2.1 选择规则

| 目标 | 推荐写法 |
| --- | --- |
| 清楚表达多个镜头或动作阶段 | 选时间锚点或画面编号,逐段写清主体、动作和转场 |
| 保持连续动作的自然性 | 用动作流连接词,避免无意义地拆成编号 |
| 总时长超过 `capability_limits[<capability>].maxSingleSegmentDuration` | 拆分多段;**生成前问用户 split-or-merge** |

### 2.2 1:1 镜号对应的执行(本节与 [storyboard.md §5.1](storyboard.md) 一致)

- **默认每个镜号一个时间锚点**,不主动合并相邻镜头
- 时间锚点是清晰度工具,也是镜号到时间段的显式映射
- 它**不是**用来"把 6 镜压成 3 段"的压缩工具
- 规划时首选 15s 留安全裕量到 Provider 实际封顶

---

## §3 Agnes video v2.0 关键参数(真相源 = `capability_limits`)

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
| 拆分前行为 | 见 [storyboard.md §5.2](storyboard.md):生成前先问用户 split-or-merge | — |
| 输入形态 | text-to-video / image-to-video / keyframes-to-video | `capability_limits[*].requiresImageInput(s)` |
| 关键限制 | 本地路径/Data URI 不支持,必须公网 HTTPS URL | `supports()` |

### 3.1 读取 `capability_limits` 的方式

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
          "supportedAspectRatios": ["16:9", "9:16", "1:1", "destination4:3", "3:4"],
          "frameCountRule": "8n+1"
        }
      }
    }
  ]
}
```

### 3.2 未来 Provider 的注册样板(Seedance 2.5 / Wan3.0 / Sora 1.0 / Veo 2.0)

| Provider | maxSingleSegmentDuration | maxFrames | frameCountRule |
| --- | --- | --- | --- |
| Agnes video v2.0(已注册) | 18s | 441 | 8n+1 |
| Seedance 2.5(强 i2v,音画同出) | 30s | 721(推算) | 8n+1(推算) |
| Wan3.0(多模态参考,4K 直出) | 30s | 721(推算) | 8n+1(推算) |
| Sora 1.0(长段支持好) | 20s | 481 | 8n+1 |
| Veo 2.0(短段细节好) | 8s | 193 | 8n+1 |

这些数**不写进文档**,只作为新 Provider 注册到 `manifest.cjs` 的 `capability_limits` 时的参考值。标注"(推算)"的值(Seedance 2.5 / Wan3.0)基于公开能力信息估算,注册前须以官方 API 文档核实。

---

## §4 提交前自检清单(过审过门)

> 本节是 5 步流程的"评审过审"过门——**只检模型/格式/规则,不复看创意**。创意内容的一致性(事件逻辑/人物-事件/场景内部)已分别在 [storyboard.md §5.6](storyboard.md) / [character.md §4](character.md) / [scene.md §6](scene.md) 自检完毕。

逐条回答,任一为否就回头改:

### 4.1 模型能力维度(M1-M6)

- [ ] **M1 镜头结构清晰度**: prompt 中的镜头边界、主体动作与转场是否清楚?
- [ ] **M2 防信息过载**: 每段 1 主体动作 + 1 环境元素 + 1 光影方向?
- [ ] **M3 防僵硬**: 动作段含 micro-action(耳朵/眼睛/尾巴/呼吸)?
- [ ] **M4 防数字噪声**: prompt 中无 K/dB/BPM/光比数字?(降级见 [scene.md §2](scene.md))
- [ ] **M5 防平淡开场**: 前 3s 有视觉钩子?
- [ ] **M6 防音频无效**: prompt 中无 BGM/音效/dB/BPM 描述?若 Provider 支持音画同出,音频可回写 prompt

### 4.2 写作维度(规则层)

- [ ] **1:1 镜号对应**: Action 段镜号数 = Camera 段镜号数 = 分镜表格镜号数?见 [prompt-craft.md §8](prompt-craft.md)
- [ ] **时间锚点一致**: Action 段和 Camera 段时间锚点完全一致?
- [ ] **无合并相邻镜**: 除非显式标 `MERGED` 并满足 [storyboard.md §5.2](storyboard.md) 三项合并条件
- [ ] **镜号升序连续**: 中间不跳号
- [ ] **音/字幕不进 prompt**: 音频/字幕相关 token 没有进入 prompt 正文(进 `Notes for downstream audio` / 侧车 Inputs 或 Notes)
- [ ] **约束焊死**: 末尾有 `stable frame / no flicker / natural anatomy / no mutation / no text`?
- [ ] **物理逻辑**: 无矛盾指令(光位/景别/速度)?见 [prompt-craft.md §4.1](prompt-craft.md)
- [ ] **光影**: 已写 soft directional / volumetric,非空?见 [prompt-craft.md §4.3](prompt-craft.md)
- [ ] **运镜**: ≤2 组合,连接词分开,治愈系无手持?见 [prompt-craft.md §3.5](prompt-craft.md)
- [ ] **风格锚**: 每段 1 个明确风格标签?见 [scene.md §5](scene.md)

### 4.3 格式与提交维度

- [ ] **R5 零错字**: 全文无错别字,品牌名/产品型号/成分名逐字核对
- [ ] **侧车结构**: `<name>.video-brief.md` 按 SKILL.md §3.1 顺序填,Final Prompt 在最后
- [ ] **Negative Prompt**: 档位判断 + 与 Hard Constraints 去重 + 五类覆盖?(见 [prompt-craft.md §10](prompt-craft.md))
- [ ] **空区块处理**: "可选"档未填时,区块下写 `—` 占位,而不是删区块
- [ ] **侧车完整**: 8 列(规划层)+ 11 列(分镜表)+ 八要素(Final Prompt)都齐全

### 4.4 Provider 维度(只检数值,不检创意)

- [ ] **target_duration ≤ maxSingleSegmentDuration**: 总时长不超过 Provider 封顶?
- [ ] **frames ≤ maxFrames 且满足 frameCountRule**: 帧数合规?
- [ ] **多段接续**: 多段时 keyframes-to-video 已配置首/末帧?
- [ ] **画幅合规**: supportedAspectRatios 包含所选比例?
- [ ] **HTTPS URL**: 输入为公网 HTTPS,无本地路径/Data URI?
- [ ] **split-or-merge 已问**: 若超出封顶,生成前已用 AskUserQuestion 问过用户

---

## §5 跨文件导航

| 想了解什么 | 去哪 |
| --- | --- |
| 角色怎么写(身份/外貌/服装/气质) | [character.md](character.md) |
| 场景三层 / 降级 / 竖屏 / 风格锚 | [scene.md](scene.md) |
| 14 镜头库 / 避坑三陷阱 / 5 铁律 / 钩子 / 八要素 / 拼接模板 / 分镜列映射 / Negative Prompt 方法论 | [prompt-craft.md](prompt-craft.md) |
| 骨架(A/B/C) / 镜头结构 / 1:1 镜号对应 / 事件逻辑反例库 | [storyboard.md](storyboard.md) |
| 音频三层(人声/环境音/BGM) / 情绪杠杆 / 静音法则 | [audio-design.md](audio-design.md) |
| 字幕用不用 / 6 类字幕 / 风格 / 动效 / 文案原则 | [subtitle-spec.md](subtitle-spec.md) |
| 完整 4 步流程的实例 | [example.md](example.md) |
