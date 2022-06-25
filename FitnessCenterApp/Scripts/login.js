$(document).ready(function () {
    NoLoggedUserMode()   
});

function NoLoggedUserMode(){
    $('#signout_nav').hide()
}

$('#login_form').submit(function (e) { 
    let username = $('input[name=username]').val() 
    let password = $('input[name=password]').val()


   var elem = $('input[name=username]')
    if(username == ''){
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

    
    var query = {Username:username, Password:password}
    query = JSON.stringify(query)


    e.preventDefault()

    $.ajax({
        type: "POST",
        url: "../api/User",
        data: query,
        dataType: "json",
        contentType: "application/json",
        complete: function(response){
            if(response.status != 200){
                alert(response.responseText)
            }
            else{
                let result = JSON.parse(response.responseText)
                let token = result.token
                let userrole = result.UserRole
                localStorage.LoggedInRole = userrole
                localStorage.LoggedInUser = token
                console.log(response.responseText)
                window.location.href = '/Pages/index.html'
            }
        }
    });
    
});

