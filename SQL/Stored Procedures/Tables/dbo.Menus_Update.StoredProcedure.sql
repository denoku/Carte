USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Menus_Update]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Alexandra Johnston
-- Create date: 09/12/2022
-- Description: A proc to update a record in dbo.Menus.
-- Code Reviewer: Ashley Castro

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[Menus_Update]
			 @Id int
			,@Name nvarchar(100)
			,@Organization nvarchar(200)
		    ,@Description nvarchar(500)
		    ,@FileId int
			,@UserId int
		    ,@IsDeleted bit
		    ,@IsPublished bit
		    ,@StartDate datetime2(7)
		    ,@EndDate datetime2(7)
		    ,@StartTime time(7)
		    ,@EndTime time(7)
		    ,@TimeZoneId int
as
/*
			DECLARE		@Id int = 6
						,@Name nvarchar(100) = 'Lunch'
						,@Organization nvarchar(200) = 'Shantels Preztels'
						,@Description nvarchar(500) = 'This is the lunch menu'
						,@FileId int = 25
						,@ModifiedBy int = 3
						,@IsDeleted bit = 0
						,@IsPublished bit = 1
						,@StartDate datetime2(7) = '2022-12-23 00:00:00.0000000'
						,@EndDate datetime2(7) = '2023-12-21 00:00:00.0000000'
						,@StartTime time(7) = '10:00:00'
						,@EndTime time(7) = '14:00:00'
						,@TimeZoneId int = 2
			
			EXECUTE [dbo].[Menus_Update]
						 @Id
						,@Name
						,@Organization
						,@Description 
						,@FileId
						,@ModifiedBy
						,@IsDeleted 
						,@IsPublished 
						,@StartDate 
						,@EndDate 
						,@StartTime 
						,@EndTime
						,@TimeZoneId
	
			SELECT *
			FROM [dbo].[Menus]
			WHERE Id = @Id

*/
BEGIN

			DECLARE @DateModified datetime2 = getutcdate()
			DECLARE @OrganizationId int
			SET		@OrganizationId = (SELECT Id from [dbo].[Organizations] 
			WHERE	[Name] = @Organization)

			UPDATE [dbo].[Menus]
			   SET [Name] = @Name
				  ,[OrganizationId] = @OrganizationId
				  ,[Description] = @Description
				  ,[FileId] = @FileId
				  ,[ModifiedBy] = @UserId
				  ,[IsDeleted] = @IsDeleted
				  ,[IsPublished] = @IsPublished
				  ,[StartDate] = @StartDate
				  ,[EndDate] = @EndDate
				  ,[StartTime] = @StartTime
				  ,[EndTime] = @EndTime
				  ,[TimeZoneId] = @TimeZoneId

			 WHERE Id = @Id

END
GO
