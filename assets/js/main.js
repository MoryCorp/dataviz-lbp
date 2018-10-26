var data;
var map_style;
var average_price = 0;
var markers = [];

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
    function setMarkesHours(hour){
        console.log(data);
        for (i = 0; i < data.length; i++) { //TODO : Mettre la condition pour le range slider !! Il faut deja reformate le sheet
            if (parseFloat(data[i].price_regular) >= average_expensive) {
                beer_icon = "assets/img/beer-expensive.png";
                // console.log(data[i].price_regular)
            } else if (parseFloat(data[i].price_regular) <= average_cheap) {
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
                var content_bar = '<h1>' + data[i].bar_name + '</h1><p>' + data[i].address + '</p>';


                return function() {
                    infowindow.setContent(content_bar);

                    infowindow.open(map, marker);
                }
            })
            (marker, i));
        }

    }

  // console.log(data);

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: new google.maps.LatLng(45.7623323, 4.8262804),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: map_style
  });


  var infowindow = new google.maps.InfoWindow();
  var marker, i;

  average_cheap = average_price * 0.90;
  average_expensive = average_price * 1.10;

  $("#PrixM").text('Prix Moyen : ' + Math.round(average_price * 100) / 100 + "€");

  // console.log("Prix moyenne basse " + average_cheap);
  // console.log("Prix Moyen : " + average_price);
  // console.log("Prix moyenne haute : " + average_expensive);

  for (i = 0; i < data.length; i++) {
    if (parseFloat(data[i].price_regular) >= average_expensive) {
      beer_icon = "assets/img/beer-expensive.png";
      // console.log(data[i].price_regular)
    } else if (parseFloat(data[i].price_regular) <= average_cheap) {
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
        var content_bar = '<h1>' + data[i].bar_name + '</h1><p>' + data[i].address + '</p>';


        return function() {
          infowindow.setContent(content_bar);

          infowindow.open(map, marker);
        }
      })
      (marker, i));
  }


    $( "#target" ).click(function() {
        //deleteMarkers()
        //setMarkesHours()
    });
}

$(function() {

  $.get("assets/js/gmap_style.json", function(result) {
    map_style = result;

    // console.log("READY");

    var URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2gr_tgGs7ziW83sgOauf6WZw7sMfE4ToemXeffMue1JMdmjSaDcu5flbKga-h9DtU0YkCS_lrPQTf/pub?gid=1788698224&single=true&output=csv";


    d3.csv(URL, function(d) {
      var cpt_nb_bar = 0;
      data = d;

      //     console.log(data);
      //   console.log(data);
      data.forEach(function(d) {
        if (d.lat !== "#N/A") {
          if (d.price_regular.length >= 1) {
            average_price += parseFloat(d.price_regular);
            cpt_nb_bar++;
            //console.log(average_pricerice)
          }
        }
      });
      average_price = average_price / cpt_nb_bar;
      //TODO : Ici c'est trop bien
      initMap()

    });


  });
});
