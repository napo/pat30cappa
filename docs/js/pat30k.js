function mappa(inidistat) {
    sidebar.close();
    map.removeLayer(comune);
    map.removeLayer(confine_comune);
    map.removeLayer(confini_trento);
    map.removeLayer(confini_bolzano);
    map.removeLayer(confini_belluno);
    map.removeLayer(confini_verona);

    comune = new L.geoJson();
    comune.addTo(map);
    confine_comune = new L.geoJson();
    confine_comune.addTo(map);
    crosstn = 0;
    crossbz = 0;
    crossbl = 0;
    $.ajax({
            dataType: "json",
            url: "data/areas30km/" + inidistat + ".geojson",
            success: function(data) {
                $(data.features).each(function(key, data) {
                    crosstn = data.properties.CROSSTN;
                    crossbz = data.properties.CROSSBZ;
                    crossbl = data.properties.CROSSBL;
                    comune.addData(data);
                });
                comune.setStyle(stileComune);
                map.fitBounds(comune.getBounds());
                map.addLayer(comune);
                if (crosstn == 1) {
                    map.addLayer(confini_trento);
                }
                if (crossbz == 1) {
                    map.addLayer(confini_bolzano);
                }
                if (crossvr == 1) {
                    map.addLayer(confini_verona);
                }
                if (crossbl == 1) {
                    map.addLayer(confini_belluno);
                }
            },
            error: function() {
                console.log("error");
            }
        }) //.error(function(data) {console.log("errore")});
    $.ajax({
        dataType: "json",
        url: "https://tanto.carto.com:443/api/v2/sql?format=GeoJSON&q=select%20*%20from%20public.comuni_4326%20where%20public.comuni_4326.istat%3D%27" + inidistat + "%27",
        success: function(data) {
            $(data.features).each(function(key, data) {
                confine_comune.addData(data);
            });
            confine_comune.setStyle(stileConfiniComunali);
            map.addLayer(confine_comune);
        },
        error: function() {
            console.log("error");
        }
    })
}

$(document).ready(function() {
    $('#table_comuni').DataTable({
        "autoWidth": true,
        "ajax": "data/comuni.json",
        "columns": [
            { "data": "MAPPA" },
            { "data": "COMUNE" },
            { "data": "ABITANTI" },
            { "data": "SUPERFICIE (km²)" },
        ],
        columnDefs: [{
            targets: 0,
            render: function(data, type, row, meta) {
                if (type === 'display') {
                    values = data.split("_");
                    idistat = values[0];
                    idistat = idistat.padStart(6, "0");
                    abitanti = parseFloat(values[1]);
                    if (parseFloat(values[1]) <= 6000) {
                        //data = '<a href="?id='+idistat+'">vedi</a>'
                        data = '<a href="#" onclick="mappa(\'' + idistat + '\');return false;">vedi</a>'
                    } else {
                        data = ''
                    }
                }
                return data;
            }
        }]
    });
});


// standard leaflet map setup
var map = L.map('map', {
    maxZoom: 18,
    minZoom: 9,
    maxBound: [[
        [46.6701718034738, 13.716430664062502],
        [45.54675503088241, 8.640747070312502 ]]
    ]
});
map.setView([46.150345757336574, 10.9368896484375], 10);
map.zoomControl.setPosition('topright');

L.tileLayer('https://tile.jawg.io/{z}/{x}/{y}.png?api-key=community', {
    maxZoom: 18,
    attribution: 'Tiles courtesy of [[https://www.jawg.io/|jawgmaps]] - Map data [[http://osm.org/copyright/|&copy; OpenStreetMap contributors]], under ODbL.'
}).addTo(map);

//var hash = new L.Hash(map);
L.control.scale({ 'position': 'bottomright' }).addTo(map);
//L.control.measureControl().addTo(map);
var sidebar = L.control.sidebar({
    container: 'sidebar'
}).addTo(map).open('list');

const stileConfini = {
    "linecap": 'square',
    "lineJoin": "square",
    "color": "#b434eb",
    "weight": 2,
    "opacity": 1,
    "dashArray": '5,10',
    "dashOffset": "10",
    "fill": false,
    "fillOpacity": 0
};

const stileConfiniCapoluoghi = {
    "color": "ff7800",
    "weight": 2,
    "opacity": 1,
    "fill": true,
    'fillColor': '#ff6600',
    "fillOpacity": 0.05
};

const stileConfiniComunali = {
    "color": "#FF0000",
    "weight": 1,
    "opacity": 1,
    "fill": false,
    "fillOpacity": 0.2
};

const stileComune = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 1,
    "fill": true,
    "fillOpacity": 0.25
};

var comune = new L.geoJson();
comune.addTo(map);
var confine_comune = new L.geoJson();
confine_comune.addTo(map);
var confini_pat = new L.geoJson();
confini_pat.addTo(map);
var confini_trento = new L.geoJson();
var confini_bolzano = new L.geoJson();
var confini_verona = new L.geoJson();
var confini_belluno = new L.geoJson();


$.ajax({
        dataType: "json",
        url: "data/confini_pat.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                confini_pat.addData(data);
            });
            confini_pat.setStyle(stileConfini);
        },
        error: function() {
            console.log("error");
        }
    }) //.error(function(data) {console.log("errore")});

$.ajax({
        dataType: "json",
        url: "data/confini_trento.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                confini_trento.addData(data);
            });
            confini_trento.setStyle(stileConfiniCapoluoghi);
            //map.removeLayer(confini_trento);
        }
    }) 
    $.ajax({
        dataType: "json",
        url: "data/confini_bolzano.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                confini_bolzano.addData(data);
            });
            confini_bolzano.setStyle(stileConfiniCapoluoghi);
            //map.removeLayer(confini_trento);
        }
    }) 
    $.ajax({
        dataType: "json",
        url: "data/confini_verona.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                confini_verona.addData(data);
            });
            confini_verona.setStyle(stileConfiniCapoluoghi);
            //map.removeLayer(confini_trento);
        }
    }) 
    $.ajax({
        dataType: "json",
        url: "data/confini_belluno.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                confini_belluno.addData(data);
            });
            confini_belluno.setStyle(stileConfiniCapoluoghi);
            //map.removeLayer(confini_trento);
        }
    }) 