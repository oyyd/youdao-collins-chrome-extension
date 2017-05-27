import React, { Component } from 'react'
import PropTypes from 'prop-types'
import icons from './icons'
import { addNotebookWord } from '../message'

const SHANBAY_URL = 'https://www.shanbay.com/bdc/learnings/library/'

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

    this.addWord = this.addWord.bind(this)

    this.state = {
      added: defaultAdded,
    }
  }

  addWord() {
    const { word } = this.props

    addNotebookWord(word).then((response) => {
      const { success, msg } = response

      if (!success) {
        throw new Error(msg)
      }

      this.setState({
        added: true,
      })
    }).catch((err) => {
      this.props.flash(err.message)
    })
  }

  render() {
    const { addWord } = this
    const { word, showWordsPage } = this.props
    const { added } = this.state

    if (!word || !showWordsPage) {
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

    return added ? (
      <a
        title="点击加入扇贝词库"
        style={styles.container}
        href={SHANBAY_URL}
        target="_blank"
      >
        {content}
      </a>
    ) : (
      <div
        title="点击加入扇贝词库"
        style={styles.container}
        onClick={addWord}
      >
        {content}
      </div>
    )
  }
}

const { string, bool, func } = PropTypes

AddWord.propTypes = {
  showWordsPage: bool.isRequired,
  word: string,
  defaultAdded: bool,
  flash: func.isRequired,
}

AddWord.defaultProps = {
  word: '',
  defaultAdded: false,
}

export default AddWord
