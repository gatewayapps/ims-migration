IF DB_ID(N'{{DatabaseName}}') IS NULL
BEGIN

  CREATE DATABASE [{{DatabaseName}}];
  ALTER DATABASE [{{DatabaseName}}] SET RECOVERY SIMPLE;

END
