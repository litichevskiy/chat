(function(PubSub){

	var blockMessage = new BlockMessage($('div[data-role="block_message_content"]'));

	function getTime(){
		return (new Date).toDateString();
	};


	var input = $('textarea'),
		ROOM = 'room_1',
		CONNECTION_INTERVAL = 500,
		text,
		managerBlocks,
		user = $('input[data-role="name');
		data = {},
		data.room = ROOM,
		QUANTITY = 3,
		$('input[data-role="room"]').val( ROOM );

	function ManagerBlocks ( PubSub ) {

		PubSub.call(this);
	};

	ManagerBlocks.prototype = Object.create( PubSub.prototype );

	managerBlocks = new ManagerBlocks(PubSub);

	managerBlocks.subscribe('addMessage', function( data ) {

		blockMessage.addMessage(data);
		mediatorServerApi.createMessage(data);
	});
	managerBlocks.subscribe('newMessage',function( data ) {
		blockMessage.addMessage(data);
	});

	mediatorServerApi.getMessage({

			quantity : QUANTITY,
			room     : ROOM,
			fromId   : 5

		}, blockMessage.addMessages.bind( blockMessage ) );

	socket
		.on('connect'   , function(){
			console.log('connect')})

		.on('disconnect', function(){
			console.log('disconnect');

			setTimeout( reconnect, CONNECTION_INTERVAL )
		})
		.on('message'   , function( useData ) {

			data.content = useData.text;
			data.time 	 = getTime();
			data.user    = useData.user;

			managerBlocks.publish('newMessage', data );
		})

	function reconnect() {
		socket.once('error', function(){
			setTimeout( reconnect, CONNECTION_INTERVAL );
		});
		socket.socket.connect();
	};


	$('button[data-name="postMessage"]').click(function(event) {

		data.time = getTime();
		data.content = input.val();
		data.user = user.val();

		socket.emit('message', {

			text : input.val(),
			user : user.val()
		}, function( message ){

				managerBlocks.publish('addMessage', data );

			});

		input.val('');
	});

	$('button[data-role="add message"]').click(function(event) {

		mediatorServerApi.getMessage({

			quantity : QUANTITY,
			room     : ROOM,
			fromId   : 5

		}, blockMessage.addMessages.bind( blockMessage ) )

	});

	$('[data-role="exit"]').click(function(event) {

		window.location = '/';
		mediatorServerApi.clearCookie()
	});

})(PubSub);