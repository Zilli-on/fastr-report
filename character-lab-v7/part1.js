const LIME=0xd8ff1e, ROCK=0x111412, BLACK=0x030403, OFFWHITE=0xf3f2e9;
const stage=document.getElementById('stage');
const loading=document.getElementById('loading');
const modeLabel=document.getElementById('modeLabel');

const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=.92;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x020302);
scene.fog=new THREE.FogExp2(0x020302,.015);
const pmrem=new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(new RoomEnvironment(renderer),.025).texture;

const camera=new THREE.PerspectiveCamera(36,innerWidth/innerHeight,.05,180);
camera.position.set(7.6,4.6,13.8);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.055;controls.target.set(0,.1,0);controls.minDistance=6;controls.maxDistance=24;

scene.add(new THREE.HemisphereLight(0xffffff,0x050805,1.28));
const key=new THREE.DirectionalLight(0xfffdf5,2.15);key.position.set(5.5,9.5,10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);scene.add(key);
const fill=new THREE.DirectionalLight(0xbfcaff,.58);fill.position.set(-5,2,8);scene.add(fill);
const rim=new THREE.PointLight(LIME,10,16,2);rim.position.set(-5,4,-5);scene.add(rim);
const backWhite=new THREE.PointLight(0xffffff,7,17,2);backWhite.position.set(4,7,-6);scene.add(backWhite);

const floor=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:0x030403,roughness:.96,metalness:.02}));
floor.rotation.x=-Math.PI/2;floor.position.y=-3.22;floor.receiveShadow=true;scene.add(floor);
const grid=new THREE.GridHelper(160,160,0x11160e,0x070a07);grid.position.y=-3.2;grid.material.opacity=.055;grid.material.transparent=true;scene.add(grid);

const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloomPass=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.42,.58,1.72);composer.addPass(bloomPass);
const afterPass=new AfterimagePass(.72);afterPass.enabled=false;composer.addPass(afterPass);

const character=new THREE.Group();character.name='OG_FASTR_CLEAN_MASTER';scene.add(character);character.position.y=.18;
const core=new THREE.Group();core.name='PRINTABLE_CORE';character.add(core);
const vfx=new THREE.Group();vfx.name='SEPARATE_COMET_VFX';character.add(vfx);

function makeRockBump(){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');const id=x.createImageData(512,512);
 let r=82736123;const rand=()=>{r=(r*1664525+1013904223)>>>0;return r/4294967296};
 for(let yy=0;yy<512;yy++)for(let xx=0;xx<512;xx++){
  const i=(yy*512+xx)*4;const coarse=8*Math.sin(xx*.09)+7*Math.cos(yy*.11)+4*Math.sin((xx+yy)*.053);const grain=(rand()-.5)*30;
  const v=Math.max(40,Math.min(210,118+coarse+grain));id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255;
 }
 x.putImageData(id,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4.2,2.7);t.colorSpace=THREE.NoColorSpace;return t;
}
const rockBump=makeRockBump();
const bodyMat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.74,metalness:.055,bumpMap:rockBump,bumpScale:.047,envMapIntensity:.34});
const rockMat=new THREE.MeshStandardMaterial({color:ROCK,roughness:.76,metalness:.05,bumpMap:rockBump,bumpScale:.032,envMapIntensity:.33});
const rockDark=new THREE.MeshStandardMaterial({color:0x020302,roughness:.98,metalness:.005});
const rubberMat=new THREE.MeshStandardMaterial({color:0x0c0e0d,roughness:.72,metalness:.025,envMapIntensity:.28});
const soleMat=new THREE.MeshStandardMaterial({color:0x020302,roughness:.68,metalness:.035});
const whiteMat=new THREE.MeshStandardMaterial({color:OFFWHITE,roughness:.32,metalness:.015,envMapIntensity:.38});
const limeMat=new THREE.MeshStandardMaterial({color:LIME,roughness:.34,metalness:.02,envMapIntensity:.24});
const chromeMat=new THREE.MeshStandardMaterial({color:0xeeeeE7,roughness:.20,metalness:.72,envMapIntensity:.82});
let sseed=68217;const rnd=()=>{sseed=(sseed*16807)%2147483647;return(sseed-1)/2147483646};
function smoothstep(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}

