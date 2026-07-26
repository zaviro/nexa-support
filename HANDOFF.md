# Nexa Support 工程交接

更新时间：2026-07-26  
交接状态：**工程与 Agent 脚手架已配置并验证；产品实现尚未开始**

## 1. 本轮边界

本轮只完成开发环境、项目依赖、质量门禁、项目内技能、GitHub 规划和后续 Agent 交接。没有实现 Nexa Support 首页、聊天状态机、双语切换或登录页。

`src/app/` 仍是 Create T3 App 默认页面，仅被 Biome 做过机械格式化。不要把当前页面当作设计稿或产品实现。

没有执行任何全局安装命令。宿主原有的 Nix、devenv、direnv、Bun、Node、GitHub CLI 和 graphify 只用于引导或验证；项目依赖由 Bun 管理，环境工具由 devenv 锁定。

## 2. 最终产品范围

品牌为虚构的 **Nexa Support**。视觉可参考 Intercom 的留白、节奏与产品叙事，但不得复制其 Logo、文案、插画、截图或专有界面。

只实现：

1. 一个 English / 简体中文可切换的官网首页；
2. 一个右下角可交互聊天窗；
3. 一个登录占位页。

首页保留顶栏、Hero、仿制 Dashboard、三项功能、简单工作流、两档价格、FAQ、页脚、聊天机器人；另放两条明确标记 `Demo testimonial` 的虚构评价。

删除大型下拉导航、行业方案、客户案例库、博客、资源中心、集成市场、价格计算器、多语言矩阵、复杂动画、真实注册付款和安全合规详情。

### 已确认内容

- 标题：`Resolve customer questions instantly`
- 副标题：`An AI support assistant for growing SaaS teams.`
- 数据：70% 自动解决、24/7 在线、30 秒部署
- 功能：AI 回答、人工接管、数据统计；每项为标题、一句解释和界面图
- 工作流：访客提问 → AI 回答 → 转人工
- 价格：Starter ¥99/月、Pro ¥299/月
- FAQ：五项，覆盖 AI 回答、人工接管、部署、退款和数据隐私
- 聊天预置：价格、退款、产品功能、联系人工；自由文本走确定性兜底
- Dashboard 使用 React、CSS 和轻量 SVG 仿制，不使用第三方产品截图
- 语言偏好计划存入 `localStorage`
- 聊天历史只在页面内存存在，刷新后清空
- 人工接管只显示虚构排队状态，不收集联系方式
- API Key 输入框只做遮罩展示，不发送、不校验、不记录、不持久化、不写环境变量，并明确标注未连接
- 登录页只做本地校验，成功后提示认证未连接
- 目标为 WCAG 2.2 AA，尊重 `prefers-reduced-motion`
- 重点视口：375px、768px、1440px
- 不实现真实 AI、认证、数据库、支付、分析统计或后端数据保存

## 3. 已完成的工程脚手架

### 应用底座

- Create T3 App 7.40.0
- Next.js App Router、React 19、TypeScript、Tailwind CSS 4
- 不含 tRPC、Auth、Prisma、Drizzle 或数据库
- `bun.lock` 已生成并通过 frozen install
- `packageManager` 固定为 Bun 1.3.13
- Vercel 运行目标声明为 Node.js 24

### 项目级开发依赖

- Biome 2.5.5
- Vitest 4.1.10
- Testing Library 与 jsdom
- Playwright 1.62.0 与 axe-playwright
- Lefthook 2.1.10
- Vercel CLI 57.0.0
- Skills CLI 1.5.20

Chromium 放在项目忽略目录 `.cache/ms-playwright`，不会写到用户级 Playwright 缓存。

### devenv

`devenv.lock` 固定了 devenv 模块和 rolling nixpkgs 输入。实测环境：

| 工具 | 版本 |
| --- | --- |
| Bun | 1.3.13 |
| Node.js | 24.16.0 |
| Git | 2.54.0 |
| GitHub CLI | 2.96.0 |
| ripgrep | 15.1.0 |
| actionlint | 1.7.12 |

devenv 管理运行时、系统工具、非秘密环境变量、开发进程和质量任务。Bun 管理 JavaScript 包及 package scripts。

交互式 `devenv shell` 允许 devenv 做便利性的 Bun 安装；`devenv test` 会关闭该路径，先运行明确的 `bun install --frozen-lockfile`，防止 CI 在检查前静默改写锁文件。

`dotenv` 集成刻意未启用，避免 `.env` 进入 Nix store。`.env` 继续由应用持有并被 Git 忽略。

