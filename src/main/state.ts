export enum StateKey {
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

export function setUnreadCount(accountId: string, count: number): void {
  const accountUnreadCount = state[StateKey.UnreadCounts][accountId]

  if (accountUnreadCount !== count) {
    state[StateKey.UnreadCounts][accountId] = count
  }
}

export function getUnreadCount(accountId: string): number {
  return state[StateKey.UnreadCounts][accountId]
}

export function getTotalUnreadCount(): number {
  return Object.values(state[StateKey.UnreadCounts]).reduce(
    (totalCount, count) => totalCount + count,
    0
  )
}

export default state
