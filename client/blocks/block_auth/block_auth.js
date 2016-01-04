(function() {

	var log = $('input[name="login"]'),
		passw = $('.password'),
		button = $('.authorized'),
		UNAUTHORIZED = 401,
		QUANTITY = 10,
		OK = 'success',
		htmlElement = $('html');///////////////////////

	function clearInput( int ) {
		$(int).each(function(index, el) {
			el.val('')
		});
	};


	function checkResponse( res ) {

		if( res.result === OK ){

			serverStorage.getMainPage( htmlElement );
		 	clearInput( [ log, passw ] );
		 	return;
		}
		if ( res.status === UNAUTHORIZED ) {

			serverStorage.createUser({
				login    : log.val(),
				password : passw.val()
			}, checkResponse )

			clearInput( [ log, passw ] );
			return;
		}

	};

	return button.click(function(event) {
		event.preventDefault();

		serverStorage.getUser({

			login    : log.val(),
			password : passw.val()

		}, checkResponse );

	});

})();

$('.openChat').click(function(event) {
	var htmlElement = $('html');

	$.ajax({url:'/page/login', type:'get' })
	.then(function(res){

		htmlElement.html( res );
	})
	.fail(function(err){console.log(err)})
});