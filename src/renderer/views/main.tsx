import React, { useState, useEffect, useRef } from 'react'
import { ipcRenderer as ipc } from 'electron-better-ipc'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Accounts } from '../../types'

const Main: React.FC = () => {
  const [accounts, setAccounts] = useState<Accounts>([])

  const appBarElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ipc.callMain('ready', appBarElement.current!.clientHeight)

    ipc.answerMain('update-accounts', accounts => {
      setAccounts(accounts as Accounts)
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
        {accounts.map(({ id, label }) => (
          <Tab key={id} label={label} />
        ))}
      </Tabs>
    </AppBar>
  )
}

export default Main
