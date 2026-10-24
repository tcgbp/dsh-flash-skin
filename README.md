# dsh-flash-skin（Flash Skin）

轻量渐变动效皮肤，复刻 [dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin) 的插件结构与契约。为 DeepSeek Harness 提供一个可选的、随思考等级滑动的渐变色皮肤；**默认关闭，需在「设置 → 外观」手动开启**。

## 特性

- 服务端 host 插件：注册 `/plugins/dsh-flash-skin/assets` 静态路由挂载点。
- 浏览器端 client 插件：向「设置 → 外观」注入第四个外观选项（Flash Skin），并向外观下方的输入区注入一个强度滑块。
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
| `src/index.js` | host 端入口：`webServer` 静态路由 |
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

## 更多

参考上游：[dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin)。社区皮肤市场：[dsh-skin-market](https://github.com/kingOfSoySauce/dsh-skin-market)。
