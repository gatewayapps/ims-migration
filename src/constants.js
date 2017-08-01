export const MigrationStatus = {
  Success: 0,
  Failed: 1
}

export const Scripts = {
  CreateDatabase: 'createDatabase.sql',
  CreatePackageDatabaseUser: 'createPackageDatabaseUser.sql',
  CreatePackageLogin: 'createPackageLogin.sql'
}

export const TemplateReplacements = {
  ObjectName: /{{ObjectName}}/g,
  SchemaName: /{{SchemaName}}/g,
  ScriptName: /{{ScriptName}}/g
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
