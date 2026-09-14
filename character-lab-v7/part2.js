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
function brow(x,tilt){const b=new THREE.Mesh(new THREE.CapsuleGeometry(.18,1.24,12,28),rockMat); b.scale.set(1,.9,.55); b.position.set(x,1.39,2.20); b.rotation.z=tilt; b.rotation.x=Math.PI/2; return b}
const browL=brow(-.84,-.18),browR=brow(.84,.18); core.add(browL,browR);

const mouthCurve=new THREE.CatmullRomCurve3([
 new THREE.Vector3(-1.28,-.69,2.19), new THREE.Vector3(-.67,-1.02,2.33), new THREE.Vector3(0,-1.12,2.38), new THREE.Vector3(.67,-1.02,2.33), new THREE.Vector3(1.28,-.69,2.19)
]);
const mouthBack=new THREE.Mesh(new THREE.TubeGeometry(mouthCurve,70,.27,20,false),rockDark); mouthBack.scale.y=.96; core.add(mouthBack);
function wordTexture(){const c=document.createElement('canvas');c.width=1400;c.height=430;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.font='900 italic 290px Arial Black,Arial';x.textAlign='center';x.textBaseline='middle';const gr=x.createLinearGradient(0,80,0,340);gr.addColorStop(0,'#ffffff');gr.addColorStop(.55,'#f3f1e9');gr.addColorStop(1,'#b9bbb4');x.fillStyle=gr;x.strokeStyle='#111';x.lineWidth=18;x.strokeText('FASTR',700,222);x.fillText('FASTR',700,222);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const smilePlane=new THREE.Mesh(new THREE.PlaneGeometry(2.55,.76,32,1),new THREE.MeshPhysicalMaterial({map:wordTexture(),transparent:true,roughness:.18,metalness:.24,clearcoat:.5,emissive:0x253500,emissiveIntensity:.42}));
smilePlane.position.set(0,-.88,2.54); smilePlane.rotation.x=-.03; core.add(smilePlane);
const smileGlow=new THREE.PointLight(LIME,28,4,2); smileGlow.position.set(0,-1.04,2.0); core.add(smileGlow);

function pillArm(x){
 const g=new THREE.Group();
 const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.34,.58,14,28),rubberMat); arm.castShadow=true; g.add(arm);
 const hand=new THREE.Mesh(new THREE.SphereGeometry(.43,36,28),rubberMat); hand.position.y=-.56; hand.scale.set(1.08,.92,.94); hand.castShadow=true; g.add(hand);
 g.position.set(x,-.37,.25); g.rotation.z=x<0?.15:-.15; return g;
}
const armL=pillArm(-2.53),armR=pillArm(2.53); core.add(armL,armR);
function makeLeg(x){
 const g=new THREE.Group();
 const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.27,.36,12,24),rubberMat);leg.position.y=.38;g.add(leg);
 const shoe=new THREE.Group();
 const upper=new THREE.Mesh(new THREE.SphereGeometry(.68,48,32),rubberMat); upper.scale.set(1.18,.64,1.42); upper.position.z=.18; shoe.add(upper);
 const toe=new THREE.Mesh(new THREE.SphereGeometry(.60,40,28),new THREE.MeshStandardMaterial({color:0x1d201d,roughness:.62})); toe.scale.set(1.12,.44,.95); toe.position.set(0,-.16,.72); shoe.add(toe);
 const mid=new THREE.Mesh(new THREE.BoxGeometry(1.48,.20,1.90,6,2,6),whiteMat); mid.position.set(0,-.53,.22); shoe.add(mid);
 const outsole=new THREE.Mesh(new THREE.BoxGeometry(1.40,.14,1.86,6,2,6),soleMat); outsole.position.set(0,-.66,.25); shoe.add(outsole);
 const stripe=new THREE.Mesh(new THREE.TorusGeometry(.44,.065,10,46,Math.PI*1.35),limeMat); stripe.rotation.x=Math.PI/2; stripe.rotation.z=.95; stripe.position.set(.40,-.18,.58); shoe.add(stripe);
 const heel=new THREE.Mesh(new THREE.BoxGeometry(.16,.35,.50),limeMat); heel.position.set(0,.0,-.67); shoe.add(heel);
 g.add(shoe); g.position.set(x,-2.73,.08); return g;
}
const legL=makeLeg(-.80),legR=makeLeg(.80); core.add(legL,legR);
const soleIconTex=(()=>{const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');x.clearRect(0,0,512,512);x.fillStyle='#0a0b0a';x.fillRect(0,0,512,512);x.strokeStyle='#272a27';x.lineWidth=7;for(let y=45;y<500;y+=32){x.beginPath();x.moveTo(18,y);x.lineTo(494,y);x.stroke()}x.fillStyle='#d8ff1e';x.beginPath();x.arc(315,258,64,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(310,220);x.lineTo(110,165);x.lineTo(245,245);x.closePath();x.fill();x.beginPath();x.moveTo(310,288);x.lineTo(118,336);x.lineTo(246,270);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
const soleCard=new THREE.Mesh(new THREE.PlaneGeometry(1.18,1.63),new THREE.MeshStandardMaterial({map:soleIconTex,roughness:.54})); soleCard.position.set(.80,-2.83,1.02); soleCard.rotation.x=-.12; core.add(soleCard);
