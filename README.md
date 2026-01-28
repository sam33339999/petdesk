# PetDesk - Electron Starter Kit

一個開箱即用的 **Electron + React** 桌面應用開發模板。

## 技術棧

- **Electron 40** + **Electron Forge** - 桌面應用框架與打包工具
- **React 19** + **TypeScript** - UI 框架
- **Vite** - 快速開發與熱重載
- **TailwindCSS 4** - 樣式框架
- **React Router 7** - 路由管理
- **shadcn/ui** - 50+ 預裝 UI 組件

## 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發模式
npm start

# 打包應用
npm run package

# 建置安裝檔
npm run make
```

## 使用 gitpick 快速獲取

```bash
npx gitpick https://github.com/sam33339999/petdesk --branch feat/starter-kit {project-name}
```

## 專案結構

```
src/
├── main.ts              # Electron 主進程
├── preload.ts           # 預載腳本 (IPC 橋接)
├── renderer.ts          # 渲染進程入口
├── app.tsx              # React 應用入口
├── components/ui/       # shadcn/ui 組件庫
├── hooks/               # React Hooks
├── lib/                 # 工具函數
└── styles/              # 全域樣式

docs/                    # 技術文檔
├── electron.md
├── electron-forge.md
├── react-router.md
└── tailwindcss.md
```

## 預裝 UI 組件

| 類別 | 組件 |
|------|------|
| 基礎 | Button, Input, Label, Badge, Card, Skeleton |
| 表單 | Checkbox, Radio, Select, Switch, Slider, Form, Field |
| 導航 | Tabs, Menubar, Navigation Menu, Breadcrumb, Sidebar |
| 彈窗 | Dialog, Alert Dialog, Sheet, Drawer, Popover, Tooltip |
| 數據 | Table, Calendar, Chart, Carousel, Progress, Pagination |
| 其他 | Command, Context Menu, Accordion, Collapsible, Sonner |

## 文檔

詳細技術文檔請參考 `docs/` 目錄。

## License

MIT
