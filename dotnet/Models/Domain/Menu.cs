using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Menus
{
    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OrganizationId { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsPublished { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int TimeZoneId { get; set; }
        public List<MenuItem> MenuItems { get; set; }
        public List<LookUp> MenuDays { get; set; }
        public List<MenuSections> MenuSections { get; set; }
    }
}