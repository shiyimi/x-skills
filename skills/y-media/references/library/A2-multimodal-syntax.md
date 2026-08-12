# A2. multimodal-syntax · 多模态参考语法(按需辅助)

> **定位**:y-media 的**多模态引用语法规范** —— 当 brief 提供了图片/视频/音频参考素材时,如何在 prompt 中引用,确保模型/后期工程师一致理解。

---

## §0 多模态引用基础语法

### 0.1 占位符规范

| 占位符 | 含义 | 适用场景 |
| --- | --- | --- |
| `<image 1>` / `<image 2>` ... | 第 N 张参考图片 | i2v、风格参考、主体外观锁定 |
| `<video 1>` / `<video 2>` ... | 第 N 段参考视频 | 视频续写、动作风格、运镜风格 |
| `<audio 1>` / `<audio 2>` ... | 第 N 段参考音频 | BGM 风格对位、参考音色调性 |
| `<reference set>` | 整套参考素材(目录) | 跨多文件引用 |

**位置编号规则**:
- 编号按 Inputs 字段中的**出现顺序**分配,**不**按时间顺序
- 编号在 prompt 内全局一致(同一次提交中)
- 同一占位符可在 prompt 不同段重复出现(主体在多镜出现时,首镜 `<image 1>` 锁定,后续镜沿用)

### 0.2 prompt 中的语义化引用

虽然当前 Provider 不解析占位符,但**prompt 中应写"参考 X"的语义化指引**,让模型从自然语言理解意图:

| 占位符 | prompt 中的语义化写法 |
| --- | --- |
| `<image 1>` | `reference image 1 (attached)` / `based on the attached reference image` |
| `<video 1>` | `reference video 1 (attached)` / `matching the style of the attached reference video` |
| `<audio 1>` | `BGM in the style of audio reference 1` |

---

## §1 侧车 Inputs 字段格式(`core/orchestrator.cjs` 解析)

```yaml
# 视频 brief 的侧车 Inputs
inputs:
  references:
    - id: 1
      type: image  # image / video / audio
      path: ./references/product-01.jpg
      role: main_subject  # main_subject / style_anchor / background / audio_bgm
      description: "美妆精华液瓶身,极简白底,品牌主色金色"
    - id: 2
      type: image
      path: ./references/texture-01.jpg
      role: style_anchor
      description: "质地参考,微距滴落瞬间"
    - id: 3
      type: audio
      path: ./references/bgm-reference.mp3
      role: audio_bgm
      description: "BPM 95 木吉他+钟琴,清新民谣,无歌词"
```

**字段说明**:
- `id`:必须与 prompt 中的占位符编号一致
- `type`:image / video / audio
- `role`:
  - `main_subject`:主体外观锁定(i2v 起点 / 角色一致性)
  - `style_anchor`:风格锚(摄影机/调色/构图)
  - `background`:背景参考
  - `audio_bgm`:BGM 风格对位
- `description`:自然语言描述,供 orchestrator 与模型理解

---

## §2 i2v(图生视频)语法

### 2.1 何时用 i2v

- brief 提供了**起始帧图片**(产品图 / 服装图 / 海报 / 静物图)
- 需要**保持主体外观 100% 还原**(产品不能"换形"、服装不能"换花色")
- 需要**静图动态化**(让产品转起来 / 让人物动起来)

详见 [media-rules.md M5](M9-media-rules.md) 关于 i2v 的模型能力限制。

### 2.2 i2v 在 prompt 中的写法

**主写法**(图片在 Inputs 字段 + 语义化指引):
```text
[image 1] (attached as the starting frame): [自然语言描述图片]

★ Main subject (match image 1 — same product appearance, same color, same label, no mutation):
[角色四层描述 / 产品四元素]

★ Action (animate from the static image 1):
- 0.0-2.5s (S01-01): [起始动作 + 缓动 + micro-action]
- ...
```

**变体写法**(图片作为风格锚,主体仍由 prompt 文字描述):
```text
[Visual style] In the style of image 1 (cinematic, soft morning light), but with the following subject:

★ Main subject: [...]
```

