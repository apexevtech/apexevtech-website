# GA4 事件核对 — 2026-09-17

## 已核实

- 正式网站同意统计前，GA4 与 Clarity 脚本未加载，window.gtag 不存在。
- 同意后加载 GA4 `G-EPSJV6EMLC`、Clarity `yas565j4eq`。
- 正式产品页使用 `?ga_debug=1` 时 config 包含 debug_mode:true，并观察到 page_view collect 请求。
- 已登录 GA4 资源 APEX Website（账号405771647，资源551309073）：DebugView 出现 page_view、session_start、first_visit。后台最近事件列表中存在 generate_lead、whatsapp_click、catalog_download、file_download，均关联 APEX Website 数据流，说明这些事件曾被接收。
- 正式产品页实际点击 WhatsApp 与产品文档下载后，dataLayer 产生 whatsapp_click（location:floating）及 catalog_download（location:product-detail，model:ST-9980A+ Pro）。下载文件名 ST-9980A+Pro.docx。

## 完成的设置修复

询盘事件 generate_lead 在近期事件列表中原关键事件开关为0。已启用并确认保存后的开关为1。WhatsApp 与资料下载保持辅助事件；未修改既有 purchase、qualify_lead、close_convert_lead。

这是 GA4 后台配置修改，网站代码没有改变，不需要重新部署。设置后的关键事件数据需按后续采集结果查看，不能将历史零关键事件解释为历史没有询盘。

## 验证范围与限制

第二次隔离浏览器的 Google Analytics collect 请求遭遇 ERR_CONNECTION_CLOSED，包括 page_view、whatsapp_click、catalog_download 和自动 file_download。此轮已证实事件触发和请求发出，不能声称每一条本次点击均已成功被服务器接收。第一轮 DebugView 已观察到 page_view；近期事件清单只证明历史接收，不代表本次点击接收。未为测试发送真实询盘。

下载有两套不同口径：catalog_download 为本站显式产品资料点击，file_download 为 GA4 增强型衡量自动下载事件。它们可能对应同一次操作，不应相加当作两次下载；点击统计也不证明文件保存完成。

GA4 首页默认过去7天显示4个活跃用户、53个事件、0个关键事件；这些数据含访问/测试活动，样本很小，不据此推算获客转化率。

官方说明：
- [推荐事件与 generate_lead](https://support.google.com/analytics/answer/9267735?hl=en)
- [关键事件设置](https://support.google.com/analytics/answer/12966437?hl=en)
- [DebugView](https://support.google.com/analytics/answer/7201382?hl=en)

后续可用报告：以 generate_lead 衡量网站提交成功，以 whatsapp_click 衡量沟通入口点击，以 catalog_download 衡量产品资料兴趣；结合来源/媒介与落地页分析，点击不等于实际 WhatsApp 对话或合格销售线索。

本地隔离浏览器模拟询盘 API：失败响应产生0个 generate_lead；成功响应产生1个 generate_lead（location:Website contact page）。所有询盘请求被本地拦截、统计外部脚本被隔离，没有发送真实询盘或向正式 GA4 发送模拟询盘事件。
