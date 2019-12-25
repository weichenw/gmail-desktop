import { BrowserWindow, BrowserView, app, ipcMain as ipc } from 'electron'
import { selectAccount } from '../helpers/accounts'
import { createAccountViews, updateAccountViewBounds } from '../account-views'
import state, { setUnreadCount, getTotalUnreadCount } from '../state'
import { getRendererURL, updateRendererAccounts, updateRendererUnreadCounts } from '../helpers/renderer'
import config, { ConfigKey } from '../config'
import { is } from 'electron-util'

let mainWindow: BrowserWindow

export function getMainWindow(): typeof mainWindow {
  return mainWindow
}

export function createMainWindow(): void {
  const lastWindowState = config.get(ConfigKey.LastWindowState)

  const shouldStartMinimized =
    app.commandLine.hasSwitch('launch-minimized') ||
    config.get(ConfigKey.LaunchMinimized)

  mainWindow = new BrowserWindow({
    title: app.name,
    titleBarStyle: config.get(ConfigKey.CompactHeader)
      ? 'hiddenInset'
      : 'default',
    width: lastWindowState.bounds.width,
    height: lastWindowState.bounds.height,
    x: lastWindowState.bounds.x,
    y: lastWindowState.bounds.y,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(getRendererURL())

  mainWindow.on('close', event => {
    if (!state.isQuitting && mainWindow) {
      event.preventDefault()
      mainWindow.blur()
      mainWindow.hide()
    }
  })

  mainWindow.on('resize', updateAccountViewBounds)

  ipc.once('ready', (_event, appBarHeight: number) => {
    state.appBarHeight = appBarHeight

    createAccountViews()

    updateRendererAccounts()

    if (!shouldStartMinimized) {
      mainWindow.show()
    }

    if (lastWindowState.fullscreen && !mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(lastWindowState.fullscreen)
    }

    if (lastWindowState.maximized && !mainWindow.isMaximized()) {
      mainWindow.maximize()
    }
  })

  ipc.on('select-account', (_event, id: string) => {
    selectAccount(id)
  })

  ipc.on('update-unread-count', (_event, accountId: string, unreadCount: number) => {
    setUnreadCount(accountId, unreadCount)

    const totalUnreadCount = getTotalUnreadCount()

    if (is.macos) {
      app.dock.setBadge(totalUnreadCount ? totalUnreadCount.toString() : '')
    }

    updateRendererUnreadCounts()
  })
}

export function getMainWindowContentSize(): number[] {
  return getMainWindow().getContentSize()
}

export function addMainWindowBrowserView(browserView: BrowserView): void {
  getMainWindow().addBrowserView(browserView)
}
