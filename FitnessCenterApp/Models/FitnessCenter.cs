namespace FitnessCenterApp.Models
{
    public class FitnessCenter
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Address FitnessAdress { get; set; }
        public int Opened { get; set; }
        public Owner FitnessOwner { get; set; }
        public int MonthlyMembershipCost { get; set; }
        public int YearlyembershipCost { get; set; }
        public int TrainingCost { get; set; }
        public int GroupTrainingCost { get; set; }
        public int ProffesionalTrainingCost { get; set; }

        public FitnessCenter()
        {

        }
    }
}