var mediatorServerApi = (function( PubSub ) {

	var pubsub = new PubSub;

	return {

		getMessage : function( data, callback ) {

			$.get('/api/v1/messages', {

				quantity : data.quantity,
				room     : data.room,
				fromId   : data.fromId
			})
			.then(function(res){
				debugger;
				if ( res.status === 401 ) return window.location = '/page/login';
					callback( res.listMassage )
			})
			.fail(function(error){
				debugger;
				if ( error.status === 401 ) return window.location = '/page/login';
			 	console.log( error ) })
		},

		createMessage : function( data ) {

			$.post('/api/v1/message', {

				content : data.content,
				user    : data.user,
				room    : data.room,
				time    : data.time
			})
			.then(function(res){
				debugger;
				if ( res.status === 401 ) return window.location = '/page/login';
			 })
			.fail(function(error){
				debugger;
			 console.log( error ) })
		},

		createUser : function( user, callback ) {

			$.post('/login/create',{

				password : user.password,
				login    : user.login
			})
			.then( function( res ) {

				callback( res ) } )


			.fail(function(error){

				console.log( error ) })
		},

		getUser : function ( user, callback ) {

			$.post( '/login', {
				login : user.login,
				password : user.password
			})
			.then(function(res){
				var res = res;
				callback( res )

			})
			.fail(function(error){

				callback( error )})
		},

		clearCookie : function (  ) {

			 $.ajax({url:'/api/v1/clearCookie', type:'get'})
			.fail(function(error){ console.log( error ) })
		},

		on : pubsub.subscribe.bind(pubsub)
	}

})(PubSub);
