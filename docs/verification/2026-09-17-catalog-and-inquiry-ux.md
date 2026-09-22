# 产品分类与询价体验 — 2026-09-17

- 产品分类、导航分类及选型卡片增加 #equipment，选择后直达设备列表。
- 列表显示当前类别和型号数量。
- 手机菜单设置视口高度上限并允许内部滚动，避免横屏底部链接被遮挡。
- 询价输入使用16px字号，消息要求作为 aria-describedby 帮助文本，避免扩展输入控件的名称。
- 提交失败状态显示可点击的邮件备用入口，并保留 email_click 统计。
- 系统设置减少动态效果时关闭平滑滚动。

验证：52项测试及生产构建通过。390px手机产品分类跳转/选中状态/数量通过（AC为5个）；667x375横屏菜单297px高、312px内容可滚动，点击咨询后菜单关闭；输入实际计算字号16px；减少动态效果时scroll-behavior为auto。模拟询盘API503后备用链接为mailto:gu@apexps-nj.com，没有发送真实询盘。

字号行为通过Chromium检查，没有声称已完成真实iPhone Safari设备测试。

最终正式部署：dpl_ERzQ1PCmAtgZwEUgC2NhoLjgnu63，READY，www.link-jl.com。线上DC分类显示7个型号，筛选链接定位#equipment；正式联系页16px输入、message-help关联及无横向溢出核对通过。
