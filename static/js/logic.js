function markerSize(mag) {
    return mag*5;
};

function markerColor(mag) {
    if (mag>=5) {
        return "#FF0000"
    }  
    else if (mag>=4) {
        return "#FF4500"
    }
    else if (mag>=4) {
        return "#FFA500"
    }
    else if (mag>=3) {
        return "#FFD700"
    }
    else if (mag>=2) {
        return "#FFFF00"
    }
    else {
        return "#008000"
    };
};

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";


d3.json(url, function (error, response) {
    var earthquakeMarkers =[];
    if (error) {
        console.log(error);
    }
    var data = response.features
    for (var i=0; i< data.length; i++) {
        var coordinates = [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]];
        earthquakeMarkers.push(
            L.circleMarker(coordinates, {
                weight: 1,
                fillOpacity:1,
                color: "black",
                fillColor: markerColor(data[i].properties.mag),
                radius: markerSize(data[i].properties.mag)
            }).bindPopup("<h3>" + data[i].properties.place + "</h3><hr><p>" + new Date(data[i].properties.time) + "</p>")
        );
    }
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
    var greyscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });
    var baseMaps = {
        "Satellite": satellitemap,
        "Greyscale": greyscalemap,
        "Outdoors": outdoormap
    };
    var earthquakes = L.layerGroup(earthquakeMarkers);
    var overlays = {
        "Earthquakes": earthquakes
    };
    var myMap = L.map("map", {
        center: [45, -123],
        zoom: 2,
        layers: [satellitemap, earthquakes]
    });
    L.control.layers(baseMaps, overlays, {
        collapsed: false
    }).addTo(myMap);
    var legend = L.control({
        position: "best"
    });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var mags = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var colors = ["#008000", "#FFFF00", "#FFD700", "#FFA500", "#FF4500", "#FF0000"];
        var labels = [];
        var legendInfo = "<h1 class=\"header\">Magnitude</h1>" + 
            "<div class=\"labels\">" + 
            "<table style=\"width:100%\">" + 
            "<tr>" +
            "<th>" + mags[0] + "</th>"+
            "<th>" + mags[1] + "</th>"+
            "<th>" + mags[2] + "</th>"+
            "<th>" + mags[3] + "</th>"+
            "<th>" + mags[4] + "</th>"+
            "<th>" + mags[5] + "</th>"+
          "</tr>"+
        "</table>"+
      "</div>";
      div.innerHTML=legendInfo;
      mags.forEach(function(mags, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
      div.innerHTML +="<ul>" + labels.join("<tr>") + "</ul>";
      return div;
    };
    legend.addTo(myMap);
});
