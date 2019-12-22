import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { parse as parseQueryString } from 'query-string'
import { Route } from '../constants'
import theme from './theme'
import Default from './views/default'
import AddAccount from './views/add-account'
import EditAccount from './views/edit-account'

const Renderer: React.FC = () => {
  const view = parseQueryString(location.search).view as Route

  const renderView = (): JSX.Element => {
    switch (view) {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderView()}
    </ThemeProvider>
  )
}

ReactDOM.render(<Renderer />, document.querySelector('#root'))
