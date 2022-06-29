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
        private string fitnessPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.FitnessCenterFile);

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
            List<GroupTraining> trainings = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path);

            temp = trainings.FirstOrDefault(x => x.Id == id);


            if (temp != null && (temp.Visitors == null || temp.Visitors.Count == 0))
            {
                temp.Deleted = true;
                WorkingWithFiles.RewriteFileWithEntities<GroupTraining>(trainings, path);
                return new HttpResponseMessage(HttpStatusCode.OK);
            }

            return Request.CreateResponse(HttpStatusCode.InternalServerError, "Error with deleting training, maybe it has registered visitors");

        }

        [HttpPut]
        public HttpResponseMessage UpdateGroupTraining(GroupTraining training)
        {
            List<GroupTraining> trainings = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path);
            GroupTraining editedTraining = trainings.FirstOrDefault(x => x.Id == training.Id);

            if(editedTraining != null)
            {
                editedTraining.Name = training.Name;
                editedTraining.MaxVisitors = training.MaxVisitors;
                editedTraining.TrainingType = training.TrainingType;
                editedTraining.Duration = training.Duration;
                editedTraining.DateAndTime = training.DateAndTime;
                editedTraining.Place = training.Place;

                WorkingWithFiles.RewriteFileWithEntities<GroupTraining>(trainings, path);
                return Request.CreateResponse(HttpStatusCode.OK);

            }

            return Request.CreateResponse(HttpStatusCode.BadRequest, "Training dont exist in database");
        }

        [Route("api/GroupTraining/AllGroups/{id}")]
        public string GetAllGroupTrainigsByFitnessCenterId(int id)
        {
            List<GroupTraining> result = new List<GroupTraining>();
            List<GroupTraining> trainings = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path);
            foreach(GroupTraining t in trainings)
            {
                if(t.Place == id && t.Deleted == false)
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
                if(coach.TrainerForGroups.Contains(training.Id) && training.Deleted == false)
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
            List<GroupTraining> trainings = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(path);
            IEnumerable<GroupTraining> result = trainings.Where(x => x.Deleted == false);
            result = result.ToList();
            return JsonSerializer.Serialize(result);
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
