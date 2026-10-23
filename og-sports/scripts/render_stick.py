"""Studio render of the FASTR STICK from the CAD draft V0 (Blender, headless).

    blender -b -P scripts/render_stick.py -- <cad_preview_dir> <out.png> [samples]

<cad_preview_dir> holds the assembled STL bodies exported by the local prototype
programme (fastr-stick-prototype/output/preview/*_assembled.stl, millimetres).
The render shows the CAD geometry as it is: proposed dimensions, not a tested or
manufactured product. Materials and light are art direction.
"""

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1 :]
cad = Path(argv[0])
out = Path(argv[1])
samples = int(argv[2]) if len(argv) > 2 else 160

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 0.001


def material(name, rgb, rough, coat=0.0, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*rgb, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = 0.25
    return m


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


lime = material("lime", srgb("#e6ff1a"), 0.38, coat=0.25)
black = material("black", srgb("#16181a"), 0.55, coat=0.05)
grey = material("grey", srgb("#9a9d97"), 0.35, metal=0.0)
assign = {
    "01_gehaeuse": lime,
    "02_schraubkappe": black,
    "03_drehfuss": black,
    "04_spindel": grey,
    "05_hubteller": grey,
}

parts = []
for f in sorted(cad.glob("0*_assembled.stl")):
    bpy.ops.wm.stl_import(filepath=str(f))
    ob = bpy.context.selected_objects[0]
    key = f.stem.replace("_assembled", "")
    ob.data.materials.append(assign.get(key, grey))
    bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
    parts.append(ob)

# group, lay the stick at a slight angle on the floor plane (product still life)
root = bpy.data.objects.new("stick", None)
scene.collection.objects.link(root)
for ob in parts:
    ob.parent = root
zmin = min((ob.matrix_world @ Vector(c)).z for ob in parts for c in ob.bound_box)
root.location.z = -zmin
root.rotation_euler = (0, 0, math.radians(18))

# seamless backdrop
bpy.ops.mesh.primitive_plane_add(size=2000, location=(0, 0, 0))
floor = bpy.context.active_object
bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.object.mode_set(mode="OBJECT")
floor.data.materials.append(material("ground", srgb("#1b1d1a"), 0.32))
bpy.ops.mesh.primitive_plane_add(
    size=2000, location=(0, 260, 1000), rotation=(math.radians(90), 0, 0)
)
wall = bpy.context.active_object
wall.data.materials.append(material("wall", srgb("#1b1d1a"), 0.8))


# light: large soft key, rim, fill
def area(name, loc, rot, size, energy, color=(1, 1, 1)):
    d = bpy.data.lights.new(name, "AREA")
    d.size = size
    d.energy = energy
    d.color = color
    o = bpy.data.objects.new(name, d)
    o.location = loc
    o.rotation_euler = rot
    scene.collection.objects.link(o)


area("key", (-160, -300, 380), (math.radians(38), 0, math.radians(-28)), 300, 3.2e6)
area("rim_l", (-230, 140, 150), (math.radians(80), 0, math.radians(-125)), 40, 9.0e5)
area("rim_r", (230, 140, 150), (math.radians(80), 0, math.radians(125)), 40, 9.0e5)
area("strip", (110, -200, 120), (math.radians(85), 0, math.radians(30)), 30, 2.2e5)

halo = bpy.data.lights.new("halo", "SPOT")
halo.energy = 4.0e6
halo.spot_size = math.radians(38)
halo.spot_blend = 1.0
halo_ob = bpy.data.objects.new("halo", halo)
halo_ob.location = (0, -200, 120)
halo_ob.rotation_euler = (math.radians(-90 + 4), 0, 0)
scene.collection.objects.link(halo_ob)

world = bpy.data.worlds.new("w")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.9, 0.9, 0.88, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.02
scene.world = world

cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 100
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 5.6
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
target = Vector((0, 0, 72))
cam.location = Vector((-150, -620, 140))
direction = target - cam.location
cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
cam_data.dof.focus_distance = direction.length

scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = samples
scene.cycles.use_denoising = True
scene.render.resolution_x = 1600
scene.render.resolution_y = 2000
scene.render.film_transparent = False
scene.view_settings.view_transform = "Khronos PBR Neutral"
scene.view_settings.look = "None"
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = str(out)
bpy.ops.render.render(write_still=True)
print("rendered", out)
