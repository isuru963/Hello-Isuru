(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const fine=matchMedia('(pointer:fine)').matches,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
// split text into masked words
$$('[data-split]').forEach(el=>{
  const walk=n=>[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){const f=document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t=>{if(!t.trim()){f.append(t);return}
        const w=document.createElement('span');w.className='w';const s=document.createElement('span');s.textContent=t;w.append(s);f.append(w)});
      c.replaceWith(f)}else walk(c)});
  walk(el);$$('.w>span',el).forEach((s,i)=>s.style.setProperty('--i',i));
});
// curtain / loader
const cur=$('#curtain');
const reveal=()=>{cur.classList.add('out');setTimeout(()=>{$$('[data-split].auto,.hero .rv,.sub .rv').forEach(e=>e.classList.add('on'));io()},450)};
const first=!sessionStorage.getItem('seen');
if(first&&cur.querySelector('b')){cur.classList.add('go');setTimeout(reveal,1300);sessionStorage.setItem('seen',1)}
else{cur.querySelector('i').style.display='none';cur.querySelector('b').style.opacity=0;setTimeout(reveal,150)}
// scroll reveal
function io(){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');
  if(e.target.dataset.count)count(e.target);o.unobserve(e.target)}}),{threshold:.15});
  $$('.rv,[data-split]:not(.auto),[data-count]').forEach(e=>o.observe(e))}
function count(el){const to=+el.dataset.count,t0=performance.now();
  (function f(t){const p=Math.min((t-t0)/1600,1);el.textContent=Math.round(to*(1-Math.pow(1-p,4)));p<1&&requestAnimationFrame(f)})(t0)}
// page transitions
$$('a[href]').forEach(a=>{const h=a.getAttribute('href');
  if(!h||h[0]==='#'||/^(mailto|tel|http)/.test(h)&&a.hostname!==location.hostname&&!h.startsWith('./'))return;
  if(a.target==='_blank'||/^(mailto|tel|https?:)/.test(h))return;
  a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey)return;e.preventDefault();
    cur.classList.remove('out');cur.style.transition='none';cur.style.transform='translateY(100%)';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{cur.style.transition='';cur.style.transform='translateY(0)';setTimeout(()=>location.href=h,850)}))})});
addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
// progress + parallax
const bar=$('#bar'),pImg=$('.portrait img'),cImg=$('.cover img');
let mx=0,my=0;
const scr=()=>{const h=document.documentElement,p=scrollY/(h.scrollHeight-innerHeight||1);bar.style.transform=`scaleX(${p})`;
  if(reduce)return;
  if(pImg)pImg.style.transform=`translate(${mx*-14}px,${scrollY*.12+my*-8}px) scale(1.02)`;
  if(cImg){const r=cImg.parentElement.getBoundingClientRect();cImg.style.transform=`translateY(${-(r.top/innerHeight)*6}%)`}};
addEventListener('scroll',scr,{passive:true});scr();
// cursor
if(fine){const d=$('.cur'),r=$('.ring');let x=0,y=0,rx=0,ry=0;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;mx=(x/innerWidth-.5)*2;my=(y/innerHeight-.5)*2;scr()});
  (function l(){rx+=(x-rx)*.16;ry+=(y-ry)*.16;d.style.transform=`translate(${x}px,${y}px)`;r.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(l)})();
  $$('a,button,.card').forEach(e=>{e.addEventListener('mouseenter',()=>{r.classList.add('big');r.firstChild.textContent=e.dataset.cur||'';const k=!!e.dataset.dk;r.classList.toggle('dk',k);d.classList.toggle('dk',k)});
    e.addEventListener('mouseleave',()=>{r.classList.remove('big','dk');d.classList.remove('dk')})});
  // magnetic
  $$('.btn,.icon,.arrow').forEach(m=>{m.addEventListener('mousemove',e=>{const b=m.getBoundingClientRect();
    m.style.transform=`translate(${(e.clientX-b.left-b.width/2)*.3}px,${(e.clientY-b.top-b.height/2)*.3}px)`});
    m.addEventListener('mouseleave',()=>m.style.transform='')});
  // tilt + spotlight cards
  $$('.card,.tile').forEach(c=>{c.addEventListener('mousemove',e=>{const b=c.getBoundingClientRect(),px=(e.clientX-b.left)/b.width,py=(e.clientY-b.top)/b.height;
    c.style.setProperty('--mx',px*100+'%');c.style.setProperty('--my',py*100+'%');
    if(c.classList.contains('card'))c.style.transform=`rotateY(${(px-.5)*10}deg) rotateX(${(.5-py)*10}deg)`});
    c.addEventListener('mouseleave',()=>c.style.transform='')})}
