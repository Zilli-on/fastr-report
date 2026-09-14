// ---------- CANONICAL FACE / COLLECTIBLE DETAILS ----------
function eyeSurfaceTexture(letter,side){
 const c=document.createElement('canvas');c.width=c.height=1024;const x=c.getContext('2d');x.clearRect(0,0,1024,1024);
 x.fillStyle='#f1f0e8';x.beginPath();x.ellipse(512,512,472,486,0,0,Math.PI*2);x.fill();
 const ix=side==='L'?552:474,iy=520,ir=438,g=x.createRadialGradient(ix-118,iy-135,12,ix,iy,ir);g.addColorStop(0,'#f7ffd8');g.addColorStop(.18,'#e8ff73');g.addColorStop(.50,'#d8ff1e');g.addColorStop(.80,'#98cc00');g.addColorStop(1,'#3d5a00');x.fillStyle=g;x.beginPath();x.arc(ix,iy,ir,0,Math.PI*2);x.fill();x.lineWidth=22;x.strokeStyle='#1a2408';x.stroke();
 x.fillStyle='#010201';
 if(letter==='O'){x.beginPath();x.ellipse(ix+16,iy+34,226,286,-.07,0,Math.PI*2);x.fill();}
 else{x.font='900 500px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('G',ix+12,iy+36);}
 x.fillStyle='rgba(255,255,255,.98)';x.beginPath();x.ellipse(272,252,58,88,-.48,0,Math.PI*2);x.fill();
 x.fillStyle='rgba(255,255,255,.56)';x.beginPath();x.ellipse(350,210,22,33,-.42,0,Math.PI*2);x.fill();
 x.save();x.translate(700,274);x.rotate(Math.PI/4);x.fillRect(-7,-44,14,88);x.fillRect(-44,-7,88,14);x.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const texO=eyeSurfaceTexture('O','L'),texG=eyeSurfaceTexture('G','R');
function makeEye(x,tex,tilt){
 const g=new THREE.Group();
 const socket=new THREE.Mesh(new THREE.SphereGeometry(.84,88,58),rockMat);socket.scale.set(1.00,1.13,.255);socket.position.z=.005;g.add(socket);
 const inner=new THREE.Mesh(new THREE.SphereGeometry(.735,80,52),rockDark);inner.scale.set(.985,1.075,.20);inner.position.z=.118;g.add(inner);
 const eye=new THREE.Mesh(new THREE.CircleGeometry(.662,112),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));eye.position.z=.266;eye.scale.set(.94,1.085,1);g.add(eye);
 const lens=new THREE.Mesh(new THREE.SphereGeometry(.675,72,48),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.032,roughness:.01,transmission:.07,clearcoat:1,clearcoatRoughness:.008,depthWrite:false}));lens.scale.set(.94,1.085,.115);lens.position.z=.304;g.add(lens);
 g.position.set(x,.49,2.30);g.rotation.z=tilt;g.rotation.y=x<0?.014:-.014;return g;
}
const eyeL=makeEye(-.80,texO,-.040),eyeR=makeEye(.80,texG,.040);core.add(eyeL,eyeR);const browL=new THREE.Group(),browR=new THREE.Group();core.add(browL,browR);

