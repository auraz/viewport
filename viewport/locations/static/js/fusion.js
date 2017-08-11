/*
Authorize user to access Google Fusion table and get acess token
*/
function authUser() {
    console.log("AuthUser is called.")
    var config = {
      'client_id': googleClientId,
      'scope': 'https://www.googleapis.com/auth/fusiontables'
    };
    gapi.auth.authorize(config, function() {
      console.log('Login complete');
      console.log(gapi.auth.getToken());
      gapi.client.setApiKey(googleApiKey);
      gapi.client.load('fusiontables', 'v2');
      $('#authbutton').prop('value', 'Authorized').css('color', 'green');;
    });
}
/*
Insert data into Google Fusion table
*/
function insertRowIntoGoogleFusionTable(lat, lng, address) {
    console.log("Insert called");

    var query = "INSERT INTO " + fusionTableId + " (Address, Location) VALUES ('" + address + "', '" + lat + ", " + lng + "')";

    gapi.client.fusiontables.query.sql({sql:query}).execute(function(response){console.log(response);});
}

/*
Clear Google Fusion table
*/
function clearGoogleFusionTable(){
    console.log("Clear table called");

    var query = "DELETE FROM " + fusionTableId;

    gapi.client.fusiontables.query.sql({sql:query}).execute(function(response){console.log(response);});
}
