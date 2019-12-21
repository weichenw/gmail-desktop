import { Menu, MenuItemConstructorOptions, dialog } from 'electron'
import { appMenu } from 'electron-util'
import { ipcMain as ipc } from 'electron-better-ipc'
import config, { ConfigKey } from './config'
import { getMainWindow } from './windows/main'
import { removeAccount } from './helpers/account'
import { createAddAccountWindow } from './windows/add-account'

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
          ipc.callRenderer(getMainWindow(), 'edit-account-dialog', id)
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
