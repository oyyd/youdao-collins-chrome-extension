import { EVENTS, onMessage } from './message'
import { parse } from './parse'
import { getWordURL, have } from './words'
import ShanbayOauth from './lib/shanbay_oauth2'

const { CLEAR_SHANBAY_TOKEN, SEARCH_WORD, OPEN_NEW_TAB, ADD_WORD_SHANBAY } = EVENTS
let oauth = null

async function getWordExplain(body) {
  const explain = parse(body)

  if (explain && explain.wordInfo && explain.wordInfo.word) {
    const word = explain.wordInfo.word
    const added = await have(word)
    explain.added = added
  }

  return explain
}

async function getWords(word, sendRes) {
  const url = getWordURL(word)
  const body = await fetch(url).then(res => res.text())
  const explain = await getWordExplain(body)

  sendRes(explain)
}

function authorize() {
  return new Promise((resolve) => {
    oauth.authorize(() => {
      resolve()
    })
  })
}

const ADD_WORD_URL = 'https://api.shanbay.com/bdc/learning/'
const SEARCH_WORD_URL = 'https://api.shanbay.com/bdc/search/'

function getWord(url) {
  return fetch(url).then(res => res.json()).then((res) => {
    const { data, msg } = res

    if (msg !== 'SUCCESS') {
      throw new Error(msg)
    }

    return data
  })
}

function clearShanbayToken() {
  oauth.clearToken()
}

async function addWordToShanbay(data, sendRes) {
  // redirect
  if (!oauth.token_valid()) {
    await authorize()
  }

  const token = oauth.access_token()

  const searchURL = `${SEARCH_WORD_URL}?word=${data}&access_token=${token}`

  let response = null

  try {
    response = await getWord(searchURL)
  } catch (err) {
    // 如果token失效，清除token并重新添加
    if (err.message === 'Invalid token') {
      clearShanbayToken()
      await addWordToShanbay(data, sendRes)
      return
    }

    sendRes({
      success: false,
      msg: err.message,
    })

    return
  }

  const { id } = response

  const addWordURL = `${ADD_WORD_URL}?access_token=${token}`

  try {
    response = await fetch(addWordURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        access_token: token,
      }),
    }).then(res => res.json()).then((res) => {
      const { data: d, msg } = res

      if (msg !== 'SUCCESS') {
        throw new Error(msg)
      }

      return d
    })
  } catch (err) {
    sendRes({
      success: false,
      msg: err.message,
    })

    return
  }

  sendRes({
    success: true,
  })
}

function openNewTab(word) {
  chrome.tabs.create({ url: getWordURL(word) })
}

function init() {
  oauth = ShanbayOauth.initPage()

  onMessage(SEARCH_WORD, (data, sendRes) => {
    getWords(data, sendRes)
  })

  onMessage(OPEN_NEW_TAB, (data) => {
    openNewTab(data)
  })

  onMessage(ADD_WORD_SHANBAY, (data, sendRes) => {
    addWordToShanbay(data, sendRes)
  })

  onMessage(CLEAR_SHANBAY_TOKEN, () => {
    clearShanbayToken()
  })
}

init()
