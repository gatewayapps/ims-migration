import Promise from 'bluebird'
import path from 'path'
import { onMigrationScriptError } from '../helpers/migration'
import {
  loadAndBuildMigrationScriptSync,
  splitBatches
} from '../helpers/script'
import logger from '../helpers/logging'

export function runPostDeploymentScripts (db, migrationConfig, replacements) {
  if (!Array.isArray(migrationConfig.postDeploy) || migrationConfig.postDeploy.length === 0) {
    return Promise.resolve()
  }

  logger.status('Starting post-deployment')
  return Promise.each(migrationConfig.postDeploy, (step) => {
    const scriptFile = path.join(migrationConfig.paths.postDeploy, `${step}.sql`)
    const sqlScript = loadAndBuildMigrationScriptSync(scriptFile, replacements)
    const batches = splitBatches(sqlScript)
    logger.status(`Running post-deployment script ${step}`)
    return Promise.each(batches, (batchText) => db.runRawQuery(batchText))
      .catch((error) => onMigrationScriptError(error, step))
  })
}
