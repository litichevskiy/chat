(function(exports){

	var TIME = 10,
	 	form = $('form[role="form"]'),
		input = $('textarea'),
		list = $('.list-unstyled.list_message');


	socket
	.on('connect'   , function(){console.log('connect')})
	.on('disconnect', function(){
		console.log('disconnect');
		setTimeout( reconnect, TIME )
	})
	.on('message'   , function( message ){
		printMessage( message );
	})

	function reconnect() {
		socket.once('error', function(){
			setTimeout( reconnect, TIME );
		});
		socket.socket.connect();
	};

	function printMessage( message ) {
		$('<li>', { text : message }).appendTo(list);
	};

	return form.submit(function(event) {
		event.preventDefault()
		var text = input.val();
			input.val('');

		socket.emit('message', text, function( message ){
			console.log( message );
			printMessage( message );
		});
			return false;
	});

})(window);