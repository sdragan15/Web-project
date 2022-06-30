var FitnessOwnerUsername
var FitnessId

$(document).ready(function () {    
    FitnessOwnerUsername = localStorage.LoggedInUser.split('_')[1]
    let apiQuery = 'FitenssCenterForOwner?username=' + FitnessOwnerUsername

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

$('#add_fitness_form').submit(function (e) { 
    let name = $('input[name=name]').val()
    let city = $('input[name=city]').val()
    let address = $('input[name=address]').val()
    let postalcode = $('input[name=postalcode]').val()
    let opened = $('input[name=opened]').val()
    

    let one_training = $('input[name=one_training]').val()
    let monthly = $('input[name=monthly]').val()
    let yearly = $('input[name=yearly]').val()
    let group = $('input[name=group]').val()
    let proffesional = $('input[name=proffesional]').val()

    

    if(ValidateInput(name, 'name') && ValidateInput(city, 'city') &&
    ValidateInput(address, 'address') && ValidateInput(postalcode, 'postalcode') &&
    ValidateInput(opened, 'opened') && ValidateInput(one_training, 'one_training') &&
    ValidateInput(monthly, 'monthly') && ValidateInput(yearly, 'yearly') && 
    ValidateInput(group, 'group') && ValidateInput(proffesional, 'proffesional')){

        if($('#add_fitness_form').attr('class') == 'add'){
            let addressQuery = {City:city, StreetAndNumber:address, PostalCode:postalcode}
            let query = {Name:name, FitnessAddress:addressQuery, Opened:opened, MonthlyMembershipCost:monthly,
                YearlyembershipCost:yearly, TrainingCost:one_training, GroupTrainingCost:group, ProffesionalTrainingCost:proffesional,
                FitnessOwner:FitnessOwnerUsername}

            query = JSON.stringify(query)

            $.ajax({
                type: "POST",
                url: "../api/FitenssCenter",
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
            let addressQuery = {City:city, StreetAndNumber:address, PostalCode:postalcode}
            let query = {Id:FitnessId, Name:name, FitnessAddress:addressQuery, Opened:opened, MonthlyMembershipCost:monthly,
                YearlyembershipCost:yearly, TrainingCost:one_training, GroupTrainingCost:group, ProffesionalTrainingCost:proffesional,
                FitnessOwner:FitnessOwnerUsername}

            query = JSON.stringify(query)

            $.ajax({
                type: "PUT",
                url: "../api/FitenssCenter",
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
        return false
    }

    
});

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

function AddFitnessToTableForOwner(fitness){
    if(!fitness.Deleted){
        var result = '<tr><td>' + fitness['Name'] +
        '</td><td>' + fitness.FitnessAddress.StreetAndNumber + 
        '</td><td>' + fitness['Opened'] + '</td>' +
        '<td><button class=\'details_btn\' id=\''+ fitness.Id +'\'>Details</button>' +
        '<button class=\'edit_btn\' id=\''+ fitness.Id +'\'>Edit</button>' + 
        '<button class=\'delete_fitness_btn\' id=\''+ fitness.Id +'\'>Delete</button></td>'
       $('#fitness_table').append(result)
    }
    
}

$(document).on('click', '.delete_fitness_btn', function () {
    FitnessId = $(this).attr('id')
    $.ajax({
        type: "DELETE",
        url: "../api/FitenssCenter/" + FitnessId,
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

$(document).on("click", ".edit_btn" , function() {
    $('#edit_header').show()
    $('#add_header').hide()
    $('#submit_btn').hide()
    $('#cancel_btn').show()
    $('#edit_btn_submit').show()
    $('#add_fitness_form').attr('class', 'update')

    FitnessId = $(this).attr('id')
    
    $.ajax({
        type: "GET",
        url: "../api/FitenssCenter/" + FitnessId,
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            
            AddToForm(data)
        }
    });
});


$('#cancel_btn').click(function (e) { 
    e.preventDefault()
    $('#edit_header').hide()
    $('#add_header').show()
    $('#submit_btn').show()
    $('#cancel_btn').hide()
    $('#edit_btn_submit').hide()
    $('#add_fitness_form').attr('class', 'add')

    $('input[name=name]').val('')
    $('input[name=city]').val('')
    $('input[name=address]').val('')
    $('input[name=postalcode]').val('')
    $('input[name=opened]').val('')
    

    $('input[name=one_training]').val('')
    $('input[name=monthly]').val('')
    $('input[name=yearly]').val('')
    $('input[name=group]').val('')
    $('input[name=proffesional]').val('')
    
});

function AddToForm(data){
    FitnessId = data.Id
    $('input[name=name]').val(data.Name)
    $('input[name=city]').val(data.FitnessAddress.City)
    $('input[name=address]').val(data.FitnessAddress.StreetAndNumber)
    $('input[name=postalcode]').val(data.FitnessAddress.PostalCode)
    $('input[name=opened]').val(data.Opened)
    

    $('input[name=one_training]').val(data.TrainingCost)
    $('input[name=monthly]').val(data.MonthlyMembershipCost)
    $('input[name=yearly]').val(data.YearlyembershipCost)
    $('input[name=group]').val(data.GroupTrainingCost)
    $('input[name=proffesional]').val(data.ProffesionalTrainingCost)
    
}

$(document).on("click", ".details_btn" , function() {
    location.href='fitnesscenterOwnerDetails.html';
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
        AddFitnessToTableForOwner(element)
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
        AddFitnessToTableForOwner(element)
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
        AddFitnessToTableForOwner(element)
    });

});

function DeleteFitnessRows(){
    $("#fitness_table").find("tr:gt(0)").remove();
}

