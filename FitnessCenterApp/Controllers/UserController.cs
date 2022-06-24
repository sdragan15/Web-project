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
    public class UserController : ApiController
    {
        private string visitorsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.VisitorsFile);

        [HttpPost]
        public HttpResponseMessage LogIn(LoginModel login)
        {

            List<User> users = new List<User>();
            users.AddRange(ReadVisitorsFromFIle(visitorsPath));
            
            foreach(User u in users)
            {
                if (login.Username.Equals(u.Username) && login.Password.Equals(u.Password))
                {
                    string token = "token_" + login.Username;
                    return Request.CreateResponse(HttpStatusCode.OK, token);
                }
            }

            return Request.CreateResponse(HttpStatusCode.BadGateway, "Username or password is invalid");
            
        }

        private List<Visitor> ReadVisitorsFromFIle(string path)
        {
            try
            {
                string data = File.ReadAllText(path);
                List<Visitor> visitors = JsonSerializer.Deserialize<List<Visitor>>(data);
                return visitors;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return new List<Visitor>();
            }
        }
    }
}
