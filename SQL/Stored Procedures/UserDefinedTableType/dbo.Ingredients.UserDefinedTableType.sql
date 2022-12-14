USE [Carte]
GO
/****** Object:  UserDefinedTableType [dbo].[Ingredients]    Script Date: 26/10/2022 14:51:34 ******/
CREATE TYPE [dbo].[Ingredients] AS TABLE(
	[Name] [nvarchar](100) NOT NULL,
	[UnitCost] [decimal](18, 0) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[ImageUrl] [nvarchar](500) NULL,
	[IsInStock] [bit] NOT NULL,
	[RestrictionId] [int] NOT NULL,
	[Quantity] [int] NULL,
	[Measure] [nvarchar](100) NULL
)
GO
