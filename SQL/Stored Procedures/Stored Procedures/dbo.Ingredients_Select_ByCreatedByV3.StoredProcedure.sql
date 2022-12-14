USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_Select_ByCreatedByV3]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: <Franky Ramos>
-- Create date: <8/24/22>
-- Description: <A Proc to select from dbo.Ingredients by CreatedBy>
-- Code Reviewer:Shakti Patel

-- MODIFIED BY: Franky Ramos
-- MODIFIED DATE:8/24/22
-- Code Reviewer:
-- Note:

-- MODIFIED BY: Franky Ramos
-- MODIFIED DATE:8/31/22
-- Code Reviewer: Anthony Lai
-- Note:
-- =============================================




CREATE PROC [dbo].[Ingredients_Select_ByCreatedByV3]
				@PageIndex int 
				,@PageSize int
				 ,@CreatedBy int




/*
	

				EXECUTE [dbo].[Ingredients_Select_ByCreatedBy] 
				@CreatedBy = 1
				,@PageIndex = 0
				,@PageSize = 10

				
				SELECT *
				FROM dbo.Ingredients
				SELECT *
				FROM dbo.PurchaseRestrictions
				SELECT *
				FROM dbo.IngredientWarnings
				SELECT *
				FROM dbo.FoodWarningTypes

*/

AS

BEGIN

Declare @offset int = @pageIndex * @pageSize

			SELECT i.[Id]
		  ,i.[OrganizationId]
		  ,o.[name] as OrganizationName
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
			,TotalCount = COUNT(1) OVER() 
			 From dbo.Ingredients as i
		  LEFT OUTER JOIN dbo.Organizations as o on o.Name = o.name
		  LEFT OUTER JOIN dbo.IngredientWarnings as iw on iw.IngredientId = i.Id
		  LEFT OUTER JOIN dbo.FoodWarningTypes as fw  on iw.FoodWarningTypeId = fw.Id
		  LEFT OUTER JOIN dbo.PurchaseRestrictions as p on i.RestrictionId = p.Id 
		 		   
			WHERE i.CreatedBy = @CreatedBy
			ORDER BY Id

		OFFSET @offSet Rows
		Fetch Next @PageSize Rows ONLY

END
GO
