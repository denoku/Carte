USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Menus_SelectByOrgIdV3]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Author: <Brian Wheeler>
-- Create date: 12/1/22
-- Description: menus are no longer rendered to the page and do not need
-- pagination anymore
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:


CREATE PROC [dbo].[Menus_SelectByOrgIdV3]
					@OrgId int

as

/*
	EXECUTE dbo.Menus_SelectByOrgIdV3
				@OrgId = 1

	SELECT * 
	FROM dbo.Menus

*/

BEGIN

SELECT 
	   [Name]
	  ,Id as MenuId

  FROM [dbo].[Menus]
  WHERE OrganizationId = @OrgId


END
GO
