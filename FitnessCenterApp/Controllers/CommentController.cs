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

            List<Comment> comments = WorkingWithFiles.ReadEntitiesFromFIle<Comment>(path);
            if (comments.Count > 0)
                com.Id = comments[comments.Count - 1].Id + 1;
            else
                com.Id = 0;

            List<Comment> res = new List<Comment>() { com };
            foreach (Comment c in comments)
            {
                if (c.Id == com.Id)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Id already exists");
                }
            }

            if (WorkingWithFiles.AddEntitiesToFile<Comment>(res, path))
            {
                return Request.CreateResponse(HttpStatusCode.Created);
            }

            return Request.CreateResponse(HttpStatusCode.InternalServerError, "Server error");

        }

        [Route("api/Comment/ForFitnessCenter/{id}")]
        public string GetAllCommentsForFitnessCenter(int id)
        {
            List<Comment> comments = WorkingWithFiles.ReadEntitiesFromFIle<Comment>(path);
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

    }
}
