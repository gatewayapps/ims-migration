IF EXISTS (
  SELECT 1 FROM sys.views v WHERE v.name = '{{ObjectName}}'
)
BEGIN
  DROP VIEW [dbo].[{{ObjectName}}]
END
GO

CREATE VIEW [dbo].[{{ObjectName}}]
AS
SELECT
  *
FROM
  [dbo].[SomeTableOrView];
GO