`.agents/`、`.codex/`、`AGENTS.md` 和 `skills-lock.json` 是直接版本化的 Agent 输入，不由 devenv 动态生成。

### 质量门禁

| 层级 | 执行内容 |
| --- | --- |
| `pre-commit` | 对 staged 文件运行 Biome |
| `pre-push` | TypeScript 与 Vitest |
| `devenv test` / CI | frozen install、Lefthook 与 Actions 配置校验、Biome、TypeScript、Vitest、生产构建、Chromium 安装、桌面与移动 Playwright |

Lefthook 是唯一 Git quality hooks 管理器。`.codex/hooks.json` 的 graphify hook 只是 Agent 辅助，不是质量门禁。

Vitest 当前使用 `--passWithNoTests`，因为产品尚未实现；这只是诚实的空单元测试基线。Playwright 有一个临时脚手架烟测，在桌面 Chromium 和 Pixel 7 两个项目中验证默认 T3 页面可加载且无横向溢出。产品实现开始后应由真实旅程测试替换或扩展。

### CI 与 Vercel

- `.github/workflows/quality.yml` 使用 Nix + devenv，并以 `devenv test --no-tui` 作为唯一完整入口
- workflow 已通过 actionlint，但由于远端仍为空，GitHub Actions 尚未实际运行
- `vercel.json` 固定 Next.js framework 和 `bun install --frozen-lockfile`
- 尚未执行 `vercel link`、预览部署或生产部署
- 最终应在 Issue #11 验证 Preview、Production URL 及 main/preview 分支行为

## 4. 项目内 Agent 技能

`.agents/skills/` 与 `skills-lock.json` 当前一致，共 24 个技能：

- `find-skills`
- `grill-me`、`grilling`
- `setup-matt-pocock-skills`
- `to-spec`、`to-tickets`
- Superpowers 全套 14 个技能
- `vercel-react-best-practices`
- `web-design-guidelines`
- `frontend-design`
- `webapp-testing`

`.codex/skills/graphify` 是另行存在的项目技能，版本标记为 0.9.26，不在 skills.sh lock 中。

现有 `.codex/hooks.json` 仍引用宿主绝对路径 `/home/zaviro/.local/bin/graphify`，因此只在当前宿主可直接工作。它是本轮开始前已有的可选 Agent guard；没有为它执行全局安装，也没有把它纳入质量门禁。迁移到新宿主时，应在获得所有者许可后改为当地可用的 graphify 命令，或停用该可选 hook。

正常 clone 会直接获得已版本化的技能文件。只有文件缺失或需要从 lock 恢复时才运行：

```bash
bun run agents:restore
```

该命令需要网络，不会在 shell entry、Git hook 或 CI 中自动执行。

`grill-me`、`to-spec` 和 `to-tickets` 已跑完，产品所有者已确认共同理解。除非范围改变，不要重复访谈、重写 spec 或重新拆票。

## 5. 新环境复现

宿主前置条件是 Nix 与 devenv 2.1 或更高版本；direnv 可选。如果缺少这些宿主工具，遵守项目约束，先询问所有者再做任何全局安装。

```bash
# 进入固定环境；首次会获取 Nix 闭包
devenv shell

# 可选：让 direnv 以后自动进入
direnv allow

# 确保本地 Git hooks 存在
bun run hooks:install

# 安装项目级 Chromium 缓存
bun run test:e2e:install

# 启动应用
bun run dev
# 或使用 devenv 声明的进程
devenv up
```

完整验证：

```bash
devenv test --no-tui
```

常用分项：

```bash
bun run check
bun run typecheck
bun run test:unit
bun run build
bun run test:e2e
bun run hooks:check
```

## 6. 验证证据

2026-07-26 在项目根目录执行并得到退出码 0：

- `bun install --frozen-lockfile`
- `bunx biome check .`
- `bunx lefthook validate`
- `bun run hooks:check`
- `bun run typecheck`
- `bun run test:unit`，明确报告无单元测试文件
- `actionlint`
- `bun run test:e2e`，2/2 通过
- `devenv update --no-tui`
- `devenv test --no-tui`，完整任务图通过

生产构建由 `devenv test` 内的 `next build` 验证成功。最终完成声明仍应以当前 Agent 自己的新鲜输出为准，不应只引用本交接记录。

## 7. Git 与 GitHub 状态

