"""Export Session 2 prints from the same geometry as tool.html."""
import math
from pathlib import Path

PAGE_W = 420.0
PAGE_H = 594.0
CHARCOAL = "#2a2a28"
PAPER = "#f3f0e8"

INSTRUCTION = (
    "Parallel wavy lines of different colors going from left to right, located at the top part of the page. "
    "A triangle, a rectangle and a circle of different colors located slightly above the center of the page. All shapes are overlapping. "
    "An array of multiple lines, evenly spaced, extending from the lowest point of the circle to the bottom edge of the page. "
    "The lines are evenly spaced. The first line touches the bottom left corner of the page and the last line touches the bottom right corner of the page. "
    "At the bottom of the page, a single row of circles is drawn where each circle is between two lines."
)

OUT = Path(__file__).resolve().parents[1] / "prints"


def u32(n):
    return n & 0xFFFFFFFF


def i32(n):
    n = u32(n)
    return n - 0x100000000 if n >= 0x80000000 else n


def imul(a, b):
    return i32(i32(a) * i32(b))


def mulberry32(seed):
    state = [u32(int(seed))]

    def rand():
        a = i32(state[0])
        a = i32(a + 0x6D2B79F5)
        state[0] = u32(a)
        t = imul(a ^ (u32(a) >> 15), 1 | a)
        t = i32(t + imul(t ^ (u32(t) >> 7), 61 | t)) ^ t
        return u32(t ^ (u32(t) >> 14)) / 4294967296.0

    return rand


def hsl(h, s, l):
    return f"hsl({h} {s}% {l}%)"


def triangle_points(cx, cy, side, rotation_deg):
    r = side / math.sqrt(3)
    rot = math.radians(rotation_deg - 90)
    pts = []
    for i in range(3):
        a = rot + i * (2 * math.pi / 3)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def poly_string(pts):
    return " ".join(f"{p[0]:.3f},{p[1]:.3f}" for p in pts)


def wave_path(y, amp, cycles, phase):
    steps = 240
    d = [f"M 0 {y:.3f}"]
    for i in range(1, steps + 1):
        x = (i / steps) * PAGE_W
        yy = y + amp * math.sin(cycles * 2 * math.pi * (x / PAGE_W) + phase)
        d.append(f"L {x:.3f} {yy:.3f}")
    return " ".join(d)


def hit_bottom(ox, oy, x2, y2, row_y):
    t = (row_y - oy) / (y2 - oy)
    return ox + t * (x2 - ox)


def defaults():
    return {
        "seed": 1,
        "waveCount": 7,
        "waveAmplitude": 2.0,
        "waveCycles": 4,
        "waveBand": 15.0,
        "groupX": 50.0,
        "groupY": 42.0,
        "circleSize": 20.0,
        "rectRel": 84,
        "triRel": 66,
        "rectAspect": 1.5,
        "triRot": 0,
        "overlap": 30,
        "fanCount": 9,
        "fanSpacing": "bottom",
        "rowY": 92.0,
        "dotSize": 5.0,
        "lineWeight": 3,
        "hueTri": 8,
        "hueRect": 46,
        "hueCirc": 214,
        "shapeSat": 58,
        "shapeLit": 50,
        "waveSat": 58,
        "waveLit": 48,
        "hueDots": 0,
        "dotSat": 0,
    }


def with_updates(updates):
    p = defaults()
    p.update(updates)
    return p


