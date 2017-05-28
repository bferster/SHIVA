///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB MAIN
///////////////////////////////////////////////////////////////////////////////////////////////

function SHIVA_Show(container, options, editMode) 						// CONSTRUCTOR
{
	this.drupalMan=false;
	this.inGo=false;
	this.options=null;
	this.map=null;															
	this.player=null;
	this.timeLine=null;															
	this.container=container;
	this.editMode=editMode;
	this.items=null;
	this.overlay=null;
	this.g=null;
	this.qe=null;
	this.ev=null;
	this.jit=null;
	this.cvs=null;
	this.group=null;
	this.msgAction=new Array();
	this.ready=false;
	this.actionCache=new Array();
	if (options)
		this.Draw(options);
}

SHIVA_Show.prototype.Draw=function(ops) 								//	DRAW LOADER/DIRECTOR
{
	if (!ops)
		return;
	_this=this;
	this.options=ops;
	this.LoadJSLib("Visualization",$.proxy(function() {
			_this.LoadJSLib(ops.shivaGroup,$.proxy(function() { _this.DrawElement(ops) },_this))
			},_this));
}

SHIVA_Show.prototype.DrawElement=function(ops) 							//	DRAW DIRECTOR
{
	var _this=this;
	this.group=group=ops.shivaGroup;
	if (group == 'Visualization') 
		this.DrawChart();
	else if (group == 'Map')
		this.DrawMap();
	else if (group == 'Timeline')
		this.DrawTimeline();
	else if (group == 'Timeglider')
		this.DrawTimeGlider();
	else if (group == 'Control')
		this.DrawControl();
	else if (group == 'Video')
		this.DrawVideo();
	else if (group == 'Image')
		this.DrawImage();
	else if (group == 'Subway')
		this.DrawSubway();
	else if (group == 'Data')
		this.DrawChart();
	else if (group == 'Network')
		this.DrawNetwork();
	else if (group == 'Earth')
		this.DrawEarth();
	else if (group == 'Draw') {
		if (ops.width)	$("#"+this.container).css("width",ops.width+"px");
		if (ops.height)	$("#"+this.container).css("height",ops.height+"px");
		this.DrawOverlay();
		this.SendReadyMessage(true);											
		}
	else if (group == 'Webpage')
		this.DrawWebpage();
	else if (group == 'HTML')
		this.DrawHTML();
   	else if (group == 'WordCloud')
        this.DrawWordCloud();
  	else if (group == 'Poster')
        this.DrawPoster();
  	else if (group == 'Graph')
        this.DrawGraph();
	if (ops["draw-1"])
		this.AddOverlay();
	var ud=ops["ud"];														// Get ud flag
	if (ud == "true")		ud=true;										// Convert to boolean
	else if (ud == "false")	ud=false;										// Convert to boolean
	if ((ud) && (this.inGo)) {												// If allowing user annotation in go.htm														
		var h=$("#"+this.container).css("height").replace(/px/g,"");		// Get height
		var str="<img  id='shivaAnnotateBut' src='annotate.gif' style='position:absolute";	
		str+=";top:"+(h-0+12)+"px'>";										// Bottom of container div
		$("body").append(str);												// Add button
		$("#shivaAnnotateBut").click(function() { _this.Annotate(); });		// Click event
		$("#shivaAnnotateBut").css('pointer-events','auto');				// Inibit pointer clicks if menu gone
		}
}

var jslibLoading="";

SHIVA_Show.prototype.LoadJSLib=function(which, callback) 				// LOAD JS LIBRARY
{
 	var i,obj,lib="";
  	switch(which) {															// Route on type
		case "Timeline": 													// Simile			
			obj="Timeline.DefaultEventSource";								// Object to test for
			lib="//api.simile-widgets.org/timeline/2.3.1/timeline-api.js?bundle=true";  // Lib to load
          	break;
		case "Visualization": 												// Google charts
  			if (!google.charts.versionSpecific) {
	 			google.charts.load('current', {packages: ['corechart']});	// Load package
				google.charts.setOnLoadCallback(callback); 					// Set callback
				return;														// Quit
				}
			break;
		case "Timeglider": 													// Time glider			
			obj="timeglider";								    			// Object to test for
			lib="timeglider-all.js";										// Lib to load
         	break;
		case "Image": 														// Ad gallery
			obj="jQuery.prototype.adGallery";								// Object to test for
			lib="jquery.ad-gallery.min.js";  								// Lib to load
           	break;
		case "Network": 													// JIT
			obj="$jit.id";													// Object to test for
			lib="jit-yc.js";  												// Lib to load
           	break;
		case "Graph": 														// Graph
			obj="d3.select";												// Object to test for
			lib="d3.v3.min.js";  											// Lib to load
           	break;
		case "Map": 														// Google maps		
 	 		var key="AIzaSyAVjuoRt0060MnK_5_C-xenBkgUaxVBEug";
			if (window.location.hostname.match("virginia.edu") || window.location.hostname.match("visuals.dd")) {
				key="AIzaSyDO7EDm14EXi44pLkarnB8jjqI90LSa61g";
				}
 			obj="google.maps.LatLng";										// Object to test for
         	lib="//maps.googleapis.com/maps/api/js?callback=shivaJSLoaded&key="+key; // Lib to load
         	if (jslibLoading == lib)										// If already loading it
         		return;														// Quit
             break;
       case "WordCloud":
            obj="d3.layout.cloud";
            lib="d3_cloud_combined.js";
            break;
		}
	if (lib) {																// If a lib to load
		var v=obj.split(".");												// Split by parts
		var n=v.length;														// Number of parts
		var o=$(window)[0];													// Point at root
		for (i=0;i<n;++i) 													// For each part
			if (!(o=o[v[i]])) 												// Not a match
				break;														// Quit looking
		if (o && (i == n)) {												// Got them all		
			callback();														// Call callback
			return;															// Quit
			}
		var head=document.getElementsByTagName('head')[0];					// Point at head
		var script=document.createElement('script');						// Point at script
   		script.type="text/javascript";										// Set type
       	script.src=lib; 													// URL
    	jslibLoading=lib;													// Save current loading library
     	script.onload=shivaJSLoaded(obj,callback);							// Set callback
       	head.appendChild(script);											// Add to script
		}
	else																	// No lib
		callback();															// Call callback
}

function shivaJSLoaded(obj, callback) 									// RECURSE UNTIL JS METHOD/PROPERTY IS AVAILABLE
{
	var i;
	if (!obj)																// If no obj
		return;																// Return
	var v=obj.split(".");													// Split by parts
	var n=v.length;															// Number of parts
	var o=$(window)[0];														// Point at root
	for (i=0;i<n;++i) 														// For each part
		if (!(o=o[v[i]])) 													// Not a match
			break;															// Quit looking
	if (o && (i == n)) { 													// Got them all		
		jslibLoading="";													// Reset loading flag
		callback();															// Call callback
		}
	else																	// No loaded yet
		setTimeout(function() { shivaJSLoaded(obj,callback); },50);			// Recurse		
}

