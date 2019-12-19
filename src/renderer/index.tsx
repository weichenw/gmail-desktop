import 'typeface-roboto'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ipcRenderer as ipc } from 'electron-better-ipc'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Accounts } from '../types'

const { useState, useEffect } = React

const TabView: React.FC<{ tabIndex: number, activeTabIndex: number }> = ({ tabIndex, activeTabIndex, children }) {
  if (tabIndex !== activeTabIndex) {
    return null
  }

  return (
    <div>
      {children}
    </div>
  )
}

function App() {
  const [accounts, setAccounts] = useState<Accounts>([])
  const [activeAccount, setActiveAccount] = useState(0)

  useEffect(() => {
    ipc.answerMain('update-accounts', async (accounts: Accounts) => {
      setAccounts(accounts)
    })
  }, [])

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Tabs variant="fullWidth" value={activeAccount} onChange={(_event, newIndex) => { setActiveAccount(newIndex) }}>
          {accounts.map(({ viewId, label }) => (
            <Tab key={viewId} label={label} />
          ))}
        </Tabs>
      </AppBar>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))