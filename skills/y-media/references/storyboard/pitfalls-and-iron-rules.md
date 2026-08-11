# 避坑三陷阱 + 5 铁律 · Pitfalls and Iron Rules

> 本文件是 [prompt-structure-formula.md](prompt-structure-formula.md) §6-§7 的**完整独立版**。从原方法论拆出,便于写 prompt 前快速翻阅,避免重复内容来回跳读。
>
> 与 [cinematic-shot-library.md](cinematic-shot-library.md) 配合:那里讲"用什么镜头",这里讲"不要用什么、必须做什么"。

---

## 1. 避坑三陷阱

### 1.1 物理逻辑互斥(物理层)

**禁令**: 不要在同一提示词里写矛盾指令。

| 反例 | 矛盾点 | 修复 |
| --- | --- | --- |
| "大远景" + "背景虚化" | 大远景景深必深,与虚化互斥 | 删"背景虚化"或改中景 |
| "大晴天" + "阴沉感" | 光线调性互斥 | 选一种光线 |
| "超高速" + "极度稳定" | AI 逻辑死锁 | 选快/稳其一 |
| "流畅" + "抖动风格" | 描述互斥 | 删"流畅"或"抖动" |
| "微距特写" + "全景观看" | 景别矛盾 | 选一种景别 |
| "正面光" + "逆光剪影" | 光位矛盾 | 选一种光位 |

### 1.2 静止动词陷阱(动作层)

**禁令**: 避免只用"站立"、"看着"等静止词。

**正确做法**: 主体内部必须有微观动作(micro-action):
- 动物: `with subtle ear twitches, light tail sway, occasional eye blinks`
- 人像: `with soft breathing visible, hair lightly swaying, gentle eye movement`
- 食物/产品: `with steam rising slowly, surface texture shifting`

**为什么**: 否则画面呈"3D 模型平移感",缺乏生命感。

### 1.3 光影指令缺失(光影层)

**禁令**: 如果不写光,AI 默认给漫反射平光 → 廉价 3D 感。

**保底二选一必须出现**:
- `soft directional lighting`
- `volumetric morning backlight`

**完整写法**: 光位 + 光质 + 光源 + 填充,如 `single light source — low golden morning sun behind the subject, soft fill from the sky`。

详见 [cinematography-reference.md](../../cinematography-reference.md) §3 光影与 [t2v-model-capability.md](../../t2v-model-capability.md) M4 数字参数被忽略。

---

## 2. 5 条铁律

### 2.1 动作写慢写连续

- 写"轻抬手腕"而非"挥手"
- 写"缓步转身"而非"走动"
- 写"mane and tail lifting lightly"而非"running"

**为什么**: t2v 模型对快动作渲染差(帧间跳跃),慢动作给模型更多时间生成连续姿态。

### 2.2 运镜写稳写简单

- 单段 ≤2 个组合运镜
- 多个运镜用连接词分开:`slowly tracking, then orbiting to face`
- 治愈/温情/广告片禁用手持抖动

详见 [cinematic-shot-library.md](cinematic-shot-library.md) §5。

### 2.3 强制约束焊死结尾

末尾必加,缺则 = 主角变脸、肢体扭曲:

```
— Stable frame, no flicker, natural [物种] anatomy, no mutation, no deformed [主体].
— Same [主体] identity across all frames (no character drift).
— No text, no logo, no watermark, no on-screen caption.
```

**有效 vs 无效约束**:

| 有效(可执行) | 无效(抽象) |
| --- | --- |
| `no mutation, no deformed horse` | `要有高级感` |
| `no text, no logo, no watermark` | `画质要好` |
| `stable frame, no flicker` | `自然一点` |
| `same identity across all frames` | `保持一致` |

### 2.4 术语转换:形容词 → 摄影参数和风格标签

| 抽象词(拒绝) | 摄影参数化 |
| --- | --- |
| "好看" | `healing fresh + warm diffused light` |
| "震撼" | `dolly zoom / slow motion / wide-angle distortion` |
| "电影感" | `shot on ARRI Alexa with shallow depth of field` |
| "高级" | `BBC Earth style + backlight rim` |
| "真实" | `natural motion + real-world physics + no CGI look` |
| "梦幻" | `volumetric light + soft bokeh + low saturation` |

### 2.5 风格锚定:每个镜头绑定 1 个明确风格标签

每段写 1 个,不要堆叠:
- 治愈清新 / 赛博朋克 / 日系 / 武侠电影感 / BBC Earth / National Geographic / Pixar / ARRI Alexa / iPhone 15 Pro Cinematic Mode / 16mm Bolex ...

**风格锚层级**(越具体模型越能锁定):

| 层级 | 示例 | 效果 |
| --- | --- | --- |
| 抽象 | "好看" / "震撼" | 模型自由发挥 |
| 中等 | "治愈清新" / "赛博朋克" | 风格基本对 |
| 具体 | "BBC Earth + ARRI Alexa" | 质感锁定 |
| 影视级 | "in the spirit of BBC Earth, shot on ARRI Alexa with shallow depth of field" | 锁定 |

---

## 3. 自检清单(提交 prompt 前)

- [ ] 物理逻辑:无矛盾指令(光位/景别/速度)?
- [ ] 动作:无纯静止动词,有 micro-action?
- [ ] 光影:已写 soft directional / volumetric,非空?
- [ ] 动作:写慢写连续,无"挥手/走动"等快词?
- [ ] 运镜:≤2 组合,连接词分开,治愈系无手持?
- [ ] 约束:焊死结尾,无抽象词?
- [ ] 术语转换:形容词已换摄影参数?
- [ ] 风格锚:每段 1 个明确风格标签?

详见 [influence-factors.md](../../influence-factors.md) F9 负面约束精炼。
