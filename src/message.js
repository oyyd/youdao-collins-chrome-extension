export const EVENTS = {
  SEARCH_WORD: 'SEARCH_WORD',
  OPEN_NEW_TAB: 'OPEN_NEW_TAB',
}

// event page receives an event
export function onMessage(eventName, handler) {
  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    const { eventName: e, data } = req

    if (e !== eventName) {
      return false
    }

    handler(data, sendResponse)

    return true
  })
}

// send message to event page
export function sendMessage(eventName, data) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      eventName,
      data,
    }, (res) => {
      resolve(res)
    })
  })
}


export function openLink(word) {
  sendMessage(EVENTS.OPEN_NEW_TAB, word)
}

export async function searchWord(word) {
  const res = await sendMessage(EVENTS.SEARCH_WORD, word)

  return res
}
