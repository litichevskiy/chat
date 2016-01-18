module.exports = function(server, pubsub){

	var io = require('socket.io').listen(server);
		// io.set('origins','');

	pubsub.subscribe('userOnline',function( userName ) {
		io.emit( 'join', userName );
	});

	pubsub.subscribe('newMessage',function( message ) {
		io.emit( 'message', message );
	});

	pubsub.subscribe('emitUserDisconnect',function( userName ) {
		io.emit( 'leave', userName );
	});

	io.sockets.on('connection', function (socket) {

		pubsub.publish('userConnect', socket.request)

	    socket.on('message', function (text, callback) {
	        socket.broadcast.emit('message',text);
	        callback(text);
	    });

	    socket.on('disconnect',function() {

	    	pubsub.publish('userDisconnect', socket.request ) 
	    })
	});
}