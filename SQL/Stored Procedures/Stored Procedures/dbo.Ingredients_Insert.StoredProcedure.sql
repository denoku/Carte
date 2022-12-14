USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_Insert]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Franky Ramos>
-- Create date: <8/24/22>
-- Description: <A Proc to insert into dbo.Ingredients by Id>
-- Code Reviewer: Shakti Patel

-- MODIFIED BY: Franky Ramos
-- MODIFIED DATE:8/24/22
-- Code Reviewer:
-- Note:
-- =============================================

CREATE Proc [dbo].[Ingredients_Insert]
					 @OrganizationId int
					,@Name nvarchar(100)
					,@UnitCost decimal
					,@Description nvarchar(255)
					,@ImageUrl nvarchar(255)
					,@IsInStock bit
					,@IsDeleted bit
					,@Quantity int
					,@Measure nvarchar(100)
					,@UserId int
					,@Id int OUTPUT


as


/*

	Declare @Id int = 0

			 Declare @OrganizationId int = 10
					,@Name nvarchar(100) = 'Name Test 3'
					,@UnitCost decimal = 25
					,@Description nvarchar(255) = 'Desription test'
					,@ImageUrl nvarchar(255) = 'www.Test.com'
					,@IsInStock bit = 0
					,@IsDeleted bit = 1
					,@Quantity int = 100
					,@Measure nvarchar(100) = 'Measure test'
					,@UserId int = 1
				


			Execute [dbo].[Ingredients_Insert]
					@OrganizationId
				   ,@Name
				   ,@UnitCost
				   ,@Description
				   ,@ImageUrl
				   ,@IsInStock
				   ,@IsDeleted
				   ,@Quantity
				   ,@Measure
				   ,@UserId
				   ,@Id OUTPUT

				 

				   Select *
				   From dbo.Ingredients
				   Where Id = @Id
				

*/


Begin




	INSERT INTO [dbo].[Ingredients]
			   ([OrganizationId]
			   ,[Name]
			   ,[UnitCost]
			   ,[Description]
			   ,[ImageUrl]
			   ,[IsInStock]
			   ,[IsDeleted]
			   ,[Quantity]
			   ,[Measure]
			   ,[CreatedBy]
			   ,[ModifiedBy])
		 VALUES
			   (@OrganizationId
			   ,@Name
			   ,@UnitCost
			   ,@Description
			   ,@ImageUrl
			   ,@IsInStock
			   ,@IsDeleted
			   ,@Quantity
			   ,@Measure
			   ,@UserId
			   ,@UserId
			   )


			   SET @Id =SCOPE_IDENTITY()
END


	
	
GO
