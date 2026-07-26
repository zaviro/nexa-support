# Nexa Support

Nexa Support 是一个中英双语 SaaS 客服作品集演示，包含营销首页、本地确定性聊天流程和未连接认证的登录占位页。

## Demo security

聊天窗中的 OpenAI API Key 输入框仅用于展示未来集成位置，未连接、不会发送、校验、记录、保存或写入环境变量。请勿输入真实 API Key 或任何真实密钥。

转人工流程同样是虚构演示，只显示本地生成的队列位置和预计响应时间，不会联系真实客服或收集任何联系信息。

## Architecture

Next.js App Router 首页组合仓库内的 React、CSS 与轻量 SVG 作品集界面，不依赖第三方产品截图。语言偏好是唯一有意写入浏览器存储的数据；聊天回答、转人工排队状态和登录反馈均为确定性的本地演示。

项目没有接入真实 AI、认证、数据库、支付、分析、遥测或任何依赖秘密配置的服务。聊天历史和登录结果不持久化，刷新页面后会重置。

## 环境与启动

宿主前置条件是 Nix 与 devenv，direnv 可选。项目环境固定 Bun 1.3.13 与 Node.js 24，JavaScript 依赖统一由 Bun 管理。

```bash
# 进入固定环境
devenv shell

# 可选：允许 direnv 后续自动进入环境
direnv allow

# 安装仓库级 Git hooks 和项目级 Chromium
bun run hooks:install
bun run test:e2e:install

# 启动应用（二选一）
bun run dev
devenv up
```

`.env` 文件保持 Git 忽略，devenv 不加载它，也不会把秘密写入 Nix store。

## 质量与测试

完整且可复现的质量门禁是：

```bash
devenv test --no-tui
```

该命令执行 frozen Bun 安装、Lefthook 与 actionlint 配置验证、Biome、TypeScript、Vitest、生产构建，以及桌面和移动 Playwright 测试。

开发时可运行以下分项命令；它们不会替代上述完整门禁：

```bash
bun run check
bun run typecheck
bun run test:unit
bun run build
bun run test:e2e
```

## Hooks、CI 与 Agent 技能

Lefthook 是 pre-commit 与 pre-push 质量检查的唯一所有者；GitHub Actions 的质量入口是 [`.github/workflows/quality.yml`](.github/workflows/quality.yml)，同样运行 `devenv test --no-tui`。`.codex/hooks.json` 只提供建议性的 graphify 图谱维护，不属于质量门禁。

技能存放在 `.agents/skills/`，来源和哈希记录在 `skills-lock.json`。正常 clone 会直接获得这些文件；确需恢复时运行：

```bash
bun run agents:restore
```

该命令需要网络，故不会在 devenv shell 中自动执行。

## Vercel 部署

仓库内的部署契约保持简单且可审计：

- `vercel.json` 指定 Next.js，并以 `bun install --frozen-lockfile` 安装依赖。
- `package.json` 请求 Node.js 24；构建日志先输出 `node --version`，再运行现有 `bun run build`。
- `vercel.json` 有意不设置 Functions Runtime。

`main` 是唯一生产分支，其他分支只创建预览部署：

```bash
# 非 main 分支：预览
bunx vercel deploy --yes

# main 分支：生产
bunx vercel deploy --prod --yes
```

生产命令只能在 `main` 上、一次新鲜的 `devenv test --no-tui` 通过后，以已授权的 Vercel 账户执行。部署流程不添加 token、环境变量、分析、遥测或凭据；实时 URL 只记录在对应的 Issue #11 证据评论中。

详细交接见 [`HANDOFF.md`](HANDOFF.md)，后续 Agent 流程见 [`docs/agents/development-workflow.md`](docs/agents/development-workflow.md)，实际障碍见 [`docs/implementation-obstacles.md`](docs/implementation-obstacles.md)，产品工作项见 [GitHub Issues](https://github.com/zaviro/nexa-support/issues)。
