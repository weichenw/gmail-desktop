import * as shortid from 'shortid'
import config, { ConfigKey } from '../config'
import { Account, Accounts } from '../../types'
import {
  updateAccountViewBounds,
  createAccountView,
  destroyAccountView
} from '../views/accounts'
import { updateMenu } from '../menu'
import { updateRendererAccounts } from './renderer'

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

  updateRendererAccounts()

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

  updateRendererAccounts()

  destroyAccountView(id)

  updateMenu()
}

export function editAccount(editedAccount: Account): void {
  const accounts = config
    .get(ConfigKey.Accounts)
    .map(account => (account.id === editedAccount.id ? editedAccount : account))

  config.set(ConfigKey.Accounts, accounts)

  updateRendererAccounts()

  updateMenu()
}

export function selectAccount(id: string): void {
  const accounts = config
    .get(ConfigKey.Accounts)
    .map(account => ({ ...account, selected: account.id === id }))

  config.set(ConfigKey.Accounts, accounts)

  updateRendererAccounts()
  updateAccountViewBounds()
}

export function getAccount(id: string): Account {
  return config.get(ConfigKey.Accounts).find(account => account.id === id)!
}

export function getAccounts(): Accounts {
  return config.get(ConfigKey.Accounts)
}
