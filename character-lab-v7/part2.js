// ---------- High-fidelity face + collectible details ----------
function irisTexture(letter){
 const c=document.createElement('canvas');c.width=c.height=768;const x=c.getContext('2d');x.clearRect(0,0,768,768);
 const lime=x.createRadialGradient(290,250,20,380,390,320);lime.addColorStop(0,'#efffb3');lime.addColorStop(.34,'#dfff35');lime.addColorStop(.72,'#caff0a');lime.addColorStop(1,'#77a900');
 x.fillStyle=lime;x.beginPath();x.arc(384,384,315,0,Math.PI*2);x.fill();
 // darker outer iris limbal ring
 x.lineWidth=34;x.strokeStyle='#1b2507';x.stroke();
 // OG letter acts as the pupil, matching the brand-character concept.
 x.fillStyle='#050605';x.font='900 italic 360px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(letter,395,410);
 // premium toy highlights
 x.fillStyle='rgba(255,255,255,.96)';x.beginPath();x.ellipse(245,235,52,78,-.45,0,Math.PI*2);x.fill();
 x.save();x.translate(520,242);x.rotate(Math.PI/4);x.fillRect(-9,-48,18,96);x.fillRect(-48,-9,96,18);x.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const texO=irisTexture('O'),texG=irisTexture('G');

function makeEye(x,tex,tilt){
 const g=new THREE.Group();
 // deep stone socket first – this is what makes the eyes feel carved into the meteor
 const socketBack=new THREE.Mesh(new THREE.SphereGeometry(.89,64,42),rockDark);socketBack.scale.set(1.04,1.12,.22);socketBack.position.z=-.055;g.add(socketBack);
 const socketRing=new THREE.Mesh(new THREE.TorusGeometry(.755,.105,20,80),rockMat);socketRing.scale.set(1,1.10,.70);socketRing.position.z=.11;g.add(socketRing);
 const sclera=new THREE.Mesh(new THREE.SphereGeometry(.735,64,46),whiteMat);sclera.scale.set(1,1.095,.29);sclera.position.z=.085;g.add(sclera);
 const iris=new THREE.Mesh(new THREE.CircleGeometry(.515,72),new THREE.MeshBasicMaterial({map:tex,toneMapped:true}));iris.position.z=.315;iris.scale.y=1.02;g.add(iris);
 const lens=new THREE.Mesh(new THREE.SphereGeometry(.545,64,42),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.055,roughness:.025,metalness:0,transmission:.08,clearcoat:1,clearcoatRoughness:.02,depthWrite:false}));lens.scale.set(1,1.045,.15);lens.position.z=.355;g.add(lens);
 g.position.set(x,.48,2.37);g.rotation.z=tilt;g.rotation.y=x<0?.018:-.018;return g;
}
const eyeL=makeEye(-.82,texO,-.035),eyeR=makeEye(.82,texG,.035);core.add(eyeL,eyeR);
// Kept as groups for compatibility with future rigging; expression is now created by the sockets, not pasted-on eyebrows.
const browL=new THREE.Group(),browR=new THREE.Group();core.add(browL,browR);

// ---------- Integrated FASTR smile ----------
function curvedPanelGeometry(w,h,seg=70){
 const g=new THREE.PlaneGeometry(w,h,seg,6),a=g.attributes.position;
 for(let i=0;i<a.count;i++){
  const xx=a.getX(i),yy=a.getY(i),q=xx/(w*.5);
  // convex to follow the meteor + slightly deeper at corners
  const zz=.16*(1-q*q)-.025*q*q;
  a.setXYZ(i,xx,yy-.060*q*q,zz);
 }
 a.needsUpdate=true;g.computeVertexNormals();return g;
}
function mouthBgTexture(){
 const c=document.createElement('canvas');c.width=1400;c.height=560;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 x.beginPath();x.moveTo(92,118);x.quadraticCurveTo(700,262,1308,118);x.quadraticCurveTo(1225,414,700,470);x.quadraticCurveTo(175,414,92,118);x.closePath();
 const g=x.createLinearGradient(0,80,0,500);g.addColorStop(0,'#030403');g.addColorStop(.66,'#060806');g.addColorStop(1,'#1b2408');x.fillStyle=g;x.fill();
 x.strokeStyle='#30342f';x.lineWidth=18;x.stroke();
 // narrow lime reflected light, not emissive
 const lg=x.createLinearGradient(0,360,0,485);lg.addColorStop(0,'rgba(216,255,30,0)');lg.addColorStop(1,'rgba(216,255,30,.58)');x.fillStyle=lg;x.beginPath();x.moveTo(210,365);x.quadraticCurveTo(700,490,1190,365);x.quadraticCurveTo(1040,455,700,486);x.quadraticCurveTo(360,455,210,365);x.fill();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function wordTexture(){
 const c=document.createElement('canvas');c.width=1400;c.height=560;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 x.font='900 italic 292px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';
 const gr=x.createLinearGradient(0,110,0,410);gr.addColorStop(0,'#ffffff');gr.addColorStop(.48,'#f3f2e9');gr.addColorStop(.78,'#d2d4ce');gr.addColorStop(1,'#969b95');
 x.strokeStyle='#080908';x.lineWidth=22;x.strokeText('FASTR',690,282);x.fillStyle=gr;x.fillText('FASTR',690,282);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const mouthBack=new THREE.Group();core.add(mouthBack);
const mouthCavity=new THREE.Mesh(curvedPanelGeometry(2.96,1.16),new THREE.MeshStandardMaterial({map:mouthBgTexture(),transparent:true,roughness:.72,metalness:.03,alphaTest:.02}));
mouthCavity.position.set(0,-.91,2.38);mouthBack.add(mouthCavity);
const smilePlane=new THREE.Mesh(curvedPanelGeometry(2.70,.86),new THREE.MeshStandardMaterial({map:wordTexture(),transparent:true,roughness:.20,metalness:.56,envMapIntensity:.72,alphaTest:.02}));
smilePlane.position.set(0,-.89,2.445);core.add(smilePlane);
const smileGlow=new THREE.PointLight(LIME,.55,2.7,2);smileGlow.position.set(0,-1.19,2.0);core.add(smileGlow);

// ---------- Sharper crater read ----------
const craterOverlay=new THREE.Group();craterOverlay.name='CRATER_RIMS';core.add(craterOverlay);
function addCrater(nx,ny,nz,r,oval=1){
 const n=new THREE.Vector3(nx,ny,nz).normalize();
 const surf=new THREE.Vector3(n.x*2.60*1.055,n.y*2.60*1.035,n.z*2.60*.955);
 const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),n);
 const g=new THREE.Group();g.position.copy(surf);g.quaternion.copy(q);g.scale.y=oval;
 const rimMesh=new THREE.Mesh(new THREE.TorusGeometry(r,.060+Math.min(.025,r*.05),12,44),rockMat);rimMesh.position.z=.018;g.add(rimMesh);
 const pit=new THREE.Mesh(new THREE.CircleGeometry(r*.79,44),new THREE.MeshStandardMaterial({color:0x010201,roughness:1,metalness:0}));pit.position.z=-.005;g.add(pit);
 craterOverlay.add(g);
}
[
 [-.64,.73,.58,.27,.86],[.12,.91,.39,.23,.92],[.58,.71,.50,.18,.87],[-.91,.28,.39,.17,1.05],[.92,.25,.31,.19,.92],
 [-.86,-.22,.38,.14,.94],[.88,-.34,.30,.13,1.0],[-.48,-.72,.42,.12,.9],[.53,-.69,.40,.15,.88],[-.35,.93,.20,.11,.9],
 [.76,.57,.25,.10,.86],[-.74,.52,.20,.095,.9]
].forEach(a=>addCrater(...a));

