export const EVENTS = {
  SEARCH_WORD: 'SEARCH_WORD',
  OPEN_NEW_TAB: 'OPEN_NEW_TAB',
  ADD_WORD_SHANBAY: 'ADD_WORD_SHANBAY',
  CLEAR_SHANBAY_TOKEN: 'CLEAR_SHANBAY_TOKEN',
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

export async function addNotebookWord(word) {
  return sendMessage(EVENTS.ADD_WORD_SHANBAY, word)
}

export async function clearShanbayToken() {
  return sendMessage(EVENTS.CLEAR_SHANBAY_TOKEN)
}
