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
            FitnessCenter temp = new FitnessCenter();
            temp.FitnessAddress = new Address() { City = "Novi Sad", PostalCode = "12322", StreetAndNumber = "Bulevar Oslobodjenja" };
            temp.FitnessOwner = "Miladin123";
            temp.GroupTrainingCost = 800;
            temp.Id = 1;
            temp.MonthlyMembershipCost = 3000;
            temp.Name = "Synergy";
            temp.Opened = 2010;
            temp.ProffesionalTrainingCost = 900;
            temp.TrainingCost = 500;
            temp.YearlyembershipCost = 20000;

            List<FitnessCenter> fitnesses = ReadFitnessCenterFromFIle(path);
            if (fitnesses.Count > 0)
                center.Id = fitnesses[fitnesses.Count - 1].Id + 1;
            else
                center.Id = 0;

            List<FitnessCenter> centers = new List<FitnessCenter>() { temp };
            foreach (FitnessCenter f in fitnesses)
            {
                if (f.Id == center.Id)
                {
                    HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.BadRequest);
                    return message;
                }
            }

            if (AddFitnessCenterToFile(centers, path))
            {
                return new HttpResponseMessage(HttpStatusCode.Created);
            }

            return new HttpResponseMessage(HttpStatusCode.InternalServerError);

        }

        [HttpDelete]
        public HttpResponseMessage DeleteFitnessCenter(int id)
        {
            FitnessCenter temp = null;
            List<FitnessCenter> centers = ReadFitnessCenterFromFIle(path);
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

            AddFitnessCenterToFile(centers, path);

            return message;

        }

        [HttpGet]
        public string GetFitnessCenter(int id)
        {

            List<FitnessCenter> centers = ReadFitnessCenterFromFIle(path);

            FitnessCenter center = centers.FirstOrDefault(x => x.Id == id);

            return JsonSerializer.Serialize(center);

        }

        [HttpGet]
        public string GetAllFitnessCenters()
        {
            return JsonSerializer.Serialize(ReadFitnessCenterFromFIle(path));
        }

        private List<FitnessCenter> ReadFitnessCenterFromFIle(string path)
        {
            try
            {
                string data = File.ReadAllText(path);
                List<FitnessCenter> visitors = JsonSerializer.Deserialize<List<FitnessCenter>>(data);
                return visitors;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return new List<FitnessCenter>();
            }
        }

        private bool AddFitnessCenterToFile(List<FitnessCenter> visitorList, string path)
        {
            try
            {
                List<FitnessCenter> visitors = ReadFitnessCenterFromFIle(path);

                visitorList.ForEach(x => visitors.Add(x));

                string result = JsonSerializer.Serialize<List<FitnessCenter>>(visitors);

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
