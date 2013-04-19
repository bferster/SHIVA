CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
	    { name: 'clipboard',   groups: [ 'undo' ] },
	    { name: 'editing',     groups: [ 'spellchecker' ] },
	    { name: 'links' },
	    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
	    { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
	    { name: 'colors' },
	 	];	
	config.removeButtons = 'Anchor,Strike,Underline,Subscript,Superscript,Flash,Smiley,Mazimize,Print,Paste,PasteText,Cut,Copy,Iframe,Save,Blocks,CreateDiv,PageBreak';
	config.removeDialogTabs = 'image:advanced;link:advanced';
};
