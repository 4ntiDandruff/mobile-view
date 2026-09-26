// preview.js - Mobile View Proportional Clean Tech Edition (v3.5)
// Standalone Studio Tab Controller by Megapass Intra Solusindo

(function initPreview() {
  const DEVICES = {
    iphone15pro: {
      name: 'iPhone 15 Pro',
      shortName: 'iPhone 15 Pro',
      width: 393,
      height: 852,
      radius: 19,
      bezel: 6,
      platform: 'ios'
    },
    galaxys24: {
      name: 'Samsung Galaxy S24',
      shortName: 'Galaxy S24',
      width: 360,
      height: 780,
      radius: 18,
      bezel: 5,
      platform: 'android'
    },
    iphonese: {
      name: 'iPhone SE (3rd Gen)',
      shortName: 'SE',
      width: 375,
      height: 667,
      radius: 14,
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

  const params = new URLSearchParams(window.location.search);
  const themeParam = params.get('theme');

  function safeGet(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function safeSet(key, val) {
    try {
      safeSet(key, val);
    } catch (_) {}
  }

  let state = {
    activeDeviceKey: params.get('device') || safeGet('mv_device', 'iphone15pro'),
    isLandscape: safeGet('mv_landscape', 'false') === 'true',
    scaleMode: safeGet('mv_scale_mode', 'fit'),
    showFrame: true, // Bingkai fisik smartphone selalu aktif
    theme: (themeParam === 'light' || themeParam === 'dark') ? themeParam : (safeGet('mv_theme', 'dark')),
    zoom: 1.0,
    currentUrl: 'https://google.com',
    isModalOpen: false,
    activeTab: 'prefs'
  };

  let target = params.get('url');
  if (target && target !== 'about:blank') {
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('file://')) {
      target = 'https://' + target;
    }
    state.currentUrl = target;
  }

  function calculateFitScale(devW, devH) {
    const availH = window.innerHeight - 76;
    const availW = window.innerWidth - 32;
    const scaleH = availH / devH;
    const scaleW = availW / devW;
    const best = Math.min(scaleH, scaleW);
    return Math.min(1.0, Math.max(0.2, parseFloat(best.toFixed(3))));
  }

  function updateChassisView() {
    const body = document.body;
    body.classList.remove('mv-theme-dark', 'mv-theme-light');
    body.classList.add(state.theme === 'light' ? 'mv-theme-light' : 'mv-theme-dark');

    const dev = DEVICES[state.activeDeviceKey] || DEVICES.iphone15pro;
    const screenW = state.isLandscape ? dev.height : dev.width;
    const screenH = state.isLandscape ? dev.width : dev.height;

    const totalW = screenW;
    const totalH = screenH;

    const frameEl = document.getElementById('mv-phone-frame');
    const screenContainer = document.getElementById('mv-screen-container');
    const scaleWrapper = document.getElementById('mv-scale-wrapper');
    const hwButtonsContainer = document.getElementById('mv-hw-buttons');
    const dimBadge = document.getElementById('mv-dim-badge');
    const themeBtn = document.getElementById('mv-theme-btn');

    if (!frameEl || !scaleWrapper) return;

    frameEl.style.width = totalW + 'px';
    frameEl.style.height = totalH + 'px';
    frameEl.style.borderRadius = dev.radius + 'px';
    frameEl.style.padding = dev.bezel + 'px';

    if (screenContainer) {
      const innerRadius = Math.max(0, dev.radius - dev.bezel);
      screenContainer.style.borderRadius = innerRadius + 'px';
    }

    if (state.scaleMode === 'fit') {
      state.zoom = calculateFitScale(totalW, totalH);
    } else {
      state.zoom = parseFloat(state.scaleMode) || 1.0;
    }
    scaleWrapper.style.transform = `scale(${state.zoom})`;

    if (dimBadge) {
      dimBadge.innerHTML = `<span class="mv-dim-dot"></span><span>${screenW} × ${screenH} px</span>`;
    }

    if (hwButtonsContainer) {
      hwButtonsContainer.innerHTML = '';
      if (dev.platform !== 'tablet') {
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

    if (themeBtn) {
      const sunIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
      const moonIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
      themeBtn.innerHTML = `${state.theme === 'light' ? moonIcon : sunIcon}<span class="mv-kbd">T</span>`;
    }

    const fitBtn = document.getElementById('mv-fit-btn');
    const z100Btn = document.getElementById('mv-z100-btn');

    if (fitBtn) fitBtn.classList.toggle('mv-active', state.scaleMode === 'fit');
    if (z100Btn) z100Btn.classList.toggle('mv-active', state.scaleMode === '1.0');

    updateModalOptionButtons();
  }

  function updateModalOptionButtons() {
    document.querySelectorAll('.mv-opt-theme').forEach(btn => {
      btn.classList.toggle('mv-active', btn.getAttribute('data-val') === state.theme);
    });
    document.querySelectorAll('.mv-opt-dev').forEach(btn => {
      btn.classList.toggle('mv-active', btn.getAttribute('data-val') === state.activeDeviceKey);
    });
    document.querySelectorAll('.mv-opt-scale').forEach(btn => {
      btn.classList.toggle('mv-active', btn.getAttribute('data-val') === state.scaleMode);
    });
    document.querySelectorAll('.mv-opt-orient').forEach(btn => {
      const isLand = btn.getAttribute('data-val') === 'landscape';
      btn.classList.toggle('mv-active', isLand === state.isLandscape);
    });
  }

  function setModalOpen(isOpen) {
    state.isModalOpen = isOpen;
    const backdrop = document.getElementById('mv-modal-backdrop');
    if (!backdrop) return;
    backdrop.classList.toggle('mv-hidden', !isOpen);
    if (isOpen) {
      updateModalOptionButtons();
    }
  }

  function switchModalTab(tabId) {
    state.activeTab = tabId;
    const tabPrefs = document.getElementById('mv-tab-nav-prefs');
    const tabAbout = document.getElementById('mv-tab-nav-about');
    const contentPrefs = document.getElementById('mv-tab-content-prefs');
    const contentAbout = document.getElementById('mv-tab-content-about');

    if (tabPrefs && tabAbout && contentPrefs && contentAbout) {
      const isPrefs = tabId === 'prefs';
      tabPrefs.classList.toggle('mv-active', isPrefs);
      tabAbout.classList.toggle('mv-active', !isPrefs);
      contentPrefs.classList.toggle('mv-hidden', !isPrefs);
      contentAbout.classList.toggle('mv-hidden', isPrefs);
    }
  }

  const iframe = document.getElementById('mv-viewport-iframe');
  if (iframe && state.currentUrl) {
    iframe.src = state.currentUrl;
  }

  document.querySelectorAll('.mv-dev-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.currentTarget.getAttribute('data-dev');
      state.activeDeviceKey = key;
      safeSet('mv_device', key);
      updateChassisView();
    });
  });

  const rotBtn = document.getElementById('mv-rot-btn');
  if (rotBtn) {
    rotBtn.addEventListener('click', () => {
      state.isLandscape = !state.isLandscape;
      safeSet('mv_landscape', state.isLandscape);
      updateChassisView();
    });
  }

  const fitBtn = document.getElementById('mv-fit-btn');
  if (fitBtn) {
    fitBtn.addEventListener('click', () => {
      state.scaleMode = 'fit';
      safeSet('mv_scale_mode', 'fit');
      updateChassisView();
    });
  }

  const z100Btn = document.getElementById('mv-z100-btn');
  if (z100Btn) {
    z100Btn.addEventListener('click', () => {
      state.scaleMode = '1.0';
      safeSet('mv_scale_mode', '1.0');
      updateChassisView();
    });
  }

  const themeBtn = document.getElementById('mv-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      safeSet('mv_theme', state.theme);
      updateChassisView();
    });
  }

  const reloadBtn = document.getElementById('mv-reload-btn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      const svg = document.getElementById('mv-reload-svg');
      if (svg) {
        svg.style.transform = 'rotate(360deg)';
        svg.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          svg.style.transition = 'none';
          svg.style.transform = 'rotate(0deg)';
        }, 450);
      }
      if (iframe) {
        iframe.src = state.currentUrl;
      }
    });
  }

  const settingsBtn = document.getElementById('mv-settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      setModalOpen(true);
    });
  }

  const modalClose = document.getElementById('mv-modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      setModalOpen(false);
    });
  }

  const backdrop = document.getElementById('mv-modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        setModalOpen(false);
      }
    });
  }

  const tabNavPrefs = document.getElementById('mv-tab-nav-prefs');
  if (tabNavPrefs) {
    tabNavPrefs.addEventListener('click', () => switchModalTab('prefs'));
  }
  const tabNavAbout = document.getElementById('mv-tab-nav-about');
  if (tabNavAbout) {
    tabNavAbout.addEventListener('click', () => switchModalTab('about'));
  }

  document.querySelectorAll('.mv-opt-theme').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = e.currentTarget.getAttribute('data-val');
      state.theme = val;
      safeSet('mv_theme', val);
      updateChassisView();
    });
  });

  document.querySelectorAll('.mv-opt-dev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = e.currentTarget.getAttribute('data-val');
      state.activeDeviceKey = val;
      safeSet('mv_device', val);
      updateChassisView();
    });
  });

  document.querySelectorAll('.mv-opt-scale').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = e.currentTarget.getAttribute('data-val');
      state.scaleMode = val;
      safeSet('mv_scale_mode', val);
      updateChassisView();
    });
  });

  document.querySelectorAll('.mv-opt-orient').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = e.currentTarget.getAttribute('data-val');
      state.isLandscape = val === 'landscape';
      safeSet('mv_landscape', state.isLandscape);
      updateChassisView();
    });
  });

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

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape') {
      if (state.isModalOpen) {
        setModalOpen(false);
        return;
      }
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
      return;
    }

    if (e.key === ',' || e.key === '<') {
      setModalOpen(!state.isModalOpen);
    } else if (e.key === 'r' || e.key === 'R') {
      state.isLandscape = !state.isLandscape;
      safeSet('mv_landscape', state.isLandscape);
      updateChassisView();
    } else if (e.key === 't' || e.key === 'T') {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      safeSet('mv_theme', state.theme);
      updateChassisView();
    }
  });

  window.addEventListener('resize', () => {
    if (state.scaleMode === 'fit') {
      updateChassisView();
    }
  });

  updateChassisView();

  const paramsModal = new URLSearchParams(window.location.search);
  const mParam = paramsModal.get('modal') || (window.location.hash.includes('about') ? 'about' : (window.location.hash.includes('prefs') ? 'prefs' : null));
  if (mParam === 'prefs') {
    setModalOpen(true);
    switchModalTab('prefs');
  } else if (mParam === 'about') {
    setModalOpen(true);
    switchModalTab('about');
  }

})();
