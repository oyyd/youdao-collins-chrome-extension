import React, { Component } from 'react'
import PropTypes from 'prop-types'
import icons from './icons'
import { btn } from './style'
import { setOptions, getOptions } from '../options'

const { func, array } = PropTypes

const POINT_SIZE = 16
const activeColor = '#76E15F'
const inactiveColor = '#000'

const styles = {
  activeBtnLight: {
    display: 'inline-block',
    width: POINT_SIZE,
    height: POINT_SIZE,
    borderRadius: Math.floor(POINT_SIZE / 2),
  },
  activeBtn: {
    width: 30,
    height: 30,
    boxSizing: 'border-box',
    padding: '12px 0 0 6px',
    cursor: 'pointer',
  },
  gearIcon: {
    width: 30,
    height: 30,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginLeft: 11,
  },
  backIcon: {
    width: 26,
    height: 26,
    marginLeft: 6,
  },
  inputGroup: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flex: 1,
  },
  input: {
    boxShadow: 0,
    outlineWidth: 0,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '.5rem .75rem',
    fontSize: '1rem',
    lineHeight: 1.25,
    color: '#464a4c',
    backgroundColor: '#fff',
    backgroundImage: 'none',
    backgroundClip: 'padding-box',
    border: '1px solid rgba(0,0,0,.15)',
    borderRadius: '.25rem',
    transition:
      'border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s',
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  searchBtn: Object.assign({}, btn, {
    padding: '0px',
    borderLeft: '0px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
  }),
  backBtn: Object.assign({}, btn, {
    padding: '0px',
    borderLeft: '0px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
  }),
}

function openOptionsPage() {
  if (chrome.runtime.openOptionsPage) {
    // New way to open options pages, if supported (Chrome 42+).
    chrome.runtime.openOptionsPage()
  } else {
    // Reasonable fallback.
    window.open(chrome.runtime.getURL('options.html'))
  }
}

class Searcher extends Component {
  constructor(props) {
    super(props)

    this.onInputKey = this.onInputKey.bind(this)
    this.triggerSearch = this.triggerSearch.bind(this)
    this.shouldSearch = this.shouldSearch.bind(this)
    this.changeTempDisabled = this.changeTempDisabled.bind(this)

    this.refers = {}

    this.options = null

    this.state = {
      inputContent: '',
      tempDisabled: false,
    }
  }

  componentDidMount() {
    this.refers.input.focus()

    getOptions().then(options => {
      const { tempDisabled = false } = options

      this.setState({ tempDisabled })
      this.options = options
    })
  }

  changeTempDisabled() {
    const { tempDisabled } = this.state

    this.setState({
      tempDisabled: !tempDisabled,
    })

    setOptions(
      Object.assign({}, this.options, {
        tempDisabled: !tempDisabled,
      }),
    )

    // Tell content_script about that should it disable translating or not.
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'ycce',
          tempDisabled: !tempDisabled,
        })
      })
    })
  }

  onInputKey(e) {
    this.setState({ inputContent: e.target.value })
  }

  shouldSearch(e) {
    const { key } = e

    if (key === 'Enter') {
      this.triggerSearch()
    }
  }

  triggerSearch() {
    const { search } = this.props
    const { inputContent } = this.state

    search(inputContent)

    // Select all text after triggering search.
    const { input } = this.refers

    if (!input) {
      return
    }

    input.setSelectionRange(0, input.value.length)
  }

  render() {
    const { inputContent, tempDisabled } = this.state
    const { onInputKey, triggerSearch, shouldSearch } = this
    const { history, jumpBack } = this.props
    const activeBtnTitle = tempDisabled
      ? '划词翻译已经关闭'
      : '划词翻译已经启用'

    return (
      <div style={styles.inputGroup}>
        <input
          ref={input => (this.refers.input = input)}
          type="text"
          style={styles.input}
          placeholder="请输入单词"
          aria-describedby="basic-addon2"
          value={inputContent}
          onChange={onInputKey}
          onKeyPress={shouldSearch}
        />
        {history.length > 1 ? (
          <span style={styles.backBtn} onClick={jumpBack}>
            <img style={styles.backIcon} src={icons.back} alt="back" />
          </span>
        ) : null}
        <span style={styles.searchBtn} onClick={triggerSearch}>
          <img style={styles.searchIcon} src={icons.search} alt="search" />
        </span>
        <span style={styles.searchBtn} onClick={openOptionsPage}>
          <img style={styles.searchIcon} src={icons.gear} alt="gear" />
        </span>
        <div style={styles.activeBtn} onClick={this.changeTempDisabled}>
          <span
            title={activeBtnTitle}
            style={Object.assign(styles.activeBtnLight, {
              backgroundColor: tempDisabled ? inactiveColor : activeColor,
            })}
          />
        </div>
      </div>
    )
  }
}

Searcher.propTypes = {
  search: func.isRequired,
  jumpBack: func.isRequired,
  history: array.isRequired,
}

export default Searcher
