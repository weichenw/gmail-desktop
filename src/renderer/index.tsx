import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Route } from '../constants'
import theme from './theme'
import Default from './views/default'
import AddAccount from './views/add-account'
import EditAccount from './views/edit-account'

const View: React.FC = () => {
  switch (location.hash) {
    case Route.AddAccount: {
      return <AddAccount />
    }

    case Route.EditAccount: {
      return <EditAccount />
    }

    default: {
      return <Default />
    }
  }
}

const Renderer: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <View />
    </ThemeProvider>
  )
}

ReactDOM.render(<Renderer />, document.querySelector('#root'))
