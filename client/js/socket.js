(function(exports){
	var socket = io.connect('',{
		reconnect : false
	});

  	socket.on('message', function (data) {
    	console.log(data);

  	});

  	window.socket = socket;

})(window);