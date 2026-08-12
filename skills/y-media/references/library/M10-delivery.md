# M10. delivery · Provider 交付(交付)

> **定位**:y-media 的**交付层**。定义视频 brief 生成到落地产物的全过程:Provider 参数 + 视频基线参数 + 调用流程 + 结果下载与验证。

---

## §1 视频基线参数(5 配 · 改场景时优先调)

> **本节定位**: y-media 默认的视频基线参数(展示层);**Provider 实际能力上限**以 §2 `capability_limits` 为准。

| 维度 | 默认值(改场景时优先调) | 备注 |
| --- | --- | --- |
| 画幅 | 9:16 (竖屏) | 横屏改 16:9 / 1:1 视 brief |
| 时长 | 15s | 单段硬上限见 §2 `maxSingleSegmentDuration` |
| 帧率 | 24 fps,快门 180° | 升格镜 60/120fps |
| 帧数 | 361 (= 8×45+1) | 帧数硬上限见 §2 `maxFrames`(当前 441) |
| 镜头数 | 与分镜镜号 1:1 对应 | N 镜 → N 个时间锚点(执行层;不主动合并,见 M1 §5) |

> **修改优先级**:**画幅 / 时长** 最先调(影响最大),其次是**帧率**(升格镜),**镜头数**通常由分镜表决定。

---

## §2 Provider 关键参数(真相源 = `capability_limits`)

下表的数值仅作 **当前快照**,**权威值**来自 `listCapabilities` 输出中的 `providers[].capability_limits[capability]` 字段(注册在 [providers/manifest.cjs](../../providers/manifest.cjs) 的 `capability_limits` 段)。**禁止把表里的数字硬编码到 prompt / 分镜表 / 决策树中**。

| 项 | 值(快照) | 权威源 |
| --- | --- | --- |
| Provider | agnes(y-media 已注册) | manifest `id` |
| Model | agnes-video-v2.0 | `supports()` 校验,不进 manifest |
| 默认画幅 | 1152×768(横屏) / 竖屏建议 720×1280 | `supports()` 默认值 |
| 默认帧数/帧率 | 121 / 24fps | `capability_limits[<capability>].maxFrames` / `defaultFrameRate` |
| 帧数硬上限 | 441(8n+1) | `capability_limits[<capability>].maxFrames` + `frameCountRule` |
| 单段硬上限 | ~18s | `capability_limits[<capability>].maxSingleSegmentDuration` |
| 帧率范围 | 1-60 fps | `capability_limits[<capability>].minFrameRate` / `maxFrameRate` |
| 常用规划刻度 | 15s(留 3.4s 安全裕量到 18s 硬上限) | 派生:封顶 - 10% |
| 15s 帧数 | 361(=8×45+1) | 派生:(秒数 × fps − 1) 满足 8n+1 |
| 18s 帧数(封顶档) | 433(=8×54+1,接近 441 硬上限) | 派生:同上 |
| 多段接续能力 | keyframes-to-video:首帧=前段末帧,Provider 内部接续 | `capability_limits['keyframes-to-video']` |
| 拆分前行为 | 见 M1 §5:生成前先问用户 split-or-merge | — |
| 输入形态 | text-to-video / image-to-video / keyframes-to-video | `capability_limits[*].requiresImageInput(s)` |
| 关键限制 | 本地路径/Data URI 不支持,必须公网 HTTPS URL | `supports()` |

### 2.1 读取 `capability_limits` 的方式

通过 `listCapabilities` 获取,输出形如:

```json
{
  "ok": true,
  "providers": [
    {
      "id": "agnes",
      "enabled": true,
      "priority": 100,
      "capabilities": ["text-to-video", "image-to-video", "keyframes-to-video"],
      "capability_limits": {
        "text-to-video": {
          "maxSingleSegmentDuration": 18,
          "maxFrames": 441,
          "defaultFrameRate": 24,
          "minFrameRate": 1,
          "maxFrameRate": 60,
          "supportedAspectRatios": ["16:9", "9:16", "1:1", "destination4:3", "3:4"],
          "frameCountRule": "8n+1"
        }
      }
    }
  ]
}
```

### 2.2 未来 Provider 的注册样板(Seedance 2.5 / Wan3.0 / Sora 1.0 / Veo 2.0)

| Provider | maxSingleSegmentDuration | maxFrames | frameCountRule |
| --- | --- | --- | --- |
| Agnes video v2.0(已注册) | 18s | 441 | 8n+1 |
| Seedance 2.5(强 i2v,音画同出) | 30s | 721(推算) | 8n+1(推算) |
| Wan3.0(多模态参考,4K 直出) | 30s | 721(推算) | 8n+1(推算) |
| Sora 1.0(长段支持好) | 20s | 481 | 8n+1 |
| Veo 2.0(短段细节好) | 8s | 193 | 8n+1 |

这些数**不写进文档**,只作为新 Provider 注册到 `manifest.cjs` 的 `capability_limits` 时的参考值。标注"(推算)"的值(Seedance 2.5 / Wan3.0)基于公开能力信息估算,注册前须以官方 API 文档核实。

### 2.3 Provider 选型决策

