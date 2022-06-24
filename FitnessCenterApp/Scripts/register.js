$('#register_form').submit(function (e) { 
    let apiString = 'Visitor'
    let role = 'VISITOR'
    let temprole = $('#role').find(":selected").text();
    
    if(temprole == 'Trainer'){
        role = 'COACH'   
        apiString = 'Coach'
    }
        

    let username = $('input[name=username]').val()
    let name = $('input[name=name]').val()
    let lastname = $('input[name=lastname]').val()
    let email = $('input[name=email]').val()
    let password = $('input[name=password]').val()
    let birth = $('input[name=birth]').val()
    let gender = 1
    if($('#male').is(':checked')) {
        gender = 0                 // 0 = Male, 1 = Female
   }


   var elem = $('input[name=username]')
    if(username == ''){
        elem.focus()
        elem.addClass('error')
        return false
    }
    else{
        elem.removeClass('error')
    }

    var elem = $('input[name=name]')
    if(name == ''){
        elem.focus()
        elem.addClass('error')
        return false
    }
    else{
        elem.removeClass('error')
    }

    var elem = $('input[name=lastname]')
    if(lastname == ''){
        elem.focus()
        elem.addClass('error')
        return false
    }
    else{
        elem.removeClass('error')
    }

    var elem = $('input[name=email]')
    if(email == ''){
        elem.focus()
        elem.addClass('error')
        return false
    }
    else{
        elem.removeClass('error')
    }

    var elem = $('input[name=password]')
    if(password == ''){
        elem.focus()
        elem.addClass('error')
        return false
    }
    else{
        elem.removeClass('error')
    }

    var elem = $('input[name=birth]')
    if(birth == ''){
        elem.addClass('error')
        return false
    }
    else{
        elem.removeClass('error')
    }
   
    
    var query = {Username:username, Name:name,
                Lastname:lastname, Password:password,
                UserGender:gender, Email:email,
                Birth:birth, UserRole:role}
    query = JSON.stringify(query)


    e.preventDefault()

    $.ajax({
        type: "POST",
        url: "../api/" + apiString,
        data: query,
        dataType: "json",
        contentType: "application/json",
        complete: function(response){
            if(response.status != 201){
                alert(response.responseText)
            }
            else{
                window.location.href = '/Pages/index.html'
            }
        }
    });
    
});

