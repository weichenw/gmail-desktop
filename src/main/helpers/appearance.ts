import { app, BrowserWindow, BrowserView } from 'electron'
import fs = require('fs')
import path = require('path')
import config, { ConfigKey } from '../config'
import { getMainWindow } from '../windows/main'

const USER_CUSTOM_CSS_PATH = path.join(app.getPath('userData'), 'custom.css')

export function insertCSS({ webContents }: BrowserWindow | BrowserView): void {
  webContents.on('dom-ready', () => {
    webContents.insertCSS(
      fs.readFileSync(
        path.join(__dirname, '..', '..', '..', 'css', 'style.css'),
        'utf8'
      )
    )

    if (fs.existsSync(USER_CUSTOM_CSS_PATH)) {
      webContents.insertCSS(fs.readFileSync(USER_CUSTOM_CSS_PATH, 'utf8'))
    }

    const configKeys = [
      ConfigKey.CompactHeader,
      ConfigKey.HideFooter,
      ConfigKey.HideRightSidebar,
      ConfigKey.HideSupport
    ]

    configKeys.forEach(key => {
      webContents.send('set-appearance', key, config.get(key) as boolean)
    })

    const mainWindow = getMainWindow()

    mainWindow.on('enter-full-screen', () =>
      webContents.send('set-full-screen', true)
    )

    mainWindow.on('leave-full-screen', () =>
      webContents.send('set-full-screen', false)
    )
  })
}
