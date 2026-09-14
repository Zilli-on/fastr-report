const LIME=0xd8ff1e, ROCK=0x171a18, BLACK=0x030403, OFFWHITE=0xf3f2e9;
const stage=document.getElementById('stage');
const loading=document.getElementById('loading');
const modeLabel=document.getElementById('modeLabel');

const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.88;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.appendChild(renderer.domElement);

const scene=new THREE.Scene();scene.background=new THREE.Color(0x020302);scene.fog=new THREE.FogExp2(0x020302,.014);
const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(renderer),.025).texture;
const camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.05,180);camera.position.set(7.4,4.4,13.9);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.055;controls.target.set(0,.1,0);controls.minDistance=6;controls.maxDistance=24;

scene.add(new THREE.HemisphereLight(0xffffff,0x050805,1.35));
const key=new THREE.DirectionalLight(0xfffdf5,2.75);key.position.set(5.8,9.8,10.8);key.castShadow=true;key.shadow.mapSize.set(2048,2048);scene.add(key);
const fill=new THREE.DirectionalLight(0xcbd4ff,.72);fill.position.set(-5,2,8);scene.add(fill);
const rim=new THREE.PointLight(LIME,11.5,17,2);rim.position.set(-5,4,-5);scene.add(rim);
const backWhite=new THREE.PointLight(0xffffff,8.5,18,2);backWhite.position.set(4,7,-6);scene.add(backWhite);
const eyeFill=new THREE.PointLight(0xffffff,2.8,7,2);eyeFill.position.set(0,.8,5.5);scene.add(eyeFill);

const floor=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:0x030403,roughness:.96,metalness:.02}));floor.rotation.x=-Math.PI/2;floor.position.y=-3.22;floor.receiveShadow=true;scene.add(floor);
const grid=new THREE.GridHelper(160,160,0x11160e,0x070a07);grid.position.y=-3.2;grid.material.opacity=.045;grid.material.transparent=true;scene.add(grid);

const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloomPass=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.46,.58,1.75);composer.addPass(bloomPass);const afterPass=new AfterimagePass(.72);afterPass.enabled=false;composer.addPass(afterPass);

const character=new THREE.Group();character.name='OG_FASTR_CLEAN_MASTER';scene.add(character);character.position.y=.18;const core=new THREE.Group();core.name='PRINTABLE_CORE';character.add(core);const vfx=new THREE.Group();vfx.name='SEPARATE_COMET_VFX';character.add(vfx);

function makeRockBump(){
 const c=document.createElement('canvas');c.width=c.height=768;const x=c.getContext('2d'),id=x.createImageData(768,768);let r=82736123;const rand=()=>{r=(r*1664525+1013904223)>>>0;return r/4294967296};
 for(let yy=0;yy<768;yy++)for(let xx=0;xx<768;xx++){const i=(yy*768+xx)*4;const coarse=12*Math.sin(xx*.075)+9*Math.cos(yy*.10)+6*Math.sin((xx+yy)*.048);const grain=(rand()-.5)*38;const v=Math.max(28,Math.min(225,116+coarse+grain));id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}x.putImageData(id,0,0);
 // tiny rock pores
 for(let i=0;i<760;i++){const px=rand()*768,py=rand()*768,rr=.5+rand()*3.0;x.fillStyle=`rgba(20,20,20,${.04+rand()*.10})`;x.beginPath();x.arc(px,py,rr,0,Math.PI*2);x.fill()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4.4,2.9);t.colorSpace=THREE.NoColorSpace;return t;
}
const rockBump=makeRockBump();
const bodyMat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.68,metalness:.045,bumpMap:rockBump,bumpScale:.082,envMapIntensity:.48});
const rockMat=new THREE.MeshStandardMaterial({color:ROCK,roughness:.70,metalness:.045,bumpMap:rockBump,bumpScale:.052,envMapIntensity:.44});
const rockDark=new THREE.MeshStandardMaterial({color:0x020302,roughness:.98,metalness:.005});
const rubberMat=new THREE.MeshStandardMaterial({color:0x0b0d0c,roughness:.69,metalness:.025,envMapIntensity:.30});
const soleMat=new THREE.MeshStandardMaterial({color:0x020302,roughness:.66,metalness:.035});
const whiteMat=new THREE.MeshStandardMaterial({color:OFFWHITE,roughness:.28,metalness:.015,envMapIntensity:.42});
const limeMat=new THREE.MeshStandardMaterial({color:LIME,roughness:.31,metalness:.02,envMapIntensity:.28});
const chromeMat=new THREE.MeshStandardMaterial({color:0xeeeeE7,roughness:.18,metalness:.72,envMapIntensity:.82});
let sseed=68217;const rnd=()=>{sseed=(sseed*16807)%2147483647;return(sseed-1)/2147483646};function smoothstep(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}

