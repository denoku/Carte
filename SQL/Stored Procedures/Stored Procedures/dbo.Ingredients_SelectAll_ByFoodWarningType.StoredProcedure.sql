USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_SelectAll_ByFoodWarningType]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
	-- =============================================
	-- Author: Brian Wheeler
	-- Create date: <11/14/22>
	-- Description: <Selects All Ingredients within the specific organization by food warning type>
	-- Code Reviewer: 

	-- MODIFIED BY: 
	-- MODIFIED DATE: 
	-- Code Reviewer: 
	-- Note: 
	-- =============================================
CREATE PROC [dbo].[Ingredients_SelectAll_ByFoodWarningType]

			      @OrganizationId int
				 ,@PageIndex int 
				 ,@PageSize int
				 ,@FoodWarningTypeId int
			
/*
	DECLARE @OrganizationId int = 1;

				EXECUTE [dbo].[Ingredients_SelectAll_ByFoodWarningType] @OrganizationId
				,@PageIndex = 0
				,@PageSize = 10
				,@FoodWarningTypeId = 1

	Select *
	from dbo.Ingredients
	where OrganizationId = 1

	Select *
	from dbo.IngredientWarnings
*/

AS

BEGIN

	Declare @offset int = @PageIndex * @PageSize

	SELECT 
		i.[Id]
		,i.[OrganizationId]
		,i.[Name]
		,i.[UnitCost]
		,i.[Description]
		,i.[ImageUrl]
		,i.[IsInStock]
		,i.[IsDeleted]
		,i.RestrictionId 
		,p.[Name] as RestrictionName
		,i.[Measure]
		,i.[Quantity]
		,i.[CreatedBy]
		,i.[ModifiedBy]
		,FoodWarningTypes = 
			(
			SELECT DISTINCT
			
				fw.[Name]
			FROM dbo.IngredientWarnings as iw
			LEFT OUTER JOIN dbo.FoodWarningTypes as fw  on iw.FoodWarningTypeId = fw.Id
			WHERE iw.IngredientId = i.Id
			FOR JSON PATH
			)
		,i.[DateCreated]
		,i.[DateModified]
		,TotalCount = COUNT(1) OVER() 
	FROM dbo.Ingredients as i
	inner join dbo.PurchaseRestrictions as p 
			ON i.RestrictionId = p.Id
	inner join dbo.IngredientWarnings as iw
			ON i.Id = iw.IngredientId
	inner join dbo.FoodWarningTypes as fw
			on fw.Id = iw.FoodWarningTypeId

	WHERE (i.OrganizationId = @OrganizationId AND fw.Id = @FoodWarningTypeId)
	--AND i.IsDeleted = 0

	ORDER BY i.DateCreated DESC

	OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY
	 
END
GO
