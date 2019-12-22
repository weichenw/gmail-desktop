import { app } from 'electron'
import config, { ConfigKey } from './config'
import { updateMenu } from './menu'
import { createMainWindow } from './windows/main'

import debug = require('electron-debug')

debug({
  showDevTools: false,
  isEnabled: true
})
;(async () => {
  await app.whenReady()

  // @TODO(timche): Temporary workaround
  // https://github.com/timche/gmail-desktop#i-cant-sign-in-this-browser-or-app-may-not-be-secure
  const overrideUserAgent = config.get(ConfigKey.OverrideUserAgent)
  if (overrideUserAgent) {
    app.userAgentFallback = overrideUserAgent
  }

  createMainWindow()

  updateMenu()
})()
