import { BrowserWindow, app, ipcMain as ipc } from 'electron'
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

  ipc.once('add-account', (_event, label: string) => {
    addAccount(label)
  })
}
