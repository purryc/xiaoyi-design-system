from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFont
import json,hashlib,subprocess
root=Path(__file__).resolve().parents[1]; source=root.parent/'小艺'
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Unicode.ttf',16)
old_path=root/'reference/manifest.json'
old={x['filename']:x for x in json.loads(old_path.read_text())['items']} if old_path.exists() else {}
next_id=max([int(x['id'][1:]) for x in old.values()]+[0])+1
rows=[]; tiles=[]
for i,p in enumerate(sorted(x for x in source.iterdir() if x.is_file() and not x.name.startswith('.')),1):
 previous=old.get(p.name,{})
 id=previous.get('id')
 if id is None:
  id=f'L{next_id:02}';next_id+=1
 video=p.suffix.lower() in ['.mp4','.mov']; out=root/'public/reference'/f'{id}.jpg'
 r={'id':id,'filename':p.name,'kind':'video' if video else 'image','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size,'source':f'../小艺/{p.name}','osVersion':'unknown','preview':f'/reference/{id}.jpg'}
 if video:
  probe=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(p)])); st=next(s for s in probe['streams'] if s['codec_type']=='video'); dur=float(probe['format']['duration']);r.update(width=st['width'],height=st['height'],duration=dur,fps=st['r_frame_rate'])
  r['frames']=[]
  for j,fraction in enumerate([.08,.25,.45,.65,.85]):
   t=round(dur*fraction,3); frame=root/'public/reference'/f'{id}-{j+1}.jpg'
   subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(p),'-frames:v','1','-vf','scale=960:-2','-q:v','3',str(frame)],check=True)
   r['frames'].append({'time':t,'preview':f'/reference/{id}-{j+1}.jpg'})
  im=Image.open(root/'public'/r['frames'][1]['preview'].lstrip('/')).convert('RGB')
 else:
  im=Image.open(p).convert('RGB');r.update(width=im.width,height=im.height)
 im.thumbnail((1200,1000));im.save(out,quality=85)
 tile=Image.new('RGB',(360,300),'#f0f0f2');thumb=ImageOps.contain(im,(340,250));tile.paste(thumb,((360-thumb.width)//2,0));d=ImageDraw.Draw(tile);d.text((10,254),f'{id}  {p.name[:21]}',font=font,fill='black');d.text((10,277),f'{r["width"]} × {r["height"]}'+(f'  {r["duration"]:.1f}s' if video else ''),font=font,fill='black');tiles.append(tile)
 previous=old.get(p.name,{}) if old.get(p.name,{}).get('sha256')==r['sha256'] else {}
 for k in ['title','titleEn','category','categoryEn','observation','observationEn','evidence','duplicateOf']:
  if k in previous:r[k]=previous[k]
 rows.append(r)
canvas=Image.new('RGB',(360*4,300*((len(tiles)+3)//4)),'white')
for i,t in enumerate(tiles):canvas.paste(t,((i%4)*360,(i//4)*300))
canvas.save(root/'qa/contact-sheet.jpg')
(root/'reference/manifest.json').write_text(json.dumps({'generated':'2026-09-25','sourceRoot':'../小艺','items':rows},ensure_ascii=False,indent=2))
print(json.dumps([{'id':r['id'],'filename':r['filename'],'kind':r['kind'],'duration':r.get('duration')} for r in rows],ensure_ascii=False,indent=2))