// Sri Lanka clock
const clk=$('#clock');if(clk)setInterval(()=>clk.textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Colombo',hour:'2-digit',minute:'2-digit',second:'2-digit'})+' LKT',1000);
// waveform
$$('.wave').forEach(w=>{for(let i=0;i<(w.hasAttribute("data-react")&&w.closest(".band")?110:48);i++){const b=document.createElement('i');b.style.setProperty('--k',i);b.style.animationDuration=(0.8+Math.random()*.9)+'s';w.append(b)}});

// stacked bands: depth effect + nav contrast
const bands=$$('.band'),nv=$('nav.top');
const stk=()=>{let dk=false;const y=40;
  bands.forEach((b,i)=>{const r=b.getBoundingClientRect();if(r.top<=y&&r.bottom>y)dk=!!b.dataset.dk;
    const n=bands[i+1];if(!n||innerWidth<=900||reduce){b.style.transform='';b.style.filter='';return}
    const p=Math.max(0,Math.min(1,1-n.getBoundingClientRect().top/innerHeight));
    b.style.transform=`scale(${1-p*.06})`;b.style.filter=`brightness(${1-p*.4})`});
  nv&&nv.classList.toggle('dk',dk)};
addEventListener('scroll',stk,{passive:true});addEventListener('resize',stk);stk();
// live canvases: plane / binary
const PL=[[1.1,0],[.5,-.09],[.05,-.12],[-.35,-.95],[-.6,-.95],[-.45,-.14],[-.85,-.12],[-1,-.42],[-1.15,-.42],[-1.1,-.06],[-1.15,0],[-1.1,.06],[-1.15,.42],[-1,.42],[-.85,.12],[-.45,.14],[-.6,.95],[-.35,.95],[.05,.12],[.5,.09]];
const ptr={x:-1e4,y:-1e4,t:0};
addEventListener('pointermove',e=>{ptr.x=e.clientX;ptr.y=e.clientY;ptr.t=performance.now()});
const rnd=()=>Math.random()<.5?'0':'1';
const lives=$$('canvas.live').map(cv=>{
  const ctx=cv.getContext('2d'),kind=cv.dataset.live,ink=cv.dataset.ink||'#E57373',cloud=cv.dataset.cloud;
  const L={cv,vis:false,S:null,W:0,H:0,dpr:cv.classList.contains('sublive')?1:Math.min(devicePixelRatio||1,2)};
  L.init=()=>{const r=cv.getBoundingClientRect();L.W=r.width;L.H=r.height;cv.width=r.width*L.dpr;cv.height=r.height*L.dpr;ctx.setTransform(L.dpr,0,0,L.dpr,0,0);
    if(kind==='plane')L.S={x:-60,y:L.H*.6,a:0,tr:[],c:Array.from({length:7},()=>({x:Math.random()*L.W,y:Math.random()*L.H,r:20+Math.random()*30,v:.15+Math.random()*.4}))};
    else{const fs=16,cols=Math.ceil(L.W/fs),rows=Math.ceil(L.H/fs);L.S={fs,cols,rows,a:new Float32Array(cols*rows),ch:Array.from({length:cols*rows},rnd),h:Array.from({length:cols},()=>-Math.random()*rows),v:Array.from({length:cols},()=>.2+Math.random()*.5)}}};
  L.draw=t=>{const {W,H,S}=L;ctx.clearRect(0,0,W,H);const r=cv.getBoundingClientRect();
    const near=performance.now()-ptr.t<2500&&ptr.x>r.left&&ptr.x<r.right&&ptr.y>r.top&&ptr.y<r.bottom;
    if(kind==='plane'){
      if(cloud){ctx.fillStyle=cloud;S.c.forEach(c=>{c.x-=c.v;if(c.x<-120)c.x=W+120;[[0,0,1],[.9,.2,.75],[-.9,.25,.7]].forEach(([dx,dy,k])=>{ctx.beginPath();ctx.arc(c.x+dx*c.r,c.y+dy*c.r,c.r*k,0,7);ctx.fill()})})}
      let tx,ty;if(near){tx=ptr.x-r.left;ty=ptr.y-r.top}else{tx=((t*.00007)%1.4-.2)*W;ty=H*(.5+.3*Math.sin(t*.0011))}
      let d=Math.atan2(ty-S.y,tx-S.x)-S.a;d=Math.atan2(Math.sin(d),Math.cos(d));S.a+=Math.max(-.05,Math.min(.05,d));
      const sp=Math.max(2.4,W/420);S.x+=Math.cos(S.a)*sp;S.y+=Math.sin(S.a)*sp;
      if(S.x>W+80||S.x<-80||S.y<-80||S.y>H+80){S.x=-60;S.y=H*(.25+Math.random()*.5);S.a=0;S.tr=[]}
      S.tr.push([S.x,S.y]);if(S.tr.length>90)S.tr.shift();
      ctx.save();ctx.strokeStyle=ink;ctx.globalAlpha=.55;ctx.lineWidth=2;ctx.setLineDash([3,9]);ctx.beginPath();S.tr.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();
      const sz=Math.max(18,Math.min(34,W/38));ctx.save();ctx.translate(S.x,S.y);ctx.rotate(S.a);ctx.scale(sz,sz);ctx.fillStyle=ink;ctx.beginPath();PL.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.restore();
    }else{
      const {fs,cols,rows}=S,px=ptr.x-r.left,py=ptr.y-r.top;ctx.font=`${fs}px "JetBrains Mono",monospace`;ctx.textBaseline='top';
      for(let c=0;c<cols;c++){S.h[c]+=S.v[c];const hr=Math.floor(S.h[c]);if(hr>=0&&hr<rows){const i=hr*cols+c;S.ch[i]=rnd();S.a[i]=1}
        if(S.h[c]>rows+6+Math.random()*20){S.h[c]=-Math.random()*rows*.5;S.v[c]=.2+Math.random()*.5}}
      for(let k=0;k<14;k++){const i=(Math.random()*S.a.length)|0;if(S.a[i]>.05)S.ch[i]=rnd()}
      for(let i=0;i<S.a.length;i++){const a=S.a[i];if(a<.03)continue;const x=(i%cols)*fs,y=((i/cols)|0)*fs;
        const n=near&&(x-px)**2+(y-py)**2<12100;if(n&&Math.random()<.35)S.ch[i]=rnd();
        ctx.fillStyle=a>.96?'#FF8A8A':ink;ctx.globalAlpha=n?Math.min(1,a+.45):a*.85;ctx.fillText(S.ch[i],x,y);S.a[i]=a*.955}
      ctx.globalAlpha=1}};
  return L});
lives.forEach(L=>{L.init();L.draw(0)});
const lio=new IntersectionObserver(es=>es.forEach(e=>{const L=lives.find(l=>l.cv===e.target);L.vis=e.isIntersecting}));lives.forEach(L=>lio.observe(L.cv));
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>lives.forEach(L=>L.init()),200)});
let fr=0;const loop=t=>{fr++;lives.forEach(L=>{if(!L.vis)return;if(L.cv.dataset.live==='binary'&&fr%2)return;L.draw(t)});requestAnimationFrame(loop)};
if(!reduce)requestAnimationFrame(loop);
// echo wave reacts to pointer
$$('.wave[data-react]').forEach(w=>{const bars=[...w.children];
  addEventListener('pointermove',e=>{const r=w.getBoundingClientRect();const inside=e.clientY>r.top-260&&e.clientY<r.bottom+260;
    const f=(e.clientX-r.left)/r.width*bars.length;bars.forEach((b,i)=>{b.style.transform=inside?`scaleY(${1+Math.max(0,1-Math.abs(i-f)/7)*1.5})`:''})})});
})();
