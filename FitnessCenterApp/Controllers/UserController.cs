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
        private string ownersPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.OwnersFile);
        private string coachPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.CoachFile);

        [HttpPost]
        public HttpResponseMessage LogIn(LoginModel login)
        {
            List<User> users = new List<User>();
            users.AddRange(WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(visitorsPath));
            users.AddRange(WorkingWithFiles.ReadEntitiesFromFIle<Owner>(ownersPath));
            users.AddRange(WorkingWithFiles.ReadEntitiesFromFIle<Coach>(coachPath));
            
            foreach(User u in users)
            {
                if (login.Username.Equals(u.Username) && login.Password.Equals(u.Password))
                {
                    if(u.UserRole == Role.COACH)
                    {
                        Coach coach = GetCoach(u.Username);
                        if(coach == null || coach.WorkingInFitnessCenter == -1)
                        {
                            return Request.CreateResponse(HttpStatusCode.Unauthorized, "Coach is not verified by owner of fitness center");
                        }
                        else if (coach.Blocked)
                        {
                            return Request.CreateResponse(HttpStatusCode.Unauthorized, "Coach is blocked by owner of fitness center");
                        }
                    }
                    string token = "token_" + login.Username;
                    return Request.CreateResponse(HttpStatusCode.OK, new { token, u.UserRole });
                }
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest, "Username or password is invalid");
            
        }


        private Coach GetCoach(string username)
        {

            List<Coach> coaches = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(coachPath);

            Coach coach = coaches.FirstOrDefault(x => x.Username == username);

            return coach;
        }

    }
}
