using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Models
{
    public class Comment
    {
        public User FromUser { get; set; }
        public FitnessCenter ToFitnessCenter { get; set; }
        public string Text { get; set; }
        public int Grade { get; set; }
    }
}