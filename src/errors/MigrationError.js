export default class MigrationError extends Error {
  constructor (message, script, innerEx) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'MigrationError'
    this.message = message
    this.migrationScript = script
    this.rootError = innerEx
  }
}
