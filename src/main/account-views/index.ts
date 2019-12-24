import { BrowserView, session, Rectangle } from 'electron'
import state from '../state'
import config, { ConfigKey } from '../config'
import {
  getMainWindowContentSize,
  addMainWindowBrowserView
} from '../windows/main'

import path = require('path')

const accountViews: Record<string, number> = {}

export function getAccountView(accountId: string): BrowserView {
  return BrowserView.fromId(accountViews[accountId])
}

export function getAccountViews(): { [accountId: string]: BrowserView } {
  return Object.keys(accountViews).reduce(
    (acc, accountId) => ({
      ...acc,
      [accountId]: getAccountView(accountId)
    }),
    {} as { [accountId: string]: BrowserView }
  )
}

export function getAccountViewBounds(): {
  visible: Rectangle
  hidden: Rectangle
} {
  const [contentWidth, contentHeight] = getMainWindowContentSize()
  const height = contentHeight - state.appBarHeight

  return {
    visible: {
      x: 0,
      y: 0,
      width: contentWidth,
      height
    },
    hidden: {
      x: 0,
      y: contentHeight,
      width: contentWidth,
      height
    }
  }
}

export function createAccountView(
  accountId: string,
  show: boolean | Rectangle = true
): void {
  const accountView = new BrowserView({
    webPreferences: {
      session: session.fromPartition(`persist:${accountId}`),
      preload: path.resolve(__dirname, 'preload')
    }
  })

  addMainWindowBrowserView(accountView)

  if (typeof show === 'boolean') {
    const { visible, hidden } = getAccountViewBounds()
    accountView.setBounds(show ? visible : hidden)
  } else {
    accountView.setBounds(show)
  }

  const { webContents } = accountView

  webContents.executeJavaScript(
    `localStorage.setItem('_accountId', '${accountId}')`
  )

  webContents.loadURL('https://mail.google.com/')

  accountViews[accountId] = accountView.id
}

export function createAccountViews(): void {
  const accounts = config.get(ConfigKey.Accounts)
  const { visible, hidden } = getAccountViewBounds()

  accounts.forEach(({ id, selected }) => {
    createAccountView(id, selected ? visible : hidden)
  })
}

export function updateAccountViewBounds(): void {
  const accounts = config.get(ConfigKey.Accounts)
  const { visible, hidden } = getAccountViewBounds()

  Object.entries(getAccountViews()).forEach(([accountId, accountView]) => {
    accountView.setBounds(
      accounts.find(account => account.id === accountId)!.selected
        ? visible
        : hidden
    )
  })
}

export function destroyAccountView(accountId: string): void {
  getAccountView(accountId).destroy()
  delete accountViews[accountId]
  updateAccountViewBounds()
}
