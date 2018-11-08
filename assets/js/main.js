var data;
var map_style;
var average_price = 0;
var markers = [];

var now = new Date();
current_hour = now.getHours();
current_minute = now.getMinutes();
current_day  = now.getDay();
if (current_minute < 10){
    current_minute = ('0'+current_minute).slice(-2)
}
var current_time = parseInt("" + current_hour + current_minute);
//console.log(parseInt(current_time));

function CleanHour(hourStr,type) {
    if (type === 'happy'){
        hour_replace = hourStr.replace("-","");
        hour_replace = hour_replace.replace("h","");
        hour_replace = hour_replace.replace("h","");
        hour_replace = hour_replace.replace("H","");
        return hour_replace
    }
}


function initMap() {

    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }
    function clearMarkers() {
        setMapOnAll(null);
    }
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }
    function setMarkesHours(jour,hour){

        //console.log(data);
        for (i = 0; i < data.length; i++) { //TODO : Mettre la condition pour le range slider !! Il faut deja reformate le sheet
            if (jour === "Lundi"){
                if (data[i].lundi.length > 0){
                    console.log(data[i])
                }
            }
            else if (jour === "Mardi"){
                console.log(data[i])
            }
            else if (jour === "Mercredi"){
                console.log(data[i])
            }
            else if (jour === "Jeudi"){
                console.log(data[i])
            }
            else if (jour === "Vendredi"){
                console.log(data[i])
            }
            else if (jour === "Samedi"){
                console.log(data[i])
            }
            else if (jour === "Dimanche"){
                console.log(data[i])
            }
            else if (jour === "Tous les jours"){
                console.log(data[i])
            }
        }

    }

  // console.log(data);

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: new google.maps.LatLng(45.7623323, 4.8262804),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: map_style
  });

  if (navigator.geolocation)
  var watchId = navigator.geolocation.watchPosition(successCallback,
                            null,
                            {enableHighAccuracy:true});
else
  alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");

function successCallback(position){
  map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    map: map
  });
}

  var infowindow = new google.maps.InfoWindow();
  var marker, i;

  average_cheap = average_price * 0.90;
  average_expensive = average_price * 1.10;

  $("#PrixM").text('Prix Moyen : ' + Math.round(average_price * 100) / 100 + "€");

//  console.log("Prix Moyen : " + average_price);
//  console.log("Prix moyenne basse " + average_cheap);
//  console.log("Prix moyenne haute : " + average_expensive);

  for (i = 0; i < data.length; i++) {
    if (parseFloat(data[i].price_happy_hour) >= average_expensive) {
      beer_icon = "assets/img/beer-expensive.png";
      // console.log(data[i].price_regular)
    } else if (parseFloat(data[i].price_happy_hour) <= average_cheap) {
      beer_icon = "assets/img/beer-cheap.png";
      // console.log(data[i].price_regular)
    } else {
      beer_icon = "assets/img/beer-regular.png";
    }

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(data[i].lat, data[i].long),
      map: map,
      icon: new google.maps.MarkerImage(beer_icon)
    });

    markers.push(marker);

    google.maps.event.addListener(marker, 'click', (function(marker, i) {

        var happy_hour_clean = CleanHour(data[i].lundi_happy,"happy");
        var hour_happy_start = parseInt(happy_hour_clean[0]+happy_hour_clean[1]+happy_hour_clean[2]+happy_hour_clean[3]);
        var hour_happy_end = parseInt(happy_hour_clean[4]+happy_hour_clean[5]+happy_hour_clean[6]+happy_hour_clean[7]);

      //  console.log(data[i].bar_name,hour_happy_start,hour_happy_end);
      //  console.log(current_time)


        if (current_time >= hour_happy_start && current_time <= hour_happy_end ){

            hour_happy = "" +hour_happy_end;
            hour_happy = hour_happy[0]+hour_happy[1];
            hour_happy = parseInt(hour_happy);
            minute_happy = "" +hour_happy_end;
            minute_happy = minute_happy[2]+minute_happy[3];
            minute_happy = parseInt(minute_happy);
            timerH_happy  = Math.abs(hour_happy - current_hour);
            timerM_happy  = minute_happy - current_minute;
            happy_second =  hour_happy * 3600 + minute_happy * 60;
            current_time_second = current_hour * 3600 + current_minute * 60;

            var date = new Date(null);
            date.setSeconds((happy_second - current_time_second)); // specify value for SECONDS here
            var timer_happy = date.toISOString().substr(11, 8);
            console.log("end: " +timer_happy, data[i].bar_name);
            var content_bar = '<h1>' + data[i].bar_name + '</h1><p>' + data[i].address + '<br>' + 'Prix actuel : ' + data[i].price_happy_hour +  '<br>' + 'Happy hour : ' + timer_happy +' restantes'+ '</p>';

        }
        else {

            hour_happy = "" +hour_happy_start;
            hour_happy = hour_happy[0]+hour_happy[1];
            hour_happy = parseInt(hour_happy);
            minute_happy = "" +hour_happy_end;
            minute_happy = minute_happy[2]+minute_happy[3];
            minute_happy = parseInt(minute_happy);
            timerH_happy  = Math.abs(hour_happy - current_hour);
            timerM_happy  = minute_happy - current_minute;
            happy_second =  hour_happy * 3600 + minute_happy * 60;
            current_time_second = current_hour * 3600 + current_minute * 60;

            if (!isNaN(happy_second)){
                var date = new Date(null);
                date.setSeconds((happy_second - current_time_second)); // specify value for SECONDS here
                var timer_happy = date.toISOString().substr(11, 8);
                console.log("Start: " +timer_happy, data[i].bar_name);
            }


            var content_bar = '<h1>' + data[i].bar_name + '</h1><p>' + data[i].address + '<br>' + 'Prix actuel : ' + data[i].price_regular +  '<br>' + 'Happy hour : ' + timer_happy +' avant le début'+  '</p>';
        }




        return function() {
          infowindow.setContent(content_bar);

          infowindow.open(map, marker);
        }
      })
      (marker, i));
  }


    $( "#target" ).click(function() {
        //deleteMarkers()
        setMarkesHours('lundi',17) //TODO Il faut que l'input du jours soit format comme ça => lundi_happy, mardi_hayppy...
    });
}

$(function() {


    $.get("assets/js/gmap_style.json", function(result) {
    map_style = result;


    var URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2gr_tgGs7ziW83sgOauf6WZw7sMfE4ToemXeffMue1JMdmjSaDcu5flbKga-h9DtU0YkCS_lrPQTf/pub?gid=1788698224&single=true&output=csv";


    d3.csv(URL, function(d) {
      var cpt_nb_bar = 0;
      data = d;

      //   console.log(data);
      data.forEach(function(d) {

          if (d.price_happy_hour.length >= 1) {
//
            average_price += parseFloat(d.price_happy_hour);
            cpt_nb_bar++;
           // console.log(cpt_nb_bar)
          }

      });
      average_price = average_price / cpt_nb_bar;
      //TODO : Ici c'est trop bien
      initMap()

    });


  });
});
