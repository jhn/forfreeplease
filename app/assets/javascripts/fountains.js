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
            console.log(fountain.location);
            $("#map").data('loc', fountain.location);
        });
    });
}

function getDirections() {
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

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
    });

    var rad = getRadius();

    $.getJSON("foursquare", { longitude: to[0], latitude: to[1], radius: rad }, function(data) {
        console.log("in 4sq call");
        console.log(data);
    });
}
