// preview.js - Standalone Studio Controller (Liquid Apple Unified v2.7)
// 100% Konsisten dengan content.js (In-Page Overlay)

(function () {
  const DEVICES = {
    iphone15pro: {
      name: 'iPhone 15 Pro',
      shortName: 'iPhone 15 Pro',
      width: 393,
      height: 852,
      radius: 26,
      bezel: 7,
      platform: 'ios'
    },
    galaxys24: {
      name: 'Samsung Galaxy S24',
      shortName: 'Galaxy S24',
      width: 412,
      height: 915,
      radius: 22,
      bezel: 6,
      platform: 'android'
    },
    iphonese: {
      name: 'iPhone SE (3rd Gen)',
      shortName: 'iPhone SE',
      width: 375,
      height: 667,
      radius: 18,
      bezel: 7,
      platform: 'ios'
    },
    ipadmini: {
      name: 'iPad Mini (6th Gen)',
      shortName: 'iPad Mini',
      width: 768,
      height: 1024,
      radius: 20,
      bezel: 8,
      platform: 'tablet'
    }
  };

  let state = {
    activeDeviceKey: localStorage.getItem('mv_device') || 'iphone15pro',
    isLandscape: localStorage.getItem('mv_landscape') === 'true',
    scaleMode: localStorage.getItem('mv_scale_mode') || 'fit',
    showFrame: localStorage.getItem('mv_frame') !== 'false',
    theme: localStorage.getItem('mv_theme') || 'dark',
    zoom: 1.0,
    currentUrl: 'https://google.com'
  };

  // Baca target URL dari query parameter (?url=https://...)
  const params = new URLSearchParams(window.location.search);
  let target = params.get('url');
  if (target && target !== 'about:blank') {
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('file://')) {
      target = 'https://' + target;
    }
    state.currentUrl = target;
  }

  function calculateFitScale(devW, devH) {
    const availH = window.innerHeight - 78;
    const availW = window.innerWidth - 32;
    const scaleH = availH / devH;
    const scaleW = availW / devW;
    const best = Math.min(scaleH, scaleW);
    return Math.min(1.0, Math.max(0.3, Math.round(best * 100) / 100));
  }

  function updateChassisView() {
    const bodyEl = document.body;
    if (!bodyEl) return;

    // Terapkan tema Liquid Apple
    bodyEl.classList.toggle('mv-theme-light', state.theme === 'light');

    const dev = DEVICES[state.activeDeviceKey] || DEVICES.iphone15pro;
    const screenW = state.isLandscape ? dev.height : dev.width;
    const screenH = state.isLandscape ? dev.width : dev.height;
    const currentBezel = state.showFrame ? dev.bezel : 0;
    const totalW = screenW + (currentBezel * 2);
    const totalH = screenH + (currentBezel * 2);
    const innerRadius = Math.max(6, dev.radius - currentBezel);

    const frameEl = document.getElementById('mv-phone-frame');
    const screenContainer = document.getElementById('mv-screen-container');
    const scaleWrapper = document.getElementById('mv-scale-wrapper');
    const hwButtonsContainer = document.getElementById('mv-hw-buttons');
    const dimBadge = document.getElementById('mv-dim-badge');
    const frameToggleBtn = document.getElementById('mv-frame-btn');
    const themeBtn = document.getElementById('mv-theme-btn');

    if (!frameEl || !scaleWrapper) return;

    // Toggle class frameless
    scaleWrapper.classList.toggle('mv-frameless', !state.showFrame);

    // 1. Terapkan Dimensi & Radius Presisi (Concentric Radii)
    frameEl.style.width = totalW + 'px';
    frameEl.style.height = totalH + 'px';
    frameEl.style.borderRadius = dev.radius + 'px';
    frameEl.style.padding = currentBezel + 'px';

    if (screenContainer) {
      screenContainer.style.borderRadius = innerRadius + 'px';
    }

    // 2. Skala Zoom Adaptif
    if (state.scaleMode === 'fit') {
      state.zoom = calculateFitScale(totalW, totalH);
    } else {
      state.zoom = parseFloat(state.scaleMode) || 1.0;
    }
    scaleWrapper.style.transform = `scale(${state.zoom})`;

    // 3. Update Badge Dimensi Monospace
    if (dimBadge) {
      dimBadge.textContent = `${screenW} × ${screenH} px`;
    }

    // 4. Tombol Fisik Samping (Hardware Buttons di Sisi Luar Bezel)
    if (hwButtonsContainer) {
      hwButtonsContainer.innerHTML = '';
      if (dev.platform !== 'tablet' && state.showFrame) {
        if (!state.isLandscape) {
          hwButtonsContainer.innerHTML = `
            <div class="mv-btn-hw" style="top: 80px; left: -7px; width: 3px; height: 24px;"></div>
            <div class="mv-btn-hw" style="top: 115px; left: -7px; width: 3px; height: 42px;"></div>
            <div class="mv-btn-hw" style="top: 168px; left: -7px; width: 3px; height: 42px;"></div>
            <div class="mv-btn-hw" style="top: 125px; right: -7px; width: 3px; height: 65px;"></div>
          `;
        } else {
          hwButtonsContainer.innerHTML = `
            <div class="mv-btn-hw" style="top: -7px; left: 80px; width: 24px; height: 3px;"></div>
            <div class="mv-btn-hw" style="top: -7px; left: 115px; width: 42px; height: 3px;"></div>
            <div class="mv-btn-hw" style="top: -7px; left: 168px; width: 42px; height: 3px;"></div>
            <div class="mv-btn-hw" style="bottom: -7px; right: 125px; width: 65px; height: 3px;"></div>
          `;
        }
      }
    }

    // 5. Update Status Active Segmented Pills
    document.querySelectorAll('.mv-dev-chip').forEach(btn => {
      const key = btn.getAttribute('data-dev');
      btn.classList.toggle('mv-active', key === state.activeDeviceKey);
    });

    const rotBtn = document.getElementById('mv-rot-btn');
    if (rotBtn) {
      rotBtn.classList.toggle('mv-btn-active', state.isLandscape);
      const rotIcon = rotBtn.querySelector('svg');
      if (rotIcon) {
        rotIcon.style.transform = state.isLandscape ? 'rotate(90deg)' : 'rotate(0deg)';
        rotIcon.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    }

    if (frameToggleBtn) {
      frameToggleBtn.classList.toggle('mv-btn-active', state.showFrame);
    }

    if (themeBtn) {
      const sunIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
      const moonIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
      themeBtn.innerHTML = `${state.theme === 'light' ? moonIcon : sunIcon}<span class="mv-kbd">T</span>`;
      themeBtn.title = state.theme === 'light' ? "Beralih ke Mode Gelap (Tekan 'T')" : "Beralih ke Mode Terang (Tekan 'T')";
    }

    const fitBtn = document.getElementById('mv-fit-btn');
    const z100Btn = document.getElementById('mv-z100-btn');

    if (fitBtn) fitBtn.classList.toggle('mv-active', state.scaleMode === 'fit');
    if (z100Btn) z100Btn.classList.toggle('mv-active', state.scaleMode === '1.0');
  }

  // Inisialisasi Iframe
  const iframe = document.getElementById('mv-viewport-iframe');
  if (iframe && state.currentUrl) {
    iframe.src = state.currentUrl;
  }

  // Bindings Event Listener
  document.querySelectorAll('.mv-dev-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.currentTarget.getAttribute('data-dev');
      state.activeDeviceKey = key;
      localStorage.setItem('mv_device', key);
      updateChassisView();
    });
  });

  const rotBtn = document.getElementById('mv-rot-btn');
  if (rotBtn) {
    rotBtn.addEventListener('click', () => {
      state.isLandscape = !state.isLandscape;
      localStorage.setItem('mv_landscape', state.isLandscape);
      updateChassisView();
    });
  }

  const frameBtn = document.getElementById('mv-frame-btn');
  if (frameBtn) {
    frameBtn.addEventListener('click', () => {
      state.showFrame = !state.showFrame;
      localStorage.setItem('mv_frame', state.showFrame);
      updateChassisView();
    });
  }

  const fitBtn = document.getElementById('mv-fit-btn');
  if (fitBtn) {
    fitBtn.addEventListener('click', () => {
      state.scaleMode = 'fit';
      localStorage.setItem('mv_scale_mode', 'fit');
      updateChassisView();
    });
  }

  const z100Btn = document.getElementById('mv-z100-btn');
  if (z100Btn) {
    z100Btn.addEventListener('click', () => {
      state.scaleMode = '1.0';
      localStorage.setItem('mv_scale_mode', '1.0');
      updateChassisView();
    });
  }

  const themeBtn = document.getElementById('mv-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('mv_theme', state.theme);
      updateChassisView();
    });
  }

  const reloadBtn = document.getElementById('mv-reload-btn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      const svg = document.getElementById('mv-reload-svg');
      if (svg) {
        svg.style.transform = 'rotate(360deg)';
        svg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          svg.style.transition = 'none';
          svg.style.transform = 'rotate(0deg)';
        }, 400);
      }
      if (iframe) {
        iframe.src = state.currentUrl;
      }
    });
  }

  const closeBtn = document.getElementById('mv-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
    });
  }

  // Keyboard Shortcuts: R (rotate), F (frame), T (theme), Esc (close)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
      return;
    }

    if (e.key === 'r' || e.key === 'R') {
      state.isLandscape = !state.isLandscape;
      localStorage.setItem('mv_landscape', state.isLandscape);
      updateChassisView();
    } else if (e.key === 'f' || e.key === 'F') {
      state.showFrame = !state.showFrame;
      localStorage.setItem('mv_frame', state.showFrame);
      updateChassisView();
    } else if (e.key === 't' || e.key === 'T') {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('mv_theme', state.theme);
      updateChassisView();
    }
  });

  window.addEventListener('resize', () => {
    if (state.scaleMode === 'fit') {
      updateChassisView();
    }
  });

  // Render Perdana
  updateChassisView();
})();
