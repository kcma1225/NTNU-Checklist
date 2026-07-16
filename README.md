# NTNU 碩士生指南

國立臺灣師範大學碩士生入學與就學指南網站：時間軸 + 任務卡片，幫助學生快速掌握「現在需要做什麼」。

## 專案結構

```
NTNU_guide/
├── data/                 # 唯一資料來源（tasks / links / guide / categories）
├── packages/shared/      # 共用 Zod schema、任務狀態計算、Google Calendar URL 產生
├── apps/web/              # 公開網站 — Next.js 靜態匯出，部署在 Cloudflare Pages
└── apps/editor/           # 內容編輯工具 — 部署在你自己的 VM，有 Basic Auth 保護
```

## 資料流

```
apps/editor（你的 VM，Basic Auth 保護）
  → 在編輯器 UI 新增／編輯／刪除任務或連結
  → API route 以 Zod 驗證，寫入 data/tasks.json / data/links.json（atomic write）
  → 點擊「發布」→ 編輯器對 repo 執行 git add/commit/push（僅限 data/ 目錄）
  → GitHub 收到新的 commit
  → Cloudflare Pages 偵測到 push，自動執行建置
      → apps/web 於 build 時讀取 data/*.json 並驗證
      → 產出完全靜態的 apps/web/out/ 並上線
```

`apps/web` 在正式環境完全沒有伺服器端邏輯，是純靜態網站；`apps/editor` 相反，需要一個持續執行的
Node process 才能寫檔案與呼叫 git，因此兩者分開部署。

## Cloudflare Pages 設定（apps/web）

在 Cloudflare dashboard 建立 Pages 專案並連接這個 GitHub repo，填入：

| 設定 | 值 |
| --- | --- |
| Root directory | repo 根目錄（**不是** `apps/web`）— `apps/web` 於 build 時讀取 `../../data`，需要整個 repo |
| Build command | `pnpm install && pnpm --filter web build` |
| Build output directory | `apps/web/out` |
| Environment variable | `NODE_VERSION=20`（或更新版本） |

設定好之後，每次 push 到預設分支，Cloudflare Pages 會自動重新建置並上線，不需要額外的 CI 設定。

## apps/editor 部署到你的 VM

1. 在 VM 上 clone 這個 repo（需要能 push 回 GitHub 的權限 — SSH deploy key 或 PAT，並設定好
   `git config user.name` / `user.email`）
2. 設定環境變數（例如透過 `.env.local` 或你的 process manager，**不要**寫進 repo）：
   ```bash
   EDITOR_USERNAME=...
   EDITOR_PASSWORD=...
   ```
   見 `apps/editor/.env.example`。這兩個變數沒設定的話，編輯器會直接回傳 500，不會有「沒有驗證」的
   狀態。
3. 在編輯器前面放一個會終止 TLS 的 reverse proxy（例如 Caddy，會自動申請 Let's Encrypt 憑證）。
   HTTP Basic Auth 的帳密是以 base64 明碼夾在 header 裡，一定要走 HTTPS。
4. `pnpm --filter editor build && pnpm --filter editor start`（或用 systemd/pm2 常駐執行）

登入畫面就是瀏覽器原生的 Basic Auth 彈出視窗（帳號密碼即步驟 2 設定的值），編輯完資料後點右上角
「發布」，會自動 commit + push 到 GitHub，觸發 Cloudflare Pages 重新建置。

## 開發

```bash
pnpm install

pnpm --filter web dev      # 公開網站開發伺服器
pnpm --filter editor dev   # 內容編輯器（本機開發時記得設定 EDITOR_USERNAME/PASSWORD）

pnpm --filter web build    # 靜態匯出到 apps/web/out/
```

日期若尚未公告，請在編輯器勾選「日期尚未公布」而不是填假日期 — 前端會顯示「待公告」，並自動停用
「加入行事曆」按鈕。
