// content.js - Mobile View Proportional Clean Tech Edition (v3.5)
// Zero-Bloat Device Frame Studio by Megapass Intra Solusindo

(function initMobileViewStudio() {
  if (window.__mv_studio_loaded) return;
  window.__mv_studio_loaded = true;

  // Jika berjalan di dalam subframe (iframe mobile-view), aktifkan simulasi touchscreen & drag-to-scroll penuh
  if (window !== window.top) {
    function initSubframeTouch() {
      if (document.getElementById("mv-subframe-touch-style")) return;

      // 1. Emulasi API Touchscreen Native Browser
      try {
        if (!('ontouchstart' in window)) {
          window.ontouchstart = null;
        }
        if (!('ontouchend' in window)) {
          window.ontouchend = null;
        }
        if (!('ontouchmove' in window)) {
          window.ontouchmove = null;
        }
        if (!('ontouchcancel' in window)) {
          window.ontouchcancel = null;
        }
        if (navigator.maxTouchPoints === 0 || navigator.maxTouchPoints === undefined) {
          Object.defineProperty(navigator, 'maxTouchPoints', {
            get: () => 5,
            configurable: true
          });
        }
      } catch (_) {}

      // 2. Injeksi Kursor Lingkaran Sentuh & Feedback Visual
      const s = document.createElement("style");
      s.id = "mv-subframe-touch-style";
      s.textContent = `
        *, html, body {
          cursor: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZGVmcz48ZmlsdGVyIGlkPSJtdi1zIiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIj48ZmVEcm9wU2hhZG93IGR4PSIwIiBkeT0iMSIgc3RkRGV2aWF0aW9uPSIxIiBmbG9vZC1jb2xvcj0iIzAwMCIgZmxvb2Qtb3BhY2l0eT0iMC40NSIvPjwvZmlsdGVyPjwvZGVmcz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI5IiBmaWxsPSJyZ2JhKDYwLDYwLDY3LDAuMjgpIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMS44IiBmaWx0ZXI9InVybCgjbXYtcykiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzLjIiIGZpbGw9IiNmZmZmZmYiIGZpbHRlcj0idXJsKCNtdi1zKSIvPjwvc3ZnPg==") 12 12, auto !important;
          user-select: none !important;
          -webkit-user-select: none !important;
        }
        *:active, html:active, body:active {
          cursor: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZGVmcz48ZmlsdGVyIGlkPSJtdi1zIiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIj48ZmVEcm9wU2hhZG93IGR4PSIwIiBkeT0iMSIgc3RkRGV2aWF0aW9uPSIxIiBmbG9vZC1jb2xvcj0iIzAwMCIgZmxvb2Qtb3BhY2l0eT0iMC41Ii8+PC9maWx0ZXI+PC9kZWZzPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiBmaWxsPSJyZ2JhKDAsMTEzLDIyNywwLjM4KSIgc3Ryb2tlPSIjMDA3MUUzIiBzdHJva2Utd2lkdGg9IjIuMiIgZmlsdGVyPSJ1cmwoI212LXMpIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0iI2ZmZmZmZiIgZmlsdGVyPSJ1cmwoI212LXMpIi8+PC9zdmc+") 12 12, auto !important;
        }
        input, textarea, select, [contenteditable="true"] {
          user-select: text !important;
          -webkit-user-select: text !important;
          cursor: text !important;
        }
        .mv-subframe-ripple {
          position: fixed !important;
          pointer-events: none !important;
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          background: rgba(0, 113, 227, 0.22) !important;
          border: 1.5px solid rgba(0, 113, 227, 0.75) !important;
          transform: translate(-50%, -50%) scale(0.6) !important;
          opacity: 0.9 !important;
          z-index: 2147483647 !important;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out !important;
        }
        .mv-subframe-ripple.mv-expand {
          transform: translate(-50%, -50%) scale(1.6) !important;
          opacity: 0 !important;
        }
      `;
      (document.head || document.documentElement).appendChild(s);

      // State Mesin Simulasi Sentuhan Fisik Mobile
      let isDown = false;
      let hasDragged = false;
      let startX = 0, startY = 0;
      let lastX = 0, lastY = 0;
      let lastTime = 0;
      let velX = 0, velY = 0;
      let momentumId = null;
      let activeScrollContainer = null;
      const DRAG_THRESHOLD = 4; // px

      // Dispatcher TouchEvent Asli Browser (touchstart, touchmove, touchend)
      let touchIdentifier = 1;
      function createAndDispatchTouchEvent(type, pointerEvent, targetOverride) {
        if (typeof Touch === 'undefined' || typeof TouchEvent === 'undefined') return;
        try {
          const target = targetOverride || pointerEvent.target || document.body;
          const touch = new Touch({
            identifier: touchIdentifier,
            target: target,
            clientX: pointerEvent.clientX,
            clientY: pointerEvent.clientY,
            screenX: pointerEvent.screenX || pointerEvent.clientX,
            screenY: pointerEvent.screenY || pointerEvent.clientY,
            pageX: pointerEvent.pageX !== undefined ? pointerEvent.pageX : pointerEvent.clientX + window.scrollX,
            pageY: pointerEvent.pageY !== undefined ? pointerEvent.pageY : pointerEvent.clientY + window.scrollY,
            radiusX: 12,
            radiusY: 12,
            rotationAngle: 0,
            force: type === 'touchend' ? 0 : 1.0
          });

          const touchesList = type === 'touchend' ? [] : [touch];
          const changedTouchesList = [touch];

          const touchEv = new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            composed: true,
            view: window,
            touches: touchesList,
            targetTouches: touchesList,
            changedTouches: changedTouchesList
          });

          target.dispatchEvent(touchEv);
        } catch (_) {}
      }

      function isScrollableElement(el, isY) {
        if (!el || el === document || el === window) return false;
        try {
          const style = window.getComputedStyle(el);
          const ov = isY ? style.overflowY : style.overflowX;
          if (ov === "auto" || ov === "scroll" || ov === "overlay") {
            if (isY && el.scrollHeight > el.clientHeight) return true;
            if (!isY && el.scrollWidth > el.clientWidth) return true;
          }
        } catch (_) {}
        return false;
      }

      function resolveScrollTarget(targetEl, totalDx, totalDy) {
        let curr = targetEl;
        const preferY = Math.abs(totalDy) >= Math.abs(totalDx);
        while (curr && curr !== document.body && curr !== document.documentElement) {
          if (preferY && isScrollableElement(curr, true)) return curr;
          if (!preferY && isScrollableElement(curr, false)) return curr;
          curr = curr.parentElement;
        }
        return window;
      }

      function performScroll(container, deltaX, deltaY) {
        if (!container) return;
        if (container === window) {
          window.scrollBy({ left: deltaX, top: deltaY, behavior: "instant" });
        } else {
          container.scrollLeft += deltaX;
          container.scrollTop += deltaY;
        }
      }

      function cancelMomentum() {
        if (momentumId) {
          cancelAnimationFrame(momentumId);
          momentumId = null;
        }
      }

      // Pointerdown / Mousedown Touch Hook
      let initialTouchTarget = null;
      window.addEventListener("pointerdown", (e) => {
        if (e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey) return;
        const tag = (e.target && e.target.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable)) return;

        cancelMomentum();
        isDown = true;
        hasDragged = false;
        touchIdentifier++;
        initialTouchTarget = e.target;
        startX = e.clientX;
        startY = e.clientY;
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = performance.now();
        velX = 0;
        velY = 0;
        activeScrollContainer = null;

        // Dispatch touchstart asli ke elemen target
        createAndDispatchTouchEvent('touchstart', e, initialTouchTarget);

        // Render Touch Ripple
        try {
          const rip = document.createElement("div");
          rip.className = "mv-subframe-ripple";
          rip.style.left = e.clientX + "px";
          rip.style.top = e.clientY + "px";
          (document.body || document.documentElement).appendChild(rip);
          requestAnimationFrame(() => rip.classList.add("mv-expand"));
          setTimeout(() => rip.remove(), 380);
        } catch (_) {}
      }, { capture: true, passive: true });

      // Pointermove / Mousemove Drag-Scroll Physics
      window.addEventListener("pointermove", (e) => {
        if (!isDown) return;

        // Dispatch touchmove asli
        createAndDispatchTouchEvent('touchmove', e, initialTouchTarget || e.target);

        const currentX = e.clientX;
        const currentY = e.clientY;
        const currentTime = performance.now();
        const totalDx = currentX - startX;
        const totalDy = currentY - startY;

        if (!hasDragged) {
          if (Math.hypot(totalDx, totalDy) > DRAG_THRESHOLD) {
            hasDragged = true;
            activeScrollContainer = resolveScrollTarget(e.target, totalDx, totalDy);
          } else {
            return;
          }
        }

        // Pada smartphone, menarik ke atas (currentY < lastY) menggeser halaman ke bawah (scrollTop bertambah)
        const stepDx = -(currentX - lastX);
        const stepDy = -(currentY - lastY);

        const dt = Math.max(1, currentTime - lastTime);
        velX = stepDx / dt;
        velY = stepDy / dt;

        lastX = currentX;
        lastY = currentY;
        lastTime = currentTime;

        if (activeScrollContainer) {
          performScroll(activeScrollContainer, stepDx, stepDy);
        }
      }, { capture: true, passive: true });

      // Pointerup / Mouseup Touch Release & Momentum Decay
      const handlePointerUp = (e) => {
        if (!isDown) return;
        isDown = false;

        // Dispatch touchend asli
        createAndDispatchTouchEvent('touchend', e, initialTouchTarget || e.target);
        initialTouchTarget = null;

        if (hasDragged) {
          // Cegah eksekusi click / navigasi link yang tidak disengaja saat drag selesai
          window.addEventListener("click", function suppressClick(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            window.removeEventListener("click", suppressClick, true);
          }, { capture: true, once: true });

          // Inersia Fisik Touch Momentum
          const target = activeScrollContainer;
          let currentVelX = velX * 16;
          let currentVelY = velY * 16;
          const FRICTION = 0.92;

          function runMomentumStep() {
            if (Math.abs(currentVelX) < 0.25 && Math.abs(currentVelY) < 0.25) {
              cancelMomentum();
              return;
            }
            performScroll(target, currentVelX, currentVelY);
            currentVelX *= FRICTION;
            currentVelY *= FRICTION;
            momentumId = requestAnimationFrame(runMomentumStep);
          }

          if (Math.abs(currentVelX) > 1.2 || Math.abs(currentVelY) > 1.2) {
            cancelMomentum();
            momentumId = requestAnimationFrame(runMomentumStep);
          }
        }
      };

      window.addEventListener("pointerup", handlePointerUp, { capture: true });
      window.addEventListener("pointercancel", handlePointerUp, { capture: true });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initSubframeTouch);
    } else {
      initSubframeTouch();
    }
    return;
  }
  /**
   * Database Perangkat Smartphone Fisik (1:1 Hardware Scale)
   */
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

  function safeGet(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function safeSet(key, val) {
    try {
      localStorage.setItem(key, String(val));
    } catch (_) {}
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [key]: String(val) });
      }
    } catch (_) {}
  }

  let state = {
    activeDeviceKey: safeGet('mv_device', 'iphone15pro'),
    isLandscape: safeGet('mv_landscape', 'false') === 'true',
    scaleMode: safeGet('mv_scale_mode', 'fit'),
    showFrame: true, // Frame fisik smartphone selalu aktif
    touchMode: safeGet('mv_touch_mode', 'true') === 'true',
    theme: safeGet('mv_theme', 'dark'),
    zoom: 1.0,
    originalOverflowHtml: '',
    originalOverflowBody: '',
    isModalOpen: false,
    activeTab: 'prefs'
  };

  // Sinkronisasi preferensi universal lintas-domain via chrome.storage.local
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['mv_theme', 'mv_device', 'mv_scale_mode', 'mv_landscape', 'mv_touch_mode'], (items) => {
        if (!items) return;
        if (items.mv_theme) { state.theme = items.mv_theme; try { localStorage.setItem('mv_theme', items.mv_theme); } catch (_) {} }
        if (items.mv_device) { state.activeDeviceKey = items.mv_device; try { localStorage.setItem('mv_device', items.mv_device); } catch (_) {} }
        if (items.mv_scale_mode) { state.scaleMode = items.mv_scale_mode; try { localStorage.setItem('mv_scale_mode', items.mv_scale_mode); } catch (_) {} }
        if (items.mv_landscape !== undefined) { state.isLandscape = items.mv_landscape === 'true'; try { localStorage.setItem('mv_landscape', items.mv_landscape); } catch (_) {} }
        if (items.mv_touch_mode !== undefined) { state.touchMode = items.mv_touch_mode === 'true'; try { localStorage.setItem('mv_touch_mode', items.mv_touch_mode); } catch (_) {} }
        if (document.getElementById('mv-studio-overlay')) {
          updateChassisView();
        }
      });
    }
  } catch (_) {}

  /**
   * Menghitung zoom scale adaptif agar frame pas dengan monitor
   */
  function calculateFitScale(devW, devH) {
    const availH = Math.max(80, window.innerHeight - 96);
    const availW = Math.max(80, window.innerWidth - 32);
    const scaleH = availH / devH;
    const scaleW = availW / devW;
    const best = Math.min(scaleH, scaleW);
    return Math.min(1.0, Math.max(0.15, parseFloat(best.toFixed(3))));
  }

  /**
   * Perbarui Tampilan Fisik Sasis & Dimensi Layar
   */
  function updateChassisView() {
    const overlay = document.getElementById('mv-studio-overlay');
    if (!overlay) return;

    overlay.classList.remove('mv-theme-dark', 'mv-theme-light');
    overlay.classList.add(state.theme === 'light' ? 'mv-theme-light' : 'mv-theme-dark');

    const dev = DEVICES[state.activeDeviceKey] || DEVICES.iphone15pro;
    const screenW = state.isLandscape ? dev.height : dev.width;
    const screenH = state.isLandscape ? dev.width : dev.height;

    // Viewport murni smartphone harus persis screenW x screenH.
    // Bezel fisik adalah bingkai sasis di luar layar viewport.
    const frameW = screenW + (dev.bezel * 2);
    const frameH = screenH + (dev.bezel * 2);

    const frameEl = document.getElementById('mv-phone-frame');
    const screenContainer = document.getElementById('mv-screen-container');
    const scaleWrapper = document.getElementById('mv-scale-wrapper');
    const hwButtonsContainer = document.getElementById('mv-hw-buttons');
    const dimBadge = document.getElementById('mv-dim-badge');
    const themeBtn = document.getElementById('mv-theme-btn');

    if (!frameEl || !scaleWrapper) return;

    // 1. Terapkan Dimensi & Radius Presisi
    frameEl.style.width = frameW + 'px';
    frameEl.style.height = frameH + 'px';
    frameEl.style.borderRadius = (dev.radius + dev.bezel) + 'px';
    frameEl.style.padding = dev.bezel + 'px';

    if (screenContainer) {
      screenContainer.style.width = screenW + 'px';
      screenContainer.style.height = screenH + 'px';
      screenContainer.style.borderRadius = dev.radius + 'px';
    }

    // 2. Skala Zoom Adaptif
    if (state.scaleMode === 'fit') {
      state.zoom = calculateFitScale(frameW, frameH);
    } else {
      state.zoom = parseFloat(state.scaleMode) || 1.0;
    }
    scaleWrapper.style.transform = `scale(${state.zoom})`;

    // 3. Render Tombol Fisik Hardware Sasis
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

    // 4. Update Quick Device Chips di Topbar
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
      themeBtn.innerHTML = (state.theme === 'light' ? moonIcon : sunIcon) + '<span class="mv-kbd">T</span>';
    }


    // Touchscreen Simulator Mode
    const touchBtn = document.getElementById('mv-touch-btn');
    if (touchBtn) touchBtn.classList.toggle('mv-btn-active', state.touchMode);
    if (screenContainer) screenContainer.classList.toggle('mv-touch-active', state.touchMode);

    // 5. Update Segmented Zoom Tabs
    const fitBtn = document.getElementById('mv-fit-btn');
    const z100Btn = document.getElementById('mv-z100-btn');
    if (fitBtn && z100Btn) {
      fitBtn.classList.toggle('mv-active', state.scaleMode === 'fit');
      z100Btn.classList.toggle('mv-active', state.scaleMode === '1.0');
    }

    // 6. Update HUD Dimensi
    if (dimBadge) {
      dimBadge.innerHTML = `<span class="mv-dim-dot"></span><span>${screenW} × ${screenH} px</span>`;
    }

    // 7. Update Modal Settings Option Highlights
    updateModalOptionButtons();
  }

  /**
   * Sinkronisasi status tombol opsi di dalam modal
   */
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
    document.querySelectorAll('.mv-opt-touch').forEach(btn => {
      const isTouch = btn.getAttribute('data-val') === 'true';
      btn.classList.toggle('mv-active', isTouch === state.touchMode);
    });
  }

  /**
   * Buka / Tutup Modal Pengaturan & Tentang
   */
  function setModalOpen(isOpen) {
    state.isModalOpen = isOpen;
    const backdrop = document.getElementById('mv-modal-backdrop');
    if (!backdrop) return;
    backdrop.classList.toggle('mv-hidden', !isOpen);
    if (isOpen) {
      updateModalOptionButtons();
    }
  }

  /**
   * Beralih Tab di dalam Modal Pengaturan
   */
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

  /**
   * Menutup Studio Mobile View
   */
  function closeMobileView() {
    const overlay = document.getElementById('mv-studio-overlay');
    if (overlay) {
      overlay.remove();
    }
    document.documentElement.style.overflow = state.originalOverflowHtml;
    document.body.style.overflow = state.originalOverflowBody;
    state.isModalOpen = false;
  }

  /**
   * Membuka Studio Mobile View & Menyuntikkan DOM
   */
  function openMobileView() {
    if (document.getElementById('mv-studio-overlay')) return;

    state.originalOverflowHtml = document.documentElement.style.overflow;
    state.originalOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    state.activeDeviceKey = safeGet('mv_device', state.activeDeviceKey || 'iphone15pro');
    state.isLandscape = safeGet('mv_landscape', String(state.isLandscape)) === 'true';
    state.scaleMode = safeGet('mv_scale_mode', state.scaleMode || 'fit');
    state.theme = safeGet('mv_theme', state.theme || 'dark');

    const overlay = document.createElement('div');
    overlay.id = 'mv-studio-overlay';
    overlay.className = state.theme === 'light' ? 'mv-theme-light' : 'mv-theme-dark';

    overlay.innerHTML = `
      <!-- Top Bar Island (Solid Matte Workstation / Frosted Neomorphic) -->
      <div id="mv-topbar">
        <!-- Left: Brand & Quick Device Chips -->
        <div class="mv-group">
          <div class="mv-brand">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect width="14" height="20" x="5" y="2" rx="3" ry="3"/>
              <path d="M12 18h.01"/>
            </svg>
            <span>Mobile View</span>
          </div>

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

        <!-- Center: Metrics + Rotate + Reload -->
        <div class="mv-group">
          <div id="mv-dim-badge" class="mv-dim-pill"><span class="mv-dim-dot"></span><span>393 × 852 px</span></div>

          <button id="mv-rot-btn" class="mv-btn ${state.isLandscape ? 'mv-btn-active' : ''}" title="Putar Layar (Tekan 'R')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>Putar</span>
            <span class="mv-kbd">R</span>
          </button>

          <button id="mv-touch-btn" class="mv-btn ${state.touchMode ? 'mv-btn-active' : ''}" title="Simulasi Touchscreen (Tekan S)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="8"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
            <span>Touch</span>
            <span class="mv-kbd">S</span>
          </button>

          <button id="mv-reload-btn" class="mv-btn" title="Segarkan Layar (Ctrl+R)">
            <svg id="mv-reload-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 21h5v-5"/>
            </svg>
          </button>
        </div>

        <!-- Right: Zoom, Theme, Settings, Close -->
        <div class="mv-group">
          <div class="mv-neo-groove">
            <button id="mv-fit-btn" class="mv-tab-pill ${state.scaleMode === 'fit' ? 'mv-active' : ''}">Fit</button>
            <button id="mv-z100-btn" class="mv-tab-pill ${state.scaleMode === '1.0' ? 'mv-active' : ''}">100%</button>
          </div>

          <button id="mv-theme-btn" class="mv-btn" title="Ganti Tema (Tekan 'T')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
            <span class="mv-kbd">T</span>
          </button>

          <button id="mv-settings-btn" class="mv-btn" title="Pengaturan & Tentang (Tekan ',')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Setelan</span>
            <span class="mv-kbd">,</span>
          </button>

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

      <!-- Canvas Area -->
      <div id="mv-canvas">
        <div id="mv-scale-wrapper">
          <div id="mv-phone-frame" class="mv-phone-frame">
            <div id="mv-hw-buttons"></div>
            <div id="mv-screen-container" class="mv-screen-container">
              <iframe id="mv-viewport-iframe" src="${window.location.href}"></iframe>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Pengaturan & Tentang Studio (Slide-Down / Popup Taktil) -->
      <div id="mv-modal-backdrop" class="mv-modal-backdrop mv-hidden">
        <div id="mv-settings-modal" class="mv-settings-modal">
          <!-- Header -->
          <div class="mv-modal-header">
            <div class="mv-modal-title-wrap">
              <h3 class="mv-modal-title">Mobile View Studio</h3>
              <p class="mv-modal-subtitle">Pengaturan Preferensi & Identitas Studio</p>
            </div>
            <button id="mv-modal-close" class="mv-modal-close-btn" title="Tutup (Esc)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Tab Selector -->
          <div class="mv-modal-tabs mv-neo-groove">
            <button id="mv-tab-nav-prefs" class="mv-tab-pill mv-active">Preferensi Bawaan</button>
            <button id="mv-tab-nav-about" class="mv-tab-pill">Tentang & Changelog</button>
          </div>

          <!-- Tab Content 1: Preferensi Bawaan -->
          <div id="mv-tab-content-prefs" class="mv-modal-tab-content">
            <div class="mv-setting-row">
              <div class="mv-setting-label">
                <span class="mv-setting-name">Mode Tampilan Bawaan</span>
                <span class="mv-setting-desc">Tema saat studio pertama kali aktif</span>
              </div>
              <div class="mv-neo-groove">
                <button class="mv-tab-pill mv-opt-theme ${state.theme === 'dark' ? 'mv-active' : ''}" data-val="dark">Gelap (Dark)</button>
                <button class="mv-tab-pill mv-opt-theme ${state.theme === 'light' ? 'mv-active' : ''}" data-val="light">Terang (Light)</button>
              </div>
            </div>

            <div class="mv-setting-row">
              <div class="mv-setting-label">
                <span class="mv-setting-name">Perangkat Bawaan</span>
                <span class="mv-setting-desc">Smartphone awal saat studio dibuka</span>
              </div>
              <div class="mv-neo-groove">
                <button class="mv-tab-pill mv-opt-dev ${state.activeDeviceKey === 'iphone15pro' ? 'mv-active' : ''}" data-val="iphone15pro">iPhone 15 Pro</button>
                <button class="mv-tab-pill mv-opt-dev ${state.activeDeviceKey === 'galaxys24' ? 'mv-active' : ''}" data-val="galaxys24">Galaxy S24</button>
                <button class="mv-tab-pill mv-opt-dev ${state.activeDeviceKey === 'iphonese' ? 'mv-active' : ''}" data-val="iphonese">SE</button>
                <button class="mv-tab-pill mv-opt-dev ${state.activeDeviceKey === 'ipadmini' ? 'mv-active' : ''}" data-val="ipadmini">iPad</button>
              </div>
            </div>

            <div class="mv-setting-row">
              <div class="mv-setting-label">
                <span class="mv-setting-name">Skala Zoom Awal</span>
                <span class="mv-setting-desc">Penyesuaian ukuran frame ke layar</span>
              </div>
              <div class="mv-neo-groove">
                <button class="mv-tab-pill mv-opt-scale ${state.scaleMode === 'fit' ? 'mv-active' : ''}" data-val="fit">Fit to Screen</button>
                <button class="mv-tab-pill mv-opt-scale ${state.scaleMode === '1.0' ? 'mv-active' : ''}" data-val="1.0">100% Asli</button>
              </div>
            </div>

            <div class="mv-setting-row">
              <div class="mv-setting-label">
                <span class="mv-setting-name">Orientasi Awal</span>
                <span class="mv-setting-desc">Posisi fisik smartphone</span>
              </div>
              <div class="mv-neo-groove">
                <button class="mv-tab-pill mv-opt-orient ${!state.isLandscape ? 'mv-active' : ''}" data-val="portrait">Tegak (Portrait)</button>
                <button class="mv-tab-pill mv-opt-orient ${state.isLandscape ? 'mv-active' : ''}" data-val="landscape">Miring (Landscape)</button>
              </div>
            </div>

            <div class="mv-setting-row">
              <div class="mv-setting-label">
                <span class="mv-setting-name">Simulasi Touchscreen</span>
                <span class="mv-setting-desc">Kursor lingkaran sentuh & gestur mobile</span>
              </div>
              <div class="mv-neo-groove">
                <button class="mv-tab-pill mv-opt-touch ${state.touchMode ? 'mv-active' : ''}" data-val="true">Aktif</button>
                <button class="mv-tab-pill mv-opt-touch ${!state.touchMode ? 'mv-active' : ''}" data-val="false">Nonaktif</button>
              </div>
            </div>

            <div class="mv-modal-footer">
              <span class="mv-save-badge">Perubahan tersimpan otomatis</span>
            </div>
          </div>

          <!-- Tab Content 2: Tentang & Changelog -->
          <div id="mv-tab-content-about" class="mv-modal-tab-content mv-hidden">
            <div class="mv-about-card">
              <div class="mv-about-top">
                <div class="mv-about-logo">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <rect width="14" height="20" x="5" y="2" rx="3" ry="3"/>
                    <path d="M12 18h.01"/>
                  </svg>
                </div>
                <div>
                  <div class="mv-about-name">Mobile View Studio v1.16.0</div>
                  <div class="mv-about-sub">Zero-Bloat Device Frame Studio by Megapass Intra Solusindo</div>
                </div>
              </div>
              <p class="mv-about-desc">
                Alat inspeksi responsif web profesional dengan bingkai fisik smartphone presisi pixel. Bebas bundler, zero npm runtime bloat, arsitektur sirkuit terbuka hemat resource hardware ruko.
              </p>
              <div class="mv-about-meta">
                <div><strong>Arsitek Sistem:</strong> Cak Hizam Nahari (Certified Electronics Technician BNSP/BMY)</div>
                <div><strong>Basis Workshop:</strong> Sidoarjo, Jawa Timur, Indonesia</div>
              </div>
              <div class="mv-about-links">
                <a href="https://github.com/4ntiDandruff" target="_blank" rel="noopener noreferrer" class="mv-link-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>GitHub Profile (@4ntiDandruff)</span>
                </a>
              </div>
            </div>

            <div class="mv-changelog-wrap">
              <div class="mv-changelog-title">Catatan Rilis (Changelog Rekam Medis)</div>
              <div class="mv-changelog-list">
                <div class="mv-log-item">
                  <span class="mv-log-badge">v1.16.0</span>
                  <span class="mv-log-text">Perbaikan fatal crash totalW, responsivitas bilah atas non-fullscreen, kalibrasi fit-scale anti-terpotong, dan fail-safe shortcut multi-window.</span>
                </div>
                <div class="mv-log-item">
                  <span class="mv-log-badge">v1.15.0</span>
                  <span class="mv-log-text">Panel Pengaturan Topbar, Tab Tentang & Promosi GitHub, Frame Always-On, dan PM2 Dev-Watcher Auto-Reload.</span>
                </div>
                <div class="mv-log-item">
                  <span class="mv-log-badge">v1.14.0</span>
                  <span class="mv-log-text">Eliminasi aksen biru pada Light Mode untuk menjaga kemurnian neomorphic putih elegan.</span>
                </div>
                <div class="mv-log-item">
                  <span class="mv-log-badge">v1.13.1</span>
                  <span class="mv-log-text">Harmonisasi tombol Bingkai ke palet Solid Matte Workstation tanpa pendaran warna biru.</span>
                </div>
                <div class="mv-log-item">
                  <span class="mv-log-badge">v1.13.0</span>
                  <span class="mv-log-text">Arsitektur Solid Matte Workstation: eliminasi efek glass/mika berasap di Dark Mode.</span>
                </div>
                <div class="mv-log-item">
                  <span class="mv-log-badge">v1.12.0</span>
                  <span class="mv-log-text">Tipografi proporsional Plus Jakarta Sans & JetBrains Mono referensi cekweb.megapass.web.id.</span>
                </div>
                <div class="mv-log-item">
                  <span class="mv-log-badge">v1.11.0</span>
                  <span class="mv-log-text">Eliminasi total efek glow, kalibrasi rasio scale viewport monitor 76px.</span>
                </div>
              </div>
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
        safeSet('mv_device', key);
        updateChassisView();
      });
    });

    document.getElementById('mv-rot-btn').addEventListener('click', () => {
      state.isLandscape = !state.isLandscape;
      safeSet('mv_landscape', state.isLandscape);
      updateChassisView();
    });

    const touchBtn = document.getElementById('mv-touch-btn');
    if (touchBtn) {
      touchBtn.addEventListener('click', () => {
        state.touchMode = !state.touchMode;
        safeSet('mv_touch_mode', state.touchMode);
        updateChassisView();
      });
    }

    document.getElementById('mv-fit-btn').addEventListener('click', () => {
      state.scaleMode = 'fit';
      safeSet('mv_scale_mode', 'fit');
      updateChassisView();
    });

    document.getElementById('mv-z100-btn').addEventListener('click', () => {
      state.scaleMode = '1.0';
      safeSet('mv_scale_mode', '1.0');
      updateChassisView();
    });

    document.getElementById('mv-theme-btn').addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      safeSet('mv_theme', state.theme);
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

    // Settings Modal Triggers
    document.getElementById('mv-settings-btn').addEventListener('click', () => {
      setModalOpen(true);
    });

    document.getElementById('mv-modal-close').addEventListener('click', () => {
      setModalOpen(false);
    });

    const backdrop = document.getElementById('mv-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          setModalOpen(false);
        }
      });
    }

    // Modal Tabs Navigation
    document.getElementById('mv-tab-nav-prefs').addEventListener('click', () => {
      switchModalTab('prefs');
    });
    document.getElementById('mv-tab-nav-about').addEventListener('click', () => {
      switchModalTab('about');
    });

    // Modal Settings Options Click Handlers
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

    document.querySelectorAll('.mv-opt-touch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.getAttribute('data-val') === 'true';
        state.touchMode = val;
        safeSet('mv_touch_mode', val);
        updateChassisView();
      });
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

  // Keyboard Shortcuts: Esc, R (rotate), T (theme), , (settings)
  window.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('mv-studio-overlay');
    if (!overlay) return;

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

    if (e.key === 'Escape') {
      if (state.isModalOpen) {
        setModalOpen(false);
      } else {
        closeMobileView();
      }
      return;
    }

    // Abaikan jika modifier Ctrl/Cmd/Alt aktif agar tidak tabrakan dengan Ctrl+R (Reload) atau Ctrl+T (New Tab)
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === ',' || e.key === '<') {
      setModalOpen(!state.isModalOpen);
    } else if (e.key === 's' || e.key === 'S') {
      state.touchMode = !state.touchMode;
      safeSet('mv_touch_mode', state.touchMode);
      updateChassisView();
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

  // Listener Resize Jendela (Debounced via requestAnimationFrame)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) cancelAnimationFrame(resizeTimer);
    resizeTimer = requestAnimationFrame(() => {
      if (document.getElementById('mv-studio-overlay') && state.scaleMode === 'fit') {
        updateChassisView();
      }
    });
  });

  // Listener Pesan dari Background Worker (Klik Ikon Toolbar / Shortcut Alt+M)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.action === 'toggle_mobile_view') {
      toggleMobileView();
      sendResponse({ status: 'ok' });
    }
    return true;
  });

})();
