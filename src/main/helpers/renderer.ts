import * as path from 'path'
import { ipcMain as ipc } from 'electron-better-ipc'
import { is } from 'electron-util'
import * as queryString from 'query-string'
import { getMainWindow } from '../windows/main'
import config, { ConfigKey } from '../config'

const URL = is.development
  ? 'http://localhost:8080'
  : path.resolve(__dirname, '..', 'dist-renderer', 'index.html')

export function updateRendererAccounts(): void {
  ipc.callRenderer(
    getMainWindow(),
    'update-accounts',
    config.get(ConfigKey.Accounts)
  )
}

export function getRendererURL(
  view = '',
  queryParams: Record<string, any> = {}
): string {
  let url = URL

  const normalizedQueryParams = Object.entries(queryParams).reduce(
    (acc, [param, value]) => ({
      ...acc,
      [param]: JSON.stringify(value)
    }),
    { view }
  )

  url += `?${queryString.stringify(normalizedQueryParams)}`

  return url
}
