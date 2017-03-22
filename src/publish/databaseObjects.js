import Promise from 'bluebird'
import fs from 'fs-extra'
import path from 'path'
import { onMigrationScriptError } from '../helpers/migration'
import {
  loadAndBuildMigrationScript,
  splitBatches
} from '../helpers/script'

export function runFunctions (db, migrationConfig, replacements) {
  console.log('Start applying functions')
  return runScripts(db, migrationConfig.paths.functions, replacements)
}

export function runProcedures (db, migrationConfig, replacements) {
  console.log('Start applying procedures')
  return runScripts(db, migrationConfig.paths.procedures, replacements)
}

export function runViews (db, migrationConfig, replacements) {
  console.log('Start applying views')
  return runScripts(db, migrationConfig.paths.views, replacements)
}

function runScripts (db, scriptPath, replacements) {
  const files = getScriptFiles(scriptPath)

  if (files.length === 0) {
    return Promise.resolve()
  }

  const scriptRunner = createScriptRunner(db, replacements)

  return Promise.each(files, scriptRunner)
}

function getScriptFiles (dirPath) {
  const fullPath = path.resolve(dirPath)
  return fs.readdirSync(fullPath)
    .filter((f) => /.sql/.test(f))
    .map((f) => path.join(dirPath, f))
}

function createScriptRunner (db, replacements) {
  return (scriptFile) => {
    const sqlScript = loadAndBuildMigrationScript(scriptFile, replacements)
    const baseName = path.basename(scriptFile, '.sql')
    const batches = splitBatches(sqlScript)
    console.log(`Running database object script ${baseName}`)
    return Promise.each(batches, (batchText) => db.runRawQuery(batchText))
      .catch((error) => onMigrationScriptError(error, baseName))
  }
}
