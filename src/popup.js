import React from 'react'
import ReactDOM from 'react-dom'
import Popup from './components/popup_app'
import { styleContainer } from './utils'

styleContainer(document.querySelector('body'))

ReactDOM.render(
  <Popup />,
  document.getElementById('main'),
)
