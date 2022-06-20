using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FitnessCenterApp.Controllers
{
    public class HomeController : ApiController
    {
        public List<int> GetInt()
        {
            return new List<int> {1, 23, 4 };
        }
        
    }
}
