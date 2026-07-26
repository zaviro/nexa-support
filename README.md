# Nexa Support

Nexa Support 是一个待实现的中英双语 SaaS 客服作品集案例。当前仓库只完成可复现的工程、质量与 Agent 技能脚手架；产品页面仍保留 Create T3 App 默认内容，尚未实现首页、聊天窗或登录占位页。

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
