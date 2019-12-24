import electronDebug = require('electron-debug')

export default function setupDebug(): void {
  electronDebug({
    showDevTools: true,
    isEnabled: true
  })
}
