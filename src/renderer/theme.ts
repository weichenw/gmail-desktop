import { createMuiTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import red from '@material-ui/core/colors/red'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: grey,
    secondary: red
  }
})

export default theme
