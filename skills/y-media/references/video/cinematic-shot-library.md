# 14 镜头库 · Cinematic Shot Library

> 本文件是 [prompt-structure-formula.md](prompt-structure-formula.md) §5 镜头语言段落的**导演级速查表**。从 6 种运镜组合 + 4 种高级电影术语 + 4 种构图/镜头进阶技法 = 14 个技法,供写 prompt 时按场景选用。
>
> **铁律**: 单段 ≤2 个组合运镜(治愈/温情/广告片禁用手持抖动);多个运镜必须用连接词分开:`slowly tracking, then orbiting to face`。

---

## 1. 六种运镜组合(成功率最高)

| # | 运镜组合 | 写法(执行层) | 适用场景 | 警告 |
| --- | --- | --- | --- | --- |
| 1 | 跟拍 + 环绕 | `lateral tracking then slowly orbiting to face` | 人物登场万金油,侧后方起绕到正面 | 360° 全环绕易晕,限 45-90° 弧 |
| 2 | 升降 + 横摇 | `crane up while slowly panning right` | 宏大叙事开场,低位→全景揭示 | 速度太快=玩具感 |
| 3 | 手持摄影风格 | `handheld style, slight shake` | 动作追逐/街头纪实 | **治愈系禁用**;抖动幅度要控 |
| 4 | 主观视角 POV | `first-person POV shot` | 代入感无敌,配合一镜到底 | 慎用,易致动晕 |
| 5 | 低角度仰拍 | `low-angle hero shot` | Seedance 2.0 识别极精准,初次亮相首选 | 仰角 >30° 易变形 |
| 6 | 推拉结合 | `push in to close-up, then pull out to wide` | 叙事法:先聚焦细节,后揭示真相 | 推拉速度不一致=割裂 |

---

## 2. 四种高级电影术语

| # | 术语 | 写法 | 效果 | 适用 |
| --- | --- | --- | --- | --- |
| 1 | 希区柯克变焦 | `dolly zoom` | 主体大小不变,背景剧烈拉伸 → 震惊/空间扭曲 | 心理冲击、转场 |
| 2 | 匹配剪辑 | `match cut` | 最高级转场,动作相似性跨时空丝滑过渡 | 多段拼接转场 |
| 3 | 升格慢动作 | `slow motion` | 仪式感,雨滴/火星/细腻情绪 | 高潮时刻、特写 |
| 4 | 荷兰角 | `Dutch angle` | 不安/心理阴暗/疯狂情绪 | 悬疑、惊悚 |

---

## 3. 四种构图与镜头进阶技法

| # | 技法 | 写法 | 适用 | 注意 |
| --- | --- | --- | --- | --- |
| 1 | 微距镜头 | `macro lens, 1:1 close-up` | 材质纹理细节,露珠穿透光线 | 浅景深极浅,主体必须清晰 |
| 2 | 框景构图 | `framing through window/door/tree branch` | 窥视感、层次 | 框不能太大抢主体 |
| 3 | 超广角镜头 | `ultra-wide angle, edge distortion` | 极大空间包容度,边缘畸变冲击力 | 边缘畸变会拉变形主体,慎用于人像 |
| 4 | 延时摄影 | `time-lapse` | 压缩极慢变化(日落/结晶/云涌),哲理性史诗感 | t2v 模型支持有限,优先短段 |

---

## 4. 镜头选择决策表

| 场景意图 | 首选 | 次选 | 禁用 |
| --- | --- | --- | --- |
| 人物登场亮相 | 低角度仰拍(#5) | 跟拍+环绕(#1) | 手持抖动(#3) |
| 自然/治愈 | 横移跟拍 + 缓推 | 推拉结合(#6) | 手持抖动(#3) / 荷兰角(#4) |
| 产品展示 | 环绕小角度(#1 改) | 固定+微推 | 推拉快速 |
| 武侠/古风 | 缓推 dolly forward | 升降+横摇(#2) | 手持抖动 |
| 街头纪实 | 手持风格(#3) | 跟拍+环绕(#1) | 固定机位长镜 |
| 食物/ASMR | 俯拍 + 微距(#1+#4) | 固定+微推 | 运镜>1 个组合 |
| 梦境/超现实 | 希区柯克变焦(#1) | 荷兰角(#4) | 平实跟拍 |
| 城市夜景 | 横移+霓虹 | 低角度仰拍 | 慢动作 |

---

## 5. 镜头使用铁律

1. **单段 ≤2 个组合运镜**;超过 2 个模型会"运动不接戏"
2. **治愈/温情/广告片禁用手持抖动**;治愈系 = 平滑稳定
3. **多个运镜用连接词分开**:`slowly tracking, then orbiting to face` / `dolly in, then rack focus`
4. **360° 全环绕慎用**;限 45-90° 弧,避免观感晕眩
5. **仰角不超过 30°**;过大导致主体变形(M3)
6. **运镜速度在 prompt 中用 slow/moderate/fast 描述**(语义化,非 m/s,见 [t2v-model-capability.md](t2v-model-capability.md) M4)

---

## 6. 跨段运镜接续规则

| 上段运镜末 | 下段运镜起 | 接续方式 |
| --- | --- | --- |
| dolly-in | dolly-out | 推拉反转 = 强调(慎用) |
| tracking | static | 运动→静止 = 聚焦 |
| low-angle | eye-level | 仰→平 = 权力转移 |
| wide | close-up | 远→近 = 揭示 |
| close-up | wide | 近→远 = 释放 |
| slow motion | normal speed | 慢→常 = 现实回归 |

详见 [pitfalls-and-iron-rules.md](pitfalls-and-iron-rules.md) §1 物理逻辑互斥。
