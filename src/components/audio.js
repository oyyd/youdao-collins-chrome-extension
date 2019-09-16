import React, { Component } from 'react'
import PropTypes from 'prop-types'
import icons from './icons'

const { string } = PropTypes

function getAudioURL(word, type = 1) {
  return `http://dict.youdao.com/dictvoice?audio=${word}&type=${type}`
}

class Audio extends Component {
  constructor(props) {
    super(props)

    this.playAudio = this.playAudio.bind(this)

    this.refers = {}
    this.state = {
      hide: false,
    }
  }

  playAudio() {
    this.refers.audio.play()
  }

  render() {
    const { playAudio } = this
    const { word } = this.props
    const { hide } = this.state
    const url = getAudioURL(word)

    const style = {
      cursor: 'pointer',
      verticalAlign: 'middle',
      display: hide ? 'none' : 'inline-block',
    }

    return (
      <span style={style}>
        <img
          style={{ width: 16, height: 16, verticalAlign: 'top' }}
          src={icons.horn}
          alt="horn"
          onClick={playAudio}
        />
        <audio
          ref={(audio) => {
            this.refers.audio = audio
          }}
          src={url}
          onError={() => this.setState({ hide: true })}
          preload="none"
        />
      </span>
    )
  }
}

Audio.propTypes = {
  word: string.isRequired,
}


export default Audio
