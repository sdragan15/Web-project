$(document).ready(function () {
    var data = {}
    $.ajax({
        type: "GET",
        url: "http://localhost:64103/api/FitenssCenter",
        data: "",
        dataType: "json",
        success: function (response) {
            data = JSON.parse(response)
            for(let j=0; j<data.length-1; j++){
                var min = data[j]
                var tempIdx = j
                for(let i=j+1; i<data.length; i++){
                    if(data[i]['Name'].localeCompare(min['Name']) == -1){
                        min = data[i]
                        tempIdx = i
                    }
                }
                var temp = data[j]
                data[j] = min
                data[tempIdx] = temp
            }
            
            data.forEach(element => {
                AddFitnessToTable(element)
                console.log(element)
            });
            
        }
    });
});


function AddFitnessToTable(fitness){
    var result = '<tr><td>' + fitness['Name'] + '</td><td>' + fitness['FitnessAdress'] + '</td><td>' + fitness['Opened'] + '</td></tr>'
    $('#fitness_table').append(result)
}