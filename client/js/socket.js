(function(exports){
	var socket = io.connect('http://localhost:3000',{
		reconnect : false
	});

  	socket.on('message', function (data) {
    	console.log(data);

  	});

  	window.socket = socket;

})(window);