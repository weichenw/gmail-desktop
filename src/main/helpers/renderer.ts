import { is } from 'electron-util'
import { Route } from '../../constants'
import { getMainWindow } from '../windows/main'
import config, { ConfigKey } from '../config'
import state from '../state'

import queryString = require('querystring')
import path = require('path')

const URL = is.development
  ? 'http://localhost:8080'
  : path.resolve(__dirname, '..', 'dist-renderer', 'index.html')

export function getRendererURL(
  view?: Route,
  params?: Record<string, any>
): string {
  let url = URL

  if (params) {
    url += `?${queryString.stringify(
      Object.entries(params).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: JSON.stringify(value)
        }),
        {} as Record<string, string>
      )
    )}`
  }

  if (view) {
    url += view
  }

  return url
}

export function updateRendererAccounts(): void {
  getMainWindow().webContents.send('update-accounts', config.get(ConfigKey.Accounts))
}

export function updateRendererUnreadCounts(): void {
  getMainWindow().webContents.send('update-unread-counts', state.unreadCounts)
}
