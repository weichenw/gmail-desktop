import { ipcRenderer as ipc } from 'electron'

const UPDATE_UNREAD_COUNT_INVERVAL = 1000

let lastUnreadCount = 0
let accountId: string

function getUnreadCount(): number {
  const inboxUnreadCountElement = document.querySelector<HTMLDivElement>(
    'div[role=navigation] .bsU'
  )

  const unreadCount = inboxUnreadCountElement
    ? Number(inboxUnreadCountElement.textContent)
    : 0

  return unreadCount
}

function updateUnreadCount(): void {
  const unreadCount = getUnreadCount()

  if (unreadCount !== lastUnreadCount) {
    lastUnreadCount = unreadCount
    ipc.send('update-unread-count', accountId, unreadCount)
  }
}

document.addEventListener('load', () => {
  accountId = localStorage.getItem('_accountId')!
  setInterval(updateUnreadCount, UPDATE_UNREAD_COUNT_INVERVAL)
})
