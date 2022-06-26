﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Models
{
    public class Coach: User
    {
        public List<GroupTraining> TrainerForGroups { get; set; }
        public FitnessCenter WorkingInFitnessCenter { get; set; }
        public bool Blocked { get; set; }

        public Coach()
        {
            Blocked = false;
        }
    }
}