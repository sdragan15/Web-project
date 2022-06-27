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

$(document).on('click','.block_coach', function () {
    let username = $(this).parent().parent().children(':first').text()


    $.ajax({
        type: "PUT",
        url: "../api/BlockCoach?block=1&username=" + username,
        data: "",
        dataType: "json",
        contentType: "application/json",
        complete: function(response){
            if(response.status != 200){
                alert(response.responseText)
            }
            else{
                location.reload()
            }
        }
    });
});

$(document).on('click','.unblock_coach', function () {
    let username = $(this).parent().parent().children(':first').text()


    $.ajax({
        type: "PUT",
        url: "../api/BlockCoach?block=0&username=" + username,
        data: "",
        dataType: "json",
        contentType: "application/json",
        complete: function(response){
            if(response.status != 200){
                alert(response.responseText)
            }
            else{
                location.reload()
            }
        }
    });
});

$(document).on('click', '.dalete_coach', function () {
    username = $(this).attr('id')
    username = username.split('_')[2]
    
    $.ajax({
        type: "PUT",
        url: "../api/QuitWorker?username=" + username,
        data: "",
        dataType: "json",
        contentType: "application/json",
        complete: function(response){
            if(response.status != 200){
                alert(response.responseText)
            }
            else{
                location.reload()
            }
        }
    });
});

function GenerateTrainer(data){
    let value = '<tr><td>' + data.Username + '</td><td>' + data.Name + '</td><td>' + data.Lastname + '</td>' +
                '<td><button class=\'block_coach\' id=\'block_coach_' + data.Username +'\'>Block</button><button class=\'unblock_coach\' id=\'unblock_coach_' + data.Username +'\'>Unblock</button>' + 
                '<button class=\'dalete_coach\' id=\'delete_coach_' + data.Username +'\'>Delete</button></td></tr>'

    $('#trainers_table').append(value)
    if(data.Blocked){
        $('#unblock_coach_' + data.Username).show()
        $('#block_coach_' + data.Username).hide()
    }
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