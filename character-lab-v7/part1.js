const LIME=0xd8ff1e, ROCK=0x242724, BLACK=0x050605, OFFWHITE=0xf4f4ec;
const stage=document.getElementById('stage');
const loading=document.getElementById('loading');
const modeLabel=document.getElementById('modeLabel');

const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=.93;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x020302,.022);
const pmrem=new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(new RoomEnvironment(renderer),.03).texture;
const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.05,160);
camera.position.set(7.8,5.2,11.8);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=.055; controls.target.set(0,.8,0); controls.minDistance=5.8; controls.maxDistance=22;

scene.add(new THREE.HemisphereLight(0xffffff,0x090d07,1.7));
const key=new THREE.DirectionalLight(0xffffff,3.0); key.position.set(6,10,9); key.castShadow=true; key.shadow.mapSize.set(2048,2048); scene.add(key);
const rim=new THREE.PointLight(LIME,44,20,1.9); rim.position.set(-5,4,-4); scene.add(rim);
const soft=new THREE.PointLight(0x8ca8ff,7,18,2); soft.position.set(4,1,-5); scene.add(soft);
const chin=new THREE.PointLight(LIME,7.5,9,2); chin.position.set(0,-1.5,4); scene.add(chin);

const floor=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:0x040604,roughness:.96,metalness:.01}));
floor.rotation.x=-Math.PI/2; floor.position.y=-3.12; floor.receiveShadow=true; scene.add(floor);
const grid=new THREE.GridHelper(160,160,0x182012,0x0b1009); grid.position.y=-3.1; grid.material.opacity=.12; grid.material.transparent=true; scene.add(grid);

const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloomPass=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.72,.52,1.02); composer.addPass(bloomPass);
const afterPass=new AfterimagePass(.76); afterPass.enabled=false; composer.addPass(afterPass);

const character=new THREE.Group(); character.name='OG_FASTR_CLEAN_MASTER'; scene.add(character);
character.position.y=.25;
const core=new THREE.Group(); core.name='PRINTABLE_CORE'; character.add(core);
const vfx=new THREE.Group(); vfx.name='SEPARATE_COMET_VFX'; character.add(vfx);

function makeRockBump(){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 const id=x.createImageData(c.width,c.height);let r=987654321;const rand=()=>{r=(r*1664525+1013904223)>>>0;return r/4294967296};
 for(let yy=0;yy<c.height;yy++)for(let xx=0;xx<c.width;xx++){
  const i=(yy*c.width+xx)*4;
  const fine=(rand()-.5)*42, wave=14*Math.sin(xx*.31)+10*Math.cos(yy*.27)+6*Math.sin((xx+yy)*.12);
  const v=Math.max(25,Math.min(220,118+fine+wave));id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255;
 }
 x.putImageData(id,0,0);
 x.globalCompositeOperation='screen';
 for(let i=0;i<480;i++){const px=rand()*512,py=rand()*512,rr=.4+rand()*2.4;x.fillStyle=`rgba(255,255,255,${.02+rand()*.05})`;x.beginPath();x.arc(px,py,rr,0,Math.PI*2);x.fill();}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3.6,2.2);t.colorSpace=THREE.NoColorSpace;return t;
}
const rockBump=makeRockBump();
const bodyMat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.73,metalness:.055,bumpMap:rockBump,bumpScale:.055,envMapIntensity:.78});
const rockMat=new THREE.MeshStandardMaterial({color:ROCK,roughness:.76,metalness:.055,bumpMap:rockBump,bumpScale:.035,envMapIntensity:.72});
const rockDark=new THREE.MeshStandardMaterial({color:0x070907,roughness:.96,metalness:.01});
const rubberMat=new THREE.MeshStandardMaterial({color:0x111411,roughness:.72,metalness:.025,envMapIntensity:.4});
const soleMat=new THREE.MeshStandardMaterial({color:0x050605,roughness:.64,metalness:.06});
const whiteMat=new THREE.MeshPhysicalMaterial({color:OFFWHITE,roughness:.31,metalness:.01,clearcoat:.14,clearcoatRoughness:.28,envMapIntensity:.55});
const limeMat=new THREE.MeshStandardMaterial({color:LIME,emissive:LIME,emissiveIntensity:.18,roughness:.28,metalness:.04});
const chromeMat=new THREE.MeshStandardMaterial({color:0xe9e9e2,roughness:.17,metalness:.68,envMapIntensity:.9});
let sseed=68217; const rnd=()=>{sseed=(sseed*16807)%2147483647;return(sseed-1)/2147483646};
function smoothstep(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}

