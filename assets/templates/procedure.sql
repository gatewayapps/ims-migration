IF EXISTS (
  SELECT 1 FROM sys.procedures p WHERE p.name = '{{ObjectName}}'
)
BEGIN
  DROP PROCEDURE [dbo].[{{ObjectName}}]
END
GO

CREATE PROCEDURE [dbo].[{{ObjectName}}]
(
  @i_param1 INT
)
AS
BEGIN

  SET NOCOUNT ON;

END
GO
