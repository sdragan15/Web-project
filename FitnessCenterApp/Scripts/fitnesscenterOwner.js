$(document).ready(function () {    
    let apiQuery = 'FitenssCenterForOwner?username=' + localStorage.LoggedInUser.split('_')[1]

    $.ajax({
        type: "GET",
        url: "../api/" + apiQuery,
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            
            data = CustomSortString(data, 'Name', -1)
            
            data.forEach(element => {
                AddFitnessToTableForOwner(element)
            });
        }
    });
});

function AddFitnessToTableForOwner(fitness){
    var result = '<tr><td>' + fitness['Name'] +
     '</td><td>' + fitness.FitnessAddress.StreetAndNumber + 
     '</td><td>' + fitness['Opened'] + '</td>' +
     '<td><button class=\'details_btn\' id=\''+ fitness.Id +'\'>Details</button>' +
     '<button class=\'edit_btn\' id=\''+ fitness.Id +'\'>Edit</button></td>'
    $('#fitness_table').append(result)
}

$(document).on("click", ".edit_btn" , function() {
    let index = $(this).attr('id')
    $.ajax({
        type: "GET",
        url: "../api/FitenssCenter/" + index,
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            
            AddToForm(data)
        }
    });
});

function AddToForm(data){
    $('input[name=city]').val(data.FitnessAddress.City)
    $('input[name=address]').val(data.FitnessAddress.StreetAndNumber)
    $('input[name=postalcode]').val(data.FitnessAddress.PostalCode)
    $('input[name=opened]').val(data.Opened)
    

    $('input[name=one_training]').val(data.TrainingCost)
    $('input[name=monthly]').val(data.MonthlyMembershipCost)
    $('input[name=yearly]').val(data.YearlyembershipCost)
    $('input[name=group]').val(data.GroupTrainingCost)
    $('input[name=proffesional]').val(data.ProffesionalTrainingCost)
    
    
    
    // $('#address').text(data.FitnessAddress.City + ', ' + 
    // data.FitnessAddress.StreetAndNumber + ', ' + 
    // data.FitnessAddress.PostalCode)

    // $('#opened').val($(input_id).val() + data.Opened)
    // $('#owner').val(data.FitnessOwner)
    // $('#opened').val(data.Opened)
    // $('#one_training').val(data.TrainingCost)
    // $('#monthly').val(data.MonthlyMembershipCost)
    // $('#yearly').val(data.YearlyembershipCost)
    // $('#group').val(data.GroupTrainingCost)
    // $('#proffesional').val(data.ProffesionalTrainingCost)
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