export const Replacements = {
  DatabaseName: /{{DatabaseName}}/g,
  ObjectName: /{{ObjectName}}/g,
  ScriptName: /{{ScriptName}}/g
}

export const Scripts = {
  CreateDatabase: 'createDatabase.sql'
}

export const Templates = {
  ScalarFunction: 'function-scalar.sql',
  TableFunction: 'function-table.sql',
  Migration: 'migration.sql',
  PostDeploy: 'postDeploy.sql',
  PreDeploy: 'preDeploy.sql',
  Procedure: 'procedure.sql',
  View: 'view.sql'
}

export const TypePaths = {
  Function: 'functions',
  Migration: 'migrations',
  PreDeploy: 'preDeploy',
  PostDeploy: 'postDeploy',
  Procedure: 'procedures',
  View: 'views'
}
