USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Ingredients_UpdateV2]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Franky Ramos>
-- Create date: <8/24/22>
-- Description: <A Proc to update dbo.Ingredients table with warnings and purchase restrictions>
-- Code Reviewer:Chris Adriano

-- MODIFIED BY: Franky Ramos
-- MODIFIED DATE:10/5/22
-- Code Reviewer:
-- Note:

-- MODIFIED BY: Brian Wheeler
-- MODIFIED DATE:10/29/22
-- Code Reviewer:
-- Note:Added batch insert for foodWarningTypeId's
-- =============================================

CREATE Proc [dbo].[Ingredients_UpdateV2]
					
					 @OrgId int
					,@Name nvarchar(100)
					,@UnitCost decimal
					,@Description nvarchar(255)
					,@ImageUrl nvarchar(255)
					,@IsInStock bit
					,@IsDeleted bit
					,@RestrictionId int
					,@Quantity int
					,@Measure nvarchar(100)
					,@FoodWarningTypeId dbo.FoodWarningTypeIds READONLY
					,@UserId int
					
					,@Id int 

/*

	Declare @Id int = 804
	Declare @myFoodWarnings dbo.FoodWarningTypeIds

	Insert into @myFoodWarnings (FoodWarningTypeId)
	Values(5)	

		Declare      @OrgId int = 1
					,@Name nvarchar(100) = 'Green Bell Update'
					,@UnitCost decimal = 3
					,@Description nvarchar(255) = 'Fresh green bell peppers for cooking and roasting'
					,@ImageUrl nvarchar(255) = 'https://tinyurl.com/53bex4w4/update'
					,@IsInStock bit = 0
					,@IsDeleted bit = 0
					,@RestrictionId int = 1
					,@Quantity int = 100
					,@Measure nvarchar(100) = 'Small'
					,@UserId int = 163

			Execute [dbo].[Ingredients_UpdateV2]
			     
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
				   ,@Id 

		Select *
		From dbo.Ingredients
		Where Id = @Id

				   --Select *
				   --From dbo.Ingredients 
				   --as i inner join dbo.PurchaseRestrictions as pr
				   --on pr.Id = i.RestrictionId inner join dbo.IngredientWarnings as iw
				   --on iw.IngredientId = i.Id

*/

as

BEGIN

	UPDATE [dbo].[Ingredients]

	   SET [OrganizationId] = @OrgId
		  ,[Name] = @Name
		  ,[UnitCost] = @UnitCost
		  ,[Description] = @Description
		  ,[ImageUrl] = @ImageUrl
		  ,[IsInStock] = @IsInStock
		  ,[IsDeleted] = @IsDeleted
		  ,[RestrictionId] = @RestrictionId
		  ,[Quantity] = @Quantity
		  ,[Measure] = @Measure
		  ,[ModifiedBy] = @UserId
      
	 WHERE Id = @Id

	Delete from dbo.IngredientWarnings
	where IngredientId = @Id
	Insert into dbo.IngredientWarnings (IngredientId, FoodWarningTypeId)
		Select @Id, fw.Id
					From dbo.FoodWarningTypes as fw
					Where exists (select 1
								  from @FoodWarningTypeId as f
								  where fw.id = f.FoodWarningTypeId)
	END


GO
