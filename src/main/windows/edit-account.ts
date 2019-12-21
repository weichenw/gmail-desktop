import { BrowserWindow, app } from 'electron'
import { ipcMain as ipc } from 'electron-better-ipc'
import { Route } from '../../constants'
import { getRendererURL } from '../helpers/renderer'
import { editAccount, getAccount } from '../helpers/accounts'
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

  editAccountWindow.loadURL(
    getRendererURL(Route.EditAccount, { account: getAccount(accountId) })
  )

  editAccountWindow.on('close', () => {
    editAccountWindow = null
  })

  ipc.answerRenderer('edit-account', account => {
    editAccount(account as Account)
    editAccountWindow!.close()
  })
}
