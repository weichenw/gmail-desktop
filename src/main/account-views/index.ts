import { BrowserView, session, Rectangle, BrowserWindow, shell } from 'electron'
import state from '../state'
import config, { ConfigKey } from '../config'
import {
  getMainWindowContentSize,
  addMainWindowBrowserView
} from '../windows/main'

import path = require('path')
import { Google } from '../../constants'

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
      y: state.appBarHeight,
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
      preload: path.resolve(__dirname, 'preload'),
      nativeWindowOpen: true,
      nodeIntegration: true
    }
  })

  addMainWindowBrowserView(accountView)

  if (typeof show === 'boolean') {
    const { visible, hidden } = getAccountViewBounds()
    accountView.setBounds(show ? visible : hidden)
  } else if (typeof show === 'object') {
    accountView.setBounds(show)
  }

  const { webContents } = accountView

  webContents.executeJavaScript(
    `localStorage.setItem('_accountId', '${accountId}')`
  )

  webContents.loadURL(Google.Mail)

  accountViews[accountId] = accountView.id

  webContents.on(
    'new-window',
    (event, url, _frameName, _disposition, options) => {
      event.preventDefault()

      // Block `Add Account`
      if (url.startsWith(Google.Accounts)) {
        return
      }

      if (url.startsWith(Google.Mail)) {
        const win = new BrowserWindow({
          ...options,
          titleBarStyle: 'default',
          x: undefined,
          y: undefined
        })

        win.webContents.on('new-window', (event: Event, url: string) => {
          event.preventDefault()
          shell.openExternal(url)
        })

        // @ts-ignore
        event.newGuest = win

        return
      }

      if (url.startsWith('about:blank')) {
        let win: BrowserWindow | null = new BrowserWindow({
          ...options,
          show: false
        })

        win.webContents.once('will-redirect', (_event, url) => {
          shell.openExternal(url)
          win!.destroy()
          win = null
        })

        // @ts-ignore
        event.newGuest = win

        return
      }

      shell.openExternal(url)
    }
  )
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
  delete accountViews[accountId] // eslint-disable-line @typescript-eslint/no-dynamic-delete
  updateAccountViewBounds()
}
