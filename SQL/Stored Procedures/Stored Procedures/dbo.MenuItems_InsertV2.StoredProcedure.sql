USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[MenuItems_InsertV2]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Dodje Kelley
-- Create date: 11/28/2022
-- Description:	Adds menu items, now with an associated menu.
-- Code Reviewer: 


-- MODIFIED BY: Brian Wheeler
-- MODIFIED DATE: 11/30/2022
-- Code Reviewer: 
-- Note: Added MenuId for menuItems , insert into bridge table
-- =============================================

CREATE proc [dbo].[MenuItems_InsertV2]
			@OrganizationId int
		   ,@MenuId int
           ,@OrderStatusId int
           ,@UnitCost decimal(18,2)
           ,@Name nvarchar(100)
           ,@Description nvarchar(500)
           ,@ImageUrl nvarchar(255)
           ,@UserId int
		   ,@Id int OUTPUT
as
/*
	Declare @Id int = 0;

	Declare	@OrganizationId int = 1
		   ,@MenuId int = 1
           ,@OrderStatusId int = 1
           ,@UnitCost decimal(18,2) = 7.50
           ,@Name nvarchar(100) = 'Test'
           ,@Description nvarchar(500) = 'Test'
           ,@ImageUrl nvarchar(255) = 'https://tinyurl.com/tpbs5wcd'
           ,@UserId int = 163


	EXEC dbo.MenuItems_InsertV2
			@OrganizationId 
			,@MenuId
           ,@OrderStatusId 
           ,@UnitCost 
           ,@Name 
           ,@Description 
           ,@ImageUrl 
           ,@UserId
		   ,@Id OUTPUT

	Select * from dbo.MenuItems
	WHERE Id = @Id

	Select * from dbo.Menus
	Select * from dbo.MenuElements


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
           (@OrganizationId
		   ,@OrderStatusId
           ,@UnitCost
           ,@Name
           ,@Description
           ,@ImageUrl
           ,@UserId
           ,@UserId
		   )
	SET @Id = SCOPE_IDENTITY();


	INSERT INTO dbo.MenuElements
				(MenuId
				,MenuItemId)
	VALUES (@MenuId
			,@Id)
	--Insert into dbo.MenuElements (MenuId, MenuItemId)
	--Select @Id, ms.Id
	--			From dbo.Menus as ms
	--			Where exists (select 1
	--						  from @MenuId as m
	--						  where ms.id = m.menuItemId)
END


GO
