// ---------- MASTER FACE / COLLECTIBLE DETAILS ----------
function eyeSurfaceTexture(letter,side){
 const c=document.createElement('canvas');c.width=c.height=1024;const x=c.getContext('2d');x.clearRect(0,0,1024,1024);
 // off-white sclera, intentionally asymmetric like the approved hero render
 x.fillStyle='#f2f1e9';x.beginPath();x.arc(512,512,472,0,Math.PI*2);x.fill();
 // lime iris shifted inward, leaving only a crescent of sclera visible
 const ix=side==='L'?556:470,iy=522,ir=402;
 const g=x.createRadialGradient(ix-105,iy-120,18,ix,iy,ir);g.addColorStop(0,'#f5ffd5');g.addColorStop(.24,'#e7ff6f');g.addColorStop(.58,'#d8ff1e');g.addColorStop(.82,'#a9db00');g.addColorStop(1,'#4e7000');
 x.fillStyle=g;x.beginPath();x.arc(ix,iy,ir,0,Math.PI*2);x.fill();
 x.strokeStyle='#162004';x.lineWidth=34;x.stroke();
 // pupil shape: OG is not typography pasted on top, it IS the pupil language
 x.fillStyle='#030403';
 if(letter==='O'){
   x.beginPath();x.ellipse(ix+18,iy+20,222,250,-.05,0,Math.PI*2);x.fill();
   x.fillStyle='#cfff19';x.beginPath();x.ellipse(ix+18,iy+20,115,138,-.05,0,Math.PI*2);x.fill();
 }else{
   x.beginPath();x.ellipse(ix+18,iy+20,224,250,.05,0,Math.PI*2);x.fill();
   x.fillStyle='#cfff19';x.beginPath();x.ellipse(ix+18,iy+20,116,136,.05,0,Math.PI*2);x.fill();
   x.fillRect(ix+62,iy-8,184,94);x.fillStyle='#030403';x.fillRect(ix+8,iy+44,178,74);
 }
 // hero highlights
 x.fillStyle='rgba(255,255,255,.98)';x.beginPath();x.ellipse(286,278,63,93,-.48,0,Math.PI*2);x.fill();
 x.fillStyle='rgba(255,255,255,.74)';x.beginPath();x.ellipse(350,222,25,35,-.4,0,Math.PI*2);x.fill();
 x.save();x.translate(690,285);x.rotate(Math.PI/4);x.fillRect(-10,-58,20,116);x.fillRect(-58,-10,116,20);x.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const texO=eyeSurfaceTexture('O','L'),texG=eyeSurfaceTexture('G','R');
function makeEye(x,tex,tilt){
 const g=new THREE.Group();
 const socketBack=new THREE.Mesh(new THREE.SphereGeometry(.96,76,50),rockDark);socketBack.scale.set(1.04,1.10,.24);socketBack.position.z=-.08;g.add(socketBack);
 const socketRing=new THREE.Mesh(new THREE.TorusGeometry(.79,.105,22,96),rockMat);socketRing.scale.set(1,1.08,.65);socketRing.position.z=.08;g.add(socketRing);
 const eye=new THREE.Mesh(new THREE.CircleGeometry(.735,96),new THREE.MeshStandardMaterial({map:tex,roughness:.12,metalness:.0,envMapIntensity:.52}));eye.position.z=.295;eye.scale.y=1.06;g.add(eye);
 const lens=new THREE.Mesh(new THREE.SphereGeometry(.765,76,50),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.055,roughness:.015,transmission:.10,clearcoat:1,clearcoatRoughness:.01,depthWrite:false}));lens.scale.set(1,1.055,.14);lens.position.z=.355;g.add(lens);
 g.position.set(x,.46,2.39);g.rotation.z=tilt;g.rotation.y=x<0?.022:-.022;return g;
}
const eyeL=makeEye(-.82,texO,-.035),eyeR=makeEye(.82,texG,.035);core.add(eyeL,eyeR);
const browL=new THREE.Group(),browR=new THREE.Group();core.add(browL,browR);

