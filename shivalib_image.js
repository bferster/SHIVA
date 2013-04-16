///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB IMAGE
///////////////////////////////////////////////////////////////////////////////////////////////


SHIVA_Show.prototype.DrawImage=function() 												//	DRAW IMAGE
{
	var v,o;
	var options=this.options;
	var container=this.container;
	var con="#"+container;
	var _this=this;
	if (!options.chartType)																	// If not type defined (legacy)
		options.chartType="Slideshow";														// Make it slideshow	
	if (options.chartType == "Slideshow") {													// If slideshow or single image
		if (options.dataSourceUrl.indexOf("//docs.google.com") != -1)						// Google doc
 	   		GetSpreadsheetData(options.dataSourceUrl,options.imgHgt,options.showImage,options.showSlide,options.transition,options.width);
  		 else if (options.dataSourceUrl) {
	   		$("#"+this.container).html("<img id='"+this.container+"Img' "+"width='"+options.width+"' src='"+options.dataSourceUrl+"'/>");
			if (options.height)
				$(con).css('height',options.height);
			this.SendReadyMessage(true);											
			}
		else
			this.SendReadyMessage(true);	
		}										
	else if (options.chartType == "Montage") {												// If montage
		var items=new Array();																// Alloc iteems array
	   	for (var key in options) {															// For each item
			if (key.indexOf("item-") != -1) {												// If an item
				o={};																		// Alloc obj
				v=options[key].split(';');													// Split by ;
				for (i=0;i<v.length;++i)													// For each field
					o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
				items.push(o);
				}
			}
		this.items=items;
		$(con).css('height',options.height+"px");											// Set height
		$(con).css('width',options.width+"px");												// Set width
		var act=$("#accord").accordion("option","active");									// Get active
   		if ((act == false) || (isNaN(act)) || (!$("#accord").length))						// If no image or in go.htm
   			act=0;																			// Force to first
		if (!this.imageMob)																	// If fist time
			this.imageMob={ div:this.container+"Img" };										// Init obj
 		this.imageMob.start=0;																// Start fresh
  		this.imageMob.curMob=act;															// Set curMob
 		clearInterval(shivaLib.imageMob.interval);											// Clear timer
		$(con).html("<img id='"+this.container+"Img' "+"' src='"+items[act].url+"' onclick='Draw()'/>");		// Add image
		this.AnimateDiv("full");															// Draw image
		}
		
 	  function GetSpreadsheetData(file, imgHgt, showImage, showSlide, trans, wid) 	{
  		var query=new google.visualization.Query(file);
   		query.send(handleQueryResponse);
 
	    function handleQueryResponse(response) {
		    var a,i,j;
			var data=response.getDataTable();
			var cols=data.getNumberOfColumns();
			var rows=data.getNumberOfRows();
	 		var rowData=new Array();
 			for (i=0;i<rows;++i) {
 				a=new Array()
				for (j=0;j<cols;++j) 
					a.push(data.getValue(i,j));
   				rowData.push(a);
    			}
     		AddImages(rowData,imgHgt,showImage,showSlide,trans,wid);
		 	shivaLib.SendReadyMessage(true);											
  	     }
 	}

   	function AddImages(data, imgHgt, showImage, showSlide, transition, wid)
 	{
		var str="<div id='gallery' class='ad-gallery'>"
		if (showImage == "true")
			str+="<div class='ad-image-wrapper'></div>";
		if (showSlide == "true")
			str+="<div class='ad-controls'></div>";
		str+="<div class='ad-nav'><div class='ad-thumbs'><ul class='ad-thumb-list'>"
		for (var i=1;i<data.length;++i) {
			str+="<li><a href='"+data[i][0]+"'><img height='"+imgHgt+" 'src='"+data[i][0]+"'";
			if (data[i][1])
				str+=" title='"+data[i][1]+"'";		
			if (data[i][2])
				str+=" alt='"+data[i][2]+"'";		
	   		str+=" class='image"+i+"'></a></li>";
	   		}
	    str+="</ul></div></div></div>";
	    $("#"+container).html(str);
	  	$('.ad-gallery').adGallery()[0].settings.effect=transition;
	    $("#gallery").css("background","#ddd");
		$(".ad-gallery").css("width",wid) 
 	}

}  // Closure end


