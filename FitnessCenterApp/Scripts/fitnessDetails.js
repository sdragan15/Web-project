$(document).ready(function () {
    FitnessCenter = JSON.parse(localStorage.FitnessCenter)
    
    $('#name').text(FitnessCenter.Name)
});