import { ipcRenderer as ipc } from 'electron-better-ipc'

let lastUnreadCount = 0
let accountId: string | null = null

function getUnreadCount(): number {
  const inboxUnreadCountElement = document.querySelector<HTMLDivElement>(
    'div[role=navigation] .bsU'
  )

  const unreadCount = inboxUnreadCountElement
    ? Number(inboxUnreadCountElement.innerText)
    : 0

  return unreadCount
}

function updateUnreadCount(): void {
  const unreadCount = getUnreadCount()

  if (unreadCount !== lastUnreadCount) {
    lastUnreadCount = unreadCount
    ipc.callMain('update-unread-count', { accountId, unreadCount })
  }
}

window.addEventListener('load', () => {
  while (!accountId) {
    accountId = localStorage.getItem('_accountId')
  }

  updateUnreadCount()

  setInterval(updateUnreadCount, 500)
})
