(function(exports) {

	var log = $('input[name="login"]'),
		passw = $('input[data-name="passsword"]'),
		message_to_user = $('[data-role="info"]'),
		OK = 'success',
		TEXT_MESSAGE = 'НАС О ВАС НЕ ПРЕДУПРЕДИЛИ АВТОРИЗИРУЙТЕСЬ';

	function clearInput( int ) {
		$(int).each(function(index, el) {
			el.val('')
		});
	};

	function checkResponse( res ) {

		if( res.result === OK ) {

		 	window.location = '/';

		} else {

			$(message_to_user).html( TEXT_MESSAGE );

			setTimeout(function(){
				clearInput([log,passw])
				$(message_to_user).html('');
			},3000);
		}

	};

	exports.checkResponse = checkResponse;

})(window);


$('button[data-name="openChat"]').click(function(event) {
	event.preventDefault();

	mediatorServerApi.getUser({

			login    : $('input[name="login"]').val(),
			password : $('input[data-name="passsword"]').val()

		}, checkResponse );
});


$('button[data-name="newUser"]').click(function(event) {
	event.preventDefault();

	mediatorServerApi.createUser({

			login    : $('input[name="login"]').val(),
			password : $('input[data-name="passsword"]').val()

		}, checkResponse );
});