# PokéSurvivor 繁體中文版（啟動器＋瀏覽器擴充）

讓網頁遊戲 [PokéSurvivor](https://pokesurvivor.com/en/) 顯示繁體中文的兩種方式，**不需要安裝竄改猴（Tampermonkey）**。

翻譯內容完全來自 Kai5106 製作的 Greasy Fork 腳本
[PokéSurvivor 繁體中文補丁](https://greasyfork.org/zh-TW/scripts/599869)；本專案只負責「把那份腳本注入遊戲頁面」，不改動翻譯本身。

> 非官方作品。與 PokéSurvivor 開發者、The Pokémon Company、Nintendo、Game Freak 皆無關聯。
> 遊戲帳號、雲端存檔與遊戲更新都直接使用原站，本專案只在你的畫面上做文字顯示替換。

## 方式一：中文版啟動器（推薦）

獨立的 Windows 程式，雙擊就開啟中文版遊戲。

1. 到 [Releases](https://github.com/q86865511/pokesurvivor-zh-hant/releases/latest) 下載 `PokeSurvivor-zh-win32-x64.zip`。
2. 解壓縮（整個資料夾都要，不能只拿 exe），執行 `PokeSurvivor-zh.exe`。

更新機制：

- **翻譯補丁自動更新**：每次啟動會從 Greasy Fork 抓最新版補丁並快取；離線時使用上次快取或內附版本。
- **啟動器本體**：啟動時自動檢查本 repo 的 GitHub Releases，有新版會跳出提示，按「前往下載」開啟下載頁。
  也可以從選單「說明 → 檢查更新」手動檢查。

已知限制：「使用 Google 登入」可能被 Google 拒絕（Google 會阻擋內嵌瀏覽器登入），請改用遊戲的帳號密碼登入或訪客模式。

## 方式二：Chrome／Edge 擴充功能

1. 下載本 repo，打開 `chrome://extensions`（Edge 為 `edge://extensions`），開啟「開發人員模式」。
2. 按「載入未封裝項目」，選擇 `pokesurvivor-zh-ext` 資料夾。
3. 若竄改猴裡也裝了同一份腳本，請先停用，避免重複翻譯。

擴充功能同時作用於遊戲站 `pokesurvivor.com` 與導覽站 `pokesurvivor.org`（含其內嵌的遊戲畫面）。

擴充功能不會自動更新補丁；補丁出新版時，用 Greasy Fork 上的新腳本覆蓋 `pokesurvivor-zh-ext/patch.js`，再到擴充功能頁按重新載入。

## 原理

補丁是純顯示層替換：用字典把西班牙文／英文原文換成中文，處理 DOM 文字（TreeWalker＋MutationObserver），
並覆寫 canvas 的 `fillText`／`strokeText`／`measureText` 翻譯遊戲畫面內文字、把不含中文的像素字型換成中文字型。
因為它不需要任何竄改猴專屬 API，所以只要能在頁面主環境執行腳本即可：

- 擴充功能：Manifest V3 content script，`"world": "MAIN"`。
- 啟動器：Electron 載入原站，頁面載入完成時以 `executeJavaScript` 注入。

## 自行建置啟動器

需要 Node.js 18 以上。

```bash
cd pokesurvivor-zh-launcher
npm install
npm start          # 開發模式執行
npm run pack       # 打包到 dist/PokeSurvivor-zh-win32-x64
```

設定環境變數 `PS_SELFTEST=1` 執行時，會在注入後印出頁面語言、首頁文字與更新檢查結果，然後自動結束（供驗證用）。

## 致謝與參考資料

- 遊戲：[PokéSurvivor](https://pokesurvivor.com/)（原始碼與原文字串：[JPTER78/pokesurvivor](https://github.com/JPTER78/pokesurvivor)）
- 翻譯補丁：[PokéSurvivor 繁體中文補丁](https://greasyfork.org/zh-TW/scripts/599869)，作者 [Kai5106](https://greasyfork.org/zh-TW/users/1652257-kai5106)，MIT 授權
- 寶可夢中文名稱資料：[PokeAPI](https://pokeapi.co/)（由補丁作者引用）
- 啟動器框架：[Electron](https://www.electronjs.org/)、[@electron/packager](https://github.com/electron/packager)

## 授權

本 repo 的程式碼以 MIT 授權釋出，見 [LICENSE](LICENSE)。內附的 `patch.js` 為上述補丁的原檔，保留其原本的 MIT 授權聲明。
