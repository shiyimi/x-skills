# Prompt 结构公式 · Structure Formula

> 本文件是**提交给 t2v 模型的 prompt 的写作骨架**。规则在 [storyboard-methodology.md](storyboard-methodology.md),术语在 [cinematography-reference.md](cinematography-reference.md),模型限制在 [t2v-model-capability.md](t2v-model-capability.md);本文件定义"一段 prompt 应该按什么顺序、什么结构拼接"。
>
> 核心原则:**八要素不可省略,五定法定维度,角色四层/场景三层定颗粒度,14 镜头库选运镜,避坑三陷阱防翻车,5 铁律做最终校验。**

---

## 1. 八要素万能公式(写作骨架)

提示词严格按八个要素拼接,顺序固定,不可省略:

```
主体 + 动作 + 场景 + 光影 + 镜头语言 + 风格 + 画质 + 约束
```

### 1.1 满分作业实例

```
(主体)一位年轻女生
(场景)在海边
(动作)慢走,微风拂动头发,微笑看向镜头
(光影)黄昏暖光
(画质)4K 高清
(风格)电影感
(镜头)稳定运镜
(约束)画面流畅不抖动,细节清晰。
```

### 1.2 八要素写法要点

| 要素 | 写法规则 | 反例 |
| --- | --- | --- |
| 主体 | 身份 + 外貌 + 服装 + 气质(角色四层) | "一个女生" |
| 动作 | 写慢、写具体、写连续,加 micro-action | "跳舞" → "微微低头、回眸微笑、发丝随风摆动" |
| 场景 | 场景类型 + 时代风格 + 环境细节 + 光线天气(场景三层) | "街上" |
| 光影 | 必加,缺则给廉价漫反射光 | "漂亮的光" → "黄昏暖光 / 体积光 / 侧逆光" |
| 镜头语言 | 至少 1 个运镜词,建议 ≤2 个组合 | 混用"超高速"+"极度稳定"等矛盾指令 |
| 风格 | 1 个明确标签:治愈清新 / 赛博朋克 / 日系 / 武侠电影感 / BBC Earth | "好看" / "很美" / "震撼" |
| 画质 | 后置强化:4K / 超清 / 电影质感 / shallow depth of field | 写得太靠前会喧宾夺主 |
| 约束 | 必加:画面稳定 / 无闪烁 / 人体结构正常 / 不变形 | 漏了 = 主角变脸、肢体扭曲 |

---

## 2. 五定法(写作维度索引)

| 维度 | 解决什么 | 关键控制点 |
| --- | --- | --- |
| 定人 | 角色长什么样 | 外貌 + 服装 + 气质 |
| 定景 | 故事发生在哪里 | 环境 + 时代 + 天气 + 光线 |
| 定调 | 整体什么风格 | 片型 + 画面质感 + 情绪基调 |
| 定音 | 声音怎么处理 | 对白 + 音效 + 配乐 + 语种(**移出 prompt,进 Notes**) |
| 定拍 | 怎么动、怎么拍 | 角色动作 + 镜头运动 + 节奏 |

五定解决"拍什么",时间解决"什么时候拍"。

---

## 3. 角色四层结构(定人)

从粗到细四层,主角才写满三层以上:

```
[身份标签] + [外貌特征] + [服装描写] + [气质/状态修饰]
```

| 层级 | 作用 | 实例 |
| --- | --- | --- |
| 第一层 身份标签 | 调用模型已有形象模板 | "赛博朋克深海潜员" / "古风少女" / "a 6-month-old pinto foal" |
| 第二层 外貌特征 | 模型可画面化的特征 | "短发的中年男人" / "brown-and-white with a fluffy mane" |
| 第三层 服装描写 | 信息密度最高,颜色最易执行 | "穿黑色长风衣的" / "一袭白衣" |
| 第四层 气质/状态 | "看起来什么感觉" | "气质冷峻的" / "joyful temperament" |

**锁定原则**: 主体描述词全片/全系列锁同一套,改一个词模型就漂移。

---

## 4. 场景三层结构(定景)

```
[场景类型] + [时代/风格修饰] + [环境细节] + [光线/天气]
```

| 层级 | 实例 |
| --- | --- |
| 第一层 场景类型 | "街头 / 酒吧 / 海边 / 林间 / meadow" |
| 第二层 时代/风格修饰 | "赛博朋克风格的街道" / "early-morning countryside style" |
| 第三层 环境细节 | "墙角堆着几个纸箱" / "dew-drenched clover, pink wildflowers, thin drifting mist" |
| 第四层 光线/天气 | "黄昏 / 晨雾 / 雨水" / "soft golden sunrise backlight, gentle wind" |

---

## 5. 14 镜头库(导演级技法)

### 5.1 六种运镜组合(成功率最高)

| # | 运镜组合 | 写法 | 适用场景 |
| --- | --- | --- | --- |
| 1 | 跟拍 + 环绕 | `lateral tracking then slowly orbiting to face` | 人物登场万金油,侧后方起绕到正面 |
| 2 | 升降 + 横摇 | `crane up while slowly panning right` | 宏大叙事开场,低位→全景揭示 |
| 3 | 手持摄影风格 | `handheld style, slight shake` | 动作追逐/街头纪实;**治愈系禁用** |
| 4 | 主观视角 POV | `first-person POV shot` | 代入感无敌,配合一镜到底 |
| 5 | 低角度仰拍 | `low-angle hero shot` | Seedance 2.0 识别极精准,初次亮相首选 |
| 6 | 推拉结合 | `push in to close-up, then pull out to wide` | 先聚焦细节,后揭示真相 |

