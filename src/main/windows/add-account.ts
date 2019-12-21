import { BrowserWindow, app } from 'electron'
import { ipcMain as ipc } from 'electron-better-ipc'
import { Route } from '../../constants'
import { getRendererURL } from '../helpers/renderer'
import { addAccount } from '../helpers/accounts'

let addAccountWindow: BrowserWindow | null

export function createAddAccountWindow(): void {
  addAccountWindow = new BrowserWindow({
    title: app.name,
    width: 250,
    height: 210,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  addAccountWindow.loadURL(getRendererURL(Route.AddAccount))

  addAccountWindow.on('close', () => {
    addAccountWindow = null
  })

  ipc.answerRenderer('add-account', label => {
    addAccount(label as string)
    addAccountWindow!.close()
  })
}
