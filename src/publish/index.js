import { loadConfig } from '../helpers/config'
import logger from '../helpers/logging'
import { createMigrationHash } from '../helpers/migration'
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
      return createMigrationHash(migrationConfig)
        .then((migrationHash) => {
          return getLastMigrationSuccess(db)
            .then((lastSuccess) => {
              // Verify if the migration has been successfully run before
              if (options.force === true || !lastSuccess || lastSuccess.migration !== migrationHash) {
                return db.context.transaction((trx) => {
                  return createPackageLoginIfNotExists(db, replacements)
                    .then(() => createPackageDatabaseUserIfNotExists(db, replacements))
                    .then(() => runPreDeploymentScripts(db, migrationConfig, replacements))
                    .then(() => runMigrations(db, migrationConfig, replacements))
                    .then(() => runDatabaseObjects(db, migrationConfig, replacements))
                    .then(() => runPostDeploymentScripts(db, migrationConfig, replacements))
                    .then(() => onMigrationSuccess(db, migrationHash))
                })
                .catch((error) => onMigrationFailure(db, error))
              } else {
                logger.success('No changes made, all migration files have previously been published to the database. Rerun with --force option reapply the publish')
                return lastSuccess
              }
            })
        })
    })
    .catch((error) => {
      logger.error(error)
      throw (error)
    })
}

function buildReplacements (options) {
  const replacements = {
    DatabaseName: options.database.databaseName,
    PackageLoginUsername: options.packageLogin.username || '',
    PackageLoginPassword: options.packageLogin.password || '',
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

function getLastMigrationSuccess (db) {
  return db.MigrationsLog.findOne({
    where: {
      status: MigrationStatus.Success
    },
    order: [ [ 'logId', 'DESC' ] ]
  })
}

function onMigrationSuccess (db, migrationHash) {
  return db.MigrationsLog.create({
    status: MigrationStatus.Success,
    message: 'Migration completed successfully.',
    migration: migrationHash
  }).then((migrationLog) => {
    logger.success('Database migration complete')
    return migrationLog
  })
}

function onMigrationFailure (db, error) {
  return db.MigrationsLog.create({
    status: MigrationStatus.Failed,
    message: error.message,
    migration: error.scriptName,
    details: JSON.stringify(error)
  }).then(() => {
    throw (error)
  })
}
