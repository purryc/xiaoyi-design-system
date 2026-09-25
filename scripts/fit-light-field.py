"""Fit explicit Gaussian background lobes and Fourier ring profiles; no texture encoding.
Coordinates use half image height. RGB coefficients are linear-light amplitudes.
"""
from pathlib import Path
import numpy as np,json
from PIL import Image,ImageFilter
r=Path(__file__).resolve().parents[1]
a=json.loads((r/'reference/motion-analysis.json').read_text())
lobes=[[0,0,.36],[0,0,.7],[-.45,.4,.7],[.45,-.4,.7],[.4,.45,1],[-.4,-.45,1]]
def linear(s):return np.where(s<=.04045,s/12.92,((s+.055)/1.055)**2.4)
def basis(x,y):return np.stack([x*0+1,x,y,x*y]+[np.exp(-((x-cx)**2+(y-cy)**2)/w**2) for cx,cy,w in lobes],axis=-1)
frames=[]
for f in a['frames']:
 im=Image.open(r/'public'/f['preview'].lstrip('/')).convert('RGB');rgb=np.asarray(im)/255;h,w=rgb.shape[:2];y,x=np.mgrid[:h,:w];x=(x-w/2)/(h/2);y=(h/2-y)/(h/2);rad=np.hypot(x-.035,y)
 # Exclude every luminous ring, keeping the centre and exterior to fit the background.
 mask=((rad<.27)|(rad>.93));B=basis(x[::3,::3],y[::3,::3]).reshape(-1,10);low=np.asarray(im.filter(ImageFilter.GaussianBlur(14)))/255;pix=linear(low[::3,::3]).reshape(-1,3);sel=mask[::3,::3].ravel()
 weights=np.where(sel,1,.18);coef=np.linalg.lstsq(B*weights[:,None],pix*weights[:,None],rcond=None)[0]
 bg=np.einsum('ijk,kl->ijl',basis(x,y),coef)
 # Estimate the primary contour and angular radiance from a radial scan.
 theta=np.linspace(-np.pi,np.pi,128,endpoint=False);radii=np.linspace(.34,.54,151)
 xx=(.035+np.cos(theta[:,None])*radii)*h/2+w/2; yy=h/2-np.sin(theta[:,None])*radii*h/2
 ix=np.clip(xx.astype(int),0,w-1);iy=np.clip(yy.astype(int),0,h-1)
 lin=linear(rgb);residual=(lin-bg)[iy,ix];peak=np.argmax(residual.mean(axis=2),axis=1)
 contour=radii[peak];flux=residual[np.arange(128),peak]
 F=np.stack([theta*0+1]+[fun(theta*k) for k in range(1,5) for fun in (np.cos,np.sin)],axis=-1)
 rr=np.linalg.lstsq(F,contour,rcond=None)[0];rr[3:]*=.25;ff=np.linalg.lstsq(F,flux,rcond=None)[0]
 frames.append({'time':f['time'],'background':np.round(coef,6).tolist(),'radius':np.round(rr,6).tolist(),'radiance':np.round(ff,6).tolist()})
(r/'reference/light-field-fit.json').write_text(json.dumps({'method':'Linear-light least squares of 4 polynomial terms + 6 Gaussian lobes; ring contour/radiance use fourth-order angular Fourier series. Measured samples, interpolated at runtime, no image/video textures. Gyroscopic ring geometry remains procedural.','lobes':lobes,'center':[.035,0],'frames':frames},indent=2)+'\n')
print('Fitted',len(frames),'frames')
