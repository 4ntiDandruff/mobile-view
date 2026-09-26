// dev-watcher.js - Zero-Bloat Inotify Extension Reloader Server for Mobile View
// Standalone native Node.js HTTP server (zero external npm packages, RAM <25MB, 0% CPU standby)

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8897;
const WATCH_DIR = __dirname;
const WATCHED_FILES = new Set([
  "manifest.json",
  "content.js",
  "content.css",
  "background.js",
  "preview.html",
  "preview.js",
  "rules.json"
]);

let waitingClients = [];
let debounceTimer = null;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*"
  });
  res.end(JSON.stringify(data));
}

// Inotify Linux Kernel Watcher
try {
  fs.watch(WATCH_DIR, { recursive: false }, (eventType, filename) => {
    if (!filename || !WATCHED_FILES.has(filename)) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] [INOTIFY] Detected change on: ${filename} -> Triggering reload for ${waitingClients.length} client(s)`);

      while (waitingClients.length > 0) {
        const res = waitingClients.shift();
        try {
          sendJson(res, 200, { reload: true, file: filename });
        } catch (_) {}
      }
    }, 250);
  });
  console.log(`[+] Inotify watcher attached to: ${WATCH_DIR}`);
} catch (err) {
  console.error("[-] Failed to attach fs.watch:", err.message);
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    });
    res.end();
    return;
  }

  if (req.url === "/wait-reload") {
    waitingClients.push(res);
    req.on("close", () => {
      const idx = waitingClients.indexOf(res);
      if (idx !== -1) waitingClients.splice(idx, 1);
    });

    req.setTimeout(45000, () => {
      const idx = waitingClients.indexOf(res);
      if (idx !== -1) waitingClients.splice(idx, 1);
      sendJson(res, 200, { reload: false });
    });
    return;
  }

  if (req.url === "/ping") {
    sendJson(res, 200, { status: "ok", service: "mobile-view-watcher", uptime: process.uptime() });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[*] Mobile View Dev Watcher running on http://127.0.0.1:${PORT}`);
});
