using System;
using System.Collections.Generic;

namespace FitnessCenterApp.Models
{
    public class GroupTraining
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public TypeOfTraining TrainingType { get; set; }
        public FitnessCenter Place { get; set; }
        public int Duration { get; set; }
        public DateTime DateAndTime { get; set; }
        public int MaxVisitors { get; set; }
        public List<Visitor> Visitors { get; set; }

        public GroupTraining()
        {

        }
    }
}