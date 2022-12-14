USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_SelectAll_ByOrgId]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


	-- =============================================
	-- Author: Joseph Box
	-- Create date: <9/25/22>
	-- Description: <Selects All Ingredients within the specific organization>
	-- Code Reviewer: 

	-- MODIFIED BY: Joseph Box
	-- MODIFIED DATE: 9/27/22
	-- Code Reviewer: 
	-- Note: Added additionaly logic to only return ingredients that arent deleted
	-- =============================================
CREATE PROC [dbo].[Ingredients_SelectAll_ByOrgId]
								@OrgId int 
/*


Execute [dbo].[Ingredients_SelectAll_ByOrgId]
						@OrgId = 1

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
		  ,p.Id as RestrictionId
		  ,p.[Name] as RestrictionName
		  ,i.Quantity
		  ,i.[Measure]
		  ,i.[CreatedBy]
		  ,i.[ModifiedBy]
		  ,fw.Id as FoodWarningTypeId
		  ,fw.[Name] as FoodWarningTypeName
		  ,i.[DateCreated]
		  ,i.[DateModified]
		  From dbo.Ingredients as i 
		  LEFT OUTER JOIN dbo.IngredientWarnings as iw on iw.IngredientId = i.Id
		  LEFT OUTER JOIN dbo.FoodWarningTypes as fw  on iw.FoodWarningTypeId = fw.Id
		  LEFT OUTER JOIN dbo.PurchaseRestrictions as p on i.RestrictionId = p.Id 
		  WHERE i.OrganizationId = @OrgId And i.IsDeleted = 0
  

END


GO
