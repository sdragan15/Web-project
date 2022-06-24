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
            //Visitor temp = new Visitor();
            //temp.Name = "Milica";
            //temp.Lastname = "Milic";
            //temp.Username = "micka";
            //temp.Password = "milica123";
            //temp.RegisteredTrainings = new List<int>() { 0 };
            //temp.UserGender = Gender.FEMALE;
            //temp.UserRole = Role.VISITOR;
            //temp.Email = "milica@gmail.com";
            //temp.Birth = new DateTime(2000, 2, 1);

            List<Visitor> visitors = new List<Visitor>() { user };

            List<Visitor> registeredVisitors = ReadVisitorsFromFIle(path);
            foreach(Visitor visitor in registeredVisitors)
            {
                if(visitor.Username == user.Username)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Username already exists");
                }
            }

            if(AddVisitorsToFile(visitors, path))
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
            
            List<Visitor> visitors = ReadVisitorsFromFIle(path);

            Visitor visitor = visitors.FirstOrDefault(x => x.Username == username);

            return JsonSerializer.Serialize(visitor);

        }

        [Route("api/Visitor/Number/{id}")]
        public string GetNumberOfVisitorsByTrainingID(int id)
        {

            List<Visitor> visitors = ReadVisitorsFromFIle(path);
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
            List<Visitor> visitors = ReadVisitorsFromFIle(path);

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

            AddVisitorsToFile(visitors, path);

            return message;

        }

        [HttpGet]
        public string GetAllVisitors()
        {
            return JsonSerializer.Serialize(ReadVisitorsFromFIle(path));
        }

        private List<Visitor> ReadVisitorsFromFIle(string path)
        {
            try
            {
                string data = File.ReadAllText(path);
                List<Visitor> visitors = JsonSerializer.Deserialize<List<Visitor>>(data);
                return visitors;
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return new List<Visitor>();
            }       
        }

        private bool AddVisitorsToFile(List<Visitor> visitorList, string path)
        {
            try
            {
                List<Visitor> visitors = ReadVisitorsFromFIle(path);

                visitorList.ForEach(x => visitors.Add(x));

                string result = JsonSerializer.Serialize<List<Visitor>>(visitors);

                using (FileStream fs = new FileStream(path, FileMode.OpenOrCreate, FileAccess.Write))
                using (StreamWriter sw = new StreamWriter(fs))
                {
                    sw.Write(result);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
