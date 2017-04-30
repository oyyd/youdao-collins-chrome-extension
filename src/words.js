const SEARCH_PREFIX = 'http://dict.youdao.com/w/eng/'

export function getWordURL(word) {
  return `${SEARCH_PREFIX}${word}`
}

export function getWordsPage() {
  return chrome.runtime.getURL('words.html')
}

export function get() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, (data) => {
      let words = []

      if (Object.hasOwnProperty.call(data, 'words')) {
        words = data.words
      }

      resolve(words)
    })
  })
}

export function have(word) {
  return get().then(words => words.indexOf(word) > -1)
}

function set(words) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({
      words,
    }, () => {
      resolve(words)
    })
  })
}

export function add(word) {
  return get().then((words) => {
    if (words.indexOf(word) >= 0) {
      return Promise.resolve(words)
    }

    words.push(word)

    return set(words)
  })
}

export function remove(word) {
  return get().then((_words) => {
    let words = _words.slice()
    const index = words.indexOf(word)

    if (index < 0) {
      return Promise.resolve(words)
    }

    words = words.slice(0, index).concat(words.slice(index + 1))

    return set(words)
  })
}
