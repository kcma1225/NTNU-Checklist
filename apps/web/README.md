# apps/web — NTNU 碩士生指南（公開網站）

Next.js App Router，`output: 'export'` 完全靜態匯出，沒有伺服器、沒有 API route。所有資料在 build 當下從 repo 根目錄的 `data/*.json` 讀入並驗證（見 `src/lib/data.ts`），之後就是純靜態 HTML/CSS/JS。

```bash
pnpm --filter web dev      # 本機開發
pnpm --filter web build    # 靜態匯出到 apps/web/out/
```

部署在 Cloudflare Pages，設定與資料流見 repo 根目錄 README 的「Cloudflare Pages 設定」一節。

要修改任務／連結資料，請使用 `apps/editor`，不要直接手改 JSON。
