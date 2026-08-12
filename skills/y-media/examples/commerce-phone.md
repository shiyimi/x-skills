# 分镜示例 · 旗舰手机测评(commerce · 数码)

> 题材:暗背景顶光下旗舰手机测评,参数+实测+价格CTA,合成器电子 125BPM。对应 [recipes/commerce.md §2.4 数码家电](references/recipes/commerce.md)。
> **关键点**:**6 类字幕全用**;9 镜快切;屏幕数字不能穿模(数字零错字 R5);暗背景科技感。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 6 类字幕全用 ② 9 镜快切 ③ 暗背景+顶光 ④ 数字零错字 R5(屏幕内容/价格/参数) ⑤ 合成器电子
> - [CAN-ROTATE]: ① 产品型号 ② 数字参数 ③ 字幕文案 ④ 实测对比项

---

## 1. 视频主要目标

`旗舰手机测评 × 暗背景 × 转化-带货 × 合成器电子 × 骨架A快切(9 镜,1.0-2.5s) × 15s × 竖屏9:16`

- **默认假设**: 纯生成;有字幕(6 类全用);9:16。
- **音频策略**: 目标=转化 · query="科技/性能" → 合成器电子(脉冲音效+底鼓,125BPM);环境音=开机"叮"+指纹"嗒"+数据飞涨"嘀"。**音频进 prompt + 侧车 Notes 副本**。
- **美学母体**: 暗背景+科技蓝+品牌色+金属银;色温 5000K;暗背景顶光。
- **视听路线**:**含字幕**(6 类全用)。

## 2. 分镜表格(展示层)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影 | 主体动作 | 视觉重点 | 字幕类型 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 1.5s | 远景·平视 | 缓推 0.2m/s | 顶光 5000K 暗背景 | 手机暗背景轮廓剪影,品牌光带 | ★ | ① 钩子 |
| S01-02 | 1.5s | 中景·俯角 30° | 固定 | 顶光 5000K | 开机,屏幕点亮,数字"叮" | ★ | — |
| S01-03 | 1.5s | 特写·屏幕 | 缓推 0.1m/s | 顶光 5000K | 屏幕参数飞涨,数字滚动 | ★ | ② 数据 |
| S01-04 | 1.5s | 中近景·俯角 30° | 固定 | 顶光 5000K | 指纹识别瞬间,"嗒" | ★ | — |
| S01-05 | 1.5s | 中景·俯角 30° | 固定 | 顶光 5000K | 实测对比同框,左旧右新,数据飞涨 | ★ | ③ 背书 |
| S01-06 | 1.5s | 特写·摄像头 | 缓推 0.1m/s | 顶光 5000K | 摄像头模块特写,镜片反光,金属感 | — | — |
| S01-07 | 1.5s | 中景·俯角 30° | 固定 | 顶光 5000K | 跑分测试,数字快速滚动,峰值定格 | ★ | — |
| S01-08 | 1.5s | 中近景·平视 | 缓推 0.15m/s | 顶光 5000K | 手持握感,金属边框+曲面屏反光 | ★ | ⑥ 金句 |
| S01-09 | 2.0s | 远景·平视 | 缓拉镜 0.2m/s | 顶光 5000K | 全身定格,价格+CTA | ★ | ④ CTA |

**合计**: 14.5s ≈ 15.0s / 9 镜 / ★ 7/9 / 字幕 5/6 类 / 帧数 361。

**3+1 真实环境**: 暗色桌面+数字屏幕+线材+极简道具+顶光+品牌光带。

## 3. Generation

