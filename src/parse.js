// @flow
import cheerio from 'cheerio-without-node-native'

type MeaningExplainType = {
  type: string,
  typeDesc: string,
  engExplain: string,
}

type MeaningType = {
  explain: MeaningExplainType,
  example: {
    ch: string,
    eng: string,
  }
}

export type WordInfoType = {|
  word: string,
  pronunciation: string,
  frequence: number | null,
  rank: string,
  additionalPattern: string,
|}

export type MeaningsType = Array<MeaningType>

export type SynonymsType = {|
  type: string,
  hrefs: Array<string>,
  words: Array<string>,
|}

export type ExplainResponseType = {
  wordInfo: WordInfoType,
  synonyms: SynonymsType,
  meanings: MeaningsType,
}

type ChoiceType = {
  wordType: string,
  words: Array<string>,
}

export type ChoiceResponseType = {|
  choices: Array<ChoiceType>
|}

export type NonCollinsExplainType = {|
  type: string,
  explain: string,
|}

export type NonCollinsExplainsType = Array<NonCollinsExplainType>

export type NonCollinsExplainsResponseType = {
  wordInfo: WordInfoType,
  explains: NonCollinsExplainsType,
}

export type MachineTranslationResponseType = {|
  translation: string,
|}

export type WordResponseType = {|
  type: 'explain',
  response: ExplainResponseType,
|} | {|
  type: 'choices',
  response: ChoiceResponseType,
|} | {|
  type: 'error',
|} | {|
  type: 'non_collins_explain',
  response: NonCollinsExplainsResponseType,
|} | {|
  type: 'machine_translation',
  response: MachineTranslationResponseType,
|}

export type ResponseType = 'explain' | 'choices' | 'error'
  | 'non_collins_explain' | 'machine_translation'

const LINK_REGEXP = /href="(.+)"/

function replaceJumpLink(content) {
  if (typeof content !== 'string') {
    return content
  }

  return content.replace(LINK_REGEXP, (match, m1) => `href="http://dict.youdao.com/${m1}"`)
}

function getFrequency(className) {
  const res = /star(\d)/.exec(className)

  return res ? parseInt(res[1], 10) : null
}

function getInfo($container) {
  const word = $container.find('.title').text()
  const $star = $container.find('.star')
  const pronunciation = $container.find('.spell').text()
  const frequence = $star.length > 0 ? getFrequency($star.attr('class')) : null
  const rank = $container.find('.rank').text()
  const additionalPattern = $container.find('.pattern').text().trim()

  return {
    word,
    pronunciation,
    frequence,
    rank,
    additionalPattern,
  }
}

function getExplain($explain) {
  const $type = $explain.find('.additional')
  const type = $type.text()
  const typeDesc = $type.attr('title')

  const $p = $explain.find('p')

  $p.find('span').remove()

  const engExplain = replaceJumpLink($p.html().trim())

  return {
    type,
    typeDesc,
    engExplain,
  }
}

function getExample($example) {
  const $examples = $example.find('.examples p')
  const eng = $examples.eq(0).text()
  const ch = $examples.eq(1).text()

  return {
    eng,
    ch,
  }
}

function getMeanings($, $items) {
  const meanings = []

  $items.each((index, itemEle) => {
    const $item = $(itemEle)
    const $exampleLists = $item.find('.exampleLists')
    const $explain = $item.find('.collinsMajorTrans')

    if ($explain.length === 0) {
      return
    }

    const meaning = {
      explain: getExplain($explain),
      example: getExample($exampleLists),
    }

    meanings.push(meaning)
  })

  return {
    meanings,
  }
}

function getType($) {
  if ($('.collinsToggle').length > 0) {
    return 'explain'
  } else if ($('#phrsListTab .wordGroup').length > 0) {
    return 'choices'
  } else if ($('#phrsListTab .trans-container').length > 0) {
    return 'non_collins_explain'
  } else if ($('#ydTrans .trans-container').length > 0) {
    return 'machine_translation'
  }

  return 'error'
}

function getChoices($): ChoiceResponseType {
  const $container = $('#phrsListTab')
  const $wordGroup = $container.find('.wordGroup')
  const choices = []

  $wordGroup.each((index, ele) => {
    const $spans = $(ele).find('span')
    const $firstSpan = $spans.eq(0)

    let wordType = ''

    if (!$firstSpan.hasClass('contentTitle')) {
      wordType = $spans.eq(0).text().trim()
    }

    const $words = $(ele).find('.contentTitle')
    const words = []

    $words.each((i, e) => {
      const $ele = $(e)
      words.push($ele.find('.search-js').text().trim())
    })

    choices.push({
      words,
      wordType,
    })
  })

  return {
    choices,
  }
}

function getSynonyms($) {
  const $type = $.find('.wt-container>.additional')
  const type = $type.length > 0 ? $type.text() : ''
  const $anchor = $.find('.wt-container>a')
  const hrefs = []
  const words = []

  $anchor.each((index) => {
    const $ele = $anchor.eq(index)
    hrefs.push($ele.attr('href') || '')
    words.push($ele.text() || '')
  })

  return {
    type, hrefs, words,
  }
}

function getExplainResponse($): ExplainResponseType {
  const $collinsContainer = $('.collinsToggle')

  const {
    meanings,
  } = getMeanings($, $collinsContainer.find('li'))

  return {
    wordInfo: getInfo($collinsContainer.find('h4').eq(0)),
    synonyms: getSynonyms($collinsContainer),
    meanings,
  }
}

function getTitleInfo($): WordInfoType {
  const $title = $('.wordbook-js')
  const word = $title.find('.keyword').text().trim()
  const pronunciation = $title.find('.pronounce .phonetic').eq(0).text().trim()

  return {
    word,
    pronunciation,
    frequence: null,
    rank: '',
    additionalPattern: '',
  }
}

function getNonCollinsExplain($): NonCollinsExplainsResponseType {
  const explains = []

  $('#phrsListTab .trans-container li').each((i, ele) => {
    const rawString = $(ele).text()
    const index = rawString.indexOf('. ')

    if (index > -1) {
      const type = rawString.slice(0, index)
      const explain = rawString.slice(index + 2)

      explains.push({
        type, explain,
      })
      return
    }

    explains.push({
      type: '',
      explain: rawString,
    })
  })

  return {
    wordInfo: getTitleInfo($),
    explains,
  }
}

function getMachineTranslation($): MachineTranslationResponseType {
  const $container = $('#ydTrans .trans-container p')

  return {
    translation: $container.eq(1).text(),
  }
}

export function parse(html: string): WordResponseType {
  const $ = cheerio.load(html)

  const type = getType($)

  if (type === 'explain') {
    return {
      // it's possible for flow to know
      // what type is this without literals
      type: 'explain',
      response: getExplainResponse($),
    }
  } else if (type === 'choices') {
    return {
      type: 'choices',
      response: getChoices($),
    }
  } else if (type === 'non_collins_explain') {
    return {
      type: 'non_collins_explain',
      response: getNonCollinsExplain($),
    }
  } else if (type === 'machine_translation') {
    return {
      type: 'machine_translation',
      response: getMachineTranslation($),
    }
  }

  return {
    type: 'error',
  }
}
