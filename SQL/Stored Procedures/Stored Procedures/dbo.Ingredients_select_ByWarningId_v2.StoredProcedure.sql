USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_select_ByWarningId_v2]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Franky Ramos>
-- Create date: <9/13/22>
-- Description: <A Proc to select from dbo.Ingredients by Id joined with FoodWarningTypes>
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[Ingredients_select_ByWarningId_v2]
				@FoodwarningTypeId int 
/*

Declare @FoodwarningTypeId int = 13;
EXECUTE dbo.Ingredients_select_ByWarningId_v2 @FoodwarningTypeId


*/


as

BEGIN


SELECT i.[Id]
      ,i.[OrganizationId]
      ,i.[Name]
      ,i.[UnitCost]
      ,i.[Description]
      ,i.[ImageUrl]
      ,i.[IsInStock]
      ,i.[IsDeleted]
      ,i.[RestrictionId]
      ,i.[Measure]
      ,i.[CreatedBy]
      ,i.[ModifiedBy]
      ,i.[DateCreated]
      ,i.[DateModified]
  FROM [dbo].[Ingredients] as i left outer join dbo.IngredientWarnings as iw
  on i.Id = iw.FoodWarningTypeId left outer join dbo.FoodWarningTypes as fw 
  on iw.FoodWarningTypeId = fw.Id
  WHERE iw.FoodWarningTypeId = i.id



END


GO
