import { platform as selectPlatform } from 'electron-util'

const platform = selectPlatform({
  macos: 'macos',
  linux: 'linux',
  windows: 'windows'
})

export default platform
