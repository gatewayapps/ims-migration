import Promise from 'bluebird'
import path from 'path'
import { onMigrationScriptError } from '../helpers/migration'
import {
  loadAndBuildMigrationScript,
  splitBatches
} from '../helpers/script'
import logger from '../helpers/logging'

const fs = Promise.promisifyAll(require('fs-extra'))

const CREATABLE_NAME_PATTERN = /CREATE\s+(FUNCTION|PROCEDURE|VIEW)\s+(\[.+\]|[\w.]+\b)/

export function runDatabaseObjects (db, migrationConfig, replacements) {
  return Promise.all([
    getScriptFiles(migrationConfig.paths.functions, replacements),
    getScriptFiles(migrationConfig.paths.procedures, replacements),
    getScriptFiles(migrationConfig.paths.views, replacements)
  ])
  .spread(resolveScriptDependencies)
  .each(createScriptRunner(db))
}

function getScriptFiles (dirPath, replacements) {
  const fullPath = path.resolve(dirPath)

  if (!fs.existsSync(fullPath)) {
    return Promise.resolve([])
  }

  return fs.readdirAsync(fullPath)
    .filter((f) => /.sql/.test(f))
    .map((f) => {
      const fullFilePath = path.join(fullPath, f)
      return loadAndBuildMigrationScript(fullFilePath, replacements)
        .then((scriptText) => {
          const script = {
            objectName: undefined,
            filePath: fullFilePath,
            text: scriptText,
            dependencies: []
          }

          // Extract creatable objectName from scriptText
          const re = new RegExp(CREATABLE_NAME_PATTERN, 'i')
          const match = re.exec(scriptText)
          if (match && match.length >= 3) {
            const nameParts = match[2].split('.')
            script.objectName = nameParts.pop().trim().replace('[', '').replace(']', '')
          }
          return script
        })
    })
}

function resolveScriptDependencies (functions, procedures, views) {
  const allScripts = functions.concat(procedures).concat(views)
  logger.status('Resolving script dependencies')
  const objectNames = allScripts.filter((s) => s.objectName).map((s) => s.objectName)

  // identify the dependent objects for each script
  allScripts.forEach((script) => {
    script.dependencies = objectNames.filter((oName) => {
      return script.objectName !== oName && new RegExp(`\\b${oName}\\b`, 'i').test(script.text)
    })
  })
  return orderScripts(allScripts)
}

function orderScripts (scripts, orderedScripts = []) {
  if (scripts.length === 0) {
    return orderedScripts
  }

  const initialValue = {
    ordered: orderedScripts,
    remaining: []
  }

  const result = scripts.reduce((r, script) => {
    // Compile a list of ordered scripts. Once ALL the dependencies for a script are already in the orderedScripts
    // then the script can be added to the ordered scripts.
    if (allScriptDependenciesInArray(r.ordered, script.dependencies)) {
      r.ordered.push(script)
    } else {
      r.remaining.push(script)
    }
    return r
  }, initialValue)

  return orderScripts(result.remaining, result.ordered)
}

function allScriptDependenciesInArray (array, dependencies) {
  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    return true
  }

  return dependencies.every((dep) => array.some((s) => s.objectName === dep))
}

function createScriptRunner (db) {
  return (script) => {
    const baseName = path.basename(script.filePath, '.sql')
    const batches = splitBatches(script.text)
    logger.status(`Running database object script ${baseName}`)
    return Promise.each(batches, (batchText) => db.runRawQuery(batchText))
      .catch((error) => onMigrationScriptError(error, baseName))
  }
}
