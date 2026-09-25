// content.js - Mobile View Liquid Apple UI Edition (v3.1)
// 100% Konsisten dengan preview.js (Standalone Studio)

(function () {
  // 1. Sekring Anti-Rekursi: Jangan pernah jalan di dalam iframe
  if (window.self !== window.top) {
    return;
  }

  // Hindari duplikasi inisialisasi
  if (window.__MOBILE_VIEW_INITIALIZED__) {
    return;
  }
  window.__MOBILE_VIEW_INITIALIZED__ = true;

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
    originalOverflowHtml: '',
    originalOverflowBody: ''
  };

  /**
   * Menghitung zoom scale adaptif agar frame pas dengan monitor
   */
  function calculateFitScale(devW, devH) {
    const availH = window.innerHeight - 84;
    const availW = window.innerWidth - 32;
    const scaleH = availH / devH;
    const scaleW = availW / devW;
    const best = Math.min(scaleH, scaleW);
    return Math.min(1.0, Math.max(0.3, Math.round(best * 100) / 100));
  }

  /**
   * Update geometri dan tampilan visual frame HP (Bebas Obstruksi)
   */
  function updateChassisView() {
    const overlay = document.getElementById('mv-studio-overlay');
    if (!overlay) return;

    // Terapkan tema Liquid Apple
    overlay.classList.toggle('mv-theme-light', state.theme === 'light');

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

    // 3. Update Badge Dimensi Monospace dengan Live Beacon Dot
    if (dimBadge) {
      dimBadge.innerHTML = `<span class="mv-dim-dot"></span><span>${screenW} × ${screenH} px</span>`;
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

  /**
   * Menutup Overlay & Mengembalikan ke Tampilan Desktop
   */
  function closeMobileView() {
    const overlay = document.getElementById('mv-studio-overlay');
    if (overlay) {
      overlay.remove();
      document.documentElement.style.overflow = state.originalOverflowHtml;
      document.body.style.overflow = state.originalOverflowBody;
    }
  }

  /**
   * Membuat dan Memunculkan Overlay Studio Liquid Apple UI
   */
  function openMobileView() {
    if (document.getElementById('mv-studio-overlay')) return;

    state.originalOverflowHtml = document.documentElement.style.overflow;
    state.originalOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const overlay = document.createElement('div');
    overlay.id = 'mv-studio-overlay';
    if (state.theme === 'light') {
      overlay.classList.add('mv-theme-light');
    }

    // HTML Struktur Overlay Liquid Apple (100% Identik dengan preview.html)
    overlay.innerHTML = `
      <!-- Topbar Studio (Cupertino Frosted Crystal Island) -->
      <div id="mv-topbar">
        <!-- Brand & Quick Device Segmented Chips -->
        <div class="mv-group">
          <div class="mv-brand">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect width="14" height="20" x="5" y="2" rx="3" ry="3"/>
              <path d="M12 18h.01"/>
            </svg>
            <span>Mobile View</span>
          </div>

          <!-- Quick 1-Click Segmented Devices (Concentric Radii) -->
          <div class="mv-neo-groove">
            <button class="mv-tab-pill mv-dev-chip ${state.activeDeviceKey === 'iphone15pro' ? 'mv-active' : ''}" data-dev="iphone15pro">
              iPhone 15 Pro
            </button>
            <button class="mv-tab-pill mv-dev-chip ${state.activeDeviceKey === 'galaxys24' ? 'mv-active' : ''}" data-dev="galaxys24">
              Galaxy S24
            </button>
            <button class="mv-tab-pill mv-dev-chip ${state.activeDeviceKey === 'iphonese' ? 'mv-active' : ''}" data-dev="iphonese">
              SE
            </button>
            <button class="mv-tab-pill mv-dev-chip ${state.activeDeviceKey === 'ipadmini' ? 'mv-active' : ''}" data-dev="ipadmini">
              iPad
            </button>
          </div>
        </div>

        <!-- Center: Metrics + Rotate + Frame Toggle + Reload -->
        <div class="mv-group">
          <div id="mv-dim-badge" class="mv-dim-pill"><span class="mv-dim-dot"></span><span>393 × 852 px</span></div>

          <!-- Rotate Button -->
          <button id="mv-rot-btn" class="mv-btn ${state.isLandscape ? 'mv-btn-active' : ''}" title="Putar Layar (Tekan 'R')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>Putar</span>
            <span class="mv-kbd">R</span>
          </button>

          <!-- Frame On/Off Toggle Button -->
          <button id="mv-frame-btn" class="mv-btn ${state.showFrame ? 'mv-btn-active' : ''}" title="Saklar Bingkai HP (Tekan 'F')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <rect width="18" height="18" x="3" y="3" rx="4"/>
              <path d="M7 7h10v10H7z" opacity="0.5"/>
            </svg>
            <span>Bingkai</span>
            <span class="mv-kbd">F</span>
          </button>

          <!-- Reload Button -->
          <button id="mv-reload-btn" class="mv-btn" title="Segarkan Layar">
            <svg id="mv-reload-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 21h5v-5"/>
            </svg>
          </button>
        </div>

        <!-- Right: Segmented Zoom, Theme Toggle, & Close -->
        <div class="mv-group">
          <!-- Neomorphic Segmented Track for Zoom -->
          <div class="mv-neo-groove">
            <button id="mv-fit-btn" class="mv-tab-pill ${state.scaleMode === 'fit' ? 'mv-active' : ''}">Fit</button>
            <button id="mv-z100-btn" class="mv-tab-pill ${state.scaleMode === '1.0' ? 'mv-active' : ''}">100%</button>
          </div>

          <!-- Cupertino Theme Toggle (Light / Dark) -->
          <button id="mv-theme-btn" class="mv-btn" title="Ganti Tema (Tekan 'T')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
            <span class="mv-kbd">T</span>
          </button>

          <!-- Close / Back to Desktop -->
          <button id="mv-close-btn" class="mv-btn mv-btn-close" title="Kembali ke Desktop (Esc / Alt+M)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            <span>Tutup</span>
            <span class="mv-kbd">Esc</span>
          </button>
        </div>
      </div>

      <!-- Canvas Area (Clean Floating Center) -->
      <div id="mv-canvas">
        <div id="mv-scale-wrapper">
          <!-- Ambient Diffuse Glow -->
          <div class="mv-ambient-glow"></div>

          <!-- Phone Chassis -->
          <div id="mv-phone-frame" class="mv-phone-frame">
            <!-- Hardware Buttons -->
            <div id="mv-hw-buttons"></div>

            <!-- Screen Viewport (100% Bersih Tanpa Obstruksi Kamera) -->
            <div id="mv-screen-container" class="mv-screen-container">
              <iframe id="mv-viewport-iframe" src="${window.location.href}"></iframe>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event Bindings untuk Quick Device Chips
    document.querySelectorAll('.mv-dev-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-dev');
        state.activeDeviceKey = key;
        localStorage.setItem('mv_device', key);
        updateChassisView();
      });
    });

    document.getElementById('mv-rot-btn').addEventListener('click', () => {
      state.isLandscape = !state.isLandscape;
      localStorage.setItem('mv_landscape', state.isLandscape);
      updateChassisView();
    });

    document.getElementById('mv-frame-btn').addEventListener('click', () => {
      state.showFrame = !state.showFrame;
      localStorage.setItem('mv_frame', state.showFrame);
      updateChassisView();
    });

    document.getElementById('mv-fit-btn').addEventListener('click', () => {
      state.scaleMode = 'fit';
      localStorage.setItem('mv_scale_mode', 'fit');
      updateChassisView();
    });

    document.getElementById('mv-z100-btn').addEventListener('click', () => {
      state.scaleMode = '1.0';
      localStorage.setItem('mv_scale_mode', '1.0');
      updateChassisView();
    });

    document.getElementById('mv-theme-btn').addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('mv_theme', state.theme);
      updateChassisView();
    });

    document.getElementById('mv-reload-btn').addEventListener('click', () => {
      const svg = document.getElementById('mv-reload-svg');
      if (svg) {
        svg.style.transform = 'rotate(360deg)';
        svg.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          svg.style.transition = 'none';
          svg.style.transform = 'rotate(0deg)';
        }, 450);
      }
      const iframe = document.getElementById('mv-viewport-iframe');
      if (iframe) {
        iframe.src = window.location.href;
      }
    });

    document.getElementById('mv-close-btn').addEventListener('click', () => {
      closeMobileView();
    });

    // Render Awal Frame
    updateChassisView();
  }

  /**
   * Saklar Utama: Toggle ON/OFF
   */
  function toggleMobileView() {
    const existing = document.getElementById('mv-studio-overlay');
    if (existing) {
      closeMobileView();
    } else {
      openMobileView();
    }
  }

  // 2. Global Keyboard Shortcuts: Esc (close), R (rotate), F (frame), T (theme)
  window.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('mv-studio-overlay');
    if (!overlay) return;

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape') {
      closeMobileView();
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

  // 3. Listener Resize Jendela
  window.addEventListener('resize', () => {
    if (document.getElementById('mv-studio-overlay') && state.scaleMode === 'fit') {
      updateChassisView();
    }
  });

  // 4. Listener Pesan dari Background Worker (Klik Ikon Toolbar / Shortcut Alt+M)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.action === 'toggle_mobile_view') {
      toggleMobileView();
      sendResponse({ status: 'ok' });
    }
    return true;
  });

})();
