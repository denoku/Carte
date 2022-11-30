using CsvHelper.Configuration.Attributes;
using Sabio.Models.Domain;
using System;

namespace Sabio.Models.Ingredients
{
    public class Ingredient : IngredientBase
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public LookUp Restriction { get; set; }
        public bool IsDeleted { get; set; } 
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public LookUp FoodWarning { get; set; }

    }
}
