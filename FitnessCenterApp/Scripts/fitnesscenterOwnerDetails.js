var AllGroupTrainings = []
var AllVisitors = []
var FitnessCenter = JSON.parse(localStorage.FitnessCenter)


$(document).ready(function () {
    if(localStorage.LoggedInUser != null && localStorage.LoggedInUser != ''){      
        LoggedInMode()
    }
    else{
        NoLoggedUserMode()
    }

    if(localStorage.LoggedInRole == 2){
        $('#owner_centers').show()
        $('#details_owner_div').show();
        AddTrainersToTable(FitnessCenter.Id)
    }

    
    
    $('#name').text(FitnessCenter.Name)
    $('#address').text(FitnessCenter.FitnessAddress.City + ', ' + 
    FitnessCenter.FitnessAddress.StreetAndNumber + ', ' + 
    FitnessCenter.FitnessAddress.PostalCode)

    $('#opened').text(FitnessCenter.Opened)
    $('#owner').text(FitnessCenter.FitnessOwner)
    $('#opened').text(FitnessCenter.Opened)
    $('#one_training').text(FitnessCenter.TrainingCost)
    $('#monthly').text(FitnessCenter.MonthlyMembershipCost)
    $('#yearly').text(FitnessCenter.YearlyembershipCost)
    $('#group').text(FitnessCenter.GroupTrainingCost)
    $('#proffesional').text(FitnessCenter.ProffesionalTrainingCost)

    GetAllGroupTrainings(FitnessCenter.Id)    
    GenerateAllCommentsForFitnessCenter(FitnessCenter.Id)
});

$('#trainer_add_form').submit(function (e) { 
    e.preventDefault();
    let usernameVal = $('#trainer_username').val()
    if(usernameVal == ''){
        e.preventDefault()
        alert('Invalid username')
        return false
    }

    $.ajax({
        type: "PUT",
        url: "../api/AddCoachToCenter?id=" + FitnessCenter.Id + '&username=' + usernameVal,
        data: "",
        dataType: "json",
        complete: function (response) {
            if(response.status != 200){
                alert(response.responseText)
            }
            location.reload()
        }
    });
    
});

$('#owner_centers').click(function (e) { 
    window.location.href = 'fitnesscenterOwner.html'
    
});

function AddTrainersToTable(id){
    $.ajax({
        type: "GET",
        url: "../api/CoachByFitnessCenter/" + id,
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            console.log(data)
            data.forEach(element => {
                GenerateTrainer(element)
            });
        }
    });

    
}

function GenerateTrainer(data){
    let value = '<tr><td>' + data.Username + '</td><td>' + data.Name + '</td><td>' + data.Lastname + '</td>' +
                '<td><button id=\'block_coach\'>Block</button><button id=\'unblock_coach\'>Block</button>' + 
                '<button id=\'delete_coach\'>Delete</button></td></tr>'

    $('#trainers_table').append(value)
}

function NoLoggedUserMode(){
    $('#signout_nav').hide()
}

function LoggedInMode(){
    $('#login_nav').hide()
}

function GetAllGroupTrainings(id){
    $.ajax({
        type: "GET",
        url: "../api/GroupTraining/AllGroups/" + id,
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            console.log(data)
            data.forEach(element => {
                GenerateGroupTraining(element)
                console.log('broj: ' + element.Id)
            });
        }
    });
}

function GetNumberOfVisitorsForTraining(id){
    $.ajax({
        type: "GET",
        url: "../api/Visitor/Number/" + id,
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            let idtext = '#number_' + id
            $(idtext).text(data)
        }
    });
}

function GenerateGroupTraining(element){
    GetNumberOfVisitorsForTraining(element.Id)
    query = '<tr><td>' + element.Name + '</td>' +
                '<td>' + element.TrainingType +'</td>' +
                '<td>' + element.Place + '</td>' +
                '<td>' + element.Duration + '</td>' +
                '<td>' + element.DateAndTime.split('T')[0] + '</td>' +
                '<td>' + element.DateAndTime.split('T')[1] + '</td>' +
                '<td>' + element.MaxVisitors + '</td>' + 
                '<td id=\'number_' + element.Id +'\'></td></tr>'
    $('#group_table').append(query)
    //console.log(element)

}

function GenerateAllCommentsForFitnessCenter(id){
    $.ajax({
        type: "GET",
        url: "../api/Comment/ForFitnessCenter/" + id,
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            data.forEach(element => {
                let query = '<tr><td>' + element.FromUser + '</td>' +
                            '<td>' + element.Text + '</td>' +
                            '<td>' + element.Grade + '</td></tr>'
                $('#comment_table').append(query)
            });
        }
    });
}