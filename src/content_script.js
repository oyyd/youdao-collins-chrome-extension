import React from 'react'
import ReactDOM from 'react-dom'
import getCaretCoordinates from 'textarea-caret'
import ContentApp from './components/content_app'
import { styleContainer } from './utils'
import { getOptions } from './options'

const CONTAINER_ID = 'ycce-container'

function getShouldDisplay(
  activeType,
  activeKeyPressed,
  isDBClick,
  tempDisabled,
) {
  if (tempDisabled) {
    return false
  }

  if (activeType === 'NEVER') {
    return false
  }

  if (activeType === 'ALWAYS') {
    return true
  }

  if (activeType === 'DOUBLE_CLICK') {
    return isDBClick
  }

  return activeKeyPressed
}

function createContainer() {
  const containerEle = document.createElement('div')
  containerEle.id = CONTAINER_ID
  containerEle.style.fontSize = '14px'

  styleContainer(containerEle)

  return containerEle
}

function getContainer() {
  let containerEle = document.querySelector(`#${CONTAINER_ID}`)

  if (containerEle) {
    return containerEle
  }

  containerEle = createContainer()
  document.querySelector('body').appendChild(containerEle)

  return containerEle
}

function getPosition(selection) {
  let range = null
  let rect

  try {
    range = selection.getRangeAt(0)
  } catch (err) {
    return null
  }

  const elem = range.startContainer.firstElementChild
  if (elem !== undefined) {
    if (elem.nodeName === 'INPUT' || elem.nodeName === 'TEXTAREA') {
      const { top, left } = elem.getBoundingClientRect()
      const rectStart = getCaretCoordinates(elem, elem.selectionStart)
      const rectEnd = getCaretCoordinates(elem, elem.selectionEnd)
      if (!rectEnd) {
        return null
      }
      rect = {
        top: top + rectEnd.top,
        left: left + rectEnd.left,
        width: rectEnd.left - rectStart.left,
      }
    }
  } else {
    rect = range.getBoundingClientRect()
  }

  const { top, left, width } = rect

  return {
    left: left + window.pageXOffset + width / 2,
    top: top + window.pageYOffset,
  }
}

function getActiveKeyPressed(event) {
  const { metaKey, ctrlKey } = event
  const activeKeyPressed = metaKey || ctrlKey

  return activeKeyPressed
}

function getElementLineHeight(node) {
  const ele = node.parentElement
  const text = window
    .getComputedStyle(ele, null)
    .getPropertyValue('line-height')
  const res = /(.+)px/.exec(text)

  if (res === null) {
    return null
  }

  return parseFloat(res[1])
}

function isClickContainer(event) {
  const containerEle = getContainer()

  return containerEle.contains(event.target)
}

function createSelectionStream(next, options) {
  const { activeType } = options
  let isSelecting = false

  document.addEventListener(
    'selectionchange',
    () => {
      const containerEle = getContainer()
      const selection = window.getSelection()

      if (containerEle.contains(selection.baseNode)) {
        return
      }

      const content = selection.toString().trim()

      if (content) {
        isSelecting = true
        return
      }

      isSelecting = false
    },
    false,
  )

  // Handle mouse event to decide should we show popup.
  const handler = (event, isDBClick) => {
    let shouldDisplay = false
    let activeKeyPressed = null

    if (!isDBClick) {
      activeKeyPressed = getActiveKeyPressed(event)
    }

    shouldDisplay = getShouldDisplay(
      activeType,
      activeKeyPressed,
      isDBClick,
      options.tempDisabled,
    )

    if (!isSelecting || !shouldDisplay) {
      return
    }

    isSelecting = false

    next(options, false)
  }

  document.addEventListener('dblclick', (event) => {
    if (activeType !== 'DOUBLE_CLICK' || isClickContainer(event)) {
      return
    }

    handler(event, true)
  })

  document.addEventListener('mouseup', (event) => {
    const clickContainer = isClickContainer(event)

    if (!isSelecting && !clickContainer) {
      next(options, true)
      return
    }

    if (activeType === 'DOUBLE_CLICK' || clickContainer) {
      return
    }

    handler(event, false)
  })
}

function hasChinese(text) {
  if (/.*[\u4e00-\u9fa5]+.*$/.test(text)) {
    // 包含汉字
    return true
  }
  return false
}

// Render popup
function render(options, hide) {
  const selection = window.getSelection()
  const position = getPosition(selection)

  if (!position) {
    return
  }

  const content = selection.toString().trim()

  if (!options.showContainChinese && hasChinese(content)) {
    return
  }

  const containerEle = getContainer()
  const node = selection.baseNode
  const lineHeight = getElementLineHeight(node)
  ReactDOM.render(
    <ContentApp
      lineHeight={lineHeight}
      hide={hide}
      content={content}
      position={position}
      options={options}
    />,
    containerEle,
  )
}

function main() {
  getOptions().then((options) => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type !== 'ycce') {
        return
      }
      options.tempDisabled = msg.tempDisabled
    })
    createSelectionStream(render, options)
  })
}

main()
