var serverAPI = (function() {

	return {

		getMessage : function( data ) {
			
			var defer = $.Deferred();

			$.ajax({
				url: '/api/v1/messages',
				type: 'GET',
				dataType: 'json',
				data: {
					room     : data.room,
					fromId   : data.fromId
				},
			})
			.then(function(res){
				
				if ( res.status === 400 ) console.log( res );
				defer.resolve( res.listMassage );
			})
			.fail(function(error){

				if (res.status === 401) window.location = '/'
				defer.reject( error );
			});

			return defer.promise();
		},

		createMessage : function( data ) {
			
			var defer = $.Deferred();

			$.ajax({
				url: '/api/v1/message',
				type: 'POST',
				dataType: 'json',
				data: {
					content : data.content,
					user    : data.user,
					room    : data.room,
					time    : data.time
				},
			})
			.then(function(res){
				// pubsub.publish( 'emitNewMessage', res.res )
				defer.resolve();
			})
			.fail(function(error){
				defer.reject( error );
			});

			return defer.promise();
		},

		createUser : function( user ) {
			
			var defer = $.Deferred();

			$.ajax({
				url: '/login/create',
				type: 'POST',
				dataType: 'json',
				data: {
					password : user.password,
					login    : user.login,
					online   : user.online
				},
			})
			.then( function( res ) {
				defer.resolve( res );
			})
			.fail(function(error){
				defer.reject(error);
			});

			return defer.promise();
		},

		getUser : function ( user ) {

			var defer = $.Deferred();

			$.ajax({
				url: '/login',
				type: 'POST',
				dataType: 'json',
				data: {
					login : user.login,
					password : user.password,
					online   : user.online
				},
			})
			.then(function(res){
				defer.resolve( res )
			})
			.fail(function(error){
				console.log(error)
				defer.reject(error);
			});

			return defer.promise();
		},

		getAllUsers : function () {

			var defer = $.Deferred();

			$.ajax({
				url: '/api/v1/getAllUsers',
				type: 'GET',
				dataType: 'json',
			})
			.then(function( list ) {
				
				pubsub.publish( 'listUsers', list.list ); 
				defer.resolve();
			})
			.fail(function(err)  {
				defer.reject(err);
			})
		},

		clearCookie : function (  ) {

			var defer = $.Deferred();

			$.ajax({
				url: '/api/v1/clearCookie',
				type: 'GET',
				dataType: 'json',
			})
			.then(function(res) {
				defer.resolve(res);
			})
			.fail(function(err) {
				defer.reject(err);
			});

			return defer.promise();
		},

		setPubsub : function( o ){
			pubsub = o;
		},

		on : function ( event, func ) {
			pubsub.subscribe( event, func )
		} 
	}

})();
