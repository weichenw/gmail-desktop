import electronDebug = require('electron-debug')

export default function setupDebug(): void {
  electronDebug({
    showDevTools: false,
    isEnabled: true
  })
}
