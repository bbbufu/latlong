var map,
    marker,
    geocoder = new google.maps.Geocoder();

function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      updateMarkerAddress(responses[0].formatted_address);
    } else {
      updateMarkerAddress('Cannot determine address at this location.');
    }
  });
}

function updateMarkerStatus(str) {
  document.getElementById('markerStatus').innerHTML = str;
}

function updateMarkerPosition(latLng) {
  document.getElementById('info').innerHTML = [
    latLng.lat(),
    latLng.lng()
  ].join(', ');
}

function updateMarkerAddress(str) {
  document.getElementById('address').innerHTML = str;
}

function initializeMap(pos) {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 15,
    center: pos,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  
  marker = new google.maps.Marker({
    position: pos,
    map: map,
    draggable: true
  });

  // Set default position info
  updateMarkerPosition(pos);
  geocodePosition(pos);

  // Add dragging event listeners.
  google.maps.event.addListener(marker, 'dragstart', function() {
    updateMarkerAddress('Dragging...');
  });
  
  google.maps.event.addListener(marker, 'drag', function() {
    updateMarkerStatus('Dragging...');
    updateMarkerPosition(marker.getPosition());
  });
  
  google.maps.event.addListener(marker, 'dragend', function() {
    newPos = marker.getPosition();
    updateMarkerStatus('Drag ended');
    geocodePosition(newPos);
    map.panTo(newPos); // Recenter the map on the marker
  });
}

function searchPlace() {
  var s = document.getElementById("s").value;
  geocoder.geocode({ 
    'address': s 
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      
      var _pos = results[0].geometry.location;

      marker.setPosition(_pos);
      map.setCenter(_pos);
      updateMarkerPosition(_pos);
      geocodePosition(_pos);

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function init() {
  
  var defaultPosition = new google.maps.LatLng(48.86558600467797, 2.3089150848388726);
  var latLng;

  if( navigator.geolocation ) {

    navigator.geolocation.getCurrentPosition( function (position) {
      console.log("Geolocation ok");
      initializeMap( new google.maps.LatLng(position.coords.latitude, position.coords.longitude) );

    }, 
    function() { // Geolocation failed or denied
      console.log("Geolocation failed or denied");
      initializeMap(defaultPosition);
    });
  }
  else { // Geolocation not supported in the browser
    console.log("Geolocation feature not supported");
    initializeMap(defaultPosition);
  }
  
}

// Onload handler to fire off the app.
google.maps.event.addDomListener(window, 'load', init);