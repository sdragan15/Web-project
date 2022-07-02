function FilterFitnessCenterTableByValue(value){
    var FilteredCenters = []
    value = value.toLowerCase()
    FitnessCenters.forEach(element => {
        let name = element.Name.toLowerCase()
        let address = element.FitnessAddress.StreetAndNumber.toLowerCase()
        let opened = element.Opened.toString()
        if(name.includes(value) || address.includes(value) || opened.includes(value)){
            FilteredCenters.push(element)
        }
    });
    

    data = CustomSortString(FilteredCenters, 'Name', -1)
    DeleteFitnessRows()
    data.forEach(element => {
        AddFitnessToTable(element)
    });
}


function FilterGroupTrainingsByValue(value, data, searchType){
    console.log('hello')
    let GroupTrainings = []
    value = value.toLowerCase()
    

    data.forEach(element => {
        if(searchType == 'name'){
            let name = element.Name.toLowerCase()
            
            if(name.includes(value)){
                GroupTrainings.push(element)
            }
        }
        else if(searchType == 'type'){
            
            let type = element.TrainingType.toLowerCase()
         
            if(type.includes(value)){
                GroupTrainings.push(element)
            }
        }
        else if(searchType == 'place'){
            
            let place = element.Place.toLowerCase()
            if(place.includes(value)){
                GroupTrainings.push(element)
            }
        }
        else{
            let name = element.Name.toLowerCase()
            let type = element.TrainingType.toLowerCase()
            let place = element.Place.toLowerCase()
            if(name.includes(value) || type.includes(value) || place.includes(value)){
                GroupTrainings.push(element)
            }
        }
    });
    
    DeleteTrainingRows()
    GroupTrainings.forEach(element => {
        AddTrainingToTableForCoach(element)
    });
}
