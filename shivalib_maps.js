///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB MAPS
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawMap=function() 													//	DRAW MAP
{
	var v,vv,i;
	var container=this.container;
	var ops=this.options;
   	var latlng=new google.maps.LatLng(-34.397,150.644);
	var mapType=ops.mapTypeId.toUpperCase();
	if (mapType == "LAND")
		ops.mapTypeId=mapType;
	else
		ops.mapTypeId=google.maps.MapTypeId[mapType];
  	var ll=ops.mapcenter.split(",")
	latlng=new google.maps.LatLng(ll[0],ll[1]);
	ops.center=latlng;
	ops.zoom=Number(ll[2]);
   	this.mapsInfoWindow=new google.maps.InfoWindow({ maxWidth:300 });							
  	this.items=[];
  	for (var key in ops) {
		if (ops[key] == "true")  ops[key]=true;
		if (ops[key] == "false") ops[key]=false;
		if (key.indexOf("item-") != -1) {
			var o=new Object;
			v=ops[key].split(';');
			for (i=0;i<v.length;++i) {
				vv=v[i].split(':');
				if (vv[1].indexOf("http") == -1)
				    vv[1]=vv[1].replace(/~/g,"=");
				o[vv[0]]=vv[1].replace(/\^/g,"&").replace(/\`/g,":");
				}
			this.items.push(o);
			}
		}
	$("#"+this.container).height(ops.height);							// Height
	$("#"+this.container).width(ops.width);								// Width
	ops["mapTypeControlOptions"]={ "mapTypeIds":[	
		google.maps.MapTypeId.ROADMAP,
     	google.maps.MapTypeId.TERRAIN,
		google.maps.MapTypeId.SATELLITE,
		google.maps.MapTypeId.HYBRID,
		"LAND"
		],
		style: google.maps.MapTypeControlStyle.DROPDOWN_MENU 
		};
	this.map=new google.maps.Map(document.getElementById(container),ops);
	this.AddClearMapStyle(this.map);
	this.AddBlankMapStyle(this.map);
	this.DrawMapOverlays();
	this.DrawLayerControlBox(this.items,this.options.controlbox);
	window.postMessage("InitGeocoder","*");								// Init geocoder	
	this.SendReadyMessage(true);											
	google.maps.event.addListener(this.map,'click', function(e) {
	 	var l=e.latLng.toString().replace(/\(/,"").replace(/, /,"|").replace(/\)/,"");
	 	var p=e.pixel.toString().replace(/\(/,"").replace(/, /,"|").replace(/\)/,"");
	 	shivaLib.SendShivaMessage("ShivaMap=click",l+"|"+p);
 		});
	google.maps.event.addListener(this.map,'center_changed', function(e) {
	 	var map=shivaLib.map;
	 	var lat=map.getCenter();
	 	shivaLib.SendShivaMessage("ShivaMap=move",lat.lat()+"|"+lat.lng()+"|"+map.getZoom());
 		});
}

SHIVA_Show.prototype.AddInternalOptions=function(options, newOps) 							//	PARSE ITEMS
{
	var i,vv;
	if (newOps) {
		var v=newOps.split(',');
		for (i=0;i<v.length;++i) {
			vv=v[i].split("=");
			if (vv[1] == 'true') 	vv[1]=true;
			if (vv[1] == 'false') 	vv[1]=false;
			options[vv[0]]=vv[1];
			}
		}
}		

SHIVA_Show.prototype.DrawMapOverlays=function() 										//	DRAW MAP OVERLAYS
{
 	if (!this.items)
  		return;
 	var i,j,latlng,v,ops,curZoom,curLatLon;
	var _this=this;
 	var items=this.items; 
    v=this.options.mapcenter.split(",")
	curLatlng=new google.maps.LatLng(v[0],v[1]);
	curZoom=v[2];
	for (i=0;i<items.length;++i) {
		ops=new Object();
		if (items[i].listener)
			google.maps.event.removeListener(items[i].listener);
		if ((items[i].obj) && (items[i].layerType == "MarkerSet")) {
			for (j=0;j<items[i].obj.length;++j) {						
				google.maps.event.removeListener(items[i].obj[j].listener);	
				items[i].obj[j].obj.setMap(null);
				}
			items[i].obj=null;
			}
		else if (items[i].obj)
			items[i].obj.setMap(null);
		if (items[i].layerType == "Drawn") {
			items[i].obj=new ShivaCustomMapOverlay()
			}
		else if (items[i].layerType == "Marker") {
			items[i].obj=new google.maps.Marker();
			v=items[i].layerSource.split(",")
			items[i].pos=latlng=new google.maps.LatLng(v[0],v[1]);
			ops["title"]=v[2];
			ops["position"]=latlng;
			if (v.length == 4)
				ops["icon"]=v[3]
 			if (ops && items[i].obj)
				items[i].obj.setOptions(ops);
			items[i].listener=google.maps.event.addListener(items[i].obj,'click', function(e) {
				var j,v;
 				for (j=0;j<_this.items.length;++j)	{				
					v=_this.items[j].layerSource.split(",")
					if (v[2] == this.title)					
 						break;											
  					}
   				shivaLib.SendShivaMessage("ShivaMap=marker",this.title+"|"+e.latLng.lat()+"|"+e.latLng.lng()+"|"+j);
	 			});
			}
		else if (items[i].layerType == "MarkerSet") {
			if (items[i].visible == "true") {
				this.items[i].obj=[];
				this.markerData=i;
				this.GetSpreadsheet(items[i].layerSource,true,null,function(d){_this.MapAddMarkers(d,_this.items[_this.markerData].obj)});
				}
			continue;
			}
		else if (items[i].layerType == "Overlay") {
			v=items[i].layerOptions.split(",");
			var imageBounds=new google.maps.LatLngBounds(new google.maps.LatLng(v[2],v[1]),new google.maps.LatLng(v[0],v[3]));
			if (v.length == 5)
				ops["opacity"]=v[4]/100;
			if (items[i].layerSource)
				items[i].obj=new google.maps.GroundOverlay(items[i].layerSource,imageBounds,ops);
//	38.07,-78.55,37.99,-78.41
//	//www.viseyes.org/shiva/map.jpg
			items[i].listener=google.maps.event.addListener(items[i].obj,'click', function(e) {
	 			shivaLib.SendShivaMessage("ShivaMap=overlay",this.url+"|"+e.latLng.lat()+"|"+e.latLng.lng());
 				});
			}
		else if (items[i].layerType == "KML") {
			if (items[i].layerOptions) {	
				v=items[i].layerOptions.split(",");
				for (j=0;j<v.length;++j) 
					ops[v[j].split("=")[0]]=v[j].split("=")[1];
				}
			items[i].obj=new google.maps.KmlLayer(items[i].layerSource,ops);
			items[i].listener=google.maps.event.addListener(items[i].obj,'click', function(e) {
	  			var str=this.url+"|"+e.featureData.name+"|"+e.latLng.lat()+"|"+e.latLng.lng();
		 		shivaLib.SendShivaMessage("ShivaMap=kml",str);
	 			});
			}
		else if ((items[i].layerType == "GoTo") && (items[i].visible == "true")) {
			v=items[i].layerSource.split(",");							// Split into parts
			if (v.length > 1)									 		// If enough  vals and visible
				curLatlng=new google.maps.LatLng(v[0],v[1]);			// Set center
			if (v.length > 2)											// If set
				curZoom=v[2];											// Set zoom
			}
		if ((items[i].visible == "true") && (items[i].obj))				// If showing
			items[i].obj.setMap(this.map);								// Add to map
		}
	this.map.setCenter(curLatlng);										// Center map
	this.map.setZoom(Number(curZoom));									// Zoom map
}

SHIVA_Show.prototype.MapActions=function(msg)						// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaAct=goto") {										// GOTO
		var curLatlng=new google.maps.LatLng(v[1],v[2]);				// Set lat/lon
		this.map.setCenter(curLatlng);									// Center map
		this.map.setZoom(Number(v[3]));									// Zoom map
		}
	else if ((v[0] == "ShivaAct=show") || (v[0] == "ShivaAct=hide")) {	// SHOW/SHOW
		if (this.items[v[1]]) 											// If valid item	
			this.items[v[1]].visible=(v[0] == "ShivaAct=show").toString();	// Set visibility 
		this.DrawMapOverlays();											// Redraw
		}
	else if (v[0] == "ShivaAct=data")  {								// FILL MARKERS
		if (v[1]) 														// If valid item	
			this.MapAddMarkers(v[1]);									// Add markers
		}
	else if (v[0] == "ShivaAct=marker") { 								// SHOW/HIDE MARKERS
		if (v[1] < this.markerData.length) 								// If valid
			this.markerData[v[1]].obj.setMap(v[2]=="true"?this.map:null);	// Hide/show
		}
}

SHIVA_Show.prototype.MapAddMarkers=function(json, mData)			// ADD MARKERS TO MAP FROM JSON
{
	var hasLines=false;
	var i,j,o,mark,list,ops;
	var flat,flon,tlat,tlon,col,alpha,width,coords,path;
	var _this=shivaLib;
	if (typeof(json) == "string") {										// If it came from shivaEvent
		json=$.parseJSON(json);											// Objectify
		var cols=json[0].length;										// Number of fields
		for (i=1;i<json.length;++i) {									// For each event
			o={};														// Fresh obj
			for (j=0;j<cols;++j)  										// For each value
				o[json[0][j]]=json[i][j];								// Key value pair
			json[i]=o;													// Add to array
			}
		json=json.slice(1);												// Remove header
		mData=this.markerData;											// Point at markerdata
		if (mData) {													// If data
			for (i=0;i<mData.length;++i) {								// For each old maker
				if (mData[i].listener)									// If it has a listener
					google.maps.event.removeListener(mData[i].listener);	// Remove listener
				mData[i].obj.setMap(null);								// Remove marker
				}
			}
		this.markerData=mData=[];										// Clear data 
		}
	for (i=0;i<json.length;++i) {										// For each row
//https://docs.google.com/spreadsheet/ccc?key=0AohdE1_3ZElJdG9ETURycHJLMUF0WG94d2FHRGcxWUE&usp=sharing
		if (json[i].icon != "line")										// If not a line
			continue;													// Skip
		hasLines=true;													// Is a network map
		alpha=1;														// Assume full alpha
		width=2;														// Assume default width
		col="#990000";													// Assume default color
		if (json[i].width)												// If defined
			width=json[i].width;										// Use it
		if (json[i].color) {											// If defined
			col=json[i].color;											// Set color
			if (json[i].color.length > 7) {								// If has alpha
				col=json[i].color.substr(0,7);							// Isolate color
				alpha=parseInt(json[i].color.substr(7,2),16)/255;		// Isolate alpha
				}
			}
		flat=json[json[i].lat-2].lat;									// From lat	
		flon=json[json[i].lat-2].lon;									// From lon
		tlat=json[json[i].lon-2].lat;									// To lat	
		tlon=json[json[i].lon-2].lon;									// To lon
		path=new google.maps.Polyline({									// Polygon
    		path: [ new google.maps.LatLng(flat,flon),new google.maps.LatLng(tlat,tlon) ],
   			strokeColor: col,
    		strokeOpacity: alpha,
    		strokeWeight: width
  			});
		path.setMap(shivaLib.map);										// Add to map
		mData.push({ obj:path, title:"",listener:null });				// Add to array
		}
	for (i=0;i<json.length;++i) {										// For each row
		if (json[i].icon == "line")										// If a line
			continue;													// Skip
		mark=new google.maps.Marker();									// Create marker obj
		ops={};															// New obj
		if (json[i].title)												// If a title
			ops["title"]=json[i].title;									// Set title
		ops["position"]=new google.maps.LatLng(json[i].lat-0,json[i].lon-0); // Set position
		if (json[i].icon) {												// If has an icon
			if (hasLines)												// If a network map
				ops["icon"]={ url:json[i].icon, anchor: new google.maps.Point(8,8) };  // Center icon and add
			else 														// MarkerSet
				ops["icon"]=json[i].icon;								// Add icon
				}
		mark.setOptions(ops);											// Set options
		mark.setMap(shivaLib.map);										// Add to map
		list=google.maps.event.addListener(mark,'click', function(e) {	// Add listener
 			var j;
  			for (j=0;j<mData.length;++j)								// Look thru data	
 				if (mData[j].title == this.title)						// If titles match
 						break;											// Quit looking
    		shivaLib.SendShivaMessage("ShivaMap=marker",this.title+"|"+e.latLng.lat()+"|"+e.latLng.lng()+"|"+j);
			if (mData[j].desc) {										// If a desc
				shivaLib.mapsInfoWindow.setContent(mData[j].desc);		// Set new desc
	   			shivaLib.mapsInfoWindow.open(this.map,this);			// Open
				}
			});
		mData.push({ obj:mark, title:json[i].title,listener:list, desc:json[i].desc });	// Add to array
		}
}

SHIVA_Show.prototype.DrawLayerControlBox=function(items, show)			// DRAW LAYER CONTROLBOX
{
	var i,hasGotos=false,hasLayers=false;
	if (!show) {															// If not on
		$("#shivaMapControlDiv").remove();									// Remove it
		return;																// Quit
		}
	var l=$("#"+this.container).css("left").replace(/px/g,"");				// Get left
	var t=$("#"+this.container).css("top").replace(/px/g,"");				// Get top
	var h=$("#"+this.container).css("height").replace(/px/g,"");			// Get height
	if (t == "auto")	t=8;												// Must be a num
	if (l == "auto")	l=8;												// Must be a num
	if (this.options.shivaGroup == "Earth") {								// If earth, place top-right
		l=Number(l)+($("#"+this.container).css("width").replace(/px/g,"")-0)+8;	 // Right
		t=24;	h=0;														// Top
		}
	if ($("#shivaMapControlDiv").length == 0) {								// If no palette
		str="<div id='shivaMapControlDiv' style='position:absolute;left:"+l+"px;top:"+((t-0)+(h-0)-24)+"px'>";
		$("body").append("</div>"+str);										// Add palette to body
		$("#shivaMapControlDiv").addClass("rounded-corners").css("background-color","#eee").css('border',"1px solid #ccc");
		$("#shivaMapControlDiv").draggable();								// Make it draggable
		$("#shivaMapControlDiv").css("z-index",2001);						// Force on top
		}
	var str="<p style='text-shadow:1px 1px white' align='center'><b>&nbsp;&nbsp;Controls&nbsp;&nbsp;</b></p>";
	for (i=0;i<items.length;++i) {											// For each item
		if ((items[i].layerTitle) && (items[i].layerType != "GoTo")) 		// If titled and not a GoTo
			hasLayers=true;													// Draw layers header
		else if ((items[i].layerTitle) && (items[i].layerType == "GoTo")) 	// If titled and a GoTo
			hasGotos=true;													// Draw gotos header
		}
	if (this.options.shivaGroup == "Poster") {								// If a poster
			hasLayers=false;												// Draw layers header
			hasGotos=true;													// Draw gotos header
			}
	if (hasLayers) {														// If has layers, put up this header
		str="<p style='text-shadow:1px 1px white'><b>&nbsp;&nbsp;Show layer&nbsp;&nbsp;</b><br/>";
		for (i=0;i<items.length;++i) 
			if ((items[i].layerTitle) && (items[i].layerType != "GoTo")) {	// If titled and not a GoTo
				str+="&nbsp;<input type='checkbox' id='shcb"+i+"'";			// Add check
				if (items[i].visible == "true")								// If initially visible
					str+=" checked=checked ";								// Set checked
				str+=">"+items[i].layerTitle+"&nbsp;&nbsp;<br/>";			// Add label
				}
			str+="</p>";													// Close p	
			}
	if ((hasGotos) || (this.options.shivaGroup == "Poster")) {				// If gotos
		if (!hasLayers)  str="";											// If not layers, kill header
		str+="<p style='text-shadow:1px 1px white'><b>&nbsp;&nbsp;Go to:&nbsp;&nbsp;</b><br/>";
		str+="&nbsp;<input type='radio' name='gotos' id='shcr"+items.length+"' checked=checked>Start&nbsp;&nbsp;&nbsp;<br/>";		// Add home button
		for (i=0;i<items.length;++i) 										// For each item
			if ((items[i].layerTitle) && ((items[i].layerType == "GoTo") || (this.options.shivaGroup == "Poster"))) {	// If a GoTo
				str+="&nbsp;<input type='radio' name='gotos' id='shcr"+i+"'";	// Add check
				if (items[i].visible == "true")								// If initially visible
					str+=" checked=checked ";								// Set checked
				str+=">"+items[i].layerTitle+"&nbsp;&nbsp;&nbsp;<br/>";		// Add label
				}
		str+="</p>";														// Close p	
		}
	$("#shivaMapControlDiv").html(str+"<br/>");								// Add content	
	var _this=this;															// Local copy of this
	for (i=0;i<items.length;++i) {											// For each item
		if ((items[i].layerType == "GoTo") || (this.options.shivaGroup == "Poster"))	// If a goto
			$("#shcr"+i).click( function() { $.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"GoTo"),_this); } );  // Add handler
		else																// A regular layer
			$("#shcb"+i).click( function() { $.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"?"),_this); } );  	// Add handler
		}
	if (hasGotos)															// If has gotos
		$("#shcr"+items.length).click( function() { $.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"GoTo"),_this); } );  // Add handler
}

////////////// CUSTOM OVERLAY //////////////

if ((typeof(google) == "object") && (google.maps))							// If lib loaded
	ShivaCustomMapOverlay.prototype=new google.maps.OverlayView();			// Inherit from Google maps overlay class

function ShivaCustomMapOverlay(bounds, data)							// CUSTOM MAP OVERLAY
{
var swBound = new google.maps.LatLng(62.281819, -150.287132);
var neBound = new google.maps.LatLng(62.400471, -150.005608);
bounds = new google.maps.LatLngBounds(swBound, neBound);
	this.bounds_=bounds;													// Set bounds
  	this.data_= data;														// Drawing data
 	this.div_=null;															// Container div
  }

ShivaCustomMapOverlay.prototype.onAdd=function()						// ADD HANDLER
{
	var div=document.createElement('div');									// Layer div
	div.style.border="none";												
	div.style.borderWidth="0px";
	div.style.position="absolute";

var img = document.createElement("img");
img.src="http://www.viseyes.org/shiva/map.jpg";
img.style.width = "100%";
img.style.height = "100%";
div.appendChild(img);

	this.div_=div;															// Set div
	var panes=this.getPanes();												// Get list of panes
	panes.overlayLayer.appendChild(div);									// Add to overlay pane
}

ShivaCustomMapOverlay.prototype.draw=function()							// DRAW HANDLER
{
	var overlayProjection=this.getProjection();								// Get current proj
	var sw=overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());  // Get corner
	var ne=overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());	 // Get corner
	this.div_.style.left=sw.x+'px';											// Left
	this.div_.style.top=ne.y+'px';											// Top
	this.div_.style.width=(ne.x-sw.x)+'px';									// Width
	this.div_.style.height=(sw.y-ne.y)+'px';								// Hgt
}

ShivaCustomMapOverlay.prototype.onRemove=function()							// REMOVE HANDLER
{
	this.div_.parentNode.removeChild(this.div_);
  	this.div_=null;
}

////////////// LAND MAP ///////////////

SHIVA_Show.prototype.AddClearMapStyle=function(map)						// SET MAP STYLE
{
	var style=[
		{ featureType:"road", 	        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"transit",        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"poi",            elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"administrative", elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"landscape",      elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"labels",   stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"geometry", stylers: [ { lightness:-20}    ] }
		];
	var type=new google.maps.StyledMapType(style,{name:"Land"});
	map.mapTypes.set("LAND",type);
}

SHIVA_Show.prototype.AddBlankMapStyle=function(map)						// SET BLANK MAP STYLE
{
	var style=[
		{ featureType:"road", 	        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"transit",        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"poi",            elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"administrative", elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"landscape",      elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"water",      	elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"labels",   stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"geometry", stylers: [ { lightness:-20}    ] }
		];
	var type=new google.maps.StyledMapType(style,{name:"Blank"});
	map.mapTypes.set("BLANK",type);
}

///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB MAPS/EARTH - DEPRECATED BY GOOGLE
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawEarth=function(){} 
SHIVA_Show.prototype.EarthActions=function(msg)	{}
SHIVA_Show.prototype.EarthAddMarkers=function(json, mData) {}
