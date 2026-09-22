# 询盘转化漏斗 — 2026-09-21

## 网站事件链

| 阶段 | GA4 事件 | 触发条件 | 主要参数 |
| --- | --- | --- | --- |
| 产品访问 | `view_item` | 打开产品详情页，每次页面实例一次 | `items.item_id`、`item_name`、`item_brand`、`item_category`、`item_variant`、`page_path` |
| 产品对比 | `product_compare` | 修改对比型号 | `models`、`page_path` |
| 对比询价 | `comparison_inquiry_click` | 从对比表进入联系页 | `models`、`page_path` |
| 开始填写 | `inquiry_start` | 首次修改询盘表单 | `form_id`、`form_context`、`product_models`、`page_path` |
| 尝试提交 | `inquiry_submit` | 客户提交表单 | 同上 |
| 提交错误 | `inquiry_error` | 浏览器校验、网络或服务端错误 | 同上及 `reason` |
| 有效送达 | `generate_lead` | 服务端确认询盘邮件成功送达 | 同上及 `lead_source=website_form` |
| 直接沟通 | `whatsapp_click` / `email_click` / `phone_click` | 点击对应渠道 | `location`；表单区域同时包含表单与产品参数 |

事件不包含姓名、邮箱、电话、国家、公司或消息正文。`page_path` 只包含路径，不包含查询参数。产品事件使用 GA4 推荐的 `view_item` 名称及 `items` 数据结构。统计脚本仍受 Cookie 同意控制；同意前的非个人信息事件只暂存在页面内存，同意后发送，拒绝或离开页面不会发送。

## GA4 漏斗定义

在 GA4 **探索 → 漏斗探索**中新建开放漏斗：

1. `view_item`
2. `inquiry_start` 或 `comparison_inquiry_click`
3. `inquiry_submit`
4. `generate_lead`

建议使用“间接跟随”，时间窗口 30 天，并分别按设备类别、首次用户来源/媒介和着陆页拆分。直接联系渠道单独观察 `whatsapp_click`、`email_click`、`phone_click`，不要与成功送达的 `generate_lead` 相加。

如需在报告中显示自定义参数值，应在 GA4 管理后台建立事件范围自定义维度：`form_context`、`product_models`、`location`、`reason`、`models`。参数开始采集后不回填历史数据。

## 验证口径

- `inquiry_submit` 是提交尝试，不代表邮件送达。
- `generate_lead` 只在服务端返回 `leadRecorded=true` 时产生。
- `whatsapp_click`、`email_click` 和 `phone_click` 表示入口点击，不证明实际建立会话或形成合格线索。
- 评估重点为各步骤用户数、步骤转化率、流失率和平均耗时；样本量较小时不判断优化效果。
