IF NOT EXISTS (
	SELECT 1 FROM sys.database_principals WHERE name = N'{{PackageLoginUsername}}'
)
BEGIN

	PRINT 'Creating database user {{PackageLoginUsername}}...';

	CREATE USER [{{PackageLoginUsername}}] FOR LOGIN [{{PackageLoginUsername}}];

	ALTER ROLE [db_owner] ADD MEMBER [{{PackageLoginUsername}}];

END