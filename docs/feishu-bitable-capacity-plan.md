# 飞书多维表格免费额度（单表 ~2000 行）扩展预案

- 状态：**预案（书面存档，代码未改）**
- 更新：2026-11-06
- 适用范围：`dsh-flash-skin` 社区目录写入的两类飞书多维表格数据

## 1. 背景与风险

社区目录通过一张外部飞书多维表格（`appToken` + 表 id）承载数据。免费版对**每张表**有约
2000 行的存储上限（行数自助扩容 / 付费权益见飞书官方文档）。本插件涉及两张表：

| 表 | 结构 | 增速 | 撞线风险 |
|----|------|------|----------|
| `sharesTableId` | 一行 / 一个分享集 | 慢（随去重后的分享集增长） | 低，但长期会逼近上限 |
| `feedbackTableId` | 一行 / 一次用户动作（like / unlike / import，只增追加日志） | 快（随每次交互增长） | **高，最先撞线** |

反馈表是**必然只增**的追加日志，即使代码写得再正确也无法避免它增长，因此扩展方案必须以它为主轴。

> 现有基础能力已具备（无需依赖 `dsh-flash`，完全独立）：
> `listAllRecords(client, target, arbitraryTableId)` 任意表分页读、
> `client.createRecord` / `client.deleteRecord`（接受任意 tableId）、
> `likes.js` 中 debounced 定时 flush 调度模式（`scheduleCommunityFlush`）可直接照搬为压实调度器。

## 2. 分层方案（低成本 → 高成本）

### L0 外部开关（兜底，运维动作，不改代码）

- 使用飞书"多维表格行数自助扩容"，或升级到付费套餐。
- 这是最终归宿，但不作为自动化预案的唯一手段（需要人工/付费）。

### L1 反馈表：滚动窗口 + 自动压实（**推荐默认，纯代码、独立**）

原理：让原始行只保留一个**有界热窗口**，历史数据以紧凑汇总留存。

1. 在每次 `recordCommunityFeedback` 追加写之后，触发一个 **debounced 压实任务**
   （复用 `scheduleCommunityFlush` 式调度器，仅在接近阈值时才真正调度）。
2. 压实任务流程：
   - `listAllRecords` 读取全部 feedback 行；
   - 按 `created_at` 切分：**热窗口**（保留期内，如 90 天）仍保留为原始行；
   - **旧行聚合**为紧凑汇总（如按 peer × action 计数，或按日粒度计数），行数骤降 2~3 个数量级；
   - 汇总行写入**独立的 `feedbackSummaryTableId` 汇总表**（见下文裁决）；
   - 逐个 `deleteRecord` 已归档的旧原始行（限流、小并发、best-effort、`.catch` 绝不影响写路径）。
3. 效果：单表始终低于 2000 软上限；热数据全量、冷数据聚合留存，**历史不丢**。

**裁决（已定）**：汇总数据写入**新建独立的 `feedbackSummaryTableId`**，与原始表解耦，便于后续演进；
实现时在 `communityDirectory` 配置中新增可选字段 `feedbackSummaryTableId`（沿用现有
`pick()` 缺省穿透机制），并给 `recordCommunityFeedback` 之后接入压实调度器。

### L2 分表 / 按时间轮转（更高强度，需新增基表接口）

- 当单表逼近上限或跨时段时，推进到**新日期分表**；旧分表停止接收写入，并归档到飞书云盘 / 导出。
- 需要给 provider 新增基表接口 `listTables` / `createTable`，并维护一份"当前分表指针"元数据记录。
- 适合总流水很大的场景，运维成本最高。

### 配套：Shares 表轻量归档

- 定期清理 / 归档长期无动作的旧分享集（例如 0 赞且创建超过 N 个月），避免历史集数量缓慢逼近上限。

## 3. 落地顺序与验收

1. **（本次已交付）** 书面方案存档于本文件。
2. 需要时按 L1 实现：新增 `feedbackSummaryTableId` 配置项 → 压实调度器 → 聚合写入独立汇总表
   → 归档删除旧原始行。完成后 `node ./scripts/build-client.mjs`（如涉及 client）再 `npm test` 保持全绿。
3. 流水更大再评估 L2 分表轮转。
