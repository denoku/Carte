USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[MenuItems_Search_Pagination_V3]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE proc [dbo].[MenuItems_Search_Pagination_V3]

			@OrgId int
			,@PageIndex int 
			,@PageSize int
			,@Query nvarchar(100)
as


/*



		Declare @OrgId int = 1
			,@PageIndex int = 0
			,@PageSize int = 12
			,@Query nvarchar(100) = 'Cheeseburger'

	Execute dbo.MenuItems_Search_Pagination_V3

						@OrgId
						,@PageIndex
						,@PageSize
						,@Query
						


		Select *
		from dbo.MenuItems

		Select *
		from dbo.Organizations	

		Select *
		from  dbo.Ingredients

		Select *
		from dbo.Tags

		Select *
		from dbo.FoodSafeTypes

		Select *
		from dbo.FoodWarningTypes


		Select *
		from dbo.Menuitems
*/

BEGIN

Declare @offset int = @PageIndex * @PageSize

SELECT [mi].[Id]
      ,[o].[Id] as OrgId
	  ,[o].[Name]
	  ,[o].[Logo]
	  ,[o].[SiteUrl]
      ,[mi].[UnitCost]
      ,[mi].[Name]
      ,[mi].[Description]
      ,[mi].[ImageUrl]
	  ,[mi].[IsDeleted]
	  ,[mi].[IsPublished] 
		,Tags = ( SELECT t.Id
						,t.Name
						FROM  dbo.Tags AS t 
						INNER JOIN dbo.MenuItemTags AS mit ON t.Id = mit.TagId
						WHERE mi.Id = mit.MenuItemId 
						FOR JSON AUTO
						)	
	   ,Ingredients = ( Select i.Id
							,i.Name 
							,i.UnitCost
							,i.ImageUrl
			From dbo.Ingredients as i 
			INNER JOIN dbo.MenuItemIngredients as mii ON i.Id = mii.IngredientId
			Where mi.Id = mii.MenuItemId
					For JSON AUTO
						)
		,FoodSafeTypes = ( Select fst.Id
								 ,fst.Name
							From dbo.FoodSafeTypes as fst 
							INNER JOIN dbo.DietaryRestrictions as dr on  fst.Id = dr.FoodSafeTypeId
							Where dr.MenuItemId = mi.Id
						For JSON AUTO
						)
		,FoodWarningTypes = ( Select fwt.Id
								 ,fwt.Name
							From dbo.FoodWarningTypes as fwt 
							INNER JOIN dbo.IngredientWarnings as iw on  fwt.Id = iw.FoodWarningTypeId
							Where iw.IngredientId = mi.Id
						For JSON AUTO
						)

		 ,[i].[Name] as IngName
		 

	  ,TotalCount = Count(1) Over()
  FROM dbo.MenuItems as mi 
  INNER JOIN dbo.Organizations as o ON mi.OrganizationId = o.Id
  INNER JOIN dbo.Ingredients as i ON mi.Name = i.Name
  INNER JOIN dbo.Tags as t ON mi.Name = t.Name
  INNER JOIN dbo.FoodSafeTypes as fst ON mi.Name = fst.Name
  INNER JOIN dbo.FoodWarningTypes as fwt ON mi.Name = fwt.Name

  

   WHERE (mi.IsDeleted = 0)
   and (mi.IsPublished = 1)
   and (mi.Name LIKE '%' + @Query + '%'
   or i.Name LIKE '%' + @Query + '%'
   or t.Name LIKE '%' + @Query + '%'
   or fst.Name LIKE '%' + @Query + '%'
   or fwt.Name LIKE '%' + @Query + '%'
   )
   
  ORDER BY mi.Id

   OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY



END
GO
