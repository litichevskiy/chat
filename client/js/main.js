(function( PubSub, init, mediatorServerApi ){

    var REGEXP_TIME = /.+?:\d\d\b/,
        ROOM = 'room_1',
        CONNECTION_INTERVAL = 500,
        QUANTITY = 5,
        MAX_LEHGTH_MESSAGE = 500,
        USER = login,
        input = $('textarea'),
        text,
        managerBlocks,
        resCheck;


    var blockMessage = new BlockMessage($('div[data-role="block_message_content"]')[0]);

    $.when( init() )
    .then(function(){

        mediatorServerApi.getMessage({

            quantity : QUANTITY,
            room     : ROOM,
            fromId   : undefined

        }, blockMessage.addMessages.bind(blockMessage) );
    })
    .fail(function(err){
        console.log( err );
    })



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


    $('button[data-name="postMessage"]').click(function(event) {

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
    });

    $('button[data-role="add message"]').click(function(event) {

        var fromId = Number( $('li[data-id_message]:first')[0]
            .dataset.id_message ) -QUANTITY;

        resCheck = checkFromId( fromId, QUANTITY  );

        mediatorServerApi.getMessage({

            quantity : resCheck.quantity,
            room     : ROOM,
            fromId   : resCheck.fromId

        }, blockMessage.addMessages.bind( blockMessage ) )

    });

    $('[data-role="exit"]').click(function(event) {

        window.location = '/login';
        mediatorServerApi.clearCookie()
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

            $('button[data-role="add message"]').hide();
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

})(PubSub, init, mediatorServerApi);