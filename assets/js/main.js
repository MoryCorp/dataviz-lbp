var data;
var map_style;
var average_price = 0;
var markers = [];
var cheap_beer = 100;

var now = new Date();
current_hour = now.getHours();
current_minute = now.getMinutes();
current_day = now.getDay();
var current_time_minute = current_hour * 60 + current_minute;
var days2label = ['', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];

function CleanHour(hourStr, type) {
    if (type === 'happy') {
        hour_replace = hourStr.replace("-", "");
        hour_replace = hour_replace.replace("h", "");
        hour_replace = hour_replace.replace("h", "");
        hour_replace = hour_replace.replace("H", "");
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


    // console.log(data);

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(45.7623323, 4.8262804),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: map_style,
        mapTypeControl: false,
        streetViewControl: false
    });

    if (navigator.geolocation)
        var watchId = navigator.geolocation.getCurrentPosition(successCallback,
            null,
            {enableHighAccuracy: true});
    else
        alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");

    function successCallback(position) {
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

    // for cheap beer
    var cheap_bar_index = -1;
    for (i = 0; i < data.length; i++) {

        if (parseFloat(data[i].current_price) < cheap_beer) {
            cheap_beer = data[i].current_price;
            cheap_bar_index = i;
        }
    }

    for (i = 0; i < data.length; i++) {
        if (i === cheap_bar_index || data[i].current_price === cheap_beer) {
            beer_icon = "assets/img/Rainbowbeer.png";
        }
        else {
            if (parseFloat(data[i].current_price) >= average_expensive) {
                beer_icon = "assets/img/beer-expensive.png";
            } else if (parseFloat(data[i].current_price) <= average_cheap) {
                beer_icon = "assets/img/beer-cheap.png";
            } else {
                beer_icon = "assets/img/beer-regular.png";
            }
        }


        marker = new google.maps.Marker({
            position: new google.maps.LatLng(data[i].lat, data[i].long),
            map: map,
            icon: new google.maps.MarkerImage(beer_icon)
        });

        markers.push(marker);

        google.maps.event.addListener(marker, 'click', (function (marker, i) {

            var happy_hour_clean = CleanHour(data[i].lundi_happy, "happy");
            var hour_happy_start = parseInt(happy_hour_clean[0] + happy_hour_clean[1] + happy_hour_clean[2] + happy_hour_clean[3]);
            var hour_happy_end = parseInt(happy_hour_clean[4] + happy_hour_clean[5] + happy_hour_clean[6] + happy_hour_clean[7]);

            //  console.log(data[i].bar_name,hour_happy_start,hour_happy_end);
            //  console.log(current_time)


            if (data[i].is_happy) {

                var hour_happy = "" + hour_happy_end;
                hour_happy = hour_happy[0] + hour_happy[1];
                hour_happy = parseInt(hour_happy);
                var minute_happy = "" + hour_happy_end;
                minute_happy = minute_happy[2] + minute_happy[3];
                minute_happy = parseInt(minute_happy);
                var timerH_happy = Math.abs(hour_happy - current_hour);
                var timerM_happy = minute_happy - current_minute;
                var happy_minute = hour_happy * 60 + minute_happy;

                var date = new Date(null);
                date.setSeconds((happy_minute - current_time_minute)); // specify value for SECONDS here
                var timer_happy = date.toISOString().substr(11, 8);

                var content_bar = '<h1>' + data[i].bar_name + '</h1><p>' + data[i].address + '<br>' + 'Prix actuel : ' + data[i].current_price + '<br>' + 'Happy hour : ' + timer_happy + ' restantes' + '</p>';

            }
            else {

                var hour_happy = "" + hour_happy_start;
                hour_happy = hour_happy[0] + hour_happy[1];
                hour_happy = parseInt(hour_happy);
                var minute_happy = "" + hour_happy_end;
                minute_happy = minute_happy[2] + minute_happy[3];
                minute_happy = parseInt(minute_happy);
                var timerH_happy = Math.abs(hour_happy - current_hour);
                var timerM_happy = minute_happy - current_minute;
                var happy_minute = hour_happy * 60 + minute_happy;
                var date = new Date(null);
                if (!isNaN(happy_minute)) {
                    date.setSeconds((happy_minute - current_time_minute)); // specify value for SECONDS here
                    var timer_happy = date.toISOString().substr(11, 8);
                }

                if (timer_happy === undefined) {
                    var content_bar = '<h1>' + data[i].bar_name + '</h1><p>' + data[i].address + '<br>' + 'Prix actuel : ' + data[i].current_price + '<br>' + '</p>';
                }
                else {
                    var content_bar = '<h1>' + data[i].bar_name + '</h1><p>' + data[i].address + '<br>' + 'Prix actuel : ' + data[i].current_price + '<br>' + 'Happy hour : ' + timer_happy + ' avant le début' + '</p>';

                }


            }


            return function () {
                infowindow.setContent(content_bar);

                infowindow.open(map, marker);
            }
        })
        (marker, i));
    }

}

function parse_timeinterval(s) {
    if (s === "") {
        return [0, 0];
    }
    var opening_hours = s;
    var res = opening_hours.split("-");
    var start_time = res[0];
    var end_time = res[1];
    var start_time_h = parseInt(start_time.split("h")[0]);
    var start_time_m = parseInt(start_time.split("h")[1]);
    var end_time_h = parseInt(end_time.split("h")[0]);
    var end_time_m = parseInt(end_time.split("h")[1]);

    if (end_time_h < start_time_h) {
        end_time_h += 24;
    }

    var start_minute = start_time_h * 60 + start_time_m;
    var end_minute = end_time_h * 60 + end_time_m;

    return [start_minute, end_minute];
}

$(function () {


    $.get("assets/js/gmap_style.json", function (result) {
        map_style = result;


        var URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2gr_tgGs7ziW83sgOauf6WZw7sMfE4ToemXeffMue1JMdmjSaDcu5flbKga-h9DtU0YkCS_lrPQTf/pub?gid=1788698224&single=true&output=csv";

        d3.csv(URL, function (d) {
            var cpt_nb_bar = 0;
            data = d;
            data.forEach(function (d) {

                ti = parse_timeinterval(d[days2label[current_day]]);
                ti_hh = parse_timeinterval(d[days2label[current_day] + "_happy"]);

                if (current_time_minute >= ti[0] && current_time_minute <= ti[1]) {
                    d.is_open = true;
                } else {
                    d.is_open = false;
                }
                if (current_time_minute >= ti_hh[0] && current_time_minute <= ti_hh[1]) {
                    d.is_happy = true;
                    d.current_price = parseFloat(d.price_happy_hour.replace(",","."));
                    console.log(d.current_price);

                } else {
                    d.is_happy = false;
                    d.current_price = parseFloat(d.price_regular.replace(",","."));
                }
                if (!isNaN(d.current_price)) {
                    average_price += d.current_price;
                    cpt_nb_bar++;
                }
            });

            // Filter only open bars
            data = data.filter(function (d) {
                return d.is_open;
            });

            average_price = average_price / cpt_nb_bar;
            //TODO : Ici c'est trop bien
            initMap()

        });


    });
});
