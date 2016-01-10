(function( exports, mediatorServerApi ) {

	var parentBlockMessageContent = $('.column')[1],
		render,
		resCheck,
		CHECK_FUNCTION = true;

	var __THAT;


	function BlockMessageContentInit ( _CONSTANT ) {
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


	function BlockMessageContent ( htmlElement, pubsub ) {

		__THAT = this;

		this.container = $('<ul class="list-unstyled list_message"></ul>');
		$(htmlElement).append(this.container);

		this.pubsub = pubsub;
	};


	BlockMessageContent.prototype.addMessage = function( data ) {

		var that = ( this === window ) ? __THAT : this,
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

		var that = ( this === window ) ? __THAT : this,
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
	};

	function scrollInBottom ( ) {
		parentBlockMessageContent.scrollTop = parentBlockMessageContent.scrollHeight;
	};

	function loadHistoryMessage ( ) {

            var fromId = Number( $('li[data-id_message]:first')[0]
                .dataset.id_message ) -_CONSTANT.QUANTITY;

            resCheck = checkFromId( fromId, _CONSTANT.QUANTITY  );

            mediatorServerApi.getMessage({

                quantity : resCheck.quantity,
                room     : _CONSTANT.ROOM,
                fromId   : resCheck.fromId

            }, __THAT.addMessages );
        };

        function checkFromId( fromId, QUANTITY ) {

            if ( fromId <= 0 ) {
            	debugger;
            	CHECK_FUNCTION = false;

                _CONSTANT.QUANTITY = Number( $('li[data-id_message]:first')[0]
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
                    quantity : _CONSTANT.QUANTITY
                };
        };


        $('div[data-role="block_message_content"]').scroll(function(){

            if (this.scrollTop === 0 && CHECK_FUNCTION ) {
            	debugger;
                return loadHistoryMessage();
            }
        });


	exports.BlockMessageContentInit = BlockMessageContentInit;

})( window, mediatorServerApi );