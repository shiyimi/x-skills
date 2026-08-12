# 镜头现实性计算器

> 本文件是 [storyboard-methodology.md](storyboard-methodology.md) §7 的独立工具集:**镜头现实性决策 + 帧数自动校验 + Provider 能力速查**。
>
> 写完分镜表后,用本文件的决策表判断能否单段直出;用 Node 校验帧数合规;用 Provider 速查表确认模型支持。
>
> **Provider 限制(单段时长上限、帧数上限、frameCountRule)以 [`capability_limits`](../../providers/manifest.cjs) 为权威源**;通过 `listCapabilities` 取最新值。本文件中的数字只作规划刻度参考,**不写进 prompt / storyboard**。

---

## 1. 镜头现实性决策表

### 1.1 单段直出 vs 多段拼接

> 硬上限随 Provider 变,以 `capability_limits[<capability>].maxSingleSegmentDuration` 为准(见 §3 速查);下面数字仅作规划刻度参考。

| 条件 | 单段直出 | 多段拼接 |
| --- | --- | --- |
| 总时长 ≤5s | ✓ | — |
| 总时长 5-10s + 镜头 ≤3 | ✓ | — |
| 总时长 10-15s + 镜头 ≤3 | ✓ (默认规划刻度) | 也可多段 |
| 总时长 10-15s + 镜头 4-6 | ⚠️ 风险高 | ✓ 推荐 |
| 总时长 15s - `maxSingleSegmentDuration` + 镜头 ≤3 | ✓ | 也可多段 |
| 总时长 > `capability_limits[<capability>].maxSingleSegmentDuration` | ✗ 必拆,**生成前先问用户**(用 AskUserQuestion 二选一) | 走 [§7.1 split-or-merge 确认门](storyboard-methodology.md) |
| 镜头数 9-12 (骨架A 快切) | ✗ 必拆 | ✓ 多段+剪辑 |

### 1.2 时长 vs 镜头数决策树

```
输入: 目标时长 T + 镜头数 N
  │
  ├─ T ≤ 5s?
  │    ├─ 是: N ≤ 2 → 单段直出
  │    └─ N > 2 → 拆分为多段或减镜头
  │
  ├─ 5 < T ≤ 10s?
  │    ├─ N ≤ 3 → 单段直出
  │    └─ N > 3 → 拆/减
  │
  ├─ 10 < T ≤ 15s? (默认规划刻度)
  │    ├─ N ≤ 3 → 单段直出 (推荐,默认)
  │    ├─ N = 4 → 谨慎,可单段
  │    └─ N ≥ 5 → 必须多段拼接
  │
  ├─ 15 < T ≤ capability_limits.maxSingleSegmentDuration? (封顶档)
  │    ├─ N ≤ 3 → 单段直出
  │    └─ N > 3 → 必须多段
  │
  └─ T > capability_limits[<capability>].maxSingleSegmentDuration? → **必拆;生成前先问用户 split-or-merge(见 [§7.1](storyboard-methodology.md))**
```

### 1.3 镜头数超限的常见症状

| 症状 | 根因 | 修复 |
| --- | --- | --- |
| 6 镜塌缩成 1-2 景别 | 超模型执行窗口 (M1) | 砍到 3 段时间锚点 |
| 中间画面静止 | 镜头数过多,生成预算不足 | 减镜头或拆段 |
| 主体漂移/变形 | 跨镜头压力 | 锁主体描述词,i2v 优先 |
| 时长生成被截 | 帧数超 `capability_limits.maxFrames` 上限 | 拆段或减时长 |

详见 [t2v-model-capability.md](t2v-model-capability.md) M1。

---

## 2. 帧数校验(8n+1 规则)

### 2.1 规则

主流 t2v 模型(Agnes/Seedance/Wan/Sora/Veo)的帧数约束以 [`capability_limits`](../../providers/manifest.cjs) 为准:

```
约束 1: 帧数 ≤ capability_limits[<capability>].maxFrames
约束 2: 帧数满足 capability_limits[<capability>].frameCountRule (如 8n+1, n = 0,1,2,...)
```

读法: 通过 `listCapabilities` 读取 `providers[].capability_limits`

### 2.2 帧数速查(以 Agnes 24fps 为例,其他 Provider 见 capability_limits)

| 时长 @24fps | 帧数 | 合规 | 角色 |
| --- | --- | --- | --- |
| 5s | 121 | ✓ (8×15+1) | 最小叙事单元 |
| 10s | 241 | ✓ (8×30+1) | — |
| 15s | 361 | ✓ (8×45+1) | **默认规划刻度**(留 3.4s 裕量到 18s 封顶) |
| 18s | 433 | ✓ (8×54+1) | **封顶档**(接近 441 硬上限) |
| 18.375s | 441 | ✓ (8×55+1) | 理论极限 |
| 20s | 481 | ✗ 超 Agnes 441 上限 | 必拆 |

### 2.3 Node 自动校验(从 `capability_limits` 读上限,不写死 441)

