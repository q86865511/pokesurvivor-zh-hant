# PokéSurvivor 繁體中文版（啟動器＋瀏覽器擴充）

讓網頁遊戲 [PokéSurvivor](https://pokesurvivor.com/) 一打開就是繁體中文。

遊戲自 2026-10-19 起**內建官方繁體中文**（設定 → 圖形 → 語言 → 繁體中文，翻譯由 Zhe Xi Huang 貢獻，見上游
[docs/LOCALIZATION.md](https://github.com/JPTER78/pokesurvivor/blob/main/docs/LOCALIZATION.md)）。
本專案從 v1.1.0（擴充功能 2.0.0）起不再疊加第三方翻譯補丁，只負責「第一次開啟時把遊戲語言預設為繁體中文」。

> 非官方作品。與 PokéSurvivor 開發者、The Pokémon Company、Nintendo、Game Freak 皆無關聯。
> 遊戲帳號、雲端存檔、遊戲更新與翻譯都直接來自原站。

> 其實不裝任何東西也行：在遊戲裡到「設定 → 圖形 → 語言」選「繁體中文」，之後就會一直是中文。

## 方式一：中文版啟動器

獨立的 Windows 程式，雙擊就開啟中文版遊戲。

1. 到 [Releases](https://github.com/q86865511/pokesurvivor-zh-hant/releases/latest) 下載 `PokeSurvivor-zh-win32-x64.zip`。
2. 解壓縮（整個資料夾都要，不能只拿 exe），執行 `PokeSurvivor-zh.exe`。

- **翻譯**：隨遊戲原站更新，啟動器不需要跟著更新。
- **啟動器本體**：啟動時自動檢查本 repo 的 GitHub Releases，有新版會跳出提示，按「前往下載」開啟下載頁。
  也可以從選單「說明 → 檢查更新」手動檢查。

已知限制：「使用 Google 登入」可能被 Google 拒絕（Google 會阻擋內嵌瀏覽器登入），請改用遊戲的帳號密碼登入或訪客模式。

## 方式二：Chrome／Edge 擴充功能

1. 下載本 repo，打開 `chrome://extensions`（Edge 為 `edge://extensions`），開啟「開發人員模式」。
2. 按「載入未封裝項目」，選擇 `pokesurvivor-zh-ext` 資料夾。
3. 若竄改猴裡裝了 Greasy Fork 的繁中補丁，建議停用，避免和遊戲內建翻譯重複處理文字與字型。

擴充功能作用於遊戲站 `pokesurvivor.com`，包含導覽站 `pokesurvivor.org` 內嵌的遊戲畫面；導覽站本身的攻略文章維持原文（遊戲官方翻譯不涵蓋攻略頁）。

## 原理

遊戲的 `js/core/locales.js` 依序採用：玩家存的語言（`localStorage` 的 `ps.lang`）→ 網址 `/en/` → 瀏覽器語言。
本專案在遊戲腳本執行前檢查 `ps.lang`，**沒選過語言才**寫入 `zh-Hant`；玩家之後在遊戲設定改成其他語言，一律尊重。

- 擴充功能：Manifest V3 content script，`run_at: document_start`。
- 啟動器：Electron 的 preload 腳本（頁面腳本之前執行），載入 `https://pokesurvivor.com/`。

## 自行建置啟動器

需要 Node.js 18 以上。

```bash
cd pokesurvivor-zh-launcher
npm install
npm start          # 開發模式執行
npm run pack       # 打包到 dist/PokeSurvivor-zh-win32-x64
```

設定環境變數 `PS_SELFTEST=1` 執行時，會在頁面載入後印出頁面語言、`ps.lang`、首頁文字與更新檢查結果，然後自動結束（供驗證用）。

## 致謝與參考資料

- 遊戲：[PokéSurvivor](https://pokesurvivor.com/)（原始碼：[JPTER78/pokesurvivor](https://github.com/JPTER78/pokesurvivor)）
- 遊戲內建繁體中文：Zhe Xi Huang（[JPTER78/pokesurvivor#74](https://github.com/JPTER78/pokesurvivor/pull/74)）
- v1.0.x 曾使用的翻譯補丁：[PokéSurvivor 繁體中文補丁](https://greasyfork.org/zh-TW/scripts/599869)，作者 [Kai5106](https://greasyfork.org/zh-TW/users/1652257-kai5106)，MIT 授權
- 啟動器框架：[Electron](https://www.electronjs.org/)、[@electron/packager](https://github.com/electron/packager)

## 授權

本 repo 的程式碼以 MIT 授權釋出，見 [LICENSE](LICENSE)。
