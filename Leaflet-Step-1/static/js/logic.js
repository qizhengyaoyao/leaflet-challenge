var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: mapStyle,
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  streetmap.addTo(myMap);

  Updatelegend(myMap);
}

function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3>" +
  "<hr><p>Location: " + feature.properties.place + "</p>");
}

function chooseColor(Magnitude) {
  return Magnitude >= 5 ? "#f06b6b":
  Magnitude >= 4 ? "#f0a76b":
  Magnitude >= 3 ? "#f3ba4d":
  Magnitude >= 2 ? "#f3db4d":
  Magnitude >= 1 ? "#e1f34d":
                   "#b7f34d";
}

function markerSize(Magnitude) {
  return Magnitude * 5;
}

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

function Updatelegend(DstMap) {
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var labels = [];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
      '<i style="background:' + chooseColor(grades[i]) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(DstMap);
}