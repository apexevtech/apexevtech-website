# 搜索标题与描述优化 — 2026-09-18

从已登录Search Console效果报告选择过去28天，导出CSV，原始文件保存在`search-performance-2026-09-18/`。报告上次更新9小时前，图表数据截至2026-09-15：131次展示、1次点击、CTR约0.8%、平均排名31.6。关于我们页贡献唯一点击（30展示、1点击、CTR3.33%、平均排名10）。

这是小样本且数据截至此前9月16日优化之前，不可据此判断此前修改已经提升或降低点击。查询数据因隐私筛选与页面总数可能不同；没有将站点级查询武断映射到单个页面，也没有将“apex ev lab”当作公司正式品牌。

## 本次范围

| 页面 | 点击 / 展示 | 平均排名 | 修改 |
| --- | --- | --- | --- |
| 关于我们 | 1 / 30 | 10 | About Us改为公司名称和EV Charger Test Equipment业务说明；描述列出AC/DC、协议分析、实验室及现场场景 |
| 联系 | 0 / 14 | 28 | Contact Us改为EV Charger Test Equipment Quotes & Technical Support；描述明确询价需要的接口、标准和电气范围 |
| 解决方案 | 0 / 10 | 14.3 | Solutions改为EV Charger Testing Solutions for Labs & Field Teams；描述说明开发、生产验证、实验室和现场工作流 |
| ST-6680B+ | 0 / 4 | 5.25 | AC Charger Testing改为Portable GB/T AC EV Charger Tester；描述补充440 V / 63 A接口额定值、车辆状态和故障模拟、R2/R3与可选计量 |

四个页面保留原canonical。共享metadata构建同步Open Graph和Twitter描述。产品可选seoTitle避免改动其他型号；ST-6680B+描述也同步显示在页面及产品卡片，让搜索摘要与实际内容一致。站点地图仅为实际改变的页面更新lastModified至2026-09-18。

首页、目录和协议文章9月16日已优化，保留观察；低排名文章需要内容与权重层面的改进，不能仅凭标题提高排名。本次不修改隐私页来追求点击，也不堆砌无关查询词。

## 验证与观察

52项现有测试通过；Next.js生产构建、类型检查通过。生成HTML确认四个页面标题、描述、canonical及社交描述同步。Google可以自行重写搜索标题和摘要，修改不保证点击率改善；等待重新抓取后，按相同时间窗口比较页面与查询的点击、展示、排名，避免把排名变化当作标题效果。

官方参考：[标题链接](https://developers.google.com/search/docs/appearance/title-link)、[搜索摘要](https://developers.google.com/search/docs/appearance/snippet)。

正式部署`dpl_79Bv6tuBhysnaS76jX5eZA6HoJDG`已READY，别名www.link-jl.com。正式域名四个页面标题、描述、canonical、社交描述及站点地图修改日期复查通过。
