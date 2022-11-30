using CsvHelper.Configuration.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Sabio.Models.Requests.Ingredients
{
    public class IngredientAddRequest :IngredientCsvAddRequest
    {
        [Required]
        public bool IsDeleted { get; set; }

        [Required]      
        public List<int> FoodWarningTypeId { get; set; }

        
     
    }
}

