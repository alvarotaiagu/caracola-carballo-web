# Café-Bar Caracola — landing

Sitio estático (HTML/CSS/JS, sin build), mismo *toolkit* técnico que las
webs hermanas de este workspace (GSAP + ScrollTrigger, Lenis) pero con su
**propia estructura de página y su propia técnica de hero** — ver "Séptima
familia estructural" más abajo. Abrir `index.html` con un servidor
estático cualquiera (por ejemplo `python -m http.server`) — no funciona
bien con `file://` porque las fuentes y `js/main.js` necesitan HTTP.

## Origen del contenido — muy limitado por ahora

Negocio real, sin web previa. El usuario aportó únicamente:

- El nombre (**Café-Bar Caracola**) y la localidad (**Carballo**).
- El Facebook del negocio: `https://www.facebook.com/caracolacarballo/`.
- Aviso de que la carta no está en internet todavía — la facilitará el
  propietario más adelante.
- Aviso de que pasaría capturas de la ficha de Google (info, reseñas), que
  **no llegaron a esta sesión** — se le indicó esto al usuario.

Se intentó un `WebFetch` al Facebook del negocio: la página no permite
scraping no autenticado más allá del nombre y la localidad (mismo
bloqueo ya documentado en otras webs de este workspace para
Instagram/Facebook) — no aportó dirección, teléfono, horario, descripción
ni reseñas.

**Resultado:** esta es, de largo, la web del workspace con menos contenido
real de partida. Se construyó igualmente la estructura, el arte y el
motion completos (así lo pidió el usuario explícitamente: "no lo invento,
uso un placeholder claramente marcado... al final te digo qué falta"),
pero prácticamente todo dato factual del sitio es un placeholder — ver
"Qué falta" abajo antes de publicar esto como si fuera contenido real.

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
- **Carta: cámaras de la concha** (`#carta`, `.chamber`): sin carta real
  todavía, así que en vez de inventar platos se muestra la estructura —
  cada categoría es una "cámara" pendiente de contenido, con
  `[CARTA PENDIENTE]` explícito en cada una. Distinto de la rejilla de
  Melao, la hoja impresa de A Taberna do Rio, el foco+índice de O
  Logradouro, las tarjetas-sello de O Carballo y el carril de comandas de
  A Lareira.
- **Horario: esfera circular** (`.dial-wrap`): dial de 24h en vez del
  "reloj" lineal de A Taberna do Rio o el `clock-card` de A Lareira. Sin
  datos reales de horario, se deja **deliberadamente inerte** (sin arco de
  apertura, sin "abierto ahora" en directo) en vez de simular un estado
  falso.
- **Reseñas: estela curva** (`.estela-track`): tarjetas en scroll
  horizontal con una ligera ondulación por posición (`runEstelaWave` en
  `js/main.js`), en vez del anillo cónico (A Taberna do Rio/O Carballo),
  el carrusel de una tarjeta (Melao v2) o el sello numérico (A Lareira).
  Las cuatro tarjetas son `[RESEÑA PENDIENTE]` — no se inventó ninguna
  cita.
- **Botón de reserva deshabilitado**: sin teléfono confirmado, el FAB y el
  CTA principal del hero muestran `aria-disabled="true"` y enlazan a
  `#contacto` en vez de a un `tel:` inventado.

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

## Qué falta — pedir al negocio o al usuario antes de publicar

1. **Carta completa con precios** — el propio usuario avisó de que la
   pedirá al dueño. Sin ella, `#carta` solo muestra categorías genéricas
   de marcador de posición (Café y desayuno / Para picar / De la barra /
   De la noche) que **también habría que confirmar o cambiar** una vez
   se conozca la oferta real.
2. **Capturas de la ficha de Google** (dirección, teléfono, horario
   semanal, valoración, número de reseñas, servicios) — el usuario dijo
   que las pasaría y no llegaron a esta sesión.
3. **2-3 reseñas reales de Google**, citadas tal cual (nombre, texto),
   para sustituir las cuatro tarjetas `[RESEÑA PENDIENTE]` de `#resenas`.
4. **Dirección exacta** — sin ella no se puede insertar el mapa de
   `#contacto` (ahora mismo es un panel de aviso, no un iframe).
5. **Teléfono / WhatsApp** — hoy el botón de reserva está deshabilitado
   (`aria-disabled="true"`) en el hero y en el FAB flotante.
6. **Logo real**, si el negocio tiene uno — hoy se usa la marca-espiral de
   autoría propia.
7. **Fotos reales del local/platos**, si el negocio quiere incorporarlas —
   hoy el sitio es intencionadamente gráfico, sin fotografía.
8. **Plato o cóctel insignia** para la sección `#destacado` — hoy es un
   único placeholder (`[DESTACADO PENDIENTE]`), no una lista inventada.

## Accesibilidad y resiliencia

- `prefers-reduced-motion: reduce`: el canvas del vórtice no se activa
  (queda el resplandor de respaldo `.hero-fallback-glow`), no corre
  `runSectionReveals`/`runEstelaWave`/cursor personalizado.
- Sin JavaScript o con el CDN de GSAP/Lenis caído: el contenido, los
  enlaces y el aviso de cookies siguen siendo utilizables — solo se pierde
  el motion (mismo criterio que el resto del workspace, ver comentario al
  inicio de `js/main.js`).
- El mapa y el `tel:`/WhatsApp reales no se cablean hasta tener datos
  reales que poner — no hay ningún dato de contacto simulado en el sitio.
