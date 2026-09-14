// ---------- Dynamic comet VFX ----------
// layered ribbon shader: moving energy, warp, soft alpha and no static-looking geometry.
const tailUniforms={uTime:{value:0},uEnergy:{value:1.2},uColor:{value:new THREE.Color(LIME)}};
const tailVert=`
  varying vec2 vUv; uniform float uTime;
  void main(){
    vUv=uv;
    vec3 p=position;
    float wave=sin(uv.x*14.0-uTime*3.2)*0.055 + sin(uv.x*31.0-uTime*6.0)*0.018;
    p.y += wave*(0.25+uv.x);
    p.z += cos(uv.x*11.0-uTime*2.5)*0.04;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
  }`;
const tailFrag=`
  varying vec2 vUv; uniform float uTime; uniform float uEnergy; uniform vec3 uColor;
  float rand(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
  void main(){
    float center=1.0-smoothstep(0.0,.46,abs(vUv.y-.5));
    float attach=smoothstep(0.0,.028,vUv.x);
    float fade=1.0-smoothstep(.58,1.0,vUv.x);
    float taper=attach*fade;
    float pulse=.70+.30*sin(vUv.x*25.0-uTime*8.4);
    float grain=.82+.18*rand(floor(vUv*vec2(160.0,40.0))+uTime*.01);
    float a=center*taper*(.40+.60*pulse)*grain*uEnergy;
    vec3 hot=mix(uColor,vec3(1.0),center*.74);
    gl_FragColor=vec4(hot,a);
  }`;
