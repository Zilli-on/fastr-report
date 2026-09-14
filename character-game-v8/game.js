// OG FASTR · RUN THE COMET — browser game layer
// Reuses the clean v7 printable character, but gameplay/VFX/world are fully separate.

grid.visible=false;
floor.visible=false;
controls.enabled=false;
afterPass.enabled=false;
bloomPass.threshold=.72;
bloomPass.strength=.88;
bloomPass.radius=.55;
renderer.toneMappingExposure=1.02;

const GAME_LIME=0xd8ff1e;
const BASE_Y=-.72;
const LANES=[-4.1,0,4.1];
character.scale.setScalar(.68);
character.position.set(0,BASE_Y,0);
core.rotation.set(0,0,0);

camera.fov=46;camera.updateProjectionMatrix();
camera.position.set(0,3.5,12.8);camera.lookAt(0,-.15,-18);

// ---------- world ----------
const world=new THREE.Group();scene.add(world);
const roadMat=new THREE.MeshStandardMaterial({color:0x050705,roughness:.84,metalness:.18});
const edgeMat=new THREE.MeshStandardMaterial({color:0x101410,roughness:.55,metalness:.35});
const glowLineMat=new THREE.MeshBasicMaterial({color:GAME_LIME,toneMapped:false});
const whiteLineMat=new THREE.MeshBasicMaterial({color:0xdde4d8,toneMapped:false,transparent:true,opacity:.25});

const roadSegments=[];
for(let i=0;i<18;i++){
  const g=new THREE.Group();
  const slab=new THREE.Mesh(new THREE.BoxGeometry(15,.18,8),roadMat);slab.position.y=-3.08;g.add(slab);
  for(const x of [-6.85,6.85]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.12,.08,7.4),glowLineMat);rail.position.set(x,-2.93,0);g.add(rail)}
  for(const x of [-2.05,2.05]){const line=new THREE.Mesh(new THREE.BoxGeometry(.035,.025,2.1),whiteLineMat);line.position.set(x,-2.94,-1.6);g.add(line);const line2=line.clone();line2.position.z=2;g.add(line2)}
  g.position.z=-i*8;world.add(g);roadSegments.push(g);
}

// side architecture, deliberately abstract and fast so the character remains the hero.
const skyline=[];
for(let i=0;i<36;i++){
  const h=2.5+Math.random()*9,w=.7+Math.random()*1.7,d=1.1+Math.random()*2.5;
  const mat=new THREE.MeshStandardMaterial({color:0x080b08,roughness:.66,metalness:.2,emissive:i%5===0?0x111a08:0x000000,emissiveIntensity:.3});
  const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
  const side=i%2?1:-1;b.position.set(side*(8.2+Math.random()*5),-3+h/2,-i*5-Math.random()*4);world.add(b);skyline.push(b);
  if(i%3===0){const stripe=new THREE.Mesh(new THREE.BoxGeometry(.035,h*.72,d*1.01),glowLineMat);stripe.position.set(side*(8.2+Math.random()*5),-3+h/2,b.position.z-.02);world.add(stripe);skyline.push(stripe)}
}

// star tunnel
const starGeo=new THREE.BufferGeometry();const starN=500;const starPos=new Float32Array(starN*3);
for(let i=0;i<starN;i++){starPos[i*3]=(Math.random()-.5)*45;starPos[i*3+1]=-1+Math.random()*22;starPos[i*3+2]=-Math.random()*160}
starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));
const starField=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xb9ff48,size:.035,transparent:true,opacity:.42,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(starField);

