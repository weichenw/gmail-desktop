import { app } from 'electron'
import * as debug from 'electron-debug'
import config, { ConfigKey } from './config'
import { updateMenu } from './menu'
import { createMainWindow } from './windows/main'

debug({
  showDevTools: true,
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
