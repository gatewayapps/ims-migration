IF EXISTS (
  SELECT 1 FROM sys.views v
  WHERE v.name = '{{ObjectName}}' AND v.schema_id = SCHEMA_ID('{{SchemaName}}')
)
BEGIN
  DROP VIEW [{{SchemaName}}].[{{ObjectName}}]
END
GO

CREATE VIEW [{{SchemaName}}].[{{ObjectName}}]
AS
SELECT
  *
FROM
  [dbo].[SomeTableOrView];
GO
