/* ---------- Hero: vórtice de la espiral ----------
   Sistema de partículas en canvas 2D (no WebGL, no figuras ilustradas):
   en vez de un lecho de fuego con ascuas que ASCIENDEN (A Lareira), aquí
   motas de luz nacen en el borde exterior y CONVERGEN en espiral
   logarítmica (r = r0 · e^(-k·edad), theta = theta0 + w·edad) hacia un
   núcleo de luz — el mismo trazado matemático que la marca (ver
   scripts/generate_brand_mark.py). Se aclaran de azul-noche apagado a
   latón/blanco cálido a medida que se acercan al núcleo, en vez de la
   rampa candente→ceniza del fuego. Unos arcos-guía tenues (secciones de
   la concha) giran muy despacio detrás como textura, y de vez en cuando
   un "destello" bioluminiscente estalla cerca del núcleo. DPR limitado a
   2, pausado fuera de viewport/pestaña oculta, limpieza completa en
   destroy(). Ninguna web hermana usa esta técnica: A Lareira usa fuego que
   sube, A Taberna do Rio/O Logradouro iconos orbitando, O Carballo un
   sendero de señalización, Melao un shader de blobs. */
(function () {
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  // Rampa de color según cercanía al núcleo: 0 = borde exterior (apagado,
  // azul de noche marina), 1 = a punto de fundirse en el núcleo (latón
  // vivo casi blanco).
  const RAMP = [
    { t: 0.0, c: [42, 92, 130] },   // --mar-vivo apagado
    { t: 0.35, c: [90, 78, 150] },  // transición violeta-noche
    { t: 0.65, c: [201, 150, 62] }, // --laton
    { t: 1.0, c: [240, 206, 140] }, // --laton-vivo
  ];
  function colorAt(t) {
    t = clamp01(t);
    for (let i = 0; i < RAMP.length - 1; i++) {
      const a = RAMP[i], b = RAMP[i + 1];
      if (t >= a.t && t <= b.t) {
        const lt = (t - a.t) / (b.t - a.t || 1);
        return [
          Math.round(lerp(a.c[0], b.c[0], lt)),
          Math.round(lerp(a.c[1], b.c[1], lt)),
          Math.round(lerp(a.c[2], b.c[2], lt)),
        ];
      }
    }
    return RAMP[RAMP.length - 1].c;
  }

  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const K = 0.16; // tasa de convergencia de la espiral
  const R_MIN = 2.2; // radio al que se considera "fundida" en el núcleo

  function lifeFor(r0) {
    return Math.log(r0 / R_MIN) / K;
  }

  function makeMote(maxR, rng) {
    const r0 = maxR * (0.32 + rng() * 0.68);
    return {
      theta0: rng() * Math.PI * 2,
      r0,
      w: 0.55 + rng() * 0.5, // velocidad angular propia
      dir: rng() < 0.5 ? -1 : 1,
      age: 0,
      life: lifeFor(r0),
      size: 0.9 + rng() * 2.1,
      wobbleSeed: rng() * 1000,
    };
  }

  // Arcos-guía: secciones de la espiral de la concha, muy tenues, girando
  // despacio como textura de fondo (no interactivas, aria-hidden por ser
  // parte del canvas).
  function drawGuideArcs(ctx, cx, cy, maxR, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = "rgba(201, 150, 62, 0.10)";
    ctx.lineWidth = 1;
    for (let ring = 1; ring <= 3; ring++) {
      const a = 4.2 * ring;
      const b = 0.235;
      ctx.beginPath();
      const steps = 90;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2.1;
        const r = Math.min(maxR, a * Math.exp(b * theta) * (maxR / (a * Math.exp(b * 2.1 * Math.PI))));
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  window.createEspiralScene = function createEspiralScene(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const rng = mulberry32(20260914);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0;
    let pointer = { x: 0, y: 0 };
    let raf = null;
    let running = false;
    let last = 0;
    let glintTimer = 0;
    let globalRot = 0;
    const motes = [];
    const glints = [];
    const MAX_MOTES = 150;

    function core() {
      // El núcleo se sitúa a la derecha, dejando la mitad izquierda del
      // hero despejada para el titular (mismo criterio de composición que
      // A Lareira, mecánica distinta).
      return { x: width * 0.76, y: height * 0.46, maxR: Math.min(width * 0.42, height * 0.56) };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    function onPointerLeave() { pointer.x = 0; pointer.y = 0; }

    function burstGlint(x, y, rng2) {
      const n = 3 + Math.floor(rng2() * 3);
      for (let i = 0; i < n; i++) {
        const angle = rng2() * Math.PI * 2;
        const speed = 18 + rng2() * 34;
        glints.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          life: 0.5 + rng2() * 0.4,
        });
      }
    }

    function step(dt, t) {
      const { maxR } = core();
      while (motes.length < MAX_MOTES) motes.push(makeMote(maxR, rng));

      const leanW = pointer.x * 0.12;
      globalRot += (0.015 + leanW * 0.4) * dt;

      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.age += dt;
        if (m.age >= m.life) {
          motes[i] = makeMote(maxR, rng);
          continue;
        }
      }

      glintTimer -= dt;
      if (glintTimer <= 0) {
        glintTimer = 0.7 + rng() * 1.3;
        const c = core();
        const a = rng() * Math.PI * 2;
        const rr = c.maxR * (0.05 + rng() * 0.12);
        burstGlint(c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr, rng);
      }
      for (let i = glints.length - 1; i >= 0; i--) {
        const s = glints[i];
        s.age += dt;
        if (s.age >= s.life) { glints.splice(i, 1); continue; }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }
    }

    function frame(t) {
      ctx.clearRect(0, 0, width, height);
      const c = core();

      // Resplandor ambiental de mar nocturno, amplio y muy tenue
      const seaGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.maxR * 1.6);
      seaGrad.addColorStop(0, "rgba(42, 92, 130, 0.10)");
      seaGrad.addColorStop(1, "rgba(11, 14, 26, 0)");
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, 0, width, height);

      drawGuideArcs(ctx, c.x, c.y, c.maxR, globalRot * 0.4);

      ctx.globalCompositeOperation = "lighter";

      // Resplandor del núcleo, pulsando suave
      const pulse = 0.85 + Math.sin(t * 1.1) * 0.15;
      const coreGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.maxR * 0.4);
      coreGrad.addColorStop(0, `rgba(240, 206, 140, ${(0.5 * pulse).toFixed(3)})`);
      coreGrad.addColorStop(0.45, `rgba(201, 150, 62, ${(0.22 * pulse).toFixed(3)})`);
      coreGrad.addColorStop(1, "rgba(201, 150, 62, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.maxR * 0.4, 0, Math.PI * 2);
      ctx.fill();

      motes.forEach((m) => {
        const lifeT = clamp01(m.age / m.life);
        const r = m.r0 * Math.exp(-K * m.age);
        const wobble = Math.sin(t * 1.4 + m.wobbleSeed) * (r * 0.03);
        const theta = m.theta0 + m.dir * m.w * m.age + globalRot;
        const x = c.x + Math.cos(theta) * (r + wobble);
        const y = c.y + Math.sin(theta) * (r + wobble);

        const proximity = 1 - clamp01(r / (c.maxR || 1));
        const [cr, cg, cb] = colorAt(proximity);
        const fadeIn = lifeT < 0.06 ? lifeT / 0.06 : 1;
        const fadeOut = lifeT > 0.9 ? (1 - lifeT) / 0.1 : 1;
        const alpha = fadeIn * fadeOut * (0.35 + proximity * 0.65);
        const size = m.size * (0.7 + proximity * 1.1);

        const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      glints.forEach((s) => {
        const lifeT = s.age / s.life;
        const alpha = 1 - lifeT;
        ctx.fillStyle = `rgba(255, 240, 210, ${(alpha * 0.85).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
    }

    function loop(now) {
      if (!running) return;
      const t = now / 1000;
      const dt = last ? Math.min(0.05, t - last) : 0.016;
      last = t;
      step(dt, t);
      frame(t);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    resize();
    const { maxR } = core();
    for (let i = 0; i < MAX_MOTES; i++) motes.push(makeMote(maxR, rng));
    frame(0);

    const onResize = () => { resize(); frame(0); };
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !document.hidden) start();
          else stop();
        },
        { threshold: 0.05 }
      );
      io.observe(canvas);
    } else {
      start();
    }

    function onVisibility() {
      if (document.hidden) stop();
      else {
        const rect = canvas.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) start();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return {
      destroy() {
        stop();
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerleave", onPointerLeave);
        document.removeEventListener("visibilitychange", onVisibility);
        if (io) io.disconnect();
        motes.length = 0;
        glints.length = 0;
      },
    };
  };
})();
