import React, { Component } from 'react'
import PropTypes from 'prop-types'
import icons from './icons'
import { addNotebookWord } from '../message'

const SHANBAY_URL = 'https://web.shanbay.com/wordsweb/#/collection'

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
  check: {
    position: 'absolute',
    left: 8,
    bottom: 0,
    width: 10,
    height: 10,
  },
  invalid: {
    position: 'absolute',
    left: 8,
    bottom: 0,
    width: 10,
    height: 10,
  },
}

class AddWord extends Component {
  constructor(props) {
    super(props)

    const { defaultAdded, defaultInvalid } = props

    this.addWord = this.addWord.bind(this)

    this.state = {
      added: defaultAdded,
      invalid: defaultInvalid
    }
  }

  componentWillMount() {

  }

  addWord() {
    const { word } = this.props
    addNotebookWord(word).then((response) => {
      const { success, msg } = response
      
      if (!!success) {
        this.setState({ added: true, })
      } else if(msg == 'Invalid Token!') {
        this.setState({ invalid: true, added: false })
      } else {
        throw new Error(msg);
      }

    }).catch((err) => {
      this.props.flash(err.message)
    })
  }

  render() {
    const { addWord } = this
    const { word, showWordsPage } = this.props
    const { added, invalid } = this.state

    if (!word || !showWordsPage) {
      return null
    }

    const content = (
      <div style={{ display: 'inline-block' } }>
        
        { !!invalid ? (
          <img
            src={icons.invalid}
            style={styles.invalid}
            alt="invalid"
          />
        ) : !added? (
          <img
            src={icons.plus}
            style={styles.plus}
            alt="plus"
          />
        ) : (
          <img
            src={icons.check}
            style={styles.check}
            alt="check"
          />
        ) }

        <img
          src={icons.book}
          style={styles.book}
          alt="book"
        />
      </div>
    )

    return added ? (
      <a
        title="单词本中查看"
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
  defaultInvalid: bool,
  flash: func.isRequired,
}

AddWord.defaultProps = {
  word: '',
  defaultAdded: false,
  defaultInvalid: false,
}

export default AddWord
