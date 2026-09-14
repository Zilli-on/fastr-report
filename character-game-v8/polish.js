// visual fidelity polish applied after model + game construction
renderer.toneMappingExposure=.82;
bloomPass.threshold=.88;
bloomPass.strength=.42;
bloomPass.radius=.36;
key.intensity=3.6;rim.intensity=9;soft.intensity=6.5;chin.intensity=2.2;
scene.fog.density=.021;
rockMat.color.set(0x171917);rockMat.roughness=.90;rockMat.metalness=.035;
rockDark.color.set(0x050605);rubberMat.color.set(0x090b0a);rubberMat.roughness=.82;
whiteMat.color.set(0xf5f3ed);limeMat.emissiveIntensity=.24;
smileGlow.intensity=3.5;smilePlane.material.emissiveIntensity=.055;
[eyeL,eyeR].forEach(g=>g.traverse(o=>{if(!o.isMesh||!o.material)return;const m=o.material;if(m.map&&m.emissive){m.emissiveIntensity=.035;m.roughness=.14}if(m.transparent&&m.opacity<.2)m.opacity=.035;}));
character.scale.setScalar(.64);
camera.fov=51;camera.updateProjectionMatrix();

// Make the comet trail recede into the game world instead of crossing the face.
const trailWidths=[1.04,.34,.64,.14];
trails.forEach((tr,ti)=>{
  const a=tr.geometry.attributes.position,uv=tr.geometry.attributes.uv,w=trailWidths[ti];
  for(let i=0;i<a.count;i++){
    const u=uv.getX(i),v=uv.getY(i)-.5;
    const sway=Math.sin(u*Math.PI*1.2+ti*.35)*(1.35*u);
    a.setXYZ(i,sway+.28*u,v*w*(1-u*.68)+.18*u,-u*(11.5+ti*.5));
  }
  a.needsUpdate=true;tr.geometry.computeVertexNormals();tr.rotation.set(0,0,0);tr.position.set(.22,.40+ti*.12,-.75-ti*.05);
  tr.material.uniforms.uAlpha.value=ti===1||ti===3?.46:.58;
});

aura.intensity=15;aura.distance=8;
glowLineMat.color.set(0xcfff1a);
starField.material.opacity=.30;
roadMat.color.set(0x050605);
whiteLineMat.opacity=.16;

// Add thin speed streaks near the road edges for motion without blurring the mascot.
const speedStreaks=[];
for(let i=0;i<34;i++){
  const m=new THREE.Mesh(new THREE.BoxGeometry(.018,.018,1.8+Math.random()*4),new THREE.MeshBasicMaterial({color:i%4?0x506331:0xd8ff1e,transparent:true,opacity:i%4?.18:.42,toneMapped:false}));
  m.position.set((Math.random()<.5?-1:1)*(7+Math.random()*8),-1+Math.random()*8,-Math.random()*95);scene.add(m);speedStreaks.push(m);
}
const polishClock=new THREE.Clock();
(function polishLoop(){requestAnimationFrame(polishLoop);const dt=Math.min(polishClock.getDelta(),.04);const mv=playing?speed:5;speedStreaks.forEach(m=>{m.position.z+=mv*dt*1.18;if(m.position.z>14)m.position.z=-95-Math.random()*30});})();
