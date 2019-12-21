import * as Store from 'electron-store'
import { ipcMain as ipc } from 'electron-better-ipc'
import { Account } from '../types'
import { getMainWindow } from './windows/main'

export enum ConfigKey {
  Accounts = 'accounts',
  OverrideUserAgent = 'overrideUserAgent'
}

interface StoreType {
  [ConfigKey.Accounts]: Account[]
  [ConfigKey.OverrideUserAgent]?: string
}

const config = new Store<StoreType>()

config.onDidChange(ConfigKey.Accounts, accounts => {
  ipc.callRenderer(getMainWindow(), 'update-accounts', accounts)
})

config.openInEditor()

export default config
