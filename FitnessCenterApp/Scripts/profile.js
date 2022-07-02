$('#edit_profile_btn').click(function (e) { 
    $('#edit_div').show()
    $('#cancel_profile_btn').show()
    $('#edit_profile_btn').hide()
    
});


$('#cancel_profile_btn').click(function (e) { 
    $('#edit_div').hide()
    $('#cancel_profile_btn').hide()
    $('#edit_profile_btn').show()
});
