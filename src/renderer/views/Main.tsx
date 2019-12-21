import * as React from 'react'
import { ipcRenderer as ipc } from 'electron-better-ipc'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Accounts } from '../../types'

const { useState, useEffect, useRef } = React

export default () => {
  const [accounts, setAccounts] = useState<Accounts>([])

  const appBarElement = useRef(null)

  useEffect(() => {
    ipc.callMain('main-ready', appBarElement.current.clientHeight)

    ipc.answerMain('update-accounts', accounts => {
      setAccounts(accounts as Accounts)
    })
  }, [])

  const handleOnSelectAccount = (
    _event: React.ChangeEvent,
    selectedIndex: number
  ) => {
    const { id } = accounts[selectedIndex]
    ipc.callMain('select-account', id)
  }

  const getSelectedAccountIndex = () =>
    accounts.findIndex(account => account.selected)

  return (
    <AppBar
      position="fixed"
      color="default"
      style={{ top: 'auto', bottom: 0 }}
      ref={appBarElement}
    >
      <Tabs
        variant="fullWidth"
        value={getSelectedAccountIndex()}
        onChange={handleOnSelectAccount}
      >
        {accounts.map(({ id, label }) => (
          <Tab key={id} label={label} />
        ))}
      </Tabs>
    </AppBar>
  )
}
