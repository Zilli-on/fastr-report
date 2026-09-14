// ---------- FINAL HERO FINISH VFX ----------
// This layer is deliberately attached to `vfx`, never to the printable/exported `core`.

// Subtle lime Fresnel shell: only catches the outer silhouette, keeping the face/body charcoal.
const rimUniforms={uColor:{value:new THREE.Color(LIME)},uPower:{value:3.65},uIntensity:{value:.34}};
const rimMat=new THREE.ShaderMaterial({
  uniforms:rimUniforms,
  vertexShader:`varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`varying vec3 vN;varying vec3 vV;uniform vec3 uColor;uniform float uPower;uniform float uIntensity;void main(){float f=pow(clamp(1.0-abs(dot(normalize(vN),normalize(vV))),0.0,1.0),uPower);float a=f*uIntensity;gl_FragColor=vec4(uColor*(1.05+f*.85),a);}`,
  transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,toneMapped:false
});
const bodyRim=new THREE.Mesh(bodyGeo.clone(),rimMat);bodyRim.scale.set(1.018,1.018,1.018);bodyRim.name='VFX_BODY_FRESNEL';vfx.add(bodyRim);

// Soft energy socket behind the stone crest. It visually welds the printable meteor to the motion tail.
function softDiscTexture(){
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
  const g=x.createRadialGradient(128,128,2,128,128,126);g.addColorStop(0,'rgba(255,255,245,.98)');g.addColorStop(.09,'rgba(235,255,130,.86)');g.addColorStop(.26,'rgba(216,255,30,.54)');g.addColorStop(.58,'rgba(128,255,0,.16)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const attachTex=softDiscTexture();
const attachGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:attachTex,color:LIME,transparent:true,opacity:.30,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
attachGlow.position.set(1.88,1.96,-.79);attachGlow.scale.set(3.0,2.15,1);vfx.add(attachGlow);
const attachGlow2=new THREE.Sprite(new THREE.SpriteMaterial({map:attachTex,color:0xffffff,transparent:true,opacity:.18,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
attachGlow2.position.set(2.18,2.06,-1.12);attachGlow2.scale.set(1.65,1.0,1);vfx.add(attachGlow2);

// Soft dark-cosmic moving core. This is deliberately translucent and animated so it never reads as a static black shape.
const coreTailPath=[[1.32,1.45,-1.88],[2.35,2.12,-2.88],[4.05,2.82,-4.55],[6.20,3.43,-6.65],[8.55,3.85,-8.95]];
const cosmicCoreMat=new THREE.ShaderMaterial({
  uniforms:{uTime:{value:0}},
  vertexShader:`varying vec2 vUv;uniform float uTime;void main(){vUv=uv;vec3 p=position;p.y+=sin(uv.x*9.0-uTime*1.7)*(.035+.06*uv.x);p.z+=cos(uv.x*7.0-uTime*1.3)*(.025+.04*uv.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
  fragmentShader:`varying vec2 vUv;uniform float uTime;void main(){float y=abs(vUv.y-.5);float shape=1.-smoothstep(.05,.5,y);float start=smoothstep(0.,.06,vUv.x);float end=1.-smoothstep(.67,1.,vUv.x);float pulse=.72+.14*sin(vUv.x*13.-uTime*2.1);vec3 c=mix(vec3(.005,.009,.006),vec3(.07,.12,.01),(.5-y)*.65);gl_FragColor=vec4(c,shape*start*end*.34*pulse);}`,
  transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.NormalBlending,toneMapped:false
});
const cosmicCore=new THREE.Mesh(ribbonGeometry(coreTailPath.map(p=>new THREE.Vector3(...p)),1.18,150),cosmicCoreMat);cosmicCore.position.z=-.12;cosmicCore.renderOrder=-1;vfx.add(cosmicCore);

// Keep finish VFX breathing subtly rather than flashing.
const _baseAnimate=animate;
// `animate` is already running, so use a lightweight independent frame updater for these final materials.
(function finishLoop(){requestAnimationFrame(finishLoop);const t=performance.now()*.001;cosmicCoreMat.uniforms.uTime.value=t;attachGlow.material.opacity=.27+Math.sin(t*2.0)*.035;attachGlow2.material.opacity=.15+Math.sin(t*2.6+.8)*.025;rimUniforms.uIntensity.value=.30+Math.sin(t*1.7)*.025;})();
