var CoachUsername
var TrainingData
var trainingDetails
var editTrainingId

$(document).ready(function () {    
    CoachUsername = localStorage.LoggedInUser.split('_')[1]
    let apiQuery = 'GroupTrainingForCoach?username=' + CoachUsername
    let docLink = location.pathname.split('/').slice(-1)[0]

    if(docLink == 'groupTrainingDetails.html'){
        trainingDetails = JSON.parse(localStorage.Training)
        StartDetailsTrainigFile(trainingDetails)
    }
    else{
        $.ajax({
            type: "GET",
            url: "../api/" + apiQuery,
            data: "",
            dataType: "json",
            success: function (response) {
                TrainingData = JSON.parse(response)
                
                TrainingData = CustomSortTrainingDate(TrainingData, 1)
                
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
    
    }

   

});

function StartDetailsTrainigFile(training){
    if(training == null){ return }

    $.ajax({
        type: "GET",
        url: "../api/Visitor/Number/" + training.Id,
        data: "",
        dataType: "json",
        success: function (response) {
            let count = JSON.parse(response)
            $('#details_current').text(count)
        }
    });

    $.ajax({
        type: "GET",
        url: "../api/FitenssCenter/" + training.Place,
        data: "",
        dataType: "json",
        success: function (response) {
            let temp = JSON.parse(response)
            $('#details_place').text(temp.Name)
        }
    });

    let trainingDate = training.DateAndTime.split('T')[0]
    let trainingTime = training.DateAndTime.split('T')[1]

    $('#details_name').text(training.Name)
    $('#details_type').text(training.TrainingType)
    $('#details_duration').text(training.Duration)
    $('#details_date').text(trainingDate)
    $('#details_time').text(trainingTime)
    $('#details_max').text(training.MaxVisitors)
    

    $.ajax({
        type: "GET",
        url: "../api/VisitorsForTraining/" + training.Id,
        data: "",
        dataType: "json",
        success: function (response) {
            let temp = JSON.parse(response)
            console.log(temp)
            temp.forEach(element => {
                AddVisitorToVisitorsList(element)
            });
        }
    });
    
    
}

function AddVisitorToVisitorsList(visitor){
    
    let query = '<tr><td>' + visitor.Username + '</td>' +
    '<td>' + visitor.Name + '</td>' +
    '<td>' + visitor.Lastname + '</td></tr>'

    $('#details_visitors').append(query)
}

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
                return false
            }

            if($('#add_training_form').hasClass('add')){
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
                query = {Id:editTrainingId, Name:name, TrainingType:trainingtype, Place:place,
                    Duration:duration, DateAndTime:dateandtime, MaxVisitors:maxvisitors}
                
                console.log(query)
                query = JSON.stringify(query)

                $.ajax({
                    type: "PUT",
                    url: "../api/GroupTraining",
                    data: query,
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
            }
    }
    else{
        return false;
    }


});


$(document).on('click', '.details_btn' , function () {
    let trainintId = $(this).attr('id').split('_')[1]
    
    $.ajax({
        type: "GET",
        url: "../api/GroupTraining/" + trainintId,
        data: "",
        dataType: "json",
        success: function (response) {
            trainingDetails = JSON.parse(response)
            localStorage.Training = response
            window.location.href = "groupTrainingDetails.html"
        }
    });
});

$('#coach_trainings_details').click(function (e) { 
    window.location.href = "groupTrainings.html"
    
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

    let fullDate = new Date(date)
    fullDate.setHours(time.split(':')[0], time.split(':')[1])
    let today = new Date()

    if(fullDate < today){
        var result = '<tr><td>' + data.Name +
        '</td><td>' + data.TrainingType + 
        '</td><td>' + date + '</td>' +
        '</td><td>' + time + '</td>' +
        '<td><button class=\'details_btn\' id=\'details_'+ data.Id +'\'>Details</button>'
    }
    else{
        var result = '<tr><td>' + data.Name +
        '</td><td>' + data.TrainingType + 
        '</td><td>' + date + '</td>' +
        '</td><td>' + time + '</td>' +
        '<td><button class=\'details_btn\' id=\'details_'+ data.Id +'\'>Details</button>' +
        '<button class=\'edit_btn\' id=\'edit_'+ data.Id +'\'>Edit</button>' + 
        '<button class=\'delete_fitness_btn\' id=\'delete_'+ data.Id +'\'>Delete</button></td>'
    }

    if(!data.Deleted){
        
       $('#training_table').append(result)
    }
    
}

$(document).on('click', '.delete_fitness_btn', function () {
    let id = $(this).attr('id').split('_')[1]
    $.ajax({
        type: "DELETE",
        url: "../api/GroupTraining/" + id,
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

$(document).on('click','.edit_btn', function () {
    let id = $(this).attr('id').split('_')[1]
    $.ajax({
        type: "GET",
        url: "../api/GroupTraining/" + id,
        data: "",
        dataType: "json",
        success: function (response) {
            trainingDetails = JSON.parse(response)
            editTrainingId = trainingDetails.Id
            $('input[name=name]').val(trainingDetails.Name)
            $('input[name=duration]').val(trainingDetails.Duration)
            $('input[name=dateandtime]').val(trainingDetails.DateAndTime)
            $('input[name=maxvisitors]').val(trainingDetails.MaxVisitors)
            $('#trainingtype').val(trainingDetails.TrainingType).change()
            
            let placeValue = $('#option_' + trainingDetails.Place).val()
            $('select[name=place]').val(placeValue)

            EditMode()

        }
    });

});



function EditMode(){
    $('#edit_btn_submit').show()
    $('#cancel_btn').show()
    $('#submit_btn').hide()
    $('#add_training_form').removeClass('add')
    $('#add_training_form').addClass('edit')
}

function AddMode(){
    $('#edit_btn_submit').hide()
    $('#cancel_btn').hide()
    $('#submit_btn').show()
    $('#add_training_form').removeClass('edit')
    $('#add_training_form').addClass('add')
}

$('#cancel_btn').click(function (e) { 
    e.preventDefault();
    $('input[type=text]').val('')
    $('input[type=number]').val('')
    $('input[type=datetime-local]').val('')
    AddMode()

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