SHIVA_Show.prototype.SendReadyMessage=function(mode) 					// SEND READY MESSAGE TO DRUPAL MANAGER
{
	var i;
	if (shivaLib.drupalMan) 												// If called from Drupal manager
		window.parent.postMessage("ShivaReady="+mode.toString(),"*");		// Send message to parent wind		
	var asp=$("#"+shivaLib.container).height()/$("#"+shivaLib.container).width();	// Get asp of container															// Assume 1:1
	if (this.options.height && this.options.width)							// If height and width defined
		asp=this.options.height/this.options.width;							// Calc asp
	shivaLib.SendShivaMessage("ShivaChart=ready",Math.round(asp*1000)); 	// Send ready message to EvA with aspect ratio
	shivaLib.ready=true;													// We're ready now
	for (i=0;i<shivaLib.actionCache.length;++i)								// For each action stored
		shivaLib.RunActions(shivaLib.actionCache[i]);						// Send command
	shivaLib.actionCache=[];												// Clear action store
}

SHIVA_Show.prototype.SendShivaMessage=function(src, msg) 				// SEND SHIVA MESSAGE 
{
	var id=window.name;														// Get from name
	if (!id) 																// Firefox/IE issue
		id="posterFrame-"+(""+window.location.search.match(/&if=[0-9A-z]+/)).substr(4);	// Extract id
	var str=src+"|"+id;														// Add src and window						
	if (msg)																// If more to it
		str+="|"+msg;														// Add it
	if (window.parent)														// If has a parent
		window.parent.postMessage(str,"*");									// Send message to parent wind
	else																	// Local	
		window.postMessage(str,"*");										// Send message to wind
}

SHIVA_Show.prototype.ShivaEventHandler=function(e) 						//	HANDLE SHIVA EVENTS
{
	if (e == "init") {														// If installing listener
		if (window.addEventListener) 
			window.addEventListener("message",shivaLib.ShivaEventHandler,false);
		else
			window.attachEvent("message",shivaLib.ShivaEventHandler);	
		return;
		}
	if (!e.data)															// No data
		return;																// Quit
	for (var i=0;i<shivaLib.msgAction.length;++i)							// For each possible event								
		if (e.data.indexOf(shivaLib.msgAction[i].id) != -1)					// The one						
			shivaLib.msgAction[i].Do(i);									// Run callback
	if (!shivaLib.options)													// If no options
		return;																// Quit
	if (e.data.indexOf("ShivaAct") != -1) {									// If an action
		if (!shivaLib.ready)													// If not ready yet
			shivaLib.actionCache.push(e.data);								// Save action until initted
		else																// Send it
			shivaLib.RunActions(e.data);									// Route to action handler
		}
}

SHIVA_Show.prototype.RunActions=function(data) 							// ROUTE ACTIONS
{
	var group=shivaLib.options.shivaGroup;									// Get group
	if (group == "Map")														// If a map action
		shivaLib.MapActions(data);											// Route
	else if (group == "Video")												// If a video action
		shivaLib.VideoActions(data);										// Route 
	else if (group == "Timeglider")											// If a timeline action
		shivaLib.TimeActions(data);											// Route 
	else if (group == "Visualization")										// If a chart action
		shivaLib.ChartActions(data);										// Route to chart actions
	else if (group == "Image")												// If an image action
		shivaLib.ImageActions(data);										// Route
	else if (group == "Network")											// If an network action
		shivaLib.NetworkActions(data);										// Route
	else if (group == "WordCloud")											// If an wordcloud action
		shivaLib.WordActions(data);											// Route
	else if (group == "Control")											// If an control action
		shivaLib.ControlActions(data);										// Route
	else if (group == "HTML")												// If an HTML action
		shivaLib.HTMLActions(data);											// Route
	else if (group == "Graph")												// If an graph action
		shivaLib.GraphActions(data);										// Route

}


SHIVA_Show.prototype.AddOverlay=function(data) 							// ADD OVERLAY
{
	var key;
   	this.overlay=new Array();												// Alloc new array
	this.DrawOverlay();														// Initialize
   	if (data){																// If data provided
		var v=data.split("&draw-");											// Divide into segs
		for (var i=0;i<v.length;++i) 										// For each seg
			this.AddOverlaySeg(v[i].replace(/^[0-9]+=/,""),true);			// Add seg after replacing seg num
  		}
   	else{																	// Get draw data from options
	   	for (key in this.options) {											// For each element
			if (key.match(/draw-/g)) 										// If a drawing	segment					
				this.AddOverlaySeg(this.options[key],false);				// Add seg
			}
		}
	$("#shivaDrawDiv").css('pointer-events','none');						// Inibit pointer clicks if menu gone
 	this.DrawOverlay();														// Draw
}	

