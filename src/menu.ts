import { app, shell, Menu, MenuItemConstructorOptions } from 'electron'
import * as fs from 'fs'
import { is } from 'electron-util'

import { checkForUpdates } from './updates'
import config, { ConfigKey } from './config'
import { setCustomStyle, USER_CUSTOM_STYLE_PATH } from './custom-styles'
import { viewLogs } from './logs'
import { showRestartDialog, setAppMenuBarVisibility } from './utils'
import { autoFixUserAgent, resetUserAgent } from './user-agent'

interface AppearanceMenuItem {
  key: ConfigKey
  label: string
  restartDialogText?: string
  setMenuBarVisibility?: boolean
}

const appearanceMenuItems: AppearanceMenuItem[] = [
  {
    key: ConfigKey.CompactHeader,
    label: 'Compact Header',
    restartDialogText: 'compact header'
  },
  {
    key: ConfigKey.HideFooter,
    label: 'Hide Footer'
  },
  {
    key: ConfigKey.HideRightSidebar,
    label: 'Hide Right Sidebar'
  },
  {
    key: ConfigKey.HideSupport,
    label: 'Hide Support'
  }
]

const createAppearanceMenuItem = ({
  key,
  label,
  restartDialogText,
  setMenuBarVisibility
}: AppearanceMenuItem): MenuItemConstructorOptions => ({
  label,
  type: 'checkbox',
  checked: config.get(key) as boolean,
  click({ checked }: { checked: boolean }) {
    config.set(key, checked)

    // If the style changes requires a restart, don't add or remove the class
    // name from the DOM
    if (restartDialogText) {
      showRestartDialog(checked, restartDialogText)
    } else {
      setCustomStyle(key, checked)
    }

    if (setMenuBarVisibility) {
      setAppMenuBarVisibility(true)
    }
  }
})

if (is.linux || is.windows) {
  appearanceMenuItems.unshift({
    key: ConfigKey.AutoHideMenuBar,
    label: 'Hide Menu bar',
    setMenuBarVisibility: true
  })
}

const applicationMenu: MenuItemConstructorOptions[] = [
  {
    label: app.name,
    submenu: [
      {
        label: `About ${app.name}`,
        role: 'about'
      },
      {
        label: 'Check for Updates...',
        click() {
          checkForUpdates()
        }
      },
      {
        type: 'separator'
      },
      {
        label: `Hide ${app.name}`,
        accelerator: 'CommandOrControl+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'CommandOrControl+Shift+H',
        role: 'hideOthers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: `Quit ${app.name}`,
        accelerator: 'CommandOrControl+Q',
        click() {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Settings',
    submenu: [
      {
        label: 'Appearance',
        submenu: [
          ...appearanceMenuItems.map(createAppearanceMenuItem),
          {
            label: 'Custom Styles',
            click() {
              // Create the custom style file if it doesn't exist
              if (!fs.existsSync(USER_CUSTOM_STYLE_PATH)) {
                fs.closeSync(fs.openSync(USER_CUSTOM_STYLE_PATH, 'w'))
              }

              shell.openItem(USER_CUSTOM_STYLE_PATH)
            }
          }
        ]
      },
      {
        label: 'Confirm External Links before Opening',
        type: 'checkbox',
        checked: config.get(ConfigKey.ConfirmExternalLinks),
        click({ checked }: { checked: boolean }) {
          config.set(ConfigKey.ConfirmExternalLinks, checked)
        }
      },
      {
        label: is.macos ? 'Show Menu Bar Icon' : 'Show System Tray Icon',
        type: 'checkbox',
        checked: config.get(ConfigKey.EnableTrayIcon),
        click({ checked }: { checked: boolean }) {
          config.set(ConfigKey.EnableTrayIcon, checked)
          showRestartDialog(
            checked,
            is.macos ? 'the menu bar icon' : 'the system tray icon'
          )
        }
      },
      {
        label: 'Default Mailto Client',
        type: 'checkbox',
        checked: app.isDefaultProtocolClient('mailto'),
        click() {
          if (app.isDefaultProtocolClient('mailto')) {
            app.removeAsDefaultProtocolClient('mailto')
          } else {
            app.setAsDefaultProtocolClient('mailto')
          }
        }
      },
      {
        label: 'Auto Update',
        type: 'checkbox',
        checked: config.get(ConfigKey.AutoUpdate),
        click({ checked }: { checked: boolean }) {
          config.set(ConfigKey.AutoUpdate, checked)
          showRestartDialog(checked, 'auto updates')
        }
      },
      {
        label: 'Launch Minimized',
        type: 'checkbox',
        checked: config.get(ConfigKey.LaunchMinimized),
        click({ checked }: { checked: boolean }) {
          config.set(ConfigKey.LaunchMinimized, checked)
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Advanced',
        submenu: [
          {
            label: 'Debug Mode',
            type: 'checkbox',
            checked: config.get(ConfigKey.DebugMode),
            click({ checked }) {
              config.set(ConfigKey.DebugMode, checked)
              showRestartDialog(checked, 'debug mode')
            }
          },
          {
            label: 'Edit Config File',
            click() {
              config.openInEditor()
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'User Agent',
            submenu: [
              {
                label: 'Try To Fix Automatically',
                click: autoFixUserAgent
              },
              {
                label: 'Reset To Default',
                click: resetUserAgent
              }
            ]
          }
        ]
      }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CommandOrControl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CommandOrControl+W',
        role: 'close'
      }
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: `${app.name} Website`,
        click() {
          shell.openExternal('https://github.com/timche/gmail-desktop')
        }
      },
      {
        label: 'Report an Issue',
        click() {
          shell.openExternal(
            'https://github.com/timche/gmail-desktop/issues/new/choose'
          )
        }
      },
      {
        label: 'View Logs',
        visible: config.get(ConfigKey.DebugMode),
        click() {
          viewLogs()
        }
      }
    ]
  }
]

// Add the develop menu when running in the development environment
if (is.development) {
  applicationMenu.splice(-1, 0, {
    label: 'Develop',
    submenu: [
      {
        label: 'Clear Cache and Restart',
        click() {
          // Clear app config
          config.clear()
          // Restart without firing quitting events
          app.relaunch()
          app.exit(0)
        }
      }
    ]
  })
}

const menu = Menu.buildFromTemplate(applicationMenu)

export default menu
