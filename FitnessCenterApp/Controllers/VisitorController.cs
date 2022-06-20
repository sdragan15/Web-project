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

        [HttpPost]
        public HttpResponseMessage AddVisitor(Visitor user)
        {  
            string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.UsersFile);
            List<Visitor> visitors = new List<Visitor>() { user };

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