| 需求 | 首选 Provider | 理由 |
| --- | --- | --- |
| 中文 prompt 友好 | Wan / Seedance | 训练语料中文占比高 |
| 长段(>15s) | Seedance 2.5 / Wan3.0 | 单段可达 30s |
| 强 i2v 锁定 | Seedance | i2v 精度高,识别低角度 |
| 音画同出 | Seedance 1.5 Pro+ | 支持方言/音效/对白 |
| 短段 8s 极致 | Veo | 8s 段细节好 |
| y-media 默认 | Agnes | 已注册,即用 |

---

## §3 提交流程(过审 → 调用 → 轮询)

### 3.1 提交命令

```bash
# 通过 core/orchestrator.cjs 提交
node core/orchestrator.cjs submit <name>.video-brief.md

# 查询/下载
node core/orchestrator.cjs status <task_id>
node core/orchestrator.cjs download <task_id> --out ./out/
```

完整契约见 [../../core/provider-contract.md](../../core/provider-contract.md);运行时由 `core/orchestrator.cjs` 统一处理 Provider 选择、提交、轮询、产物保存。

### 3.2 提交后三态(轮询)

| 状态 | 含义 | y-media 动作 |
| --- | --- | --- |
| `pending` / `processing` | Provider 仍在处理 | 继续轮询,默认间隔 5s(可在 contract 调整) |
| `succeeded` | 已生成,产物 URL 可下载 | 立即下载到本地,落 `<name>.mp4`,在侧车追加 `## Generation` 段 |
| `failed` / `rejected` | Provider 拒绝或失败 | 读取错误分类(网络/参数/内容/额度),按 [provider-contract.md](../../core/provider-contract.md) 错误码表决定重试或放弃 |

### 3.3 多段交付(N 段独立)

当 brief 触发 split-or-merge 确认门(见 M1 §8)且用户选择"分开"时:

- 每段独立提交,**独立 task_id**
- 侧车 `## Generation` 段记录每段的 task_id、Provider、参数、产物路径
- 不在 skill 内部尝试合并(运行时无 ffmpeg 假设)
- 用户选择"合并"时,侧车追加拼接菜谱(CapCut / iMovie / ffmpeg 三选一),由用户自拼

---

## §4 结果验证(下载后)

下载完成后,逐条校验:

| 检查项 | 期望 | 不达标时 |
| --- | --- | --- |
| **文件存在** | `<name>.mp4` 落盘 | 重试下载 → 失败则报 task_id 与 Provider |
| **文件大小** | > 0 字节;典型 15s 视频 1-5 MB | 文件为空 = Provider 返回异常,重提 |
| **MIME 类型** | `video/mp4` | 不是 mp4 = 落 `unknown` 并报告 |
| **时长** | 与分镜表加和一致(±0.5s) | 不一致 = Provider 截断或拼接异常,重提或人工剪辑 |
| **宽高** | 符合 `parameters.width/height`(默认 720×1280) | 不符 = Provider 默认尺寸覆盖,记录警告 |
| **帧率** | `defaultFrameRate` ± 1 | 异常 = Provider 升/降帧,记录警告 |
| **内容核对** | 人工/AI 抽检:首镜主体、末镜 CTA、关键卖点镜 | 漂移 = 见 M9 重提或转人工剪辑 |

> **不推断**: 任何"未知"字段保持 `unknown` 或省略;**不得**从文件名、默认值或不完整的 Provider 响应推断实际值。

---

## §5 兜底与重试

### 5.1 重试策略

| 错误类型 | 动作 |
| --- | --- |
| 网络超时 / 5xx | 指数退避重试 3 次(2s / 4s / 8s) |
| 参数错误 4xx | 不重试;按 provider-contract 错误码表读 `message`,修正 brief 后重提 |
| 内容审核拒绝 | 不重试;报告 task_id 与 Provider 反馈,人工改写 prompt |
| 额度耗尽 | 立即停止后续任务,报告当前剩余额度(若 Provider 返回) |

### 5.2 任务恢复

- 同一 task_id 可被 `statusMedia` 轮询或 `waitMedia` 等待
- Provider 切换:只在 `create()` 之后收到 `accepted: false` 时允许切换 Provider;已创建的任务永远固定在原 Provider + 原 task_id
- 侧车不可用时,`## Generation` 段标记为 `unavailable`,不重建未经证实的事实

### 5.3 产物落盘

- 由 `core/artifacts.cjs` 处理:校验公共 URL → 原子保存下载内容 / Base64 / 字节
- 视频产物路径:与 `<name>.video-brief.md` 同目录,文件名 `<name>.mp4`
- 侧车写入失败**永远不会**触发新的生成请求

---

## §6 跨文件导航

| 想了解什么 | 去哪 |
| --- | --- |
| 路径判定(G/E/H,决策一次不切换) | M1 §3 |
| 单段封顶与 split-or-merge 确认门 | M1 §8 |
| 6 大模型能力缺陷(M1-M6) | M8 §1 |
| 时间表达方式(3 种) | M8 §2 |
| 提交前自检清单(过审过门) | M8 §3 |
| 分镜漂移预防(4 类 + 5 招) | M9 |
| Provider 注册 / 凭证 / 端点 | [providers/manifest.cjs](../../providers/manifest.cjs) + [providers/agnes/api.md](../../providers/agnes/api.md) |
| 公共请求/结果/错误契约 | [core/provider-contract.md](../../core/provider-contract.md) |
| 提交/状态/下载命令 | [core/orchestrator.cjs](../../core/orchestrator.cjs) |
