import { parse } from '../parse'
import pagePage from './pages/page'
import performPage from './pages/perform'
import noresponsePage from './pages/noresponse'
import choicesPage from './pages/choices'
import newestPage from './pages/newest'
import deficitsPage from './pages/deficits'
import openPage from './pages/open'
import sentencePage from './pages/sentence'
import favorablePage from './pages/favorable'
import dimensionalPage from './pages/dimensional'

const EXPECTED_KEYS = [
  'word',
  'pronunciation',
  'frequence',
  'rank',
  'additionalPattern',
]

describe('parse', () => {
  describe('explain', () => {
    it('should have a "type" and a "meanings" and all expected keys in "wordInfo"', () => {
      const { type, response: { wordInfo, meanings } } = parse(pagePage)

      expect(type).toBe('explain')

      EXPECTED_KEYS.forEach((key) => {
        expect(wordInfo[key]).toBeTruthy()
      })

      expect(Array.isArray(meanings)).toBe(true)
    })

    it('should have all expected keys', () => {
      const { response: { wordInfo, meanings } } = parse(performPage)

      EXPECTED_KEYS.forEach((key) => {
        expect(wordInfo[key]).toBeTruthy()
      })

      expect(Array.isArray(meanings)).toBe(true)
    })

    it('should parse multiple explains', () => {
      const { response: { wordInfo, meanings } } = parse(openPage)

      EXPECTED_KEYS.forEach((key) => {
        expect(wordInfo[key]).toBeTruthy()
      })

      expect(Array.isArray(meanings)).toBe(true)
    })
  })

  describe('noresponse', () => {
    it('should return "error" type', () => {
      const { type } = parse(noresponsePage)
      expect(type).toBe('error')
    })
  })

  describe('choices', () => {
    it('should return "choices" type and choices response', () => {
      const { type, response: { choices } } = parse(choicesPage)

      expect(type).toBe('choices')
      expect(Array.isArray(choices)).toBe(true)
      expect(choices[0].words[0].indexOf('tear down')).toBe(0)
      expect(choices[0].wordType).toBe('v.')
      expect(choices[1].words[0].indexOf('dismantle')).toBe(0)
      expect(choices[1].wordType).toBe('vt.')
    })
  })

  describe('non_collins_explain', () => {
    it('should return "non_collins_explain" type', () => {
      const { type, response: { wordInfo, explains } } = parse(newestPage)
      const { word, pronunciation } = wordInfo

      expect(word).toBe('newest')
      expect(pronunciation).toBe('[nju:ɪst]')
      expect(type).toBe('non_collins_explain')
      expect(Array.isArray(explains)).toBe(true)
      expect(explains[0].type).toBe('')
      expect(explains[0].explain).toBe('最新')
    })

    it('should return "non_collins_explain" type too', () => {
      const { type, response: { wordInfo, explains } } = parse(deficitsPage)
      const { word, pronunciation } = wordInfo

      expect(word).toBe('deficits')
      expect(pronunciation).toBe("['defɪsɪts]")
      expect(type).toBe('non_collins_explain')
      expect(Array.isArray(explains)).toBe(true)
      expect(explains[0].type).toBe('n')
      expect(explains[0].explain).toBe('[财政] 赤字，亏损（deficit的复数形式）')
    })

    it('should return "machine_translation" type and the correspond response', () => {
      const { type, response } = parse(sentencePage)

      expect(type).toBe('machine_translation')
      expect(response.translation).toBe('可视化工具的目的是构建可视化。')
    })
  })

  describe('synonyms', () => {
    it('should get synonyms info if there is', () => {
      const { type, response } = parse(favorablePage)

      expect(type).toBe('explain')
      expect(response.synonyms.type).toBe('[美国英语]')
      expect(response.synonyms.words[0]).toBe('favourable')
      expect(response.synonyms.hrefs[0]).toBe('/w/favourable/?keyfrom=dict.collins')
    })
  })

  describe('dimensional', () => {
    it('should get synonyms with multiple words and hrefs', () => {
      const { type, response } = parse(dimensionalPage)

      expect(type).toBe('explain')
      expect(response.synonyms.type).toBe('')
      expect(response.synonyms.words).toEqual([
        'two-dimensional',
        'three-dimensional',
      ])
      expect(response.synonyms.hrefs).toEqual([
        '/w/two-dimensional/?keyfrom=dict.collins',
        '/w/three-dimensional/?keyfrom=dict.collins',
      ])
    })
  })
})
