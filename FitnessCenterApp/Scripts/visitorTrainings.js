var VisitorUsername
var TrainingData
var PlaceMap = []

$(document).ready(function () {    
    VisitorUsername = localStorage.LoggedInUser.split('_')[1]
    let apiQuery = 'GroupTrainingForVisitor?username=' + VisitorUsername
    let docLink = location.pathname.split('/').slice(-1)[0]

    $.when(GetTrainingData(apiQuery)).done(function(){

        TrainingData = CustomSortTrainingDate(TrainingData, -1)
            
        TrainingData.forEach(element => {
            
            AddTrainingToTableForCoach(element)

            $.ajax({
                type: "GET",
                url: "../api/GetPlaceName/" + element.Place,
                data: "",
                dataType: "json",
                success: function (response) {
                    let place = JSON.parse(response)
                    PlaceMap.push({Id:element.Place, Value:place})
                }
            });
        });
    })
   

    

});

function GetTrainingData(apiQuery){
   return $.ajax({
        type: "GET",
        url: "../api/" + apiQuery,
        data: "",
        dataType: "json",
        complete: function (response) {
            TrainingData = JSON.parse(response.responseJSON)
        }
    });
}

function AddTrainingToTableForCoach(data){
    let date = data.DateAndTime.split('T')[0]
    let time = data.DateAndTime.split('T')[1]
    let place = ''
    PlaceMap.forEach(element => {
        if(element.Id == data.Place){
            place = element.Value
        }
    });

    if(place == ''){
        $.ajax({
            type: "GET",
            url: "../api/GetPlaceName/" + data.Place,
            data: "",
            dataType: "json",
            success: function (response) {
                let place = JSON.parse(response)
                if(place == ""){
                    alert('Error')
                }
                else{
                    PlaceMap.push({Id:data.Place, Value:place})
                    if(!data.Deleted){
                        var result = '<tr><td>' + data.Name +
                        '</td><td>' + data.TrainingType + 
                        '</td><td>' + place + 
                        '</td><td>' + date + '</td>' +
                        '</td><td>' + time + '</td>'
                       $('#training_table').append(result)
                    }
                }
                
            }
        });
    }
    else{
        if(!data.Deleted){
            var result = '<tr><td>' + data.Name +
            '</td><td>' + data.TrainingType + 
            '</td><td>' + place + 
            '</td><td>' + date + '</td>' +
            '</td><td>' + time + '</td>'
           $('#training_table').append(result)
        }
    }
}

$('#comment_forms').submit(function (e) { 
    e.preventDefault();
    let text = $('#comment_text').val()
    
    let query = {}


    $.ajax({
        type: "POST",
        url: "../api/Comment",
        data: query,
        dataType: "json",
        contentType: "application/json",
        complete: function(response){
            if(response.status != 201){
                alert(response.responseText)
            }
        }
    });
    
});

$('#table_place').click(function (e) {
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

    
    data = CustomSortPlace(TrainingData, type)
    DeleteTrainingRows()
    data.forEach(element => {
        AddTrainingToTableForCoach(element)
    });

});

function CustomSortPlace(data, type){
    for(let j=0; j<data.length-1; j++){    
        let place1 = '' 
        var min = data[j]
        PlaceMap.forEach(element => {
            if(element.Id == min.Place){
                place1 = element.Value
            }
        });
        var tempIdx = j
        for(let i=j+1; i<data.length; i++){
            let place2 =''
            
            PlaceMap.forEach(element => {
                if(element.Id == data[i].Place){
                    place2 = element.Value
                }
            });
            if(place2.localeCompare(place1) == type){
                min = data[i]
                tempIdx = i
            }
        }
        var temp = data[j]
        data[j] = min
        data[tempIdx] = temp
    }
    return data
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
