using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Models
{
    public class Owner
    {
        public FitnessCenter OwnerOfFitnessCenter { get; set; }

        public Owner()
        {

        }
    }
}