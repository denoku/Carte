USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_InsertBatch]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Brian Wheeler>
-- Create date: <10/25/22>
-- Description: <A batch insert proc for ingredients>
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

-- =============================================


CREATE proc [dbo].[Ingredients_InsertBatch]
				 @batchIngredients dbo.Ingredients READONLY
				,@CreatedBy int 
				,@OrganizationId int
	
	-- need to add org id or get org id
/*
	select *
	from dbo.ingredients

	Declare @newIngredients dbo.ingredients
	Declare @CreatedBy int = 1
	Declare @OrganizationId int = 163

	Insert into @newIngredients(Name, UnitCost, Description, ImageUrl, IsInStock, RestrictionId, Quantity, Measure)

	Values ('Garlic', 1.00, 'Yummy Garlic', 'https://tinyurl.com/57sxztbt', 1, 1, 500, 'Per pound')

	Execute dbo.[Ingredients_InsertBatch] @newIngredients, @CreatedBy, @OrganizationId

	select *
	from dbo.ingredients

	--delete from dbo.ingredients where id > 433

*/
as

BEGIN
	 

	Insert into dbo.Ingredients(Name 
							   ,UnitCost
							   ,Description
							   ,ImageUrl
							   ,IsInStock
							   ,RestrictionId
							   ,Quantity
							   ,Measure
							   ,CreatedBy
							   ,OrganizationId)

	Select n.Name 
		  ,n.UnitCost
		  ,n.Description
		  ,n.ImageUrl
		  ,n.IsInStock
		  ,n.RestrictionId
		  ,n.Quantity
		  ,n.Measure
		  ,@CreatedBy
		  ,@OrganizationId

	From @batchIngredients as n

END
GO