(交付后由 Step 7 追加。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 鼓点 build-up + drop 110-140BPM,无歌词 · 0s 渐入,3s 到 -18dB · 中段推满 · 末 2s 淡出至 -30dB。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: synth electronic (kick + pulse + bass), 125 BPM, hard-hitting, beat drop at S01-...
- 数字完整版(供参考): 0.0–1.5s dark room hum + LED buzz; 1.5–3.0s power-button click + boot "ding"; 3....

## 5. 视频 prompt(执行层)

```text
Vertical 9:16, 15 seconds. Tech product review style, dark background, beat-synced hard cuts, shot on Sony A7RV with 85mm f/1.8, modern tech-reviewer color grade, dark and crisp.

★ Main subject:
A flagship smartphone in space-black color with metallic frame and curved-edge OLED display, sitting on a dark matte surface. A second older-generation phone (smaller, thicker bezels, same dark color) is shown side-by-side for comparison. The newer phone's screen shows a clean benchmark UI with rising numbers. No readable watermark or app icons on screen — abstract numbers and bars only.

★ Scene:
A dark minimalist tech-review setting, single overhead key light illuminating only the phones and the immediate surface, deep black background, a single thin brand-color LED strip light in the back creating a soft accent.

★ Action (1:1 mirror, hard-hitting micro-actions synced to electronic beat):
- 0.0–1.5s (S01-01): wide shot, the new phone sits in silhouette against the dark background, a single brand-color LED strip lights the edge, sleek and minimal.
- 1.5–3.0s (S01-02): overhead medium, a finger presses the power button, the screen lights up with a clean boot animation, a soft "ding" tone.
- 3.0–4.5s (S01-03): close-up of the screen, benchmark numbers rise rapidly (abstract rising bar chart + percentage — no readable app text), numbers hit peak.
- 4.5–6.0s (S01-04): overhead medium-close, a finger taps the under-display fingerprint sensor, a clean "tap" sound, screen unlocks instantly.
- 6.0–7.5s (S01-05): overhead medium, the new phone and older phone side-by-side, both run a benchmark — new phone's number visibly higher, clear visual contrast.
- 7.5–9.0s (S01-06): close-up of the camera module, individual lens elements catch the overhead light, brushed metal texture clearly visible.
- 9.0–10.5s (S01-07): overhead medium, the new phone runs a continuous performance test, numbers scroll rapidly and settle on a peak.
- 10.5–12.0s (S01-08): a hand picks up the phone, holds it naturally, the curved screen and metallic frame catch shifting highlights, premium feel.
- 12.0–14.0s (S01-09): full phone freeze-frame, sleek and centered, ready for the price card overlay.
- 14.0–15.0s (S01-09): static hold on the price-card composition, leaving room for the CTA.

★ Camera language (1:1 mirror, ≤ 2 moves):
- 0.0–1.5s: slow dolly-in from wide to medium, frontal.
- 1.5–3.0s: static overhead medium.
- 3.0–4.5s: slow push-in from medium-close to close.
- 4.5–6.0s: static overhead medium-close.
- 6.0–7.5s: static overhead medium.
- 7.5–9.0s: slow push-in to extreme close-up on the camera.
- 9.0–10.5s: static overhead medium.
- 10.5–12.0s: slow push-in from medium to close on the hand and phone.
- 12.0–15.0s: static medium, hold for the price card.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — single overhead key light at 60° from camera, 5000K cool-neutral, hard edge, deep black background. Secondary brand-color LED accent strip behind. Deep black + metallic silver + tech blue + brand color accent throughout.

★ Audio (downstream soundscape, 1:1 mirror, hard cuts synced):
- Ambient: 0.0–1.5s dark room hum + LED buzz; 1.5–3.0s power-button click + boot "ding"; 3.0–4.5s rising number "tick" tones; 4.5–6.0s fingerprint "tap" + unlock tone; 6.0–7.5s comparison run soft whoosh; 7.5–9.0s lens-focus micro-sound + cool breeze tone; 9.0–10.5s benchmark scroll rapid ticks; 10.5–12.0s hand pick-up + slight frame tap; 12.0–15.0s settle + hold room tone.
- BGM: synth electronic (kick + pulse + bass), 125 BPM, hard-hitting, beat drop at S01-03 peak numbers, sustained through S01-05/S01-07, fade in last 2s.
- No dialogue (visuals + subtitles carry info), no voiceover.

★ Style anchor:
Tech product review commercial, "starts with dark silhouette → peaks with rising benchmark numbers → ends with sleek freeze-frame + price card".

★ Quality:
4K ultra-high definition, sharp focus, hard overhead light, deep contrast.

★ Hard constraints:
— Phone keeps natural shape, no floating, no deformation.
— Screen content is abstract (rising bars + percentage) — no readable text, no readable app icons, no gibberish that looks like real app text.
— All brand/model names in overlays must be exact: [品牌名] [型号] · [参数 1] · [参数 2] (R5 zero-typo).
— Numbers shown on screen (benchmark values, prices) must be exactly as scripted in the overlay — no random digit drift.
— No text, no logo, no watermark, no gibberish UI.
— Stable frame, no flicker, hand and fingers anatomically correct, no extra fingers.
```