const bodyGeo=new THREE.SphereGeometry(2.72,184,138),pos=bodyGeo.attributes.position,craterDefs=[];const faceSafe=n=>n.z>.50&&Math.abs(n.x)<.73&&n.y<.68;
for(let i=0;i<70;i++){let u=rnd()*2-1,a=rnd()*Math.PI*2,ss=Math.sqrt(1-u*u),n=new THREE.Vector3(ss*Math.cos(a),u,ss*Math.sin(a));if(faceSafe(n)){i--;continue}craterDefs.push({n,r:.045+rnd()*.19,d:.055+rnd()*.16,rim:.018+rnd()*.040})}
[[-.30,.86,.40,.27,.25,.055],[.36,.82,.43,.22,.19,.048],[-.72,.47,.48,.19,.15,.040],[.76,.40,.42,.18,.145,.038],[.08,.98,.14,.20,.19,.045],[-.86,.12,.40,.14,.12,.032],[.90,-.04,.34,.15,.13,.036],[.52,-.72,.35,.13,.11,.032]].forEach(a=>craterDefs.push({n:new THREE.Vector3(a[0],a[1],a[2]).normalize(),r:a[3],d:a[4],rim:a[5]}));
const colors=new Float32Array(pos.count*3),baseColor=new THREE.Color(0x1a1d1b),pitColor=new THREE.Color(0x010201),rimColor=new THREE.Color(0x50544e);
for(let i=0;i<pos.count;i++){
 const p=new THREE.Vector3().fromBufferAttribute(pos,i),n=p.clone().normalize();let radius=2.60,maxPit=0,maxRim=0;
 radius*=1+.012*Math.sin(n.x*7.7+n.y*5.1)+.007*Math.sin(n.z*15.2-n.x*3.8);radius*=1+.027*Math.max(0,-n.y)-.019*Math.max(0,n.y-.42);radius*=1-.024*Math.max(0,n.z)*Math.max(0,1-Math.abs(n.x)*.55);
 for(const c of craterDefs){const ang=Math.acos(THREE.MathUtils.clamp(n.dot(c.n),-1,1)),inner=c.r*.78,outer=c.r*1.28;if(ang<outer){const pit=1-smoothstep(0,inner,ang),rr=smoothstep(inner*.66,inner,ang)*(1-smoothstep(inner,outer,ang));radius-=c.d*pit;radius+=c.rim*rr;maxPit=Math.max(maxPit,pit);maxRim=Math.max(maxRim,rr)}}
 p.copy(n.multiplyScalar(radius));p.x*=1.055;p.y*=1.035;p.z*=.955;pos.setXYZ(i,p.x,p.y,p.z);const col=baseColor.clone();if(maxPit>.02)col.lerp(pitColor,Math.min(.98,maxPit*1.06));if(maxRim>.10)col.lerp(rimColor,Math.min(.28,maxRim*.30));const m=.90+.10*(.5+.5*Math.sin(n.x*27+n.y*21+n.z*33));col.multiplyScalar(m);colors[i*3]=col.r;colors[i*3+1]=col.g;colors[i*3+2]=col.b;
}
pos.needsUpdate=true;bodyGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));bodyGeo.computeVertexNormals();const body=new THREE.Mesh(bodyGeo,bodyMat);body.name='BODY_SCULPT';body.castShadow=true;body.receiveShadow=true;core.add(body);

// Signature printable stone hook – the tail VFX starts behind this piece.
const crestCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(.48,2.15,.08),new THREE.Vector3(1.08,2.52,-.08),new THREE.Vector3(1.62,2.56,-.30),new THREE.Vector3(2.10,2.20,-.58),new THREE.Vector3(2.34,1.67,-.84)]);
const crest=new THREE.Mesh(new THREE.TubeGeometry(crestCurve,72,.22,22,false),rockMat);crest.scale.set(1,1,.74);crest.name='METEOR_CREST';crest.castShadow=true;core.add(crest);const crestCut=new THREE.Mesh(new THREE.TubeGeometry(crestCurve,72,.092,18,false),rockDark);crestCut.scale.set(1.006,.965,.76);crestCut.position.z=.026;core.add(crestCut);
