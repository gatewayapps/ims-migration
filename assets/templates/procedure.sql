IF EXISTS (
  SELECT 1 FROM sys.procedures p
  WHERE p.name = '{{ObjectName}}' AND p.schema_id = SCHEMA_ID('{{SchemaName}}')
)
BEGIN
  DROP PROCEDURE [{{SchemaName}}].[{{ObjectName}}]
END
GO

CREATE PROCEDURE [{{SchemaName}}].[{{ObjectName}}]
(
  @i_param1 INT
)
AS
BEGIN

  SET NOCOUNT ON;

END
GO
