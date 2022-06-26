using FitnessCenterApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FitnessCenterApp.Controllers
{
    public class CoachController : ApiController
    {
        private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.CoachFile);

        [HttpPost]
        public HttpResponseMessage RegisterVisitor(Coach user)
        {
            List<Coach> visitors = new List<Coach>() { user };

            List<Coach> registeredVisitors = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(path);
            foreach (Coach visitor in registeredVisitors)
            {
                if (visitor.Username == user.Username)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Username already exists");
                }
            }

            if (WorkingWithFiles.AddEntitiesToFile<Coach>(visitors, path))
            {
                HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.Created);
                return message;
            }
            else
            {
                HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                return message;
            }

        }
    }
}
