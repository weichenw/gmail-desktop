function getUnreadCount(): number {
  const inboxUnreadCountElement = document.querySelector<HTMLDivElement>(
    'div[role=navigation] .bsU'
  )

  const unreadCount = inboxUnreadCountElement
    ? Number(inboxUnreadCountElement.innerText)
    : 0

  return unreadCount
}
