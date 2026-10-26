import * as THREE from './vendor/three-r170/three.module.min.js';
import { GLTFLoader } from './vendor/three-r170/GLTFLoader.js';
import { RoomEnvironment } from './vendor/three-r170/RoomEnvironment.js';

const clamp = THREE.MathUtils.clamp;
const ease = (a, b, p) => THREE.MathUtils.smoothstep(p, a, b);

export async function mountStick(chapter, reduced) {
  const track = chapter.querySelector('.stick-track');
  const viewport = chapter.querySelector('.stick-viewport');
  const canvas = chapter.querySelector('canvas');
  const labels = [...chapter.querySelectorAll('[data-part]')];
  const controls = [...chapter.querySelectorAll('[data-stick-phase]')];
  let renderer, environment, model, printTexture, ground, resizeObserver, visibilityObserver;
  let frame = 0, visible = false, dead = false, drag = null, yaw = 0, pitch = 0;
  let progress = 0, frames = 0;
  const listeners = [];
  const listen = (node, type, fn, options) => {
    node.addEventListener(type, fn, options);
    listeners.push(() => node.removeEventListener(type, fn, options));
  };
  const stop = () => { cancelAnimationFrame(frame); frame = 0; };
  const dispose = () => {
    if (dead) return;
    dead = true;
    stop();
    resizeObserver?.disconnect();
    visibilityObserver?.disconnect();
    listeners.forEach(off => off());
    model?.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
    printTexture?.dispose();
    ground?.geometry.dispose();
    ground?.material.dispose();
    environment?.dispose();
    renderer?.dispose();
    chapter.classList.remove('is-ready');
    chapter.dataset.viewer = 'fallback';
    chapter.querySelectorAll('.stick-step').forEach(el => { el.hidden = false; });
  };
  try {
    if (reduced.matches) return dispose;
    // Probe before constructing the renderer: no console error when WebGL is absent.
    const context = canvas.getContext('webgl2', { antialias: true, alpha: true });
    if (!context) throw new Error('WebGL unavailable');
    renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, .001, 4);
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    scene.environmentIntensity = .7;
    room.dispose();
    pmrem.dispose();
    const key = new THREE.DirectionalLight(0xfff8e9, 3.5);
    key.position.set(-.18, .65, .2);
    key.castShadow = true;
    Object.assign(key.shadow.camera, { left: -.3, right: .3, top: .4, bottom: -.3, near: .01, far: 1.5 });
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -.00015;
    key.shadow.normalBias = .0003;
    key.shadow.radius = 4;
    key.shadow.blurSamples = 8;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe9edff, 1.5);
    fill.position.set(.2, .12, -.2);
    scene.add(fill);
    ground = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShadowMaterial({ opacity: .14 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -.088;
    ground.receiveShadow = true;
    scene.add(ground);
    const gltf = await new GLTFLoader().loadAsync(new URL('./assets/stick.glb', import.meta.url).href);
    model = gltf.scene;
    if (dead || reduced.matches) { dispose(); return dispose; }
    const pivot = new THREE.Group();
    scene.add(pivot);
    pivot.add(model);
    model.position.y = -.07;
    const parts = Object.fromEntries(['Gehaeuse', 'Schraubkappe', 'Drehfuss', 'Spindel', 'Hubteller'].map(name => {
      const part = model.getObjectByName(name);
      if (!part?.isMesh) throw new Error('Incomplete model');
      part.castShadow = true;
      part.receiveShadow = true;
      return [name, part];
    }));
    // Reuse the original brand contours as a print on the real housing mesh.
    // body.svg is a technical wireframe, not a packaging graphic.
    const logo = new Image();
    logo.src = new URL('./assets/og-fastr-wordmark-dark.svg', import.meta.url).href;
    await logo.decode();
    if (dead || reduced.matches) { dispose(); return dispose; }
    const print = document.createElement('canvas');
    print.width = print.height = 1024;
    const ink = print.getContext('2d');
    ink.translate(512, 512);
    ink.rotate(-Math.PI / 2);
    ink.drawImage(logo, -330, -61, 660, 122);
    ink.setTransform(1, 0, 0, 1, 0, 0);
    ink.globalCompositeOperation = 'source-in';
    ink.fillStyle = '#171b1c';
    ink.fillRect(0, 0, 1024, 1024);
    ink.globalCompositeOperation = 'destination-over';
    ink.fillStyle = '#e3ff23';
    ink.fillRect(0, 0, 1024, 1024);
    printTexture = new THREE.CanvasTexture(print);
    printTexture.colorSpace = THREE.SRGBColorSpace;
    printTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    const geometry = parts.Gehaeuse.geometry;
    const positions = geometry.attributes.position;
    const uv = new Float32Array(positions.count * 2);
    for (let i = 0; i < positions.count; i++) {
      uv[2*i] = Math.atan2(positions.getX(i), positions.getZ(i)) / (2 * Math.PI) + .5;
      uv[2*i+1] = (positions.getY(i) * .256 - .0116) / .1068;
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    parts.Gehaeuse.material.map = printTexture;
    parts.Gehaeuse.material.color.set('#ffffff');
    parts.Gehaeuse.material.needsUpdate = true;
    // A section plane exposes the real internals during the functional phase.
    const section = new THREE.Plane(new THREE.Vector3(0, 0, -1), .002);
    const sectionNormal = new THREE.Vector3();
    const anchors = { Schraubkappe: .13, Gehaeuse: .075, Hubteller: .03, Spindel: .067, Drehfuss: .006 };
    const exploded = { Schraubkappe: .145, Gehaeuse: -.025, Hubteller: .18, Spindel: -.14, Drehfuss: -.165 };
    const position = new THREE.Vector3();
    const size = () => {
      const { width, height } = viewport.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      requestRender();
    };
    function requestRender() {
      if (!frame && visible && !document.hidden && !dead && !reduced.matches) {
        frame = requestAnimationFrame(() => {
          try { render(); } catch (error) { chapter.dataset.viewerError = error.message; dispose(); }
        });
      }
    }
    function render() {
      frame = 0;
      if (!visible || document.hidden || dead || reduced.matches) return;
      const rect = track.getBoundingClientRect();
      const stickyTop = innerWidth < 768 ? 12 : 24;
      progress = clamp((stickyTop - rect.top) / Math.max(1, rect.height - chapter.querySelector('.stick-stage').offsetHeight), 0, 1);
      const explosion = ease(.23, .45, progress) * (1 - ease(.58, .74, progress));
      const opening = ease(.75, .83, progress);
      const lift = ease(.83, 1, progress);
      const phase = progress < .3 ? 0 : progress < .72 ? 1 : 2;
      chapter.dataset.phase = String(phase);
      chapter.dataset.progress = progress.toFixed(4);
      chapter.querySelectorAll('.stick-step').forEach((el, i) => { el.hidden = i !== phase; });
      controls.forEach((el, i) => el.setAttribute('aria-pressed', String(i === phase)));
      // All motion is scroll-driven. Holding still never creates an idle render loop.
      pivot.rotation.set(.08 + pitch, -.4 + progress * 1.25 + yaw, -.16);
      for (const [name, part] of Object.entries(parts)) {
        part.position.y = exploded[name] * explosion;
        part.rotation.y = 0;
      }
      parts.Schraubkappe.position.y += opening * .048;
      parts.Schraubkappe.rotation.y = opening * Math.PI * 3;
      parts.Drehfuss.rotation.y = lift * Math.PI * 12;
      parts.Spindel.rotation.y = lift * Math.PI * 12;
      parts.Spindel.position.y += lift * .006;
      parts.Hubteller.position.y += lift * .075;
      sectionNormal.set(0, 0, -1).applyQuaternion(pivot.quaternion);
      section.set(sectionNormal, .002);
      parts.Gehaeuse.material.clippingPlanes = opening > .1 ? [section] : [];
      parts.Gehaeuse.material.clipShadows = true;
      parts.Gehaeuse.material.side = THREE.DoubleSide;
      ground.position.y = -.088 - explosion * .165;
      ground.material.opacity = .14 * (1 - explosion);
      const distance = .39 + explosion * .72 + opening * .12;
      camera.position.set(.06, .045 + opening * .025, distance);
      camera.lookAt(0, explosion * -.015 + opening * .02, 0);
      pivot.updateMatrixWorld(true);
      renderer.render(scene, camera);
      labels.forEach(label => {
        const name = label.dataset.part;
        // Mesh node scales decode normalized integer coordinates, so anchor in
        // model space rather than multiplying by that decoding scale twice.
        position.set(0, anchors[name] + parts[name].position.y, 0);
        model.localToWorld(position).project(camera);
        const y = clamp((1 - position.y) * viewport.clientHeight / 2, 20, viewport.clientHeight - 28);
        label.style.top = `${y}px`;
        label.style.setProperty('--lead', `${Math.max(12, viewport.clientWidth * .12)}px`);
        label.hidden = explosion < .7;
      });
      chapter.dataset.frames = String(++frames);
      chapter.dataset.viewer = 'ready';
    }
    chapter.classList.add('is-ready');
    chapter.dataset.viewer = 'loading';
    resizeObserver = new ResizeObserver(size);
    resizeObserver.observe(viewport);
    visibilityObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) requestRender(); else stop();
    });
    visibilityObserver.observe(viewport);
    listen(window, 'scroll', requestRender, { passive: true });
    listen(document, 'visibilitychange', () => { if (document.hidden) stop(); else requestRender(); });
    listen(canvas, 'webglcontextlost', event => { event.preventDefault(); dispose(); });
    listen(reduced, 'change', () => { if (reduced.matches) dispose(); });
    listen(canvas, 'pointerdown', event => {
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
      drag = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    });
    listen(canvas, 'pointermove', event => {
      if (!drag) return;
      yaw += (event.clientX - drag.x) * .012;
      if (event.pointerType === 'mouse') pitch = clamp(pitch + (event.clientY - drag.y) * .005, -.35, .35);
      drag = { x: event.clientX, y: event.clientY };
      requestRender();
    });
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(canvas, event, () => { drag = null; });
    listen(canvas, 'keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
      event.preventDefault();
      yaw = event.key === 'Home' ? 0 : yaw + (event.key === 'ArrowLeft' ? -.2 : .2);
      pitch = 0;
      requestRender();
    });
    controls.forEach((button, i) => listen(button, 'click', () => {
      const points = [.1, .5, .97];
      const rect = track.getBoundingClientRect();
      window.scrollTo({ top: scrollY + rect.top - (innerWidth < 768 ? 12 : 24) + points[i] * (rect.height - chapter.querySelector('.stick-stage').offsetHeight), behavior: 'instant' });
    }));
    size();
    // Dispose GPU resources when leaving the document, without breaking bfcache.
    listen(window, 'pagehide', event => { if (!event.persisted) dispose(); });
    return dispose;
  } catch (error) {
    chapter.dataset.viewerError = error.message;
    dispose();
    return dispose;
  }
}
