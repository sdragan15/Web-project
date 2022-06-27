using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Models
{
    public class Coach: User
    {
        public List<int> TrainerForGroups { get; set; }
        public int WorkingInFitnessCenter { get; set; }
        public bool Blocked { get; set; }

        public Coach()
        {
            Blocked = false;
            WorkingInFitnessCenter = -1;
            TrainerForGroups = new List<int>();
        }
    }
}