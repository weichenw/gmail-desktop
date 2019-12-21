import * as path from 'path'
import { ipcMain as ipc } from 'electron-better-ipc'
import { is } from 'electron-util'
import { getMainWindow } from '../windows/main'
import config, { ConfigKey } from '../config'

export function updateRendererAccounts(): void {
  ipc.callRenderer(
    getMainWindow(),
    'update-accounts',
    config.get(ConfigKey.Accounts)
  )
}

export function getRendererURL(hashRoute?: string): string {
  let url = is.development
    ? 'http://localhost:8080'
    : path.resolve(__dirname, '..', 'dist-renderer', 'index.html')

  if (hashRoute) {
    url += hashRoute
  }

  return url
}
