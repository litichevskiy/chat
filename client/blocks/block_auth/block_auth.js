(function(exports) {

	var log = $('input[name="login"]'),
		button = $('button[data-name="openChat"]'),
		OK = 'success',
		htmlElement = $('body')[0];

	function clearInput( int ) {
		$(int).each(function(index, el) {
			el.val('')
		});
	};


	function checkResponse( res ) {

		if( res.result === OK ) {

			$.ajax({url:'/page/chat', type:'get' })
		 	.then( function(res){

		 		$(htmlElement).html( res );
		 	})
		 	.then(function(res){

				$('input[data-role="name"]').val( $(log).val() );
		 		clearInput( [ log ] );

		 	})
		 	.fail( function(err)  {
		 		console.log( err )
		 	})

		} else {

			$(htmlElement).append('<h2 class="text-warning text-center">"'
				+res.statusText+'"</h2>');

			setTimeout(function(){
				window.location = '/';
			},2000);
		}

	};

	exports.checkResponse = checkResponse;

})(window);


$('button[data-name="openChat"]').click(function(event) {
	event.preventDefault();

	serverStorage.getUser({

			login    : $('input[name="login"]').val(),
			password : $('input[data-name="passsword"]').val()

		}, checkResponse );
});


$('button[data-name="newUser"]').click(function(event) {
	event.preventDefault();

	serverStorage.createUser({

			login    : $('input[name="login"]').val(),
			password : $('input[data-name="passsword"]').val()

		}, checkResponse );
});