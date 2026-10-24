# DSH Achievement Journal — launch kit

## What this is
A native Cordis plugin for DSH 0.2.1-rc.2 that observes session events without inspecting payloads and exposes per-session achievement counters through /achievements.
Target: DSH 0.2.1-rc.2. Independently authored community plugin, not an official DeepSeek product. Native Cordis registration, not a generic MCP wrapper.

## Primary-source hook
DeepSeek Harness exposes native hooks, human commands and model tools in its open-source runtime. This project uses those actual extension points. We do not claim measured popularity or invent a release date. Sources pinned to 687f282e8625c6b8d11ff58211a90524be2e4317, checked 2026-10-22:
- [DeepSeek Harness native extension cookbook](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/docs/cookbook/extension-cookbook.md)
- [DeepSeek Harness command registry](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/packages/interaction/commands/src/index.ts)
- [DSH agent lifecycle](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/docs/agent-lifecycle.md)
- [DSH session event API](https://github.com/deepseek-ai/deepseek-harness/blob/687f282e8625c6b8d11ff58211a90524be2e4317/packages/core/session/src/index.ts)

## English draft
My agent loop got a tiny badge shelf.

DSH Achievement Journal is a native DeepSeek Harness plugin: /achievements turns lifecycle event counts into small milestones. It never reads event payloads or measures token spending.

No pretend productivity score. Just a little confetti and a clear event counter. The web demo is explicitly simulated; native integration targets DSH 0.2.1-rc.2.
[Source code](https://github.com/Euphoria2586/dsh-achievement-journal)

## 中文草稿
给 DeepSeek Harness 做了个原生成就簿：/achievements 把运行里的小瞬间做成徽章。

只数生命周期事件，不读对话内容，不拿 token 消耗当战绩，也不把徽章装成生产力评分。

自带一个明确标注“模拟事件”的网页演示；真插件接的是 DSH 0.2.1-rc.2 的 session/event 和 commands API。
[开源仓库](https://github.com/Euphoria2586/dsh-achievement-journal)

## Demo script
1. Tap Turn settled
2. Tap Step ended until Found a rhythm unlocks
3. Reset journal
4. Export Shelf SVG with offline source label
Then show the generated Cordis patch and native command registration in plugin.mjs.

## Release notes and guardrails
- Run standalone tests and the real DSH registry smoke check; label any untested live-model workflow clearly.
- Use synthetic data in screenshots. Do not include credentials, private prompts or private project links.
- Ship both README languages, MIT, setup.mjs, examples, tests and screenshots.
- Replace repository placeholders before publishing; no fabricated benchmarks, usage numbers, endorsements or stars.
- Tags: deepseek-harness, dsh-plugin, cordis, agent-observability, developer-tools.

