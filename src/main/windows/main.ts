import { BrowserWindow, BrowserView, app } from 'electron'
import { ipcMain as ipc } from 'electron-better-ipc'
import { selectAccount } from '../helpers/accounts'
import { createAccountViews, updateAccountViewBounds } from '../account-views'
import state from '../state'
import { getRendererURL, updateRendererAccounts } from '../helpers/renderer'

let mainWindow: BrowserWindow
let rendererReady = false

export function getMainWindow(): BrowserWindow {
  return mainWindow
}

export function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    title: app.name,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(getRendererURL())

  ipc.answerRenderer('ready', appBarHeight => {
    if (!rendererReady) {
      rendererReady = true
      state.appBarHeight = appBarHeight as number
      updateRendererAccounts()
      createAccountViews()
      mainWindow.show()
    }
  })

  ipc.answerRenderer('select-account', id => {
    selectAccount(id as string)
  })

  mainWindow.on('resize', updateAccountViewBounds)
}

export function getMainWindowContentSize(): number[] {
  return getMainWindow().getContentSize()
}

export function addMainWindowBrowserView(browserView: BrowserView): void {
  getMainWindow().addBrowserView(browserView)
}
