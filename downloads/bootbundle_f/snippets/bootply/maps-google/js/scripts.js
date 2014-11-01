
$(document).ready(function(){/* google maps -----------------------------------------------------*/
google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {

  /* position Amsterdam */
  var latlng = new google.maps.LatLng(52.3731, 4.8922);
  var latlng1 = new google.maps.LatLng(52.3700, 4.8933);
  var latlng2 = new google.maps.LatLng(52.3820, 4.8890);
  var latlng3 = new google.maps.LatLng(52.3855, 4.9033);
  var latlng4 = new google.maps.LatLng(52.3800, 4.8930);

  var mapOptions = {
    center: latlng,
    scrollWheel: false,
    zoom: 13
  };
  
  var marker = new google.maps.Marker({
    position: latlng,
    url: '/',
    title: "Marker at " + latlng,
    animation: google.maps.Animation.DROP
  });
  
  var marker1 = new google.maps.Marker({
    position: latlng1,
    title: "Marker at " + latlng1,
    url: '/'
  });
  
  var marker2 = new google.maps.Marker({
    position: latlng2,
    title: "Marker at " + latlng2,
    url: '/'
  });
  
  var marker3 = new google.maps.Marker({
    position: latlng3,
    title: "Marker at " + latlng3,
    url: '/'
  });
  
  var marker4 = new google.maps.Marker({
    position: latlng4,
    title: "Marker at " + latlng4,
    url: '/'
  });
  
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  marker.setMap(map);
  marker1.setMap(map);
  marker2.setMap(map);
  marker3.setMap(map);
  marker4.setMap(map);

};
/* end google maps -----------------------------------------------------*/
});