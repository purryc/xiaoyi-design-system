"""Measure direct source colors; never interpret background-subtraction residuals as hues.
Requires local L10 original, FFmpeg, Pillow and NumPy. No original media is changed.
"""
from pathlib import Path
import subprocess,json,io,hashlib
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]
a=json.loads((root/'reference/motion-analysis.json').read_text())
source=root.parent/'小艺/小艺球动效reference.mov'
source_hash=hashlib.sha256(source.read_bytes()).hexdigest()
expected_hash=next(item['sha256'] for item in json.loads((root/'reference/manifest.json').read_text())['items'] if item['id']=='L10')
if source_hash != expected_hash:
 raise ValueError('L10 source hash differs from the reference manifest; inspect the original before resampling.')
frames=[]
for f in a['frames']:
 raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(f['time']),'-i',str(source),'-frames:v','1','-f','image2pipe','-vcodec','png','-'])
 rgb=np.asarray(Image.open(io.BytesIO(raw)).convert('RGB'))/255
 h,w=rgb.shape[:2];y,x=np.mgrid[:h,:w];px=(x-w/2)/(h/2)-.035;py=(h/2-y)/(h/2);r=np.hypot(px,py);angle=np.arctan2(py,px)
 colors=[];glow=[]
 for k in range(16):
  theta=-np.pi+k*2*np.pi/16
  diff=np.arctan2(np.sin(angle-theta),np.cos(angle-theta))
  pixels=rgb[(abs(diff)<np.pi/24)&(r>.35)&(r<.56)]
  # Direct camera RGB of the brightest ring samples, not signed RGB residuals.
  lum=(pixels*np.array([.2126,.7152,.0722])).sum(axis=1);peak=pixels[lum>=np.percentile(lum,95)]
  colors.append(np.median(peak,axis=0).round(5).tolist())
  bright=pixels[lum>=np.max(lum)*.75]
  hue=np.median(peak,axis=0)
  if hue[0]>hue[1]+.01: score=bright[:,0]-bright[:,1]
  elif hue[1]>hue[0]+.05: score=np.minimum(bright[:,1],bright[:,2])-bright[:,0]
  else: score=(bright*np.array([.2126,.7152,.0722])).sum(axis=1)
  glow.append(np.median(bright[score>=np.percentile(score,90)],axis=0).round(5).tolist())
 core=np.median(rgb[(r<.12)],axis=0)
 # Internal sphere swatches (inside the main contour) preserve blue/violet direction.
 body=[]
 for cx,cy in [(-.18,.18),(.18,.18),(-.18,-.18),(.18,-.18)]:
  body.append(np.median(rgb[(px-cx)**2+(py-cy)**2<.035**2],axis=0).round(5).tolist())
 frames.append({'time':f['time'],'ringSrgb':colors,'glowSrgb':glow,'coreSrgb':core.round(5).tolist(),'bodySrgb':body})
(root/'reference/orb-color-samples.json').write_text(json.dumps({'source':'L10','sourceSha256':source_hash,'space':'sRGB','method':'Original lossless decoded frames. 16 angular sectors from -pi, counterclockwise; median top 5 percent luminance in radius .35-.56, sector half-width pi/24. Glow uses the top 10 percent chromatic scores above 75 percent of sector peak luminance: R-G for pink sectors, min(G,B)-R for cyan sectors, luminance for neutral sectors. Four interior disk samples at (+/- .18,+/- .18), radius .035. Source half-height coordinates. Samples include optical composition; they are not proprietary shader colors.','frames':frames},indent=2)+'\n')
print('Measured direct colors at',len(frames),'times')
