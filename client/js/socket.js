(function( exports ){

    socketInit = function( o ) {

        var io = o.io,
            pubsub = o.pubsub,
            CONNECTION_INTERVAL = 500,
            USER = login;

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
        .on('message', function( data ) {
            pubsub.publish('addNewMessage', { 

                content : data.content,
                time    : data.time,
                user    : data.user,
                room    : data.room,
                id      : data.id
            });
        })
        .on('leave', function( userName ){
            pubsub.publish('userOffline', userName );
            console.log( 'OFLINE: ',userName );
        })
        .on('join', function( userName ) {

            if ( userName === USER ) return;

            pubsub.publish('userOnline', { 
                name   : userName,
                status : true,
                id     : userName
            });
            console.log( 'ONLINE: ', userName ); 
        });

        return socket;

    };

    exports.socketInit = socketInit;

})( window );