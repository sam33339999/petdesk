# React Router Documentation

## Overview

React Router 是 React 應用中最常用的路由解決方案。本項目使用 React Router v7。

## 安裝

```bash
npm install react-router
```

## 基本使用

```tsx
import { createHashRouter, RouterProvider } from 'react-router';

const router = createHashRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
]);

const root = createRoot(document.body);
root.render(<RouterProvider router={router} />);
```

## Troubleshooting

### Electron 中必須使用 Hash Router

在 Electron 中使用 React Router 時，**必須使用 Hash Router**，因為 Electron 使用 `file://` 協議加載頁面，不支持傳統的 browser history。

#### 問題

使用 `createBrowserRouter` 會導致路由無法正常切換。

#### 解決方案

```tsx
// ❌ 錯誤：BrowserRouter 在 Electron 中無法正常運作
import { createBrowserRouter, RouterProvider } from 'react-router';
const router = createBrowserRouter([...]);

// ✅ 正確：使用 HashRouter
import { createHashRouter, RouterProvider } from 'react-router';
const router = createHashRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
]);
```

### React Router v7 Import 路徑

React Router v7 的 import 路徑有變化，需注意以下問題：

#### 問題

```tsx
// ❌ 錯誤：會出現 "Unable to resolve path to module 'react-router/dom'" 警告
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from "react-router/dom";
```

#### 解決方案

```tsx
// ✅ 正確：統一從 'react-router' 導入
import { createHashRouter, RouterProvider } from 'react-router';
```

## Sources

- [React Router Official Documentation](https://reactrouter.com/)
