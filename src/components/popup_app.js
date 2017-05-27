// @flow
import React, { Component } from 'react'
import Searcher from './searcher'
import Detail from './detail'
import { searchWord, openLink } from '../message'
import type { WordResponseType } from '../parse'

const styles = {
  detailContainer: {
    padding: '6px 13px',
  },
  container: {
    position: 'relative',
  },
  panelPlaceholder: {
    height: 38,
  },
  panel: {
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 10,
    display: 'flex',
  },
}

function shouldPush(history, newItem) {
  if (!Array.isArray(history) || history.length < 1) {
    return true
  }

  const lastItem = history[history.length - 1]

  return !(lastItem.type === 'explain' && newItem.type === 'explain'
    && lastItem.response.wordInfo.word === newItem.response.wordInfo.word)
}

class Popup extends Component {
  state: {
    explain: ?WordResponseType,
    history: Array<WordResponseType>,
    currentWord: string,
  }

  constructor(props: any) {
    super(props);

    // awful
    (this: any).search = this.search.bind(this);
    (this: any).jumpBack = this.jumpBack.bind(this)

    this.state = {
      explain: null,
      history: [],
      currentWord: '',
    }
  }

  jumpBack() {
    const { history: oriHistory } = this.state
    const history = oriHistory.slice(0, oriHistory.length - 1)

    this.setState({
      explain: history[history.length - 1],
      history,
    })
  }

  search(word: string) {
    if (!word) {
      return
    }

    searchWord(word).then((res) => {
      let { history } = this.state
      const push = shouldPush(history, res)

      if (push) {
        history = history.slice()
        history.push(res)
      }

      this.setState({
        currentWord: word,
        explain: res,
        history,
      })
    }).catch((/* err */) => {
      // TODO:
    })
  }

  render() {
    const { search, jumpBack } = this
    const { explain, history, currentWord } = this.state

    return (
      <div style={styles.container}>
        <div style={styles.panelPlaceholder} />
        <div style={styles.panel}>
          <Searcher
            jumpBack={jumpBack}
            history={history}
            search={search}
          />
        </div>
        {explain ? (
          <div style={styles.detailContainer}>
            <Detail
              explain={explain}
              search={search}
              currentWord={currentWord}
              openLink={openLink}
              showWordsPage
              showNotebook
            />
          </div>
        ) : null}
      </div>
    )
  }
}

export default Popup
