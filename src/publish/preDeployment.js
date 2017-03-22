import Promise from 'bluebird'
import path from 'path'
import { QueryTypes } from 'sequelize'
import Database from '../helpers/database'
import { onMigrationScriptError } from '../helpers/migration'
import {
  loadAndBuildMigrationScriptSync,
  loadAndBuildScriptAssetSync,
  splitBatches
} from '../helpers/script'
import {
  Scripts
} from '../constants'

export function createDatabaseIfNotExists (databaseConfig, replacements) {
  const master = new Database(databaseConfig, 'master')
  const script = loadAndBuildScriptAssetSync(Scripts.CreateDatabase, replacements)
  return master.query(script, QueryTypes.RAW)
    .catch((error) => onMigrationScriptError(error, Scripts.CreateDatabase))
}

export function createPackageLoginIfNotExists (db, replacements) {
  const sqlScript = loadAndBuildScriptAssetSync(Scripts.CreatePackageLogin, replacements)
  return db.runRawQuery(sqlScript)
    .catch((error) => onMigrationScriptError(error, Scripts.CreatePackageLogin))
}

export function createPackageDatabaseUserIfNotExists (db, replacements) {
  const sqlScript = loadAndBuildScriptAssetSync(Scripts.CreatePackageDatabaseUser, replacements)
  return db.runRawQuery(sqlScript)
    .catch((error) => onMigrationScriptError(error, Scripts.CreatePackageDatabaseUser))
}

export function runPreDeploymentScripts (db, migrationConfig, replacements) {
  if (!Array.isArray(migrationConfig.preDeploy) || migrationConfig.preDeploy.length === 0) {
    return Promise.resolve()
  }
  console.log('Starting pre-deployment')
  return Promise.each(migrationConfig.preDeploy, (step) => {
    const scriptFile = path.join(migrationConfig.paths.preDeploy, `${step}.sql`)
    const sqlScript = loadAndBuildMigrationScriptSync(scriptFile, replacements)
    const batches = splitBatches(sqlScript)
    console.log(`Running pre-deployment script ${step}`)
    return Promise.each(batches, (batchText) => db.runRawQuery(batchText))
      .catch((error) => onMigrationScriptError(error, step))
  })
}
