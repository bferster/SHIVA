//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 
//  SHIVALIB POSTER  
//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 

SHIVA_Show.prototype.DrawPoster=function(mode) 										//	DRAW POSTER
{
	var str;
	var options=this.options;
	var container=this.container;
	var con="#"+container;
	var items=new Array();
 	this.items=items;
	var _this=this;
    for (var key in options) {
		if (key.indexOf("item-") != -1) {
			var o=new Object;
			var v=options[key].split(';');
			for (i=0;i<v.length;++i) {
				v[i]=v[i].replace(/http:/g,"http`");
				o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
				}
			items.push(o);
			}
		}
	var str="<div id='posterDiv' style='position:absolute;left:0px;top:0px'></div>";	// Make poster div
	if (!this.posterScale)																// If not already set
		this.posterScale=2;																// Init scale to start
	$(con).html(str);																	// Add div
	$(con).css({"width":options.width+"px","height":options.height+"px"});				// Resize container	
	$(con).css({border:"1px solid",overflow:"hidden",margin:"0px",padding:"0px"});		// Put border and hode overflow on container
	$("#posterDiv").width(options.width*this.posterScale);								// Set poster width
	$("#posterDiv").height(options.height*this.posterScale);							// Set poster height
	$("#posterDiv").css("background-color","#"+options.backCol);						// Back color
	var l=$(con).css("left").replace(/px/,"")-0;										// Left boundary
	var r=l-0+(options.width-(options.width*this.posterScale));							// Right boundary
	var t=$(con).css("top").replace(/px/,"")-0;											// Top boundary
	var b=t-0+(options.height-(options.height*this.posterScale));						// Bottom boundary
	$("#posterDiv").draggable({ containment: [r,b,l,t],									// Containment 
								drag:function(event,ui) {								// Make it draggable
								shivaLib.DrawPosterOverview();							// Reflect pos in overview
								}});	 
	if (options.dataSourceUrl) {														// If a back img spec'd
		str="<img src='"+options.dataSourceUrl+"' ";									// Name
		str+="height='"+options.height*this.posterScale+"' ";							// Height
		str+="width='"+options.width*this.posterScale+"' >";							// Width
		$("#posterDiv").append(str);													// Add image to poster
		}	

	if (typeof(DrawPosterGrid) == "function")											// If not in embedded
		DrawPosterGrid();																// Draw grid if enabled
	this.DrawPosterOverview();															// Draw overview, if enabled
	this.SendReadyMessage(true);														// Send ready message
}

SHIVA_Show.prototype.DrawPosterOverview=function() 									//	DRAW POSTER OVERVIEW
{
	var str;
	var options=this.options;
	var w=options.width/4;																// Width of frame
	var h=w*options.height/options.width;												// Height based on aspect
	if (($("#posterOverDiv").length == 0) && (options.overview == "true"))  {			// If not initted yet and showing
		var css = { position:"absolute",												// Frame factors
					left:options.width-w+"px",
					width:w+"px",
					height:h+"px",
					top:options.height-h+"px",
					border:"1px solid",
					"background-color":"#"+options.backCol
					};
		
		str="<div id='posterOverDiv'></div>";											// Frame box div
		$("#"+this.container).append(str);												// Add to container
		$("#posterOverDiv").css(css);													// Set overview frame
		if (options.dataSourceUrl) {													// If a back img spec'd
			str="<img src='"+options.dataSourceUrl+"' ";								// Name
			str+="height='"+h+"' ";														// Height
			str+="width='"+w+"' >";														// Width
			$("#posterOverDiv").append(str);											// Add image to poster
			}	
		if (typeof(DrawPosterOverviewGrid) == "function")								// If not embedded
			DrawPosterOverviewGrid();													// Draw grid in overview if enabled
		var css = { position:"absolute",												// Box factors
					width:w/this.posterScale+"px",
					height:h/this.posterScale+"px",
					border:"1px solid #666",
					"background-color":"rgba(102,102,102,0.3)"
					};
		str+="<div id='posterOverBox'></div>";											// Control box div
		$("#posterOverDiv").append(str);												// Add control box to overview frame
		$("#posterOverBox").css(css);													// Set overview frame
		var l=$("#posterOverDiv").offset().left;										// Left boundary
		var t=$("#posterOverDiv").offset().top;											// Left boundary
		var r=(l+w)-(w/this.posterScale)												// Right boundary
		var b=(t+h)-(h/this.posterScale)												// Bottom boundary
		$("#posterOverBox").draggable({ containment:[l,t,r,b], 							// Make it draggable 
							drag:function(event,ui) {									// Handle drag						
								var w=$("#posterOverDiv").width();						// Overview width
								var pw=$("#posterDiv").width();							// Poster width
								var h=$("#posterOverDiv").height();						// Overview hgt
								var ph=$("#posterDiv").height();						// Poster hgt
								var x=Math.max(0,ui.position.left/w*pw);				// Calc left
								var y=Math.max(0,ui.position.top/h*ph);					// Calc top
								$("#posterDiv").css({"left":-x+"px","top":-y+"px"});	// Position poster	
								}
							 });		
		}
	$("#posterOverBox").resizable({ containment:"parent",								// Resizable
									aspectRatio:true,
									minHeight:12,
									stop:function(event,ui) {							// Om resize stop
										var w=$("#posterOverDiv").width();				// Overview width
										shivaLib.posterScale=Math.max(w/ui.size.width,1); // Get new scale, cap at 100%
										shivaLib.DrawPoster();							// Redraw
										}
						}); 
	var x=options.left=$("#posterDiv").css("left").replace(/px/,"");					// Get x pos
	x=-x/options.width*w/this.posterScale;												// Scale to fit
	var y=options.top=$("#posterDiv").css("top").replace(/px/,"");						// Get y pos
	y=-y/options.height*h/this.posterScale;												// Scale to fit
	$("#posterOverBox").css({"left":x+"px","top":y+"px"});								// Position control box		
}