# Electron Forge Documentation

## Overview

Electron Forge is a complete tool for building modern Electron applications, unifying existing build tools and simplifying development from project creation to packaging. It provides a full build pipeline with features like code signing, installers, and artifact publishing.

## Configuration

### forge.config.js

The `forge.config.js` file centralizes all Electron Forge configuration including packager options, makers for different platforms, publishers, plugins, hooks, and build identifiers.

```javascript
module.exports = {
  // Packager configuration
  packagerConfig: {
    name: 'My Electron App',
    asar: true,
    osxSign: {},
    icon: './assets/icon',
    appCategoryType: 'public.app-category.developer-tools'
  },

  // Native module rebuild configuration
  rebuildConfig: {
    force: true
  },

  // Platform-specific makers
  makers: [
    // macOS DMG maker
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        background: './assets/dmg-background.png',
        format: 'ULFO'
      }
    },
    // Windows Squirrel maker
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'MyApp'
      }
    },
    // Generic ZIP maker (cross-platform)
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux']
    }
  ],

  // Publishers for distribution
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'myorg',
          name: 'myrepo'
        },
        draft: true,
        prerelease: false
      }
    }
  ],

  // Plugins for build customization
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [{
            name: 'main_window',
            html: './src/index.html',
            js: './src/renderer.js',
            preload: {
              js: './src/preload.js'
            }
          }]
        }
      }
    }
  ],

  // Build identifier
  buildIdentifier: process.env.IS_BETA ? 'beta' : 'prod',

  // Output directory
  outDir: 'desired/outpath'
};
```

## Forge Configuration Options

### Top-level Properties

| Property | Description |
|----------|-------------|
| `packagerConfig` | Configuration for electron-packager |
| `rebuildConfig` | Configuration for rebuilding native modules |
| `makers` | Array of maker configurations for different platforms |
| `publishers` | Array of publisher configurations for distribution |
| `plugins` | Array of plugins for build customization |
| `hooks` | Lifecycle hooks for custom build scripts |
| `buildIdentifier` | Identifier for different build configurations |
| `outDir` | Custom output directory for build artifacts |

## Commands

### Package Application

Bundles the Electron application into platform-specific executable formats. This process includes code signing, rebuilding native modules, and preparing necessary assets.

```bash
# Default packaging
npm run package

# Specify architecture
npm run package -- --arch="ia32"

# Specify platform and architecture
npx electron-forge package --platform=darwin --arch=x64
```

### Make Distributables

Transforms packaged Electron applications into distributable formats using configured makers. Generates platform-specific installers or archives.

```bash
# Default make
npm run make

# Specify single architecture
npm run make -- --arch="x64"

# Specify multiple architectures
npm run make -- --arch="ia32,x64"

# Override default makers
npm run make -- --targets="@electron-forge/maker-dmg,@electron-forge/maker-zip"

# Skip packaging step if already packaged
npm run make -- --skip-package
```

## Makers

Makers generate distributable packages for specific platforms.

### Available Makers

| Maker | Platform | Output Format |
|-------|----------|---------------|
| `@electron-forge/maker-dmg` | macOS | .dmg disk image |
| `@electron-forge/maker-squirrel` | Windows | Squirrel installer |
| `@electron-forge/maker-zip` | macOS, Linux | .zip archive |
| `@electron-forge/maker-deb` | Linux | .deb package |
| `@electron-forge/maker-rpm` | Linux | .rpm package |
| `@electron-forge/maker-appx` | Windows | .appx package |

### Installing Makers

```bash
# Install Squirrel maker for Windows
npm install --save-dev @electron-forge/maker-squirrel

# Install DMG maker for macOS
npm install --save-dev @electron-forge/maker-dmg

# Install ZIP maker
npm install --save-dev @electron-forge/maker-zip
```

## Publishers

Publishers handle distribution of build artifacts to various platforms.

### GitHub Publisher

```bash
# Install GitHub publisher
npm install --save-dev @electron-forge/publisher-github
```

**Configuration:**
```javascript
{
  name: '@electron-forge/publisher-github',
  config: {
    repository: {
      owner: 'myorg',
      name: 'myrepo'
    },
    draft: true,
    prerelease: false
  }
}
```

## Plugins

Plugins extend Forge's functionality for custom build workflows.

### Webpack Plugin

The Webpack plugin bundles your code using Webpack instead of standard file copying.

```javascript
{
  name: '@electron-forge/plugin-webpack',
  config: {
    mainConfig: './webpack.main.config.js',
    renderer: {
      config: './webpack.renderer.config.js',
      entryPoints: [{
        name: 'main_window',
        html: './src/index.html',
        js: './src/renderer.js',
        preload: {
          js: './src/preload.js'
        }
      }]
    }
  }
}
```

### Vite Plugin

The Vite plugin provides fast bundling using Vite.

```javascript
{
  name: '@electron-forge/plugin-vite',
  config: {
    // Vite configurations for main, preload, and renderer processes
  }
}
```

## Code Signing

### macOS Code Signing

```javascript
packagerConfig: {
  osxSign: {
    identity: 'Developer ID Application: Your Name (TEAM_ID)',
    'hardened-runtime': true,
    entitlements: 'entitlements.mac.plist',
    'entitlements-inherit': 'entitlements.mac.plist',
    'signature-flags': 'library'
  },
  osxNotarize: {
    appleId: 'your@email.com',
    appleIdPassword: 'app-specific-password',
    teamId: 'TEAM_ID'
  }
}
```

### Windows Code Signing

```javascript
packagerConfig: {
  win32metadata: {
    CompanyName: 'Your Company',
    FileDescription: 'Your App Description',
    ProductName: 'Your App Name',
    InternalName: 'YourApp'
  }
}
```

## ASAR Packaging

ASAR (Archive Format) is the default packaging format for Electron apps.

```javascript
packagerConfig: {
  asar: true,
  asarUnpack: ['**/node_modules/some-native-module/**']
}
```

## Sources

- [Electron Forge Official Documentation](https://www.electronforge.io/)
- [Electron Forge Configuration Guide](https://github.com/electron-forge/electron-forge-docs/blob/v6/config/configuration.md)
- [Electron Forge GitHub](https://github.com/electron-forge/electron-forge)
