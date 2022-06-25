using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Models
{
    public class Owner: User
    {
        public int OwnerOfFitnessCenter { get; set; }       // id of fitness center

        public Owner()
        {

        }
    }
}