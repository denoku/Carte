using CsvHelper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Files;
using Sabio.Models.Ingredients;
using Sabio.Models.Requests.Ingredients;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/ingredients")]
    [ApiController]
    public class IngredientsApiController : BaseApiController
    {
        private IIngredientsService _service = null;
        private IAuthenticationService<int> _authService = null;
        private IOrganizationService _orgService = null;

        public IngredientsApiController(IIngredientsService service, IOrganizationService orgService, ILogger<IngredientsApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
            _orgService = orgService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Ingredient>> GetIngredientById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Ingredient ingredient = _service.GetIngredientById(id);

                if (ingredient == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Ingredient> { Item = ingredient };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("organization")]
        public ActionResult<ItemResponse<Paged<Ingredient>>> PaginateByOrgId(int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                var currentOrg = _orgService.GetOrgByUserId(userId);
                var orgId = currentOrg.Id;
                Paged<IngredientV2> page = _service.PaginateByOrgId(pageIndex, pageSize, orgId);

                if (page == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found"));
                }
                else
                {
                    ItemResponse<Paged<IngredientV2>> response = new ItemResponse<Paged<IngredientV2>>();
                    response.Item = page;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<IngredientV2>>> PaginateByCreatedById(int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();


                Paged<IngredientV2> page = _service.PaginateByCreatedById(pageIndex, pageSize, userId);

                if (page == null)
                {
                    result = NotFound404(new ErrorResponse("User not found."));
                }
                else
                {
                    ItemResponse<Paged<IngredientV2>> response = new ItemResponse<Paged<IngredientV2>>();
                    response.Item = page;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }
        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<IngredientV2>>> SearchByCreatedById(int pageIndex, int pageSize, string query)
        {
            ActionResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<IngredientV2> page = _service.SearchPaginateByCreatedById(pageIndex, pageSize, userId, query);

                if (page == null)
                {
                    result = NotFound404(new ErrorResponse("User not found."));
                }
                else
                {
                    ItemResponse<Paged<IngredientV2>> response = new ItemResponse<Paged<IngredientV2>>();
                    response.Item = page;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> IngredientDeleteById(int id)

        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.IngredientDeleteById(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);

            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(IngredientAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                var currentOrg = _orgService.GetOrgByUserId(userId);
                var orgId = currentOrg.Id;
                int id = _service.AddIngredient(model, userId, orgId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> IngredientUpdate(IngredientUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                var currentOrg = _orgService.GetOrgByUserId(userId);
                var orgId = currentOrg.Id;
                _service.IngredientUpdate(model, userId, orgId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("organizations/{orgId:int}")]
        public ActionResult<ItemsResponse<List<Ingredient>>> GetIngredientsByOrgId(int orgId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                List<Ingredient> list = _service.SelectAllIngredientsByOrgId(orgId);
                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<Ingredient> { Items = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }
    }
}
    
