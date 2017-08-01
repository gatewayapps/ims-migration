IF EXISTS (
  SELECT 1 FROM sys.objects o
  WHERE o.name = '{{ObjectName}}' AND o.schema_id = SCHEMA_ID('{{SchemaName}}')
  AND o.type IN ('FN', 'IF', 'FS')
)
BEGIN
  DROP FUNCTION [{{SchemaName}}].[{{ObjectName}}]
END
GO

CREATE FUNCTION [{{SchemaName}}].[{{ObjectName}}]
(
  @i_param1 INT
)
RETURNS INT
AS
BEGIN

  DECLARE @m_Value INT;

  RETURN @m_Value;

END
GO
