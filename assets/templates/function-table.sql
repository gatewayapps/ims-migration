IF EXISTS (
  SELECT 1 FROM sys.objects o
  WHERE o.name = '{{ObjectName}}' AND o.schema_id = SCHEMA_ID('{{SchemaName}}')
  AND o.type IN ('FN', 'IF', 'TF', 'FT')
)
BEGIN
  DROP FUNCTION [{{SchemaName}}].[{{ObjectName}}]
END
GO

CREATE FUNCTION [{{SchemaName}}].[{{ObjectName}}]
(
  @i_param1 INT
)
RETURNS TABLE
AS
RETURN (
  SELECT
    *
  FROM
    [dbo].[SomeTableOrView]
);
GO