### 2.3 i2v 的禁止项

- ❌ 让模型"创造"图里没有的元素(改色 / 换形 / 加 logo)
- ❌ 起始帧人脸占画面 < 30%(后续帧人脸会模糊)
- ❌ 起始帧人脸背对镜头 / 模糊(无法作为 i2v 起点)
- ❌ 多张起始图(只能 1 张,除非显式指定"切换")

---

## §3 主体一致性(角色四层 + 跨镜保持)

### 3.1 同一 brief 内的多镜一致性

**核心规则**:每个镜号都用相同的角色四层描述(首镜写完整,后续镜只锁关键特征)。

**写法**(见 [M3-character.md](M3-character.md) 完整规范):
```text
★ Main subject (keep consistent in EVERY frame):
A 25-year-old East Asian woman with shoulder-length black hair, brown eyes, wearing a cream-colored linen dress, gentle expression.

(S01-01): same woman, walking from left to right
(S01-02): same woman, sitting at a wooden table
(S01-03): same woman, close-up of hands holding a coffee cup
...
```

### 3.2 跨 brief 的一致性(品牌/角色复用)

**写法**:用 `<image 1>` 引用前次 brief 的主体图:
```text
[image 1] (reference to a previous character): [自然语言描述]

★ Main subject: Same character as image 1, now wearing [新服装], in [新场景], [新动作].
```

**Inputs 字段示例**:
```yaml
inputs:
  references:
    - id: 1
      type: image
      path: ./character-library/brand-spokesperson-01.jpg
      role: main_subject
      description: "品牌代言人,25 岁东亚女性,黑色短发,米白棉麻裙"
```

---

## §4 风格参考(图/视频为风格锚)

### 4.1 何时用风格参考

- brief 提供了**风格参考图**(海报 / 调色板 / 摄影机风格)
- brief 说"像 [X 品牌] 的感觉"(品牌对位)
- brief 提供了**参考视频**(运镜 / 节奏 / 整体氛围)

### 4.2 风格参考在 prompt 中的写法

**图片风格锚**:
```text
★ Style anchor: In the visual style of image 1 (high fashion magazine, dramatic studio lighting), but with the following subject and scene:

[subject + scene descriptions]
```

**视频风格锚**:
```text
★ Style anchor: Match the cinematic mood of video 1 (slow-motion, golden hour, lateral tracking), but with the following subject and scene:

[subject + scene descriptions]
```

**完整套用**(可直接整段搬):
```text
[image 1] (visual style reference): [简述风格]
[subject]: [主体四层]
[scene]: [场景三层 + 光线]
[style]: [image 1 风格 + director-presets 预设编号,如 "P7 magazine editorial"]
```

### 4.3 与 director-presets.md 的搭配

风格参考 + 风格预设可组合使用,但**整段只能 1 个主风格**:

| 风格参考类型 | 推荐 director-presets |
| --- | --- |
| 杂志大片图 | P7 杂志 |
| 风景摄影图 | P5 BBC Earth |
| 商业产品图 | P8 广告商业 |
| 都市夜景图 | P3 赛博朋克 |
| 古风水墨图 | P4 古风武侠 |

详见 [director-presets.md §9.2](M2-director-presets.md)。

---

## §5 视频续写(Video Extension)

### 5.1 何时用视频续写

- brief 提供了一段**已生成的视频素材**,需要**向前或向后**延展
- 续写可保持**运镜 / 光影 / 主体外观**与原视频一致

### 5.2 续写在 prompt 中的写法

**向后延展**(从原视频末尾接续):
```text
[video 1] (continuing from the end of the attached video, same subject, same lighting, same camera style):

★ Action (continuing seamlessly from video 1's last frame):
- 0.0-Xs (S01-01): [续写动作 1 + 与 video 1 末帧衔接]
- ...
```

**向前延展**(补全原视频之前的内容):
```text
[video 1] (extending backward before the start of the attached video, maintaining consistency):

★ Action (leading seamlessly into video 1's first frame):
- 0.0-Xs (S01-01): [前置动作 1 + 与 video 1 首帧衔接]
- ...
```

