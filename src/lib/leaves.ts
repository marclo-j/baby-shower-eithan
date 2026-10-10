// Transición de hojas después de que nace el dino del huevo:
// 1) las hojas cubren la pantalla de forma progresiva,
// 2) se mantienen un momento,
// 3) se retiran hacia los lados como niebla que se despeja.

export const LEAF_SRC = '/img/helecho.png';

type Options = {
  /** Se llama cuando la pantalla quedó completamente cubierta. */
  onCovered?: () => void;
  /** Se llama justo cuando empieza a despejarse. */
  onClearing?: () => void;
  holdMs?: number;
};

const EASE = 'cubic-bezier(.4,0,.2,1)';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export async function playLeafTransition({ onCovered, onClearing, holdMs = 1500 }: Options = {}) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const size = Math.max(170, 0.28 * Math.max(vw, vh));
  const step = size * 0.55;

  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;z-index:130;pointer-events:none;overflow:hidden';

  // Velo de fondo en dos mitades con el borde interior difuminado
  const veil = (side: 'left' | 'right') => {
    const v = document.createElement('div');
    const dir = side === 'left' ? 'to right' : 'to left';
    v.style.cssText = [
      'position:absolute',
      'top:0',
      'bottom:0',
      `${side}:0`,
      'width:58%',
      `background:linear-gradient(${dir}, var(--color-sage-200) 82%, transparent)`,
      'opacity:0',
    ].join(';');
    layer.appendChild(v);
    return v;
  };
  const veils = { left: veil('left'), right: veil('right') };

  // Grilla de hojas con variación aleatoria
  const cols = Math.ceil(vw / step) + 1;
  const rows = Math.ceil(vh / step) + 1;
  const offX = (cols * step - vw) / 2;
  const offY = (rows * step - vh) / 2;
  const cx = vw / 2;
  const maxDist = Math.hypot(cx, vh / 2);

  // d = distancia normalizada al centro (orden de aparición y retirada)
  type Leaf = { el: HTMLImageElement; x: number; d: number; transform: string };
  const leaves: Leaf[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * step - offX + rand(-step * 0.25, step * 0.25);
      const y = r * step - offY + rand(-step * 0.25, step * 0.25);
      const scale = rand(0.9, 1.3);
      const flip = Math.random() < 0.5 ? -1 : 1;
      const rot = rand(0, 360);
      const el = document.createElement('img');
      el.src = LEAF_SRC;
      el.alt = '';
      el.style.cssText = [
        'position:absolute',
        `left:${x - size / 2}px`,
        `top:${y - size / 2}px`,
        `width:${size}px`,
        `height:${size}px`,
        'object-fit:contain',
        'opacity:0',
        'will-change:transform,opacity,filter',
      ].join(';');
      layer.appendChild(el);
      leaves.push({
        el,
        x,
        d: Math.hypot(x - cx, y - vh / 2) / maxDist,
        transform: `rotate(${rot}deg) scale(${scale * flip}, ${scale})`,
      });
    }
  }
  document.body.appendChild(layer);

  // 1) Cubrir: de los bordes hacia el centro, con algo de azar
  const COVER = 700;
  const coverAnims = leaves.map(({ el, d, transform }) => {
    const delay = (1 - d) * 650 + rand(0, 250);
    return el.animate(
      [
        { opacity: 0, transform: `${transform} scale(.6) rotate(-25deg)` },
        { opacity: 1, transform },
      ],
      { duration: COVER, delay, easing: EASE, fill: 'forwards' },
    );
  });
  Object.values(veils).forEach((v) =>
    v.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 300, easing: EASE, fill: 'forwards' }),
  );
  await Promise.all(coverAnims.map((a) => a.finished));
  onCovered?.();

  // 2) Pausa con la pantalla cubierta
  await wait(holdMs);
  onClearing?.();

  // 3) Niebla despejándose: cada mitad se va hacia su lado, empezando por el centro
  const CLEAR = 1300;
  const clearAnims = leaves.map(({ el, x, d, transform }) => {
    const dir = x < cx ? -1 : 1;
    return el.animate(
      [
        { opacity: 1, transform, filter: 'blur(0px)' },
        { opacity: 0, transform: `translateX(${dir * 70}vw) ${transform}`, filter: 'blur(8px)' },
      ],
      { duration: CLEAR, delay: d * 450, easing: EASE, fill: 'forwards' },
    );
  });
  (['left', 'right'] as const).forEach((side) =>
    veils[side].animate(
      [
        { opacity: 1, transform: 'translateX(0)', filter: 'blur(0px)' },
        { opacity: 0, transform: `translateX(${side === 'left' ? -60 : 60}%)`, filter: 'blur(12px)' },
      ],
      { duration: CLEAR + 200, easing: EASE, fill: 'forwards' },
    ),
  );
  await Promise.all(clearAnims.map((a) => a.finished));
  layer.remove();
}
