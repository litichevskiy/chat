(function(PubSub){

	var blockMessage = new BlockMessage($('div[data-role="block_message_content"]'));

	function getTime(){
		return (new Date).toDateString();
	}

	var input = $('textarea'),
		ROOM = 'room_1',
		CONNECTION_INTERVAL = 500,
		text,
		main,
		user = $('input[data-role="name');
		data = {},
		data.room = ROOM,
		QUANTITY = 3,
		$('input[data-role="room"]').val( ROOM );

	function Main ( PubSub ) {

		PubSub.call(this);
	};

	Main.prototype = Object.create( PubSub.prototype );

	main = new Main(PubSub);

	main.subscribe('addMessage', blockMessage.addMessage.bind(blockMessage) );
	main.subscribe('createMessage', serverStorage.createMessage );

	serverStorage.getMessage({

			quantity : QUANTITY,
			room     : ROOM,
			fromId   : '2'

		}, blockMessage.addMessages.bind( blockMessage ) )

	socket
		.on('connect'   , function(){
			console.log('connect')})

		.on('disconnect', function(){
			console.log('disconnect');

			setTimeout( reconnect, CONNECTION_INTERVAL )
		})
		.on('message'   , function( message ){
			data.time = getTime();
			data.content = message;
			data.user = user.val();
			debugger;
			main.publish('addMessage', data );
		})

	function reconnect() {
		socket.once('error', function(){
			setTimeout( reconnect, CONNECTION_INTERVAL );
		});
		socket.socket.connect();
	};


	$('button[data-name="postMessage"]').click(function(event) {
		text = input.val();

		socket.emit('message', text, function( message ){

			data.time = getTime();
			data.content = message;
			data.user = user.val();

			main.publish('addMessage', data );
			main.publish('createMessage', data );
		});

		input.val('');
	});

})(PubSub);
