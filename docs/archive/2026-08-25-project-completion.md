# APEX Website 项目完成归档

## 归档信息

- 归档日期：2026-08-25
- 项目：Apex Power Systems (Nanjing) Co., Ltd. 官方英文独立站
- 当前生产地址：<https://www.link-jl.com>
- 代码仓库：<https://github.com/apexevtech/apexevtech-website>
- 部署平台：Vercel，生产部署跟随 GitHub `main` 分支
- 当前品牌名称：Apex Power Systems (Nanjing) Co., Ltd.

## 已完成范围

### 网站体验

- 完成面向海外 B2B 买家的英文网站结构、文案和视觉风格调整。
- 完成首页、产品目录、产品详情、解决方案、关于我们、联系和隐私政策页面。
- 完成桌面端和手机端响应式布局。
- AC / DC 产品筛选可正常切换。
- 手机端右侧垂直居中显示 WhatsApp 联系入口，并使用 WhatsApp 品牌图标。
- 联系页和产品详情页共用询价表单。

### 询价邮件

- 表单提交通过服务端 `POST /api/inquiries` 处理。
- 已完成服务端字段校验、邮箱格式校验、隐私政策确认和错误提示。
- 已加入隐藏蜜罐字段、表单提交时间校验和内存限流，用于基础反垃圾保护。
- 通过 Resend 发送 HTML 和纯文本询价邮件，支持使用访客邮箱作为回复地址。
- 成功、校验失败、服务不可用、发送失败和限流状态均有明确页面反馈。
- 生产环境真实收件测试已完成，询价邮件可以正常收到。

### SEO 与海外合规

- 已生成 `sitemap.xml` 和 `robots.txt`，并禁止搜索引擎抓取 `/api/`。
- 已配置 canonical、Open Graph、Organization 和 WebSite JSON-LD 结构化数据。
- 已加入 Google Search Console 验证文件：`/google9c84864cc66064f8.html`。
- Google Search Console 已验证，`/sitemap.xml` 已提交并发现 18 个网页。
- 已加入隐私政策页面和 Cookie 同意提示。
- Google Analytics 4 仅在访客同意可选分析后加载，当前 Measurement ID 为 `G-EPSJV6EMLC`。

## 域名与部署决策

当前生产站继续使用 `www.link-jl.com`。本次归档不切换到 `apexpowersystems.com`，因为该域名不在当前项目控制范围内；这不会影响现有网站、询价邮件或 SEO 配置。

站点 URL 通过 `NEXT_PUBLIC_SITE_URL` 配置；未设置时，代码回退到 `https://www.link-jl.com`。后续若确实需要更换域名，只需在 Vercel 配置新的生产域名和该环境变量，再重新验证 Search Console、邮件发件域名及 sitemap。

## 维护入口

- 网站访问：<https://www.link-jl.com>
- Vercel 控制台：<https://vercel.com/dashboard>
- GitHub 仓库：<https://github.com/apexevtech/apexevtech-website>
- Resend 控制台：<https://resend.com/>
- Resend 域名管理：<https://resend.com/domains>
- Google Analytics：<https://analytics.google.com/>
- Google Search Console：<https://search.google.com/search-console>
- DNSPod 控制台：<https://console.dnspod.cn/>

## 环境变量清单

只在本地 `.env.local` 或 Vercel Environment Variables 中维护以下变量；本归档不保存任何真实值：

- `RESEND_API_KEY`：Resend 服务端 API 密钥。
- `INQUIRY_FROM_EMAIL`：Resend 已验证的发件人地址。
- `INQUIRY_TO_EMAIL`：询价收件地址，未设置时默认为 `gu@apexps-nj.com`。
- `NEXT_PUBLIC_SITE_URL`：生产站 URL，当前为 `https://www.link-jl.com`。
- `NEXT_PUBLIC_GA_ID`：Google Analytics 4 Measurement ID，当前为 `G-EPSJV6EMLC`。
- `GOOGLE_SITE_VERIFICATION`：Google Search Console 验证 token；当前项目同时保留 HTML 验证文件。

## 验证记录

- 自动化测试：14 项通过。
- TypeScript 类型检查：`npm run typecheck` 通过。
- Next.js 生产构建：`npm run build` 通过。
- 生产站首页、`sitemap.xml`、`robots.txt`、隐私政策和 Search Console 验证文件均返回 HTTP 200。
- 生产询价邮件已实际发送并收到。

## 历史文档

以下文档保留为开发过程记录，不再作为待办事项：

- `docs/superpowers/specs/2026-08-20-inquiry-email-design.md`
- `docs/superpowers/plans/2026-08-20-inquiry-email-implementation.md`

本文件用于后续维护、域名变更和故障排查时快速确认项目基线。
