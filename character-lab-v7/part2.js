// ---------- High-fidelity face + collectible details ----------
function irisTexture(letter){
 const c=document.createElement('canvas');c.width=c.height=768;const x=c.getContext('2d');x.clearRect(0,0,768,768);
 const lime=x.createRadialGradient(235,195,20,385,390,345);lime.addColorStop(0,'#f5ffd0');lime.addColorStop(.24,'#eaff73');lime.addColorStop(.58,'#d8ff1e');lime.addColorStop(1,'#648f00');
 x.fillStyle=lime;x.beginPath();x.arc(384,384,326,0,Math.PI*2);x.fill();x.lineWidth=26;x.strokeStyle='#293608';x.stroke();
 x.fillStyle='#040504';
 if(letter==='O'){
  x.beginPath();x.arc(390,405,205,0,Math.PI*2);x.fill();x.fillStyle='#d8ff1e';x.beginPath();x.arc(390,405,108,0,Math.PI*2);x.fill();
 }else{
  x.beginPath();x.arc(390,405,205,0,Math.PI*2);x.fill();x.fillStyle='#d8ff1e';x.beginPath();x.arc(390,405,108,0,Math.PI*2);x.fill();x.fillRect(478,286,165,142);x.fillStyle='#040504';x.fillRect(380,388,212,78);
 }
 x.fillStyle='rgba(255,255,255,.98)';x.beginPath();x.ellipse(230,208,48,74,-.48,0,Math.PI*2);x.fill();
 x.save();x.translate(520,230);x.rotate(Math.PI/4);x.fillRect(-8,-45,16,90);x.fillRect(-45,-8,90,16);x.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const texO=irisTexture('O'),texG=irisTexture('G');
function makeEye(x,tex,tilt){
 const g=new THREE.Group();const socketBack=new THREE.Mesh(new THREE.SphereGeometry(.90,68,46),rockDark);socketBack.scale.set(1.04,1.13,.22);socketBack.position.z=-.055;g.add(socketBack);
 const socketRing=new THREE.Mesh(new THREE.TorusGeometry(.760,.095,20,84),rockMat);socketRing.scale.set(1,1.105,.68);socketRing.position.z=.105;g.add(socketRing);
 const sclera=new THREE.Mesh(new THREE.SphereGeometry(.735,68,48),whiteMat);sclera.scale.set(1,1.10,.29);sclera.position.z=.085;g.add(sclera);
 const iris=new THREE.Mesh(new THREE.CircleGeometry(.655,84),new THREE.MeshBasicMaterial({map:tex,toneMapped:true}));iris.position.z=.318;iris.scale.y=1.025;g.add(iris);
 const lens=new THREE.Mesh(new THREE.SphereGeometry(.670,68,46),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.048,roughness:.018,transmission:.10,clearcoat:1,clearcoatRoughness:.012,depthWrite:false}));lens.scale.set(1,1.045,.14);lens.position.z=.356;g.add(lens);
 g.position.set(x,.46,2.37);g.rotation.z=tilt;g.rotation.y=x<0?.018:-.018;return g;
}
const eyeL=makeEye(-.82,texO,-.035),eyeR=makeEye(.82,texG,.035);core.add(eyeL,eyeR);const browL=new THREE.Group(),browR=new THREE.Group();core.add(browL,browR);

function curvedPanelGeometry(w,h,seg=70){const g=new THREE.PlaneGeometry(w,h,seg,6),a=g.attributes.position;for(let i=0;i<a.count;i++){const xx=a.getX(i),yy=a.getY(i),q=xx/(w*.5);a.setXYZ(i,xx,yy-.04*q*q,.16*(1-q*q)-.02*q*q)}a.needsUpdate=true;g.computeVertexNormals();return g}
function mouthBgTexture(){
 const c=document.createElement('canvas');c.width=1400;c.height=580;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 x.beginPath();x.moveTo(125,170);x.bezierCurveTo(330,214,510,246,700,250);x.bezierCurveTo(890,246,1070,214,1275,170);x.bezierCurveTo(1190,378,1020,452,700,482);x.bezierCurveTo(380,452,210,378,125,170);x.closePath();
 const g=x.createLinearGradient(0,130,0,510);g.addColorStop(0,'#010201');g.addColorStop(.70,'#050705');g.addColorStop(1,'#151c06');x.fillStyle=g;x.fill();
 const lg=x.createLinearGradient(0,390,0,520);lg.addColorStop(0,'rgba(216,255,30,0)');lg.addColorStop(1,'rgba(216,255,30,.52)');x.fillStyle=lg;x.beginPath();x.moveTo(220,395);x.quadraticCurveTo(700,505,1180,395);x.quadraticCurveTo(1025,474,700,500);x.quadraticCurveTo(375,474,220,395);x.fill();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function wordTexture(){const c=document.createElement('canvas');c.width=1400;c.height=580;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.font='900 italic 304px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';const gr=x.createLinearGradient(0,115,0,430);gr.addColorStop(0,'#fff');gr.addColorStop(.48,'#f5f3ea');gr.addColorStop(.78,'#cdd0ca');gr.addColorStop(1,'#8c918b');x.strokeStyle='#050605';x.lineWidth=17;x.strokeText('FASTR',690,296);x.fillStyle=gr;x.fillText('FASTR',690,296);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const mouthBack=new THREE.Group();core.add(mouthBack);const mouthCavity=new THREE.Mesh(curvedPanelGeometry(3.04,1.20),new THREE.MeshStandardMaterial({map:mouthBgTexture(),transparent:true,roughness:.82,metalness:.015,alphaTest:.02}));mouthCavity.position.set(0,-.91,2.39);mouthBack.add(mouthCavity);
const smilePlane=new THREE.Mesh(curvedPanelGeometry(2.82,.90),new THREE.MeshStandardMaterial({map:wordTexture(),transparent:true,roughness:.18,metalness:.62,envMapIntensity:.78,alphaTest:.02}));smilePlane.position.set(0,-.88,2.452);core.add(smilePlane);const smileGlow=new THREE.PointLight(LIME,.30,2.4,2);smileGlow.position.set(0,-1.21,2.0);core.add(smileGlow);

const craterOverlay=new THREE.Group();craterOverlay.name='CRATER_INTERIORS';core.add(craterOverlay);
function addCrater(nx,ny,nz,r,oval=1){const n=new THREE.Vector3(nx,ny,nz).normalize(),surf=new THREE.Vector3(n.x*2.60*1.055,n.y*2.60*1.035,n.z*2.60*.955),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),n);const g=new THREE.Group();g.position.copy(surf);g.quaternion.copy(q);g.scale.y=oval;const pit=new THREE.Mesh(new THREE.CircleGeometry(r*.73,48),new THREE.MeshStandardMaterial({color:0x010201,roughness:1,metalness:0}));pit.position.z=.002;g.add(pit);craterOverlay.add(g)}
[[-.64,.73,.58,.27,.86],[.12,.91,.39,.23,.92],[.58,.71,.50,.18,.87],[-.91,.28,.39,.17,1.05],[.92,.25,.31,.19,.92],[-.86,-.22,.38,.14,.94],[.88,-.34,.30,.13,1],[-.48,-.72,.42,.12,.9],[.53,-.69,.40,.15,.88],[-.35,.93,.20,.11,.9],[.76,.57,.25,.10,.86]].forEach(a=>addCrater(...a));

