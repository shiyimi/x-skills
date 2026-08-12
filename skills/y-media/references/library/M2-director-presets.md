> **[AUXILIARY]**:本文件仅在 recipe 头部声明时加载。大多数简单场景不需要读本文件。

# M2. director-presets · 导演风格预设(创意)

> **定位**:y-media 的**风格锚一键套用**库。brief 锁定风格后,直接从本文件选一个预设搬进 prompt。

---

## §0 速选决策表

| brief 关键词 | 推荐预设 | 备选 | 禁用 |
| --- | --- | --- | --- |
| 风景/动物/治愈/慢生活 | **P1 治愈清新** / **P5 BBC Earth** | P2 电影感 | P3 赛博朋克 / P4 古风 |
| 旅行/节日/家居/咖啡 | **P1 治愈清新** | P2 电影感 / P7 杂志 | P3 赛博朋克 |
| 杂志/街拍/人像 | **P7 杂志(强 i2v)** / P2 电影感 | P1 治愈清新 | P5 BBC Earth |
| 美食/烹饪/饮品 | **P6 ASMR** / P2 电影感 | P1 治愈清新 | P3 赛博朋克 / P8 广告 |
| 美妆/服饰/数码/带货 | **P8 广告商业** | P2 电影感 / P3 赛博朋克(3C) | P1 治愈清新(质感不够) |
| 国风/武侠/古风 | **P4 古风武侠** | P2 电影感 | P3 赛博朋克 / P5 BBC Earth |
| 城市夜景/赛博 | **P3 赛博朋克** | P2 电影感 | P1 治愈清新 / P4 古风 |
| 情感/故事/共情 | **P2 电影感** | P1 治愈清新 | P8 广告 |

---

## §1 P1 · 治愈清新(Healing Fresh)

**一句话锚句**:
> `healing fresh style, soft diffused morning light, warm pastel color palette, gentle and poetic atmosphere`

**摄影机/镜头**:
- ARRI Alexa Mini LF + 50mm / 85mm 定焦
- 浅景深(`shallow depth of field`),前景虚化
- 横移跟拍 + 缓推(`lateral tracking + slow push in`)
- 手持抖动**禁用**

**光影调色**:
- 单光源:**晨光侧逆光**(`soft golden morning backlight`)/ 侧窗散射光
- 色温:4500-5500K(暖白偏冷)
- 调色:低饱和度 + 高亮度 + 奶白柔光 + 微微的胶片颗粒
- 阴影:`soft sky fill` 不死黑

**适用场景**:
- 自然/动物/风景/治愈系慢生活
- 旅行 vlog / 节日 / 家居日常
- 任何想让用户"停下来深吸一口气"的场景

**反模式**:
- ❌ 手持抖动(`handheld shake`)—— 治愈系等于稳定
- ❌ 霓虹/高饱和撞色 —— 违和
- ❌ 黑色背景 + 高对比 —— 治愈系应该明亮通透
- ❌ "震撼"/"史诗"等强情绪词 —— 风格冲突

**典型 BGM 皮肤**:
- 清新民谣(木吉他 + 钟琴, 90-110BPM,无歌词)
- 钢琴独奏(60-80BPM,无歌词)

---

## §2 P2 · 电影感(Cinematic)

**一句话锚句**:
> `cinematic style, shot on ARRI Alexa with anamorphic lens, dramatic lighting, moody and narrative atmosphere`

**摄影机/镜头**:
- ARRI Alexa 65 + Panavision Anamorphic(2.39:1 宽银幕变形宽银幕)
- 中景深(`medium depth of field`),允许背景略有信息
- 缓推 dolly + 缓拉 + 低角度仰拍
- 可用 希区柯克变焦 / Dutch angle(慎用)/ slow motion

**光影调色**:
- 单光源:**戏剧性侧光 / 体积光**(`dramatic side light` / `volumetric light beams`)
- 色温:2800-6500K 跨度大(按情绪调)
- 调色:Teal & Orange / 黑白 / 暖金 + 冷青
- 阴影:深,允许部分主体入暗(戏剧)

