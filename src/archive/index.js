import archiver from 'archiver'
import fs from 'fs'
import yaml from 'js-yaml'
import { loadConfig } from '../helpers/config'
import logger from '../helpers/logging'

export function archive (options) {
  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  const migrationConfig = loadConfig(options.migrationFile)
  // Create the output file stream, overwrites any existing file
  logger.log(`Creating output file: ${options.outputFile}`)
  const output = fs.createWriteStream(options.outputFile, { flags: 'w' })
  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })

// good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err
    }
  })
  archive.on('error', (err) => {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err
    }
  })
  archive.pipe(output)

  let newMigration = {}
  Object.assign(newMigration, migrationConfig)

  const keys = Object.keys(newMigration.paths)
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i]
    const parts = newMigration.paths[key].split(/[/\\]+/)
    newMigration.paths[key] = parts[parts.length - 1]
  }
  archive.append(yaml.safeDump(newMigration), { name: 'migration.yaml' })
  archive.directory('src/data/', false)
  logger.log('Archive complete.  Finalizing')
  archive.finalize()
}
