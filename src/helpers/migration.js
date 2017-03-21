import MigrationError from '../errors/MigrationError'

export function onMigrationScriptError (error, scriptName) {
  throw new MigrationError(error.message, scriptName, error)
}
