IF DB_ID(N'{{DatabaseName}}') IS NULL
BEGIN

  IF N'{{PackageLoginUsername}}' = N'' OR N'{{PackageLoginPassword}}' = N''
  BEGIN

    ;THROW 51000, 'Package login username and password must be provided when creating a new database.', 1;  

  END

  CREATE DATABASE [{{DatabaseName}}];
  ALTER DATABASE [{{DatabaseName}}] SET RECOVERY SIMPLE;

END
