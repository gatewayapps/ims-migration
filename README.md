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

## Replacements
Script files processed prior to being applied to the database. In your scripts you can include a token name inside double curly braces (ex: ```{{DatabaseName}}```). Any instances of this pattern in your script are replaced with the value at runtime. By default, a few replacement tokens are available and custom replacements can be provided when running publish.

### Default Replacement Tokens
| Token Name           | Description                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| DatabaseName         | Database name passed in -d or --database                                                                                |
| PackageLoginUsername | Login name for the package user passed in -l or --packageLogin (May be an empty string if not provided during publish)  |
| PackageLoginPassword | Password for the package user passed in -x or --packagePassword (May be an empty string if not provided during publish) |
| PublisherUsername    | Login name passed in -u or --user                                                                                       |
| PublisherPassword    | Password passed in -p or --password                                                                                     |

For passing custom tokens see [Publish CLI](#publish-cli) and [Publishing from node](#publishing-from-node).

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

By default, functions are created in the `dbo` schema. To specify a different schema prefix the function name with `{schemaName}.`.

```bash
# Scalar Function
ims-migration create function my-scalar-function

# Table Valued Function
ims-migration create function my-table-function -t table

# Function in a "mySchema" instead of "dbo" schema
ims-migration create function mySchema.my-scalar-function
```

This will create a files named ```my-scalar-function.sql``` and ```my-table-function``` in [directory]/functions.

The function scripts are re-run every time the migration is published. The scripts should be written in a way that supports dropping and recreating the function if it exists. The provided templates provide this setup for you.

### Procedures
Procedures are used to create SQL stored procedures. The procedures will be run each time the migration is published.

```bash
ims-migration create procedure my-procedure-name
```

This will create a file named ```my-procedure-name.sql``` in [directory]/procedures. The file will use the [procedure template](https://github.com/gatewayapps/ims-migration/tree/master/assets/templates/procedure.sql)

By default, procedures are created in the `dbo` schema. To specify a different schema prefix the procedure name with `{schemaName}.`.

```bash
ims-migration create procedure mySchema.my-procedure-name
```

The procedure scripts are re-run every time the migration is published. The scripts should be written in a way that supports dropping and recreating the procedure if it exists. The provided templates provide this setup for you.

### Views
Views are used to create SQL Views. The views will be run each time the migration is published.

```bash
ims-migration create view my-view
```

This will create a file named ```my-view.sql``` in [directory]/views. The file will use the [view template](https://github.com/gatewayapps/ims-migration/tree/master/assets/templates/view.sql)

By default, views are created in the `dbo` schema. To specify a different schema prefix the view name with `{schemaName}.`.

```bash
ims-migration create view mySchema.my-view
```

The view scripts are re-run every time the migration is published. The scripts should be written in a way that supports dropping and recreating the view if it exists. The provided templates provide this setup for you.

### Pre-Deploy
Pre-Deploy scripts are run before migrations each time the migration is published.

```bash
ims-migration create pre-deploy my-pre-deploy
```

This will create a file named ```my-pre-deploy.sql``` in [directory]/preDeploy and add ```my-pre-deploy``` to the end of the preDeploy array in the ```migrations.yaml``` file. 

The pre-deploy scripts are re-run every time the migration is published. The scripts should be written in a way that it supports begin run multiple times without creating errors.

### Post-Deploy
Post-Deploy scripts are run after migrations, functions, views and procedures each time the migration is published.

```bash
ims-migration create post-deploy my-post-deploy
```

This will create a file named ```my-post-deploy.sql``` in [directory]/postDeploy and add ```my-post-deploy``` to the end of the postDeploy array in the ```migrations.yaml``` file. 

The pre-deploy scripts are re-run every time the migration is published. The scripts should be written in a way that it supports begin run multiple times without creating errors.

## Publish CLI
The publish command applies the migrations to a database creating a new database if the database does not exist

```
ims-migration publish <options>

Options:

  -c, --config             Configuration file to use (default ./migration.yaml)
  -s, --server             SQL Server address (default 'localhost')
  -i, --instance           SQL Server instance name (default 'MSSQLSERVER')
  -d, --database           (required) Name of the database
  -u, --user               (required) Admin user for connecting to the SQL Server
  -p, --password           (required) Admin user password
  -l, --packageLogin       IMS package login user, will be created if it doesn't exist
  -x, --packagePassword    IMS package login password, only used when creating the package login (requires that packageLogin also be set)
  -v, --verbose            Prints SQL commands being executed to the console
  -r, --replacements       Custom replacements to be merged with the default replacements. Should be in the format `key=value`
                           May be specified multiple times to pass an array of custom replacements

Simple Example:

  ims-migration publish -c migration.yaml -s 127.0.0.1 -d my-test-database -u sa -p SecurePassword -l my-package-user -x SecurePassword

Example with replacements:

  ims-migration publish -d my-test-database -u sa -p SecurePassword -l my-package-user -x SecurePassword -r SpecialName=Awesome -r AnotherValue=100
```

### Publish Overview
The publish process perform the following steps agains the database

1. Creates the database if it does not exist on the server
2. Ensures the ```__Migrations``` and ```__MigrationsLog``` tables are in the target database
3. Creates the package login user account if it does not exist otherwise, updates the password for the package login if the password is not blank
4. Runs the ```config.preDeploy``` scripts on the database
5. Runs the ```config.migrations``` on the database. Migrations that run successfully create a record in the ```__Migrations``` table
6. Runs all the ```.sql``` files located in ```config.paths.functions```, ```config.paths.procedures```, and ```config.paths.views``` on the database
7. Runs the ```config.postDeploy``` scripts on the database
8. Logs migrations status to the ```__MigrationsLog``` table

#### Publish Dependencies
When running the functions, procedures, and views scripts during the publish, it attempts to resolve dependencies between the scripts and order them to run so dependent objects are created first. To make this possible, it relies on conventions in the scripts. Each script in the ```functions```, ```procedures``` or ```views``` folder should contain one of the following (case insensitive):

```
CREATE PROCEDURE <ObjectName>

CREATE FUNCTION <ObjectName>

CREATE VIEW <ObjectName>

where <ObjectName> is one of the following
  objectName
  schema.objectName
  [objectName]
  [schema].[objectName]
```

These patterns are used to determine the object names that are being created. These object names are then check in other scripts to determine the dependencies between the objects being created. The name checking is case insensitive and while not required, it is preferred that all object names be wrapped in square brackets [].

#### Publish Failures
Steps 3 thru 7, are performed inside a SQL transaction. Should one of the steps encouter an error, the transaction is rolled back reverting the database to the previous state. Details on the cause of the publish error are written to the ```__MigrationsLog``` table including the script that errored and full javascript error as a JSON string.

## Publishing from node
Alternatively, you can import or require ims-migration in node and run the publish by providing a configuration object.

```javascript
import imsMigration from 'ims-migration'

const options = {
  migrationFile: './migrationFile.js',
  database: {
    server: 'localhost',
    instanceName: 'MSSQLSERVER',
    databaseName: 'MyDatabase',
    username: 'admin',
    password: 'MySuperSecurePassword',
    logging: false
  },
  packageLogin: {
    username: 'package_user',
    password: 'MySuperSecurePackagePassword'
  },
  replacements: {
    MySpecialValue: 'This is cool'
  }
}

imsMigration.publish(options)
  .then((result) => {
    console.log(`Finished with status: ${result.status}`)
  })
```

| Param                 | Type      | Description                                                                                                                       |
| --------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| migrationFile         | string    | Path and name of migration.yaml file                                                                                              |
| database.server       | string    | SQL Server address                                                                                                                |
| database.instanceName | string    | SQL Server instance name                                                                                                          |
| database.databaseName | string    | Name of the database                                                                                                              |
| database.username     | string    | Database admin user for connecting to the SQL Server                                                                              |
| database.password     | string    | Database admin user password                                                                                                      |
| database.logging      | boolean   | If true, print SQL statements to console                                                                                          |
| packageLogin.username | string    | IMS package login user, will be created if it doesn't exist                                                                       |
| packageLogin.password | string    | IMS package login password, only used when creating the package login                                                             |
| replacements          | object    | Key-value pairs merged with default replacements and used in scripts. Value should be a string. See [Replacements](#replacements) |
