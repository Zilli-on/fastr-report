// ---------- High-fidelity face + collectible details ----------
function irisTexture(letter){
 const c=document.createElement('canvas');c.width=c.height=768;const x=c.getContext('2d');x.clearRect(0,0,768,768);
 const lime=x.createRadialGradient(245,205,25,385,390,335);lime.addColorStop(0,'#f4ffc9');lime.addColorStop(.25,'#e7ff63');lime.addColorStop(.60,'#d8ff1e');lime.addColorStop(1,'#6d9b00');
 x.fillStyle=lime;x.beginPath();x.arc(384,384,324,0,Math.PI*2);x.fill();x.lineWidth=30;x.strokeStyle='#273408';x.stroke();
 // Build O/G as graphic pupil shapes instead of relying on a font.
 x.fillStyle='#050605';
 if(letter==='O'){
  x.beginPath();x.arc(390,405,178,0,Math.PI*2);x.fill();
  x.fillStyle='#d8ff1e';x.beginPath();x.arc(390,405,104,0,Math.PI*2);x.fill();
 }else{
  x.beginPath();x.arc(390,405,178,0,Math.PI*2);x.fill();
  x.fillStyle='#d8ff1e';x.beginPath();x.arc(390,405,102,0,Math.PI*2);x.fill();
  x.fillRect(470,300,150,120);
  x.fillStyle='#050605';x.fillRect(390,392,184,72);
 }
 // premium glossy highlights
 x.fillStyle='rgba(255,255,255,.98)';x.beginPath();x.ellipse(238,220,48,72,-.48,0,Math.PI*2);x.fill();
 x.save();x.translate(520,236);x.rotate(Math.PI/4);x.fillRect(-8,-45,16,90);x.fillRect(-45,-8,90,16);x.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const texO=irisTexture('O'),texG=irisTexture('G');

function makeEye(x,tex,tilt){
 const g=new THREE.Group();
 const socketBack=new THREE.Mesh(new THREE.SphereGeometry(.90,68,46),rockDark);socketBack.scale.set(1.04,1.11,.22);socketBack.position.z=-.055;g.add(socketBack);
 const socketRing=new THREE.Mesh(new THREE.TorusGeometry(.760,.100,20,84),rockMat);socketRing.scale.set(1,1.095,.68);socketRing.position.z=.105;g.add(socketRing);
 const sclera=new THREE.Mesh(new THREE.SphereGeometry(.735,68,48),whiteMat);sclera.scale.set(1,1.09,.29);sclera.position.z=.085;g.add(sclera);
 const iris=new THREE.Mesh(new THREE.CircleGeometry(.615,80),new THREE.MeshBasicMaterial({map:tex,toneMapped:true}));iris.position.z=.317;iris.scale.y=1.02;g.add(iris);
 const lens=new THREE.Mesh(new THREE.SphereGeometry(.635,68,46),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.050,roughness:.02,metalness:0,transmission:.10,clearcoat:1,clearcoatRoughness:.015,depthWrite:false}));lens.scale.set(1,1.04,.145);lens.position.z=.355;g.add(lens);
 g.position.set(x,.46,2.37);g.rotation.z=tilt;g.rotation.y=x<0?.018:-.018;return g;
}
const eyeL=makeEye(-.82,texO,-.035),eyeR=makeEye(.82,texG,.035);core.add(eyeL,eyeR);
const browL=new THREE.Group(),browR=new THREE.Group();core.add(browL,browR);

