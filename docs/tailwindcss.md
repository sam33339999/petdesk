# Tailwind CSS v4 整合指南

本文件記錄在 Electron Forge + Vite 專案中整合 Tailwind CSS v4 的過程與原理。

## 問題背景

### ESM vs CommonJS 衝突

- **Electron Forge** 的 Vite 插件使用 esbuild 載入配置文件，以 CommonJS 模式運作
- **@tailwindcss/vite** 是 ESM-only 套件，無法被 `require()` 載入
- 直接在 `vite.renderer.config.ts` 中 import `@tailwindcss/vite` 會報錯：

```
"@tailwindcss/vite" resolved to an ESM file. ESM file cannot be loaded by `require`.
```

## 解決方案：使用 PostCSS

### 安裝

```bash
npm install tailwindcss @tailwindcss/postcss postcss --save-dev
```

### 配置

建立 `postcss.config.cjs`：

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

在 CSS 入口文件（`src/index.css`）加入：

```css
@import "tailwindcss";
```

### 為什麼 PostCSS 方案可行？

| 層面 | @tailwindcss/vite | @tailwindcss/postcss |
|------|-------------------|----------------------|
| **載入時機** | Vite 配置文件解析時 | Vite 運行時處理 CSS 時 |
| **載入方式** | esbuild 的 `require()` | Vite 內部的 PostCSS loader |
| **模組格式** | ESM-only | CommonJS 兼容 |

關鍵差異：
- **Vite 配置文件** 被 esbuild 以 CommonJS 模式處理
- **PostCSS 配置** 是在 Vite 已經啟動後才載入，Vite 內部有更好的 ESM/CJS 互操作性

## Tree Shaking 機制

### 常見誤解

> 「透過 PostCSS 是不是把整包 Tailwind CSS 載入？沒有 tree shaking？」

**答案：不是！Tailwind 有非常高效的按需生成機制。**

### 實際運作方式

Tailwind 不是「載入全部再刪除」，而是「只生成需要的」（JIT - Just-In-Time）：

```
掃描源碼文件 → 找出使用的 class → 只生成這些 class 的 CSS
```

例如 `index.html` 中有：

```html
<h1 class="text-3xl">Hello World!</h1>
```

Tailwind 只會生成：

```css
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
```

**沒用到的 class 完全不會出現在最終 CSS 中。**

### 掃描發生在什麼時候？

> 「Runtime 的時候怎麼知道哪裡有引用 Tailwind class？」

**掃描發生在 Build Time / Dev Server 階段，不是瀏覽器 runtime。**

```
┌─────────────────────────────────────────────────────────────┐
│                    Build Time / Dev Server                   │
├─────────────────────────────────────────────────────────────┤
│  1. Vite 啟動 dev server                                     │
│                        ↓                                     │
│  2. Vite 處理 index.css（觸發 PostCSS）                       │
│                        ↓                                     │
│  3. @tailwindcss/postcss 啟動                                │
│                        ↓                                     │
│  4. Tailwind 掃描專案中的所有文件：                            │
│     - index.html  →  找到 "text-3xl"                         │
│     - src/*.ts    →  找到其他 class                          │
│     - src/*.tsx   →  ...                                     │
│                        ↓                                     │
│  5. 生成只包含使用到的 class 的 CSS                            │
│                        ↓                                     │
│  6. CSS 被注入到頁面                                          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Browser Runtime                           │
├─────────────────────────────────────────────────────────────┤
│  瀏覽器收到的是已經處理好的 CSS，不需要再做任何事               │
└─────────────────────────────────────────────────────────────┘
```

### Dev 模式的熱更新

當你在源碼中新增 Tailwind class 時：

1. Vite 偵測到文件變化
2. 重新觸發 PostCSS/Tailwind
3. 掃描到新的 class
4. 熱更新 CSS 到瀏覽器

**瀏覽器本身不需要知道 Tailwind 的存在**，它只收到普通的 CSS。

## 相關文件

- [Tailwind CSS v4 官方文檔](https://tailwindcss.com/docs)
- [Vite PostCSS 支援](https://vitejs.dev/guide/features.html#postcss)
