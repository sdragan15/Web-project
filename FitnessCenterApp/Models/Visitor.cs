using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Models
{
    public class Visitor: User
    {
        public List<GroupTraining> RegisteredTrainings { get; set; }

        public Visitor()
        {

        }

        
    }
}