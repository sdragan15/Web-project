using FitnessCenterApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FitnessCenterApp.Controllers
{
    public class OwnerController : ApiController
    {
        private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.OwnersFile);

        [HttpPost]
        public HttpResponseMessage RegisterOwner()
        {
            //if (AddOwnerToFile())
            //{
            //    return new HttpResponseMessage(HttpStatusCode.OK);
            //}

            return Request.CreateResponse(HttpStatusCode.BadRequest, "Bad request or owner is not possible to add");
        }

        private bool AddOwnerToFile()
        {
            Owner temp = new Owner();
            temp.Name = "Jeff";
            temp.Lastname = "Besos";
            temp.Username = "jeff";
            temp.Password = "jeff";
            temp.UserGender = Gender.MALE;
            temp.UserRole = Role.OWNER;
            temp.Email = "jeff@gmail.com";
            temp.Birth = new DateTime(1973, 12, 23);
            temp.OwnerOfFitnessCenter = new List<int>() { 1 };

            List<Owner> visitors = new List<Owner>() { temp };


            if (WorkingWithFiles.AddEntitiesToFile<Owner>(visitors, path))
            {
                return true;
            }
            else
            {
                return false;
            }

        }
    }
}
