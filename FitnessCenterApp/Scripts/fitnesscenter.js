var data
var FitnessCenters = []

$(document).ready(function () {
    if(localStorage.LoggedInUser != null && localStorage.LoggedInUser != ''){
        $('#hello_message').text('Hello ' + localStorage.LoggedInUser.split('_')[1])
        LoggedInMode()
    }
    else{
        NoLoggedUserMode()
    }
    
    if(localStorage.LoggedInRole != ''){
        if(localStorage.LoggedInRole == 2){
            $('#owner_centers').show()
        }
        else if(localStorage.LoggedInRole == 1){
            $('#coach_trainings').show()
        }
        else if(localStorage.LoggedInRole == 0){
            $('#visitors_trainings').show()
        }
    }
    else{
        $('#profile_nav').hide()
    }
    

    let apiQuery = 'FitenssCenter'

    $.ajax({
        type: "GET",
        url: "../api/" + apiQuery,
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            
            FitnessCenters = data
            data = CustomSortString(data, 'Name', -1)
            
            data.forEach(element => {
                AddFitnessToTable(element)
            });
        }
    });
});

$('#fitness_clear_btn').click(function(){
    $('#fitness_search').val('')
    FilterFitnessCenterTableByValue('')
})

function SearchChanged(value){
    FilterFitnessCenterTableByValue(value)
}

$('#visitors_trainings').click(function (e) { 
    window.location.href = 'visitorTrainings.html'
    
});

$('#owner_centers').click(function (e) { 
    window.location.href = 'fitnesscenterOwner.html'
    
});

$('#coach_trainings').click(function (e) { 
    window.location.href = 'groupTrainings.html'
    
});

function NoLoggedUserMode(){
    $('#signout_nav').hide()
}

function LoggedInMode(){
    $('#login_nav').hide()
}

$(document).on("click", ".details_btn" , function() {
    location.href='fitnesscenterDetails.html';
    fitnessId = $(this).attr('id');
    
    for(let i=0; i<data.length; i++){
        if(data[i].Id == fitnessId){
            FitnessCenter = data[i]
            localStorage.FitnessCenter = JSON.stringify(FitnessCenter)
            break
        }
    }
});

$('#table_name').click(function (e) {
    var type = 0
    if($(this).hasClass('asc')){
        $(this).removeClass('asc');
        $(this).addClass('desc');
        type = 1
    }
    else if($(this).hasClass('desc')){
        $(this).removeClass('desc');
        $(this).addClass('asc');
        type = -1
    }
    else{
        $(this).addClass('asc'); 
        type = -1
    }

    data = CustomSortString(data, 'Name', type)
    DeleteFitnessRows()
    data.forEach(element => {
        AddFitnessToTable(element)
    });

});

$('#table_address').click(function (e) {
    var type = 0
    if($(this).hasClass('asc')){
        $(this).removeClass('asc');
        $(this).addClass('desc');
        type = 1
    }
    else if($(this).hasClass('desc')){
        $(this).removeClass('desc');
        $(this).addClass('asc');
        type = -1
    }
    else{
        $(this).addClass('asc'); 
        type = -1
    }

    data = CustomSortAddress(data, type)
    DeleteFitnessRows()
    data.forEach(element => {
        AddFitnessToTable(element)
    });

});

$('#table_year').click(function (e) {
    var type = 0
    if($(this).hasClass('asc')){
        $(this).removeClass('asc');
        $(this).addClass('desc');
        type = 1
    }
    else if($(this).hasClass('desc')){
        $(this).removeClass('desc');
        $(this).addClass('asc');
        type = -1
    }
    else{
        $(this).addClass('asc'); 
        type = -1
    }

    data = CustomSortNumber(data, 'Opened', type)
    DeleteFitnessRows()
    data.forEach(element => {
        AddFitnessToTable(element)
    });

});

function DeleteFitnessRows(){
    $("#fitness_table").find("tr:gt(0)").remove();
}

function AddFitnessToTable(fitness){
    if(!fitness.Deleted){
        var result = '<tr><td>' + fitness['Name'] +
        '</td><td>' + fitness.FitnessAddress.StreetAndNumber + 
        '</td><td>' + fitness['Opened'] + '</td>' +
        '<td><button class=\'details_btn\' id=\''+ fitness.Id +'\'>Details</button></td>'
       $('#fitness_table').append(result)
    }
    
}

