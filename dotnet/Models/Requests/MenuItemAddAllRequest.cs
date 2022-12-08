using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.MenuItems
{
    public class MenuItemAddAllRequest:MenuItemAddRequestV2
    {
       
        public List<int> MenuFoodSafeTypes { get; set; }
        public List<int> TagIds { get; set; }
        public List<int> MenuIngredients { get; set; }

       
    }
}
