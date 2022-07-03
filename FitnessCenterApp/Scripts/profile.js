var CurrentUser

$(document).ready(function () {
    if(localStorage.LoggedInUser == '' || localStorage.LoggedInUser == null){
        return
    }
    let username = localStorage.LoggedInUser.split('_')[1]

    $.ajax({
        type: "GET",
        url: "../api/User?username=" + username,
        data: "",
        dataType: "json",
        complete: function (response) {
            CurrentUser = JSON.parse(response.responseJSON)
            let gender = 'MALE'
            let role = 'VISITOR'

            if(CurrentUser.UserGender == 1){
                gender = 'FEMALE'
            }

            if(CurrentUser.UserRole == 1){
                role = 'COACH'
            }
            else if(CurrentUser.UserRole == 2){
                role = 'OWNER'
            }

            $('#my_username').text(CurrentUser.Username)
            $('#my_name').text(CurrentUser.Name)
            $('#my_lastname').text(CurrentUser.Lastname)
            $('#my_gender').text(gender)
            $('#my_email').text(CurrentUser.Email)
            $('#my_birth').text(CurrentUser.Birth.split('T')[0])
            $('#my_role').text(role)
           
        }
    });
});



$('#edit_profile_btn').click(function (e) { 
    $('#edit_div').show()
    $('#cancel_profile_btn').show()
    $('#edit_profile_btn').hide()


    $('#edit_name').val(CurrentUser.Name)
    $('#edit_lastname').val(CurrentUser.Lastname)
    $('#edit_gender').val(CurrentUser.UserGender).change()
    $('#edit_email').val(CurrentUser.Email)
    $('#edit_birth').val(CurrentUser.Birth.split('T')[0])
    
    
});


$('#cancel_profile_btn').click(function (e) { 
    $('#edit_div').hide()
    $('#cancel_profile_btn').hide()
    $('#edit_profile_btn').show()
});

$('#edit_profile_form').submit(function (e) { 
    e.preventDefault()
    let name = $('#edit_name').val()
    let lastname = $('#edit_lastname').val()
    let gender = $('#edit_gender').val()
    let email = $('#edit_email').val()
    let birth = $('#edit_birth').val()
    let oldPassword = $('#edit_password').val()
    let newPassword = $('#edit_new_password').val()


    if(name == '' || lastname == '' || email == '' || birth == '' || oldPassword == ''){
        alert('Some data are missing')
        return false
    }

    if(CurrentUser.Password != oldPassword){
        alert("Wrong password")
        $('#edit_password').focus()
        return false
    }

    let updatePassword = newPassword
    if(newPassword == ''){
        updatePassword = oldPassword
    }


    let query = {Username:CurrentUser.Username, Name:name, Lastname:lastname, Password:updatePassword,
                Email:email, UserGender:gender, Birth:birth, UserRole:CurrentUser.UserRole}

    query = JSON.stringify(query)

    console.log(query)
    $.ajax({
        type: "PUT",
        url: "../api/User",
        data: query,
        dataType: "json",
        contentType: "application/json",
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