# NTNU 指南編輯器

編輯 `data/*.json`（任務、常用連結）的內容管理工具，並能一鍵發布（git commit + push）到
GitHub，觸發 Cloudflare Pages 重新建置公開網站。

## 部署前必讀：這個 app 現在是對外開放的

跟最初的版本不同，這個編輯器現在預期會跑在你自己的 VM 上、對外開放。它靠 **HTTP Basic
Auth**（瀏覽器原生的登入彈出視窗）做存取控制，見 `src/proxy.ts`：

- 必須設定 `EDITOR_USERNAME` / `EDITOR_PASSWORD` 這兩個環境變數（見 `.env.example`），
  兩者缺一，整個 app 會直接回 500，**不會**有「沒有密碼保護」的狀態。
- Basic Auth 的帳密是用 base64 編碼夾在 request header 裡，等同明碼，**一定要**在前面放一個
  終止 TLS 的 reverse proxy（Caddy 最簡單，會自動申請 Let's Encrypt 憑證），不要直接把
  `next start` 的 port 暴露在公開的 80/443。
- API routes（`/api/tasks`, `/api/links`, `/api/publish`）跟頁面一樣受 Basic Auth 保護。

## 「發布」怎麼運作

點右上角「發布」會呼叫 `POST /api/publish`（見 `src/lib/git.ts`），對 repo 執行：

```
git add -- data
git commit -m "<你輸入的訊息，或預設訊息>"
git push
```

- 永遠只 add `data/` 目錄，不會用 `-A` 或 `-a`，不會動到 repo 裡其他未提交的東西。
- push 失敗（例如遠端有新的 commit、需要先 pull）時**不會**自動嘗試合併或強制推送，只會把
  git 的錯誤訊息原樣顯示出來 — 這種情況請自己 SSH 進 VM 處理。
- 這代表 VM 上的這份 git checkout 必須有推回 GitHub 的權限：SSH remote + 一把有寫入權限的
  deploy key，或是 HTTPS remote + git credential helper 存好 PAT。並確認
  `git config user.name` / `user.email` 已設定，否則 commit 會失敗。

## 使用方式

```bash
cp .env.example .env.local   # 填入 EDITOR_USERNAME / EDITOR_PASSWORD
pnpm --filter editor dev     # 本機開發
# 或正式執行：
pnpm --filter editor build && pnpm --filter editor start
```

## 為什麼要跟公開網站分開部署

`apps/web` 是完全靜態匯出（`output: 'export'`）的網站，部署在 Cloudflare Pages，沒有伺服器、
沒有 API route。這個編輯器則相反：需要一個持續執行的 Node 伺服器來寫檔案、呼叫 git，所以獨立
部署在你自己的 VM 上，用 Basic Auth + HTTPS 保護。
