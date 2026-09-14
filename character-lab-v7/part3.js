// ---------- PREMIUM SEPARATE COMET VFX ----------
// Character remains a clean/exportable mesh. Tail is 100% separate motion graphics.
function ribbonGeometry(points,width=.7,segments=150){
 const curve=new THREE.CatmullRomCurve3(points),verts=[],uvs=[],idx=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,p=curve.getPoint(t),tan=curve.getTangent(t).normalize();let side=new THREE.Vector3(0,1,0).cross(tan);
  if(side.lengthSq()<.001)side.set(1,0,0);side.normalize();const w=width*(1-t*.68);
  const a=p.clone().addScaledVector(side,w),b=p.clone().addScaledVector(side,-w);verts.push(a.x,a.y,a.z,b.x,b.y,b.z);uvs.push(t,0,t,1);
  if(i<segments){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(idx);return g;
}
const tailVert=`varying vec2 vUv;uniform float uTime;uniform float uPhase;uniform float uAmp;void main(){vUv=uv;vec3 p=position;float f=.20+uv.x*1.22;p.y+=sin(uv.x*11.2-uTime*3.35+uPhase)*uAmp*f;p.z+=cos(uv.x*7.8-uTime*2.2+uPhase)*uAmp*.62*f;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const tailFrag=`varying vec2 vUv;uniform float uTime;uniform vec3 uColor;uniform float uEnergy;uniform float uSoft;void main(){float y=abs(vUv.y-.5);float edge=1.-smoothstep(.08,.5,y);float core=1.-smoothstep(0.,.095,y);float start=smoothstep(0.,.025,vUv.x);float end=1.-smoothstep(.70,1.,vUv.x);float pulse=.76+.24*sin(vUv.x*26.-uTime*8.2);float flick=.90+.10*sin(vUv.x*69.-uTime*13.+vUv.y*10.);float a=mix(core,edge,uSoft)*start*end*pulse*flick*uEnergy;vec3 c=mix(uColor,vec3(1.),core*.94);gl_FragColor=vec4(c*(1.18+core*1.9),a);}`;
function makeTail(points,width,color,energy,phase,amp,soft=.5){
 const mat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uPhase:{value:phase},uAmp:{value:amp},uColor:{value:new THREE.Color(color)},uEnergy:{value:energy},uSoft:{value:soft}},vertexShader:tailVert,fragmentShader:tailFrag,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false});
 const m=new THREE.Mesh(ribbonGeometry(points.map(p=>new THREE.Vector3(...p)),width),mat);vfx.add(m);return m;
}
const tailPaths=[
 [[.86,1.64,-1.58],[1.75,2.58,-2.32],[3.55,3.72,-4.00],[6.05,4.92,-6.45],[8.85,4.45,-9.15]],
 [[.92,1.25,-1.66],[2.20,2.02,-2.66],[4.05,2.88,-4.43],[6.45,3.78,-6.72],[8.95,4.30,-9.15]],
 [[.88,.74,-1.70],[2.18,.30,-2.92],[4.18,.44,-4.82],[6.50,1.56,-6.98],[8.92,3.15,-9.12]],
 [[.78,1.50,-1.74],[1.88,2.20,-2.74],[3.90,3.15,-4.74],[6.55,3.95,-7.06],[9.12,3.58,-9.42]],
 [[.76,.94,-1.78],[1.96,.82,-3.02],[4.02,1.22,-5.02],[6.55,2.10,-7.26],[8.98,3.48,-9.38]]
];
const tails=[
 makeTail(tailPaths[0],1.02,0xbaff00,.22,.0,.075,.98),
 makeTail(tailPaths[1],.82,0xd8ff1e,.27,.7,.064,.88),
 makeTail(tailPaths[2],.72,0xcaff12,.25,1.4,.078,.84),
 makeTail(tailPaths[3],.19,0xffffff,.78,2.0,.042,.18),
 makeTail(tailPaths[4],.15,0xffffff,.70,2.7,.048,.14),
 makeTail(tailPaths[0],.090,0xffffff,.76,3.2,.026,.08)
];

function radialGlowTexture(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),g=x.createRadialGradient(128,128,2,128,128,126);g.addColorStop(0,'rgba(255,255,245,.92)');g.addColorStop(.10,'rgba(225,255,95,.62)');g.addColorStop(.35,'rgba(216,255,30,.28)');g.addColorStop(.72,'rgba(120,255,0,.08)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const auraTex=radialGlowTexture(),auras=[];
[[1.15,1.32,-1.92,2.8],[2.25,1.78,-2.85,2.9],[3.65,2.35,-4.15,3.4],[5.35,2.95,-5.75,3.8],[7.20,3.55,-7.65,4.2],[8.55,3.9,-8.9,4.0]].forEach((a,i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:auraTex,color:i%2?0xd8ff1e:0xbaff00,transparent:true,opacity:i===0?.16:.105,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));s.position.set(a[0],a[1],a[2]);s.scale.set(a[3]*1.85,a[3],1);vfx.add(s);auras.push(s)});

const starTex=(()=>{const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');x.translate(48,48);const g=x.createRadialGradient(0,0,0,0,0,46);g.addColorStop(0,'#fff');g.addColorStop(.16,'rgba(255,255,255,.94)');g.addColorStop(.54,'rgba(216,255,30,.18)');g.addColorStop(1,'rgba(216,255,30,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,-46);x.quadraticCurveTo(5,-5,46,0);x.quadraticCurveTo(5,5,0,46);x.quadraticCurveTo(-5,5,-46,0);x.quadraticCurveTo(-5,-5,0,-46);x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
const starN=46,starPos=new Float32Array(starN*3);for(let i=0;i<starN;i++){starPos[i*3]=1.0+Math.random()*8.0;starPos[i*3+1]=-.1+Math.random()*5.0;starPos[i*3+2]=-1.6-Math.random()*7.9}
const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));const tailStars=new THREE.Points(starGeo,new THREE.PointsMaterial({map:starTex,color:0xffffff,size:.20,transparent:true,opacity:.80,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,alphaTest:.02}));vfx.add(tailStars);
const pCount=210,pArr=new Float32Array(pCount*3),pSeed=[];for(let i=0;i<pCount;i++){pSeed.push(Math.random());pArr[i*3]=.9+Math.random()*8.3;pArr[i*3+1]=-.3+Math.random()*5.0;pArr[i*3+2]=-1.6-Math.random()*8.2}
const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pArr,3));const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:LIME,size:.038,transparent:true,opacity:.52,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));vfx.add(particles);
const debris=[];for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.07+Math.random()*.16,1),rockMat.clone());m.position.set(1.7+Math.random()*7.0,-.1+Math.random()*4.4,-2.0-Math.random()*7.2);vfx.add(m);debris.push(m)}

// ---------- LAB INTERACTION / MASTER POSES ----------
const lane=new THREE.Group();scene.add(lane);lane.visible=false;for(let i=0;i<70;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(.03,.012,1.2),new THREE.MeshBasicMaterial({color:i%5?0x2b302a:LIME}));d.position.set((i%2?1:-1)*2.5,-3.13,-i*2.3);lane.add(d)}
let mode='hero',anim='run',clock=new THREE.Clock(),worldZ=0,jump=0,userBloom=.46;
const keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Space')jump=1});addEventListener('keyup',e=>keys[e.code]=false);
const baseLegL=legL.position.clone(),baseLegR=legR.position.clone(),baseArmL=armL.position.clone(),baseArmR=armR.position.clone();
function neutralPose(){core.position.set(0,0,0);core.rotation.set(0,0,0);armL.position.copy(baseArmL);armR.position.copy(baseArmR);armL.rotation.set(0,0,.12);armR.rotation.set(0,0,-.12);legL.position.copy(baseLegL);legR.position.copy(baseLegR);legL.rotation.set(0,0,0);legR.rotation.set(0,0,0)}
function setPose(name,t){
 const speed=name==='sprint'?12:8,g=Math.sin(t*speed);
 if(name==='idle'||mode==='inspect'){neutralPose();core.position.y=Math.sin(t*1.7)*.015;return}
 if(name==='jump'){neutralPose();core.position.y=.52+Math.sin(t*3.6)*.04;armL.rotation.z=.70;armR.rotation.z=-.70;legL.rotation.x=-.34;legR.rotation.x=.34;return}
 if(mode==='hero'){
  core.position.set(-.04,.08+Math.abs(g)*.030,0);core.rotation.set(.012,-.075,-.036);
  armL.position.set(-2.70,-.42,.72);armR.position.set(2.72,-.32,.80);armL.rotation.set(-.30+g*.045,0,.18);armR.rotation.set(.26-g*.045,0,-.17);
  legR.position.set(.60,-2.28,1.48);legR.rotation.set(-1.15,.08,-.08);legR.scale.setScalar(1.07);
  legL.position.set(-.72,-2.62,-.10);legL.rotation.set(.18,0,.045);legL.scale.setScalar(.98);
 }else{neutralPose();legL.scale.setScalar(1);legR.scale.setScalar(1);const amp=name==='sprint'?.62:.42;armL.rotation.x=g*amp;armR.rotation.x=-g*amp;legL.rotation.x=-g*amp*.75;legR.rotation.x=g*amp*.75;core.position.y=Math.abs(g)*.04}
}
function setMode(m){
 mode=m;document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));legL.scale.setScalar(1);legR.scale.setScalar(1);
 if(m==='inspect'){vfx.visible=false;afterPass.enabled=false;lane.visible=false;anim='idle';bloomPass.strength=0;camera.position.set(6.35,3.50,13.6);controls.target.set(0,-.05,0);controls.enabled=true;modeLabel.textContent='Print inspect';neutralPose()}
 if(m==='hero'){vfx.visible=document.getElementById('tailToggle').checked;afterPass.enabled=document.getElementById('afterToggle').checked;lane.visible=false;anim='run';bloomPass.strength=userBloom;camera.position.set(6.65,3.72,14.25);controls.target.set(.36,.18,-.12);controls.enabled=true;modeLabel.textContent='Hero motion'}
 if(m==='world'){vfx.visible=document.getElementById('tailToggle').checked;afterPass.enabled=document.getElementById('afterToggle').checked;lane.visible=true;anim='run';bloomPass.strength=userBloom*.72;camera.position.set(6.6,3.8,12.4);controls.enabled=false;modeLabel.textContent='Run world'}
}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
document.querySelectorAll('[data-anim]').forEach(b=>b.onclick=()=>{anim=b.dataset.anim;document.querySelectorAll('.anim').forEach(x=>x.classList.toggle('active',x===b))});
const views={front:[0,.40,13.9],three:[6.35,3.50,13.6],side:[13.8,.40,0],back:[0,.40,-13.8],top:[0,14,.2]};document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const v=views[b.dataset.view];camera.position.set(...v);controls.target.set(0,-.05,0);controls.update()});
document.getElementById('tailToggle').onchange=e=>vfx.visible=e.target.checked&&mode!=='inspect';document.getElementById('afterToggle').onchange=e=>afterPass.enabled=e.target.checked&&mode!=='inspect';document.getElementById('particleToggle').onchange=e=>{particles.visible=e.target.checked;tailStars.visible=e.target.checked;debris.forEach(d=>d.visible=e.target.checked)};
document.getElementById('bloom').value=.46;document.getElementById('bloom').oninput=e=>{userBloom=+e.target.value;if(mode!=='inspect')bloomPass.strength=userBloom};document.getElementById('tailEnergy').value=1.04;document.getElementById('tailEnergy').oninput=e=>{const v=+e.target.value;tails.forEach((t,i)=>t.material.uniforms.uEnergy.value=v*(i<3?.28:.76))};
document.getElementById('eyeScale').value=1;document.getElementById('eyeScale').oninput=e=>{const v=+e.target.value;eyeL.scale.setScalar(v);eyeR.scale.setScalar(v)};document.getElementById('smileDepth').value=1;document.getElementById('smileDepth').oninput=e=>{const v=+e.target.value;mouthBack.scale.set(v,v,1)};
document.getElementById('roughness').value=.78;document.getElementById('roughness').oninput=e=>{bodyMat.roughness=+e.target.value;rockMat.roughness=+e.target.value};document.getElementById('wire').onchange=e=>core.traverse(o=>{if(o.isMesh&&o.material&&o.material.wireframe!==undefined)o.material.wireframe=e.target.checked});
document.getElementById('shot').onclick=()=>{composer.render();const a=document.createElement('a');a.download='OG_FASTR_character_lab.png';a.href=renderer.domElement.toDataURL('image/png');a.click()};document.getElementById('exportGLB').onclick=()=>{const old=vfx.visible;vfx.visible=false;neutralPose();new GLTFExporter().parse(core,res=>{const blob=new Blob([res],{type:'model/gltf-binary'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='OG_FASTR_clean_master.glb';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);vfx.visible=old},{binary:true,onlyVisible:true})};
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.034),t=clock.elapsedTime;controls.update();setPose(anim,t);
 if(mode==='world'){const sprint=keys.ShiftLeft||keys.ShiftRight,move=(keys.KeyW?1:0)-(keys.KeyS?1:0),side=(keys.KeyD?1:0)-(keys.KeyA?1:0);worldZ+=move*(sprint?9:5.5)*dt;character.position.x+=side*2.7*dt;character.position.x=THREE.MathUtils.clamp(character.position.x,-3,3);lane.position.z=worldZ%2.3;anim=sprint?'sprint':'run';if(jump>0){jump=Math.max(0,jump-dt*1.55);character.position.y=.25+Math.sin(jump*Math.PI)*1.05}else character.position.y=.25;camera.position.x=THREE.MathUtils.lerp(camera.position.x,character.position.x+5.8,.035);camera.lookAt(character.position.x,.15,0)}
 tails.forEach((m,i)=>{m.material.uniforms.uTime.value=t*(1+i*.035)+i*.28;m.position.y=Math.sin(t*2.05+i)*.014});auras.forEach((s,i)=>{s.material.opacity=(i===0?.13:.075)+.035*(.5+.5*Math.sin(t*2.4+i));});tailStars.material.opacity=.62+.18*Math.sin(t*4.3);
 const arr=pGeo.attributes.position.array;for(let i=0;i<pCount;i++){arr[i*3]+=(.015+.05*pSeed[i]);if(arr[i*3]>9.3)arr[i*3]=.95;arr[i*3+1]+=Math.sin(t*2+pSeed[i]*20)*.0012}pGeo.attributes.position.needsUpdate=true;debris.forEach((d,i)=>{d.rotation.x+=dt*(.45+i*.025);d.rotation.y+=dt*(.34+i*.02);d.position.x+=dt*.40;if(d.position.x>9.4)d.position.x=1.6});composer.render(dt)}
setMode('hero');setTimeout(()=>loading.classList.add('hide'),700);animate();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});