var mediatorServerApi = (function( PubSub ) {

	var pubsub = new PubSub;

	return {

		getMessage : function( data, callback ) {

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
				if ( res.status === 400 ) return console.log( res );
					callback( res.listMassage )
			})
			.fail(function(error){
			 	console.log( error )
			});
		},

		createMessage : function( data ) {

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
				if ( res.status === 400 ) return console.log( res );
			 })
			.fail(function(error){
			 console.log( error )
			})
		},

		createUser : function( user, callback ) {

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
				callback( res )
			})
			.fail(function(error){
				console.log( error )
			})
		},

		getUser : function ( user, callback ) {

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
				callback( res )
			})
			.fail(function(error){
				callback( error )
			})
		},

		clearCookie : function (  ) {

			$.ajax({
				url: '/api/v1/clearCookie',
				type: 'GET',
				dataType: 'json',
			})
			.then(function(res) {
				console.log(res);
			})
			.fail(function(err) {
				console.log(err);
			});
		},

		on : pubsub.subscribe.bind(pubsub)
	}

})(PubSub);
