import path from 'path'
import fs from 'fs-extra'
import yaml from 'js-yaml'
import logger from '../helpers/logging'

export const command = 'init [dir]'

export const desc = 'Initialize directory for database migrations'

export const builder = {
  dir: {
    default: '.'
  }
}

export function handler (argv) {
  const root = path.resolve()
  const dirPath = path.resolve(argv.dir)

  const migrationConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../assets/migration.yaml')))

  const functionsDir = path.join(dirPath, 'functions')
  const postDeployDir = path.join(dirPath, 'postDeploy')
  const preDeployDir = path.join(dirPath, 'preDeploy')
  const proceduresDir = path.join(dirPath, 'procedures')
  const migrationsDir = path.join(dirPath, 'migrations')
  const viewsDir = path.join(dirPath, 'views')

  fs.ensureDirSync(functionsDir)
  logger.log('created functions directory')
  fs.ensureDirSync(postDeployDir)
  logger.log('created postDeploy directory')
  fs.ensureDirSync(preDeployDir)
  logger.log('created preDeploy directory')
  fs.ensureDirSync(proceduresDir)
  logger.log('created procedures directory')
  fs.ensureDirSync(migrationsDir)
  logger.log('created migrations directory')
  fs.ensureDirSync(viewsDir)
  logger.log('created views directory')

  migrationConfig.paths = {
    functions: path.relative(root, functionsDir),
    postDeploy: path.relative(root, postDeployDir),
    preDeploy: path.relative(root, preDeployDir),
    procedures: path.relative(root, proceduresDir),
    migrations: path.relative(root, migrationsDir),
    views: path.relative(root, viewsDir)
  }

  fs.writeFileSync(path.join(root, 'migration.yaml'), yaml.safeDump(migrationConfig))
  logger.log('created migrations.yaml configuration file')
}
