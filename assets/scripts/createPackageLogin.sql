IF NOT EXISTS (
	SELECT 1 FROM sys.server_principals WHERE name = N'{{PackageLoginUsername}}'
)
BEGIN

	PRINT 'Creating login {{PackageLoginUsername}}...';

	CREATE LOGIN [{{PackageLoginUsername}}] WITH PASSWORD = N'{{PackageLoginPassword}}', DEFAULT_DATABASE = [{{DatabaseName}}], DEFAULT_LANGUAGE = [us_english], CHECK_POLICY = OFF;

END