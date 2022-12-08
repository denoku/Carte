using Microsoft.AspNetCore.Http;
using Sabio.Models;
using Sabio.Models.Files;
using Sabio.Models.Ingredients;
using Sabio.Models.Requests.Ingredients;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IIngredientsService
    {
        Ingredient GetIngredientById(int id);
        Paged<IngredientV2> PaginateByOrgId(int pageIndex, int pageSize, int organizationId);
        Paged<IngredientV2> PaginateByFoodWarning(int pageIndex, int pageSize, int organizationId, int fwt);
        Paged<IngredientV2> PaginateByRestriction(int pageIndex, int pageSize, int orgId, int restrictionId);
        Paged<IngredientV2> PaginateByCreatedById(int pageIndex, int pageSize, int userId);
        Paged<IngredientV2> SearchPaginateByOrgId(int pageIndex, int pageSize, int orgId, string query);
        void IngredientDeleteById(int id);
        int AddIngredient(IngredientAddRequest model, int userId, int orgId);
        void IngredientUpdate(IngredientUpdateRequest model, int userId, int orgId);
        public List<Ingredient> SelectAllIngredientsByOrgId(int orgId);
        public List<IngredientBase> GetAllIngredients();
        public List<IngredientCsvAddRequest> GetIngredientsCsvs(IFormFile[] file);
        public void AddIngredientCsv(List<IngredientCsvAddRequest> model, int userId, int orgId);
    }
}


