import React, { Component } from 'react'
import { getOptions, setOptions,
  ACTIVE_TYPES, SHOW_NOTEBOOK_OPTIONS } from '../options'
import { getWordsPage } from '../words'
import { colorPrimary } from './style'
import { clearShanbayToken } from '../message'

const FONT_SIZE = 14
const SIZE = 12

const styles = {
  container: {
    fontSize: FONT_SIZE,
  },
  adviseLink: {
    fontSize: SIZE,
    textDecoration: 'none',
    float: 'right',
    marginTop: 16,
  },
  item: {
    marginTop: 10,
  },
  itemTitle: {

  },
  activeTypeContainer: {
    marginTop: 8,
    fontSize: SIZE,
  },
  activeTypeItem: {
    cursor: 'pointer',
    margin: '4px 0 4px 0',
  },
  label: {
    marginLeft: 6,
  },
  radio: {
    verticalAlign: 'top',
    width: SIZE,
    height: SIZE,
  },
  saveBtn: {
    marginTop: 8,
    fontSize: 12,
    padding: 0,
    cursor: 'pointer',
  },
  saveTips: {
    marginTop: 6,
    fontSize: 12,
    color: colorPrimary,
  },
}

class App extends Component {
  constructor(props) {
    super(props)

    this.wordsPage = getWordsPage()

    this.saveOptions = this.saveOptions.bind(this)
    this.clearToken = this.clearToken.bind(this)

    this.state = {
      hasClearToken: false,
      saveTips: false,
      inited: false,
      options: null,
    }
  }

  componentDidMount() {
    getOptions().then((options) => {
      this.setState({
        inited: true,
        options,
      })
    })
  }

  saveOptions() {
    const { options } = this.state

    this.setState({
      saveTips: false,
    })

    setOptions(options).then(() => {
      this.setState({
        saveTips: true,
      })
    })
  }

  changeOptions(type, value) {
    const { options } = this.state

    const nextOptions = Object.assign({}, options, {
      [type]: value,
    })

    this.setState({
      options: nextOptions,
    })
  }

  clearToken() {
    this.setState({
      hasClearToken: false,
    })

    clearShanbayToken()

    this.setState({
      hasClearToken: true,
    })
  }

  render() {
    const { clearToken, saveOptions, wordsPage } = this
    const { saveTips, options, inited, hasClearToken } = this.state

    // eslint-disable-next-line
    const changeActiveType = this.changeOptions.bind(this, 'activeType')
    // eslint-disable-next-line
    const changeShowNotebook = this.changeOptions.bind(this, 'showNotebook')
    // eslint-disable-next-line
    const changeShowContainChinese = this.changeOptions.bind(this, 'showContainChinese')

    if (!inited) {
      return null
    }

    const showNotebook = options.showNotebook
    const activeType = options.activeType
    const showContainChinese = options.showContainChinese

    return (
      <div style={styles.container}>
        <div style={styles.item}>
          <div style={styles.itemTitle}>扇贝单词本设置：</div>
          {hasClearToken ? (
            <div style={styles.saveTips}>
              清除成功
            </div>
          ) : null}
          <div style={styles.activeTypeContainer}>
            <button onClick={clearToken}>
              清除登录信息
            </button>
          </div>
        </div>
        <div
          style={Object.assign({}, styles.item, {
            display: SHOW_NOTEBOOK_OPTIONS ? 'block' : 'none',
          })}
        >
          <div
            style={Object.assign({}, styles.item, {
              marginBottom: 10,
            })}
          >
            打开
            <a
              href={wordsPage}
              target="_blank"
              style={Object.assign({}, styles.itemTitle, {
                cursor: 'pointer',
                color: colorPrimary,
                textDecoration: 'none',
              })}
            >
              单词本
            </a>
          </div>
          <div style={styles.itemTitle}>开启生词本：</div>
          <div style={styles.activeTypeContainer}>
            <div
              style={styles.activeTypeItem}
              onClick={() => changeShowNotebook(true)}
            >
              <input
                name="showNotebook"
                type="radio"
                style={styles.radio}
                checked={showNotebook}
              />
              <span style={styles.label}>开启</span>
            </div>
            <div
              style={styles.activeTypeItem}
              onClick={() => changeShowNotebook(false)}
            >
              <input
                name="showNotebook"
                type="radio"
                style={styles.radio}
                checked={!showNotebook}
              />
              <span style={styles.label}>关闭</span>
            </div>
          </div>
        </div>
        <div style={styles.item}>
          <div style={styles.itemTitle}>
            划词翻译设置：
          </div>
          <div style={styles.activeTypeContainer}>
            {Object.keys(ACTIVE_TYPES).map(type => (
              <div
                key={type}
                style={styles.activeTypeItem}
                onClick={() => changeActiveType(type)}
              >
                <input
                  name="activeType"
                  type="radio"
                  style={styles.radio}
                  checked={activeType === type}
                />
                <span style={styles.label}>{ACTIVE_TYPES[type]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.item}>
          <div style={styles.itemTitle}>
            中文翻译设置：
          </div>
          <div style={styles.activeTypeContainer}>
            <div
              style={styles.activeTypeItem}
              onClick={() => changeShowContainChinese(!showContainChinese)}
            >
              <input
                name="showContainChinese"
                type="radio"
                style={styles.radio}
                checked={showContainChinese}
              />
              <span style={styles.label}>包含中文时显示翻译</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, marginTop: 12 }}>保存后重新刷新页面生效</div>
          {saveTips ? (
            <div style={styles.saveTips}>
              保存成功
            </div>
          ) : null}
          <div>
            <button
              style={styles.saveBtn}
              onClick={saveOptions}
            >
              保存
            </button>
            <a
              href="https://github.com/oyyd/youdao-collins-chrome-extension/issues"
              target="_blank"
              style={styles.adviseLink}
            >
              意见/bug反馈
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default App
