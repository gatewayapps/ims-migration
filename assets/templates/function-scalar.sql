IF EXISTS (
  SELECT 1 FROM sys.objects o WHERE o.name = '{{ObjectName}}' AND o.type IN ('FN', 'IF')
)
BEGIN
  DROP FUNCTION [dbo].[{{ObjectName}}]
END
GO

CREATE FUNCTION [dbo].[{{ObjectName}}]
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
