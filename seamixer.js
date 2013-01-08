/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   SEAMIXER  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function seaMixer() 												// CONSTRUCTOR
{
	this.ondos=new Array();												// Hold ondo statements
	this.q=new SHIVA_Query();											// Alloc query library
}

seaMixer.prototype.Run=function(ondoList) 							//	RUN
{
	window.addEventListener("message",$.proxy(this.ShivaEventHandler,this),false);// Add event listener
	this.ondos=[];														// Clear queue
	for (var i=0;i<ondoList.length;++i)									// For each one
		this.AddOnDo(ondoList[i]);										// Add to list and run if an init
}

seaMixer.prototype.AddOnDo=function(ondo) 							//	ADD NEW ONDO
{
	this.ondos.push(ondo);												// Add to array
	this.RunOnDo(ondo);													// Run it
}

seaMixer.prototype.RunOnDo=function(ondo) 							//	RUN AN INIT ONDO
{
	var str;
	if (ondo.on != "init")												// If not an init
		return;															// Quit
	switch(ondo.do) {													// Route on type
		case "load": 													// Load an iframe
			str=ondo.src;												// Set url
			if (ondo.src.indexOf("e=") == 0)							// An eStore
				str="//www.viseyes.org/shiva/go.htm?"+ondo.src;			// Make url
			else if (ondo.src.indexOf("m=") == 0)						// A Drupal manager
				str="//shiva.shanti.virginia.edu/go.htm?m=//shiva.virginia.edu/data/json/"+ondo.src.substr(2);	// Make url
			else if (ondo.src.indexOf("E=") == 0)						// eStore test
				str="//127.0.0.1:8020/SHIVA/go.htm?"+ondo.src;			// Make url
			else if (ondo.src.indexOf("M=") == 0)						// Drupal test
				str="//127.0.0.1:8020/SHIVA/go.htm?m=//shiva.virginia.edu/data/json/"+ondo.src.substr(2);	// Make url
			$("#"+ondo.div).attr("src",str);							// Set src
			break;
		case "data": 													// Load data
			break;
		case "fill": 													// Fill an iframe
			break;
		case "act": 													// Run an action
			this.SendMessage(ondo.id,ondo.type+"|"+ondo.p1);			// Send message to iframe
			break;
		case "call": 													// Run a callback
			break;
		case "query": 													// Run a query
			break;
		}
}

seaMixer.prototype.Stop=function() 									//	STOP
{
	window.removeEventListener("message",$.proxy(this.ShivaEventHandler,this));	 // Remove event listener
}

seaMixer.prototype.Query=function(src, dst, query) 					//	QUERY
{
}

seaMixer.prototype.ShivaEventHandler=function(e) 					//	CATCH SHIVA EVENTS
{
	trace(e.data);
}

seaMixer.prototype.SendMessage=function(con, msg) 					//	SEND HTML5 MESSAGE TO DIV
{
	var win=document.getElementById(con).contentWindow;					// Point at iframe	
	win.postMessage(msg,"*");											// Send message to container
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   QUERY  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SHIVA_Query() 												// CONSTRUCTOR
{
}