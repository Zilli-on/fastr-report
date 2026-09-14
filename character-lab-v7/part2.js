// ---------- Face ----------
function eyeTexture(letter){
  const c=document.createElement('canvas'); c.width=c.height=768; const x=c.getContext('2d');
  x.clearRect(0,0,768,768);
  const g=x.createRadialGradient(260,205,12,384,384,330); g.addColorStop(0,'#f5ffd7');g.addColorStop(.26,'#e8ff6c');g.addColorStop(.55,'#d8ff1e');g.addColorStop(1,'#6d9400');
  x.fillStyle=g; x.beginPath(); x.ellipse(384,384,300,305,0,0,Math.PI*2); x.fill();
  x.fillStyle='#050605'; x.beginPath(); x.ellipse(384,408,171,186,0,0,Math.PI*2); x.fill();
  x.fillStyle='#d8ff1e'; x.font='900 italic 190px Arial Black,Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(letter,393,418);
  x.fillStyle='#fff'; x.beginPath();x.ellipse(292,260,50,72,-.45,0,Math.PI*2);x.fill();
  x.save(); x.translate(511,250); x.rotate(Math.PI/4); x.fillRect(-9,-45,18,90);x.fillRect(-45,-9,90,18);x.restore();
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=renderer.capabilities.getMaxAnisotropy(); return t;
}
const texO=eyeTexture('O'),texG=eyeTexture('G');
function makeEye(x,tex,rotY){
  const g=new THREE.Group();
  const socket=new THREE.Mesh(new THREE.SphereGeometry(.94,64,44),rockDark); socket.scale.set(1.05,1.05,.30); g.add(socket);
  const sclera=new THREE.Mesh(new THREE.SphereGeometry(.80,64,48),whiteMat); sclera.scale.set(1.0,1.07,.40); sclera.position.z=.16; g.add(sclera);
  const irisMat=new THREE.MeshPhysicalMaterial({map:tex,roughness:.1,metalness:0,clearcoat:1,clearcoatRoughness:.04,emissive:LIME,emissiveIntensity:.25});
  const iris=new THREE.Mesh(new THREE.SphereGeometry(.62,64,48),irisMat); iris.scale.set(1,1.03,.23); iris.position.z=.50; g.add(iris);
  const lens=new THREE.Mesh(new THREE.SphereGeometry(.65,64,48),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.06,roughness:.02,transmission:.12,clearcoat:1,clearcoatRoughness:.02}));
  lens.scale.set(1,1.04,.20); lens.position.z=.55; g.add(lens);
  g.position.set(x,.47,2.28); g.rotation.y=rotY; return g;
}
const eyeL=makeEye(-.84,texO,.035),eyeR=makeEye(.84,texG,-.035); core.add(eyeL,eyeR);
function brow(x,tilt){const b=new THREE.Mesh(new THREE.CapsuleGeometry(.13,1.02,12,28),rockMat); b.scale.set(1,.82,.46); b.position.set(x,1.31,2.18); b.rotation.z=tilt; b.rotation.x=Math.PI/2; return b}
const browL=brow(-.84,-.18),browR=brow(.84,.18); core.add(browL,browR);

