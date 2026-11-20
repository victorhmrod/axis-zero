/**
 * Axis Zero · motion
 * Tudo aqui é aprimoramento progressivo: sem JS (ou com prefers-reduced-motion)
 * a página aparece completa e parada.
 */
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

const ready = (fn: () => void) => {
  if (root.classList.contains('is-ready')) fn();
  else window.addEventListener('az:ready', fn, { once: true });
};
const markReady = () => {
  if (root.classList.contains('is-ready')) return;
  root.classList.add('is-ready');
  window.dispatchEvent(new Event('az:ready'));
};

/* ---------------------------------------------------------------
   1. Loader: o "O" se monta de baixo para cima (a primeira camada
      é a laranja) e a tela se abre em 12 faixas.
   --------------------------------------------------------------- */
function runLoader() {
  if (!root.classList.contains('is-loading')) return;
  const nEl = document.querySelector<HTMLElement>('[data-loader-n]');
  const lEl = document.querySelector<HTMLElement>('[data-loader-l]');
  const DUR = 1700;
  const t0 = performance.now();
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    window.setTimeout(() => {
      root.classList.add('loader-out');
      markReady();
      try { sessionStorage.setItem('az-loader', '1'); } catch {}
      window.setTimeout(() => root.classList.remove('is-loading', 'loader-out'), 1300);
    }, 260);
  };

  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / DUR);
    const e = 1 - Math.pow(1 - k, 2.2);
    if (nEl) nEl.textContent = String(Math.round(e * 100)).padStart(3, '0');
    if (lEl) lEl.textContent = `Camada ${String(Math.round(e * 12)).padStart(2, '0')} / 12`;
    if (k < 1) requestAnimationFrame(step);
    else finish();
  };
  requestAnimationFrame(step);
  window.setTimeout(finish, 5000); // rede de segurança
}

/* ---------------------------------------------------------------
   2. Reveal ao rolar + contadores
   --------------------------------------------------------------- */
function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const t0 = performance.now();
  const dur = 1100;
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = String(Math.round((1 - Math.pow(1 - k, 3)) * target));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function startReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add('in');
        el.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
        if (el.dataset.count) countUp(el);
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------
   3. Header encolhe + barra de progresso de leitura
   --------------------------------------------------------------- */
function scrollUi() {
  const header = document.querySelector<HTMLElement>('.header');
  const bar = document.querySelector<HTMLElement>('.progress');
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 24);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* ---------------------------------------------------------------
   4. Tilt 3D + brilho que segue o cursor
   --------------------------------------------------------------- */
function tilt() {
  if (reduce || !finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt) || 6;
    el.addEventListener('pointerenter', () => el.classList.add('is-tilting'));
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--px', px.toFixed(3));
      el.style.setProperty('--py', py.toFixed(3));
      el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-tilting');
      el.style.transform = '';
      el.style.setProperty('--px', '0');
      el.style.setProperty('--py', '0');
    });
  });
}

/* ---------------------------------------------------------------
   5. Botões magnéticos
   --------------------------------------------------------------- */
function magnetic() {
  if (reduce || !finePointer) return;
  const btns = [...document.querySelectorAll<HTMLElement>('.btn:not(.btn--sm)')];
  if (!btns.length) return;
  let raf = 0;
  window.addEventListener('pointermove', (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      btns.forEach((b) => {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < Math.max(r.width, 120) * 0.8;
        b.style.setProperty('--tx', near ? `${(dx * 0.18).toFixed(1)}px` : '0px');
        b.style.setProperty('--ty', near ? `${(dy * 0.28).toFixed(1)}px` : '0px');
      });
    });
  }, { passive: true });
}

/* ---------------------------------------------------------------
   6. Faixas em movimento (aceleram com a rolagem)
   --------------------------------------------------------------- */
