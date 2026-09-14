# Café-Bar Caracola — landing

Sitio estático (HTML/CSS/JS, sin build), mismo *toolkit* técnico que las
webs hermanas de este workspace (GSAP + ScrollTrigger, Lenis) pero con su
**propia estructura de página y su propia técnica de hero** — ver "Séptima
familia estructural" más abajo. Abrir `index.html` con un servidor
estático cualquiera (por ejemplo `python -m http.server`) — no funciona
bien con `file://` porque las fuentes y `js/main.js` necesitan HTTP.

## Origen del contenido

Negocio real, sin web previa. Primera entrega ("Caracola nocturna") con
solo el nombre, la localidad y el Facebook del negocio — la carta y la
ficha de Google no llegaron a esa sesión, así que todo dato factual salió
marcado `[PENDIENTE]`.

En una segunda sesión (2026-09-14) el usuario pasó capturas reales de la
ficha de Google del negocio (**Caracola Bar**, Carballo — categoría "Bar
de tapas") y de tres reseñas completas. Con eso se sustituyeron los
placeholders por:

- **Dirección**: Av. de Bértoa, 23, 15100 Carballo, A Coruña.
- **Teléfono**: 981 75 46 64 (cableado como `tel:` real en el FAB, el CTA
  del hero, `#contacto` y el pie).
- **Horario semanal real**: L–J 6:30–24:00, V 6:30–1:00, S 8:00–1:00, D
  cerrado — con un "abierto ahora" calculado en directo en `.dial-wrap`
  (`initOpenStatus()` en `js/main.js`).
- **Valoración**: 4,3★ sobre 504 reseñas en Google (metida también en el
  `AggregateRating` del JSON-LD y en la imagen OG).
- **3 reseñas reales**, citadas tal cual (Yoli García Sánchez, Bego,
  Javier Vilariño) en `#resenas`.
- **Mapa real** en `#contacto` (`iframe` de Google Maps sobre la
  dirección de arriba, sin API key).
- **Contenido de `#carta` y `#destacado`**: no se recibió una carta con
  platos y precios, así que esas secciones se redactaron a partir de lo
  que las propias reseñas describen de forma consistente (café y pinchos
  desde primera hora, menú del día completo, churrasco/paella y cena
  baile con música en directo los viernes) — no hay ningún precio ni
  plato inventado que no aparezca en una reseña.

## Vibe: decisión explícita del usuario

El primer prompt traía una vibe ya definida ("brasas nocturnas,
dramático") que resultó ser, literalmente, la descripción que
[[project-alareira-sixth-family]] ya usa como estado permanente de A
Lareira (carbón + ascua, ver `a-lareira-carballo-web/css/style.css`). Se
avisó de esto al usuario, que reescribió el prompt dejando la vibe en
blanco a propósito para que se propusiera desde cero. Se plantearon tres
direcciones con `AskUserQuestion` (mar y noche / vermú de barrio dorado /
speakeasy en penumbra); el usuario eligió **"Caracola nocturna"**:

- Noche marina casi negra (`--noche`) como estado de reposo de toda la
  página, con latón/ámbar de luz de barra como acento — sin fuego, sin
  madera, sin la familia cromática de ninguna otra web del workspace.
- El motivo estructural es la **espiral logarítmica de la concha** (la
  misma fórmula matemática en la marca, el hero, el diagrama de "La
  Caracola" y la imagen OG): `r = a·e^(b·θ)`.
- Gancho sensorial: lo que se oye al acercar una caracola al oído — el
  murmullo de una sobremesa que no tiene prisa por acabar.

## Séptima familia estructural del workspace

Antes de escribir una sola línea se revisaron las seis webs hermanas
(Melao y su segunda plantilla "día y noche", A Taberna do Rio, O
Logradouro, O Carballo Tapería, A Lareira) para no repetir ni el orden de
secciones ni la técnica de hero ni el patrón de navegación de ninguna:

- **Hero: vórtice de la espiral** (`js/scene-espiral.js`): partículas de
  luz que nacen en el borde y **convergen** en espiral logarítmica hacia
  un núcleo — lo opuesto mecánicamente al lecho de ascuas que *asciende*
  de A Lareira. Paleta azul-noche → latón, no candente → ceniza. Ninguna
  web hermana usa esta técnica: A Lareira usa fuego que sube, A Taberna do
  Rio/O Logradouro iconos orbitando, O Carballo un sendero de
  señalización, Melao un shader de blobs.
- **Nav en arco** (`.arc-nav`): en vez de barra superior (Melao), rail
  lateral de puntos (A Taberna do Rio), overlay a pantalla completa (Melao
  v2/O Carballo) o cabecera "parrilla" (A Lareira), la marca-espiral de la
  esquina despliega un arco de enlaces que se curva desde el propio botón
  — el menú se "desenrolla" como una concha.
- **Carta: cámaras de la concha** (`#carta`, `.chamber`): sin platos ni
  precios reales, cada categoría es una "cámara" redactada a partir de lo
  que describen las reseñas (café/pinchos, menú del día, churrasco/paella
  de los viernes) — un banner deja claro que faltan platos y precios
  concretos. Distinto de la rejilla de Melao, la hoja impresa de A Taberna
  do Rio, el foco+índice de O Logradouro, las tarjetas-sello de O Carballo
  y el carril de comandas de A Lareira.
- **Horario: esfera circular** (`.dial-wrap`): dial de 24h en vez del
  "reloj" lineal de A Taberna do Rio o el `clock-card` de A Lareira. Con
  el horario real de Google, `initOpenStatus()` calcula "Abierto ahora" /
  "Cerrado ahora" en directo (incluye el desborde de los cierres a la
  1:00 de viernes/sábado hacia la madrugada siguiente).
- **Reseñas: estela curva** (`.estela-track`): tarjetas en scroll
  horizontal con una ligera ondulación por posición (`runEstelaWave` en
  `js/main.js`), en vez del anillo cónico (A Taberna do Rio/O Carballo),
  el carrusel de una tarjeta (Melao v2) o el sello numérico (A Lareira).
  Las tres tarjetas son citas reales de Google, tal cual, con autoría.
- **Botón de reserva con `tel:` real**: FAB y CTA del hero llaman al
  981 75 46 64.

## Marca gráfica

El negocio no facilitó su logo. La marca del sitio —una espiral
logarítmica de latón sobre un medallón de noche marina— es una marca de
autoría propia generada con PIL (`scripts/generate_brand_mark.py`), misma
fórmula que el motivo del resto del sitio, no una reproducción de ningún
logo real. `assets/img/web/og-image.jpg` se generó igual
(`scripts/generate_og_image.py`), sin fotografía ni cifras inventadas
(la versión anterior de este patrón en otras webs sí escribe una
valoración real en la imagen OG — aquí no hay ninguna que citar).

## Fotografía

No se recibió ninguna foto del local, de platos ni del logo. Siguiendo el
mismo criterio ya usado en A Lareira ante la misma falta de material, el
sitio es enteramente gráfico/tipográfico (canvas del hero, diagrama SVG
de la espiral, sin fotografía de stock) — no se preguntó de nuevo al
usuario porque el precedente y el propio concepto ("Caracola nocturna")
encajan sin necesitar fotografía real.

## Qué falta — pedir al negocio antes de darlo por cerrado

1. **Carta completa con platos y precios** — `#carta` describe categorías
   a partir de lo que cuentan las reseñas (pinchos, menú del día,
   churrasco/paella de los viernes), pero no hay un solo plato con precio
   real. Hace falta la carta directamente del dueño.
2. **Logo real**, si el negocio tiene uno — hoy se usa la marca-espiral de
   autoría propia (`scripts/generate_brand_mark.py`), no una reproducción
   del logo de Caracola Bar.
3. **Fotos reales del local/platos**, si el negocio quiere incorporarlas —
   hoy el sitio es intencionadamente gráfico, sin fotografía (las 3
   miniaturas de la ficha de Google no son de resolución ni licencia
   suficiente para publicarlas).
4. **Confirmar el nombre de marca** — Google lista el negocio como
   "Caracola Bar"; el sitio usa "Café-Bar Caracola" (nombre que dio el
   usuario en la primera sesión). Merece la pena confirmar cuál prefiere
   el dueño para la cabecera, el `<title>` y el schema.
5. **WhatsApp**, si el negocio lo usa para reservas — hoy solo hay
   `tel:981754664`.

Ya resueltos con las capturas de Google de la segunda sesión: dirección,
teléfono, horario semanal, valoración (4,3★/504), 3 reseñas reales y el
mapa de `#contacto`.

## Accesibilidad y resiliencia

- `prefers-reduced-motion: reduce`: el canvas del vórtice no se activa
  (queda el resplandor de respaldo `.hero-fallback-glow`), no corre
  `runSectionReveals`/`runEstelaWave`/cursor personalizado.
- Sin JavaScript o con el CDN de GSAP/Lenis caído: el contenido, los
  enlaces y el aviso de cookies siguen siendo utilizables — solo se pierde
  el motion (mismo criterio que el resto del workspace, ver comentario al
  inicio de `js/main.js`).
- Mapa, `tel:` y horario son datos reales de la ficha de Google del
  negocio — no hay ningún dato de contacto simulado en el sitio.
