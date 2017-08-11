var markers = [];
/*
Place marker on the map.
*/
function renderMarker(latLng, map) {
     var marker = new google.maps.Marker({position: latLng, map:
            map});
     markers.push(marker);
}

/*
Render address details under the map.
*/
function renderAddress(lat, lng, address) {
    $("#addr" ).append($("<li>").text("Lat, lng: " + lat + ", " + lng +  ". Address: " + address));
}

/* Get addresses from backend and render under map */
function getAddresses() {
    $.ajax({
        url: '/addresslist/',
        type: "get",
        beforeSend: function(request) {
            request.setRequestHeader("X-CSRFToken", csrf_token);
        },
        success: function (addresses, statusText, xhr) {
            console.log(addresses);
            _.each(addresses, function(x) {
                renderAddress(x.lat, x.lng, x.address);
                renderMarker({ lat: x.lat, lng: x.lng }, window.map);
            }); // render existing addresses and markers

        }
    });
};


/*
Save address to backend and if it is not a duplicate, then render marker and address details.
*/
function saveAddressAndRender(latLng, addr, map) {
    var [lat, lng, address] = [addr.geometry.location.lat(), addr.geometry.location.lng(), addr.formatted_address];
    $.ajax({
        url: '/address/',
        data: {'lat':lat, 'lng': lng, 'address': address, 'place_id': addr.place_id},
        dataType: 'json',
        type: "POST",
        beforeSend: function(request) {
            request.setRequestHeader("X-CSRFToken", csrf_token);
        },
        success: function (data, statusText, xhr) {
            console.log(xhr.status);
            if (xhr.status === 201) {  // set marker if not a duplicate
                renderMarker(latLng, map)
                renderAddress(lat, lng, address);
                insertRowIntoGoogleFusionTable(lat, lng, address);
            }
            else if (xhr.status == 200) { console.log("Duplicate. Not created.")}
        },
    });
}


/*
Get address from clicked point on map from geocoder service from Google. Check if it is real.
*/
function getAddress(latLng, geocoder, map) {
    geocoder.geocode({'latLng': latLng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //Address is real, if one of its components contain street_address type. Usually 1st or 2nd.
            var streetAddr = _.find(results, function(x){ return _.contains(x.types,"street_address"); });
            if (typeof streetAddr != "undefined") {
                console.log("Address found: ", streetAddr);
                saveAddressAndRender(latLng, streetAddr, map);
            }
            else { console.log("Not an street_address", results); }
        }
        else { console.log("Wrong status of request to geocoder api. Probably not a real address clicked (middle of the sea)."); }
    });
}

/*
Initialize and render map and existing addresses, add listeners for settings markers.
*/
function initMap() {
    var center = {lat: 47.3686, lng: 8.5392};  // Zurich
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 11, center: center });
    window.map = map;
    var geocoder = new google.maps.Geocoder();
    map.addListener('click', function(e) { getAddress(e.latLng, geocoder, map); });
    getAddresses();

    // bind reset
    $("button").click(function(e) {
        e.preventDefault();
        $.ajax({
            beforeSend: function(request) {
                request.setRequestHeader("X-CSRFToken", csrf_token);
            },
            type: "DELETE",
            url: "/addresslist/",
            success: function(data, statusText, xhr) {
                clearGoogleFusionTable(); // clear google fusion data
                $("ol").empty();  // clean list
                _.each(markers, function (x) { x.setMap(null); } );// clean markers
                markers = [];
                console.log("Deleted all addresses. ", data, statusText, xhr.status);
            }
        });
    });

}



