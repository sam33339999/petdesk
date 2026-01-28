# Electron Documentation

## Overview

Electron is a framework for creating cross-platform desktop applications using web technologies like JavaScript, HTML, and CSS, built upon Node.js and Chromium.

## Process Model

### Main Process

The main process is the entry point of every Electron app. It creates `BrowserWindow` instances, manages app lifecycle, and handles system-level operations.

**Key Responsibilities:**
- Creating and managing BrowserWindow instances
- Handling application lifecycle events
- Managing inter-process communication (IPC)
- Interfacing with the native operating system

**Example:**
```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()
})
```

### Renderer Process

Each Electron app spawns a separate renderer process for each open `BrowserWindow`. This process is responsible for rendering web content and should behave according to web standards.

**Key Points:**
- Uses standard web technologies (HTML, CSS, JavaScript)
- Does NOT have direct access to Node.js APIs (for security)
- Cannot use `require` or other Node.js built-ins
- Bundlers (webpack, parcel) are needed for NPM modules

### Preload Scripts

Preload scripts contain code that executes in a renderer process before its web content begins loading. They run within the renderer context but are granted more privileges by having access to Node.js APIs.

**Configuration:**
```javascript
const win = new BrowserWindow({
  webPreferences: {
    preload: 'path/to/preload.js'
  }
})
```

**Using contextBridge (Secure API Exposure):**
```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  desktop: true,
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
  },
  ping: () => ipcRenderer.invoke('ping')
})
```

**Usage in Renderer:**
```javascript
console.log(window.myAPI)
// => { desktop: true, versions: {...}, ping: [Function] }
```

## Inter-Process Communication (IPC)

### Main Process Handler
```javascript
ipcMain.handle('ping', () => 'pong')
```

### Preload Script Bridge
```javascript
contextBridge.exposeInMainWorld('versions', {
  ping: () => ipcRenderer.invoke('ping')
})
```

### Renderer Usage
```javascript
const response = await window.versions.ping()
console.log(response) // 'pong'
```

## Security Best Practices

1. **Context Isolation**: Enabled by default, prevents preload script variables from directly attaching to `window`
2. **No Node.js in Renderer**: Renderer processes should not have direct Node.js access
3. **Use contextBridge**: Securely expose APIs from preload to renderer
4. **Content Security Policy**: Implement CSP headers to restrict resource loading
5. **Disable Node.js Integration**: Ensure `nodeIntegration: false` in webPreferences

## App Lifecycle Events

```javascript
// Emitted when Electron has finished initialization
app.whenReady().then(() => {
  createWindow()
})

// Emitted when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Emitted when the app is activated (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

## BrowserWindow Configuration

```javascript
const win = new BrowserWindow({
  width: 800,
  height: 600,
  minWidth: 400,
  minHeight: 300,
  show: false, // Don't show window until ready-to-show
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true
  }
})

win.once('ready-to-show', () => {
  win.show()
})
```

## Development Tools

```javascript
// Open DevTools automatically in development
if (process.env.NODE_ENV === 'development') {
  win.webContents.openDevTools()
}
```

## Sources

- [Electron Official Documentation](https://www.electronjs.org/docs/latest)
- [Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [Preload Scripts Tutorial](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload)
