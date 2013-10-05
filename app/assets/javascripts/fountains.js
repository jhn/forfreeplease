var foundFountains = [];
var userLocation;
var userMap;
var spinner = null;

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

    $.getJSON("fountains", { longitude: lon, latitude: lat, radius: rad }, function(data) {
            showMap(data, userPosition);
    });
}

function showMap(fountains, userPosition) {
    // Should handle case where there's no fountains to display
    var mapOptions = {
        center: new google.maps.LatLng(userPosition.coords.latitude, userPosition.coords.longitude),
        zoom: 16,
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
            map.setZoom(17);
            map.setCenter(marker.getPosition());
            $("#map").data('loc', fountain.location);
            // Fire off a request.
            getDirections();
        });
    });
}

function getDirections() {
    $('#foursquare').empty();

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

    var rad = getRadius();

    spinSpinner();
    $.getJSON("foursquare", { longitude: to[0], latitude: to[1], radius: rad }, function(data) {
        renderDeals(data);

        spinner.stop();
    });
}

function renderDeals(data){
    data = data.sort(function(a, b){ return a.venue.name - b.venue.name; });

    // Only display the 5 best deals
    if(data.length > 5){
        data = data.slice(0, 5);
    }

    for(var i = 0; i < data.length - 1; i++) {
        if (data[i].venue.name == data[i + 1].venue.name) {
            delete data[i];
        }
    }

    // Get rid of the button
    data.forEach(function(special){
        deal = "<div class=\"venue\"><h3 class=\"v-title\">" + special.venue.name + "</h3><p class=\"v-desc\">" + special.message + "</p><p class=\"v-how\">How: " + special.description + "</p>";
        $('#foursquare').append("<li> "+ deal +" </li>");
    });
}

function spinSpinner(){
    var opts = {
        lines: 13, // The number of lines to draw
        length: 7, // The length of each line
        width: 2, // The line thickness
        radius: 7, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 2, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('foo');
    if (spinner == null) {
        spinner = new Spinner(opts).spin(target);
    } else {
        spinner.spin(target);
    }
}
