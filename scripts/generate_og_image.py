"""Genera assets/img/web/og-image.jpg: noche marina + resplandor de núcleo
+ el wordmark "CARACOLA", dibujado a mano con PIL (misma autoría que la
marca — ver generate_brand_mark.py), sin fotografía ni logo ajeno. La
valoración (4,3★ · 504 reseñas) es la real de la ficha de Google del
negocio."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "img", "web")
os.makedirs(OUT_DIR, exist_ok=True)

W, H = 1200, 630
NOCHE = (11, 14, 26)
NOCHE_2 = (27, 35, 64)
LATON = (201, 150, 62)
LATON_VIVO = (240, 206, 140)
HUESO = (232, 220, 194)

img = Image.new("RGB", (W, H), NOCHE)

# Radial glow, low-right — el núcleo de la espiral, no un fuego.
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
cx, cy = W * 0.80, H * 0.72
for rad, col, alpha in [
    (W * 0.42, NOCHE_2, 130),
    (W * 0.24, LATON, 70),
    (W * 0.11, LATON_VIVO, 90),
]:
    gd.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=(*col, alpha))
glow = glow.filter(ImageFilter.GaussianBlur(60))
img.paste(Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB"), (0, 0))

draw = ImageDraw.Draw(img)


def load_font(name_candidates, size):
    for name in name_candidates:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


title_font = load_font(["georgiab.ttf", "Georgia Bold.ttf", "DejaVuSerif-Bold.ttf"], 104)
sub_font = load_font(["arial.ttf", "DejaVuSans.ttf"], 32)
eyebrow_font = load_font(["arialbd.ttf", "DejaVuSans-Bold.ttf"], 25)

# Eyebrow
draw.ellipse([90, 130, 104, 144], fill=LATON)
draw.text((118, 118), "CAFÉ-BAR · CARBALLO", font=eyebrow_font, fill=(224, 187, 120))

# Title
draw.text((86, 172), "CARACOLA", font=title_font, fill=HUESO)

# Subtitle
draw.text(
    (92, 320),
    "Sobremesas largas junto al mar de la noche.",
    font=sub_font,
    fill=(196, 189, 172),
)
draw.text(
    (92, 364),
    "Café-Bar en Carballo · 4,3/5 (504 reseñas en Google)",
    font=sub_font,
    fill=(196, 189, 172),
)

# Espiral logarítmica pequeña, abajo a la derecha, ecoando la marca
gx, gy = 1010, 470
a, b, turns = 4.5, 0.235, 2.15
pts = []
for i in range(361):
    theta = (i / 360) * turns * 2 * math.pi
    r = a * math.exp(b * theta)
    pts.append((theta, r))
max_r = pts[-1][1]
prev = None
for i, (theta, r) in enumerate(pts):
    rn = (r / max_r) * 120
    x = gx + math.cos(theta) * rn
    y = gy + math.sin(theta) * rn
    if prev is not None:
        t = i / len(pts)
        w = max(1, int(1 + t * 4))
        col = tuple(round(LATON[c] + (LATON_VIVO[c] - LATON[c]) * t) for c in range(3))
        draw.line([prev, (x, y)], fill=col, width=w)
    prev = (x, y)
draw.ellipse([gx - 6, gy - 6, gx + 6, gy + 6], fill=(255, 240, 210))

img.save(os.path.join(OUT_DIR, "og-image.jpg"), quality=90)
print("done")