// ---------- game tail ----------
const gameVfx=new THREE.Group();scene.add(gameVfx);
function makeTrail(color,width,y,zBias,phase){
  const geo=new THREE.PlaneGeometry(1,1,70,1);const p=geo.attributes.position;
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),u=(x+.5);p.setXYZ(i,-u*8.0, p.getY(i)*width*(1-u*.76), -u*4.6+zBias);
  }p.needsUpdate=true;
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false,uniforms:{uTime:{value:phase},uColor:{value:new THREE.Color(color)},uAlpha:{value:.7}},vertexShader:`varying vec2 vUv;uniform float uTime;void main(){vUv=uv;vec3 p=position;p.y+=sin(uv.x*18.0-uTime*4.0)*.11*(1.0-uv.x)+sin(uv.x*43.0-uTime*8.0)*.025;p.z+=cos(uv.x*12.0-uTime*3.0)*.08;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`varying vec2 vUv;uniform vec3 uColor;uniform float uAlpha;uniform float uTime;void main(){float c=1.-smoothstep(.12,.5,abs(vUv.y-.5));float fade=smoothstep(.0,.06,vUv.x)*(1.-smoothstep(.62,1.,vUv.x));float pulse=.72+.28*sin(vUv.x*24.-uTime*7.);gl_FragColor=vec4(mix(uColor,vec3(1.),c*.42),c*fade*pulse*uAlpha);}`});
  const mesh=new THREE.Mesh(geo,mat);mesh.rotation.y=-.42;mesh.position.set(-1.1,y,2.2);gameVfx.add(mesh);return mesh;
}
const trails=[makeTrail(GAME_LIME,1.25,.5,0,0),makeTrail(0xffffff,.46,.72,.1,.6),makeTrail(0xaaff00,.78,.1,-.15,1.1),makeTrail(0xffffff,.18,1.15,.05,1.8)];
const aura=new THREE.PointLight(GAME_LIME,34,11,2);scene.add(aura);

// ---------- gameplay entities ----------
const obstacles=[],orbs=[],sparks=[];
const obstacleMat=new THREE.MeshStandardMaterial({color:0x0d100d,roughness:.48,metalness:.42});
function spawnObstacle(lane,z=-96,type='block'){
  const g=new THREE.Group();
  const box=new THREE.Mesh(new THREE.BoxGeometry(2.5,type==='high'?4.2:2.35,1.55),obstacleMat);box.position.y=type==='high'?-1.0:-1.9;box.castShadow=true;g.add(box);
  const rim1=new THREE.Mesh(new THREE.BoxGeometry(2.64,.07,1.62),glowLineMat);rim1.position.y=box.position.y+(type==='high'?2.1:1.18);g.add(rim1);
  const rim2=rim1.clone();rim2.position.y=box.position.y-(type==='high'?2.1:1.18);g.add(rim2);
  g.position.set(LANES[lane],0,z);world.add(g);obstacles.push({g,lane,type,hit:false});return g;
}
function spawnOrb(lane,z=-92,y=-.8){
  const g=new THREE.Group();const coreOrb=new THREE.Mesh(new THREE.SphereGeometry(.43,24,18),new THREE.MeshBasicMaterial({color:GAME_LIME,toneMapped:false}));g.add(coreOrb);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.72,.045,8,36),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false,transparent:true,opacity:.82}));ring.rotation.x=Math.PI/2;g.add(ring);
  const light=new THREE.PointLight(GAME_LIME,9,5,2);g.add(light);g.position.set(LANES[lane],y,z);world.add(g);orbs.push({g,lane,collected:false});return g;
}
function burst(x,y,z){for(let i=0;i<12;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.035,5,4),new THREE.MeshBasicMaterial({color:i%3?GAME_LIME:0xffffff,toneMapped:false}));m.position.set(x,y,z);m.userData.v=new THREE.Vector3((Math.random()-.5)*5,(Math.random()-.2)*4,(Math.random()-.5)*3);m.userData.life=1;scene.add(m);sparks.push(m)}}

// ---------- state ----------
let playing=false,dead=false,lane=1,targetX=LANES[1],velocityY=0,jumpY=0;
let baseSpeed=18,speed=18,distance=0,score=0,combo=1,bestCombo=1,boost=25,spawnTimer=.5,orbTimer=.25,runTime=0;
const keys={};
const $=id=>document.getElementById(id);
function updateHUD(){ $('score').textContent=Math.floor(score).toString().padStart(6,'0');$('distance').textContent=Math.floor(distance);$('combo').textContent='×'+combo;$('boostPct').textContent=Math.floor(boost)+'%';$('boostFill').style.width=boost+'%'}
function resetGame(){
  obstacles.forEach(o=>world.remove(o.g));orbs.forEach(o=>world.remove(o.g));obstacles.length=0;orbs.length=0;sparks.forEach(s=>scene.remove(s));sparks.length=0;
  lane=1;targetX=0;character.position.set(0,BASE_Y,0);velocityY=0;jumpY=0;baseSpeed=18;speed=18;distance=0;score=0;combo=1;bestCombo=1;boost=25;spawnTimer=.65;orbTimer=.3;runTime=0;dead=false;updateHUD();
}
function startGame(){resetGame();playing=true;$('startScreen').classList.remove('show');$('gameOver').classList.remove('show');$('hud').classList.remove('hidden')}
function endGame(){if(dead)return;dead=true;playing=false;$('endScore').textContent=Math.floor(score);$('endDistance').textContent=Math.floor(distance)+' M';$('endCombo').textContent='×'+bestCombo;$('gameOver').classList.add('show');$('hud').classList.add('hidden');burst(character.position.x,-.7,0)}
function moveLane(dir){if(!playing)return;lane=THREE.MathUtils.clamp(lane+dir,0,2);targetX=LANES[lane]}
function jump(){if(!playing||jumpY>.05)return;velocityY=9.7}
function isBoosting(){return playing&&(keys.ShiftLeft||keys.ShiftRight||window._touchBoost)&&boost>1}

$('startBtn').onclick=startGame;$('restartBtn').onclick=startGame;
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='ArrowLeft'||e.code==='KeyA')moveLane(-1);if(e.code==='ArrowRight'||e.code==='KeyD')moveLane(1);if(e.code==='Space'){e.preventDefault();jump()}if(!playing&&e.code==='Enter')startGame()});addEventListener('keyup',e=>keys[e.code]=false);

document.querySelectorAll('[data-act]').forEach(btn=>{const a=btn.dataset.act;btn.addEventListener('pointerdown',e=>{e.preventDefault();if(a==='left')moveLane(-1);if(a==='right')moveLane(1);if(a==='jump')jump();if(a==='boost')window._touchBoost=true});btn.addEventListener('pointerup',()=>{if(a==='boost')window._touchBoost=false});btn.addEventListener('pointercancel',()=>{if(a==='boost')window._touchBoost=false})});
let sx=0,sy=0;addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});addEventListener('pointerup',e=>{if(!playing)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))moveLane(dx>0?1:-1);else if(dy<-55)jump()});

// demo/autoplay mode for review screenshots
const demo=new URLSearchParams(location.search).get('demo')==='1';if(demo)setTimeout(startGame,900);

function spawnPattern(){
  const safe=Math.floor(Math.random()*3);for(let l=0;l<3;l++)if(l!==safe&&Math.random()>.18)spawnObstacle(l,-96-(Math.random()*6),Math.random()>.82?'high':'block');
  for(let k=0;k<4;k++)spawnOrb(safe,-88-k*4,-.7+(k%2)*.25);
}

const clockGame=new THREE.Clock();
function animateGame(){requestAnimationFrame(animateGame);const dt=Math.min(clockGame.getDelta(),.033);const t=clockGame.elapsedTime;
  // character presentation even before the game starts
  const boosting=isBoosting();
  character.position.x=THREE.MathUtils.lerp(character.position.x,targetX,1-Math.pow(.0005,dt));
  if(playing){
    runTime+=dt;baseSpeed=Math.min(31,18+distance*.0038);speed=baseSpeed*(boosting?1.55:1);
    if(boosting){boost=Math.max(0,boost-dt*18);score+=dt*speed*4}else boost=Math.min(100,boost+dt*1.3);
    velocityY-=25*dt;jumpY=Math.max(0,jumpY+velocityY*dt);if(jumpY<=0&&velocityY<0){jumpY=0;velocityY=0}
    character.position.y=BASE_Y+jumpY;
    distance+=speed*dt;score+=speed*dt*(1+.15*(combo-1));
    spawnTimer-=dt;orbTimer-=dt;if(spawnTimer<=0){spawnPattern();spawnTimer=Math.max(.72,1.42-distance*.00025)}
    // road and world flow
    roadSegments.forEach(seg=>{seg.position.z+=speed*dt;if(seg.position.z>8)seg.position.z-=roadSegments.length*8});
    skyline.forEach(o=>{o.position.z+=speed*dt*.68;if(o.position.z>12)o.position.z-=180});
    const sp=starField.geometry.attributes.position.array;for(let i=0;i<starN;i++){sp[i*3+2]+=speed*dt*.22;if(sp[i*3+2]>10)sp[i*3+2]-=170}starField.geometry.attributes.position.needsUpdate=true;
    obstacles.forEach(o=>{o.g.position.z+=speed*dt;if(!o.hit&&Math.abs(o.g.position.z)<1.0&&Math.abs(o.g.position.x-character.position.x)<1.75){const clear=o.type==='block'?jumpY>1.55:jumpY>.2;if(!clear){if(boosting){o.hit=true;burst(o.g.position.x,-1.1,o.g.position.z);world.remove(o.g);score+=800;combo++;bestCombo=Math.max(bestCombo,combo)}else endGame()}}});
    orbs.forEach(o=>{o.g.position.z+=speed*dt;o.g.rotation.y+=dt*3.5;o.g.rotation.x+=dt*.8;if(!o.collected&&Math.abs(o.g.position.z)<1.1&&Math.abs(o.g.position.x-character.position.x)<1.55&&Math.abs((-0.7)-jumpY)<2.4){o.collected=true;world.remove(o.g);boost=Math.min(100,boost+14);combo++;bestCombo=Math.max(bestCombo,combo);score+=250*combo;burst(o.g.position.x,o.g.position.y,o.g.position.z)}});
    for(let i=obstacles.length-1;i>=0;i--)if(obstacles[i].g.position.z>15){world.remove(obstacles[i].g);obstacles.splice(i,1);combo=Math.max(1,combo-1)}
    for(let i=orbs.length-1;i>=0;i--)if(orbs[i].g.position.z>15||orbs[i].collected)orbs.splice(i,1);
    updateHUD();
  }else{
    character.position.y=BASE_Y+Math.sin(t*2.1)*.035;
  }
  // run pose
  const gait=Math.sin(t*(boosting?16:playing?11:3.2));
  core.position.y=Math.abs(gait)*(playing?.045:.018);core.rotation.z=THREE.MathUtils.lerp(core.rotation.z,playing?-.035:Math.sin(t)*.006,.12);
  armL.rotation.x=gait*(playing?.56:.08);armR.rotation.x=-gait*(playing?.56:.08);legL.rotation.x=-gait*(playing?.62:.04);legR.rotation.x=gait*(playing?.62:.04);
  if(jumpY>.05){legL.rotation.x=-.48;legR.rotation.x=.44;armL.rotation.x=.7;armR.rotation.x=-.7}
  // VFX follows character, reacts to boost
  gameVfx.position.set(character.position.x,character.position.y+.35,0);aura.position.set(character.position.x,character.position.y+.25,1.4);aura.intensity=boosting?76:playing?34:21;
  trails.forEach((tr,i)=>{tr.material.uniforms.uTime.value=t+i*.37;tr.material.uniforms.uAlpha.value=(boosting?1.25:playing?.72:.38)*(i===1||i===3?1.15:1);tr.scale.x=boosting?1.35:1;tr.position.y+=Math.sin(t*2.5+i)*.0008});
  for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.userData.life-=dt;s.position.addScaledVector(s.userData.v,dt);s.userData.v.y-=7*dt;s.scale.setScalar(Math.max(.01,s.userData.life));if(s.userData.life<=0){scene.remove(s);sparks.splice(i,1)}}
  // camera leans into lane changes and boost
  const camX=character.position.x*.32;camera.position.x=THREE.MathUtils.lerp(camera.position.x,camX,.06);camera.position.z=THREE.MathUtils.lerp(camera.position.z,boosting?11.6:12.8,.045);camera.position.y=THREE.MathUtils.lerp(camera.position.y,3.45+jumpY*.08,.04);camera.lookAt(character.position.x*.12,-.3+jumpY*.05,-17);
  composer.render(dt);
}

setTimeout(()=>loading.classList.add('hide'),650);animateGame();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});