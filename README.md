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

### C2：社区目录（GitHub / Gitee PR 指针仓库）

- **读**：匿名请求目标仓库的 git tree，遍历 `shares/**/<setId>.txt` 指针文件（内容是分享者自持的 zip 公开 URL），合并成社区目录供一键导入。读取途径是 `git/trees/{branch}?recursive=1` + raw 回落，匿名即可。
- **写**：aps 分享者在弹窗里填平台令牌与 zip URL，插件代做 `fork → 写入指针文件 → 提交 PR` 三步（先扫描目录防止同名 setId 冲突，返回 409）。**zip 不入任何仓库**，由分享者自己负责托管 URL。
- 目录目标：`communityDirectory = { owner, repo, provider?, branch?, path?, likesToken? }`（插件设置）。`provider` 选社区平台：`github`（默认）或 `gitee`，未知值回退 github。Gitee 的令牌为**用户授权码（access_token）**，作为查询参数注入；GitHub 则用 fine-grained PAT（`contents: write`）。读写两端（目录快照 + `likes.json` 点赞同步）都按 `provider` 走对应 shim，逻辑复用。
- `likesToken`：服务端部署者提供、用来把聚合点赞计数通过 PR 渠道持久化/同步到 `<path>/likes.json`（非用户手填——点赞匿名触发，无每用户凭据）。

### 点赞记账（三档渐进）

- **T2 默认**：本机 `localStorage` 记录已赞态，显示数 = `max(本机已赞?1:0, 社区总数)`（`mergeLikeCount`）。
- **T3 增强**：若 profile 配了 storage 后端，服务端用 `ctx.storageDomain` durable KV 记账。
- **T1 兜底**：无后端或写失败时回落到进程内内存账本，全程不抛异常、不脏化配置文档。

### 可选：GitHub Actions 自动合入

默认社区目录走**人工审核**（owner 决定是否 merge 每个 PR）。若希望提交后自动上架，由**目标仓库管理员**放置 `.github/workflows/auto-merge.yml`（非插件内置代码，见 `docs/auto-merge.workflow.yml` 模板）：workflow 第一步做 diff 校验闸门（文件仅限 `shares/**`、文件名匹配、内容仅 http(s) URL 白名单、拒绝 `.github/**` 与其他改动），通过后用 `contents: write` 令牌调用 `POST /repos/{o}/{r}/pulls/{n}/merge`，不通过则关闭 PR 并评论。插件既不内置、也不代管、也不绕过该 workflow 与分支保护。

## 更多

参考上游：[dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin)。社区皮肤市场：[dsh-skin-market](https://github.com/kingOfSoySauce/dsh-skin-market)。
