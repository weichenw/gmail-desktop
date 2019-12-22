import React, { useState } from 'react'
import { ipcRenderer as ipc } from 'electron-better-ipc'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const AddAccount: React.FC = () => {
  const [label, setLabel] = useState('')

  return (
    <Dialog fullScreen open>
      <DialogTitle>Add Account</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Label"
          type="text"
          value={label}
          onChange={event => setLabel(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={window.close}>Cancel</Button>
        <Button
          onClick={() => {
            ipc.callMain('add-account', label)
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddAccount
