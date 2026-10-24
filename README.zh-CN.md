# DSH Achievement Journal
**把 DSH 运行中的小瞬间，收成一枚枚徽章。** 一个真正接入 DeepSeek Harness 生命周期的 Cordis 原生插件。

[English](README.md) · MIT · Node.js 22+ · 插件零运行依赖

![离线模拟成就簿](docs/assets/gallery-desktop.png)

## 一分钟试玩
安装 Git 和 Node.js 22+ 后，运行：

```sh
git clone https://github.com/Euphoria2586/dsh-achievement-journal.git
cd dsh-achievement-journal
node cli.mjs serve
```

打开 <http://127.0.0.1:4187> 就能试玩。不用 Git 也可以点 **Code → Download ZIP**，解压后在目录里运行 `node cli.mjs serve`。试玩不需要账号、API Key 或安装依赖。先试试手感，想接入自己的 DSH 时再按下方步骤安装。

## 在 DSH 中安装
目标版本为 **@deepseek-ai/dsh 0.2.1-rc.2**。在本项目目录运行：
```sh
node setup.mjs --write ./cordis.yml
npx @deepseek-ai/dsh@0.2.1-rc.2 web --patch ./cordis.yml --no-open
```
DSH 宿主需单独安装或通过 npx 获取。setup 生成指向当前 `plugin.mjs` 绝对路径的 Cordis insert patch，拒绝覆盖已有文件；不带参数时仅输出 YAML。移动项目目录后请重新生成 patch。

在 DSH 对话里输入：
```text
/achievements
/achievements json
/achievements reset
```

## 记录什么
原生 `session/event` hook 只查看 `type` 和 `seq`，**不读取 data，不检查对话正文**。不同 Session 对象的计数通过 WeakMap 隔离。

徽章对应：1 次 turn/end、5 次 step/end、10 次 tool/result、1 次 assistant/attempt、5 次 turn/end。tool/result 可能是失败结果，turn/end 不证明任务成功。徽章只是事件计数，不评价产出质量、安全或效率，也不奖励 token 消耗。

只统计插件加载或重置之后观测到的实时事件，不回放此前历史；重复或乱序的实时 seq 不重复计数。状态保存在内存，重启、session 释放或热重载后丢失。

命令配置 `recordInput:false`。DSH 自身仍可能保存正常事件与命令结果；本插件不会删除宿主记录。

## 离线演示
```sh
node cli.mjs serve
# 打开 http://127.0.0.1:4187
node cli.mjs inspect examples/events.json --format md
node --test
```
网页是明确标记的模拟事件演示，不连接正在运行的 DSH。导入事件数组必须包含非负整数 seq 和字符串 type，seq 唯一且严格递增；上限 1 MiB、10000 个事件。支持 JSON、Markdown、SVG 导出，全部带真实来源标签，避免把模拟结果当成实测。

## 接口验证与边界
依据官方 [固定提交 687f282](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/docs/cookbook/extension-cookbook.md)、[生命周期](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/docs/agent-lifecycle.md)、[Session API](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/packages/core/session/src/index.ts) 和 [命令注册 API](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/packages/interaction/commands/src/index.ts) 核实（2026-10-22）。

批次集成检查已在真实 Cordis 4.0.5 + commands 0.2.1-rc.2 加载插件并验证命令分发、session 隔离和卸载；不等于完成了真实模型的全链路测试。独立测试覆盖规则、payload 不访问、序号、隔离、取消、注册契约、setup 与回环服务器边界。RC API 可能变化，请固定版本。

欢迎贡献小而有趣的里程碑，避免将事件数包装为绩效指标。宣传稿见 [LAUNCH.md](LAUNCH.md)。独立社区项目，与 DeepSeek 无隶属关系。

## 中文界面与原生报告
可在网页右上角切换中英，或通过 `?lang=zh` / `?lang=en` 初始化语言。切换不会重置事件计数、输入、错误状态或来源标签。没有有效 URL 参数时默认英文；不持久化语言偏好或用户数据。

原生命令新增中文入口：
```text
/achievements zh
/achievements show zh
/achievements reset zh
/achievements json zh
```
Markdown 与 SVG 按当前界面语言导出；JSON 字段及 source 标识保持不变。页面明确区分模拟、导入和原生实时来源，切换语言不会改变来源。

可选浏览器回归：单独提供 Playwright（或配置 `PLAYWRIGHT_MODULE_PATH`），运行 `node scripts/browser-smoke.mjs`；`PLAYWRIGHT_CHANNEL=msedge` 可使用本机 Edge。覆盖 URL 语言初始化、切换保持输入与状态、中文导出、无效输入和 390px 布局，并检查零外发请求。

![中文成就簿](docs/assets/zh-desktop.png)

