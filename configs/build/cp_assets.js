const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { version } = require('../../package.json')

const MANIFEST_PATH = resolve(__dirname, '../../assets/manifest.json')
const TARGET_PATH = resolve(__dirname, '../../build/manifest.json')

function getContent() {
  const manifestJSON = JSON.parse(readFileSync(MANIFEST_PATH))

  manifestJSON.version = version
  manifestJSON.background.persistent = false

  return JSON.stringify(manifestJSON, null, 2)
}

function writeManifest() {
  const content = getContent()

  writeFileSync(TARGET_PATH, content)
}

if (require.main === module) {
  writeManifest()
}
