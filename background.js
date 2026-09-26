// background.js - Mobile View Service Worker (Manifest V3)

/**
 * Mengaktifkan / Menutup (Toggle) Mobile View pada tab aktif
 */
async function toggleTabMobileView(tab) {
  if (!tab || !tab.id) return;
  const url = tab.url || '';

  // Halaman web standar (localhost, intranet, http/https, file)
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://')) {
    try {
      // Kirim sinyal toggle ke content.js
      await chrome.tabs.sendMessage(tab.id, { action: 'toggle_mobile_view' });
    } catch (err) {
      // Jika tab sudah dibuka sebelum ekstensi di-load/reload, suntik script on-the-fly
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['content.css']
        });
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        await chrome.tabs.sendMessage(tab.id, { action: 'toggle_mobile_view' });
      } catch (injectErr) {
        console.error('[Mobile View] Gagal injeksi script:', injectErr);
      }
    }
  } else {
    // Halaman internal browser (chrome:// atau edge://) yang diproteksi kernel Chromium
    const previewUrl = chrome.runtime.getURL('preview.html') + '?url=' + encodeURIComponent('https://google.com');
    await chrome.tabs.create({ url: previewUrl });
  }
}

// 1. Tangani Klik Ikon Toolbar (Toggle ON/OFF)
chrome.action.onClicked.addListener(async (tab) => {
  await toggleTabMobileView(tab);
});

// 2. Tangani Shortcut Keyboard Alt+M (Toggle ON/OFF - Resilient Multi-Window Query)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-mobile-view') {
    try {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      }
      if (!tab) {
        const tabs = await chrome.tabs.query({ active: true });
        tab = tabs && tabs[0];
      }
      if (tab) {
        await toggleTabMobileView(tab);
      }
    } catch (cmdErr) {
      console.error('[Mobile View] Error handling command:', cmdErr);
    }
  }
});

// 3. Setup Context Menu (Klik Kanan)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'mobile-view-context',
    title: 'Toggle Mobile View (Alt+M)',
    contexts: ['page']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'mobile-view-context' && tab) {
    await toggleTabMobileView(tab);
  }
});

// 4. Watchdog Auto-Reload Client (Zero-Touch Hot Reload via Inotify)
(function setupAutoReload() {
  const WATCHER_URL = "http://127.0.0.1:8897/wait-reload";
  let isPolling = false;
  let isReloading = false;
  let retryDelay = 3000;

  const poll = () => {
    if (isReloading || isPolling) return;
    isPolling = true;

    fetch(WATCHER_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Status " + res.status);
        return res.json();
      })
      .then((data) => {
        isPolling = false;
        retryDelay = 3000;
        if (data && data.reload && !isReloading) {
          isReloading = true;
          console.log("[MobileView-Watcher] Inotify update detected:", data.file);
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs[0] && tabs[0].id) {
              try { chrome.tabs.reload(tabs[0].id); } catch (_) {}
            }
            chrome.runtime.reload();
          });
        } else {
          setTimeout(poll, 150);
        }
      })
      .catch(() => {
        isPolling = false;
        const waitTime = retryDelay;
        retryDelay = Math.min(15000, retryDelay * 1.5);
        setTimeout(poll, waitTime);
      });
  };

  poll();

  chrome.tabs.onActivated.addListener(() => {
    if (!isPolling && !isReloading) poll();
  });
})();
