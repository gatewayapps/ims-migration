import path from 'path'
import fs from 'fs-extra'
import yaml from 'js-yaml'

export function loadConfig(configPath) {
  configPath = configPath || 'migration.yaml'
  const configFile = path.resolve(configPath)
  return resolvePaths(yaml.safeLoad(fs.readFileSync(configFile)), configFile)
}

export function getTypePath(pathType) {
  const config = loadConfig()
  return config.paths[pathType]
}

export function addPreDeployScript(scriptName) {
  const config = loadConfig()
  if (!Array.isArray(config.preDeploy)) {
    config.preDeploy = [scriptName]
  } else {
    config.preDeploy.push(scriptName)
  }
  writeConfig(config)
}

export function addPostDeployScript(scriptName) {
  const config = loadConfig()
  if (!Array.isArray(config.postDeploy)) {
    config.postDeploy = [scriptName]
  } else {
    config.postDeploy.push(scriptName)
  }
  writeConfig(config)
}

export function addMigration(scriptName) {
  const config = loadConfig()
  if (!Array.isArray(config.migrations)) {
    config.migrations = [scriptName]
  } else {
    config.migrations.push(scriptName)
  }
  writeConfig(config)
}

function writeConfig(config) {
  const configFile = path.resolve('migration.yaml')
  fs.writeFileSync(configFile, yaml.safeDump(unresolvePaths(config, configFile)))
}

function resolvePaths(migrationConfig, migrationFilePath) {
  const rootDir = path.dirname(path.resolve(migrationFilePath))
  const pathKeys = Object.keys(migrationConfig.paths)
  for (var i = 0; i < pathKeys.length; i++) {
    const p = pathKeys[i]
    migrationConfig.paths[p] = path.join(rootDir, migrationConfig.paths[p])
  }
  return migrationConfig
}

function unresolvePaths(migrationConfig, migrationFilePath) {
  const newConfig =  Object.assign({}, migrationConfig)
 
  const rootDir = path.dirname(path.resolve(migrationFilePath))
  const pathKeys = Object.keys(migrationConfig.paths)
  for (var i = 0; i < pathKeys.length; i++) {
    const p = pathKeys[i]
    newConfig.paths[p] = path.relative(rootDir, migrationConfig.paths[p])
  }
  return newConfig
}
