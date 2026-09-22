# 已抓取、尚未编入索引处理 — 2026-09-17

通过用户已登录 Chrome 核对 Search Console。

## 实际列表

报告更新时间2026-09-14；受影响13个网址。完整导出位于 `indexing-2026-09-17/`。其中12个为Word下载文件，1个为`https://www.link-jl.com/&`，没有正常产品网页。

导出CSV把两个文件名中的+变成空格；界面及实际源文件显示 ST-6680B+.docx、ST-9980A+Pro.docx。没有据此建立不存在的空格文件。

验证详情仍显示开始日期2026-09-07、15待定、0失败；该历史验证列表与当前13个示例不是同一份实时结果。没有重启正在进行的验证。

## 索引检查

URL Inspection确认正式首页、ST-HCDC-HPC、ST-6680CA-DC均已收录。两个产品页各有1个有效路径增强项，没有再显示此前无效Product增强项。

线上`/&`已有308永久跳转，Location为`/`，不需要再创建独立网页或要求其索引。

## 下载文件处理

用户要求处理报告中的网址。提出并询问文件索引偏好，继续独立核查；等待合理答复时间后按已说明的建议处理：保留下载，让产品介绍网页参与索引。

在Next.js headers配置中，仅`/product-documents/:path*`添加`X-Robots-Tag: noindex`。保留文件、原始下载URL及产品页链接，不增加robots.txt抓取阻止（Google需要抓取才能读取noindex）。不使用Search Console移除工具。

本地验证12个下载HEAD均HTTP200且有noindex；首页、产品页、资源页、robots及sitemap没有该响应头。生产构建含类型检查通过。

## 预期与限制

Google重新抓取后，下载文件可能转到“被noindex排除”类别，异常URL可能转到“重定向网页”。它们仍可能被列为未索引，这是预期行为，不等于新的技术错误。不能承诺13个计数立即清零或验证立即通过。

官方说明：[索引报告](https://support.google.com/webmasters/answer/7440203)、[非HTML文件的noindex响应头](https://developers.google.com/search/docs/crawling-indexing/block-indexing)。

正式部署 dpl_9BXWY1EfngyrtkWCw9xQ9oDewa4M，READY，www.link-jl.com。正式域名12个文档均HTTP200且X-Robots-Tag:noindex；抽查首页、两个产品页、资源索引、sitemap及robots未被noindex影响。网站侧处理完成，Google重新抓取及报告更新待完成。
