import { ipcRenderer as ipc } from 'electron'
import React, { useState, useEffect, useRef } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Chip from '@material-ui/core/Chip'
import { Accounts, UnreadCounts } from '../../types'

const Main: React.FC = () => {
  const [accounts, setAccounts] = useState<Accounts>([])
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({})

  const appBarElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ipc.send('ready', appBarElement.current!.clientHeight)

    ipc.on('update-accounts', (_event, accounts: Accounts) => {
      setAccounts(accounts)
    })

    ipc.on('update-unread-counts', (_event, unreadCounts: UnreadCounts) => {
      setUnreadCounts(unreadCounts)
    })
  }, [])

  return (
    <AppBar
      ref={appBarElement}
      position="fixed"
      color="default"
      style={{ top: 'auto', bottom: 0 }}
    >
      <Tabs
        variant="fullWidth"
        value={accounts.findIndex(account => account.selected)}
        onChange={(_event, selectedIndex: number) => {
          const { id, selected } = accounts[selectedIndex]
          if (!selected) {
            ipc.send('select-account', id)
          }
        }}
      >
        {accounts.map(({ id, label }) => (
          <Tab
            key={id}
            label={
              <div style={{ display: 'flex' }}>
                <span style={{ marginRight: 4 }}>{label}</span>
                {Boolean(unreadCounts[id]) && (
                  <Chip
                    label={unreadCounts[id]}
                    size="small"
                    color="secondary"
                  />
                )}
              </div>
            }
          />
        ))}
      </Tabs>
    </AppBar>
  )
}

export default Main
