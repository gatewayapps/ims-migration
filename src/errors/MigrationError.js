export default class MigrationError extends Error {
  constructor (message, script, innerEx) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'MigrationError'
    this.message = message
    this.scriptName = script
    this.rootError = innerEx
  }
}
