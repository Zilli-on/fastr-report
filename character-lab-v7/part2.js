// ---------- MASTER FACE / COLLECTIBLE DETAILS ----------
function eyeSurfaceTexture(letter,side){
 const c=document.createElement('canvas');c.width=c.height=1024;const x=c.getContext('2d');x.clearRect(0,0,1024,1024);
 x.fillStyle='#dfe1d9';x.beginPath();x.arc(512,512,474,0,Math.PI*2);x.fill();
 const ix=side==='L'?548:478,iy=520,ir=444;
 const g=x.createRadialGradient(ix-120,iy-125,10,ix,iy,ir);g.addColorStop(0,'#f2ffc7');g.addColorStop(.18,'#e1ff5a');g.addColorStop(.50,'#d2ff13');g.addColorStop(.78,'#99cf00');g.addColorStop(1,'#426000');
 x.fillStyle=g;x.beginPath();x.arc(ix,iy,ir,0,Math.PI*2);x.fill();x.lineWidth=26;x.strokeStyle='#182305';x.stroke();
 // Canonical eyes: left O is read through a deep black oval pupil; right G is explicit.
 x.fillStyle='#020302';
 if(letter==='O'){
   x.beginPath();x.ellipse(ix+16,iy+28,224,274,-.06,0,Math.PI*2);x.fill();
 }else{
   x.beginPath();x.ellipse(ix+12,iy+24,250,280,.05,0,Math.PI*2);x.fill();
   x.fillStyle='#cbff17';x.beginPath();x.ellipse(ix+12,iy+24,112,134,.05,0,Math.PI*2);x.fill();
   x.fillRect(ix+60,iy-8,190,94);x.fillStyle='#020302';x.fillRect(ix+0,iy+44,190,76);
 }
 x.fillStyle='rgba(255,255,255,.96)';x.beginPath();x.ellipse(282,278,61,92,-.47,0,Math.PI*2);x.fill();
 x.fillStyle='rgba(255,255,255,.68)';x.beginPath();x.ellipse(351,222,23,34,-.42,0,Math.PI*2);x.fill();
 x.save();x.translate(692,284);x.rotate(Math.PI/4);x.fillRect(-9,-56,18,112);x.fillRect(-56,-9,112,18);x.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const texO=eyeSurfaceTexture('O','L'),texG=eyeSurfaceTexture('G','R');
function makeEye(x,tex,tilt){
 const g=new THREE.Group();
 const socketBack=new THREE.Mesh(new THREE.SphereGeometry(.90,76,50),rockDark);socketBack.scale.set(1.04,1.10,.21);socketBack.position.z=-.055;g.add(socketBack);
 const socketRing=new THREE.Mesh(new THREE.TorusGeometry(.748,.060,20,96),rockMat);socketRing.scale.set(1,1.08,.60);socketRing.position.z=.068;g.add(socketRing);
 const eye=new THREE.Mesh(new THREE.CircleGeometry(.708,96),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));eye.position.z=.238;eye.scale.y=1.055;g.add(eye);
 const lens=new THREE.Mesh(new THREE.SphereGeometry(.730,76,50),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.035,roughness:.012,transmission:.08,clearcoat:1,clearcoatRoughness:.008,depthWrite:false}));lens.scale.set(1,1.05,.13);lens.position.z=.294;g.add(lens);
 g.position.set(x,.47,2.30);g.rotation.z=tilt;g.rotation.y=x<0?.018:-.018;return g;
}
const eyeL=makeEye(-.79,texO,-.045),eyeR=makeEye(.79,texG,.045);core.add(eyeL,eyeR);const browL=new THREE.Group(),browR=new THREE.Group();core.add(browL,browR);

