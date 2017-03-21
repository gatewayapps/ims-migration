import Promise from 'bluebird'
import path from 'path'
import { onMigrationScriptError } from '../helpers/migration'
import {
  loadAndBuildMigrationScript,
  splitBatches
} from '../helpers/script'

export function runMigrations (db, migrationConfig, replacements) {
  if (!Array.isArray(migrationConfig.migrations) || migrationConfig.migrations.length === 0) {
    return Promise.resolve()
  }

  return getMigrationsToRun(db, migrationConfig.migrations)
    .then((migrationsToRun) => {
      if (migrationsToRun.length === 0) {
        return Promise.resolve()
      } else {
        const migrationRunner = createMigrationRunner(db, migrationConfig.paths.migrations, replacements)
        return Promise.each(migrationsToRun, migrationRunner)
      }
    })
}

function getMigrationsToRun (db, migrations) {
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
    const sqlScript = loadAndBuildMigrationScript(scriptFile, replacements)
    const batches = splitBatches(sqlScript)
    return Promise.each(batches, (batchText) => db.runRawQuery(batchText))
      .then(() => {
        return db.Migration.create({
          migration: migration
        })
      })
      .catch((error) => onMigrationScriptError(error, scriptFile))
  }
}
