import Promise from 'bluebird'
import path from 'path'
import { onMigrationScriptError } from '../helpers/migration'
import {
  loadAndBuildMigrationScript,
  splitBatches
} from '../helpers/script'

export function runPostDeploymentScripts (db, migrationConfig, replacements) {
  if (!Array.isArray(migrationConfig.postDeploy) || migrationConfig.postDeploy.length === 0) {
    return Promise.resolve()
  }

  return Promise.each(migrationConfig.postDeploy, (step) => {
    const scriptFile = path.join(migrationConfig.paths.postDeploy, `${step}.sql`)
    const sqlScript = loadAndBuildMigrationScript(scriptFile, replacements)
    const batches = splitBatches(sqlScript)
    return Promise.each(batches, (batchText) => db.runRawQuery(batchText))
      .catch((error) => onMigrationScriptError(error, step))
  })
}
