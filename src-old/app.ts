const trayIcon = createTrayIcon(false)
const trayIconUnread = createTrayIcon(true)

let replyToWindow: BrowserWindow

let tray: Tray | undefined
let trayContextMenu: Menu

function createWindow(): void {
  if (is.linux || is.windows) {
    setAppMenuBarVisibility()
  }

  mainWindow.webContents.on('dom-ready', () => {
    addCustomCSS(mainWindow)
    initCustomStyles()
  })

  mainWindow.on('hide', () => toggleAppVisiblityTrayItem(false))

  mainWindow.on('show', () => toggleAppVisiblityTrayItem(true))

  function toggleAppVisiblityTrayItem(isMainWindowVisible: boolean): void {
    if (config.get(ConfigKey.EnableTrayIcon) && tray) {
      trayContextMenu.getMenuItemById('show-win').visible = !isMainWindowVisible
      trayContextMenu.getMenuItemById('hide-win').visible = isMainWindowVisible
      tray.setContextMenu(trayContextMenu)
    }
  }

  ipc.on('unread-count', (_: Event, unreadCount: number) => {
    if (is.macos) {
      app.dock.setBadge(unreadCount ? unreadCount.toString() : '')
    }

    if (tray) {
      tray.setImage(unreadCount ? trayIconUnread : trayIcon)
      if (is.macos) {
        tray.setTitle(unreadCount ? unreadCount.toString() : '')
      }
    }
  })
}

function createMailto(url: string): void {
  replyToWindow = new BrowserWindow({
    parent: mainWindow
  })

  replyToWindow.loadURL(
    `https://mail.google.com/mail/?extsrc=mailto&url=${url}`
  )
}

function addCustomCSS(windowElement: BrowserWindow): void {
  windowElement.webContents.insertCSS(
    fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8')
  )

  if (fs.existsSync(USER_CUSTOM_STYLE_PATH)) {
    windowElement.webContents.insertCSS(
      fs.readFileSync(USER_CUSTOM_STYLE_PATH, 'utf8')
    )
  }

  const platformCSSFile = path.join(
    __dirname,
    '..',
    'css',
    `style.${platform}.css`
  )
  if (fs.existsSync(platformCSSFile)) {
    windowElement.webContents.insertCSS(
      fs.readFileSync(platformCSSFile, 'utf8')
    )
  }
}

app.on('open-url', (event, url) => {
  event.preventDefault()
  createMailto(url)
})

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show()
  }
})

app.on('before-quit', () => {
  isQuitting = true

  if (mainWindow) {
    config.set(ConfigKey.LastWindowState, {
      bounds: mainWindow.getBounds(),
      fullscreen: mainWindow.isFullScreen(),
      maximized: mainWindow.isMaximized()
    })
  }
})
;(async () => {
  await Promise.all([ensureOnline(), app.whenReady()])

  const overrideUserAgent = config.get(ConfigKey.OverrideUserAgent)
  if (overrideUserAgent) {
    app.userAgentFallback = overrideUserAgent
  }

  createWindow()

  Menu.setApplicationMenu(menu)

  if (config.get(ConfigKey.EnableTrayIcon) && !tray) {
    const appName = app.name

    const contextMenuTemplate: MenuItemConstructorOptions[] = [
      {
        click: () => {
          mainWindow.show()
        },
        label: 'Show',
        visible: shouldStartMinimized,
        id: 'show-win'
      },
      {
        label: 'Hide',
        visible: !shouldStartMinimized,
        click: () => {
          mainWindow.hide()
        },
        id: 'hide-win'
      },
      {
        role: 'quit'
      }
    ]

    trayContextMenu = Menu.buildFromTemplate(contextMenuTemplate)

    tray = new Tray(trayIcon)
    tray.setToolTip(appName)
    tray.setContextMenu(trayContextMenu)
    tray.on('click', () => {
      if (mainWindow) {
        mainWindow.show()
      }
    })
  }

  const { webContents } = mainWindow!

  webContents.on('dom-ready', () => {
    if (!shouldStartMinimized) {
      mainWindow.show()
    }
  })

  // eslint-disable-next-line max-params
  webContents.on('new-window', (event: any, url, _1, _2, options) => {
    event.preventDefault()

    // `Add account` opens `accounts.google.com`
    if (url.startsWith('https://accounts.google.com')) {
      mainWindow.loadURL(url)
      return
    }

    if (url.startsWith('https://mail.google.com')) {
      // Check if the user switches accounts which is determined
      // by the URL: `mail.google.com/mail/u/<local_account_id>/...`
      const currentAccountId = getUrlAccountId(mainWindow.webContents.getURL())
      const targetAccountId = getUrlAccountId(url)

      if (targetAccountId !== currentAccountId) {
        mainWindow.loadURL(url)
        return
      }

      // Center the new window on the screen
      event.newGuest = new BrowserWindow({
        ...options,
        titleBarStyle: 'default',
        x: undefined,
        y: undefined
      })

      event.newGuest.webContents.on('dom-ready', () => {
        addCustomCSS(event.newGuest)
      })

      event.newGuest.webContents.on(
        'new-window',
        (event: Event, url: string) => {
          event.preventDefault()
          shell.openExternal(url)
        }
      )

      return
    }

    if (url.startsWith('about:blank')) {
      const win = new BrowserWindow({
        ...options,
        show: false
      })

      win.webContents.once('will-redirect', (_event, url) => {
        shell.openExternal(url)
        win.destroy()
      })

      event.newGuest = win
    }

    shell.openExternal(cleanURLFromGoogle(url))
  })
})()
