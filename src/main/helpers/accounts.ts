import config, { ConfigKey } from '../config'
import { Account, Accounts } from '../../types'
import {
  updateAccountViewBounds,
  createAccountView,
  destroyAccountView
} from '../account-views'
import { updateMenu } from '../menu'

import shortid = require('shortid')

export function addAccount(label: string): void {
  const account = {
    id: shortid(),
    label,
    selected: true
  }

  const accounts = [
    ...config
      .get(ConfigKey.Accounts)
      .map(account => ({ ...account, selected: false })),
    account
  ]

  config.set(ConfigKey.Accounts, accounts)

  createAccountView(account.id)

  updateMenu()
}

export function removeAccount(id: string): void {
  const accounts = config
    .get(ConfigKey.Accounts)
    .filter(account => account.id !== id)

  if (accounts.length > 0 && accounts.every(account => !account.selected)) {
    accounts[0] = { ...accounts[0], selected: true }
  }

  config.set(ConfigKey.Accounts, accounts)

  destroyAccountView(id)

  updateMenu()
}

export function editAccount(editedAccount: Account): void {
  const accounts = config
    .get(ConfigKey.Accounts)
    .map(account => (account.id === editedAccount.id ? editedAccount : account))

  config.set(ConfigKey.Accounts, accounts)

  updateMenu()
}

export function selectAccount(id: string): void {
  const accounts = config
    .get(ConfigKey.Accounts)
    .map(account => ({ ...account, selected: account.id === id }))

  config.set(ConfigKey.Accounts, accounts)

  updateAccountViewBounds()
}

export function getAccount(id: string): Account {
  return config.get(ConfigKey.Accounts).find(account => account.id === id)!
}

export function getAccounts(): Accounts {
  return config.get(ConfigKey.Accounts)
}
