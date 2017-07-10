import archiver from 'archiver'
const upath = require('upath')
import os from 'os'
import fs from 'fs'
import yaml from 'js-yaml'
import { loadConfig } from '../helpers/config'
import logger from '../helpers/logging'

export function archive (options) {
  const archive = archiver('zip')

  const migrationConfig = loadConfig(options.migrationFile)
  // Create the output file stream, overwrites any existing file
  logger.log(`Creating output file: ${options.outputFile}`)
  const output = fs.createWriteStream(options.outputFile, { flags: 'w' })
  output.on('close', function () {
    logger.log(archive.pointer() + ' total bytes')
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
    logger.error(err)
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err
    }
  })
  archive.pipe(output)

  let newMigration = Object.assign({}, migrationConfig)
  const keys = Object.keys(newMigration.paths)
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i]
    const parts = newMigration.paths[key].split(/[/\\]+/)

    // Normalize path names for current platform
    
    const fullDirName = upath.normalize(migrationConfig.paths[key])

    const dirName = parts[parts.length - 1]
    newMigration.paths[key] = dirName

    if (!fs.existsSync(fullDirName)) {
      fs.mkdirSync(fullDirName)
    }
    if (fs.existsSync(fullDirName)) {
      logger.log(`Adding ${fullDirName} as ${dirName}`)
      archive.directory(fullDirName, dirName)
    }
  }
  archive.append(yaml.safeDump(newMigration), { name: 'migration.yaml' })
  logger.log('Archive complete.  Finalizing')
  archive.finalize()
}
