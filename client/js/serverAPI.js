var serverAPI = (function( PubSub ) {

	return {

		getMessage : function( data ) {

			var defer = $.Deferred();

			$.ajax({
				url: '/api/v1/messages',
				type: 'GET',
				dataType: 'json',
				data: {
					quantity : data.quantity,
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
				if ( res.status === 400 ) console.log( res );
				defer.resolve( res.listMassage );
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
					login    : user.login
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
					password : user.password
				},
			})
			.then(function(res){
				defer.resolve( res )
			})
			.fail(function(error){
				defer.reject(error);
			});

			return defer.promise();
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
	}

})(PubSub);
