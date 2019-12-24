import { app } from 'electron'
import { ipcMain as ipc } from 'electron-better-ipc'
import { is } from 'electron-util'
import { Account } from '../types'
import config, { ConfigKey } from './config'
import { updateMenu } from './menu'
import { createMainWindow } from './windows/main'
import setupDebug from './helpers/debug'
import handleDownloads from './helpers/downloads'
import ensureOnline from './helpers/ensure-online'
import { getAccounts, addAccount, editAccount } from './helpers/accounts'
import {
  updateRendererAccounts,
  updateRendererUnreadCounts
} from './helpers/renderer'
import { setUnreadCount, getTotalUnreadCount } from './state'

setupDebug()
handleDownloads()
;(async () => {
  await Promise.all([ensureOnline(), app.whenReady()])

  // @TODO(timche): Temporary workaround
  // https://github.com/timche/gmail-desktop#i-cant-sign-in-this-browser-or-app-may-not-be-secure
  const overrideUserAgent = config.get(ConfigKey.OverrideUserAgent)
  if (overrideUserAgent) {
    app.userAgentFallback = overrideUserAgent
  }

  const accounts = getAccounts()
  if (accounts.length === 0) {
    addAccount('Default')
  }

  createMainWindow()

  updateMenu()

  config.onDidChange(ConfigKey.Accounts, updateRendererAccounts)

  ipc.answerRenderer('edit-account', account => {
    editAccount(account as Account)
  })

  ipc.answerRenderer('add-account', label => {
    addAccount(label as string)
  })

  ipc.answerRenderer('update-unread-count', data => {
    const { accountId, unreadCount } = data as {
      accountId: string
      unreadCount: number
    }

    setUnreadCount(accountId, unreadCount)

    const totalUnreadCount = getTotalUnreadCount()

    if (is) {
      app.dock.setBadge(totalUnreadCount ? totalUnreadCount.toString() : '')
    }

    updateRendererUnreadCounts()
  })
})()
