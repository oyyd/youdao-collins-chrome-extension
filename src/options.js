export const SHOW_NOTEBOOK_OPTIONS = false

const DEFAULT_ACTIVE_TYPE = 'ALWAYS'

const DEFAULT_SHOW_NOTEBOOK = true

export const ACTIVE_TYPES = {
  ALWAYS: '划词即翻译',
  KEY_DOWN: '按住(meta/ctrl)键 + 划词时翻译',
  DOUBLE_CLICK: '双击单词后翻译',
  NEVER: '禁用划词翻译',
}

const DEFAULT_OPTIONS = {
  activeType: DEFAULT_ACTIVE_TYPE,
  showNotebook: DEFAULT_SHOW_NOTEBOOK,
  tempDisabled: false,
}

export function getOptions() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, (data) => {
      let options = DEFAULT_OPTIONS

      if (Object.hasOwnProperty.call(data, 'options')) {
        options = Object.assign(options, data.options)
      }

      resolve(options)
    })
  })
}

export function setOptions(options) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({
      options,
    }, () => {
      resolve(options)
    })
  })
}
