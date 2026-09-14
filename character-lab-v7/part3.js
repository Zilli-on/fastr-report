// ---------- Separate animated comet VFX ----------
// Character geometry remains clean/exportable. Everything below lives in vfx and is never exported.
function ribbonGeometry(points,width=.7,segments=120){
 const curve=new THREE.CatmullRomCurve3(points),verts=[],uvs=[],idx=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,p=curve.getPoint(t),tan=curve.getTangent(t).normalize();let side=new THREE.Vector3(0,1,0).cross(tan);
  if(side.lengthSq()<.001)side.set(1,0,0);side.normalize();const w=width*(1-t*.64);
  const a=p.clone().addScaledVector(side,w),b=p.clone().addScaledVector(side,-w);verts.push(a.x,a.y,a.z,b.x,b.y,b.z);uvs.push(t,0,t,1);
  if(i<segments){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(idx);return g;
}
const tailVert=`varying vec2 vUv;uniform float uTime;uniform float uPhase;uniform float uAmp;void main(){vUv=uv;vec3 p=position;float f=(.18+uv.x);p.y+=sin(uv.x*13.-uTime*3.4+uPhase)*uAmp*f;p.z+=cos(uv.x*9.-uTime*2.3+uPhase)*uAmp*.48*f;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const tailFrag=`varying vec2 vUv;uniform float uTime;uniform vec3 uColor;uniform float uEnergy;void main(){float y=abs(vUv.y-.5);float core=1.-smoothstep(.02,.46,y);float hot=1.-smoothstep(.0,.12,y);float start=smoothstep(.0,.035,vUv.x);float end=1.-smoothstep(.73,1.,vUv.x);float flow=.73+.27*sin(vUv.x*29.-uTime*8.);float alpha=core*start*end*(.55+.45*flow)*uEnergy;vec3 c=mix(uColor,vec3(1.),hot*.88);gl_FragColor=vec4(c*(1.9+hot*1.6),alpha);}`;
function makeTail(points,width,color,energy,phase,amp){
 const mat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uPhase:{value:phase},uAmp:{value:amp},uColor:{value:new THREE.Color(color)},uEnergy:{value:energy}},vertexShader:tailVert,fragmentShader:tailFrag,transparent:true,depthWrite:false,depthTest:true,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false});
 const m=new THREE.Mesh(ribbonGeometry(points.map(p=>new THREE.Vector3(...p)),width),mat);vfx.add(m);return m;
}
const tailPaths=[
 [[1.25,1.78,-1.72],[2.15,2.72,-2.65],[3.85,3.75,-4.45],[6.25,4.60,-6.85],[8.65,4.25,-9.25]],
 [[1.38,1.34,-1.82],[2.55,1.95,-3.00],[4.20,2.68,-4.75],[6.30,3.45,-6.90],[8.55,4.35,-9.20]],
 [[1.28,.78,-1.84],[2.55,.28,-3.15],[4.35,.38,-5.05],[6.35,1.45,-7.12],[8.55,3.05,-9.18]],
 [[1.02,1.55,-1.92],[2.18,2.15,-3.02],[4.10,3.05,-5.05],[6.55,3.70,-7.30],[8.95,3.55,-9.45]],
 [[1.06,.92,-1.92],[2.18,.80,-3.20],[4.15,1.18,-5.20],[6.40,2.05,-7.32],[8.80,3.38,-9.40]]
];
const cosmicMat=new THREE.MeshBasicMaterial({color:0x010201,transparent:true,opacity:.76,depthWrite:false,depthTest:true,side:THREE.DoubleSide});
const cosmicBack=new THREE.Mesh(ribbonGeometry(tailPaths[1].map(p=>new THREE.Vector3(...p)),1.66),cosmicMat);cosmicBack.position.z=-.06;vfx.add(cosmicBack);
const cosmicBack2=new THREE.Mesh(ribbonGeometry(tailPaths[2].map(p=>new THREE.Vector3(...p)),1.28),cosmicMat.clone());cosmicBack2.material.opacity=.62;cosmicBack2.position.z=-.08;vfx.add(cosmicBack2);
const tails=[
 makeTail(tailPaths[0],.38,0xd8ff1e,1.02,.0,.055),makeTail(tailPaths[1],.29,0xffffff,.92,.7,.044),makeTail(tailPaths[2],.34,0xcaff12,.90,1.4,.060),
 makeTail(tailPaths[3],.16,0xffffff,.86,2.0,.035),makeTail(tailPaths[4],.13,0xb8ff00,.92,2.6,.042)
];

function radialGlowTexture(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),g=x.createRadialGradient(128,128,4,128,128,126);g.addColorStop(0,'rgba(255,255,235,.72)');g.addColorStop(.16,'rgba(216,255,30,.28)');g.addColorStop(.60,'rgba(120,255,0,.08)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const auraTex=radialGlowTexture(),auras=[];
[[2.0,1.7,-2.7,2.4],[3.5,2.4,-4.2,3.0],[5.2,3.05,-5.9,3.6],[7.0,3.55,-7.9,4.0]].forEach((a,i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:auraTex,color:i%2?0xd8ff1e:0xbaff00,transparent:true,opacity:.12,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,toneMapped:false}));s.position.set(a[0],a[1],a[2]);s.scale.set(a[3]*1.7,a[3],1);vfx.add(s);auras.push(s)});

const starTex=(()=>{const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');x.translate(48,48);const g=x.createRadialGradient(0,0,0,0,0,46);g.addColorStop(0,'#fff');g.addColorStop(.18,'rgba(255,255,255,.95)');g.addColorStop(.55,'rgba(216,255,30,.2)');g.addColorStop(1,'rgba(216,255,30,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,-46);x.quadraticCurveTo(5,-5,46,0);x.quadraticCurveTo(5,5,0,46);x.quadraticCurveTo(-5,5,-46,0);x.quadraticCurveTo(-5,-5,0,-46);x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
const starN=34,starPos=new Float32Array(starN*3);for(let i=0;i<starN;i++){starPos[i*3]=1.5+Math.random()*7.2;starPos[i*3+1]=.1+Math.random()*4.6;starPos[i*3+2]=-2-Math.random()*7.4}
const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));const tailStars=new THREE.Points(starGeo,new THREE.PointsMaterial({map:starTex,color:0xffffff,size:.20,transparent:true,opacity:.80,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,toneMapped:false,alphaTest:.02}));vfx.add(tailStars);
const pCount=150,pArr=new Float32Array(pCount*3),pSeed=[];for(let i=0;i<pCount;i++){pSeed.push(Math.random());pArr[i*3]=1.1+Math.random()*7.8;pArr[i*3+1]=-.1+Math.random()*4.7;pArr[i*3+2]=-1.8-Math.random()*7.9}
const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pArr,3));const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:LIME,size:.038,transparent:true,opacity:.55,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,toneMapped:false}));vfx.add(particles);
const debris=[];for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.07+Math.random()*.17,1),rockMat.clone());m.position.set(1.8+Math.random()*6.9,.0+Math.random()*4.2,-2.1-Math.random()*7.1);vfx.add(m);debris.push(m)}

// ---------- Lab interaction / posing ----------
const lane=new THREE.Group();scene.add(lane);lane.visible=false;for(let i=0;i<70;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(.03,.012,1.2),new THREE.MeshBasicMaterial({color:i%5?0x2b302a:LIME}));d.position.set((i%2?1:-1)*2.5,-3.13,-i*2.3);lane.add(d)}
let mode='hero',anim='run',clock=new THREE.Clock(),worldZ=0,jump=0,userBloom=.42;
const keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Space')jump=1});addEventListener('keyup',e=>keys[e.code]=false);
const baseLegL=legL.position.clone(),baseLegR=legR.position.clone(),baseArmL=armL.position.clone(),baseArmR=armR.position.clone();
function neutralPose(){core.position.set(0,0,0);core.rotation.set(0,0,0);armL.position.copy(baseArmL);armR.position.copy(baseArmR);armL.rotation.set(0,0,.22);armR.rotation.set(0,0,-.22);legL.position.copy(baseLegL);legR.position.copy(baseLegR);legL.rotation.set(0,0,0);legR.rotation.set(0,0,0)}
function setPose(name,t){
 const speed=name==='sprint'?12:8,g=Math.sin(t*speed);
 if(name==='idle'||mode==='inspect'){neutralPose();core.position.y=Math.sin(t*1.7)*.018;return}
 if(name==='jump'){neutralPose();core.position.y=.52+Math.sin(t*3.6)*.04;armL.rotation.z=.75;armR.rotation.z=-.75;legL.rotation.x=-.36;legR.rotation.x=.36;return}
 if(mode==='hero'){
  core.position.set(-.02,.08+Math.abs(g)*.035,0);core.rotation.set(.015,-.09,-.045);
  armL.position.copy(baseArmL);armR.position.copy(baseArmR);armL.rotation.set(-.42+g*.055,0,.25);armR.rotation.set(.38-g*.055,0,-.18);
  legL.position.set(-.40,-2.40,1.06);legL.rotation.set(-1.08,.06,-.10);legR.position.set(.78,-2.66,-.18);legR.rotation.set(.24,0,.055);
 }else{neutralPose();const amp=name==='sprint'?.64:.44;armL.rotation.x=g*amp;armR.rotation.x=-g*amp;legL.rotation.x=-g*amp*.76;legR.rotation.x=g*amp*.76;core.position.y=Math.abs(g)*.045}
}
function setMode(m){
 mode=m;document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));
 if(m==='inspect'){vfx.visible=false;afterPass.enabled=false;lane.visible=false;anim='idle';bloomPass.strength=0;camera.position.set(6.7,3.8,13.2);controls.target.set(0,-.05,0);controls.enabled=true;modeLabel.textContent='Print inspect';neutralPose()}
 if(m==='hero'){vfx.visible=document.getElementById('tailToggle').checked;afterPass.enabled=document.getElementById('afterToggle').checked;lane.visible=false;anim='run';bloomPass.strength=userBloom;camera.position.set(7.5,4.45,13.9);controls.target.set(.72,.34,-.30);controls.enabled=true;modeLabel.textContent='Hero motion'}
 if(m==='world'){vfx.visible=document.getElementById('tailToggle').checked;afterPass.enabled=document.getElementById('afterToggle').checked;lane.visible=true;anim='run';bloomPass.strength=userBloom*.75;camera.position.set(6.8,3.9,12.2);controls.enabled=false;modeLabel.textContent='Run world'}
}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
document.querySelectorAll('[data-anim]').forEach(b=>b.onclick=()=>{anim=b.dataset.anim;document.querySelectorAll('.anim').forEach(x=>x.classList.toggle('active',x===b))});
const views={front:[0,.45,13.6],three:[6.7,3.8,13.2],side:[13.6,.45,0],back:[0,.45,-13.6],top:[0,14,.2]};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const v=views[b.dataset.view];camera.position.set(...v);controls.target.set(0,-.05,0);controls.update()});
document.getElementById('tailToggle').onchange=e=>vfx.visible=e.target.checked&&mode!=='inspect';
document.getElementById('afterToggle').onchange=e=>afterPass.enabled=e.target.checked&&mode!=='inspect';
document.getElementById('particleToggle').onchange=e=>{particles.visible=e.target.checked;tailStars.visible=e.target.checked;debris.forEach(d=>d.visible=e.target.checked)};
document.getElementById('bloom').value=.42;document.getElementById('bloom').oninput=e=>{userBloom=+e.target.value;if(mode!=='inspect')bloomPass.strength=userBloom};
document.getElementById('tailEnergy').value=1.05;document.getElementById('tailEnergy').oninput=e=>{const v=+e.target.value;tails.forEach(t=>t.material.uniforms.uEnergy.value=v)};
document.getElementById('eyeScale').value=1;document.getElementById('eyeScale').oninput=e=>{const v=+e.target.value;eyeL.scale.setScalar(v);eyeR.scale.setScalar(v)};
document.getElementById('smileDepth').value=1;document.getElementById('smileDepth').oninput=e=>{const v=+e.target.value;mouthBack.scale.set(v,v,1);smilePlane.scale.set(v,v,1)};
document.getElementById('roughness').value=.74;document.getElementById('roughness').oninput=e=>{bodyMat.roughness=+e.target.value;rockMat.roughness=+e.target.value};
document.getElementById('wire').onchange=e=>core.traverse(o=>{if(o.isMesh&&o.material&&o.material.wireframe!==undefined)o.material.wireframe=e.target.checked});
document.getElementById('shot').onclick=()=>{composer.render();const a=document.createElement('a');a.download='OG_FASTR_character_lab.png';a.href=renderer.domElement.toDataURL('image/png');a.click()};
document.getElementById('exportGLB').onclick=()=>{const old=vfx.visible;vfx.visible=false;neutralPose();new GLTFExporter().parse(core,res=>{const blob=new Blob([res],{type:'model/gltf-binary'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='OG_FASTR_clean_master.glb';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);vfx.visible=old},{binary:true,onlyVisible:true})};

function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.034),t=clock.elapsedTime;controls.update();setPose(anim,t);
 if(mode==='world'){
  const sprint=keys.ShiftLeft||keys.ShiftRight,move=(keys.KeyW?1:0)-(keys.KeyS?1:0),side=(keys.KeyD?1:0)-(keys.KeyA?1:0);worldZ+=move*(sprint?9:5.5)*dt;character.position.x=THREE.MathUtils.clamp(character.position.x+side*2.7*dt,-2.8,2.8);lane.position.z=worldZ%2.3;anim=sprint?'sprint':'run';if(jump>0){jump=Math.max(0,jump-dt*1.45);character.position.y=.18+Math.sin(jump*Math.PI)*.95}else character.position.y=.18;camera.position.x=THREE.MathUtils.lerp(camera.position.x,character.position.x+6.2,.025);camera.lookAt(character.position.x,.1,-.8)
 }
 tails.forEach((m,i)=>m.material.uniforms.uTime.value=t+i*.28);cosmicBack.position.y=Math.sin(t*1.35)*.025;cosmicBack2.position.y=Math.cos(t*1.15)*.018;auras.forEach((s,i)=>{s.material.opacity=.085+.04*(.5+.5*Math.sin(t*2+i))});tailStars.material.opacity=.64+.18*Math.sin(t*3.2);
 const pa=particles.geometry.attributes.position.array;for(let i=0;i<pCount;i++){pa[i*3]+=(.016+.028*pSeed[i]);if(pa[i*3]>9)pa[i*3]=1.15;pa[i*3+1]+=Math.sin(t*2.1+pSeed[i]*20)*.0011}particles.geometry.attributes.position.needsUpdate=true;
 debris.forEach((d,i)=>{d.rotation.x+=dt*(.35+i*.025);d.rotation.y+=dt*(.26+i*.018);d.position.x+=dt*.22;if(d.position.x>9)d.position.x=1.6});composer.render(dt)
}
setMode('hero');setTimeout(()=>loading.classList.add('hide'),700);animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});
