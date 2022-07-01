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
    public class FitenssCenterController : ApiController
    {
        private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.FitnessCenterFile);
        private string trainingPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.GroupTraningsFile);

        [HttpPost]
        public HttpResponseMessage AddFitnessCenter(FitnessCenter center)
        {
            //FitnessCenter temp = new FitnessCenter();
            //temp.FitnessAddress = new Address() { City = "Novi Sad", PostalCode = "12322", StreetAndNumber = "Bulevar Oslobodjenja" };
            //temp.FitnessOwner = "Miladin123";
            //temp.GroupTrainingCost = 800;
            //temp.Id = 1;
            //temp.MonthlyMembershipCost = 3000;
            //temp.Name = "Synergy";
            //temp.Opened = 2010;
            //temp.ProffesionalTrainingCost = 900;
            //temp.TrainingCost = 500;
            //temp.YearlyembershipCost = 20000;

            List<FitnessCenter> fitnesses = WorkingWithFiles.ReadEntitiesFromFIle<FitnessCenter>(path);
            if (fitnesses.Count > 0)
                center.Id = fitnesses[fitnesses.Count - 1].Id + 1;
            else
                center.Id = 0;

            List<FitnessCenter> centers = new List<FitnessCenter>() { center };
            foreach (FitnessCenter f in fitnesses)
            {
                if (f.Id == center.Id)
                {
                    HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.BadRequest);
                    return message;
                }
            }

            if (WorkingWithFiles.AddEntitiesToFile<FitnessCenter>(centers, path))
            {
                return new HttpResponseMessage(HttpStatusCode.Created);
            }

            return new HttpResponseMessage(HttpStatusCode.InternalServerError);

        }

        [HttpPut]
        public HttpResponseMessage UpdateFitnessCenter(FitnessCenter fitnessCenter)
        {
            int index = -1;
            List<FitnessCenter> centers = WorkingWithFiles.ReadEntitiesFromFIle<FitnessCenter>(path);
            index = centers.FindIndex(x => x.Id == fitnessCenter.Id);
            if(index != -1)
            {
                centers[index] = fitnessCenter;
                if (WorkingWithFiles.RewriteFileWithEntities<FitnessCenter>(centers, path))
                {
                    return new HttpResponseMessage(HttpStatusCode.OK);
                }
                return new HttpResponseMessage(HttpStatusCode.InternalServerError);
            }

            return new HttpResponseMessage(HttpStatusCode.BadRequest);

        }

        [HttpDelete]
        public HttpResponseMessage DeleteFitnessCenter(int id)
        {
            int index = -1;
            List<FitnessCenter> centers = WorkingWithFiles.ReadEntitiesFromFIle<FitnessCenter>(path);
            List<GroupTraining> trainings = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(trainingPath);
            index = centers.FindIndex(x => x.Id == id);

            if (index != -1)
            {
                foreach(GroupTraining t in trainings)
                {
                    if(t.Deleted == false && t.Place == id && !CommentController.DateInPast(t.DateAndTime.Date))
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Fitness center has trainigs in future");
                    }
                }

                centers[index].Deleted = true;

                WorkingWithFiles.RewriteFileWithEntities<FitnessCenter>(centers, path);
                return  Request.CreateResponse(HttpStatusCode.OK);
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest, "Fitness NOT deleted");

        }

        [Route("api/GetPlaceName/{id}")]
        public string GetPlaceNameById(int id)
        {
            List<FitnessCenter> centers = WorkingWithFiles.ReadEntitiesFromFIle<FitnessCenter>(path);
            FitnessCenter center = centers.FirstOrDefault(x => x.Id == id);

            if (center == null)
            {
                return JsonSerializer.Serialize("");
            }

            return JsonSerializer.Serialize(center.Name);
        }

        [HttpGet]
        public string GetFitnessCenter(int id)
        {

            List<FitnessCenter> centers = WorkingWithFiles.ReadEntitiesFromFIle<FitnessCenter>(path);

            FitnessCenter center = centers.FirstOrDefault(x => x.Id == id);

            return JsonSerializer.Serialize(center);

        }

        [Route("api/FitenssCenterForOwner")]
        public string GetFitnessCenterForOwner([FromUri]string username)
        {
            List<FitnessCenter> centers = WorkingWithFiles.ReadEntitiesFromFIle<FitnessCenter>(path);
            List<FitnessCenter> result = new List<FitnessCenter>();

            foreach(FitnessCenter center in centers)
            {
                if (center.FitnessOwner.Equals(username))
                {
                    result.Add(center);
                }
            }

            return JsonSerializer.Serialize(result);
       
        }

        [HttpGet]
        public string GetAllFitnessCenters()
        {
            return JsonSerializer.Serialize(WorkingWithFiles.ReadEntitiesFromFIle<FitnessCenter>(path));
        }

    }
}
