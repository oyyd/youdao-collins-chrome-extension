import { EVENTS, onMessage } from './message'
import { parse } from './parse'
import { getWordURL, have } from './words'

const { SEARCH_WORD, OPEN_NEW_TAB } = EVENTS

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
}

init()
