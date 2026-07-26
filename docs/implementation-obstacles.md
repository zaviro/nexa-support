# 实施与部署障碍报告

本文仅记录 Issue #2–#11 实际实施期间已经发生且可由提交或命令结果复核的障碍。

| 阶段 | 实际障碍 | 影响 | 解决方式 | 证据 |
| --- | --- | --- | --- | --- |
| 产品实现 | 已保存中文偏好时，登录页首帧仍显示英文，语言切换目标也可能写回错误值。 | 直接访问 `/login` 会在 hydration 前显示错误语言，并破坏切换行为。 | 复用预 hydration 的本地化文本模式，并从文档语言推导切换目标。 | commit `d9821a9` |
| 无障碍与响应式 | 登录表单默认边框对比度仅约 1.468:1；完整旅程还缺少原子状态、对话框描述、无效表单首错聚焦，并以 `overflow-x: clip` 隐藏页面边界。 | 字段状态、辅助技术反馈、键盘纠错和窄屏溢出证据不满足验收要求。 | 提升边框与错误色对比度，补全 ARIA 关系和首错聚焦，移除页面级裁切并增加局部收缩与换行约束。 | commits `d9821a9`、`685ad82` |
| 浏览器验证 | 聊天对话框的视觉标题使用 `<header>`，在桌面和移动 Chromium 的 axe 旅程中形成重复 banner landmark；独立评审还发现打开后焦点仍停在 launcher。 | 首轮全量 Playwright 为 40/42，通过键盘打开时的焦点位置也不明确。 | 将视觉标题容器改为中性元素，并在打开时聚焦可编程聚焦的对话框标题，关闭后恢复 launcher 焦点。 | commits `f623f67`、`32c5e9e` |
| 浏览器验证 | 登录任务 worktree 缺少忽略的 Chromium 缓存；浏览器下载在 TLS reset 后重试仍超时。 | 当前 worktree 无法直接运行 focused Playwright。 | 先用 frozen 安装恢复依赖，再复用主检出中版本完全一致的 Playwright Chromium revision `1234` 完成验证。 | commit `ee26b7b` |
| Vercel 部署 | 当前候选 worktree 尚未链接 Vercel 项目，CLI 报错 `Project is not linked`，未生成 URL。 | dry-run 无法选择或证明 Next.js preset 与上传源；只阻断外部 Vercel 证据，不影响本地质量门禁。 | 遵守交付顺序，等待独立评审和新鲜完整门禁通过后再用既有授权账户执行 `vercel link`；不使用 token 绕过。 | `bunx vercel deploy --dry --yes`（2026-07-26，exit 1） |
| Vercel 部署 | 首次真实预览构建不在 Git 工作树中，`prepare` 无条件运行 `lefthook install` 而失败；修复后 Vercel 日志又显示 Next 默认匿名遥测提示。 | 首次预览为 `ERROR`，且默认遥测不符合项目无追踪边界。 | 仅在 Git 工作树安装 Lefthook，并在项目 `build` 脚本中显式禁用 Next 遥测；不添加 Vercel 环境变量、token 或运行时服务。 | 首次 deployment `dpl_ciopDQM1TvysDvkJgr5vwYpGZKRS`；commits `28600d8` 与后续 telemetry 修复 |
