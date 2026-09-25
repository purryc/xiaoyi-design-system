from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
def save(p,v): (r/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
colors=[('canvas','#f5f6f8','画布','文档与应用背景','L09'),('surface','#ffffff','内容表面','正文、卡片、输入区','L09'),('surface-soft','#eeedf4','柔和表面','次级容器与按钮','L09'),('text','#191b22','主要文字','正文与标题','L09'),('text-secondary','#626773','次要文字','描述和元信息','L09'),('text-inverse','#f5f4fc','反白文字','伴随态文本','L11'),('primary','#0a59f7','交互蓝','主要动作与选择','L15'),('companion','#11112f','伴随底色','深色侧栏','L15'),('companion-glass','#28283e','伴随控件','建议与输入胶囊','L15'),('cyan','#5ce5ee','光晕青','光球亮部','L10'),('violet','#8b7cf4','光晕紫','光球与帮写面板','L10'),('pink','#f1b7d9','光晕粉','光环高光','L10'),('success','#26745b','完成','研究样例的完成反馈','inferred'),('error','#b43f42','错误','研究样例的错误反馈','inferred')]
t={'$schema':'https://design-tokens.github.io/community-group/format/','meta':{'version':'1.0.0','provenance':'All numeric values are reconstruction estimates, not official Huawei tokens.','unit':'CSS px; not device pixels or HarmonyOS vp.'},'color':{k:{'$type':'color','$value':v,'$description':d,'label':l,'source':s,'confidence':'estimated' if s!='inferred' else 'inferred'} for k,v,l,d,s in colors},'space':{},'radius':{},'fontSize':{},'duration':{}}
for v in [4,8,12,16,20,24,32,40,48,64,80]:t['space'][str(v)]={'$type':'dimension','$value':{'value':v,'unit':'px'},'confidence':'estimated','source':'L09,L15'}
for k,v in [('small',8),('control',12),('card',20),('sheet',28),('app',32),('pill',999)]:t['radius'][k]={'$type':'dimension','$value':{'value':v,'unit':'px'},'confidence':'estimated','source':'L09,L15'}
for k,v in [('caption',12),('label',14),('body',16),('subtitle',20),('title',24),('heading',32),('display',48)]:t['fontSize'][k]={'$type':'dimension','$value':{'value':v,'unit':'px'},'confidence':'estimated','source':'L09,L11'}
for k,v in [('instant',120),('control',180),('sheet',360),('layout',480),('breathe',3200),('orbit',6000)]:t['duration'][k]={'$type':'duration','$value':{'value':v,'unit':'ms'},'confidence':'inferred','source':'L10,L14','note':'Implementation timing, not measured product specification.'}
t['easing']={'standard':{'$type':'cubicBezier','$value':[.2,0,0,1],'confidence':'inferred'},'enter':{'$type':'cubicBezier','$value':[.16,1,.3,1],'confidence':'inferred'}}
save('tokens/xiaoyi.tokens.json',t)
notes=[
('桌面建议卡片','手机 / 建议','浅蓝信息卡、圆角容器与多尺寸桌面组件。低清图片，不作字号测量。','marketing'),
('建议卡片设置','手机 / 建议','左侧为卡片设置页，右侧为桌面布局；与 L03 内容重复。','marketing'),
('建议卡片设置 · 副本','手机 / 建议','重复视觉来源，保留独立文件及校验值，不计作第二份独立证据。','marketing'),
('全场景设备','跨设备 / 宣传','品牌宣传图；仅用作设备覆盖语境，不推导各设备组件细节。','marketing'),
('办公与任务卡片','手机 / 服务','多种信息卡嵌入浅色对话，卡片语义清晰，主内容左对齐。','marketing'),
('对话与实时视觉','手机 / 多模态','对话、关闭摄像头、开启摄像头三个状态。图片低清，视觉模式以示意还原。','marketing'),
('折叠屏对话流转','折叠屏 / 对话','全屏对话、并排应用、桌面浮窗切换。1.276s 对话；3.987s 并排；10.366s 浮窗。','video'),
('长文总结宣传','手机 / 阅读','文章摘要与底部光球；只提供布局方向。','marketing'),
('小艺帮写','手机 / 帮写','浅紫蓝底部面板；3+4 工具布局；标题、拖拽柄、四点菜单、关闭和输入条。背景文档保持明亮。','capture'),
('小艺球动态','光球 / 动效','1.857s 单环，5.804s 同心环，15.091s 旋转椭圆，19.734s 回归圆环。动效片段本身未标注语义状态。','video'),
('跨应用伴随助手','平板 / 伴随','应用占约 71%，深色伴随区约 29%；顶部标题/静音/关闭，下方对话和收音条。','capture'),
('圈选图片','平板 / 圈选','1.770s 画圈；5.530s 蒙层/对象光边/菜单；9.955s 识图面板；14.379s 结果；18.804s 返回选区。','video'),
('文本选择菜单','平板 / 选中','正文中的蓝色选择区域和白色悬浮工具条；伴随侧栏仍存在。','capture'),
('文章分析过程','平板 / 伴随','7.589s / 13.661s 聆听；19.732s 侧栏扩展过渡；25.803s 对话结果。','video'),
('文章分析入口','平板 / 伴随','应用宽约 87%，伴随区约 13%；快捷建议、识屏胶囊和底部光球。','capture'),
('文章快捷指令','平板 / 伴随','总结一下、生成脑图、长文导读、收藏；控件为深灰胶囊。','capture'),
('文章问答与退出','平板 / 伴随','2.491s 浅色模糊过渡；4.483s 侧栏；8.469s 退出并恢复全宽。','video'),
('语音聆听','平板 / 伴随','Listening 文案、多圈收音球、顶部收音指示；主应用保持可见。','capture')]
m=json.loads((r/'reference/manifest.json').read_text())
for x,(title,category,note,kind) in zip(m['items'],notes):x.update(title=title,category=category,observation=note,evidence=kind)
for x in m['items']:
 for y in m['items']:
  if y['id']<x['id'] and x['sha256']==y['sha256']:x['duplicateOf']=y['id'];break
save('reference/manifest.json',m)
web=[
('W01','小艺伴随式 AI 功能介绍','https://consumer.huawei.com/cn/support/content/zh-cn16094008/','official','HarmonyOS 6.1.0.115+；页面列明 Pura X Max / X View 等适用产品，不能据此推定本地平板版本。圈选伴随在该页标注为 7.0+。','小屏、大屏、极简三形态；双击导航条进入、长按收音、显式退出。'),
('W02','小艺圈选功能说明','https://consumer.huawei.com/cn/support/content/zh-cn16023699/','official','HarmonyOS 5.0+；本次搜索索引可读，直接打开返回 503。','指关节圈选后可问问小艺、识图搜索、保存或分享；本地 L12 为直接视觉依据。'),
('W03','拖给小艺功能简介','https://consumer.huawei.com/cn/support/content/zh-cn16010332/','official','HarmonyOS 5.0+；受导航方式及应用支持限制。','可将文本、图片、文件拖向输入框或导航条，交给小艺分析。'),
('W04','HarmonyOS 设计理念','https://developer.huawei.com/consumer/cn/design/concept/','official','通用 HarmonyOS 设计理念；非小艺组件规范。','蓝白基调、舒适圆角、HarmonyOS Sans 与跨设备卡片设计。'),
('W05','HarmonyOS 设计资源','https://developer.huawei.com/consumer/cn/design/resource?ha_source=sifou&ha_sourceId=89000483','official','访问时资源页列出 2026/06 与 2026/07 更新。','官方字体、图标和设计组件获取入口；本项目未捆绑这些授权资源。'),
('W06','小艺官网','https://consumer.huawei.com/cn/mobileservices/celia/','official','动态营销页；功能需结合机型及系统版本确认。','补充多模态、办公、服务卡片与跨设备能力的范围。'),
('W07','小艺帮写功能介绍','https://consumer.huawei.com/cn/support/content/zh-cn16015627/','official','该页对应 HarmonyOS 4.0 / 4.2 / 4.3 输入法帮写。','只补充写作语义；不将旧版输入法的 19 类场景映射到 L09 备忘录面板。'),
('W08','HarmonyOS 6 · 超能小艺，轻松搞定','https://www.bilibili.com/video/BV1K8s8zrERL/','video-link','华为终端，2025-10-22。已读页面信息，未逐帧审阅线上视频。','官方视频检索线索；不作为数值或动效时序依据。'),
('W09','Huawei Celia Assistant gets Native HarmonyOS support','https://www.youtube.com/watch?v=yBWt0BUIcGo','video-link','Tech News，2025-01-22。只检索到页面摘要，未观看完整视频。','第三方版本线索；不用于复刻定稿。')]
save('reference/web-sources.json',[{'id':i,'title':t,'url':u,'type':k,'scope':s,'note':n,'accessed':'2026-09-25'} for i,t,u,k,s,n in web])
