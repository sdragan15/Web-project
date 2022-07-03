var VisitorUsername
var TrainingData
var PlaceMap = []
var TrainingForSearch = []

$(document).ready(function () {    
    VisitorUsername = localStorage.LoggedInUser.split('_')[1]
    let apiQuery = 'GroupTrainingForVisitor?username=' + VisitorUsername
    let docLink = location.pathname.split('/').slice(-1)[0]

    $.when(GetTrainingData(apiQuery)).done(function(){

        TrainingData = CustomSortTrainingDate(TrainingData, 1)
            
        TrainingData.forEach(element => {
            
            AddTrainingToTableForCoach(element)

            $.ajax({
                type: "GET",
                url: "../api/GetPlaceName/" + element.Place,
                data: "",
                dataType: "json",
                success: function (response) {
                    let place = JSON.parse(response)
                    let temp = element
                    temp.Place = place
                    TrainingForSearch.push(temp)
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

function AddHistoryTrainingsForVisitor(data){
    let date = data.DateAndTime.split('T')[0]
    let time = data.DateAndTime.split('T')[1]
   

    let fullDate = new Date(date)
    fullDate.setHours(time.split(':')[0], time.split(':')[1])
    let today = new Date()

    if(fullDate < today){
        TrainingData.push(data)
        TrainingForSearch.push(data)
        if(!data.Deleted){
            var result = '<tr><td>' + data.Name +
            '</td><td>' + data.TrainingType + 
            '</td><td>' + data.Place + 
            '</td><td>' + date + '</td>' +
            '</td><td>' + time + '</td>'
           $('#training_table').append(result)
        }
    }

    
}

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

function SearchChanged(value){
    FilterGroupTrainingsByValue(value, TrainingForSearch, 'none')
}

function SearchByName(){
    value = $('#search_name').val()
    FilterGroupTrainingsByValue(value, TrainingForSearch, 'name')
}

function SearchByType(){
    value = $('#search_type').val()
    FilterGroupTrainingsByValue(value, TrainingForSearch, 'type')
}

function SearchByPlace(){
    value = $('#search_place').val()
    FilterGroupTrainingsByValue(value, TrainingForSearch, 'place')
}

$('#search_training_btn').click(function (e) { 
    $('#search_training').val('')
    value = $('#search_name').val('')
    value = $('#search_type').val('')
    value = $('#search_place').val('')
    FilterGroupTrainingsByValue('', TrainingForSearch, 'none')
    
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


$('#history_btn').click(function (e) { 
    let tempData = TrainingForSearch
    TrainingForSearch = []
    TrainingData = []
    DeleteTrainingRows()
    tempData.forEach(element => {
        AddHistoryTrainingsForVisitor(element)
    });
    
});

$('#all_btn').click(function (e) { 
    
    location.reload()
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
