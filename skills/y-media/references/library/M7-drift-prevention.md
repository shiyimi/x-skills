> **[AUXILIARY]**:本文件仅在 recipe 头部声明时加载。大多数简单场景不需要读本文件。

# M7. drift-prevention · 分镜漂移预防(检查)

> **定位**:y-media 的**防漂移策略库**。把分散的防漂移方案集中,补齐 5 招实战技巧 + Provider 选择 + 自检清单。

---

## §0 漂移类型分类(诊断)

AI 视频生成的漂移有 4 大类型,先识别是哪类才能对症下药。

| # | 漂移类型 | 症状 | 根因 | 高发场景 |
| --- | --- | --- | --- | --- |
| **D1** | **主体漂移** | 同一人物/动物/产品在不同镜号里换脸、换色、换装、变形 | 模型对"主体"的理解随时间衰减;长段 > 5s 易漂 | 多镜人像/动物/产品,长段(>5s)单段 |
| **D2** | **场景漂移** | 同一空间突然换了家具、地板、墙面、装饰 | 模型对"环境细节"的描述理解有随机性 | 室内场景(咖啡厅/卧室/办公室) |
| **D3** | **镜头漂移** | 同一运镜在不同镜号里方向反了/速度变了/景别跳了 | 运镜描述用词不统一(如 "push in" vs "dolly in") | 多镜连续动作(转场/接力) |
| **D4** | **时间漂移** | 同一时间锚点里光线突然从晨光变到黄昏,或天气突变 | 单光源/单时间锚点未焊死,模型自由发挥 | 多镜外景(15s 跨长时间) |

---

## §1 漂移根因(5 个底层原因)

理解根因才能选对策略。

| # | 根因 | 解释 | 对应策略 |
| --- | --- | --- | --- |
| **R1** | **模型的"短时记忆"有限** | t2v 模型对 prompt 的注意力随时间衰减,5-7s 后开始"自由发挥" | 短段原则(≤15s) + 段间桥接 |
| **R2** | **同一概念的不同表述** | 同一主体用不同词描述(如"girl" / "young woman" / "she")会让模型认为"是新主体" | 同关键词复述 |
| **R3** | **缺少视觉锚点** | 文字描述不能 100% 还原外观,模型只能用统计"最近似" | i2v 参考图锚定 |
| **R4** | **生成后剪辑拼接** | 多段独立生成再拼接,每段都重新"理解"主体,漂移叠加 | 一段定路径(优先 G 纯生成) |
| **R5** | **Provider 能力差异** | 不同模型对"一致性"的执行差异大(Seedance/Wan 强,通用模型弱) | Provider 选择 + 提交前自检 |

---

## §2 5 招防漂移(实战)

### 2.1 招 1 · 关键特征锁(Key Feature Lock)

**核心思路**:在 prompt 中**只锁 2-3 个不可变特征**,其他细节允许模型自由发挥。比"全特征锁定"更鲁棒(全锁 = 模型无发挥空间,易导致"僵硬感")。

**选 2-3 个不可变特征**(每个视频都重新选,选**视觉对比强 + 容易记忆**的):

| 类型 | 推荐特征 | 写法 |
| --- | --- | --- |
| **人物** | 1 个服装特征 + 1 个发色/发型 + 1 个配件 | `wearing a red scarf, black hair in a low ponytail, pearl earrings` |
| **动物** | 1 个颜色 + 1 个体型 + 1 个显著标记 | `chestnut brown fur, fluffy tail, white blaze on forehead` |
| **产品** | 1 个品牌主色 + 1 个材质 + 1 个 logo 位置 | `matte white ceramic, frosted glass cap, gold "X" logo on the front` |
| **场景** | 1 个主光源 + 1 个空间关系 + 1 个环境细节 | `soft window light from the left, wooden table in foreground, potted plant in the background` |

