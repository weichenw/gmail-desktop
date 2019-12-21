import { BrowserWindow, BrowserView, app } from 'electron'
import { ipcMain as ipc } from 'electron-better-ipc'
import { selectAccount, getAccounts } from '../helpers/account'
import { createAccountViews, updateAccountViewBounds } from '../views/accounts'
import state from '../state'
import { getRendererURL } from '../helpers/renderer'

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

  mainWindow.loadURL(
    getRendererURL(undefined, { initialAccounts: getAccounts() })
  )

  mainWindow.on('resize', updateAccountViewBounds)

  ipc.answerRenderer('ready', appBarHeight => {
    if (!rendererReady) {
      rendererReady = true
      state.appBarHeight = appBarHeight as number
      createAccountViews()
      mainWindow.show()
    }
  })

  ipc.answerRenderer('select-account', id => {
    selectAccount(id as string)
  })
}

export function getMainWindowContentSize(): number[] {
  return mainWindow.getContentSize()
}

export function addMainWindowBrowserView(browserView: BrowserView): void {
  mainWindow.addBrowserView(browserView)
}