const ribbonMat=new THREE.ShaderMaterial({uniforms:tailUniforms,vertexShader:tailVert,fragmentShader:tailFrag,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
function ribbonGeometry(points,width=.70,segments=110){
 const curve=new THREE.CatmullRomCurve3(points); const verts=[],uvs=[],idx=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,p=curve.getPoint(t),tan=curve.getTangent(t).normalize();
  let side=new THREE.Vector3(0,1,0).cross(tan); if(side.lengthSq()<.01)side.set(1,0,0); side.normalize();
  const w=width*(1-t*.72); const a=p.clone().addScaledVector(side,w),b=p.clone().addScaledVector(side,-w);
  verts.push(a.x,a.y,a.z,b.x,b.y,b.z);uvs.push(t,0,t,1);
  if(i<segments){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
const tails=[];
const tailBackdropMat=new THREE.MeshBasicMaterial({color:0x020503,transparent:true,opacity:.74,depthWrite:false,side:THREE.DoubleSide,blending:THREE.NormalBlending});
const baseTailSets=[
 [[.72,1.70,-1.52],[2.2,2.45,-2.5],[4.4,3.72,-4.8],[7.8,5.0,-8.9]],
 [[.82,1.22,-1.60],[2.5,1.95,-2.9],[4.9,3.05,-5.4],[8.2,4.2,-9.4]],
 [[.78,.58,-1.66],[2.3,1.05,-3.2],[5.0,1.95,-6.0],[8.5,2.9,-9.9]],
 [[.64,-.02,-1.60],[2.1,.28,-3.6],[4.8,.92,-6.6],[8.2,1.7,-10.2]],
 [[.56,1.42,-1.72],[2.0,2.10,-3.0],[4.2,3.18,-5.8],[7.4,4.3,-9.7]],
 [[.50,.36,-1.76],[2.0,.72,-3.7],[4.4,1.42,-6.7],[7.7,2.2,-10.5]]
];
const tailBackdrop=new THREE.Mesh(ribbonGeometry(baseTailSets[1].map(a=>new THREE.Vector3(...a)),1.48),tailBackdropMat);tailBackdrop.position.z=-.025;vfx.add(tailBackdrop);
baseTailSets.forEach((set,i)=>{const pts=set.map(a=>new THREE.Vector3(...a));const width=i<4?.48-i*.045:.20;const m=new THREE.Mesh(ribbonGeometry(pts,width),ribbonMat.clone());m.material.uniforms={uTime:{value:i*.21},uEnergy:{value:i<4?1.12:1.5},uColor:{value:new THREE.Color(i%2?0xb9ff13:LIME)}};vfx.add(m);tails.push(m)});
const glowMat=ribbonMat.clone(); glowMat.uniforms={uTime:{value:0},uEnergy:{value:.32},uColor:{value:new THREE.Color(0x9cff00)}};
const glowRibbon=new THREE.Mesh(ribbonGeometry(baseTailSets[1].map(a=>new THREE.Vector3(...a)),1.34),glowMat);glowRibbon.scale.z=1.02;vfx.add(glowRibbon);tails.push(glowRibbon);

const starGeoVfx=new THREE.BufferGeometry();
const starCount=48, starArr=new Float32Array(starCount*3);
for(let i=0;i<starCount;i++){starArr[i*3]=1.4+Math.random()*7.2;starArr[i*3+1]=.1+Math.random()*4.4;starArr[i*3+2]=-1.6-Math.random()*7.8;}
starGeoVfx.setAttribute('position',new THREE.BufferAttribute(starArr,3));
const tailStars=new THREE.Points(starGeoVfx,new THREE.PointsMaterial({color:0xffffff,size:.075,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));vfx.add(tailStars);
const pCount=220, pPos=new Float32Array(pCount*3),pSeed=[];
for(let i=0;i<pCount;i++){pSeed.push(Math.random());pPos[i*3]=1+Math.random()*8;pPos[i*3+1]=-.5+Math.random()*5;pPos[i*3+2]=-1.4-Math.random()*8}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pPos,3));
const pm=new THREE.PointsMaterial({color:LIME,size:.055,transparent:true,opacity:.78,blending:THREE.AdditiveBlending,depthWrite:false});const particles=new THREE.Points(pg,pm);vfx.add(particles);
const debris=[];for(let i=0;i<13;i++){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.08+Math.random()*.18,1),rockMat.clone());m.position.set(1.8+Math.random()*7,-.5+Math.random()*4,-1.8-Math.random()*7);m.rotation.set(Math.random()*4,Math.random()*4,Math.random()*4);vfx.add(m);debris.push(m)}

const lane=new THREE.Group();scene.add(lane);lane.visible=false;
for(let i=0;i<80;i++){const dash=new THREE.Mesh(new THREE.BoxGeometry(.035,.012,1.4),new THREE.MeshBasicMaterial({color:i%5===0?LIME:0x343a31}));dash.position.set((i%2?1:-1)*2.5,-3.05,-i*2.3);lane.add(dash)}

let mode='hero',anim='run',clock=new THREE.Clock(),worldZ=0,jump=0;
const keyState={};addEventListener('keydown',e=>{keyState[e.code]=true;if(e.code==='Space')jump=1});addEventListener('keyup',e=>keyState[e.code]=false);
function setPose(name,time){
 const speed=name==='sprint'?12:name==='run'?8:2.2; const a=Math.sin(time*speed),b=Math.sin(time*speed+Math.PI);
 if(name==='idle'){
  core.position.y=Math.sin(time*2)*.035;core.rotation.set(0,0,Math.sin(time*1.2)*.008);
  armL.rotation.x=.02;armR.rotation.x=-.02;legL.rotation.x=0;legR.rotation.x=0;
 }else if(name==='run'||name==='sprint'){
  if(mode==='hero'){
    const punch=name==='sprint'?1.0:.82;
    core.position.y=.10+Math.abs(Math.sin(time*speed))*0.065;
    core.rotation.set(.035,-.08,-.055);
    armL.rotation.x=-.55*punch + a*.10; armR.rotation.x=.45*punch + b*.10;
    armL.rotation.z=.18;armR.rotation.z=-.18;
    legR.rotation.x=-1.08 + a*.10; legR.rotation.z=-.06;
    legL.rotation.x=.30 + b*.16; legL.rotation.z=.04;
  }else{
    const amp=name==='sprint'?.72:.48;
    core.position.y=.06+Math.abs(Math.sin(time*speed))*0.08;core.rotation.z=-.035;core.rotation.x=.025;
    armL.rotation.x=a*amp;armR.rotation.x=b*amp;legL.rotation.x=b*amp*.82;legR.rotation.x=a*amp*.82;
  }
 }else if(name==='jump'){
  core.position.y=.75+Math.sin(time*4)*.07;core.rotation.z=-.05;armL.rotation.z=.9;armR.rotation.z=-.9;legL.rotation.x=-.48;legR.rotation.x=.48;
 }
}
function setMode(m){mode=m;document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));
 if(m==='inspect'){vfx.visible=false;afterPass.enabled=false;lane.visible=false;anim='idle';camera.position.set(7.5,4.8,11.5);controls.target.set(0,.2,0);controls.enabled=true;modeLabel.textContent='Print inspect';}
 if(m==='hero'){vfx.visible=document.getElementById('tailToggle').checked;afterPass.enabled=document.getElementById('afterToggle').checked;lane.visible=false;anim='run';camera.position.set(7.6,4.9,11.5);controls.target.set(.15,.35,0);controls.enabled=true;modeLabel.textContent='Hero motion';}
 if(m==='world'){vfx.visible=document.getElementById('tailToggle').checked;afterPass.enabled=document.getElementById('afterToggle').checked;lane.visible=true;anim='run';controls.enabled=false;camera.position.set(7.5,4.4,10.4);modeLabel.textContent='Run world';}
}

