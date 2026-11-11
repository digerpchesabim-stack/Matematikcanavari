import sys,glob
from PIL import Image
# kullanım: mont.py out.jpg genişlik klip:adım[:başla[:adet]] ...
out=sys.argv[1];W=int(sys.argv[2]);rows=[]
for a in sys.argv[3:]:
    p=a.split(':');n=p[0];st=int(p[1]);s0=int(p[2]) if len(p)>2 else 0;cnt=int(p[3]) if len(p)>3 else 8
    fs=sorted(glob.glob('clips/%s/f*.jpg'%n))[s0::st][:cnt]
    ims=[Image.open(f) for f in fs];h=int(ims[0].height*W/ims[0].width)
    r=Image.new('RGB',(W*len(ims),h),'white')
    for i,im in enumerate(ims): r.paste(im.resize((W,h)),(i*W,0))
    rows.append(r)
M=Image.new('RGB',(max(r.width for r in rows),sum(r.height for r in rows)),'white');y=0
for r in rows: M.paste(r,(0,y));y+=r.height
M.save(out,quality=80);print(M.size)
