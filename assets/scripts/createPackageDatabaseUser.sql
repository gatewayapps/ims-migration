IF N'{{PackageLoginUsername}}' <> N''
BEGIN

	IF NOT EXISTS (
		SELECT 1 FROM sys.database_principals WHERE name = N'{{PackageLoginUsername}}'
	)
	BEGIN

		PRINT 'Creating database user {{PackageLoginUsername}}...';

		EXEC('CREATE USER [{{PackageLoginUsername}}] FOR LOGIN [{{PackageLoginUsername}}];');

		EXEC('ALTER ROLE [db_owner] ADD MEMBER [{{PackageLoginUsername}}];');

	END

END
