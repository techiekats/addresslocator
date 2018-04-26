var currentDataList = [];

function zipCodeAdded() {
    var zipCode = document.getElementById('zipCode').value;  
    if (zipCode.length > 0) {
        if (zipCode.length < 4) {
            flagError('Zip code not entered');
        }
        else if (!parseInt(zipCode)) {
            flagError('Invalid zip code was entered');
        }
        else {
            //TODO: call hideError here
            var matchingLocationIndex = postalCodes.binaryIndexOf(zipCode, zipCodeComparator);
            if (matchingLocationIndex >= 0) {
                var matchingLocation = postalCodes[matchingLocationIndex];
                document.getElementById('sted').value = matchingLocation.sted;
            }
            else {
                flagError('Zip code was not found');
            }
        }
    }
};

function gateWasChanged() {
    var gateText = document.getElementById('gate').value;
    if (!!gateText) {        
        //TODO: if the user types the next letter in less than 500 ms, cancel the existing request
        if (gateText.length >= 4) /*This is to let user type sufficiently before web call is made*/ {
            fetchGatesAsync(gateText)
            .then (data => populateDataList(data) )
            .catch(reason => console.log(reason));
        }
    }
};

function populateDataList(data) { 
    currentDataList = data;   
    var optionsText = '';
    for (var i=0; i < data.length; i++) {
        optionsText += '<option value="' + data[i].gate + '" />';
    }
    //implies exact match found because click event does not get fired
    if (data.length ===1) {
        document.getElementById('zipCode').value = data[0].postnr;
        document.getElementById('sted').value = data[0].sted;
    }
    document.getElementById('gatesList').innerHTML = optionsText;
};

async function fetchGatesAsync (gateText) {
        let query = ` http://folk.ntnu.no/oeivindk/imt1441/sok.php?q=${gateText}`;
        let response = await fetch(query);
        let data = await response.json();
        return data;
};

function flagError(message) {
    document.getElementById('errorText').innerText = message;
    document.getElementById('errorText').style = 'color:red; display:block;';
};

function zipCodeComparator(currentElement, searchElement) {
    if (currentElement.nr == searchElement) {
        return 0;
    }
    return -1;
};