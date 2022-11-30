using Sabio.Models.Domain;
using System;
using System.Collections.Generic;

namespace Sabio.Models.Ingredients
{
    public class IngredientV2
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public string Name { get; set; }
        public decimal UnitCost { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public bool IsInStock { get; set; }
        public bool IsDeleted { get; set; }
        public LookUp Restriction { get; set; }
        public string Measure { get; set; }
        public int Quantity { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public List<LookUp> FoodWarningTypes { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}