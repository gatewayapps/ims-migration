import { loadConfig } from '../helpers/config'
import DbContext from './dbContext'
import {
  createDatabaseIfNotExists,
  createPackageLoginIfNotExists,
  createPackageDatabaseUserIfNotExists,
  runPreDeploymentScripts
} from './preDeployment'
import { runMigrations } from './migration'
import {
  runFunctions,
  runProcedures,
  runViews
} from './databaseObjects'
import { runPostDeploymentScripts } from './postDeployment'
import { MigrationStatus } from '../constants'

export function publish (config) {
  const migrationConfig = loadConfig(config.migrationFile)
  const replacements = buildReplacements(config)

  console.log('Starting database migration')
  return createDatabaseIfNotExists(config.database, replacements)
    .then(() => createDatabaseContext(config.database))
    .then((db) => { return db.context.sync().then(() => db) })
    .then((db) => {
      return db.context.transaction((trx) => {
        return createPackageLoginIfNotExists(db, replacements)
          .then(() => createPackageDatabaseUserIfNotExists(db, replacements))
          .then(() => runPreDeploymentScripts(db, migrationConfig, replacements))
          .then(() => runMigrations(db, migrationConfig, replacements))
          .then(() => runFunctions(db, migrationConfig, replacements))
          .then(() => runViews(db, migrationConfig, replacements))
          .then(() => runProcedures(db, migrationConfig, replacements))
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
  })
}

function onMigrationFailure (db, error) {
  console.error(error)
  return db.MigrationsLog.create({
    status: MigrationStatus.Failed,
    message: error.message,
    migration: error.scriptName,
    details: JSON.stringify(error)
  })
}
