import { BrowserWindow, app, ipcMain as ipc } from 'electron'
import { Route } from '../../constants'
import { getRendererURL } from '../helpers/renderer'
import { getAccount, editAccount } from '../helpers/accounts'
import { Account } from '../../types'

let editAccountWindow: BrowserWindow | null

export function createEditAccountWindow(accountId: string): void {
  editAccountWindow = new BrowserWindow({
    title: app.name,
    width: 250,
    height: 210,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  const account = getAccount(accountId)

  editAccountWindow.loadURL(getRendererURL(Route.EditAccount, { account }))

  editAccountWindow.on('close', () => {
    editAccountWindow = null
  })

  ipc.once('edit-account', (_event, account: Account) => {
    editAccount(account)
  })
}
