import { Account } from '../types'

import Store = require('electron-store')

export enum ConfigKey {
  Accounts = 'accounts',
  OverrideUserAgent = 'overrideUserAgent'
}

interface StoreType {
  [ConfigKey.Accounts]: Account[]
  [ConfigKey.OverrideUserAgent]?: string
}

const config = new Store<StoreType>()

config.openInEditor()

export default config
