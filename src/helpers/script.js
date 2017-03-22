import Promise from 'bluebird'
import path from 'path'
import MigrationError from '../errors/MigrationError'

const fs = Promise.promisifyAll(require('fs-extra'))

export function loadAndBuildMigrationScriptSync (scriptFile, replacements) {
  try {
    const scriptText = loadMigrationScriptSync(scriptFile)
    return buildScript(scriptText, replacements)
  } catch (e) {
    throw new MigrationError('Failed to load migration script file', scriptFile, e)
  }
}

export function loadAndBuildMigrationScript (scriptFile, replacements) {
  return loadMigrationScript(scriptFile)
    .then((scriptText) => buildScript(scriptText, replacements))
    .catch((error) => {
      throw new MigrationError('Failed to load migration script file', scriptFile, error)
    })
}

export function loadAndBuildScriptAssetSync (scriptName, replacements) {
  try {
    const scriptText = loadScriptAssetSync(scriptName)
    return buildScript(scriptText, replacements)
  } catch (e) {
    throw new MigrationError('Failed to load script asset file', scriptName, e)
  }
}

export function loadScriptAssetSync (scriptName) {
  const filePath = path.resolve(__dirname, `../../assets/scripts/${scriptName}`)
  return fs.readFileSync(filePath, { encoding: 'utf8' })
}

export function splitBatches (scriptText) {
  return scriptText.split(/\nGO|go\b/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0)
}

function loadMigrationScript (scriptFile) {
  const filePath = path.resolve(scriptFile)
  return fs.readFileAsync(filePath, { encoding: 'utf8' })
}

function loadMigrationScriptSync (scriptFile) {
  const filePath = path.resolve(scriptFile)
  return fs.readFileSync(filePath, { encoding: 'utf8' })
}

function buildScript (scriptText, replacements) {
  if (typeof replacements === 'object') {
    Object.keys(replacements).forEach((key) => {
      const replacementMatcher = new RegExp(`{{${key}}}`, 'g')
      scriptText = scriptText.replace(replacementMatcher, replacements[key])
    })
  }
  return scriptText
}
