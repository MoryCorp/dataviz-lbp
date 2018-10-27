var latitude;
var longitude;

function get_position(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  // console.log("latitude : " + latitude);
  // console.log("longitude : " + longitude);
}

if(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(get_position);