// ---------- Deep integrated FASTR smile ----------
function curvedPanelGeometry(w,h,seg=92){const g=new THREE.PlaneGeometry(w,h,seg,8),a=g.attributes.position;for(let i=0;i<a.count;i++){const xx=a.getX(i),yy=a.getY(i),q=xx/(w*.5);a.setXYZ(i,xx,yy-.052*q*q,.135*(1-q*q)-.030*q*q)}a.needsUpdate=true;g.computeVertexNormals();return g}
function mouthTexture(){
 const c=document.createElement('canvas');c.width=1600;c.height=760;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 // taller crescent, so FASTR lives inside the cavity with visible black above and below
 x.beginPath();x.moveTo(115,175);x.bezierCurveTo(355,220,575,250,800,252);x.bezierCurveTo(1025,250,1245,220,1485,175);x.bezierCurveTo(1390,500,1135,625,800,652);x.bezierCurveTo(465,625,210,500,115,175);x.closePath();
 const bg=x.createLinearGradient(0,150,0,670);bg.addColorStop(0,'#010201');bg.addColorStop(.58,'#050705');bg.addColorStop(1,'#151e06');x.fillStyle=bg;x.fill();x.strokeStyle='#30352f';x.lineWidth=22;x.stroke();
 x.strokeStyle='rgba(0,0,0,.94)';x.lineWidth=12;x.stroke();
 const lg=x.createLinearGradient(0,500,0,680);lg.addColorStop(0,'rgba(216,255,30,0)');lg.addColorStop(.58,'rgba(216,255,30,.20)');lg.addColorStop(1,'rgba(216,255,30,.72)');x.fillStyle=lg;x.beginPath();x.moveTo(245,510);x.quadraticCurveTo(800,665,1355,510);x.quadraticCurveTo(1145,612,800,648);x.quadraticCurveTo(455,612,245,510);x.fill();
 x.font='900 italic 254px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';const fg=x.createLinearGradient(0,240,0,500);fg.addColorStop(0,'#fafbf5');fg.addColorStop(.50,'#e4e6df');fg.addColorStop(.82,'#aeb3ac');fg.addColorStop(1,'#767c76');x.strokeStyle='#070907';x.lineWidth=18;x.strokeText('FASTR',792,410);x.fillStyle=fg;x.fillText('FASTR',792,410);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const mouthBack=new THREE.Group();core.add(mouthBack);const mouthPlane=new THREE.Mesh(curvedPanelGeometry(3.08,1.34),new THREE.MeshBasicMaterial({map:mouthTexture(),transparent:true,toneMapped:false,alphaTest:.02,side:THREE.DoubleSide}));mouthPlane.position.set(0,-.96,2.345);mouthBack.add(mouthPlane);const smilePlane=mouthPlane,mouthCavity=mouthPlane;const smileGlow=new THREE.PointLight(LIME,.14,1.8,2);smileGlow.position.set(0,-1.30,2.00);core.add(smileGlow);

// ---------- Deliberate crater interiors ----------
const craterOverlay=new THREE.Group();craterOverlay.name='CRATER_INTERIORS';core.add(craterOverlay);
function addCrater(nx,ny,nz,r,oval=1){const n=new THREE.Vector3(nx,ny,nz).normalize(),surf=new THREE.Vector3(n.x*2.60*1.052,n.y*2.60*1.032,n.z*2.60*.952),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),n),g=new THREE.Group();g.position.copy(surf);g.quaternion.copy(q);g.scale.y=oval;const pit=new THREE.Mesh(new THREE.CircleGeometry(r,52),new THREE.MeshStandardMaterial({color:0x010201,roughness:1,metalness:0}));pit.position.z=-.008;g.add(pit);craterOverlay.add(g)}
[[-.52,.83,.54,.31,.86],[.08,.95,.30,.26,.92],[.55,.77,.39,.22,.86],[-.82,.53,.35,.20,.98],[.86,.48,.29,.21,.92],[-.91,.18,.36,.17,1.04],[.92,.14,.31,.15,.90],[-.78,-.24,.38,.13,.95],[.82,-.31,.31,.14,.96],[-.50,-.69,.41,.13,.90],[.55,-.66,.39,.14,.88],[-.20,.76,.62,.11,.92],[.32,.66,.67,.10,.88],[-.64,.42,.63,.09,.92],[.66,.32,.66,.09,.88],[-.12,-.66,.69,.08,.90]].forEach(a=>addCrater(...a));

// ---------- Round collectible arms, not tubes ----------
function pillArm(x){const g=new THREE.Group(),arm=new THREE.Mesh(new THREE.SphereGeometry(.50,42,32),rubberMat);arm.scale.set(1.05,.90,.92);arm.castShadow=true;g.add(arm);g.position.set(x,-.52,.82);return g}const armL=pillArm(-2.82),armR=pillArm(2.82);core.add(armL,armR);

function makeLeg(x){const g=new THREE.Group(),leg=new THREE.Mesh(new THREE.CapsuleGeometry(.23,.28,12,22),rubberMat);leg.position.y=.28;g.add(leg);const shoe=new THREE.Group();const upper=new THREE.Mesh(new THREE.SphereGeometry(.69,56,40),rubberMat);upper.scale.set(1.18,.62,1.43);upper.position.z=.18;shoe.add(upper);const toe=new THREE.Mesh(new THREE.SphereGeometry(.58,48,34),new THREE.MeshStandardMaterial({color:0x151816,roughness:.60,metalness:.02}));toe.scale.set(1.13,.42,1.0);toe.position.set(0,-.12,.73);shoe.add(toe);const mid=new THREE.Mesh(new THREE.SphereGeometry(.72,50,34),new THREE.MeshStandardMaterial({color:0x6f746f,roughness:.52,metalness:.01}));mid.scale.set(1.15,.030,1.41);mid.position.set(0,-.500,.24);shoe.add(mid);const outsole=new THREE.Mesh(new THREE.SphereGeometry(.70,50,32),soleMat);outsole.scale.set(1.16,.115,1.42);outsole.position.set(0,-.60,.27);shoe.add(outsole);const limeEdge=new THREE.Mesh(new THREE.TorusGeometry(.55,.030,10,64),limeMat);limeEdge.rotation.x=Math.PI/2;limeEdge.scale.set(1.08,1.26,1);limeEdge.position.set(0,-.61,.24);shoe.add(limeEdge);g.add(shoe);g.position.set(x,-2.66,.12);g.userData.shoe=shoe;return g}const legL=makeLeg(-.80),legR=makeLeg(.80);core.add(legL,legR);
const soleIconTex=(()=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#050605';x.fillRect(0,0,512,512);x.strokeStyle='#242824';x.lineWidth=7;for(let y=38;y<500;y+=31){x.beginPath();x.moveTo(16,y);x.lineTo(496,y);x.stroke()}x.fillStyle='#d8ff1e';x.beginPath();x.arc(326,260,67,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(320,218);x.lineTo(92,158);x.lineTo(252,247);x.closePath();x.fill();x.beginPath();x.moveTo(320,292);x.lineTo(112,345);x.lineTo(255,271);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
function attachSoleDecal(leg){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.16,1.60),new THREE.MeshStandardMaterial({map:soleIconTex,roughness:.55,metalness:.01}));m.rotation.x=Math.PI/2;m.position.set(0,-.718,.30);m.renderOrder=3;leg.userData.shoe.add(m);leg.userData.soleDecal=m;return m}const soleDecalL=attachSoleDecal(legL),soleDecalR=attachSoleDecal(legR);
