(function (exports){

	const
		ONLINE = 'online',
		OFFLINE = 'offline';

	var theBlock,
		render,
		USER;


	function blockUsersInit ( login ) {

		USER = login;

		var defer = $.Deferred();

		$.get('/views/usersTemplate.jade') 
		.then(function( template ){

			render = jade.compile( template )
			defer.resolve( BlockUsers );
			delete window.blockUsersInit;
		})
		.fail(function(err){
			defer.reject( err )
		})
		return defer.promise();
	};

	// singleton
	function BlockUsers( htmlElement, pubsub ) {

		if ( theBlock ) {
			return theBlock;
		}
		theBlock = this;

		this.pubsub = pubsub;

		this.container = $('<ul class="list-unstyled list_message"></ul>');
		$(htmlElement).append(this.container)[0];
	};

	BlockUsers.prototype.viewUsers = function ( list ) {

		var newHtml = '';
	
		list.forEach(function( user, curent ) { 
		
			if ( user.name === USER ) return;

			newHtml += render({

				name   : user.name,
				id     : user.name,  
				status : ( user.status === true ) ? ONLINE : OFFLINE
			})
		});

		$(this.container).append( newHtml ); 
	}

	BlockUsers.prototype.offlineState = function ( user ) {
		
		var user = $(this.container).find('li[data-id="'+user+'"]');
			$(user).toggleClass('online offline');
	};

	BlockUsers.prototype.checkUserInList = function ( data ) {

		var user = $(this.container).find('li[data-id="'+data.name+'"]')[0];
		
		if ( !user ) return theBlock.viewUsers( [data] );
			$(user).toggleClass('offline online');
	};

	exports.blockUsersInit = blockUsersInit;

})(window);