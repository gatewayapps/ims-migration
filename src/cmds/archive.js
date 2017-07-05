import { archive } from '../archive'

export const command = 'archive [config]'

export const desc = 'Archives all database scripts and the migrations.yaml file to a zip file'

export const builder = {
  config: {
    alias: [ 'c' ],
    default: 'migration.yaml'
  },
  outputFile: {
    alias: [ 'o' ],
    default: 'dist/migration.zip'
  }
}

export function handler (argv) {
  const options = {
    migrationFile:  argv.config,
    outputFile: argv.outputFile
  }

  archive(options)
}
