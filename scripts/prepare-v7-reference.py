from pathlib import Path
import json,hashlib,subprocess
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[1]; source=root.parent/'小艺'/'XIAOYI 7.0.mp4'; out=root/'public/reference/v7';out.mkdir(parents=True,exist_ok=True)
points=[(8,'listening'),(12,'querying'),(20,'growing'),(24,'answer'),(27,'skills'),(37,'welcome'),(53,'sources'),(106,'selection'),(110,'image-search'),(126,'selection-tools'),(147,'attachment'),(155,'keyboard'),(168,'complete'),(273,'writing-options'),(276,'skeleton'),(280,'writing-stream'),(292,'writing-expanded'),(296,'writing-complete'),(297,'applied')]
frames=[]
for t,name in points:
 target=out/f'L19-{name}.jpg'
 raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(t),'-i',str(source),'-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1'])
 import io
 im=Image.open(io.BytesIO(raw)).convert('RGB');d=ImageDraw.Draw(im);redactions=[]
 if t==37: redactions.append([318,254,684,300])
 if t in [273,276,280,297]: redactions.append([160,194,494,286])
 for box in redactions:d.rectangle(box,fill='#242426')
 im.save(target,quality=85)
 frames.append({'time':t,'preview':'/reference/v7/'+target.name,'state':name,'redactions':redactions,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
manifest=json.loads((root/'reference/manifest.json').read_text());manifest['items']=[x for x in manifest['items'] if x['id']!='L19']
row={'designEdition':'v7','id':'L19','filename':source.name,'kind':'video','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'bytes':source.stat().st_size,'source':'../小艺/'+source.name,'osVersion':'unknown','appVersion':'unknown','versionLabel':'7.0 (user-labelled)','preview':frames[1]['preview'],'width':720,'height':1504,'duration':311.334,'frames':frames,'title':'小艺 7.0 深色交互录屏','titleEn':'Xiaoyi 7.0 dark interaction recording','category':'手机 / 7.0','categoryEn':'Phone / 7.0','observation':'用户标记为 7.0。末尾是待安装系统更新，不证明当前系统版本。包含浮卡、技能、圈选、帮写。公开帧已遮蔽账号与电话号码。','observationEn':'User-labelled 7.0. The available OS update does not prove the installed version. Floating assistant, skills, selection and writing are observed. Account and phone details are redacted in public frames.','evidence':'recording'}
manifest['items'].append(row);manifest['generated']='2026-09-30';(root/'reference/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
analysis={'source':'L19','sourceSha256':row['sha256'],'referenceSize':[720,1504],'versionStatus':{'zh':'用户标记为 7.0，录制时系统及应用版本未知。','en':'User-labelled 7.0; installed OS and application versions unknown.'},'frames':frames,'geometry':{'unit':'source px; web defaults at 0.5 scale','evidence':'manual frame estimates, not native vp','panelInset':28,'panelRadius':60,'dockHeight':92,'dockGap':16,'bottomInset':28,'writingRadius':56},'segments':[{'start':6,'end':25,'id':'assistant','zh':'唤起、聆听、浮卡回答','en':'Activation, listening and floating answer'},{'start':25,'end':38,'id':'skills','zh':'技能目录与首页','en':'Skills gallery and home'},{'start':38,'end':78,'id':'conversation','zh':'全屏对话与来源','en':'Full-screen conversation and sources'},{'start':105,'end':171,'id':'selection','zh':'物体圈选、搜索加载与追问','en':'Object selection, search loading and follow-up'},{'start':269,'end':297,'id':'writing','zh':'帮写选项、生成与回填','en':'Writing options, generation and insertion'}],'limits':[{'zh':'绿色包含宿主图标模糊透色，不作为固定光效色。','en':'Green includes blurred host icons and is not treated as an intrinsic glow color.'},{'zh':'小球运动、识图成功结果及浅色主题未得到足够证据。','en':'Orb motion, successful image-search results and a light theme are not sufficiently evidenced.'}]}
(root/'reference/v7-analysis.json').write_text(json.dumps(analysis,ensure_ascii=False,indent=2)+'\n')
cat=json.loads((root/'src/i18n/en.json').read_text())
for k in ['title','category','observation']:cat[row[k]]=row[k+'En']
(root/'src/i18n/en.json').write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
print('L19: 19 redacted frames, source hash',row['sha256'])

p=root;video=source
assets=[]
for name,t,box in [('skill-0',32,(30,160,692,500)),('skill-1',27,(30,230,692,545)),('city',53,(28,630,692,980))]:
 raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(t),'-i',str(video),'-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1']);im=Image.open(io.BytesIO(raw)).convert('RGB').crop(box);im.save(out/f'{name}.jpg',quality=88)
 assets.append({'path':f'/reference/v7/{name}.jpg','time':t,'crop':box,'source':'L19','sha256':hashlib.sha256((out/f'{name}.jpg').read_bytes()).hexdigest(),'transformation':'Scene crop; supplied recording; no invented source photography'})
a=json.loads((p/'reference/v7-analysis.json').read_text());a['assets']=assets;(p/'reference/v7-analysis.json').write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n')
