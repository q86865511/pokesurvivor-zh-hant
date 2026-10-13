const { app, BrowserWindow, Menu, shell, net, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

const GAME_URL = 'https://pokesurvivor.com/en/';
const GAME_HOSTS = new Set(['pokesurvivor.com', 'www.pokesurvivor.com']);
const PATCH_URL = 'https://update.greasyfork.org/scripts/599869/Pok%C3%A9Survivor%20%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%E8%A3%9C%E4%B8%81.user.js';
const BUNDLED_PATCH = path.join(__dirname, 'patch.js');
const RELEASE_API = 'https://api.github.com/repos/q86865511/pokesurvivor-zh-hant/releases/latest';

let patchSource = '';
let patchOrigin = '';

function versionOf(src) {
  const m = /@version\s+(\S+)/.exec(src || '');
  return m ? m[1] : '0';
}

function newerThan(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d > 0;
  }
  return false;
}

function readIfExists(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

// 優先用最新版：線上 > 快取 > 內附；線上抓不到（離線、逾時）就沿用本機最新的那份。
async function loadPatch() {
  const cachePath = path.join(app.getPath('userData'), 'patch.js');
  let best = readIfExists(BUNDLED_PATCH);
  patchOrigin = '內附';
  const cached = readIfExists(cachePath);
  if (cached && newerThan(versionOf(cached), versionOf(best))) {
    best = cached;
    patchOrigin = '快取';
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await net.fetch(PATCH_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const online = await res.text();
      if (online.includes('==UserScript==') && !newerThan(versionOf(best), versionOf(online))) {
        best = online;
        patchOrigin = '線上';
        fs.writeFileSync(cachePath, online, 'utf8');
      }
    }
  } catch (err) {
    console.warn('補丁線上更新失敗，使用本機版本：', err.message);
  }
  patchSource = best;
  console.log(`補丁版本 ${versionOf(best)}（來源：${patchOrigin}）`);
}

async function fetchLatestRelease() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await net.fetch(RELEASE_API, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'pokesurvivor-zh-launcher' },
    });
    if (!res.ok) throw new Error(`GitHub 回應 ${res.status}`);
    const data = await res.json();
    const latest = String(data.tag_name || '').replace(/^v/, '');
    return { latest, current: app.getVersion(), url: data.html_url, notes: data.body || '' };
  } finally {
    clearTimeout(timer);
  }
}

// 只通知、不自動安裝：沒有程式碼簽章的自動安裝會反覆觸發 SmartScreen，且翻譯本身已由 loadPatch 自動更新。
async function checkForUpdates(win, { manual }) {
  let info;
  try {
    info = await fetchLatestRelease();
  } catch (err) {
    if (manual) dialog.showMessageBox(win, { type: 'warning', message: '檢查更新失敗', detail: err.message });
    return null;
  }
  if (process.env.PS_SELFTEST) return info;
  if (info.latest && newerThan(info.latest, info.current)) {
    const { response } = await dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['前往下載', '稍後'],
      defaultId: 0,
      cancelId: 1,
      message: `啟動器有新版本 ${info.latest}（目前 ${info.current}）`,
      detail: info.notes.slice(0, 800),
    });
    if (response === 0) shell.openExternal(info.url);
  } else if (manual) {
    dialog.showMessageBox(win, {
      type: 'info',
      message: `已是最新版本（${info.current}）`,
      detail: `翻譯補丁版本 ${versionOf(patchSource)}（來源：${patchOrigin}）`,
    });
  }
  return info;
}

function isGameUrl(url) {
  try { return GAME_HOSTS.has(new URL(url).hostname); } catch { return false; }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'PokéSurvivor 中文版',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });

  win.webContents.on('did-finish-load', () => {
    const url = win.webContents.getURL();
    if (isGameUrl(url) && patchSource) {
      win.webContents.executeJavaScript(patchSource).catch((err) => console.error('注入失敗：', err));
      if (process.env.PS_SELFTEST) {
        setTimeout(async () => {
          const probe = await win.webContents.executeJavaScript(
            'JSON.stringify({ url: location.href, lang: document.documentElement.lang, text: document.body.innerText.slice(0, 200) })'
          );
          console.log('SELFTEST', probe);
          console.log('SELFTEST update', JSON.stringify(await checkForUpdates(win, { manual: false })));
          app.quit();
        }, 3000);
      }
    }
  });

  // 遊戲站內連結留在視窗內；登入彈窗（Google 等）開子視窗；其餘外部連結交給系統瀏覽器。
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isGameUrl(url) || /accounts\.google\.com|\.firebaseapp\.com/.test(url)) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadURL(GAME_URL);
  return win;
}

function buildMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: '檢視',
      submenu: [
        { role: 'reload', label: '重新載入' },
        { role: 'togglefullscreen', label: '全螢幕' },
        { role: 'toggleDevTools', label: '開發者工具' },
      ],
    },
    {
      label: '說明',
      submenu: [
        { label: '檢查更新', click: (_, win) => checkForUpdates(win, { manual: true }) },
        { label: '專案頁面（GitHub）', click: () => shell.openExternal('https://github.com/q86865511/pokesurvivor-zh-hant') },
      ],
    },
  ]));
}

app.whenReady().then(async () => {
  buildMenu();
  await loadPatch();
  const win = createWindow();
  if (!process.env.PS_SELFTEST) {
    win.webContents.once('did-finish-load', () => checkForUpdates(win, { manual: false }));
  }
});

app.on('window-all-closed', () => app.quit());
