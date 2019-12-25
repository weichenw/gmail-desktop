import electronContextMenu = require('electron-context-menu')

export default function setupContextMenu() {
  electronContextMenu({ showCopyImageAddress: true, showSaveImageAs: true })
}