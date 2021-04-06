function mappa(idcomune) {
    idcomune = '022251'
    $.ajax({
        dataType: "json",
        url: "data/areas30km/" + idcomune + ".geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                comune.addData(data);
            });
            comune.setStyle(stileConfini);
            map.fitBounds(comune.getBounds());
            map.addLayer(comune);
        },
        error: function() {
            console.log("error");
        }
    }) //.error(function(data) {console.log("errore")});
}

$(document).ready(function() {
	$('#table_comuni').DataTable( { 
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
			render: function ( data, type, row, meta ) {
				if(type === 'display'){
					values = data.split("_");
					idistat = values[0];
					idistat = idistat.padStart(6, "0");
					abitanti = parseFloat(values[1]);
					if (parseFloat(values[1]) <= 5000) { 
                        data = '<a href="#" onclick="mappa(' + "'" + '02205' + "'" + ');return false;">vedi</a>'
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
var map = L.map('map');
map.setView([46.0199, 11.2198], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(map);

/*
var corner1 = L.latLng(46.54847214853457, 12.746887207031252);
var corner2 = L.latLng(45.64380813508572, 9.330139160156252);
var bounds = L.latLngBounds(corner1, corner2);

map.fitBounds(bounds);
*/
map.fitBounds([
    [46.54847214853457, 12.746887207031252],
    [45.64380813508572, 9.330139160156252]
]);

var hash = new L.Hash(map);
L.control.scale().addTo(map);
//L.control.measureControl().addTo(map);
var sidebar = L.control.sidebar({
    container: 'sidebar'
}).addTo(map).open('list');
const stileConfini = {
    "color": "#000000",
    "weight": 2,
    "opacity": 1,
    "dashArray": '5,10',
    "fill": false,
    "fillOpacity": 0
  };
  const stileConfiniTrento = {
    "color": "#FF0000",
    "weight": 1,
    "opacity": 1,
    "fill": true,
    "fillOpacity": 0.2
  };

var comune = new L.geoJson();
comune.addTo(map);
var confini_pat = new L.geoJson();
confini_pat.addTo(map);
var confini_trento = new L.geoJson();
//confini_trento.addTo(map);



$.ajax({
    dataType: "json",
    url: "data/confini_pat.geojson",
    success: function(data) {
        $(data.features).each(function(key, data) {
            confini_pat.addData(data);
        });
        confini_pat.setStyle(stileConfini);
        //map.fitBounds(confini_pat.getBounds());
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
        confini_trento.setStyle(stileConfiniTrento);
    }
    }) //.error(function(data) {console.log("errore")});