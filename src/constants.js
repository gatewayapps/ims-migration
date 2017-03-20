export const TypePaths = {
  Function: 'functions',
  Migration: 'migrations',
  PreDeploy: 'preDeploy',
  PostDeploy: 'postDeploy',
  Procedure: 'procedures',
  View: 'views'
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

export const Replacements = {
  ObjectName: /{{ObjectName}}/g,
  ScriptName: /{{ScriptName}}/g
}