// ---------- Integrated FASTR smile ----------
function curvedPanelGeometry(w,h,seg=70){
 const g=new THREE.PlaneGeometry(w,h,seg,6),a=g.attributes.position;
 for(let i=0;i<a.count;i++){const xx=a.getX(i),yy=a.getY(i),q=xx/(w*.5),zz=.16*(1-q*q)-.022*q*q;a.setXYZ(i,xx,yy-.052*q*q,zz)}
 a.needsUpdate=true;g.computeVertexNormals();return g;
}
function mouthBgTexture(){
 const c=document.createElement('canvas');c.width=1400;c.height=580;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 x.beginPath();x.moveTo(115,130);x.quadraticCurveTo(700,235,1285,130);x.quadraticCurveTo(1188,450,700,492);x.quadraticCurveTo(212,450,115,130);x.closePath();
 const g=x.createLinearGradient(0,100,0,520);g.addColorStop(0,'#020302');g.addColorStop(.68,'#050705');g.addColorStop(1,'#131a06');x.fillStyle=g;x.fill();
 const lg=x.createLinearGradient(0,365,0,520);lg.addColorStop(0,'rgba(216,255,30,0)');lg.addColorStop(1,'rgba(216,255,30,.52)');x.fillStyle=lg;x.beginPath();x.moveTo(205,390);x.quadraticCurveTo(700,508,1195,390);x.quadraticCurveTo(1040,468,700,498);x.quadraticCurveTo(360,468,205,390);x.fill();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function wordTexture(){
 const c=document.createElement('canvas');c.width=1400;c.height=580;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 x.font='900 italic 300px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';
 const gr=x.createLinearGradient(0,115,0,420);gr.addColorStop(0,'#ffffff');gr.addColorStop(.48,'#f3f2ea');gr.addColorStop(.78,'#cfd2cc');gr.addColorStop(1,'#8d928d');
 x.strokeStyle='#060706';x.lineWidth=18;x.strokeText('FASTR',690,285);x.fillStyle=gr;x.fillText('FASTR',690,285);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const mouthBack=new THREE.Group();core.add(mouthBack);
const mouthCavity=new THREE.Mesh(curvedPanelGeometry(3.02,1.18),new THREE.MeshStandardMaterial({map:mouthBgTexture(),transparent:true,roughness:.80,metalness:.02,alphaTest:.02}));mouthCavity.position.set(0,-.93,2.38);mouthBack.add(mouthCavity);
const smilePlane=new THREE.Mesh(curvedPanelGeometry(2.78,.88),new THREE.MeshStandardMaterial({map:wordTexture(),transparent:true,roughness:.19,metalness:.60,envMapIntensity:.76,alphaTest:.02}));smilePlane.position.set(0,-.90,2.446);core.add(smilePlane);
const smileGlow=new THREE.PointLight(LIME,.38,2.5,2);smileGlow.position.set(0,-1.20,2.0);core.add(smileGlow);

// ---------- Dark crater interiors that sit inside the already-deformed body ----------
const craterOverlay=new THREE.Group();craterOverlay.name='CRATER_INTERIORS';core.add(craterOverlay);
function addCrater(nx,ny,nz,r,oval=1){
 const n=new THREE.Vector3(nx,ny,nz).normalize();const surf=new THREE.Vector3(n.x*2.60*1.055,n.y*2.60*1.035,n.z*2.60*.955);const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),n);
 const g=new THREE.Group();g.position.copy(surf);g.quaternion.copy(q);g.scale.y=oval;
 const pit=new THREE.Mesh(new THREE.CircleGeometry(r*.69,48),new THREE.MeshStandardMaterial({color:0x010201,roughness:1,metalness:0}));pit.position.z=-.018;g.add(pit);craterOverlay.add(g);
}
[
 [-.64,.73,.58,.27,.86],[.12,.91,.39,.23,.92],[.58,.71,.50,.18,.87],[-.91,.28,.39,.17,1.05],[.92,.25,.31,.19,.92],
 [-.86,-.22,.38,.14,.94],[.88,-.34,.30,.13,1.0],[-.48,-.72,.42,.12,.9],[.53,-.69,.40,.15,.88],[-.35,.93,.20,.11,.9],[.76,.57,.25,.10,.86]
].forEach(a=>addCrater(...a));

// ---------- Collectible limbs ----------
function pillArm(x){const g=new THREE.Group();const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.36,.65,16,30),rubberMat);arm.scale.set(1.06,1,.96);arm.castShadow=true;g.add(arm);g.position.set(x,-.54,.10);g.rotation.z=x<0?.24:-.24;return g}
const armL=pillArm(-2.72),armR=pillArm(2.72);core.add(armL,armR);

function makeLeg(x){
 const g=new THREE.Group();const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.23,.27,12,22),rubberMat);leg.position.y=.28;g.add(leg);const shoe=new THREE.Group();
 const upper=new THREE.Mesh(new THREE.SphereGeometry(.70,54,38),rubberMat);upper.scale.set(1.20,.64,1.46);upper.position.z=.18;shoe.add(upper);
 const toe=new THREE.Mesh(new THREE.SphereGeometry(.58,48,34),new THREE.MeshStandardMaterial({color:0x161917,roughness:.62,metalness:.02}));toe.scale.set(1.16,.43,1.02);toe.position.set(0,-.12,.76);shoe.add(toe);
 const mid=new THREE.Mesh(new THREE.SphereGeometry(.735,52,34),new THREE.MeshStandardMaterial({color:0xd7d9d3,roughness:.46,metalness:.01}));mid.scale.set(1.18,.075,1.47);mid.position.set(0,-.505,.25);shoe.add(mid);
 const outsole=new THREE.Mesh(new THREE.SphereGeometry(.71,50,32),soleMat);outsole.scale.set(1.17,.085,1.45);outsole.position.set(0,-.605,.28);shoe.add(outsole);
 const limeEdge=new THREE.Mesh(new THREE.SphereGeometry(.715,50,32),new THREE.MeshStandardMaterial({color:LIME,roughness:.50,metalness:.01}));limeEdge.scale.set(1.165,.030,1.44);limeEdge.position.set(0,-.666,.28);shoe.add(limeEdge);
 const trim=new THREE.Mesh(new THREE.TorusGeometry(.48,.040,10,52,Math.PI*1.45),limeMat);trim.rotation.x=Math.PI/2;trim.rotation.z=.78;trim.position.set(.38,-.25,.58);shoe.add(trim);
 g.add(shoe);g.position.set(x,-2.69,.10);g.userData.shoe=shoe;return g;
}
const legL=makeLeg(-.80),legR=makeLeg(.80);core.add(legL,legR);
const soleIconTex=(()=>{const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');x.fillStyle='#050605';x.fillRect(0,0,512,512);x.strokeStyle='#262a26';x.lineWidth=7;for(let y=38;y<500;y+=31){x.beginPath();x.moveTo(16,y);x.lineTo(496,y);x.stroke()}x.fillStyle='#d8ff1e';x.beginPath();x.arc(326,260,67,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(320,218);x.lineTo(92,158);x.lineTo(252,247);x.closePath();x.fill();x.beginPath();x.moveTo(320,292);x.lineTo(112,345);x.lineTo(255,271);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
function attachSoleDecal(leg){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.18,1.62),new THREE.MeshStandardMaterial({map:soleIconTex,roughness:.55,metalness:.01}));m.rotation.x=Math.PI/2;m.position.set(0,-.700,.32);m.renderOrder=3;leg.userData.shoe.add(m);leg.userData.soleDecal=m;return m}
const soleDecalL=attachSoleDecal(legL),soleDecalR=attachSoleDecal(legR);
