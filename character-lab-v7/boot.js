import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
Object.assign(globalThis,{THREE,OrbitControls,GLTFExporter,EffectComposer,RenderPass,UnrealBloomPass,AfterimagePass,RoomEnvironment});
function load(src){return new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=fail;document.body.appendChild(s);});}
await load('./part1.js'); await load('./part2.js'); await load('./part3.js');