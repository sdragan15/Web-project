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
    public class CommentController : ApiController
    {
        private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.CommentsFile);

        [HttpPost]
        public HttpResponseMessage AddComment(Comment com)
        {
            //Comment temp = new Comment();
            //temp.FromUser = "milica123";
            //temp.Grade = 5;
            //temp.Text = "Very nice!";
            //temp.ToFitnessCenter = 1;
            //temp.Id = 2;

            List<Comment> comments = ReadCommentsFromFIle(path);
            if (comments.Count > 0)
                com.Id = comments[comments.Count - 1].Id + 1;
            else
                com.Id = 0;

            List<Comment> res = new List<Comment>() { com };
            foreach (Comment c in comments)
            {
                if (c.Id == com.Id)
                {
                    HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.BadRequest);
                    return message;
                }
            }

            if (AddCommentsToFile(res, path))
            {
                return new HttpResponseMessage(HttpStatusCode.Created);
            }

            return new HttpResponseMessage(HttpStatusCode.InternalServerError);

        }

        [Route("api/Comment/ForFitnessCenter/{id}")]
        public string GetAllCommentsForFitnessCenter(int id)
        {
            List<Comment> comments = ReadCommentsFromFIle(path);
            List<Comment> result = new List<Comment>();
            foreach(Comment c in comments)
            {
                if(c.ToFitnessCenter == id)
                {
                    result.Add(c);
                }
            }

            return JsonSerializer.Serialize(result);
        }

        private List<Comment> ReadCommentsFromFIle(string path)
        {
            try
            {
                string data = File.ReadAllText(path);
                List<Comment> visitors = JsonSerializer.Deserialize<List<Comment>>(data);
                return visitors;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return new List<Comment>();
            }
        }

        private bool AddCommentsToFile(List<Comment> visitorList, string path)
        {
            try
            {
                List<Comment> visitors = ReadCommentsFromFIle(path);

                visitorList.ForEach(x => visitors.Add(x));

                string result = JsonSerializer.Serialize<List<Comment>>(visitors);

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
