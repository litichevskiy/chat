(function( exports, serverAPI ) {

	var parentBlockMessageContent = $('.column')[1],
		inProgress = $('[data-role="load"]')[0],
		chechInProgress = false,
		render,
		resCheck,
		QUANTITY,
		ROOM,
		CHECK_FUNCTION = true;

	var theBlock;


	function BlockMessageContentInit ( quantity, room ) {

		QUANTITY = quantity;
		ROOM     = room;

		var defer = $.Deferred();

		$.get('/views/messageTemplate.jade')
		.then(function( template ){

			render = jade.compile( template )
			defer.resolve( BlockMessageContent );
			delete window.BlockMessageContentInit;
		})
		.fail(function(err){
			defer.reject( err )
		})
		return defer.promise();
	};

	// singleton
	function BlockMessageContent ( htmlElement, pubsub ) {

		if ( theBlock ) {
			return theBlock;
		}
		theBlock = this;

		this.container = $('<ul class="list-unstyled list_message"></ul>');
		$(htmlElement).append(this.container);

		this.pubsub = pubsub;
	};


	BlockMessageContent.prototype.addMessage = function( data ) {

		var that = ( this === window ) ? theBlock : this,
			newHtml = '';

			lastElemList = $(that.container).find('li:last')[0] || $(that.container);
			html = $(lastElemList).html();

			newHtml = render({

				id      : data.id || '',
				name    : data.user,
				content : data.content,
				time    : data.time
			});

			$(lastElemList).html( html + newHtml )
			scrollInBottom();
	};

	BlockMessageContent.prototype.addMessages = function ( list ) {

		var that = ( this === window ) ? theBlock : this,
			listMassage = '',
			html = $(that.container).html();

		list.forEach(function(data){

			listMassage += render({

				id      : data.id || '',
				name    : data.user,
				content : data.content,
				time    : data.time
			})
		});

		$(that.container).html( listMassage + html );
		scrollInBottom();

		if( chechInProgress ) {

			$(inProgress).hide();
		}
	};

	function scrollInBottom ( ) {
		parentBlockMessageContent.scrollTop = parentBlockMessageContent.scrollHeight;
	};

	function loadHistoryMessage ( ) {

        var fromId = Number( $('li[data-id_message]:first')[0]
            .dataset.id_message ) - QUANTITY;

            resCheck = checkFromId( fromId, QUANTITY  );

        $.when(

            serverAPI.getMessage({

                quantity : resCheck.quantity,
                room     : ROOM,
                fromId   : resCheck.fromId

            })
        )
        .then(function(res){
            theBlock.addMessages( res );
        })
        .fail(function(err){
            console.log(err)
        })
    };

    function checkFromId( fromId, QUANTITY ) {

        if ( fromId <= 0 ) {

            CHECK_FUNCTION = false;

            QUANTITY = Number( $('li[data-id_message]:first')[0]
            .dataset.id_message) -1;
            fromId = 0;

            return {
                fromId   : fromId,
                quantity : QUANTITY
            };
        }
            return {
                fromId   : fromId,
                quantity : QUANTITY
            };
    };


    $('div[data-role="block_message_content"]').scroll(function(){

        if (this.scrollTop === 0 && CHECK_FUNCTION ) {

            loadHistoryMessage();
            $(inProgress).show();
            chechInProgress = true;
        }
    });


	exports.BlockMessageContentInit = BlockMessageContentInit;

})( window, serverAPI );