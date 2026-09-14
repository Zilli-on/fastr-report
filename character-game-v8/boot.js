import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
Object.assign(globalThis,{THREE,OrbitControls,GLTFExporter,EffectComposer,RenderPass,UnrealBloomPass,AfterimagePass,RoomEnvironment});

const urls=['../character-lab-v7/part1.js','../character-lab-v7/part2.js','./game.js','./polish.js'];
const chunks=await Promise.all(urls.map(async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`Failed to load ${u}: ${r.status}`);return await r.text();}));
new Function(chunks.join('\n\n'))();