// ---------- DEEPER, SMALLER FASTR SMILE ----------
function curvedPanelGeometry(w,h,seg=96){const g=new THREE.PlaneGeometry(w,h,seg,8),a=g.attributes.position;for(let i=0;i<a.count;i++){const xx=a.getX(i),yy=a.getY(i),q=xx/(w*.5);a.setXYZ(i,xx,yy-.076*q*q,.105*(1-q*q)-.055*q*q)}a.needsUpdate=true;g.computeVertexNormals();return g}
function lipTexture(){const c=document.createElement('canvas');c.width=1600;c.height=760;const x=c.getContext('2d');x.clearRect(0,0,1600,760);x.beginPath();x.moveTo(180,220);x.bezierCurveTo(420,252,610,270,800,270);x.bezierCurveTo(990,270,1180,252,1420,220);x.bezierCurveTo(1328,468,1092,570,800,596);x.bezierCurveTo(508,570,272,468,180,220);x.closePath();x.fillStyle='#181b18';x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function mouthTexture(){
 const c=document.createElement('canvas');c.width=1600;c.height=760;const x=c.getContext('2d');x.clearRect(0,0,1600,760);
 x.beginPath();x.moveTo(218,244);x.bezierCurveTo(438,270,620,286,800,286);x.bezierCurveTo(980,286,1162,270,1382,244);x.bezierCurveTo(1295,438,1085,520,800,542);x.bezierCurveTo(515,520,305,438,218,244);x.closePath();
 const bg=x.createLinearGradient(0,220,0,565);bg.addColorStop(0,'#010201');bg.addColorStop(.68,'#030503');bg.addColorStop(1,'#111905');x.fillStyle=bg;x.fill();
 const lg=x.createLinearGradient(0,440,0,565);lg.addColorStop(0,'rgba(216,255,30,0)');lg.addColorStop(.70,'rgba(216,255,30,.12)');lg.addColorStop(1,'rgba(216,255,30,.48)');x.fillStyle=lg;x.beginPath();x.moveTo(340,446);x.quadraticCurveTo(800,548,1260,446);x.quadraticCurveTo(1080,515,800,540);x.quadraticCurveTo(520,515,340,446);x.fill();
 x.font='900 italic 176px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';const fg=x.createLinearGradient(0,300,0,455);fg.addColorStop(0,'#ffffff');fg.addColorStop(.52,'#e9eae4');fg.addColorStop(.84,'#aeb3ad');fg.addColorStop(1,'#747a74');x.strokeStyle='#050705';x.lineWidth=11;x.strokeText('FASTR',792,386);x.fillStyle=fg;x.fillText('FASTR',792,386);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const mouthBack=new THREE.Group();core.add(mouthBack);const mouthLip=new THREE.Mesh(curvedPanelGeometry(2.48,.94),new THREE.MeshBasicMaterial({map:lipTexture(),transparent:true,toneMapped:false,alphaTest:.02,side:THREE.DoubleSide}));mouthLip.position.set(0,-1.04,2.31);mouthBack.add(mouthLip);const mouthPlane=new THREE.Mesh(curvedPanelGeometry(2.28,.78),new THREE.MeshBasicMaterial({map:mouthTexture(),transparent:true,toneMapped:false,alphaTest:.02,side:THREE.DoubleSide}));mouthPlane.position.set(0,-1.04,2.345);mouthBack.add(mouthPlane);const smilePlane=mouthPlane,mouthCavity=mouthLip;const smileGlow=new THREE.PointLight(LIME,.06,1.35,2);smileGlow.position.set(0,-1.31,2.0);core.add(smileGlow);

// ---------- CRISP, DELIBERATE CRATER INTERIORS ----------
const craterOverlay=new THREE.Group();craterOverlay.name='CRATER_INTERIORS';core.add(craterOverlay);
function addCrater(nx,ny,nz,r,oval=1){const n=new THREE.Vector3(nx,ny,nz).normalize(),surf=new THREE.Vector3(n.x*2.60*1.044,n.y*2.60*1.025,n.z*2.60*.961),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),n),g=new THREE.Group();g.position.copy(surf);g.quaternion.copy(q);g.scale.y=oval;const pit=new THREE.Mesh(new THREE.CircleGeometry(r,58),new THREE.MeshStandardMaterial({color:0x010201,roughness:1,metalness:0}));pit.position.z=-.010;g.add(pit);craterOverlay.add(g)}
[[-.50,.84,.54,.25,.86],[.10,.95,.30,.20,.92],[.56,.77,.39,.17,.86],[-.83,.52,.35,.15,.98],[.87,.47,.29,.16,.92],[-.91,.18,.36,.12,1.04],[.92,.14,.31,.11,.90],[-.78,-.24,.38,.095,.95],[.82,-.31,.31,.10,.96],[-.50,-.69,.41,.095,.90],[.55,-.66,.39,.10,.88],[-.20,.76,.62,.082,.92],[.32,.66,.67,.075,.88]].forEach(a=>addCrater(...a));

// ---------- COMPACT TOY LIMBS / SHOES ----------
function pillArm(x){const g=new THREE.Group(),arm=new THREE.Mesh(new THREE.SphereGeometry(.45,46,36),rubberMat);arm.scale.set(.76,1.18,.90);arm.castShadow=true;g.add(arm);g.position.set(x,-.50,.60);g.rotation.z=x<0?.10:-.10;return g}const armL=pillArm(-2.66),armR=pillArm(2.66);core.add(armL,armR);
function makeLeg(x){const g=new THREE.Group(),leg=new THREE.Mesh(new THREE.CapsuleGeometry(.21,.24,12,22),rubberMat);leg.position.y=.25;g.add(leg);const ankle=new THREE.Mesh(new THREE.TorusGeometry(.30,.045,10,42),limeMat);ankle.rotation.x=Math.PI/2;ankle.position.y=.02;g.add(ankle);const shoe=new THREE.Group();const upper=new THREE.Mesh(new THREE.SphereGeometry(.66,56,40),rubberMat);upper.scale.set(1.16,.58,1.38);upper.position.z=.16;shoe.add(upper);const toe=new THREE.Mesh(new THREE.SphereGeometry(.55,48,34),new THREE.MeshStandardMaterial({color:0x101311,roughness:.66,metalness:.01,envMapIntensity:.15}));toe.scale.set(1.12,.40,.98);toe.position.set(0,-.11,.69);shoe.add(toe);const outsole=new THREE.Mesh(new THREE.SphereGeometry(.67,50,32),soleMat);outsole.scale.set(1.13,.105,1.37);outsole.position.set(0,-.56,.25);shoe.add(outsole);const limeEdge=new THREE.Mesh(new THREE.TorusGeometry(.51,.022,10,64),limeMat);limeEdge.rotation.x=Math.PI/2;limeEdge.scale.set(1.06,1.20,1);limeEdge.position.set(0,-.545,.22);shoe.add(limeEdge);g.add(shoe);g.position.set(x,-2.64,.12);g.userData.shoe=shoe;return g}const legL=makeLeg(-.80),legR=makeLeg(.80);core.add(legL,legR);
const soleIconTex=(()=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#050605';x.fillRect(0,0,512,512);x.strokeStyle='#242824';x.lineWidth=7;for(let y=38;y<500;y+=31){x.beginPath();x.moveTo(16,y);x.lineTo(496,y);x.stroke()}x.fillStyle='#d8ff1e';x.beginPath();x.arc(326,260,67,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(320,218);x.lineTo(92,158);x.lineTo(252,247);x.closePath();x.fill();x.beginPath();x.moveTo(320,292);x.lineTo(112,345);x.lineTo(255,271);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();function attachSoleDecal(leg){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.10,1.52),new THREE.MeshStandardMaterial({map:soleIconTex,roughness:.58,metalness:.01}));m.rotation.x=Math.PI/2;m.position.set(0,-.676,.29);m.renderOrder=3;leg.userData.shoe.add(m);leg.userData.soleDecal=m;return m}const soleDecalL=attachSoleDecal(legL),soleDecalR=attachSoleDecal(legR);