// ---------- Integrated FASTR smile: one curved mouth asset, never floating letters ----------
function curvedPanelGeometry(w,h,seg=84){const g=new THREE.PlaneGeometry(w,h,seg,8),a=g.attributes.position;for(let i=0;i<a.count;i++){const xx=a.getX(i),yy=a.getY(i),q=xx/(w*.5);a.setXYZ(i,xx,yy-.055*q*q,.18*(1-q*q)-.025*q*q)}a.needsUpdate=true;g.computeVertexNormals();return g}
function mouthTexture(){
 const c=document.createElement('canvas');c.width=1600;c.height=720;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);
 // transparent exterior + sculpted smile aperture
 x.beginPath();x.moveTo(145,190);x.bezierCurveTo(420,245,610,272,800,275);x.bezierCurveTo(990,272,1180,245,1455,190);x.bezierCurveTo(1360,465,1135,558,800,588);x.bezierCurveTo(465,558,240,465,145,190);x.closePath();
 const bg=x.createLinearGradient(0,140,0,620);bg.addColorStop(0,'#010201');bg.addColorStop(.58,'#060806');bg.addColorStop(1,'#182207');x.fillStyle=bg;x.fill();
 x.strokeStyle='#31362f';x.lineWidth=20;x.stroke();
 // lime reflected floor light
 const lg=x.createLinearGradient(0,430,0,620);lg.addColorStop(0,'rgba(216,255,30,0)');lg.addColorStop(.70,'rgba(216,255,30,.30)');lg.addColorStop(1,'rgba(216,255,30,.74)');x.fillStyle=lg;x.beginPath();x.moveTo(275,445);x.quadraticCurveTo(800,605,1325,445);x.quadraticCurveTo(1150,555,800,592);x.quadraticCurveTo(450,555,275,445);x.fill();
 // FASTR integrated inside the smile
 x.font='900 italic 335px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';const fg=x.createLinearGradient(0,190,0,500);fg.addColorStop(0,'#fff');fg.addColorStop(.48,'#f2f1e8');fg.addColorStop(.76,'#ced1ca');fg.addColorStop(1,'#8f958e');x.strokeStyle='#050605';x.lineWidth=20;x.strokeText('FASTR',790,365);x.fillStyle=fg;x.fillText('FASTR',790,365);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const mouthBack=new THREE.Group();core.add(mouthBack);
const mouthPlane=new THREE.Mesh(curvedPanelGeometry(3.05,1.25),new THREE.MeshStandardMaterial({map:mouthTexture(),transparent:true,roughness:.26,metalness:.28,envMapIntensity:.65,alphaTest:.02,side:THREE.DoubleSide}));mouthPlane.position.set(0,-.91,2.405);mouthBack.add(mouthPlane);
const smilePlane=mouthPlane;const mouthCavity=mouthPlane;
const smileGlow=new THREE.PointLight(LIME,.36,2.3,2);smileGlow.position.set(0,-1.22,2.05);core.add(smileGlow);

// ---------- Deliberate crater holes: no donut rims ----------
const craterOverlay=new THREE.Group();craterOverlay.name='CRATER_INTERIORS';core.add(craterOverlay);
function addCrater(nx,ny,nz,r,oval=1){
 const n=new THREE.Vector3(nx,ny,nz).normalize(),surf=new THREE.Vector3(n.x*2.60*1.052,n.y*2.60*1.032,n.z*2.60*.952),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),n);const g=new THREE.Group();g.position.copy(surf);g.quaternion.copy(q);g.scale.y=oval;
 const pit=new THREE.Mesh(new THREE.CircleGeometry(r,52),new THREE.MeshStandardMaterial({color:0x010201,roughness:1,metalness:0}));pit.position.z=-.006;g.add(pit);craterOverlay.add(g);
}
[
 [-.52,.83,.54,.31,.86],[.08,.95,.30,.26,.92],[.55,.77,.39,.22,.86],[-.82,.53,.35,.20,.98],[.86,.48,.29,.21,.92],
 [-.91,.18,.36,.17,1.04],[.92,.14,.31,.15,.90],[-.78,-.24,.38,.13,.95],[.82,-.31,.31,.14,.96],[-.50,-.69,.41,.13,.90],[.55,-.66,.39,.14,.88],
 [-.20,.76,.62,.11,.92],[.32,.66,.67,.10,.88],[-.64,.42,.63,.09,.92],[.66,.32,.66,.09,.88],[-.12,-.66,.69,.08,.90]
].forEach(a=>addCrater(...a));

