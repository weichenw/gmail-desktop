import * as React from 'react'
import { ipcRenderer as ipc } from 'electron-better-ipc'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Accounts } from '../../types'
import { parse as parseQueryString } from 'query-string'

const { useState, useEffect, useRef, useMemo } = React

export default () => {
  const initialAccounts = useMemo(
    () =>
      JSON.parse(parseQueryString(location.search)
        .initialAccounts as string) as Accounts,
    [location.search]
  )

  const [accounts, setAccounts] = useState<Accounts>(initialAccounts)

  const appBarElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ipc.callMain('ready', appBarElement!.current!.clientHeight)

    ipc.answerMain('update-accounts', accounts => {
      setAccounts(accounts as Accounts)
    })
  }, [])

  return (
    <AppBar
      position="fixed"
      color="default"
      style={{ top: 'auto', bottom: 0 }}
      ref={appBarElement}
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
