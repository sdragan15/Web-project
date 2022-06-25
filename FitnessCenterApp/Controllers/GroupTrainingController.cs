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

        [HttpPost]
        public HttpResponseMessage AddGroupTraining(GroupTraining training)
        {

            //GroupTraining temp = new GroupTraining();
            //temp.DateAndTime = new DateTime();
            //temp.Duration = 60;
            //temp.MaxVisitors = 100;
            //temp.Name = "training 2";
            //temp.Place = 1;
            //temp.TrainingType = TypeOfTraining.BODY_PUMP;
            

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

        

    }
}
