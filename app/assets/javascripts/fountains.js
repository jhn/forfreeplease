var foundFountains = [];
var userLocation;
var userMap;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, {maximumAge: 600000, timeout: 5000});
    } else {
        alert("Location cannot be retrieved");
    }
}

function error(e) {
    console.log("There has been an error: " + e);
    console.log("Probably the timeout expired?");
}

// Gets the radius specified by the user. Defaults to 0.5 km
function getRadius() {
    $('#foursquare').empty();
    var radioButtons = document.getElementsByTagName('input');
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].type === 'radio' && radioButtons[i].checked) {
            return parseFloat(radioButtons[i].value);
        }
    }
}

function success(userPosition) {
    var lat = userPosition.coords.latitude;
    var lon = userPosition.coords.longitude;
    var rad = getRadius();

    userLocation = new google.maps.LatLng(lat, lon);

    console.log("User is at: [" + lon + ", " + lat + "], and selected radius " + rad);

    $.getJSON("fountains", { longitude: lon, latitude: lat, radius: rad }, function(data) {
            showMap(data, userPosition);
    });
}

function showMap(fountains, userPosition) {
    // Should handle case where there's no fountains to display
    var mapOptions = {
        center: new google.maps.LatLng(userPosition.coords.latitude, userPosition.coords.longitude),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    userMap = map;

    createMarkersForMap(fountains, map);
}

function createMarkersForMap(fountains, map) {
    var marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        title: 'you'
    });

    var pinColor = "3E90FA";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
    var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));

    fountains.forEach(function(fountain) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(fountain.location[1], fountain.location[0]),
            map: map,
            icon: pinImage,
            shadow: pinShadow
        });

        google.maps.event.addListener(marker, 'click', function() {
            map.setZoom(15);
            map.setCenter(marker.getPosition());
            $("#map").data('loc', fountain.location);
        });
    });
}

var polyline;
function getDirections() {
    $('#foursquare').empty(); // Clear the current deals
    if(polyline && polyline.setMap(null));
    // console.log(pathStyle);

    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay.setMap(userMap);
    var to = $("#map").data('loc');
    var from = userLocation;
    var request = {
        origin: from,
        destination: new google.maps.LatLng(to[1], to[0]),
        travelMode: google.maps.TravelMode.WALKING
    };

    var drivePath = [];
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            response.routes[0].legs[0].steps.forEach(function(t){
                // console.log(drivePath.push[new google.maps.LatLng(t.path[0].nb, t.path[0].ob)]);
                console.log(drivePath.push(new google.maps.LatLng(t.path[0].nb, t.path[0].ob)));
            });
            directionsDisplay.setDirections(response);
        }
    });
    polyline = new google.maps.Polyline({
        path: drivePath,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    var rad = getRadius();

    $.getJSON("foursquare", { longitude: to[0], latitude: to[1], radius: rad }, function(data) {
        renderDeals(data);
    });
}

function renderDeals(data){
    data = data.sort(function(a, b){ return a.venue.name - b.venue.name; });

    for(var i = 0; i < data.length - 1; i++) {
        if (data[i].venue.name == data[i+1].venue.name) {
            delete data[i];
        }
    }

    data.forEach(function(special){
        deal = "<div class=\"venue\"><p class=\"v-title\">Venue: " + special.venue.name + "</p><p class=\"v-desc\">Description: " + special.message + "</p><p class=\"v-how\">How: " + special.description + "</p>";
        $('#foursquare').append("<li> "+ deal +" </li>");
    });
}
