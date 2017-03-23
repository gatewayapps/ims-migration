import { publish } from '../publish'

export const command = 'publish [config]'

export const desc = 'Runs a database migration against a database server'

export const builder = {
  config: {
    alias: [ 'c' ],
    default: 'migration.yaml'
  },
  server: {
    alias: [ 's' ],
    default: 'localhost'
  },
  instance: {
    alias: [ 'i' ],
    default: 'MSSQLSERVER'
  },
  database: {
    alias: [ 'd' ],
    demandOption: true
  },
  user: {
    alias: [ 'u' ],
    demandOption: true
  },
  password: {
    alias: [ 'p' ],
    demandOption: true
  },
  packageLogin: {
    alias: [ 'l' ],
    demandOption: true
  },
  packagePassword: {
    alias: [ 'x' ],
    demandOption: true
  },
  verbose: {
    alias: [ 'v' ],
    boolean: true
  },
  replacements: {
    alias: [ 'r' ],
    array: true,
    desc: 'Custom replacement tokens should be provide in the format <key>=<value>'
  }
}

export function handler (argv) {
  const publishConfig = {
    migrationFile: argv.config,
    database: {
      server: argv.server,
      instanceName: argv.instance,
      databaseName: argv.database,
      username: argv.user,
      password: argv.password,
      logging: argv.verbose
    },
    packageLogin: {
      username: argv.packageLogin,
      password: argv.packagePassword
    },
    replacements: prepareReplacements(argv.replacements)
  }
  publish(publishConfig)
}

function prepareReplacements (arrReplacements) {
  const replacements = {}

  if (Array.isArray(arrReplacements)) {
    arrReplacements.forEach((replacement) => {
      const idx = replacement.indexOf('=')
      let key, value
      if (idx > 0) {
        key = replacement.substring(0, idx)
        value = replacement.substring(idx + 1)
      } else {
        key = replacement
        value = ''
      }
      replacements[key] = value
    })
  }

  return replacements
}