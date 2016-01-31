(function( exports, serverAPI ) {


	var REGEXP_TIME = /.+?\d\d\d\d\b/,
		ROOM,
		USER,
		DOWN = 40,
		TODAY = 'Today',
		TIMER_CHECK_TIME = 1000 * 60 * 60, // 1 hours in ms
		parentBlockMessageContent = $('.column')[1],
		inProgress = $('[data-role="load"]')[0],
		announcement = $('[data-role="new message"]')[0],
		htmlAnnouncement = $(announcement).html(),
		ringtone = $('[data-role = "ringtoneMessage"]')[0],
		sound = $('input[data-role="sound"]')[0],
		blockMessageContent = $('div[data-role="block_message_content"]')[0],
		render,
		resCheck,
		countNewMessage = 0,
		heightContent,
		measureHeightContent = true,
		topHistory = false,
		heightUnReadMessage = [],
		lastMessage,
		heightListMessage,
		heightNewMessage,
		new_Day;

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

		getDateSeparator.createSeparatorDateNow( this.container );
		getDateSeparator.setLiToday( this.container );
	};


	function get_Date( date ){
        return ( new Date( date ).toString() ).match( REGEXP_TIME ).join();
    };

	function getHoursAndMinutes ( timeInFormat_new_Date ) {
		var time = new Date( timeInFormat_new_Date );
			minutes = time.getMinutes();
			hours = time.getHours();
			( minutes < 10 ) ? minutes = '0' + minutes : minutes;
			( hours < 10 ) ? hours = '0' + hours : hours;
		return hours + ' ' + minutes;
	};


	var getDateSeparator = function () {

		var storageSeparator = {
			year : (new Date).getFullYear(),
			month : (new Date).getMonth(),
			dayMonth : (new Date).getDate(),
			hours : (new Date).getHours(),
			liToday : null,
			liDateNow : ''
		};

		return {

			getDate : function ( container, timeInFormat_new_Date ) {

			var date = new Date( timeInFormat_new_Date ),
				year = date.getFullYear(),
				month = date.getMonth(),
				dayMonth = date.getDate();

				if ( storageSeparator.year !== year ||
				 	storageSeparator.month !== month ||
				 	storageSeparator.dayMonth !== dayMonth  ) {
					getDateSeparator.createNewSeparator({
						date      : date,
						year      : year,
						month     : month,
						dayMonth  : dayMonth,
						container : container
					})
					storageSeparator.year = year;
					storageSeparator.month = month;
					storageSeparator.dayMonth = dayMonth;
					return storageSeparator.liToday;
				}
				return storageSeparator.liToday || storageSeparator.liDateNow;
			},

			createNewSeparator : function ( o ) {
				storageSeparator.liToday = $(
					'<li class=separate data-time="'+o.year+','+o.month+','+ o.dayMonth+'"></li>'
					);
				storageSeparator.liToday.html( get_Date( o.date ) );
				$(o.container).prepend( storageSeparator.liToday );
			},

			createSeparatorDateNow : function ( container ) {

				var now = new Date(),
					year = now.getFullYear(),
					month = now.getMonth(),
					dayMonth = now.getDate();

				storageSeparator.liDateNow = $(
					'<li class=separate data-time="'
					+year+','+month+','+ dayMonth+'"data-day="'+get_Date( now )+'""></li>'
					);
				storageSeparator.liDateNow.html( TODAY ); //get_Date( now.toString()
				$(container).append( storageSeparator.liDateNow );
				new_Day = false;
			},

			setLiToday : function ( container ) {
				var container = container

				setInterval(function(){
					var hours = ( new Date() ).getHours();
					if ( hours === 0 ) {
						new_Day = true;
						$(storageSeparator.liDateNow).html(
							( storageSeparator.liDateNow[0] ).dataset.day
						)
					}
				}, TIMER_CHECK_TIME);
			}
		}
	}();


	BlockMessageContent.prototype.addMessage = function( data ) {

		var newHtml = '',
			userName = data.user;

			if ( new_Day ) getDateSeparator.createSeparatorDateNow( $(this.container) );

			newHtml = render({

				id      : data.id,
				name    : data.user,
				content : data.content,
				time    : getHoursAndMinutes( data.time )
			});

		if ( userName === USER ) {
			$(this.container).append(newHtml);
			theBlock.scrollInBottom();

		} else {

			rememberHeightContent();

			$(this.container).append(newHtml);
			// heightListMessage = $(this.container)
			// heightUnReadMessage.push()
			// lastMessage = $(this.container).find('li:last');

			if ( $(this.container).height() >= $(parentBlockMessageContent).height() ){

				showAnnouncement();
			}
			messageRingtone();
		}
	};

	BlockMessageContent.prototype.addMessages = function ( list ) {

		var listMassage = '',
			dateSeparator,
			that = this;

			list.reverse();

		list.forEach(function(data) {

			dateSeparator = getDateSeparator.getDate( that.container, data.time );

			listMassage = render({

				id      : data.id,
				name    : data.user,
				content : data.content,
				time    : getHoursAndMinutes(data.time)
			})

			$( dateSeparator ).after( listMassage );
		});
	};

	BlockMessageContent.prototype.scrollInBottom = function ( ) {
		parentBlockMessageContent.scrollTop = parentBlockMessageContent.scrollHeight;
	};

	function showAnnouncement () {

		$(announcement).show('slow');
		countNewMessage += 1
		$(announcement).html( htmlAnnouncement + ' ' + countNewMessage );
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

        if ( fromId === 1 ) {
            topHistory = true;
        }

        if ( myLastId === 1 ) return;

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

	// function updateHtmlAnnouncement( scroll_now ){

	// 	for ( var i = 0; i < heightUnReadMessage.length; i++ ) {

	// 		if ( scroll_now >= heightUnReadMessage[0] ){
	// 			heightUnReadMessage.splice( 0, 1 );
	// 			countNewMessage -= 1;
	// 			$(announcement).html( htmlAnnouncement + ' ' + countNewMessage );
	// 		}

	// 		if ( heightUnReadMessage.length === 1 ) {
	// 			countNewMessage = 0;
	// 			heightUnReadMessage.splice( 0, 1 );
	// 			$(announcement).hide('slow');
	// 		}
	// 	}
	// }

    $(blockMessageContent).scroll(function(event){

        if (this.scrollTop === 0 && !topHistory ) {

			loadHistoryMessage();
            return;
        }

    	// if ( this.scrollTop >= heightUnReadMessage[0] ){
    	// 	$(announcement).hide('slow');
    	// 	// updateHtmlAnnouncement( this.scrollTop );
    	// }
    });

	$(announcement).click(function(event) {

		parentBlockMessageContent.scrollTop = heightContent;
		measureHeightContent = true;
		countNewMessage = 0; // 1
		heightContent = 0;
		$(announcement).hide('slow');
	});

	// $(document).keydown(function(event) {

	// 	if ( event.keydown === DOWN ) return updateHtmlAnnouncement();
	// });

	exports.blockMessageContentInit = blockMessageContentInit;

})( window, serverAPI );