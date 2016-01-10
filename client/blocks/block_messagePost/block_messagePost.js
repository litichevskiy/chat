(function( exports ){

    const
        REGEXP_TIME        = /.+?:\d\d\b/,
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

            if ( ( input.val() ).length > MAX_LEHGTH_MESSAGE ) {

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

        function errorLengthMessage ( text ) {
            var message = $('.warning-message').html(

                    'WARNING: max length message ' + text + ' simbol'
                );
                setTimeout(function(){
                    $(message).html('');
                }, 3000)
        };

        $('textarea[data-role="message"]').keydown(function(event) {

            inputText = $(input).val().length;

            if ( event.keyCode === KEYDOWN_ENTER && inputText > 0 ) {

                return postMessage();
            }
        });


        $('[data-name="postMessage"]').click(function(event) {

            postMessage();
        });

    };

    exports.blockMessagePostInit = blockMessagePostInit;

})( window );