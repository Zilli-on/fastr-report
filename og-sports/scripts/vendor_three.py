"""Vendor the minimal three.js r170 module graph, with its MIT licence.

Only import specifiers are changed to relative self-hosted URLs.
"""
import gzip
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://raw.githubusercontent.com/mrdoob/three.js/r170/'
FILES = {
    'build/three.module.min.js': 'three.module.min.js',
    'examples/jsm/loaders/GLTFLoader.js': 'GLTFLoader.js',
    'examples/jsm/utils/BufferGeometryUtils.js': 'BufferGeometryUtils.js',
    'examples/jsm/environments/RoomEnvironment.js': 'RoomEnvironment.js',
    'LICENSE': 'LICENSE.txt',
}
out = ROOT / 'site/vendor/three-r170'
out.mkdir(parents=True, exist_ok=True)
report = {'version': '0.170.0', 'files': []}
for source, name in FILES.items():
    raw = urlopen(BASE + source).read()
    data = raw.decode().replace("from 'three'", "from './three.module.min.js'").replace("'../utils/BufferGeometryUtils.js'", "'./BufferGeometryUtils.js'").encode()
    (out / name).write_bytes(data)
    report['files'].append(dict(file=name, source=BASE + source, upstream_sha256=hashlib.sha256(raw).hexdigest(),
                               sha256=hashlib.sha256(data).hexdigest(), bytes=len(data), gzip_bytes=len(gzip.compress(data, mtime=0))))
(ROOT / 'docs/three-vendor.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps(report, indent=2))
