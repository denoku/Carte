USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_Delete_byId]    Script Date: 8/31/2022 10:02:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

	-- =============================================
	-- Author: <Franky Ramos>
	-- Create date: <8/24/22>
	-- Description: <A Proc to delete from dbo.Ingredients by Id>
	-- Code Reviewer: Shakti Patel

	-- MODIFIED BY: Franky Ramos
	-- MODIFIED DATE:8/24/22
	-- Code Reviewer:
	-- Note:
	-- =============================================



	CREATE proc [dbo].[Ingredients_Delete_byId]
			@Id int

	/*

	DECLARE @Id int = 28

				SELECT *
				FROM [dbo].[Ingredients]
				WHERE Id = @Id

				EXECUTE [dbo].[Ingredients_Delete_byId] @Id

				SELECT *
				FROM [dbo].[Ingredients]
				WHERE Id = @Id



	*/

	as 

	BEGIN 
	DELETE FROM dbo.IngredientWarnings 
	Where IngredientId = @Id

	DELETE FROM dbo.MenuItemIngredients
	Where IngredientId = @Id

		DELETE FROM [dbo].[Ingredients]
			  WHERE Id = @Id;

	END
GO
