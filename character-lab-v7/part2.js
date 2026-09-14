// ---------- MASTER FACE / COLLECTIBLE DETAILS ----------
function eyeSurfaceTexture(letter,side){
 const c=document.createElement('canvas');c.width=c.height=1024;const x=c.getContext('2d');x.clearRect(0,0,1024,1024);
 // only a thin asymmetric sclera crescent survives around the lime iris
 x.fillStyle='#dfe1d9';x.beginPath();x.arc(512,512,474,0,Math.PI*2);x.fill();
 const ix=side==='L'?548:478,iy=520,ir=444;
 const g=x.createRadialGradient(ix-120,iy-125,10,ix,iy,ir);g.addColorStop(0,'#f2ffc7');g.addColorStop(.18,'#e1ff5a');g.addColorStop(.50,'#d2ff13');g.addColorStop(.78,'#99cf00');g.addColorStop(1,'#426000');
 x.fillStyle=g;x.beginPath();x.arc(ix,iy,ir,0,Math.PI*2);x.fill();x.lineWidth=26;x.strokeStyle='#182305';x.stroke();
 // O / G are the pupil masses — large, black and organic rather than text glyphs.
 x.fillStyle='#020302';
 if(letter==='O'){
   x.beginPath();x.ellipse(ix+14,iy+24,248,278,-.05,0,Math.PI*2);x.fill();
   x.fillStyle='#cbff17';x.beginPath();x.ellipse(ix+14,iy+24,112,137,-.05,0,Math.PI*2);x.fill();
 }else{
   x.beginPath();x.ellipse(ix+12,iy+24,250,280,.05,0,Math.PI*2);x.fill();
   x.fillStyle='#cbff17';x.beginPath();x.ellipse(ix+12,iy+24,114,137,.05,0,Math.PI*2);x.fill();
   x.fillRect(ix+62,iy-8,190,96);x.fillStyle='#020302';x.fillRect(ix+2,iy+45,190,76);
 }
 // glossy collectible highlights
 x.fillStyle='rgba(255,255,255,.96)';x.beginPath();x.ellipse(282,278,61,92,-.47,0,Math.PI*2);x.fill();
 x.fillStyle='rgba(255,255,255,.68)';x.beginPath();x.ellipse(351,222,23,34,-.42,0,Math.PI*2);x.fill();
 x.save();x.translate(692,284);x.rotate(Math.PI/4);x.fillRect(-9,-56,18,112);x.fillRect(-56,-9,112,18);x.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const texO=eyeSurfaceTexture('O','L'),texG=eyeSurfaceTexture('G','R');
function makeEye(x,tex,tilt){
 const g=new THREE.Group();
 const socketBack=new THREE.Mesh(new THREE.SphereGeometry(.91,76,50),rockDark);socketBack.scale.set(1.04,1.10,.22);socketBack.position.z=-.06;g.add(socketBack);
 const socketRing=new THREE.Mesh(new THREE.TorusGeometry(.755,.072,20,96),rockMat);socketRing.scale.set(1,1.08,.62);socketRing.position.z=.075;g.add(socketRing);
 // unlit texture keeps black pupils/lime iris readable under any studio light
 const eye=new THREE.Mesh(new THREE.CircleGeometry(.715,96),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));eye.position.z=.245;eye.scale.y=1.055;g.add(eye);
 const lens=new THREE.Mesh(new THREE.SphereGeometry(.735,76,50),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.038,roughness:.012,transmission:.08,clearcoat:1,clearcoatRoughness:.008,depthWrite:false}));lens.scale.set(1,1.05,.13);lens.position.z=.300;g.add(lens);
 g.position.set(x,.48,2.30);g.rotation.z=tilt;g.rotation.y=x<0?.018:-.018;return g;
}
const eyeL=makeEye(-.79,texO,-.045),eyeR=makeEye(.79,texG,.045);core.add(eyeL,eyeR);const browL=new THREE.Group(),browR=new THREE.Group();core.add(browL,browR);

