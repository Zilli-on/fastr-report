// ---------- PREMIUM SEPARATE COMET VFX ----------
// Character remains a clean/exportable mesh. Tail is 100% separate motion graphics.
function ribbonGeometry(points,width=.7,segments=140){
 const curve=new THREE.CatmullRomCurve3(points),verts=[],uvs=[],idx=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,p=curve.getPoint(t),tan=curve.getTangent(t).normalize();let side=new THREE.Vector3(0,1,0).cross(tan);
  if(side.lengthSq()<.001)side.set(1,0,0);side.normalize();const w=width*(1-t*.70);
  const a=p.clone().addScaledVector(side,w),b=p.clone().addScaledVector(side,-w);verts.push(a.x,a.y,a.z,b.x,b.y,b.z);uvs.push(t,0,t,1);
  if(i<segments){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(idx);return g;
}
const tailVert=`varying vec2 vUv;uniform float uTime;uniform float uPhase;uniform float uAmp;void main(){vUv=uv;vec3 p=position;float f=.18+uv.x*1.15;p.y+=sin(uv.x*12.5-uTime*3.5+uPhase)*uAmp*f;p.z+=cos(uv.x*8.5-uTime*2.45+uPhase)*uAmp*.55*f;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const tailFrag=`varying vec2 vUv;uniform float uTime;uniform vec3 uColor;uniform float uEnergy;uniform float uSoft;void main(){float y=abs(vUv.y-.5);float edge=1.-smoothstep(.12,.5,y);float core=1.-smoothstep(0.,.11,y);float start=smoothstep(0.,.035,vUv.x);float end=1.-smoothstep(.68,1.,vUv.x);float pulse=.78+.22*sin(vUv.x*31.-uTime*8.8);float flick=.90+.10*sin(vUv.x*83.-uTime*14.+vUv.y*12.);float a=mix(core,edge,uSoft)*start*end*pulse*flick*uEnergy;vec3 c=mix(uColor,vec3(1.),core*.92);gl_FragColor=vec4(c*(1.25+core*1.8),a);}`;
function makeTail(points,width,color,energy,phase,amp,soft=.5){
 const mat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uPhase:{value:phase},uAmp:{value:amp},uColor:{value:new THREE.Color(color)},uEnergy:{value:energy},uSoft:{value:soft}},vertexShader:tailVert,fragmentShader:tailFrag,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false});
 const m=new THREE.Mesh(ribbonGeometry(points.map(p=>new THREE.Vector3(...p)),width),mat);vfx.add(m);return m;
}
const tailPaths=[
 [[1.20,1.76,-1.70],[2.15,2.70,-2.55],[3.85,3.72,-4.30],[6.25,4.72,-6.65],[8.95,4.36,-9.25]],
 [[1.32,1.38,-1.80],[2.55,1.98,-2.90],[4.25,2.72,-4.62],[6.45,3.48,-6.75],[8.80,4.25,-9.18]],
 [[1.18,.86,-1.82],[2.50,.42,-3.02],[4.35,.52,-4.92],[6.45,1.54,-7.00],[8.72,3.06,-9.18]],
 [[1.10,1.57,-1.86],[2.20,2.17,-2.95],[4.12,3.03,-4.92],[6.60,3.75,-7.18],[9.02,3.58,-9.46]],
 [[1.02,.98,-1.90],[2.20,.86,-3.12],[4.18,1.22,-5.12],[6.45,2.10,-7.28],[8.84,3.42,-9.42]]
];
const tails=[
 makeTail(tailPaths[0],.66,0xbaff00,.25,.0,.060,.95),
 makeTail(tailPaths[1],.48,0xd8ff1e,.32,.7,.050,.76),
 makeTail(tailPaths[2],.43,0xcaff12,.30,1.4,.063,.72),
 makeTail(tailPaths[3],.145,0xffffff,.78,2.0,.035,.18),
 makeTail(tailPaths[4],.11,0xffffff,.70,2.7,.042,.14),
 makeTail(tailPaths[0],.075,0xffffff,.78,3.2,.022,.08)
];

function radialGlowTexture(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),g=x.createRadialGradient(128,128,2,128,128,126);g.addColorStop(0,'rgba(255,255,245,.88)');g.addColorStop(.10,'rgba(225,255,95,.56)');g.addColorStop(.34,'rgba(216,255,30,.24)');g.addColorStop(.72,'rgba(120,255,0,.07)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const auraTex=radialGlowTexture(),auras=[];
[[1.7,1.55,-2.2,2.0],[2.9,2.05,-3.45,2.6],[4.5,2.65,-5.15,3.1],[6.4,3.25,-7.0,3.5],[8.0,3.7,-8.6,3.8]].forEach((a,i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:auraTex,color:i%2?0xd8ff1e:0xbaff00,transparent:true,opacity:.10,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));s.position.set(a[0],a[1],a[2]);s.scale.set(a[3]*1.75,a[3],1);vfx.add(s);auras.push(s)});

const starTex=(()=>{const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');x.translate(48,48);const g=x.createRadialGradient(0,0,0,0,0,46);g.addColorStop(0,'#fff');g.addColorStop(.16,'rgba(255,255,255,.94)');g.addColorStop(.54,'rgba(216,255,30,.18)');g.addColorStop(1,'rgba(216,255,30,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,-46);x.quadraticCurveTo(5,-5,46,0);x.quadraticCurveTo(5,5,0,46);x.quadraticCurveTo(-5,5,-46,0);x.quadraticCurveTo(-5,-5,0,-46);x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
const starN=38,starPos=new Float32Array(starN*3);for(let i=0;i<starN;i++){starPos[i*3]=1.4+Math.random()*7.6;starPos[i*3+1]=.0+Math.random()*4.8;starPos[i*3+2]=-1.8-Math.random()*7.7}
const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));const tailStars=new THREE.Points(starGeo,new THREE.PointsMaterial({map:starTex,color:0xffffff,size:.18,transparent:true,opacity:.78,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,alphaTest:.02}));vfx.add(tailStars);
const pCount=170,pArr=new Float32Array(pCount*3),pSeed=[];for(let i=0;i<pCount;i++){pSeed.push(Math.random());pArr[i*3]=1.1+Math.random()*8;pArr[i*3+1]=-.1+Math.random()*4.8;pArr[i*3+2]=-1.7-Math.random()*8}
const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pArr,3));const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:LIME,size:.034,transparent:true,opacity:.48,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));vfx.add(particles);
const debris=[];for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.07+Math.random()*.16,1),rockMat.clone());m.position.set(1.9+Math.random()*6.9,.0+Math.random()*4.3,-2.2-Math.random()*7.0);vfx.add(m);debris.push(m)}

// ---------- LAB INTERACTION / MASTER POSES ----------
const lane=new THREE.Group();scene.add(lane);lane.visible=false;for(let i=0;i<70;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(.03,.012,1.2),new THREE.MeshBasicMaterial({color:i%5?0x2b302a:LIME}));d.position.set((i%2?1:-1)*2.5,-3.13,-i*2.3);lane.add(d)}
let mode='hero',anim='run',clock=new THREE.Clock(),worldZ=0,jump=0,userBloom=.48;
const keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Space')jump=1});addEventListener('keyup',e=>keys[e.code]=false);
const baseLegL=legL.position.clone(),baseLegR=legR.position.clone(),baseArmL=armL.position.clone(),baseArmR=armR.position.clone();
function neutralPose(){core.position.set(0,0,0);core.rotation.set(0,0,0);armL.position.copy(baseArmL);armR.position.copy(baseArmR);armL.rotation.set(0,0,.22);armR.rotation.set(0,0,-.22);legL.position.copy(baseLegL);legR.position.copy(baseLegR);legL.rotation.set(0,0,0);legR.rotation.set(0,0,0)}
function setPose(name,t){
 const speed=name==='sprint'?12:8,g=Math.sin(t*speed);
 if(name==='idle'||mode==='inspect'){neutralPose();core.position.y=Math.sin(t*1.7)*.015;return}
 if(name==='jump'){neutralPose();core.position.y=.52+Math.sin(t*3.6)*.04;armL.rotation.z=.72;armR.rotation.z=-.72;legL.rotation.x=-.34;legR.rotation.x=.34;return}
 if(mode==='hero'){
  core.position.set(-.04,.08+Math.abs(g)*.030,0);core.rotation.set(.012,-.075,-.036);
  armL.position.set(-2.76,-.46,.76);armR.position.set(2.80,-.34,.84);armL.rotation.set(-.34+g*.045,0,.25);armR.rotation.set(.28-g*.045,0,-.20);
  // right shoe is the hero sole toward camera, left shoe trails behind
  legR.position.set(.60,-2.30,1.52);legR.rotation.set(-1.16,.08,-.08);legR.scale.setScalar(1.08);
  legL.position.set(-.72,-2.64,-.10);legL.rotation.set(.18,0,.045);legL.scale.setScalar(.98);
 }else{neutralPose();legL.scale.setScalar(1);legR.scale.setScalar(1);const amp=name==='sprint'?.62:.42;armL.rotation.x=g*amp;armR.rotation.x=-g*amp;legL.rotation.x=-g*amp*.75;legR.rotation.x=g*amp*.75;core.position.y=Math.abs(g)*.04}
}
function setMode(m){
 mode=m;document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));legL.scale.setScalar(1);legR.scale.setScalar(1);
 if(m==='inspect'){vfx.visible=false;afterPass.enabled=false;lane.visible=false;anim='idle';bloomPass.strength=0;camera.position.set(6.4,3.55,13.5);controls.target.set(0,-.05,0);controls.enabled=true;modeLabel.textContent='Print inspect';neutralPose()}
 if(m==='hero'){vfx.visible=document.getElementById('tailToggle').checked;afterPass.enabled=document.getElementById('afterToggle').checked;lane.visible=false;anim='run';bloomPass.strength=userBloom;camera.position.set(6.7,3.75,14.2);controls.target.set(.40,.20,-.12);controls.enabled=true;modeLabel.textContent='Hero motion'}
 if(m==='world'){vfx.visible=document.getElementById('tailToggle').checked;afterPass.enabled=document.getElementById('afterToggle').checked;lane.visible=true;anim='run';bloomPass.strength=userBloom*.72;camera.position.set(6.6,3.8,12.4);controls.enabled=false;modeLabel.textContent='Run world'}
}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
document.querySelectorAll('[data-anim]').forEach(b=>b.onclick=()=>{anim=b.dataset.anim;document.querySelectorAll('.anim').forEach(x=>x.classList.toggle('active',x===b))});
const views={front:[0,.40,13.9],three:[6.4,3.55,13.5],side:[13.8,.40,0],back:[0,.40,-13.8],top:[0,14,.2]};document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const v=views[b.dataset.view];camera.position.set(...v);controls.target.set(0,-.05,0);controls.update()});
document.getElementById('tailToggle').onchange=e=>vfx.visible=e.target.checked&&mode!=='inspect';document.getElementById('afterToggle').onchange=e=>afterPass.enabled=e.target.checked&&mode!=='inspect';document.getElementById('particleToggle').onchange=e=>{particles.visible=e.target.checked;tailStars.visible=e.target.checked;debris.forEach(d=>d.visible=e.target.checked)};
document.getElementById('bloom').value=.48;document.getElementById('bloom').oninput=e=>{userBloom=+e.target.value;if(mode!=='inspect')bloomPass.strength=userBloom};document.getElementById('tailEnergy').value=1;document.getElementById('tailEnergy').oninput=e=>{const v=+e.target.value;tails.forEach((t,i)=>t.material.uniforms.uEnergy.value=v*(i<3?.30:.76))};
document.getElementById('eyeScale').value=1;document.getElementById('eyeScale').oninput=e=>{const v=+e.target.value;eyeL.scale.setScalar(v);eyeR.scale.setScalar(v)};document.getElementById('smileDepth').value=1;document.getElementById('smileDepth').oninput=e=>{const v=+e.target.value;mouthBack.scale.set(v,v,1)};
document.getElementById('roughness').value=.76;document.getElementById('roughness').oninput=e=>{bodyMat.roughness=+e.target.value;rockMat.roughness=+e.target.value};document.getElementById('wire').onchange=e=>core.traverse(o=>{if(o.isMesh&&o.material&&o.material.wireframe!==undefined)o.material.wireframe=e.target.checked});
document.getElementById('shot').onclick=()=>{composer.render();const a=document.createElement('a');a.download='OG_FASTR_character_lab.png';a.href=renderer.domElement.toDataURL('image/png');a.click()};document.getElementById('exportGLB').onclick=()=>{const old=vfx.visible;vfx.visible=false;neutralPose();new GLTFExporter().parse(core,res=>{const blob=new Blob([res],{type:'model/gltf-binary'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='OG_FASTR_clean_master.glb';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);vfx.visible=old},{binary:true,onlyVisible:true})};

function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.034),t=clock.elapsedTime;controls.update();setPose(anim,t);
 if(mode==='world'){const sprint=keys.ShiftLeft||keys.ShiftRight,move=(keys.KeyW?1:0)-(keys.KeyS?1:0),side=(keys.KeyD?1:0)-(keys.KeyA?1:0);worldZ+=move*(sprint?9:5.5)*dt;character.position.x+=side*2.7*dt;character.position.x=THREE.MathUtils.clamp(character.position.x,-3,3);lane.position.z=worldZ%2.3;anim=sprint?'sprint':'run';if(jump>0){jump=Math.max(0,jump-dt*1.55);character.position.y=.25+Math.sin(jump*Math.PI)*1.05}else character.position.y=.25;camera.position.x=THREE.MathUtils.lerp(camera.position.x,character.position.x+5.8,.035);camera.lookAt(character.position.x,.15,0)}
 tails.forEach((m,i)=>{m.material.uniforms.uTime.value=t*(1+i*.035)+i*.28;m.position.y=Math.sin(t*2.1+i)*.012});auras.forEach((s,i)=>{s.material.opacity=.075+.035*(.5+.5*Math.sin(t*2.5+i));s.scale.x*=1});tailStars.material.opacity=.62+.18*Math.sin(t*4.3);
 const arr=pGeo.attributes.position.array;for(let i=0;i<pCount;i++){arr[i*3]+=(.015+.05*pSeed[i]);if(arr[i*3]>9.3)arr[i*3]=1.15;arr[i*3+1]+=Math.sin(t*2+pSeed[i]*20)*.0012}pGeo.attributes.position.needsUpdate=true;debris.forEach((d,i)=>{d.rotation.x+=dt*(.45+i*.025);d.rotation.y+=dt*(.34+i*.02);d.position.x+=dt*.40;if(d.position.x>9.4)d.position.x=1.8});composer.render(dt)}
setMode('hero');setTimeout(()=>loading.classList.add('hide'),700);animate();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});
