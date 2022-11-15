using CsvHelper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Ingredients;
using Sabio.Models.Requests.Ingredients;
using Sabio.Services.Interfaces;
using Stripe;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;

namespace Sabio.Services
{
    public class IngredientsService : IIngredientsService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService;

        public IngredientsService(IDataProvider data, ILookUpService lookUpService)
        {
            _data = data;
            _lookUpService = lookUpService;
        }
        public Ingredient GetIngredientById(int id)
        {
            string procName = "[dbo].[Ingredients_Select_ById]";

            Ingredient iIngredient = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                iIngredient = MapSingleIngredient(reader, ref startingIndex);
            });
            return iIngredient;
        }
        public Paged<IngredientV2> PaginateByOrgId(int pageIndex, int pageSize, int organizationId)
        {
            Paged<IngredientV2> pagedList = null;
            List<IngredientV2> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Ingredients_Select_ByOrgId_V2]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
                param.AddWithValue("@OrganizationId", organizationId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                IngredientV2 ingredient = MapSingleIngredientV2(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<IngredientV2>();
                }
                list.Add(ingredient);
            }
           );
            if (list != null)
            {
                pagedList = new Paged<IngredientV2>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<IngredientV2> PaginateByCreatedById(int pageIndex, int pageSize, int userId)
        {
            Paged<IngredientV2> pagedList = null;
            List<IngredientV2> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Ingredients_Select_ByCreatedByV3]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
                param.AddWithValue("@CreatedBy", userId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                IngredientV2 ingredient = MapSingleIngredientV2(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<IngredientV2>();
                }
                list.Add(ingredient);
            }
           );
            if (list != null)
            {
                pagedList = new Paged<IngredientV2>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<IngredientV2> SearchPaginateByCreatedById(int pageIndex, int pageSize, int userId, string query)
        {
            Paged<IngredientV2> pagedList = null;
            List<IngredientV2> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Ingredients_Search_ByCreatedBy]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
                param.AddWithValue("@CreatedBy", userId);
                param.AddWithValue("@Query", query);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                IngredientV2 ingredient = MapSingleIngredientV2(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<IngredientV2>();
                }
                list.Add(ingredient);
            }
           );
            if (list != null)
            {
                pagedList = new Paged<IngredientV2>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public void IngredientDeleteById(int id)
        {
            string procName = "[dbo].[Ingredients_Delete_byId]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            });
        }
        public int AddIngredient(IngredientAddRequest model, int userId, int orgId)
        {
            int id = 0;
            DataTable myParamValue = MapFoodWarningTypeToTable(model.FoodWarningTypeId);
            string procName = "[dbo].[Ingredients_InsertV2]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParamsIngredient(model, col, userId);
                col.AddWithValue("@FoodWarningTypeId", myParamValue);
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@OrgId", orgId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object ooId = returnCollection["@Id"].Value;

                int.TryParse(ooId.ToString(), out id);
            });

            return id;
        }
        public void IngredientUpdate(IngredientUpdateRequest model, int userId, int orgId)
        {
            DataTable myParamValue = MapFoodWarningTypeToTable(model.FoodWarningTypeId);
            string procName = "[dbo].[Ingredients_UpdateV2]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParamsIngredient(model, col, userId);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@FoodWarningTypeId", myParamValue);
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@OrgId", orgId);
            },
            returnParameters: null);
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[Ingredients_Delete_byId]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            });
        }
        public List<Ingredient> SelectAllIngredientsByOrgId(int orgId)
        {
            List<Ingredient> list = null;
            Ingredient ingredient = null;
            string procName = "dbo.Ingredients_SelectAll_ByOrgId";
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@OrgId", orgId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                ingredient = MapSingleIngredient(reader, ref startingIndex);
                if (list == null)
                {
                    list = new List<Ingredient>();
                }
                list.Add(ingredient);
            });
            return list;
        }
        public List<IngredientBase> GetAllIngredients()
        {

            List<IngredientBase> list = null;

            string procName = "[dbo].[Ingredients_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    IngredientBase ingredient = MapSingleIngredientCsv(reader, ref startingIndex);

                    if (list == null)
                    {
                        list = new List<IngredientBase>();
                    }

                    list.Add(ingredient);
                }
          );
            return list;
        }
        public List<IngredientBase> GetAllIngredientsByFoodWarning()
        {

            List<IngredientBase> list = null;

            string procName = "[dbo].[Ingredients_SelectAll_ByFoodWarningType]";

            _data.ExecuteCmd(procName, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    IngredientBase ingredient = MapSingleIngredientCsv(reader, ref startingIndex);

                    if (list == null)
                    {
                        list = new List<IngredientBase>();
                    }

                    list.Add(ingredient);
                }
          );
            return list;
        }
        public List<IngredientCsvAddRequest> GetIngredientsCsvs(IFormFile[] file)
        {
            List<IngredientCsvAddRequest> records = null;
            foreach(IFormFile fileItem in file)
            {
            var newFile = fileItem.OpenReadStream();
            using (var streamReader = new StreamReader(newFile))
            {
                using (var csvReader = new CsvReader(streamReader, CultureInfo.InvariantCulture))
                {
                    records = csvReader.GetRecords<IngredientCsvAddRequest>().ToList();
                }
            }   
            }
            return records;
        }
        private DataTable MapIngredientsToTable(List<IngredientCsvAddRequest> list)
        {
            DataTable table = new DataTable();
            table.Columns.Add("Name", typeof(string));
            table.Columns.Add("UnitCost", typeof(Int32));
            table.Columns.Add("Description", typeof(string));
            table.Columns.Add("ImageUrl", typeof(string));
            table.Columns.Add("IsInStock", typeof(bool));
            table.Columns.Add("RestrictionId", typeof(Int32));
            table.Columns.Add("Quantity", typeof(Int32));
            table.Columns.Add("Measure", typeof(string));

            foreach (var ingredient in list)
            {
                DataRow row = table.NewRow();
                int startingIndex = 0;
                row.SetField(startingIndex++, ingredient.Name);
                row.SetField(startingIndex++, ingredient.UnitCost);
                row.SetField(startingIndex++, ingredient.Description);
                row.SetField(startingIndex++, ingredient.ImageUrl);
                row.SetField(startingIndex++, ingredient.IsInStock);
                row.SetField(startingIndex++, ingredient.RestrictionId);
                row.SetField(startingIndex++, ingredient.Quantity);
                row.SetField(startingIndex++, ingredient.Measure);
                table.Rows.Add(row);
            }

            return table;
        }
        public void AddIngredientCsv(List<IngredientCsvAddRequest> model, int userId, int orgId)
        {   
            DataTable ingredientsTable = null;
            if (model != null)
            {
                ingredientsTable = MapIngredientsToTable(model);
            }
            _data.ExecuteNonQuery("[dbo].[Ingredients_InsertBatch]",
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@batchIngredients", ingredientsTable);
                    col.AddWithValue("@CreatedBy", userId);
                    col.AddWithValue("@OrganizationId", orgId);
                });       
        }
        private static void AddCommonParamsIngredient(IngredientAddRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@UnitCost", model.UnitCost);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
            col.AddWithValue("@IsInStock", model.IsInStock);
            col.AddWithValue("@IsDeleted", model.IsDeleted);
            col.AddWithValue("@Quantity", model.Quantity);
            col.AddWithValue("@Measure", model.Measure);
            col.AddWithValue("@RestrictionId", model.RestrictionId);
            
        }
        private static Ingredient MapSingleIngredient(IDataReader reader, ref int startingIndex)
        {
            Ingredient ingredient = new Ingredient();
            ingredient.Restriction = new LookUp();
            ingredient.FoodWarning = new LookUp();

            ingredient.Id = reader.GetSafeInt32(startingIndex++);
            ingredient.OrganizationId = reader.GetSafeInt32(startingIndex++);
            ingredient.Name = reader.GetSafeString(startingIndex++);
            ingredient.UnitCost = reader.GetSafeDecimal(startingIndex++);
            ingredient.Description = reader.GetSafeString(startingIndex++);
            ingredient.ImageUrl = reader.GetSafeString(startingIndex++);
            ingredient.IsInStock = reader.GetSafeBool(startingIndex++);
            ingredient.IsDeleted = reader.GetSafeBool(startingIndex++);
            ingredient.Restriction.Id = reader.GetSafeInt32(startingIndex++);
            ingredient.Restriction.Name = reader.GetSafeString(startingIndex++);
            ingredient.Quantity = reader.GetSafeInt32(startingIndex++);
            ingredient.Measure = reader.GetSafeString(startingIndex++);
            ingredient.CreatedBy = reader.GetSafeInt32(startingIndex++);
            ingredient.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            ingredient.FoodWarning.Id = reader.GetSafeInt32(startingIndex++);
            ingredient.FoodWarning.Name = reader.GetSafeString(startingIndex++);
            ingredient.DateCreated = reader.GetSafeDateTime(startingIndex++);
            ingredient.DateModified = reader.GetSafeDateTime(startingIndex++);

            return ingredient;
        }
        public IngredientV2 MapSingleIngredientV2(IDataReader reader, ref int startingIndex)
        {
            IngredientV2 ingredient = new IngredientV2();
            ingredient.Restriction = new LookUp();

            ingredient.Id = reader.GetSafeInt32(startingIndex++);
            ingredient.OrganizationId = reader.GetSafeInt32(startingIndex++);
            ingredient.Name = reader.GetSafeString(startingIndex++);
            ingredient.UnitCost = reader.GetSafeDecimal(startingIndex++);
            ingredient.Description = reader.GetSafeString(startingIndex++);
            ingredient.ImageUrl = reader.GetSafeString(startingIndex++);
            ingredient.IsInStock = reader.GetSafeBool(startingIndex++);
            ingredient.IsDeleted = reader.GetSafeBool(startingIndex++);
            ingredient.Restriction = _lookUpService.MapSingleLookUp(reader, ref startingIndex);          
            ingredient.Measure = reader.GetSafeString(startingIndex++);
            ingredient.Quantity = reader.GetSafeInt32(startingIndex++);
            ingredient.CreatedBy = reader.GetSafeInt32(startingIndex++);
            ingredient.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            ingredient.FoodWarningTypes = reader.DeserializeObject<List<LookUp>>(startingIndex++);
            ingredient.DateCreated = reader.GetSafeDateTime(startingIndex++);
            ingredient.DateModified = reader.GetSafeDateTime(startingIndex++);

            return ingredient;
        }
        public IngredientBase MapSingleIngredientCsv(IDataReader reader, ref int startingIndex)
        {
            IngredientBase ingredient = new IngredientBase();

            ingredient.Name = reader.GetSafeString(startingIndex++);
            ingredient.UnitCost = reader.GetSafeDecimal(startingIndex++);
            ingredient.Description = reader.GetSafeString(startingIndex++);
            ingredient.ImageUrl = reader.GetSafeString(startingIndex++);
            ingredient.IsInStock = reader.GetSafeBool(startingIndex++);
            ingredient.RestrictionId = reader.GetSafeInt32(startingIndex++);
            ingredient.Quantity = reader.GetSafeInt32(startingIndex++);
            ingredient.Measure = reader.GetSafeString(startingIndex++);

            return ingredient;
        }

        private DataTable MapFoodWarningTypeToTable(List<int> FoodWarnings)
        {
            DataTable table = new DataTable();
            table.Columns.Add("FoodWarningTypeId", typeof(Int32));
            foreach (int singleFoodWarning in FoodWarnings)
            {
                DataRow row = table.NewRow();
                int startingIndex = 0;
                row.SetField(startingIndex++, singleFoodWarning);
                table.Rows.Add(row);
            }

            return table;
        }
    }

}
