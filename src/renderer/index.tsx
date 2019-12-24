import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Route } from '../constants'
import theme from './theme'
import Main from './views/main'
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
      return <Main />
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
