import path from 'path'
import fs from 'fs-extra'
import yaml from 'js-yaml'

export function loadConfig () {
  const configFile = path.resolve('migration.yaml')
  return yaml.safeLoad(fs.readFileSync(configFile))
}

export function getTypePath (pathType) {
  const config = loadConfig()
  return config.paths[pathType]
}

export function addPreDeployScript (scriptName) {
  const config = loadConfig()
  if (!Array.isArray(config.preDeploy)) {
    config.preDeploy = [ scriptName ]
  } else {
    config.preDeploy.push(scriptName)
  }
  writeConfig(config)
}

export function addPostDeployScript (scriptName) {
  const config = loadConfig()
  if (!Array.isArray(config.postDeploy)) {
    config.postDeploy = [ scriptName ]
  } else {
    config.postDeploy.push(scriptName)
  }
  writeConfig(config)
}

export function addMigration (scriptName) {
  const config = loadConfig()
  if (!Array.isArray(config.migrations)) {
    config.migrations = [ scriptName ]
  } else {
    config.migrations.push(scriptName)
  }
  writeConfig(config)
}

function writeConfig (config) {
  const configFile = path.resolve('migration.yaml')
  fs.writeFileSync(configFile, yaml.safeDump(config))
}
