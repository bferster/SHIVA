///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB DATA
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.GetSpreadsheet=function(url, fields, query, ops, callback) 		//	GET GOOGLE DOCS SPREADSHEET
{
	var query=new google.visualization.Query(url);							
	query.send(handleQueryResponse);
 
    function handleQueryResponse(response) {
	    var i,j,o;
		var data=response.getDataTable();
		var cols=data.getNumberOfColumns();
		var rows=data.getNumberOfRows();
 		var keys=new Array();
		var theData=new Array();
		if (fields) {
			for (i=0;i<cols;++i) {
			 	if (!$.trim(data.getColumnLabel(i)))
			 		break;
				keys.push($.trim(data.getColumnLabel(i)));
				}
			for (i=0;i<rows;++i) {
				o={};
				for (j=0;j<keys.length;++j) 
					o[keys[j]]=data.getValue(i,j);
				theData.push(o);
	 			}
			}
		else{
			for (i=0;i<rows;++i) {
 				o=new Array()
				for (j=0;j<cols;++j) 
					o.push(data.getValue(i,j));
   				theData.push(o);
				}
			}
		callback(theData);
    	}
  }

