
SHIVA_Show.prototype.SaveData=function(mode,style,items,props,type)
{var i,j,k,o,str1;var ovr=""
var itemStart;var str="{\n";$('#formatter').val(0)
var atts=new Array();for(o in props)
atts.push(o);if(items){for(i=0;i<atts.length;++i)
if(atts[i]=="item"){atts[i]="name";break;}
itemStart=i;for(j=0;j<items.length;++j)
for(k=itemStart+1;k<atts.length;++k)
items[j][atts[k]]=$("#itemInput"+j+"-"+(k-i)).val();}
if((mode=='JSON')||(mode=="GetJSON")||(mode=="Canvas")||(mode=="eStore")){if(items&&items.length){for(i=0;i<items.length;++i){str+="\t\"item-"+(i+1)+"\": \"";for(k=itemStart;k<atts.length;++k){str1=items[i][atts[k]];if(str1)
str1=str1.replace(/\n/g,",").replace(/\r/g,"").replace(/\:/g,"`");str+=atts[k]+":"+str1+";";}
str=str.substring(0,str.length-1)+"\",\n";}
if(!this.overlay)
str=str.substring(0,str.length-3)+"\",\n";}
if(this.overlay)
str+=this.dr.SaveDrawData(true);if(this.ev&&this.ev.events.length){var group=this.options.shivaGroup;str+="\"shivaEvents\": "+this.ArrayToString(this.ev.events,group)+",\n";}
var j=0;if(type)
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
return;if(jsonData){var items=new Array();for(key in jsonData){if(key=="shivaEvents"){if(!shivaLib.ev)
SHIVA_Event(this.container,this.player);shivaLib.ev.AddEvents(jsonData[key]);continue;}
if(key.indexOf("item-")!=-1){v=jsonData[key].split(";");o=new Object;for(j=0;j<v.length;++j){p=v[j].split(":");o[p[0]]=p[1];}
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
$('#propertyTable tr:gt(0)').remove();for(i=0;i<atts.length;++i){o=atts[i];id="propInput"+i;var str="<tr style='height:26px'><td width='12'></td><td width='200' onClick='ShowHelp(this.innerHTML)'>"+props[o].des.split("::")[0];if((this.drupalMan)&&(o=="dataSourceUrl"))
str+="&nbsp;&nbsp;<img src='databutton.gif' title='Click to find data set' style='vertical-align:bottom' onclick='shivaLib.GetDataFromManager(\"gdoc\",0)'/>";str+="</td><td></td><td>";if(props[o].opt=="query")
str+="<input type='password' size='14' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.QueryEditor(\""+id+"\")' id='"+id+"'/>";else if(props[o].opt=="advanced")
str+="<input size='14' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.SetAdvancedAttributes(\""+id+"\",\""+o+"\")' id='"+id+"'/>";else if((props[o].opt=="color")||(props[o].opt=="colors")){str+="<div style='max-height:26px'><input size='7' onChange='Draw()' style='position:relative;text-align:center;height:16px;top:2px; padding-left: 20px' id='"+id+"'/>";str+="<div style='position:relative;border:1px solid;height:11px;width:11px;top:-16px;left:6px'"
if(props[o].opt=="colors")
str+=" onclick='shivaLib.ColorPicker(1,"+i+")' id='"+id+"C'/>";else
str+=" onclick='shivaLib.ColorPicker(0,"+i+")' id='"+id+"C'/>";str+="</div>"}
else if(props[o].opt=="button")
str+="<button type='button' size='14' onChange='"+o+"' id='"+id+"'>"+props[o].def+"</button>";else if(props[o].opt=="slider")
str+="<input style='width:100px' onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";else if(props[o].opt=="checkbox"){str+="<input onChange='Draw()' type='checkbox' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'";if(props[o].def=="true")
str+=" checked";str+="/> "+props[o].des.split("::")[1];}
else if(props[o].opt=="list")
str+="<textarea cols='12' rows='2' onChange='Draw()' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";else if(props[o].opt=="hidden")
str="<tr><td width='12'></td><td width='200'><input type='hidden' id='"+id+"'/>";else if(props[o].opt.indexOf('|')!=-1){var v=props[o].opt.split("|");if(o=='item'){str="<tr><td width='12'></td><td colspan='3'><div id='accord'>";for(j=0;j<items.length;++j){str+="<h3><a href='#'><b>"+items[j].name+"</b></a></h3><div id='accord-"+j+"'>";for(k=i+1;k<atts.length;++k){id2="itemInput"+j+"-"+(k-i);oo=atts[k];if(props[oo].opt!="hidden")
str+="<span onClick='ShowHelp(this.innerText)'>"+props[oo].des;if((this.drupalMan)&&(oo=="layerSource"))
str+="<img src='kmlicon.gif' id='"+j+"' title='Click to find KML file' style='vertical-align:bottom' onclick='shivaLib.GetDataFromManager(\"kml\",this.id)'/>";str+="</span><span style='position:absolute;left:142px;'>";if(props[oo].opt=="color"){str+="<input size='14' onChange='Draw()' style='text-align:center' id='"+id2+"'>";str+="<div style='position:relative;border:1px solid;height:8px;width:9px;top:-14px;left:5px'"
str+=" onclick='shivaLib.ColorPicker(0,"+((j*100)+100+(k-i))+")' id='"+id2+"C'/>";}
else if(props[oo].opt=="colors")
str+="<input size='14' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.ColorPicker(2,"+((j*100)+100+(k-i))+")' id='"+id2+"'>";else if(props[oo].opt=="button")
str+="<button type='button' size='12' onChange='"+oo+"' id='"+id+"'>"+props[oo].def+"</button>";else if(props[oo].opt=="slider")
str+="<input style='width:90px' onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";else if(props[oo].opt=="list")
str+="<textarea cols='12' rows='2' onChange='Draw()' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";else if(props[oo].opt=="hidden")
str+="<input type='hidden' id='"+id2+"'/>";else if(props[oo].opt.indexOf('|')!=-1){var v=props[oo].opt.split("|");str+="<select id='"+id2+"' onChange='Draw()' onFocus='ShowHelp(\""+props[oo].des+"\")'>";for(l=0;l<v.length;++l){if(v[l])
str+="<option>"+v[l]+"</option>";}
str+="</select>";}
else
str+="<input size='14' onChange='Draw()' type='text' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";str+="</span></p>";}
str+="</div>";}}
else{str+="<select id='"+id+"' onChange='Draw()' onFocus='ShowHelp(\""+props[o].des+"\")'>";for(j=0;j<v.length;++j){if(v[j])
str+="<option>"+v[j]+"</option>";}
str+="</select>";}}
else
str+="<input size='14' style='height:16px' onChange='Draw()' type='text' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";str+="<td width='12'></td ></td></tr>";$(str).appendTo("#propertyTable tbody")
$("#"+id).val(props[o].def);if(keepData)
$("#"+id).val(oldData[i]);else
$("#"+id).val(props[o].def);if(props[o].opt=="color")
if(props[o].def.toLowerCase()!='auto'){$("#"+id).css('border-color',"#"+props[o].def);$("#"+id+"C").css('background-color',"#"+props[o].def);}
if(o=="item")
break;}
str="<tr height='8'><td></td></tr>";$(str).appendTo("#propertyTable tbody")
$("#accord").accordion({collapsible:true,active:false,autoHeight:false,change:this.callback});if(items){for(j=0;j<items.length;++j){for(k=i+1;k<atts.length;++k){o=atts[k];id2="itemInput"+j+"-"+(k-i);if(props[o].opt=="color")
if(props[o].def.toLowerCase()!='auto'){$("#"+id2).css('border-color',"#"+items[j][atts[k]]);$("#"+id2+"C").css('background-color',"#"+items[j][atts[k]]);}}}
for(i=0;i<atts.length;++i)
if(atts[i]=="item"){atts[i]="name";break;}
for(j=0;j<items.length;++j)
for(k=i;k<atts.length;++k)
$("#itemInput"+j+"-"+(k-i)).val(items[j][atts[k]]);}}
SHIVA_Show.prototype.SetAdvancedAttributes=function(prop,baseVar)
{var str,title,aProps,v,i;$("#advAttDialogDiv").dialog("destroy");$("#advAttDialogDiv").remove();str="<table>"
switch(baseVar){case"legendTextStyle":case"titleTextStyle":case"pieSliceTextStyle":case"tooltipTextStyle":aProps={fontName:{opt:'string',des:'Font'},fontSize:{opt:'string',des:'Size'},color:{opt:'color',des:'Color'}}
break;case"chartArea":aProps={left:{opt:'string',des:'Left'},top:{opt:'string',des:'Top'},height:{opt:'string',des:'Height'},width:{opt:'strinh',des:'Width'}}
break;case"backgroundColor":aProps={fill:{opt:'color',des:'Fill color'},stroke:{opt:'color',des:'Border color'},strokeWidth:{opt:'string',des:'Border width'}}
break;case"vAxis":case"hAxis":aProps={baseline:{opt:'string',des:'Baseline'},baselineColor:{opt:'color',des:'Baseline color'},direction:{opt:'string',des:'Direction'},format:{opt:'string',des:'Axis lable format'},direction:{opt:'string',des:'Direction'},logScale:{opt:'string',des:'Log scale?'},textPosition:{opt:'string',des:'Text position'},title:{opt:'string',des:'Axis title'},maxValue:{opt:'string',des:'Max value'},minValue:{opt:'string',des:'Min value'},slantedText:{opt:'string',des:'Slanted text'}}
break;case"backgroundColors":aProps={main:{opt:'color',des:'Main Background'},eventspan:{opt:'color',des:'Event Span Background'},head:{opt:'color',des:'Header, Footer and Zoom Background'},popup:{opt:'color',des:'Popup Background'},imagelane:{opt:'color',des:'Image Lane Background'},ticklane:{opt:'color',des:'Time Ticks Background'},popuplink:{opt:'color',des:'Popup Link Background'}}
break;case"fontColors":aProps={main:{opt:'color',des:'Main Font Color'},head:{opt:'color',des:'Header Font Color'},popup:{opt:'color',des:'Popup Font Color'},links:{opt:'color',des:'Link Font Color'}}}
for(o in aProps){str+="<tr style='height:26px' onClick='ShowHelp(\""+aProps[o].des+"\")'><td>"+aProps[o].des+"</td><td>";if(aProps[o].opt=="color"){str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:center;height:16px;top:2px' id='"+baseVar+o+"'/>";str+="<div style='position:relative;border:1px solid;height:11px;width:11px;top:-16px;left:6px'"
str+=" onclick='shivaLib.ColorPicker(0,\"___"+baseVar+o+"\")' id='"+baseVar+o+"C'/>";}
else
str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:left;height:16px;top:2px' id='"+baseVar+o+"'/>";str+="</td></tr>";}
var ops={width:'auto',height:'auto',modal:true,title:"Set "+baseVar,position:[300,350],buttons:{OK:function(){str="";for(o in aProps){if($("#"+baseVar+o).val())
str+=o+"="+$("#"+baseVar+o).val()+",";}
$("#"+prop).val(str);$("#"+prop).trigger("onchange");$(this).dialog("destroy");$("#advAttDialogDiv").remove();},'Cancel':function(){$(this).dialog("destroy");$("#advAttDialogDiv").remove();}}}
$("body").append("<div id='advAttDialogDiv'/>");$("#advAttDialogDiv").dialog(ops);$("#advAttDialogDiv").html(str+"</table>");v=$("#"+prop).val().split(",");for(i=0;i<v.length-1;++i)
$("#"+baseVar+v[i].split("=")[0]).val(v[i].split("=")[1]);}
SHIVA_Show.prototype.GetDataFromManager=function(type,index)
{if(type=="gdoc")
window.parent.postMessage("dataSourceUrl","*");if(type=="kml")
window.parent.postMessage("GetFile=KML="+index,"*");}
SHIVA_Show.prototype.ShiftItem=function(dir,items)
{var active=$("#accord").accordion("option","active");if(active===false)
return-1;var pos=Number(active)+Number(dir);if((pos<0)||(pos>=items.length))
return active;else
this.Sound("click");var o=items[pos];items[pos]=items[active];items[active]=o;this.Draw();return pos;}
SHIVA_Show.prototype.DrawControl=function()
{var options=this.options;var container=this.container;var con="#"+container;var items=new Array();this.items=items;var _this=this;for(var key in options){if(key.indexOf("item-")!=-1){var o=new Object;var v=options[key].split(';');for(i=0;i<v.length;++i){v[i]=v[i].replace(/http:/g,"http`");o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");}
items.push(o);}}
if(options.chartType=="Dialog")
$.proxy(DrawDialog(items),this);else if(options.chartType=="Selector")
$.proxy(DrawSelector(items),this);else if(options.chartType=="TimeSlider")
$.proxy(DrawTimeSlider(items),this);else if(options.chartType=="TimeStepper")
$.proxy(DrawTimeStepper(items),this);else if(options.chartType=="InfoBox")
$.proxy(DrawInfoBox(items),this);this.SendReadyMessage(true);function DrawTimeStepper(items)
{var i;var dd=container+"Stp";var str="<span id='"+dd+"'>";for(i=0;i<items.length;++i){str+="<input type='radio' id='stp"+i+"' name='stepper'";if(!i)
str+=" checked=checked";str+="/><label for='stp"+i+"'>"+(i+1)+"</label>";items[i].ans=items[i].def;}
str+="<input type='radio' id='stp"+i+"' name='stepper'";str+="/><label for='stp"+i+"'>NEXT</label>";str+="</span>";$(con).html(str);$(con).css("text-align","left");$(con).css("width",((items.length*25)+80)+"px");$("#"+dd).buttonset().change(function(e){shiva_Step(e.target.id.substr(3),_this)});$("#stp"+i).button({text:true,icons:{primary:"ui-icon-triangle-1-e"}});}
function DrawTimeSlider(items)
{var str="";var dd=con+"Int";$(dd).remove();$(con).append("<div id='"+dd.substr(1)+"'/>");$(con).css("height","30px");$(con).css("width","30px");options.orientation=options.orientation.toLowerCase();options.step=Number(options.step);if(options.orientation=="vertical"){$(dd).css("height",options.size+"px");$(con).css("height",options.size+"px");}
else{$(dd).css("width",options.size+"px");$(con).css("width",options.size+"px");}
if(options.type=="Bar")
options.range="min";else if(options.type=="Range")
options.range=true;if((!options.def)&&(options.type=="Range"))
options.def="25,75";if(options.def.indexOf(",")==-1)
options.value=Number(options.def);else{options.values=new Array();options.values[0]=Number(options.def.split(",")[0]);options.values[1]=Number(options.def.split(",")[1]);}
if(!$('#sliderBack').length){var mc=document.createElement('canvas');mc.setAttribute('id','sliderBack');$(dd).append(mc)
sliderContext=mc.getContext('2d');}
$(dd).slider("destroy");$(dd).slider(options);$(dd).bind("slidestop",function(e,ui){var which=-1;var val=ui.value;if(ui.values)
val=ui.values[0];if(ui.value!=val){which=0;val=ui.values[1];}
shivaLib.SendShivaMessage("ShivaSlider="+(which+1)+"|"+val);});DrawSliderTicks();}
function DrawSliderTicks()
{var g=_this.g;if(!g)
g=_this.g=new SHIVA_Graphics();var hgt=40,wid=40,pos,val;var n=Number(options.ticks);var showValues=(options.showValues=="true")
var min=Number(options.min);var max=Number(options.max);var isVert=(options.orientation=="vertical");if(isVert)
hgt=options.size;else
wid=options.size;$('#sliderBack').attr('width',wid);$('#sliderBack').attr('height',hgt);var inc=Number(options.size/(n+1));var pos=inc;var tinc=Math.abs(max-min)/(n+1);var tpos=tinc;if(!isVert)
sliderContext.textAlign="center";for(i=0;i<n;++i){if(isVert)
g.DrawLine(sliderContext,"#000",1,8,pos,15,pos,.5);else
g.DrawLine(sliderContext,"#000",1,pos,8,pos,15,.5);if(showValues){val=tpos;if(Math.abs(max-min)>4)
val=Math.round(val);else{val=Math.round(tpos*100);val=Math.floor(val/100)+"."+(val%100);}
val=Number(val)+min;if(isVert)
sliderContext.fillText(val,18,Number(options.size)-pos+3);else
sliderContext.fillText(val,pos,25);}
pos+=inc;tpos+=tinc;}
if(showValues){sliderContext.font="bold 10px Arial";sliderContext.textAlign="left";if(isVert){sliderContext.fillText(min,14,hgt);sliderContext.fillText(max+options.suffix,14,10);}
else{sliderContext.fillText(min,0,25);sliderContext.textAlign="right";sliderContext.fillText(max+options.suffix,wid,25);}
sliderContext.font="";}}
function DrawSelector(items)
{var i,o,nChars=0;var dd=container+"Sel";var str="<span id='"+dd+"'>";for(i=0;i<items.length;++i){o=items[i];nChars+=o.label.length+5;if(items[i].type)nChars+=4;if(options.style=="Button")
str+="<input type='button' id='sel"+i+"' value='"+o.label+"'>";else if(options.style=="Toggle")
str+="<input type='checkbox' id='sel"+i+"'/><label for="+"'sel"+i+"'>"+o.label+"</label>";else{str+="<input type='radio' id='sel"+i+"' name='selector'";if(o.def=="true")
str+=" checked='sel"+i+"'";if(!items[i].label)
str+="/><label for='sel"+i+"'>&nbsp;</label>";else
str+="/><label for='sel"+i+"'>"+o.label+"</label>";}}
str+="</span>";$(con).html(str);for(i=0;i<items.length;++i){if(options.style=="Toggle")
$("#sel"+i).click(function(){var ch=this.checked?"checked":"unchecked"
var id=this.id.substr(3)
shivaLib.SendShivaMessage("ShivaSelect="+id+"|"+ch)});else
$("#sel"+i).click(function(){shivaLib.SendShivaMessage("ShivaSelect="+this.id.substr(3)+"|checked")});}
$(con).css("text-align","left");$("#"+dd).buttonset();$(con).css("width",(nChars*6)+"px");for(i=0;i<items.length;++i)
if(items[i].type!="Button"){items[i].type=items[i].type.replace(/\./g,"");items[i].type=items[i].type.replace(/ui-icon-/g,"");$("#sel"+i).button({text:true,icons:{primary:"ui-icon-"+items[i].type}});}}
function DrawDialog(items)
{var o,i,v,sty,str="";var dd="#"+container+"Dlg";$(dd).remove();$(con).append("<div id='"+container+"Dlg' style='border:1px solid #999;padding:8px;background-color:#f8f8f8;text-align:left' class='rounded-corners'/>");for(o in options){v=options[o];if(v=="true")v=true;if(v=="false")v=false;options[o]=v;}
if((options.draggable)&&(!_this.editMode))
$(dd).draggable();if(options.title)
str+="<div align='center'><b>"+options.title+"</b></div><br>";for(i=0;i<items.length;++i){o=items[i];if(o.type)
sty=o.type.toLowerCase();if(sty=='checkbox'){str+="<input type='"+sty+"'";str+=" name='"+o.name+"' id='"+o.name+"'";if(o.def)
str+=" checked=checked";str+="/> ";if(o.label)
str+=o.label;}
else if(sty=='radio'){str+="<input type='"+sty+"'";str+=" name='"+o.group+"' id='"+o.name+"'";if(o.def)
str+=" checked=checked";str+="/> ";if(o.label)
str+=o.label;}
else if((sty=='input')||(sty=='button')){str+="<input type='"+sty+"' size='23'";str+=" name='"+o.name+"' id='"+o.name+"'";str+="style='margin-top:.5em;margin-bottom:.5em'";if(o.def)
str+=" value='"+o.def+"'";str+="/> ";if(o.label)
str+=o.label;}
else if(sty=='range')
str+="<div style='width:120px;display:inline-block' id='"+o.name+"'></div> "+o.label;else if(sty=='combo'){str+="<select ";str+=" name='"+o.name+"' id='"+o.name+"'";str+="style='margin-top:.5em;margin-bottom:.5em'";str+=">";v=o.label.split("|");for(var j=0;j<v.length;++j){str+="<option";if(o.def==v[j])
str+=" selected='selected'";str+=">"+v[j]+"</option>";}
str+="</select>";}
else if(sty=='line'){str+="<hr style='margin-top:.5em;margin-bottom:.5em'/>";continue;}
else if(sty=='text')
str+="<span style='margin-top:.5em;margin-bottom:.5em'>"+o.label+"</span>";else if(sty=='image'){str+="<input type='"+sty+"' src='"+o.def+"'";str+=" name='"+o.name+"' id='"+o.name+"'";str+="style='margin-top:.5em;margin-bottom:.5em'";str+="/>";}
str+="<br/> ";}
$(dd).html(str);for(i=0;i<items.length;++i){o=items[i];if(o.type)
sty=o.type.toLowerCase();if((sty=="radio")||(sty=="image")||(sty=="button"))
$("#"+o.name).click(function(){var id=this.id.substr(5)
shivaLib.SendShivaMessage("ShivaDialog="+id+"|checked")});else if(sty=="checkbox")
$("#"+o.name).click(function(){var id=this.id.substr(5)
var ch=this.checked?"checked":"unchecked"
shivaLib.SendShivaMessage("ShivaDialog="+id+"|"+ch)});else if((sty=="input")||(sty=="combo"))
$("#"+o.name).change(function(){var id=this.id.substr(5)
var ch=this.value;shivaLib.SendShivaMessage("ShivaDialog="+id+"|"+ch)});else if(sty=="range"){var ops={min:0,max:100,value:o.def,slide:function(event,ui){var id=this.id.substr(5)
shivaLib.SendShivaMessage("ShivaDialog="+id+"|"+ui.value)}};$("#"+o.name).slider(ops);}}}
function DrawInfoBox(items)
{var str="";var min=0;var dd="#"+container+"Inf";$(dd).remove();$(con).append("<div id='"+container+"Inf' style='border:1px solid #999;padding:8px;text-align:left' class='rounded-corners'/>");for(o in options){v=options[o];if(v=="true")v=true;if(v=="false")v=false;options[o]=v;}
if(options.title)
str+="<div align='center'><b>"+options.title+"</b></div>";if((options.closer)||(options.title)){str+="<br/>";min=16;}
var content="#"+container+"Con";str+="<div id='"+container+"Con'></div>"
$(dd).html(str);if(options.backCol==-1)$(dd).css("background-color","transparent")
else $(dd).css("background-color","#"+options.backCol)
if(options.frameCol==-1)$(dd).css("border-color","transparent")
else $(dd).css("border-color","#"+options.frameCol)
if(options.width!="auto")$(dd).css("width",options.width+"px");if(options.height!="auto"){$(dd).css("height",options.height+"px");$(content).css("height",options.height-min+"px");}
if((options.draggable)&&(!_this.editMode))
$(dd).draggable();if((options.text)&&(options.style=="Text"))
$(content).html(options.text);if(options.scroller)$(content).css("overflow","scroll").css("overflow-x","hidden");else $(content).css("overflow","hidden");if(options.closer){var x=$(dd).width()-2;str="<img id='Clo"+dd.substr(1)+"' src='closedot.gif' style='position:absolute;left:"+x+"px;top:5px'/>"
$(dd).append(str);$("#Clo"+dd.substr(1)).click(function(){var id=this.id.substr(3);$("#"+id).hide();shivaLib.SendShivaMessage("ShivaDialog="+options.title+"|closed");});}}}
function shiva_Step(num,obj)
{if(num<0)
num=obj.lastStep-0+1;num=Math.min(num,obj.items.length-1);obj.lastStep=num;for(var i=0;i<obj.items.length;++i)
$("#stp"+i).removeAttr("checked");$("#stp"+num).attr("checked",true);$("#shiva_stepq").remove();var str="<div id='shiva_stepq'><br/><b>"+obj.items[num].label+"</b><br/>";shivaLib.SendShivaMessage("ShivaStep="+num+"|"+obj.items[num].ques+"|"+obj.items[num].ans);if(obj.items[num].ques.indexOf("|")!=-1){str+="<select name='shiva_stepa' id='shiva_stepa' onChange='shiva_onStepAnswer("+num+","+this+")'>";var v=obj.items[num].ques.split("|");for(var j=0;j<v.length;++j){str+="<option";if(obj.items[num].ans==v[j])
str+=" selected='selected'";str+=">"+v[j]+"</option>";}
str+="</select></div>";$("#"+obj.container).append(str);}
else if(obj.items[num].ques){var e="onblur";if(obj.items[num].ques=="color")
e="onfocus";str+="<input id='shiva_stepa' type='input' "+e+"='shiva_onStepAnswer("+num+","+this+")'></div>";$("#shiva_stepa").val(obj.items[num].ans);}
$("#"+obj.container).append(str);if($("#accord").length)
$("#accord").accordion({active:num});}
function shiva_onStepAnswer(num,obj)
{if(obj.items[num].ques=="color")
obj.ColorPicker(-1,"shiva_stepa");obj.items[num].ans=$("#shiva_stepa").val();}
function SHIVA_Draw(container,hidePalette)
{this.container=container;this.color="-1";this.clipboard=new Array();this.edgeColor="#0000ff";this.textColor="#000000";this.boxColor="-1";this.edgeWidth="30";this.arrow=false;this.alpha=100;this.curTool=0;this.imageURL="";this.imageWid=400;this.textAlign="Left";this.textStyle="";this.textSize=0;this.ideaShape="Round box";this.ideaGradient=true;this.ideaBold=false;this.ideaBackCol="#FFF2CC";this.ideaEdgeCol="#999999";this.ideaTextCol="#000000";this.selectedItems=new Array();this.selectedDot=-1;this.segs=new Array();this.startTime="0:0";this.endTime="end";if(shivaLib.overlay)
this.segs=shivaLib.overlay;this.closeOnMouseUp=false;this.curSeg=-1;this.lastDotTime=0;this.snap=false;this.curve=false;this.snapSpan=20;this.leftClick=false;this.lastX=0;this.lastY=0;shivaLib.dr=this;if(!hidePalette)
this.DrawPalette();this.colorPicker="";this.ctx=$("#shivaDrawCanvas")[0].getContext('2d');$("#shivaDrawDiv").css("cursor","crosshair");$("#shivaDrawDiv").mouseup(this.onMouseUp);$("#shivaDrawDiv").mousedown(this.onMouseDown);$("#shivaDrawDiv").mousemove(this.onMouseMove);document.onkeyup=this.onKeyUp;document.onkeydown=this.onKeyDown;}
SHIVA_Draw.prototype.DrawPalette=function(tool)
{var hgt=$("#"+this.container).css("height").replace(/px/g,"");var top=$("#"+this.container).css("top").replace(/px/g,"");if(top=="auto")top=0;var left=$("#"+this.container).css("left").replace(/px/g,"")-0+12;if($("#shivaDrawPaletteDiv").length==0){var h=225;if(shivaLib.player)
h+=16;str="<div id='shivaDrawPaletteDiv' style='position:absolute;left:"+left+"px;top:"+(top-12+Number(hgt)-100)+"px;width:180px;height:"+h+"px'>";$("body").append("</div>"+str);$("#shivaDrawPaletteDiv").addClass("propTable");$("#shivaDrawPaletteDiv").draggable();$("#shivaDrawPaletteDiv").css("z-index",2001);}
this.SetTool(0);this.DrawMenu();}
SHIVA_Draw.prototype.ColorPicker=function(name)
{var str="<p style='text-shadow:1px 1px white' align='center'><b>Choose a new color</b></p>";str+="<img src='colorpicker.gif' style='position:absolute;left:15px;top:28px' />";str+="<input id='shivaDrawColorInput' type='text' style='position:absolute;left:22px;top:29px;width:96px;background:transparent;border:none;'>";$("#shivaDrawPaletteDiv").html(str);$("#shivaDrawPaletteDiv").on("click",onColorPicker);this.colorPicker=name;function onColorPicker(e){var col;var cols=["000000","444444","666666","999999","CCCCCC","EEEEEE","E7E7E7","FFFFFF","FF0000","FF9900","FFFF00","00FF00","00FFFF","0000FF","9900FF","FF00FF","F4CCCC","FCE5CD","FFF2CC","D9EAD3","D0E0E3","CFE2F3","D9D2E9","EDD1DC","EA9999","F9CB9C","FFE599","BED7A8","A2C4C9","9FC5E8","B4A7D6","D5A6BD","E06666","F6B26B","FFD966","9C347D","76A5AF","6FA8DC","8E7CC3","C27BA0","CC0000","E69138","F1C232","6AA84F","45818E","3D85C6","674EA7","A64D79","990000","B45F06","BF9000","38761D","134F5C","0B5394","351C75","741B47","660000","783F04","7F6000","274E13","0C343D","073763","20124D","4C1130"];var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;if((x<112)&&(y<55))
return;$("#shivaDrawPaletteDiv").off("click",this.onColorPicker);if((x>112)&&(x<143)&&(y<48)){if($("#shivaDrawColorInput").val())
col="#"+$("#shivaDrawColorInput").val();else
x=135;}
if((x>143)&&(y<48)){shivaLib.dr.DrawMenu();return;}
if(y>193)
col=-1;else if(y>48){x=Math.floor((x-24)/17);y=Math.floor((y-51)/17);col="#"+cols[x+(y*8)];}
shivaLib.dr[shivaLib.dr.colorPicker]=col;if(shivaLib.dr.curTool==5){if(shivaLib.dr.selectedItems.length)
shivaLib.dr.DrawMenu(shivaLib.dr.segs[shivaLib.dr.selectedItems[0]].type);else
shivaLib.dr.DrawMenu(0);shivaLib.dr.SetVal(shivaLib.dr.colorPicker,col);}
else if(shivaLib.dr.curTool==6){shivaLib.dr.SetVal(shivaLib.dr.colorPicker,col);shivaLib.dr.DrawMenu();}
else
shivaLib.dr.DrawMenu();}}
SHIVA_Draw.prototype.DrawMenu=function(tool)
{var preface="Edit ";if(tool==undefined)
tool=this.curTool,preface="Draw ";var titles=["a line","a circle","a box","text","an image",""," an Idea Map"];var str="<p style='text-shadow:1px 1px white' align='center'><b>";str+=preface+titles[tool]+"</b></p>";str+="<img src='closedot.gif' style='position:absolute;left:163px;top:1px' onclick='shivaLib.dr.SetTool(-1)'/>";str+="<table style='font-size:xx-small'>"
if(tool<3){str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='shivaLib.dr.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";if(tool==2)
str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";else if(tool==0){str+="<tr><td>&nbsp;&nbsp;Draw curves?</td><td><input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Draw arrow?</td><td><input onClick='shivaLib.dr.SetVal(\"arrow\",this.checked)' type='checkbox' id='arrow'></td></tr>";}
str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"edgeColor\")' onChange='shivaLib.dr.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";}
else if(tool==3){str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"boxColor\")' onChange='shivaLib.dr.SetVal(\"boxColor\",this.value)' type='text' id='boxColor'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Align</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='shivaLib.dr.SetVal(\"textAlign\",this.value)' id='textAlign'><option>Left</option><option>Right</option><option>Center</option></select></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Text size</td><td><div style='width:82px;margin-left:6px' id='textSize'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"textColor\")' onChange='shivaLib.dr.SetVal(\"textColor\",this.value)' type='text' id='textColor'></td></tr>";}
else if(tool==4){str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='shivaLib.dr.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Edge color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"edgeColor\")' onChange='shivaLib.dr.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Image URL</td><td>&nbsp;<input style='width:85px;height:12px' onChange='shivaLib.dr.SetVal(\"imageURL\",this.value)' type='text' id='imageURL'></td></tr>";}
else if(tool==6){str+="<tr><td>&nbsp;&nbsp;Shape</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='shivaLib.dr.SetVal(\"ideaShape\",this.value)' id='ideaShape'><option>Round box</option><option>Rectangle</option><option>Oval</option><option>Circle</option></select></td></tr>";str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"ideaBackCol\")' type='text' id='ideaBackCol'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Gradient?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"ideaGradient\",this.checked)' type='checkbox' id='ideaGradient'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"ideaEdgeCol\")' onChange='shivaLib.dr.SetVal(\"ideaEdgeCol\",this.value)' type='text' id='ideaEdgeCol'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"ideaTextCol\")' onChange='shivaLib.dr.SetVal(\"ideaTextCol\",this.value)' type='text' id='ideaTextCol'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Bold text?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"ideaBold\",this.checked)' type='checkbox' id='ideaBold'></td></tr>";str+="<tr><td colspan='2' style='text-align:center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='font-size:x-small' onclick='shivaLib.dr.AddIdea(-1)'>Add base idea</button></td></tr>";}
str+="</table><br/>";str+="<div style='position:absolute;left:14px;top:194px'><span id='drawToolbar' style='font-size:xx-small'>";str+="<input type='radio' id='sdtb6' name='draw' onclick='shivaLib.dr.SetTool(5)'/><label for='sdtb6'>Select</label>";str+="<input type='radio' id='sdtb3' name='draw' onclick='shivaLib.dr.SetTool(2)'/><label for='sdtb3'>Box</label>";str+="<input type='radio' id='sdtb2' name='draw' onclick='shivaLib.dr.SetTool(1)'/><label for='sdtb2'>Circle</label>";str+="<input type='radio' id='sdtb1' name='draw' onclick='shivaLib.dr.SetTool(0)'/><label for='sdtb1'>Line</label>";str+="<input type='radio' id='sdtb4' name='draw' onclick='shivaLib.dr.SetTool(3)'/><label for='sdtb4'>A</label>";str+="<input type='radio' id='sdtb5' name='draw' onclick='shivaLib.dr.SetTool(4)'/><label for='sdtb5'>Image</label>";str+="<input type='radio' id='sdtb7' name='draw' onclick='shivaLib.dr.SetTool(6)'/><label for='sdtb7'>Idea</label>";str+="</span></div>";if(shivaLib.player){str+="<img src='startdot.gif' style='position:absolute;left:13px;top:220px'  onclick='shivaLib.dr.SetVal(\"startTime\")'/>";str+="<img src='enddot.gif'   style='position:absolute;left:150px;top:220px' onclick='shivaLib.dr.SetVal(\"endTime\")'/>";str+="<p id='startEndTime' align='center' style='position:absolute;left:40px;top:214px;width:108px;color:#777'/>";}
$("#shivaDrawPaletteDiv").html(str);$("#shivaDrawPaletteDiv").css("font-size","xx-small");$("#sdtb"+(this.curTool+1)).attr("checked","checked");$("#drawToolbar").buttonset();$("#sdtb1").button({text:false,icons:{primary:"ui-icon-pencil"}});$("#sdtb2").button({text:false,icons:{primary:"ui-icon-radio-on"}});$("#sdtb3").button({text:false,icons:{primary:"ui-icon-circlesmall-plus"}});$("#sdtb4").button({text:true});$("#sdtb5").button({text:false,icons:{primary:"ui-icon-image"}});$("#sdtb6").button({text:false,icons:{primary:"ui-icon-arrowthick-1-nw"}}).css("width","100");$("#sdtb7").button({text:false,icons:{primary:"ui-icon-lightbulb"}}).css("width","100");$("#alpha").slider({slide:function(event,ui){shivaLib.dr.SetVal("alpha",ui.value);}});$("#edgeWidth").slider({slide:function(event,ui){shivaLib.dr.SetVal("edgeWidth",ui.value);}});$("#textSize").slider({slide:function(event,ui){shivaLib.dr.SetVal("textSize",ui.value);}});$("#alpha .ui-slider-handle").css("border","1px solid #888");$("#edgeWidth .ui-slider-handle").css("border","1px solid #888");$("#textSize .ui-slider-handle").css("border","1px solid #888");this.SetMenuProperties();}
SHIVA_Draw.prototype.SetMenuProperties=function()
{var col,tcol,txt;tcol=txt=col=this.color;gradient=true;if(col==-1)col="#fff",tcol="000",txt='none';$("#color").css("background-color",col);$("#color").css("color",tcol);$("#color").val(txt);tcol=txt=col=this.edgeColor;if(col==-1)col="#fff",tcol="000",txt='none';$("#edgeColor").css("background-color",col);$("#edgeColor").css("color",tcol);$("#edgeColor").val(txt);tcol=txt=col=this.textColor;if(col==-1)col="#fff",tcol="000",txt='none';$("#textColor").css("background-color",col);$("#textColor").css("color",tcol);$("#textColor").val(txt);tcol=txt=col=this.boxColor;if(col==-1)col="#fff",tcol="000",txt='none';$("#boxColor").css("background-color",col);$("#boxColor").css("color",tcol);$("#boxColor").val(txt);$("#snap").attr("checked",this.snap);$("#curve").attr("checked",this.curve);$("#arrow").attr("checked",this.arrow);$("#edgeWidth").slider("value",this.edgeWidth);$("#alpha").slider("value",this.alpha);$("#restSize").slider("value",this.textSize);$("#textAlign").val(this.textAlign);$("#imageURL").val(this.imageURL);$("#startEndTime").text(this.startTime+" -> "+this.endTime);$("#edgeWidth").val(this.edgeWidth);$("#ideaShape").val(this.ideaShape);$("#ideaBackCol").val(this.ideaBackCol);$("#ideaGradient").attr("checked",this.ideaGradient);$("#ideaBold").attr("checked",this.ideaBold);tcol=txt=col=this.ideaBackCol;if(col==-1)col="#fff",tcol="000",txt='none';$("#ideaBackCol").val(txt);$("#ideaBackCol").css("background-color",col);$("#ideaBackCol").css("color",tcol);tcol=txt=col=this.ideaEdgeCol;if(col==-1)col="#fff",tcol="000",txt='none';$("#ideaEdgeCol").val(txt);$("#ideaEdgeCol").css("background-color",col);$("#ideaEdgeCol").css("color",tcol);tcol=txt=col=this.ideaTextCol;if(col==-1)col="#fff",tcol="000",txt='none';$("#ideaTextCol").val(txt);$("#ideaTextCol").css("background-color",col);$("#ideaTextCol").css("color",tcol);}
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
return;o=new Object;o.type=this.curTool;o.x=new Array();o.y=new Array();o.alpha=this.alpha;o.curve=this.curve;if(shivaLib.player)
o.s=this.startTime,o.e=this.endTime;if(o.type<3){o.color=this.color;o.edgeColor=this.edgeColor;o.edgeWidth=this.edgeWidth;o.arrow=this.arrow;}
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
var num=this.curSeg;if((prop=="startTime")||(prop=="endTime")){var time=shivaLib.player.currentTime();val=Math.floor(time/60)+":";val+=Math.ceil(time%60);this[prop]=val;this.DrawMenu();shivaLib.Sound("click");}
this[prop]=val;if((this.curTool<3)&&(num!=-1)){this.segs[num].curve=this.curve;this.segs[num].arrow=this.arrow;this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].alpha=this.alpha;this.segs[num].color=this.color;this.DrawOverlay();}
if((this.curTool==3)&&(num!=-1)){this.segs[num].curve=this.curve;this.segs[num].boxColor=this.boxColor;this.segs[num].textSize=this.textSize;this.segs[num].textColor=this.textColor;this.segs[num].textAlign=this.textAlign;this.segs[num].alpha=this.alpha;}
if((this.curTool==4)&&(num!=-1)){this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].alpha=this.alpha;this.segs[num].imageURL=this.imageURL;}
else if(this.curTool==5){for(var i=0;i<this.selectedItems.length;++i){num=this.selectedItems[i];this.segs[num].alpha=this.alpha;this.segs[num].curve=this.curve;if(this.segs[num].type<3){this.segs[num].color=this.color;this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].arrow=this.arrow;}
else if(this.segs[num].type==3){this.segs[num].boxColor=this.boxColor;this.segs[num].textColor=this.textColor;this.segs[num].textAlign=this.textAlign;this.segs[num].textSize=this.textSize;}
else if(this.segs[num].type==4){this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].alpha=this.alpha;this.segs[num].imageURL=this.imageURL;}
if(shivaLib.player){this.segs[num].s=this.startTime;this.segs[num].e=this.endTime;}}
this.DrawOverlay();this.DrawWireframes(false);}
else if(this.curTool==6){for(var i=0;i<this.selectedItems.length;++i){num=this.selectedItems[i];this.segs[num].ideaBackCol=this.ideaBackCol;this.segs[num].ideaEdgeCol=this.ideaEdgeCol;this.segs[num].ideaTextCol=this.ideaTextCol;this.segs[num].ideaGradient=this.ideaGradient;this.segs[num].ideaBold=this.ideaBold;this.segs[num].ideaShape=this.ideaShape;}
this.DrawOverlay();}}
SHIVA_Draw.prototype.SetTool=function(num)
{$("#shivaDrawDiv").css('pointer-events','auto');this.curTool=num;if(num==6)
$("#shivaDrawDiv").css("cursor","auto");else
$("#shivaDrawDiv").css("cursor","crosshair");if(this.curTool==-1){shivaLib.Sound("delete");$("#shivaDrawDiv").css("cursor","auto");$("#shivaDrawDiv").css('pointer-events','none');$("#shivaDrawPaletteDiv").remove();}
else
shivaLib.Sound("click");this.DrawOverlay()
this.curSeg=-1;if(this.curTool==5){this.selectedItems=[];if(this.segs.length>0){var s=this.segs.length-1;this.AddSelect(-1,s,false);this.DrawMenu(this.segs[s].type);}
$("#shivaDrawDiv").css("cursor","auto");this.DrawWireframes(false);}
else if(this.curTool!=-1)
this.DrawMenu();}
SHIVA_Draw.prototype.onMouseUp=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return true;if(shivaLib.dr.curTool==5)
e.stopPropagation();shivaLib.dr.leftClick=false;var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;if(e.shiftKey){if(Math.abs(x-shivaLib.dr.lastX)>Math.abs(y-shivaLib.dr.lastY))
y=shivaLib.dr.lastY;else
x=shivaLib.dr.lastX;}
if(shivaLib.dr.closeOnMouseUp){shivaLib.dr.closeOnMouseUp=false;shivaLib.dr.curSeg=-1;return true;}
if(shivaLib.dr.curTool<5){if(shivaLib.dr.snap)
x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);if((shivaLib.dr.curTool)&&(e.target.id.indexOf("shtx")==-1))
shivaLib.dr.AddDot(x,y,true);}
else if(shivaLib.dr.curTool>4)
shivaLib.dr.AddSelect(x,y,e.shiftKey);return(shivaLib.dr.curTool==6);}
SHIVA_Draw.prototype.onMouseDown=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if(shivaLib.dr.curTool==6)
return true;var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;shivaLib.dr.leftClick=true;shivaLib.dr.closeOnMouseUp=false;if(shivaLib.dr.snap)
x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);if(shivaLib.dr.curTool==5){shivaLib.dr.lastX=x;shivaLib.dr.lastY=y;e.stopPropagation();return false;}
if(e.target.id.indexOf("shtx")!=-1)
return;if(shivaLib.dr.snap)
x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);shivaLib.dr.AddDot(x,y,false);return false;}
SHIVA_Draw.prototype.onMouseMove=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if((shivaLib.dr.curTool==6)||(shivaLib.dr.curTool==-1))
return;var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;if(shivaLib.dr.snap)
x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);if((shivaLib.dr.leftClick)&&(shivaLib.dr.curTool==5)){var dx=shivaLib.dr.lastX-x;var dy=shivaLib.dr.lastY-y;shivaLib.dr.MoveSegs(dx,dy,0);shivaLib.dr.lastX=x;shivaLib.dr.lastY=y;return;}
if(shivaLib.dr.curSeg!=-1){if(shivaLib.dr.curTool!=5)
shivaLib.dr.DrawOverlay();if(e.shiftKey){if(Math.abs(x-shivaLib.dr.lastX)>Math.abs(y-shivaLib.dr.lastY))
y=shivaLib.dr.lastY;else
x=shivaLib.dr.lastX;}
if(shivaLib.dr.curTool==0)
shivaLib.g.DrawLine(shivaLib.dr.ctx,"#000",1,shivaLib.dr.lastX,shivaLib.dr.lastY,x,y,1);else if((shivaLib.dr.leftClick)&&(shivaLib.dr.curTool==1))
shivaLib.g.DrawCircle(shivaLib.dr.ctx,-1,1,shivaLib.dr.lastX,shivaLib.dr.lastY,Math.abs(x-shivaLib.dr.lastX),"#999",1);else if((shivaLib.dr.leftClick)&&(shivaLib.dr.curTool<5))
shivaLib.g.DrawBar(shivaLib.dr.ctx,-1,1,shivaLib.dr.lastX,shivaLib.dr.lastY,x,y,"#999",1);if((shivaLib.dr.leftClick)&&(shivaLib.dr.curTool==0)){if(new Date().getTime()-shivaLib.dr.lastDotTime>100){shivaLib.dr.AddDot(x,y);shivaLib.dr.closeOnMouseUp=true;}}}}
SHIVA_Draw.prototype.isTouchDevice=function()
{var el=document.createElement('div');el.setAttribute('ongesturestart','return;');if(typeof el.ongesturestart=="function")
return true;else
return false;}
SHIVA_Draw.prototype.onKeyDown=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if((e.keyCode==8)&&(e.target.tagName!="TEXTAREA")&&(e.target.tagName!="INPUT")){e.stopPropagation();return false;}}
SHIVA_Draw.prototype.onKeyUp=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if((e.which==83)&&(e.ctrlKey)&&(e.altKey)){shivaLib.SaveData("eStore");return;}
var i;if((e.target.tagName=="TEXTAREA")||(e.target.tagName=="INPUT"))
return;if((e.which==67)&&(e.ctrlKey)){if(shivaLib.dr.selectedItems.length){shivaLib.Sound("click");shivaLib.dr.clipboard=[];}
for(i=0;i<shivaLib.dr.selectedItems.length;++i)
shivaLib.dr.clipboard.push(shivaLib.Clone(shivaLib.dr.segs[shivaLib.dr.selectedItems[i]]));}
if((e.which==86)&&(e.ctrlKey)){if(shivaLib.dr.clipboard.length){shivaLib.dr.selectedItems=[];shivaLib.Sound("ding");for(i=0;i<shivaLib.dr.clipboard.length;++i){shivaLib.dr.selectedItems.push(shivaLib.dr.segs.length);shivaLib.dr.segs.push(shivaLib.Clone(shivaLib.dr.clipboard[i]));}}}
if(shivaLib.dr.curTool==6){num=shivaLib.dr.selectedItems[0];if(((e.which==8)||(e.which==46))&&(num!=-1))
shivaLib.dr.DeleteIdea();}
var num=shivaLib.dr.curSeg;if(((e.which==8)||(e.which==46))&&(num!=-1)){var o=shivaLib.dr.segs[num];o.x.pop();o.y.pop();shivaLib.dr.lastX=o.x[o.x.length-1];shivaLib.dr.lastY=o.y[o.y.length-1];shivaLib.dr.DrawOverlay();shivaLib.Sound("delete");}
if((e.which==27)&&(num!=-1)){shivaLib.dr.curSeg=-1;shivaLib.Sound("dclick");}
else if(shivaLib.dr.curTool==5){if((e.which==8)||(e.which==46)){if(shivaLib.dr.selectedItems.length){num=shivaLib.dr.selectedItems[0];if((shivaLib.dr.selectedDot!=-1)&&(shivaLib.dr.segs[num].type==0)){shivaLib.dr.segs[num].x.splice(shivaLib.dr.selectedDot,1);shivaLib.dr.segs[num].y.splice(shivaLib.dr.selectedDot,1);}
else if(e.target.id.indexOf("shtx")==-1)
for(var i=0;i<shivaLib.dr.selectedItems.length;++i){$("#shtx"+shivaLib.dr.selectedItems[i]).remove();$("#shim"+shivaLib.dr.selectedItems[i]).remove();shivaLib.dr.segs.splice(shivaLib.dr.selectedItems[i],1);}
shivaLib.dr.DrawOverlay();shivaLib.dr.DrawWireframes(false);shivaLib.Sound("delete");}}
else if((e.which==40)&&(e.shiftKey))shivaLib.dr.MoveSegs(0,0,-1);else if((e.which==38)&&(e.shiftKey))shivaLib.dr.MoveSegs(0,0,1);else if(e.which==39)shivaLib.dr.MoveSegs(-1,0,0);else if(e.which==37)shivaLib.dr.MoveSegs(1,0,0);else if(e.which==40)shivaLib.dr.MoveSegs(0,-1,0);else if(e.which==38)shivaLib.dr.MoveSegs(0,1,0);}}
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
shivaLib.Sound("dclick");}
else{$("#shivaDrawDiv").css("cursor","move");shivaLib.Sound("click");}
this.selectedItems.push(seg);this.alpha=o.alpha;this.startTime=o.s;this.endTime=o.e;this.curve=o.curve;if(o.type<3){this.arrow=o.arrow;this.curve=o.curve;this.color=o.color;this.edgeColor=o.edgeColor;this.edgeWidth=o.edgeWidth;}
else if(o.type==3){this.curve=o.curve;this.textColor=o.textColor;this.boxColor=o.boxColor;this.textSize=o.textSize;this.textAlign=o.textAlign;}
else if(o.type==4){o=this.segs[seg];asp=$("#shimi"+seg).height()/$("#shimi"+seg).width();if(!asp)asp=1;if(!isNaN(asp))
o.y[1]=o.y[0]+(Math.abs(o.x[1]-o.x[0])*asp);this.edgeColor=o.edgeColor;this.edgeWidth=o.edgeWidth;this.DrawOverlay();}
this.DrawMenu(o.type);this.SetMenuProperties();}
this.DrawWireframes(false);}
SHIVA_Draw.prototype.MoveSegs=function(dx,dy,dz)
{var i,j,o,oo;for(i=0;i<this.selectedItems.length;++i){o=this.segs[this.selectedItems[i]];if(o.type==5)
continue;if(dz){if((this.selectedItems[i]+dz<0)||(this.selectedItems[i]+dz>=this.segs.length)){shivaLib.Sound("delete");continue;}
oo=this.segs[this.selectedItems[i]+dz];this.segs[this.selectedItems[i]+dz]=o;this.segs[this.selectedItems[i]]=oo;this.selectedItems[i]+=dz;shivaLib.Sound("click");}
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
if(shivaLib.player)
o.s=this.startTime,o.e=this.endTime;num=this.selectedItems[0]=this.segs.length;;this.segs.push(o);shivaLib.Sound("ding");this.DrawOverlay();}
SHIVA_Draw.prototype.HighlightIdea=function()
{var i,dd;$("#shivaIdeaAddBut").remove();for(i=0;i<this.segs.length;++i){var wid=1;dd="#shivaIdea"+i;if(this.segs[i].ideaEdgeCol==-1)
$(dd).css("border","none");else
$(dd).css("border",wid+"px solid "+this.segs[i].ideaEdgeCol);}
if(this.selectedItems.length){dd="#shivaIdea"+this.selectedItems[0];$(dd).css("border","1px dashed red");var x=$(dd).width()/2;var y=$(dd).height();var str="<div id='shivaIdeaAddBut' style='position:absolute;top:"+y+"px;left:"+x+"px'><img src='adddot.gif' title='Add child idea' onmouseup='shivaLib.dr.AddIdea(0)'></div>"
$(dd).append(str);}}
SHIVA_Draw.prototype.DeleteIdea=function()
{if(!this.selectedItems.length)
return;num=this.selectedItems[0];if(this.segs[num].ideaParent!=-1){shivaLib.Sound("click");this.segs[num].ideaParent=-1;}
else{this.selectedItems=[];$("#shivaIdea"+num).remove();this.segs.splice(num,1);this.DeleteIdeaChildren(num);shivaLib.Sound("delete");}
this.DrawOverlay();}
SHIVA_Draw.prototype.DeleteIdeaChildren=function(parent)
{var i;for(i=0;i<this.segs.length;++i){if(this.segs[i].type!=5)
continue;if(this.segs[i].ideaParent==parent){var id=this.segs[i].id;$("#shivaIdea"+id).remove();this.segs.splice(i,1);this.DeleteIdeaChildren(id);this.DeleteIdeaChildren(parent);break;}}}
SHIVA_Draw.prototype.MoveIdeaChildren=function(parent,dx,dy)
{var i;for(i=0;i<this.segs.length;++i){if(this.segs[i].type!=5)
continue;if(this.segs[i].ideaParent==parent){this.segs[i].ideaLeft=Number(this.segs[i].ideaLeft)+Number(dx);this.segs[i].ideaTop=Number(this.segs[i].ideaTop)+Number(dy);$("#shivaIdea"+i).css("left",this.segs[i].ideaLeft+"px").css("top",this.segs[i].ideaTop+"px");this.MoveIdeaChildren(i,dx,dy);}}}
SHIVA_Draw.prototype.IdeaDrop=function(from,to)
{this.segs[from].ideaParent=to;shivaLib.Sound("ding");}
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