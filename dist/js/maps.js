var groupAir = L.layerGroup();
var groupWater = L.layerGroup();
var groupWeather = L.layerGroup();

	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		  mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

	var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
      
  googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
  });    
  googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
  });

	var map = L.map('map', {
		center: [41.69323, -8.83287],
		zoom: 15,
		layers: [grayscale, googleStreets, googleSat, groupWater, groupAir, groupWeather]
	});

	var baseLayers = {
		"Cinza": grayscale,
		"Ruas": googleStreets,
		"Satélite": googleSat    
	};

	var overlays = {
		"Ambiental": groupAir,
		"Meteorológico" : groupWeather,
		"Tipo 3" : groupWater
	};

	var estacaoMeteo = L.icon({
		iconUrl: 'dist/img/sun.png',
		iconSize: [32, 32], // size of the icon
	});

	var estacaoAgua = L.icon({
		iconUrl: 'dist/img/wave.png',
		iconSize: [32,32]
	});

	var ar = L.icon({
		iconUrl: 'dist/img/sensor.png',
		iconSize: [32,32]
	});

	L.marker([41.69323, -8.81881], {icon: estacaoMeteo}).addTo(groupWeather).on('click', function(){
		console.log("Meteo");				
		sidebar.show();
		document.getElementById("graphArea").innerHTML += '<br><iframe src="http://62.48.168.89:4000/d-solo/MNYFg0GZk/rnmonitor_dash_device?orgId=1&from=1591366814877&to=1591971614877&var-Sensor=D003&panelId=2" width="100%" height="200" frameborder="0"></iframe>';                       
	});	
	L.marker([41.69323, -8.83287], {icon: ar}).addTo(groupWater).on('click', function(){
		console.log("Ar");
		sidebar.show();
		document.getElementById("graphArea").innerHTML += '<br><iframe src="http://62.48.168.89:4000/d-solo/MNYFg0GZk/rnmonitor_dash_device?orgId=1&from=1591366814877&to=1591971614877&var-Sensor=D003&panelId=2" width="100%" height="200" frameborder="0"></iframe>';                       
    
	}),
	L.marker([41.69323, -8.82281], {icon: estacaoAgua}).addTo(groupAir).on('click', function () {
		console.log("Águas");		
		sidebar.show();
		document.getElementById("graphArea").innerHTML += '<br><iframe src="http://62.48.168.89:4000/d-solo/MNYFg0GZk/rnmonitor_dash_device?orgId=1&from=1591366814877&to=1591971614877&var-Sensor=D003&panelId=2" width="100%" height="200" frameborder="0"></iframe>';                       
	});;

	map.on('click', function(e) {
		sidebar.hide();
		document.getElementById("graphArea").innerHTML = "";   
	});
	
	L.control.layers(baseLayers, overlays).addTo(map);

	var sidebar = L.control.sidebar('sidebar', {
		position: 'right'
	});
	
	$('.leaflet-container').css('cursor','auto');
	
	map.addControl(sidebar);


var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

// define custom marker
var MyCustomMarker = L.Icon.Default;

	var drawPluginOptions = {
		position: 'topright',
		draw: {
		  polyline: false,
		  circle: false, // Turns off this drawing tool
		  rectangle: false,
		  circlemarker: false,
		  polygon: {
			allowIntersection: false, // Restricts shapes to simple polygons
			drawError: {
			  color: 'rgba(240, 52, 52, 1)', // Color the shape will turn when intersects
			  message: '<strong>O polígono não pode ter intercepões!<strong>' // Message that will show when intersect
			},
			shapeOptions: {
			  color: 'rgba(38, 194, 129, 1)'
			}
		  },
		  marker: {
			icon: new MyCustomMarker()
		  }
		},
		edit: {
		  featureGroup: editableLayers, //REQUIRED!!
		  remove: false
		}
	  };

	  map.on('draw:created', function(e) {
		var type = e.layerType,
		  layer = e.layer;	  
		if (type === 'marker') {			
		$($("#lon").val(layer.getLatLng().lng));
		$($("#lat").val(layer.getLatLng().lat));
		$("#modal-add").modal('show');

		  layer.bindPopup('A popup!');
		}
		else if(type === 'polygon'){
			layer.bindPopup('A polygon!');
		}
	  
		editableLayers.addLayer(layer);
	  });


	  // Initialise the draw control and pass it the FeatureGroup of editable layers
		var drawControl = new L.Control.Draw(drawPluginOptions);
	  //Modo Edição (Menu lateral)
	  $('#editMode').change(function() {
		if ($('#editMode').is(":checked")){			
			map.addControl(drawControl);
		}else{			
			map.removeControl(drawControl);
		}
	  });

	  