const bodyGeo=new THREE.SphereGeometry(2.72,168,126);
const pos=bodyGeo.attributes.position;
const craterDefs=[];
const protectedFace=(n)=>n.z>.46 && Math.abs(n.x)<.76 && n.y<.76;
for(let i=0;i<54;i++){
  let u=rnd()*2-1,a=rnd()*Math.PI*2; const ss=Math.sqrt(1-u*u); let n=new THREE.Vector3(ss*Math.cos(a),u,ss*Math.sin(a));
  if(protectedFace(n)){i--;continue}
  craterDefs.push({n,r:.065+rnd()*.20,d:.06+rnd()*.16,rim:.025+rnd()*.045});
}
craterDefs.push(
 {n:new THREE.Vector3(-.28,.82,.48).normalize(),r:.26,d:.23,rim:.07},
 {n:new THREE.Vector3(.38,.72,.55).normalize(),r:.20,d:.17,rim:.06},
 {n:new THREE.Vector3(-.68,.48,.55).normalize(),r:.18,d:.14,rim:.05},
 {n:new THREE.Vector3(.72,.38,.48).normalize(),r:.16,d:.12,rim:.04},
 {n:new THREE.Vector3(.12,.97,.18).normalize(),r:.18,d:.17,rim:.05}
);
const colors=new Float32Array(pos.count*3);
const baseColor=new THREE.Color(0x292c29), pitColor=new THREE.Color(0x090b09), rimColor=new THREE.Color(0x5a5d56);
for(let i=0;i<pos.count;i++){
  const p=new THREE.Vector3().fromBufferAttribute(pos,i);
  const n=p.clone().normalize();
  let radius=2.60, maxPit=0, maxRim=0;
  radius*=1 + .014*Math.sin(n.x*8.3+n.y*5.1) + .008*Math.sin(n.z*13.7-n.x*4.4);
  radius*=1 + .018*(n.y+.1) - .012*Math.max(0,n.z);
  for(const c of craterDefs){
    const ang=Math.acos(THREE.MathUtils.clamp(n.dot(c.n),-1,1));
    const inner=c.r*.80, outer=c.r*1.24;
    if(ang<outer){
      const pit=1-smoothstep(0,inner,ang);
      const rimZone=smoothstep(inner*.68,inner,ang)*(1-smoothstep(inner,outer,ang));
      radius-=c.d*pit;
      radius+=c.rim*rimZone;
      maxPit=Math.max(maxPit,pit); maxRim=Math.max(maxRim,rimZone);
    }
  }
  p.copy(n.multiplyScalar(radius));
  p.x*=1.045; p.y*=1.02; p.z*=.962;
  pos.setXYZ(i,p.x,p.y,p.z);
  const col=baseColor.clone();
  if(maxPit>0)col.lerp(pitColor,Math.min(.92,maxPit*.96));
  if(maxRim>.08)col.lerp(rimColor,Math.min(.36,maxRim*.34));
  const mott=.92+.08*(.5+.5*Math.sin(n.x*22+n.y*17+n.z*31)); col.multiplyScalar(mott);
  colors[i*3]=col.r;colors[i*3+1]=col.g;colors[i*3+2]=col.b;
}
pos.needsUpdate=true;bodyGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));bodyGeo.computeVertexNormals();
const body=new THREE.Mesh(bodyGeo,bodyMat); body.name='BODY_SCULPT'; body.castShadow=true; body.receiveShadow=true; core.add(body);

// upper meteor lip: sculptural ridge that visually merges with the body and VFX start
const crestCurve=new THREE.CatmullRomCurve3([
  new THREE.Vector3(.58,2.19,.12), new THREE.Vector3(1.13,2.45,-.02), new THREE.Vector3(1.62,2.35,-.20), new THREE.Vector3(1.95,1.92,-.38)
]);
const crest=new THREE.Mesh(new THREE.TubeGeometry(crestCurve,52,.16,18,false),rockMat); crest.scale.set(1,1,.70); crest.name='METEOR_CREST'; core.add(crest);
const crestInner=new THREE.Mesh(new THREE.TubeGeometry(crestCurve,52,.078,14,false),rockDark);crestInner.scale.set(1.015,.98,.72);crestInner.position.z=.015;core.add(crestInner);