**写法**(放在 `★ Main subject` 段或 `★ Hard constraints` 段):
```text
★ Hard constraints (welded to end):
— Stable frame, no flicker, natural [物种] anatomy, no mutation, no deformed [主体].
— Same [主体] identity across all frames (no character drift).
— [关键特征 1] (locked: 不可变).
— [关键特征 2] (locked: 不可变).
— [关键特征 3] (locked: 不可变).
— No text, no logo, no watermark, no on-screen caption.
```

**示例**(人物 - 真实可用):
```text
— Same woman identity across all frames (no character drift).
— Red scarf (locked: must appear in every frame, exactly the same shade of red).
— Black hair in low ponytail (locked: same length, same position).
— Pearl earrings (locked: small, round, white).
```

**反例**:
- ❌ 锁 5+ 个特征(模型执行不可靠,容易"丢三落四")
- ❌ 锁模糊特征("好看" / "优雅" — 模型无客观标准)
- ❌ 每镜都重写一遍特征描述(应该焊死在 Hard constraints 段)

---

### 2.2 招 2 · 段间桥接描述(Inter-Segment Bridging)

**核心思路**:**多段拼接**(H 混合路径)时,在每段 prompt 的**末尾**写"下一段第一镜是什么样",让模型生成时"知道后续"。反之亦然。

**结构**(每段 prompt):
```text
★ Action:
- 0.0-Xs (S01-01): [本段第 1 镜].
- ...
- (Xs-1)s-Xs (S01-NN): [本段末镜,详细描述末帧:人物外观/场景/光线/动作末态].

★ Continuity bridge (本段与下一段的衔接):
[下一段第一镜描述:与本段末镜在外观/光线/动作上的衔接]
```

**示例**(2 段拼接,人物+场景):
```text
★ Action (Segment 1):
- 0.0-2.5s (S01-01): [红围巾女性,黑色低马尾,珍珠耳环] walks from left to right.
- 2.5-5.0s (S01-02): same woman stops at a wooden table, looking down.
- 5.0-7.5s (S01-03): same woman, close-up, picks up a coffee cup with her right hand.

★ Continuity bridge (to Segment 2):
Segment 2 starts with: same woman (red scarf, low ponytail, pearl earrings) sitting at the wooden table, holding the coffee cup with her right hand, looking down with a gentle smile. Soft window light from the left unchanged. Warm 4500K tone unchanged.
```

**反例**:
- ❌ 桥接描述过短(只写"continues" — 无视觉信息)
- ❌ 桥接与末镜矛盾(如末镜是"放下杯子",桥接写"端着杯子")
- ❌ 桥接忘了描述关键特征(模型在新一段里"换人")

---

### 2.3 招 3 · 同关键词复述(Keyword Repetition)

**核心思路**:prompt 中描述同一概念时,使用**完全相同的措辞**。AI 模型对"近义词"会认为是不同概念。

**对照表**:

| ❌ 漂移诱因(同义不同词) | ✓ 锁定(用同词) |
| --- | --- |
| "young woman" / "girl" / "she" / "the lady" | `the woman (25 years old, red scarf, low ponytail)` |
| "forest" / "woods" / "trees" / "jungle" | `the misty pine forest (same forest throughout)` |
| "walks" / "moves" / "goes" / "strolls" | `walks slowly (no running)` |
| "soft light" / "gentle light" / "warm light" | `soft golden morning light from the left (single source, 4500K)` |
| "close-up" / "macro" / "tight shot" | `close-up shot (50mm lens, shallow DOF)` |

**写法**:
- prompt 全文 0 个近义词(同概念 1 个固定措辞)
- 关键概念在 `★ Main subject` 首次出现,后续镜只引用,不重写
- 镜头语言用 [M8-prompt-craft.md §3 14 镜头库](M8-prompt-craft.md) 的标准措辞,不用"自创词"

**反例**:
- ❌ 中英混杂("她 walks slowly" — 模型注意力分散)
- ❌ 同概念在每镜重写一遍(浪费 token + 漂移风险)

---

### 2.4 招 4 · Provider 能力选择

**核心思路**:**不同 Provider 对一致性的执行差异大** —— 选错了 Provider,再好的 prompt 也救不回来。

