// preview.js - Standalone Studio Controller (Liquid Apple Edition v2.1)

(function () {
  const DEVICES = {
    iphone15pro: { name: 'iPhone 15 Pro', width: 393, height: 852, radius: 54, bezel: 12, platform: 'ios' },
    iphone14: { name: 'iPhone 14', width: 390, height: 844, radius: 47, bezel: 12, platform: 'ios' },
    iphonese: { name: 'iPhone SE', width: 375, height: 667, radius: 28, bezel: 12, platform: 'ios' },
    galaxys24: { name: 'Galaxy S24', width: 412, height: 915, radius: 42, bezel: 10, platform: 'android' },
    pixel8: { name: 'Pixel 8', width: 412, height: 892, radius: 44, bezel: 11, platform: 'android' },
    ipadmini: { name: 'iPad Mini', width: 768, height: 1024, radius: 32, bezel: 16, platform: 'tablet' }
  };

  let state = {
    activeDeviceKey: localStorage.getItem('mv_device') || 'iphone15pro',
    isLandscape: localStorage.getItem('mv_landscape') === 'true',
    scaleMode: localStorage.getItem('mv_scale_mode') || 'fit',
    zoom: 1.0,
    currentUrl: 'https://google.com'
  };

  function calculateFitScale(devW, devH) {
    const availH = window.innerHeight - 90;
    const availW = window.innerWidth - 40;
    const best = Math.min(availH / devH, availW / devW, 1.0);
    return Math.max(0.35, Math.min(1.0, Math.round(best * 100) / 100));
  }

  function updateView() {
    const dev = DEVICES[state.activeDeviceKey] || DEVICES.iphone15pro;
    const screenW = state.isLandscape ? dev.height : dev.width;
    const screenH = state.isLandscape ? dev.width : dev.height;
    const totalW = screenW + (dev.bezel * 2);
    const totalH = screenH + (dev.bezel * 2);

    const frameEl = document.getElementById('mv-phone-frame');
    const screenContainer = document.getElementById('mv-screen-container');
    const scaleWrapper = document.getElementById('mv-scale-wrapper');
    const hwButtonsContainer = document.getElementById('mv-hw-buttons');

    if (!frameEl) return;

    frameEl.style.width = totalW + 'px';
    frameEl.style.height = totalH + 'px';
    frameEl.style.borderRadius = dev.radius + 'px';
    frameEl.style.padding = dev.bezel + 'px';

    if (screenContainer) {
      screenContainer.style.borderRadius = Math.max(6, dev.radius - dev.bezel) + 'px';
    }

    if (state.scaleMode === 'fit') {
      state.zoom = calculateFitScale(totalW, totalH);
    } else {
      state.zoom = parseFloat(state.scaleMode) || 1.0;
    }
    scaleWrapper.style.transform = `scale(${state.zoom})`;

    // Side Buttons (Hardware)
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

    // Toolbar status
    const rotBtn = document.getElementById('rot-btn');
    if (rotBtn) rotBtn.classList.toggle('mv-btn-active', state.isLandscape);

    const fitBtn = document.getElementById('fit-btn');
    const z75Btn = document.getElementById('z75-btn');
    const z100Btn = document.getElementById('z100-btn');

    if (fitBtn) fitBtn.classList.toggle('mv-active', state.scaleMode === 'fit');
    if (z75Btn) z75Btn.classList.toggle('mv-active', state.scaleMode === '0.75');
    if (z100Btn) z100Btn.classList.toggle('mv-active', state.scaleMode === '1.0');
  }

  // URL Parsing
  const params = new URLSearchParams(window.location.search);
  let target = params.get('url');
  if (target && target !== 'about:blank') {
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('file://')) {
      target = 'https://' + target;
    }
    state.currentUrl = target;
  }

  const urlInput = document.getElementById('url-input');
  const iframe = document.getElementById('mv-viewport-iframe');
  if (urlInput) urlInput.value = state.currentUrl;
  if (iframe) iframe.src = state.currentUrl;

  // Bindings
  const urlForm = document.getElementById('url-form');
  if (urlForm) {
    urlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let val = urlInput.value.trim();
      if (!val) return;
      if (!val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('file://')) {
        val = 'https://' + val;
      }
      urlInput.value = val;
      state.currentUrl = val;
      iframe.src = val;
    });
  }

  const deviceSelect = document.getElementById('device-select');
  if (deviceSelect) {
    deviceSelect.value = state.activeDeviceKey;
    deviceSelect.addEventListener('change', (e) => {
      state.activeDeviceKey = e.target.value;
      localStorage.setItem('mv_device', state.activeDeviceKey);
      updateView();
    });
  }

  const rotBtn = document.getElementById('rot-btn');
  if (rotBtn) {
    rotBtn.addEventListener('click', () => {
      state.isLandscape = !state.isLandscape;
      localStorage.setItem('mv_landscape', state.isLandscape);
      updateView();
    });
  }

  const fitBtn = document.getElementById('fit-btn');
  if (fitBtn) {
    fitBtn.addEventListener('click', () => {
      state.scaleMode = 'fit';
      localStorage.setItem('mv_scale_mode', 'fit');
      updateView();
    });
  }

  const z75Btn = document.getElementById('z75-btn');
  if (z75Btn) {
    z75Btn.addEventListener('click', () => {
      state.scaleMode = '0.75';
      localStorage.setItem('mv_scale_mode', '0.75');
      updateView();
    });
  }

  const z100Btn = document.getElementById('z100-btn');
  if (z100Btn) {
    z100Btn.addEventListener('click', () => {
      state.scaleMode = '1.0';
      localStorage.setItem('mv_scale_mode', '1.0');
      updateView();
    });
  }

  const reloadBtn = document.getElementById('reload-btn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      iframe.src = state.currentUrl;
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName !== 'INPUT' && (e.key === 'r' || e.key === 'R')) {
      state.isLandscape = !state.isLandscape;
      localStorage.setItem('mv_landscape', state.isLandscape);
      updateView();
    }
  });

  window.addEventListener('resize', () => {
    if (state.scaleMode === 'fit') updateView();
  });

  updateView();
})();
