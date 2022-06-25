using FitnessCenterApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Web;

namespace FitnessCenterApp.Controllers
{
    public static class WorkingWithFiles
    {
        public static List<T> ReadEntitiesFromFIle<T>(string path)
        {
            try
            {
                string data = File.ReadAllText(path);
                List<T> entities = JsonSerializer.Deserialize<List<T>>(data);
                return entities;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return new List<T>();
            }
        }

        public static bool AddEntitiesToFile<T>(List<T> entityList, string path)
        {
            try
            {
                List<T> entities = ReadEntitiesFromFIle<T>(path);

                entityList.ForEach(x => entities.Add(x));

                string result = JsonSerializer.Serialize<List<T>>(entities);

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