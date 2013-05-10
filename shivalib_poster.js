//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 
//  SHIVALIB POSTER  
//  -///////////////////////////////////////////////////////////////////////////////////////////////////// 

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
	this.SendReadyMessage(true);											
}