### 5.2 四种高级电影术语

| # | 术语 | 效果 |
| --- | --- | --- |
| 1 | 希区柯克变焦 dolly zoom | 主体大小不变,背景剧烈拉伸 → 震惊/空间扭曲 |
| 2 | 匹配剪辑 match cut | 最高级转场,动作相似性跨时空丝滑过渡 |
| 3 | 升格慢动作 slow motion | 仪式感,雨滴/火星/细腻情绪 |
| 4 | 荷兰角 Dutch angle | 不安/心理阴暗/疯狂情绪 |

### 5.3 四种构图与镜头进阶技法

| # | 技法 | 适用 |
| --- | --- | --- |
| 1 | 微距镜头 macro | 1:1 放大,材质纹理细节,露珠穿透光线 |
| 2 | 框景构图 framing | 用窗户/门框/树干做画框,窥视感 |
| 3 | 超广角镜头 ultra-wide | 极大空间包容度,边缘畸变冲击力 |
| 4 | 延时摄影 time-lapse | 压缩极慢变化(日落/结晶/云涌),哲理性史诗感 |

### 5.4 镜头使用铁律

- 单视频 ≤2 个组合运镜
- 治愈/温情/广告片禁用手持抖动
- 多个运镜必须用连接词分开:`slowly tracking, then orbiting to face`

---

## 6. 避坑三陷阱

### 6.1 物理逻辑互斥

**禁令**: 不要在同一提示词里写矛盾指令。

| 反例 | 矛盾点 |
| --- | --- |
| "大远景" + "背景虚化" | 大远景景深必深,与虚化互斥 |
| "大晴天" + "阴沉感" | 光线调性互斥 |
| "超高速" + "极度稳定" | AI 逻辑死锁 |
| "流畅" + "抖动风格" | 描述互斥 |

### 6.2 静止动词陷阱

**禁令**: 避免只用"站立"、"看着"等静止词。

**正确做法**: 主体内部必须有微观动作——呼吸、眼球转动、衣角飘动、发丝轻拂、尾巴轻扬。否则画面呈"3D 模型平移感"。

**保底 micro-action 短语**(核心主体才加):
- `with subtle ear twitches, light tail sway, occasional eye blinks`(动物)
- `with soft breathing visible, hair lightly swaying, gentle eye movement`(人像)
- `with steam rising slowly, surface texture shifting`(食物/产品)

### 6.3 光影指令缺失

**禁令**: 如果不写光,AI 默认给漫反射平光 → 廉价 3D 感。

**保底二选一必须出现**:
- `soft directional lighting`
- `volumetric morning backlight`

---

## 7. 5 条铁律(最终校验)

1. **动作写慢写连续**: 写"轻抬手腕"而非"挥手",写"缓步转身"而非"走动"
2. **运镜写稳写简单**: 单视频 ≤2 个组合运镜
3. **强制约束焊死结尾**: `stable frame / no flicker / natural anatomy / no mutation / no text`
4. **术语转换**: 把形容词换成摄影参数和风格标签。"好看" → `healing fresh + warm diffused light`;"震撼" → `dolly zoom / slow motion / wide-angle distortion`
5. **风格锚定**: 每个镜头绑定 1 个明确风格标签(赛博朋克 / 日系治愈 / 武侠电影感 / BBC Earth)

---

## 8. 钩子类型(前 3 秒防流失)

| 钩子类型 | 写法 | 适用 |
| --- | --- | --- |
| 运动钩子 | 主体入画 / 运镜推入 | 通用 |
| 光影钩子 | 逆光剪影 / 体积光 / 光束穿透 | 治愈/氛围 |
| 动作钩子 | 突然动作(跃起/甩头/冲刺) | 动物/运动 |
| 表情钩子 | 特写表情(歪头/凝视/微笑) | 人像/宠物 |
| 悬念钩子 | 局部特写先出现,后揭示全貌 | 叙事 |

---

## 9. prompt 拼接顺序模板

```text
[画幅/时长/质感总述] Vertical 9:16, 15 seconds. [风格锚] style, shot on [摄影机] with shallow depth of field.

★ Main subject (four layers, keep consistent in every frame):
[角色四层描述] — keep the same [关键特征] across all frames (no character drift).

★ Scene (three layers + atmosphere):
[场景三层 + 光线天气].

★ Action (slow, continuous, single motion per beat; with micro-actions):
- 0.0–Xs: [动作1 + micro-action].
- Xs–Ys: [动作2 + micro-action].
- Ys–15s: [动作3 + micro-action].

★ Camera language (≤ 2 moves per segment, from cinematic shot library):
- Segment 1: [运镜1].
- Segment 2: [运镜2].
- Segment 3: [运镜3].
[运镜禁令: No whip pans, no shaky-cam.]

★ Lighting (mandatory, single source):
[单一光源语义化描述 + 配色锚].

★ Style anchor:
[风格标签 + 情绪弧线: "starts calmly → peaks with X → ends quietly"].

★ Quality (post-positioned):
4K ultra-high definition, shallow depth of field, [光质].

★ Hard constraints (weld to end):
— Stable frame, no flicker, natural [物种] anatomy, no mutation, no deformed [主体].
— Same [主体] identity across all frames (no character drift).
— No text, no logo, no watermark, no on-screen caption.
```

Notes for downstream audio (do NOT include in the video prompt):
- BGM skin: [音频皮肤].
- Ambient priorities: [环境音优先级].
