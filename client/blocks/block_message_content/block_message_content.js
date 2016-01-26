(function( exports, serverAPI ) {


	var REGEXP_TIME = /.+?\d\d\d\d\b/,
		parentBlockMessageContent = $('.column')[1],
		inProgress = $('[data-role="load"]')[0],
		announcement = $('[data-role="new message"]')[0],
		htmlAnnouncement = $(announcement).html(),
		ringtone = $('[data-role = "ringtoneMessage"]')[0],
		sound = $('input[data-role="sound"]')[0],
		blockMessageContent = $('div[data-role="block_message_content"]')[0],
		render,
		resCheck,
		ROOM,
		USER,
		DOWN = 40,
		countNewMessage = 0,
		heightContent,
		measureHeightContent = true,
		topHistory = false,
		heightUnReadMessage = [],
		lastMessage,
		heightListMessage,
		heightNewMessage;

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


	function get_Date( date ){
        return ( new Date( date ).toString() ).match( REGEXP_TIME ).join();
    };

	function getHoursAndMinutes ( timeInFormat_new_Date ) {
		var time = new Date( timeInFormat_new_Date );
			minutes = time.getMinutes();
			hours = time.getHours();
			( minutes < 10 ) ? minutes = '0' + minutes : minutes;
			( hours < 10 ) ? hours = '0' + hours : hours;
		return hours + ' : ' + minutes; 
	};


	var getDateSeparator = function () {

		var storageSeparator = {
			year : 0,
			month : 0,
			dayMonth : 0,
			liDate : ''
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
					return storageSeparator.liDate;
				}
				return storageSeparator.liDate;	
			},

			createNewSeparator : function ( o ) {
				storageSeparator.liDate = $('<li data-time="'+o.year+','+o.month+','+ o.dayMonth+'"></li>');
				storageSeparator.liDate.html( get_Date( o.date ) );
				$(o.container).prepend( storageSeparator.liDate );
			}
		}
	}();


	BlockMessageContent.prototype.addMessage = function( data ) {

		var newHtml = '',
			userName = data.user;

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
			
			lastMessage = $(this.container).find('li:last');
			heightListMessage = $(this.container).height()
			$(this.container).append(newHtml);
		
			heightNewMessage = ( $(lastMessage).next() ).height()
			heightUnReadMessage.push( heightListMessage - heightNewMessage ); 

			if ( $(this.container).height() >= $(parentBlockMessageContent).height() ){

				showAnnouncement();
			}
			messageRingtone();
		}
	};

	BlockMessageContent.prototype.addMessages = function ( list ) {

		var listMassage = '',
			dateSeparator,
			html = $(this.container).html(),
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

	// function updateHtmlAnnouncement(){
	// 	countNewMessage -= 1;
    		
 //    	$(announcement).html( htmlAnnouncement + ' ' + countNewMessage );
 //    	heightUnReadMessage.splice( 0, 1 )
 //    	if ( heightUnReadMessage.length === 1 ){
 //    		countNewMessage = 0;
 //    		heightUnReadMessage.splice( 0, 1 )
 //    		$(announcement).hide('slow');
 //    	}
	// }

    $(blockMessageContent).scroll(function(event){

        if (this.scrollTop === 0 && !topHistory ) {

			loadHistoryMessage();
            return;
        }
        
    	if ( this.scrollTop >= heightUnReadMessage[0] ){
    		$(announcement).hide('slow');
    		// updateHtmlAnnouncement();
    	}
    });

	$(announcement).click(function(event) {

		parentBlockMessageContent.scrollTop = heightContent;
		measureHeightContent = true;
		countNewMessage = 0; // 1
		heightContent = 0;
		$(announcement).hide('slow');
	});
	
	$(document).keydown(function(event) {
		
		if ( event.keydown === DOWN ) return updateHtmlAnnouncement();
	});

	exports.blockMessageContentInit = blockMessageContentInit;

})( window, serverAPI );
