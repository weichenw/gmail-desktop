import * as path from 'path'
import { app, BrowserWindow } from 'electron'
import { is } from 'electron-util'

let mainWindow: BrowserWindow

function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    title: app.name
  })

  win.loadURL(
    is.development
      ? 'http://localhost:1234'
      : path.resolve(__dirname, '..', 'dist-renderer', 'index.html')
  )

  return win
}

;(async () => {
  await app.whenReady()

  mainWindow = createMainWindow()

  const { webContents } = mainWindow

  webContents.on('dom-ready', () => {
    mainWindow.show()
  })
})()