function pillArm(x){const g=new THREE.Group(),arm=new THREE.Mesh(new THREE.CapsuleGeometry(.37,.68,16,30),rubberMat);arm.scale.set(1.07,1,.96);arm.castShadow=true;g.add(arm);g.position.set(x,-.53,.42);g.rotation.z=x<0?.24:-.24;return g}
const armL=pillArm(-2.68),armR=pillArm(2.68);core.add(armL,armR);
function makeLeg(x){const g=new THREE.Group(),leg=new THREE.Mesh(new THREE.CapsuleGeometry(.23,.27,12,22),rubberMat);leg.position.y=.28;g.add(leg);const shoe=new THREE.Group();const upper=new THREE.Mesh(new THREE.SphereGeometry(.70,54,38),rubberMat);upper.scale.set(1.20,.64,1.46);upper.position.z=.18;shoe.add(upper);const toe=new THREE.Mesh(new THREE.SphereGeometry(.58,48,34),new THREE.MeshStandardMaterial({color:0x161917,roughness:.62,metalness:.02}));toe.scale.set(1.16,.43,1.02);toe.position.set(0,-.12,.76);shoe.add(toe);const mid=new THREE.Mesh(new THREE.SphereGeometry(.735,52,34),new THREE.MeshStandardMaterial({color:0xd7d9d3,roughness:.46,metalness:.01}));mid.scale.set(1.18,.075,1.47);mid.position.set(0,-.505,.25);shoe.add(mid);const outsole=new THREE.Mesh(new THREE.SphereGeometry(.71,50,32),soleMat);outsole.scale.set(1.17,.085,1.45);outsole.position.set(0,-.605,.28);shoe.add(outsole);const limeEdge=new THREE.Mesh(new THREE.SphereGeometry(.715,50,32),new THREE.MeshStandardMaterial({color:LIME,roughness:.50,metalness:.01}));limeEdge.scale.set(1.165,.030,1.44);limeEdge.position.set(0,-.666,.28);shoe.add(limeEdge);const trim=new THREE.Mesh(new THREE.TorusGeometry(.48,.040,10,52,Math.PI*1.45),limeMat);trim.rotation.x=Math.PI/2;trim.rotation.z=.78;trim.position.set(.38,-.25,.58);shoe.add(trim);g.add(shoe);g.position.set(x,-2.69,.10);g.userData.shoe=shoe;return g}
const legL=makeLeg(-.80),legR=makeLeg(.80);core.add(legL,legR);
const soleIconTex=(()=>{const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');x.fillStyle='#050605';x.fillRect(0,0,512,512);x.strokeStyle='#262a26';x.lineWidth=7;for(let y=38;y<500;y+=31){x.beginPath();x.moveTo(16,y);x.lineTo(496,y);x.stroke()}x.fillStyle='#d8ff1e';x.beginPath();x.arc(326,260,67,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(320,218);x.lineTo(92,158);x.lineTo(252,247);x.closePath();x.fill();x.beginPath();x.moveTo(320,292);x.lineTo(112,345);x.lineTo(255,271);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
function attachSoleDecal(leg){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.18,1.62),new THREE.MeshStandardMaterial({map:soleIconTex,roughness:.55,metalness:.01}));m.rotation.x=Math.PI/2;m.position.set(0,-.700,.32);m.renderOrder=3;leg.userData.shoe.add(m);leg.userData.soleDecal=m;return m}const soleDecalL=attachSoleDecal(legL),soleDecalR=attachSoleDecal(legR);