function marquees() {
  const tracks = [...document.querySelectorAll<HTMLElement>('[data-marquee]')];
  if (reduce || !tracks.length || !('animate' in Element.prototype)) return;

  const anims = tracks.map((track) => {
    const reverse = track.dataset.marquee === 'right';
    const seconds = Number(track.dataset.speed) || 40;
    const frames = reverse
      ? [{ transform: 'translateX(-50%)' }, { transform: 'translateX(0)' }]
      : [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }];
    const a = track.animate(frames, { duration: seconds * 1000, iterations: Infinity, easing: 'linear' });
    if (track.dataset.pause !== undefined) {
      track.parentElement?.addEventListener('pointerenter', () => a.pause());
      track.parentElement?.addEventListener('pointerleave', () => a.play());
    }
    return a;
  });

  let lastY = window.scrollY;
  let lastT = performance.now();
  let boost = 0;
  window.addEventListener('scroll', () => {
    const now = performance.now();
    const v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT);
    boost = Math.min(7, boost + v * 1.4);
    lastY = window.scrollY;
    lastT = now;
  }, { passive: true });

  const loop = () => {
    boost *= 0.94;
    anims.forEach((a) => { if (a.playState === 'running') a.playbackRate = 1 + boost; });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ---------------------------------------------------------------
   7. Cursor próprio: ponto exato + anel com atraso que reage ao que
      está embaixo (links, cards, campos).
   --------------------------------------------------------------- */
function cursor() {
  if (reduce || !finePointer) return;
  const el = document.querySelector<HTMLElement>('.cursor');
  const ring = el?.querySelector<HTMLElement>('.cursor__ring');
  const dot = el?.querySelector<HTMLElement>('.cursor__dot');
  const label = el?.querySelector<HTMLElement>('.cursor__label');
  if (!el || !ring || !dot || !label) return;

  root.classList.add('has-cursor');
  let x = -100, y = -100, rx = -100, ry = -100, seen = false;

  window.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    if (!seen) { seen = true; rx = x; ry = y; el.classList.add('on'); }
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, { passive: true });
  document.addEventListener('pointerleave', () => el.classList.remove('on'));
  document.addEventListener('pointerenter', () => seen && el.classList.add('on'));

  const LINKS = 'a, button, summary, label, select, input, [data-cursor]';
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as Element | null)?.closest<HTMLElement>(LINKS);
    el.classList.toggle('is-link', !!t);
    const text = t?.dataset.cursor ?? '';
    label.textContent = text;
    el.classList.toggle('has-label', !!text);
  });
  window.addEventListener('pointerdown', () => el.classList.add('is-down'));
  window.addEventListener('pointerup', () => el.classList.remove('is-down'));

  const loop = () => {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ---------------------------------------------------------------
   8. Campo de camadas: linhas horizontais atrás do site que se
      curvam ao redor do mouse; o clique solta uma onda.
   --------------------------------------------------------------- */
function field() {
  if (reduce || !finePointer) return;
  const canvas = document.querySelector<HTMLCanvasElement>('.field');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const GAP = 34, STEP = 14, RADIUS = 240, SIGMA = 95;
  let w = 0, h = 0, dpr = 1;
  let tx = -999, ty = -999, mx = -999, my = -999;
  let lastActive = 0;
  let scrollOff = 0;
  const waves: { x: number; y: number; t0: number }[] = [];

  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lastActive = performance.now();
  };
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    if (mx === -999) { mx = e.clientX; my = e.clientY; }
    tx = e.clientX; ty = e.clientY;
    lastActive = performance.now();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { tx = ty = -999; mx = my = -999; lastActive = performance.now(); });
  window.addEventListener('pointerdown', (e) => {
    waves.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
    lastActive = performance.now();
  });
  window.addEventListener('scroll', () => { scrollOff = (window.scrollY * 0.22) % GAP; lastActive = performance.now(); }, { passive: true });

  const displace = (x: number, y: number, now: number) => {
    let ox = 0, oy = 0;
    if (mx > -900) {
      const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy) || 1;
      const f = Math.exp(-(d * d) / (2 * SIGMA * SIGMA)) * 34;
      ox += (dx / d) * f; oy += (dy / d) * f;
    }
    for (const wv of waves) {
      const age = (now - wv.t0) / 1000;
      const dx = x - wv.x, dy = y - wv.y, d = Math.hypot(dx, dy) || 1;
      const a = 26 * Math.exp(-age * 1.7) * Math.exp(-Math.pow((d - age * 560) / 50, 2));
      ox += (dx / d) * a; oy += (dy / d) * a;
    }
    return [x + ox, y + oy] as const;
  };

  const frame = (now: number) => {
    requestAnimationFrame(frame);
    for (let i = waves.length - 1; i >= 0; i--) if (now - waves[i].t0 > 1800) waves.splice(i, 1);
    const active = now - lastActive < 1600 || waves.length > 0;
    if (!active || document.hidden) return;

    mx += (tx - mx) * 0.2; my += (ty - my) * 0.2;
    if (tx === -999) { mx = my = -999; }

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;

    // base: linhas marfim bem discretas
    ctx.strokeStyle = 'rgba(242, 235, 221, 0.055)';
    ctx.beginPath();
    const near: [number, number, number, number, number][] = [];
    for (let y0 = -GAP + scrollOff; y0 < h + GAP; y0 += GAP) {
      let px = 0, py = 0;
      for (let x = 0; x <= w + STEP; x += STEP) {
        const [X, Y] = displace(x, y0, now);
        if (x === 0) ctx.moveTo(X, Y); else {
          ctx.lineTo(X, Y);
          if (mx > -900) {
            const d = Math.hypot(X - mx, Y - my);
            if (d < RADIUS) near.push([px, py, X, Y, 1 - d / RADIUS]);
          }
        }
        px = X; py = Y;
      }
    }
    ctx.stroke();

    // realce laranja perto do cursor
    for (const [x1, y1, x2, y2, k] of near) {
      ctx.strokeStyle = `rgba(232, 100, 26, ${(k * k * 0.55).toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
  };
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------------
   9. O símbolo do hero reage ao cursor: as faixas perto do mouse
      engordam e esquentam para laranja (as camadas "derretem").
   --------------------------------------------------------------- */
function reactiveSymbol() {
  if (reduce || !finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-reactive]').forEach((host) => {
    const svg = host.querySelector<SVGSVGElement>('.symbol-o');
    if (!svg) return;
    const stripes = [...svg.querySelectorAll<SVGRectElement>('.stripe')];
    const reset = () => stripes.forEach((s) => { s.style.scale = ''; s.style.fill = ''; });
    host.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const cy = ((e.clientY - r.top) / r.height) * 300;
      const cx = (e.clientX - r.left) / r.width;
      const inside = cx > -0.4 && cx < 1.4;
      stripes.forEach((s) => {
        const yc = Number(s.getAttribute('y')) + Number(s.getAttribute('height')) / 2;
        const g = inside ? Math.exp(-Math.pow((yc - cy) / 42, 2)) : 0;
        s.style.scale = `1 ${(1 + g * 0.5).toFixed(3)}`;
        s.style.fill = g > 0.45 ? 'var(--orange)' : '';
      });
    });
    host.addEventListener('pointerleave', reset);
  });
}

/* ---------------------------------------------------------------
   Início
   --------------------------------------------------------------- */
runLoader();
scrollUi();
tilt();
magnetic();
marquees();
cursor();
field();
reactiveSymbol();
ready(startReveal);
