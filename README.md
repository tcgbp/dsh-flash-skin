# dsh-flash-skin（Flash Skin）

轻量渐变动效皮肤，复刻 [dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin) 的插件结构与契约。为 DeepSeek Harness 提供一个可选的、随思考等级滑动的渐变色皮肤；**默认关闭，需在「设置 → 外观」手动开启**。

## 特性

- 服务端 host 插件：注册 `/plugins/dsh-flash-skin/attachment` 导入与图片托管路由（从压缩包导入肖像组），外加 `/plugins/dsh-flash-skin/examples`（内置示例压缩包）与 `/plugins/dsh-flash-skin/archive?url=`（任意网络压缩包代理抓取）两条网络导入路由。
- 浏览器端 client 插件：向「设置 → 外观」注入第四个外观选项（Flash Skin），并向外观下方的输入区注入一个强度滑块；肖像组配置卡提供「内置示例包」一键导入与「从网络导入任意压缩包 URL」两个网络导入入口。
- 纯 CSS 渐变色板（浅色 ↔ 深色），通过 `--dsw-alias-*` 主题 token 覆盖宿主界面。

## 本地安装（开发迭代）

```sh
# 在插件仓库内构建 client bundle
cd dsh-flash-skin
npm install
npm run build

# 从仓库根目录安装到 web profile（相对路径按运行目录解析）
dsh plugin --profile web add .
```

安装后可查看是否注册成功：

```sh
dsh --profile web --dump-config | grep -B1 -A2 flash-skin
```

> 安装会改写磁盘配置；**完全退出并重新打开 DSH Web** 后生效（替换已安装包需重启才能载入新的 JS 模块代）。

## 开发

| 文件 | 作用 |
| --- | --- |
| `src/index.js` | host 端入口：portrait 组镜像 + attachment 归档导入/托管路由 |
| `src/client/index.tsx` | client 入口：应用样式、注入外观项与滑块 |
| `src/client/appearance.ts` | 注入原生外观第四选项 |
| `src/client/logic.ts` | 色板计算 |
| `src/client/skin.css` | 皮肤样式（CSS 文本，经 esbuild 内联） |
| `scripts/build-client.mjs` | 用 esbuild 把 `src/client/index.tsx` 打包成 `lib/client.js` |
| `cordis.patch.yml` | bundle 层插入条目（`id` 即 settings 命名空间） |

## 契约要点

- 插件导出 `name` + `apply(ctx, config)`（+ `inject`）。
- `dsh.client.inject` 声明 client 依赖的服务注入；`exports["./client"]` 指向打包产物。
- client 只渲染 slot 里的 React 组件；本插件注册 `settings.general.item`（外观选项）与 `conversation.input.right`（滑块）两类 slot。

## 分享 + 点赞（社区）

插件提供两条社区渠道，内容共建都走「服务 seam」，绝不直写用户的持久化配置：

### C1：自包含文本分享（零状态、跨设备）

每个肖像组可以打包成**一段自包含文本**：第一行是 manifest 头部 JSON，随后是整组图片字节的 base64url（经 zip 压缩）。接收方把文本粘贴进导入框即可重建整组（ID、中英文名、深浅切换点全在头部里）。实现见 `src/client/logic.ts` 的 `buildShareText` / `parseShareText`。文本可任意大（上限 8 MiB），存入剪贴板发送给朋友即可，不依赖任何后端。

### C2：社区目录（可插拔后端 — 飞书多维表格）

- **可插拔后端**：目录/点赞通道经 `COMMUNITY_PROVIDERS` + `createCommunityClient(provider, fetch)` 这一 provider seam 抽象；当前唯一随附后端为 **飞书 Bitable**（`provider: "feishu"`，未知值一律回退 feishu）。换后端只需 plug 一个满足同一读写面的 provider。
- **读**：匿名请求 Bitable 分享表（`shares`，列 `entryId/setId/url/md5`），分页列出全部记录，合并成社区目录供一键导入。
- **写**：分享者只需在弹窗填 **zip 的公开 URL**（无需任何令牌）；插件先扫描目录防同名 `setId` 冲突（返回 409），再经服务端代理创建一条分享记录。**zip 不入任何表**，由分享者自己托管 URL。
- **忠实指纹（防篡改）**：分享提交时，服务端**下载该 url 当前指向的压缩包并计算 MD5**（`computeUrlMd5`，失败即拒绝本次分享），随记录写入 `md5` 列；`readCommunityDirectory` 把该指纹带进目录条目。分享者之后若改挂 url 指向另一份 zip，导入者拿到的文件指纹会与表内不一致。
- **导入核对**：从社区面板导入某条分享时，前端把该条目的 `md5` 作为期望指纹传给 `/archive` 代理；服务端下载后在 `X-Archive-Md5` 响应头回传实际指纹，前端比对——**不一致则拒绝导入并提示「内容可能被改动」**。地址栏直接粘贴 url（无期望指纹可核）则跳过该校验。
- 服务端持有飞书应用凭据，换取并缓存短时效的 `tenant_access_token`（提前 60s 刷新）用于每次 Bitable 调用——**凭据绝不下发到客户端 bundle**，匿名访问者零凭据、zero-dependency（standalone 安全）。
- 目录目标配置（插件设置的 `communityDirectory`）：`{ provider?, appId, appSecret, appToken, sharesTableId, likesTableId? }`。`appToken` 是 Bitable base 的 (bitable_token)；`sharesTableId`/`likesTableId` 分别是对应表的 table_id。

### 点赞记账（三档渐进）

- **T2 默认**：本机 `localStorage` 记录已赞态，显示数 = `max(本机已赞?1:0, 社区总数)`（`mergeLikeCount`）。
- **T3 增强**：若 profile 配了 storage 后端，服务端用 `ctx.storageDomain` durable KV 记账。
- **T1 兜底**：无后端或写失败时回落到进程内内存账本，全程不抛异常、不脏化配置文档。

### 可选：GitHub Actions 自动合入

> 已随 GitHub/Gitee 后端一并移除，本节不再适用。

## 更多

参考上游：[dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin)。社区皮肤市场：[dsh-skin-market](https://github.com/kingOfSoySauce/dsh-skin-market)。
