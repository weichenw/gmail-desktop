import React, { useState, useEffect, useRef } from 'react'
import { ipcRenderer as ipc } from 'electron-better-ipc'
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
    ipc.callMain('ready', appBarElement.current!.clientHeight)

    ipc.answerMain('update-accounts', _accounts => {
      setAccounts(_accounts as Accounts)
    })

    ipc.answerMain('update-unread-counts', _unreadCounts => {
      setUnreadCounts(_unreadCounts as UnreadCounts)
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
        onChange={(_event: React.ChangeEvent<{}>, value: any) => {
          const { id, selected } = accounts[value as number]
          if (!selected) {
            ipc.callMain('select-account', id)
          }
        }}
      >
        {accounts.map(({ id, label }) => {
          const content = (
            <div style={{ display: 'flex' }}>
              <span style={{ marginRight: 4 }}>{label}</span>
              {Boolean(unreadCounts[id]) && (
                <Chip label={unreadCounts[id]} size="small" color="secondary" />
              )}
            </div>
          )

          return <Tab key={id} label={content} />
        })}
      </Tabs>
    </AppBar>
  )
}

export default Main
