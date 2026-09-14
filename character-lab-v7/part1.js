
const LIME=0xd8ff1e, ROCK=0x242724, BLACK=0x050605, OFFWHITE=0xf4f4ec;
const stage=document.getElementById('stage');
const loading=document.getElementById('loading');
const modeLabel=document.getElementById('modeLabel');

const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x020302,.027);
const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.05,160);
camera.position.set(7.8,5.2,11.8);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=.055; controls.target.set(0,.8,0); controls.minDistance=5.8; controls.maxDistance=22;

scene.add(new THREE.HemisphereLight(0xffffff,0x0b1008,2.7));
const key=new THREE.DirectionalLight(0xffffff,5.2); key.position.set(6,10,9); key.castShadow=true; key.shadow.mapSize.set(2048,2048); scene.add(key);
const rim=new THREE.PointLight(LIME,95,20,1.8); rim.position.set(-5,4,-4); scene.add(rim);
const soft=new THREE.PointLight(0x7ea0ff,16,18,2); soft.position.set(4,1,-5); scene.add(soft);
const chin=new THREE.PointLight(LIME,22,10,2); chin.position.set(0,-1.5,4); scene.add(chin);

const floor=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:0x050705,roughness:.93,metalness:.02}));
floor.rotation.x=-Math.PI/2; floor.position.y=-3.12; floor.receiveShadow=true; scene.add(floor);
const grid=new THREE.GridHelper(160,160,0x182012,0x0b1009); grid.position.y=-3.1; grid.material.opacity=.23; grid.material.transparent=true; scene.add(grid);

const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloomPass=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),1.15,.5,.66); composer.addPass(bloomPass);
const afterPass=new AfterimagePass(.78); afterPass.enabled=false; composer.addPass(afterPass);

const character=new THREE.Group(); character.name='OG_FASTR_CLEAN_MASTER'; scene.add(character);
character.position.y=.25;
const core=new THREE.Group(); core.name='PRINTABLE_CORE'; character.add(core);
const vfx=new THREE.Group(); vfx.name='SEPARATE_COMET_VFX'; character.add(vfx);

const rockMat=new THREE.MeshStandardMaterial({color:ROCK,roughness:.78,metalness:.07});
const rockDark=new THREE.MeshStandardMaterial({color:0x0a0c0a,roughness:.94,metalness:.01});
const rubberMat=new THREE.MeshStandardMaterial({color:0x111411,roughness:.73,metalness:.03});
const soleMat=new THREE.MeshStandardMaterial({color:0x050605,roughness:.63,metalness:.08});
const whiteMat=new THREE.MeshPhysicalMaterial({color:OFFWHITE,roughness:.27,metalness:.02,clearcoat:.18,clearcoatRoughness:.24});
const limeMat=new THREE.MeshStandardMaterial({color:LIME,emissive:LIME,emissiveIntensity:.7,roughness:.22,metalness:.06});
const chromeMat=new THREE.MeshStandardMaterial({color:0xe9e9e2,roughness:.16,metalness:.7});
let sseed=68217; const rnd=()=>{sseed=(sseed*16807)%2147483647;return(sseed-1)/2147483646};
function smoothstep(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}

const bodyGeo=new THREE.SphereGeometry(2.72,144,108);
const pos=bodyGeo.attributes.position;
const craterDefs=[];
const protectedFace=(n)=>n.z>.48 && Math.abs(n.x)<.78 && n.y<.82;
for(let i=0;i<46;i++){
  let u=rnd()*2-1,a=rnd()*Math.PI*2; const ss=Math.sqrt(1-u*u); let n=new THREE.Vector3(ss*Math.cos(a),u,ss*Math.sin(a));
  if(protectedFace(n)){i--;continue}
  craterDefs.push({n,r:.08+rnd()*.22,d:.08+rnd()*.18,rim:.04+rnd()*.045});
}
craterDefs.push(
 {n:new THREE.Vector3(-.28,.82,.48).normalize(),r:.26,d:.23,rim:.07},
 {n:new THREE.Vector3(.38,.72,.55).normalize(),r:.20,d:.17,rim:.06},
 {n:new THREE.Vector3(-.68,.48,.55).normalize(),r:.18,d:.14,rim:.05},
 {n:new THREE.Vector3(.72,.38,.48).normalize(),r:.16,d:.12,rim:.04}
);
for(let i=0;i<pos.count;i++){
  const p=new THREE.Vector3().fromBufferAttribute(pos,i);
  const n=p.clone().normalize();
  let radius=2.60;
  radius*=1 + .022*Math.sin(n.x*8.3+n.y*5.1) + .012*Math.sin(n.z*13.7-n.x*4.4);
  radius*=1 + .022*(n.y+.1) - .018*Math.max(0,n.z);
  for(const c of craterDefs){
    const ang=Math.acos(THREE.MathUtils.clamp(n.dot(c.n),-1,1));
    const inner=c.r*.78, outer=c.r*1.24;
    if(ang<outer){
      const pit=(1-smoothstep(0,inner,ang));
      const rimZone=smoothstep(inner*.72,inner,ang)*(1-smoothstep(inner,outer,ang));
      radius-=c.d*pit;
      radius+=c.rim*rimZone;
    }
  }
  p.copy(n.multiplyScalar(radius));
  p.x*=1.04; p.y*=1.015; p.z*=.965;
  pos.setXYZ(i,p.x,p.y,p.z);
}
pos.needsUpdate=true; bodyGeo.computeVertexNormals();
const body=new THREE.Mesh(bodyGeo,rockMat); body.name='BODY_SCULPT'; body.castShadow=true; body.receiveShadow=true; core.add(body);

const crestCurve=new THREE.CatmullRomCurve3([
  new THREE.Vector3(.65,2.20,.18), new THREE.Vector3(1.28,2.42,.05), new THREE.Vector3(1.72,2.25,-.20), new THREE.Vector3(1.92,1.82,-.36)
]);
const crest=new THREE.Mesh(new THREE.TubeGeometry(crestCurve,40,.18,14,false),rockMat); crest.scale.z=.75; crest.name='METEOR_CREST'; core.add(crest);
