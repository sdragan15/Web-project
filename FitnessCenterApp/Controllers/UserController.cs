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
            List<User> users = GetAllUsersFromFile();


            foreach (User u in users)
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

        [HttpGet]
        public string GetUser(string username)
        {
            List<User> users = GetAllUsersFromFile();
            User user = users.FirstOrDefault(x => x.Username.Equals(username));

            if(user == null)
            {
                return JsonSerializer.Serialize("");
            }

            return JsonSerializer.Serialize(user);
        }

        [HttpPut]
        public HttpResponseMessage UpdateUser(Visitor newUser)
        {
            if(newUser.UserRole == Role.VISITOR)
            {
                List<Visitor> visitors = WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(visitorsPath);
                Visitor oldUser = visitors.FirstOrDefault(x => x.Username.Equals(newUser.Username));
                if(oldUser == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "User not found in database");
                }

                oldUser.Name = newUser.Name;
                oldUser.Lastname = newUser.Lastname;
                oldUser.Password = newUser.Password;
                oldUser.UserGender = newUser.UserGender;
                oldUser.Birth = newUser.Birth;
                oldUser.Email = newUser.Email;

                WorkingWithFiles.RewriteFileWithEntities<Visitor>(visitors, visitorsPath);

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else if (newUser.UserRole == Role.COACH)
            {
                List<Coach> coaches = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(coachPath);
                Coach oldUser = coaches.FirstOrDefault(x => x.Username.Equals(newUser.Username));
                if (oldUser == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "User not found in database");
                }

                oldUser.Name = newUser.Name;
                oldUser.Lastname = newUser.Lastname;
                oldUser.Password = newUser.Password;
                oldUser.UserGender = newUser.UserGender;
                oldUser.Birth = newUser.Birth;
                oldUser.Email = newUser.Email;

                WorkingWithFiles.RewriteFileWithEntities<Coach>(coaches, coachPath);

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else if (newUser.UserRole == Role.OWNER)
            {
                List<Owner> owners = WorkingWithFiles.ReadEntitiesFromFIle<Owner>(ownersPath);
                Owner oldUser = owners.FirstOrDefault(x => x.Username.Equals(newUser.Username));
                if (oldUser == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "User not found in database");
                }

                oldUser.Name = newUser.Name;
                oldUser.Lastname = newUser.Lastname;
                oldUser.Password = newUser.Password;
                oldUser.UserGender = newUser.UserGender;
                oldUser.Birth = newUser.Birth;
                oldUser.Email = newUser.Email;

                WorkingWithFiles.RewriteFileWithEntities<Owner>(owners, ownersPath);

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Error in server");
            }

        }

      

        private List<User> GetAllUsersFromFile()
        {
            List<User> users = new List<User>();
            users.AddRange(WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(visitorsPath));
            users.AddRange(WorkingWithFiles.ReadEntitiesFromFIle<Owner>(ownersPath));
            users.AddRange(WorkingWithFiles.ReadEntitiesFromFIle<Coach>(coachPath));
            return users;
        }

        private Coach GetCoach(string username)
        {

            List<Coach> coaches = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(coachPath);

            Coach coach = coaches.FirstOrDefault(x => x.Username == username);

            return coach;
        }

    }
}
