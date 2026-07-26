# Nexa Support

Nexa Support 是一个中英双语 SaaS 客服作品集演示，包含营销首页、本地确定性聊天流程和未连接认证的登录占位页。

## Demo security

聊天窗中的 OpenAI API Key 输入框仅用于展示未来集成位置，未连接、不会发送、校验、记录、保存或写入环境变量。请勿输入真实 API Key 或任何真实密钥。

转人工流程同样是虚构演示，只显示本地生成的队列位置和预计响应时间，不会联系真实客服或收集任何联系信息。

## 环境

宿主只需提供 Nix 与 devenv；direnv 可选。项目环境固定 Bun、Node.js 24、Git、GitHub CLI、ripgrep 和 actionlint，JavaScript 依赖统一由 Bun 管理。

```bash
devenv shell
bun run test:e2e:install
bun run dev
```

也可使用 `direnv allow` 自动进入环境，或用 `devenv up` 启动声明的 Web 进程。

## 质量命令

```bash
devenv test --no-tui
bun run check
bun run typecheck
bun run test:unit
bun run test:e2e
```

`devenv test` 是完整且可复现的质量门禁。它使用 frozen lockfile，并执行配置校验、Biome、TypeScript、Vitest、生产构建和 Playwright 桌面/移动烟测。

## Agent 技能

技能存放在 `.agents/skills/`，来源和哈希记录在 `skills-lock.json`。正常 clone 会直接获得这些文件；确需恢复时运行：

```bash
bun run agents:restore
```

该命令需要网络，故不会在 devenv shell 中自动执行。

详细交接见 `HANDOFF.md`，后续 Agent 流程见 `docs/agents/development-workflow.md`，产品工作项见 [GitHub Issues](https://github.com/zaviro/nexa-support/issues)。
