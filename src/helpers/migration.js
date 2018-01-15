import crypto from 'crypto'
import folderHash from 'folder-hash'
import MigrationError from '../errors/MigrationError'

const HASH_ALGO = 'sha256'
const HASH_ENCODING = 'base64'

export function onMigrationScriptError (error, scriptName) {
  throw new MigrationError(error.message, scriptName, error)
}

export function createMigrationHash (migrationConfig) {
  const promises = Object.keys(migrationConfig.paths).map((key) => {
    return folderHash.hashElement(migrationConfig.paths[key], { algo: HASH_ALGO, encoding: HASH_ENCODING })
  })
  return Promise.all(promises).then((hashes) => {
    const hash = crypto.createHash(HASH_ALGO)
    hashes.forEach((child) => {
      if (child.hash) {
        hash.write(child.hash)
      }
    })
    return hash.digest(HASH_ENCODING)
  })
}