// ---------- FASTR smile is one integrated facial asset ----------
function curvedPanelGeometry(w,h,seg=92){const g=new THREE.PlaneGeometry(w,h,seg,8),a=g.attributes.position;for(let i=0;i<a.count;i++){const xx=a.getX(i),yy=a.getY(i),q=xx/(w*.5);a.setXYZ(i,xx,yy-.048*q*q,.155*(1-q*q)-.022*q*q)}a.needsUpdate=true;g.computeVertexNormals();return g}
function mouthTexture(){
 const c=document.createElement('canvas');c.width=1600;c.height=700;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 // chunky crescent mouth aperture, matching the approved character
 x.beginPath();x.moveTo(125,180);x.bezierCurveTo(360,224,585,250,800,252);x.bezierCurveTo(1015,250,1240,224,1475,180);x.bezierCurveTo(1372,443,1130,552,800,582);x.bezierCurveTo(470,552,228,443,125,180);x.closePath();
 const bg=x.createLinearGradient(0,160,0,600);bg.addColorStop(0,'#020302');bg.addColorStop(.66,'#060806');bg.addColorStop(1,'#182207');x.fillStyle=bg;x.fill();x.strokeStyle='#4a5049';x.lineWidth=25;x.stroke();
 // inner shadow gives actual depth
 x.strokeStyle='rgba(0,0,0,.88)';x.lineWidth=13;x.stroke();
 // lime bounce at the lower lip
 const lg=x.createLinearGradient(0,425,0,610);lg.addColorStop(0,'rgba(216,255,30,0)');lg.addColorStop(.62,'rgba(216,255,30,.26)');lg.addColorStop(1,'rgba(216,255,30,.80)');x.fillStyle=lg;x.beginPath();x.moveTo(255,430);x.quadraticCurveTo(800,605,1345,430);x.quadraticCurveTo(1140,548,800,585);x.quadraticCurveTo(460,548,255,430);x.fill();
 // FASTR sits inside the mouth, not in front of it
 x.font='900 italic 320px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';const fg=x.createLinearGradient(0,190,0,485);fg.addColorStop(0,'#fafbf5');fg.addColorStop(.50,'#e8e9e1');fg.addColorStop(.80,'#bdc1ba');fg.addColorStop(1,'#7f857f');x.strokeStyle='#080a08';x.lineWidth=20;x.strokeText('FASTR',790,365);x.fillStyle=fg;x.fillText('FASTR',790,365);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const mouthBack=new THREE.Group();core.add(mouthBack);const mouthPlane=new THREE.Mesh(curvedPanelGeometry(3.00,1.20),new THREE.MeshBasicMaterial({map:mouthTexture(),transparent:true,toneMapped:false,alphaTest:.02,side:THREE.DoubleSide}));mouthPlane.position.set(0,-.93,2.405);mouthBack.add(mouthPlane);const smilePlane=mouthPlane, mouthCavity=mouthPlane;const smileGlow=new THREE.PointLight(LIME,.18,2.0,2);smileGlow.position.set(0,-1.21,2.02);core.add(smileGlow);

// ---------- Deliberate crater interiors ----------
const craterOverlay=new THREE.Group();craterOverlay.name='CRATER_INTERIORS';core.add(craterOverlay);
function addCrater(nx,ny,nz,r,oval=1){const n=new THREE.Vector3(nx,ny,nz).normalize(),surf=new THREE.Vector3(n.x*2.60*1.052,n.y*2.60*1.032,n.z*2.60*.952),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),n),g=new THREE.Group();g.position.copy(surf);g.quaternion.copy(q);g.scale.y=oval;const pit=new THREE.Mesh(new THREE.CircleGeometry(r,52),new THREE.MeshStandardMaterial({color:0x010201,roughness:1,metalness:0}));pit.position.z=-.008;g.add(pit);craterOverlay.add(g)}
[[-.52,.83,.54,.31,.86],[.08,.95,.30,.26,.92],[.55,.77,.39,.22,.86],[-.82,.53,.35,.20,.98],[.86,.48,.29,.21,.92],[-.91,.18,.36,.17,1.04],[.92,.14,.31,.15,.90],[-.78,-.24,.38,.13,.95],[.82,-.31,.31,.14,.96],[-.50,-.69,.41,.13,.90],[.55,-.66,.39,.14,.88],[-.20,.76,.62,.11,.92],[.32,.66,.67,.10,.88],[-.64,.42,.63,.09,.92],[.66,.32,.66,.09,.88],[-.12,-.66,.69,.08,.90]].forEach(a=>addCrater(...a));

