using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Models
{
    public abstract class User
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }
        public Gender UserGender { get; set; }
        public string Email { get; set; }
        public DateTime Birth { get; set; }
        public Role UserRole { get; set; }
    }
}