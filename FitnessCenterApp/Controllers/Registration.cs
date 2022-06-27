using FitnessCenterApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Controllers
{
    public class Registration
    {
        static string visitorsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.VisitorsFile);
        static string ownersPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.OwnersFile);
        static string coachPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", Assets.CoachFile);

        public static bool CheckIfUsernameExist(string username)
        {
            List<User> users = new List<User>();
            users.AddRange(WorkingWithFiles.ReadEntitiesFromFIle<Visitor>(visitorsPath));
            users.AddRange(WorkingWithFiles.ReadEntitiesFromFIle<Owner>(ownersPath));
            users.AddRange(WorkingWithFiles.ReadEntitiesFromFIle<Coach>(coachPath));

            if(users.Exists(x => x.Username.Equals(username)))
            {
                return true;
            }

            return false;
        }
    }
}