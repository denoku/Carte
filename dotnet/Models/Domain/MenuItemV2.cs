using Sabio.Models.Ingredients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.MenuItems
{
    public class MenuItemV2
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public  int OrderStatusId { get; set; }
        public decimal UnitCost { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsPublic { get; set; }
    }
}
