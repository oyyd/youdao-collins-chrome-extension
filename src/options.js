export const DEFAULT_ACTIVE_TYPE = 'ALWAYS'

export const ACTIVE_TYPES = {
  ALWAYS: '划词即翻译',
  KEY_DOWN: '按住(meta/ctrl)键 + 划词时翻译',
  NEVER: '禁用划词翻译',
}

export function getOptions() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, (data) => {
      let options = {}

      if (Object.hasOwnProperty.call(data, 'options')) {
        options = data.options
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
