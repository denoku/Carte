USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[FoodWarningTypes_SelectAll]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


	-- =============================================
	-- Author: <Franky Ramos>
	-- Create date: <8/25/22>
	-- Description: <A Proc to select from dbo.Ingredients by CreatedBy>
	-- Code Reviewer: Shakti Patel

	-- MODIFIED BY: Franky Ramos
	-- MODIFIED DATE:8/25/22
	-- Code Reviewer:
	-- Note:
	-- =============================================



	CREATE Proc [dbo].[FoodWarningTypes_SelectAll]

	/*

	Execute [dbo].[FoodWarningTypes_SelectAll]

	*/

	as

	BEGIN


		SELECT [Id]
			  ,[Name]
		FROM [dbo].[FoodWarningTypes]

	END


GO
