import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Detail from './detail'
import { searchWord, openLink } from '../message'
import { gapS, colorMuted } from './style'

const WIDTH = 400
const MAX_HEIGHT = 300
const PADDING_LEFT = 20
const ASSUME_LINE_HEIGHT = 20
const LEFT_PAD_PERCENTAGE = 1 / 3

const styles = {
  container: {
    padding: `${gapS}px`,
    border: `1px solid ${colorMuted}`,
    position: 'absolute',
    boxSizing: 'border-box',
    zIndex: 1000000,
    width: WIDTH,
    maxHeight: MAX_HEIGHT,
    overflow: 'auto',
    backgroundColor: '#fff',
  },
}

function getOffsets() {
  const body = document.querySelector('body')
  const scrollTop = window.pageYOffset || document.scrollTop || body.scrollTop
  const scrollLeft = window.pageXOffset || document.scrollLeft || body.scrollLeft

  return { top: Math.round(scrollTop), left: Math.round(scrollLeft) }
}

function getViewportSize() {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  }
}

function getPositionAdjustment(position) {
  const { left } = position
  const { width } = getViewportSize()
  const { left: offsetLeft } = getOffsets()

  // const maxHeight = offsetTop + height
  // const elementHeight = top + containerHeight
  const allowLeftAdjustment = width > WIDTH
  const shouldLeftAdjustment = left + (WIDTH * LEFT_PAD_PERCENTAGE) > width + offsetLeft

  let leftAdjustment = 0

  if (allowLeftAdjustment && shouldLeftAdjustment) {
    leftAdjustment = left + (WIDTH * LEFT_PAD_PERCENTAGE) - width - offsetLeft
  }

  return {
    atTop: false,
    leftAdjustment,
  }
}

function getLayoutPosition(position, lineHeight) {
  const padHeight = (typeof lineHeight === 'number')
    ? Math.max(ASSUME_LINE_HEIGHT, lineHeight) : ASSUME_LINE_HEIGHT
  const { leftAdjustment } = getPositionAdjustment(position)

  let { top, left } = position
  const originLeftPos = left - (WIDTH * LEFT_PAD_PERCENTAGE) - leftAdjustment

  left = Math.max(originLeftPos, PADDING_LEFT)
  top += padHeight

  return {
    top, left,
  }
}

class ContentApp extends Component {
  constructor(props) {
    super(props)

    const { content } = props

    this.search = this.search.bind(this)

    this.state = {
      containerHeight: MAX_HEIGHT,
      display: false,
      isLoading: false,
      explain: null,
      currentWord: content,
    }
  }

  componentDidMount() {
    this.search(this.state.currentWord)
  }

  componentWillReceiveProps(newProps) {
    const { content } = newProps

    if (content !== this.state.currentWord) {
      this.search(content)
    }
  }

  search(word) {
    if (!word) {
      return
    }

    let fullfilled = false

    this.setState({
      currentWord: word,
      display: false,
      isLoading: true,
    })

    // try to not change screen too frequently
    setTimeout(() => {
      if (!fullfilled) {
        this.setState({
          display: true,
        })
      }
    }, 1000)

    searchWord(word).then((res) => {
      if (word !== this.state.currentWord) {
        return
      }

      this.setState({
        display: true,
        isLoading: false,
        currentWord: word,
        explain: res,
      })

      fullfilled = true
    }).catch((err) => { // eslint-disable-line
      // TODO:
      fullfilled = true
    })
  }

  render() {
    const { search } = this
    const { options, lineHeight, hide, position } = this.props
    const { explain, isLoading, display, currentWord } = this.state

    if (hide) {
      return null
    }

    const containerStyle = Object.assign({},
      styles.container,
      getLayoutPosition(position, lineHeight),
      !display ? {
        display: 'none',
      } : null,
    )

    return (
      <div
        style={containerStyle}
      >
        {isLoading ? (
          <div>正在加载 &quot;{currentWord}&quot; ...</div>
        ) : (
          <Detail
            showNotebook={options.showNotebook}
            currentWord={currentWord}
            explain={explain}
            search={search}
            openLink={openLink}
            showWordsPage
          />
        )}
      </div>
    )
  }
}

const { object, string, bool, number } = PropTypes

ContentApp.propTypes = {
  lineHeight: number,
  hide: bool.isRequired,
  position: object.isRequired,
  content: string.isRequired,
  options: object.isRequired,
}

ContentApp.defaultProps = {
  lineHeight: ASSUME_LINE_HEIGHT,
}

export default ContentApp
