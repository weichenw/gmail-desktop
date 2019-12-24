import { BrowserWindow, app } from 'electron'
import { Route } from '../../constants'
import { getRendererURL } from '../helpers/renderer'
import { getAccount } from '../helpers/accounts'

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
}
