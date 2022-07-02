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