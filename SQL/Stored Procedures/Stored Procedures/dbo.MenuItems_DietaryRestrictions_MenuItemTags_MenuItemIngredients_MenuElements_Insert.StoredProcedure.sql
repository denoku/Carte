USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[MenuItems_DietaryRestrictions_MenuItemTags_MenuItemIngredients_MenuElements_Insert]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Dodje Kelley
-- Create date: 11/29/2022
-- Description:	A proc to INSERT MenuItems, DietaryRestrictions, MenuItemTags, MenuItemIngredients and MenuElements.
-- Code Reviewer: 


-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note: 
-- =============================================

CREATE proc [dbo].[MenuItems_DietaryRestrictions_MenuItemTags_MenuItemIngredients_MenuElements_Insert]
			@OrganizationId int
			,@OrderStatusId int
			,@UnitCost decimal(18,2)
			,@Name nvarchar(100)
			,@Description nvarchar(500)
			,@ImageUrl nvarchar(255)
			,@ModifiedBy int           
			,@DietRestrictionList dbo.Id_List READONLY
			,@TagList dbo.Id_List READONLY 
			,@IngredientsList dbo.Id_List READONLY
			,@CreatedBy int
			,@MenuId int
			,@Id int OUTPUT
as
/*
Declare
		@OrganizationId int = 1
		,@OrderStatusId int = 1
		,@UnitCost decimal(18,2) = 10.00
		,@Name nvarchar(100) = 'CreatedAllItems SQL'
		,@Description nvarchar(500) = 'CreatedAllItems SQL'
		,@ImageUrl nvarchar(255) = 'https://tinyurl.com/2p8w9fjn'
		,@ModifiedBy int = 1
		,@DietRestrictionList dbo.Id_List 
		,@TagList dbo.Id_List
		,@IngredientsList dbo.Id_List 
		,@CreatedBy int = 1  
		,@Id int

		INSERT INTO @DietRestrictionList
			(Id)
		VALUES
			(6)
			,(2)
			,(3)
		INSERT INTO @TagList
			(Id)
		VALUES
			(20)
			,(6)
		INSERT INTO @IngredientsList
			(Id)
		VALUES
			(130)
			,(142)

EXEC dbo.MenuItems_DietaryRestrictions_MenuItemTags_MenuItemIngredients_Insert
		@OrganizationId 
		,@OrderStatusId 
		,@UnitCost 
		,@Name 
		,@Description 
		,@ImageUrl 
		,@ModifiedBy 
		,@DietRestrictionList
		,@TagList 
		,@IngredientsList 
		,@CreatedBy
		,@Id OUTPUT
		   

Select *
from dbo.MenuItems
where Id = @Id;
Select *
from dbo.DietaryRestrictions
where MenuItemId = @Id;
SELECT * 
FROM dbo.MenuItemTags
where MenuItemId = @Id;
SELECT * 
FROM dbo.MenuItemIngredients
where MenuItemId = @Id;
*/
BEGIN
INSERT INTO [dbo].[MenuItems]
           ([OrganizationId]
           ,[OrderStatusId]
           ,[UnitCost]
           ,[Name]
           ,[Description]
           ,[ImageUrl]
           ,[CreatedBy]
           ,[ModifiedBy]
		   )
     VALUES
           (
		   @OrganizationId
           ,@OrderStatusId
           ,@UnitCost
           ,@Name
           ,@Description
           ,@ImageUrl
           ,@CreatedBy
           ,@ModifiedBy
		   )
	SET @Id = SCOPE_IDENTITY();
	---------------------------------------
	INSERT INTO dbo.DietaryRestrictions
		(MenuItemId
		,FoodSafeTypeId)
	SELECT 
		@Id
		,Id
	FROM @DietRestrictionList
	---------------------------------------
	INSERT INTO dbo.MenuItemTags
		(MenuItemId
		,TagId
		,CreatedBy
		)
	SELECT 
		@Id
		,Id
		,@CreatedBy
	FROM @TagList
	----------------------------------------
	INSERT INTO dbo.MenuItemIngredients
		(MenuItemId
		,IngredientId
		,CreatedBy
		)
	SELECT 
		@Id
		,Id
		,@CreatedBy
	FROM @IngredientsList

	----------------------------------------
	INSERT INTO dbo.MenuElements
		(MenuId
		,MenuItemId		
		)
	VALUES
        (@MenuId
        ,@Id)
		
END


GO
