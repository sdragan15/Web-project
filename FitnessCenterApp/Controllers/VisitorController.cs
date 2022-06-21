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
        private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.UsersFile);

        [HttpPost]
        public HttpResponseMessage RegisterVisitor(Visitor user)
        {  
            List<Visitor> visitors = new List<Visitor>() { user };

            List<Visitor> registeredVisitors = ReadVisitorsFromFIle(path);
            foreach(Visitor visitor in registeredVisitors)
            {
                if(visitor.Username == user.Username)
                {
                    HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.BadRequest);
                    return message;
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
