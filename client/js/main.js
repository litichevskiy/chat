(function( PubSub, blockMessageContentInit, serverAPI, socketInit, blockMessagePostInit, blockUsersInit ){

    var USER     = login,
        ROOM     = 'room_1',
        pubsub   = new PubSub;
            
        serverAPI.setPubsub( pubsub ); 

    $.when(
        blockMessageContentInit( ROOM ),
        socketInit({ pubsub : pubsub, io : io }),
        blockUsersInit( USER )
    )
    .then(function( BlockMessage, socket, BlockUsers ){
        
        blockMessagePostInit(
            pubsub,
            $('[data-role="block_message"]')[0],
            socket, ROOM, USER
        );

        var blockMessageContent = new BlockMessage(
                $('div[data-role="block_message_content"]')[0],
                pubsub
            );

        var blockUsers = new BlockUsers (
                $('div[data-role="block_users"]')[0],
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
        });

        serverAPI.getAllUsers();

        serverAPI.on('serverAPIcreateMessage', serverAPI.createMessage);

        blockMessageContent.pubsub.subscribe('addNewMessage',
            blockMessageContent.addMessage.bind(blockMessageContent)
        );

        blockUsers.pubsub.subscribe('listUsers', blockUsers.viewUsers.bind( blockUsers ));
        blockUsers.pubsub.subscribe('userOnline', blockUsers.checkUserInList.bind( blockUsers ));////////
        blockUsers.pubsub.subscribe('userOffline', blockUsers.offlineState.bind( blockUsers ));
        
        $('[data-role="exit"]').click(function(event) {

            window.location = '/login';
            serverAPI.clearCookie()
        });

    })
    .fail(function(err){
        console.log( err );
    })

})( PubSub, blockMessageContentInit, serverAPI, socketInit, blockMessagePostInit, blockUsersInit );
