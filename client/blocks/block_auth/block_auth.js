(function(exports) {

	var log = $('input[name="login"]'),
		passw = $('input[data-name="passsword"]'),
		message_to_user = $('[data-role="info"]'),
		OK = 'success',
		TEXT_MESSAGE = 'НАС О ВАС НЕ ПРЕДУПРЕДИЛИ АВТОРИЗИРУЙТЕСЬ',
		USER_ALREADY_EXISTS = 'user already exists',
		USER_EXISTS = 403;

	function clearInput( int ) {
		$(int).each(function(index, el) {
			el.val('')
		});
	};

	function clear() {
		setTimeout(function(){
			clearInput([log,passw])
			$(message_to_user).html('');
		},3000);
	};

	function checkResponse( res ) {

		if( res.result === OK ) {

		 	window.location = '/';

		} else {

			if ( res.status === USER_EXISTS ) {

				$(message_to_user).html( USER_ALREADY_EXISTS );
				clear();

			} else {

				$(message_to_user).html( TEXT_MESSAGE );
				clear();
			}
		}
	};

	exports.checkResponse = checkResponse;

})(window);


$('button[data-name="openChat"]').click(function(event) {
	event.preventDefault();

	$.when(

		serverAPI.getUser({

			login    : $('input[name="login"]').val(),
			password : $('input[data-name="passsword"]').val()

		})
	)
	.then(function(res){
		checkResponse( res );
	})
	.fail(function(err){
		console.log(err);
	});
});


$('button[data-name="newUser"]').click(function(event) {
	event.preventDefault();

	$.when(

		serverAPI.createUser({

			login    : $('input[name="login"]').val(),
			password : $('input[data-name="passsword"]').val()

		})
	)
	.then(function(res){
		checkResponse( res );
	})
	.fail(function(err){
		console.log(err);
	});
});