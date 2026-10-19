# PROGRESS

## 目前狀態
啟動器 v1.1.0／擴充功能 2.0.0 改用遊戲內建繁中（本地已 commit，尚未 push／發 Release）。

## 已完成
- 2026-10-20：遊戲 10/19 起內建官方繁中（上游 `--faltan` 對英文字典缺 0 條、i18n 測試 18/18 過，線上實測不靠補丁即中文）→ 停用疊加的 Greasy Fork 補丁並移除 `patch.js`；啟動器改載 `https://pokesurvivor.com/`，以 preload 在頁面腳本前於 `ps.lang` 未設定時寫入 `zh-Hant`；擴充功能改為 `document_start` 的 `set-lang.js` 做同樣的事。打包後 exe `PS_SELFTEST=1` 實測 `lang`／`ps.lang` 皆為 zh-Hant。
- 2026-10-20：同步上游補丁 1.1.0 → 1.3.3；擴充功能加入 pokesurvivor.org 網域、改 `document_end`＋`all_frames`（導覽站以 iframe 嵌入遊戲）；啟動器升 v1.0.1 重新打包，`PS_SELFTEST=1` 實測注入 1.3.3 成功。
- 2026-10-14：Electron 啟動器加入 GitHub Releases 更新檢查（啟動自動檢查＋選單手動檢查，只通知不自動安裝）；建立 README、LICENSE，發布 repo 與 v1.0.0 Release。
- 2026-10-14：Electron 啟動器（啟動時從 Greasy Fork 自動更新補丁，失敗退回快取／內附版本），打包為 win32-x64，`PS_SELFTEST=1` 實測注入成功。
- 2026-10-14：MV3 擴充功能 `pokesurvivor-zh-ext`，以 `world: MAIN` content script 注入 Greasy Fork 腳本 599869。

## 進行中

## 待辦
- push 並發布 v1.1.0 Release（附新打包的 zip）。

## 已知問題
- 啟動器內「使用 Google 登入」可能被 Google 阻擋內嵌瀏覽器（未實測）。
- 擴充功能 2.0.0 未在真實 Chrome 載入實測（邏輯僅一行 localStorage 寫入）。
- 導覽站 pokesurvivor.org 的攻略文章不再翻譯（官方翻譯不涵蓋攻略頁，舊補丁曾翻其 UI 標籤）。

## 重要決策紀錄
- 2026-10-20：改用遊戲內建繁中、停用第三方補丁——官方字典已全覆蓋且隨遊戲更新，疊加補丁只會落後並與遊戲的 CJK 字型覆寫互相干擾；只在玩家未選語言時預設 zh-Hant，尊重之後的選擇。
- 2026-10-14：啟動器更新採「自動檢查＋提示下載」而非 electron-updater 靜默安裝——無程式碼簽章會反覆觸發 SmartScreen，且翻譯本身已由 Greasy Fork 自動更新，本體少有更新需求。
