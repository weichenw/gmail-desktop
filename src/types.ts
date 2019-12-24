export interface Account {
  id: string
  label: string
  selected: boolean
}

export type Accounts = Account[]

export interface UnreadCounts {
  [accountId: string]: number
}
