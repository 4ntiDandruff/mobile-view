/**
 * preview.js - Controller untuk Mobile View Studio
 * Zero build-step, reaktif, dan performa tinggi
 */

const DEVICES = {
  iphone15pro: {
    name: 'iPhone 15 Pro',
    category: 'Apple',
    width: 393,
    height: 852,
    radius: 54,
    bezel: 12,
    type: 'dynamic-island',
    platform: 'ios'
  },
  iphone15promax: {
    name: 'iPhone 15 Pro Max',
    category: 'Apple',
    width: 430,
    height: 932,
    radius: 56,
    bezel: 12,
    type: 'dynamic-island',
    platform: 'ios'
  },
  iphone14: {
    name: 'iPhone 14 / 13',
    category: 'Apple',
    width: 390,
    height: 844,
    radius: 47,
    bezel: 12,
    type: 'notch',
    platform: 'ios'
  },
  iphonese: {
    name: 'iPhone SE (3rd Gen)',
    category: 'Apple',
    width: 375,
    height: 667,
    radius: 28,
    bezel: 14,
    type: 'classic-se',
    platform: 'ios'
  },
  galaxys24: {
    name: 'Samsung Galaxy S24',
    category: 'Android',
    width: 412,
    height: 915,
    radius: 42,
    bezel: 10,
    type: 'punch-hole',
    platform: 'android'
  },
  pixel8: {
    name: 'Google Pixel 8',
    category: 'Android',
    width: 412,
    height: 892,
    radius: 44,
    bezel: 11,
    type: 'punch-hole',
    platform: 'android'
  },
  ipadmini: {
    name: 'iPad Mini (6th Gen)',
    category: 'Tablet',
    width: 768,
    height: 1024,
    radius: 34,
    bezel: 16,
    type: 'tablet',
    platform: 'tablet'
  },
  custom: {
    name: 'Custom Ukuran',
    category: 'Custom',
    width: 375,
    height: 812,
    radius: 40,
    bezel: 12,
    type: 'punch-hole',
    platform: 'custom'
  }
};

function mobileStudio() {
  return {
    urlInput: '',
    currentUrl: '',
    deviceKey: localStorage.getItem('mv_device') || 'iphone15pro',
    devices: DEVICES,
    isLandscape: localStorage.getItem('mv_landscape') === 'true',
    scaleMode: localStorage.getItem('mv_scale_mode') || 'fit',
    zoom: 1.0,
    bezelTheme: localStorage.getItem('mv_bezel_theme') || 'black',
    canvasBg: localStorage.getItem('mv_canvas_bg') || 'dark',
    customW: parseInt(localStorage.getItem('mv_custom_w')) || 375,
    customH: parseInt(localStorage.getItem('mv_custom_h')) || 812,
    copiedTooltip: false,
    isLoading: false,

    init() {
      // 1. Ekstrak URL dari query parameter
      const params = new URLSearchParams(window.location.search);
      let target = params.get('url');

      if (!target || target === 'about:blank') {
        target = 'http://localhost:8000';
      }

      // Pastikan ada skema protokol
      if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('file://')) {
        target = 'https://' + target;
      }

      this.currentUrl = target;
      this.urlInput = target;

      // 2. Set listener resize untuk auto-fit
      window.addEventListener('resize', () => {
        if (this.scaleMode === 'fit') {
          this.applyFitScale();
        }
      });

      // 3. Shortcut keyboard: R untuk rotasi
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'r' || e.key === 'R') {
          this.toggleOrientation();
        }
      });

      // Hitung skala awal
      this.$nextTick(() => {
        this.updateScale();
      });
    },

    get activeDevice() {
      if (this.deviceKey === 'custom') {
        return {
          ...DEVICES.custom,
          width: this.customW,
          height: this.customH
        };
      }
      return DEVICES[this.deviceKey] || DEVICES.iphone15pro;
    },

    get screenWidth() {
      const dev = this.activeDevice;
      return this.isLandscape ? dev.height : dev.width;
    },

    get screenHeight() {
      const dev = this.activeDevice;
      return this.isLandscape ? dev.width : dev.height;
    },

    get frameRadius() {
      const dev = this.activeDevice;
      return dev.radius;
    },

    get innerRadius() {
      const dev = this.activeDevice;
      return Math.max(8, dev.radius - dev.bezel);
    },

    setDevice(key) {
      this.deviceKey = key;
      localStorage.setItem('mv_device', key);
      this.updateScale();
    },

    toggleOrientation() {
      this.isLandscape = !this.isLandscape;
      localStorage.setItem('mv_landscape', this.isLandscape);
      this.updateScale();
    },

    setScaleMode(mode) {
      this.scaleMode = mode;
      localStorage.setItem('mv_scale_mode', mode);
      this.updateScale();
    },

    updateScale() {
      if (this.scaleMode === 'fit') {
        this.applyFitScale();
      } else {
        this.zoom = parseFloat(this.scaleMode);
      }
    },

    applyFitScale() {
      const containerHeight = window.innerHeight - 90; // kurangi header bar
      const containerWidth = window.innerWidth - 60;
      const totalDevHeight = this.screenHeight + (this.activeDevice.bezel * 2) + 40;
      const totalDevWidth = this.screenWidth + (this.activeDevice.bezel * 2) + 40;

      const scaleY = containerHeight / totalDevHeight;
      const scaleX = containerWidth / totalDevWidth;
      const bestScale = Math.min(scaleX, scaleY, 1.0);

      // Batasi skala minimum 0.35 dan bulat ke 2 desimal
      this.zoom = Math.max(0.35, Math.min(1.0, Math.round(bestScale * 100) / 100));
    },

    setBezelTheme(theme) {
      this.bezelTheme = theme;
      localStorage.setItem('mv_bezel_theme', theme);
    },

    setCanvasBg(bg) {
      this.canvasBg = bg;
      localStorage.setItem('mv_canvas_bg', bg);
    },

    submitUrl() {
      let url = this.urlInput.trim();
      if (!url) return;
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file://')) {
        url = 'https://' + url;
      }
      this.urlInput = url;
      this.currentUrl = url;
      this.reloadFrame();
    },

    reloadFrame() {
      this.isLoading = true;
      const frame = document.getElementById('device-frame');
      if (frame) {
        frame.src = this.currentUrl;
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 600);
    },

    copyUrl() {
      navigator.clipboard.writeText(this.currentUrl);
      this.copiedTooltip = true;
      setTimeout(() => {
        this.copiedTooltip = false;
      }, 1800);
    },

    openExternal() {
      window.open(this.currentUrl, '_blank');
    }
  };
}
