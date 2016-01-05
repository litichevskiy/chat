module.exports = function(server){

	var io = require('socket.io').listen(server);
		io.set('origins','localhost:3000');

	io.sockets.on('connection', function (socket) {
		// console.log(socket.handshake)
	    socket.on('message', function (text, callback) {
	        socket.broadcast.emit('message',text);
	        callback(text); //text
	    });
	});
}