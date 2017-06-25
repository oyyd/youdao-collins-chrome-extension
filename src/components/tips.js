import React, { Component } from 'react'
import { number } from 'prop-types'
import { Motion, spring } from 'react-motion'
import { gapM, gapS, colorBorder } from './style'

const CONTAINER_HEIGHT = 32
const ANIMATION_TIME = 2000

const styles = {
  popup: {
    position: 'absolute',
    left: 0,
    zIndex: 100,
    width: '100%',
  },
  container: {
    textAlign: 'center',
    margin: '0 auto',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    width: '200px',
    overflow: 'hidden',
    border: `1px solid ${colorBorder}`,
    boxShadow: '0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15)',
  },
}

function createPaddingElement(contentString) {
  return (
    <div style={{ padding: `${gapS}px ${gapM}px`, fontSize: '14px' }}>
      {contentString}
    </div>
  )
}

class Tips extends Component {
  constructor(props) {
    super(props)

    this.flash = this.flash.bind(this)

    this.animationID = 0

    this.state = {
      show: false,
      content: '',
    }
  }

  flash(content) {
    this.animationID += 1

    const { animationID } = this

    new Promise((resolve) => {
      this.setState({
        show: true,
        content,
      }, () => {
        setTimeout(() => {
          resolve()
        }, ANIMATION_TIME)
      })
    }).then(() => {
      if (this.animationID !== animationID) {
        return
      }

      // hide
      this.setState({
        show: false,
      })
    })
  }

  render() {
    const { top } = this.props
    const { show, content } = this.state
    const height = show ? CONTAINER_HEIGHT : spring(0)

    const popupStyle = Object.assign({}, styles.popup, {
      top,
    })

    return (
      <div
        style={popupStyle}
      >
        <Motion
          defaultStyle={{ height: 0 }}
          style={{ height }}
        >
          {(interpolatingStyle) => {
            // eslint-disable-next-line
            const { height } = interpolatingStyle
            const display = height < 2 ? 'none' : 'block'

            return (
              <div
                style={Object.assign({ display }, styles.container, interpolatingStyle)}
              >
                {typeof content === 'string' ? createPaddingElement(content) : content}
              </div>
            )
          }}
        </Motion>
      </div>
    )
  }
}

Tips.propTypes = {
  top: number,
}

Tips.defaultProps = {
  top: 40,
}

export default Tips
