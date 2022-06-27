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
    public class GroupTrainingController : ApiController
    {
        private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.GroupTraningsFile);
        private string coachPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.CoachFile);

        [HttpPost]
        public HttpResponseMessage AddGroupTraining([FromBody]GroupTraining training, string username)
        {      
            List<GroupTraining> result = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path);
            if (result.Count > 0)
                training.Id = result[result.Count - 1].Id + 1;
            else
                training.Id = 0;

            List<GroupTraining> trainings = new List<GroupTraining>() { training };
            foreach (GroupTraining f in result)
            {
                if (f.Id == training.Id)
                {
                    HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.BadRequest);
                    return message;
                }
            }

            if (WorkingWithFiles.AddEntitiesToFile<GroupTraining>(trainings, path))
            {
                AddTrainingToCoach(training.Id, username);

                return new HttpResponseMessage(HttpStatusCode.Created);
            }

            return new HttpResponseMessage(HttpStatusCode.InternalServerError);

        }

        [HttpDelete]
        public HttpResponseMessage DeleteGroupTraining(int id)
        {
            GroupTraining temp = null;
            List<GroupTraining> centers = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path);
            foreach (GroupTraining c in centers)
            {
                if (c.Id == id)
                {
                    temp = c;
                }
            }
            HttpResponseMessage message;

            if (temp != null)
            {
                centers.Remove(temp);
                message = new HttpResponseMessage(HttpStatusCode.OK);
            }
            else
            {
                message = new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            WorkingWithFiles.AddEntitiesToFile<GroupTraining>(centers, path);

            return message;

        }

        [Route("api/GroupTraining/AllGroups/{id}")]
        public string GetAllGroupTrainigsByFitnessCenterId(int id)
        {
            List<GroupTraining> result = new List<GroupTraining>();
            List<GroupTraining> trainings = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path);
            foreach(GroupTraining t in trainings)
            {
                if(t.Place == id)
                {
                    result.Add(t);
                }
            }

            return JsonSerializer.Serialize(result);
        }

        [Route("api/GroupTrainingForCoach")]
        public string GetCoachesByFitnessCenter(string username)
        {
            List<GroupTraining> result = new List<GroupTraining>();
            List<Coach> coaches = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(coachPath);
            List<GroupTraining> trainings = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path);

            Coach coach = coaches.FirstOrDefault(x => x.Username.Equals(username));
            if(coach == null || coach.TrainerForGroups == null || coach.TrainerForGroups.Count <= 0)
            {
                return JsonSerializer.Serialize(result);
            }

           foreach(GroupTraining training in trainings)
            {
                if(coach.TrainerForGroups.Contains(training.Id))
                {
                    result.Add(training);
                }
            }

            return JsonSerializer.Serialize(result);

        }

        [HttpGet]
        public string GetGroupTraining(int id)
        {

            List<GroupTraining> centers = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path);

            GroupTraining center = centers.FirstOrDefault(x => x.Id == id);

            return JsonSerializer.Serialize(center);

        }

        [HttpGet]
        public string GetAllGroupTrainings()
        {
            return JsonSerializer.Serialize(WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path));
        }


        private bool AddTrainingToCoach(int id, string username)
        {
            List<Coach> coaches = WorkingWithFiles.ReadEntitiesFromFIle<Coach>(coachPath);
            Coach coach = coaches.FirstOrDefault(x => x.Username.Equals(username));
            if (coach != null)
            {
                coach.TrainerForGroups.Add(id);
                WorkingWithFiles.RewriteFileWithEntities<Coach>(coaches, coachPath);
                return true;
            }

            return false;
        }


    }
}
