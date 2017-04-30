// @flow
import React, { PropTypes, Component } from 'react'
import Audio from './audio'
import AddWord from './add_word'
import icons from './icons'
import { mainBG, fontS, gapL, gapM, gapS, colorDanger,
  colorMuted, colorWarning, colorPrimary } from './style'

import type { ChoiceResponseType, ExplainResponseType,
  NonCollinsExplainsResponseType } from '../parse'

const styles = {
  errorP: {
    margin: `0 0 ${gapS}px 0`,
  },
  link: {
    margin: '0',
    color: colorPrimary,
    cursor: 'pointer',
  },
  info: {
    marginBottom: gapL,
  },
  infoItem: {
    marginRight: gapL,
  },
  wordType: {
    fontSize: fontS,
    marginRight: gapS,
    color: colorMuted,
  },
  meaningItem: {
    marginBottom: gapL,
  },
  explain: {
    padding: gapS,
    backgroundColor: mainBG,
  },
  exampleItem: {
    marginTop: gapM,
    paddingLeft: 20,
  },
  star: {
    width: 14,
    height: 14,
    verticalAlign: 'top',
    position: 'relative',
    top: 3,
  },
  choiceItem: {
    backgroundColor: mainBG,
    padding: gapS,
    marginBottom: gapM,
  },
  nonCollinsTips: {
    marginTop: gapS,
    marginBottom: gapM,
  },
}

function renderSentence(sentence) {
  return (
    // eslint-disable-next-line
    <span dangerouslySetInnerHTML={{ __html: sentence }} />
  )
}

function renderFrequence(frequence) {
  return (
    <div style={{ display: 'inline', verticalAlign: 'top' }}>
      {[...Array(frequence).keys()].map((_, index) => (
        <img
          key={index}
          src={icons.star}
          style={styles.star}
          alt="star"
        />
      ))}
    </div>
  )
}

function renderMeaning(meaning, index) {
  const {
    example: { eng, ch },
    explain: { type, typeDesc, engExplain },
  } = meaning

  return (
    <div key={index} style={styles.meaningItem}>
      <div style={styles.explain}>
        <span style={styles.wordType}>{type}</span>
        <span style={Object.assign({}, styles.wordType, { marginRight: gapL })}>{typeDesc}</span>
        {renderSentence(engExplain)}
      </div>
      <div style={styles.exampleItem}>
        <div style={{ color: colorMuted }}>{eng}</div>
        <div style={{ color: colorMuted, marginTop: 6 }}>{ch}</div>
      </div>
    </div>
  )
}

function renderWordBasic(wordInfo, added: boolean, showWordsPage: boolean) {
  const { word, pronunciation, frequence, rank, additionalPattern } = wordInfo

  return (
    <div style={styles.info}>
      <span style={Object.assign({}, styles.infoItem, { color: colorDanger })}>
        {word}
      </span>
      {pronunciation ? (
        <span style={Object.assign({}, { fontStyle: 'italic', color: colorMuted }, styles.infoItem)}>
          {pronunciation}
        </span>
      ) : null}
      <span style={styles.infoItem}>
        <Audio word={word} defaultAdded={added} />
      </span>
      <span style={styles.infoItem}>
        <AddWord word={word} showWordsPage={showWordsPage} />
      </span>
      {frequence ? (
        <span style={Object.assign({}, styles.infoItem, { color: colorWarning })}>
          {renderFrequence(frequence)}
        </span>
      ) : null}
      {rank ? (
        <span style={Object.assign({}, { fontSize: fontS, fontWeight: 'bold' }, styles.infoItem)}>
          {rank}
        </span>
      ) : null}
      {additionalPattern ? (
        <span style={Object.assign({}, { fontSize: fontS, color: colorMuted }, styles.infoItem)}>
          {additionalPattern}
        </span>
      ) : null}
    </div>
  )
}

function renderExplain(response: ExplainResponseType, added, showWordsPage) {
  const { meanings, wordInfo } = response

  return (
    <div>
      {renderWordBasic(wordInfo, added, showWordsPage)}
      <div>
        {meanings.map(renderMeaning)}
      </div>
    </div>
  )
}

function renderChoices(response: ChoiceResponseType, searchWord) {
  const { choices } = response

  return (
    <div>
      <div style={{ marginBottom: gapL }}>请选择单词: </div>
      {choices.map((choice) => {
        const { wordType, words } = choice

        return (
          <div key={words[0]} style={styles.choiceItem}>
            <span style={styles.wordType}>{wordType}</span>
            <span style={{ cursor: 'pointer', color: colorPrimary }}>
              {words.map(word => (
                <span
                  key={word}
                  style={{ marginRight: gapM }}
                  onClick={() => searchWord(word)}
                >
                  {word}
                </span>
              ))}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function renderNonCollins(currentWord, navigate,
  response?: NonCollinsExplainsResponseType, added?: boolean, showWordsPage?: boolean) {
  const wordBasic = response
    ? renderWordBasic(response.wordInfo, Boolean(added), Boolean(showWordsPage)) : null

  const responseElement = response ? (
    <div style={{ marginBottom: `${gapL}px` }}>
      {response.explains.map(item => (
        <div key={item.explain} style={styles.choiceItem}>
          {item.type ? (
            <span style={styles.wordType}>{item.type}.</span>
          ) : null}
          <span>{item.explain}</span>
        </div>
      ))}
    </div>
  ) : null

  return (
    <div>
      {wordBasic}
      {responseElement}
      <p style={styles.errorP}>未搜索到柯林斯释义</p>
      {currentWord ? (
        <p style={styles.link} onClick={navigate}>去有道搜索&quot;{currentWord}&quot;</p>
      ) : null}
    </div>
  )
}

class Detail extends Component {
  defaultProps: {
    currentWord: string,
  };

  render() {
    const { search, currentWord, explain: wordResponse, openLink, showWordsPage } = this.props
    const openCurrentWord = openLink.bind(null, currentWord)
    const renderErr = renderNonCollins.bind(null, currentWord, openCurrentWord, showWordsPage)

    if (!wordResponse) {
      return renderErr()
    }

    const { response, type, added } = wordResponse

    if (type === 'explain') {
      return renderExplain(response, added, showWordsPage)
    } else if (type === 'choices') {
      return renderChoices(response, search)
    } else if (type === 'non_collins_explain') {
      return renderNonCollins(currentWord, openCurrentWord, response, added)
    }

    return renderErr()
  }
}

const { func, object, string, bool } = PropTypes

Detail.propTypes = {
  currentWord: string,
  explain: object,
  search: func.isRequired,
  openLink: func.isRequired,
  showWordsPage: bool.isRequired,
}

// $FlowFixMe
Detail.defaultProps = {
  currentWord: '',
  explain: null,
}

export default Detail
