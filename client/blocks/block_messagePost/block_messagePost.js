(function( exports ){

    const
        REGEXP_TIME        = /.+?:\d\d\b/,
        REGEXP_CHECK_EMPTY_STRING = /^[\t\s\n\r]+$/,
        KEYDOWN_ENTER      = 13,
        MAX_LEHGTH_MESSAGE = 500;

    function blockMessagePostInit ( pubsub, container, socket, room, user ) {

        var input  = $('textarea'),
            socket = socket,
            ROOM   = room,
            USER   = user;

            blockMessagePost = new BlockMessagePost( pubsub, container );

        function BlockMessagePost( pubsub, container ){

            this.pubsub = pubsub;
            this.container = container;
        };

        function getTime(){
            return ( new Date().toString() ).match( REGEXP_TIME ).join();
        };

        function postMessage (){

            var messageLength = $(input).val().length,
                message = $(input).val();

            if (    ( messageLength > MAX_LEHGTH_MESSAGE ) ||
                    ( messageLength === 0 ) ||
                    ( REGEXP_CHECK_EMPTY_STRING.test( message ) )
            ) {

                return errorLengthMessage( MAX_LEHGTH_MESSAGE );
            };

            socket.emit('message', {

                text : input.val(),
                time : getTime(),
                user : USER,
                room : ROOM
            }, function( message ){

                    blockMessagePost.pubsub.publish('addMessage', {
                        content : message.text,
                        time    : getTime(),
                        user    : message.user,
                        room    : ROOM
                    });
                });

            input.val('');
            input.focus();
        };

        function errorLengthMessage ( max ) {
            var message = $('.warning-message').html(

                    'WARNING: min 1 simbol, max ' + max + ' simbol'
                );
            setTimeout(function(){
                $(message).html('');
            }, 3000)
        };

        $('textarea[data-role="message"]').keyup(function(event) {

            if ( event.keyCode === KEYDOWN_ENTER ) {

                return postMessage();
            }
        });


        $('[data-name="postMessage"]').click(function(event) {

            postMessage();
        });

    };

    exports.blockMessagePostInit = blockMessagePostInit;

})( window );