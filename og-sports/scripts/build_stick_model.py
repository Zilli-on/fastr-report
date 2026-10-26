"""Python 3.12 / Blender 4.5: real assembled STLs -> one quantized GLB.

python scripts/build_stick_model.py [--source PATH] [--blender PATH]
No pip packages, source copies, textures, or generated substitute geometry.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import shutil
import struct
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
PARTS = [
    ('01_gehaeuse_assembled.stl', 'Gehaeuse', 3200, '#E3FF23', .36, 0),
    ('02_schraubkappe_assembled.stl', 'Schraubkappe', 7000, '#171B1C', .28, .05),
    ('03_drehfuss_assembled.stl', 'Drehfuss', 6500, '#171B1C', .32, .05),
    ('04_spindel_assembled.stl', 'Spindel', 6500, '#989D9A', .34, .32),
    ('05_hubteller_assembled.stl', 'Hubteller', 2000, '#C2C5BF', .4, .08),
]


def build(args):
    import bpy
    import bmesh
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    blob = bytearray()
    doc = dict(asset={'version': '2.0', 'generator': 'OG SPORTS / Blender 4.5 / build_stick_model.py'},
               extensionsUsed=['KHR_mesh_quantization'], extensionsRequired=['KHR_mesh_quantization'],
               scene=0, scenes=[{'nodes': list(range(5))}], nodes=[], meshes=[], materials=[],
               buffers=[], bufferViews=[], accessors=[])
    report = {'source': str(args.source), 'blender': bpy.app.version_string, 'parts': []}

    def accessor(data, component, kind, count, bounds=None, normalized=False, target=34962):
        while len(blob) % 4:
            blob.append(0)
        view = len(doc['bufferViews'])
        doc['bufferViews'].append(dict(buffer=0, byteOffset=len(blob), byteLength=len(data), target=target))
        blob.extend(data)
        a = dict(bufferView=view, componentType=component, count=count, type=kind)
        if normalized:
            a['normalized'] = True
        if bounds:
            a.update(min=bounds[0], max=bounds[1])
        doc['accessors'].append(a)
        return len(doc['accessors']) - 1

    for index, (filename, name, budget, color, roughness, metalness) in enumerate(PARTS):
        source = args.source / filename
        bpy.ops.wm.stl_import(filepath=str(source))
        obj = bpy.context.object
        original = len(obj.data.polygons)
        bounds = [[min(v.co[i] for v in obj.data.vertices), max(v.co[i] for v in obj.data.vertices)] for i in range(3)]
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=.0001)
        bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
        bm.to_mesh(obj.data)
        bm.free()
        dec = obj.modifiers.new('Silhouette preserving reduction', 'DECIMATE')
        dec.ratio = min(1, budget / len(obj.data.polygons))
        bpy.ops.object.modifier_apply(modifier=dec.name)
        # Smooth shallow cylindrical facets, preserve shoulders and thread edges.
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        for face in bm.faces:
            face.smooth = True
        for edge in bm.edges:
            edge.smooth = edge.is_manifold and edge.calc_face_angle() < math.radians(40)
        bm.to_mesh(obj.data)
        bm.free()
        mesh = obj.data
        mesh.calc_loop_triangles()
        vertices, indices, lookup = [], [], {}
        for tri in mesh.loop_triangles:
            for loop in tri.loops:
                v = mesh.vertices[mesh.loops[loop].vertex_index].co
                n = mesh.corner_normals[loop].vector
                # STL Z-up millimetres -> glTF Y-up metres. Uniform quantization
                # keeps part pivots on the original assembly axis (no invented fit).
                p = tuple(round(x / 256 * 32767) for x in (v.x, v.z, -v.y))
                normal = tuple(max(-127, min(127, round(x * 127))) for x in (n.x, n.z, -n.y))
                key = p + normal
                if key not in lookup:
                    lookup[key] = len(vertices)
                    vertices.append(key)
                indices.append(lookup[key])
        # 8-byte position and 4-byte normal strides satisfy glTF alignment rules.
        pos = accessor(b''.join(struct.pack('<hhhxx', *v[:3]) for v in vertices), 5122, 'VEC3', len(vertices),
                       ([min(v[i] for v in vertices) for i in range(3)], [max(v[i] for v in vertices) for i in range(3)]), True)
        doc['bufferViews'][-1]['byteStride'] = 8
        nor = accessor(b''.join(struct.pack('<bbbx', *v[3:]) for v in vertices), 5120, 'VEC3', len(vertices), normalized=True)
        doc['bufferViews'][-1]['byteStride'] = 4
        ind = accessor(struct.pack('<' + 'H' * len(indices), *indices), 5123, 'SCALAR', len(indices), target=34963)
        rgb = [int(color[i:i+2], 16) / 255 for i in (1, 3, 5)]
        rgb = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055)**2.4 for c in rgb]
        doc['materials'].append(dict(name=name, pbrMetallicRoughness=dict(baseColorFactor=rgb + [1], roughnessFactor=roughness, metallicFactor=metalness)))
        doc['meshes'].append(dict(name=name, primitives=[dict(attributes={'POSITION': pos, 'NORMAL': nor}, indices=ind, material=index)]))
        doc['nodes'].append(dict(name=name, mesh=index, scale=[.256]*3))
        report['parts'].append(dict(name=name, file=filename, sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
                                    source_triangles=original, triangles=len(indices)//3, vertices=len(vertices), bounds_mm=bounds))
    while len(blob) % 4:
        blob.append(0)
    doc['buffers'] = [{'byteLength': len(blob)}]
    js = json.dumps(doc, separators=(',', ':')).encode()
    js += b' ' * (-len(js) % 4)
    glb = struct.pack('<4sII', b'glTF', 2, 28 + len(js) + len(blob)) + struct.pack('<I4s', len(js), b'JSON') + js + struct.pack('<I4s', len(blob), b'BIN\0') + blob
    if len(glb) > 600_000:
        raise RuntimeError(f'Model exceeds 600 KB: {len(glb)}')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(glb)
    report.update(bytes=len(glb), sha256=hashlib.sha256(glb).hexdigest(), quantization_max_error_mm=256/32767/2)
    (ROOT / 'docs/stick-model.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=Path('C:/Users/Fabien/fastr-stick-prototype/output/preview'))
    parser.add_argument('--output', type=Path, default=ROOT / 'site/assets/stick.glb')
    parser.add_argument('--blender', default=shutil.which('blender') or 'C:/Program Files/Blender Foundation/Blender 4.5/blender.exe')
    parser.add_argument('--inside-blender', action='store_true')
    args = parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else None)
    if args.inside_blender:
        build(args)
    else:
        subprocess.run([args.blender, '--background', '--factory-startup', '--python', str(Path(__file__).resolve()),
                        '--', '--inside-blender', '--source', str(args.source), '--output', str(args.output)], check=True)
