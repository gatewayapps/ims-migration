import Promise from 'bluebird'
import path from 'path'
import { onMigrationScriptError } from '../helpers/migration'
import {
  loadAndBuildMigrationScriptSync,
  splitBatches
} from '../helpers/script'

export function runMigrations (db, migrationConfig, replacements) {
  if (!Array.isArray(migrationConfig.migrations) || migrationConfig.migrations.length === 0) {
    return Promise.resolve()
  }

  return getMigrationsToRun(db, migrationConfig.migrations)
    .then((migrationsToRun) => {
      if (migrationsToRun.length === 0) {
        console.log('No new migrations to apply')
        return Promise.resolve()
      } else {
        const migrationRunner = createMigrationRunner(db, migrationConfig.paths.migrations, replacements)
        console.log('Applying migrations')
        return Promise.each(migrationsToRun, migrationRunner)
      }
    })
}

function getMigrationsToRun (db, migrations) {
  console.log('Identifying migrations to run')
  return db.Migration.findAll({ raw: true })
    .then((existingMigrations) => {
      return migrations.filter((m) => {
        return !existingMigrations.some((em) => em.migration === m)
      })
    })
}

function createMigrationRunner (db, migrationsPath, replacements) {
  return (migration) => {
    const scriptFile = path.join(migrationsPath, `${migration}.sql`)
    const sqlScript = loadAndBuildMigrationScriptSync(scriptFile, replacements)
    const batches = splitBatches(sqlScript)
    console.log(`Running migration ${migration}`)
    return Promise.each(batches, (batchText) => db.runRawQuery(batchText))
      .then(() => {
        return db.Migration.create({
          migration: migration
        })
      })
      .catch((error) => onMigrationScriptError(error, scriptFile))
  }
}
