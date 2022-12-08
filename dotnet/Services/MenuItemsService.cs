using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.MenuItems;
using Sabio.Models.Ingredients;
using Sabio.Models.Requests;
using Sabio.Models.Requests.MenuItems;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Printing;

namespace Sabio.Services
{
    public class MenuItemsService : IMenuItemsService
    {
        IDataProvider _data = null;
        public MenuItemsService(IDataProvider data)
        {
            _data = data;
        }

        public MenuItem Get(int id)
        {
            string procName = "[dbo].[MenuItems_Select_ById]";
            MenuItem menuItem = null;


            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                menuItem = MenuItemMapper(reader, ref startingIndex);

            });
            return menuItem;
        }

        public int Add(MenuItemAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[MenuItems_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                Payload(model, userId, col);
                col.AddWithValue("@CreatedBy", userId);
                col.AddWithValue("@ModifiedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object returnId = returnCollection["@Id"].Value;

                int.TryParse(returnId.ToString(), out id);
            });

            return id;
        }

        public int AddV2(MenuItemAddRequestV2 model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[MenuItems_InsertV2]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                PayloadV2(model, col);
                col.AddWithValue("@CreatedBy", userId);
                col.AddWithValue("@ModifiedBy", userId);
                

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object returnId = returnCollection["@Id"].Value;

                int.TryParse(returnId.ToString(), out id);
            });

            return id;
        }
        public int AddAllItems(MenuItemAddAllRequest model, int userId)
        {
            int id = 0;

            DataTable menuFoodSafeTypes = MapIdsToTable<int>(model.MenuFoodSafeTypes);
            DataTable tagIds = MapIdsToTable<int>(model.TagIds);
            DataTable menuIngredients = MapIdsToTable<int>(model.MenuIngredients);


            string procName = "[dbo].[MenuItems_DietaryRestrictions_MenuItemTags_MenuItemIngredients_MenuElements_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                PayloadForAll(model, col, menuFoodSafeTypes, tagIds, menuIngredients);
                col.AddWithValue("@CreatedBy", userId);
                col.AddWithValue("@ModifiedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object returnId = returnCollection["@Id"].Value;

                int.TryParse(returnId.ToString(), out id);
            });

            return id;
        }

        public void Update(MenuItemUpdateRequest model, int userId)
        {
            string procName = "[dbo].[MenuItems_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                Payload(model, userId, col);
                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@MenuItemId", model.Id);

            }, returnParameters: null);
        }
        public void UpdateOrderStatus(MenuItemUpdateOrderStatus model)
        {
            string procName = "[dbo].[MenuItems_Update_OrderStatus]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@OrderStatusId", model.OrderStatusId);
                }
                , returnParameters: null);
        }
        public void UpdateAllItems(MenuItemUpdateAllRequest model, int userId)
        {
            DataTable menuFoodSafeTypes = MapIdsToTable<int>(model.MenuFoodSafeTypes);
            DataTable tagIds = MapIdsToTable<int>(model.TagIds);
            DataTable menuIngredients = MapIdsToTable<int>(model.MenuIngredients);

            string procName = "[dbo].[MenuItems_DietaryRestrictions_MenuItemTags_MenuItemIngredients_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                PayloadForAll(model, col, menuFoodSafeTypes, tagIds, menuIngredients);
                col.AddWithValue("@CreatedBy", userId);//NOTE: required for bridge tables
                col.AddWithValue("@ModifiedBy", userId);//NOTE: required for dbo.MenuItems table
                col.AddWithValue("@MenuItemId", model.Id);

            }, returnParameters: null);
        }

        public void MenuItemDeleteById(int id, int userId)
        {//this proc updates the IsDeleted colomn to 1(True)

            string procName = "[dbo].[MenuItems_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@Id", id);

            }, returnParameters: null);
        }

        public Paged<MenuItem> MenuItemsSearch(int pageIndex, int pageSize, string query)
        {
            Paged<MenuItem> pagedList = null;
            List<MenuItem> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[MenuItems_Search_Pagination]",
                (param) =>

                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);

                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    MenuItem menuItem = MenuItemMapper(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex);

                    if (list == null)
                    {
                        list = new List<MenuItem>();
                    }
                    list.Add(menuItem);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<MenuItem>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }
        public List<MenuItem> GetByIngredientId(int id)
        {
            string procName = "[dbo].[MenuItems_Select_ByIngredientId]";
            List<MenuItem> list = null;


            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@ingredientId", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MenuItem menuItem = MenuItemMapper(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<MenuItem>();
                }

                list.Add(menuItem);
            });
            return list;
        }

        public void MenuItemIngredientsDeleteById(int id)
        {
            string procName = "[dbo].[MenuItemIngredients_Delete_ById]";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@MenuItemId", id);

            }, returnParameters: null);

        }
        
        public Paged<MenuItemCore> MenuItemCoreSearch(int orgId, int pageIndex, int pageSize, string query)
        {
            Paged<MenuItemCore> pagedList = null;
            List<MenuItemCore> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[MenuItems_Search_Pagination_V2]",
                (param) =>

                {
                    param.AddWithValue("@OrgId", orgId);
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);

                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    MenuItemCore menuItemCore = MenuItemCoreMapper(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex);

                    if (list == null)
                    {
                        list = new List<MenuItemCore>();
                    }
                    list.Add(menuItemCore);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<MenuItemCore>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }


        public List<LookUp> GetAllFoodSafeTypes(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[FoodSafeTypes_SelectAll]";
            List<LookUp> list = null;
            int totalCount = 0;


            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                LookUp food = new LookUp();

                food.Id = reader.GetSafeInt32(startingIndex++);
                food.Name = reader.GetSafeString(startingIndex++);
                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<LookUp>();
                }

                list.Add(food);
            });

            return list;
        }
        public List<MenuItem> MenuItemByFoodSafeTypeId(int id)
        {
            string procName = "[dbo].[MenuItems_Select_ByFoodSafeTypesId]";
            List<MenuItem> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@FoodSafeTypeId", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MenuItem menuItem = MenuItemMapper(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<MenuItem>();
                }

                list.Add(menuItem);
            });
            return list;
        }

        public Paged<MenuItem> GetPagedQueryByOrgId(int id, int pageIndex, int pageSize, string query)
        {
            string procName = "[dbo].[MenuItems_Select_ByOrgId_Paged_QueryV2]";
            Paged<MenuItem> pagedList = null;
            List<MenuItem> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@organizationId", id);
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
                paramCollection.AddWithValue("@query", query);


            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MenuItem menuItem = MenuItemMapper(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null) { list = new List<MenuItem>(); }
                list.Add(menuItem);
            });
            if (list != null)
            {
                pagedList = new Paged<MenuItem>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public List<MenuItem> GetAllByOrgId(int id)
        {
            string procName = "[dbo].[MenuItems_SelectAll_ByOrgId]";

            List<MenuItem> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@organizationId", id);



            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MenuItem menuItem = MenuItemMapper(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null) { list = new List<MenuItem>(); }
                list.Add(menuItem);
            });

            return list;
        }

        public Paged<MenuItemV2> GetMenuItemsByMenuId(int orgId, int pageIndex, int pageSize, int menuId)
        {
            Paged<MenuItemV2> pagedList = null;
            List<MenuItemV2> list = null;
            string procName = "[dbo].[SelectMenuItemsByMenuId]";

            
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@OrganizationId", orgId);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@MenuId", menuId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MenuItemV2 menuItem = MenuItemMapperV2(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<MenuItemV2>();
                }
                list.Add(menuItem);
            }
           );
            if (list != null)
            {
                pagedList = new Paged<MenuItemV2>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public List<MenuItemTotalSold> GetTopSellingByOrgId(int id)
        {
            string procName = "[dbo].[MenuItems_TopSelling_ByOrgId]";

            List<MenuItemTotalSold> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@OrgId", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MenuItemTotalSold menuItem = TopMenuItemMapper(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null) { list = new List<MenuItemTotalSold>(); }
                list.Add(menuItem);
            });

            return list;
        }

        public Paged<MenuItem> GetByCreatedBy(int id, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[MenuItems_Select_ByCreatedBy]";
            Paged<MenuItem> pagedList = null;
            List<MenuItem> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@createdBy", id);
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MenuItem menuItem = MenuItemMapper(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null) { list = new List<MenuItem>(); }
                list.Add(menuItem);
            });
            if (list != null)
            {
                pagedList = new Paged<MenuItem>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public MenuItemModificationOptions GetModificationOptionsById(int id)
        {
            string procName = "dbo.MenuItemModifications_Select_ByMenuItemId";
            MenuItemModificationOptions options = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                options = MapModificationOptions(reader, ref startingIndex);

            });
            return options;
        }

        private static MenuItemCore MenuItemCoreMapper(IDataReader reader, ref int startingIndex)
        {
            MenuItemCore menuItemCore = new MenuItemCore();
            menuItemCore.Organization = new Models.Domain.MenuItems.OrganizationBase();
            Ingredient ingredient = new Ingredient();
            List<Ingredient> menuIngredients = new List<Ingredient>();
            List<LookUp> menuFoodSafeType = new List<LookUp>();

            menuItemCore.Id = reader.GetSafeInt32(startingIndex++);
            menuItemCore.Organization.Id = reader.GetSafeInt32(startingIndex++);
            menuItemCore.Organization.Name = reader.GetSafeString(startingIndex++);
            menuItemCore.Organization.Logo = reader.GetSafeString(startingIndex++);
            menuItemCore.Organization.SiteUrl = reader.GetSafeString(startingIndex++);
            menuItemCore.UnitCost = reader.GetSafeDecimal(startingIndex++);
            menuItemCore.Name = reader.GetSafeString(startingIndex++);
            menuItemCore.Description = reader.GetSafeString(startingIndex++);
            menuItemCore.ImageUrl = reader.GetSafeString(startingIndex++);
            menuItemCore.IsDeleted = reader.GetSafeBool(startingIndex++);
            menuItemCore.IsPublic = reader.GetSafeBool(startingIndex++);

            menuItemCore.Tags = reader.DeserializeObject<List<LookUp>>(startingIndex++);
            menuItemCore.MenuIngredients = reader.DeserializeObject<List<Ingredient>>(startingIndex++);
            menuItemCore.MenuFoodSafeType = reader.DeserializeObject<List<LookUp>>(startingIndex++);
            ingredient.Name = reader.GetSafeString(startingIndex++);
            return menuItemCore;
        }

        private static MenuItem MenuItemMapper(IDataReader reader, ref int startingIndex)
        {
            MenuItem menuItem = new MenuItem();
            menuItem.Organization = new Models.Domain.MenuItems.OrganizationBase();
            menuItem.OrderStatus = new LookUp();
            List<Ingredient> menuIngredients = new List<Ingredient>();
            List<LookUp> menuFoodSafeType = new List<LookUp>();

            menuItem.Id = reader.GetSafeInt32(startingIndex++);
            menuItem.Organization.Id = reader.GetSafeInt32(startingIndex++);
            menuItem.Organization.Name = reader.GetSafeString(startingIndex++);
            menuItem.Organization.Logo = reader.GetSafeString(startingIndex++);
            menuItem.Organization.SiteUrl = reader.GetSafeString(startingIndex++);
            menuItem.OrderStatus.Id = reader.GetSafeInt32(startingIndex++);
            menuItem.OrderStatus.Name = reader.GetSafeString(startingIndex++);
            menuItem.UnitCost = reader.GetSafeDecimal(startingIndex++);
            menuItem.Name = reader.GetSafeString(startingIndex++);
            menuItem.Description = reader.GetSafeString(startingIndex++);
            menuItem.ImageUrl = reader.GetSafeString(startingIndex++);
            menuItem.CreatedBy = reader.GetSafeInt32(startingIndex++);
            menuItem.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            menuItem.DateCreated = reader.GetSafeDateTime(startingIndex++);
            menuItem.DateModified = reader.GetSafeDateTime(startingIndex++);
            menuItem.IsDeleted = reader.GetSafeBool(startingIndex++);
            menuItem.IsPublic = reader.GetSafeBool(startingIndex++);
            menuItem.Tags = reader.DeserializeObject<List<LookUp>>(startingIndex++);
            menuItem.MenuIngredients = reader.DeserializeObject<List<Ingredient>>(startingIndex++);
            menuItem.MenuFoodSafeType = reader.DeserializeObject<List<LookUp>>(startingIndex++);

            return menuItem;
        }
        private static MenuItemV2 MenuItemMapperV2(IDataReader reader, ref int startingIndex)
        {
            MenuItemV2 menuItem = new MenuItemV2();
           
            menuItem.Id = reader.GetSafeInt32(startingIndex++);
            menuItem.OrganizationId = reader.GetSafeInt32(startingIndex++);           
            menuItem.OrderStatusId = reader.GetSafeInt32(startingIndex++);          
            menuItem.UnitCost = reader.GetSafeDecimal(startingIndex++);
            menuItem.Name = reader.GetSafeString(startingIndex++);
            menuItem.Description = reader.GetSafeString(startingIndex++);
            menuItem.ImageUrl = reader.GetSafeString(startingIndex++);
            menuItem.IsDeleted = reader.GetSafeBool(startingIndex++);
            menuItem.IsPublic = reader.GetSafeBool(startingIndex++);
            menuItem.CreatedBy = reader.GetSafeInt32(startingIndex++);
            menuItem.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            menuItem.DateCreated = reader.GetSafeDateTime(startingIndex++);
            menuItem.DateModified = reader.GetSafeDateTime(startingIndex++);


            return menuItem;
        }
        private static MenuItemTotalSold TopMenuItemMapper(IDataReader reader, ref int startingIndex)
        {
            MenuItemTotalSold menuItem = new MenuItemTotalSold();
            menuItem.Organization = new Models.Domain.MenuItems.OrganizationBase();
            menuItem.OrderStatus = new LookUp();
            List<Ingredient> menuIngredients = new List<Ingredient>();
            List<LookUp> menuFoodSafeType = new List<LookUp>();

            menuItem.Id = reader.GetSafeInt32(startingIndex++);
            menuItem.Organization.Id = reader.GetSafeInt32(startingIndex++);
            menuItem.Organization.Name = reader.GetSafeString(startingIndex++);
            menuItem.Organization.Logo = reader.GetSafeString(startingIndex++);
            menuItem.Organization.SiteUrl = reader.GetSafeString(startingIndex++);
            menuItem.OrderStatus.Id = reader.GetSafeInt32(startingIndex++);
            menuItem.OrderStatus.Name = reader.GetSafeString(startingIndex++);
            menuItem.UnitCost = reader.GetSafeDecimal(startingIndex++);
            menuItem.Name = reader.GetSafeString(startingIndex++);
            menuItem.Description = reader.GetSafeString(startingIndex++);
            menuItem.ImageUrl = reader.GetSafeString(startingIndex++);
            menuItem.CreatedBy = reader.GetSafeInt32(startingIndex++);
            menuItem.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            menuItem.DateCreated = reader.GetSafeDateTime(startingIndex++);
            menuItem.DateModified = reader.GetSafeDateTime(startingIndex++);
            menuItem.IsDeleted = reader.GetSafeBool(startingIndex++);
            menuItem.IsPublic = reader.GetSafeBool(startingIndex++);

            menuItem.Tags = reader.DeserializeObject<List<LookUp>>(startingIndex++);
            menuItem.MenuIngredients = reader.DeserializeObject<List<Ingredient>>(startingIndex++);
            menuItem.MenuFoodSafeType = reader.DeserializeObject<List<LookUp>>(startingIndex++);
            menuItem.TotalAmount = reader.GetSafeDecimal(startingIndex++);

            return menuItem;
        }

        private static void Payload(MenuItemAddRequest model, int userId, SqlParameterCollection col)
        {
            col.AddWithValue("@OrganizationId", model.OrganizationId);
            col.AddWithValue("@OrderStatusId", model.OrderStatusId);
            col.AddWithValue("@UnitCost", model.UnitCost);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@ImageUrl", model.ImageUrl);

        }

        private static void PayloadV2(MenuItemAddRequestV2 model, SqlParameterCollection col)
        {
            col.AddWithValue("@OrganizationId", model.OrganizationId);
            col.AddWithValue("@MenuId", model.MenuId);
            col.AddWithValue("@OrderStatusId", model.OrderStatusId);
            col.AddWithValue("@UnitCost", model.UnitCost);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@ImageUrl", model.ImageUrl);

        }
        private static void PayloadForAll(MenuItemAddAllRequest model, SqlParameterCollection col, DataTable menuFoodSafeTypes, DataTable tagIds, DataTable menuIngredients)
        {
            col.AddWithValue("@OrganizationId", model.OrganizationId);
            col.AddWithValue("@OrderStatusId", model.OrderStatusId);
            col.AddWithValue("@UnitCost", model.UnitCost);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
            col.AddWithValue("@MenuId", model.MenuId);
            col.AddWithValue("@DietRestrictionList", menuFoodSafeTypes);
            col.AddWithValue("@TagList", tagIds);
            col.AddWithValue("@IngredientsList", menuIngredients);

        }

        private DataTable MapIdsToTable<T>(IEnumerable<T> list)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add("Data", typeof(T));
            foreach (T id in list)
            {
                DataRow dr = dt.NewRow();
                dr.SetField(0, id);
                dt.Rows.Add(dr);
            }

            return dt;
        }
        private MenuItemModificationOptions MapModificationOptions(IDataReader reader, ref int startingIndex)
        {
            MenuItemModificationOptions options = new MenuItemModificationOptions();
            options.MenuItemIngredients = reader.DeserializeObject<List<MenuItemIngredients>>(startingIndex++);
            return options;
        }

    }
}
