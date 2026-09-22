const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const generateConfig = require('./generateConfig')
const { createNcmApi } = require('./server')

let appPromise

async function initializeApp() {
  const anonymousTokenPath = path.resolve(tmpPath, 'anonymous_token')

  if (!fs.existsSync(anonymousTokenPath)) {
    fs.writeFileSync(anonymousTokenPath, '', 'utf-8')
  }

  await generateConfig()
  return createNcmApi()
}

module.exports = async function handler(req, res) {
  if (!appPromise) {
    appPromise = initializeApp().catch((error) => {
      appPromise = undefined
      throw error
    })
  }

  const app = await appPromise
  return app(req, res)
}
