/* ═══════════════════════════════════════════
   SPLINE 3D — vanilla runtime via ESM CDN
═══════════════════════════════════════════ */
async function initSpline() {
  const canvas = document.getElementById('splineCanvas');
  const loader = document.getElementById('splineLoader');
  if (!canvas) return;

  /* Progressive enhancement: skip on very slow connections or reduced-motion */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSlowConn = navigator.connection?.effectiveType === '2g';
  if (prefersReduced || isSlowConn) {
    showSplineFallback(loader);
    return;
  }

  try {
    /* @splinetool/runtime — vanilla JS, no React required */
    const { Application } = await import(
      'https://unpkg.com/@splinetool/runtime@1.9.28/build/runtime.module.js'
    );

    const app = new Application(canvas);
    await app.load('https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');

    /* Hide loader once scene is ready */
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }

  } catch (err) {
    console.warn('[SensoPrint] Spline scene failed to load:', err.message);
    showSplineFallback(loader);
  }
}

function showSplineFallback(loader) {
  if (!loader) return;
  /* Render an animated gradient as fallback */
  loader.innerHTML = '';
  const right = document.querySelector('.hero-right');
  if (right) {
    right.style.background = `
      radial-gradient(ellipse 70% 70% at 60% 40%, rgba(94,207,168,.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 40% 60%, rgba(184,169,245,.10) 0%, transparent 55%)
    `;
  }
}

/* ═══════════════════════════════════════════
   3D TILT on .product-card and .bento-card
═══════════════════════════════════════════ */
function initCardTilt() {
  const MAX_TILT  = 14;
  const SPEED_IN  = 0.09;
  const SPEED_OUT = 0.5;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function bind(card) {
    if (card._tilt) return;
    card._tilt = true;

    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    let hovering = false;
    let raf = null;

    function tick() {
      const speed = hovering ? SPEED_IN : SPEED_OUT;
      curX = lerp(curX, targetX, speed);
      curY = lerp(curY, targetY, speed);

      if (hovering) {
        card.style.transform  = `perspective(700px) rotateY(${curX}deg) rotateX(${curY}deg) translateY(-8px) scale(1.025)`;
        card.style.boxShadow  = `${-curX * 1.2}px ${curY * 0.8 + 16}px 48px rgba(0,0,0,.5),
          0 0 0 1px rgba(94,207,168,${0.07 + Math.abs(curX + curY) * 0.005})`;
      } else {
        card.style.transform  = `perspective(700px) rotateY(${curX}deg) rotateX(${curY}deg)`;
        if (Math.abs(curX) < 0.08 && Math.abs(curY) < 0.08) {
          card.style.transform = '';
          card.style.boxShadow = '';
          return;                          /* stop RAF when at rest */
        }
      }
      raf = requestAnimationFrame(tick);
    }

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width  - 0.5) * MAX_TILT * 2;
      targetY = ((e.clientY - rect.top)  / rect.height - 0.5) * -MAX_TILT * 1.5;
    });

    card.addEventListener('mouseenter', () => {
      hovering = true;
      card.style.transition = 'box-shadow .15s';
      cancelAnimationFrame(raf);
      tick();
    });

    card.addEventListener('mouseleave', () => {
      hovering  = false;
      targetX   = 0;
      targetY   = 0;
      card.style.transition = 'transform .6s cubic-bezier(0.34,1.56,0.64,1), box-shadow .4s';
    });
  }

  function bindAll() {
    document.querySelectorAll('.product-card, .bento-card').forEach(bind);
  }

  bindAll();

  /* Re-bind when new cards are injected by renderDestaques / renderCatalog */
  new MutationObserver(bindAll).observe(document.body, { childList: true, subtree: true });
}