def render(p, width_mm, height_mm):
    rand = mulberry32(p["seed"])
    p = dict(p)
    p["wavePhase"] = rand() * math.pi * 2
    p["waveHueStart"] = rand() * 360

    stroke = round(p["lineWeight"] * 0.3, 2)
    gx = PAGE_W * p["groupX"] / 100
    gy = PAGE_H * p["groupY"] / 100
    circle_d = PAGE_W * p["circleSize"] / 100
    circle_r = circle_d / 2
    rect_w = circle_d * p["rectRel"] / 100
    rect_h = rect_w / p["rectAspect"]
    tri_side = circle_d * p["triRel"] / 100

    t = 1 - p["overlap"] / 100
    rect_cx = gx - t * (rect_w / 2) * 0.82
    rect_cy = gy - t * (rect_h / 2) * 0.35
    tri_cx = gx + t * (tri_side / 2) * 0.82
    tri_cy = gy - t * (tri_side / 2) * 0.35
    tri_pts = triangle_points(tri_cx, tri_cy, tri_side, p["triRot"])

    origin_x = gx
    origin_y = gy + circle_r
    band_bottom = PAGE_H * p["waveBand"] / 100
    amp = PAGE_H * p["waveAmplitude"] / 100
    row_y = PAGE_H * p["rowY"] / 100
    dot_r = (PAGE_W * p["dotSize"] / 100) / 2

    ends = []
    n = p["fanCount"]
    for i in range(n):
        u = 0 if n == 1 else i / (n - 1)
        if p["fanSpacing"] == "angle":
            a_left = math.atan2(PAGE_H - origin_y, 0 - origin_x)
            a_right = math.atan2(PAGE_H - origin_y, PAGE_W - origin_x)
            a = a_left + u * (a_right - a_left)
            t_hit = (PAGE_H - origin_y) / math.sin(a)
            ends.append((origin_x + t_hit * math.cos(a), PAGE_H))
        else:
            ends.append((u * PAGE_W, PAGE_H))

    wave_paths = []
    for i in range(p["waveCount"]):
        y = (band_bottom / (p["waveCount"] + 1)) * (i + 1)
        hue = (p["waveHueStart"] + i * (360 / p["waveCount"])) % 360
        wave_paths.append(
            (wave_path(y, amp, p["waveCycles"], p["wavePhase"]), hsl(hue, p["waveSat"], p["waveLit"]))
        )

    dots = []
    for i in range(n - 1):
        xa = hit_bottom(origin_x, origin_y, ends[i][0], PAGE_H, row_y)
        xb = hit_bottom(origin_x, origin_y, ends[i + 1][0], PAGE_H, row_y)
        dots.append(((xa + xb) / 2, row_y))

    fill_tri = hsl(p["hueTri"], p["shapeSat"], p["shapeLit"])
    fill_rect = hsl(p["hueRect"], p["shapeSat"], p["shapeLit"])
    fill_circ = hsl(p["hueCirc"], p["shapeSat"], p["shapeLit"])
    fill_dot = CHARCOAL if p["dotSat"] < 1 else hsl(p["hueDots"], p["dotSat"], p["shapeLit"])

    waves = "\n".join(
        f'<path d="{d}" fill="none" stroke="{s}" stroke-width="{stroke}" stroke-linecap="round"/>'
        for d, s in wave_paths
    )
    fan = "\n".join(
        f'<line x1="{origin_x:.3f}" y1="{origin_y:.3f}" x2="{x2:.3f}" y2="{PAGE_H}" '
        f'stroke="{CHARCOAL}" stroke-width="{stroke}" stroke-linecap="butt"/>'
        for x2, _y2 in ends
    )
    small = "\n".join(
        f'<circle cx="{x:.3f}" cy="{y:.3f}" r="{dot_r:.3f}" fill="{fill_dot}" '
        f'stroke="{CHARCOAL}" stroke-width="{stroke * 0.55}"/>'
        for x, y in dots
    )

    values = "\n".join(
        [
            "instruction: version 2",
            f"seed: {p['seed']}",
            f"waveCount: {p['waveCount']}",
            f"waveAmplitude: {p['waveAmplitude']}% height",
            f"waveCycles: {p['waveCycles']}",
            f"waveBandLower: {p['waveBand']}% height",
            f"groupX: {p['groupX']}%  groupY: {p['groupY']}%",
            f"circleSize: {p['circleSize']}% width",
            f"rectRel: {p['rectRel']}%  triRel: {p['triRel']}%  aspect: {p['rectAspect']:.2f}:1",
            f"triRot: {p['triRot']}°  overlap: {p['overlap']}%",
            f"fanCount: {p['fanCount']}  fanSpacing: {p['fanSpacing']}",
            f"bottomRowY: {p['rowY']}%  bottomCircleDiameter: {p['dotSize']}%",
            f"lineWeight: {p['lineWeight']} ({stroke:.2f} mm)",
            f"hues T/R/C: {p['hueTri']}/{p['hueRect']}/{p['hueCirc']}  sat {p['shapeSat']}%  lit {p['shapeLit']}%",
            f"page: {width_mm}×{height_mm} mm portrait",
        ]
    )

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width_mm}mm" height="{height_mm}mm" viewBox="0 0 420 594">
<!--
{values}
-->
  <title>ARTD8105 instruction drawing</title>
  <desc>{INSTRUCTION}</desc>
  <defs>
    <clipPath id="pageClip">
      <rect x="0" y="0" width="{PAGE_W}" height="{PAGE_H}"/>
    </clipPath>
    <mask id="fanMask" maskUnits="userSpaceOnUse">
      <rect x="0" y="{origin_y:.3f}" width="{PAGE_W}" height="{PAGE_H - origin_y:.3f}" fill="white"/>
      <polygon points="{poly_string(tri_pts)}" fill="black"/>
      <rect x="{rect_cx - rect_w / 2:.3f}" y="{rect_cy - rect_h / 2:.3f}" width="{rect_w:.3f}" height="{rect_h:.3f}" fill="black"/>
    </mask>
  </defs>
  <g clip-path="url(#pageClip)">
    <rect x="0" y="0" width="{PAGE_W}" height="{PAGE_H}" fill="{PAPER}"/>
    {waves}
    <polygon points="{poly_string(tri_pts)}" fill="{fill_tri}" stroke="{CHARCOAL}" stroke-width="{stroke * 0.7}"/>
    <rect x="{rect_cx - rect_w / 2:.3f}" y="{rect_cy - rect_h / 2:.3f}" width="{rect_w:.3f}" height="{rect_h:.3f}" fill="{fill_rect}" stroke="{CHARCOAL}" stroke-width="{stroke * 0.7}"/>
    <circle cx="{gx:.3f}" cy="{gy:.3f}" r="{circle_r:.3f}" fill="{fill_circ}" stroke="{CHARCOAL}" stroke-width="{stroke * 0.7}"/>
    <g mask="url(#fanMask)">
      {fan}
    </g>
    {small}
  </g>
