import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './theme'
import Main from './views/Main'
import AddAccount from './views/AddAccount'
import { Route } from '../constants'

function Renderer() {
  const hashRoute = window.location.hash

  const renderRoute = () => {
    switch (hashRoute) {
      case Route.AddAccount: {
        return <AddAccount />
      }
      default: {
        return <Main />
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderRoute()}
    </ThemeProvider>
  )
}

ReactDOM.render(<Renderer />, document.getElementById('root'))
