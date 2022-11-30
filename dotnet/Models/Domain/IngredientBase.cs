using CsvHelper.Configuration.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Ingredients
{
    public class IngredientBase
    {
        public string Name { get; set; }
        public decimal UnitCost { get; set; } 
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public bool IsInStock { get; set; }
        public int RestrictionId { get; set; }
        public int Quantity { get; set; }
        public string Measure { get; set; }
     }
}
