import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'

const CONTAINER_HEIGHT = 40
const ANIMATION_TIME = 1000

const styles = {
  popup: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 100,
  },
  container: {

  },
}

class Tips extends Component {
  constructor(props) {
    super(props)

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
    const { show, content } = this.state
    const height = show ? CONTAINER_HEIGHT : 0

    return (
      <div
        style={styles.popup}
      >
        <Motion
          defaultStyle={{ height: 0 }}
          style={{ height: spring(height) }}
        >
          {interpolatingStyle => (
            <div
              style={Object.assign({}, styles.container, interpolatingStyle)}
            >
              {content}
            </div>
          )}
        </Motion>
      </div>
    )
  }
}

export default Tips
