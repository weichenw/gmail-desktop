import { useMemo } from 'react'
import { Account } from '../../types'

export function useParamsAccount(): Account {
  return useMemo(
    () =>
      JSON.parse(
        new URLSearchParams(location.search).get('account')!
      ) as Account,
    []
  )
}
