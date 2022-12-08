using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Menus
{
    public class MenuUpdateRequest : MenuAddRequest, IModelIdentifier
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Id { get; set; }
        [Required]
        [Range(0,1)]
        public bool IsDeleted { get; set; }
        [Required]
        [Range(0, 1)]
        public bool IsPublished{ get; set; }
    }
}
