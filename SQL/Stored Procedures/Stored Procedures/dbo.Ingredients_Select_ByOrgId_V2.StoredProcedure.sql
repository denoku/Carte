USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_Select_ByOrgId_V2]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Franky Ramos>
-- Create date: <8/24/22>
-- Description: <A Proc to select from dbo.Ingredients by OrgID>
-- Code Reviewer:Shakti Patel

-- MODIFIED BY: Franky Ramos
-- MODIFIED DATE:8/24/22
-- Code Reviewer:
-- Note:

--						_V2
-- MODIFIED BY: Camilo Salcedo
-- MODIFIED DATE: 9/30/2022
-- Code Reviewer: Stephanie Maynetto-Jackson 
-- Note: Made changes to V1 so there would be no ingredient duplicates when having 2 different
--       FoodWarningTypes
-- =============================================





CREATE PROC [dbo].[Ingredients_Select_ByOrgId_V2]  
			      @OrganizationId int
				 ,@PageIndex int 
				 ,@PageSize int
			




/*
	DECLARE @OrganizationId int = 1;

				EXECUTE [dbo].[Ingredients_Select_ByOrgId_V2] @OrganizationId
				,@PageIndex = 0
				,@PageSize = 10
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
				fw.Id
				,fw.[Name]
			FROM dbo.IngredientWarnings as iw
			LEFT OUTER JOIN dbo.FoodWarningTypes as fw  on iw.FoodWarningTypeId = fw.Id
			WHERE iw.IngredientId = i.Id
			FOR JSON PATH
			)
		,i.[DateCreated]
		,i.[DateModified]
		,TotalCount = COUNT(1) OVER() 
	FROM dbo.Ingredients as i
	LEFT OUTER JOIN dbo.PurchaseRestrictions as p on i.RestrictionId = p.Id
	WHERE i.OrganizationId = @OrganizationId
	ORDER BY i.DateCreated DESC

	OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY
	 
END
GO
