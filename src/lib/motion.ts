export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Observa los elementos [data-reveal] y les agrega .is-visible al entrar en pantalla. */
export function initReveal(root: ParentNode = document) {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-motion');

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }),
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
  );

  const observe = (scope: ParentNode) =>
    scope.querySelectorAll<HTMLElement>('[data-reveal]:not([data-rv])').forEach((el) => {
      el.dataset.rv = '1';
      const d = Number(el.dataset.revealDelay || 0);
      if (d) el.style.setProperty('--reveal-delay', `${d}ms`);
      io.observe(el);
    });

  observe(root);
  return observe;
}

/** Lluvia de confeti de estrellitas y corazones. */
export function confetti() {
  if (prefersReducedMotion()) return;
  const glyphs = ['✦', '★', '●', '✦', '♥'];
  const cols = ['#AEC0A8', '#7D9478', '#ECE4D8', '#C9A961', '#D3DFCF'];
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;z-index:110;pointer-events:none;overflow:hidden';
  for (let i = 0; i < 46; i++) {
    const s = document.createElement('span');
    s.textContent = glyphs[i % glyphs.length];
    const dur = 2.6 + Math.random() * 1.6;
    s.style.cssText = [
      'position:absolute',
      'top:0',
      `left:${Math.random() * 100}%`,
      `font-size:${12 + Math.random() * 14}px`,
      `color:${cols[i % cols.length]}`,
      `--dx:${(Math.random() - 0.5) * 140}px`,
      `--rot:${(Math.random() - 0.5) * 720}deg`,
      `animation:fall ${dur}s cubic-bezier(.3,.6,.5,1) ${Math.random() * 0.9}s both`,
    ].join(';');
    layer.appendChild(s);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 5500);
}
