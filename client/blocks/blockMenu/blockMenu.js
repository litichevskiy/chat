(function(){

	var settings = $('.settings'),
		block_users = $('.column[data-role="block_users"]'),
		blockSettings = $('.blockSettings'),
		openCloseBlockTheme = $('.openCloseBlockTheme'),
		listTheme = $('.listTheme'),
		applayTheme = $('.applayTheme'),
		textarea = $('input[data-role="themeUser"]');


	$(settings).click(function(event) {
		$(block_users).fadeToggle('slow');
		$(blockSettings).fadeToggle('slow');
	});


	$(openCloseBlockTheme).click(function(event) {
		$('.selectThemes').slideToggle('fast')
	});


	$(listTheme).click(function(event) {
		var link = event.target.dataset.linktocss;
		if ( !$(event.target).hasClass('theme') ) return;
		else window.location = '/settings/theme?url=' + link;
	});


	$(applayTheme).click(function(event) {
		var link = $(textarea).val();
		window.location = '/settings/theme?url=' + encodeURIComponent( link );
	});


})();