var CoachUsername

$(document).ready(function () {    
    CoachUsername = localStorage.LoggedInUser.split('_')[1]
    let apiQuery = 'GroupTrainingForCoach?username=' + CoachUsername

    $.ajax({
        type: "GET",
        url: "../api/" + apiQuery,
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            
            data = CustomSortString(data, 'Name', -1)
            
            data.forEach(element => {
                AddTrainingToTableForCoach(element)
            });
        }
    });
});

function AddTrainingToTableForCoach(data){
    let date = data.DateAndTime.split('T')[0]
    let time = data.DateAndTime.split('T')[1]

    if(!data.Deleted){
        var result = '<tr><td>' + data.Name +
        '</td><td>' + data.TrainingType + 
        '</td><td>' + date + '</td>' +
        '</td><td>' + time + '</td>' +
        '<td><button class=\'details_btn\' id=\''+ data.Id +'\'>Details</button>' +
        '<button class=\'edit_btn\' id=\''+ data.Id +'\'>Edit</button>' + 
        '<button class=\'delete_fitness_btn\' id=\''+ data.Id +'\'>Delete</button></td>'
       $('#training_table').append(result)
    }
    
}

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

    console.log(data)
    
    data = CustomSortString(data, 'Name', type)
    DeleteTrainingRows()
    data.forEach(element => {
        AddTrainingToTableForCoach(element)
    });

});

$('#table_type').click(function (e) {
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

    data = CustomSortString(data, 'TrainingType', type)
    DeleteTrainingRows()
    data.forEach(element => {
        AddTrainingToTableForCoach(element)
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
    DeleteTrainingRows()
    data.forEach(element => {
        AddTrainingToTableForCoach(element)
    });

});


function DeleteTrainingRows(){
    $("#training_table").find("tr:gt(0)").remove();
}
