USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Menus_InsertV5]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Alexandra Johnston
-- Create date: 10/04/2022
-- Description: Proc for inserting into dbo.Menus
-- Code Reviewer: 
-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[Menus_InsertV5]

			@Name nvarchar(100)
           ,@OrganizationId int
           ,@Description nvarchar(500)
           ,@FileId int
           ,@UserId int
		   ,@StartDate datetime2(7)
		   ,@EndDate datetime2(7)
		   ,@StartTime time(7)
		   ,@EndTime time(7)
		   ,@TimeZoneId int
		   ,@Id int OUTPUT

as
/*------- Test Code------
					
				DECLARE 
					 @IsDeleted int = 0
					,@IsPublished int = 0
					,@UserId int = 6
					,@MenuId int

			DECLARE @Name nvarchar(100) = 'TEST 001'
				   ,@OrganizationId int = 10
				   ,@Description nvarchar(500) = 'Yettis snowcones'
				   ,@FileId int = 24
				   ,@StartDate datetime2(7) = '2022-12-23 00:00:00.000000'
				   ,@EndDate datetime2(7) = '2023-12-21 00:00:00.0000000'
				   ,@StartTime time(7) = '00:01:00'
				   ,@EndTime time(7) = '00:59:00'
				   ,@TimeZoneId int = 1
				   ,@DaysOfWeekId int = 1

				 

			EXECUTE [dbo].[Menus_InsertV5]

					@Name 
				   ,@OrganizationId 
				   ,@Description 
				   ,@FileId 
				   ,@UserId 
				   ,@StartDate 
				   ,@EndDate 
				   ,@StartTime 
				   ,@EndTime 
				   ,@TimeZoneId 
				   ,@MenuId OUTPUT
				 
				   

				   Select @MenuId

				   Select *
				   FROM dbo.Menus as m inner join dbo.Organizations as o
				   ON o.Id = m.OrganizationId
				   WHERE m.Id = @MenuId

				   Select * from dbo.MenuDays
				   WHERE MenuId = @MenuId

				   Select * from dbo.MenuSections
				   WHERE MenuId = @MenuId
*/
BEGIN

		INSERT INTO [dbo].[Menus]
					([Name]
				   ,[OrganizationId]
				   ,[Description]
				   ,[FileId]
				   ,[CreatedBy]
				   ,[ModifiedBy]
				   ,[StartDate]
				   ,[EndDate]
				   ,[StartTime]
				   ,[EndTime]
				   ,[TimeZoneId])
				   
		VALUES	   (@Name 
				   ,@OrganizationId
				   ,@Description
				   ,@FileId
				   ,@UserId
				   ,@UserId
				   ,@StartDate 
				   ,@EndDate 
				   ,@StartTime
				   ,@EndTime
				   ,@TimeZoneId)

				   SET @Id =SCOPE_IDENTITY()
				  
		


END
GO
