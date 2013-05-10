//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 
//  SHIVALIB POSTER  
//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 

SHIVA_Show.prototype.DrawPoster=function() 											//	DRAW POSTER
{
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
	var str="<div id='posterDiv' style='position:absolute;left:"+options.left+"px;top:"+options.top+"px'> Poster<p style='text-align:right'>right</p> </div>";
	this.posterScale=options.scale;														// Init scale
	$(con).html(str);
	$(con).css({"width":options.width+"px","height":options.height+"px"});				// Resize container	
	$(con).css({border:"1px solid",overflow:"hidden"});									// Put border and hode overflow on container
	$("#posterDiv").width(options.width*this.posterScale);								// Set poster width
	$("#posterDiv").height(options.height*this.posterScale);							// Set poster height
	$("#posterDiv").css("background-color","#"+options.backCol);						// Back color
	$("#posterDiv").draggable({ 
								drag:function(event,ui) {shivaLib.DrawPosterOverview() }});		// Make it draggable 
	this.DrawPosterOverview();														// Draw overview, if enabled
	this.SendReadyMessage(true);											
}

SHIVA_Show.prototype.DrawPosterOverview=function() 								//	DRAW POSTER OVERVIEW
{
	var options=this.options;
	var w=options.width/6;																// Width of frame
	var h=w*options.height/options.width;												// Height based on aspect
	if (($("#posterOverDiv").length == 0) && (options.overview == "true"))  {			// If not initted yet and showing
		var css = { position:"absolute",												// Frame factors
					left:options.width-w+"px",
					width:w+"px",
					height:h+"px",
					top:options.height-h+"px",
					border:"1px dashed"
					};
		
		var str="<div id='posterOverDiv'></div>";										// Frame box div
		$("#"+this.container).append(str);												// Add to container
		$("#posterOverDiv").css(css);													// Set overview frame
		$("#posterDiv").css("background-color","#"+options.backCol);					// Back col
		var css = { position:"absolute",												// Box factors
					width:w/this.posterScale+"px",
					height:h/this.posterScale+"px",
					opacity:.3
					};
		var str="<div id='posterOverBox'></div>";										// Control box div
		$("#posterOverDiv").html(str);													// Add to overview frame
		$("#posterOverBox").css(css);													// Set overview frame
		$("#posterOverBox").css("background-color","#666");								// Back col
		$("#posterOverBox").draggable({ containment:"parent", 
							drag:function(event,ui) {									// Make it draggable 
								var w=$("#posterOverDiv").width();						// Overview width
								var pw=$("#posterDiv").width();							// Poster width
								var h=$("#posterOverDiv").height();						// Overview hgt
								var ph=$("#posterDiv").height();						// Poster hgt
								var x=ui.position.left/w*pw;							// Calc left
								var y=ui.position.top/h*ph;								// Calc top
								$("#propInput1").val(x);								// Save pos
								$("#propInput0").val(y);								// Save pos
								$("#posterDiv").css({"left":-x+"px","top":-y+"px"});	// Position poster	
								}
							 });		
		}
	$("#posterOverBox").resizable({ containment:"parent"}); 
	var x=options.left=$("#posterDiv").css("left").replace(/px/,"");					// Get x pos
	x=-x/options.width*w/this.posterScale;												// Scale to fit
	var y=options.top=$("#posterDiv").css("top").replace(/px/,"");						// Get y pos
	y=-y/options.height*h/this.posterScale;												// Scale to fit
	$("#posterOverBox").css({"left":x+"px","top":y+"px"});								// Position control box		
	$("#propInput0").val(options.top)													// Save pos
	$("#propInput1").val(options.left)													// Save pos
}