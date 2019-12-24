import { is } from 'electron-util'
import { Account } from '../types'

import Store = require('electron-store')

export enum ConfigKey {
  Accounts = 'accounts',
  AutoUpdate = 'autoUpdate',
  CompactHeader = 'compactHeader',
  DebugMode = 'debugMode',
  HideFooter = 'hideFooter',
  HideRightSidebar = 'hideRightSidebar',
  HideSupport = 'hideSupport',
  LastWindowState = 'lastWindowState',
  LaunchMinimized = 'launchMinimized',
  AutoHideMenuBar = 'autoHideMenuBar',
  EnableTrayIcon = 'enableTrayIcon',
  OverrideUserAgent = 'overrideUserAgent'
}

interface StoreType {
  [ConfigKey.Accounts]: Account[]
  [ConfigKey.AutoUpdate]: boolean
  [ConfigKey.LastWindowState]: {
    bounds: {
      width: number
      height: number
      x: number | undefined
      y: number | undefined
    }
    fullscreen: boolean
    maximized: boolean
  }
  [ConfigKey.CompactHeader]: boolean
  [ConfigKey.HideFooter]: boolean
  [ConfigKey.HideRightSidebar]: boolean
  [ConfigKey.HideSupport]: boolean
  [ConfigKey.DebugMode]: boolean
  [ConfigKey.LaunchMinimized]: boolean
  [ConfigKey.AutoHideMenuBar]: boolean
  [ConfigKey.EnableTrayIcon]: boolean
  [ConfigKey.OverrideUserAgent]?: string
}

const config = new Store<StoreType>({
  name: is.development ? 'config.dev' : 'config',
  defaults: {
    [ConfigKey.Accounts]: [],
    [ConfigKey.AutoUpdate]: true,
    [ConfigKey.LastWindowState]: {
      bounds: {
        width: 800,
        height: 600,
        x: undefined,
        y: undefined
      },
      fullscreen: false,
      maximized: true
    },
    [ConfigKey.CompactHeader]: true,
    [ConfigKey.HideFooter]: true,
    [ConfigKey.HideRightSidebar]: true,
    [ConfigKey.HideSupport]: true,
    [ConfigKey.DebugMode]: false,
    [ConfigKey.LaunchMinimized]: false,
    [ConfigKey.AutoHideMenuBar]: false,
    [ConfigKey.EnableTrayIcon]: !is.macos
  }
})

config.openInEditor()

export default config
