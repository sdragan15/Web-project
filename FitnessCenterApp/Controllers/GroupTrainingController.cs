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
            GroupTraining temp = new GroupTraining();
            temp.Id = 0;
            temp.MaxVisitors = 100;
            temp.Name = "Trening bro";
            temp.Place = new FitnessCenter() { Id = 1 };
            temp.TrainingType = TypeOfTraining.BODY_PUMP;
            temp.Duration = 60;
            temp.DateAndTime = new DateTime();

            List<GroupTraining> result = ReadGroupTrainingsFromFIle(path);
            if(result.Count > 0)
                training.Id = result[result.Count - 1].Id + 1;

            List<GroupTraining> trainings = new List<GroupTraining>() { temp };
            foreach (GroupTraining f in result)
            {
                if (f.Id == training.Id)
                {
                    HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.BadRequest);
                    return message;
                }
            }

            if (AddGroupTrainingToFile(trainings, path))
            {
                return new HttpResponseMessage(HttpStatusCode.Created);
            }

            return new HttpResponseMessage(HttpStatusCode.InternalServerError);

        }

        [HttpDelete]
        public HttpResponseMessage DeleteFitnessCenter(int id)
        {
            GroupTraining temp = null;
            List<GroupTraining> centers = ReadGroupTrainingsFromFIle(path);
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

            AddGroupTrainingToFile(centers, path);

            return message;

        }

        [HttpGet]
        public string GetFitnessCenter(int id)
        {

            List<GroupTraining> centers = ReadGroupTrainingsFromFIle(path);

            GroupTraining center = centers.FirstOrDefault(x => x.Id == id);

            return JsonSerializer.Serialize(center);

        }

        [HttpGet]
        public string GetAllGroupTrainings()
        {
            return JsonSerializer.Serialize(ReadGroupTrainingsFromFIle(path));
        }

        private List<GroupTraining> ReadGroupTrainingsFromFIle(string path)
        {
            try
            {
                string data = File.ReadAllText(path);
                List<GroupTraining> visitors = JsonSerializer.Deserialize<List<GroupTraining>>(data);
                return visitors;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return new List<GroupTraining>();
            }
        }

        private bool AddGroupTrainingToFile(List<GroupTraining> visitorList, string path)
        {
            try
            {
                List<GroupTraining> visitors = ReadGroupTrainingsFromFIle(path);

                visitorList.ForEach(x => visitors.Add(x));

                string result = JsonSerializer.Serialize<List<GroupTraining>>(visitors);

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
