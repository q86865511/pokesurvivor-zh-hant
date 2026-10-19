# PROGRESS

## 目前狀態
啟動器 v1.0.1（內附補丁 1.3.3）與擴充功能可用，已發布到 GitHub。

## 已完成
- 2026-10-20：同步上游補丁 1.1.0 → 1.3.3；擴充功能加入 pokesurvivor.org 網域、改 `document_end`＋`all_frames`（導覽站以 iframe 嵌入遊戲）；啟動器升 v1.0.1 重新打包，`PS_SELFTEST=1` 實測注入 1.3.3 成功。
- 2026-10-14：Electron 啟動器加入 GitHub Releases 更新檢查（啟動自動檢查＋選單手動檢查，只通知不自動安裝）；建立 README、LICENSE，發布 repo 與 v1.0.0 Release。
- 2026-10-14：Electron 啟動器（啟動時從 Greasy Fork 自動更新補丁，失敗退回快取／內附版本），打包為 win32-x64，`PS_SELFTEST=1` 實測注入成功。
- 2026-10-14：MV3 擴充功能 `pokesurvivor-zh-ext`，以 `world: MAIN` content script 注入 Greasy Fork 腳本 599869。

## 進行中

## 待辦

## 已知問題
- 啟動器內「使用 Google 登入」可能被 Google 阻擋內嵌瀏覽器（未實測）。
- 補丁字典以原文為 key，遊戲新增文字要等補丁作者更新。

## 重要決策紀錄
- 2026-10-14：啟動器更新採「自動檢查＋提示下載」而非 electron-updater 靜默安裝——無程式碼簽章會反覆觸發 SmartScreen，且翻譯本身已由 Greasy Fork 自動更新，本體少有更新需求。
