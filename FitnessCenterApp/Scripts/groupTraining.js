var CoachUsername
var TrainingData

$(document).ready(function () {    
    CoachUsername = localStorage.LoggedInUser.split('_')[1]
    let apiQuery = 'GroupTrainingForCoach?username=' + CoachUsername

    $.ajax({
        type: "GET",
        url: "../api/" + apiQuery,
        data: "",
        dataType: "json",
        success: function (response) {
            TrainingData = JSON.parse(response)
            
            TrainingData = CustomSortTrainingDate(TrainingData, -1)
            
            TrainingData.forEach(element => {
                AddTrainingToTableForCoach(element)
            });
        }
    });

    
    $.ajax({
        type: "GET",
        url: "../api/FitenssCenter",
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            data = CustomSortString(data, 'Name', -1)
            
            data.forEach(element => {
                AddFitnessNameToSelect(element)
            });
        }
    });


});

$('#add_training_form').submit(function (e) {     
    let name = $('input[name=name]').val()
    let duration = $('input[name=duration]').val()
    let dateandtime = $('input[name=dateandtime]').val()
    let maxvisitors = $('input[name=maxvisitors]').val()
    let trainingtype = $('#trainingtype').find(":selected").text();
    let place = $('select[name=place]').find('option:selected').attr('id').split('_')[1];
    
    if(ValidateInput(name, 'name') && ValidateInput(duration, 'duration') &&
        ValidateInput(dateandtime, 'dateandtime') && ValidateInput(maxvisitors, 'maxvisitors')){
            let date = dateandtime.split('T')[0]
            date = new Date(date)
            const today = new Date()
            let allowedDate = new Date(today)
            allowedDate.setDate(allowedDate.getDate() + 3)
            
            if(date - allowedDate < 0){
                $('input[name=dateandtime]').addClass('error')
                $('input[name=dateandtime]').focus()
                alert('false')
                return false
            }


            query = {Name:name, TrainingType:trainingtype, Place:place,
                    Duration:duration, DateAndTime:dateandtime, MaxVisitors:maxvisitors}
           
            query = JSON.stringify(query)

            $.ajax({
                type: "POST",
                url: "../api/GroupTraining?username=" + CoachUsername,
                data: query,
                dataType: "json",
                contentType: "application/json",
                complete: function(response){
                    if(response.status != 201){
                        alert(response.responseText)
                    }
                }
            });
            location.reload()
            return true
    }
    else{
        return false;
    }


});

function AddFitnessNameToSelect(element){
    if(!element.Deleted){
        let value = '<option id=\'option_' + element.Id + '\'>' + element.Name + '</option>'
        
        $('#select_place').append(value)
        
    }
    
    
}

function ValidateInput(value, name){
    if(value == ''){
        $('input[name=' + name + ']').addClass('error')
        $('input[name=' + name + ']').focus()
        return false
    }
    else{
        $('input[name=' + name + ']').removeClass('error')
        return true
    }
}

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

    
    data = CustomSortString(TrainingData, 'Name', type)
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

    data = CustomSortString(TrainingData, 'TrainingType', type)
    DeleteTrainingRows()
    data.forEach(element => {
        AddTrainingToTableForCoach(element)
    });

});

$('#table_date').click(function (e) {
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

    data = CustomSortTrainingDate(TrainingData, type)
    DeleteTrainingRows()
    data.forEach(element => {
        AddTrainingToTableForCoach(element)
    });

});

$('#table_time').click(function (e) {
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

    data = CustomSortTrainingTime(TrainingData, type)
    DeleteTrainingRows()
    data.forEach(element => {
        AddTrainingToTableForCoach(element)
    });

});


function DeleteTrainingRows(){
    $("#training_table").find("tr:gt(0)").remove();
}