SHIVA_Show.prototype.AnimateDiv=function(mode)									// ANIMATE/POSITION DIV
{
	var o,v;
	var mob=shivaLib.imageMob;														// Point at mob
 	if (mode == "next") {															// Advance to next pic
 		if (mob.curMob < shivaLib.items.length-1)	{								// If not last pic
 			mob.curMob++;															// Inc
			shivaLib.imageMob.start=new Date().getTime();							// Set start
			shivaLib.imageMob.interval=setInterval(shivaLib.AnimateDiv,42);			// Set timer ~24fps
 			}
 		else{																		// All done
			if (!$("#accord").length)												// If in go.htm
				mob.curMob=0;														// Back to the top
			$("#"+shivaLib.container+"PlyBut").show();								// Show play button
			return;																	// Quit
	 		}
	 	}
 	var o=shivaLib.items[mob.curMob];												// Point at current item
	v=o.sp.split(",");	mob.sx=v[0]-0; 	mob.sy=v[1]-0; 	mob.sw=v[2]-0;				// Start pos
  	v=o.ep.split(",");	mob.ex=v[0]-0; 	mob.ey=v[1]-0; 	mob.ew=v[2]-0;				// Emd pos
   	mob.dur=o.dur-0;	mob.fx=o.fx;	mob.url=o.url;	mob.ease=o.ease;			// Misc options
   	mob.title=o.title;													
 	$("#"+shivaLib.container).css("overflow","hidden");								// Extra is hidden
	if (($("#"+shivaLib.container+"PlyBut").length == 0) && mob.dur) {				// If no playbut yet, but animated
		$("#"+shivaLib.container).append("<img id='"+this.container+"PlyBut' src='playbut.gif' style='position:absolute;top:48%;left:47%;padding:2px;padding-left:18px;padding-right:18px' class='propTable' width='18'>");
		$("#"+shivaLib.container+"PlyBut").click( function(){						// Play button click handler
			 $(this).hide();														// Hide it 
			 clearInterval(shivaLib.imageMob.interval);								// Clear timer
			 shivaLib.imageMob.start=new Date().getTime();							// Set start
			 shivaLib.imageMob.interval=setInterval(shivaLib.AnimateDiv,42);		// Set timer ~24fps
			 });	
		}
 	if (mob.url != $("#"+shivaLib.container+"Img").attr('src'))						// If not same url
 	 	$("#"+shivaLib.container+"Img").attr('src',shivaLib.items[mob.curMob].url);	// Set src
	var pct=(new Date().getTime()-mob.start)/(mob.dur*1000);						// Get percentage
	if (mob.start == 0)																// If first time
		pct=0;																		// Start at beginning
	if (pct >= .99) { 																// If done
		clearInterval(shivaLib.imageMob.interval);									// Clear timer
		mob.start=0;																// Stop recursing for some reason
		shivaLib.AnimateDiv("next");												// Get next pic
 		return;
		}
 	if (mob.start == 0)																// If first time
		pct=0;																		// Start at beginning
	if (mob.ease == "both")															// Both
		pct=1.0-((Math.cos(3.1414*pct)+1)/2.0);										// Full cosine curve
	else if (mob.ease == "in")														// Slow in
		pct=1.0-(Math.cos(1.5707*pct));												// 1st quadrant of cosine curve
	else if (mob.ease == "out")														// Slow out
		pct=1.0-(Math.cos(1.5707+(1.5707*pct))+1.0);								// 2nd quadrant of cosine curve
	var o={ position:"relative"};													// Position mode
	o.left=(mob.sx+((mob.ex-mob.sx)*pct))/100;										// Calc left
	o.top=(mob.sy+((mob.ey-mob.sy)*pct))/100;										// Calc top
	o.width=1000000/((mob.sw+((mob.ew-mob.sw)*pct)));								// Calc width
	o.opacity=(mob.sa+((mob.ea-mob.sa*pct))/100);									// Calc alpha
	o.left=(-o.width*(o.left/100))+"%";												// Scale left
	o.top=(-o.width*(o.top/100))+"%";												// Scale top
	o.width+="%"																	// Add %
	if ((mode == "full") &&	($("#accord").length))									// If full image
  		o.top=o.left="0%",o.width="100%",o.opacity=1;								// Ignore settings	
	$("#"+mob.div).css(o);															// Set css 
}

                      