import { is } from 'electron-util'

import path = require('path')
import queryString = require('query-string')

const URL = is.development
  ? 'http://localhost:8080'
  : path.resolve(__dirname, '..', 'dist-renderer', 'index.html')

export function getRendererURL(
  view = '',
  queryParams: Record<string, any> = {}
): string {
  let url = URL

  const normalizedQueryParams = Object.entries(queryParams).reduce(
    (acc, [param, value]) => ({
      ...acc,
      [param]: JSON.stringify(value)
    }),
    { view }
  )

  url += `?${queryString.stringify(normalizedQueryParams)}`

  return url
}
