﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Models
{
    public class Comment
    {
        public string FromUser { get; set; }                // user id
        public int ToFitnessCenter { get; set; }            // fitness center id 
        public string Text { get; set; }
        public int Grade { get; set; }
    }
}