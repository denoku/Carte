using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Files;
using Sabio.Models.Ingredients;
using Sabio.Models.Requests.Files;
using Sabio.Models.Requests.Ingredients;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using File = Sabio.Models.Files.File;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileApiController : BaseApiController
    {
        private IFileService _fileService = null;
        private IAuthenticationService<int> _authService = null;

        private IIngredientsService _ingredientsService = null;

        private IOrganizationService _organizationService = null;
        public FileApiController(IFileService service
            , ILogger<FileApiController> logger
      
            , IAuthenticationService<int> authService, IIngredientsService ingredientsService, IOrganizationService organizationService) : base(logger)
        {
            _fileService = service;
            _authService = authService;
            _ingredientsService = ingredientsService;
            _organizationService = organizationService;
        }
        [HttpPost]
        public async Task<ActionResult<ItemsResponse<FileBase>>> UploadFile(List<IFormFile> files, bool isCsv)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<FileBase> res = await _fileService.UploadFileAsync(files, userId);
                ItemsResponse<FileBase> response = new ItemsResponse<FileBase>() { Items = res };
                result = StatusCode(200, response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPost("ingredients")]
        public ActionResult<SuccessResponse> UploadIngredients(IFormFile[] files)
        {
            int code = 201;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<IngredientCsvAddRequest> list = _ingredientsService.GetIngredientsCsvs(files);
                if (list != null)
                {
                    var currentOrg = _organizationService.GetOrgByUserId(userId);
                    var orgId = currentOrg.Id;
                    _ingredientsService.AddIngredientCsv(list, userId, orgId);
                    response = new SuccessResponse();
                }
                else
                {
                    code = 404;
                    response = new ErrorResponse("No ingredients uploaded");
                }

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemsResponse<Paged<File>>> Get(int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<File> paged = _fileService.Get(pageIndex, pageSize);

                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found"));
                }
                else
                {
                    ItemResponse<Paged<File>> response = new ItemResponse<Paged<File>>();
                    response.Item = paged;
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

        [HttpGet("paginatetype")]
        public ActionResult<ItemsResponse<Paged<File>>> GetByType(int pageIndex, int pageSize, int fileTypeId)
        {
            ActionResult result = null;

            try
            {
                Paged<File> paged = _fileService.GetByType(pageIndex, pageSize, fileTypeId);

                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found"));
                }
                else
                {
                    ItemResponse<Paged<File>> response = new ItemResponse<Paged<File>>();
                    response.Item = paged;
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

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(FileUpdateRequest model)
        {
            _fileService.Update(model);

            SuccessResponse response = new SuccessResponse();

            return Ok(response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<File>>> Search(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> page = _fileService.Search(pageIndex, pageSize, query);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);

        }
        [HttpDelete("delete")]
        public ActionResult<ItemResponse<int>> UpdateDeleteStatusV2(int id, int createdBy)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _fileService.UpdateDeleteStatusV2(id, createdBy);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpGet("get/isdeleted")]
        public ActionResult<ItemsResponse<File>> GetByIsDeleted()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<File> list = _fileService.GetByIsDeleted();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<File> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("paginate/all")]
        public ActionResult<ItemResponse<Paged<File>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<File> page = _fileService.GetAll(pageIndex, pageSize);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("select")]
        public ActionResult<ItemResponse<Paged<File>>> GetByFileTypeId(int pageIndex, int pageSize, int fileTypeId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<File> page = _fileService.GetByFileTypeId(pageIndex, pageSize, fileTypeId);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}
 
