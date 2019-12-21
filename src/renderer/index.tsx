import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './theme'
import Default from './views/Default'
import AddAccount from './views/AddAccount'
import EditAccount from './views/EditAccount'
import { Route } from '../constants'
import { parse as parseQueryString } from 'query-string'

const { useMemo } = React

function Renderer() {
  const view = useMemo(() => parseQueryString(location.search).view as Route, [
    location.search
  ])

  const renderView = () => {
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

ReactDOM.render(<Renderer />, document.getElementById('root'))
