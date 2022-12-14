USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_Delete_byId]    Script Date: 08/12/2022 12:35:23 ******/
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
	DELETE FROM [dbo].[IngredientWarnings]
	WHERE IngredientId =@Id
	DELETE FROM [dbo].[Ingredients]
		WHERE Id = @Id;
END
GO
