import fs from 'fs-extra'
import path from 'path'
import MigrationError from '../errors/MigrationError'

export function loadAndBuildMigrationScript (scriptFile, replacements) {
  try {
    const scriptText = loadMigrationScript(scriptFile)
    return buildScript(scriptText, replacements)
  } catch (e) {
    throw new MigrationError('Failed to load migration script file', scriptFile, e)
  }
}

export function loadAndBuildScriptAsset (scriptName, replacements) {
  try {
    const scriptText = loadScriptAsset(scriptName)
    return buildScript(scriptText, replacements)
  } catch (e) {
    throw new MigrationError('Failed to load script asset file', scriptName, e)
  }
}

export function loadScriptAsset (scriptName) {
  const filePath = path.resolve(__dirname, `../../assets/scripts/${scriptName}`)
  return fs.readFileSync(filePath, { encoding: 'utf8' })
}

function loadMigrationScript (scriptFile) {
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
