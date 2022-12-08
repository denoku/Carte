using Sabio.Data.Providers;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Services.Interfaces;
using Sabio.Models.Requests.Files;
using Sabio.Models.Requests.Menus;
using Sabio.Data;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Menus;
using Sabio.Models.Requests.Organizations;
using Amazon.Runtime.Internal.Transform;
using System.Security.Cryptography;
using Stripe;
using System.Reflection;
using System.ComponentModel;
using Sabio.Models.Ingredients;
using Sabio.Models.Requests.MenuModifications;

namespace Sabio.Services
{
    public class MenuService : IMenuService
    {
        IDataProvider _data = null;
        public MenuService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(MenuAddRequest model, int userId, int organizationId)
        {
            int id = 0;

            string procName = "[dbo].[Menus_InsertV5]";

            DataTable menuDays = new DataTable();

            if (model.MenuDays != null)
            {
                menuDays = MapMenuDaysToTable(model.MenuDays);
            }
         
            DataTable menuSections = new DataTable();

            if (model.MenuSections != null)
            {
                menuSections = MapMenuSectionsToTable(model.MenuSections);
            }

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);

                    col.AddWithValue("@UserId", userId);
                    col.AddWithValue("@OrganizationId", organizationId);
                    

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                }, returnParameters: delegate (SqlParameterCollection returnCollction)
                {
                    object oId = returnCollction["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);

                });
            return id;
        }

        public void UpdateStatus(int id)
        {
            string procName = "[dbo].[Menus_UpdateDeleteStatus]";
            _data.ExecuteNonQuery(procName,
              inputParamMapper: delegate (SqlParameterCollection col)
              {
                  col.AddWithValue("@Id", id);

              }, returnParameters: null);
        }

        public Paged<Menu> Get(int pageIndex, int pageSize, int organizationId)
        {
            Paged<Menu> pagedList = null;

            List<Menu> list = null;

            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[Menus_Select_ByOrganizationIdV2]",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                    parameterCollection.AddWithValue("@OrganizationId", organizationId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    Menu menu = MapSingleMenu(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }

                    if (list == null)
                    {
                        list = new List<Menu>();
                    }
                    list.Add(menu);
                });
            if (list != null)
            {
                pagedList = new Paged<Menu>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public List<LookUp> GetTimeZones()
        {
            List<LookUp> timeZoneList = null;
            string procName = "[dbo].[TimeZones_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    LookUp timeZone = MapSingleTimeZone(reader, ref index);

                    if (timeZoneList == null)
                    {
                        timeZoneList = new List<LookUp>();
                    }

                    timeZoneList.Add(timeZone);
                }
           );
            return timeZoneList;
        }

        public List<MenuV2> GetMenusByOrgId(int orgId)
        {
            List<MenuV2> list = null;
            MenuV2 menu = null;
            string procName = "[dbo].[Menus_SelectByOrgIdV3]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@OrgId", orgId);
            }, singleRecordMapper: delegate (IDataReader dr, short set)
            {
                int startingIndex = 0;
                menu = MapMenus(dr, ref startingIndex);
                if (list == null)
                {
                    list = new List<MenuV2>();
                }
                list.Add(menu);
            });
            return list;
        }

        public Paged<MenuWithIdentifiedItem> GetV2(int pageIndex, int pageSize, int organizationId)
        {
            Paged<MenuWithIdentifiedItem> pagedList = null;

            List<MenuWithIdentifiedItem> list = null;

            int totalCount = 0;

            _data.ExecuteCmd(
                "dbo.Menus_Select_AvailableByOrganizationIdV2",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                    parameterCollection.AddWithValue("@OrganizationId", organizationId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    MenuWithIdentifiedItem menu = MapSingleMenuWithItemId(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }

                    if (list == null)
                    {
                        list = new List<MenuWithIdentifiedItem>();
                    }
                    list.Add(menu);
                });
            if (list != null)
            {
                pagedList = new Paged<MenuWithIdentifiedItem>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public List<LookUp> GetDaysOfWeek()
        {
            List<LookUp> daysList = null;
            string procName = "[dbo].[DaysOfWeek_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    LookUp day = MapSingleDay(reader, ref index);

                    if (daysList == null)
                    {
                        daysList = new List<LookUp>();
                    }

                    daysList.Add(day);
                }
           );
            return daysList;
        }

        public void Update(MenuUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Menus_Update]";
            _data.ExecuteNonQuery(procName,
              inputParamMapper: delegate (SqlParameterCollection col)
              {
                  col.AddWithValue("@Id", model.Id);
                  col.AddWithValue("@IsDeleted", model.IsDeleted);
                  col.AddWithValue("@IsPublished", model.IsPublished);
                  col.AddWithValue("@UserId", userId);
                  AddCommonParams(model, col);

              }, returnParameters: null);
        }

        private static void AddCommonParams(MenuAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@FileId", model.FileId);
            TimeSpan start = new TimeSpan(09, 15, 21);
            col.AddWithValue("@StartDate", start);
            col.AddWithValue("@EndDate", model.EndDate);
            col.AddWithValue("@StartTime", model.StartTime);
            col.AddWithValue("@EndTime", model.EndTime);
            col.AddWithValue("@TimeZoneId", model.TimeZoneId);
        }

        private static Menu MapSingleMenu(IDataReader reader, ref int startingIndex)
        {
            Menu menu = new Menu();

            menu.Id = reader.GetSafeInt32(startingIndex++);
            menu.Name = reader.GetSafeString(startingIndex++);
            menu.OrganizationId = reader.GetSafeInt32(startingIndex++);
            menu.Description = reader.GetSafeString(startingIndex++);
            menu.Image = reader.GetSafeString(startingIndex++);
            menu.CreatedBy = reader.GetSafeInt32(startingIndex++);
            menu.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            menu.DateCreated = reader.GetSafeDateTime(startingIndex++);
            menu.DateModified = reader.GetSafeDateTime(startingIndex++);
            menu.IsDeleted = reader.GetSafeBool(startingIndex++);
            menu.IsPublished = reader.GetSafeBool(startingIndex++);
            menu.StartDate = reader.GetSafeDateTime(startingIndex++);
            menu.EndDate = reader.GetSafeDateTime(startingIndex++);
            menu.StartTime = reader.GetSafeTimeSpan(startingIndex++);
            menu.EndTime = reader.GetSafeTimeSpan(startingIndex++);
            menu.TimeZoneId = reader.GetSafeInt32(startingIndex++);
            string menuItems = reader.GetSafeString(startingIndex++);
            if (!string.IsNullOrEmpty(menuItems))
            {
                menu.MenuItems = Newtonsoft.Json.JsonConvert.DeserializeObject<List<MenuItem>>(menuItems);
            }
            string menuDays = reader.GetSafeString(startingIndex++);
            if (!string.IsNullOrEmpty(menuDays))
            {
                menu.MenuDays = Newtonsoft.Json.JsonConvert.DeserializeObject<List<LookUp>>(menuDays);
            }

            return menu;
        }

        private static MenuV2 MapMenus(IDataReader reader, ref int startingIndex)
        {
            MenuV2 menu = new MenuV2();

            menu.Name = reader.GetSafeString(startingIndex++);
            menu.Id = reader.GetSafeInt32(startingIndex++);

            return menu;
        }

        //private static DataTable MapMenuSectionsToTable(List<int> sections)
        //{
        //    //MenuSections menuSection = new MenuSections();

        //    //menuSection.TagId = reader.GetSafeInt32(startingIndex++);
        //    //menuSection.SortId = reader.GetSafeInt32(startingIndex++);
        //    int count = 1;

        //    DataTable dt = new DataTable();
        //    dt.Columns.Add("TagId", typeof(int));
        //    dt.Columns.Add("SortId", typeof(int));
        //    foreach (int section in sections)
        //    {
        //        DataRow dr = dt.NewRow();
        //        int startingIndex = 0;
        //        dr.SetField(startingIndex++, section);
        //        dr.SetField(startingIndex++, count++);
        //        dt.Rows.Add(dr);
        //    }
        //    return dt;
        //}

        private static MenuWithIdentifiedItem MapSingleMenuWithItemId(IDataReader reader, ref int startingIndex)
        {
            MenuWithIdentifiedItem menu = new MenuWithIdentifiedItem();

            menu.Id = reader.GetSafeInt32(startingIndex++);
            menu.Name = reader.GetSafeString(startingIndex++);
            menu.OrganizationId = reader.GetSafeInt32(startingIndex++);
            menu.Description = reader.GetSafeString(startingIndex++);
            menu.Image = reader.GetSafeString(startingIndex++);
            menu.CreatedBy = reader.GetSafeInt32(startingIndex++);
            menu.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            menu.DateCreated = reader.GetSafeDateTime(startingIndex++);
            menu.DateModified = reader.GetSafeDateTime(startingIndex++);
            menu.IsDeleted = reader.GetSafeBool(startingIndex++);
            menu.IsPublished = reader.GetSafeBool(startingIndex++);
            menu.StartDate = reader.GetSafeDateTime(startingIndex++);
            menu.EndDate = reader.GetSafeDateTime(startingIndex++);
            menu.StartTime = reader.GetSafeTimeSpan(startingIndex++);
            menu.EndTime = reader.GetSafeTimeSpan(startingIndex++);
            menu.TimeZoneId = reader.GetSafeInt32(startingIndex++);
            string menuItems = reader.GetSafeString(startingIndex++);
            if (!string.IsNullOrEmpty(menuItems))
            {
                menu.MenuItems = Newtonsoft.Json.JsonConvert.DeserializeObject<List<IdentifiedMenuItem>>(menuItems);
            }
            string menuDays = reader.GetSafeString(startingIndex++);
            if (!string.IsNullOrEmpty(menuDays))
            {
                menu.MenuDays = Newtonsoft.Json.JsonConvert.DeserializeObject<List<LookUp>>(menuDays);
            }

            return menu;
        }

        private static LookUp MapSingleTimeZone(IDataReader reader, ref int startingIndex)
        {
            LookUp lookUp = new LookUp();

            lookUp.Id = reader.GetSafeInt32(startingIndex++);
            lookUp.Name = reader.GetSafeString(startingIndex++);
           
            return lookUp;
        }

        private static LookUp MapSingleDay(IDataReader reader, ref int startingIndex)
        {
            LookUp lookUp = new LookUp();

            lookUp.Id = reader.GetSafeInt32(startingIndex++);
            lookUp.Name = reader.GetSafeString(startingIndex++);

            return lookUp;
        }

        private DataTable MapMenuDaysToTable(List<int> daysToMap)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("DaysOfWeekId", typeof(int));
            foreach (int day in daysToMap)
            {
                DataRow dr = dt.NewRow();
                int startingIndex = 0;
                dr.SetField(startingIndex++, day);
                dt.Rows.Add(dr);
            }
            return dt;
        }

        private DataTable MapMenuSectionsToTable(List<MenuSectionAddRequest> sectionsToMap)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("TagId", typeof(int));
            dt.Columns.Add("SortId", typeof(int));
            foreach (MenuSectionAddRequest section in sectionsToMap)
            {
                DataRow dr = dt.NewRow();
                int startingIndex = 0;
                dr[startingIndex++] = section.TagId;
                dr[startingIndex++] = section.SortId;
                dt.Rows.Add(dr);
            }
            return dt;
        }
    }
}