| Provider 类型 | 一致性强度 | 适用 | y-media 现状 |
| --- | --- | --- | --- |
| **强一致性 Provider**(Seedance 2.0、Wan 2.x) | ★★★★★ | 强 i2v、跨镜同主体、多段拼接 | 未来集成 |
| **中等 Provider**(通用 t2v 商用 API) | ★★★ | 单段 ≤ 5s、参考图锚定 | **当前 Agnes(待测)** |
| **弱 Provider**(开源轻量模型) | ★★ | 风格化短片、风景静物 | 不推荐 |
| **强 i2v Provider**(支持参考图 + 文本混合) | ★★★★ | 主体外观 100% 锁定 | 见 [multimodal-syntax.md §2](A2-multimodal-syntax.md) |

**当前决策**:
- y-media 默认走**中等一致性 Provider**(Agnes) + i2v 参考图锚定
- 单段 ≤ 5s + i2v + 关键特征锁 + 同关键词复述 + 段间桥接 = 强一致性效果
- 多段拼接必走 H 混合路径 + 段间桥接描述

**Provider 提交前自检**(见 [media-rules.md §4](M9-media-rules.md)):
- 当前任务用的是哪个 Provider?
- 该 Provider 的 i2v 支持?i2v 主体外观保真度?
- 是否满足"一段 ≤ 15s"?

---

### 2.5 招 5 · 路径选择(Path Selection)

**核心思路**:**路径决定漂移难度**。路径定错,再多 prompt 技巧都救不回来。

| 路径 | 漂移风险 | 适用 |
| --- | --- | --- |
| **G · 纯生成(一段 ≤ 15s 一次定)** | ★★ 低 | **默认推荐**;15s 内主体+场景统一 |
| **H · 分段混合(实拍 + AI 拼接)** | ★★★★ 高 | 必须用段间桥接 + i2v 锚定 |
| **E · 纯剪辑(实拍已备)** | ☆ 几乎无 | 已有素材,无需 AI 生成 |
| **M · 静图动态化(图生视频)** | ★★★ 中 | 主体外观 100% 锁定,场景细节可能漂 |

**决策树**(见 [SKILL.md §0.4](SKILL.md)):
```
输入: brief
  │
  ├─ 已有完整实拍素材? → E 纯剪辑(零漂移)
  ├─ 已有部分实拍,需要 AI 补? → H 混合(段间桥接必填)
  ├─ 已有静态图,需要动态化? → M 静图动态化
  └─ 全部从零? → G 纯生成(15s 单段,关键特征锁必填)
```

**反例**:
- ❌ 30s+ 单段纯生成(漂移高发,模型 5s 后开始自由发挥)
- ❌ H 混合不写段间桥接(每段独立生成 → 主体漂移叠加)
- ❌ M 静图动态化时长 > 10s(场景细节开始漂)

---

## §3 防漂移策略组合(场景路由)

| 场景 | 推荐组合 | 必选招数 | 可选招数 |
| --- | --- | --- | --- |
| **自然/动物/风景** | 招 1 + 招 3 + 招 5(G 纯生成 ≤ 15s) | 关键特征锁 + 同关键词复述 | 段间桥接(多段时) |
| **人像/时尚** | 招 1 + 招 3 + 招 4 + 招 5(G/M) | 关键特征锁 + Provider 选强一致性 + M 静图动态化 | 段间桥接(多段时) |
| **美食/ASMR** | 招 3 + 招 5(G 纯生成) | 同关键词复述 + 短段 | 关键特征锁(产品外观) |
| **商业带货** | 招 1 + 招 3 + 招 4 + 招 5(M/H) | 关键特征锁 + Provider 选强 i2v + M 静图动态化 | 段间桥接(多 SKU 时) |
| **情感/故事(多段)** | 招 2 + 招 4 + 招 5(H 混合) | 段间桥接(必填) + Provider 选强一致性 | 关键特征锁(同主体) |

---

