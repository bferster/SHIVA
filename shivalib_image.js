///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB IMAGE
///////////////////////////////////////////////////////////////////////////////////////////////


SHIVA_Show.prototype.DrawImage=function() 												//	DRAW IMAGE
{
	var v;
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
		$(con).css('height',options.height+"px");											// Set height
		$(con).css('width',options.width+"px");												// Set width
   		this.imageMob={sx:0,ex:1,sy:00,ey:0,sw:100,ew:100,sa:1,ea:1,easeIn:1,easeOut:1,dur:4,div:this.container+"Img",start:0 };
		var o=items[0];
		v=o.sp.split(";");	this.imageMob.sx=v[0]-0; 	this.imageMob.sy=v[1]-0; 	this.imageMob.sw=v[2]-0;
  		v=o.ep.split(";");	this.imageMob.ex=v[0]-0; 	this.imageMob.ey=v[1]-0; 	this.imageMob.ew=v[2]-0;
   		this.imageMob.dur=o.dur;	
   		this.imageMob.title=o.title;
   		this.imageMob.fx=o.fx;			
   		this.imageMob.url=o.url;			
   		$(con).html("<img id='"+this.container+"Img' "+"' src='"+o.url+"'/>");
		this.AnimateDiv();
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


SHIVA_Show.prototype.AnimateDiv=function()										// ANIMATE/POSITION DIV
{
	var mob=shivaLib.imageMob;														// Point at mob
	$("#"+shivaLib.container).css("overflow","hidden");								// Extra is hidden
	if (($("#"+shivaLib.container+"PlyBut").length == 0) && mob.dur) {				// If no playbut yet, but animated
		$("#"+shivaLib.container).append("<img id='"+this.container+"PlyBut' src='playbut.gif' style='position:absolute;top:48%;left:47%;padding:2px;padding-left:18px;padding-right:18px' class='propTable' width='18'>");
		$("#"+shivaLib.container+"PlyBut").click( function(){						// Play button click handler
			 $(this).hide();														// Hide it 
			 shivaLib.imageMob.start=new Date().getTime();							// Set start
			 shivaLib.imageMob.interval=setInterval(shivaLib.AnimateDiv,42);		// Set timer ~24fps
			 });	
		}
	
	var pct=(new Date().getTime()-mob.start)/(mob.dur*1000);						// Get percentage
	if (mob.start == 0)																// If first time
		pct=0;																		// Start at beginning
	if (pct >= .99) { 																// If done
		$("#"+shivaLib.container+"PlyBut").show();									// Show play button
		clearInterval(shivaLib.imageMob.interval);									// Clear timer
		}
	if (mob.easeIn && mob.easeOut)													// Both
		pct=1.0-((Math.cos(3.1414*pct)+1)/2.0);										// Full cosine curve
	else if (easeIn)																// Slow in
		pct=1.0-(Math.cos(1.5707*pct));												// 1st quadrant of cosine curve
	else if (easeOut)																// Slow out
		pct=1.0-(Math.cos(1.5707+(1.5707*pct))+1.0);								// 2nd quadrant of cosine curve
	var o={ position:"relative"};													// Posioton mode
	
	o.left=(mob.sx+((mob.ex-mob.sx)*pct))/100;										// Calc left
	o.top=(mob.sy+((mob.ey-mob.sy)*pct))/100;										// Calc top
	o.width=1000000/((mob.sw+((mob.ew-mob.sw)*pct)));								// Calc width
	o.opacity=(mob.sa+((mob.ea-mob.sa*pct))/100);									// Calc alpha
	o.left=(-o.width*(o.left/100))+"%";												// Scale left
	o.top=(-o.width*(o.top/100))+"%";												// Scale top
	o.width+="%"																	// Add %
	$("#"+mob.div).css(o);															// Set css 
}

                      