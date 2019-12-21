import * as React from 'react'
import { ipcRenderer as ipc } from 'electron-better-ipc'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { parse as parseQueryString } from 'query-string'
import { Account } from '../../types'

const { useState, useMemo } = React

export default () => {
  const account = useMemo(
    () =>
      JSON.parse(parseQueryString(location.search)
        .account as string) as Account,
    [location.search]
  )

  const [label, setLabel] = useState<string>(account.label)

  return (
    <Dialog fullScreen open>
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        <TextField
          label="Label"
          type="text"
          value={label}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setLabel(event.target.value)
          }
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={window.close}>Cancel</Button>
        <Button
          onClick={() => ipc.callMain('edit-account', { ...account, label })}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
