import electronContextMenu = require('electron-context-menu')

export default function setupContextMenu(): void {
  electronContextMenu({ showCopyImageAddress: true, showSaveImageAs: true })
}
