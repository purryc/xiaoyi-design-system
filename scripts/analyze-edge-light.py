"""Reproducible companion edge measurements. Original media is read only."""
from pathlib import Path
import hashlib, io, json, subprocess
import numpy as np
from PIL import Image
root = Path(__file__).resolve().parents[1]
items = json.loads((root / 'reference/manifest.json').read_text())['items']
def item(source_id):
    record = next(x for x in items if x['id'] == source_id)
    path = root / record['source']
    if hashlib.sha256(path.read_bytes()).hexdigest() != record['sha256']:
        raise ValueError(f'{source_id}: source hash mismatch')
    return record, path
profiles = []
for source_id in ['L11', 'L15', 'L16', 'L18']:
    record, path = item(source_id)
    pixels = np.array(Image.open(path).convert('RGB')).astype(float)
    for x in [450, 850, 1250, 1650]:
        rgb = np.median(pixels[:60, x-30:x+30], axis=1)
        chroma = rgb.max(axis=1) - rgb.min(axis=1)
        peak_index = int(chroma[:10].argmax())
        peak = float(chroma[peak_index])
        if peak < 15:  # Near-neutral strips cannot establish chroma decay reliably.
            continue
        def crossing(fraction):
            return next((i for i in range(peak_index, 60) if chroma[i] <= peak * fraction), None)
        profiles.append(dict(source=source_id, x=x, peak=peak, peakY=peak_index,
                             halfWidth=crossing(.5), tenthWidth=crossing(.1),
                             rgb=rgb[peak_index].tolist(), chroma=chroma.round(3).tolist()))
record, path = item('L14')
frames = []
for time in range(13):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str(time), '-i', str(path),
                                   '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'])
    pixels = np.array(Image.open(io.BytesIO(raw)).convert('RGB')) / 255
    h, w = pixels.shape[:2]
    row = np.median(pixels[h//3:h//2].mean(axis=2), axis=0)
    start, end = int(w*.8), int(w*.92)
    edge = start + int(np.argmin(np.diff(row[start:end]))) + 1
    colors = []
    # Four knots per side, clockwise from top-left. Corner knots average nearby straight edges.
    def sample(side, f):
        if side == 0: x, y = int(edge*f), 1
        elif side == 1: x, y = edge-2, int(h*f)
        elif side == 2: x, y = int(edge*(1-f)), h-2
        else: x, y = 1, int(h*(1-f))
        if side % 2 == 0:
            values = pixels[y, max(0,x-5):x+6]
        else:
            values = pixels[max(0,y-5):y+6, x]
        return np.median(values, axis=0)
    for side in range(4):
        colors.append(((sample((side-1)%4,.94)+sample(side,.06))/2).round(5).tolist())
        for f in [.25,.5,.75]: colors.append(sample(side,f).round(5).tolist())
    frames.append(dict(time=time, panelWidth=edge, colors=colors))
result = dict(sources=[dict(id=x['id'],sha256=x['sha256']) for x in items if x['id'] in ['L11','L14','L15','L16','L18']],
              referenceHeight=1828, displayHeight=520, space='sRGB',
              method='Top-edge chroma max(RGB)-min(RGB), median of 60px-wide clean strips. Distances are original image pixels from the frame boundary; not native vp. Near-neutral strips excluded. L14 palette: direct edge RGB at 16 clockwise perimeter knots, sampled each second over 0-12s; corner knots interpolate adjacent straight-edge samples. No background residual colors.',
              profiles=profiles, frames=frames,
              fitted=dict(lineWidth=2, innerWidth=9.6, outerWidth=4, outerOpacity=.04,
                          note='Widths are source-pixel estimates. Inner Gaussian 1/e width fits measured half and tenth widths. Thin core weight .05 and outer halo are estimates; the clipped screenshot does not uniquely identify separate core and external blur.'))
(root / 'reference/edge-light-analysis.json').write_text(json.dumps(result,indent=2)+'\n')
print('Measured',len(profiles),'edge profiles and',len(frames),'palette frames')
