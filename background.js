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

// 2. Tangani Shortcut Keyboard Alt+M (Toggle ON/OFF)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-mobile-view') {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab) {
      await toggleTabMobileView(tab);
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
