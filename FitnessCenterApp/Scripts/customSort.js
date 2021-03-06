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

function CustomSortTrainingDate(data, type){
    data.sort(function(a,b){
        dateA = a.DateAndTime.split('T')[0]
        dateB = b.DateAndTime.split('T')[0]
        if(type == 1)
            return new Date(dateB) - new Date(dateA);
        else{
            return new Date(dateA) - new Date(dateB);
        }
      });

    return data
}

function CustomSortTrainingTime(data, type){
      data.sort(function (a, b) {
        dateA = a.DateAndTime.split('T')[1]
        dateB = b.DateAndTime.split('T')[1]
        if(type == -1)
            return dateB.localeCompare(dateA);
        else{
            return dateA.localeCompare(dateB);
        }
    });

    return data
}
