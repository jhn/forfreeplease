function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, handleError, {maximumAge: 600000, timeout: 5000});
    } else {
        alert("Location cannot be retrieved");
    }
}

function handleError(error) {
    console.log("There has been an error: " + error);
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
        });
    });
}
