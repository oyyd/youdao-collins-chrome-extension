import React, { Component, PropTypes } from 'react'
import icons from './icons'
import { getWordsPage, add } from '../words'

const styles = {
  container: {
    cursor: 'pointer',
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'top',
  },
  book: {
    width: 16,
    height: 16,
    verticalAlign: 'middle',
  },
  plus: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 8,
    height: 8,
  },
}

class AddWord extends Component {
  constructor(props) {
    super(props)

    const { defaultAdded } = props

    this.wordsPage = getWordsPage()
    this.addWord = this.addWord.bind(this)

    this.state = {
      added: defaultAdded,
    }
  }

  addWord() {
    const { word } = this.props

    add(word).then(() => {
      this.setState({
        added: true,
      })
    })
  }

  render() {
    const { addWord, wordsPage } = this
    const { word, showWordsPage } = this.props
    const { added } = this.state

    if (!word || (added && !showWordsPage)) {
      return null
    }

    const content = (
      <div style={{ display: 'inline-block' }}>
        <img
          src={icons.book}
          style={styles.book}
          alt="book"
        />
        {!added ? (
          <img
            src={icons.plus}
            style={styles.plus}
            alt="plus"
          />
        ) : null}
      </div>
    )

    if (added) {
      return (
        <a href={wordsPage} target="_blank">
          {content}
        </a>
      )
    }

    return (
      <div
        style={styles.container}
        onClick={addWord}
      >
        {content}
      </div>
    )
  }
}

const { string, bool } = PropTypes

AddWord.propTypes = {
  showWordsPage: bool.isRequired,
  word: string,
  defaultAdded: bool,
}

AddWord.defaultProps = {
  word: '',
  defaultAdded: false,
}

export default AddWord