document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
document.querySelectorAll('[data-anim]').forEach(b=>b.onclick=()=>{anim=b.dataset.anim;document.querySelectorAll('.anim').forEach(x=>x.classList.toggle('active',x===b))});
const views={front:[0,1.0,12.5],three:[7.6,4.9,11.5],side:[12.5,1.0,0],back:[0,1,-12.5],top:[0,13,.2]};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const v=views[b.dataset.view];camera.position.set(...v);controls.target.set(0,.1,0);controls.update()});
document.getElementById('tailToggle').onchange=e=>vfx.visible=e.target.checked&&mode!=='inspect';
document.getElementById('afterToggle').onchange=e=>afterPass.enabled=e.target.checked&&mode!=='inspect';
document.getElementById('particleToggle').onchange=e=>{particles.visible=e.target.checked;debris.forEach(d=>d.visible=e.target.checked)};
document.getElementById('bloom').oninput=e=>bloomPass.strength=+e.target.value;
document.getElementById('tailEnergy').oninput=e=>{const v=+e.target.value;tails.forEach(t=>{t.material.uniforms.uEnergy.value=v*(t===glowRibbon?0.34:1.0)});};
document.getElementById('eyeScale').oninput=e=>{const v=+e.target.value;eyeL.scale.setScalar(v);eyeR.scale.setScalar(v)};
document.getElementById('smileDepth').oninput=e=>{const v=+e.target.value;mouthBack.scale.z=v;smilePlane.scale.set(v,v,1);mouthCavity.scale.set(v,1.04*v,1)};
document.getElementById('roughness').oninput=e=>rockMat.roughness=+e.target.value;
document.getElementById('wire').onchange=e=>core.traverse(o=>{if(o.isMesh&&o.material&&o.material.wireframe!==undefined)o.material.wireframe=e.target.checked});

document.getElementById('shot').onclick=()=>{composer.render();const a=document.createElement('a');a.download='OG_FASTR_v7.png';a.href=renderer.domElement.toDataURL('image/png');a.click()};
document.getElementById('exportGLB').onclick=()=>{const old=vfx.visible;vfx.visible=false;const exporter=new GLTFExporter();exporter.parse(core,res=>{const blob=new Blob([res],{type:'model/gltf-binary'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='OG_FASTR_clean_v7.glb';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);vfx.visible=old},{binary:true,onlyVisible:true});};

function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.035),t=clock.elapsedTime;
 controls.update();setPose(anim,t);
 if(mode==='world'){
  const sprint=keyState['ShiftLeft']||keyState['ShiftRight'];const mv=(keyState['KeyW']?1:0)-(keyState['KeyS']?1:0);const side=(keyState['KeyD']?1:0)-(keyState['KeyA']?1:0);worldZ+=mv*(sprint?10:6)*dt;character.position.x+=side*3*dt;character.position.x=THREE.MathUtils.clamp(character.position.x,-3,3);lane.position.z=(worldZ%2.3);anim=sprint?'sprint':'run';
  if(jump>0){jump=Math.max(0,jump-dt*1.5);character.position.y=.25+Math.sin(jump*Math.PI)*1.1}else character.position.y=.25;
  camera.position.x=THREE.MathUtils.lerp(camera.position.x,character.position.x+5.7,.035);camera.lookAt(character.position.x,.3,0);
 }
 tails.forEach((m,i)=>{m.material.uniforms.uTime.value=t*(1.0+i*.035)+i*.31; m.position.y=Math.sin(t*2.4+i)*.015;});
 tailBackdrop.position.y=Math.sin(t*1.7)*.025;tailBackdrop.scale.y=1+Math.sin(t*1.3)*.025;tailStars.material.opacity=.72+.22*Math.sin(t*4.6);
 const arr=particles.geometry.attributes.position.array;for(let i=0;i<pCount;i++){arr[i*3]+=.018+(.06*pSeed[i]);if(arr[i*3]>9.3)arr[i*3]=1.2;arr[i*3+1]+=Math.sin(t*2+pSeed[i]*20)*.0015}particles.geometry.attributes.position.needsUpdate=true;
 debris.forEach((d,i)=>{d.rotation.x+=dt*(.5+i*.03);d.rotation.y+=dt*(.35+i*.025);d.position.x+=dt*.5;if(d.position.x>9.6)d.position.x=1.6});
 composer.render(dt);
}
setMode('hero');setTimeout(()=>loading.classList.add('hide'),800);animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});