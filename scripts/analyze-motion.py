from pathlib import Path
from PIL import Image
import subprocess,json,math
r=Path(__file__).resolve().parents[1];source=r.parent/'小艺/小艺球动效reference.mov'
times=sorted(set([float(i) for i in range(24)]+[3.2,3.5,13.25,13.5,13.75,14.25,14.5,14.75,15.25,15.5,15.75,16.25,18.5,23.1]))
items=[]
for t in times:
 out=r/'public/reference/motion'/f'L10-{t:05.2f}.jpg'
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(source),'-frames:v','1','-vf','scale=620:-2','-q:v','2',str(out)],check=True)
 im=Image.open(out).convert('RGB');w,h=im.size
 def mean(x,y):
  pixels=list(im.crop((int(x*w)-4,int(y*h)-4,int(x*w)+5,int(y*h)+5)).getdata());vals=[round(sum(p[i] for p in pixels)/len(pixels)) for i in range(3)];return '#'+''.join(f'{v:02x}' for v in vals)
 items.append({'time':t,'preview':'/reference/motion/'+out.name,'background':{'tl':mean(.06,.08),'tr':mean(.94,.08),'bl':mean(.06,.92),'br':mean(.94,.92)},'centerColor':mean(.5,.5)})
data={'sourceId':'L10','duration':23.217,'width':1118,'height':700,'method':'Frames decoded at listed seconds. Four background 9x9 mean patches at (6%,8%), (94%,8%), (6%,92%), (94%,92%) on 620px preview. Color samples are measured, geometry and interpolation are fitted.','frames':items,'segments':[{'start':0,'end':3.3,'label':'单环与拖影'},{'start':3.3,'end':13.4,'label':'同心环扩散'},{'start':13.4,'end':15.8,'label':'交错旋转环'},{'start':15.8,'end':18.6,'label':'收束与余波'},{'start':18.6,'end':23.217,'label':'单环与拖影'}]}
previous=json.loads((r/'reference/motion-analysis.json').read_text()) if (r/'reference/motion-analysis.json').exists() else {}
if 'proxy' in previous:data['proxy']=previous['proxy']
(r/'reference/motion-analysis.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');print(len(items),'motion frames measured')
