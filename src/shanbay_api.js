/**
 * @author maicss
 * @file some licences file
 * @copyright 2017-2020 maicss
 * */

/**
 * chrome 通知处理方法, 传入的参数就是chrome notifications的参数
 * @function notify
 * @param {object} opt - chrome notifications 的参数
 * @param {string} opt.title=人丑多读书 - notifications title
 * @param {string} [opt.message=少壮不努力，老大背单词] - notifications message
 * @param {string} [opt.url=https://www.shanbay.com/] - notifications url, notifications可以点击跳转
 * */
export const notify = (opt = {title: '人丑多读书', message: '少壮不努力，老大背单词', url: 'https://www.shanbay.com/'}) => {
  let hasNotified = false
  const options = {
    type: 'basic',
    title: opt.title,
    message: opt.message,
    iconUrl: './icons/icon48.png',
  }
  let noteID = Math.random().toString(36)
  chrome.notifications.create(noteID, options, (notifyID) => {
    hasNotified = true
  })
  chrome.notifications.onClicked.addListener(function (notifyID) {
    chrome.notifications.clear(notifyID)
    if (noteID === notifyID) {
      chrome.tabs.create({
        url: opt.url
      })
    }
    hasNotified = false
  })
}

/**
 * 基于fetch的网络请求方法的封装，只有两种数据的返回，buffer和json，因为这个应用里面只用到了这两种
 * @function request
 * @see [use fetch API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch}
 * @param {string} url - request url
 * @param {object} [options] - fetch options
 * @param {string} [options.type='buffer'] - whether need return buffer
 * @return Promise
 * */
const request = (url, options = {}) => {
  options = Object.assign(options, { credentials: 'include' })
  return fetch(url, options).then(res => {
      if (res.ok) {
        if (options.type === 'buffer') return res.arrayBuffer()
        return res.json()
      } else {
        return Promise.reject(res.json ? res.json() : res.text())
      }
    }).catch(e => {
      if (e.status === 400) {
        notify({
          title: '扇贝认证失败',
          message: '点击此消息登录',
          url: 'https://web.shanbay.com/web/account/login/'
        })
      } else {
        return e.then ? e.then(error => Promise.reject(error)) : Promise.reject(e)
      }
    })
}

/**
 * shanbay API的需要用到的方法，没什么用，只是一个参考
 * 扇贝开放API关闭之后，直接读取扇贝网的cookie，使用扇贝私有API
 * @constant
 * @readonly
 * @enum {object}
 * */
const shanbayAPI = {
  /** 查询单词*/
  lookUp: {
    method: 'GET',
    url: 'https://apiv3.shanbay.com/abc/words/senses?vocabulary_content={word}',
    params: ['word']
  },
  /** 添加生词和标记已添加生词已忘记 */
  addWord: {
    method: 'POST',
    url: 'https://apiv3.shanbay.com/news/words',
    params: [{"vocab_id":"","business_id":2,"paragraph_id":"1","sentence_id":"A1","source_content":"","article_id":"ca","source_name":"","summary":""}]
  }
}

/**
 * @description 查询单词
 * @function lookUp
 * @param {string} word - 需要查询的单词
 * @return Promise<object>
 * */
export const lookUp = word => request((shanbayAPI.lookUp.url).replace('{word}', word), {method: shanbayAPI.lookUp.method})

/** 
 * @description 添加单词到单词本或忘记单词
 * @param {string} word - 单词
 * @param {string} wordID - 单词id
 * @return Promise<object>
 */
export const addWord = (wordID) => request(shanbayAPI.addWord.url, {
  method: shanbayAPI.addWord.method,
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({"vocab_id": wordID,"business_id":2,"paragraph_id":"1","sentence_id":"A1","source_content":"","article_id":"ca","source_name":"","summary":""})
})