### 5.3 续写禁止项

- ❌ 续写时长 > 原视频时长(超过 2x = 主体漂移高风险)
- ❌ 续写时切换主体 / 场景 / 光影(续写 = 100% 一致)
- ❌ 续写时切换摄影机(如原视频是 dolly in,续写不能变 dolly out)

---

## §6 音频参考(BGM 风格对位)

### 6.1 何时用音频参考

- brief 提供了**参考 BGM**(用户已选好曲子,需要"这种风格但无版权" / 1:1 还原)
- brief 提供了**参考音效库**(品牌方有专属音效)
- brief 说"配乐要像 [X]"(品牌对位)

### 6.2 音频参考在 prompt 中的写法

**BGM 风格对位**(无版权生产):
```text
★ Audio:
- BGM: In the style of audio reference 1 (soft piano + cello + glockenspiel, slow emotional arc), but [避免版权 / 重新创作].
```

**音色参考**(对位调性):
```text
★ Audio:
- Ambient sound: In the sonic palette of audio reference 1 (warm, intimate, low-frequency focused), but matching the visual scene.
```

**Inputs 字段示例**:
```yaml
inputs:
  references:
    - id: 1
      type: audio
      path: ./references/bgm-style-reference.mp3
      role: audio_bgm
      description: "BPM 70 钢琴+大提琴+钟琴,慢情绪弧线,无歌词;参考 X 品牌的广告配乐风格"
```

### 6.3 音频参考禁止项

- ❌ 直接复制参考 BGM 旋律(版权风险)
- ❌ 引用有版权的曲子名称(《Faded》/《千本桜》等)做对位(模型可能输出侵权内容)
- ❌ 强行 1:1 还原参考 BGM(模型对"复刻"的执行不一致)

详见 [audio.md §1.4](M6-audio.md) 的 4 字段规范与 [media-rules.md M1-M3](M9-media-rules.md) 的音频限制。

---

## §7 多模态组合(同一 brief 多种参考)

### 7.1 组合类型

| 组合 | 用法 | 典型场景 |
| --- | --- | --- |
| 图片 + 音频 | i2v 起点 + BGM 风格对位 | 商业带货(产品图 + 鼓点) |
| 视频 + 图片 | 续写 + 风格锚 | 品牌延续 + 风格统一 |
| 多张图片 | 多角度主体 + 风格锚 | 杂志大片 + 跨场景品牌 |

### 7.2 编号顺序规则

```yaml
inputs:
  references:
    - id: 1  # 主图(主体外观)
      type: image
      role: main_subject
    - id: 2  # 风格图
      type: image
      role: style_anchor
    - id: 3  # 背景图
      type: image
      role: background
    - id: 4  # BGM 参考
      type: audio
      role: audio_bgm
```

**编号顺序**:`main_subject` → `style_anchor` → `background` → `audio_bgm` → 其他。

### 7.3 prompt 中组合引用的写法

```text
[image 1] (attached, main subject): [主体描述]
[image 2] (attached, style anchor): [风格描述]
[image 3] (attached, background reference): [背景描述]
[audio 1] (attached, BGM reference): [BGM 风格描述]

★ Main subject (match image 1, locked across all frames):
[主体四层]

★ Style anchor: Combine the cinematic style of image 2 with the warm palette of image 3.

★ Audio:
- BGM: In the style of audio 1.
```

---

## §8 提交前自检

- [ ] 占位符编号在 Inputs 与 prompt 中**完全一致**
- [ ] 占位符按"main_subject → style_anchor → background → audio_bgm"顺序编号
- [ ] i2v 路线首镜有 `<image 1>` 起点(且图片在 Inputs 字段)
- [ ] 视频续写显式标 `continuing from` / `extending before` + 原视频 `id`
- [ ] 风格参考 + director-presets 整段只有 1 个主风格
- [ ] 音频参考无版权曲子名称(避免侵权)
- [ ] 多模态组合时 prompt 中每个占位符都有清晰的语义化引用句
- [ ] 侧车 Inputs 字段格式正确(`core/orchestrator.cjs` 可解析)
