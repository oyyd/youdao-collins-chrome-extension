window.__shanbayExtensionAuthInfo = {
  checkAuth (callback) {
    chrome.cookies.getAll({url: 'https://www.shanbay.com'}, cookies => {
      const auth_token = (cookies.find(cookie => cookie.name === 'auth_token') || {}).value
      callback(auth_token)
    })
  }
}