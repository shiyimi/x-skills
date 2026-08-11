# 颗粒度标尺 · Granularity Scale

> 本文件是 [storyboard-methodology.md](storyboard-methodology.md) 的**核心独立参考**。定义"展示层 vs 执行层"的分工,以及每一字段"填到什么颗粒度才有效"。
>
> **核心区分**:分镜表(展示层)用具体数字(K/dB/BPM/焦段/月龄)做**人可读记录**;prompt(执行层)用**语义化降级**,因为 t2v 模型读不懂这些数字(M4),且音频描述对模型无效(M6)。详见 [t2v-model-capability.md](t2v-model-capability.md) §2。
>
> 影视要素词典见 [cinematography-reference.md](../../cinematography-reference.md);影响因子与权重见 [influence-factors.md](../../influence-factors.md)。

---

## 1. 展示层 vs 执行层分工

| 字段 | 展示层(分镜表,人读) | 执行层(prompt,模型读) | 降级规则 |
| --- | --- | --- | --- |
| **色温** | 4500K | `soft golden morning backlight` / `cool blue hour diffused light` | K值 → 光源描述 |
| **光比** | 3:1 | (删除)用光源方向替代: `rim/backlight with soft sky fill` | 数字 → 方向 |
| **光质** | 柔光 / 硬光 | `soft diffused light` / `hard direct light` | 保留语义词 |
| **光位** | 45°侧光 / 150°逆光 | `side light from the left` / `backlight from behind` | 角度 → 方位词 |
| **饱和度** | 饱和度+10 | (删除)用风格标签替代: `vibrant colors` / `muted tones` | 数字 → 风格词 |
| **音量** | -18dB | (移出 prompt,进 `Notes for downstream audio`) | 数字 → 删除 |
| **BPM** | 95 BPM | (移出 prompt,进 `Notes for downstream audio`) | 数字 → 删除 |
| **音效拟声** | 嗒嗒/唰/噗噗 | (移出 prompt,进 `Notes for downstream audio`) | 拟声词 → 删除 |
| **主体月龄** | 约6个月大 | `a 6-month-old ... foal` (保留,模型理解) | 数字描述保留 |
| **焦段** | 16mm-85mm | (作为风格参考保留) `shot on ARRI Alexa with shallow depth of field` | 焦段 → 摄影机 |
| **运镜速度** | 0.3m/s | (删除)用运镜语义替代: `slow` / `moderate` / `fast` | 数值 → 形容词 |
| **帧数** | 361 (8n+1,默认 15s) / 433 (8n+1,封顶 18s) | (不写进 prompt,进 API 参数) | 数字 → API参数 |
| **镜头数** | 6镜(规划) | 3时间段(执行) | 合并压缩 |

---

## 2. 颗粒度标尺(展示层 · 分镜表)

每列填到具体数值,不用抽象形容词。

| 字段 | 抽象(拒绝) | 具体(展示层) |
| --- | --- | --- |
| **光影·色温** | "暖光" | `4500K` (具体K值) |
| **光影·光比** | "柔和" | `2:1` (数字比) |
| **光影·光质** | "好看的光" | `柔光` / `硬光` / `半硬` |
| **光影·光位** | "侧光" | `45°侧光` / `150°逆光` (角度) |
| **色彩·饱和** | "鲜艳" | `饱和度+10` (±数值) |
| **音频·音量** | "轻柔" | `-18dB` (具体dB) |
| **音频·BPM** | "中速" | `95BPM` (数字) |
| **音频·音效** | "蹄声" | `嗒嗒` (拟声词) |
| **运镜·速度** | "缓慢" | `0.3m/s` (量化速度) |
| **主体** | "一匹小马" | `约6个月大的小马驹,棕白相间,鬃毛蓬松,四肢修长` (≥3特征) |
| **焦段** | "广角" | `16mm广角` / `85mm中焦` (等效mm) |
| **约束** | "要有高级感" | `24fps,快门180°,禁止文字` (可执行) |

**Rule of thumb**: 如果一个字段能换成"等等"而不丢失信息,它就太抽象了。重写时必须带数字或具名术语。

---

## 3. 颗粒度标尺(执行层 · prompt)

prompt 中的降级范式:

| 展示层(分镜表) | 执行层(prompt) |
| --- | --- |
| `4500K` 清晨侧逆光 | `soft golden morning backlight from a low sun` |
| `光比 3:1` | (删,光源方向自带对比) `rim/backlight with soft sky fill` |
| `4800K 强逆光 发丝光勾边` | `strong backlight with rim light on hair, soft fill from sky` |
| `95 BPM 清新民谣吉他+钟琴` | (移出 prompt,进 `Notes for downstream audio`) |
| `-18dB BGM` | (移出 prompt,进 `Notes for downstream audio`) |
| `0.3m/s 缓推` | `slow dolly-in` |
| `16mm-85mm 焦段切换` | `shot on ARRI Alexa with shallow depth of field` |
| `约6个月大,棕白相间,鬃毛蓬松` | `a 6-month-old brown-and-white pinto foal with a fluffy mane` (保留) |

---

## 4. 三层划分总结

| 层 | 用途 | 读者 | 关键字段 |
| --- | --- | --- | --- |
| **展示层** | 分镜表 + 创作规划 | 人(导演/客户/归档) | 具体数字(K/dB/BPM/月龄/焦段/拟声词) |
| **执行层** | 提交给 t2v 模型的 prompt | 模型 | 语义化描述(soft golden / BBC Earth / slow dolly-in) |
| **音频笔记层** | 供下游音频制作 | 人(后期) | BPM/dB/拟声词/环境音优先级 |

**铁律**: 展示层的数字不写进 prompt(模型忽略 M4);执行层不写 dB/BPM(模型无效 M6)。

---

## 5. 自检(提交前)

- [ ] 展示层每列都填了具体数字或具名术语?
- [ ] prompt 中没有 K/dB/BPM/光比/拟声词数字?
- [ ] 音频信息在 `Notes for downstream audio` 段?
- [ ] 主体月龄/数字描述在 prompt 中保留?
- [ ] 焦段/速度数字已降级为语义词?
