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
RETURNS TABLE
AS
RETURN (
  SELECT
    *
  FROM
    [dbo].[SomeTableOrView]
);
GO
