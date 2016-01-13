(function( PubSub, blockMessageContentInit, serverAPI, socketInit, blockMessagePostInit ){

    var USER     = login,
        ROOM     = 'room_1',
        pubsub   = new PubSub;


    $.when(
        blockMessageContentInit( ROOM ),
        socketInit({ pubsub : pubsub, io : io })
    )
    .then(function( BlockMessage, socket ){

        blockMessagePostInit(
            pubsub,
            $('[data-role="block_message"]')[0],
            socket, ROOM, USER
        )

        var blockMessageContent = new BlockMessage(
                $('div[data-role="block_message_content"]')[0],
                pubsub
            );

        serverAPI.getMessage({
            room     : ROOM,
            fromId   : undefined
        })
        .then(function( res ){
            blockMessageContent.addMessages( res );
            blockMessageContent.scrollInBottom();
        })
        .fail(function(err){
            console.log( err );
        })


        blockMessageContent.pubsub.subscribe('addMessage',
            blockMessageContent.addMessage.bind(blockMessageContent)
        );
        blockMessageContent.pubsub.subscribe('newMessage',
            blockMessageContent.addMessage.bind(blockMessageContent)
        );

        pubsub.subscribe('addMessage', function( data ) {
            serverAPI.createMessage(data);
        });


        $('[data-role="exit"]').click(function(event) {

            window.location = '/login';
            serverAPI.clearCookie()
        });

    })
    .fail(function(err){
        console.log( err );
    })

})( PubSub, blockMessageContentInit, serverAPI, socketInit, blockMessagePostInit );
