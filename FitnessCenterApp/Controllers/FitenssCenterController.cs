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

        [HttpDelete]
        public HttpResponseMessage DeleteFitnessCenter(int id)
        {
            FitnessCenter temp = null;
            List<FitnessCenter> centers = WorkingWithFiles.ReadEntitiesFromFIle<FitnessCenter>(path);
            foreach(FitnessCenter c in centers)
            {
                if(c.Id == id)
                {
                    temp = c;
                }
            }
            HttpResponseMessage message;

            if(temp != null)
            {
                centers.Remove(temp);
                message = new HttpResponseMessage(HttpStatusCode.OK);
            }
            else
            {
                message = new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            WorkingWithFiles.AddEntitiesToFile<FitnessCenter>(centers, path);

            return message;

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
