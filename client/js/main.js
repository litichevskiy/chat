var _CONSTANT = {

    ROOM     : 'room_1',
    QUANTITY : 5
};

(function( PubSub, BlockMessageContentInit, mediatorServerApi, socketInit,blockMessagePostInit,  _CONSTANT ){

    var USER = login,
        KEYDOWN_ENTER = 13,
        pubsub = new PubSub;

    $.when(

        BlockMessageContentInit( _CONSTANT ),
        socketInit({ pubsub : pubsub, io : io })
    )
    .then(function( BlockMessage, socket ){

        blockMessagePostInit(
            pubsub,
            $('[data-role="block_message"]')[0],
            socket, _CONSTANT, USER
        )

        var BlockMessageContent = new BlockMessage(
                $('div[data-role="block_message_content"]')[0],
                pubsub
            );

        mediatorServerApi.getMessage({
            quantity : _CONSTANT.QUANTITY,
            room     : _CONSTANT.ROOM,
            fromId   : undefined

        }, BlockMessageContent.addMessages.bind(BlockMessageContent) );


        BlockMessageContent.pubsub.subscribe('addMessage',
            BlockMessageContent.addMessage.bind(BlockMessageContent)
        );
        BlockMessageContent.pubsub.subscribe('newMessage',
            BlockMessageContent.addMessage.bind(BlockMessageContent)
        );

        pubsub.subscribe('addMessage', function( data ) {
            mediatorServerApi.createMessage(data);
        });


        $('[data-role="exit"]').click(function(event) {

            window.location = '/login';
            mediatorServerApi.clearCookie()
        });

    })
    .fail(function(err){
        console.log( err );
    })

})( PubSub, BlockMessageContentInit, mediatorServerApi, socketInit, blockMessagePostInit, _CONSTANT );