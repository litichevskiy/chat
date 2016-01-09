(function( PubSub, BlockMessageInit, mediatorServerApi, socket ){

    var REGEXP_TIME = /.+?:\d\d\b/,
        ROOM = 'room_1',
        CONNECTION_INTERVAL = 500,
        QUANTITY = 5,
        MAX_LEHGTH_MESSAGE = 500,
        USER = login,
        KEYDOWN_ENTER = 13,
        input = $('textarea'),
        text,
        managerBlocks,
        resCheck;



    $.when( BlockMessageInit() )
    .then(function( BlockMessage ){

        $('textarea[data-role="message"]').keydown(function(event) {

            inputText = $(input).val().length;

            if ( event.keyCode === KEYDOWN_ENTER && inputText > 0 ) {
                return postMessage();
            }
        });

        $('div[data-role="block_message_content"]').scroll(function(){

            if (this.scrollTop === 0 ) {
                return loadHistoryMessage();
            }
        });

        var blockMessage = new BlockMessage($('div[data-role="block_message_content"]')[0]);

        mediatorServerApi.getMessage({

            quantity : QUANTITY,
            room     : ROOM,
            fromId   : undefined

        }, blockMessage.addMessages.bind(blockMessage) );



        function getTime(){
            return ( new Date().toString() ).match( REGEXP_TIME ).join();
        };

        function ManagerBlocks ( PubSub ) {

            this.channel = new PubSub;
        };


        managerBlocks = new ManagerBlocks(PubSub);

        managerBlocks.channel.subscribe('addMessage', function( data ) {

            blockMessage.addMessage(data);
            mediatorServerApi.createMessage(data);
        });
        managerBlocks.channel.subscribe('newMessage',function( data ) {
            blockMessage.addMessage(data);
        });


        socket
        .on('connect', function(){
            console.log('connect')
        })
        .on('disconnect', function(){
            console.log('disconnect');

            setTimeout( reconnect, CONNECTION_INTERVAL )
        })
        .on('message', function( useData ) {

            managerBlocks.channel.publish('newMessage', {

                content : useData.text,
                time    : getTime(),
                user    : useData.user,
                room    : ROOM
            });
        })

        function reconnect() {
            socket.once('error', function(){
                setTimeout( reconnect, CONNECTION_INTERVAL );
            });
            socket.socket.connect();
        };

        function postMessage (){

            if ( ( input.val() ).length > MAX_LEHGTH_MESSAGE ) {

                return errorLengthMessage( MAX_LEHGTH_MESSAGE );
            };

            socket.emit('message', {

                text : input.val(),
                user : USER
            }, function( message ){

                    managerBlocks.channel.publish('addMessage', {
                        content : message.text,
                        time    : getTime(),
                        user    : message.user,
                        room    : ROOM
                    });
                });

            input.val('');
            input.focus();
        };

        function loadHistoryMessage ( ) {

            var fromId = Number( $('li[data-id_message]:first')[0]
                .dataset.id_message ) -QUANTITY;

            resCheck = checkFromId( fromId, QUANTITY  );

            mediatorServerApi.getMessage({

                quantity : resCheck.quantity,
                room     : ROOM,
                fromId   : resCheck.fromId

            }, blockMessage.addMessages.bind( blockMessage ) )

        };

        $('[data-role="exit"]').click(function(event) {

            window.location = '/login';
            mediatorServerApi.clearCookie()
        });

        $('[data-name="postMessage"]').click(function(event) {
            postMessage();
        });

        function errorLengthMessage ( text ) {
            var message = $('.warning-message').html(

                    'WARNING: max length message ' + text + ' simbol'
                );
                setTimeout(function(){
                    $(message).html('');
                }, 3000)
        };

        function checkFromId( fromId, QUANTITY ) {

            if ( fromId <= 0 ) {
                loadHistoryMessage = '';

                QUANTITY = Number( $('li[data-id_message]:first')[0]
                    .dataset.id_message
                ) -1;
                fromId = 0;

                return {
                    fromId : fromId,
                    quantity : QUANTITY
                };
            }
            return {
                    fromId : fromId,
                    quantity : QUANTITY
                };
        };
    })
    .fail(function(err){
        console.log( err );
    })

})(PubSub, BlockMessageInit, mediatorServerApi, socket);