(function( exports ){

    const
        REGEXP_TIME        = /.+?:\d\d\b/,
        REGEXP_CHECK_EMPTY_STRING = /^[\t\s\n\r]+$/,
        KEYDOWN_ENTER      = 13,
        MAX_LEHGTH_MESSAGE = 1000,
        MAX_ROWS_TEXTAREA  = 20;

    function blockMessagePostInit ( pubsub, container, socket, room, user ) {

        var textarea  = $('textarea'),
            socket = socket,
            ROOM   = room,
            USER   = user,
            post = $('[data-name="postMessage"]');

            blockMessagePost = new BlockMessagePost( pubsub, container );

        function BlockMessagePost( pubsub, container ){

            this.pubsub = pubsub;
            this.container = container;
        };

        // function getTime(){
        //     return ( new Date().toString() ).match( REGEXP_TIME ).join();
        // };

        function postMessage (){

            var messageLength = $(textarea).val().length,
                message = $(textarea).val();

            if (    ( messageLength > MAX_LEHGTH_MESSAGE ) ||
                    ( messageLength === 0 ) ||
                    ( REGEXP_CHECK_EMPTY_STRING.test( message ) )
            ) {

                return errorLengthMessage( MAX_LEHGTH_MESSAGE );
            };

            blockMessagePost.pubsub.publish('serverAPIcreateMessage', {  //'addMessage'
                content : message,
                time    : new Date(),
                user    : USER,
                room    : ROOM
            });

            clearTextEara();
            textarea.focus();
        };

        function errorLengthMessage ( max ) {
            var message = $('.warning-message').html(

                    'WARNING: min 1 simbol, max ' + max + ' simbol'
                );
            setTimeout(function(){
                $(message).html('');
            }, 3000)
        };

        $(textarea).keyup(function(event) {

            if ( event.ctrlKey === false && event.keyCode === KEYDOWN_ENTER ) {
                return postMessage();
            }

            if ( event.keyCode === 8 && $(this).val().length === 0 ) return clearTextEara();
        });

        $(textarea).keydown(function(event) {
            var val;

            if ( event.ctrlKey === true && event.keyCode === KEYDOWN_ENTER ) {
                val = $(this).val()
                $(this).val(val + '\n');
                this.scrollHeight;
                this.scrollTop = this.scrollHeight;

                if ( this.rows === MAX_ROWS_TEXTAREA )return
                    this.rows += 1;
            }
        });


        $(post).click(function(event) {

            postMessage();
        });

        function clearTextEara () {
            $(textarea).attr('rows', '1');
            $(textarea).val('');
        }

    };

    exports.blockMessagePostInit = blockMessagePostInit;

})( window );