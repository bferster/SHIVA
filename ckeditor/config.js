CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
	    { name: 'links' },
	    { name: 'styles'},
	    { name: 'colors' },
 		{ name: 'basicstyles', groups: [ 'basicstyles' ] },
	    { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
   		{ name: 'others'},
	 	];	
	config.removeButtons='Styles,Format,Anchor,Strike,Underline,Subscript,Superscript,Flash,Smiley,Mazimize,PasteText,Iframe,Save,Blocks,CreateDiv,PageBreak';
	config.removeDialogTabs='image:advanced;link:advanced';
	config.removePlugins='elementspath,resize,pastefromword';
	config.toolbarCanCollapse=true;
};
