# IMS Migration
Database migration tooling for SQL Server databases

## Installation
For normal usage, install the package globally.

```
npm install -g ims-migration
```

To use as part of a scripted deployment process you may install locally.

## Project Initailization
From the root of your project run the init command. The optional directory argument will set the base location of the folders used to store the migration script files. If not specified, the current working directory is used as the base location.

```bash
ims-migration init [directory]
```

This will create the following directories and files.

```
├── [directory]/functions/
├── [directory]/migrations/
├── [directory]/postDeploy/
├── [directory]/preDeploy/
├── [directory]/procedures/
├── [directory]/views/
└── migration.yaml
```

## Creating Scripts
To add a new script, use one of the ```ims-migration create <scriptType>``` to add script and register it with the ims-migration configuration file.

### Migrations
Migrations are used to create, alter or drop tables, contraints and indexes to the database.

```bash
ims-migration create migration my-migration-name
```

This will create a file named ```{timestamp}-my-migration-name.sql``` in [directory]/migrations and add ```{timestamp}-my-migration-name``` to the end of the migrations array in the ```migrations.yaml``` file. 

Each migration script is only run against a database one time. Therefore, migration scripts should not be changed once they have been published in a version. Subsequent changes to the database structure, should be made through a new migration script. This is different from the other script types functions, procedures, views, pre-deploy and post-deploy which are run every time the database migration is published.

### Functions
Functions are used to create either scalar or table valued user defined functions. The functions will be run each time the migration is published. By default it uses the [scalar function template](https://github.com/gatewayapps/ims-migration/tree/master/assets/templates/function-scalar.sql) for the generated file, but you can add ```-t table``` to use the [table function template](https://github.com/gatewayapps/ims-migration/tree/master/assets/templates/function-table.sql).

```bash
# Scalar Function
ims-migration create function my-scalar-function

# Table Valued Function
ims-migration create function my-table-function -t table
```

This will create a files named ```my-scalar-function.sql``` and ```my-table-function``` in [directory]/functions.

The function scripts are re-run every time the migration is published. The scripts should be written in a way that supports dropping and recreating the function if it exists. The provided templates provide this setup for you.

### Procedures
Procedures are used to create SQL stored procedures. The procedures will be run each time the migration is published.

```bash
ims-migration create procedure my-procedure-name
```

This will create a file named ```my-procedure-name.sql``` in [directory]/procedures. The file will use the [procedure template](https://github.com/gatewayapps/ims-migration/tree/master/assets/templates/procedure.sql)

The procedure scripts are re-run every time the migration is published. The scripts should be written in a way that supports dropping and recreating the procedure if it exists. The provided templates provide this setup for you.

### Views
Views are used to create SQL Views. The views will be run each time the migration is published.

```bash
ims-migration create view my-view
```

This will create a file named ```my-view.sql``` in [directory]/views. The file will use the [view template](https://github.com/gatewayapps/ims-migration/tree/master/assets/templates/view.sql)

The view scripts are re-run every time the migration is published. The scripts should be written in a way that supports dropping and recreating the view if it exists. The provided templates provide this setup for you.

### Pre-Deploy
Pre-Deploy scripts are run before migrations each time the migration is published.

```bash
ims-migration create pre-deploy my-pre-deploy
```

This will create a file named ```{timestamp}-my-pre-deploy.sql``` in [directory]/preDeploy and add ```{timestamp}-my-pre-deploy``` to the end of the preDeploy array in the ```migrations.yaml``` file. 

The pre-deploy scripts are re-run every time the migration is published. The scripts should be written in a way that it supports begin run multiple times without creating errors.

### Post-Deploy
Post-Deploy scripts are run after migrations, functions, views and procedures each time the migration is published.

```bash
ims-migration create post-deploy my-post-deploy
```

This will create a file named ```{timestamp}-my-post-deploy.sql``` in [directory]/postDeploy and add ```{timestamp}-my-post-deploy``` to the end of the postDeploy array in the ```migrations.yaml``` file. 

The pre-deploy scripts are re-run every time the migration is published. The scripts should be written in a way that it supports begin run multiple times without creating errors.