```js
// 校验总帧数是否合规: 满足 frameCountRule 且 ≤ maxFrames
// 用法: node -e "const f = require('fs').readFileSync(0, 'utf8'); eval(f);" < 本文件代码段
// 更简: 直接复制以下代码到独立 .cjs 文件, 填入从 listCapabilities 读到的 capability_limits
function validateFrames(durationSec, { fps = 24, capabilityLimits = {} } = {}) {
  const maxFrames = capabilityLimits.maxFrames ?? 441;
  const rule = capabilityLimits.frameCountRule ?? '8n+1'; // 默认 8n+1
  const n = Math.round(durationSec * fps);
  const compliantRule = (n - 1) % 8 === 0; // 当前仅支持 8n+1
  const compliantMax = n <= maxFrames;
  return {
    durationSec,
    fps,
    rawFrames: n,
    compliant8n1: compliantRule,
    compliantMax,
    maxFrames,
    frameCountRule: rule,
    nearestValid8n1: compliantRule ? n : 8 * Math.round(n / 8) + 1,
    suggestedDurationSec: (8 * Math.round(n / 8) + 1) / fps
  };
}

// 使用示例: 传入从 listCapabilities 获取的 capability_limits
const limits = { maxFrames: 441, frameCountRule: '8n+1', maxSingleSegmentDuration: 18 };
console.log(validateFrames(15.0, { capabilityLimits: limits })); // 原始 360, 校正为 361(合规)
console.log(validateFrames(18.0, { capabilityLimits: limits })); // 原始 432, 不满足 8n+1, 校正为 433
console.log(validateFrames(20.0, { capabilityLimits: limits })); // 原始 480, 超 441 上限, 必拆
```

### 2.4 校验失败时

| 失败原因 | 修复方案 |
| --- | --- |
| 不满足 `frameCountRule` | 微调时长到最近合规值(如 15.0s → 15.04s = 361 帧) |
| 帧数 > `capability_limits[<capability>].maxFrames` | 必拆;**生成前先问用户**走 [§7.1 split-or-merge 确认门](storyboard-methodology.md)(① 分开独立 / ② 合并+菜谱);不在 skill 内部合并 |
| 时长 ≠ 用户预期 | 优先满足 `frameCountRule`,在 ±0.5s 内调整 |

---

## 3. Provider 能力速查

> **以 `listCapabilities` 输出为准**。本表只列**未来 Provider 注册时的参考值**,数字以 `capability_limits` 声明为准。

### 3.1 主流 t2v Provider 横向对比

| Provider | Model | 默认尺寸 | 默认 fps | 单段最长 (`maxSingleSegmentDuration`) | 帧数上限 (`maxFrames`) | 音频生成 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Agnes** | agnes-video-v2.0 | 1152×768 横 / 720×1280 竖 | 24 | 18s | 441 | ✗ | y-media 默认(已注册) |
| **Seedance** | seedance-2.5 | 1024×1024 / 720×1280 | 24 | 30s | 721(推算) | ✓(1.5 Pro 起音画同出) | 强 i2v,识别低角度精准;支持方言/音效 |
| **Wan** | wan-3.0 | 1280×720 / 720×1280 | 24 | 30s | 721(推算) | ✗ | 中文友好,多模态参考,4K 原生直出 |
| **Sora** | sora-1.0 | 1920×1080 / 1080×1920 | 24 | 20s | 481 | ✗ | 长段支持好 |
| **Veo** | veo-2.0 | 1920×1080 / 1080×1920 | 24 | 8s | 193 | ✗ | 8s 限制 |

> 注:Seedance 2.5 / Wan3.0 的 30s 与帧数上限为**推算参考值**(按 8n+1),注册到 manifest 时以官方文档为准;`maxFrames` 权威值来自 `capability_limits`。

### 3.2 关键限制

| 限制 | 所有 Provider 共性 |
| --- | --- |
| **音频生成** | 仅对不支持音频的 Provider 成立(Agnes 当前如此)→ 音频进 `Notes for downstream audio`;Seedance 1.5 Pro/2.5 等支持音画同出,接入时重新评估 |
| **本地路径** | 不支持,必须公网 HTTPS URL |
| **Data URI** | 不支持 |
| **单段 6 镜塌缩** | 全行业现象 → 限 ≤3 镜 |
| **数字参数** | 全部忽略 → 展示层/执行层分离 |
| **真人脸** | 全部高风险 → 强 i2v |

### 3.3 Provider 选型决策

| 需求 | 首选 Provider | 理由 |
| --- | --- | --- |
| 中文 prompt 友好 | Wan / Seedance | 训练语料中文占比高 |
| 长段(>15s) | Seedance 2.5 / Wan3.0 | 单段可达 30s |
| 强 i2v 锁定 | Seedance | i2v 精度高,识别低角度 |
| 音画同出 | Seedance 1.5 Pro+ | 支持方言/音效/对白 |
| 短段 8s 极致 | Veo | 8s 段细节好 |
| y-media 默认 | Agnes | 已注册,即用 |

详见 [t2v-model-capability.md](t2v-model-capability.md) §5 Agnes 关键参数 + Provider 速查。

---

## 4. 自检流程(提交生成前)

```
1. 读 capability_limits: 通过 `listCapabilities` 拿到 `maxSingleSegmentDuration` / `maxFrames` / `frameCountRule`
2. 用决策树判断: 单段直出 vs 多段拼接?
3. 用 Node 校验: 帧数 ≤ maxFrames 且满足 frameCountRule?
4. 用 Provider 速查: 选定 Provider,确认能力匹配?
5. 用 F1-F12 评分卡(见 influence-factors.md)打分: ≥90 可提交
6. 用 M1-M6 自检清单(见 t2v-model-capability.md §6)过一遍
7. 超 maxSingleSegmentDuration 时,生成前用 AskUserQuestion 走 split-or-merge 确认门
```

任一不达标则修复后再提交。
