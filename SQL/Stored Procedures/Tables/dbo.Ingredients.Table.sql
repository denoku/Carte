USE [Carte]
GO
/****** Object:  Table [dbo].[Ingredients]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ingredients](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrganizationId] [int] NULL,
	[Name] [nvarchar](100) NOT NULL,
	[UnitCost] [decimal](18, 2) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[ImageUrl] [nvarchar](500) NULL,
	[IsInStock] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[RestrictionId] [int] NOT NULL,
	[Quantity] [int] NULL,
	[Measure] [nvarchar](100) NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifiedBy] [int] NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Ingredients] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Ingredients] ADD  CONSTRAINT [DF_Ingredients_IsInStock]  DEFAULT ((1)) FOR [IsInStock]
GO
ALTER TABLE [dbo].[Ingredients] ADD  CONSTRAINT [DF_Ingredients_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Ingredients] ADD  CONSTRAINT [DF_Ingredients_RestrictionId]  DEFAULT ((1)) FOR [RestrictionId]
GO
ALTER TABLE [dbo].[Ingredients] ADD  CONSTRAINT [DF_Ingredients_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[Ingredients] ADD  CONSTRAINT [DF_Ingredients_DateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO
ALTER TABLE [dbo].[Ingredients]  WITH CHECK ADD  CONSTRAINT [FK_Ingredients_PurchaseRestrictions] FOREIGN KEY([RestrictionId])
REFERENCES [dbo].[PurchaseRestrictions] ([Id])
GO
ALTER TABLE [dbo].[Ingredients] CHECK CONSTRAINT [FK_Ingredients_PurchaseRestrictions]
GO
