import React from 'react'
import ReactDOM from 'react-dom'
import ContentApp from './components/content_app'
import { styleContainer } from './utils'
import { getOptions } from './options'

const CONTAINER_ID = 'ycce-container'

function getShouldDisplay(activeType, activeKeyPressed) {
  if (activeType === 'NEVER') {
    return false
  }

  if (activeType === 'ALWAYS') {
    return true
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

  try {
    range = selection.getRangeAt(0)
  } catch (err) {
    return null
  }

  const rect = range.getBoundingClientRect()
  const { top, left, width } = rect

  return {
    left: left + window.pageXOffset + (width / 2),
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
  const text = window.getComputedStyle(ele, null).getPropertyValue('line-height')
  const res = /(.+)px/.exec(text)

  if (res === null) {
    return null
  }

  return parseFloat(res[1])
}

function createSelectionStream(next, options) {
  const activeType = options.activeType
  let isSelecting = false

  document.addEventListener('selectionchange', () => {
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
  }, false)

  document.addEventListener('mouseup', (event) => {
    const activeKeyPressed = getActiveKeyPressed(event)
    const containerEle = getContainer()
    const shouldDisplay = getShouldDisplay(activeType, activeKeyPressed)

    if (containerEle.contains(event.target)) {
      return
    }

    if (!isSelecting) {
      next(options, true)
      return
    }

    if (!shouldDisplay) {
      return
    }

    isSelecting = false

    next(options, false)
  })
}

function render(options, hide) {
  const selection = window.getSelection()
  const position = getPosition(selection)

  if (!position) {
    return
  }

  const containerEle = getContainer()
  const content = selection.toString().trim()
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
    createSelectionStream(render, options)
  })
}

main()
