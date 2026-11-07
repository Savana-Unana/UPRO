const ignoredTextContainers = 'script, style, noscript, textarea, [contenteditable], #animatrixPage #detailsModal, .dialogue-card .speaker, .dialogue-card .dialogue, .search-help-button, .type-table'

export function startBorgoSlorEffect(root = document.body) {
  function rewriteSearchPlaceholder(element) {
    if (element.matches?.('input[placeholder], textarea[placeholder]') && /search/i.test(element.placeholder)) {
      element.placeholder = 'Borgo Slor'
    }
  }

  function rewriteTextNode(node) {
    if (!node.isConnected || node.parentElement?.closest(ignoredTextContainers)) return
    const original = node.nodeValue
    if (!original?.trim()) return
    const text = original.trim()
    if (!/[\p{L}\p{N}]/u.test(text)) return
    if (/^[x×✕✖]$/i.test(text) || node.parentElement?.closest('.type-table .cell-nano')) return
    const leading = original.match(/^\s*/)[0]
    const trailing = original.match(/\s*$/)[0]
    const rdleCell = node.parentElement?.closest('.aniordle-cells .aniordle-cell')
    const rdleIndex = rdleCell ? Array.from(rdleCell.parentElement.children).indexOf(rdleCell) : -1
    const typeBadge = node.parentElement?.closest('.types > span, #paraTypesContainer > span, #listTypesContainer > span')
    let replacement
    if (rdleIndex === 0) return
    if (rdleIndex === 1 || rdleIndex === 2) {
      if (text === 'None') return
      replacement = `${leading}${rdleIndex === 1 ? 'Borgo' : 'Slor'}${trailing}`
    } else if (rdleIndex === 4) {
      const arrow = text.match(/[↑↓]\s*$/)?.[0].trim()
      replacement = `${leading}Borgo Slor${arrow ? ` ${arrow}` : ''}${trailing}`
    } else if (typeBadge) {
      const badgeIndex = Array.from(typeBadge.parentElement.children).filter(child => child.tagName === 'SPAN').indexOf(typeBadge)
      replacement = `${leading}${badgeIndex % 2 ? 'Slor' : 'Borgo'}${trailing}`
    } else if (/^Accounts\s*\(/i.test(text)) {
      replacement = original.replace(/Accounts/i, 'Borgo Slor')
    } else if (/\d/.test(text)) {
      replacement = /[A-Za-z]\d|\d[A-Za-z]/.test(text)
        ? `${leading}Borgo Slor${trailing}`
        : original.replace(/[A-Za-z]+(?:[ \t]+[A-Za-z]+)*/g, 'Borgo Slor')
    } else {
      replacement = `${leading}Borgo Slor${trailing}`
    }
    if (original !== replacement) node.nodeValue = replacement
  }

  function rewriteSubtree(node) {
    if (node.nodeType === Node.TEXT_NODE) return rewriteTextNode(node)
    if (node.nodeType !== Node.ELEMENT_NODE || node.matches(ignoredTextContainers)) return
    rewriteSearchPlaceholder(node)
    node.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(rewriteSearchPlaceholder)
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
    for (let textNode = walker.nextNode(); textNode; textNode = walker.nextNode()) rewriteTextNode(textNode)
  }

  rewriteSubtree(root)
  const titleObserver = new MutationObserver(() => {
    if (document.title !== 'Borgo Slor') document.title = 'Borgo Slor'
  })
  document.title = 'Borgo Slor'
  titleObserver.observe(document.head, { childList: true, characterData: true, subtree: true })
  const observer = new MutationObserver(records => {
    observer.disconnect()
    for (const record of records) {
      if (record.type === 'characterData') rewriteTextNode(record.target)
      else if (record.type === 'attributes') rewriteSearchPlaceholder(record.target)
      else for (const node of record.addedNodes) rewriteSubtree(node)
    }
    observer.observe(root, { childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder'], subtree: true })
  })
  observer.observe(root, { childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder'], subtree: true })
  return () => { observer.disconnect(); titleObserver.disconnect() }
}
