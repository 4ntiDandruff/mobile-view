// content.js - Mobile View Liquid Apple Ultra-Enak Edition (v2.2)

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
      shortName: 'iPhone 15',
      width: 393,
      height: 852,
      radius: 54,
      bezel: 12,
      platform: 'ios'
    },
    galaxys24: {
      name: 'Samsung Galaxy S24',
      shortName: 'Galaxy S24',
      width: 412,
      height: 915,
      radius: 42,
      bezel: 10,
      platform: 'android'
    },
    iphonese: {
      name: 'iPhone SE (3rd Gen)',
      shortName: 'iPhone SE',
      width: 375,
      height: 667,
      radius: 28,
      bezel: 12,
      platform: 'ios'
    },
    pixel8: {
      name: 'Google Pixel 8',
      shortName: 'Pixel 8',
      width: 412,
      height: 892,
      radius: 44,
      bezel: 11,
      platform: 'android'
    },
    iphone14: {
      name: 'iPhone 14 / 13',
      shortName: 'iPhone 14',
      width: 390,
      height: 844,
      radius: 47,
      bezel: 12,
      platform: 'ios'
    },
    ipadmini: {
      name: 'iPad Mini (6th Gen)',
      shortName: 'iPad Mini',
      width: 768,
      height: 1024,
      radius: 32,
      bezel: 16,
      platform: 'tablet'
    }
  };

  let state = {
    activeDeviceKey: localStorage.getItem('mv_device') || 'iphone15pro',
    isLandscape: localStorage.getItem('mv_landscape') === 'true',
    scaleMode: localStorage.getItem('mv_scale_mode') || 'fit',
    zoom: 1.0,
    originalOverflowHtml: '',
    originalOverflowBody: ''
  };

  /**
   * Menghitung zoom scale adaptif agar frame pas dengan monitor
   */
  function calculateFitScale(devW, devH) {
    const availH = window.innerHeight - 90;
    const availW = window.innerWidth - 40;
    const scaleH = availH / devH;
    const scaleW = availW / devW;
    const best = Math.min(scaleH, scaleW, 1.0);
    return Math.max(0.35, Math.min(1.0, Math.round(best * 100) / 100));
  }

  /**
   * Update geometri dan tampilan visual frame HP (Bebas Obstruksi)
   */
  function updateChassisView() {
    const overlay = document.getElementById('mv-studio-overlay');
    if (!overlay) return;

    const dev = DEVICES[state.activeDeviceKey] || DEVICES.iphone15pro;
    const screenW = state.isLandscape ? dev.height : dev.width;
    const screenH = state.isLandscape ? dev.width : dev.height;
    const totalW = screenW + (dev.bezel * 2);
    const totalH = screenH + (dev.bezel * 2);
    const innerRadius = Math.max(6, dev.radius - dev.bezel);

    const frameEl = document.getElementById('mv-phone-frame');
    const screenContainer = document.getElementById('mv-screen-container');
    const scaleWrapper = document.getElementById('mv-scale-wrapper');
    const hwButtonsContainer = document.getElementById('mv-hw-buttons');
    const dimBadge = document.getElementById('mv-dim-badge');

    if (!frameEl || !scaleWrapper) return;

    // 1. Terapkan Dimensi & Radius
    frameEl.style.width = totalW + 'px';
    frameEl.style.height = totalH + 'px';
    frameEl.style.borderRadius = dev.radius + 'px';
    frameEl.style.padding = dev.bezel + 'px';

    if (screenContainer) {
      screenContainer.style.borderRadius = innerRadius + 'px';
    }

    // 2. Skala Zoom
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
      if (dev.platform !== 'tablet') {
        if (!state.isLandscape) {
          hwButtonsContainer.innerHTML = `
            <div class="mv-btn-hw" style="top: 90px; left: -14px; width: 4px; height: 26px;"></div>
            <div class="mv-btn-hw" style="top: 130px; left: -14px; width: 4px; height: 48px;"></div>
            <div class="mv-btn-hw" style="top: 190px; left: -14px; width: 4px; height: 48px;"></div>
            <div class="mv-btn-hw" style="top: 140px; right: -14px; width: 4px; height: 70px;"></div>
          `;
        } else {
          hwButtonsContainer.innerHTML = `
            <div class="mv-btn-hw" style="top: -14px; left: 90px; width: 26px; height: 4px;"></div>
            <div class="mv-btn-hw" style="top: -14px; left: 130px; width: 48px; height: 4px;"></div>
            <div class="mv-btn-hw" style="top: -14px; left: 190px; width: 48px; height: 4px;"></div>
            <div class="mv-btn-hw" style="bottom: -14px; right: 140px; width: 70px; height: 4px;"></div>
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

    const fitBtn = document.getElementById('mv-fit-btn');
    const z75Btn = document.getElementById('mv-z75-btn');
    const z100Btn = document.getElementById('mv-z100-btn');

    if (fitBtn) fitBtn.classList.toggle('mv-active', state.scaleMode === 'fit');
    if (z75Btn) z75Btn.classList.toggle('mv-active', state.scaleMode === '0.75');
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
   * Membuat dan Memunculkan Overlay Studio Liquid Apple Ultra-Enak
   */
  function openMobileView() {
    if (document.getElementById('mv-studio-overlay')) return;

    state.originalOverflowHtml = document.documentElement.style.overflow;
    state.originalOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const overlay = document.createElement('div');
    overlay.id = 'mv-studio-overlay';

    // HTML Struktur Overlay
    overlay.innerHTML = `
      <!-- Topbar Studio (Cupertino Frosted Crystal) -->
      <div id="mv-topbar">
        <!-- Brand & Quick Device Segmented Chips -->
        <div class="mv-group">
          <div class="mv-brand">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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

          <!-- Rotate Button -->
          <button id="mv-rot-btn" class="mv-btn ${state.isLandscape ? 'mv-btn-active' : ''}" title="Putar Layar (Tekan 'R')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>Putar</span>
            <span class="mv-kbd">R</span>
          </button>

          <!-- Real-Time Dimension Pill -->
          <div id="mv-dim-badge" class="mv-dim-pill">393 × 852 px</div>
        </div>

        <!-- Center: Primary Active Radar Beacon Hint -->
        <div class="mv-inspect-hint">
          <div class="mv-beacon"></div>
          <span>Klik kanan di layar HP ➜ Inspect (F12)</span>
        </div>

        <!-- Right: Segmented Zoom, Reload, & Close -->
        <div class="mv-group">
          <!-- Neomorphic Segmented Track for Zoom -->
          <div class="mv-neo-groove">
            <button id="mv-fit-btn" class="mv-tab-pill ${state.scaleMode === 'fit' ? 'mv-active' : ''}">Fit</button>
            <button id="mv-z75-btn" class="mv-tab-pill ${state.scaleMode === '0.75' ? 'mv-active' : ''}">75%</button>
            <button id="mv-z100-btn" class="mv-tab-pill ${state.scaleMode === '1.0' ? 'mv-active' : ''}">100%</button>
          </div>

          <!-- Reload Button with Rotation -->
          <button id="mv-reload-btn" class="mv-btn" title="Segarkan Halaman (Reload)">
            <svg id="mv-reload-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 21h5v-5"/>
            </svg>
          </button>

          <!-- Close / Back to Desktop -->
          <button id="mv-close-btn" class="mv-btn mv-btn-close" title="Kembali ke Desktop (Esc / Alt+M)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            <span>Tutup</span>
            <span class="mv-kbd">Esc</span>
          </button>
        </div>
      </div>

      <!-- Canvas Area -->
      <div id="mv-canvas">
        <div id="mv-scale-wrapper">
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

    document.getElementById('mv-fit-btn').addEventListener('click', () => {
      state.scaleMode = 'fit';
      localStorage.setItem('mv_scale_mode', 'fit');
      updateChassisView();
    });

    document.getElementById('mv-z75-btn').addEventListener('click', () => {
      state.scaleMode = '0.75';
      localStorage.setItem('mv_scale_mode', '0.75');
      updateChassisView();
    });

    document.getElementById('mv-z100-btn').addEventListener('click', () => {
      state.scaleMode = '1.0';
      localStorage.setItem('mv_scale_mode', '1.0');
      updateChassisView();
    });

    document.getElementById('mv-reload-btn').addEventListener('click', () => {
      const svg = document.getElementById('mv-reload-svg');
      if (svg) {
        svg.style.transform = 'rotate(360deg)';
        svg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          svg.style.transition = 'none';
          svg.style.transform = 'rotate(0deg)';
        }, 400);
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

  // 2. Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Tombol Esc untuk menutup overlay
    if (e.key === 'Escape') {
      const existing = document.getElementById('mv-studio-overlay');
      if (existing) {
        closeMobileView();
      }
      return;
    }

    // Tombol R untuk rotasi saat overlay aktif
    if ((e.key === 'r' || e.key === 'R') && document.getElementById('mv-studio-overlay')) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        state.isLandscape = !state.isLandscape;
        localStorage.setItem('mv_landscape', state.isLandscape);
        updateChassisView();
      }
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
