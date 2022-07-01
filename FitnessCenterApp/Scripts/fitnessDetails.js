var AllGroupTrainings = []
var AllVisitors = []
var Username

$(document).ready(function () {
    if(localStorage.LoggedInUser != null && localStorage.LoggedInUser != ''){      
        LoggedInMode()
    }
    else{
        NoLoggedUserMode()
    }

    if(localStorage.LoggedInRole == 2){
        $('#owner_centers').show()
    }
    else if(localStorage.LoggedInRole != '' && localStorage.LoggedInRole == 0){
        $('#comments_div').show()
    }

    Username = localStorage.LoggedInUser.split('_')[1]

    FitnessCenter = JSON.parse(localStorage.FitnessCenter)
    
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

$('#comment_forms').submit(function (e) { 
    let text = $('#comment_text').val()
    let grade = $('#grade_input').val()

    if(text == ''){
        $('#comment_text').focus()
        return false;
    }

    let query = {FromUser:Username, ToFitnessCenter:FitnessCenter.Id,
        Text:text, Grade:grade}

    query = JSON.stringify(query)

    $.ajax({
        type: "POST",
        url: "../api/Comment",
        data: query,
        dataType: "json",
        contentType: "application/json",
        complete: function(response){
            if(response.status != 201){
                e.preventDefault();
                alert(response.responseText)
            }
            else{
                location.reload()
            }
        }
    });
    
});

function UpdateGrade(value){
    $('#grade_label').text('Grade: ' + value)
}

$('#owner_centers').click(function (e) { 
    window.location.href = 'fitnesscenterOwner.html'
    
});

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
                if(localStorage.LoggedInRole != '' && localStorage.LoggedInRole == 0){
                    GenerateGroupTrainingForVisitor(element)
                }
                else{
                    GenerateGroupTraining(element)
                }
                
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

function GenerateGroupTrainingForVisitor(element){
    GetNumberOfVisitorsForTraining(element.Id)
    query = '<tr><td>' + element.Name + '</td>' +
                '<td>' + element.TrainingType +'</td>' +
                '<td>' + element.Duration + '</td>' +
                '<td>' + element.DateAndTime.split('T')[0] + '</td>' +
                '<td>' + element.DateAndTime.split('T')[1] + '</td>' +
                '<td>' + element.MaxVisitors + '</td>' + 
                '<td id=\'number_' + element.Id +'\'></td>' +
                '<td><button class=\'signup_btn\' id=\'sign_' + element.Id + '\'>Sign up</button></td>' +
                '<td><button class=\'quit_btn\' id=\'quit_' + element.Id + '\'>Quit</button></td>'
    $('#group_table').append(query)
    //console.log(element)
}

$(document).on('click', '.quit_btn', function () {
    let username = localStorage.LoggedInUser.split('_')[1]
    let trainingId = $(this).attr('id').split('_')[1]
    
    $.ajax({
        type: "PUT",
        url: "../api/Visitor/TrainingQuit?username=" + username + "&trainingId=" + trainingId,
        data: "",
        dataType: "json",
        complete: function (response) {
            if(response.status != 200){
                alert(response.responseText)
            }
            else{
                location.reload()
            }
        }
    });
});



$(document).on('click', '.signup_btn', function () {
    let username = localStorage.LoggedInUser.split('_')[1]
    let trainingId = $(this).attr('id').split('_')[1]
    
    $.ajax({
        type: "PUT",
        url: "../api/Visitor/TrainingSignUp?username=" + username + "&trainingId=" + trainingId,
        data: "",
        dataType: "json",
        complete: function (response) {
            if(response.status != 200){
                alert(response.responseText)
            }
            else{
                location.reload()
            }
        }
    });
});



function GenerateGroupTraining(element){
    GetNumberOfVisitorsForTraining(element.Id)
    query = '<tr><td>' + element.Name + '</td>' +
                '<td>' + element.TrainingType +'</td>' +
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