(function( exports, serverAPI ) {


	var parentBlockMessageContent = $('.column')[1],
		inProgress = $('[data-role="load"]')[0],
		announcement = $('[data-role="new message"]')[0],
		htmlAnnouncement = $(announcement).html(),
		ringtone = $('[data-role = "ringtoneMessage"]')[0],
		sound = $('input[data-role="sound"]')[0],
		render,
		resCheck,
		ROOM,
		USER,
		countNewMessage = 1,
		heightContent,
		measureHeightContent = true,
		topHistory = false;

	var theBlock;

	function blockMessageContentInit ( room ) {

		ROOM = room;
		USER = login; // window

		var defer = $.Deferred();

		$.get('/views/messageTemplate.jade') 
		.then(function( template ){

			render = jade.compile( template )
			defer.resolve( BlockMessageContent );
			delete window.blockMessageContentInit;
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
		$(htmlElement).append(this.container)[0];

		this.pubsub = pubsub;
	};


	BlockMessageContent.prototype.addMessage = function( data ) {

		var newHtml = '',
			userName = data.user;

			newHtml = render({

				id      : data.id,
				name    : data.user,
				content : data.content,
				time    : data.time
			});

		if ( userName === USER ) {

			$(this.container).append(newHtml);
			theBlock.scrollInBottom();

		} else {

			rememberHeightContent();
			$(this.container).append(newHtml);

			if ( $(this.container).height() >= $(parentBlockMessageContent).height() ){

				showAnnouncement();
			}
			messageRingtone();
		}
	};

	BlockMessageContent.prototype.addMessages = function ( list ) {

		var listMassage = '',
			html = $(this.container).html();

		list.forEach(function(data){

			listMassage += render({

				id      : data.id,
				name    : data.user,
				content : data.content,
				time    : data.time
			})
		});

		$(this.container).html( listMassage + html );

	};

	BlockMessageContent.prototype.scrollInBottom = function ( ) {

		parentBlockMessageContent.scrollTop = parentBlockMessageContent.scrollHeight;
	};

	function showAnnouncement () {

		$(announcement).show('slow');
		$(announcement).html( htmlAnnouncement + ' ' + countNewMessage++ );
	};

	function rememberHeightContent () {

		if ( measureHeightContent ) {

			measureHeightContent = false;
			heightContent = parentBlockMessageContent.scrollHeight;
		}
	};

	function loadHistoryMessage ( ) {

        if ( topHistory ) return;

        var myLastId = Number( $('li[data-id_message]:first')[0].dataset.id_message ),
            fromId = myLastId;

        if ( fromId === 0 ) {
            topHistory = true;
        }

        if ( myLastId === 0 ) return;

        $(inProgress).show();

        serverAPI.getMessage({

            room     : ROOM,
            fromId   : fromId

        })
        .then(function(res){

            theBlock.addMessages( res );
            $(inProgress).hide();
        })
        .fail(function(err){
            $(inProgress).hide();
            console.log(err)
        })
    };

	function messageRingtone () {
	
		if ( $(sound).prop('checked') ) ringtone.play();
	};

    $('div[data-role="block_message_content"]').scroll(function(){

        if (this.scrollTop === 0 && !topHistory ) {

			loadHistoryMessage();
            return;
        }

    });

	$('[data-role="new message"]').click(function(event) {

		parentBlockMessageContent.scrollTop = heightContent;
		measureHeightContent = true;
		countNewMessage = 1;
		heightContent = 0;
		$(announcement).hide('slow');
	});


	exports.blockMessageContentInit = blockMessageContentInit;

})( window, serverAPI );