</svg>
'''


PRINTS = [
    {
        "file": "01_a2_default.svg",
        "size": (420, 594),
        "params": with_updates({}),
        "role_zh": "A2 · 你写下的默认值（参数空间的中心）",
        "role_en": "A2 · your stated defaults (centre of the parameter space)",
    },
    {
        "file": "02_a4_sparse.svg",
        "size": (210, 297),
        "params": with_updates(
            {
                "waveCount": 3,
                "waveAmplitude": 0.5,
                "waveCycles": 2,
                "waveBand": 5,
                "circleSize": 14,
                "overlap": 15,
                "fanCount": 5,
                "rowY": 88,
                "dotSize": 3,
                "lineWeight": 1,
            }
        ),
        "role_zh": "A4 · 你所定范围的稀疏端（数量、尺寸、重叠、线宽的最小值）",
        "role_en": "A4 · sparse end of the ranges you named (minimum counts, sizes, overlap, weight)",
    },
    {
        "file": "03_a4_dense.svg",
        "size": (210, 297),
        "params": with_updates(
            {
                "waveCount": 12,
                "waveAmplitude": 4,
                "waveCycles": 8,
                "waveBand": 25,
                "circleSize": 26,
                "overlap": 45,
                "fanCount": 13,
                "rowY": 96,
                "dotSize": 7,
                "lineWeight": 6,
            }
        ),
        "role_zh": "A4 · 你所定范围的密集端（数量、尺寸、重叠、线宽的最大值）",
        "role_en": "A4 · dense end of the ranges you named (maximum counts, sizes, overlap, weight)",
    },
]


def param_block(p):
    keys = [
        "seed",
        "waveCount",
        "waveAmplitude",
        "waveCycles",
        "waveBand",
        "groupX",
        "groupY",
        "circleSize",
        "rectRel",
        "triRel",
        "rectAspect",
        "triRot",
        "overlap",
        "fanCount",
        "fanSpacing",
        "rowY",
        "dotSize",
        "lineWeight",
        "hueTri",
        "hueRect",
        "hueCirc",
        "shapeSat",
        "shapeLit",
        "waveSat",
        "waveLit",
        "hueDots",
        "dotSat",
    ]
    return "\n".join(f"  {k}: {p[k]}" for k in keys)


def labels_text():
    chunks = [
        "ARTD8105 · Session 2 prints",
        "",
        "标题 / Title",
        "平行波线、重叠三形、底边扇形",
        "Parallel waves, overlapping shapes, bottom fan",
        "（描述性暂用题，不是诗意命名。若要改展签标题，告诉我你的题目。）",
        "(Descriptive working title, not a poetic name. Say if you want a different wall-label title.)",
        "",
        "作者 / Name",
        "汪俏黎",
        "WANG QIALI",
        "",
        "指令版本 / Instruction version",
        "Version 2",
        "",
        "后处理 / Post-processing",
        "无。纸上每一笔都来自生成器。",
        "None. Every mark on the sheet comes from the generator.",
        "",
        "说明 / Note",
        "三张图是同一 seed（1）下、你已写下的范围的三个位置：默认 / 最小 / 最大。",
        "不是另选的“好看”组合。若你不要其中一张，指出要换哪一端。",
        "Three sheets, same seed (1), three positions in the ranges you already named: default / minimum / maximum.",
        "Not a taste selection. If you reject one, say which end to replace.",
        "",
    ]
    for item in PRINTS:
        chunks.append("—" * 40)
        chunks.append(item["file"])
        chunks.append(item["role_zh"])
        chunks.append(item["role_en"])
        chunks.append(param_block(item["params"]))
        chunks.append("")
    return "\n".join(chunks) + "\n"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for item in PRINTS:
        w, h = item["size"]
        text = render(item["params"], w, h)
        path = OUT / item["file"]
        path.write_text(text, encoding="utf-8")
        print("wrote", path, "bytes", path.stat().st_size)
    labels = OUT / "labels.txt"
    labels.write_text(labels_text(), encoding="utf-8")
    print("wrote", labels)


if __name__ == "__main__":
    main()
