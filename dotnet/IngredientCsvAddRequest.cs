using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Ingredients
{
    public class IngredientCsvAddRequest
    {                                                                   
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal UnitCost { get; set; }
        [StringLength(300, MinimumLength = 2)]
        public string Description { get; set; }
        [StringLength(500, MinimumLength = 2)]
        public string ImageUrl { get; set; }
        [Required]
        public bool IsInStock { get; set; }
        public int RestrictionId { get; set; }
        public int Quantity { get; set; }
        [StringLength(100, MinimumLength = 2)]
        public string Measure { get; set; }
    }
}
