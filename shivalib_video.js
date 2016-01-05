///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB VIDEO
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawVideo=function() 										//	DRAW VIDEO
{
	var options=this.options;
//	options.dataSourceUrl="17853047"; 
//	options.dataSourceUrl="http://www.primaryaccess.org/music.mp3";	
//	options.dataSourceUrl="//www.kaltura.com/p/2003471/sp/0/playManifest/entryId/1_c7z7zuiv/format/url/flavorParamId/2003471/video.mp4";
	var con="#"+this.container;
	$(con).width(options.width);
	$(con).height(options.height);
	
	var o=this.playerOps={};													// Holds options
	o.playerAuto=options.autoplay;												// Autoplay?
	o.playerStart=o.playerEnd=0;												// Start/end
	o.playerVolume=options.volume;												// Default volume
	o.playerSpeed=1;
	o.playerAspect=.5625;
	o.playerControls="true";
	o.player=null;																// Holds player object
	o.playerNow=0;																// Current time in secs
	o.playerMode="empty";														// State of player
	o.playerType="";															// Type of player
	o.isMobile=false;															// Flag for mobile devices
	o.playerSource=options.dataSourceUrl;										// Source
	if (!o.playerSource)		
		return;																	// Quit if missing
	if (options.start)															// Start defined
		o.playerStart=shivaLib.TimecodeToSeconds(options.start);				// Convert tc -> secs
	if (options.end)															// End defined
		o.playerEnd=shivaLib.TimecodeToSeconds(options.start);					// Convert tc -> secs
	
	if (!isNaN(o.playerSource) || o.playerSource.match(/vimeo\.com/i)) {		// If Vimeo or simple number
			o.playerType="vimeo";												// Set type
			if (o.playerSource.match(/vimeo\.com\//i))							// A url or embed code
				o.playerSource=o.playerSource.match(/\d+/);						// Extract id
			this.RunPlayer("init");												// Init player
			}
	else if (o.playerSource.match(/\/\//i) && !o.playerSource.match(/youtu.*be/)) {	// If HTML5 and not a Youtube link
			if (this.player && (o.playerType == "html5")) {						// Player not active loaded
				if (this.player.currentSrc.indexOf(o.playerSource) == -1) {		// Different clip
					var base=o.playerSource.match(/(.*)\.[^.]+$/i)[1];			// Extract base
					if (o.playerSource.match(/\.mp3/i)) 						// If audio
						this.player.src=base+".mp3";							// MP3 Source
					else{														// VIDEO
						this.player.src=base+".mp4";							// MP4 Source
						this.player.src=base+".ogg";							// OGG Source
						this.player.src=base+".webm";							// WEBM Source
						}
					this.player.load();											// Load it
					}
				}
			else{
				o.playerType="html5";											// Set type
				this.RunPlayer("init");											// Init player
				}
			}
		else{																	// If YouTube
			if (o.playerSource.match(/v=/i)) 									// Direct link
				o.playerSource=o.playerSource.match(/v=(.+)/i)[1];				// Extract id
			else if (o.playerSource.match(/youtu\.be/i)) 						// Share link
				o.playerSource=o.playerSource.match(/youtu\.be\/(.+)/i)[1];		// Extract id

			o.playerType="youtube";												// Set type
			if (this.player) {													// Player active 
				if (!this.player.pauseVideo)	{								// If not YT player set
					if (YT.Player)												// If library is loaded
						this.RunPlayer("init");									// Re-init
					else{														// Load YT api
						var tag=document.createElement('script');				// Create script
						tag.src="//www.youtube.com/iframe_api";					// Set api url
						var firstScriptTag=document.getElementsByTagName('script')[0];	// Find 1st script
						firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);		// Load
						}
					}
				else{															// Player is active
					if (this.player.getVideoUrl().indexOf(o.playerSource) == -1) // Different clip
						this.player.loadVideoById(o.playerSource);				// Reload clip
					else
						this.player.seekTo(o.playerStart);						// Seek to start point
					if (o.playerAuto == "true")									// If autoplay
						this.player.playVideo();								// Play video
					}
				}
			else{																// API not loaded yet
				var tag=document.createElement('script');						// Create script
				tag.src="//www.youtube.com/iframe_api";							// Set api url
				var firstScriptTag=document.getElementsByTagName('script')[0];	// Find 1st script
				firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);		// Load
				}
			}
		shivaLib.RunPlayer("resize");											// Size player
		shivaLib.RunPlayer("volume",o.playerVolume);							// Set volume
		shivaLib.VideoNotes();													// Show notes if active
}																				// End DrawVideo() closure

function onYouTubeIframeAPIReady() 											// YOUTUBE PLAYER READY
{   
	shivaLib.RunPlayer("init");													// Init player								
}

SHIVA_Show.prototype.RunPlayer=function(what, param, param2)				//	DRAW VIDEO
{
		var i,str;
		var o=this.playerOps;													// Point at options
		var con="#"+this.container;
		if ((what == "play") || (what == "jump")) {								// Play/jump
			if ((o.playerMode == "empty") && o.isMobile)						// Mobiles need user to initiate touch before controlled play
				return;															// Quit
			o.playerMode="play";												// Set mode
 			if (param != undefined) {											// If playing to a time
				if ((""+param).match(/:/))										// In tc format
					param=TimecodeToSeconds(param);								// Convert to secs
				o.playerNow=param;												// Set cur time
				}	
			if (!this.player) {													// If no player yet
				return;															// Quit
				}
			if (o.playerType == "youtube") {									// If YouTube
				this.player.seekTo(o.playerNow,true);							// Cue
				if (o.playerMode == "play")			this.player.playVideo();	// Play
				else if (o.playerMode == "pause")	this.player.pauseVideo();	// Pause
				}
			else if (o.playerType == "vimeo") {									// If Vimeo
				
				this.player.contentWindow.postMessage("{\"method\":\"seekTo\",\"value\":\""+o.playerNow+"\"}","*")
				if (o.playerMode == "play")										// Play
					this.player.contentWindow.postMessage("{\"method\":\"play\"}","*");	// Send
				if (o.playerMode == "pause")									// Pause
					this.player.contentWindow.postMessage("{\"method\":\"pause\"}","*");	// Send
 				}
			else if (o.playerType == "html5") {									// If HTML5
				if (param != undefined) 										// If playing to a time
					this.player.currentTime=o.playerNow;						// Cue
				if (o.playerMode == "play")  	this.player.play(); 			// Play
				if (o.playerMode == "pause")	this.player.pause();			// Pause
				}
			if (o.playerMode == "play")	o.playerStarted=o.playerNow;			// Save start point
			
			}
		else if ((what == "scrub") || (what == "seek"))  {						// Scrub
			if ((o.playerMode == "empty") && o.isMobile)						// Mobiles need user to initiate touch before controlled play
				return;															// Quit
			o.playerNow=param;													// Set now
			if (!this.player) {													// If no player yet
				return;															// Quit
				}
			if (o.playerType == "youtube") 										// If YouTube
				this.player.seekTo(o.playerNow,true);							// Cue
			else if (o.playerType == "vimeo") 									// If Vimeo
				this.player.contentWindow.postMessage("{\"method\":\"seekTo\",\"value\":\""+o.playerNow+"\"}","*");
			else if (o.playerType == "html5") 									// If HTML5
				this.player.currentTime=o.playerNow;							// Cue
				}
		else if (what == "pause") {												// Pause
			$("#playBut").attr("src","images/playbut.gif");						// Show pause but
			o.playerMode="pause";												// Set mode
			if (!this.player)	return;											// If no player yet, quit
			if (o.playerType == "youtube") 										// If YouTube
				this.player.pauseVideo();										// Pause
			else if (o.playerType == "vimeo") 									// If Vimeo
				this.player.contentWindow.postMessage("{\"method\":\"pause\"}","*");	// Send
 			else if (o.playerType == "html5") 									// If HTML5
				this.player.pause(); 											// Pause
			}
		else if (what == "time") {												// Time
			if (!this.player)	return;											// If no player yet, quit
			if (o.playerType == "youtube") 										// If YouTube
				return this.player.getCurrentTime();							// Return time			
			else if (o.playerType == "vimeo") 									// If Vimeo
				return o.playerCurTime;											// Return time			
			else if (o.playerType == "html5") 									// If HTML5
				return this.player.currentTime;									// Return time			
			}

		else if (what == "volume") {											// Volume
			if (!this.player)	return;											// If no player yet, quit
			if (o.playerType == "youtube") 										// If YouTube
				this.player.setVolume(o.playerVolume-0);						// Set it
			else if (o.playerType == "vimeo") 									// If Vimeo
				this.player.contentWindow.postMessage("{\"method\":\"setVolume\",\"value\":\""+o.playerVolume/100+"\"}","*"); // Send
			else if (o.playerType == "html5") 									// If HTML5
				this.player.volume=o.playerVolume/100;							// Set
			}
		else if (what == "speed") {												// Speed
			if (!this.player)	return;											// If no player yet, quit
			s=Math.max(.25,o.playerSpeed/50);									// Speed set .25 to 2
			if (o.playerType == "youtube") 										// If initted YouTube
				this.player.setPlaybackRate(s);									// Set speed
			else if (o.playerType == "html5") 									// If HTML5
				this.player.playbackRate=s;										// Set speed
			}
		else if (what == "resize") {											// Resize
			if (!this.player)	return;											// If no player yet, quit
			var w=$(con).width();												// Get width
			$("#vplayer").width(w);												// Set width
			$("#vplayer").height(w*o.playerAspect);								// Set height
			}
		else if (what == "ready") {												// When ready
			shivaLib.RunPlayer("pause");										// Pause
			shivaLib.RunPlayer("resize");										// Size player
			if (o.playerAuto == "true")	{										// If autoplay
				shivaLib.RunPlayer("play",o.playerStart);						// Seek
				}
			else if (o.playerStart) {											// Normal pause start
				shivaLib.RunPlayer("scrub",o.playerStart);						// Seek
				shivaLib.RunPlayer("pause");									// Pause
				}
	 		shivaLib.SendReadyMessage(true);									// Ready										
			}

		else if (what == "init") {												// Init player
			if (o.playerType == "youtube") {									// If YouTube
				$(con).html("<div id='vplayer'></div>");						// Add holder div
	       		var pc=o.playerControls == "true" ? 1 : 0;						// Set player controls?
	       		this.player=new YT.Player("vplayer", {							// Init player
					playerVars:{ modestbranding:1, controls:pc, 				// Settings	
						disablekb:1, rel:0, showinfo:0, html5:1, autoplay:1 },
	          		videoId: o.playerSource,									// Set source
	         	 	events:{													// Add event handlers
	            		"onReady": function(s) { shivaLib.RunPlayer("ready") }	// When ready
		 	   			}});
					}
			else if (o.playerType == "vimeo") {									// If Vimeo
				str="<iframe id='vplayer' src='//player.vimeo.com/video/";		// Iframe start
				str+=o.playerSource;											// Add source
				str+="?api=1&player_id=vplayer' width='500' height='281' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>";
				$(con).html(str);												// Add vimeo iframe
		       	this.player=$("#vplayer")[0];										// Point to iframe
				}
			else if (o.playerType == "html5") {									// If HTML5
 				$(con).html("");												// Add video tag
				var base=o.playerSource.match(/(.*)\.[^.]+$/i)[1];				// Extract base
				str="<video id='vplayer' width='100%' height='100%'";			// Video tag
				if ((o.playerControls == "true") || o.isMobile)					// If has controls or mobile
					str+= " controls";											// Add native controls to player
				str+=">";														// Close tag
				if (o.playerSource.match(/\.mp3/i)) {							// If audio
					str+="<source src='"+base+".mp3'  type='audio/mp3'>";		// MP3 Source
					}
				else{															// VIDEO
					str+="<source src='"+base+".mp4'  type='video/mp4'>";		// MP4 Source
					str+="<source src='"+base+".ogg'  type='video/ogg'>";		// OGG Source
					str+="<source src='"+base+".webm' type='video/webm'>";		// WEBM Source
					}
				str+="</video>"
				$(con).html(str);												// Add video tag
  				var myVid=document.getElementById("vplayer");					// Point ar player	
 				
 				
 				myVid.onloadstart=function() {									// When loaded
 					shivaLib.player=$("#vplayer")[0];							// Point to player
 					shivaLib.RunPlayer("ready");								// Set up player		
					};
								
				myVid.oncanplay=function() {									// When ready
       				o.playerAspect=shivaLib.player.videoHeight/shivaLib.player.videoWidth;	// Set aspect 				
 					};

 				myVid.onended= function() {										// When done
  					shivaLib.RunPlayer("pause");								// Pause
 					};

				myVid.onplay= function() {										// When playing
					$("#playBut").attr("src","images/pausebut.gif");			// Show pause but
 						o.playerMode="play";									// Set mode
					o.playerStarted=o.playerNow;								// Save start point
					};

				myVid.onpause= function() {										// When paused
					$("#playBut").attr("src","images/playbut.gif");				// Show play but
 						o.playerMode="pause";									// Set mode
   					};
  		 		
 			  	myVid.addEventListener("loadstart",myVid.onloadstart);	 		// Add listener for safari
 		 		myVid.addEventListener("canplay",myVid.oncanplay);	 			// Add listener for safari
			  	myVid.addEventListener("ended",myVid.onended);	 				// Add listener for safari
 			  	myVid.addEventListener("play",myVid.onplay);	 				// Add listener for safari
 			  	myVid.addEventListener("pause",myVid.onpause);	 				// Add listener for safari
 	    		}
			}																	// End init
 	}																			// End closure
   
SHIVA_Show.prototype.VideoDuration=function()							//	GET VIDEO DURATION
{
	var o=this.playerOps;														// Point at options
	if (!this.player)															// If not initted yet	
		return -1;																// No time
	if (o.playerType == "html5")  												// If HTML5 
		return document.getElementById("vplayer").duration;						// Return duration											
	else if (o.playerType == "vimeo")											// Vimeo
		return o.playerTRT-0;													// Return duration		
	else if (o.playerType == "youtube") 										// If YouTube
		return this.player.getDuration();										// Return duration	
	return -1;																	// No time
}
  
SHIVA_Show.prototype.TimecodeToSeconds=function(timecode) 				// CONVERT TIMECODE TO SECONDS
{
	var h=0,m=0;
	var v=(""+timecode).split(":");											// Split by colons
	var s=v[0]																// Add them
 	if (v.length == 2)														// Just minutes, seconds
		s=v[1],m=v[0];														// Add them
	else if (v.length == 3)													// Hours, minutes, seconds
		s=v[2],m=v[1],h=v[0];												// Add them
	return(Number(h*3600)+Number(m*60)+Number(s));							// Convert
}

SHIVA_Show.prototype.SecondsToTimecode=function(secs) 					// CONVERT SECONDS TO TIMECODE
{
	var str="",n;
	n=Math.floor(secs/3600);												// Get hours
	if (n) str+=n+":";														// Add to tc
	n=Math.floor(secs/60);													// Get mins
	if (n < 10) str+="0";													// Add leading 0
	str+=n+":";																// Add to tc
	n=Math.floor(secs%60);													// Get secs
	if (n < 10) str+="0";													// Add leading 0
	str+=n;																	// Add to tc
	return str;																// Return timecode			
}	

SHIVA_Show.prototype.VideoNotes=function() 								//	ADD NOTES TO VIDEO
{
	var i,str,v;
	$("#shivaNotesDiv").remove();											// Clear it
	if ((!this.options.ntext) && (this.options.vnotes != "true")) 			// If not visible
		return;																// Turn it off
	var ts="color:#009900;cursor:pointer";									// Timecode style
	var ns="font-size:small;border:none;background:none;width:100%;padding:0px;margin:0px"; // Note style	
	var con=$("#"+this.container);											// Point at video player container	
	str="<div id='shivaNotesDiv' style='position:absolute;padding:8px;overflow-y:auto;";	// Div
	str+="width:500px;height:"+(con.height()-16)+"px;";						// Set sizing
	str+="background-color:#f8f8f8;border:1px solid #ccc;box-shadow:4px 4px 8px #ccc;";			// Set coloring
	var top=con.offset().top;												// Get top
	var left=con.offset().left+con.width()+16;								// Get left
	str+="top:"+top+"px;left:"+left+"px;'>";								// Set position
	str+="<table id='shivaNotesTbl' width='100%'>";							// Table
	str+="<div style='text-align:center;font-size:large;'><img src='shivalogo16.png' style='vertical-align:-2px'><b> SHIVA Notes</b></div><hr>";
	str+="<div style='position:absolute;top:-2px;left:0px;width:100%;text-align:right'><br/>Find: <input type='input' id='shivaNotesSearch' style='height:12px;width:60px;font-size:x-small;padding:0px;margin:0px'/>&nbsp; &nbsp;</div>"
	str+="<tr><td width='38' id='ntc-0' style='"+ts+"'>Type:</td><td><input id='ntx-0' type='input' style='"+ns+"'/></td></tr>";
	str+="</table>";														// End

	if (this.options.vnotes == "true") {									// If notes enabled
		str+="<div style='text-align:right'><br/>________________________________<br/><br/>Pause video while typing?<input type='checkbox' id='notesPause' style='height:11px'>";
		str+="<br/>Save notes: <img src='savedot.gif' id='shivaNotesSave' title='Save notes' width='15' style='vertical-align:bottom'>";
		}
	$('body').append(str+"</div>");											// Add to dom								

	if (this.options.ntext) {												// If notes
		v=this.options.ntext.split("|");									// Divide into lines
		for (i=0;i<v.length;++i) {											// For each line
			if (!v[i])	continue;											// Ignore blanks
			str="<tr><td id='ntc-"+i+"' style='"+ts+"'>Type:</td><td><input id='ntx-"+i+"' type='input' style='"+ns+"'/></td></tr>";
			if (i)															// 1st row is already there
				$("#shivaNotesTbl").append(str);							// Add row
			$("#ntc-"+i).text(v[i].substring(0,5));							// Set timecode	
			$("#ntx-"+i).val(v[i].substr(5));								// Set text	

			$("#ntc-"+i).click(function(e){									// Add click handler
				   	var time=$("#"+e.target.id).text();						// Get time
					if (e.shiftKey)											// If shift key pressed
						$("#"+e.target.id).text(shivaLib.SecondsToTimecode(shivaLib.VideoTime()));	// Set new time
					else
						shivaLib.RunPlayer("scrub",shivaLib.TimecodeToSeconds(time));	// Cue player
					});
			$("#ntc-"+i).dblclick(function(e){								// Add d-click handler
				   	var time=$("#"+e.target.id).text();						// Get time
					shivaLib.RunPlayer("play",time);						// Play
					});
			}
		}
	
	$("#shivaNotesDiv").draggable();										// Make draggable
	$("#ntx-0").focus();													// Focus on first one
	
	$("#shivaNotesSearch").on("keydown", function(e) {						// Handle filter
				var n=$("#shivaNotesTbl tr").length;						// Number of rows
				var patt=new RegExp($("#shivaNotesSearch").val());			// Pattern to find
				for (var i=0;i<n;++i) {										// For each row
					$("#ntx-"+i).css("color","black");						// Clear it
					if (($("#ntx-"+i).val()) && ($("#ntx-"+i).val().match(patt))) // If in there
						$("#ntx-"+i).css("color","red");					// Highlight it
					}
				});			
		
	$("#shivaNotesSave").on("click", function(e) {							// Handle save
				var str="";
				var n=$("#shivaNotesTbl tr").length;						// Number of rows
				for (var i=0;i<n;++i) 										// For each row
					if ($("#ntx-"+i).val())									// If something there
						str+=$("#ntc-"+i).text()+"\t"+$("#ntx-"+i).val()+"\n";	// Add row
	 			 	window.prompt ("To copy your Notes to the clipboard:\nType Ctrl+C or Cmd+C and click  OK button.",str);	// Copy to clipboard
				});			

	

	$("#shivaNotesTbl").on("keydown", function(e) {							// Handle key down
		var cap=false;														// Don't cap
		var rowNum=e.target.id.split("-")[1];								// Get rownum
		if ($("#"+e.target.id).val().length > 80)							// If past limit
			cap=true;														// Let's cap line
		if ((e.keyCode == 13) || (cap)) {									// Enter on capping a line
			var ts="color:#009900;cursor:pointer";							// Timecode style
			var ns="font-size:small;border:none;background:none;width:100%;padding:0px;margin:0px";	// Note style	
			var id=$("#shivaNotesTbl tr").length;							// If of next row
			var str="<tr><td id='ntc-"+id+"' style='"+ts+"'>Type:</td><td><input id='ntx-"+id+"' type='input' style='"+ns+"'/></td></tr>";
			$("#shivaNotesTbl").append(str);								// Add row
			$("#ntx-"+id).focus();											// Focus on new one
			if ($("#notesPause").prop('checked') && !cap) 					// If checked and not capped
				shivaLib.RunPlayer("play",shivaLib.RunPlayer("time"));		// Play
			if (cap)														// If line is capped
				$("#ntc-"+id).text($("#ntc-"+rowNum).text());				// Set to same time
			}
		else if ((e.keyCode == 8) || (e.keyCode == 46)) {					// Delete
			var id="#"+e.target.id;											// Get id
			if ((!$(id).val()) && (id != "#ntx-0")) {						// No more chars left sand not 1st row
				id="ntx-"+(id.substr(5)-1);									// Last row										
				$("#"+id).focus();											// Focus there to prevent page back action
				$("#"+e.target.id).parent().parent().remove();				// Delete
				}			
			}
		else if (!$("#ntx-"+rowNum).val()) {								// A key and nothing in the field yet
			$("#ntc-"+rowNum).text(shivaLib.SecondsToTimecode(shivaLib.RunPlayer("time")));	// Set new time
			if ($("#notesPause").prop('checked')) 							// If checked
				shivaLib.RunPlayer("pause");								// Pause
			
			$("#ntc-"+rowNum).click(function(e){							// Add click handler
				   	var time=$("#"+e.target.id).text();						// Get time
					if (e.shiftKey)											// If shift key pressed
						$("#"+e.target.id).text(shivaLib.SecondsToTimecode(shivaLib.RunPlayer("time")));	// Set new time
					else
						shivaLib.RunPlayer("scrub",shivaLib.TimecodeToSeconds(time));	// Cue player
					});
			
			$("#ntc-"+rowNum).dblclick(function(e){							// Add  d-click handler
				   	var time=$("#"+e.target.id).text();						// Get time
					shivaLib.RunPlayer("play",time);						// Play
					});
			}
		});
};
