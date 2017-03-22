import { loadConfig } from '../helpers/config'
import logger from '../helpers/logging'
import DbContext from './dbContext'
import {
  createDatabaseIfNotExists,
  createPackageLoginIfNotExists,
  createPackageDatabaseUserIfNotExists,
  runPreDeploymentScripts
} from './preDeployment'
import { runMigrations } from './migration'
import {
  runDatabaseObjects
} from './databaseObjects'
import { runPostDeploymentScripts } from './postDeployment'
import { MigrationStatus } from '../constants'

export function publish (config) {
  const migrationConfig = loadConfig(config.migrationFile)
  const replacements = buildReplacements(config)

  logger.status('Starting database migration')
  return createDatabaseIfNotExists(config.database, replacements)
    .then(() => createDatabaseContext(config.database))
    .then((db) => { return db.context.sync().then(() => db) })
    .then((db) => {
      return db.context.transaction((trx) => {
        return createPackageLoginIfNotExists(db, replacements)
          .then(() => createPackageDatabaseUserIfNotExists(db, replacements))
          .then(() => runPreDeploymentScripts(db, migrationConfig, replacements))
          .then(() => runMigrations(db, migrationConfig, replacements))
          .then(() => runDatabaseObjects(db, migrationConfig, replacements))
          .then(() => runPostDeploymentScripts(db, migrationConfig, replacements))
          .then(() => onMigrationSuccess(db))
      })
      .catch((error) => onMigrationFailure(db, error))
    })
}

function buildReplacements (config) {
  const replacements = {
    DatabaseName: config.database.databaseName,
    PackageLoginUsername: config.packageLogin.username,
    PackageLoginPassword: config.packageLogin.password
  }

  if (typeof config.replacements === 'object') {
    Object.assign(replacements, config.replacements)
  }

  return replacements
}

function createDatabaseContext (databaseConfig) {
  return new DbContext(databaseConfig)
}

function onMigrationSuccess (db) {
  return db.MigrationsLog.create({
    status: MigrationStatus.Success,
    message: 'Migration completed successfully.'
  }).then(() => {
    logger.success('Database migration complete')
  })
}

function onMigrationFailure (db, error) {
  logger.error(error)
  return db.MigrationsLog.create({
    status: MigrationStatus.Failed,
    message: error.message,
    migration: error.scriptName,
    details: JSON.stringify(error)
  })
}
