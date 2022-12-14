USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_SelectAll]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


	-- =============================================
	-- Author: <Franky Ramos>
	-- Create date: <9/13/22>
	-- Description: <A Proc to select from dbo.Ingredients by CreatedBy>
	-- Code Reviewer: Shakti Patel

	-- MODIFIED BY: 
	-- MODIFIED DATE:
	-- Code Reviewer:
	-- Note:
	-- =============================================
CREATE PROC [dbo].[Ingredients_SelectAll]

/*


Execute [dbo].[Ingredients_SelectAll]


*/



as

BEGIN

SELECT [Id]
      ,[Name]
      ,[OrganizationId]
      ,[UnitCost]
      ,[Description]
      ,[ImageUrl]
      ,[IsInStock]
      ,[IsDeleted]
      ,[RestrictionId]
	  ,[Quantity]
      ,[Measure]
      ,[CreatedBy]
      ,[ModifiedBy]
      ,[DateCreated]
      ,[DateModified]
  FROM [dbo].[Ingredients]
  
  

END


GO
