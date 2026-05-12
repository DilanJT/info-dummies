const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

class HeroParallax {
  constructor(el) {
    this.el = el;
    this.media = el.querySelector('.hero__media-grid');
    if (!this.media) return;

    this.range = parseFloat(el.dataset.parallaxRange) || 120;
    this.ticking = false;
    this.inView = false;

    this.update = this.update.bind(this);
    this.onScroll = this.onScroll.bind(this);

    if (REDUCED_MOTION.matches) return;

    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        this.inView = entry.isIntersecting;
        if (this.inView) {
          window.addEventListener('scroll', this.onScroll, { passive: true });
          this.update();
        } else {
          window.removeEventListener('scroll', this.onScroll);
        }
      }
    });
    this.observer.observe(el);
  }

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }
  }

  update() {
    const rect = this.el.getBoundingClientRect();
    const vh = window.innerHeight;
    const denom = vh + rect.height;
    const progress = denom > 0 ? (vh - rect.top) / denom : 0;
    const clamped = Math.max(0, Math.min(1, progress));
    const offset = (clamped - 0.5) * this.range;
    this.media.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    this.ticking = false;
  }
}

const init = () => {
  document.querySelectorAll('.hero[data-parallax="true"]').forEach((el) => {
    if (el.dataset.parallaxInit === 'true') return;
    el.dataset.parallaxInit = 'true';
    new HeroParallax(el);
  });
};

if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

document.addEventListener('shopify:section:load', init);
