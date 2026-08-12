
function mulberry32(a){return function(){var t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function hashId(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function cssVar(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
function fit(c){var d=window.devicePixelRatio||1,r=c.getBoundingClientRect();c.width=Math.max(1,r.width*d);c.height=Math.max(1,(r.height||260)*d);var x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return {ctx:x,w:r.width,h:r.height||260}}
function glowStroke(ctx,color){ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=12}
function pts(vals,w,h,pad,min,span){
  return vals.map(function(v,i){return {x:pad+(w-2*pad)*i/Math.max(1,vals.length-1), y:pad+(h-2*pad)*(1-(v-min)/span)}});
}
function smoothPath(ctx,p){
  if(!p.length) return;
  ctx.moveTo(p[0].x,p[0].y);
  if(p.length===2){ctx.lineTo(p[1].x,p[1].y);return;}
  for(var i=0;i<p.length-1;i++){
    var p0=p[i===0?i:i-1], p1=p[i], p2=p[i+1], p3=p[i+2]||p2;
    var c1x=p1.x+(p2.x-p0.x)/6, c1y=p1.y+(p2.y-p0.y)/6;
    var c2x=p2.x-(p3.x-p1.x)/6, c2y=p2.y-(p3.y-p1.y)/6;
    ctx.bezierCurveTo(c1x,c1y,c2x,c2y,p2.x,p2.y);
  }
}
function drawEquity(canvas,vals,color,base){
  var f=fit(canvas),ctx=f.ctx,w=f.w,h=f.h,pad=18;
  var min=Math.min.apply(null,vals.concat([base||vals[0]])),max=Math.max.apply(null,vals.concat([base||vals[0]]));
  var span=max-min||1;
  var p=pts(vals,w,h,pad,min,span);
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;
  for(var i=0;i<4;i++){var y=pad+(h-2*pad)*i/3;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke()}
  ctx.beginPath();smoothPath(ctx,p);
  ctx.lineTo(p[p.length-1].x,h-pad);ctx.lineTo(p[0].x,h-pad);ctx.closePath();
  var g=ctx.createLinearGradient(0,pad,0,h-pad);g.addColorStop(0,color);g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.globalAlpha=.28;ctx.fill();ctx.globalAlpha=1;
  ctx.beginPath();smoothPath(ctx,p);
  glowStroke(ctx,color);ctx.lineWidth=2.6;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();ctx.shadowBlur=0;
}
function drawBar3d(ctx,x,baseY,bw,bh,front,top,side){
  var d=Math.max(8,bw*0.28);
  ctx.beginPath();ctx.moveTo(x+bw,baseY-bh);ctx.lineTo(x+bw+d,baseY-bh-d*0.55);ctx.lineTo(x+bw+d,baseY-d*0.55);ctx.lineTo(x+bw,baseY);ctx.closePath();ctx.fillStyle=side;ctx.fill();
  ctx.beginPath();ctx.moveTo(x,baseY-bh);ctx.lineTo(x+d,baseY-bh-d*0.55);ctx.lineTo(x+bw+d,baseY-bh-d*0.55);ctx.lineTo(x+bw,baseY-bh);ctx.closePath();ctx.fillStyle=top;ctx.fill();
  ctx.fillStyle=front;ctx.shadowColor=front;ctx.shadowBlur=14;ctx.fillRect(x,baseY-bh,bw,bh);ctx.shadowBlur=0;
}
function drawBars(canvas,vals,up,down){
  var f=fit(canvas),ctx=f.ctx,w=f.w,h=f.h,pad=28;
  var max=Math.max.apply(null,vals.map(Math.abs))||1;var mid=h/2;var bw=Math.max(4,(w-2*pad)/vals.length-3);
  ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(255,255,255,.1)';ctx.beginPath();ctx.moveTo(pad,mid);ctx.lineTo(w-pad,mid);ctx.stroke();
  vals.forEach(function(v,i){var x=pad+i*((w-2*pad)/vals.length)+2;var bh=(Math.abs(v)/max)*(h/2-pad);ctx.fillStyle=v>=0?up:down;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;ctx.fillRect(x,v>=0?mid-bh:mid,bw,bh);ctx.shadowBlur=0});
}
function drawDonut(canvas,pct,color){
  var f=fit(canvas),ctx=f.ctx,w=f.w,h=f.h,cx=w/2,cy=h/2-6,r=Math.min(w,h)*0.34,lw=18;
  ctx.clearRect(0,0,w,h);ctx.lineWidth=lw;ctx.strokeStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=16;ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pct);ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=color;ctx.font='700 28px ui-sans-serif,system-ui';ctx.textAlign='center';ctx.fillText((pct*100).toFixed(1)+'%',cx,cy+4);
  ctx.fillStyle='rgba(255,255,255,.55)';ctx.font='12px ui-sans-serif,system-ui';ctx.fillText('WIN RATE',cx,cy+24);
}
function drawHBars(canvas,items,colors){
  var f=fit(canvas),ctx=f.ctx,w=f.w,h=f.h,pad=10,rowH=(h-pad*2)/items.length;
  ctx.clearRect(0,0,w,h);
  items.forEach(function(it,i){var y=pad+i*rowH+8;ctx.fillStyle='rgba(255,255,255,.55)';ctx.font='12px ui-sans-serif';ctx.textAlign='left';ctx.fillText(it.label,8,y+10);
    var bw=(w-160)*it.pct;ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(140,y,w-160,12);
    ctx.fillStyle=colors[i%colors.length];ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.fillRect(140,y,bw,12);ctx.shadowBlur=0;
    ctx.fillStyle='#fff';ctx.textAlign='right';ctx.fillText(Math.round(it.pct*100)+'%',w-8,y+11)});
}
function drawHeat(canvas,grid,colors){
  var f=fit(canvas),ctx=f.ctx,w=f.w,h=f.h,rows=grid.length,cols=grid[0].length,cw=(w-40)/cols,ch=(h-30)/rows;
  ctx.clearRect(0,0,w,h);
  for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){var v=grid[r][c];var t=(v+1)/2;var col=t>.55?colors[0]:t<.45?colors[2]:colors[1];
    ctx.globalAlpha=.35+Math.abs(v)*.55;ctx.fillStyle=col;ctx.fillRect(30+c*cw+2,20+r*ch+2,cw-4,ch-4);ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='10px ui-sans-serif';ctx.textAlign='center';ctx.fillText((v*100).toFixed(0)+'b',30+c*cw+cw/2,20+r*ch+ch/2+3)}
}
function drawScatter(canvas,pts,color){
  var f=fit(canvas),ctx=f.ctx,w=f.w,h=f.h,pad=36;
  ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(255,255,255,.1)';ctx.strokeRect(pad,pad,w-2*pad,h-2*pad);
  ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(pad,h-pad);ctx.lineTo(w-pad,pad);ctx.stroke();ctx.setLineDash([]);
  pts.forEach(function(p){var x=pad+p.x*(w-2*pad);var y=pad+(1-p.y)*(h-2*pad);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0});
}
function drawHist(canvas,bins,colors){
  var f=fit(canvas),ctx=f.ctx,w=f.w,h=f.h,pad=28,max=Math.max.apply(null,bins)||1,bw=(w-2*pad)/bins.length-2;
  ctx.clearRect(0,0,w,h);
  bins.forEach(function(v,i){var t=i/(bins.length-1);var col=t<.4?colors[0]:t>.55?colors[2]:colors[1];
    var bh=(v/max)*(h-2*pad);var x=pad+i*((w-2*pad)/bins.length);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=6;ctx.fillRect(x,h-pad-bh,bw,bh);ctx.shadowBlur=0});
}
function drawRadar(canvas,points,color){
  var f=fit(canvas),ctx=f.ctx,w=f.w,h=f.h,cx=w*.42,cy=h*.5;
  ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(255,255,255,.08)';
  for(var r=40;r<=160;r+=40){ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke()}
  points.forEach(function(p){var ang=p.a,rad=40+p.r*120;var x=cx+Math.cos(ang)*rad,y=cy+Math.sin(ang)*rad;
    ctx.fillStyle=p.ok?color:'#f87171';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,p.ok?4:3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0});
}

document.addEventListener('DOMContentLoaded',()=>{

const ID="binance-spot-futures-trading-bot";
const rand=mulberry32(hashId(ID));
const green='#0ecb81', red='#f6465d', gold='#f0b90b';
for(let i=0;i<3;i++){
  const s=[]; let v=10;
  for(var j=0;j<24;j++){v+= (rand()-0.32)*2.2; s.push(v)}
  drawEquity(document.getElementById('sp'+i),s, i===1?gold:green);
}
const lifts=[0.512,0.544,0.568];
const c=document.getElementById('lift'); const f=fit(c); const ctx=f.ctx,w=f.w,h=f.h;
const labels=['Default-like','Tuned buffer+θ','Selective 0.22'];
const fronts=['#dc2626','#16a34a','#22c55e'];
const tops=['#f87171','#4ade80','#86efac'];
const sides=['#7f1d1d','#14532d','#166534'];
ctx.clearRect(0,0,w,h);
ctx.strokeStyle='rgba(255,255,255,.08)';
for(var gi=0;gi<4;gi++){var gy=36+(h-80)*gi/3;ctx.beginPath();ctx.moveTo(36,gy);ctx.lineTo(w-16,gy);ctx.stroke()}
lifts.forEach(function(v,i){
  var bw=56; var x=70+i*118; var bh=v*(h-100); var base=h-42;
  drawBar3d(ctx,x,base,bw,bh,fronts[i],tops[i],sides[i]);
  ctx.fillStyle='#fff'; ctx.font='700 13px ui-sans-serif'; ctx.textAlign='center'; ctx.shadowBlur=0;
  ctx.fillText((v*100).toFixed(1)+'% WR',x+bw/2,base-bh-18);
  ctx.fillStyle=i===0?'#f87171':'#86efac'; ctx.font='11px ui-sans-serif';
  ctx.fillText(labels[i],x+bw/2,h-18);
});

});
