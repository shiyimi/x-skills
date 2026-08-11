# 镜头现实性计算器 · Storyboard Reality Calculator

> 本文件是 [storyboard-methodology.md](storyboard-methodology.md) §7 的独立工具集:**镜头现实性决策 + 帧数自动校验 + Provider 能力速查**。
>
> 写完分镜表后,用本文件的决策表判断能否单段直出;用 Python 校验帧数合规;用 Provider 速查表确认模型支持。

---

## 1. 镜头现实性决策表

### 1.1 单段直出 vs 多段拼接

| 条件 | 单段直出 | 多段拼接 |
| --- | --- | --- |
| 总时长 ≤5s | ✓ | — |
| 总时长 5-10s + 镜头 ≤3 | ✓ | — |
| 总时长 10-15s + 镜头 ≤3 | ✓ (默认规划刻度) | 也可多段 |
| 总时长 10-15s + 镜头 4-6 | ⚠️ 风险高 | ✓ 推荐 |
| 总时长 15-18s + 镜头 ≤3 | ✓ (封顶档,433 帧,接近 441 硬上限) | 也可多段 |
| 总时长 >18s | ✗ 必拆,但**未经用户确认前不提交** | 走 [§7.1 三选一确认门](../../storyboard-methodology.md) |
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
  ├─ 15 < T ≤ 18s? (封顶档,接近 441 硬上限)
  │    ├─ N ≤ 3 → 单段直出 (433 帧,封顶档)
  │    └─ N > 3 → 必须多段
  │
  └─ T > 18s? → **必拆,但先经用户确认(见 [§7.1 三选一确认门](../../storyboard-methodology.md));不自动提交**
```

### 1.3 镜头数超限的常见症状

| 症状 | 根因 | 修复 |
| --- | --- | --- |
| 6 镜塌缩成 1-2 景别 | 超模型执行窗口 (M1) | 砍到 3 段时间锚点 |
| 中间画面静止 | 镜头数过多,生成预算不足 | 减镜头或拆段 |
| 主体漂移/变形 | 跨镜头压力 | 锁主体描述词,i2v 优先 |
| 时长生成被截 | 帧数超 441 上限 | 拆段或减时长 |

详见 [t2v-model-capability.md](../../t2v-model-capability.md) M1。

---

## 2. 帧数校验(8n+1 规则)

### 2.1 规则

主流 t2v 模型(Agnes/Seedance/Wan/Sora/Veo)的帧数约束:

```
约束 1: 帧数 ≤ 441
约束 2: 帧数满足 8n + 1 规则 (n = 0,1,2,...)
```

### 2.2 帧数速查

| 时长 @24fps | 帧数 | 合规 | 角色 |
| --- | --- | --- | --- |
| 5s | 121 | ✓ (8×15+1) | 最小叙事单元 |
| 10s | 241 | ✓ (8×30+1) | — |
| 15s | 361 | ✓ (8×45+1) | **默认规划刻度**(留 3.4s 裕量) |
| 18s | 433 | ✓ (8×54+1) | **封顶档**(接近 441 硬上限) |
| 18.375s | 441 | ✓ (8×55+1) | 理论极限 |
| 20s | 481 | ✗ 超 441 上限 | 必拆 |

### 2.3 Python 自动校验

```python
def validate_frames(duration_sec: float, fps: int = 24, max_frames: int = 441) -> dict:
    """校验总帧数是否合规: 8n+1 且 ≤ max_frames"""
    n = round(duration_sec * fps)
    mod = (n - 1) % 8
    compliant_8n1 = (mod == 0)
    compliant_max = (n <= max_frames)
    return {
        "duration_sec": duration_sec,
        "fps": fps,
        "raw_frames": n,
        "compliant_8n1": compliant_8n1,
        "compliant_max": compliant_max,
        "nearest_valid_8n1": 8 * round(n / 8) + 1 if not compliant_8n1 else n,
        "suggested_duration_sec": (8 * round(n / 8) + 1) / fps,
    }

# 使用示例
print(validate_frames(15.0))   # 361, 全部合规
print(validate_frames(18.0))   # 432, 不满足 8n+1
print(validate_frames(20.0))   # 480, 超 441
```

### 2.4 校验失败时

| 失败原因 | 修复方案 |
| --- | --- |
| 不满足 8n+1 | 微调时长到最近合规值(如 15.0s → 15.04s = 361 帧) |
| 帧数 > 441 | 必拆;先经用户确认走 [§7.1 三选一确认门](../../storyboard-methodology.md)(压缩/keyframes-to-video/用户自拼);不在 skill 内部合并 |
| 时长 ≠ 用户预期 | 优先满足 8n+1,在 ±0.5s 内调整 |

---

## 3. Provider 能力速查

### 3.1 主流 t2v Provider 横向对比

| Provider | Model | 默认尺寸 | 默认 fps | 单段最长 | 8n+1 | 音频生成 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Agnes** | agnes-video-v2.0 | 1152×768 横 / 720×1280 竖 | 24 | ~18s | ✓ | ✗ | y-media 默认 |
| **Seedance** | seedance-2.0 | 1024×1024 / 720×1280 | 24 | ~15s | ✓ | ✗ | 强 i2v,识别低角度精准 |
| **Wan** | wan-2.x | 1280×720 / 720×1280 | 24 | ~15s | ✓ | ✗ | 中文友好 |
| **Sora** | sora-1.0 | 1920×1080 / 1080×1920 | 24 | ~20s | ✓ | ✗ | 长段支持好 |
| **Veo** | veo-2.0 | 1920×1080 / 1080×1920 | 24 | ~8s | ✓ | ✗ | 8s 限制 |

### 3.2 关键限制

| 限制 | 所有 Provider 共性 |
| --- | --- |
| **音频生成** | 都不生成分时音频 → 全部进 `Notes for downstream audio` |
| **本地路径** | 不支持,必须公网 HTTPS URL |
| **Data URI** | 不支持 |
| **单段 6 镜塌缩** | 全行业现象 → 限 ≤3 镜 |
| **数字参数** | 全部忽略 → 展示层/执行层分离 |
| **真人脸** | 全部高风险 → 强 i2v |

### 3.3 Provider 选型决策

| 需求 | 首选 Provider | 理由 |
| --- | --- | --- |
| 中文 prompt 友好 | Wan / Seedance | 训练语料中文占比高 |
| 长段(>15s) | Sora | 单段可达 20s |
| 强 i2v 锁定 | Seedance | i2v 精度高,识别低角度 |
| 短段 8s 极致 | Veo | 8s 段细节好 |
| y-media 默认 | Agnes | 已注册,即用 |

详见 [t2v-model-capability.md](../../t2v-model-capability.md) §5 Agnes 关键参数 + Provider 速查。

---

## 4. 自检流程(提交生成前)

```
1. 用决策树判断: 单段直出 vs 多段拼接?
2. 用 Python 校验: 帧数 ≤ 441 且满足 8n+1?
3. 用 Provider 速查: 选定 Provider,确认能力匹配?
4. 用 F1-F12 评分卡(见 influence-factors.md)打分: ≥90 可提交
5. 用 M1-M6 自检清单(见 t2v-model-capability.md §6)过一遍
```

任一不达标则修复后再提交。
