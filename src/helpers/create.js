import fs from 'fs-extra'
import path from 'path'
import {
  getTypePath,
  addPreDeployScript,
  addPostDeployScript,
  addMigration
} from './config'
import { Templates, TemplateReplacements, TypePaths } from '../constants'

export function createScalarFunction (name) {
  let template = loadTemplate(Templates.ScalarFunction)
  template = template.replace(TemplateReplacements.ObjectName, name)
  writeFile(`${name}.sql`, TypePaths.Function, template)
}

export function createTableFunction (name) {
  let template = loadTemplate(Templates.TableFunction)
  template = template.replace(TemplateReplacements.ObjectName, name)
  writeFile(`${name}.sql`, TypePaths.Function, template)
}

export function createProcedure (name) {
  let template = loadTemplate(Templates.Procedure)
  template = template.replace(TemplateReplacements.ObjectName, name)
  writeFile(`${name}.sql`, TypePaths.Procedure, template)
}

export function createView (name) {
  let template = loadTemplate(Templates.View)
  template = template.replace(TemplateReplacements.ObjectName, name)
  writeFile(`${name}.sql`, TypePaths.View, template)
}

export function createPreDeploy (name) {
  let template = loadTemplate(Templates.PreDeploy)
  template = template.replace(TemplateReplacements.ScriptName, name)
  writeFile(`${name}.sql`, TypePaths.PreDeploy, template)
  addPreDeployScript(name)
}

export function createPostDeploy (name) {
  let template = loadTemplate(Templates.PostDeploy)
  template = template.replace(TemplateReplacements.ScriptName, name)
  writeFile(`${name}.sql`, TypePaths.PostDeploy, template)
  addPostDeployScript(name)
}

export function createMigration (name) {
  const scriptName = getScriptName(name)
  let template = loadTemplate(Templates.Migration)
  template = template.replace(TemplateReplacements.ScriptName, scriptName)
  writeFile(`${scriptName}.sql`, TypePaths.Migration, template)
  addMigration(scriptName)
}

function getScriptName (name) {
  return `${Date.now()}-${name}`
}

function loadTemplate (templateName) {
  return fs.readFileSync(path.resolve(__dirname, `../../assets/templates/${templateName}`), {
    encoding: 'utf8'
  })
}

function writeFile (fileName, type, content) {
  const dirPath = getTypePath(type)
  fs.ensureDirSync(dirPath)
  const writePath = path.join(dirPath, fileName)

  if (fs.existsSync(writePath)) {
    throw new Error('File already exists')
  }

  fs.writeFileSync(writePath, content)
  console.log(`Created file: ${writePath}`)
}
