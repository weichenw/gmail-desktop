const enum StateKey {
  AppBarHeight = 'appBarHeight',
  UnreadCounts = 'unreadCounts'
}

interface State {
  [StateKey.AppBarHeight]: number
  [StateKey.UnreadCounts]: {
    [accountId: string]: number
  }
}

const state: State = {
  [StateKey.AppBarHeight]: 0,
  [StateKey.UnreadCounts]: {}
}

export default state