// ---------- Collectible limbs ----------
function pillArm(x){
 const g=new THREE.Group();const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.35,.62,16,28),rubberMat);arm.scale.set(1.06,1,.96);arm.castShadow=true;g.add(arm);
 g.position.set(x,-.48,.13);g.rotation.z=x<0?.22:-.22;return g;
}
const armL=pillArm(-2.53),armR=pillArm(2.53);core.add(armL,armR);

function makeLeg(x){
 const g=new THREE.Group();const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.24,.28,12,22),rubberMat);leg.position.y=.30;g.add(leg);
 const shoe=new THREE.Group();
 const upper=new THREE.Mesh(new THREE.SphereGeometry(.70,54,38),rubberMat);upper.scale.set(1.20,.64,1.46);upper.position.z=.18;shoe.add(upper);
 const toe=new THREE.Mesh(new THREE.SphereGeometry(.58,48,34),new THREE.MeshStandardMaterial({color:0x161917,roughness:.62,metalness:.02}));toe.scale.set(1.16,.43,1.02);toe.position.set(0,-.12,.76);shoe.add(toe);
 const mid=new THREE.Mesh(new THREE.SphereGeometry(.735,52,34),new THREE.MeshStandardMaterial({color:0xd9dbd4,roughness:.44,metalness:.02}));mid.scale.set(1.19,.135,1.48);mid.position.set(0,-.52,.25);shoe.add(mid);
 const outsole=new THREE.Mesh(new THREE.SphereGeometry(.70,50,32),soleMat);outsole.scale.set(1.17,.105,1.45);outsole.position.set(0,-.635,.28);shoe.add(outsole);
 const trim=new THREE.Mesh(new THREE.TorusGeometry(.48,.046,10,52,Math.PI*1.45),limeMat);trim.rotation.x=Math.PI/2;trim.rotation.z=.78;trim.position.set(.38,-.25,.58);shoe.add(trim);
 g.add(shoe);g.position.set(x,-2.69,.10);g.userData.shoe=shoe;return g;
}
const legL=makeLeg(-.80),legR=makeLeg(.80);core.add(legL,legR);

const soleIconTex=(()=>{const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');x.fillStyle='#050605';x.fillRect(0,0,512,512);x.strokeStyle='#262a26';x.lineWidth=7;for(let y=38;y<500;y+=31){x.beginPath();x.moveTo(16,y);x.lineTo(496,y);x.stroke()}x.fillStyle='#d8ff1e';x.beginPath();x.arc(326,260,67,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(320,218);x.lineTo(92,158);x.lineTo(252,247);x.closePath();x.fill();x.beginPath();x.moveTo(320,292);x.lineTo(112,345);x.lineTo(255,271);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
function attachSoleDecal(leg){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.20,1.66),new THREE.MeshStandardMaterial({map:soleIconTex,roughness:.54,metalness:.01}));m.rotation.x=Math.PI/2;m.position.set(0,-.705,.32);m.renderOrder=3;leg.userData.shoe.add(m);leg.userData.soleDecal=m;return m}
const soleDecalL=attachSoleDecal(legL),soleDecalR=attachSoleDecal(legR);
