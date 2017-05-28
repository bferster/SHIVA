
function SHIVA_Show(container,options,editMode)
{this.drupalMan=false;this.inGo=false;this.options=null;this.map=null;this.player=null;this.timeLine=null;this.container=container;this.editMode=editMode;this.items=null;this.overlay=null;this.g=null;this.qe=null;this.ev=null;this.jit=null;this.cvs=null;this.group=null;this.msgAction=new Array();this.ready=false;this.actionCache=new Array();if(options)
this.Draw(options);}
SHIVA_Show.prototype.Draw=function(ops)
{if(!ops)
return;_this=this;this.options=ops;this.LoadJSLib("Visualization",$.proxy(function(){_this.LoadJSLib(ops.shivaGroup,$.proxy(function(){_this.DrawElement(ops)},_this))},_this));}
SHIVA_Show.prototype.DrawElement=function(ops)
{var _this=this;this.group=group=ops.shivaGroup;if(group=='Visualization')
this.DrawChart();else if(group=='Map')
this.DrawMap();else if(group=='Timeline')
this.DrawTimeline();else if(group=='Timeglider')
this.DrawTimeGlider();else if(group=='Control')
this.DrawControl();else if(group=='Video')
this.DrawVideo();else if(group=='Image')
this.DrawImage();else if(group=='Subway')
this.DrawSubway();else if(group=='Data')
this.DrawChart();else if(group=='Network')
this.DrawNetwork();else if(group=='Earth')
this.DrawEarth();else if(group=='Draw'){if(ops.width)$("#"+this.container).css("width",ops.width+"px");if(ops.height)$("#"+this.container).css("height",ops.height+"px");this.DrawOverlay();this.SendReadyMessage(true);}
else if(group=='Webpage')
this.DrawWebpage();else if(group=='HTML')
this.DrawHTML();else if(group=='WordCloud')
this.DrawWordCloud();else if(group=='Poster')
this.DrawPoster();else if(group=='Graph')
this.DrawGraph();if(ops["draw-1"])
this.AddOverlay();var ud=ops["ud"];if(ud=="true")ud=true;else if(ud=="false")ud=false;if((ud)&&(this.inGo)){var h=$("#"+this.container).css("height").replace(/px/g,"");var str="<img  id='shivaAnnotateBut' src='annotate.gif' style='position:absolute";str+=";top:"+(h-0+12)+"px'>";$("body").append(str);$("#shivaAnnotateBut").click(function(){_this.Annotate();});$("#shivaAnnotateBut").css('pointer-events','auto');}}
var jslibLoading="";SHIVA_Show.prototype.LoadJSLib=function(which,callback)
{var i,obj,lib="";switch(which){case"Timeline":obj="Timeline.DefaultEventSource";lib="//api.simile-widgets.org/timeline/2.3.1/timeline-api.js?bundle=true";break;case"Visualization":if(!google.charts.versionSpecific){google.charts.load('current',{packages:['corechart']});google.charts.setOnLoadCallback(callback);return;}
break;case"Timeglider":obj="timeglider";lib="timeglider-all.js";break;case"Image":obj="jQuery.prototype.adGallery";lib="jquery.ad-gallery.min.js";break;case"Network":obj="$jit.id";lib="jit-yc.js";break;case"Graph":obj="d3.select";lib="d3.v3.min.js";break;case"Map":var key="AIzaSyAVjuoRt0060MnK_5_C-xenBkgUaxVBEug";if(window.location.hostname.match("virginia.edu")||window.location.hostname.match("visuals.dd")){key="AIzaSyDO7EDm14EXi44pLkarnB8jjqI90LSa61g";}
obj="google.maps.LatLng";lib="//maps.googleapis.com/maps/api/js?callback=shivaJSLoaded&key="+key;if(jslibLoading==lib)
return;break;case"WordCloud":obj="d3.layout.cloud";lib="d3_cloud_combined.js";break;}
if(lib){var v=obj.split(".");var n=v.length;var o=$(window)[0];for(i=0;i<n;++i)
if(!(o=o[v[i]]))
break;if(o&&(i==n)){callback();return;}
var head=document.getElementsByTagName('head')[0];var script=document.createElement('script');script.type="text/javascript";script.src=lib;jslibLoading=lib;script.onload=shivaJSLoaded(obj,callback);head.appendChild(script);}
else
callback();}
function shivaJSLoaded(obj,callback)
{var i;if(!obj)
return;var v=obj.split(".");var n=v.length;var o=$(window)[0];for(i=0;i<n;++i)
if(!(o=o[v[i]]))
break;if(o&&(i==n)){jslibLoading="";callback();}
else
setTimeout(function(){shivaJSLoaded(obj,callback);},50);}
SHIVA_Show.prototype.SendReadyMessage=function(mode)
{var i;if(shivaLib.drupalMan)
window.parent.postMessage("ShivaReady="+mode.toString(),"*");var asp=$("#"+shivaLib.container).height()/$("#"+shivaLib.container).width();if(this.options.height&&this.options.width)
asp=this.options.height/this.options.width;shivaLib.SendShivaMessage("ShivaChart=ready",Math.round(asp*1000));shivaLib.ready=true;for(i=0;i<shivaLib.actionCache.length;++i)
shivaLib.RunActions(shivaLib.actionCache[i]);shivaLib.actionCache=[];}
SHIVA_Show.prototype.SendShivaMessage=function(src,msg)
{var id=window.name;if(!id)
id="posterFrame-"+(""+window.location.search.match(/&if=[0-9A-z]+/)).substr(4);var str=src+"|"+id;if(msg)
str+="|"+msg;if(window.parent)
window.parent.postMessage(str,"*");else
window.postMessage(str,"*");}
SHIVA_Show.prototype.ShivaEventHandler=function(e)
{if(e=="init"){if(window.addEventListener)
window.addEventListener("message",shivaLib.ShivaEventHandler,false);else
window.attachEvent("message",shivaLib.ShivaEventHandler);return;}
if(!e.data)
return;for(var i=0;i<shivaLib.msgAction.length;++i)
if(e.data.indexOf(shivaLib.msgAction[i].id)!=-1)
shivaLib.msgAction[i].Do(i);if(!shivaLib.options)
return;if(e.data.indexOf("ShivaAct")!=-1){if(!shivaLib.ready)
shivaLib.actionCache.push(e.data);else
shivaLib.RunActions(e.data);}}
SHIVA_Show.prototype.RunActions=function(data)
{var group=shivaLib.options.shivaGroup;if(group=="Map")
shivaLib.MapActions(data);else if(group=="Video")
shivaLib.VideoActions(data);else if(group=="Timeglider")
shivaLib.TimeActions(data);else if(group=="Visualization")
shivaLib.ChartActions(data);else if(group=="Image")
shivaLib.ImageActions(data);else if(group=="Network")
shivaLib.NetworkActions(data);else if(group=="WordCloud")
shivaLib.WordActions(data);else if(group=="Control")
shivaLib.ControlActions(data);else if(group=="HTML")
shivaLib.HTMLActions(data);else if(group=="Graph")
shivaLib.GraphActions(data);}
SHIVA_Show.prototype.AddOverlay=function(data)
{var key;this.overlay=new Array();this.DrawOverlay();if(data){var v=data.split("&draw-");for(var i=0;i<v.length;++i)
this.AddOverlaySeg(v[i].replace(/^[0-9]+=/,""),true);}
else{for(key in this.options){if(key.match(/draw-/g))
this.AddOverlaySeg(this.options[key],false);}}
$("#shivaDrawDiv").css('pointer-events','none');this.DrawOverlay();}
SHIVA_Show.prototype.AddOverlaySeg=function(seg,init)
{var i,key;if(!seg)
return;var o=new Object();if(!this.overlay)
this.overlay=new Array();if(!this.dr&&init){this.Draw({shivaGroup:"Draw"});this.dr=new SHIVA_Draw(this.container,true);}
var v=seg.split(';');for(i=0;i<v.length;++i){key=v[i].split(':')[0];o[key]=v[i].split(':')[1].replace(/\~/g,"#").replace(/\|/g,"\n").replace(/\`/g,":");if(o[key]=="true")o[key]=true;if(o[key]=="false")o[key]=false;}
if(o.x)o.x=o.x.split(",");if(o.y)o.y=o.y.split(",");this.overlay.push(o);}
SHIVA_Show.prototype.DrawOverlay=function()
{var o,i,col,ecol,ewid,a,cur,ctx,str,now,s=0,e=36000;var con="#"+this.container;if(!this.g)
this.g=new SHIVA_Graphics();var l=$(con).css("left");var t=$(con).css("top");if(l=="auto")l="0px";if(t=="auto")t="0px";i=$(con).css("height").replace(/px/g,"");if(this.player)
i=Math.max(0,i-=40);if(!$("#shivaDrawCanvas").length){if(!$("#shivaDrawDiv").length){str="<div id='shivaDrawDiv' style='position:absolute";str+=";width:"+$(con).css("width");str+=";top:"+t;str+=";left:"+l;str+=";height:"+i+"px'/>";$('body').append(str);}
this.g.CreateCanvas("shivaDrawCanvas","shivaDrawDiv");}
$("#shivaDrawCanvas").attr("width",$(con).css("width"));$("#shivaDrawCanvas").attr("height",i+"px");$("#shivaDrawDiv").css("left",l);$("#shivaDrawDiv").css("top",t);$("#shivaDrawDiv").css("width",$(con).css("width"));$("#shivaDrawDiv").css("height",i+"px");ctx=$("#shivaDrawCanvas")[0].getContext('2d');ctx.clearRect(0,0,1600,1600);if(navigator.userAgent.match(/\.NET CLR/))
$("#shivaDrawDiv").css("z-index",2);else
$("#shivaDrawDiv").css("z-index",2000);if($("#shivaDrawPaletteDiv").length)
$("#shivaDrawDiv").css('pointer-events','auto');else
$("#shivaDrawDiv").css('pointer-events','none');if(!this.overlay)
return;this.DrawIdeaLinks(false);for(i=0;i<this.overlay.length;++i){o=this.overlay[i];$("#shtx"+i).remove();$("#shim"+i).remove();$("#shivaIdea"+i).remove();if(o.type==5){var dd="#shivaIdea"+i;str="<div id='"+dd.substr(1)+"'";str+="style='position:absolute;padding:8px;font-family:sans-serif;text-align:center;";str+="margin:0px;border:1px solid "+o.ideaEdgeCol+";background-color:"+o.ideaBackCol+";";str+="left:"+o.ideaLeft+"px;top:"+o.ideaTop+"px;'>";str+="</div>";$("#shivaDrawDiv").append(str);str="<textarea";if((shivaLib.dr)&&(shivaLib.dr.curTool!=6))
str+=" readonly='readonly'";str+=" id='shtx"+i+"' onchange='shivaLib.dr.SetShivaText(this.value,"+i+")' "
str+="style='overflow:none;vertical-align:middle;";if((!shivaLib.dr)||((shivaLib.dr)&&(shivaLib.dr.curTool!=6)))
str+="resize:none;";str+="height:"+o.ideaHgt+"px;width:"+o.ideaWid+"px;color:"+o.ideaTextCol+";"
if(o.ideaBold)
str+="font-weight:bold;";str+="background:transparent;border:none;margin:0px;padding:0px;font-family:sans-serif;text-align:center;'/>";$(dd).append(str);$("#shtx"+i).html(o.text);if(o.ideaShape=="Round box")
$(dd).css("border-radius","8px");else if(o.ideaShape=="Oval")
$(dd).css("border-radius",$(dd).css("height"));else if(o.ideaShape=="Circle"){var w=$(dd).width();$(dd).css("border-radius",(w/2+16)+"px");$(dd).css("height",w+"px");}
if(o.ideaGradient)
$(dd).css({background:"-webkit-linear-gradient(top, #f0f0f0 0%,"+o.ideaBackCol+" 100%)",background:"linear-gradient(#f0f0f0,"+o.ideaBackCol+")"});if((shivaLib.dr)&&(shivaLib.dr.curTool==6)){$("#shtx"+i).resizable({stop:function(event,ui){var num=ui.originalElement[0].id.substr(4);shivaLib.dr.segs[num].ideaWid=ui.size.width-4;shivaLib.dr.segs[num].ideaHgt=ui.size.height-4;},handles:"se"});$(dd).draggable({drag:function(event,ui){var num=this.id.substr(9);var dx=ui.position.left-shivaLib.dr.segs[num].ideaLeft;var dy=ui.position.top-shivaLib.dr.segs[num].ideaTop;shivaLib.dr.segs[num].ideaLeft=ui.position.left;shivaLib.dr.segs[num].ideaTop=ui.position.top;shivaLib.dr.segs[num].ideaText=$("#"+this.id).val();shivaLib.dr.MoveIdeaChildren(num,dx,dy);shivaLib.DrawIdeaLinks(true);},containment:"parent",stop:function(event,ui){shivaLib.dr.DrawOverlay();}});$(dd).droppable({drop:function(event,ui){var from=ui.draggable.context.id.substr(9);var to=event.target.id.substr(9);shivaLib.dr.IdeaDrop(from,to);}});}
continue;}
cur=o.curve;col=o.color;ecol=o.edgeColor;ewid=Math.floor(o.edgeWidth/10)+1;a=Number(o.alpha)/100;if(o.edgeColor==-1)ewid=0;if((o.x)&&(o.x.length<2))
continue;if(o.type==1)
this.g.DrawCircle(ctx,o.color,a,o.x[0],o.y[0],Math.abs(o.x[0]-o.x[1]),ecol,ewid);else if(o.type==2){if(o.curve)
this.g.DrawRoundBar(ctx,o.color,a,o.x[0],o.y[0],o.x[1],o.y[1],12,ecol,ewid);else
this.g.DrawBar(ctx,o.color,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);}
else if(o.type==3){if(o.curve)
this.g.DrawRoundBar(ctx,o.boxColor,a,o.x[0],o.y[0],o.x[1],o.y[1],12,ecol,ewid);else
this.g.DrawBar(ctx,o.boxColor,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);str="<text";if($("#shivaDrawPaletteDiv").length)
str+="area rows='8'";str+=" id='shtx"+i+"' ";str+="style='position:absolute;background:transparent;border:none;margin:8px;font-family:sans-serif;overflow:none;";str+="left:"+Math.min(o.x[0],o.x[1])+"px;top:"+Math.min(o.y[0],o.y[1])+"px;opacity:"+(o.alpha/100)+";";str+="width:"+(Math.abs(o.x[1]-o.x[0])-18)+"px'/>";$("#shivaDrawDiv").append(str);$("#shtx"+i).css("color",o.textColor).css("text-align",o.textAlign.toLowerCase());$("#shtx"+i).css("font-size",Number(o.textSize/2)+10);$("#shtx"+i).html(o.text);$("#shtx"+i).bind("change input propertychange",function(e){var i=e.target.id.substr(4);var val=$("#shtx"+i).val();shivaLib.dr.SetShivaText(val,i);});}
else if(o.type==4){this.g.DrawBar(ctx,-1,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);str="<div id='shim"+i+"' style='position:absolute;background:transparent;opacity:"+(o.alpha/100)+";";w=Math.abs(o.x[1]-o.x[0]);h=Math.abs(o.y[1]-o.y[0]);str+="left:"+Math.min(o.x[0],o.x[1])+"px;top:"+Math.min(o.y[0],o.y[1])+"px;";str+="width:"+(w-16)+"px;height:"+h+"px'>";str+="<img id=shimi"+i+" src='"+o.imageURL+"' width='"+w+"'/>";$("#shivaDrawDiv").append(str);}
else if((o.x)&&(o.x.length==2)&&(!o.arrow))
this.g.DrawPolygon(ctx,-1,a,o.x,o.y,ecol,Math.max(ewid,2),false);else if((o.x)&&(!o.arrow))
this.g.DrawPolygon(ctx,o.color,a,o.x,o.y,ecol,ewid,(cur==true));if((o.x)&&(o.type==0)&&(o.arrow)){var xx=[],yy=[];var n=o.x.length-1;var aa=Math.atan2(o.y[n]-o.y[n-1],o.x[n]-o.x[n-1]);var h=Math.max(12,ewid*4);xx[0]=o.x[n]-h*Math.cos(aa-Math.PI/6),yy[0]=o.y[n]-h*Math.sin(aa-Math.PI/6);xx[1]=o.x[n];yy[1]=o.y[n];xx[2]=o.x[n]-h*Math.cos(aa+Math.PI/6),yy[2]=o.y[n]-h*Math.sin(aa+Math.PI/6);this.g.DrawPolygon(ctx,ecol,a,xx,yy,ecol,0,false);o.x[n]=((xx[2]-xx[0])/2)+xx[0];o.y[n]=((yy[2]-yy[0])/2)+yy[0];if(o.x.length==2)
this.g.DrawPolygon(ctx,-1,a,o.x,o.y,ecol,Math.max(ewid,2),false);else
this.g.DrawPolygon(ctx,o.color,a,o.x,o.y,ecol,ewid,(cur==true));o.x[n]=xx[1];o.y[n]=yy[1];}}
if((shivaLib.dr)&&(shivaLib.dr.curTool==6))
$.proxy(shivaLib.dr.HighlightIdea(),shivaLib.dr);}
SHIVA_Show.prototype.DrawIdeaLinks=function(clear)
{var i,o,fx,fy,tx,ty;var ctx=$("#shivaDrawCanvas")[0].getContext('2d');if(clear)
ctx.clearRect(0,0,1600,1600);for(i=0;i<this.overlay.length;++i){o=this.overlay[i];if((o.type!=5)||(o.ideaParent==-1))
continue;dleftToRight=leftToRight=true;dir2=dir=2;tx=o.ideaLeft-0+(o.ideaWid/2+8);ty=o.ideaTop-0+(o.ideaHgt/2)+12;o=this.overlay[o.ideaParent];fx=o.ideaLeft-0+(o.ideaWid/2+8);fy=o.ideaTop-0+(o.ideaHgt/2+12);if(tx<fx)
dleftToRight=leftToRight=false;var x=[fx,tx];var y=[fy,ty];this.g.DrawPolygon(ctx,-1,.75,x,y,"#666",1,true);}}
SHIVA_Show.prototype.Resize=function(wid)
{if(this.options){if(this.options.width){if(this.options.width!=wid){var asp=1.0;if(this.options.height)
asp=this.options.height/this.options.width;this.options.width=wid;this.options.height=wid*asp;this.DrawElement(this.options);return true;}}}
return false;}
SHIVA_Show.prototype.SetLayer=function(num,mode,type)
{var i;var group=this.options.shivaGroup;if(this.items){if(type=="GoTo"){for(i=0;i<this.items.length;++i){if(this.items[i].layerType=="GoTo")
this.items[i].visible="false";}}
if(this.items[num])
this.items[num].visible=mode.toString();}
if(group=="Map")
this.DrawMapOverlays();else if(group=="Earth")
this.DrawEarthOverlays();else if(group=="Subway")
this.DrawSubway();else if(group=="Timeline")
this.DrawTimeline();else if(group=="Poster")
this.GoToPosterPane(num);}
SHIVA_Show.prototype.FillElement=function(table,query)
{var group=this.options.shivaGroup;if(group=="Visualization"){this.map.setDataSourceUrl(table);if((query)&&(query!="NO CONDITIONS SET")){var v=query.split(" ");for(i=0;i<v.length;++i){if(v[i]=="has"){v[i++]="LIKE";v[i]="'%"+v[i]+"%'";}}
query="";for(i=0;i<v.length;++i)
query+=v[i]+" ";this.map.setQuery(query);}
this.map.draw();}
else if(group=="Dialog"){}}
SHIVA_Show.prototype.Annotate=function(x,y)
{if(!this.dr){this.Draw({shivaGroup:"Draw"});this.dr=new SHIVA_Draw(this.container);}
else this.dr.DrawPalette();if(x!=undefined){$("#shivaDrawPaletteDiv").css("left",x+"px");$("#shivaDrawPaletteDiv").css("top",y+"px");}
this.Sound("click");}
SHIVA_Show.prototype.DrawHTML=function()
{$("#"+this.container).width("100%");$("#"+this.container).height("100%");var w=$("#"+this.container).width();var sca=w/this.options.oWid;$("#"+this.container).html(this.options.html.replace(/&quot;/g,"\""));$("#"+this.container).css({"transform":"scale("+sca+")","-webkit-transform":"scale("+sca+")","transform-origin":"0% 0%","-webkit-transform-origin":"0% 0%"});$("#"+this.container).css({"font-family":"Verdana,Geneva,sans-serif","font-size":"small","padding":"16px"});this.SendReadyMessage(true);}
SHIVA_Show.prototype.HTMLActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize")
this.DrawHTML();else if(v[0]=="ShivaAct=data"){}}
SHIVA_Show.prototype.DrawWebpage=function()
{$("#"+this.container+"IF").remove();var h=this.options.height;var w=this.options.width;if(!isNaN(h))h+="px";if(!isNaN(w))w+="px";h=h.replace(/%25/,"%");w=w.replace(/%25/,"%");$("#"+this.container).css("height",h);$("#"+this.container).css("width",w);var str="<iframe src='"+this.options.url+"' id='"+this.container+"IF' style='";str+="width:"+w+";height:"+h+"'>";$("#"+this.container).append(str);this.SendReadyMessage(true);}
SHIVA_Show.prototype.DrawChart=function()
{var i=0,array,val;var ops=new Object();var options=this.options;var container=this.container;var con="#"+container;var _this=this;for(o in options){val="";if(options[o]){val=options[o].toString();val=ops[o]=val.replace(/~/g,"#")}
if((val.indexOf(",")!=-1)&&(o!="query")&&(o!="title")){if(val){array=true;if(val.indexOf('=')==-1)
ops[o]=new Array();else{ops[o]=new Object();array=false;}
var pairs=val.split(',');for(j=0;j<pairs.length;++j){if(!pairs[j])
continue;if(array)
ops[o].push(pairs[j].replace(/ /g,""));else{v=pairs[j].split("=");if(o=="options")
ops[v[0]]=v[1].replace(/ /g,"");else if(v[0].indexOf(".")!=-1){ops[o][v[0].split(".")[0]]={};ops[o][v[0].split(".")[0]][v[0].split(".")[1]]=v[1];}
else if(v[0].indexOf("_")!=-1){ops[o][v[0].split("_")[0]]={};ops[o][v[0].split("_")[0]][v[0].split("_")[1]]=v[1];}
else
ops[o][v[0]]=v[1];}}}}
if(ops[o]=='true')ops[o]=true;if(ops[o]=='false')ops[o]=false;}
if(options['width'])$(con).width(options['width']);if(options['height'])$(con).height(options['height']);ops.containerId=this.container;if(!ops.colors)delete ops.colors;if(ops.query){var v=ops.query.split(" ");for(i=0;i<v.length;++i){if(v[i]=="has"){v[i++]="LIKE";v[i]="'%"+v[i]+"%'";}}
ops.query="";for(i=0;i<v.length;++i)
ops.query+=v[i]+" ";}
if(options.series){var v=options.series.split(",")
ops.series=new Array();var o={};for(i=1;i<v.length;++i){if(!isNaN(v[i]))
ops.series.push(o),o={};else
o[v[i].split("=")[0]]=v[i].split("=")[1];}
ops.series.push(o);}
var wrap=new google.visualization.ChartWrapper(ops);this.map=wrap;if(ops.dataSourceUrl)
ops.dataSourceUrl=""+ops.dataSourceUrl.replace(/\^/g,"&");wrap.setOptions(ops);if(ops.dataSourceUrl.indexOf("google.com")==-1){shivaLib.GetSpreadsheet(ops.dataSourceUrl,false,ops.query,function(data){ops.dataSourceUrl=ops.query="";wrap.setOptions(ops);wrap.setDataTable(data);wrap.draw();});}
else
wrap.draw();google.visualization.events.addListener(wrap,"ready",function(){_this.SendReadyMessage(true);});google.visualization.events.addListener(wrap,"select",function(r){var o=wrap.getChart().getSelection()[0];var row="-",col="-";if((o)&&(o.row!=undefined))
row=o.row;if((o)&&(o.column!=undefined))
col=o.column;_this.SendShivaMessage("ShivaChart=click",row+"|"+col);});}
SHIVA_Show.prototype.ChartActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100"){$("#containerDiv").width("100%");$("#containerDiv").height("100%");shivaLib.map.setOption("width","100%");shivaLib.map.setOption("height","100%");}
shivaLib.map.draw();}
else if(v[0]=="ShivaAct=data"){var data=google.visualization.arrayToDataTable($.parseJSON(v[1]));shivaLib.map.setDataTable(data);shivaLib.map.draw();}}
SHIVA_Show.prototype.Sound=function(sound,mode)
{var snd=new Audio();if(!snd.canPlayType("audio/mpeg")||(snd.canPlayType("audio/mpeg")=="maybe"))
snd=new Audio(sound+".ogg");else
snd=new Audio(sound+".mp3");if(mode!="init")
snd.play();}
SHIVA_Show.prototype.ShowIframe=function(left,top,wid,hgt,url,id,mode,content)
{$("#"+id).remove();$("#CL-"+id).remove();if((hgt==0)||(wid==0))
return;var str="<iframe id='"+id+"' ";if(url)
str+="src='"+url+"' ";str+="style='position:absolute;";if(mode=="black")
str+="border:none;background:black;"
else if(mode=="transparent")
str+="border:none;background:transparent;"
else
str+="background:white;"
str+="width:"+(wid+2)+"px;height:"+(hgt+2)+"px;left:"+left+"px;top:"+top+"px;'";if(mode=="black")
str+=" scrolling='no'";else if(mode=="transparent")
str+=" allowtransparency='true'";$("body").append(str+"></iframe>");str="<iframe marginwidth='0' marginheight='0' src='closedot.gif' id='CL-"+id+"' style='position:absolute;margin:0px;padding:0px;border:none;";str+="width:17px;height:18px;left:"+(wid-13+left)+"px;top:"+(top+3)+"px'/>";if(mode!="black")
$("body").append(str);$("#"+id).bind("load",function(e){if(content)
this.contentWindow.document.body.innerHTML=content;});$("#CL-"+id).bind("load",function(e){this.contentWindow.document.body.onclick=function(e){shivaLib.Sound("delete");$("#"+id).remove();$("#CL-"+id).remove();}});}
SHIVA_Show.prototype.ShowLightBox=function(width,top,title,content)
{var str;str="<div id='shivaLightBoxDiv' style='position:fixed;width:100%;height:100%;";str+="background:url(overlay.png) repeat;top:0px;left:0px';</div>";$("body").append(str);str="<div id='shivaLightBoxIntDiv' style='position:absolute;padding:10px;width:";if(width!="auto")
str+=Math.abs(width)+"px";else
width=400;var x=($("#shivaLightBoxDiv").width()-width)/2;if(width<0){x=$("#"+this.container).css("left").replace(/px/,"");x=x-0+$("#"+this.container).width()/2+(width/2);}
str+=";border-radius:12px;moz-border-radius:12px;z-index:2003;"
str+="border:1px solid; left:"+x+"px;top:"+top+"%;background-color:#f8f8f8'>";str+="<img src='shivalogo32.png' style='vertical-align:-30%'/>&nbsp;&nbsp;";str+="<span style='font-size:large;text-shadow:1px 1px #ccc'><b>"+title+"</b></span>";str+="<div id='shivaLightContentDiv'>"+content+"</div>";$("#shivaLightBoxDiv").append(str);$("#shivaLightBoxDiv").css("z-index",2500);}
SHIVA_Show.prototype.Prompt=function(title,message,def,id)
{var ops={width:'auto',height:'auto',modal:true,autoOpen:true,title:title,buttons:{OK:function(){$("#"+id).val($("#shiva_dialogInput").val());$(this).remove();},CANCEL:function(){$(this).remove();}}}
var str="<br/><b>"+message+"</b><br/><br/>";str+="<input type='input' size='23' id='shiva_dialogInput' value='"+def+"'/>";$("body").append("<div id='shiva_dialogDiv'/>");$("#shiva_dialogDiv").dialog(ops);$("#shiva_dialogDiv").html(str);}
SHIVA_Show.prototype.MakeSelect=function(id,multi,items,sel,extra,values)
{var str="<select id='"+id+"'";if(multi)
str+="multiple='multiple' size='"+multi+"'";if(extra)
str+=extra;str+=">";for(i=0;i<items.length;++i){str+="<option";if(sel==items[i])
str+=" selected='selected'"
if(values&&values[i])
str+=" value='"+values[i]+"'";str+=">"+items[i]+"</option>";}
return str+"</select>"}
SHIVA_Show.prototype.GetTextFile=function(file,callback)
{var syncMode=false;if(file.charAt(0)=="@")
file="proxy.php?url="+file.substr(1);xmlhttp=new XMLHttpRequest();if(callback){syncMode=true;xmlhttp.onload=function(e){callback(e.target.responseText);}}
xmlhttp.open("GET",file,syncMode);xmlhttp.send();return(xmlhttp.responseText);}
SHIVA_Show.prototype.ConvertDateToJSON=function(dateTime)
{var mos=new Array("","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");var v=String(dateTime).split('/');if(v.length==2)
return(mos[v[0]]+" "+v[1]);else if(v.length==3)
return(mos[v[0]]+" "+v[1]+" "+v[2]);return v[0];}
SHIVA_Show.prototype.FormatDate=function(date,format)
{var mos=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");var d=new Date(date);var t=d.toString().match(/.{16}(.{8})/)[1];if(format)
format=format.toLowerCase();if(format=="m/d/y")
return(d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();else if(format=="m/y")
return(d.getMonth()+1)+"/"+d.getFullYear();else if(format=="mo d, y")
return mos[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear();else if(format=="mo, y")
return mos[d.getMonth()]+" "+d.getFullYear();else if(format=="mo d, y h:m")
return mos[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()+" "+t.substring(0,5);else if(format=="m/d/y h:m:s")
return(d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+t;else if(format=="m/d/y h:m")
return(d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+t.substring(0,5);else(format=="y")
return d.getFullYear();}
SHIVA_Show.prototype.ArrayToString=function(jsonArray)
{var i,o,oo,str="[",key,val;for(i=0;i<jsonArray.length;++i){str+="{";o=jsonArray[i];for(key in o){val=o[key];str+="\""+key+"\":";if(typeof(o[key])=="object"){str+="{";oo=o[key];for(key in oo){str+="\""+key+"\":";val=oo[key];str+="\""+val+"\",";}
str=str.substr(0,str.length-1)+"\t},";}
else
str+="\""+val+"\",";}
str=str.substr(0,str.length-1);if(i!=jsonArray.length-1)str+="},\n";else str+="}]";}
return str;}
SHIVA_Show.prototype.LinkToAnchor=function(str)
{var i,v,vv,url,title;if(!str)
return"";if(str.match(/href=/))
return str;if(str.match(/http/)){v=(str+" ").match(/http.?:\/\/.*?\s/ig);for(i=0;i<v.length;++i){v[i]=$.trim(v[i]);vv=v[i].split("|");url=title=vv[0];if(vv.length>1)
title=vv[1].replace(/_/g," ");str=str.replace(RegExp(v[i].replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"))," <a href='"+url+"' target='_blank'>"+title+"</a> ");}}
return str;}
SHIVA_Show.prototype.Clone=function(obj)
{var i;if(null==obj||"object"!=typeof obj)return obj;else if(obj instanceof Array){var copy=[];for(i=0;i<obj.length;++i)
copy[i]=this.Clone(obj[i]);return copy;}
else if(obj instanceof Object){var copy={};for(var attr in obj)
if(obj.hasOwnProperty(attr))
copy[attr]=this.Clone(obj[attr]);return copy;}}
SHIVA_Show.prototype.EasyFile=function(_data,callback,type)
{var i,email="",w=350;var v=document.cookie.split(';');for(var i=0;i<v.length;i++)
if(v[i].indexOf("ez-email=")!=-1)
email=v[i].substr(9);var str="<br/>Use <b>eStore</b> to save and load projects under your email address. When saving, type a title when asked and when loading, choose a project from a list of your saved projects.<br/>"
str+="<br/><table id='ez-maintbl' cellspacing=0 cellpadding=0 style='font-size:small'>";str+="<tr><td width='25%'>Email</td><td><input type='text' id='email' size='40' value='"+email+"'/></td></tr>";str+="</table><div align='right' style='font-size:x-small'><br/>";if(type!="all")
str+=" <button id='saveBut'>Save</button>";str+=" <button id='loadBut'>Load</button>";if(type!="all")
str+=" <button id='linkBut'>Link</button>";str+=" <button id='cancelBut'>Cancel</button></div>";if((type=="KML")||(this.group=="Earth")){w=-400;$("#containerDiv").height($("#containerDiv").height()/100);}
this.ShowLightBox(w,20,"SHIVA eStore",str)
$("#cancelBut").button().click(function(){$("#shivaLightBoxDiv").remove();if($("#containerDiv").height()<10)
$("#containerDiv").height($("#containerDiv").height()*100);});$("#saveBut").button().click(function(){var _email=$("#email").val();var _title=$("#ez-title").val();var _type=type;if(!_email){alert("Please type your email");return;}
if(((_email.toLowerCase()=="samples")&&(_email!="SaMpLeS"))||((_email.toLowerCase()=="canvas")&&(_email!="CaNvAs"))){alert("Sorry, but you can't save using this name");return;}
if(!$("#ez-title").length){str="<tr><td>Title</td><td><input type='text' size='40' id='ez-title'/></td></tr>";$(str).appendTo("#ez-maintbl tbody");$("#ez-title").focus();return;}
if(!_title){alert("Please type title to save under");return;}
document.cookie="ez-email="+_email;$("#shivaLightBoxDiv").remove();if($("#containerDiv").height()<10)
$("#containerDiv").height($("#containerDiv").height()*100);str="\",\n\t\"shivaTitle\": \""+_title+"\"\n}";if((type!="Canvas")&&(type!="KML"))
_data=_data.substr(0,_data.lastIndexOf("\""))+str;$.post("http://www.stagetools.com/vis/shiva/addeasyfile.php",{email:_email,type:_type,title:_title,data:_data.replace(/'/g,"\\'")});});$("#loadBut").button().click(function(){email=$("#email").val();if(!email){alert("Please type your email");return;}
if(!isNaN(email)){shivaLib.LoadEasyFile(email,callback);return;}
document.cookie="ez-email="+email;var dat={email:email};if(type!="all")
dat["type"]=type;str="http://www.stagetools.com/vis/shiva/listeasyfile.php";shivaLib.ezcb=callback;shivaLib.ezmode="load";$.ajax({url:str,data:dat,dataType:'jsonp'});});$("#linkBut").button().click(function(){email=$("#email").val();if(!email){alert("Please type your email");return;}
document.cookie="ez-email="+email;var dat={email:email};if(type!="all")
dat["type"]=type;str="http://www.stagetools.com/vis/shiva/listeasyfile.php";shivaLib.ezcb="";shivaLib.ezmode="link";$.ajax({url:str,data:dat,dataType:'jsonp'});});}
SHIVA_Show.prototype.ShowEasyFile=function(files,callback,mode)
{var i;var str="<br/><div style='overflow:auto;overflow-x:hidden;height:200px;font-size:x-small;padding:8px;border:1px solid #cccccc'>";str+="<table id='ezFilesTable' cellspacing=0 cellpadding=4><tr><td></td></tr></table></div>";$("#shivaLightContentDiv").html(str);str="<div align='right' style='font-size:x-small'><br>Show only with this in title: <input type='text' size='10' id='ezFileFilter'/>";str+=" <button id='cancelBut'>Cancel</button></div>";$("#shivaLightContentDiv").append(str);$("#cancelBut").button().click(function(){$("#shivaLightBoxDiv").remove();if($("#containerDiv").height()<10)
$("#containerDiv").height($("#containerDiv").height()*100);});this.MakeEasyFileList(files,"",callback,mode);$("#ezFileFilter").keyup($.proxy(function(){var filter=$("#ezFileFilter").val();$("#ezFilesTable tbody").empty();this.MakeEasyFileList(files,filter,callback,mode);},this));}
SHIVA_Show.prototype.MakeEasyFileList=function(files,filter,callback,mode)
{var i,str,type;files.sort(function(a,b){var A=new Date(a.created.substr(0,5)+"/2012 "+a.created.substr(6));var B=new Date(b.created.substr(0,5)+"/2012 "+b.created.substr(6));return B-A;});for(i=0;i<files.length;++i){if((filter)&&(files[i].title.toLowerCase().indexOf(filter.toLowerCase())==-1))
continue;str="<tr id='ezfile-"+files[i].id+"'><td>"+files[i].created.replace(/ /,"&nbsp")+"</td>";str+="<td width='100%'><img  src='adddot.gif'  height='11'> &nbsp;";str+=files[i].id+" "+files[i].title+"</td></tr>";$(str).appendTo("#ezFilesTable tbody");$("#ezFilesTable tr:odd").addClass("odd");}
for(i=0;i<files.length;++i){type=files[i].type;$("#ezfile-"+files[i].id).click(function(){if((mode=="link")&&(type=="KML"))
prompt("Press Ctrl-C to copy link","http://www.stagetools.com/vis/shiva/getkml.php?id="+this.id.substr(7));if((mode=="link")&&(type!="KML"))
prompt("Press Ctrl-C to copy link","www.viseyes.org/shiva/go.htm?e="+this.id.substr(7));else{var dat={id:this.id.substr(7)};str="http://www.stagetools.com/vis/shiva/geteasyfile.php";shivaLib.ezcb=callback;shivaLib.ezmode=this.id.substr(7);$.ajax({url:str,data:dat,dataType:'jsonp'});}
$("#shivaLightBoxDiv").remove();if($("#containerDiv").height()<10)
$("#containerDiv").height($("#containerDiv").height()*100);});}}
SHIVA_Show.prototype.LoadEasyFile=function(num,callback)
{var str="http://www.stagetools.com/vis/shiva/geteasyfile.php";shivaLib.ezcb=callback;shivaLib.ezmode=num;$.ajax({url:str,data:{id:num},dataType:'jsonp'});$("#shivaLightBoxDiv").remove();if($("#containerDiv").height()<10)
$("#containerDiv").height($("#containerDiv").height()*100);}
function easyFileListWrapper(data)
{shivaLib.ShowEasyFile(data,shivaLib.ezcb,shivaLib.ezmode);}
function easyFileDataWrapper(data)
{if(!data["Element-0"])
data.shivaId=Number(shivaLib.ezmode);shivaLib.ezcb(data);}
SHIVA_Graphics.prototype.EnumObject=function(obj)
{trace("------------------------------------------------------------");for(var key in obj)
trace(key+"="+obj[key])}
function trace(msg,p1,p2,p3,p4)
{if(p4)
console.log(msg,p1,p2,p3,p4);else if(p3)
console.log(msg,p1,p2,p3);else if(p2)
console.log(msg,p1,p2);else if(p1)
console.log(msg,p1);else
console.log(msg);}
SHIVA_Draw.prototype.isTouchDevice=function()
{var el=document.createElement('div');el.setAttribute('ongesturestart','return;');if(typeof el.ongesturestart=="function")
return true;else
return false;}
SHIVA_Show.prototype.SaveData=function(mode,style,items,props,type)
{var i,j,k,o,str1;var ovr=""
var itemStart;var str="{\n";$('#formatter').val(0)
var atts=new Array();for(o in props)
atts.push(o);if(items){for(i=0;i<atts.length;++i)
if(atts[i]=="item"){atts[i]="name";break;}
itemStart=i;for(j=0;j<items.length;++j)
for(k=itemStart+1;k<atts.length;++k)
items[j][atts[k]]=$("#itemInput"+j+"-"+(k-i)).val();}
if((mode=='JSON')||(mode=="GetJSON")||(mode=="Canvas")||(mode=="eStore")){if(items&&items.length){for(i=0;i<items.length;++i){str+="\t\"item-"+(i+1)+"\": \"";for(k=itemStart;k<atts.length;++k){str1=items[i][atts[k]];if(str1){if((props[atts[k]])&&(props[atts[k]].opt=="list"))
str1=str1.replace(/\n/g,"<br/>").replace(/\r/g,"").replace(/\:/g,"`");else
str1=str1.replace(/\n/g,",").replace(/\r/g,"").replace(/\:/g,"`");}
str+=atts[k]+":"+str1+";";}
str=str.substring(0,str.length-1)+"\",\n";}
if(!this.overlay)
str=str.substring(0,str.length-3)+"\",\n";}
if(this.overlay&&this.dr)
str+=this.dr.SaveDrawData(true);var j=0;if(type)
str+="\t\"chartType\": \""+type+"\",\n";for(o in props){if(o=="item")
break;str1=$("#propInput"+(j++)).val();if((props[o].opt=="list")&&(str1))
str1=str1.replace(/\n/g,",").replace(/\r/g,"");str+="\t\""+o+"\": \""+str1+"\",\n";}
d=new Date().toUTCString();str+="\t\"shivaMod\": \""+d.substring(0,d.length-13)+"\",\n";str+="\t\"shivaGroup\": \""+style+"\"\n}";if(mode=='Canvas'){window.parent.document.getElementById("shivaCan").contentWindow.postMessage("PutJSON:"+str,"*");this.Sound("ding");window.parent.OpenTab(8);return;}
if(mode=='GetJSON')
return str;$('#formatter').val(0);if(mode=='eStore')
return this.EasyFile(str,$.proxy(function(data){ReEdit(data)},this),style);$("#helpDiv").html("");}
else{$('#formatter').val(0);$("#helpDiv").html("");str="http://www.viseyes.org/shiva/go.htm";str+="?shivaGroup="+style;if(items&&items.length){for(i=0;i<items.length;++i){str+="&item-"+(i+1)+"=";for(k=itemStart;k<atts.length;++k){str1=items[i][atts[k]];if(str1)
str1=str1.replace(/\n/g,",").replace(/\r/g,"").replace(/\:/g,"`");str+=atts[k]+":"+str1+";";}
str=str.substring(0,str.length-1);}}
if(this.overlay)
str+=this.dr.SaveDrawData(false);if(type)
str+="&chartType="+type;var j=0;for(o in props){if(o=="item")
break;str1=$("#propInput"+(j++)).val();if(str1)
str1=str1.replace(/&/g,"^").replace(/#/g,"``");if((props[o].opt=="list")&&(str1))
str1=str1.replace(/\n/g,",").replace(/\r/g,"");str+="&"+o+"="+str1;}
if(mode=='WordPress')
str="[iframe src='"+encodeURI(str)+"']";else if((mode=='iFrame')||(mode=='Drupal'))
str="<iframe width='600' height='400' src='"+encodeURI(str)+"'></iframe>";}
$("#outputDiv").html("<br/><br/>Embed code:<br><textarea readonly='yes' rows='6' cols='60' id='tmptxt1'>"+str+"</textarea>");$("#tmptxt1").select();return str;}
SHIVA_Show.prototype.ReEdit=function(jsonData,propertyList)
{var p,v,i=0,j,k=0,pair,key,o;var query=window.location.search.substring(1);if(!query&&!jsonData)
return;if(jsonData){var items=new Array();for(key in jsonData){if(key=="shivaEvents")
continue;if(key.indexOf("item-")!=-1){v=jsonData[key].split(";");o=new Object;for(j=0;j<v.length;++j){p=v[j].split(":");o[p[0]]=p[1];}
items.push(o);continue;}
else if(key.indexOf("draw-")!=-1)
this.AddOverlaySeg(jsonData[key],true);else{k=0;for(o in propertyList){if(key==o){$("#propInput"+k).val(jsonData[key]);break;}
k++;}}}
return items;}
var vars=query.replace(/%C2%AE/g,"&reg").split("&");if(vars.length<4)
return;var items=new Array();for(var i=0;i<vars.length;i++){vars[i]=vars[i].replace(/\^/g,"&").replace(/%20/g," ").replace(/%60/g,"`").replace(/%3C/g,"<").replace(/%3E/g,">").replace(/%3c/g,"<").replace(/%3e/g,">").replace(/``/g,"#");pair=vars[i].split("=");for(j=2;j<pair.length;++j)
pair[1]+="="+pair[j];if(pair[1])
pair[0]=unescape(pair[0]);if(pair[0].indexOf("draw-")!=-1)
this.AddOverlaySeg(pair[1],true);if(pair[0].indexOf("item-")!=-1){v=pair[1].split(";");o=new Object;for(j=0;j<v.length;++j){p=v[j].split(":");o[p[0]]=p[1];}
items.push(o);}
else{for(o in propertyList)
if(pair[0]==o){$("#propInput"+(k++)).val(pair[1]);break;}}}
return items;}
SHIVA_Show.prototype.ShowHelp=function(att,helpText,chartType)
{var v;var str="<br/><hr/>";$("#outputDiv").text(" ");if(att){if(att.charAt(0)==' ')
att=att.substr(1)
v=att.split("&nbsp;");str+="<b>How to set "+v[0]+"</b><br/><br/>";if(helpText[v[0]])
str+=helpText[v[0]];}
else
str+="Click on a label to show help."
if(att=="Data source URL"){if(helpText[chartType]){str+="<br/><br/><b>Data Format for "+chartType+"</b><br/><br/><table>";str+="<tr><td>"+helpText[chartType]+"</td></tr>";str+="</table>";}}
if(helpText["OVERVIEW"])
str+="<br/><br/><b><i>Click <a onClick='shivaLib.ShowOverview()'><u>here</u></a> for an overview on the entire element.</b>";$("#helpDiv").html(str);}
SHIVA_Show.prototype.ShowOverview=function()
{var str="<br/><hr/><b>"+shivaLib.options.shivaGroup+" overview</b><br/><br/>";str+=helpText["OVERVIEW"];$("#helpDiv").html(str);}
SHIVA_Show.prototype.SetAttributes=function(props,items,keepData)
{var i,j,k,l,o,oo,id,id2;var atts=new Array();var oldData;for(o in props)
atts.push(o);if(keepData){oldData=new Array()
for(i=0;i<atts.length;++i){if(atts[i]=="item")
break;oldData.push($("#propInput"+i).val());}}
$('#propertyTable tr:gt(0)').remove();for(i=0;i<atts.length;++i){o=atts[i];id="propInput"+i;var str="<tr style='height:28px'><td width='12'></td><td width='200' onClick='ShowHelp(this.innerHTML)'>"+props[o].des.split("::")[0];if(o=="dataSourceUrl")
str+="&nbsp;&nbsp;&nbsp;<img src='gdrive.png' id='gDriveLoadBut' title='Load from Google Drive' style='vertical-align:bottom;cursor:pointer'>"
str+="</td><td></td><td>";if(props[o].opt=="query")
str+="<input type='password' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.QueryEditor(\""+id+"\")' id='"+id+"'/>";else if(props[o].opt=="advanced")
str+="<input tabIndex='-1' onChange='Draw()' onFocus='shivaLib.SetAdvancedAttributes(\""+id+"\",\""+o+"\")' id='"+id+"'/>";else if((props[o].opt=="color")||(props[o].opt=="colors")){str+="<div style='max-height:26px'><input onChange='Draw()' style='position:relative;text-align:center;height:16px;top:2px; padding-left: 20px' id='"+id+"'/>";str+="<div style='position:relative;border:1px solid #999;height:10px;width:10px;top:-15px;left:8px;background-color:white'"
if(props[o].opt=="colors")
str+=" onclick='shivaLib.ColorPicker(1,"+i+")' id='"+id+"C'/>";else
str+=" onclick='shivaLib.ColorPicker(0,"+i+")' id='"+id+"C'/>";str+="</div>"}
else if(props[o].opt=="button")
str+="<button type='button' onChange='"+o+"' id='"+id+"'>"+props[o].def+"</button>";else if(props[o].opt=="slider")
str+="<input onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";else if(props[o].opt=="checkbox"){str+="<input onChange='Draw()' type='checkbox' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'";if(props[o].def=="true")
str+=" checked";str+="/> "+props[o].des.split("::")[1];}
else if(props[o].opt=="list")
str+="<textarea cols='12' rows='2' onChange='Draw()' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";else if(props[o].opt=="sizer")
str+="<button type='button' id='"+id+"' onclick='shivaLib.SizingBox(\"containerDiv\",this.id)'>Set</button>";else if(props[o].opt=="hidden")
str="<tr><td width='12'></td><td width='200'><input type='hidden' id='"+id+"'/>";else if(props[o].opt.indexOf('|')!=-1){var v=props[o].opt.split("|");if(o=='item'){str="<tr><td width='12'></td><td colspan='3'><div id='accord'>";for(j=0;j<items.length;++j){str+="<h3><a href='#' id='acctitle"+j+"'><b>"+items[j].name+"</b></a></h3><div id='accord-"+j+"'style='overflow-x:hidden'>";for(k=i+1;k<atts.length;++k){id2="itemInput"+j+"-"+(k-i);oo=atts[k];if(props[oo].opt!="hidden")
str+="<span onClick='ShowHelp(this.innerText)'>"+props[oo].des;if((this.drupalMan)&&(oo=="layerSource"))
str+="<img src='kmlicon.gif' id='"+j+"' title='Click to find KML file' style='vertical-align:bottom' onclick='shivaLib.GetDataFromManager(\"kml\",this.id)'/>";str+="</span><span style='position:absolute;left:142px;'>";if(props[oo].opt=="color"){str+="<input size='14' onChange='Draw()' style='text-align:center' id='"+id2+"'>";str+="<div style='position:relative;border:1px solid;height:8px;width:9px;top:-14px;left:5px'"
str+=" onclick='shivaLib.ColorPicker(0,"+((j*100)+100+(k-i))+")' id='"+id2+"C'/>";}
else if(props[oo].opt=="colors")
str+="<input style='width:90px' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.ColorPicker(2,"+((j*100)+100+(k-i))+")' id='"+id2+"'>";else if(props[oo].opt=="button")
str+="<button type='button' size='12' onChange='"+oo+"' id='"+id+"'>"+props[oo].def+"</button>";else if(props[oo].opt=="slider")
str+="<input style='width:90px' onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";else if(props[oo].opt=="list")
str+="<textarea style='width:90px' rows='2' onChange='Draw()' onInput='Draw()' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";else if(props[oo].opt=="hidden")
str+="<input type='hidden' id='"+id2+"'/>";else if(props[oo].opt.indexOf('|')!=-1){var v=props[oo].opt.split("|");str+="<select style='width:90px' id='"+id2+"' onChange='Draw()' onFocus='ShowHelp(\""+props[oo].des+"\")'>";for(l=0;l<v.length;++l){if(v[l])
str+="<option>"+v[l]+"</option>";}
str+="</select>";}
else if(props[oo].opt=="sizer")
str+="<button type='button' id='"+id2+"' onclick='shivaLib.SizingBox(\"containerDiv\",this.id)'>Set</button>";else
str+="<input style='width:90px' onChange='Draw()' type='text' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";str+="</span></p>";}
str+="</div>";}}
else{str+="<select id='"+id+"' onChange='Draw()' onFocus='ShowHelp(\""+props[o].des+"\")'>";for(j=0;j<v.length;++j){if(v[j])
str+="<option>"+v[j]+"</option>";}
str+="</select>";}}
else{str+="<input size='14' style='height:16px' onChange='Draw()' type='text' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";}
str+="<td width='12'></td ></td></tr>";$(str).appendTo("#propertyTable tbody")
$("#"+id).val(props[o].def);if(keepData)
$("#"+id).val(oldData[i]);else
$("#"+id).val(props[o].def);if(props[o].opt=="color")
if(props[o].def.toLowerCase()!='auto'){$("#"+id).css('border-color',"#"+props[o].def);$("#"+id+"C").css('background-color',"#"+props[o].def);}
if(o=="item")
break;}
str="<tr height='8'><td></td></tr>";$(str).appendTo("#propertyTable tbody")
$("#accord").accordion({collapsible:true,active:false,autoHeight:false,change:this.callback});$("#gDriveLoadBut").on("click",function(){shivaLib.GoogleDriveLoad(true,function(file){if(file)$("#propInput0").val(file);Draw();})});if(items){for(j=0;j<items.length;++j){for(k=i+1;k<atts.length;++k){o=atts[k];id2="itemInput"+j+"-"+(k-i);if(props[o].opt=="color")
if(props[o].def.toLowerCase()!='auto'){$("#"+id2).css('border-color',"#"+items[j][atts[k]]);$("#"+id2+"C").css('background-color',"#"+items[j][atts[k]]);}}}
for(i=0;i<atts.length;++i)
if(atts[i]=="item"){atts[i]="name";break;}
for(j=0;j<items.length;++j)
for(k=i;k<atts.length;++k)
$("#itemInput"+j+"-"+(k-i)).val(items[j][atts[k]]);}
var bs={"-moz-border-radius":"10px","-webkit-border-radius":"10px","-khtml-border-radius":"10px","border-radius":"10px","width":"100px","padding-left":"7px","padding-right":"7px","padding-top":"1px","border":"1px solid #ddd","color":"#666","font-size":"12px","height":"18px"};for(i=0;i<atts.length;++i){$("#propInput"+i).css(bs);if((props[atts[i]])&&(props[atts[i]].opt.match(/\|/))&&(atts[i]!="item")){$("#propInput"+i).css({"background-color":"#eee","background":"-webkit-linear-gradient(top,#ffffff 0%,#f0f0f0 100%)","background":"linear-gradient(#ffffff,#f0f0f0)","padding-left":"5px",width:"115px",height:"21px",});if(navigator.userAgent.match(/firefox/i))
$("#propInput"+i).css({"text-indent":"0.01px","text-overflow":"''","background":"url(selectorbutton.gif) no-repeat right #f8f8f8"});}}}
SHIVA_Show.prototype.SetAdvancedAttributes=function(prop,baseVar)
{var str,title,aProps,v,i;$("#advAttDialogDiv").dialog("destroy");$("#advAttDialogDiv").remove();str="<table>"
switch(baseVar){case"legendTextStyle":case"titleTextStyle":case"pieSliceTextStyle":case"tooltipTextStyle":aProps={fontName:{opt:'string',des:'Font'},fontSize:{opt:'string',des:'Size'},color:{opt:'color',des:'Color'}}
break;case"chartArea":aProps={left:{opt:'string',des:'Left'},top:{opt:'string',des:'Top'},height:{opt:'string',des:'Height'},width:{opt:'string',des:'Width'}}
break;case"backgroundColor":aProps={fill:{opt:'color',des:'Fill color'},stroke:{opt:'color',des:'Border color'},strokeWidth:{opt:'string',des:'Border width'}}
break;case"vAxis":case"hAxis":aProps={baseline:{opt:'string',des:'Baseline'},baselineColor:{opt:'color',des:'Baseline color'},direction:{opt:'string',des:'Direction'},format:{opt:'string',des:'Axis label format'},direction:{opt:'string',des:'Direction'},logScale:{opt:'string',des:'Log scale?'},textPosition:{opt:'string',des:'Text position'},title:{opt:'string',des:'Axis title'},viewWindow_max:{opt:'string',des:'Max value'},viewWindow_min:{opt:'string',des:'Min value'},slantedText:{opt:'string',des:'Slanted text'}}
break;case"backgroundColors":aProps={main:{opt:'color',des:'Main Background'},eventspan:{opt:'color',des:'Event Span Background'},head:{opt:'color',des:'Header, Footer and Zoom Background'},popup:{opt:'color',des:'Popup Background'},imagelane:{opt:'color',des:'Image Lane Background'},ticklane:{opt:'color',des:'Time Ticks Background'},popuplink:{opt:'color',des:'Popup Link Background'}}
break;case"fontColors":aProps={main:{opt:'color',des:'Main Font Color'},head:{opt:'color',des:'Header Font Color'},popup:{opt:'color',des:'Popup Font Color'},links:{opt:'color',des:'Link Font Color'}}
break;}
for(o in aProps){str+="<tr style='height:26px' onClick='ShowHelp(\""+aProps[o].des+"\")'><td>"+aProps[o].des+"</td><td>";if(aProps[o].opt=="color"){str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:center;height:16px;top:2px' id='"+baseVar+o+"'/>";str+="<div style='position:relative;border:1px solid;height:11px;width:11px;top:-16px;left:6px;background-color:white'"
str+=" onclick='shivaLib.ColorPicker(0,\"___"+baseVar+o+"\")' id='"+baseVar+o+"C'/>";}
else
str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:left;height:16px;top:2px' id='"+baseVar+o+"'/>";str+="</td></tr>";}
var ops={width:'auto',height:'auto',modal:true,title:"Set "+baseVar,position:[300,350],buttons:{OK:function(){str="";for(o in aProps){if($("#"+baseVar+o).val())
str+=o+"="+$("#"+baseVar+o).val()+",";}
$("#"+prop).val(str);$("#"+prop).trigger("onchange");$(this).dialog("destroy");$("#advAttDialogDiv").remove();},'Cancel':function(){$(this).dialog("destroy");$("#advAttDialogDiv").remove();}}}
$("body").append("<div id='advAttDialogDiv'/>");$("#advAttDialogDiv").dialog(ops);$("#advAttDialogDiv").html(str+"</table>");v=$("#"+prop).val().split(",");for(i=0;i<v.length-1;++i)
$("#"+baseVar+v[i].split("=")[0]).val(v[i].split("=")[1]);}
SHIVA_Show.prototype.SizingBox=function(div,id,pos,alpha,col,edge)
{if(div==undefined){$("#shivaSizingBox").remove();Draw();return;}
Draw();if(id.indexOf("Input")!=-1)
pos=$("#"+id).val();var v,top=0,left=0,wid=10000;if(pos)
v=pos.split(",");if($("#shivaSizingBox").length==0){if(alpha==undefined)alpha=.5;if(col==undefined)col="#ccc;"
if(edge==undefined)edge="#000;"
var str="<div id='shivaSizingBox' style='background:"+col+"border:1px solid "+edge+";position:absolute;opacity:"+alpha+"'>";str+="<img src='addeventdot.gif' onclick='shivaLib.SizingBox()'></div>";$("#"+div).append(str);}
var box=$("#shivaSizingBox");var con=$("#"+div);if(v[0]!=undefined)left=v[0]
if(v[1]!=undefined)top=v[1];if(v[2]!=undefined)wid=v[2];box.css({left:left/100+"%",top:top/100+"%",width:wid/100+"%",height:wid/100+"%"});box.resizable({aspectRatio:true,cursor:"se-resize",resize:SetBox});box.draggable({containment:"parent",cursor:"move",drag:SetBox});function SetBox(event,ui){var box=$(this);var left=Math.round(ui.position.left/box.parent().width()*10000);var top=Math.round(ui.position.top/box.parent().height()*10000);var wid=Math.round(box.width()/con.width()*10000);$("#"+id).val(left+","+top+","+wid);SaveData("GetJSON");}}
SHIVA_Show.prototype.GetDataFromManager=function(type,index)
{if(type=="gdoc")
window.parent.postMessage("dataSourceUrl","*");if(type=="kml")
window.parent.postMessage("GetFile=KML="+index,"*");}
SHIVA_Show.prototype.QueryEditor=function(id)
{if($("#propInput0").val())
new SHIVA_QueryEditor($("#propInput0").val(),$("#"+id).val(),id,false);else
this.Prompt("Data Filter","You need to define a data source first!","")}
SHIVA_Show.prototype.ShiftItem=function(dir,items)
{var active=$("#accord").accordion("option","active");if(active===false)
return-1;var pos=Number(active)+Number(dir);if((pos<0)||(pos>=items.length))
return active;else
this.Sound("click");var o=items[pos];items[pos]=items[active];items[active]=o;this.Draw();return pos;}
function SHIVA_QueryEditor(source,query,returnID,fieldNames,callback)
{this.advancedMode=false;this.autoShow=true;$("#dataDialogDiv").dialog("destroy");$("#dataDialogDiv").remove();shivaLib.qe=this;if(query.indexOf("  ")==0)
this.advancedMode=true,query=query.substr(2);else if(!query)
query="SELECT * WHERE A = ? ORDER BY none"
if(query.indexOf(" ORDER BY ")==-1)
query+=" ORDER BY none";this.source=source;this.query=query.replace(/  /g," ");this.curFields=["A","B","C"];var thisObj=this;var ops={width:'auto',height:'auto',modal:true,title:'Data filter',position:[330,40],buttons:{OK:function(){if(thisObj.advancedMode)
thisObj.query="  "+$("#curQuery").val();if(!fieldNames){var i,f;for(i=0;i<thisObj.curFields.length;++i){f=thisObj.curFields[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");thisObj.query=thisObj.query.replace(RegExp(f,"g"),String.fromCharCode(i+65));}}
if(!thisObj.query.match(/\?/)){thisObj.query=thisObj.query.replace(/ORDER BY none/g,"");if(returnID=="curQueryDiv")
$("#"+returnID).html(thisObj.query);else if(returnID)
$("#"+returnID).val(thisObj.query);window.postMessage("ShivaDraw","*");}
$(this).dialog("destroy");$("#dataDialogDiv").remove();$("#propInput0").trigger("onchange");if(callback)
callback(thisObj.query);},'Cancel':function(){$(this).dialog("destroy");$("#dataDialogDiv").remove();if(callback){callback(query);return;}}}}
$("body").append("<div id='dataDialogDiv'/>");$("#dataDialogDiv").dialog(ops);if(source){var googleQuery=new google.visualization.Query(source);googleQuery.send(handleQueryResponse);}
this.DrawQuery();function handleQueryResponse(response){var i,j,key;var data=response.getDataTable();var rows=data.getNumberOfRows();var cols=data.getNumberOfColumns();thisObj.curFields=[];if((thisObj.query.indexOf(" A ")!=-1)&&(thisObj.query.charAt(thisObj.query.length-1)!=" "))
thisObj.query+=" ";for(j=0;j<cols;++j){key=$.trim(data.getColumnLabel(j)).replace(/ /g,"_");if(!key)
continue;thisObj.query=thisObj.query.replace(RegExp(" "+String.fromCharCode(j+65)+" ","g")," "+key+" ");thisObj.curFields.push(key);}
thisObj.query=$.trim(thisObj.query);thisObj.DrawQuery();}}
SHIVA_QueryEditor.prototype.DrawQuery=function()
{var i,num;var select="all";var order="none";var thisObj=this;if(this.advancedMode){str="<textArea id='curQuery' rows='4' cols='50' />";str+="<p><input type='checkbox' id='advedit' checked='checked' onclick='shivaLib.qe.AdvancedMode(false)'> Advanced edit mode";str+="<p><Button id='queryAdvEdit'>Test</button> ";str+="Click <a href='http://code.google.com/apis/chart/interactive/docs/querylanguage.html' target='_blank'>here</a> for information on formatting</p></p>";str+="<br/><div id='testShowDiv'/>"
$("#dataDialogDiv").html(str);$("#curQuery").val(this.query.replace(/ORDER BY none/g,"").replace(/  /g," "));$("#queryAdvEdit").click(function(){thisObj.TestQuery();});this.TestQuery();return;}
i=this.query.indexOf(" WHERE ");if(i==-1)
i=this.query.indexOf(" ORDER BY ");select=this.query.substring(7,i);if(select=="*")
select="all";i=this.query.indexOf(" ORDER BY ");order=this.query.substring(i+10);i=this.query.indexOf(" WHERE ");var str="<div style='border 1px solid'><br/><table id='clauseTable' cellspacing='0' cellpadding='0'>";if(i!=-1){j=this.query.indexOf(" ORDER BY ");var v=this.query.substring(i+7,j).split(" ");i=0;str+=this.AddClause("IF",v[0],v[1],v[2],v.length<6,i++);for(j=3;j<v.length;j+=4)
str+=this.AddClause(v[j],v[j+1],v[j+2],v[j+3],(j+5)>v.length,i++);}
var q=this.query.replace(/WHERE /g,"<br/>WHERE ").replace(/ORDER BY /g,"<br/>ORDER BY ")
str+="<tr height='12'></tr>";str+="</div><tr><td><b>SHOW&nbsp;&nbsp;</b></td><td align='middle'>&nbsp;";str+="<select multiple='multiple' size='3'id='sel' onchange='shivaLib.qe.SetQueryString()'>";str+="<option>all</option>";for(i=0;i<this.curFields.length;++i)str+="<option>"+this.curFields[i]+"</option>";str+="</select></td><td>&nbsp;&nbsp;<b>ORDER BY</B> &nbsp;<select id='ord' onchange='shivaLib.qe.SetQueryString()'>";str+="<option>none</option>";for(i=0;i<this.curFields.length;++i)str+="<option>"+this.curFields[i]+"</option>";str+="</select></td></tr>";str+="</table><p><input type='checkbox' id='advedit' onclick='shivaLib.qe.AdvancedMode(true)'/> Advanced edit mode";str+=" <input type='checkbox' id='qAutoShow'";if(this.autoShow)str+=" checked='checked'";str+=">Auto-show</p>";str+="<div id='curQuery' style='overflow:auto'><span style='color:#999'><b>"+q+"</b></span></div>";str+="<br/><div id='testShowDiv'/>"
$("#dataDialogDiv").html(str);$("#sel").val(select.split(","));$("#ord").val(order);if(this.autoShow)
this.TestQuery();$("#qAutoShow").click(function(){shivaLib.qe.autoShow=!shivaLib.qe.autoShow;shivaLib.qe.DrawQuery();});}
SHIVA_QueryEditor.prototype.TestQuery=function()
{var f,q=this.query;if(q.match(/\?/))
q="";for(i=0;i<this.curFields.length;++i){f=this.curFields[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");q=q.replace(RegExp(f,"g"),String.fromCharCode(i+65));}
q=q.replace(/ORDER BY none/g,"");if(this.advancedMode)
q=$("#curQuery").val();var tbl={"chartType":"Table","dataSourceUrl":this.source,"query":q,"shivaGroup":"Data"};$("#testShowDiv").empty();$("#testShowDiv").css("width",$("#dataDialogDiv").css("width"));$("#testShowDiv").css("height","200px");$("#testShowDiv").css("overflow","auto");new SHIVA_Show("testShowDiv",tbl);}
SHIVA_QueryEditor.prototype.AdvancedMode=function(mode)
{this.advancedMode=mode;if(!mode)
this.query="SELECT * WHERE A = * ORDER BY none";this.DrawQuery();if(mode)
$("#curQuery").val(this.query.replace(/ORDER BY none/g,"").replace(/  /g," "));}
SHIVA_QueryEditor.prototype.AddClause=function(clause,subj,pred,obj,last,row)
{var str="<tr valign='top'><td>";if(clause!="IF")
str+=shivaLib.MakeSelect("clause"+row,0,["AND","OR","NOT"],clause,"onchange='shivaLib.qe.SetQueryString()'");else
str+="<b>IF</b>";str+="</td><td>&nbsp;"+shivaLib.MakeSelect("subject"+row,0,this.curFields,subj,"onchange='shivaLib.qe.SetQueryString()'");str+="</td><td>&nbsp;&nbsp;<b>IS&nbsp; </b>"+shivaLib.MakeSelect("predicate"+row,0,["<",">","=","!=","<=",">=","has"],pred,"onchange='shivaLib.qe.SetQueryString()'");str+=" <input type='input' size='8' id='object"+row+"' value='"+obj+"' onchange='shivaLib.qe.SetQueryString()'/>";if(clause=="IF")
str+="&nbsp;<img src='adddot.gif' onclick='shivaLib.qe.AddNewClause("+row+")'style='vertical-align:middle'>";else
str+="&nbsp;<img src='trashdot.gif' onclick='shivaLib.qe.DeleteClause("+row+")' style='vertical-align:middle'>";str+="</td></tr>";$("#pred").val(pred);return str;}
SHIVA_QueryEditor.prototype.AddNewClause=function(num)
{var i=this.query.indexOf(" ORDER BY ");this.query=this.query.substr(0,i)+" AND * = ?"+this.query.substr(i);this.DrawQuery();shivaLib.Sound("ding");}
SHIVA_QueryEditor.prototype.DeleteClause=function(num)
{var v=this.query.split(" ");var n,i,str="";for(n=0;n<v.length;++n)
if(v[n]=="WHERE")
break;n=n+(num*4)
for(i=0;i<n;++i)
str+=v[i]+" ";for(i=n+4;i<v.length;++i)
str+=v[i]+" ";this.query=str;this.DrawQuery();shivaLib.Sound("delete");}
SHIVA_QueryEditor.prototype.SetQueryString=function()
{var i,j,num=0;i=this.query.indexOf(" WHERE ");if(i!=-1){j=this.query.indexOf(" ORDER BY ");var v=this.query.substring(i+7,j).split(" ");num=(v.length+1)/4;}
str="SELECT "
var sel=$("#sel").val();if(sel=="all")
sel="*";str+=sel+" ";if(num)
str+="WHERE ";for(i=0;i<num;++i){if(i)
str+=$("#clause"+i).val()+" ";str+=$("#subject"+i).val()+" ";str+=$("#predicate"+i).val()+" ";str+=$("#object"+i).val();str+=" ";}
str+="ORDER BY "+$("#ord").val();this.query=str;this.DrawQuery();}
var drObj=null;function SHIVA_Draw(container,hidePalette)
{this.container=container;this.color="-1";this.clipboard=new Array();this.edgeColor="#0000ff";this.textColor="#000000";this.boxColor="-1";this.edgeWidth="30";this.arrow=false;this.alpha=100;this.curTool=0;this.imageURL="";this.imageWid=400;this.textAlign="Left";this.textStyle="";this.textSize=0;this.ideaShape="Round box";this.ideaGradient=true;this.ideaBold=false;this.ideaBackCol="#FFF2CC";this.ideaEdgeCol="#999999";this.ideaTextCol="#000000";this.selectedItems=new Array();this.selectedDot=-1;this.segs=new Array();if(shivaLib.overlay)
this.segs=shivaLib.overlay;this.closeOnMouseUp=false;this.curSeg=-1;this.lastDotTime=0;this.snap=false;this.curve=false;this.snapSpan=20;this.leftClick=false;this.lastX=0;this.lastY=0;drObj=shivaLib.dr=this;if(!hidePalette)
this.DrawPalette();this.colorPicker="";if($("#shivaDrawCanvas")[0])
this.ctx=$("#shivaDrawCanvas")[0].getContext('2d');$("#shivaDrawDiv").css("cursor","crosshair");$("#shivaDrawDiv").mouseup(this.onMouseUp);$("#shivaDrawDiv").mousedown(this.onMouseDown);$("#shivaDrawDiv").mousemove(this.onMouseMove);document.onkeyup=this.onKeyUp;document.onkeydown=this.onKeyDown;}
SHIVA_Draw.prototype.Sound=function(snd)
{shivaLib.Sound(snd);}
SHIVA_Draw.prototype.DrawPalette=function(tool)
{this.ctx=$("#shivaDrawCanvas")[0].getContext('2d');var hgt=$("#"+this.container).css("height").replace(/px/g,"");var top=$("#"+this.container).css("top").replace(/px/g,"");if(top=="auto")top=0;var left=$("#"+this.container).css("left").replace(/px/g,"")-0+12;if($("#shivaDrawPaletteDiv").length==0){var h=225;str="<div id='shivaDrawPaletteDiv' style='position:absolute;left:"+left+"px;top:"+(top-12+Number(hgt)-100)+"px;width:180px;height:"+h+"px'>";$("body").append("</div>"+str);$("#shivaDrawPaletteDiv").css({"background-color":"#eee","border-radius":"8px","z-index":2001});$("#shivaDrawPaletteDiv").addClass("propTable");$("#shivaDrawPaletteDiv").draggable();$("#shivaDrawPaletteDiv").css({"-moz-user-select":"none","-khtml-user-select":"none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none"});$("#shivaDrawPaletteDiv")[0].addEventListener('contextmenu',function(ev){ev.preventDefault();window.prompt("To copy graphics to clipboard: Hit Ctrl+C, then press OK",drObj.SaveSVGData());return false;},false);}
this.SetTool(0);this.DrawMenu();}
SHIVA_Draw.prototype.Clear=function()
{shivaLib.overlay=[];this.segs=[];$("#shivaDrawDiv").html("");}
SHIVA_Draw.prototype.ColorPicker=function(name)
{var str="<p style='text-shadow:1px 1px white' align='center'><b>Choose a new color</b></p>";str+="<img src='colorpicker.gif' style='position:absolute;left:15px;top:28px' />";str+="<input id='shivaDrawColorInput' type='text' style='position:absolute;left:22px;top:29px;width:96px;background:transparent;border:none;'>";$("#shivaDrawPaletteDiv").html(str);$("#shivaDrawPaletteDiv").on("click",onColorPicker);this.colorPicker=name;var _this=this;function onColorPicker(e){var col;var cols=["000000","444444","666666","999999","CCCCCC","EEEEEE","E7E7E7","FFFFFF","FF0000","FF9900","FFFF00","00FF00","00FFFF","0000FF","9900FF","FF00FF","F4CCCC","FCE5CD","FFF2CC","D9EAD3","D0E0E3","CFE2F3","D9D2E9","EDD1DC","EA9999","F9CB9C","FFE599","BED7A8","A2C4C9","9FC5E8","B4A7D6","D5A6BD","E06666","F6B26B","FFD966","9C347D","76A5AF","6FA8DC","8E7CC3","C27BA0","CC0000","E69138","F1C232","6AA84F","45818E","3D85C6","674EA7","A64D79","990000","B45F06","BF9000","38761D","134F5C","0B5394","351C75","741B47","660000","783F04","7F6000","274E13","0C343D","073763","20124D","4C1130"];var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;if((x<112)&&(y<55))
return;$("#shivaDrawPaletteDiv").off("click",this.onColorPicker);if((x>112)&&(x<143)&&(y<48)){if($("#shivaDrawColorInput").val())
col="#"+$("#shivaDrawColorInput").val();else
x=135;}
if((x>143)&&(y<48)){_this.DrawMenu();return;}
if(y>193)
col=-1;else if(y>48){x=Math.floor((x-24)/17);y=Math.floor((y-51)/17);col="#"+cols[x+(y*8)];}
_this[_this.colorPicker]=col;if(_this.curTool==5){if(_this.selectedItems.length)
_this.DrawMenu(_this.segs[_this.selectedItems[0]].type);else
_this.DrawMenu(0);_this.SetVal(_this.colorPicker,col);}
else if(_this.curTool==6){_this.SetVal(_this.colorPicker,col);_this.DrawMenu();}
else
_this.DrawMenu();}}
SHIVA_Draw.prototype.DrawMenu=function(tool)
{var preface="Edit ";if(tool==undefined)
tool=this.curTool,preface="Draw ";var titles=["a line","a circle","a box","text","an image",""," an Idea Map"];var str="<p style='text-shadow:1px 1px white' align='center'><b>";str+=preface+titles[tool]+"</b></p>";str+="<img src='closedot.gif' style='position:absolute;left:163px;top:1px' onclick='drObj.SetTool(-1)'/>";str+="<table style='font-size:xx-small'>"
if(tool<3){str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='drObj.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";if(tool==2)
str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='drObj.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";else if(tool==0){str+="<tr><td>&nbsp;&nbsp;Draw curves?</td><td><input onClick='drObj.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Draw arrow?</td><td><input onClick='drObj.SetVal(\"arrow\",this.checked)' type='checkbox' id='arrow'></td></tr>";}
str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"edgeColor\")' onChange='drObj.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Fill color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"color\")' onChange='drObj.SetVal(\"color\",this.value)' type='text' id='color'></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";}
else if(tool==3){str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"boxColor\")' onChange='drObj.SetVal(\"boxColor\",this.value)' type='text' id='boxColor'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='drObj.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Align</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='drObj.SetVal(\"textAlign\",this.value)' id='textAlign'><option>Left</option><option>Right</option><option>Center</option></select></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Text size</td><td><div style='width:82px;margin-left:6px' id='textSize'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"textColor\")' onChange='drObj.SetVal(\"textColor\",this.value)' type='text' id='textColor'></td></tr>";}
else if(tool==4){str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='drObj.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Edge color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"edgeColor\")' onChange='drObj.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Image URL</td><td>&nbsp;<input style='width:85px;height:12px' onChange='drObj.SetVal(\"imageURL\",this.value)' type='text' id='imageURL'></td></tr>";}
else if(tool==6){str+="<tr><td>&nbsp;&nbsp;Shape</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='drObj.SetVal(\"ideaShape\",this.value)' id='ideaShape'><option>Round box</option><option>Rectangle</option><option>Oval</option><option>Circle</option></select></td></tr>";str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"ideaBackCol\")' type='text' id='ideaBackCol'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Gradient?</td><td>&nbsp;<input onClick='drObj.SetVal(\"ideaGradient\",this.checked)' type='checkbox' id='ideaGradient'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"ideaEdgeCol\")' onChange='drObj.SetVal(\"ideaEdgeCol\",this.value)' type='text' id='ideaEdgeCol'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"ideaTextCol\")' onChange='drObj.SetVal(\"ideaTextCol\",this.value)' type='text' id='ideaTextCol'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Bold text?</td><td>&nbsp;<input onClick='drObj.SetVal(\"ideaBold\",this.checked)' type='checkbox' id='ideaBold'></td></tr>";str+="<tr><td colspan='2' style='text-align:center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='font-size:x-small' onclick='drObj.AddIdea(-1)'>Add base idea</button></td></tr>";}
str+="</table><br/>";str+="<div style='position:absolute;left:14px;top:194px'><span id='drawToolbar' style='font-size:xx-small'>";str+="<input type='radio' id='sdtb6' name='draw' onclick='drObj.SetTool(5)'/><label for='sdtb6'>Select</label>";str+="<input type='radio' id='sdtb3' name='draw' onclick='drObj.SetTool(2)'/><label for='sdtb3'>Box</label>";str+="<input type='radio' id='sdtb2' name='draw' onclick='drObj.SetTool(1)'/><label for='sdtb2'>Circle</label>";str+="<input type='radio' id='sdtb1' name='draw' onclick='drObj.SetTool(0)'/><label for='sdtb1'>Line</label>";str+="<input type='radio' id='sdtb4' name='draw' onclick='drObj.SetTool(3)'/><label for='sdtb4'>A</label>";str+="<input type='radio' id='sdtb5' name='draw' onclick='drObj.SetTool(4)'/><label for='sdtb5'>Image</label>";str+="<input type='radio' id='sdtb7' name='draw' onclick='drObj.SetTool(6)'/><label for='sdtb7'>Idea</label>";str+="</span></div>";$("#shivaDrawPaletteDiv").html(str);$("#shivaDrawPaletteDiv").css("font-size","xx-small");$("#sdtb"+(this.curTool+1)).attr("checked","checked");$("#drawToolbar").buttonset();$("#sdtb1").button({text:false,icons:{primary:"ui-icon-pencil"}});$("#sdtb2").button({text:false,icons:{primary:"ui-icon-radio-on"}});$("#sdtb3").button({text:false,icons:{primary:"ui-icon-circlesmall-plus"}});$("#sdtb4").button({text:true});$("#sdtb5").button({text:false,icons:{primary:"ui-icon-image"}});$("#sdtb6").button({text:false,icons:{primary:"ui-icon-arrowthick-1-nw"}}).css("width","100");$("#sdtb7").button({text:false,icons:{primary:"ui-icon-lightbulb"}}).css("width","100");$("#alpha").slider({slide:function(event,ui){drObj.SetVal("alpha",ui.value);}});$("#edgeWidth").slider({slide:function(event,ui){drObj.SetVal("edgeWidth",ui.value);}});$("#textSize").slider({slide:function(event,ui){drObj.SetVal("textSize",ui.value);}});$("#alpha .ui-slider-handle").css("border","1px solid #888");$("#edgeWidth .ui-slider-handle").css("border","1px solid #888");$("#textSize .ui-slider-handle").css("border","1px solid #888");this.SetMenuProperties();}
SHIVA_Draw.prototype.SetMenuProperties=function()
{var col,tcol,txt;tcol=txt=col=this.color;gradient=true;if(col==-1)col="#fff",tcol="000",txt='none';$("#color").css("background-color",col);$("#color").css("color",tcol);$("#color").val(txt);tcol=txt=col=this.edgeColor;if(col==-1)col="#fff",tcol="000",txt='none';$("#edgeColor").css("background-color",col);$("#edgeColor").css("color",tcol);$("#edgeColor").val(txt);tcol=txt=col=this.textColor;if(col==-1)col="#fff",tcol="000",txt='none';$("#textColor").css("background-color",col);$("#textColor").css("color",tcol);$("#textColor").val(txt);tcol=txt=col=this.boxColor;if(col==-1)col="#fff",tcol="000",txt='none';$("#boxColor").css("background-color",col);$("#boxColor").css("color",tcol);$("#boxColor").val(txt);$("#snap").attr("checked",this.snap);$("#curve").attr("checked",this.curve);$("#arrow").attr("checked",this.arrow);$("#edgeWidth").slider("value",this.edgeWidth);$("#alpha").slider("value",this.alpha);$("#textSize").slider("value",this.textSize);$("#textAlign").val(this.textAlign);$("#imageURL").val(this.imageURL);$("#edgeWidth").val(this.edgeWidth);$("#ideaShape").val(this.ideaShape);$("#ideaBackCol").val(this.ideaBackCol);$("#ideaGradient").attr("checked",this.ideaGradient);$("#ideaBold").attr("checked",this.ideaBold);tcol=txt=col=this.ideaBackCol;if(col==-1)col="#fff",tcol="000",txt='none';$("#ideaBackCol").val(txt);$("#ideaBackCol").css("background-color",col);$("#ideaBackCol").css("color",tcol);tcol=txt=col=this.ideaEdgeCol;if(col==-1)col="#fff",tcol="000",txt='none';$("#ideaEdgeCol").val(txt);$("#ideaEdgeCol").css("background-color",col);$("#ideaEdgeCol").css("color",tcol);tcol=txt=col=this.ideaTextCol;if(col==-1)col="#fff",tcol="000",txt='none';$("#ideaTextCol").val(txt);$("#ideaTextCol").css("background-color",col);$("#ideaTextCol").css("color",tcol);}
SHIVA_Draw.prototype.DrawOverlay=function(num)
{shivaLib.overlay=this.segs;shivaLib.Draw({shivaGroup:"Draw"});}
SHIVA_Draw.prototype.SetShivaText=function(text,num)
{this.segs[num].text=text;}
SHIVA_Draw.prototype.SaveDrawData=function(json)
{var i,o,key,str="",str1;for(i=0;i<this.segs.length;++i){o=this.segs[i];if(json)
str+="\t\"draw-"+(i+1)+"\":\"";else
str+="&draw-"+(i+1)+"=";for(key in o){str1=String(o[key]);if(str1)
str+=key+":"+str1.replace(/\n/g,"|").replace(/\r/g,"").replace(/\:/g,"`").replace(/#/g,"~")+";";}
str=str.substring(0,str.length-1);if(json)
str+="\",\n";}
return str;}
SHIVA_Draw.prototype.SaveSVGData=function()
{var i,j,o,x,y,e;var w=$("#shivaDrawDiv").width();var h=$("#shivaDrawDiv").height();var str="<svg width='100%' height='100%' viewBox='0 0 "+w+" "+h+"'>\n";for(i=0;i<drObj.segs.length;++i){o=drObj.segs[i];e=Math.max((o.edgeWidth/10),.5);if(o.type==0){if(o.arrow){var aa=Math.atan2(o.y[n]-o.y[n-1],o.x[n]-o.x[n-1]);var xx=[],yy=[];var n=o.x.length-1;var aa=Math.atan2(o.y[n]-o.y[n-1],o.x[n]-o.x[n-1]);var hh=o.edgeWidth/2;xx[0]=o.x[n]-hh*Math.cos(aa-Math.PI/6),yy[0]=o.y[n]-hh*Math.sin(aa-Math.PI/6);xx[1]=o.x[n];yy[1]=o.y[n];xx[2]=o.x[n]-hh*Math.cos(aa+Math.PI/6),yy[2]=o.y[n]-hh*Math.sin(aa+Math.PI/6);o.x[n]=((xx[2]-xx[0])/2)+xx[0];o.y[n]=((yy[2]-yy[0])/2)+yy[0];}
str+="<path style='fill:";if(o.color!=-1)str+=o.color+";";else str+="none;"
if(o.edgeColor!=-1){str+="stroke:"+o.edgeColor;str+=";stroke-width:"+e+";";}
str+="opacity:"+(o.alpha/100)+"' d='M";str+=o.x[0]+",";str+=o.y[0]+" ";if(o.curve){var open=true;if((Math.abs(o.x[0]-o.x[o.x.length-1])<3)&&(Math.abs(o.y[0]-o.y[o.y.length-1])<3)){o.x[x.length-1]=o.x[0];o.y[y.length-1]=o.y[0];open=false;}
x=o.x[0]-0+((o.x[1]-o.x[0])/2)-0;y=o.y[0]-0+((o.y[1]-o.y[0])/2)-0;if(open){str+="L"+x+",";str+=y+" ";}
for(j=1;j<o.x.length-1;++j){x=o.x[j]-0+((o.x[j+1]-o.x[j])/2)-0;y=o.y[j]-0+((o.y[j+1]-o.y[j])/2)-0;str+="Q";str+=o.x[j]+",";str+=o.y[j]+" ";str+=x+",";str+=y+" ";}
if(open){str+="L"+o.x[j]+",";str+=o.y[j]+" ";}}
else{for(j=1;j<o.x.length;++j){str+="L";str+=o.x[j]+",";str+=o.y[j]+" ";}}
if(o.color!=-1)str+="Z"
str+="'/>\n";if((o.x)&&(o.arrow)){o.x[n]=xx[1];o.y[n]=yy[1];str+="<path style='fill:"+o.edgeColor;str+=";opacity:"+(o.alpha/100)+"' d='M";str+=xx[0];str+=","+yy[0];str+=" L"+xx[1]+",";str+=yy[1];str+=" L"+xx[2];str+=","+yy[2];str+=" Z'/>\n";}}
else if(o.type==1){x=Math.abs(o.x[1]-o.x[0]);str+="<circle r='"+x+"' ";x=o.x[0];y=o.y[0];str+="cx='"+x+"' cy='"+y+"' style='fill:";if(o.color!=-1)str+=o.color+";";else str+="none;"
if(o.edgeColor!=-1){str+="stroke:"+o.edgeColor;str+=";stroke-width:"+e+";";}
str+="opacity:"+(o.alpha/100)+"'";str+="/>\n";}
else if(o.type==2){x=Math.abs(o.x[1]-o.x[0]);y=Math.abs(o.y[1]-o.y[0]);str+="<rect width='"+x+"' height='"+y+"' ";x=o.x[0];y=o.y[0];str+="x='"+x+"' y='"+y+"' style='fill:";if(o.color!=-1)str+=o.color+";";else str+="none;"
if(o.edgeColor!=-1){str+="stroke:"+o.edgeColor;str+=";stroke-width:"+e+";";}
str+="opacity:"+(o.alpha/100)+"'";if(o.curve)str+=" rx='10' ry='10'";str+="/>\n";}
else if(o.type==3){var th=(o.textSize/2)-0+10;if(o.boxColor!=-1){x=Math.abs(o.x[1]-o.x[0]);y=Math.abs(o.y[1]-o.y[0]);str+="<rect width='"+x+"' height='"+y+"' ";x=o.x[0];y=o.y[0];str+="x='"+x+"' y='"+y+"' style='fill:"+o.boxColor;str+=";opacity:"+(o.alpha/100)+"'";if(o.curve)str+=" rx='10' ry='10'";str+="/>\n";}
x=o.x[0]+10;e="start";if(o.textAlign=="Right")x=o.x[1]-10,e="end";if(o.textAlign=="Center")x=o.x[0]-0+Math.abs(o.x[1]-o.x[0])/2,e="middle";x=x;y=((o.y[0])+th+1);str+="<text x='"+x+"' y='"+y+"' ";str+="style='opacity:"+(o.alpha/100);str+=";text-anchor:"+e+";fill:"+o.textColor;str+=";font-family:sans-serif;font-size:"+th+"'>";str+=o.text;str+="</text>\n";}
else if(o.type==4){x=Math.abs(o.x[1]-o.x[0]);y=Math.abs(o.y[1]-o.y[0]);str+="<image width='"+x+"' height='"+y+"' ";x=o.x[0];y=o.y[0];str+="x='"+x+"' y='"+y+"' style='";str+="opacity:"+(o.alpha/100)+"'";str+=" xlink:href='"+o.imageURL+"'";str+="/>\n";if(o.edgeColor!=-1){x=Math.abs(o.x[1]-o.x[0]);y=Math.abs(o.y[1]-o.y[0]);str+="<rect width='"+x+"' height='"+y+"' ";x=o.x[0];y=o.y[0];str+="x='"+x+"' y='"+y+"' style='";str+="fill:none;stroke:"+o.edgeColor;str+=";stroke-width:"+e+";";str+=";opacity:"+(o.alpha/100)+"'";str+="/>\n";}}}
str+="</g></svg>";return str;}
SHIVA_Draw.prototype.DrawWireframes=function(clear)
{var o,i,col,scol;if(clear)
this.ctx.clearRect(0,0,1000,1000);for(i=0;i<this.segs.length;++i){col="#777";for(j=0;j<this.selectedItems.length;++j)
if(this.selectedItems[j]==i){col="#ff0000";break;}
o=this.segs[i];if((o.type==5)||(!o.x))
continue;if(o.type==3)
shivaLib.g.DrawBar(this.ctx,-1,1,o.x[0],o.y[0],o.x[1],o.y[1],col,1);for(j=0;j<o.x.length;++j){scol="#fff";if((this.selectedDot==j)&&(col=="#ff0000"))
scol=col;shivaLib.g.DrawCircle(this.ctx,scol,1,o.x[j],o.y[j],4,col,1);}}}
SHIVA_Draw.prototype.AddDot=function(x,y,up)
{var o;if(this.curSeg==-1){if(this.curTool&&up)
return;if(new Date().getTime()-this.lastDotTime<100)
return;o=new Object;o.type=this.curTool;o.x=new Array();o.y=new Array();o.alpha=this.alpha;o.curve=this.curve;if(o.type<3){o.color=this.color;o.edgeColor=this.edgeColor;o.edgeWidth=this.edgeWidth;o.arrow=this.arrow;}
if(o.type==3){o.boxColor=this.boxColor;o.textColor=this.textColor;o.textAlign=this.textAlign;o.textSize=this.textSize;o.text="Click to edit";}
if(o.type==4){o.edgeColor=this.edgeColor;o.edgeWidth=this.edgeWidth;o.imageURL=this.imageURL;}
o.x.push(x);o.y.push(y);this.lastX=x;this.lastY=y;this.segs.push(o);this.curSeg=this.segs.length-1;this.lastDotTime=new Date().getTime();return;}
if(this.curTool==0){this.segs[this.curSeg].x.push(x);this.segs[this.curSeg].y.push(y);this.lastX=x;this.lastY=y;this.lastDotTime=new Date().getTime();}
else{if((Math.abs(this.lastX-x)<2)&&(Math.abs(this.lastX-x)<2)){$("#shtx"+this.curSeg).remove();this.segs.pop(0);this.curSeg=-1;}
else{o=this.segs[this.curSeg];if(this.curTool==3){x=Math.max(x,o.x[o.x.length-1]+100);y=Math.max(y,o.y[o.y.length-1]+40);}
o.x.push(x);o.y.push(y);this.curSeg=-1;}}
this.DrawOverlay();}
SHIVA_Draw.prototype.SetVal=function(prop,val)
{if((""+prop).match(/olor/)){if((""+val).match(/none/))
val=-1;if((val!=-1)&&(!(""+val).match(/#/)))
val="#"+val;}
var num=this.curSeg;this[prop]=val;if((this.curTool<3)&&(num!=-1)){this.segs[num].curve=this.curve;this.segs[num].arrow=this.arrow;this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].alpha=this.alpha;this.segs[num].color=this.color;this.DrawOverlay();}
if((this.curTool==3)&&(num!=-1)){this.segs[num].curve=this.curve;this.segs[num].boxColor=this.boxColor;this.segs[num].textSize=this.textSize;this.segs[num].textColor=this.textColor;this.segs[num].textAlign=this.textAlign;this.segs[num].alpha=this.alpha;}
if((this.curTool==4)&&(num!=-1)){this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].alpha=this.alpha;this.segs[num].imageURL=this.imageURL;}
else if(this.curTool==5){for(var i=0;i<this.selectedItems.length;++i){num=this.selectedItems[i];this.segs[num].alpha=this.alpha;this.segs[num].curve=this.curve;if(this.segs[num].type<3){this.segs[num].color=this.color;this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].arrow=this.arrow;}
else if(this.segs[num].type==3){this.segs[num].boxColor=this.boxColor;this.segs[num].textColor=this.textColor;this.segs[num].textAlign=this.textAlign;this.segs[num].textSize=this.textSize;}
else if(this.segs[num].type==4){this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].alpha=this.alpha;this.segs[num].imageURL=this.imageURL;}}
this.DrawOverlay();this.DrawWireframes(false);}
else if(this.curTool==6){for(var i=0;i<this.selectedItems.length;++i){num=this.selectedItems[i];this.segs[num].ideaBackCol=this.ideaBackCol;this.segs[num].ideaEdgeCol=this.ideaEdgeCol;this.segs[num].ideaTextCol=this.ideaTextCol;this.segs[num].ideaGradient=this.ideaGradient;this.segs[num].ideaBold=this.ideaBold;this.segs[num].ideaShape=this.ideaShape;}
this.DrawOverlay();}}
SHIVA_Draw.prototype.SetTool=function(num)
{$("#shivaDrawDiv").css('pointer-events','auto');this.curTool=num;if(num==6)
$("#shivaDrawDiv").css("cursor","auto");else
$("#shivaDrawDiv").css("cursor","crosshair");if(this.curTool==-1){this.Sound("delete");$("#shivaDrawDiv").css("cursor","auto");$("#shivaDrawDiv").css('pointer-events','none');$("#shivaDrawPaletteDiv").remove();if(shivaLib)
shivaLib.SendShivaMessage("ShivaDraw=done");}
else
this.Sound("click");this.DrawOverlay()
this.curSeg=-1;if(this.curTool==5){this.selectedItems=[];if(this.segs.length>0){var s=this.segs.length-1;this.AddSelect(-1,s,false);this.DrawMenu(this.segs[s].type);}
$("#shivaDrawDiv").css("cursor","auto");this.DrawWireframes(false);}
else if(this.curTool!=-1)
this.DrawMenu();}
SHIVA_Draw.prototype.onMouseUp=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return true;if(drObj.curTool==5)
e.stopPropagation();drObj.leftClick=false;var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;if(e.shiftKey){if(Math.abs(x-drObj.lastX)>Math.abs(y-drObj.lastY))
y=drObj.lastY;else
x=drObj.lastX;}
if(drObj.closeOnMouseUp){drObj.closeOnMouseUp=false;drObj.curSeg=-1;return true;}
if(drObj.curTool<5){if(drObj.snap)
x=x-(x%drObj.snapSpan),y=y-(y%drObj.snapSpan);if((drObj.curTool)&&(e.target.id.indexOf("shtx")==-1))
drObj.AddDot(x,y,true);}
else if(drObj.curTool>4)
drObj.AddSelect(x,y,e.shiftKey);return(drObj.curTool==6);}
SHIVA_Draw.prototype.onMouseDown=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if(drObj.curTool==6)
return true;var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;drObj.leftClick=true;drObj.closeOnMouseUp=false;if(drObj.snap)
x=x-(x%drObj.snapSpan),y=y-(y%drObj.snapSpan);if(drObj.curTool==5){drObj.lastX=x;drObj.lastY=y;e.stopPropagation();return false;}
if(e.target.id.indexOf("shtx")!=-1)
return;if(drObj.snap)
x=x-(x%drObj.snapSpan),y=y-(y%drObj.snapSpan);drObj.AddDot(x,y,false);return false;}
SHIVA_Draw.prototype.onMouseMove=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if((drObj.curTool==6)||(drObj.curTool==-1))
return;var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;if(drObj.snap)
x=x-(x%drObj.snapSpan),y=y-(y%drObj.snapSpan);if((drObj.leftClick)&&(drObj.curTool==5)){var dx=drObj.lastX-x;var dy=drObj.lastY-y;drObj.MoveSegs(dx,dy,0);drObj.lastX=x;drObj.lastY=y;return;}
if(drObj.curSeg!=-1){if(drObj.curTool!=5)
drObj.DrawOverlay();if(e.shiftKey){if(Math.abs(x-drObj.lastX)>Math.abs(y-drObj.lastY))
y=drObj.lastY;else
x=drObj.lastX;}
if(drObj.curTool==0)
shivaLib.g.DrawLine(drObj.ctx,"#000",1,drObj.lastX,drObj.lastY,x,y,1);else if((drObj.leftClick)&&(drObj.curTool==1))
shivaLib.g.DrawCircle(drObj.ctx,-1,1,drObj.lastX,drObj.lastY,Math.abs(x-drObj.lastX),"#999",1);else if((drObj.leftClick)&&(drObj.curTool<5))
shivaLib.g.DrawBar(drObj.ctx,-1,1,drObj.lastX,drObj.lastY,x,y,"#999",1);if((drObj.leftClick)&&(drObj.curTool==0)){if(new Date().getTime()-drObj.lastDotTime>100){drObj.AddDot(x,y);drObj.closeOnMouseUp=true;}}}}
SHIVA_Draw.prototype.onKeyDown=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if((e.keyCode==8)&&(e.target.tagName!="TEXTAREA")&&(e.target.tagName!="INPUT")){e.stopPropagation();return false;}}
SHIVA_Draw.prototype.onKeyUp=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if((e.which==83)&&(e.ctrlKey)&&(e.altKey)){shivaLib.SaveData("eStore");return;}
var i;if((e.target.tagName=="TEXTAREA")||(e.target.tagName=="INPUT"))
return;if((e.which==67)&&(e.ctrlKey)){if(drObj.selectedItems.length){drObj.Sound("click");drObj.clipboard=[];}
for(i=0;i<drObj.selectedItems.length;++i)
drObj.clipboard.push(shivaLib.Clone(drObj.segs[drObj.selectedItems[i]]));}
if((e.which==86)&&(e.ctrlKey)){if(drObj.clipboard.length){drObj.selectedItems=[];drObj.Sound("ding");for(i=0;i<drObj.clipboard.length;++i){drObj.selectedItems.push(drObj.segs.length);drObj.segs.push(shivaLib.Clone(drObj.clipboard[i]));}}}
if(drObj.curTool==6){num=drObj.selectedItems[0];if(((e.which==8)||(e.which==46))&&(num!=-1))
drObj.DeleteIdea();}
var num=drObj.curSeg;if(((e.which==8)||(e.which==46))&&(num!=-1)){var o=drObj.segs[num];o.x.pop();o.y.pop();drObj.lastX=o.x[o.x.length-1];drObj.lastY=o.y[o.y.length-1];drObj.DrawOverlay();drObj.Sound("delete");}
if((e.which==27)&&(num!=-1)){drObj.curSeg=-1;drObj.Sound("dclick");}
else if(drObj.curTool==5){if((e.which==8)||(e.which==46)){if(drObj.selectedItems.length){num=drObj.selectedItems[0];if((drObj.selectedDot!=-1)&&(drObj.segs[num].type==0)){drObj.segs[num].x.splice(drObj.selectedDot,1);drObj.segs[num].y.splice(drObj.selectedDot,1);}
else if(e.target.id.indexOf("shtx")==-1)
for(var i=0;i<drObj.selectedItems.length;++i){$("#shtx"+drObj.selectedItems[i]).remove();$("#shim"+drObj.selectedItems[i]).remove();drObj.segs.splice(drObj.selectedItems[i],1);}
drObj.DrawOverlay();drObj.DrawWireframes(false);drObj.Sound("delete");}}
else if((e.which==40)&&(e.shiftKey))drObj.MoveSegs(0,0,-1);else if((e.which==38)&&(e.shiftKey))drObj.MoveSegs(0,0,1);else if(e.which==39)drObj.MoveSegs(-1,0,0);else if(e.which==37)drObj.MoveSegs(1,0,0);else if(e.which==40)drObj.MoveSegs(0,-1,0);else if(e.which==38)drObj.MoveSegs(0,1,0);}}
SHIVA_Draw.prototype.AddSelect=function(x,y,shiftKey)
{var i,j,o,seg=-1,asp;var oldDot=this.selectedDot;this.selectedDot=-1;var last=this.selectedItems[0];if(x!=-1){if(!shiftKey){this.selectedItems=[];$("#shivaDrawDiv").css("cursor","auto");}
if(this.curTool==6){for(i=0;i<this.segs.length;++i){o=this.segs[i];if(o.type!=5)
continue;var d=$("#shivaIdea"+i);if((x>o.ideaLeft)&&(x<Number(o.ideaLeft)+Number(d.width())+16)&&(y>o.ideaTop)&&(y<Number(o.ideaTop)+Number(d.height())+16)){this.selectedItems.push(i);this.ideaShape=o.ideaShape;this.ideaBackCol=o.ideaBackCol;this.ideaGradient=o.ideaGradient;this.ideaEdgeCol=o.ideaEdgeCol;this.ideaTextCol=o.ideaTextCol;this.ideaBold=o.ideaBold;this.SetMenuProperties();this.selectedItems[0]=i;break;}}
this.HighlightIdea();return;}
for(i=0;i<this.segs.length;++i){o=this.segs[i];if((!o.x)||(o.type==5))
continue;for(j=0;j<o.x.length;++j)
if((x>o.x[j]-6)&&(x<o.x[j]+6)&&(y>o.y[j]-6)&&(y<o.y[j]+6)){if(last==i)
this.selectedDot=j;seg=i;break;}}
if(seg==-1){for(i=0;i<this.segs.length;++i){var minx=99999,maxx=0,miny=99999,maxy=0;o=this.segs[i];if(o.type==5)
continue;if(o.type==1){j=Math.abs(o.x[1]-o.x[0]);minx=o.x[0]-j;maxx=o.x[1];miny=o.y[0]-j;maxy=Number(o.y[0])+j;}
else
for(j=0;j<o.x.length;++j){minx=Math.min(minx,o.x[j]);miny=Math.min(miny,o.y[j]);maxx=Math.max(maxx,o.x[j]);maxy=Math.max(maxy,o.y[j]);}
if((x>minx)&&(x<maxx)&&(y>miny)&&(y<maxy)){seg=i;break;}}}}
else
seg=y;if(seg!=-1){o=this.segs[seg];if(this.selectedDot!=-1){$("#shivaDrawDiv").css("cursor","crosshair");if(oldDot!=this.selectedDot)
drObj.Sound("dclick");}
else{$("#shivaDrawDiv").css("cursor","move");drObj.Sound("click");}
this.selectedItems.push(seg);this.alpha=o.alpha;this.curve=o.curve;if(o.type<3){this.arrow=o.arrow;this.curve=o.curve;this.color=o.color;this.edgeColor=o.edgeColor;this.edgeWidth=o.edgeWidth;}
else if(o.type==3){this.curve=o.curve;this.textColor=o.textColor;this.boxColor=o.boxColor;this.textSize=o.textSize;this.textAlign=o.textAlign;}
else if(o.type==4){o=this.segs[seg];asp=$("#shimi"+seg).height()/$("#shimi"+seg).width();if(!asp)asp=1;if(!isNaN(asp))
o.y[1]=o.y[0]+(Math.abs(o.x[1]-o.x[0])*asp);this.edgeColor=o.edgeColor;this.edgeWidth=o.edgeWidth;this.DrawOverlay();}
this.DrawMenu(o.type);this.SetMenuProperties();}
this.DrawWireframes(false);}
SHIVA_Draw.prototype.MoveSegs=function(dx,dy,dz)
{var i,j,o,oo;for(i=0;i<this.selectedItems.length;++i){o=this.segs[this.selectedItems[i]];if(o.type==5)
continue;if(dz){if((this.selectedItems[i]+dz<0)||(this.selectedItems[i]+dz>=this.segs.length)){drObj.Sound("delete");continue;}
oo=this.segs[this.selectedItems[i]+dz];this.segs[this.selectedItems[i]+dz]=o;this.segs[this.selectedItems[i]]=oo;this.selectedItems[i]+=dz;drObj.Sound("click");}
if(this.selectedDot!=-1)
o.x[this.selectedDot]-=dx,o.y[this.selectedDot]-=dy;else
for(j=0;j<o.x.length;++j)
o.x[j]-=dx,o.y[j]-=dy;}
this.DrawOverlay();this.DrawWireframes(false);}
SHIVA_Draw.prototype.AddIdea=function(num)
{var i,off=0;var o=new Object;if((num!=-1)&&(this.selectedItems.length))
num=this.selectedItems[0]
o.type=5;o.id=this.segs.length;o.ideaParent=num;o.ideaShape=this.ideaShape;o.ideaBackCol=this.ideaBackCol;o.ideaGradient=this.ideaGradient;o.ideaBold=this.ideaBold;o.ideaEdgeCol=this.ideaEdgeCol;o.ideaTextCol=this.ideaTextCol;o.text="A new idea";o.ideaHgt=21;o.ideaWid=100;if(num==-1){o.ideaLeft=$("#shivaDrawDiv").width()/2;o.ideaTop=$("#shivaDrawDiv").height()/2;}
else{for(i=0;i<this.segs.length;++i)
if(this.segs[i].ideaParent==num)
off+=10;o.ideaLeft=this.segs[num].ideaLeft+off;o.ideaTop=(Number(this.segs[num].ideaTop)+Number(this.segs[num].ideaHgt)+32+off);}
num=this.selectedItems[0]=this.segs.length;;this.segs.push(o);this.Sound("ding");this.DrawOverlay();}
SHIVA_Draw.prototype.HighlightIdea=function()
{var i,dd;$("#shivaIdeaAddBut").remove();for(i=0;i<this.segs.length;++i){var wid=1;dd="#shivaIdea"+i;if(this.segs[i].ideaEdgeCol==-1)
$(dd).css("border","none");else
$(dd).css("border",wid+"px solid "+this.segs[i].ideaEdgeCol);}
if(this.selectedItems.length){dd="#shivaIdea"+this.selectedItems[0];$(dd).css("border","1px dashed red");var x=$(dd).width()/2;var y=$(dd).height();var str="<div id='shivaIdeaAddBut' style='position:absolute;top:"+y+"px;left:"+x+"px'><img src='adddot.gif' title='Add child idea' onmouseup='drObj.AddIdea(0)'></div>"
$(dd).append(str);}}
SHIVA_Draw.prototype.DeleteIdea=function()
{if(!this.selectedItems.length)
return;num=this.selectedItems[0];if(this.segs[num].ideaParent!=-1){this.Sound("click");this.segs[num].ideaParent=-1;}
else{this.selectedItems=[];$("#shivaIdea"+num).remove();this.segs.splice(num,1);this.DeleteIdeaChildren(num);this.Sound("delete");}
this.DrawOverlay();}
SHIVA_Draw.prototype.DeleteIdeaChildren=function(parent)
{var i;for(i=0;i<this.segs.length;++i){if(this.segs[i].type!=5)
continue;if(this.segs[i].ideaParent==parent){var id=this.segs[i].id;$("#shivaIdea"+id).remove();this.segs.splice(i,1);this.DeleteIdeaChildren(id);this.DeleteIdeaChildren(parent);break;}}}
SHIVA_Draw.prototype.MoveIdeaChildren=function(parent,dx,dy)
{var i;for(i=0;i<this.segs.length;++i){if(this.segs[i].type!=5)
continue;if(this.segs[i].ideaParent==parent){this.segs[i].ideaLeft=Number(this.segs[i].ideaLeft)+Number(dx);this.segs[i].ideaTop=Number(this.segs[i].ideaTop)+Number(dy);$("#shivaIdea"+i).css("left",this.segs[i].ideaLeft+"px").css("top",this.segs[i].ideaTop+"px");this.MoveIdeaChildren(i,dx,dy);}}}
SHIVA_Draw.prototype.IdeaDrop=function(from,to)
{this.segs[from].ideaParent=to;this.Sound("ding");}
function SHIVA_Graphics()
{this.shadowOffX=this.shadowOffY=this.curShadowCol=this.curShadowBlur=0;this.composite="source-over";}
SHIVA_Graphics.prototype.CreateCanvas=function(id,con,wid,hgt,left,top)
{var str="<canvas id='"+id+"' ";if(wid)str+="width='"+wid+"px' ";if(hgt)str+="height='"+hgt+"px' ";str+="/>";var mc=$(str).appendTo("#"+con);if(left||top)
mc.style.position="absolute";if(left)mc.style.left=left;if(top)mc.style.top=top;return mc;}
SHIVA_Graphics.prototype.DeleteCanvas=function(id)
{var mc=null;if(typeof(id)=="object")
mc=id;else
mc=document.getElementById(id);if(mc)
document.body.removeChild(mc);}
SHIVA_Graphics.prototype.Compositing=function(ctx,compositeMode,alpha)
{ctx.globalCompositeOperation=this.composite=compositeMode;if(alpha!=undefined)
ctx.globalAlpha=this.alpha=alpha;}
SHIVA_Graphics.prototype.DrawBar=function(ctx,col,alpha,x1,y1,x2,y2,edgeCol,edgeWid)
{ctx.globalAlpha=alpha;if(col!=-1){ctx.fillStyle=col;ctx.fillRect(x1,y1,x2-x1,y2-y1);}
if(edgeWid){ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;ctx.strokeRect(x1,y1,x2-x1,y2-y1);}}
SHIVA_Graphics.prototype.DrawRoundBar=function(ctx,col,alpha,x1,y1,x2,y2,rad,edgeCol,edgeWid)
{ctx.beginPath();ctx.globalAlpha=alpha;ctx.moveTo(x1+rad,y1);ctx.lineTo(x2-rad,y1);ctx.arcTo(x2,y1,x2,y1+8,rad);ctx.lineTo(x2,y2-rad);ctx.arcTo(x2,y2,x2-rad,y2,rad);ctx.lineTo(x1+rad,y2);ctx.arcTo(x1,y2,x1,y2-rad,rad);ctx.lineTo(x1,y1+rad);ctx.arcTo(x1,y1,x1+rad,y1,rad);if(col!=-1){ctx.fillStyle=col;ctx.fill();}
if(edgeWid){ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;ctx.stroke();}
ctx.closePath();}
SHIVA_Graphics.prototype.DrawLine=function(ctx,col,alpha,x1,y1,x2,y2,edgeWid)
{ctx.beginPath();ctx.globalAlpha=alpha;ctx.lineWidth=edgeWid;ctx.strokeStyle=col;ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.closePath();}
SHIVA_Graphics.prototype.DrawRubberLine=function(ctx,x1,y1,x2,y2,edgeWid)
{ctx.globalCompositeOperation="xor";ctx.beginPath();ctx.globalAlpha=1;ctx.lineWidth=1;ctx.strokeStyle="#000";ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.closePath();ctx.globalCompositeOperation="source-over";}
SHIVA_Graphics.prototype.DrawRubberBox=function(ctx,x1,y1,x2,y2,edgeWid)
{ctx.globalCompositeOperation="xor";ctx.beginPath();ctx.globalAlpha=1;ctx.lineWidth=1;ctx.strokeStyle="#000";ctx.strokeRect(x1,y1,x2-x1,y2-y1);ctx.globalCompositeOperation="source-over";}
SHIVA_Graphics.prototype.DrawCircle=function(ctx,col,alpha,cx,cy,rad,edgeCol,edgeWid)
{ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2,false);ctx.globalAlpha=alpha;if(col!=-1){ctx.fillStyle=col;ctx.fill();}
if(edgeWid){ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;ctx.stroke();}
ctx.closePath();}
SHIVA_Graphics.prototype.DrawWedge=function(ctx,col,alpha,cx,cy,rad,start,end,edgeCol,edgeWid)
{var span=end-start;if(!span)
return;ctx.beginPath();if(span<360)
ctx.moveTo(cx,cy);ctx.arc(cx,cy,rad,(start/360)*Math.PI*2,(end/360)*Math.PI*2,false);if(span<360)
ctx.lineTo(cx,cy);ctx.globalAlpha=alpha;if(col!=-1){ctx.fillStyle=col;ctx.fill();}
if(edgeWid){ctx.lineCap="round";ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;ctx.stroke();}
ctx.closePath();}
SHIVA_Graphics.prototype.DrawTriangle=function(ctx,col,alpha,x,y,wid,dir)
{var wid2=(wid*4.0/5.0)>>0;ctx.beginPath();ctx.globalAlpha=alpha;ctx.fillStyle=col;if(dir=="up"){ctx.moveTo(x,y-wid2);ctx.lineTo(x+wid,y+wid2);ctx.lineTo(x-wid,y+wid2);ctx.lineTo(x,y-wid2);}
else if(dir=="right"){ctx.moveTo(x-wid2,y-wid);ctx.lineTo(x+wid2,y);ctx.lineTo(x-wid2,y+wid);ctx.lineTo(x-wid2,y-wid);}
else if(dir=="down"){ctx.moveTo(x-wid,y-wid2);ctx.lineTo(x+wid,y-wid2);ctx.lineTo(x,y+wid2);ctx.lineTo(x-wid,y-wid2);}
else if(dir=="left"){ctx.moveTo(x-wid2,y);ctx.lineTo(x+wid2,y-wid);ctx.lineTo(x+wid2,y+wid);ctx.lineTo(x-wid2,y);}
ctx.fill();ctx.closePath();}
SHIVA_Graphics.prototype.DrawPolygon=function(ctx,col,alpha,x,y,edgeCol,edgeWid,smooth)
{var n=x.length;ctx.beginPath();ctx.moveTo(x[0],y[0]);ctx.globalAlpha=alpha;var open=true;if((Math.abs(x[0]-x[x.length-1])<3)&&(Math.abs(y[0]-y[y.length-1])<3)){x[x.length-1]=x[0];y[y.length-1]=y[0];open=false;}
if(smooth){var x1=x[0]-0+((x[1]-x[0])/2)-0;var y1=y[0]-0+((y[1]-y[0])/2)-0;if(open)
ctx.lineTo(x1,y1);for(i=1;i<n-1;++i){x1=x[i]-0+((x[i+1]-x[i])/2)-0;y1=y[i]-0+((y[i+1]-y[i])/2)-0;ctx.quadraticCurveTo(x[i],y[i],x1,y1);}
if(open)
ctx.lineTo(x[i],y[i]);}
else
for(i=0;i<n;++i)
ctx.lineTo(x[i],y[i]);if(col!=-1){ctx.fillStyle=col;ctx.fill();}
if(edgeWid){ctx.lineCap="round";ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;if(col!=-1)
ctx.lineTo(x[0],y[0]);ctx.stroke();}
ctx.closePath();}
SHIVA_Graphics.prototype.SetShadow=function(ctx,offx,offy,blur,col,comp)
{if(!offx){offx=offy=blur=col=0;comp="source-over";}
if(offx!=undefined)ctx.shadowOffsetX=offx;if(offy!=undefined)ctx.shadowOffsetY=offy;if(blur!=undefined)ctx.shadowBlur=blur;if(col!=undefined)ctx.shadowColor=col;if(comp!=undefined)ctx.globalCompositeOperation=comp;}
SHIVA_Graphics.prototype.AddGradient=function(ctx,id,x1,y1,x2,y2,col1,col2,r1,r2)
{if(!r1)
ctx[id]=ctx.createLinearGradient(x1,y1,x2,y2);else
ctx[id]=ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);if(!col1)col1="#000000";if(!col2)col2="#ffffff";ctx[id].addColorStop(0,col1);ctx[id].addColorStop(1,col2);}
SHIVA_Graphics.prototype.GetImage=function(ctx,file,left,top,wid,hgt)
{var image=new Image();image.src=file;image.onload=function(){var asp=image.height/image.width;if(!wid&&!hgt)
wid=image.width,hgt=image.height
else if(!wid&&hgt)
wid=hgt/asp;else if(wid&&!hgt)
hgt=wid*asp;ctx.drawImage(image,left,top,wid,hgt)}
return image;}
SHIVA_Graphics.prototype.resolveID=function(id)
{if(typeof(id)!="object")
id=document.getElementById(id);return id;}
SHIVA_Graphics.prototype.AddListener=function(id,eventType,handler)
{$("#"+id)[0].addEventListener(eventType,handler,false);}
SHIVA_Graphics.prototype.RemoveListener=function(id,eventType,handler)
{this.resolveID(id).removeEventListener(eventType,handler,false);}
SHIVA_Graphics.prototype.SetDrag=function(id,mode)
{id=$("#"+id);id.g=this;id.draggable=mode;if(!mode)
this.removeListener(id,'mousedown',dragDown);else
this.addListener(id,'mousedown',dragDown)
function dragDown(e){if(!e.target.draggable)
return
e.target.dragX=e.pageX-e.target.style.left.slice(0,-2);e.target.dragY=e.pageY-e.target.style.top.slice(0,-2)
e.target.g.addListener(e.target,'mousemove',dragMove)
e.target.g.addListener(e.target,'mouseup',dragUp)
e.target.inDrag=true;}
function dragMove(e){e.target.style.left=e.pageX-e.target.dragX;e.target.style.top=e.pageY-e.target.dragY;}
function dragUp(e){e.target.g.removeListener(e.target,'mousemove',dragMove)
e.target.g.removeListener(e.target,'mouseup',dragUp)
e.target.inDrag=false;}}
SHIVA_Graphics.prototype.SecsToTime=function(time,frameRate)
{var timecode="";if(!frameRate)
frameRate=24;time/=1000;var mins=(time/60)>>0;var secs=(time%60)>>0;var frms=((time-(secs+(mins*60)))*frameRate)>>0;if(mins<10)
timecode+="0";timecode+=mins+":";if(secs<10)
timecode+="0";timecode+=secs+":";if(frms<10)
timecode+="0";timecode+=frms;return timecode}
SHIVA_Graphics.prototype.SetTextFormat=function(ctx,format)
{var v=format.split(",");var pair,key,val;var bold="",ital="",font="",size="12";for(var i=0;i<v.length;++i){pair=v[i].split("=")
key=pair[0];val=pair[1];if(key=="align")ctx.textAlign=val;if(key=="color")ctx.fillStyle=val;if(key=="font")font=val;if(key=="size")size=val+"px";if(key=="bold")bold="bold";if(key=="italic")ital="italic";}
if(font)
ctx.font=bold+" "+ital+" "+size+" "+font;return size.substring(0,size.length-2);}
SHIVA_Graphics.prototype.DrawText=function(ctx,text,x,y,format)
{try{if(format)
this.SetTextFormat(ctx,format);ctx.fillText(text,x,y);}catch(e){};}
SHIVA_Show.prototype.DrawMap=function()
{var v,vv,i;var container=this.container;var ops=this.options;var latlng=new google.maps.LatLng(-34.397,150.644);var mapType=ops.mapTypeId.toUpperCase();if(mapType=="LAND")
ops.mapTypeId=mapType;else
ops.mapTypeId=google.maps.MapTypeId[mapType];var ll=ops.mapcenter.split(",")
latlng=new google.maps.LatLng(ll[0],ll[1]);ops.center=latlng;ops.zoom=Number(ll[2]);this.mapsInfoWindow=new google.maps.InfoWindow({maxWidth:300});this.items=[];for(var key in ops){if(ops[key]=="true")ops[key]=true;if(ops[key]=="false")ops[key]=false;if(key.indexOf("item-")!=-1){var o=new Object;v=ops[key].split(';');for(i=0;i<v.length;++i){vv=v[i].split(':');if(vv[1].indexOf("http")==-1)
vv[1]=vv[1].replace(/~/g,"=");o[vv[0]]=vv[1].replace(/\^/g,"&").replace(/\`/g,":");}
this.items.push(o);}}
$("#"+this.container).height(ops.height);$("#"+this.container).width(ops.width);ops["mapTypeControlOptions"]={"mapTypeIds":[google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.TERRAIN,google.maps.MapTypeId.SATELLITE,google.maps.MapTypeId.HYBRID,"LAND"],style:google.maps.MapTypeControlStyle.DROPDOWN_MENU};this.map=new google.maps.Map(document.getElementById(container),ops);this.AddClearMapStyle(this.map);this.AddBlankMapStyle(this.map);this.DrawMapOverlays();this.DrawLayerControlBox(this.items,this.options.controlbox);window.postMessage("InitGeocoder","*");this.SendReadyMessage(true);google.maps.event.addListener(this.map,'click',function(e){var l=e.latLng.toString().replace(/\(/,"").replace(/, /,"|").replace(/\)/,"");var p=e.pixel.toString().replace(/\(/,"").replace(/, /,"|").replace(/\)/,"");shivaLib.SendShivaMessage("ShivaMap=click",l+"|"+p);});google.maps.event.addListener(this.map,'center_changed',function(e){var map=shivaLib.map;var lat=map.getCenter();shivaLib.SendShivaMessage("ShivaMap=move",lat.lat()+"|"+lat.lng()+"|"+map.getZoom());});}
SHIVA_Show.prototype.AddInternalOptions=function(options,newOps)
{var i,vv;if(newOps){var v=newOps.split(',');for(i=0;i<v.length;++i){vv=v[i].split("=");if(vv[1]=='true')vv[1]=true;if(vv[1]=='false')vv[1]=false;options[vv[0]]=vv[1];}}}
SHIVA_Show.prototype.DrawMapOverlays=function()
{if(!this.items)
return;var i,j,latlng,v,ops,curZoom,curLatLon;var _this=this;var items=this.items;v=this.options.mapcenter.split(",")
curLatlng=new google.maps.LatLng(v[0],v[1]);curZoom=v[2];for(i=0;i<items.length;++i){ops=new Object();if(items[i].listener)
google.maps.event.removeListener(items[i].listener);if((items[i].obj)&&(items[i].layerType=="MarkerSet")){for(j=0;j<items[i].obj.length;++j){google.maps.event.removeListener(items[i].obj[j].listener);items[i].obj[j].obj.setMap(null);}
items[i].obj=null;}
else if(items[i].obj)
items[i].obj.setMap(null);if(items[i].layerType=="Drawn"){items[i].obj=new ShivaCustomMapOverlay()}
else if(items[i].layerType=="Marker"){items[i].obj=new google.maps.Marker();v=items[i].layerSource.split(",")
items[i].pos=latlng=new google.maps.LatLng(v[0],v[1]);ops["title"]=v[2];ops["position"]=latlng;if(v.length==4)
ops["icon"]=v[3]
if(ops&&items[i].obj)
items[i].obj.setOptions(ops);items[i].listener=google.maps.event.addListener(items[i].obj,'click',function(e){var j,v;for(j=0;j<_this.items.length;++j){v=_this.items[j].layerSource.split(",")
if(v[2]==this.title)
break;}
shivaLib.SendShivaMessage("ShivaMap=marker",this.title+"|"+e.latLng.lat()+"|"+e.latLng.lng()+"|"+j);});}
else if(items[i].layerType=="MarkerSet"){if(items[i].visible=="true"){this.items[i].obj=[];this.markerData=i;this.GetSpreadsheet(items[i].layerSource,true,null,function(d){_this.MapAddMarkers(d,_this.items[_this.markerData].obj)});}
continue;}
else if(items[i].layerType=="Overlay"){v=items[i].layerOptions.split(",");var imageBounds=new google.maps.LatLngBounds(new google.maps.LatLng(v[2],v[1]),new google.maps.LatLng(v[0],v[3]));if(v.length==5)
ops["opacity"]=v[4]/100;if(items[i].layerSource)
items[i].obj=new google.maps.GroundOverlay(items[i].layerSource,imageBounds,ops);items[i].listener=google.maps.event.addListener(items[i].obj,'click',function(e){shivaLib.SendShivaMessage("ShivaMap=overlay",this.url+"|"+e.latLng.lat()+"|"+e.latLng.lng());});}
else if(items[i].layerType=="KML"){if(items[i].layerOptions){v=items[i].layerOptions.split(",");for(j=0;j<v.length;++j)
ops[v[j].split("=")[0]]=v[j].split("=")[1];}
items[i].obj=new google.maps.KmlLayer(items[i].layerSource,ops);items[i].listener=google.maps.event.addListener(items[i].obj,'click',function(e){var str=this.url+"|"+e.featureData.name+"|"+e.latLng.lat()+"|"+e.latLng.lng();shivaLib.SendShivaMessage("ShivaMap=kml",str);});}
else if((items[i].layerType=="GoTo")&&(items[i].visible=="true")){v=items[i].layerSource.split(",");if(v.length>1)
curLatlng=new google.maps.LatLng(v[0],v[1]);if(v.length>2)
curZoom=v[2];}
if((items[i].visible=="true")&&(items[i].obj))
items[i].obj.setMap(this.map);}
this.map.setCenter(curLatlng);this.map.setZoom(Number(curZoom));}
SHIVA_Show.prototype.MapActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=goto"){var curLatlng=new google.maps.LatLng(v[1],v[2]);this.map.setCenter(curLatlng);this.map.setZoom(Number(v[3]));}
else if((v[0]=="ShivaAct=show")||(v[0]=="ShivaAct=hide")){if(this.items[v[1]])
this.items[v[1]].visible=(v[0]=="ShivaAct=show").toString();this.DrawMapOverlays();}
else if(v[0]=="ShivaAct=data"){if(v[1])
this.MapAddMarkers(v[1]);}
else if(v[0]=="ShivaAct=marker"){if(v[1]<this.markerData.length)
this.markerData[v[1]].obj.setMap(v[2]=="true"?this.map:null);}}
SHIVA_Show.prototype.MapAddMarkers=function(json,mData)
{var hasLines=false;var i,j,o,mark,list,ops;var flat,flon,tlat,tlon,col,alpha,width,coords,path;var _this=shivaLib;if(typeof(json)=="string"){json=$.parseJSON(json);var cols=json[0].length;for(i=1;i<json.length;++i){o={};for(j=0;j<cols;++j)
o[json[0][j]]=json[i][j];json[i]=o;}
json=json.slice(1);mData=this.markerData;if(mData){for(i=0;i<mData.length;++i){if(mData[i].listener)
google.maps.event.removeListener(mData[i].listener);mData[i].obj.setMap(null);}}
this.markerData=mData=[];}
for(i=0;i<json.length;++i){if(json[i].icon!="line")
continue;hasLines=true;alpha=1;width=2;col="#990000";if(json[i].width)
width=json[i].width;if(json[i].color){col=json[i].color;if(json[i].color.length>7){col=json[i].color.substr(0,7);alpha=parseInt(json[i].color.substr(7,2),16)/255;}}
flat=json[json[i].lat-2].lat;flon=json[json[i].lat-2].lon;tlat=json[json[i].lon-2].lat;tlon=json[json[i].lon-2].lon;path=new google.maps.Polyline({path:[new google.maps.LatLng(flat,flon),new google.maps.LatLng(tlat,tlon)],strokeColor:col,strokeOpacity:alpha,strokeWeight:width});path.setMap(shivaLib.map);mData.push({obj:path,title:"",listener:null});}
for(i=0;i<json.length;++i){if(json[i].icon=="line")
continue;mark=new google.maps.Marker();ops={};if(json[i].title)
ops["title"]=json[i].title;ops["position"]=new google.maps.LatLng(json[i].lat-0,json[i].lon-0);if(json[i].icon){if(hasLines)
ops["icon"]={url:json[i].icon,anchor:new google.maps.Point(8,8)};else
ops["icon"]=json[i].icon;}
mark.setOptions(ops);mark.setMap(shivaLib.map);list=google.maps.event.addListener(mark,'click',function(e){var j;for(j=0;j<mData.length;++j)
if(mData[j].title==this.title)
break;shivaLib.SendShivaMessage("ShivaMap=marker",this.title+"|"+e.latLng.lat()+"|"+e.latLng.lng()+"|"+j);if(mData[j].desc){shivaLib.mapsInfoWindow.setContent(mData[j].desc);shivaLib.mapsInfoWindow.open(this.map,this);}});mData.push({obj:mark,title:json[i].title,listener:list,desc:json[i].desc});}}
SHIVA_Show.prototype.DrawLayerControlBox=function(items,show)
{var i,hasGotos=false,hasLayers=false;if(!show){$("#shivaMapControlDiv").remove();return;}
var l=$("#"+this.container).css("left").replace(/px/g,"");var t=$("#"+this.container).css("top").replace(/px/g,"");var h=$("#"+this.container).css("height").replace(/px/g,"");if(t=="auto")t=8;if(l=="auto")l=8;if(this.options.shivaGroup=="Earth"){l=Number(l)+($("#"+this.container).css("width").replace(/px/g,"")-0)+8;t=24;h=0;}
if($("#shivaMapControlDiv").length==0){str="<div id='shivaMapControlDiv' style='position:absolute;left:"+l+"px;top:"+((t-0)+(h-0)-24)+"px'>";$("body").append("</div>"+str);$("#shivaMapControlDiv").addClass("rounded-corners").css("background-color","#eee").css('border',"1px solid #ccc");$("#shivaMapControlDiv").draggable();$("#shivaMapControlDiv").css("z-index",2001);}
var str="<p style='text-shadow:1px 1px white' align='center'><b>&nbsp;&nbsp;Controls&nbsp;&nbsp;</b></p>";for(i=0;i<items.length;++i){if((items[i].layerTitle)&&(items[i].layerType!="GoTo"))
hasLayers=true;else if((items[i].layerTitle)&&(items[i].layerType=="GoTo"))
hasGotos=true;}
if(this.options.shivaGroup=="Poster"){hasLayers=false;hasGotos=true;}
if(hasLayers){str="<p style='text-shadow:1px 1px white'><b>&nbsp;&nbsp;Show layer&nbsp;&nbsp;</b><br/>";for(i=0;i<items.length;++i)
if((items[i].layerTitle)&&(items[i].layerType!="GoTo")){str+="&nbsp;<input type='checkbox' id='shcb"+i+"'";if(items[i].visible=="true")
str+=" checked=checked ";str+=">"+items[i].layerTitle+"&nbsp;&nbsp;<br/>";}
str+="</p>";}
if((hasGotos)||(this.options.shivaGroup=="Poster")){if(!hasLayers)str="";str+="<p style='text-shadow:1px 1px white'><b>&nbsp;&nbsp;Go to:&nbsp;&nbsp;</b><br/>";str+="&nbsp;<input type='radio' name='gotos' id='shcr"+items.length+"' checked=checked>Start&nbsp;&nbsp;&nbsp;<br/>";for(i=0;i<items.length;++i)
if((items[i].layerTitle)&&((items[i].layerType=="GoTo")||(this.options.shivaGroup=="Poster"))){str+="&nbsp;<input type='radio' name='gotos' id='shcr"+i+"'";if(items[i].visible=="true")
str+=" checked=checked ";str+=">"+items[i].layerTitle+"&nbsp;&nbsp;&nbsp;<br/>";}
str+="</p>";}
$("#shivaMapControlDiv").html(str+"<br/>");var _this=this;for(i=0;i<items.length;++i){if((items[i].layerType=="GoTo")||(this.options.shivaGroup=="Poster"))
$("#shcr"+i).click(function(){$.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"GoTo"),_this);});else
$("#shcb"+i).click(function(){$.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"?"),_this);});}
if(hasGotos)
$("#shcr"+items.length).click(function(){$.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"GoTo"),_this);});}
if((typeof(google)=="object")&&(google.maps))
ShivaCustomMapOverlay.prototype=new google.maps.OverlayView();function ShivaCustomMapOverlay(bounds,data)
{var swBound=new google.maps.LatLng(62.281819,-150.287132);var neBound=new google.maps.LatLng(62.400471,-150.005608);bounds=new google.maps.LatLngBounds(swBound,neBound);this.bounds_=bounds;this.data_=data;this.div_=null;}
ShivaCustomMapOverlay.prototype.onAdd=function()
{var div=document.createElement('div');div.style.border="none";div.style.borderWidth="0px";div.style.position="absolute";var img=document.createElement("img");img.src="http://www.viseyes.org/shiva/map.jpg";img.style.width="100%";img.style.height="100%";div.appendChild(img);this.div_=div;var panes=this.getPanes();panes.overlayLayer.appendChild(div);}
ShivaCustomMapOverlay.prototype.draw=function()
{var overlayProjection=this.getProjection();var sw=overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());var ne=overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());this.div_.style.left=sw.x+'px';this.div_.style.top=ne.y+'px';this.div_.style.width=(ne.x-sw.x)+'px';this.div_.style.height=(sw.y-ne.y)+'px';}
ShivaCustomMapOverlay.prototype.onRemove=function()
{this.div_.parentNode.removeChild(this.div_);this.div_=null;}
SHIVA_Show.prototype.AddClearMapStyle=function(map)
{var style=[{featureType:"road",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"landscape",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"geometry",stylers:[{lightness:-20}]}];var type=new google.maps.StyledMapType(style,{name:"Land"});map.mapTypes.set("LAND",type);}
SHIVA_Show.prototype.AddBlankMapStyle=function(map)
{var style=[{featureType:"road",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"landscape",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"geometry",stylers:[{lightness:-20}]}];var type=new google.maps.StyledMapType(style,{name:"Blank"});map.mapTypes.set("BLANK",type);}
SHIVA_Show.prototype.DrawEarth=function(){}
SHIVA_Show.prototype.EarthActions=function(msg){}
SHIVA_Show.prototype.EarthAddMarkers=function(json,mData){}
SHIVA_Show.prototype.DrawVideo=function()
{var options=this.options;var con="#"+this.container;$(con).width(options.width);$(con).height(options.height);var o=this.playerOps={};o.playerAuto=options.autoplay;o.playerStart=o.playerEnd=0;o.playerVolume=options.volume;o.playerSpeed=1;o.playerAspect=.5625;o.playerControls="true";o.player=null;o.playerNow=0;o.playerMode="empty";o.playerType="";o.isMobile=false;o.playerSource=options.dataSourceUrl;if(!o.playerSource)
return;if(options.start)
o.playerStart=shivaLib.TimecodeToSeconds(options.start);if(options.end)
o.playerEnd=shivaLib.TimecodeToSeconds(options.start);if(!isNaN(o.playerSource)||o.playerSource.match(/vimeo\.com/i)){o.playerType="vimeo";if(o.playerSource.match(/vimeo\.com\//i))
o.playerSource=o.playerSource.match(/\d+/);this.RunPlayer("init");}
else if(o.playerSource.match(/\/\//i)&&!o.playerSource.match(/youtu.*be/)){if(this.player&&(o.playerType=="html5")){if(this.player.currentSrc.indexOf(o.playerSource)==-1){var base=o.playerSource.match(/(.*)\.[^.]+$/i)[1];if(o.playerSource.match(/\.mp3/i))
this.player.src=base+".mp3";else{this.player.src=base+".mp4";this.player.src=base+".ogg";this.player.src=base+".webm";}
this.player.load();}}
else{o.playerType="html5";this.RunPlayer("init");}}
else{if(o.playerSource.match(/v=/i))
o.playerSource=o.playerSource.match(/v=(.+)/i)[1];else if(o.playerSource.match(/youtu\.be/i))
o.playerSource=o.playerSource.match(/youtu\.be\/(.+)/i)[1];o.playerType="youtube";if(this.player){if(!this.player.pauseVideo){if(YT.Player)
this.RunPlayer("init");else{var tag=document.createElement('script');tag.src="//www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName('script')[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);}}
else{if(this.player.getVideoUrl().indexOf(o.playerSource)==-1)
this.player.loadVideoById(o.playerSource);else
this.player.seekTo(o.playerStart);if(o.playerAuto=="true")
this.player.playVideo();}}
else{var tag=document.createElement('script');tag.src="//www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName('script')[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);}}
shivaLib.RunPlayer("resize");shivaLib.RunPlayer("volume",o.playerVolume);shivaLib.VideoNotes();}
function onYouTubeIframeAPIReady()
{shivaLib.RunPlayer("init");}
SHIVA_Show.prototype.RunPlayer=function(what,param,param2)
{var i,str;var o=this.playerOps;var con="#"+this.container;if((what=="play")||(what=="jump")){if((o.playerMode=="empty")&&o.isMobile)
return;o.playerMode="play";if(param!=undefined){if((""+param).match(/:/))
param=TimecodeToSeconds(param);o.playerNow=param;}
if(!this.player){return;}
if(o.playerType=="youtube"){this.player.seekTo(o.playerNow,true);if(o.playerMode=="play")this.player.playVideo();else if(o.playerMode=="pause")this.player.pauseVideo();}
else if(o.playerType=="vimeo"){this.player.contentWindow.postMessage("{\"method\":\"seekTo\",\"value\":\""+o.playerNow+"\"}","*")
if(o.playerMode=="play")
this.player.contentWindow.postMessage("{\"method\":\"play\"}","*");if(o.playerMode=="pause")
this.player.contentWindow.postMessage("{\"method\":\"pause\"}","*");}
else if(o.playerType=="html5"){if(param!=undefined)
this.player.currentTime=o.playerNow;if(o.playerMode=="play")this.player.play();if(o.playerMode=="pause")this.player.pause();}
if(o.playerMode=="play")o.playerStarted=o.playerNow;}
else if((what=="scrub")||(what=="seek")){if((o.playerMode=="empty")&&o.isMobile)
return;o.playerNow=param;if(!this.player){return;}
if(o.playerType=="youtube")
this.player.seekTo(o.playerNow,true);else if(o.playerType=="vimeo")
this.player.contentWindow.postMessage("{\"method\":\"seekTo\",\"value\":\""+o.playerNow+"\"}","*");else if(o.playerType=="html5")
this.player.currentTime=o.playerNow;}
else if(what=="pause"){$("#playBut").attr("src","images/playbut.gif");o.playerMode="pause";if(!this.player)return;if(o.playerType=="youtube")
this.player.pauseVideo();else if(o.playerType=="vimeo")
this.player.contentWindow.postMessage("{\"method\":\"pause\"}","*");else if(o.playerType=="html5")
this.player.pause();}
else if(what=="time"){if(!this.player)return;if(o.playerType=="youtube")
return this.player.getCurrentTime();else if(o.playerType=="vimeo")
return o.playerCurTime;else if(o.playerType=="html5")
return this.player.currentTime;}
else if(what=="volume"){if(!this.player)return;if(o.playerType=="youtube")
this.player.setVolume(o.playerVolume-0);else if(o.playerType=="vimeo")
this.player.contentWindow.postMessage("{\"method\":\"setVolume\",\"value\":\""+o.playerVolume/100+"\"}","*");else if(o.playerType=="html5")
this.player.volume=o.playerVolume/100;}
else if(what=="speed"){if(!this.player)return;s=Math.max(.25,o.playerSpeed/50);if(o.playerType=="youtube")
this.player.setPlaybackRate(s);else if(o.playerType=="html5")
this.player.playbackRate=s;}
else if(what=="resize"){if(!this.player)return;var w=$(con).width();$("#vplayer").width(w);$("#vplayer").height(w*o.playerAspect);}
else if(what=="ready"){shivaLib.RunPlayer("pause");shivaLib.RunPlayer("resize");if(o.playerAuto=="true"){shivaLib.RunPlayer("play",o.playerStart);}
else if(o.playerStart){shivaLib.RunPlayer("scrub",o.playerStart);shivaLib.RunPlayer("pause");}
shivaLib.SendReadyMessage(true);}
else if(what=="init"){if(o.playerType=="youtube"){$(con).html("<div id='vplayer'></div>");var pc=o.playerControls=="true"?1:0;this.player=new YT.Player("vplayer",{playerVars:{modestbranding:1,controls:pc,disablekb:1,rel:0,showinfo:0,html5:1,autoplay:1},videoId:o.playerSource,events:{"onReady":function(s){shivaLib.RunPlayer("ready")}}});}
else if(o.playerType=="vimeo"){str="<iframe id='vplayer' src='//player.vimeo.com/video/";str+=o.playerSource;str+="?api=1&player_id=vplayer' width='500' height='281' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>";$(con).html(str);this.player=$("#vplayer")[0];}
else if(o.playerType=="html5"){$(con).html("");var base=o.playerSource.match(/(.*)\.[^.]+$/i)[1];str="<video id='vplayer' width='100%' height='100%'";if((o.playerControls=="true")||o.isMobile)
str+=" controls";str+=">";if(o.playerSource.match(/\.mp3/i)){str+="<source src='"+base+".mp3'  type='audio/mp3'>";}
else{str+="<source src='"+base+".mp4'  type='video/mp4'>";str+="<source src='"+base+".ogg'  type='video/ogg'>";str+="<source src='"+base+".webm' type='video/webm'>";}
str+="</video>"
$(con).html(str);var myVid=document.getElementById("vplayer");myVid.onloadstart=function(){shivaLib.player=$("#vplayer")[0];shivaLib.RunPlayer("ready");};myVid.oncanplay=function(){o.playerAspect=shivaLib.player.videoHeight/shivaLib.player.videoWidth;};myVid.onended=function(){shivaLib.RunPlayer("pause");};myVid.onplay=function(){$("#playBut").attr("src","images/pausebut.gif");o.playerMode="play";o.playerStarted=o.playerNow;};myVid.onpause=function(){$("#playBut").attr("src","images/playbut.gif");o.playerMode="pause";};myVid.addEventListener("loadstart",myVid.onloadstart);myVid.addEventListener("canplay",myVid.oncanplay);myVid.addEventListener("ended",myVid.onended);myVid.addEventListener("play",myVid.onplay);myVid.addEventListener("pause",myVid.onpause);}}}
SHIVA_Show.prototype.VideoDuration=function()
{var o=this.playerOps;if(!this.player)
return-1;if(o.playerType=="html5")
return document.getElementById("vplayer").duration;else if(o.playerType=="vimeo")
return o.playerTRT-0;else if(o.playerType=="youtube")
return this.player.getDuration();return-1;}
SHIVA_Show.prototype.TimecodeToSeconds=function(timecode)
{var h=0,m=0;var v=(""+timecode).split(":");var s=v[0]
if(v.length==2)
s=v[1],m=v[0];else if(v.length==3)
s=v[2],m=v[1],h=v[0];return(Number(h*3600)+Number(m*60)+Number(s));}
SHIVA_Show.prototype.SecondsToTimecode=function(secs)
{var str="",n;n=Math.floor(secs/3600);if(n)str+=n+":";n=Math.floor(secs/60);if(n<10)str+="0";str+=n+":";n=Math.floor(secs%60);if(n<10)str+="0";str+=n;return str;}
SHIVA_Show.prototype.VideoNotes=function()
{var i,str,v;$("#shivaNotesDiv").remove();if((!this.options.ntext)&&(this.options.vnotes!="true"))
return;var ts="color:#009900;cursor:pointer";var ns="font-size:small;border:none;background:none;width:100%;padding:0px;margin:0px";var con=$("#"+this.container);str="<div id='shivaNotesDiv' style='position:absolute;padding:8px;overflow-y:auto;";str+="width:500px;height:"+(con.height()-16)+"px;";str+="background-color:#f8f8f8;border:1px solid #ccc;box-shadow:4px 4px 8px #ccc;";var top=con.offset().top;var left=con.offset().left+con.width()+16;str+="top:"+top+"px;left:"+left+"px;'>";str+="<table id='shivaNotesTbl' width='100%'>";str+="<div style='text-align:center;font-size:large;'><img src='shivalogo16.png' style='vertical-align:-2px'><b> SHIVA Notes</b></div><hr>";str+="<div style='position:absolute;top:-2px;left:0px;width:100%;text-align:right'><br/>Find: <input type='input' id='shivaNotesSearch' style='height:12px;width:60px;font-size:x-small;padding:0px;margin:0px'/>&nbsp; &nbsp;</div>"
str+="<tr><td width='38' id='ntc-0' style='"+ts+"'>Type:</td><td><input id='ntx-0' type='input' style='"+ns+"'/></td></tr>";str+="</table>";if(this.options.vnotes=="true"){str+="<div style='text-align:right'><br/>________________________________<br/><br/>Pause video while typing?<input type='checkbox' id='notesPause' style='height:11px'>";str+="<br/>Save notes: <img src='savedot.gif' id='shivaNotesSave' title='Save notes' width='15' style='vertical-align:bottom'>";}
$('body').append(str+"</div>");if(this.options.ntext){v=this.options.ntext.split("|");for(i=0;i<v.length;++i){if(!v[i])continue;str="<tr><td id='ntc-"+i+"' style='"+ts+"'>Type:</td><td><input id='ntx-"+i+"' type='input' style='"+ns+"'/></td></tr>";if(i)
$("#shivaNotesTbl").append(str);$("#ntc-"+i).text(v[i].substring(0,5));$("#ntx-"+i).val(v[i].substr(5));$("#ntc-"+i).click(function(e){var time=$("#"+e.target.id).text();if(e.shiftKey)
$("#"+e.target.id).text(shivaLib.SecondsToTimecode(shivaLib.VideoTime()));else
shivaLib.RunPlayer("scrub",shivaLib.TimecodeToSeconds(time));});$("#ntc-"+i).dblclick(function(e){var time=$("#"+e.target.id).text();shivaLib.RunPlayer("play",time);});}}
$("#shivaNotesDiv").draggable();$("#ntx-0").focus();$("#shivaNotesSearch").on("keydown",function(e){var n=$("#shivaNotesTbl tr").length;var patt=new RegExp($("#shivaNotesSearch").val());for(var i=0;i<n;++i){$("#ntx-"+i).css("color","black");if(($("#ntx-"+i).val())&&($("#ntx-"+i).val().match(patt)))
$("#ntx-"+i).css("color","red");}});$("#shivaNotesSave").on("click",function(e){var str="";var n=$("#shivaNotesTbl tr").length;for(var i=0;i<n;++i)
if($("#ntx-"+i).val())
str+=$("#ntc-"+i).text()+"\t"+$("#ntx-"+i).val()+"\n";window.prompt("To copy your Notes to the clipboard:\nType Ctrl+C or Cmd+C and click  OK button.",str);});$("#shivaNotesTbl").on("keydown",function(e){var cap=false;var rowNum=e.target.id.split("-")[1];if($("#"+e.target.id).val().length>80)
cap=true;if((e.keyCode==13)||(cap)){var ts="color:#009900;cursor:pointer";var ns="font-size:small;border:none;background:none;width:100%;padding:0px;margin:0px";var id=$("#shivaNotesTbl tr").length;var str="<tr><td id='ntc-"+id+"' style='"+ts+"'>Type:</td><td><input id='ntx-"+id+"' type='input' style='"+ns+"'/></td></tr>";$("#shivaNotesTbl").append(str);$("#ntx-"+id).focus();if($("#notesPause").prop('checked')&&!cap)
shivaLib.RunPlayer("play",shivaLib.RunPlayer("time"));if(cap)
$("#ntc-"+id).text($("#ntc-"+rowNum).text());}
else if((e.keyCode==8)||(e.keyCode==46)){var id="#"+e.target.id;if((!$(id).val())&&(id!="#ntx-0")){id="ntx-"+(id.substr(5)-1);$("#"+id).focus();$("#"+e.target.id).parent().parent().remove();}}
else if(!$("#ntx-"+rowNum).val()){$("#ntc-"+rowNum).text(shivaLib.SecondsToTimecode(shivaLib.RunPlayer("time")));if($("#notesPause").prop('checked'))
shivaLib.RunPlayer("pause");$("#ntc-"+rowNum).click(function(e){var time=$("#"+e.target.id).text();if(e.shiftKey)
$("#"+e.target.id).text(shivaLib.SecondsToTimecode(shivaLib.RunPlayer("time")));else
shivaLib.RunPlayer("scrub",shivaLib.TimecodeToSeconds(time));});$("#ntc-"+rowNum).dblclick(function(e){var time=$("#"+e.target.id).text();shivaLib.RunPlayer("play",time);});}});};SHIVA_Show.prototype.DrawSubway=function(oldItems)
{var options=this.options;var container=this.container;var con="#"+container;var g=this.g=new SHIVA_Graphics();var items=new Array();if(oldItems)
items=oldItems;else
for(var key in options){if(key.indexOf("item-")!=-1){var o=new Object;var v=options[key].split(';');for(i=0;i<v.length;++i)
o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");items.push(o);}}
this.items=items;$(con).html("");g.CreateCanvas("subwayCanvas",container);var ctx=$("#subwayCanvas")[0].getContext('2d');$("#subwayCanvas").attr("width",options.cols*options.gridSize+30);$("#subwayCanvas").attr("height",options.rows*options.gridSize+30);$("#propInput8").val(options.cols*options.gridSize+30);$("#propInput7").val(options.rows*options.gridSize+30);$("#textLayer").remove();$(con).append("<div id='textLayer'></div>");ctx.clearRect(0,0,1000,1000);DrawBack();DrawTracks();DrawStations();DrawLegend();this.SendReadyMessage(true);function DrawLegend()
{var i,str;var x=Number(options.gridSize*5)+8;var y=Number(options.gridSize*options.rows);for(i=0;i<items.length;++i)
if(items[i].title)
y-=16;for(i=0;i<items.length;++i)
if((items[i].title)&&(items[i].visible!="false")){g.DrawLine(ctx,"#"+items[i].lineCol,1,options.gridSize,y,x-8,y,items[i].lineWid);str="<div style='position:absolute;left:"+x+"px;top:"+(y-6)+"px'>"+items[i].title;$("#textLayer").append(str+"</div>");y+=16;}}
function DrawTracks()
{var i,j,v,pts
var xs=new Array();var ys=new Array();var gw=options.gridSize;for(i=0;i<items.length;++i){if(items[i].visible=="false")
continue;xs=[];ys=[]
if(!items[i].coords)
continue;pts=items[i].coords.split(",");for(j=0;j<pts.length;++j){v=pts[j].split(".");xs.push(v[0]*gw);ys.push(v[1]*gw);}
g.DrawPolygon(ctx,-1,1,xs,ys,"#"+items[i].lineCol,items[i].lineWid,true);}}
function DrawStations()
{var pts,tp,align,link="",lab="";var i,j,x,y,y2,x2,w,w2,style,str,span;if(!options.stations)
return;pts=options.stations.split("~");for(j=0;j<pts.length;++j){v=pts[j].split("`");x2=x=Number(v[0])*Number(options.gridSize);y2=y=Number(v[1])*Number(options.gridSize);tp=v[2];style=v[3];lab=v[4];link=v[5]
w=8;w2=w/2;if(style=="S")
g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);else if(style=="s")
g.DrawCircle(ctx,"#fff",1,x,y,w*.7,"#000",w/4);else if(style.charAt(0)=="i"){span=Number(style.charAt(1));x2=x+Number(span*options.gridSize);g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);g.DrawCircle(ctx,"#fff",1,x2,y,w,"#000",w2);g.DrawLine(ctx,"#fff",1,x,y,x2,y,w/2);g.DrawLine(ctx,"#000",1,x+Number(w),y-w2,x2-w,y-w2,w2);g.DrawLine(ctx,"#000",1,x+Number(w),y+w2,x2-w,y+w2,w2);}
else if(style.charAt(0)=="I"){span=Number(style.charAt(1));y2=y+Number(span*options.gridSize);g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);g.DrawCircle(ctx,"#fff",1,x,y2,w,"#000",w2);g.DrawLine(ctx,"#fff",1,x,y,x,y2,w/2);g.DrawLine(ctx,"#000",1,x-w2,y+Number(w),x-w2,y2-w,w/2);g.DrawLine(ctx,"#000",1,x+w2,y+Number(w),x+w2,y2-w,w/2);}
w=Number(options.gridSize);if(tp=="r"){x2=x2+w-w2;align='left';y2=y+((y2-y)/2);}
if(tp=="l"){x2=x-200-w+w2;align='right';y2=y+((y2-y)/2);}
if(tp=="t"){x2-=((x2-x)/2)+100;align='center';y2=y-w+w2;}
if(tp=="b"){x2-=((x2-x)/2)+100;align='center';y2=y2+w-w2;}
str="<div id='shivaSubtx"+j+"' style='position:absolute;color:#000;width:200px;left:"+x2+"px;top:"+(y2-6)+"px;text-align:"+align+"'>";if(link)
str+="<a href='"+link+"' target='_blank' style='color:#000;text-decoration: none;'>"+lab+"</a>";else
str+=lab;$("#textLayer").append(str+"</div>");$("#shivaSubtx"+j).click(function(){shivaLib.SendShivaMessage("ShivaSubway=click",this.id.substr(10))});if(tp=="t")
$("#shivaSubtx"+j).css("top",(y2-$("#shivaSubtx"+j).height()+4)+"px");else if((tp=="r")||(tp=="l"))
$("#shivaSubtx"+j).css("top",(y2-$("#shivaSubtx"+j).height()/2)+"px");}}
function DrawBack()
{var gridSize=options.gridSize;var numRows=options.rows;var numCols=options.cols;ctx.textAlign="center";if(!options.showGrid){g.DrawRoundBar(ctx,"#"+options.backCol,1,0,0,numCols*gridSize,numRows*gridSize,options.backCorner);return;}
for(i=1;i<=numCols;++i){g.DrawLine(ctx,"#cccccc",1,i*gridSize,gridSize,i*gridSize,numRows*gridSize,.5);g.DrawText(ctx,i,(i*gridSize),gridSize/2,"color=#999");}
for(i=1;i<=numRows;++i){g.DrawLine(ctx,"#cccccc",1,gridSize,i*gridSize,numCols*gridSize,i*gridSize,.5);g.DrawText(ctx,i,gridSize/2,(i*gridSize)+3,"color=#999");}}}
SHIVA_Show.prototype.DrawNetwork=function()
{if(!this.jit)
this.jit=new VIZ(this.container);this.jit.Draw(this.options);}
function VIZ(container)
{this.chartType="rgraph";this.container=container;this.config=new Object();this.data=new Array();this.Config={rgraph:{background:{CanvasStyles:{}},Navigation:{enable:true,panning:true},Node:{CanvasStyles:{}},Edge:{overridable:true,CanvasStyles:{}},Label:{overridable:true,type:'HTML'},Tips:{enable:true},Events:{enable:true,enableForEdges:true},NodeStyles:{enable:true},CanvasStyles:{}},forcedir:{iterations:200,background:{CanvasStyles:{},numberOfCircles:0},Navigation:{enable:true,panning:'avoid nodes'},Node:{CanvasStyles:{}},Edge:{overridable:true,CanvasStyles:{}},Label:{overridable:true,type:'HTML'},Tips:{enable:true},Events:{enable:true,enableForEdges:true},NodeStyles:{enable:true},CanvasStyles:{}},hypertree:{background:{CanvasStyles:{},numberOfCircles:0},Navigation:{enable:true,panning:true},Node:{CanvasStyles:{},transform:false},Edge:{overridable:true,CanvasStyles:{}},Label:{overridable:true,type:'HTML'},Tips:{enable:true},Events:{enable:true,enableForEdges:true},NodeStyles:{enable:true},CanvasStyles:{}}}}
SHIVA_Show.prototype.NetworkActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100")
shivaLib.options.width=shivaLib.options.height="100%";shivaLib.DrawNetwork();}}
VIZ.prototype.Draw=function(json)
{var k,key,val;this.chartType=json.chartType;for(key in json){val=json[key];if(key.match(/_(fillStyle|strokeStyle|color)/))
val='#'+val;if(val=="true")
val=true;else if(val=='false')
val=false;k=key.split("_");if(k.length==2)
this.Config[this.chartType][k[0]][k[1]]=val;else if(k.length==3)
this.Config[this.chartType][k[0]][k[1]][k[2]]=val;else
this.Config[this.chartType][key]=val;}
shivaLib.GetSpreadsheet(json.dataSourceUrl,false,null,$.proxy(this.Spreadsheet2Jit,this));this.config=this.Config[this.chartType];$("#"+this.container).height(this.config.height);$("#"+this.container).width(this.config.width);$jit.id(this.container).style.backgroundColor=this.config.background.CanvasStyles.fillStyle;}
VIZ.prototype.Spreadsheet2Jit=function(data)
{var i,j,v,n;var ROWS=[];var numCols=0;var numRows=data.length;for(i=0;i<numRows;i++){ROWS[i]=[];n=data[i].length;numCols=Math.max(numCols,n);for(j=0;j<n;j++){v=data[i][j];if(isNaN(v))
v=v.replace(/(^\s+|\s+$)/g,"");ROWS[i][j]=v;}}
var CLASSES={node:{},link:{}};for(var i=0;i<numRows;i++){var rType=ROWS[i][0];if(!rType.match(/-class/))continue;var c=ROWS[i][1];var k=ROWS[i][2];var v=ROWS[i][3];if(rType.match(/node-class/)){if(CLASSES.node[c]==undefined)CLASSES.node[c]={};CLASSES.node[c][k]=v;}else if(rType.match(/link-class/)){if(CLASSES.link[c]==undefined)CLASSES.link[c]={};CLASSES.link[c][k]=v;}}
var JIT={};for(var i=0;i<numRows;i++){var rType=ROWS[i][0];if(rType.match(/-class/))continue;var nodeID=ROWS[i][1];if(JIT[nodeID]==undefined){JIT[nodeID]={};JIT[nodeID].id=nodeID;JIT[nodeID].data={};JIT[nodeID].adjacencies=[];}
if(rType.match(/^\s*node\s*$/)){if(ROWS[i][2]&&!ROWS[i][2].match(/^\s*$/)){JIT[nodeID].name=ROWS[i][2];}else{JIT[nodeID].name=nodeID;}
var nodeClass=ROWS[i][3];JIT[nodeID].data.className=nodeClass;for(var k in CLASSES.node[nodeClass]){JIT[nodeID].data['$'+k]=CLASSES.node[nodeClass][k];}
if(numCols>4){JIT[nodeID].data.tip=ROWS[i][4];}}else if(rType.match(/^\s*link\s*$/)){var linkClass=ROWS[i][2];var nodeTo=ROWS[i][3];var linkObject={'nodeTo':nodeTo,'data':{'class':linkClass}};for(var k in CLASSES.link[linkClass]){linkObject.data['$'+k]=CLASSES.link[linkClass][k];}
JIT[nodeID].adjacencies.push(linkObject);}}
shivaLib.SendReadyMessage(true);this.data=[];for(var x in JIT)this.data.push(JIT[x]);$jit.id(this.container).innerHTML='';this.Init[this.chartType](this);}
VIZ.prototype.Init={rgraph:function(obj){var data=obj.data;var config=obj.Config[obj.chartType];var div=obj.container;config.injectInto=div;var divElement=document.getElementById(div);config.width=divElement.offsetWidth;config.height=divElement.offsetHeight;config.onCreateLabel=function(domElement,node){domElement.className='shiva-node-label';domElement.innerHTML=node.name;domElement.onclick=function(){shivaLib.SendShivaMessage("ShivaNetwork=click",node.id);rgraph.onClick(node.id,{});};var style=domElement.style;style.fontSize=config.Label.size+'px';style.color=config.Label.color;style.fontWeight=config.Label.style;style.fontStyle=config.Label.style;style.fontFamily=config.Label.family;style.textAlign=config.Label.textAlign;style.cursor='crosshair';style.display='';};config.onPlaceLabel=function(domElement,node){};config.Tips.onShow=function(tip,node){var count=0;node.eachAdjacency(function(){count++;});if(node.data.tip){tip.innerHTML="<div class='tip-title'>"+node.data.tip+"</div>";}else{tip.innerHTML="<div class='tip-title'>"+node.name+" is a <b>"+node.data.className+"</b> with "+count+" connections.</div>";}
tip.style.color='black';tip.style.fontFamily=config.Label.family;tip.style.backgroundColor='white';tip.style.padding='1em';tip.style.maxWidth='200px';tip.style.fontSize='10pt';tip.style.border='1px solid black';tip.style.opacity='0.99';tip.style.boxShadow='#555 2px 2px 8px';};var rgraph=new $jit.RGraph(config);rgraph.loadJSON(data);rgraph.graph.eachNode(function(n){var pos=n.getPos();pos.setc(-200,-200);});rgraph.compute('end');rgraph.fx.animate({modes:['polar'],duration:2000});var canvasConfig=rgraph.canvas.getConfig();},forcedir:function(obj){var jsonData=obj.data;var config=obj.Config[obj.chartType];var div=obj.container;config.injectInto=div;config.onCreateLabel=function(domElement,node){var style=domElement.style;domElement.className='shiva-node-label';style.fontSize=config.Label.size+'px';style.color=config.Label.color;style.fontWeight=config.Label.style;style.fontStyle=config.Label.style;style.fontFamily=config.Label.family;style.textAlign=config.Label.textAlign;style.cursor='crosshair';domElement.innerHTML=node.name;var left=parseInt(style.left);var top=parseInt(style.top);var w=domElement.offsetWidth;style.left=(left-w/2)+'px';style.top=(top+10)+'px';style.display='';domElement.onclick=function(){shivaLib.SendShivaMessage("ShivaNetwork=click",node.id);};};config.onPlaceLabel=function(domElement,node){};config.onMouseEnter=function(){fd.canvas.getElement().style.cursor='move';};config.onMouseLeave=function(){fd.canvas.getElement().style.cursor='';};config.onDragMove=function(node,eventInfo,e){var pos=eventInfo.getPos();node.pos.setc(pos.x,pos.y);fd.plot();};config.onTouchMove=function(node,eventInfo,e){$jit.util.event.stop(e);this.onDragMove(node,eventInfo,e);};config.Tips.onShow=function(tip,node){var count=0;node.eachAdjacency(function(){count++;});if(node.data.tip){tip.innerHTML="<div class='tip-title'>"+node.data.tip+"</div>";}else{tip.innerHTML="<div class='tip-title'>"+node.name+" is a <b>"+node.data.className+"</b> with "+count+" connections.</div>";}
tip.style.color='black';tip.style.fontFamily=config.Label.family;tip.style.backgroundColor='white';tip.style.padding='1em';tip.style.maxWidth='200px';tip.style.fontSize='10pt';tip.style.border='1px solid black';tip.style.opacity='0.99';tip.style.boxShadow='#555 2px 2px 8px';};var fd=new $jit.ForceDirected(config);fd.loadJSON(jsonData);fd.computeIncremental({iter:40,property:'end',onStep:function(perc){},onComplete:function(){fd.animate({modes:['linear'],transition:$jit.Trans.Elastic.easeOut,duration:2500});}});},hypertree:function(obj){var data=obj.data;var config=obj.Config[obj.chartType];var div=obj.container;config.injectInto=div;var divElement=document.getElementById(div);config.width=divElement.offsetWidth;config.height=divElement.offsetHeight;config.onCreateLabel=function(domElement,node){domElement.innerHTML=node.name;var style=domElement.style;domElement.className='shiva-node-label';style.fontSize=config.Label.size+'px';style.color=config.Label.color;style.fontWeight=config.Label.style;style.fontStyle=config.Label.style;style.fontFamily=config.Label.family;style.textAlign=config.Label.textAlign;style.cursor='crosshair';style.display='';$jit.util.addEvent(domElement,'click',function(){ht.onClick(node.id,{onComplete:function(){shivaLib.SendShivaMessage("ShivaNetwork=click",node.id);ht.controller.onComplete();}});});};config.onPlaceLabel=function(domElement,node){};config.onComplete=function(){return;}
config.Tips.onShow=function(tip,node){var count=0;node.eachAdjacency(function(){count++;});if(node.data.tip){tip.innerHTML="<div class='tip-title'>"+node.data.tip+"</div>";}else{tip.innerHTML="<div class='tip-title'>"+node.name+" is a <b>"+node.data.className+"</b> with "+count+" connections.</div>";}
tip.style.color='black';tip.style.fontFamily=config.Label.family;tip.style.backgroundColor='white';tip.style.padding='1em';tip.style.maxWidth='200px';tip.style.fontSize='10pt';tip.style.border='1px solid black';tip.style.opacity='0.99';tip.style.boxShadow='#555 2px 2px 8px';};var ht=new $jit.Hypertree(config);ht.loadJSON(data);ht.refresh();ht.controller.onComplete();}}
SHIVA_Show.prototype.DrawTimeGlider=function()
{if($('#cp_colorbar').is(":visible")==true||$('#cp_colormap').is(":visible")==true){return;}
var i;var stimeline=new Object();if($('link[href*=timeglider]').length==0){$('head').append('<link rel="stylesheet" href="css/timeglider/Timeglider.css" type="text/css" media="screen" title="no title" charset="utf-8">');}
stimeline.events=null;stimeline.options=this.options;stimeline.container=this.container;stimeline.con="#"+stimeline.container;$(stimeline.con).width(stimeline.options['width']);$(stimeline.con).height(stimeline.options['height']);$(stimeline.con).timeline('resize');this.GetSpreadsheet(stimeline.options.dataSourceUrl,true,stimeline.options.query,$.proxy(ProcessTimelineData,this));function ProcessTimelineData(data){eventData={events:new Array()};for(var n in data){var ev=data[n];for(var prop in ev){var val=ev[prop];if(prop=='icon'||val==''){continue;}
if((prop=="startdate")||(prop=="enddate")){ev[prop]=ConvertTimelineDate(val);}else if(typeof(val)=="string"){ev[prop]=val.replace(/[\n\r\f]/g,"<br/>");}
eventData.events.push(ev);data[n]=ev;}}
stimeline.events=eventData.events;if(typeof(stimeline.options.min_zoom)=="undefined"||stimeline.options.min_zoom==""||stimeline.options.min_zoom=="0"){stimeline.options.min_zoom=1;}
if(typeof(stimeline.options.max_zoom)=="undefined"||stimeline.options.max_zoom==""||stimeline.options.max_zoom=="0"){stimeline.options.max_zoom=99;}
if(typeof(stimeline.options.initial_zoom)=="undefined"||stimeline.options.initial_zoom==""||stimeline.options.initial_zoom=="0"){stimeline.options.initial_zoom=50;}
var stldata=[{"id":"stl"+(new Date()).getTime(),"title":stimeline.options.title,"description":"<p>"+stimeline.options.description+"</p>","focus_date":ConvertTimelineDate(stimeline.options.focus_date),"timezone":stimeline.options.timezone,"initial_zoom":stimeline.options.initial_zoom*1,"events":normalizeEventData(stimeline.events)}];if(typeof(window.shivaTimeline)=="undefined"){window.shivaTimeline=$(stimeline.con).timeline({"min_zoom":stimeline.options.min_zoom*1,"max_zoom":stimeline.options.max_zoom*1,"icon_folder":'images/timeglider/icons/',"data_source":stldata,"timezone":"-05:00","show_footer":Boolean(stimeline.options.show_footer),"display_zoom_level":Boolean(stimeline.options.display_zoom_level),"constrain_to_data":false,"image_lane_height":stimeline.options.imglane_height*1,"mousewheel":"none","loaded":function(args,data){$(stimeline.con).timeline('setOptions',stimeline.options,true);$(stimeline.con).timeline('registerEvents',stimeline.events);$(stimeline.con).timeline('eventList');if(stimeline.options.show_desc=="false"){$('.tg-timeline-modal').fadeOut();}
shivaLib.SendReadyMessage(true);}});}else{var callbackObj={fn:function(args,data){setTimeout(function(){$(stimeline.con).timeline('setOptions',stimeline.options,true);$(stimeline.con).timeline('registerEvents',stimeline.events);$(stimeline.con).timeline('eventList');if(stimeline.options.show_desc=="false"){$('.tg-timeline-modal').fadeOut();}},500);},args:{"min_zoom":stimeline.options.min_zoom*1,"max_zoom":stimeline.options.max_zoom*1,"icon_folder":'images/timeglider/icons/',"data_source":stldata,"timezone":"-05:00","mousewheel":"none","show_footer":Boolean(stimeline.options.show_footer),"display_zoom_level":Boolean(stimeline.options.display_zoom_level),"constrain_to_data":false,"image_lane_height":stimeline.options.imglane_height*1,},display:true};$(stimeline.con).timeline('loadTimeline',stldata,callbackObj);}
window.stlInterval=setInterval(function(){$('.timeglider-ev-modal').draggable({cancel:'div.tg-ev-modal-description'});},500);function ConvertTimelineDate(dateTime){if(typeof(dateTime)=='undefined'){return'';}
var dt=dateTime;if(typeof(dateTime)=="number"){dateTime=dateTime.toString();}
if(typeof(dateTime)=='string'){var m=dateTime.match(/\//g);if(m!=null&&m.length==1){var dp=dateTime.split('/');dp.splice(1,0,"15");dateTime=dp.join('/');}
var dt=new Date();var dp=dateTime.split('/');var y=$.trim(dp[dp.length-1]);if(y.indexOf(' ')>-1){pts=y.split(' ');y=pts[0];if(pts[1].indexOf(':')>-1){tpts=pts[1].split(":");if(tpts.length==3){dt.setHours(tpts[0]);dt.setMinutes(tpts[1]);dt.setSeconds(tpts[2]);}}}
dt.setFullYear(y);var m=(dp.length>1)?dp[dp.length-2]:1;dt.setMonth((m*1)-1);var d=(dp.length>2)?dp[dp.length-3]:15;dt.setDate(d);}
if(typeof(dt)=="undefined"||dt==null){return'';}
var mn=padZero(dt.getMonth()+1);var dy=padZero(dt.getDate());var hrs=padZero(dt.getHours());var mns=padZero(dt.getMinutes());var scs=padZero(dt.getSeconds());var dtstr=dt.getFullYear()+"-"+mn+"-"+dy+" "+hrs+":"+mns+":"+scs;return dtstr;}
function padZero(n){if(n<10){n='0'+n;}
return n;}
function normalizeEventData(events){var ct=0;for(var i in events){ct++;var ev=events[i];if(typeof(ev.id)=="undefined"||ev.id==null){ev.id="event-"+ct;}else{ev.id=ev.id+"-"+ct;}
if(typeof(ev.startdate)=="undefined"&&typeof(ev.start)!="undefined"){ev.startdate=ConvertTimelineDate(ev.start);}
if(typeof(ev.enddate)=="undefined"&&typeof(ev.end)!="undefined"){ev.enddate=ConvertTimelineDate(ev.end);}
if(typeof(ev.enddate)=="undefined"||ev.enddate==""||ev.enddate==null){ev.enddate=ev.startdate;}
if(typeof(ev.importance)=="undefined"||ev.importance==""||ev.importance==null){ev.importance=50;}
if(typeof(ev.date_display)=="undefined"||ev.date_display==""||ev.date_display==null){ev.date_display="ye";}
if(typeof(ev.icon)=="undefined"||ev.icon==""||ev.icon==null){ev.icon="none";}}
return events;}}};SHIVA_Show.prototype.DrawTimeline=function(oldItems)
{var i;var eventData=null;var options=this.options;var container=this.container;var con="#"+container;var ops=new Array();var items=new Array();$(con).css('width',options['width']+"px");$(con).css('height',options['height']+"px");var eventSource=new Timeline.DefaultEventSource();$("#timelineCSS").attr('href',"css/timeline"+options.theme+".css");if(oldItems)
items=oldItems;else
for(var key in options){if(key.indexOf("item-")!=-1){var o=new Object;var v=options[key].split(';');for(i=0;i<v.length;++i)
o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");items.push(o);}}
this.items=items;for(i=0;i<items.length;++i){if(items[i].visible=="false")
continue;o=new Object();o.width=items[i].pct+"%";o.intervalUnit=eval("Timeline.DateTime."+items[i].intu.toUpperCase());o.intervalPixels=Number(items[i].intw);o.eventSource=eventSource;o.date=items[i].date;o.overview=(items[i].text=="false");var theme=Timeline.ClassicTheme.create();theme.event.tape.height=Number(items[i].thgt);theme.event.track.height=Number(items[i].thgt)+2;o.theme=theme;ops.push(Timeline.createBandInfo(o));if(i){if(items[i].sync!="None")
ops[i].syncWith=Number(items[i].sync)-1;ops[i].highlight=(items[i].high=="true");}}
i=(options['orientation']!="Vertical")?0:1;if(this.timeLine)
Timeline.timelines.pop();this.timeLine=Timeline.create(document.getElementById(container),ops,i);if(options['dataSourceUrl'])
GetSpreadsheetData(options['dataSourceUrl'],"",this);else{this.timeLine.loadJSON("SimileTestData.js",function(json,url){eventSource.loadJSON(json,url);});this.SendReadyMessage(true);}
function GetSpreadsheetData(file,conditions,_this)
{lastDataUrl=file.replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");var query=new google.visualization.Query(lastDataUrl);if(conditions)
query.setQuery(conditions);query.send(handleQueryResponse);function handleQueryResponse(response){var i,j,key,s=0;var data=response.getDataTable();var rows=data.getNumberOfRows();var cols=data.getNumberOfColumns();eventData={events:new Array()};if(!$.trim(data.getColumnLabel(0)))
s=1;for(i=s;i<rows;++i){o=new Object();for(j=0;j<cols;++j){key=$.trim(data.getColumnLabel(j));if(!key)
key=$.trim(data.getValue(0,j));if((key=="icon")&&(!data.getValue(i,j)))
continue;if((key=="start")||(key=="end")){if(data.getFormattedValue(i,j))
o[key]=_this.ConvertDateToJSON(data.getFormattedValue(i,j));}
else
o[key]=data.getValue(i,j);}
eventData.events.push(o);}
eventSource.loadJSON(eventData,'');shivaLib.SendReadyMessage(true);}}};SHIVA_Show.prototype.TimeActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100"){$("#"+shivaLib.container).width("100%");$("#"+shivaLib.container).height("100%");}
$("#"+shivaLib.container).timeline('resize');}};SHIVA_Show.prototype.ColorPicker=function(mode,attr){$("#shiva_dialogDiv").remove();var self=this;var sel="";if(isNaN(attr))
sel="#"+attr.replace(/___/g,"");else if(attr<0)
sel="#colordiv";else if(attr>100)
sel="#itemInput"+(Math.floor(attr/100)-1)+"-"+(attr%100);else sel="#propInput"+attr;var inputBox=$(sel);var inputBoxChip=$(sel+"C");this.HEX_to_HSV=function(hexString){var value=hexString.substring(1);var r=parseInt(value.substring(0,2),16)/255;var g=parseInt(value.substring(2,4),16)/255;var b=parseInt(value.substring(4,6),16)/255;var max=Math.max.apply(Math,[r,g,b]);var min=Math.min.apply(Math,[r,g,b]);var hue;var sat;var val=max;var delta=max-min;if(max!=0)
sat=delta/max;else{sat=0;hue=0;return;}
if(delta==0){return[0,0,val];}
if(r==max)
hue=(g-b)/delta;else if(g==max)
hue=2+(b-r)/delta;else
hue=4+(r-g)/delta;hue*=60;if(hue<0)
hue+=360;return[hue,sat,val];}
this.RGB_to_HSV=function(r,g,b){var max=Math.max.apply(Math,[r,g,b]);var min=Math.min.apply(Math,[r,g,b]);var hue;var sat;var val=max;var delta=max-min;if(max!=0)
sat=delta/max;else{sat=0;hue=0;return[hue,sat,val];}
if(delta==0){return[0,0,val];}
if(r==max){hue=(g-b)/delta;}else if(g==max){hue=2+(b-r)/delta;}else{hue=4+(r-g)/delta;}
hue*=60;if(hue<0)
hue+=360;return[hue,sat,val];}
this.HSV_to_HEX=function(h,s,v){if(h===0)
h=.001;else if(h==360)
h=359.999;chroma=v*s;hprime=h/60;x=chroma*(1-Math.abs(hprime%2-1));var r;var g;var b;if(h==0)
r,g,b=0;else if(hprime>=0&&hprime<1){r=chroma;g=x;b=0;}else if(hprime>=1&&hprime<2){r=x;g=chroma;b=0;}else if(hprime>=2&&hprime<3){r=0;g=chroma;b=x;}else if(hprime>=3&&hprime<4){r=0;g=x;b=chroma;}else if(hprime>=4&&hprime<5){r=x;g=0;b=chroma;}else if(hprime>=5&&hprime<6){r=chroma;g=0;b=x;}
m=v-chroma;r=Math.round(255*(r+m));g=Math.round(255*(g+m));b=Math.round(255*(b+m));return self.RGB_to_HEX(r,g,b);}
this.RGB_to_HEX=function(r,g,b){h1=Math.floor(r/16).toString(16);h2=Math.floor((r%16)).toString(16);h3=Math.floor(g/16).toString(16);h4=Math.floor((g%16)).toString(16);h5=Math.floor(b/16).toString(16);h6=Math.floor((b%16)).toString(16);return"#"+h1+h2+h3+h4+h5+h6;}
var hue=0;var sat=1;var val=1;var cp_current=0;var cp_first=0;var z=($('.ui-widget-overlay').length>0)?($('.ui-widget-overlay').css('z-index')+1):'auto';$('body').append($("<div>",{id:'shiva_dialogDiv',css:{zIndex:z,position:'absolute',right:'100px',top:'30px',width:'240px',marginLeft:'2px',marginRight:'2px',padding:'5px',paddingBottom:'30px',paddingTop:'10px'}}).draggable().addClass("propTable"));$("#shiva_dialogDiv").append($("<div>",{id:'cp_colorbar',css:{position:'absolute',right:'1px',top:'-1px',width:'244px',height:'22px',borderTopLeftRadius:'8px',borderTopRightRadius:'8px'}}));$("#cp_colorbar").append($("<a>",{css:{width:'30px',height:'20px',position:'relative',left:'-5px',float:'left',border:'0',borderRadius:'0',borderTopLeftRadius:'8px',borderRight:'1px solid gray',borderBottom:'1px solid gray'},click:function(){if(cp_first>0)
cp_first--;self.position_bar();}}).button({icons:{primary:'ui-icon-arrowthick-1-w'},text:false}).addClass("cbar_control"));$("#cp_colorbar").append($("<a>",{css:{width:'28px',height:'20px',position:'absolute',left:'216px',top:'0px',border:'0',borderRadius:'0',borderTopRightRadius:'8px',borderLeft:'1px solid gray',borderBottom:'1px solid gray'},click:function(){if(cp_first<$(".tab").length-5)
cp_first++
self.position_bar();}}).button({icons:{primary:'ui-icon-arrowthick-1-e'},text:false}).addClass("cbar_control"));$("#cp_colorbar").append($("<a>",{css:{width:'18.5px',height:'20px',position:'absolute',top:'0',left:'196px',border:'0',borderRadius:'0',borderLeft:'1px solid gray',borderBottom:'1px solid gray'},click:function(){cp_first++;self.add();}}).button({icons:{primary:'ui-icon-plusthick'},text:false}).addClass("cbar_control"));$("#cp_colorbar a").hover(function(){$(this).css("cursor","pointer");});$("#shiva_dialogDiv").append($("<span>",{html:"S&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B",css:{color:'gray',position:'absolute',top:'25px',left:'186px'}}));$("#shiva_dialogDiv").append($("<div>",{id:'cp_colormap',css:{position:'relative',top:'20px',width:'150px',padding:'2px',height:'150px'}}));$("#cp_colormap").append($("<img>",{src:'hsv_wheel.png',click:function(e){self.position((e.pageX-$(this).parent().offset().left),(e.pageY-$(this).parent().offset().top));}}))
$("#shiva_dialogDiv").append($("<input>",{id:'cp_current',maxLength:'7',css:{position:'absolute',top:'97px',left:'52.5px',width:'58px',height:'20px',border:'0',textAlign:'center',backgroundColor:'transparent'},change:function(){var val=$(this).attr("value");if(val[0]!="#")
val="#"+val;if(val=="none")
self.update(null);else if(val.length===7){var hsv=self.HEX_to_HSV(val);if(hsv==-1){self.setColor(0,0,0);$(this).attr("value","000000");}else{hue=hsv[0];sat=hsv[1];val=hsv[2];self.setColor(hue,sat,val);}}}}));$("#shiva_dialogDiv").append($("<div>",{id:'cp_brightness',title:'brightness',css:{width:'5px',height:'85px',position:'relative',right:'24.5px',top:'-120px',float:'right',borderRadius:'8px',border:'1px solid gray'}}).slider({value:100,orientation:'vertical'}).addClass("slider"));$("#shiva_dialogDiv").append($("<div>",{id:'cp_saturation',title:'saturation',css:{width:'5px',height:'85px',position:'relative',right:'45.5px',top:'-120px',float:'right',borderRadius:'8px',border:'1px solid gray'}}).slider({value:100,orientation:'vertical'}).addClass("slider"));$(".slider a").css("width",'20px');$(".slider a").css("height",'10px');$(".slider a").css("left","-8px");$(".slider").first().slider("option","slide",function(){self.setColor(hue,sat,$(this).slider("option","value")/100);});$(".slider").last().slider("option","slide",function(){self.setColor(hue,$(this).slider("option","value")/100,val);});$("#shiva_dialogDiv").append($("<div>",{id:'cp_chip',css:{border:'1px solid gray',borderRadius:'4px',width:'50px',height:'30px',position:'relative',left:'172px',top:'-25px'}}));$("#shiva_dialogDiv").append($("<div>",{id:'cp_basic',css:{width:'216px',position:'relative',left:'10px'}}));$("#cp_basic").append($("<div>",{id:'basic_colors',css:{position:'absolute',width:'216px',height:'20px',border:'1px solid gray'}}))
$("#cp_basic").append($("<div>",{id:'neutral',css:{position:'absolute',top:'20px',width:'216px',height:'20px',border:'1px solid gray'}}))
var form=[16,16];for(var i=0;i<2;i++){var html="";for(var j=0;j<form[i];j++){html+="<div class= \'chips\' style=\'height:100%;width:"+((1/form[i])*100)+"%;float:left\'></div>";}
$("#cp_basic").children().eq(i).html(html);}
for(var i=0;i<16;i++){$("#basic_colors").children().eq(i).css("backgroundColor",self.HSV_to_HEX((i*22.5),1,1))}
for(var i=0;i<16;i++){$("#neutral").children().eq(i).css("backgroundColor",self.HSV_to_HEX(0,0,(i*0.06666666666666667)));}
$("#cp_basic").children().children().click(function(){var color=$(this).css("backgroundColor");color=color.slice(4,color.length-1);color=color.split(",");var hsv=self.RGB_to_HSV(color[0]/255,color[1]/255,color[2]/255);self.setColor(hsv[0],hsv[1],hsv[2]);});$("#shiva_dialogDiv").append($("<div>",{id:'cp_control',css:{width:'216px',height:'30px',position:'relative',top:'50px'}}));$("#cp_control").append($("<button>",{id:'cp_schemes',html:'Schemes',css:{left:'18px'},click:function(){$("#cp_schemediv").toggle();}}).addClass("button"));$("#shiva_dialogDiv").append($("<div>",{id:'cp_schemediv',css:{height:'160px',position:'relative',top:'60px',paddingBottom:'30px'}}));$("#cp_schemediv").hide();$("#cp_schemediv").append($("<div>",{id:'cp_schemebox'}));for(var i=0;i<4;i++){$("#cp_schemebox").append($("<div>",{css:{width:'100%',height:'35px',position:'relative',top:'-5px',paddingBottom:'2px',paddingTop:'2px'}}));};var names=[["monochromatic"],["complementary","split-complementary"],["triadic","analagous"],["tetrad"]];var form=[[16],[2,3],[3,3],[4]];for(var i=0;i<form.length;i++){for(var j=0;j<form[i].length;j++){$("#cp_schemebox").children().eq(i).append($("<div>",{html:"<center>"+names[i][j]+"</center>",css:{float:'left',position:'absolute',top:'0',left:(((92/form[i].length)+2)*j)+2+"%",fontSize:'10px',width:92/form[i].length+"%",height:'100%'}}));for(var k=0;k<form[i][j];k++){$("#cp_schemebox").children().eq(i).children("div").eq(j).append($("<div>",{css:{float:'left',position:'relative',top:'1px',width:100/form[i][j]+"%",height:'50%'}}));}}}
$("#cp_schemebox").children().children().css("fontSize","8.5px");$("#cp_schemebox div:not(:has(*))").filter("div").click(function(){var color=$(this).css("backgroundColor");color=color.slice(4,color.length-1);color=color.split(",");color=self.RGB_to_HEX(color[0],color[1],color[2]);$(".tab").eq(cp_current).children().first().css("backgroundColor",color);$(".tab").eq(cp_current).children().first().html("");self.drawColors(color);});$("#cp_control").append($("<button>",{id:'cp_nocolor',html:"No color",css:{left:'22px'},click:function(){self.update("none");}}).addClass("button"));$("#cp_control").append($("<button>",{id:'cp_OK',html:"OK",css:{width:'60px',left:'35px'},click:function(){$("#shiva_dialogDiv").remove();return;}}).addClass("button"));$(".button").button();$(".button").css({position:'relative',borderRadius:'8px',float:'left',fontSize:'9px',top:'3px'});this.scheme=function(){for(var i=0;i<16;i++){$("#cp_schemebox").children("div").eq(0).children("div").eq(0).children("div").eq(i).css("backgroundColor",self.HSV_to_HEX(hue,(1-(i/16)),1));}
$("#cp_schemebox").children("div").eq(1).children("div").eq(0).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(1).children("div").eq(0).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX((hue+180)%360,sat,val));$("#cp_schemebox").children("div").eq
(1).children("div").eq(1).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(1).children("div").eq(1).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX((hue+150)%360,sat,val));$("#cp_schemebox").children("div").eq(1).children("div").eq(1).children("div").eq(2).css("backgroundColor",self.HSV_to_HEX((hue+210)%360,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX((hue+120)%360,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(2).css("backgroundColor",self.HSV_to_HEX((hue+240)%360,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX((hue+330)%360,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(2).css("backgroundColor",self.HSV_to_HEX((hue+390)%360,sat,val));$("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX((hue+30)%360,sat,val));$("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(2).css("backgroundColor",self.HSV_to_HEX((hue+180)%360,sat,val));$("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(3).css("backgroundColor",self.HSV_to_HEX((hue+210)%360,sat,val));}
this.update=function(attr,value){if(attr=="none"){$(".tab").eq(cp_current).children().html("<center>none</center>");$(".tab").eq(cp_current).children().css("backgroundColor","white");$("#cp_chip").css("backgroundColor","white");$("#cp_chip").css("border","1px dashed gray");$(".slider").first().slider("option","value",100);$(".slider").last().slider("option","value",100);inputBox.val("none");inputBox.css('border-color',"white");inputBoxChip.css('background-color',"white");$("#shiva_dialogDiv").remove();Draw();}else if(attr==null){$(".tab").eq(cp_current).children().html("");$(".tab").eq(cp_current).children().css("backgroundColor","transparent");$("#cp_current").attr("value","");$("#cp_chip").css("backgroundColor","transparent");$("#cp_chip").css("border","1px dashed gray");$(".slider").first().slider("option","value",100)
$(".slider").last().slider("option","value",100)}else{if(attr=="saturation"){sat=value;}else if(attr=="brightness"){val=value;}else if(attr=="hue"){hue=value;}
var color=self.HSV_to_HEX(hue,sat,val);$("#cp_chip").css("backgroundColor",color);$("#cp_chip").css("border","1px solid gray");$(".tab").eq(cp_current).children().css("backgroundColor",color)
if(color.match(/NaN/))
color="#none";$("#cp_current").attr("value",color.slice(1))
$(".tab").eq(cp_current).children().html('');$(".slider").first().slider("option","value",val*100)
$(".slider").last().slider("option","value",sat*100)}
self.scheme()}
this.add=function(color_HEX){cp_current=$(".tab").length;$("#cp_colorbar a:eq(1)").before($("<div>",{css:{height:'16px',width:'28px',border:'1px solid gray',borderTop:'0',padding:'2px',position:'relative',left:'-6px',float:'left'},click:function(){$(".tab:not(:eq("+$(this).index(".tab")+"))").css("borderBottom",'1px solid gray');$(this).css("borderBottom",'0');cp_current=$(this).index(".tab");}}).addClass("tab").append($("<div>",{css:{fontSize:'10px',width:"100%",height:'100%'}})).append($("<img>",{src:'cpclose.png',css:{width:'4px',position:'absolute',top:'2.5px',right:'2.5px'},mouseenter:function(){$(this).css({width:'10px'})},mouseleave:function(){$(this).css({width:'4px'})},click:function(){cp_current=$(this).parent().index(".tab");self.removeTab();}})));if(color_HEX=="none"){$('.tab').last().children().css("backgroundColor","transparent");self.update("none");}else if(color_HEX==null){$('.tab').last().children().css("backgroundColor","transparent");self.update(null);}else{$('.tab').last().children().css("backgroundColor",color_HEX);var color=self.HEX_to_HSV(color_HEX);if(typeof color!="undefined")
self.setColor(color[0],color[1],color[2]);else
self.setColor(0,0,0);}
self.position_bar();}
this.drawColors=function(color_HEX){if(mode!=0){var colors=inputBox.val().split(",");colors[cp_current]=color_HEX.slice(1);var boxChip=colors[cp_current];boxChip="#"+boxChip;inputBox.css('border-color',boxChip);inputBoxChip.css('background-color',boxChip);var str=colors.toString();if(str[str.length-1]!=",")
str+=",";if(str.match(/NaN/))
str="none";inputBox.val(str);}
else{var boxChip=color_HEX;inputBox.css('border-color',boxChip);inputBoxChip.css('background-color',boxChip);inputBox.val(boxChip.slice(1,boxChip.length));}
Draw();}
this.setColor=function(h,s,v){self.update("hue",h);self.update("saturation",s);self.update("brightness",v);self.drawColors(self.HSV_to_HEX(h,s,v));}
this.position_bar=function(){if(cp_current>cp_first+4)
cp_current=cp_first+4;$(".tab").eq(cp_current).click();$(".tab").show();$(".tab:lt("+cp_first+")").hide();$(".tab:gt("+(cp_first+4)+")").hide();}
this.position=function(x,y){var xrel=x-75;var yrel=75-y;var angleR=Math.atan2(yrel,xrel);var angle=angleR*(180/Math.PI);var h;if(angle>0){h=(360-(angle-90))%360;}else{h=90+(angle-(angle*2));}
self.setColor(h,1,1);}
this.removeTab=function(){$(".tab").eq(cp_current).remove();var colors=inputBox.val();colors=colors.split(",");colors.splice(cp_current,1)
var str=colors.toString();if(str[str.length-1]!=",")
str=str+",";inputBox.val(str);while($(".tab").length<5)
self.add();cp_current=cp_first;$(".tab").eq(cp_current).click();Draw();}
var oldcols=inputBox.val();if(mode==0){$("#cp_colorbar").hide();if(oldcols!=""){if(oldcols[0]!="#")
oldcols="#"+oldcols;var color=self.HEX_to_HSV(oldcols);self.setColor(color[0],color[1],color[2]);}}
else{$("#cp_nocolor").hide();$("#cp_OK").css("left",'90px');if(oldcols!=""){oldcols=oldcols.split(",");var rem=6-oldcols.length;for(var i=0;i<oldcols.length;i++){if(oldcols[i]!=""){self.add("#"+oldcols[i]);}}
if(rem>0){for(var j=0;j<rem;j++){self.add();}}}else{for(var j=0;j<5;j++){self.add();}}
$(".tab").first().click();Draw();$(".tab").hover(function(){$(this).css("cursor","pointer");});}
$("#cp_schemebox div:not(:has(*))").hover(function(){$(this).css("cursor","pointer");});$("#cp_basic div:not(:has(*))").hover(function(){$(this).css("cursor","pointer");});$(".slider a").hover(function(){$(this).css("cursor","pointer");});}
function CSV(inputID,mode,output_type,callback){var self=this;var cellopts=[',','\t','other']
var textopts=['\"','\''];var cellDelim=',';var quote='\''
var CSV_title='';var csvHasHeader=false;var CSV_data=[];var input='';$.get('proxy.php',{url:$('#'+inputID).val()},function(data){input=data;if(data==-1){console.log("Bad data source.");alert("Please check your source URL...we didn't find anything at the other end.");return;}else{CSV_title=$('#'+inputID).val().split('/').pop().split(".")[0];if(mode==='hide'){self.prep();self.parse();self.done();}else if(mode==='show'){self.prep();self.show(10);}else
console.log("Bad mode type.");}});self.prep=function(){input=input.replace(/\n\r/g,'\n');input=input.replace(/\r\n/g,'\n');input=input.replace(/\r/g,'\n');var c=input.split(',').length;var t=input.split('\t').length;var cn=input.split(';').length
if(c>=t&&c>=cn)
cellDelim=',';else if(t>=c&&t>=cn)
cellDelim='\t';else if(cn>=c&&cn>=t)
cellDelim=';';quote=(input.split("\"").length>=input.split("\'").length)?"\"":"\'";}
self.parse=function(n){var cell="";var row=0;var text=false;CSV_data[row]=[];for(var i=0;i<input.length;i++){if(typeof n!=='undefined'&&row===n)
break;text=(RegExp(quote,'g').test(input[i]))?!text:text;if(text)
cell+=input[i];else{if(/\n/g.test(input[i])){CSV_data[row].push(cell);cell="";row++;if(typeof input[i+1]!='undefined')
CSV_data[row]=[];}else if(RegExp(cellDelim,'g').test(input[i])){CSV_data[row].push(cell);cell="";}else{cell+=input[i];}}}
if(typeof CSV_data[0][0]!=typeof CSV_data[1][0]){csvHasHeader=true;}}
self.init=function(){$('body').append($("<div>",{id:'CSV_overlay',css:{color:'black',position:'absolute',top:'0',left:'0',width:$(document).width(),height:'150%',opacity:'0.4',backgroundColor:'black'}}).append($('<div>',{id:'CSV_preview',css:{padding:'56px',position:'absolute',top:'10%',left:'20%',width:'800px',height:'400px',backgroundColor:'white',borderRadius:'5px'}}).append($("<div>",{id:'CSV_preview_table',marginLeft:'auto',marginRight:'auto',css:{overflow:'scroll',position:'absolute',top:'25%',height:'330px',width:'86%',borderRadius:'5px',border:'solid thin gray'}})).append($("<div>",{id:'csvControl',css:{position:'absolute',top:'2%',bottom:'76%',width:'86%',borderRadius:'5px'}}))));$("#csvControl").append($("<p>",{css:{position:'relative',left:'5px'}}).append($("<span>",{html:"Title: "})).append($("<input>",{id:'titleInput',value:CSV_title,css:{position:'relative',left:'5px',marginRight:'40px'},change:function(){CSV_title=$(this).val();}})).append($("<span>",{html:'Data has header row?'})).append($("<input>",{id:'dataHasHeader',type:'checkbox',checked:(csvHasHeader)?true:false,css:{position:'relative',left:'5px'},change:function(){csvHasHeader=($(this).is(":checked"))?true:false;self.show()}}))).append($("<p>",{css:{position:'relative',left:'5px'}}).append($("<span>",{html:"Cell delimiter: "})).append($("<select>",{id:'cellDelimInput',html:'<option value=0>Comma (,)</option><option value=1>Tab (\\t)</option><option value=2> Other </option>',css:{width:'100px',position:'relative',left:'5px',marginRight:'40px'},change:function(){if($(this).val()==2){$("#cellDelimOther").show();}else{$("#cellDelimOther").hide();cellDelim=cellopts[$(this).val()];self.show();}}})).append($("<span>",{html:'Text delimitier: '})).append($("<select>",{id:'textDelimInput',html:"<option value=0>Double quote (\")</option><option value=1>Single quote (\')</option>",css:{position:'relative',left:'5px'},change:function(){quote=textopts[$(this).val()];self.show();}})));$('#CSV_overlay').append($("<input>",{id:'cellDelimOther',css:{height:$('#cellDelimInput').css('height')-2,width:'75px',position:'absolute',left:$('#cellDelimInput').offset().left,top:$('#cellDelimInput').offset().top},change:function(){cellDelim=$(this).val();self.show();}}).hide());$('#CSV_preview').append($("<button>",{html:'Back',css:{position:'absolute',bottom:'15px',left:'350px'},click:function(){$(input).val("");$('#CSV_overlay').remove();}}).button()).append($("<button>",{html:'Accept',css:{position:'absolute',bottom:'15px',right:'391px'},click:function(){self.done();}}).button())
$('#cellDelimInput').val(cellDelim);$('#textDelimInput').val(quote);}
self.show=function(){if($('#CSV_overlay').length>0)
$('#CSV_preview_table').children().remove();else
self.init();self.parse(10);var gwidth;for(var i=0;i<10;i++){var odd=(i%2==0)?'lightgray':'transparent';$("#CSV_preview_table").append($("<div>",{css:{height:$('#CSV_preview_table').height()/10+'px',backgroundColor:odd}}).addClass("row"));for(var j=0;j<CSV_data[i].length;j++){var alignment='right';if(isNaN(CSV_data[i][j]))
alignment='left';$("#CSV_preview_table").children().eq(i).append($("<div>",{html:(i===0&&csvHasHeader)?'<center><strong>'+CSV_data[i][j]+'</strong></center>':CSV_data[i][j],align:alignment,css:{paddingLeft:'2px',paddingRight:'2px',height:$('#CSV_preview_table').height()/10+'px',float:'left',outline:'1px solid black'}}).addClass("col"+j));if($('.col'+j).length>1&&$('.col'+j).last().width()>$('.col'+j).eq($('.col'+j).last().index('.col'+j)-1).width()){$('.col'+j).css('width',$('.col'+j).last().width()+'px');}else{$('.col'+j).last().css('width',$('.col'+j).width()+'px');}}}
var gwidth=0;for(var i=0;i<$('.row').last().children().length;i++){gwidth+=$('.row').last().children().eq(i).width();}
$('.row').css('width',(gwidth+(CSV_data[0].length*4))+'px');}
self.to_JSON=function(){if(CSV_data.length==0){throw new Error("The CSV_data source is empty.")
return;}else{var table={"title":(CSV_title!="")?CSV_title:"New Table","headers":(csvHasHeader)?CSV_data[0]:null,"data":(csvHasHeader)?CSV_data.slice(1):CSV_data}
$("#CSV_overlay").remove();return table;}}
self.done=function(){self.parse();if(callback!=null){if(output_type==='JSON'){callback(self.to_JSON());}else if(output_type==='Google')
callback(self.to_Gtable());else if(output_type==='Array'){callback(CSV_data);}
else{console.log('Output type not recognized or not implemented.');return;}}else{if(output_type==='JSON')
return(self.toJSON());else if(output_type==='Google')
return(self.to_Gtable());else if(output_type==='Array')
return CSV_data;else
console.log('Output type not recognized or not implemented.');}}}
SHIVA_Show.prototype.DrawWordCloud=function(){var wcloud;var fill=d3.scale.category20();if(!this.wcloud){wcloud=new wordCloud(this.container);this.wcloud=wcloud;wcloud.options=this.options;wcloud.load(this.options.dataSourceUrl);wcloud.ready=false;}else{wcloud=this.wcloud;var props=Object.keys(this.options);for(var i=0;i<props.length;i++){var prop=props[i];if(this.wcloud.options[prop]!=this.options[prop]){if(prop=="dataSourceUrl"){wcloud.options=this.options;wcloud.load(wcloud.options['dataSourceUrl']);break;}else if(prop=="width"||prop=="height"||prop=="low_threshold"||prop=="high_threshold"||prop=='tiltRange'||prop=="scale"){wcloud.options=this.options;wcloud.buildLayout(wcloud.d);}else{switch(prop){case'font_name':d3.selectAll('text').style('font-family',this.options.font_name);break;case'backgroundColor':if(typeof this.options.backgroundColor=='undefined'||this.options.backgroundColor=='')
this.options.backgroundColor='ffffff';d3.select('rect').style('fill','#'+this.options.backgroundColor);break;case'spectrum':wcloud.colorize(this.options.spectrum);break;case'title':d3.select('#cloudTitle').text(this.options.title);break;case'titleColor':d3.select('#cloudTitle').attr('fill','#'+this.options.titleColor);break;case'titleFontSize':d3.select('#cloudTitle').style('font-size',this.options.titleFontSize+'px');break;case'wordList':if(this.options.wordList=="true")
$('#cloudShowListButton').show();else{$('#cloudShowListButton').hide();$('#wordCloudWordList').hide();}
break;}}}}
wcloud.options=this.options;}
function wordCloud(container){this.d=[];this.filterSet=[];this.container=container;this.draw=function(data,bounds){$('svg').remove();$('#cloudLoad').remove();var svg=d3.select("#"+wcloud.container).append("svg").attr("id","wordCloud").attr("width",wcloud.options.width+"px").attr("height",wcloud.options.height+"px");svg.append("g").attr('fill','none').attr('scale','').append('rect').attr('x',0).attr('y',0).attr('width','100%').attr('height','90%').style('fill',(typeof wcloud.options.backgroundColor=="undefined"||wcloud.options.backgroundColor=="")?'white':'#'+wcloud.options.backgroundColor);var t=d3.select('g').selectAll("text").data(data);t.enter().append("text").attr('class','word').style("font-size",function(d){return d.size+"px";}).style("font-family",wcloud.options.font_name).style("fill",function(d,i){if(typeof d.color!='undefined')
return(d.color[0]=="#")?d.color:'#'+d.color;return fill(i);}).attr("text-anchor","middle").attr("transform",function(d){return"translate("+[d.x+wcloud.options.width/2,d.y+wcloud.options.height/2]+")rotate("+d.rotate+")";}).text(function(d){return d.text;});t.exit().remove();d3.select('svg').append('text').attr('id','cloudTitle').text(wcloud.options.title).style('font-size',wcloud.options.titleFontSize+'px').attr('text-anchor','middle').attr('y',wcloud.options.height-(wcloud.options.titleFontSize)).attr('x',wcloud.options.width/2);if($('#wordCloudWordList').length==0){$('#containerDiv').append($('<a>').attr('id','cloudShowListButton').css({position:'absolute',top:'10px',left:0,width:'25px',height:'20px'}).click(function(){$('#wordCloudWordList').toggle();}).button({icons:{primary:'ui-icon-script'}}).hide());$('#containerDiv').append($('<div>',{id:'wordCloudWordList',css:{position:'absolute',top:'10px',left:'20px',height:(wcloud.options.height*0.6)+"px",width:'120px',borderRadius:'8px',border:'5px solid #EEE',backgroundColor:'white',overflow:'scroll',padding:'5px'}}).hide());}
d3.selectAll('.listEntry').remove();d3.select('#wordCloudWordList').selectAll('.listEntry').data(wcloud.d).enter().append('div').attr('class','listEntry').style('vertical-align','middle').style('height','20px').style('width','100px').text(function(d){return d.text+" ("+d.freq+")";}).on('click',function(d){console.log(d.text+" : "+d.freq);shivaLib.SendShivaMessage("ShivaWord=click",d.text+"|"+d.freq);$('.listEntry').css('backgroundColor','white');$(this).css('backgroundColor','rgba(255,255,105,0.5)');});var listClickHandler=function(e,pass){e.preventDefault();e.stopPropagation();if(typeof pass=="undefined")
pass=false;if($(this).hasClass('ui-icon-close')){$(this).removeClass('ui-icon-close').addClass('ui-icon-arrowreturnthick-1-w');$(this).parent().css('opacity',0.5);}
else{$(this).removeClass('ui-icon-arrowreturnthick-1-w').addClass('ui-icon-close');$(this).parent().css('opacity',1);}
var word=$(this).parent().text().split(' ')[0];if(!pass)
wcloud.filter();};$('.listEntry').append($('<span>',{css:{float:'right'}}).addClass('listEntryFilter ui-icon ui-icon-close').on('click',listClickHandler));$('.listEntry').filter(function(i){return wcloud.filterSet.indexOf($(this).text().split(' ')[0])!=-1;}).find('span').trigger('click',[true]);if(wcloud.options.wordlist=="true"){$('#cloudShowListButton').show();}
shivaLib.SendReadyMessage(true);if(typeof wcloud.options.spectrum!="undefined"&&wcloud.options.spectrum!="")
wcloud.colorize(wcloud.options.spectrum);d3.selectAll('.word').on("click",function(d){console.log(d.text+" : "+d.freq);shivaLib.SendShivaMessage("ShivaWord=click",d.text+"|"+d.freq);});if(!wcloud.ready){shivaLib.SendShivaMessage("ShivaWord=ready");wcloud.ready=true;}};this.buildLayout=function(words){if(typeof wcloud.options.height=="string"&&wcloud.options.height.indexOf('%')!=-1)
wcloud.options.height=$('#containerDiv').height()*(wcloud.options.height.slice(0,-1)/100);if(typeof wcloud.options.width=="string"&&wcloud.options.width.indexOf('%')!=-1)
wcloud.options.width=$('#containerDiv').width()*(wcloud.options.width.slice(0,-1)/100);var count=0;var l=words.length;for(var i=0;i<l;i++){count+=words[i].freq;}
var avg=count/l;var distro=(words[0].freq-avg)/(words[0].freq);var fs;if(wcloud.options.scale=="logarithmic")
fs=d3.scale.log().range([5,100]);else if(wcloud.options.scale=="linear")
fs=d3.scale.linear().domain([0,words[0].freq]).range([10,100]);else if(wcloud.options.scale=="binary")
fs=d3.scale.quantile().range([0,(wcloud.options.height/(words.length/5))]);var high,low;low=(typeof wcloud.options.low_threshold=='undefined'||wcloud.options.low_threshold=='')?0:parseInt(wcloud.options.low_threshold);high=(typeof wcloud.options.high_threshold=='undefined'||wcloud.options.high_threshold=='')?100000000000:parseInt(wcloud.options.high_threshold);words=words.filter(function(el){return el.freq>=low&&el.freq<=high;});var cloud=d3.layout.cloud();cloud.size([wcloud.options.width,wcloud.options.height*0.8]).words(words).rotate(function(){return~~((Math.random()*2)*wcloud.options.tiltRange)*((Math.random()>0.5)?1:-1);}).font(wcloud.options.font_name).fontSize(function(d){return fs(d.freq);}).on("end",function(){wcloud.draw(words);}).start();var bounds=wcloud.options.bounds;var shift="translate(-"+bounds[0].x+" -"+bounds[0].y+")";var xDiff=bounds[1].x-bounds[0].x;var yDiff=bounds[1].y-bounds[0].y;var sfactor=Math.min(wcloud.options.width/xDiff,(wcloud.options.height*0.8)/yDiff);var scale="scale("+sfactor+")";d3.select('g').attr('transform',scale+" "+shift);};this.load=function(src,algo){if(typeof algo=="undefined")
algo="raw";d3.select('svg').remove();var qs='parser.php?'+encodeURIComponent('url')+'='+encodeURIComponent(src)+"&"+encodeURIComponent('a')+'='+encodeURIComponent(algo);d3.json(qs,function(error,d){if(d.error){if(d.error=="fetch_fail")
alert("Sorry we didn't find anything at that URL. Plese make sure it is correct.");else if(d.error=="robots")
$('<div id="wordcloudError"><p> SHIVA has detected that the site you are trying to access has set a robots.txt policy that prohibits machine access to the content you are trying to fetch. Please instead copy and paste the text from the page you would like to access into the text box to the right of "Data source URL". <br /><br /> For more information about robots.txt, please visit <a target="_blank" href="http://www.robotstxt.org/robotstxt.html">this page.</a></p></div>').dialog({appendTo:'body',position:'top'});return false;}
wcloud.d=d;wcloud.buildLayout(d);});};this.filter=function(){var words=[];wcloud.filterSet.length=0;$('.listEntry').filter(function(){return $(this).children('span').hasClass('ui-icon-close');}).each(function(){words.push($(this).text().split(' (')[0]);});var data=wcloud.d.filter(function(el){if(words.indexOf(el.text)==-1){wcloud.filterSet.push(el.text);return false;}
else
return true;});wcloud.buildLayout(data);};this.colorize=function(colors){var opts=colors.split(',').slice(0,-1);if(opts.length==1)
opts.push('ffffff');var spec=[];for(var j=1;j<opts.length;j++){var s=d3.hsl('#'+opts[j-1]);var e=d3.hsl('#'+opts[j]);spec.push(d3.interpolate(s,e));}
var size=wcloud.d[0].freq+1;d3.selectAll('.word').style('fill',function(d,i){var hole=Math.floor((wcloud.d[i].freq/size)*spec.length);var rem=(wcloud.d[i].freq/size)*spec.length%1;return spec[hole](rem);});};}}
SHIVA_Show.prototype.WordActions=function(msg){var m=msg.split('=')[1];var cmd=m.split('|');switch(cmd[0]){case'data':if(/^http/gi.test(cmd[1])){this.wcloud.load(cmd[1]);}else{try{var json=JSON.parse(cmd[1]);if(json[0]instanceof Array){json=json.map(function(a){if(typeof a[2]!="undefined")
return{'text':a[0],'size':0,'freq':a[1],'color':a[2]};return{'text':a[0],'size':0,'freq':a[1]};});}
json.sort(function(a,b){return b.freq-a.freq;});this.wcloud.d=json;this.wcloud.buildLayout(json);}catch(e){this.wcloud.load(cmd[1]);}}
break;case'resize':if(cmd[1]=="100"){$("#"+shivaLib.container).width("100%");$("#"+shivaLib.container).height("100%");this.wcloud.options.width=$("#"+shivaLib.container).width();this.wcloud.options.height=$("#"+shivaLib.container).height();}
this.wcloud.buildLayout(this.wcloud.d);break;}}
SHIVA_Show.prototype.DrawPoster=function()
{var str,i,j,k,o,v,vv;var options=this.options;var container=this.container;var con="#"+container;var _this=this;this.items=new Array();for(var key in options){if(key.indexOf("item-")!=-1){var o=new Object;var v=options[key].split(';');for(i=0;i<v.length;++i){v[i]=v[i].replace(/http:/g,"http`");o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");}
this.items.push(o);}}
if(!this.posterScale)
this.posterScale=2;if(options.shivaGroup=="Poster"){if(!this.eva)
this.eva=new EvA();this.eva.ondos=new Array();if(options.eva){var ud=options.eva.split("``");for(i=0;i<ud.length;++i){v=ud[i].split("`");if(v.length<2)
continue;o={};for(j=0;j<v.length;++j){vv=v[j].split("~");o[vv[0]]=vv[1];}
this.eva.ondos.push(o);}}}
var str="<div id='posterDiv' style='position:absolute;";str+="background-color:#"+options.backCol+"'></div>";$(con).html(str);$(con).css({border:"1px solid",overflow:"hidden",margin:"0px",padding:"0px"});$(con).width(options.width);$(con).height(options.height);$("#posterDiv").draggable({drag:function(event,ui){var w=$("#posterDiv").width();var h=$("#posterDiv").height();var s=shivaLib.posterScale;shivaLib.posterX=(-$("#posterDiv").css("left").replace(/px/,"")+(w/s/2))/w;shivaLib.posterY=(-$("#posterDiv").css("top").replace(/px/,"")+(h/s/2))/h;shivaLib.DrawPosterOverview();$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));if(shivaLib.options.chartType=="Zoomable")
shivaLib.SendShivaMessage("ShivaImage=move",shivaLib.options.pos);}});if(options.dataSourceUrl){str="<img src='"+options.dataSourceUrl+"' ";str+="height='100%' width='100%'>";$("#posterDiv").append(str);}
this.DrawPosterOverview();if(this.posterMode!="Connect"){this.DrawPosterPanes(-1,"draw");this.DrawLayerControlBox(this.items,(options.controlbox=="true"));if((this.posterMode!="Edit")&&(this.options.eva))
this.eva.Run(this.options.eva);}
var v=options.pos.split("|");this.PositionPoster(v[0],v[1],v[2]);this.DrawPosterOverview();this.SendReadyMessage(true);}
SHIVA_Show.prototype.PositionPoster=function(size,left,top)
{if(size!=undefined){shivaLib.posterScale=size/1000;shivaLib.posterX=left/1000;shivaLib.posterY=top/1000;}
var s=shivaLib.posterScale;$("#posterDiv").width(shivaLib.options.width);$("#posterDiv").height(shivaLib.options.height);var w=$("#posterDiv").width()*s;var h=$("#posterDiv").height()*s;$("#posterDiv").width(w);$("#posterDiv").height(h);var l=w*shivaLib.posterX-(w/s/2);var t=h*shivaLib.posterY-(h/s/2);$("#posterDiv").css({"left":-l+"px","top":-t+"px"});$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));this.DrawPosterPanes(-1,"resize");if(typeof(DrawPosterGrid)=="function")
DrawPosterGrid();var l=$("#"+shivaLib.container).position().left;var r=l-0+(w/s-w);var t=$("#"+shivaLib.container).position().top;var b=t-0+(h/s-h);$("#posterDiv").draggable("option",{containment:[r,b,l,t]});}
SHIVA_Show.prototype.GoToPosterPane=function(num)
{if(num<this.items.length){var v=this.items[num].data.split("|");v[0]=Math.round(1000/v[0]*1000);this.options.pos=v[0]+"|"+v[1]+"|"+v[2];$("#posterOverDiv").hide();}
else{$("#posterOverDiv").show();this.options.pos="1000|500|500";}
v=this.options.pos.split("|");this.PositionPoster(v[0],v[1],v[2]);this.DrawPosterOverview();$("#shcr"+num).attr("checked","checked");}
SHIVA_Show.prototype.DrawPosterOverview=function()
{var str;var options=this.options;var s=this.posterScale;var w=$("#containerDiv").width()/4;var h=$("#containerDiv").height()/4;var h=w*h/w;if(($("#posterOverDiv").length==0)&&(options.overview=="true")){var css={position:"absolute",left:w*4-w+"px",width:w+"px",height:h+"px",top:h*4-h+"px",border:"1px solid","background-color":"#"+options.backCol};str="<div id='posterOverDiv'></div>";$("#"+this.container).append(str);$("#posterOverDiv").css(css);if(options.dataSourceUrl){str="<img src='"+options.dataSourceUrl+"' ";str+="height='"+h+"' ";str+="width='"+w+"' >";$("#posterOverDiv").append(str);}
if(typeof(DrawPosterOverviewGrid)=="function")
DrawPosterOverviewGrid();var css={position:"absolute",border:"1px solid #666","z-index":3,"background-color":"rgba(220,220,220,0.4)"};str="<div id='posterOverBox'></div>";$("#posterOverDiv").append(str);$("#posterOverBox").css(css);$("#posterOverBox").draggable({containment:"parent",drag:function(event,ui){var w=$("#posterOverDiv").width();var pw=$("#posterDiv").width();var h=$("#posterOverDiv").height();var ph=$("#posterDiv").height();var s=shivaLib.posterScale;var x=Math.max(0,ui.position.left/w*pw);var y=Math.max(0,ui.position.top/h*ph);shivaLib.posterX=(x+(pw/s/2))/pw;shivaLib.posterY=(y+(ph/s/2))/ph;$("#posterDiv").css({"left":-x+"px","top":-y+"px"});$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));if(shivaLib.options.chartType=="Zoomable")
shivaLib.SendShivaMessage("ShivaImage=move",shivaLib.options.pos);}});$("#posterOverBox").resizable({containment:"parent",aspectRatio:true,minHeight:12,stop:function(event,ui){var w=$("#posterOverDiv").width();var pw=$("#posterDiv").width();var h=$("#posterOverDiv").height();var ph=$("#posterDiv").height();shivaLib.posterScale=Math.max(w/ui.size.width,1);var s=shivaLib.posterScale;var x=Math.max(0,ui.position.left/w*pw);var y=Math.max(0,ui.position.top/h*ph);shivaLib.posterX=(x+(pw/s/2))/pw;shivaLib.posterY=(y+(ph/s/2))/ph;$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));shivaLib.PositionPoster();if(shivaLib.options.chartType=="Zoomable")
shivaLib.SendShivaMessage("ShivaImage=move",shivaLib.options.pos);}});}
var x=$("#posterDiv").css("left").replace(/px/,"");x=-x/w/4*w/this.posterScale;var y=$("#posterDiv").css("top").replace(/px/,"");y=-y/h/4*h/this.posterScale;$("#posterOverBox").width(w/this.posterScale).height(h/this.posterScale);$("#posterOverBox").css({"left":x+"px","top":y+"px"});}
SHIVA_Show.prototype.DrawPosterPanes=function(num,mode)
{var i,v,u,str,dw,dh,x,y,s=0,isImg=true;var scale=this.posterScale;var e=this.items.length;var w=$("#posterDiv").width();var h=$("#posterDiv").height();if(num!=-1)s=num,e=num-0+1;for(i=0;i<e;++i){v=this.items[i].data.split("|");dw=v[0]/1000*w;if(this.items[i].asp)
dh=dw*this.items[i].asp/1000;else
dh=v[0]/1000*h;x=w*v[1]/1000-(dw/2);y=h*v[2]/1000-(dh/2);str="<div id='posterPane"+i+"' style='position:absolute;background:none transparent;";if(this.items[i].style)
str+=this.items[i].style.replace(/\|/g,";").replace(/=/g,":");str+="'>"
u=this.items[i].url;if(isImg=u.match(/\.jpg|\.jpeg|\.gif|\.png/i))
str+="<img src='"+this.items[i].url+"' width='100%'>";else if(u){if(this.items[i].asp)
srs="go.htm?srs=100&";else
srs="go.htm?";if(!isNaN(u))
u=srs+"e="+u;else if((u.match(/e=/))||(u.match(/M=/)))
u=srs+u;if(u.match(/go.htm/))
u+="&if="+i;str+="<iframe id='posterFrame-"+i+"' src='"+u+"'";if(this.items[i].scrollbars=="false")
str+="scrolling='no' ";str+="frameborder='0' allowtransparency='true'></iframe>";}
if(mode=="draw"){$("#posterPane"+i).remove();$("#posterDiv").append(str+"</div>");if(this.posterMode=="Edit"){str="<div style='position:absolute;left:0px;top:0px;width:100%;height:100%;border:1px dashed'>";str+="<div id='posterPaneLab"+i+"' style='position:absolute;left:0px;text-shadow:1px 1px #eee'>";str+="<b> "+(i+1)+". "+this.items[i].layerTitle+"</b></div>";$("#posterPane"+i).append(str+"</div>");}
else if(this.items[i].caption){str="<div style='font-size:small;position:absolute;left:0px;top:100%;width:100%;padding:4px;text-align:center'><b>"+shivaLib.LinkToAnchor(this.items[i].caption)+"</b>";$("#posterPane"+i).append(str+"</div>");}
if((this.posterMode!="Edit")&&(this.items[i].drag=="true")){str="<div style='position:absolute;left:0px;top:0px;width:80%;height:20px;'>";$("#posterPane"+i).append(str+"</div>");$("#posterPane"+i).draggable({containment:"parent"});}}
$("#posterFrame-"+i).height(dh);$("#posterFrame-"+i).width(dw);$("#posterPane"+i).height(dh);$("#posterPane"+i).width(dw);$("#posterPane"+i).css({"left":x+"px","top":y+"px"});$("#posterPaneLab"+i).css("top",$("#posterPane"+i).height()+3+"px");if(this.options.overview=="true"){str="<div id='posterOverPane"+i+"' style='position:absolute;opacity:.4;border:1px solid white;pointer-events:none;background-color:#666'/>";if(mode=="draw")
$("#posterOverDiv").append(str);x=$("#posterPane"+i).position().left;y=$("#posterPane"+i).position().top;$("#posterOverPane"+i).css({"left":x/4/scale+"px","top":y/4/scale+"px"});$("#posterOverPane"+i).height(dh/4/scale);$("#posterOverPane"+i).width(dw/4/scale);}
if((mode=="resize")&&(u)){if(u.match(/go\.htm/)){var win=document.getElementById("posterFrame-"+i).contentWindow;win.postMessage("ShivaAct=resize","*");}}
if(this.posterMode!="Edit")
continue;$("#posterPane"+i).resizable({containment:"parent",aspectRatio:!(shivaLib.items[i].url.match(/http/)),stop:function(event,ui){var i=event.target.id.substr(10);var v=shivaLib.items[i].data.split("|");v[0]=Math.floor(Math.min(ui.size.width/$("#containerDiv").width()/shivaLib.posterScale,1)*1000);shivaLib.items[i].data=v[0]+"|"+v[1]+"|"+v[2];$("#itemInput"+i+"-1").val(shivaLib.items[i].data);if(shivaLib.items[i].url.match(/http/)){var asp=Math.round(ui.size.height/ui.size.width*1000);shivaLib.items[i].asp=asp;$("#itemInput"+i+"-2").val(asp);}
shivaLib.DrawPosterPanes(i,"resize");}});$("#posterPane"+i).draggable({containment:"parent",drag:function(event,ui){var i=event.target.id.substr(10);var v=shivaLib.items[i].data.split("|");var w=$("#posterDiv").width();var h=$("#posterDiv").height();var off=0;if(shivaLib.items[i].url.match(/[[.]jpg|jpeg|gif|png]/i))
off=12*shivaLib.posterScale;v[1]=Math.round(($("#posterPane"+i).position().left+$("#posterPane"+i).width()/2)/w*1000);v[2]=Math.round(($("#posterPane"+i).position().top+$("#posterPane"+i).height()/2+off)/h*1000);shivaLib.items[i].data=v[0]+"|"+v[1]+"|"+v[2];$("#itemInput"+i+"-1").val(shivaLib.items[i].data);shivaLib.DrawPosterPanes(i,"drag");}});}}
function EvA()
{this.ondos=new Array();this.data=new Array();if(window.addEventListener)
window.addEventListener("message",$.proxy(this.ShivaEventHandler,this),false);else
window.attachEvent("message",$.proxy(this.ShivaEventHandler,this),false);}
EvA.prototype.Run=function(ondoList)
{var i,o;this.data=[];for(i=0;i<this.ondos.length;++i){o=this.ondos[i];o.done=0;if(o.on=="init")
this.RunOnDo(o);}}
EvA.prototype.RunOnDo=function(ondo)
{var str,o,i;var to=ondo.to;var from=ondo.from;if(!isNaN(to))to="posterFrame-"+(to-1);if(!isNaN(from))from="posterFrame-"+(from-1);switch(ondo.Do){case"load":str=ondo.src;if(!to.match(/posterFrame-/)){shivaLib.GetSpreadsheet(str,false,null,function(data){ondo.ready=true;shivaLib.eva.data[ondo.to]=data;},true);break;}
if(ondo.src.indexOf("e=")==0)
str="//www.viseyes.org/shiva/go.htm?srs=100&"+ondo.src;else if(ondo.src.indexOf("m=")==0)
str="//shiva.shanti.virginia.edu/go.htm?srs=100&m=//shiva.virginia.edu/data/json/"+ondo.src.substr(2);else if(ondo.src.indexOf("E=")==0)
str="//127.0.0.1:8020/SHIVA/go.htm?srs=100&e="+ondo.src.substr(2);else if(ondo.src.indexOf("M=")==0)
str="//127.0.0.1:8020/SHIVA/go.htm?srs=100&m=//shiva.virginia.edu/data/json/"+ondo.src.substr(2);$("#"+to).attr("src",str);break;case"fill":if((!ondo.src)||(!this.data[ondo.src]))
break;str="ShivaAct=data|";str+=this.TableToString(this.data[ondo.src])
this.SendMessage(to,str);break;case"tell":str="ShivaAct="+ondo.src;for(i=1;i<7;++i){if(ondo["p"+i])
str+="|"+ondo["p"+i];}
this.SendMessage(to,str);break;case"script":if(!ondo.src)
break;var s=document.createElement("script");$("#scr-"+ondo.to).remove();s.id="scr-"+ondo.to;s.setAttribute('type','text/javascript');str="function "+ondo.to+"(p1,p2,p3,p4,p5,p6,p7){";str+=ondo.src.replace(/&apos;/g,"\'").replace(/&quot;/g,"\"").replace(/&br;/g,"\n");s.appendChild(document.createTextNode(str+"}"));document.getElementsByTagName('head').item(0).appendChild(s);break;case"call":window[ondo.to](ondo.p1,ondo.p2,ondo.p3,ondo.p4,ondo.p5,ondo.p6);break;case"filter":if(!ondo.src||!ondo.to)
break;this.data[ondo.to]=[];this.Query(this.data[ondo.src],this.data[ondo.to],ondo.query,ondo.p1,ondo.p2);break;}}
EvA.prototype.ShivaEventHandler=function(e)
{var from;var i,o,n=this.ondos.length;var v=e.data.split("|");if(v[0].match(/ShivaChart=ready/)){if(v[1].match(/posterFrame-/))
if((i=v[1].substr(12))&&(v.length>2)){if(!shivaLib.items[i].asp[i]){shivaLib.items[i].asp=v[2];$("#itemInput"+i+"-2").val(v[2]);}}}
v[0]=v[0].split("=")[1];for(i=0;i<n;++i){o=this.ondos[i];from=o.from;if(!isNaN(o.from))from="posterFrame-"+(o.from-1);if(o.on=="ready"){if((!o.done)&&(v[1]==from)&&(v[0]=="ready")){o.done++;this.RunOnDo(o);}}
else if((v[1]==from)&&(v[0]==o.on))
this.HandleOnEvent(o,e.data);}}
EvA.prototype.HandleOnEvent=function(ondo,data)
{var run=new Object();for(o in ondo)
run[o]=ondo[o];if((!run.p1)&&(run.Do=="call")){var v=data.split("|");if(v[1]!=undefined)run.p1=v[1];if(v[2]!=undefined)run.p2=v[2];if(v[3]!=undefined)run.p3=v[3];if(v[4]!=undefined)run.p4=v[4];if(v[5]!=undefined)run.p5=v[5];if(v[6]!=undefined)run.p6=v[6];}
this.RunOnDo(run);}
EvA.prototype.SendMessage=function(con,msg)
{var win=document.getElementById(con).contentWindow;win.postMessage(msg,"*");}
EvA.prototype.TableToString=function(table)
{var i,j,val,str="[";var cols=table[0].length-1;var rows=table.length-1;for(i=0;i<=rows;++i){str+="[";for(j=0;j<=cols;++j){val=table[i][j];if((isNaN(val))||(!val)){str+="\""+val+"\"";}
else
str+=val;if(j!=cols)
str+=",";}
str+="]";if(i!=rows)
str+=",";}
return str+"]";}
EvA.prototype.Query=function(src,dst,query,fields,sort)
{var v,j,i=0;var allFields=false;var nAnds=0;if(!src||!dst)
return;var n=src.length;var clause=new Array();var ands=new Array();var ors=new Array();if((!fields)||(fields=="*")){fields=src[0];allFields=true;}
else
fields=fields.split("+");if((!query)||(query=="*"))
query="* * *";var o=new Object();clause.push(o);o.type="AND";v=query.split(" ");while(i<v.length){o.hits=[];o.field=v[i++];o.cond=v[i++];o.what=v[i++];if((i<v.length)&&(v[i]!="AND")&&(v[i]!="OR"))
o.what+=" "+v[i++];if(i<v.length){o={};o.type=v[i++];clause.push(o);}}
for(i=0;i<clause.length;++i){o=clause[i];h=ands;if(o.type=="OR")
h=ors;else
nAnds++;for(j=0;j<src[0].length;++j)
if(o.field==src[0][j]){o.field=j;break;}
for(j=1;j<n;++j){if(o.cond=="*"){h.push(j-1);}
if(o.cond=="LT"){if(src[j][o.field]<o.what)
h.push(j-1);}
else if(o.cond=="GT"){if(src[j][o.field]>o.what)
h.push(j-1);}
if(o.cond=="LE"){if(src[j][o.field]<=o.what)
h.push(j-1);}
else if(o.cond=="GE"){if(src[j][o.field]>=o.what)
h.push(j-1);}
if(o.cond=="EQ"){if(src[j][o.field]==o.what)
h.push(j-1);}
if(o.cond=="NE"){if(src[j][o.field]!=o.what)
h.push(j-1);}
if(o.cond=="LK"){if(src[j][o.field].toLowerCase().indexOf(o.what.toLowerCase())!=-1)
h.push(j-1);}
if(o.cond=="NL"){if(src[j][o.field].toLowerCase().indexOf(o.what.toLowerCase())==-1)
h.push(j-1);}}}
var results=new Array();if(nAnds==1)
results=ands;else{var thisOne;n=ands.length;var matches=1;for(i=0;i<n;++i){thisOne=ands[i];for(j=i+1;j<n;++j){if(ands[j]==thisOne)
++matches;if(matches==nAnds){results.push(ands[i]);matches=1;break;}}}}
n=results.length;if(ors.length){for(i=0;i<ors.length;++i){for(j=0;j<n;++j)
if(ors[i]==results[j])
break;if(j==n)
results.push(ors[i]);}}
n=fields.length;if(allFields){for(i=0;i<results.length;++i)
dst.push(src[results[i]]);}
else{var ids=new Array();for(i=0;i<n;++i){for(j=0;j<src[0].length;++j)
if(fields[i]==src[0][j]){ids[i]=j;break;}}
for(i=0;i<results.length;++i){o=[];for(j=0;j<n;++j){o.push(src[results[i]+1][ids[j]]);}
dst.push(o);}}
if(sort){var dir=1;if(sort.charAt(0)=="-"){dir=-1;sort=sort.substr(1);}
for(j=0;j<n;++j)
if(sort==src[0][j]){sort=j;break;}
dst.sort(function(a,b){return a[sort]>b[sort]?-1*dir:1*dir});}
dst.splice(0,0,fields);}
SHIVA_Show.prototype.DrawImage=function()
{var i,v,o,str;var options=this.options;var container=this.container;var con="#"+container;var _this=this;if(!options.chartType)
options.chartType="Slideshow";if(options.chartType=="Slideshow"){if(options.dataSourceUrl.indexOf("//docs.google.com")!=-1)
GetSpreadsheetData(options.dataSourceUrl,options.imgHgt,options.showImage,options.showSlide,options.transition,options.width);else if(options.dataSourceUrl){$("#"+this.container).html("<img id='"+this.container+"Img' "+"width='"+options.width+"' src='"+options.dataSourceUrl+"'/>");if(options.height)
$(con).css('height',options.height);this.SendReadyMessage(true);}
else
this.SendReadyMessage(true);}
else if((options.chartType=="Zoomable")&&(options.dataSourceUrl))
this.DrawPoster("Image");else if(options.chartType=="Montage"){var items=new Array();for(var key in options){if(key.indexOf("item-")!=-1){o={};v=options[key].split(';');for(i=0;i<v.length;++i)
o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");items.push(o);}}
this.items=items;$(con).height(options.height);$(con).width(options.width);var act=$("#accord").accordion("option","active");if((act===false)||(isNaN(act))||(!$("#accord").length))
act=0;if(!this.imageMob)
this.imageMob={div:this.container+"Img"};this.imageMob.start=0;this.imageMob.curMob=act;this.imageMob.audioStart=0;for(i=0;i<act;++i)
this.imageMob.audioStart+=items[i].dur-0;this.imageMob.numMobs=items.length;clearInterval(shivaLib.imageMob.interval);shivaLib.imageMob.interval=0;$(con).html("<img id='"+this.container+"Img' "+"' src='"+items[act].url+"' onclick='shivaLib.DrawImage()'/>");if(act<items.length-1)
$(con).append("<img id='"+this.container+"Img2' "+"' src='"+items[act+1].url+"' style='display:none' />");$("#"+this.container+"Snd").remove();this.imageMob.snd=null;if(options.audio){var file=options.audio.substr(0,options.audio.length-4);str="<audio id='"+this.container+"Snd'";str+="><source src='"+file+".ogg' type='audio/ogg'><source src='"+file+".mp3' type='audio/mpeg'></audio>";$(con).append(str);this.imageMob.snd=document.getElementById(this.container+"Snd");this.imageMob.snd.volume=options.volume/100;}
str="<div id='"+this.container+"Title'";if(options.etitle=="true")str+=" contenteditable='true'";else str+=" onclick='shivaLib.DrawImage()'";str+="style='top:0px;left:0px;height:90%;width:90%;padding:5%;position:absolute;";str+="font-size:"+options.height/20+"px;font-weight:bold;";str+="text-align:center;text-shadow:5px 5px 10px black;color:white'>";str+=items[act].title+"</div>";$(con).append(str);if($("#accord").length)
this.AnimateDiv("full");else
this.AnimateDiv("start");if((options.autoplay=="true")&&(!$("#accord").length))
$("#"+this.container+"PlyBut").trigger("click");this.SendReadyMessage(true);}
function GetSpreadsheetData(url,imgHgt,showImage,showSlide,trans,wid){shivaLib.GetSpreadsheet(url,false,null,function(data){AddImages(data,imgHgt,showImage,showSlide,trans,wid);shivaLib.SendReadyMessage(true);});}
http:function AddImages(data,imgHgt,showImage,showSlide,transition,wid)
{var str="<div id='gallery' class='ad-gallery'>"
if(showImage=="true")
str+="<div class='ad-image-wrapper'></div>";if(showSlide=="true")
str+="<div class='ad-controls'></div>";str+="<div class='ad-nav'><div class='ad-thumbs'><ul class='ad-thumb-list'>"
for(var i=1;i<data.length;++i){str+="<li><a href='"+data[i][0]+"'><img height='"+imgHgt+" 'src='"+data[i][0]+"'";if(data[i][1])
str+=" title='"+data[i][1]+"'";if(data[i][2])
str+=" alt='"+data[i][2]+"'";str+=" class='image"+i+"'></a></li>";}
str+="</ul></div></div></div>";$("#"+container).html(str);$('.ad-gallery').adGallery()[0].settings.effect=transition;$("#gallery").css("background","#ddd");if(wid.match(/%/)){wid=wid.replace(/%/,"")/100;wid=$("#"+container).width()*wid;}
$(".ad-gallery").css("width",wid+"px");}}
SHIVA_Show.prototype.AnimateDiv=function(mode)
{var o,v;var mob=shivaLib.imageMob;if(!mob)
return;if(mode=="next"){if(mob.curMob<shivaLib.items.length-1){mob.curMob++;shivaLib.imageMob.start=new Date().getTime();shivaLib.imageMob.interval=setInterval(shivaLib.AnimateDiv,42);}
else{if(shivaLib.imageMob.snd)
shivaLib.imageMob.snd.pause();if(!$("#accord").length)
mob.curMob=0;$("#"+shivaLib.container+"PlyBut").show();shivaLib.SendShivaMessage("ShivaImage=done");return;}}
var o=shivaLib.items[mob.curMob];v=o.sp.split(",");mob.sx=v[0]-0;mob.sy=v[1]-0;mob.sw=v[2]-0;v=o.ep.split(",");mob.ex=v[0]-0;mob.ey=v[1]-0;mob.ew=v[2]-0;mob.dur=o.dur-0;mob.fx=o.fx;mob.url=o.url;mob.ease=o.ease;mob.title=o.title;$("#"+shivaLib.container+"Title").html(mob.title);$("#"+shivaLib.container).css("overflow","hidden");if(($("#"+shivaLib.container+"PlyBut").length==0)&&mob.dur){$("#"+shivaLib.container).append("<img id='"+this.container+"PlyBut' src='playbut.gif' style='position:absolute;top:48%;left:47%;padding:2px;padding-left:18px;padding-right:18px' class='propTable' width='18'>");$("#"+shivaLib.container+"PlyBut").click(function(){$(this).hide();if(shivaLib.imageMob.snd){if(shivaLib.imageMob.snd.readyState)
shivaLib.imageMob.snd.currentTime=shivaLib.imageMob.audioStart;shivaLib.imageMob.snd.play();}
clearInterval(shivaLib.imageMob.interval);shivaLib.imageMob.start=new Date().getTime();shivaLib.imageMob.interval=setInterval(shivaLib.AnimateDiv,42);shivaLib.SendShivaMessage("ShivaImage=play");});}
if(mob.url!=$("#"+mob.div).attr('src')){$("#"+mob.div).attr('src',shivaLib.items[mob.curMob].url);if(mob.curMob<mob.numMobs-1)
$("#"+mob.div+"2").attr('src',shivaLib.items[mob.curMob+1].url);}
var pct=(new Date().getTime()-mob.start)/(mob.dur*1000);if(mob.start==0)
pct=0;if(pct>=.99){clearInterval(shivaLib.imageMob.interval);shivaLib.imageMob.interval=0;mob.start=0;shivaLib.AnimateDiv("next");return;}
if(mob.start==0)
pct=0;if(mob.ease=="both")
pct=1.0-((Math.cos(3.1414*pct)+1)/2.0);else if(mob.ease=="in")
pct=1.0-(Math.cos(1.5707*pct));else if(mob.ease=="out")
pct=1.0-(Math.cos(1.5707+(1.5707*pct))+1.0);var o={position:"relative"};o.left=(mob.sx+((mob.ex-mob.sx)*pct))/100;o.top=(mob.sy+((mob.ey-mob.sy)*pct))/100;o.width=1000000/((mob.sw+((mob.ew-mob.sw)*pct)));o.opacity=(mob.sa+((mob.ea-mob.sa*pct))/100);o.left=(-o.width*(o.left/100))+"%";o.top=(-o.width*(o.top/100))+"%";o.width+="%"
if((mode=="full")&&($("#accord").length)){o.top=o.left="0%",o.width="100%",o.opacity=1;$("#"+shivaLib.container).css("overflow","visible");}
$("#"+mob.div).css(o);}
SHIVA_Show.prototype.ImageActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100")
shivaLib.options.width=shivaLib.options.height="100%";shivaLib.DrawImage();}
else if(v[0]=="ShivaAct=play"){if(!shivaLib.imageMob.interval)
$("#"+this.container+"PlyBut").trigger("click");}
else if(v[0]=="ShivaAct=pause"){if(shivaLib.imageMob.interval)
shivaLib.DrawImage();}}
SHIVA_Show.prototype.GoogleDriveLoad=function(allFiles,callback)
{var _this=this;LoadGoogleDrive(true,function(s){callback(s.url);});function LoadGoogleDrive(allFiles,callback)
{var pickerApiLoaded=false;var oauthToken;var key="AIzaSyAVjuoRt0060MnK_5_C-xenBkgUaxVBEug";var id="81792849751-1c76v0vunqu0ev9fgqsfgg9t2sehcvn2.apps.googleusercontent.com";if(window.location.hostname.match("virginia.edu")||window.location.hostname.match("visuals.dd")){id="783824671276-f555r8jak4qqrunab0ksmn1elg01hjhc.apps.googleusercontent.com";key="AIzaSyDO7EDm14EXi44pLkarnB8jjqI90LSa61g";}
gapi.load('auth',{'callback':function(){window.gapi.auth.authorize({'client_id':id,'scope':['https://www.googleapis.com/auth/drive'],'immediate':false},function(authResult){if(authResult&&!authResult.error){oauthToken=authResult.access_token;createPicker();}});}});gapi.load('picker',{'callback':function(){pickerApiLoaded=true;createPicker();}});function createPicker(){if(pickerApiLoaded&&oauthToken){var view=new google.picker.DocsView().setOwnedByMe(allFiles).setIncludeFolders(true);var picker=new google.picker.PickerBuilder().addView(view).setOAuthToken(oauthToken).setDeveloperKey(key).setCallback(pickerCallback).build();picker.setVisible(true);}}
function pickerCallback(data){if(data[google.picker.Response.ACTION]==google.picker.Action.PICKED){var doc=data[google.picker.Response.DOCUMENTS][0];callback(doc)}}}}
SHIVA_Show.prototype.GetSpreadsheet=function(url,fields,query,callback,addHeader,sendError)
{this.spreadsheetError=null;if(url.indexOf("google.com")!=-1){var query=new google.visualization.Query(url);query.send(handleGoogleResponse);}
else{$.ajax({type:'GET',url:'proxy.php',data:{url:url},async:false}).complete(handleCSVResponse);}
function handleCSVResponse(response){var i,j,o,lab;var keys=new Array();var theData=new Array();if(!response.responseText&&sendError){callback(null,url);return(null)}
var data=shivaLib.parseCSV(response.responseText);var cols=data[0].length;if(addHeader||fields){for(i=0;i<data[0].length;++i){lab=$.trim(data[0][i]);if(!lab)
break;keys.push(lab);}
cols=keys.length;}
var rows=data.length;if(fields){for(i=1;i<rows;++i){o={};for(j=0;j<keys.length;++j)
o[keys[j]]=data[i][j];theData.push(o);}}
else{if(addHeader)
theData.push(keys);for(i=0;i<rows;++i){o=[];for(j=0;j<cols;++j){if(isNaN(data[i][j]))
o.push(data[i][j]);else
o.push((data[i][j]-0));}
theData.push(o);}}
callback(theData,url);}
function handleGoogleResponse(response){var i,j,o,lab;var keys=new Array();var theData=new Array();var data=response.getDataTable();if(!data&&sendError){callback(null,url);return(null)}
var cols=data.getNumberOfColumns();var rows=data.getNumberOfRows();if(addHeader||fields){for(i=0;i<cols;++i){lab=$.trim(data.getColumnLabel(i));if(!lab)
break;keys.push(lab);}
cols=keys.length;if(addHeader)
theData.push(keys);}
if(fields){for(i=0;i<rows;++i){o={};for(j=0;j<keys.length;++j)
o[keys[j]]=data.getValue(i,j);theData.push(o);}}
else{for(i=0;i<rows;++i){o=[];for(j=0;j<cols;++j)
o.push(data.getValue(i,j));theData.push(o);}}
callback(theData,url);}};SHIVA_Show.prototype.parseCSV=function(str)
{var arr=[];var quote=false;str=str.replace(/\\r\\n/g,"\n");str=str.replace(/\\n\\r/g,"\n");for(var row=col=c=0;c<str.length;c++){var cc=str[c],nc=str[c+1];arr[row]=arr[row]||[];arr[row][col]=arr[row][col]||'';if(cc=='"'&&quote&&nc=='"'){arr[row][col]+=cc;++c;continue;}
if(cc=='"'){quote=!quote;continue;}
if(cc==','&&!quote){++col;continue;}
if(cc=='\n'&&!quote){++row;col=0;continue;}
arr[row][col]+=cc;}
return arr;}
SHIVA_Show.prototype.Query=function(src,dst,query,fields,sort)
{var v,j,i=0;var allFields=false;var nAnds=0;if(!src||!dst)
return;var n=src.length;var clause=new Array();var ands=new Array();var ors=new Array();if((!fields)||(fields=="*")){fields=src[0];allFields=true;}
else
fields=fields.split("+");if((!query)||(query=="*"))
query="* * *";var o=new Object();clause.push(o);o.type="AND";v=query.split(" ");while(i<v.length){o.hits=[];o.field=v[i++];o.cond=v[i++];o.what=v[i++];if((i<v.length)&&(v[i]!="AND")&&(v[i]!="OR"))
o.what+=" "+v[i++];if(i<v.length){o={};o.type=v[i++];clause.push(o);}}
for(i=0;i<clause.length;++i){o=clause[i];h=ands;if(o.type=="OR")
h=ors;else
nAnds++;for(j=0;j<src[0].length;++j)
if(o.field==src[0][j]){o.field=j;break;}
for(j=1;j<n;++j){if(o.cond=="*"){h.push(j-1);}
if(o.cond=="LT"){if(src[j][o.field]<o.what)
h.push(j-1);}
else if(o.cond=="GT"){if(src[j][o.field]>o.what)
h.push(j-1);}
if(o.cond=="LE"){if(src[j][o.field]<=o.what)
h.push(j-1);}
else if(o.cond=="GE"){if(src[j][o.field]>=o.what)
h.push(j-1);}
if(o.cond=="EQ"){if(src[j][o.field]==o.what)
h.push(j-1);}
if(o.cond=="NE"){if(src[j][o.field]!=o.what)
h.push(j-1);}
if(o.cond=="LK"){if(src[j][o.field].toLowerCase().indexOf(o.what.toLowerCase())!=-1)
h.push(j-1);}
if(o.cond=="NL"){if(src[j][o.field].toLowerCase().indexOf(o.what.toLowerCase())==-1)
h.push(j-1);}}}
var results=new Array();if(nAnds==1)
results=ands;else{var thisOne;n=ands.length;var matches=1;for(i=0;i<n;++i){thisOne=ands[i];for(j=i+1;j<n;++j){if(ands[j]==thisOne)
++matches;if(matches==nAnds){results.push(ands[i]);matches=1;break;}}}}
n=results.length;if(ors.length){for(i=0;i<ors.length;++i){for(j=0;j<n;++j)
if(ors[i]==results[j])
break;if(j==n)
results.push(ors[i]);}}
n=fields.length;if(allFields){for(i=0;i<results.length;++i)
dst.push(src[results[i]]);}
else{var ids=new Array();for(i=0;i<n;++i){for(j=0;j<src[0].length;++j)
if(fields[i]==src[0][j]){ids[i]=j;break;}}
for(i=0;i<results.length;++i){o=[];for(j=0;j<n;++j){o.push(src[results[i]+1][ids[j]]);}
dst.push(o);}}
if(sort){var dir=1;if(sort.charAt(0)=="-"){dir=-1;sort=sort.substr(1);}
for(j=0;j<n;++j)
if(sort==src[0][j]){sort=j;break;}
dst.sort(function(a,b){return a[sort]>b[sort]?-1*dir:1*dir});}
dst.splice(0,0,fields);}
SHIVA_Show.prototype.DrawGraph=function()
{var i,j,o,shape,id=0;var options=this.options;var con="#"+this.container;var svg=null,nodes=null,edges=null,labels=null;var dataSet=null;var d3Zoom;var minZoom=.1,maxZoom=10;var margins=[0,0,0,0];var canPan=true;var firstTime=true;var unselectable={"-moz-user-select":"none","-khtml-user-select":"none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none","pointer-events":"none"}
$(con).css("overflow","hidden")
if(!$("d3Popup").length)
$("body").append("<div id='d3Popup' class='rounded-corners' style='display:none;position:absolute;border:1px solid #999;background-color:#eee;padding:8px'></div>");var styles=new Object();if(options.backCol=="none")
$(con).css("background-color","transparent");else
$(con).css("background-color","#"+options.backCol);$(con).width(options.width);if(options.height)
$(con).height(options.height);else
$(con).height(options.width),h=w;$(con).html("");var colors=d3.scale.category10();var opHeight=$(con).height();var opWidth=$(con).width();var w=opWidth;var h=opHeight;svg=d3.select(con).append("svg").attr("width",w-margins[0]-margins[2]).attr("height",h-margins[1]-margins[3]).call(d3Zoom=d3.behavior.zoom().scaleExtent([minZoom,maxZoom]).on("zoom",zoomed)).append("g")
svg.append("defs").append("clipPath").attr("id","cp0").append("rect").attr("width",w).attr("height",h).attr("x",100).attr("y",0)
svg.append("rect").style({"fill":"none","pointer-events":"all"}).attr("id","underLayer").attr("width",w).attr("height",h).on("click",function(){$("#d3Popup").hide();});if((options.chartType=="Network")||(options.chartType=="Chord")){if(options.dataSourceUrl)
this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data){var ids=new Object();dataSet={nodes:[],edges:[]};styles={};for(i=0;i<data.length;++i){if(!data[i][0])
continue;for(j=0;j<5;++j)
if(data[i][j])
data[i][j]=data[i][j].replace(/[\n|\r]/,"");if(data[i][0].match(/link-class/i)){if(!styles[data[i][1]])
styles[data[i][1]]={};if(data[i][2].match(/color/i))
styles[data[i][1]].eCol=data[i][3];if(data[i][2].match(/type/i))
styles[data[i][1]].shape=data[i][3];if(data[i][2].match(/linewidth/i))
styles[data[i][1]].eWid=data[i][3];if(data[i][2].match(/linecolor/i))
styles[data[i][1]].eCol=data[i][3];if(data[i][2].match(/alpha/i))
styles[data[i][1]].alpha=data[i][3];}
else if(data[i][0].match(/class/i)){if(!styles[data[i][1]])
styles[data[i][1]]={};if(data[i][2].match(/color/i))
styles[data[i][1]].col=data[i][3];if(data[i][2].match(/type/i))
styles[data[i][1]].shape=data[i][3];if(data[i][2].match(/linewidth/i))
styles[data[i][1]].eWid=data[i][3];if(data[i][2].match(/linecolor/i))
styles[data[i][1]].eCol=data[i][3];if(data[i][2].match(/alpha/i))
styles[data[i][1]].alpha=data[i][3];if(data[i][2].match(/dim/i))
styles[data[i][1]].size=data[i][3];}
else if(data[i][0].match(/node/i)){o={};o.name=data[i][2];o.id=data[i][1];if(data[i][3])
o.style=data[i][3];if(data[i][4])
o.info=data[i][4];ids[o.id]=dataSet.nodes.length;dataSet.nodes.push(o);}
else if(data[i][0].match(/link/i)){o={};o.source=data[i][1];o.target=data[i][3];o.style=data[i][2];dataSet.edges.push(o);}}
for(j=0;j<dataSet.edges.length;++j){dataSet.edges[j].source=ids[dataSet.edges[j].source];dataSet.edges[j].target=ids[dataSet.edges[j].target];}
redraw();});else if(dataSet)
redraw();}
else if((options.chartType=="Tree")||(options.chartType=="Bubble")){if(options.chartType=="Bubble")minZoom=1;if(options.dataSourceUrl){var nodeLink=false;this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data){var items=new Array();for(i=0;i<data.length;++i)
if(data[i][0]=="link"){nodeLink=true;break;}
if(nodeLink){var ids=new Object();dataSet={nodes:[],edges:[]};for(i=0;i<data.length;++i){if(!data[i][0])
continue;else if(data[i][0].match(/node/i)){o={};o.name=data[i][2];o.id=data[i][1];if(data[i][4])
o.info=data[i][4];ids[o.id]=dataSet.nodes.length;dataSet.nodes.push(o);}
else if(data[i][0].match(/class/i)){if(!styles[data[i][1]])
styles[data[i][1]]={};if(data[i][2].match(/color/i))
styles[data[i][1]].col=data[i][3];if(data[i][2].match(/type/i))
styles[data[i][1]].shape=data[i][3];if(data[i][2].match(/linewidth/i))
styles[data[i][1]].eWid=data[i][3];if(data[i][2].match(/linecolor/i))
styles[data[i][1]].eCol=data[i][3];if(data[i][2].match(/alpha/i))
styles[data[i][1]].alpha=data[i][3];if(data[i][2].match(/dim/i))
styles[data[i][1]].size=data[i][3];}
else if(data[i][0].match(/link/i)){o={};o.source=data[i][1];o.target=data[i][3];o.style=data[i][2];dataSet.edges.push(o);}}
for(i=0;i<dataSet.edges.length;++i){dataSet.edges[i].source=ids[dataSet.edges[i].source];dataSet.edges[i].target=ids[dataSet.edges[i].target];}
var v=[];for(i=0;i<dataSet.nodes.length;++i){v[i]=0;for(j=0;j<dataSet.edges.length;++j){if(dataSet.edges[j].source==i){o={};o.val=1;v[dataSet.edges[j].target]=1;o.parent=dataSet.nodes[i].name;o.style=dataSet.edges[j].style;o.name=dataSet.nodes[dataSet.edges[j].target].name;items.push(o);}}}
for(i=0;i<dataSet.nodes.length;++i)
if(!v[i]){items.splice(0,0,{name:dataSet.nodes[i].name,parent:"root",val:1});break;}}
else{for(i=0;i<data.length;++i){if(!data[i][0])
continue;if(!data[i][0].match(/node/i))
continue;o={};o.name=data[i][2];o.parent=data[i][1];if(data[i][3])
o.val=data[i][3];else
o.val=1;if(data[i][4])
o.info=data[i][4];items.push(o);}}
dataSet=[];var dataMap=items.reduce(function(map,node){map[node.name]=node;return map;},{});items.forEach(function(node){var parent=dataMap[node.parent];if(parent){(parent.children||(parent.children=[])).push(node);}
else
dataSet.push(node);});dataSet=dataSet[0];dataSet.x0=h/2;dataSet.y0=0;if(options.depth>0)
dataSet.children.forEach(function(d){setOpen(d,0)});function setOpen(d,depth){++depth;if(d.children){d.children.forEach(function(d){setOpen(d,depth)});if((d.children)&&(depth>(options.depth-1))){d._children=d.children;d.children=null;}}}
redraw();});}}
else if(options.chartType=="Stream"){minZoom=1;if(options.dataSourceUrl)
this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data){dataSet=[];var nRows=data.length;var nSets=data[0].length-1;for(i=1;i<nSets;++i){for(j=1;j<nRows;++j){o={};o.key=data[0][i];o.date=new Date(data[j][0]).getTime();o.value=data[j][i]-0;dataSet.push(o);}}
redraw();},true);}
else if(options.chartType=="Parallel"){minZoom=1;if(options.dataSourceUrl)
this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data){dataSet=[];var nRows=data.length;var nSets=data[0].length;for(i=1;i<nRows;++i){var o={};o.name=data[i][0];for(j=1;j<nSets;++j)
o[data[0][j]]=data[i][j]-0;dataSet.push(o);}
redraw();},true);}
function zoomed(){var t;if(!canPan)
return;var scale=d3.event.scale;var tp=[margins[0]-0,margins[3]-0];if(options.chartType=="Tree")
t=tp[0],tp[0]=tp[1],tp[1]=t;if(!d3.event.sourceEvent.shiftKey)
tp[0]+=d3.event.translate[0],tp[1]+=d3.event.translate[1]
svg.attr("transform","translate("+tp+") scale("+scale+")");if(options.chartType=="Bubble")
if(options.style=="Packed")
svg.selectAll("text").attr("font-size",options.lSize/scale+"px").text(function(d){return d.name.substring(0,d.r/3*scale);});}
function redraw(what){if(options.chartType=="Network"){force=d3.layout.force().nodes(dataSet.nodes).links(dataSet.edges).size([w,h]).linkDistance([options.linkDist]).charge([options.linkCharge]).gravity([options.linkGravity/100]).linkStrength(Math.min([options.linkStrength/100],1)).start();edges=svg.selectAll("line").data(dataSet.edges);edges.enter().append("line").style("stroke",function(d,i){if(d.style&&styles[d.style]&&styles[d.style].eCol)
return styles[d.style].eCol;else
return"#"+options.eCol;}).style("stroke-width",function(d,i){if(d.style&&styles[d.style]&&styles[d.style].eWid)
return styles[d.style].eWid;else
return options.eWid;}).style("opacity",function(d,i){if(d.style&&styles[d.style]&&styles[d.style].alpha)
return styles[d.style].alpha;else
return 1;})
edges.append("title").text(function(d){var str=d.source.name;if(d.style)
str+=" "+d.style+" ";else
str+=" is linked to to ";str+=d.target.name;return str;});edges.exit().remove();nodes=svg.selectAll("g").data(dataSet.nodes);nodes.enter().append(function(d,i){shape=options.nShape;if(d.style&&styles[d.style]&&styles[d.style].shape)
shape=styles[d.style].shape;return document.createElementNS("http://www.w3.org/2000/svg",shape.toLowerCase()!="circle"?"polygon":"circle");}).attr("points",function(d,i){shape=options.nShape;if(d.style&&styles[d.style]&&styles[d.style].shape)
shape=styles[d.style].shape;var size=options.nSize;if(d.style&&styles[d.style]&&styles[d.style].size)
size=styles[d.style].size;return DrawSVGShape(shape.toLowerCase(),size);}).attr("r",function(d,i){if(d.style&&styles[d.style]&&styles[d.style].size)
return styles[d.style].size/2;else
return options.nSize/2;}).style("fill",function(d,i){if(d.style&&styles[d.style]&&styles[d.style].col)
return styles[d.style].col;else{if(options.nCol=="none")
return colors(i);else
return"#"+options.nCol;}}).style("stroke",function(d,i){if(d.style&&styles[d.style]&&styles[d.style].eCol)
return styles[d.style].eCol;}).style("stroke-width",function(d,i){if(d.style&&styles[d.style]&&styles[d.style].eWid)
return styles[d.style].eWid;}).style("opacity",function(d,i){if(d.style&&styles[d.style]&&styles[d.style].alpha)
return styles[d.style].alpha;}).on("click",function(d){shivaLib.SendShivaMessage("ShivaGraph=click",d.name);if(!d3.event.shiftKey)
AddPopup(d);}).call(force.drag);nodes.append("title").text(function(d){var str=d.info;if(str&&str.match(/http/)){var v=(str+" ").match(/http.?:\/\/.*?\s/ig);for(var i=0;i<v.length;++i){v[i]=v[i].trim();str=str.replace(RegExp(v[i].replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")),"");}}
return str;});nodes.exit().remove();labels=svg.selectAll("text").data(dataSet.nodes);labels.enter().append("text").attr("font-family","sans-serif").attr("text-anchor","middle").attr("font-size",options.lSize+"px").attr("fill","#"+options.lCol).text(function(d){return d.name;});labels.exit().remove();force.on("tick",function(){var size;labels.attr("x",function(d){return d.x+"px";}).attr("y",function(d){if(d.style&&styles[d.style]&&styles[d.style].size)
size=styles[d.style].size;else
size=options.nSize;size=size*.6+options.lSize*1;return d.y+size+"px";});edges.attr("x1",function(d){return d.source.x;}).attr("y1",function(d){return d.source.y;}).attr("x2",function(d){return d.target.x;}).attr("y2",function(d){return d.target.y;});nodes.attr("transform",function(d){return"translate("+d.x+" "+d.y+")"});});}
else if(options.chartType=="Tree"){margins=[8,8,8,options.spacing/2];if(firstTime)
svg.attr("transform","translate("+margins[3]+","+margins[0]+")");var tree=d3.layout.tree().size([h,w]);var diagonal=d3.svg.diagonal().projection(function(d){return[d.y,d.x];});nodes=tree.nodes(dataSet).reverse();nodes.forEach(function(d){d.y=d.depth*options.spacing;});var node=svg.selectAll("g").data(nodes,function(d){return d.id||(d.id=++id);});var nodeEnter=node.enter().append("g").attr("transform",function(d){if(d.parent)
return"translate("+d.parent.y+","+d.parent.x+")";else
return"translate("+dataSet.y0+","+dataSet.x0+")";});nodeEnter.append("circle").attr("r",1e-6).style("stroke","#999").style("cursor",function(d){return d._children?"pointer":"auto";}).style("fill",function(d){return d._children?"#"+options.nCol:"#fff";}).on("click",function(d){toggle(d);redraw(d);});nodeEnter.append("text").style("font-family","sans-serif").attr("x",function(d){var dx=options.lSize/1.5;return d.children||d._children?-dx:dx;}).attr("dy",".3em").attr("text-anchor",function(d){return d.children||d._children?"end":"start";}).text(function(d){return d.name;}).style("fill-opacity",1e-6).style("fill",options.lCol).style("font-size",options.lSize).on("click",function(d){shivaLib.SendShivaMessage("ShivaGraph=click",d.name+"|"+d.val);});var nodeUpdate=node.transition().duration(options.trans).attr("transform",function(d){return"translate("+d.y+","+d.x+")";});nodeUpdate.select("circle").attr("r",options.lSize/2.67).style("fill",function(d){return d._children?"#"+options.nCol:"#fff";});nodeUpdate.select("text").style("fill-opacity",1);var nodeExit=node.exit().transition().duration(options.trans).attr("transform",function(d){return"translate("+d.parent.y+","+d.parent.x+")";}).remove();nodeExit.select("circle").attr("r",1e-6);nodeExit.select("text").style("fill-opacity",1e-6);var link=svg.selectAll("path").data(tree.links(nodes),function(d){return d.target.id;});link.enter().insert("path","g").style("fill","none").style("stroke",function(d,i){if(d.target.style&&styles[d.target.style]&&styles[d.target.style].eCol)
return styles[d.target.style].eCol;else
return"#"+options.eCol;}).style("stroke-width",function(d,i){if(d.target.style&&styles[d.target.style]&&styles[d.target.style].eWid)
return styles[d.target.style].eWid;else
return options.eWid;}).attr("d",function(d){var o={x:d.source.x,y:d.source.y};return diagonal({source:o,target:o});})
link.transition().duration(options.trans).attr("d",diagonal);link.exit().transition().duration(options.trans).attr("d",function(d){var o={x:d.source.x,y:d.source.y};return diagonal({source:o,target:o});}).remove();nodes.forEach(function(d){d.x0=d.x;d.y0=d.y;});function toggle(d){if(d.children){d._children=d.children;d.children=null;}
else{d.children=d._children;d._children=null;}}}
else if(options.chartType=="Bubble"){colors=d3.scale.category20c();var dia=Math.min(opHeight,opWidth)-8;if(options.style=="Packed"){var pack=d3.layout.pack().size([dia,dia]).value(function(d){return d.val?d.val:1});node=svg.datum(dataSet).selectAll(".node").data(pack.nodes).enter().append("g").attr("transform",function(d){return"translate("+d.x+","+d.y+")";});node.append("title").text(function(d){var str=d.name;if(!d.children&&d.val)
str+=": "+d.val;return str});node.append("circle").attr("r",function(d){return d.r;}).style("stroke","#"+options.gCol).style("fill",function(d){return d.children?"#"+options.gCol:"#"+options.nCol;}).style("fill-opacity",function(d){return d.children?.15:1}).style("cursor",function(d){return d.info?"pointer":"auto";}).on("click",function(d){shivaLib.SendShivaMessage("ShivaGraph=click",d.name+"|"+d.val);AddPopup(d);});node.filter(function(d){return!d.children;}).append("text").attr("dy",".3em").attr("font-family","sans-serif").attr("text-anchor","middle").attr("font-size",options.lSize+"px").attr("fill","#"+options.lCol).style("text-anchor","middle").style(unselectable).text(function(d){return d.name.substring(0,d.r/3);});}
else{function classes(root){var classes=[];function recurse(name,node){if(node.children)node.children.forEach(function(child){recurse(node.name,child);});else classes.push({packageName:name,className:node.name,value:node.val});}
recurse(null,root);return{children:classes};}
var bubble=d3.layout.pack().size([dia,dia]).padding(options.padding);if(options.style!="Spiral")
bubble.sort(null)
var node=svg.selectAll("node").data(bubble.nodes(classes(dataSet)).filter(function(d){return!d.children;}))
node.enter().append("g").attr("transform",function(d){return"translate("+d.x+","+d.y+")";});node.append("title").text(function(d){return d.className+": "+d.value;});node.append("circle").attr("r",function(d){return d.r;}).style("fill",function(d){return colors(d.packageName);}).on("click",function(d){shivaLib.SendShivaMessage("ShivaGraph=click",d.className+"|"+d.value);AddPopup(d);});node.append("text").attr("dy",".3em").attr("font-family","sans-serif").attr("text-anchor","middle").attr("font-size",options.lSize+"px").attr("fill","#"+options.lCol).style("text-anchor","middle").style(unselectable).text(function(d){return d.className.substring(0,d.r/3);});d3.select(self.frameElement).style("height",dia+"px");}}
else if(options.chartType=="Stream"){canPan=false;var colorRange=["#B30000","#E34A33","#FC8D59","#FDBB84","#FDD49E","#FEF0D9"];if(options.sCol!="none"){colorRange=[];var v=options.sCol.split(",");for(i=0;i<v.length;++i)colorRange.push("#"+v[i]);}
var colorSet=d3.scale.ordinal().range(colorRange);var x=d3.time.scale().range([0,opWidth]);var y=d3.scale.linear().range([opHeight-options.lSize-10,options.lSize*1+10]);var timeBar=d3.select(con).append("div").style("position","absolute").style("top",(opHeight-options.lSize-6)+"px").style("left","0px").style("font-size",options.lSize+"px").style("color","#"+options.lCol).style("font-family","sans-serif").html("<span id='startDate'></span><span id='endDate' style='position:absolute;left:"+(opWidth-200)+"px;width:200px;text-align:right'></span>")
var dataBar=d3.select(con).append("div").style("position","absolute").style("width","2px").style("height",opHeight-options.lSize*2-20+"px").style("pointer-events","none").style("top",(options.lSize-0+10)+"px").style("left","0px").style("background","#fff").style("font-size",options.lSize+"px").style("color","#"+options.lCol).style("font-family","sans-serif").html("<div id='vdat' style='background-color:#"+options.backCol+";position:absolute;left:-100px;top:"+(-options.lSize-6)+"px;width:200px;text-align:center'></div><div id='vnow' style='background-color:#"+options.backCol+";position:absolute;left:-100px;top:"+(opHeight-options.lSize*2-16)+"px;width:200px;text-align:center'></div>")
var stack=d3.layout.stack().offset("silhouette").values(function(d){return d.values;}).x(function(d){return d.date;}).y(function(d){return d.value;});if(options.style=="Full")stack.offset("expand")
if(options.style=="Stacked")stack.offset("zero")
var nest=d3.nest().key(function(d){return d.key;});var layers=stack(nest.entries(dataSet));var area=d3.svg.area().interpolate("cardinal").x(function(d){return x(d.date);}).y0(function(d){return y(d.y0);}).y1(function(d){return y(d.y0+d.y);});x.domain(d3.extent(dataSet,function(d){return d.date;}));y.domain([0,d3.max(dataSet,function(d){return d.y0+d.y;})]);if(options.area=="Flat")area.interpolate("linear")
if(options.area=="Stepped")area.interpolate("step")
svg.selectAll(".layer").data(layers).enter().append("path").attr("class","layer").attr("d",function(d){return area(d.values);}).style("fill",function(d,i){return colorSet(i);});svg.selectAll(".layer").attr("opacity",1).on("mouseover",function(d,i){svg.selectAll(".layer").transition().duration(250).attr("opacity",function(d,j){return j!=i?0.6:1;})}).on("mousemove",function(d,i){var date=x.invert(d3.mouse(this)[0]).getTime();var now=date;var selected=(d.values);var k=selected.length-1;while(k>=0){if(selected[k].date<=now){break;}
--k;}
d3.select(this).attr("stroke","#000").attr("stroke-width","0.5px")
dataBar.style("left",d3.mouse(this)[0]+"px");$("#vnow").text(shivaLib.FormatDate(date,options.dateFormat))
$("#vdat").text(d.key+": "+d.values[k].value)
dataBar.style("visibility","visible");}).on("mouseout",function(d,i){svg.selectAll(".layer").transition().duration(250).attr("opacity","1");d3.select(this).attr("stroke-width","0px");dataBar.style("visibility","hidden");}).on("click",function(d){var date=x.invert(d3.mouse(this)[0]).getTime();var now=date;var selected=(d.values);var k=selected.length-1;while(k>=0){if(selected[k].date<=now){shivaLib.SendShivaMessage("ShivaGraph=click",shivaLib.FormatDate(date,options.dateFormat)+"|"+d.key+"|"+d.values[k].value);break;}
--k;}});$("#startDate").text(shivaLib.FormatDate(x.invert(0),options.dateFormat));$("#endDate").text(shivaLib.FormatDate(x.invert(opWidth),options.dateFormat));}
else if(options.chartType=="Parallel"){var y={};var dragging={};canPan=false;var x=d3.scale.ordinal().rangePoints([0,opWidth],1);var line=d3.svg.line();var axis=d3.svg.axis().orient("left").ticks(4).outerTickSize(0);svg.attr("height",opHeight-options.lSize*2+"px");svg.attr("transform","translate(0,"+options.lSize*3+")");x.domain(dimensions=d3.keys(dataSet[0]).filter(function(d){return d!="name"&&(y[d]=d3.scale.linear().domain(d3.extent(dataSet,function(p){return+p[d];})).range([opHeight-options.lSize*4,0]));}));function position(d){var v=dragging[d];return v==null?x(d):v;}
function path(d){return line(dimensions.map(function(p){return[position(p),y[p](d[p])];}));}
function brush(){var actives=dimensions.filter(function(p){return!y[p].brush.empty();});var extents=actives.map(function(p){return y[p].brush.extent();});highlight.style("display",function(d){return actives.every(function(p,i){return extents[i][0]<=d[p]&&d[p]<=extents[i][1];})?null:"none";});}
var background=svg.append("g").selectAll("path").data(dataSet).enter().append("path").attr("d",path).attr("fill","none").attr("stroke","#"+options.iCol).attr("stroke-opacity",.4)
var highlight=svg.append("g").selectAll("path").data(dataSet).enter().append("path").attr("d",path).attr("fill","none").attr("stroke","#"+options.eCol).attr("stroke-width",options.eWid).attr("stroke-opacity",.7)
background.append("title").text(function(d){return d.name})
highlight.append("title").text(function(d){return d.name})
var g=svg.selectAll(".dimension").data(dimensions).enter().append("g").attr("transform",function(d){return"translate("+x(d)+")";}).call(d3.behavior.drag().on("dragstart",function(d){dragging[d]=this.__origin__=x(d);background.attr("visibility","hidden");}).on("drag",function(d){dragging[d]=Math.min(w,Math.max(0,this.__origin__+=d3.event.dx));highlight.attr("d",path);dimensions.sort(function(a,b){return position(a)-position(b);});x.domain(dimensions);g.attr("transform",function(d){return"translate("+position(d)+")";})}).on("dragend",function(d){delete this.__origin__;delete dragging[d];transition(d3.select(this)).attr("transform","translate("+x(d)+")");transition(highlight).attr("d",path);background.attr("d",path).transition().delay(500).duration(0).attr("visibility","visible");}));g.append("g").style("font-family","sans-serif").style("font-size","10px").attr("fill","#999").style(unselectable).each(function(d){d3.select(this).call(axis.scale(y[d]));}).append("text").style("font-size",options.lSize+"px").attr("stroke","none").attr("stroke-width",0).attr("text-anchor","middle").attr("fill","#"+options.lCol).attr("y",-options.lSize).attr("font-weight","bold").text(String);g.selectAll("path").attr("fill","none").attr("stroke","#999")
g.selectAll(".tick").each(function(d,i){if(!this.transform.baseVal.getItem(0).matrix.f)
this.style['opacity']=0;})
g.append("g").each(function(d){d3.select(this).call(y[d].brush=d3.svg.brush().y(y[d]).on("brush",brush));}).selectAll("rect").attr("x",-8).attr("width",16).attr("fill-opacity",.3)
function transition(g){return g.transition().duration(500);}}
else if(options.chartType=="Chord"){canPan=false;opHeight=opWidth;var outerRadius=opWidth/2;var innerRadius=outerRadius-options.padding;var cols=[];if(options.sCol&&(options.sCol!="none")){var v=options.sCol.split(",");for(i=0;i<v.length;++i)cols.push("#"+v[i]);}
else{var c=d3.scale.category20c();for(i=0;i<20;++i)cols.push(c(i));}
var clen=cols.length-1;function fade(opacity,src){svg.selectAll(".chord").filter(function(d,i){return d.source.index!=src&&d.target.index!=src;}).transition().style("opacity",opacity);}
var chord=d3.layout.chord().padding(.04).sortSubgroups(d3.descending).sortChords(d3.descending);var arc=d3.svg.arc().innerRadius(innerRadius).outerRadius((innerRadius+options.bandWidth*1));svg.attr("transform","translate("+outerRadius+","+outerRadius+")");var indexByName=d3.map();var nameByIndex=d3.map();var matrix=[];dataSet.nodes.forEach(function(d,i){nameByIndex.set(i,d.name);indexByName.set(d.name,i);});dataSet.nodes.forEach(function(d){var row=[];for(i=0;i<dataSet.nodes.length;++i)row[i]=0;matrix.push(row);});dataSet.edges.forEach(function(d,i){matrix[d.source][d.target]++;matrix[d.target][d.source]++;});chord.matrix(matrix);var g=svg.selectAll(".group").data(chord.groups).enter().append("g").attr("class","group");g.append("path").style("fill",function(d){return cols[d.index%clen];}).style("stroke",function(d){return cols[d.index%clen];}).attr("d",arc).on("mouseover",function(d,i){fade(.15,i);}).on("mouseout",function(){fade(.67,i);}).on("click",function(d){shivaLib.SendShivaMessage("ShivaGraph=click",nameByIndex.get(d.index)+"|"+d.index);});g.append("text").each(function(d){d.angle=(d.startAngle+d.endAngle)/2;}).attr("dy",".35em").style("font-family","sans-serif").style("font-size",options.lSize+"px").style("fill","#"+options.lCol).attr("transform",function(d){return"rotate("+(d.angle*180/Math.PI-90)+")"
+"translate("+(innerRadius*1+options.bandWidth*1+6)+")"
+(d.angle>Math.PI?"rotate(180)":"");}).style("text-anchor",function(d){return d.angle>Math.PI?"end":null;}).text(function(d){return nameByIndex.get(d.index);});g.append("title").text(function(d,i){return dataSet.nodes[d.index].info;});svg.selectAll(".chord").data(chord.chords).enter().append("path").attr("class","chord").style("stroke-width",options.eWid).style("opacity",.67).style("stroke",function(d){return d3.rgb(cols[d.source.index%clen]).darker();}).style("fill",function(d){return options.fill=="false"?"none":cols[d.source.index%clen]}).attr("d",d3.svg.chord().radius(innerRadius)).append("title").text(function(d,i){var nid1=d.target.index,nid2=d.target.subindex,rel=FindRelationship(nid1,nid2);return(typeof(rel.label)=="string")?rel.label:false;});}
if(firstTime)
shivaLib.SendReadyMessage(true);firstTime=false;}
function AddPopup(d)
{if(!d||!d.info)
return;var x=d3.event.clientX+8;var y=d3.event.clientY+8;$("#d3Popup").css({left:x,top:y});$("#d3Popup").html(shivaLib.LinkToAnchor(d.info));$("#d3Popup").show();if(shivaLib.options.popupTime==undefined)
shivaLib.options.popupTime=2;$("#d3Popup").delay(shivaLib.options.popupTime*1000).fadeOut(400);}
function FindRelationship(n1,n2)
{var rel={}
for(var dn in dataSet.edges){var edge=dataSet.edges[dn];if((edge.source==n1&&edge.target==n2)){rel.color=(edge.style in styles)?styles[edge.style].col:false;rel.label=dataSet.nodes[n1].name+" "+edge.style+" "+dataSet.nodes[n2].name;break;}else if((edge.source==n2&&edge.target==n1)){rel.color=(edge.style in styles)?styles[edge.style].col:false;rel.label=dataSet.nodes[n2].name+" "+edge.style+" "+dataSet.nodes[n1].name;break;}}
return rel;}
function DrawSVGShape(shape,size)
{var i,r,o,pts="";size/=2;var s2=size/2;if(shape=="square"){pts=-size+","+(-size)+" ";pts+=size+","+(-size)+" ";pts+=size+","+size+" ";pts+=-size+","+size+" ";return pts;}
else if(shape=="triangle"){pts="0,"+(-size)+" ";pts+=size+","+s2+" ";pts+=-size+","+s2+" ";return pts;}
else if(shape=="caret"){pts="0,"+(-s2)+" ";pts+=size+","+size+" ";pts+="0,"+(+s2)+" ";pts+=-size+","+size+" ";return pts;}
else if(shape=="diamond"){pts="0,"+(-size*3/2)+" ";pts+=size+",0 ";pts+="0,"+(size*3/2)+" ";pts+=-size+",0 ";return pts;}
else if(shape=="plus"){pts=-s2+","+(-s2*3)+" ";pts+=s2+","+(-s2*3)+" ";pts+=s2+","+(-s2)+" ";pts+=(s2+size)+","+(-s2)+" ";pts+=(s2+size)+","+(s2)+" ";pts+=s2+","+s2+" ";pts+=s2+","+(s2*3)+" ";pts+=-s2+","+(s2*3)+" ";pts+=-s2+","+s2+" ";pts+=-s2*3+","+s2+" ";pts+=-s2*3+","+(-s2)+" ";pts+=-(s2)+","+(-s2)+" ";return pts;}
var a=(2*Math.PI)/10;for(i=11;i!=0;i--){r=size*(i%2+.6);o=a*i;pts+=(r*Math.sin(o))+",";pts+=(r*Math.cos(o))+" ";}
return pts;}}
SHIVA_Show.prototype.GraphActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100")
shivaLib.opWidth=shivaLib.opHeight="100%";shivaLib.DrawGraph();}
else if(v[0]=="ShivaAct=data"){shivaLib.DrawGraph();}}