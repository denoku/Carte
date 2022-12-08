using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Menus;
using Sabio.Models.Requests.MenuModifications;

namespace Sabio.Models.Requests.Menus
{
    public class MenuAddRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }
        [Required]
        public int OrganizationId { get; set; }
        [StringLength(500, MinimumLength = 2)]
        public string Description { get; set; }
        [Range(1, int.MaxValue)]
        public int FileId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [Required]
        public TimeSpan StartTime { get; set; }
        [Required]
        public TimeSpan EndTime { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int TimeZoneId { get; set; }
        public List<int> MenuDays { get; set; }
        public List<MenuSectionAddRequest> MenuSections { get; set; }
    }
}
