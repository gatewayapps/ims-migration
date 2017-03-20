import { loadConfig } from '../helpers/config'
import DbContext from './dbContext'
import { createDatabaseIfNotExists } from './master'

export function publish (config) {
  console.log('Publishing with configuration: ', JSON.stringify(config, null, 2))

  const migrationConfig = loadConfig(config.migrationFile)

  console.log('Migration Config: ', JSON.stringify(migrationConfig, null, 2))
  return createDatabaseIfNotExists(config.database)
    .then(() => createDatabaseContext(config.database))
    .then((db) => {
      return db.context.transaction((trx) => {
        return db.context.sync()
          .then(() => console.log('database synced'))
      })
    })
}

function createDatabaseContext (databaseConfig) {
  return new DbContext(databaseConfig)
}

function createPackageLoginIfNotExists (db, databaseName, loginUsername, loginPassword) {
  
}