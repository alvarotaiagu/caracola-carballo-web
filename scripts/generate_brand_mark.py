"""
Genera la marca propia de Café-Bar Caracola: una espiral logarítmica
(sección de concha/nautilus) dibujada a mano con PIL, sin IA generativa ni
trazado de ningún logo real del negocio (el negocio no facilitó su logo;
esta es una marca de autoría propia para el sitio). La espiral crece desde
un núcleo de luz cálida (láton) sobre fondo de noche marina, ecoando el
motivo estructural de todo el sitio (vórtice del hero, nav en arco, esfera
de horario). Se dibuja a alta resolución y se reescala con LANCZOS.
"""
from PIL import Image, ImageDraw, ImageFilter
import math
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "img", "logo")
os.makedirs(OUT, exist_ok=True)

S = 1024  # supersample size
CX, CY = S / 2, S / 2
R = S * 0.46

NOCHE = (11, 14, 26, 255)        # --noche midnight
LATON = (201, 150, 62, 255)      # --laton brass
LATON_VIVO = (240, 206, 140, 255)  # --laton-vivo hot highlight
HUESO = (232, 220, 194, 255)     # --hueso warm bone


def spiral_points(turns=2.35, steps=420, a=6.0, b=0.235, start_r=0.0):
    """Puntos de una espiral logarítmica r = a * e^(b*theta), normalizada."""
    pts = []
    max_theta = turns * 2 * math.pi
    for i in range(steps + 1):
        theta = (i / steps) * max_theta
        r = a * math.exp(b * theta)
        pts.append((theta, r))
    max_r = pts[-1][1]
    return [(theta, (r / max_r)) for theta, r in pts]


def make_mark():
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Medallion base: noche marina
    d.ellipse([CX - R, CY - R, CX + R, CY + R], fill=NOCHE)

    # Thin outer ring in brass tone
    ring_w = S * 0.012
    d.ellipse(
        [CX - R, CY - R, CX + R, CY + R],
        outline=(*LATON[:3], 150),
        width=int(ring_w),
    )

    # Glow at the core (where the spiral converges)
    glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for rad, col, alpha in [
        (R * 0.34, LATON, 90),
        (R * 0.18, LATON_VIVO, 190),
    ]:
        gd.ellipse([CX - rad, CY - rad, CX + rad, CY + rad], fill=(*col[:3], alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(S * 0.012))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)

    # Espiral logarítmica de la concha, de fuera hacia el núcleo,
    # engrosando y aclarando el trazo a medida que se acerca al centro.
    pts = spiral_points()
    spiral_r = R * 0.86
    prev = None
    n = len(pts)
    for i, (theta, rn) in enumerate(pts):
        x = CX + math.cos(theta) * rn * spiral_r
        y = CY + math.sin(theta) * rn * spiral_r
        if prev is not None:
            t = i / n  # 0 fuera, 1 dentro
            w = max(2, (S * 0.006) + t * (S * 0.02))
            col = tuple(
                round(LATON[c] + (LATON_VIVO[c] - LATON[c]) * t) for c in range(3)
            )
            d.line([prev, (x, y)], fill=(*col, 235), width=int(w))
        prev = (x, y)

    # Clip everything to the circle
    mask = Image.new("L", (S, S), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse([CX - R, CY - R, CX + R, CY + R], fill=255)
    img = Image.composite(img, Image.new("RGBA", (S, S), (0, 0, 0, 0)), mask)
    d = ImageDraw.Draw(img)
    d.ellipse(
        [CX - R, CY - R, CX + R, CY + R],
        outline=(*LATON[:3], 160),
        width=int(ring_w),
    )

    # Bright core dot
    core_r = R * 0.045
    d.ellipse(
        [CX - core_r, CY - core_r, CX + core_r, CY + core_r],
        fill=(255, 240, 210, 255),
    )

    return img


def save_sizes(img, prefix, sizes, bg=None):
    for size in sizes:
        resized = img.resize((size, size), Image.LANCZOS)
        if bg is not None:
            canvas = Image.new("RGBA", (size, size), bg)
            canvas.alpha_composite(resized)
            canvas.convert("RGB").save(os.path.join(OUT, f"{prefix}-{size}.png"))
        else:
            resized.save(os.path.join(OUT, f"{prefix}-{size}.png"))


if __name__ == "__main__":
    mark = make_mark()
    mark.save(os.path.join(OUT, "mark-master.png"))

    save_sizes(mark, "mark", [512])
    save_sizes(mark, "icon", [16, 32, 96, 180, 192, 512], bg=NOCHE)

    print("done")
