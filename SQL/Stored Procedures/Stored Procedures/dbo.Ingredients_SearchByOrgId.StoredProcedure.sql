USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_SearchByOrgId]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

	-- =============================================
	-- Author: Brian
	-- Create date: <11/15/22>
	-- Description: <Search for Ingredients within the specific organization>
	-- Code Reviewer: 

	-- MODIFIED BY: 
	-- MODIFIED DATE:
	-- Code Reviewer: 
	-- Note:
	-- =============================================
CREATE PROC [dbo].[Ingredients_SearchByOrgId]
				  @OrgId int
				 ,@PageIndex int 
				 ,@PageSize int
				 ,@Query nvarchar(100)

/*
	DECLARE @OrgId int = 1;

					EXECUTE [dbo].[Ingredients_SearchByOrgId]@OrgId
						,@PageIndex = 0
						,@PageSize = 10 
						,@Query = 'wine'

				
	 SELECT [Id]
		  ,[Name]
		  ,[Description]
	  FROM [dbo].[Ingredients]

	  select * from dbo.ingredients

*/

AS

BEGIN

Declare @offset int = @pageIndex * @pageSize

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
	LEFT OUTER JOIN dbo.PurchaseRestrictions as p on i.RestrictionId = p.Id		   
	WHERE (i.OrganizationId = @OrgId and i.Name LIKE '%' + @Query + '%')
	or (i.OrganizationId = @OrgId and i.DateCreated LIKE '%' + @Query + '%') 
	or (i.OrganizationId = @OrgId and i.Description LIKE '%' + @Query + '%')
	or (i.OrganizationId = @OrgId and p.Name LIKE '%' + @Query + '%')
	or (i.OrganizationId = @OrgId and i.Measure LIKE '%' + @Query + '%')

	ORDER BY Id

		OFFSET @offSet Rows
		Fetch Next @PageSize Rows ONLY

END


GO
