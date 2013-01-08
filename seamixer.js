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
	// Do inits
	window.addEventListener("message",$.proxy(this.ShivaEventHandler,this),false);// Add event listener
}

seaMixer.prototype.Stop=function() 									//	STOP
{
	window.removeEventListener("message",$.proxy(this.ShivaEventHandler,this));	 // Remove event listener
}

seaMixer.prototype.AddOnDo=function(on, act, p1, p2, p3, p4) 		//	ADD NEW ONDO
{
}

seaMixer.prototype.RunOnDo=function(act, p1, p2, p3, p4) 			//	RUN AN INIT ONDO
{
}

seaMixer.prototype.Query=function(src, dst, query) 					//	QUERY
{
}

seaMixer.prototype.ShivaEventHandler=function(e) 					//	CATCH SHIVA EVENTS
{
	trace(e.data);
}

seaMixer.prototype.SendMessage=function(div, msg) 					//	SEND HTML5 MESSAGE TO DIV
{
	div.postMessage(msg,"*");											// Send message to div
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   QUERY  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SHIVA_Query() 												// CONSTRUCTOR
{
}