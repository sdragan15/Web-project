
$(document).ready(function () {
    if(localStorage.LoggedInUser != null && localStorage.LoggedInUser != ''){
        $('#hello_message').text('Hello ' + localStorage.LoggedInUser.split('_')[1])
        LoggedInMode()
    }
    else{
        NoLoggedUserMode()
    }
    

    $.ajax({
        type: "GET",
        url: "../api/FitenssCenter",
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            
            data = CustomSortString(data, 'Name', -1)
            
            data.forEach(element => {
                AddFitnessToTable(element)
            });
        }
    });
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
    var result = '<tr><td>' + fitness['Name'] +
     '</td><td>' + fitness.FitnessAddress.StreetAndNumber + 
     '</td><td>' + fitness['Opened'] + '</td>' +
     '<td><button class=\'details_btn\' id=\''+ fitness.Id +'\'>Details</button></td>'
    $('#fitness_table').append(result)
}

// data = data for sorting; value = what property are sorting; type = asscending/descending (-1, 1)


function CustomSortNumber(data, value, type){
    for(let j=0; j<data.length-1; j++){         
        var min = data[j]
        var tempIdx = j
        for(let i=j+1; i<data.length; i++){
            if(type == -1){
                if(data[i][value] < min[value]){
                    min = data[i]
                    tempIdx = i
                }
            }
            else{
                if(data[i][value] > min[value]){
                    min = data[i]
                    tempIdx = i
                }
            }
            
        }
        var temp = data[j]
        data[j] = min
        data[tempIdx] = temp
    }
    return data
}

function CustomSortString(data, value, type){
    for(let j=0; j<data.length-1; j++){         
        var min = data[j]
        var tempIdx = j
        for(let i=j+1; i<data.length; i++){
            if(data[i][value].localeCompare(min[value]) == type){
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

function CustomSortAddress(data, type){
    for(let j=0; j<data.length-1; j++){         
        var min = data[j]
        var tempIdx = j
        for(let i=j+1; i<data.length; i++){
            if(data[i].FitnessAddress.StreetAndNumber.localeCompare(min.FitnessAddress.StreetAndNumber) == type){
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