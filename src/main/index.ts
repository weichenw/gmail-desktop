import { app } from 'electron'
import config, { ConfigKey } from './config'
import { updateMenu } from './menu'
import { createMainWindow, getMainWindow } from './windows/main'
import setupDebug from './modules/debug'
import handleDownloads from './modules/downloads'
import ensureOnline from './helpers/ensure-online'
import { getAccounts, addAccount } from './helpers/accounts'
import { updateRendererAccounts } from './helpers/renderer'
import state from './state'
import setupContextMenu from './modules/context-menu'
import initAutoUpdates from './modules/auto-updater'

setupDebug()
initAutoUpdates()
handleDownloads()
setupContextMenu()

app.setAppUserModelId('dev.timche.gmail-desktop')

if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('second-instance', () => {
  const mainWindow = getMainWindow()

  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    mainWindow.show()
  }
})

app.on('activate', () => {
  const mainWindow = getMainWindow()

  if (mainWindow) {
    mainWindow.show()
  }
})

app.on('before-quit', () => {
  state.isQuitting = true

  const mainWindow = getMainWindow()

  if (mainWindow) {
    config.set(ConfigKey.LastWindowState, {
      bounds: mainWindow.getBounds(),
      fullscreen: mainWindow.isFullScreen(),
      maximized: mainWindow.isMaximized()
    })
  }
})
;(async () => {
  await Promise.all([ensureOnline(), app.whenReady()])

  // @TODO(timche): Temporary workaround
  // https://github.com/timche/gmail-desktop#i-cant-sign-in-this-browser-or-app-may-not-be-secure
  const overrideUserAgent = config.get(ConfigKey.OverrideUserAgent)
  if (overrideUserAgent) {
    app.userAgentFallback = overrideUserAgent
  }

  const accounts = getAccounts()
  if (accounts.length === 0) {
    addAccount('Default')
  }

  createMainWindow()

  updateMenu()

  config.onDidChange(ConfigKey.Accounts, updateRendererAccounts)
})()
