import React, { Component } from 'react'
import { get, remove, getWordURL } from '../words'
import { colorPrimary } from './style'

const styles = {
  word: {
    marginRight: 10,
    padding: '2px 4px',
    backgroundColor: colorPrimary,
    borderRadius: '4px',
    color: '#FFF',
    display: 'inline-block',
  },
  text: {
    color: '#FFF',
    textDecoration: 'none',
  },
  removeBtn: {
    textAlign: 'center',
    lineHeight: '12px',
    verticalAlign: 'middle',
    display: 'inline-block',
    backgroundColor: '#FFF',
    borderRadius: '50%',
    width: 12,
    height: 12,
    color: colorPrimary,
    marginLeft: 6,
    cursor: 'pointer',
  },
}

class App extends Component {
  constructor(props) {
    super(props)

    this.removeWord = this.removeWord.bind(this)

    this.state = {
      words: null,
    }
  }

  componentDidMount() {
    get().then((words) => {
      this.setState({
        words,
      })
    })
  }

  removeWord(word) {
    remove(word).then((words) => {
      this.setState({
        words,
      })
    })
  }

  render() {
    const { removeWord } = this
    const { words } = this.state

    if (!words) {
      return null
    }

    return (
      <div>
        <div>生词: </div>
        <div style={{ marginTop: 14 }}>
          {words.map(word => (
            <div key={word} style={styles.word}>
              <a
                href={getWordURL(word)}
                target="_blank"
                style={styles.text}
              >
                {word}
              </a>
              <div title={`移除${word}`} style={styles.removeBtn} onClick={() => removeWord(word)}>
                <span>x</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default App
