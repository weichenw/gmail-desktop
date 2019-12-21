import * as React from 'react'
import { ipcRenderer as ipc } from 'electron-better-ipc'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const { useState, useCallback } = React

export default () => {
  const [label, setLabel] = useState('')

  const handleOnChangeLabel = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(event.target.value)
    },
    []
  )

  const handleOnCancel = () => {
    window.close()
  }

  const handleOnAdd = () => {
    ipc.callMain('add-account', label)
  }

  return (
    <Dialog fullScreen open>
      <DialogTitle>Add Account</DialogTitle>
      <DialogContent>
        <TextField
          label="Label"
          type="text"
          value={label}
          onChange={handleOnChangeLabel}
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnCancel}>Cancel</Button>
        <Button onClick={handleOnAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  )
}
