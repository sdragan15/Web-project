using FitnessCenterApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Web.Http;

namespace FitnessCenterApp.Controllers
{
    public class VisitorController : ApiController
    {
        private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.VisitorsFile);

        [HttpPost]
        public HttpResponseMessage RegisterVisitor(Visitor user)
        {
            List<Visitor> visitors = new List<Visitor>() { user };

            List<Visitor> registeredVisitors = WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(path);
            if (Registration.CheckIfUsernameExist(user.Username))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Username already exists");
            }

            if (WorkingWithFiles.AddEntitiesToFile<Visitor>(visitors, path))
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

        [HttpGet]
        public string GetVisitor(string username)
        {
            
            List<Visitor> visitors = WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(path);

            Visitor visitor = visitors.FirstOrDefault(x => x.Username == username);

            return JsonSerializer.Serialize(visitor);

        }

        [HttpGet]
        [Route("api/VisitorsForTraining/{id}")]
        public string GetAllVisitorsForTraining(int id)
        {

            List<Visitor> visitors = WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(path);

            IEnumerable<Visitor> result = visitors.Where(x => x.RegisteredTrainings.Contains(id));
            result.ToList();

            return JsonSerializer.Serialize(result);

        }

        [Route("api/Visitor/Number/{id}")]
        public string GetNumberOfVisitorsByTrainingID(int id)
        {

            List<Visitor> visitors = WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(path);
            int count = 0;
            foreach(Visitor visitor in visitors)
            {
                if (visitor.RegisteredTrainings != null && visitor.RegisteredTrainings.Contains(id))
                {
                    count++;
                }
            }

            return JsonSerializer.Serialize(count);

        }

        [HttpPut]
        public HttpResponseMessage UpdateVisitor(Visitor visitor)
        {
            List<Visitor> visitors = WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(path);

            Visitor temp = null;

            foreach(Visitor v in visitors)
            {
                if(v.Username == visitor.Username)
                {
                    temp = v;
                }
            }

            HttpResponseMessage message;

            if(temp != null)
            {
                temp = visitor;
                 message = new HttpResponseMessage(HttpStatusCode.OK);
            }

            message = new HttpResponseMessage(HttpStatusCode.InternalServerError);

            WorkingWithFiles.AddEntitiesToFile<Visitor>(visitors, path);

            return message;

        }

        [HttpGet]
        public string GetAllVisitors()
        {
            return JsonSerializer.Serialize(WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(path));
        }

        
    }
}
