USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_InsertV2]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Franky Ramos>
-- Create date: <8/24/22>
-- Description: <A Proc to insert  with ingredients Warnings and puchase restrictions from dbo.Ingredients by Id>
-- Code Reviewer:Brandon White

-- MODIFIED BY: Franky Ramos
-- MODIFIED DATE:10/5/22
-- Code Reviewer:
-- Note:

-- MODIFIED BY: Brian Wheeler
-- MODIFIED DATE:10/26/2022
-- Code Reviewer: 
-- Note: Added udt to be able to insert multiple food warning type ids


-- MODIFIED BY: Brian Wheeler
-- MODIFIED DATE:11/10/2022
-- Code Reviewer: 
-- Note: Added organization Id as userId was being used for orgId
-- =============================================

CREATE Proc [dbo].[Ingredients_InsertV2]
					
				     @OrgId int
					,@Name nvarchar(100)
					,@UnitCost decimal
					,@Description nvarchar(255)
					,@ImageUrl nvarchar(500)
					,@IsInStock bit
					,@IsDeleted bit
					,@RestrictionId int
					,@Quantity int
					,@Measure nvarchar(100)
					,@FoodWarningTypeId dbo.FoodWarningTypeIds READONLY
					,@UserId int
					,@Id int OUTPUT
as


/*

	Declare @Id int = 0;
	Declare @myFoodWarnings dbo.FoodWarningTypeIds

	Insert into @myFoodWarnings (FoodWarningTypeId)
	Values(5)
	Insert into @myFoodWarnings (FoodWarningTypeId)
	Values(13)
	
	

			 Declare @OrgId int = 1
					,@Name nvarchar(100) = 'Name Test 23'
					,@UnitCost decimal = 25
					,@Description nvarchar(255) = 'Description test'
					,@ImageUrl nvarchar(500) = 'www.Test.com'
					,@IsInStock bit = 0
					,@IsDeleted bit = 1
					,@RestrictionId int = 3
					,@Quantity int = 100
					,@Measure nvarchar(100) = 'Measure test'
					,@UserId int = 163
					

			Execute [dbo].[Ingredients_InsertV2]
			        
					@OrgId
				   ,@Name
				   ,@UnitCost
				   ,@Description
				   ,@ImageUrl
				   ,@IsInStock
				   ,@IsDeleted
				   ,@RestrictionId
				   ,@Quantity
				   ,@Measure
				   ,@myFoodWarnings
				   ,@UserId
				   ,@Id OUTPUT

				   Select *
				   From dbo.Ingredients as i inner join dbo.PurchaseRestrictions as pr
				   on pr.Id = i.RestrictionId inner join dbo.IngredientWarnings as iw
				   on iw.IngredientId = i.Id

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
			   ,[RestrictionId]
			   ,[Quantity]
			   ,[Measure]
			   ,[CreatedBy]
			   ,[ModifiedBy])
          
     VALUES
			   (@OrgId
			   ,@Name
			   ,@UnitCost
			   ,@Description
			   ,@ImageUrl
			   ,@IsInStock
			   ,@IsDeleted
			   ,@RestrictionId
			   ,@Quantity
			   ,@Measure
			   ,@UserId
			   ,@UserId
			   )
			    SET @Id =SCOPE_IDENTITY()

 --  INSERT INTO dbo.IngredientWarnings
	--		  (IngredientId
	--		  ,FoodWarningTypeId)
	--VALUES  
	--	        (@Id
	--		    ,@FoodWarningTypeId)

	Insert into dbo.IngredientWarnings (IngredientId, FoodWarningTypeId)
	Select @Id, fw.Id
				From dbo.FoodWarningTypes as fw
				Where exists (select 1
							  from @FoodWarningTypeId as f
							  where fw.id = f.FoodWarningTypeId)
				
End

GO