- 本地已执行 `git init -b main`
- origin：`git@github.com:zaviro/nexa-support.git`
- 公开仓库：<https://github.com/zaviro/nexa-support>
- 远端当前为空，尚无 default branch
- 本地 `main` 仍是 unborn branch
- 所有项目文件仍未跟踪
- 未 commit、未 push、未创建 PR

主 spec 为 [Issue #1](https://github.com/zaviro/nexa-support/issues/1)，实现项为 #2–#11。它们都是 #1 的原生 sub-issues，均为 OPEN 且带 `ready-for-agent`，原生 blocking relationships 已配置。

当前 frontier 从 #2 开始：

```text
#2
├─ #3
│  ├─ #4 ─ #5
│  └─ #6
│     └─ #9（同时依赖 #3）
└─ #7 ─ #8

#4 + #5 + #6 + #8 + #9 → #10 → #11
```

#2 的大部分脚手架验收内容已在本地完成，但 issue 仍保持 open。后续 Agent 必须先 fresh verify，并在有提交/推送授权后建立真实 `main`，再决定是否关闭 #2。unborn branch 不能作为 Git worktree 基点。

## 8. graphify 状态

已按 `AGENTS.md` 执行 `graphify update .`。当前 `graphify-out/` 包含可查询的 `graph.json`、`graph.html` 和 `GRAPH_REPORT.md`，AST 图为 1178 nodes、1083 edges、169 communities。

图目前主要覆盖代码、配置和已安装技能；本轮没有做需要 LLM 的文档语义抽取。`graphify-out/.graphify_python`、host-local cache 与 dated backups 已被忽略，避免提交绝对路径或重复快照。

后续代码修改后运行：

```bash
graphify update .
```

已有 `graphify-out/graph.json` 时，代码库问题应先用 `graphify query`、`graphify path` 或 `graphify explain`。

## 9. 脚手架阶段障碍报告

1. skills.sh 旧名称 `to-prd` / `to-issues` 已由上游统一为 `to-spec` / `to-tickets`；按所有者选择采用新版。
2. 非空根目录直接运行 Create T3 App 会尝试初始化 TTY 并报 `ERR_TTY_INIT_FAILED`；改在临时空目录生成，再用不覆盖既有文件的方式合并。
3. 一次未引用 heredoc 使 Issue #10 Markdown 反引号中的 `prefers-reduced-motion` 被 shell 当成命令替换；已用安全 body 修正并复核。
4. GitHub sub-issue/dependency API 有短暂最终一致性；等待后用 GraphQL 重读确认关系。
5. Superpowers worktree 无法在 unborn `main` 上建立；本轮按授权在当前根目录配置，待首个 commit 后恢复 worktree 流程。
6. 宿主 Bun 为 1.3.14，而锁定 nixpkgs 提供 1.3.13；以 devenv 的 1.3.13 为复现基准，并同步 `packageManager`，frozen install 已验证兼容。
7. devenv 的交互式 Bun install 不是 frozen，且普通 shell 与 test 生命周期共享任务图；通过测试态禁用自动安装、显式 frozen task 和条件依赖避免 CI 假绿或普通 shell 误跑全套测试。
8. T3 的 Biome 2.2 风格配置在实际解析到的 Biome 2.5 中出现弃用项和 Tab/空格不一致；已迁移到 `preset` 并显式固定空格。
9. Playwright 最初以 `127.0.0.1` 访问 Next 的 `localhost`，触发未来跨源警告；统一为 `localhost` 后消除。

这只是脚手架阶段报告。Issue #11 的最终中文报告还应补充真实产品实现、无障碍、浏览器和 Vercel 阶段的新障碍。

## 10. 下一位 Superpowers Agent

1. 先读 `AGENTS.md`、本文件、Issue #1 和当前 frontier #2。
2. 不重复 grilling/spec/tickets；范围已确认。
3. 对 #2 做 fresh verification，并确认是否获得首个 commit/push 的授权。
4. `main` materialize 后使用 `using-git-worktrees`。
5. 每个 issue 按 `docs/agents/development-workflow.md` 的 Superpowers、TDD、UI review、浏览器证据、代码评审和 completion verification 流程执行。
6. 原创实现 Nexa Support，不复制 Intercom 专有资产，不接入真实 AI、认证、数据库或支付。
7. 最后由 #10 做响应式、WCAG 和全链路收口；由 #11 更新文档、障碍报告并部署 Vercel。

本交接完成后应停止。当前任务不授权开始任何 Nexa Support 产品代码、commit、push、PR 或 Vercel 部署。
