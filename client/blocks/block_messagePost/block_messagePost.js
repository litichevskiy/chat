(function( exports ){

    const
        REGEXP_TIME        = /.+?:\d\d\b/,
        REGEXP_CHECK_EMPTY_STRING = /^[\t\s\n\r]+$/,
        SEARCH_NEW_LINE =/[\n\r]/g,
        KEYDOWN_ENTER      = 13,
        MAX_LEHGTH_MESSAGE = 1000,
        MAX_ROWS_TEXTAREA  = 10;

    function blockMessagePostInit ( pubsub, container, socket, room, user, replaceHeightBlockMessages, Firefox ) {

        var textarea  = $('textarea'),
            socket = socket,
            ROOM   = room,
            USER   = user,
            FIREFOX = Firefox,
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

            if ( event.shiftKey === false && event.keyCode === KEYDOWN_ENTER ) {
                return postMessage();
            }

            if ( event.keyCode === 8 && $(this).val().length === 0 ) {

                clearTextEara();

                if ( FIREFOX ) {

                    replaceHeightBlockMessages();
                }
                return;
            }
        });

        $(textarea).keydown(function(event) {

            if ( event.shiftKey === true && event.keyCode === KEYDOWN_ENTER ) {

                if ( FIREFOX ) {
                    replaceHeightBlockMessages();
                }

                if ( this.rows > MAX_ROWS_TEXTAREA )return event.preventDefault();
            }
        });


        $(textarea)[0].oninput = function ( event ) {
            var rows;

            rows = ( $(this).val() ).match( SEARCH_NEW_LINE );

           if (  !rows  ) return;

            if ( rows.length <= MAX_ROWS_TEXTAREA ) this.rows = rows.length+1;
            else this.rows = rows.length+1;
        };

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