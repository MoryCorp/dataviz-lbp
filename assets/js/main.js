
var data;
var map_style;

$.getJSON( "./gmap_style.json", function( data ) {
  map_style = [data];
  console.log(map_style);
  });


function initMap() {

   // console.log(data);

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(45.7623323, 4.8262804,15),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    });


    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < data.length; i++) {

       marker = new google.maps.Marker({
            position: new google.maps.LatLng(data[i].lat, data[i].long),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            var content_bar = '<h1>'+data[i].bar_name+'</h1><p>'+data[i].address+'</p>';


            return function() {
                infowindow.setContent(content_bar);

                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

$(function () {

   // console.log("READY");

    var URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2gr_tgGs7ziW83sgOauf6WZw7sMfE4ToemXeffMue1JMdmjSaDcu5flbKga-h9DtU0YkCS_lrPQTf/pub?gid=1788698224&single=true&output=csv";


    d3.csv(URL, function (d) {
        data = d;
        //   console.log(data);
        data.forEach(function (d) {
            if (d.lat !=="#N/A"){
               // console.log(d.lat)

            }
        });
        //TODO : Ici c'est trop bien
        initMap()

    });



});
