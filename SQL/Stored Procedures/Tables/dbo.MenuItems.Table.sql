USE [Carte]
GO
/****** Object:  Table [dbo].[MenuItems]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MenuItems](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrganizationId] [int] NOT NULL,
	[OrderStatusId] [int] NOT NULL,
	[UnitCost] [decimal](18, 2) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](500) NULL,
	[ImageUrl] [nvarchar](255) NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifiedBy] [int] NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsPublished] [bit] NOT NULL,
 CONSTRAINT [PK_MenuItems] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[MenuItems] ADD  CONSTRAINT [DF_MenuItems_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[MenuItems] ADD  CONSTRAINT [DF_Table_1_dateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO
ALTER TABLE [dbo].[MenuItems] ADD  CONSTRAINT [DF_MenuItems_isDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[MenuItems] ADD  CONSTRAINT [DF_MenuItems_IsPublic]  DEFAULT ((0)) FOR [IsPublished]
GO
ALTER TABLE [dbo].[MenuItems]  WITH CHECK ADD  CONSTRAINT [FK_MenuItems_OrderItemStatus] FOREIGN KEY([OrderStatusId])
REFERENCES [dbo].[OrderMenuItemStatus] ([Id])
GO
ALTER TABLE [dbo].[MenuItems] CHECK CONSTRAINT [FK_MenuItems_OrderItemStatus]
GO
ALTER TABLE [dbo].[MenuItems]  WITH CHECK ADD  CONSTRAINT [FK_MenuItems_Organizations] FOREIGN KEY([OrganizationId])
REFERENCES [dbo].[Organizations] ([Id])
GO
ALTER TABLE [dbo].[MenuItems] CHECK CONSTRAINT [FK_MenuItems_Organizations]
GO
ALTER TABLE [dbo].[MenuItems]  WITH CHECK ADD  CONSTRAINT [FK_MenuItems_StatusTypes] FOREIGN KEY([OrderStatusId])
REFERENCES [dbo].[StatusTypes] ([Id])
GO
ALTER TABLE [dbo].[MenuItems] CHECK CONSTRAINT [FK_MenuItems_StatusTypes]
GO
