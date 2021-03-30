// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
  });

streetmap.addTo(myMap);

var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";
var week = "all_week.geojson";

// Assemble API query URL
var url = baseURL + week;

function chooseColor(Magnitude) {
    if (Magnitude <= 1) {
        return "#2c99ea";
    }
    else if (Magnitude <= 2) {
        return "#2ceabf";
    }
    else if (Magnitude <= 3) {
        return "#92ea2c";
    }
    else if (Magnitude <=4) {
        return "#d5ea2c";
    }
    else if (Magnitude <= 5) {
        return "#eaa92c";
    }
    else {
        return "#ea2c2c";
    }
}

function markerSize(Magnitude) {
    return Magnitude * 5;
  }

d3.json(url, function(data) {

    /// We will create three function. 
    // function 1 for style, function 2 for color and function 3 for radiues
  
    function mapStyle(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: chooseColor(feature.properties.mag),
        color: "black",
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
  
    L.geoJson(data, {
  
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
  
      style: mapStyle,
  
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  
      }
    }).addTo(myMap);
  
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var limits = [0, 1, 2, 3, 4, 5];
      var colors = ["#2c99ea", "#2ceabf", "#92ea2c", "#d5ea2c","#eaa92c", "#ea2c2c"];
      var labels = [];

      // Add min & max

      div.innerHTML = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
      "</div>";

      limits.forEach(function(limit, i) {
        labels.push("<p style = \"background-color: "+colors[i]+"\">"+limit+"</p> ");
      });

      div.innerHTML += "<ul>" + labels.join("    ") + "</ul>";
      return div;
  
    };
  
    legend.addTo(myMap)
    
  });