**适用场景**:
- 通用兜底(任何场景想"高级一点")
- 情感/故事/共情片
- 古风/武侠 + 现代纪实
- 商业质感片(高客单/品牌)

**反模式**:
- ❌ "好看/震撼"等抽象词
- ❌ 8 种风格混用(电影感 = 风格统一)
- ❌ 平面平光(电影感 = 光影戏剧)

**典型 BGM 皮肤**:
- 弦乐 + 钢琴 + pad(60-90BPM,无歌词)
- 弱起钢琴 + 中段弦乐推进(70-90BPM)

---

## §3 P3 · 赛博朋克(Cyberpunk)

**一句话锚句**:
> `cyberpunk style, neon-soaked night street, holographic projection, rainy atmosphere, dark and edgy mood`

**摄影机/镜头**:
- Sony Venice + Laowa 12mm 超广角 + 长焦虚化
- 中景深,但允许霓虹焦外光斑(`bokeh from neon signs`)
- Dutch angle(15-25°) / 缓推 + 横摇 / 仰拍霓虹招牌
- 1.0x-1.2x 慢速(微微慢动作)

**光影调色**:
- 多光源:**霓虹招牌光**(主)+ 雨后反射(辅)
- 色温:高对比(粉紫 #FF00FF / 蓝青 #00FFFF / 橙红 #FF6B00)
- 调色:高饱和 + 高对比 + 暗部偏紫 + 亮部偏青/粉
- 阴影:深黑(夜感)

**适用场景**:
- 城市夜景/科技/3C 数码(暗背景展示)
- 情感反差(温情 → 都市孤独)
- 二次元/游戏/虚拟偶像

**反模式**:
- ❌ 白天 + 赛博(违和,赛博 = 夜)
- ❌ 单色霓虹(应该多色撞)
- ❌ 暖光(赛博 = 冷调主导)
- ❌ 无雨(雨是赛博标志性元素)

**典型 BGM 皮肤**:
- 合成器电子(脉冲音效,115-130BPM,无歌词)
- Dark Trap / Future Bass

---

## §4 P4 · 古风武侠(Wuxia)

**一句话锚句**:
> `wuxia cinematic style, traditional Chinese aesthetic, side-backlit mist, flowing silk fabric, slow motion sword dance`

**摄影机/镜头**:
- ARRI Alexa Mini + 老式 Cooke 镜头(柔光晕)
- 中景深,薄雾提供天然景深
- 缓推 dolly forward + 缓横摇 / 慢动作 0.5x
- 长焦压缩空间感(85-135mm)

**光影调色**:
- 单光源:**侧逆光薄雾**(`side backlight through thin mist`)/ 月光冷蓝
- 色温:3200-4500K(暖金月光) / 7000K+(冷月)
- 调色:低饱和 + 高去对比 + 微微偏青/黄 + 油润感
- 阴影:深,允许剪影(武侠标志性剪影)

**适用场景**:
- 国风/古风/汉服/武侠
- 慢节奏的"侠客行"/"江湖梦"叙事
- 中秋/春节/传统节日的中国风广告

**反模式**:
- ❌ 霓虹/电音(违和,古风 = 留白)
- ❌ 快剪 + 多镜头切换(古风 = 慢)
- ❌ 高饱和撞色(古风 = 素雅)
- ❌ 字幕花字 + 弹跳动画(古风 = 行书淡入)

**典型 BGM 皮肤**:
- 古筝 + 笛子 + 鼓(60-80BPM,无歌词)
- 二胡 + 弦乐(70-90BPM,无歌词)

---

## §5 P5 · BBC Earth(纪录片)

**一句话锚句**:
> `National Geographic documentary style, golden hour wildlife cinematography, telephoto compression, vast and majestic atmosphere`

**摄影机/镜头**:
- ARRI AMIRA + 长焦(200-600mm)+ 偶尔超广角宏大场景
- 浅景深 + 长焦压缩空间感
- 横移跟拍 + 缓推 + 偶有大远景拉升
- 慢动作 0.5x-0.8x + 升格(120fps 升格到 24fps)

**光影调色**:
- 单光源:**黄金时刻侧光**(`low golden hour side light`)/ 晨雾侧光
- 色温:3000-4000K(暖金)/ 5500K(中性自然光)
- 调色:自然饱和 + 微微暖金 + 阴影偏冷 + 绿色饱和
- 阴影:`soft fill from sky`,不死黑

**适用场景**:
- 自然/动物/野外(治愈系纪录片)
- 风景/山水/风光延时
- 任何想"高级 + 真实 + 大气"的场景

**反模式**:
- ❌ 手持抖动(纪录片 = 稳定)
- ❌ 高饱和撞色(纪录片 = 自然)
- ❌ 滤镜感过重(纪录片 = 真实)
- ❌ 黑紫霓虹(纪录片 = 自然光)

**典型 BGM 皮肤**:
- 弦乐 + 钢琴 + 大提琴(60-85BPM,无歌词)
- 清新民谣(木吉他 + 钟琴, 90-110BPM,无歌词)

---

## §6 P6 · ASMR(极慢,1/4x)

**一句话锚句**:
> `ASMR slow-motion macro style, 1/4x speed, close-up textures, satisfying crisp sounds, dark cozy background`

**摄影机/镜头**:
- 索尼 A7S III + 微距 100mm + 大光圈 f/1.4
- 极浅景深(主体清晰,背景完全虚化)
- 微距 + 顶光 / 侧光 / 暗背景
- **1/4x 慢动作**(15s 拍 60s 素材)

**光影调色**:
- 单光源:**顶光 / 侧光 / 暗背景单光**
- 色温:2800-3500K(暖食欲光)
- 调色:低饱和 + 高对比 + 微微暖金 + 暗背景
- 阴影:深黑(突出主体)

**适用场景**:
- 美食/ASMR(巧克力敲碎、爆浆、拉丝)
- 烹饪关键瞬间(嗞啦、油爆、蒸汽)
- 任何想"让用户听到细节"的场景

**反模式**:
- ❌ BGM(ASMR = 纯环境音,**禁用 BGM**)
- ❌ 运镜 > 1 个(ASMR = 极简,基本固定)
- ❌ 高频切镜(ASMR = 一镜到底或极慢)
- ❌ 字幕覆盖主体(ASMR 字幕 = 后期烧录,不抢主体)

**典型 BGM 皮肤**:
- **禁用 BGM**(L0 · ASMR 专有)
- 纯环境音:嗞啦 / 敲击 / 撕裂 / 流水(拟声词为主,见 [audio.md §1.2](M6-audio.md))

---

## §7 P7 · 杂志(Editorial / Magazine)

**一句话锚句**:
> `high fashion magazine editorial style, dramatic studio lighting, bold colors, sharp focus, avant-garde composition`

**摄影机/镜头**:
- 哈苏 H6D + 80mm 中长焦 + Phase One IQ4
- 中景深(允许背景有一定信息)
- 固定 + 微推 / 缓横移 / 极慢 dolly
- 可用 Dutch angle(适度)

**光影调色**:
- 多光源:**三点光** + **轮廓光**(`key + fill + rim light`)
- 色温:5500K(中性)/ 局部彩光(品牌主色打轮廓)
- 调色:高饱和 + 高对比 + 锐利(后期磨皮慎)
- 阴影:`soft fill`,不死黑但深

**适用场景**:
- 杂志封面/人像/时尚大片
- 强 i2v 路线(用产品图/服装图为起始帧)
- 美妆/穿搭/品牌片

**反模式**:
- ❌ 治愈清新 / 暖民谣 BGM(杂志 = 时尚电子)
- ❌ 浅景深到底(杂志 = 主体和背景都有信息)
- ❌ 田园风/古风(杂志 = 现代都市)
- ❌ 自然光(杂志 = 棚拍三点光)

**典型 BGM 皮肤**:
- 时尚电子 / trap / 鼓点卡点(110-130BPM)
- French House / Synthwave

---

## §8 P8 · 广告商业(Commercial)

**一句话锚句**:
> `premium commercial advertising style, bright key light on product, clean background, polished and aspirational mood`

**摄影机/镜头**:
- ARRI Alexa Mini + 50mm / 85mm 定焦
- 中景深,主体清晰 + 背景虚化但有信息(品牌色)
- 环绕小角度(45-90° 弧)/ 固定 + 微推 / 升降 + 横摇
- 手持**禁用**

**光影调色**:
- 单光源:**三点光**(主光 + 副光 + 轮廓光)
- 色温:4500-5500K(中性白)
- 调色:中饱和 + 高对比 + 干净通透 + 锐利
- 阴影:`soft fill`,死黑极少

**适用场景**:
- 商业带货(美妆/服饰/家居/数码/母婴/通用)
- 品牌广告 / 产品演示
- 任何"展示 + 转化"场景

**反模式**:
- ❌ 治愈清新 / 暖民谣(商业 = 节奏密集)
- ❌ 慢切 1 镜 5s(商业 = 1-2.5s 快切)
- ❌ 暗背景大面积黑(商业 = 通透干净)
- ❌ 模糊 / 抖动 / 不确定感(商业 = 100% 主体清晰)

**典型 BGM 皮肤**:
- 鼓点 build-up + drop(110-140BPM,无歌词)
- 清新流行(木吉他 + 钟琴, 90-110BPM)
- 合成器电子(115-130BPM,3C 路线)

---

## §9 与其他文件的搭配

### 9.1 与情绪杠杆搭配

| 预设 | 推荐杠杆组合 | 来源 |
| --- | --- | --- |
| P1 治愈清新 | L1(开场轻音钩) + L4(品牌音 logo) | [emotional-levers.md §0](A3-emotional-levers.md) |
| P2 电影感 | L1 + L5(音量曲线) | 同上 |
| P3 赛博朋克 | L2(卡点) + L3(静音→爆) | 同上 |
| P4 古风武侠 | L1 + L5 | 同上 |
| P5 BBC Earth | L5(长段情绪曲线) | 同上 |
| P6 ASMR | **禁用所有杠杆**(纯环境音) | — |
| P7 杂志 | L2 + L4(品牌音 logo) | [emotional-levers.md §0](A3-emotional-levers.md) |
| P8 广告商业 | L1 + L2 + L3 + L4(全部 4 杠杆) | 同上 |

### 9.2 与 recipe 路线搭配

| recipe | 默认预设 | 备选 |
| --- | --- | --- |
| [nature.md](../recipes/nature.md) | P5 BBC Earth | P1 治愈清新 |
| [lifestyle.md](../recipes/lifestyle.md) | P1 治愈清新 | P2 电影感 |
| [portrait.md](../recipes/portrait.md) | P7 杂志 | P2 电影感 |
| [food.md](../recipes/food.md) | P6 ASMR(烹饪) / P1 治愈清新(摆盘) | P2 电影感 |
| [commerce.md](../recipes/commerce.md) | P8 广告商业 | P3 赛博朋克(3C) |

---

## §10 自检清单(套用预设前)

- [ ] 风格锚句写在 prompt `★ Style anchor` 段(整段只 1 个预设,见 [scene.md §5](M4-scene.md))
- [ ] 摄影机/镜头写进 `★ Camera language` 段(≤ 2 组合)
- [ ] 光影写进 `★ Lighting` 段(单光源 + 语义化)
- [ ] BGM 皮肤与预设一致(避免 P6 ASMR + 鼓点 BGM 之类冲突)
- [ ] 反模式清单全部避开
