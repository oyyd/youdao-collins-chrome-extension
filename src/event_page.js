import { EVENTS, onMessage } from './message'
import { parse } from './parse'
import { getWordURL, have } from './words' 
import { lookUp, addWord, notify } from './shanbay_api'

const { CLEAR_SHANBAY_TOKEN, SEARCH_WORD, OPEN_NEW_TAB, ADD_WORD_SHANBAY } = EVENTS

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

async function addWordToShanbay(data, sendRes) {

  let response = null
  try {
    // get shanbay word id
    response = await lookUp(data)
    const { id } = response

    // add word
    addWord(id)

    sendRes({ success: true })
  } catch (err) {
    if (err.msg == "单词没找到") {
      sendRes({ success: false, msg: 'Shabay: Word Not Found!' })
      return
    }

    sendRes({ success: false, msg: 'Invalid Token!' })
    notify({
      title: '扇贝认证失败！',
      message: '登录后才能使用生词本功能。\n点击此消息前往扇贝登录',
      url: 'https://web.shanbay.com/web/account/login/'
    })
  }
}

function openNewTab(word) {
  chrome.tabs.create({ url: getWordURL(word) })
}

function init() {
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
