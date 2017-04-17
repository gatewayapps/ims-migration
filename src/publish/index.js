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

export function publish (options) {
  const migrationConfig = loadConfig(options.migrationFile)
  const replacements = buildReplacements(options)

  logger.status('Starting database migration')
  return createDatabaseIfNotExists(options.database, replacements)
    .then(() => createDatabaseContext(options.database))
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

function buildReplacements (options) {
  const replacements = {
    DatabaseName: options.database.databaseName,
    PackageLoginUsername: options.packageLogin.username,
    PackageLoginPassword: options.packageLogin.password,
    PublisherUsername: options.database.username,
    PublisherPassword: options.database.password
  }

  if (typeof options.replacements === 'object') {
    Object.assign(replacements, options.replacements)
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
  }).then((migrationLog) => {
    logger.success('Database migration complete')
    return migrationLog
  })
}

function onMigrationFailure (db, error) {
  logger.error(error.message)
  return db.MigrationsLog.create({
    status: MigrationStatus.Failed,
    message: error.message,
    migration: error.scriptName,
    details: JSON.stringify(error)
  })
}