// Character body: deliberately not a perfect sphere. The face is broad/soft, top tapers,
// and the rear/top-right develops into the meteor crest seen in the canonical render.
const bodyGeo=new THREE.SphereGeometry(2.72,176,132);
const pos=bodyGeo.attributes.position;
const craterDefs=[];
const faceSafe=n=>n.z>.50&&Math.abs(n.x)<.73&&n.y<.70;
for(let i=0;i<64;i++){
 let u=rnd()*2-1,a=rnd()*Math.PI*2,ss=Math.sqrt(1-u*u);let n=new THREE.Vector3(ss*Math.cos(a),u,ss*Math.sin(a));
 if(faceSafe(n)){i--;continue}
 craterDefs.push({n,r:.05+rnd()*.19,d:.055+rnd()*.15,rim:.018+rnd()*.042});
}
[
 [-.30,.86,.40,.27,.25,.06],[.36,.82,.43,.22,.19,.052],[-.72,.47,.48,.19,.15,.044],[.76,.40,.42,.18,.145,.042],
 [.08,.98,.14,.20,.19,.05],[-.86,.12,.40,.14,.12,.036],[.90,-.04,.34,.15,.13,.04],[.52,-.72,.35,.13,.11,.035]
].forEach(a=>craterDefs.push({n:new THREE.Vector3(a[0],a[1],a[2]).normalize(),r:a[3],d:a[4],rim:a[5]}));

const colors=new Float32Array(pos.count*3);
const baseColor=new THREE.Color(0x101312),pitColor=new THREE.Color(0x010201),rimColor=new THREE.Color(0x353a35);
for(let i=0;i<pos.count;i++){
 const p=new THREE.Vector3().fromBufferAttribute(pos,i),n=p.clone().normalize();
 let radius=2.60,maxPit=0,maxRim=0;
 // premium hand-sculpted irregularity, intentionally low amplitude
 radius*=1+.010*Math.sin(n.x*7.7+n.y*5.1)+.006*Math.sin(n.z*15.2-n.x*3.8);
 // pear-ish collectible silhouette: slightly fuller cheeks/lower body and tapered crown
 radius*=1+.030*Math.max(0,-n.y)-.020*Math.max(0,n.y-.42);
 // face is slightly flatter so eyes feel inset instead of pasted on
 radius*=1-.026*Math.max(0,n.z)*Math.max(0,1-Math.abs(n.x)*.55);
 for(const c of craterDefs){
  const ang=Math.acos(THREE.MathUtils.clamp(n.dot(c.n),-1,1)),inner=c.r*.78,outer=c.r*1.28;
  if(ang<outer){const pit=1-smoothstep(0,inner,ang);const rr=smoothstep(inner*.66,inner,ang)*(1-smoothstep(inner,outer,ang));radius-=c.d*pit;radius+=c.rim*rr;maxPit=Math.max(maxPit,pit);maxRim=Math.max(maxRim,rr)}
 }
 p.copy(n.multiplyScalar(radius));p.x*=1.055;p.y*=1.035;p.z*=.955;pos.setXYZ(i,p.x,p.y,p.z);
 const col=baseColor.clone();if(maxPit>.02)col.lerp(pitColor,Math.min(.94,maxPit*.98));if(maxRim>.10)col.lerp(rimColor,Math.min(.20,maxRim*.22));
 const m=.94+.06*(.5+.5*Math.sin(n.x*23+n.y*19+n.z*29));col.multiplyScalar(m);colors[i*3]=col.r;colors[i*3+1]=col.g;colors[i*3+2]=col.b;
}
pos.needsUpdate=true;bodyGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));bodyGeo.computeVertexNormals();
const body=new THREE.Mesh(bodyGeo,bodyMat);body.name='BODY_SCULPT';body.castShadow=true;body.receiveShadow=true;core.add(body);

// Stone crest / lip: part of the printable core, not the glow tail.
const crestCurve=new THREE.CatmullRomCurve3([
 new THREE.Vector3(.52,2.17,.10),new THREE.Vector3(1.05,2.50,-.08),new THREE.Vector3(1.55,2.50,-.30),new THREE.Vector3(1.98,2.14,-.55),new THREE.Vector3(2.16,1.72,-.72)
]);
const crest=new THREE.Mesh(new THREE.TubeGeometry(crestCurve,64,.19,20,false),rockMat);crest.scale.set(1,1,.72);crest.name='METEOR_CREST';crest.castShadow=true;core.add(crest);
const crestCut=new THREE.Mesh(new THREE.TubeGeometry(crestCurve,64,.082,16,false),rockDark);crestCut.scale.set(1.005,.97,.74);crestCut.position.z=.025;core.add(crestCut);
