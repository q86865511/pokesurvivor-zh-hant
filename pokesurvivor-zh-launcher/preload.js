// 遊戲的 js/core/locales.js 在解析 HTML 時就讀 ps.lang，所以必須在頁面腳本之前寫入。
// 只在玩家沒選過語言時設定；之後在遊戲「設定 → 圖形 → 語言」改的選擇一律尊重。
try {
  if (/^(www\.)?pokesurvivor\.com$/.test(location.hostname) && !localStorage.getItem('ps.lang')) {
    localStorage.setItem('ps.lang', 'zh-Hant');
  }
} catch { /* storage 被封鎖時遊戲會退回瀏覽器語言 */ }
