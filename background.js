// background.js - Mobile View Service Worker (Manifest V3)

/**
 * Membuka tab studio Mobile View dengan URL target
 */
async function launchMobileView(targetUrl) {
  let url = targetUrl || '';

  // Validasi URL
  if (
    !url ||
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url.startsWith('about:')
  ) {
    url = 'https://google.com';
  }

  const previewBase = chrome.runtime.getURL('preview.html');
  const previewUrl = `${previewBase}?url=${encodeURIComponent(url)}`;
  await chrome.tabs.create({ url: previewUrl });
}

// 1. Tangani Klik Ikon Toolbar
chrome.action.onClicked.addListener(async (tab) => {
  if (tab && tab.url) {
    // Jika sedang di dalam halaman preview.html, jangan bungkus lagi
    if (tab.url.startsWith(chrome.runtime.getURL('preview.html'))) {
      return;
    }
    await launchMobileView(tab.url);
  } else {
    await launchMobileView('');
  }
});

// 2. Tangani Shortcut Keyboard (Alt+M)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-mobile-view') {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab && tab.url) {
      if (tab.url.startsWith(chrome.runtime.getURL('preview.html'))) {
        return;
      }
      await launchMobileView(tab.url);
    } else {
      await launchMobileView('');
    }
  }
});

// 3. Setup Context Menu (Klik Kanan)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'mobile-view-context',
    title: 'Buka di Mobile View (Alt+M)',
    contexts: ['page', 'link']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'mobile-view-context') {
    const targetUrl = info.linkUrl || info.pageUrl || (tab && tab.url) || '';
    await launchMobileView(targetUrl);
  }
});
