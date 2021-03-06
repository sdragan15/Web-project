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
    public class CoachController : ApiController
    {
        private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.CoachFile);

        [HttpPost]
        public HttpResponseMessage RegisterCoach(Coach user)
        {
            List<Coach> visitors = new List<Coach>() { user };

            List<Coach> registeredVisitors = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(path);

            if (Registration.CheckIfUsernameExist(user.Username))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Username already exists");
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

        [Route("api/CoachByFitnessCenter/{id}")]
        public string GetCoachesByFitnessCenter(int id)
        {
            List<Coach> result = new List<Coach>();
            List<Coach> coaches = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(path);
            
            foreach (Coach coach in coaches)
            {
               if(coach.WorkingInFitnessCenter == id)
                {
                    result.Add(coach);
                }
            }

            return JsonSerializer.Serialize(result);

        }

        [HttpGet]
        public string GetAllCoaches()
        {
            return JsonSerializer.Serialize(WorkingWithFiles.ReadEntitiesFromFIle<Coach>(path));
        }


        [HttpGet]
        public string GetUser(string username)
        {
            List<Coach> users = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(path);
            Coach user = users.FirstOrDefault(x => x.Username.Equals(username));

            if (user == null)
            {
                return JsonSerializer.Serialize("");
            }

            return JsonSerializer.Serialize(user);
        }


        [HttpPut]
        [Route("api/AddCoachToCenter")]
        public HttpResponseMessage AddCoachToFitnessCenter(int id, string username)
        {
            List<Coach> coaches = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(path);
            Coach coach = coaches.FirstOrDefault(x => x.Username.Equals(username));
            if (coach != null)
            {
                if (coach.WorkingInFitnessCenter != -1)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Trainer already works in some fitness center");
                }
                coach.WorkingInFitnessCenter = id;
                coach.Blocked = false;
                WorkingWithFiles.RewriteFileWithEntities<Coach>(coaches, path);
                return Request.CreateResponse(HttpStatusCode.OK);
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid username");
        }

        [HttpPut]
        [Route("api/BlockCoach")]
        public HttpResponseMessage BlockOrUnblockCoach(int block, string username)
        {
            int index = -1;
            List<Coach> coaches = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(path);
            index = coaches.FindIndex(x => x.Username.Equals(username));
            if (index != -1)
            {
                if (block == 1)
                {
                    coaches[index].Blocked = true;
                }
                else
                {
                    coaches[index].Blocked = false;
                }

                WorkingWithFiles.RewriteFileWithEntities<Coach>(coaches, path);
                return Request.CreateResponse(HttpStatusCode.OK);
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest, "Bad request");
        }

        [HttpPut]
        [Route("api/QuitWorker")]
        public HttpResponseMessage QuitTheWorker(string username)
        {
            int index = -1;
            List<Coach> coaches = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(path);
            index = coaches.FindIndex(x => x.Username.Equals(username));
            if (index != -1)
            {
                coaches[index].WorkingInFitnessCenter = -1;

                WorkingWithFiles.RewriteFileWithEntities<Coach>(coaches, path);
                return Request.CreateResponse(HttpStatusCode.OK);
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest, "Bad request");
        }
    }
}
