﻿using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.MenuItems;
using Sabio.Models.Requests;
using Sabio.Models.Requests.MenuItems;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IMenuItemsService
    {
        MenuItem Get(int id);
        int Add(MenuItemAddRequest model, int userId);
        int AddV2(MenuItemAddRequestV2 model, int userId);
        void Update(MenuItemUpdateRequest model, int userId);
        void UpdateOrderStatus(MenuItemUpdateOrderStatus model);
        List<MenuItem> GetByIngredientId(int id);
        void MenuItemDeleteById(int id, int userId);
        void MenuItemIngredientsDeleteById(int id);
        List<LookUp> GetAllFoodSafeTypes(int pageIndex, int pageSize);
        List<MenuItem> MenuItemByFoodSafeTypeId(int id);
        Paged<MenuItem> GetPagedQueryByOrgId(int id, int pageIndex, int pageSize, string query);
        Paged<MenuItem> GetByCreatedBy(int id, int pageIndex, int pageSize);
        List<MenuItem> GetAllByOrgId(int id);
        Paged<MenuItemV2> GetMenuItemsByMenuId(int pageIndex, int pageSize, int orgId, int menuId);
        void UpdateAllItems(MenuItemUpdateAllRequest model, int userId);
        int AddAllItems(MenuItemAddAllRequest model, int userId);
        List<MenuItemTotalSold> GetTopSellingByOrgId(int id);
        MenuItemModificationOptions GetModificationOptionsById(int id);
        Paged<MenuItemCore> MenuItemCoreSearch(int id, int pageIndex, int pageSize, string query);
        Paged<MenuItem> MenuItemsSearch(int pageIndex, int pageSize, string query);

    }
}