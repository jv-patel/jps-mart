// script.js - Custom particle system as requested by user

/**
 * Create floating particles inside a container.
 * @param {string} containerId - ID of the container element.
 * @param {string} color - Base colour of particles (hex).
 * @param {number} count - Number of particles to generate.
 */
function createParticles(containerId, color = '#4ec88a', count = 18) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'float-particle';

    const size = Math.random() * 12 + 4; // 4‑16px
    const left = Math.random() * 100; // % across width
    const delay = Math.random() * 6; // seconds
    const duration = Math.random() * 5 + 4; // 4‑9s

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -20px;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(p);
  }
}

// Initialise particles after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => createParticles('antigravity', '#4ec88a', 20));
} else {
  createParticles('antigravity', '#4ec88a', 20);
}
