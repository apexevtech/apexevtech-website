# 追加修复 — 2026-09-16

检查并修复：

- sitemap：首页、产品列表、关于及联系页面已在 9 月 16 日发生修改，lastModified 更新至真实修改日期；未修改的解决方案及隐私页面保持 9 月 11 日。
- Products 菜单：桌面端 Esc 关闭菜单；点击页头外部关闭已展开的菜单。手机端沿用相同关闭行为。
- 询价表单：消息字段错误提示增加对应 ID，修复 aria-describedby 指向缺失元素；公司及国家使用 organization / country-name 自动填充；提交期间标注 aria-busy。

验证：52 项测试通过，生产构建/类型检查通过。实际本地浏览器确认 Esc 和外部点击均关闭桌面菜单；拦截本地 API 响应模拟字段错误，确认错误关联及自动填充属性正确，没有发送真实询盘。

线上原有 SEO 回归：28 个 sitemap 网址、9 篇文章及 12 个产品检查通过。

发布完成：`dpl_ADA3SCQKKxSQ8uAHHJks6v4GWMw3`，状态 READY，正式域名 `https://www.link-jl.com`。线上 sitemap 日期与表单自动填充检查通过，线上浏览器菜单关闭检查通过。