## §4 漂移诊断与修复(发布后)

视频生成完后,**先做漂移自检**,再发布。

### 4.1 漂移自检 4 问

每镜号回答,任一为否就回头改 prompt 重生成。

1. **主体一致**? 人物/动物/产品的关键特征是否在每镜都出现?(对照招 1 的关键特征锁)
2. **场景一致**? 主光源方向、空间关系、环境细节是否变化?(对照 D2 场景漂移)
3. **镜头一致**? 运镜方向、速度、景别是否流畅无突兀切换?(对照 D3 镜头漂移)
4. **时间一致**? 光线色温、天气、季节是否一致?(对照 D4 时间漂移)

### 4.2 漂移修复(发布前)

| 漂移症状 | 修复策略 |
| --- | --- |
| 主体换脸/换色 | 加 1 个关键特征锁 + i2v 锚定 + 重生成 |
| 场景突然换家具 | 锁主光源 + 锁空间关系(详见 [scene.md §3](M4-scene.md)) |
| 镜头方向反了 | 改用 [M8-prompt-craft.md §3.6](M8-prompt-craft.md) 接续规则 + 同关键词复述 |
| 光线突变成黄昏 | 锁单一时间锚点(`soft golden morning light throughout`) |
| 多段拼接每段都"新主体" | 写段间桥接(招 2) + 用 Provider 强一致性档 |

### 4.3 重生成 vs 后修

- **重生成**:漂移严重(主体换脸/场景突变)→ 改 prompt 重生成
- **后修**:轻微漂移(光线微变、景别微跳)→ 后期调色/剪辑补偿即可
- **弃用**:漂移不可救(整段崩坏)→ 重新规划分镜 + 选更短的单段

---

## §5 与现有规则的交叉引用

| 防漂移策略 | 在 y-media 中的位置 | 说明 |
| --- | --- | --- |
| **角色四层** | [M3-character.md §1](M3-character.md) | 招 1 关键特征锁的来源 |
| **1:1 镜号对应** | [M1-methodology.md §5.1](M1-methodology.md) + [M8-prompt-craft.md §8](M8-prompt-craft.md) | 段间桥接的时间锚点基础 |
| **路径选择** | [SKILL.md §0.4](SKILL.md) | 招 5 的决策树来源 |
| **i2v 锚定** | [multimodal-syntax.md §2-3](A2-multimodal-syntax.md) | 招 4 强一致性来源 |
| **Provider 能力** | [M9-media-rules.md](M9-media-rules.md) + [providers/manifest.cjs](../providers/manifest.cjs) | 招 4 的决策依据 |
| **同关键词复述** | [M8-prompt-craft.md §1 八要素](M8-prompt-craft.md) | 招 3 的措辞规范 |
| **段间桥接** | [multimodal-syntax.md §5 续写](A2-multimodal-syntax.md) | 招 2 的"向前/向后延展" |
| **M1-M6 规则** | [M9-media-rules.md](M9-media-rules.md) | 漂移的边界条件(如 M5 i2v 必填) |

---

## §6 提交前自检清单

- [ ] 视频路径已按 [SKILL.md §0.4](SKILL.md) 决策树选定(E / G / H / M)?
- [ ] 单段时长 ≤ 15s?(否则拆镜)
- [ ] 关键特征锁已写入 `★ Hard constraints` 段(2-3 个)?
- [ ] 多段拼接时,每段末尾有"段间桥接描述"?
- [ ] 全文无近义词(同概念用同词)?
- [ ] i2v 路线已选 Provider 强一致性档?
- [ ] `★ Hard constraints` 段有 `Same [主体] identity across all frames (no character drift)`?
- [ ] 已对照 [media-rules.md §4 提交前自检](M9-media-rules.md)?

---

## §7 一句话总结

> **漂移 = 模型对软约束的忽视**。用**关键特征锁** + **同关键词复述** + **i2v 锚定** + **段间桥接** + **Provider 选择** + **路径选择** 6 把锁,任何 1 把都救不回来,必须叠加使用。
