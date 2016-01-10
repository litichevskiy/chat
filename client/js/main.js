(function( PubSub, BlockMessageContentInit, serverAPI, socketInit, blockMessagePostInit ){

    var USER     = login,
        QUANTITY = 20,
        ROOM     = 'room_1',
        pubsub   = new PubSub;


    $.when(

        BlockMessageContentInit( QUANTITY, ROOM ),
        socketInit({ pubsub : pubsub, io : io })
    )
    .then(function( BlockMessage, socket ){

        blockMessagePostInit(
            pubsub,
            $('[data-role="block_message"]')[0],
            socket, ROOM, USER
        )

        var BlockMessageContent = new BlockMessage(
                $('div[data-role="block_message_content"]')[0],
                pubsub
            );

        $.when(

            serverAPI.getMessage({
                quantity : QUANTITY,
                room     : ROOM,
                fromId   : undefined

            })
        )
        .then(function( res ){
            debugger;
            BlockMessageContent.addMessages.call( BlockMessageContent, res );
        })
        .fail(function(err){
            console.log( err );
        })


        BlockMessageContent.pubsub.subscribe('addMessage',
            BlockMessageContent.addMessage.bind(BlockMessageContent)
        );
        BlockMessageContent.pubsub.subscribe('newMessage',
            BlockMessageContent.addMessage.bind(BlockMessageContent)
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

})( PubSub, BlockMessageContentInit, serverAPI, socketInit, blockMessagePostInit );