// ---------- Collectible limbs ----------
function pillArm(x){const g=new THREE.Group(),arm=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.72,16,32),rubberMat);arm.scale.set(1.06,1,.96);arm.castShadow=true;g.add(arm);g.position.set(x,-.50,.72);g.rotation.z=x<0?.22:-.22;return g}
const armL=pillArm(-2.72),armR=pillArm(2.72);core.add(armL,armR);

function makeLeg(x){const g=new THREE.Group(),leg=new THREE.Mesh(new THREE.CapsuleGeometry(.23,.28,12,22),rubberMat);leg.position.y=.28;g.add(leg);const shoe=new THREE.Group();
 const upper=new THREE.Mesh(new THREE.SphereGeometry(.69,56,40),rubberMat);upper.scale.set(1.18,.62,1.43);upper.position.z=.18;shoe.add(upper);
 const toe=new THREE.Mesh(new THREE.SphereGeometry(.58,48,34),new THREE.MeshStandardMaterial({color:0x151816,roughness:.60,metalness:.02}));toe.scale.set(1.13,.42,1.0);toe.position.set(0,-.12,.73);shoe.add(toe);
 const mid=new THREE.Mesh(new THREE.SphereGeometry(.72,50,34),new THREE.MeshStandardMaterial({color:0xd6d8d2,roughness:.47,metalness:.01}));mid.scale.set(1.16,.055,1.43);mid.position.set(0,-.50,.24);shoe.add(mid);
 const outsole=new THREE.Mesh(new THREE.SphereGeometry(.70,50,32),soleMat);outsole.scale.set(1.16,.10,1.42);outsole.position.set(0,-.60,.27);shoe.add(outsole);
 const limeEdge=new THREE.Mesh(new THREE.TorusGeometry(.55,.032,10,64),limeMat);limeEdge.rotation.x=Math.PI/2;limeEdge.scale.set(1.08,1.26,1);limeEdge.position.set(0,-.61,.24);shoe.add(limeEdge);
 g.add(shoe);g.position.set(x,-2.66,.12);g.userData.shoe=shoe;return g}
const legL=makeLeg(-.80),legR=makeLeg(.80);core.add(legL,legR);
const soleIconTex=(()=>{const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');x.fillStyle='#050605';x.fillRect(0,0,512,512);x.strokeStyle='#242824';x.lineWidth=7;for(let y=38;y<500;y+=31){x.beginPath();x.moveTo(16,y);x.lineTo(496,y);x.stroke()}x.fillStyle='#d8ff1e';x.beginPath();x.arc(326,260,67,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(320,218);x.lineTo(92,158);x.lineTo(252,247);x.closePath();x.fill();x.beginPath();x.moveTo(320,292);x.lineTo(112,345);x.lineTo(255,271);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
function attachSoleDecal(leg){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.16,1.60),new THREE.MeshStandardMaterial({map:soleIconTex,roughness:.55,metalness:.01}));m.rotation.x=Math.PI/2;m.position.set(0,-.708,.30);m.renderOrder=3;leg.userData.shoe.add(m);leg.userData.soleDecal=m;return m}const soleDecalL=attachSoleDecal(legL),soleDecalR=attachSoleDecal(legR);
