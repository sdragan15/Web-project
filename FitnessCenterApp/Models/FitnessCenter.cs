using System.Collections.Generic;

namespace FitnessCenterApp.Models
{
    public class FitnessCenter
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Address FitnessAddress { get; set; }
        public int Opened { get; set; }
        public string FitnessOwner { get; set; }            // owner id
        public int MonthlyMembershipCost { get; set; }
        public int YearlyembershipCost { get; set; }
        public int TrainingCost { get; set; }
        public int GroupTrainingCost { get; set; }
        public int ProffesionalTrainingCost { get; set; }
        public bool Deleted { get; set; }

        public FitnessCenter()
        {
            Deleted = false;
        }
    }
}