SHIVA_Show.prototype.AddOverlaySeg=function(seg, init)					// ADD SEGMENT TO OVERLAY
{
	var i,key;
	if (!seg)																// No seg
		return;																// Quit
	var o=new Object();														// Alloc object
	if (!this.overlay)														// If not alloc'd
	   	this.overlay=new Array();											// Alloc new array
	if (!this.dr && init) {													// If not already instantiated
		this.Draw({shivaGroup:"Draw"});										// Create canvas
		this.dr=new SHIVA_Draw(this.container,true);						// Alloc drawing module
		}
	var v=seg.split(';');													// Split into parts
	for (i=0;i<v.length;++i) {												// For each param
		key=v[i].split(':')[0];												// Get key
		o[key]=v[i].split(':')[1].replace(/\~/g,"#").replace(/\|/g,"\n").replace(/\`/g,":");
		if (o[key] == "true")		o[key]=true;							// Force boolean
		if (o[key] == "false")		o[key]=false;							// Force boolean
		}	
	if (o.x)	o.x=o.x.split(",");											// Force arrays
	if (o.y)	o.y=o.y.split(",");											// Force arrays
	this.overlay.push(o);													// Add segment
}

SHIVA_Show.prototype.DrawOverlay=function() 							// DRAW OVERLAY
{
	var o,i,col,ecol,ewid,a,cur,ctx,str,now,s=0,e=36000;
	var con="#"+this.container;
	if (!this.g)															// If no graphics lib
		this.g=new SHIVA_Graphics();										// Allocate it
	var l=$(con).css("left");	var t=$(con).css("top");					// Get pos
	if (l == "auto")	l="0px";											// Turn auto into 0
	if (t == "auto")	t="0px";											// Turn auto into 0
	i=$(con).css("height").replace(/px/g,"");								// Get hgt
	if (this.player)														// If a player object
		i=Math.max(0,i-=40);												// Don't hide controls, cap at 0
	if (!$("#shivaDrawCanvas").length) {									// No canvas yet	
		if (!$("#shivaDrawDiv").length) {									// No draw div yet	
			str="<div id='shivaDrawDiv' style='position:absolute";			// Div
			str+=";width:"+$(con).css("width");								// Make div
			str+=";top:"+t;													// same as
			str+=";left:"+l;												// container div
			str+=";height:"+i+"px'/>";										// Set hgt
			$('body').append(str);											// Add to dom								
			}
		this.g.CreateCanvas("shivaDrawCanvas","shivaDrawDiv");				// Create canvas
		}
	$("#shivaDrawCanvas").attr("width",$(con).css("width"));				// Wid
	$("#shivaDrawCanvas").attr("height",i+"px");							// Hgt
	$("#shivaDrawDiv").css("left",l);										// Left div
	$("#shivaDrawDiv").css("top",t);										// Top
	$("#shivaDrawDiv").css("width",$(con).css("width"));					// Wid
	$("#shivaDrawDiv").css("height",i+"px");								// Hgt
	ctx=$("#shivaDrawCanvas")[0].getContext('2d');							// Get context
	ctx.clearRect(0,0,1600,1600);											// Clear canvas
	if (navigator.userAgent.match(/\.NET CLR/))								// If IE
		$("#shivaDrawDiv").css("z-index",2);								// Force on top
	else																	// All else
		$("#shivaDrawDiv").css("z-index",2000);								// Force on top
	if ($("#shivaDrawPaletteDiv").length)									// If palette is up
		$("#shivaDrawDiv").css('pointer-events','auto');					// Enable pointer clicks 
	else																	// If menu gone
		$("#shivaDrawDiv").css('pointer-events','none');					// Inibit pointer clicks 
	if (!this.overlay)														// Nothing to draw
		return;																// Quit
	this.DrawIdeaLinks(false);												// Draw idea link lines, if any												
	for (i=0;i<this.overlay.length;++i) {									// For each seg
		o=this.overlay[i];													// Point at it
	$("#shtx"+i).remove();													// Remove text
		$("#shim"+i).remove();												// Remove image
		$("#shivaIdea"+i).remove();											// Remove idea node
		if (o.type == 5) {													// Idea map
			var dd="#shivaIdea"+i;											// Div id										
			str="<div id='"+dd.substr(1)+"'";
			str+="style='position:absolute;padding:8px;font-family:sans-serif;text-align:center;";
			str+="margin:0px;border:1px solid "+o.ideaEdgeCol+";background-color:"+o.ideaBackCol+";";
			str+="left:"+o.ideaLeft+"px;top:"+o.ideaTop+"px;'>";
			str+="</div>";		
			$("#shivaDrawDiv").append(str);									// Add div
			str="<textarea";												// Assume display mode
			if ((shivaLib.dr) && (shivaLib.dr.curTool != 6))				// If not idea editing
				str+=" readonly='readonly'"; 								// Makes it read only
			str+=" id='shtx"+i+"' onchange='shivaLib.dr.SetShivaText(this.value,"+i+")' "
			str+="style='overflow:none;vertical-align:middle;";				// Textarea style
			if ((!shivaLib.dr) || ((shivaLib.dr) && (shivaLib.dr.curTool != 6)))	 // If not idea editing
				str+="resize:none;"; 										// Remove resizer
			str+="height:"+o.ideaHgt+"px;width:"+o.ideaWid+"px;color:"+o.ideaTextCol+";" // Size/color textarea
			if (o.ideaBold)													// If bold
				str+="font-weight:bold;";									// Add tag
			str+="background:transparent;border:none;margin:0px;padding:0px;font-family:sans-serif;text-align:center;'/>";
			$(dd).append(str);												// Add text area
			$("#shtx"+i).html(o.text);										// Set text
			if (o.ideaShape == "Round box") 								// Round box
				$(dd).css("border-radius","8px");							// Small round border
			else if (o.ideaShape == "Oval") 								// Oval
				$(dd).css("border-radius",$(dd).css("height"));				// Set border to height
			else if (o.ideaShape == "Circle") {								// Circle
				var w=$(dd).width();										// Get wid
				$(dd).css("border-radius",(w/2+16)+"px");					// Set border 1/2 wid + padding
				$(dd).css("height",w+"px");									// Hgt same as wid
				}
			if (o.ideaGradient) 											// If a gradient
				 $(dd).css({background:"-webkit-linear-gradient(top, #f0f0f0 0%,"+o.ideaBackCol+" 100%)",
				 			background:"linear-gradient(#f0f0f0,"+o.ideaBackCol+")"
				 			});

			if ((shivaLib.dr) && (shivaLib.dr.curTool == 6)) {				// If in idea map editing mode

				$("#shtx"+i).resizable( { stop: function(event,ui) {		// ON RESIZE HANDLER
					var num=ui.originalElement[0].id.substr(4);				// Get index
					shivaLib.dr.segs[num].ideaWid=ui.size.width-4;			// Set width
					shivaLib.dr.segs[num].ideaHgt=ui.size.height-4;			// Set height
					},handles:"se" });										// Only SE handle
	
				$(dd).draggable( { drag:function(event, ui) {				// ON DRAG HANDLER
						var num=this.id.substr(9);							// Get index
						var dx=ui.position.left-shivaLib.dr.segs[num].ideaLeft;	// Dx
						var dy=ui.position.top-shivaLib.dr.segs[num].ideaTop;	// Dy
						shivaLib.dr.segs[num].ideaLeft=ui.position.left;		// Set left
						shivaLib.dr.segs[num].ideaTop=ui.position.top;			// Set top
						shivaLib.dr.segs[num].ideaText=$("#"+this.id).val();	// Set current text
						shivaLib.dr.MoveIdeaChildren(num,dx,dy);			// Move children
						shivaLib.DrawIdeaLinks(true);						// Draw idea link lines										
						},
					containment:"parent", 
					stop:function(event, ui) {
						shivaLib.dr.DrawOverlay();							// Redraw
						} 
					});

				$(dd).droppable( { drop:function(event, ui) {				// ON DROP HANDLER
					var from=ui.draggable.context.id.substr(9);				// From id
					var to=event.target.id.substr(9);						// To id
					shivaLib.dr.IdeaDrop(from,to);							// React to drop			
					}});
	
				}	
			continue;														// Next segment
			}
		cur=o.curve;														// Curve
		col=o.color;														// Get col
		ecol=o.edgeColor;													// Ecol
		ewid=Math.floor(o.edgeWidth/10)+1;									// Edge is .5-10							 															
		a=Number(o.alpha)/100;												// Alpha is 0-1											
		if (o.edgeColor == -1)	ewid=0;										// None has no width
		if ((o.x) && (o.x.length < 2))										// If only 1 point
			continue;														// Skip it
		if (o.type == 1) 													// Circle
			this.g.DrawCircle(ctx,o.color,a,o.x[0],o.y[0],Math.abs(o.x[0]-o.x[1]),ecol,ewid);
		else if (o.type == 2) {												// Box
			if (o.curve)													// If curves on
				this.g.DrawRoundBar(ctx,o.color,a,o.x[0],o.y[0],o.x[1],o.y[1],12,ecol,ewid);
			else															// Line
				this.g.DrawBar(ctx,o.color,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);
			}
		else if (o.type == 3) {												// Text
			if (o.curve)													// If curves
				this.g.DrawRoundBar(ctx,o.boxColor,a,o.x[0],o.y[0],o.x[1],o.y[1],12,ecol,ewid);
			else															// Lines
				this.g.DrawBar(ctx,o.boxColor,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);
			str="<text";													// Assume display mode
			if ($("#shivaDrawPaletteDiv").length)							// If palette is up
				str+="area rows='8'"; 										// Textarea makes it editable
			str+=" id='shtx"+i+"' ";
			str+="style='position:absolute;background:transparent;border:none;margin:8px;font-family:sans-serif;overflow:none;";
			str+="left:"+Math.min(o.x[0],o.x[1])+"px;top:"+Math.min(o.y[0],o.y[1])+"px;opacity:"+(o.alpha/100)+";";
			str+="width:"+(Math.abs(o.x[1]-o.x[0])-18)+"px'/>";
			$("#shivaDrawDiv").append(str);									// Add div
			$("#shtx"+i).css("color",o.textColor).css("text-align",o.textAlign.toLowerCase());	// Color/align
			$("#shtx"+i).css("font-size",Number(o.textSize/2)+10);			// Set font size
			$("#shtx"+i).html(o.text);										// Set text
			$("#shtx"+i).bind("change input propertychange",function(e) {	// Change event
				var i=e.target.id.substr(4);								// Extract index
				var val=$("#shtx"+i).val();									// Get text
				shivaLib.dr.SetShivaText(val,i);							// Set structure
				});
			}
		else if (o.type == 4) {												// Image
			this.g.DrawBar(ctx,-1,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);
			str="<div id='shim"+i+"' style='position:absolute;background:transparent;opacity:"+(o.alpha/100)+";";
			w=Math.abs(o.x[1]-o.x[0]);
			h=Math.abs(o.y[1]-o.y[0]);
			str+="left:"+Math.min(o.x[0],o.x[1])+"px;top:"+Math.min(o.y[0],o.y[1])+"px;";
			str+="width:"+(w-16)+"px;height:"+h+"px'>";
			str+="<img id=shimi"+i+" src='"+o.imageURL+"' width='"+w+"'/>";	// Add img tag
			$("#shivaDrawDiv").append(str);									// Add div
			}
		else if ((o.x) && (o.x.length == 2) && (!o.arrow))					// Polygon
			this.g.DrawPolygon(ctx,-1,a,o.x,o.y,ecol,Math.max(ewid,2),false);	// Use line if only 2 points
		else if ((o.x) && (!o.arrow)) 										// > 2 pts
			this.g.DrawPolygon(ctx,o.color,a,o.x,o.y,ecol,ewid,(cur == true));	// Regular poly
		if ((o.x) && (o.type == 0) && (o.arrow)) {							// If line arrow
			var xx=[],yy=[];												// Arrow arrays
			var n=o.x.length-1;												// Last point
			var aa=Math.atan2(o.y[n]-o.y[n-1],o.x[n]-o.x[n-1]);				// Angle of line
			var h=Math.max(12,ewid*4);										// Set size
			xx[0]=o.x[n]-h*Math.cos(aa-Math.PI/6),
			yy[0]=o.y[n]-h*Math.sin(aa-Math.PI/6);			
 			xx[1]=o.x[n];	yy[1]=o.y[n];									// Tip point
			xx[2]=o.x[n]-h*Math.cos(aa+Math.PI/6),
			yy[2]=o.y[n]-h*Math.sin(aa+Math.PI/6);			
 			this.g.DrawPolygon(ctx,ecol,a,xx,yy,ecol,0,false);				// Regular draw arrow
			o.x[n]=((xx[2]-xx[0])/2)+xx[0];									// Mid x
			o.y[n]=((yy[2]-yy[0])/2)+yy[0];									// Mid y
			if (o.x.length == 2)											// Only 2 pyt
				this.g.DrawPolygon(ctx,-1,a,o.x,o.y,ecol,Math.max(ewid,2),false);	// Use line if only 2 points
			else
				this.g.DrawPolygon(ctx,o.color,a,o.x,o.y,ecol,ewid,(cur == true));	// Regular poly
			o.x[n]=xx[1];	o.y[n]=yy[1];									// Restore last point
			}
		}
	if ((shivaLib.dr) && (shivaLib.dr.curTool == 6)) 						// If in idea map editing mode
		$.proxy(shivaLib.dr.HighlightIdea(),shivaLib.dr);					// Set highlight
}

SHIVA_Show.prototype.DrawIdeaLinks=function(clear)							// DRAW IDEA LINK LINES
{
	var i,o,fx,fy,tx,ty;
	var ctx=$("#shivaDrawCanvas")[0].getContext('2d');						// Get context
	if (clear)																// If clearing the canvas
		ctx.clearRect(0,0,1600,1600);										// Clear canvas
	for (i=0;i<this.overlay.length;++i) {									// For each idea
		o=this.overlay[i];													// Point at idea
		if ((o.type != 5) || (o.ideaParent == -1))							// Not an idea node or a base node
			continue;														// Skip it
		dleftToRight=leftToRight=true;										// Assume l-r
		dir2=dir=2;															// Dir divisors
		tx=o.ideaLeft-0+(o.ideaWid/2+8);									// Cx from
		ty=o.ideaTop-0+(o.ideaHgt/2)+12;									// Cy
		o=this.overlay[o.ideaParent];										// Point at parent
		fx=o.ideaLeft-0+(o.ideaWid/2+8);									// Cx to
		fy=o.ideaTop-0+(o.ideaHgt/2+12);									// Cy
		if (tx < fx)														// If a set and left of control
			dleftToRight=leftToRight=false;									// Set l-r flag to false
		var x=[fx,tx];														// line
		var y=[fy,ty];														// line
		this.g.DrawPolygon(ctx,-1,.75,x,y,"#666",1,true);					// Draw line
		}
}

SHIVA_Show.prototype.Resize=function(wid) 								// RESIZE ELEMENT
{
	if (this.options) {														// If has data
		if (this.options.width) {											// And width
			if (this.options.width != wid) {								// And width is different
 				var asp=1.0;												// Assume 1:1
				if (this.options.height)									// If a height set
					asp=this.options.height/this.options.width;				// Get aspect
				this.options.width=wid;										// Set wid
				this.options.height=wid*asp;								// Set calculated hgt
				this.DrawElement(this.options);								// Redraw
				return true;												// Changed
				}
			}
		}
	return false;															// Unchanged
}

SHIVA_Show.prototype.SetLayer=function(num, mode, type) 				// SET LAYER
{
	var i;
	var group=this.options.shivaGroup;										// Get group
	if (this.items) {														// If items
		if (type == "GoTo")	{												// If a goto 
			for (i=0;i<this.items.length;++i) {								// For each item
				if (this.items[i].layerType == "GoTo")						// If a goto
					this.items[i].visible="false";							// Turn them all off
				}
			}
		if (this.items[num]) 												// If valid item	
			this.items[num].visible=mode.toString();						// Set visibility to mode as string
		}

	if (group == "Map")														// Route on type
		this.DrawMapOverlays();												
	else if (group == "Earth") 
		this.DrawEarthOverlays();												
	else if (group == "Subway") 
		this.DrawSubway();
	else if (group == "Timeline") 
		this.DrawTimeline();
	else if (group == "Poster") 
		this.GoToPosterPane(num);
}

SHIVA_Show.prototype.FillElement=function(table, query) 								// FILL ELEMENT WITH DATA TABLE
{
	var group=this.options.shivaGroup;														// Get type
	if (group == "Visualization") {															// Google api
	 	this.map.setDataSourceUrl(table);													// Set table
	 	if ((query) && (query != "NO CONDITIONS SET")) {									// If query set
	  		var v=query.split(" ");															// Divide into parts
	  		for (i=0;i<v.length;++i) {														// For each part
	  			if (v[i] == "has") {														// If has
	  				v[i++]="LIKE";															// Use LIKE
	  				v[i]="'%"+v[i]+"%'";													// %%
	  				}
	  			}
	 		query="";																		// Clear
	 		for (i=0;i<v.length;++i) 														// For each part
	  			query+=v[i]+" ";															// Rebuild query
	 		this.map.setQuery(query);														// Set query
			}
		this.map.draw();																	// Redraw
		}
	else if (group == "Dialog") {															// Infobox
	}
}

SHIVA_Show.prototype.Annotate=function(x,y) 											// SHOW ANNOTATION PALATTE
{
	if (!this.dr) {																			// If not already instantiated
		this.Draw({shivaGroup:"Draw"});														// Create canvas
		this.dr=new SHIVA_Draw(this.container);												// Alloc drawing module
		}
	else this.dr.DrawPalette();																// Draw palette
	if (x != undefined) {																	// If a position set
		$("#shivaDrawPaletteDiv").css("left",x+"px");										// Set x
		$("#shivaDrawPaletteDiv").css("top",y+"px");										// Set y
		}
	this.Sound("click");																	// Click
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	HTML
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawHTML=function() 												//	DRAW HTML
{
	$("#"+this.container).width("100%");													// Set width
	$("#"+this.container).height("100%");													// Set height
	var w=$("#"+this.container).width();													// Get true width
	var sca=w/this.options.oWid;															// Get scale
	$("#"+this.container).html(this.options.html.replace(/&quot;/g,"\""));					// Add to container
	$("#"+this.container).css({"transform":"scale("+sca+")","-webkit-transform":"scale("+sca+")","transform-origin":"0% 0%","-webkit-transform-origin":"0% 0%"});
	$("#"+this.container).css({"font-family":"Verdana,Geneva,sans-serif","font-size":"small","padding":"16px"});
	this.SendReadyMessage(true);															// Send ready message									
}

SHIVA_Show.prototype.HTMLActions=function(msg)											// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");																	// Split msg into parts
	if (v[0] == "ShivaAct=resize")  														// RESIZE
		this.DrawHTML();																	// Redraw
	else if (v[0] == "ShivaAct=data") {														// DATA
		}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	WEBPAGE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawWebpage=function() 											//	DRAW WEBPAGE
{
	$("#"+this.container+"IF").remove();													// Remove old one
	var h=this.options.height;																// Get height
	var w=this.options.width;																// Get width
	if (!isNaN(h))	h+="px";																// Add px
	if (!isNaN(w))	w+="px";																// Add px
	h=h.replace(/%25/,"%");																	// Unencode
	w=w.replace(/%25/,"%");																	// Unencode
	$("#"+this.container).css("height",h);													// Container height
	$("#"+this.container).css("width",w);													// Container width
	var	str="<iframe src='"+this.options.url+"' id='"+this.container+"IF' style='"; 		// Iframe
	str+="width:"+w+";height:"+h+"'>";														// Dimensions
	$("#"+this.container).append(str);														// Add to container
	this.SendReadyMessage(true);															// Send ready message									
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	CHART
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


SHIVA_Show.prototype.DrawChart=function() 												//	DRAW CHART
{	
	var i=0,array,val;
	var ops=new Object();
	var options=this.options;
	var container=this.container;
	var con="#"+container;
  	var _this=this;
	for (o in options) {
		val="";
		if (options[o]) {
			val=options[o].toString();
  			val=ops[o]=val.replace(/~/g,"#")
  			}
		if ((val.indexOf(",") != -1) && (o != "query") && (o != "title")) {
			if (val) {
				array=true;
				if (val.indexOf('=') == -1)
 					ops[o]=new Array();
				else{
					ops[o]=new Object();
					array=false;
					}
				var pairs=val.split(',');
				for (j=0;j<pairs.length;++j) {
					if (!pairs[j])
						continue;
					if (array)
						ops[o].push(pairs[j].replace(/ /g,""));
					else{
						v=pairs[j].split("=");
						if (o == "options")
							ops[v[0]]=v[1].replace(/ /g,"");
						else if (v[0].indexOf(".") != -1) {
							ops[o][v[0].split(".")[0]]={};
							ops[o][v[0].split(".")[0]][v[0].split(".")[1]]=v[1];
							}
						else if (v[0].indexOf("_") != -1) {
							ops[o][v[0].split("_")[0]]={};
							ops[o][v[0].split("_")[0]][v[0].split("_")[1]]=v[1];
							}
						else
							ops[o][v[0]]=v[1];
						}
					}
				}
			}
   		if (ops[o] == 'true') 	ops[o]=true;
  		if (ops[o] == 'false') 	ops[o]=false;
   		}
	if (options['width'])		$(con).width(options['width']);
	if (options['height'])		$(con).height(options['height']);
	ops.containerId=this.container;
	if (!ops.colors)	delete ops.colors;
   	if (ops.query) {
  		var v=ops.query.split(" ");
  		for (i=0;i<v.length;++i) {
  			if (v[i] == "has") {
  				v[i++]="LIKE";
  				v[i]="'%"+v[i]+"%'";
  				}
  			}
 		ops.query="";
 		for (i=0;i<v.length;++i) 
  			ops.query+=v[i]+" ";
 		}
    if (options.series) {
        var v=options.series.split(",")
        ops.series=new Array();
        var o={};
        for (i=1;i<v.length;++i) {
            if (!isNaN(v[i]))
            ops.series.push(o),o={};
        else
            o[v[i].split("=")[0]]=v[i].split("=")[1];
        }
        ops.series.push(o);
        }
 	var wrap=new google.visualization.ChartWrapper(ops);				// Get google chart obj
	this.map=wrap;														// Save ptr in map
 	if (ops.dataSourceUrl) 												// If a data source spec'd
 		ops.dataSourceUrl=""+ops.dataSourceUrl.replace(/\^/g,"&");		// Restore special chars
 	wrap.setOptions(ops);												// Set options
 
 	if (ops.dataSourceUrl.indexOf("google.com") == -1) {				// Not a google doc
    	shivaLib.GetSpreadsheet(ops.dataSourceUrl,false,ops.query,function(data) {	// Get spreadsheet data
			ops.dataSourceUrl=ops.query="";								// Null source/query out
		  	wrap.setOptions(ops);										// Re-set options
			wrap.setDataTable(data);									// Add the data
		    wrap.draw();												// Draw chart
  			});
		}
	else  																// Google doc
	    wrap.draw();													// Draw chart
 
 	google.visualization.events.addListener(wrap,"ready", function() { _this.SendReadyMessage(true); });
  	google.visualization.events.addListener(wrap,"select", function(r) { 
  		var o=wrap.getChart().getSelection()[0];						// Get element clicked
   		var row="-", col="-";											// Clear
   		if ((o) && (o.row != undefined))								// If a row
   			row=o.row;													// Set it
   		if ((o) && (o.column != undefined))								// If a col
   			col=o.column;												// Set it
  		_this.SendShivaMessage("ShivaChart=click",row+"|"+col); 		// Send EVA message
   		});
}

SHIVA_Show.prototype.ChartActions=function(msg)						// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaAct=resize") { 									// RESIZE
		if (v[1] == "100") {											// If forcing 100%
			$("#containerDiv").width("100%");							// Set container 100%
			$("#containerDiv").height("100%");							// Set container 100%
			shivaLib.map.setOption("width","100%");						// Set chart wid 100%
			shivaLib.map.setOption("height","100%");					// Set chart hgt 100%
			}
		shivaLib.map.draw();											// Redraw chart
		}
	else if (v[0] == "ShivaAct=data") {									// DATA
		var data=google.visualization.arrayToDataTable($.parseJSON(v[1]));	// Convert to table format
		shivaLib.map.setDataTable(data);								// Set data
		shivaLib.map.draw();											// Redraw chart
		}
}

SHIVA_Show.prototype.Sound=function(sound, mode)				// PLAY SOUND
{	
	var snd=new Audio();
	if (!snd.canPlayType("audio/mpeg") || (snd.canPlayType("audio/mpeg") == "maybe")) 
		snd=new Audio(sound+".ogg");
	else	
		snd=new Audio(sound+".mp3");
	if (mode != "init")
		snd.play();
}

SHIVA_Show.prototype.ShowIframe=function(left, top, wid, hgt, url, id, mode, content)
{
	$("#"+id).remove();															
	$("#CL-"+id).remove();															
	if ((hgt == 0) || (wid == 0))
		return;
	var	str="<iframe id='"+id+"' ";
	if (url)
		str+="src='"+url+"' ";
	str+="style='position:absolute;"; 					
	if (mode == "black")
		str+="border:none;background:black;"
	else if (mode == "transparent")
		str+="border:none;background:transparent;"
	else
		str+="background:white;"
	str+="width:"+(wid+2)+"px;height:"+(hgt+2)+"px;left:"+left+"px;top:"+top+"px;'";
	if (mode == "black")
		str+=" scrolling='no'";
	else if (mode == "transparent")
		str+=" allowtransparency='true'";
	$("body").append(str+"></iframe>");	
	str="<iframe marginwidth='0' marginheight='0' src='closedot.gif' id='CL-"+id+"' style='position:absolute;margin:0px;padding:0px;border:none;"; 					
	str+="width:17px;height:18px;left:"+(wid-13+left)+"px;top:"+(top+3)+"px'/>";
	if (mode != "black")
		$("body").append(str);	

	$("#"+id).bind("load",function(e) {
    	if (content)
    		this.contentWindow.document.body.innerHTML=content;
      });
	$("#CL-"+id).bind("load",function(e) {
  		this.contentWindow.document.body.onclick=function(e) {
     	shivaLib.Sound("delete");
		$("#"+id).remove();															
		$("#CL-"+id).remove();															
      }});
}

SHIVA_Show.prototype.ShowLightBox=function(width, top, title, content)
{
	var str;
	str="<div id='shivaLightBoxDiv' style='position:fixed;width:100%;height:100%;";	
	str+="background:url(overlay.png) repeat;top:0px;left:0px';</div>";
	$("body").append(str);														
	str="<div id='shivaLightBoxIntDiv' style='position:absolute;padding:10px;width:";
	if (width != "auto") 
		str+=Math.abs(width)+"px";	
	else
		width=400;
	var x=($("#shivaLightBoxDiv").width()-width)/2;
	if (width < 0) {												// EARTH KLUDGE!!
		x=$("#"+this.container).css("left").replace(/px/,"");
		x=x-0+$("#"+this.container).width()/2+(width/2);
		}
	str+=";border-radius:12px;moz-border-radius:12px;z-index:2003;"
	str+="border:1px solid; left:"+x+"px;top:"+top+"%;background-color:#f8f8f8'>";
	str+="<img src='shivalogo32.png' style='vertical-align:-30%'/>&nbsp;&nbsp;";								
	str+="<span style='font-size:large;text-shadow:1px 1px #ccc'><b>"+title+"</b></span>";
	str+="<div id='shivaLightContentDiv'>"+content+"</div>";					
	$("#shivaLightBoxDiv").append(str);	
	$("#shivaLightBoxDiv").css("z-index",2500);						
}

SHIVA_Show.prototype.Prompt=function(title, message, def, id)
{
	var ops={ width:'auto',height:'auto',modal:true,autoOpen:true,title:title,
			buttons: {
				OK: function() {
					$("#"+id).val($("#shiva_dialogInput").val());
					$(this).remove();
					},
				CANCEL: function() { $(this).remove(); }
				}
		}
	var str="<br/><b>"+message+"</b><br/><br/>";
	str+="<input type='input' size='23' id='shiva_dialogInput' value='"+def+"'/>";
	$("body").append("<div id='shiva_dialogDiv'/>");
	$("#shiva_dialogDiv").dialog(ops);
	$("#shiva_dialogDiv").html(str);
}

SHIVA_Show.prototype.MakeSelect=function(id, multi, items, sel, extra, values)
{
	var	str="<select id='"+id+"'";
	if (multi)
		str+="multiple='multiple' size='"+multi+"'";
	if (extra)
		str+=extra;
	str+=">";
	for (i=0;i<items.length;++i) {
		str+="<option";
		if (sel == items[i])
			str+=" selected='selected'"
		if (values && values[i])
			str+=" value='"+values[i]+"'";
		str+=">"+items[i]+"</option>";
		}	
	return str+"</select>"
}

SHIVA_Show.prototype.GetTextFile=function(file, callback)
{
	var syncMode=false;
	if (file.charAt(0) == "@")														
		file="proxy.php?url="+file.substr(1);				
	xmlhttp=new XMLHttpRequest();
	if (callback) {
		syncMode=true;
		xmlhttp.onload=function(e){ callback(e.target.responseText); }
		}
	xmlhttp.open("GET",file,syncMode);
	xmlhttp.send();
	return(xmlhttp.responseText);
}

SHIVA_Show.prototype.ConvertDateToJSON=function(dateTime) 									
{
	var mos=new Array("","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	var v=String(dateTime).split('/');
	if (v.length == 2)
		return(mos[v[0]]+" "+v[1]);
	else if (v.length == 3)
		return(mos[v[0]]+" "+v[1]+" "+v[2]);
	return v[0];
}

SHIVA_Show.prototype.FormatDate=function(date, format) 					//	FORMAT DATE STRING
{
	var mos=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	var d=new Date(date);													// Parse into date format
	var t=d.toString().match(/.{16}(.{8})/)[1];								// Get time
	if (format)																// If defined
		format=format.toLowerCase();										// Force lc
	if (format == "m/d/y")													// Based on format...												
		return (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();		// Return string
	else if (format == "m/y")
		return (d.getMonth()+1)+"/"+d.getFullYear();
	else if (format == "mo d, y")
		return mos[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear();
	else if (format == "mo, y")
		return mos[d.getMonth()]+" "+d.getFullYear();
	else if (format == "mo d, y h:m")
		return mos[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()+" "+t.substring(0,5);
	else if (format == "m/d/y h:m:s")
		return (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+t;
	else if (format == "m/d/y h:m")
		return (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+t.substring(0,5);
	else (format == "y")
		return d.getFullYear();
}


SHIVA_Show.prototype.ArrayToString=function(jsonArray) 					// SAVE JSON ARRAY AS STRING
{
	var i,o,oo,str="[",key,val;
	for (i=0;i<jsonArray.length;++i) {										// For each event
		str+="{";															// Beginning item
		o=jsonArray[i];														// Point at data
		for (key in o) {													// For each item
			val=o[key];														// Get val
			str+="\""+key+"\":";											// Add key
			if (typeof(o[key]) == "object")  {								// An object
				str+="{";													// Initial {
				oo=o[key];													// Point at interior obj									
				for (key in oo) {											// For each item
					str+="\""+key+"\":";									// Add key
					val=oo[key];											// Get val
					str+="\""+val+"\",";									// Add to val
					}	
				str=str.substr(0,str.length-1)+"\t},";						// Remove last comma and add final },
				}
			else															// Regular one
				str+="\""+val+"\",";										// Add val
			}
		str=str.substr(0,str.length-1);										// Lop off last comma
		if (i != jsonArray.length-1)	str+="},\n";						// Not the last one use comma
		else							str+="}]";							// No comma or LF on last 
		}
	return str;
}


SHIVA_Show.prototype.LinkToAnchor=function(str) 						// CONVERT LINKS TO ANCHORS
{
	var i,v,vv,url,title;
	if (!str)																// If no string
		return "";															// Return null
	if (str.match(/href=/)) 												// If an embedded <a> tag
		return str;															// Don't convert
	if (str.match(/http/)) {												// If an embedded url
		v=(str+" ").match(/http.?:\/\/.*?\s/ig);							// Extract url(s)
		for (i=0;i<v.length;++i) {											// For each url
			
			v[i]=$.trim(v[i]);												// Trim it
			vv=v[i].split("|");												// Split by bar
			url=title=vv[0];												// Get url/title 
			if (vv.length > 1) 												// If a title spec'd
				title=vv[1].replace(/_/g," ");								// Get separate title and restore spaces
			str=str.replace(RegExp(v[i].replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"))," <a href='"+url+"' target='_blank'>"+title+"</a> ");	// Replace with anchor tag
			}
		}
	return str;																// Return converted string
}

SHIVA_Show.prototype.Clone=function(obj) 								// CLONE OBJECT/ARRAY
{
    var i;
    if (null == obj || "object" != typeof obj) return obj;					// Singleton
	else if (obj instanceof Array) {   										// Handle Array
	    var copy=[];														// Copy array
        for (i=0;i<obj.length;++i) 											// For each member 
        	copy[i]=this.Clone(obj[i]);										// Copy with recursion
        return copy;														// Return array
    	}
	else if (obj instanceof Object) {   									// Handle Object
	    var copy={};														// Copy objecy
 		for (var attr in obj)												// For each part
			if (obj.hasOwnProperty(attr)) 									// ?
				copy[attr]=this.Clone(obj[attr]);							// Copy with recursion
        return copy;														// Return obj
   	 	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	ESTORE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.EasyFile=function(_data, callback, type) 			// EASYFILE MENU
{
	var i,email="",w=350;											
	var v=document.cookie.split(';');										// Get cookie array
	for (var i=0;i<v.length;i++) 											// for each cookie
		if (v[i].indexOf("ez-email=") != -1)								// If an email set
			email=v[i].substr(9);											// Use it
	var str="<br/>Use <b>eStore</b> to save and load projects under your email address. When saving, type a title when asked and when loading, choose a project from a list of your saved projects.<br/>"
		str+="<br/><table id='ez-maintbl' cellspacing=0 cellpadding=0 style='font-size:small'>";
	str+="<tr><td width='25%'>Email</td><td><input type='text' id='email' size='40' value='"+email+"'/></td></tr>";
	str+="</table><div align='right' style='font-size:x-small'><br/>";	
	if (type != "all")
		str+=" <button id='saveBut'>Save</button>";	
	str+=" <button id='loadBut'>Load</button>";	
	if (type != "all")
		str+=" <button id='linkBut'>Link</button>";	
	str+=" <button id='cancelBut'>Cancel</button></div>";	
	if ((type == "KML") || (this.group == "Earth")) {						// Earth kluge
		 w=-400;															// Move left
		 $("#containerDiv").height($("#containerDiv").height()/100);		// Shrink it
		 }																
	this.ShowLightBox(w,20,"SHIVA eStore",str)								// Create light box
	$("#cancelBut").button().click(function() { $("#shivaLightBoxDiv").remove();		// Remove box
												if ($("#containerDiv").height() < 10)	// If a shrunken frame
													$("#containerDiv").height($("#containerDiv").height()*100);	// Restore it
												});
	$("#saveBut").button().click(function() {								// SAVE
		var _email=$("#email").val();										// Get email
		var _title=$("#ez-title").val();									// Get title
		var _type=type;														// Get type
		if (!_email) {														// Need email
			alert("Please type your email");								// Alertsh
			return;															// Don't save
			}						
		if (((_email.toLowerCase() == "samples") && (_email != "SaMpLeS")) || // Samples
			((_email.toLowerCase() == "canvas") && (_email != "CaNvAs"))) {	// Canvas
			alert("Sorry, but you can't save using this name");				// Alert
			return;															// Don't save
			}						
		if (!$("#ez-title").length) {										// If no title
			str="<tr><td>Title</td><td><input type='text' size='40' id='ez-title'/></td></tr>";
			$(str).appendTo("#ez-maintbl tbody");							// Add title to table
			$("#ez-title").focus();											// Focus on title
			return;
			}
		if (!_title) {														// Need title
			alert("Please type title to save under");						// Alert
			return;															// Don't save
			}						
		document.cookie="ez-email="+_email;									// Save email in cookie
		$("#shivaLightBoxDiv").remove();									// Close box						
		if ($("#containerDiv").height() < 10)								// If a shrunken frame (Earth kluge)
			$("#containerDiv").height($("#containerDiv").height()*100);		// Restore it
		str="\",\n\t\"shivaTitle\": \""+_title+"\"\n}";						// Add title
		if ((type != "Canvas") && (type != "KML"))							// Not for canvas or KML
			_data=_data.substr(0,_data.lastIndexOf("\""))+str;				// Remove last "\n}
		$.post("http://www.stagetools.com/vis/shiva/addeasyfile.php",{ email:_email, type: _type, title:_title,data:_data.replace(/'/g,"\\'") });
		});
	
	$("#loadBut").button().click(function() {								// LOAD
		email=$("#email").val();											// Get email
		if (!email) {														// Need email
			alert("Please type your email");								// Alert
			return;															// Don't save
			}						
		if (!isNaN(email)) {												// If just a number
			shivaLib.LoadEasyFile(email, callback);							// Load it directly
			return;															// Quit
			}	
		document.cookie="ez-email="+email;									// Save email in cookie
		var dat={ email:email };											// Set email to look for
		if (type != "all")													// If not loading all
			dat["type"]=type;												// Filter by type
		str="http://www.stagetools.com/vis/shiva/listeasyfile.php";				// eStore list url
		shivaLib.ezcb=callback;		shivaLib.ezmode="load";					// Set callback and mode
		$.ajax({ url: str, data:dat, dataType:'jsonp' });					// Get jsonp
		});
			
	$("#linkBut").button().click(function() {								// LINK
		email=$("#email").val();											// Get email
		if (!email) {														// Need email
			alert("Please type your email");								// Alert
			return;															// Don't save
			}						
		document.cookie="ez-email="+email;									// Save email in cookie
		var dat={ email:email };											// Set emila to look for
		if (type != "all")													// If not loading all
			dat["type"]=type;												// Filter by type
		str="http://www.stagetools.com/vis/shiva/listeasyfile.php";				// eStore list url
		shivaLib.ezcb="";		shivaLib.ezmode="link";						// Set callback and mode
		$.ajax({ url: str, data:dat, dataType:'jsonp' });					// Get jsonp
		});
	}

SHIVA_Show.prototype.ShowEasyFile=function(files, callback, mode) 		// GET DATA FROM EASYFILE
{
		var i;
		var str="<br/><div style='overflow:auto;overflow-x:hidden;height:200px;font-size:x-small;padding:8px;border:1px solid #cccccc'>";
		str+="<table id='ezFilesTable' cellspacing=0 cellpadding=4><tr><td></td></tr></table></div>";
		$("#shivaLightContentDiv").html(str);													
		str="<div align='right' style='font-size:x-small'><br>Show only with this in title: <input type='text' size='10' id='ezFileFilter'/>";
		str+=" <button id='cancelBut'>Cancel</button></div>";	
		$("#shivaLightContentDiv").append(str);
		$("#cancelBut").button().click(function() { $("#shivaLightBoxDiv").remove();
													if ($("#containerDiv").height() < 10)	// If a shrunken frame (Earth kluge)
													$("#containerDiv").height($("#containerDiv").height()*100);		// Restore it
													});
		this.MakeEasyFileList(files,"",callback,mode);						// Show files
		$("#ezFileFilter").keyup($.proxy(function() {						// Add change handler
 			var filter=$("#ezFileFilter").val();							// Get filter
			$("#ezFilesTable tbody").empty();								// Empty all rows
			this.MakeEasyFileList(files,filter,callback,mode);				// Show files
			},this));
}

SHIVA_Show.prototype.MakeEasyFileList=function(files, filter, callback, mode) 	// SHOW LIST OF FILES
{
	var i,str,type;
	files.sort(function(a, b) { 												// Sort by date
		var A=new Date(a.created.substr(0,5)+"/2012 "+a.created.substr(6) );
		var B=new Date(b.created.substr(0,5)+"/2012 "+b.created.substr(6) );
		return B-A; 
		});												
	for (i=0;i<files.length;++i) {											// For each file
		if ((filter) && (files[i].title.toLowerCase().indexOf(filter.toLowerCase()) == -1)) // If  filter not in title
			continue;														// Skip it
		str="<tr id='ezfile-"+files[i].id+"'><td>"+files[i].created.replace(/ /,"&nbsp")+"</td>";		// Add date
		str+="<td width='100%'><img  src='adddot.gif'  height='11'> &nbsp;";
		str+=files[i].id+" "+files[i].title+"</td></tr>";					// Add title
		$(str).appendTo("#ezFilesTable tbody");								// Add file to table
		$("#ezFilesTable tr:odd").addClass("odd");							// Color
		}
	for (i=0;i<files.length;++i) {											// For each file
		type=files[i].type;													// Set type
		$("#ezfile-"+files[i].id).click(function() {						// Add click handler
			if ((mode == "link") && (type == "KML"))						// If a KML link
				prompt("Press Ctrl-C to copy link","http://www.stagetools.com/vis/shiva/getkml.php?id="+this.id.substr(7));	// Show url
			if ((mode == "link") && (type != "KML"))						// If a SHIVA link
				prompt("Press Ctrl-C to copy link","www.viseyes.org/shiva/go.htm?e="+this.id.substr(7));	// Show url
			else{															// If a load
				var dat={ id:this.id.substr(7) };							// Set id to look for
				str="http://www.stagetools.com/vis/shiva/geteasyfile.php";	// eStore list url
				shivaLib.ezcb=callback;										// Set callback
				shivaLib.ezmode=this.id.substr(7);	 						// Set ID
				$.ajax({ url: str, data:dat, dataType:'jsonp' });			// Get jsonp
				}
			$("#shivaLightBoxDiv").remove();								// Close lightbox
			if ($("#containerDiv").height() < 10)							// If a shrunken frame (Earth kluge)
				$("#containerDiv").height($("#containerDiv").height()*100);	// Restore it
			});	
		}
}

SHIVA_Show.prototype.LoadEasyFile=function(num, callback) 				// GET SINGLE EASYFILE 
{
	var str="http://www.stagetools.com/vis/shiva/geteasyfile.php";			// eStore url
	shivaLib.ezcb=callback;													// Set callback
	shivaLib.ezmode=num;	 												// Set ID
	$.ajax({ url: str, data:{id:num}, dataType:'jsonp' });					// Get jsonp
	$("#shivaLightBoxDiv").remove();										// Close lightbox
	if ($("#containerDiv").height() < 10)									// If a shrunken frame (Earth kluge)
		$("#containerDiv").height($("#containerDiv").height()*100);			// Restore it
}

function easyFileListWrapper(data)										// LOAD EASY FILE LIST
{
	shivaLib.ShowEasyFile(data,shivaLib.ezcb,shivaLib.ezmode); 				// Show list of files
}

function easyFileDataWrapper(data)										// LOAD EASY FILE DATA
{
	if (!data["Element-0"])													// If not a canvas element
		data.shivaId=Number(shivaLib.ezmode);								// Set ID
	shivaLib.ezcb(data);													// Callback
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	HELPERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Graphics.prototype.EnumObject=function(obj) 														// DEBUG TOOL
{
	trace("------------------------------------------------------------");		
	for (var key in obj) 														
		trace(key+"="+obj[key])													
}

function trace(msg, p1, p2, p3, p4)
{
	if (p4)
		console.log(msg,p1,p2,p3,p4);
	else if (p3)
		console.log(msg,p1,p2,p3);
	else if (p2)
		console.log(msg,p1,p2);
	else if (p1)
		console.log(msg,p1);
	else
		console.log(msg);
	
}

SHIVA_Draw.prototype.isTouchDevice=function() 							// IS THIS A TOUCH DEVICE?
{
	var el=document.createElement('div');									// Make div
	el.setAttribute('ongesturestart', 'return;');							// Try to set gesture
	if (typeof el.ongesturestart == "function")								// If supports touch		
		return true;														// Return true
	else 																	// Doesn't support touch
		return false;														// Return false
}