// ---------- Collectible limbs ----------
function pillArm(x){const g=new THREE.Group(),arm=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.72,16,32),rubberMat);arm.scale.set(1.06,1,.96);arm.castShadow=true;g.add(arm);g.position.set(x,-.50,.80);g.rotation.z=x<0?.22:-.22;return g}const armL=pillArm(-2.82),armR=pillArm(2.82);core.add(armL,armR);
function makeLeg(x){const g=new THREE.Group(),leg=new THREE.Mesh(new THREE.CapsuleGeometry(.23,.28,12,22),rubberMat);leg.position.y=.28;g.add(leg);const shoe=new THREE.Group();const upper=new THREE.Mesh(new THREE.SphereGeometry(.69,56,40),rubberMat);upper.scale.set(1.18,.62,1.43);upper.position.z=.18;shoe.add(upper);const toe=new THREE.Mesh(new THREE.SphereGeometry(.58,48,34),new THREE.MeshStandardMaterial({color:0x151816,roughness:.60,metalness:.02}));toe.scale.set(1.13,.42,1.0);toe.position.set(0,-.12,.73);shoe.add(toe);const mid=new THREE.Mesh(new THREE.SphereGeometry(.72,50,34),new THREE.MeshStandardMaterial({color:0xc8cbc5,roughness:.48,metalness:.01}));mid.scale.set(1.16,.045,1.43);mid.position.set(0,-.495,.24);shoe.add(mid);const outsole=new THREE.Mesh(new THREE.SphereGeometry(.70,50,32),soleMat);outsole.scale.set(1.16,.105,1.42);outsole.position.set(0,-.60,.27);shoe.add(outsole);const limeEdge=new THREE.Mesh(new THREE.TorusGeometry(.55,.030,10,64),limeMat);limeEdge.rotation.x=Math.PI/2;limeEdge.scale.set(1.08,1.26,1);limeEdge.position.set(0,-.61,.24);shoe.add(limeEdge);g.add(shoe);g.position.set(x,-2.66,.12);g.userData.shoe=shoe;return g}const legL=makeLeg(-.80),legR=makeLeg(.80);core.add(legL,legR);
const soleIconTex=(()=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#050605';x.fillRect(0,0,512,512);x.strokeStyle='#242824';x.lineWidth=7;for(let y=38;y<500;y+=31){x.beginPath();x.moveTo(16,y);x.lineTo(496,y);x.stroke()}x.fillStyle='#d8ff1e';x.beginPath();x.arc(326,260,67,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(320,218);x.lineTo(92,158);x.lineTo(252,247);x.closePath();x.fill();x.beginPath();x.moveTo(320,292);x.lineTo(112,345);x.lineTo(255,271);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
function attachSoleDecal(leg){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.16,1.60),new THREE.MeshStandardMaterial({map:soleIconTex,roughness:.55,metalness:.01}));m.rotation.x=Math.PI/2;m.position.set(0,-.708,.30);m.renderOrder=3;leg.userData.shoe.add(m);leg.userData.soleDecal=m;return m}const soleDecalL=attachSoleDecal(legL),soleDecalR=attachSoleDecal(legR);
