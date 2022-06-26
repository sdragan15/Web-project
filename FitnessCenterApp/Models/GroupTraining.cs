using System;
using System.Collections.Generic;

namespace FitnessCenterApp.Models
{
    public class GroupTraining
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string TrainingType { get; set; }
        public int Place { get; set; }
        public int Duration { get; set; }
        public DateTime DateAndTime { get; set; }
        public int MaxVisitors { get; set; }
        public List<string> Visitors { get; set; }          // list of visitors id
        public bool Deleted { get; set; }

        public GroupTraining()
        {
            Deleted = false;
        }
    }
}