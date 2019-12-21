import { Menu, MenuItemConstructorOptions, dialog } from 'electron'
import { appMenu } from 'electron-util'
import config, { ConfigKey } from './config'
import { removeAccount } from './helpers/accounts'
import { createAddAccountWindow } from './windows/add-account'
import { createEditAccountWindow } from './windows/edit-account'

let menu: Menu

export function getMenu(): Menu {
  return menu
}

function generateAccountsMenuItems(): MenuItemConstructorOptions[] {
  const accounts = config.get(ConfigKey.Accounts)

  return accounts.map(({ label, id }) => ({
    label,
    submenu: [
      {
        label: 'Edit',
        click: () => {
          createEditAccountWindow(id)
        }
      },
      {
        label: 'Remove',
        click: async () => {
          const { response } = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Confirm', 'Cancel'],
            message: 'Are you sure?',
            detail: `Do you really want to remove ${label}?`
          })

          if (response === 0) {
            removeAccount(id)
          }
        }
      }
    ]
  }))
}

export function updateMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    appMenu(),
    {
      label: 'Accounts',
      submenu: [
        ...generateAccountsMenuItems(),
        {
          type: 'separator'
        },
        {
          label: 'Add Account',
          click: () => {
            createAddAccountWindow()
          }
        }
      ]
    }
  ]

  menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
}
