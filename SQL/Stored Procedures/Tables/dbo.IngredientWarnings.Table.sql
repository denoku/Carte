USE [Carte]
GO
/****** Object:  Table [dbo].[IngredientWarnings]    Script Date: 08/12/2022 12:35:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IngredientWarnings](
	[IngredientId] [int] NOT NULL,
	[FoodWarningTypeId] [int] NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[IngredientWarnings]  WITH CHECK ADD  CONSTRAINT [FK_IngredientWarnings_FoodWarningTypes] FOREIGN KEY([FoodWarningTypeId])
REFERENCES [dbo].[FoodWarningTypes] ([Id])
GO
ALTER TABLE [dbo].[IngredientWarnings] CHECK CONSTRAINT [FK_IngredientWarnings_FoodWarningTypes]
GO
ALTER TABLE [dbo].[IngredientWarnings]  WITH CHECK ADD  CONSTRAINT [FK_IngredientWarnings_Ingredients] FOREIGN KEY([IngredientId])
REFERENCES [dbo].[Ingredients] ([Id])
GO
ALTER TABLE [dbo].[IngredientWarnings] CHECK CONSTRAINT [FK_IngredientWarnings_Ingredients]
GO
