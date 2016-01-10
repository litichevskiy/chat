(function( exports ){

    socketInit = function( o ) {

        var io = o.io,
            pubsub = o.pubsub,
            CONNECTION_INTERVAL = 500;

        var socket = io.connect('',{
            reconnect : false
        });


        function reconnect() {
            socket.once('error', function(){
                setTimeout( reconnect, CONNECTION_INTERVAL );
            });
            socket.socket.connect();
        };


        socket
        .on('connect', function(){
            console.log('connect')
        })
        .on('disconnect', function(){
            console.log('disconnect');

            setTimeout( reconnect, CONNECTION_INTERVAL )
        })
        .on('message', function( useData ) {

            pubsub.publish('newMessage', {

                content : useData.text,
                time    : useData.time,
                user    : useData.user,
                room    : useData.room
            });
        });

        return socket;

    };

    exports.socketInit = socketInit;

})( window );