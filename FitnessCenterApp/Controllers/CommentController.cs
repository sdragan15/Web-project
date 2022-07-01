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
        private string trainingPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.GroupTraningsFile);
        private string visitorPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.VisitorsFile);

        [HttpPost]
        public HttpResponseMessage AddComment(Comment com)
        {
            if(!UserHadTrainingInFitnessCenter(com.FromUser, com.ToFitnessCenter))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "User never had training in this fitness center");
            }

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

        [HttpPut]
        [Route("api/RemoveComment/{id}")]
        public HttpResponseMessage RemoveComment(int id)
        {
            List<Comment> comments = WorkingWithFiles.ReadEntitiesFromFIle<Comment>(path);
            Comment comment = comments.FirstOrDefault(x => x.Id == id);

            if(comment == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Comment not found in database");
            }

            comment.Deleted = true;
            comment.Verified = false;
            WorkingWithFiles.RewriteFileWithEntities<Comment>(comments, path);

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPut]
        [Route("api/VerifyComment/{id}")]
        public HttpResponseMessage VerifyComment(int id)
        {
            List<Comment> comments = WorkingWithFiles.ReadEntitiesFromFIle<Comment>(path);
            Comment comment = comments.FirstOrDefault(x => x.Id == id);

            if (comment == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Comment not found in database");
            }

            comment.Verified = true;
            WorkingWithFiles.RewriteFileWithEntities<Comment>(comments, path);

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("api/Comment/ForFitnessCenter/{id}")]
        public string GetAllCommentsForFitnessCenter(int id)
        {
            List<Comment> comments = WorkingWithFiles.ReadEntitiesFromFIle<Comment>(path);
            List<Comment> result = new List<Comment>();
            foreach(Comment c in comments)
            {
                if(c.ToFitnessCenter == id && c.Deleted == false)
                {
                    result.Add(c);
                }
            }

            return JsonSerializer.Serialize(result);
        }

        private bool UserHadTrainingInFitnessCenter(string username, int id)
        {
            List<GroupTraining> trainings = WorkingWithFiles.ReadEntitiesFromFIle<GroupTraining>(trainingPath);

            foreach(GroupTraining t in trainings)
            {
                if(t.Place == id && t.Visitors.Contains(username))
                {
                    DateTime trainingFinished = t.DateAndTime.AddMinutes(t.Duration);
                    if (DateInPast(trainingFinished))
                    {
                        return true;
                    }
                    return false;
                }
            }
            return false;
        }

        public static bool DateInPast(DateTime date)
        {
            if(DateTime.Now > date)
            {
                return true;
            }

            return false;
               
        }

    }
}