const mouthCurve=new THREE.CatmullRomCurve3([
 new THREE.Vector3(-1.28,-.69,2.19), new THREE.Vector3(-.67,-1.02,2.33), new THREE.Vector3(0,-1.12,2.38), new THREE.Vector3(.67,-1.02,2.33), new THREE.Vector3(1.28,-.69,2.19)
]);
const mouthBack=new THREE.Mesh(new THREE.TubeGeometry(mouthCurve,70,.27,20,false),rockDark); mouthBack.scale.y=.96; core.add(mouthBack);
function wordTexture(){const c=document.createElement('canvas');c.width=1400;c.height=430;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.font='900 italic 290px Arial Black,Arial';x.textAlign='center';x.textBaseline='middle';const gr=x.createLinearGradient(0,80,0,340);gr.addColorStop(0,'#ffffff');gr.addColorStop(.55,'#f3f1e9');gr.addColorStop(1,'#b9bbb4');x.fillStyle=gr;x.strokeStyle='#111';x.lineWidth=18;x.strokeText('FASTR',700,222);x.fillText('FASTR',700,222);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function bentSmileGeometry(w=2.62,h=.78,seg=56){
 const g=new THREE.PlaneGeometry(w,h,seg,3); const a=g.attributes.position;
 for(let i=0;i<a.count;i++){
   const x=a.getX(i), y=a.getY(i), q=x/(w*.5);
   const z=.19*(1-q*q);
   a.setXYZ(i,x,y-.055*q*q,z);
 }
 a.needsUpdate=true; g.computeVertexNormals(); return g;
}
const mouthCavity=new THREE.Mesh(bentSmileGeometry(2.90,1.04,60),new THREE.MeshStandardMaterial({color:0x030403,roughness:.92,metalness:.02}));
mouthCavity.position.set(0,-.89,2.36); mouthCavity.scale.set(1,1.04,1); core.add(mouthCavity);
const smilePlane=new THREE.Mesh(bentSmileGeometry(),new THREE.MeshPhysicalMaterial({map:wordTexture(),transparent:true,roughness:.16,metalness:.30,clearcoat:.72,clearcoatRoughness:.10,emissive:0x253500,emissiveIntensity:.42}));
smilePlane.position.set(0,-.88,2.43); smilePlane.rotation.x=-.015; core.add(smilePlane);
const smileGlow=new THREE.PointLight(LIME,28,4,2); smileGlow.position.set(0,-1.04,2.0); core.add(smileGlow);

function pillArm(x){
 const g=new THREE.Group();
 const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.40,.86,16,32),rubberMat); arm.castShadow=true; arm.scale.set(1,.96,.94); g.add(arm);
 g.position.set(x,-.46,.18); g.rotation.z=x<0?.17:-.17; return g;
}
const armL=pillArm(-2.53),armR=pillArm(2.53); core.add(armL,armR);
function makeLeg(x){
 const g=new THREE.Group();
 const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.27,.34,12,24),rubberMat);leg.position.y=.38;g.add(leg);
 const shoe=new THREE.Group();
 const upper=new THREE.Mesh(new THREE.SphereGeometry(.70,52,36),rubberMat); upper.scale.set(1.18,.65,1.46); upper.position.z=.20; shoe.add(upper);
 const toe=new THREE.Mesh(new THREE.SphereGeometry(.61,44,32),new THREE.MeshStandardMaterial({color:0x1d201d,roughness:.60})); toe.scale.set(1.14,.46,.98); toe.position.set(0,-.15,.75); shoe.add(toe);
 const mid=new THREE.Mesh(new THREE.SphereGeometry(.74,48,30),whiteMat); mid.scale.set(1.18,.16,1.48); mid.position.set(0,-.54,.25); shoe.add(mid);
 const outsole=new THREE.Mesh(new THREE.SphereGeometry(.70,48,30),soleMat); outsole.scale.set(1.16,.12,1.43); outsole.position.set(0,-.66,.28); shoe.add(outsole);
 const stripe=new THREE.Mesh(new THREE.TorusGeometry(.44,.065,10,46,Math.PI*1.35),limeMat); stripe.rotation.x=Math.PI/2; stripe.rotation.z=.95; stripe.position.set(.40,-.18,.58); shoe.add(stripe);
 const heel=new THREE.Mesh(new THREE.CapsuleGeometry(.10,.30,8,16),limeMat); heel.rotation.x=Math.PI/2; heel.position.set(0,.02,-.69); shoe.add(heel);
 g.add(shoe); g.position.set(x,-2.73,.08); g.userData.shoe=shoe; return g;
}
const legL=makeLeg(-.80),legR=makeLeg(.80); core.add(legL,legR);
const soleIconTex=(()=>{const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');x.clearRect(0,0,512,512);x.fillStyle='#0a0b0a';x.fillRect(0,0,512,512);x.strokeStyle='#272a27';x.lineWidth=7;for(let y=45;y<500;y+=32){x.beginPath();x.moveTo(18,y);x.lineTo(494,y);x.stroke()}x.fillStyle='#d8ff1e';x.beginPath();x.arc(315,258,64,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(310,220);x.lineTo(110,165);x.lineTo(245,245);x.closePath();x.fill();x.beginPath();x.moveTo(310,288);x.lineTo(118,336);x.lineTo(246,270);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
function attachSoleDecal(leg){
 const m=new THREE.Mesh(new THREE.PlaneGeometry(1.20,1.62),new THREE.MeshStandardMaterial({map:soleIconTex,roughness:.46,metalness:.04}));
 m.rotation.x=Math.PI/2; m.position.set(0,-.735,.34); m.renderOrder=3; leg.userData.shoe.add(m); leg.userData.soleDecal=m; return m;
}
const soleDecalL=attachSoleDecal(legL), soleDecalR=attachSoleDecal(legR);
