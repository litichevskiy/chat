// (function(exports){

// 	(function(){
// 		$.get('/views/renderSocket.jade')
// 		.then(function( template ){

// 			render = jade.compile( template )
// 		})
// 		.fail(function(err){console.log(err)})
// 	})();

// 	var TIME = 10,
// 	 	form = $('form[role="form"]'),
// 		input = $('textarea'),
// 		list = $('.list-unstyled.list_message'),
// 		USER_NAME = $('input[data-role="name"]'),
// 		render;


// 	socket
// 	.on('connect'   , function(){console.log('connect')})
// 	.on('disconnect', function(){
// 		console.log('disconnect');
// 		setTimeout( reconnect, TIME )
// 	})
// 	.on('message'   , function( message ){
// 		debugger;
// 		printMessage( message );
// 	})

// 	function reconnect() {
// 		socket.once('error', function(){
// 			setTimeout( reconnect, TIME );
// 		});
// 		socket.socket.connect();
// 	};

// 	function printMessage( message ) {

// 		var html = $(list).html();
// 			html += render({
// 				id      : '',
// 				name    : USER_NAME.val(),
// 				content : message,
// 				time    : new Date().toString().split('').slice(0, 21).join('')////////
// 		});

// 		$(list).html( html );
// 	};

// 	return $('button[data-name="postMessage"]').click(function(event) {
// 		debugger;
// 		event.preventDefault()
// 		var text = input.val();
// 			input.val('');

// 		socket.emit('message', text, function( message ){
// 			debugger;
// 			console.log( message );
// 			printMessage( message );
// 		});
// 			return false;
// 	});

// })(window);