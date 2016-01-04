var serverStorage = (function( PubSub ){

	var pubsub = new PubSub;

	return {

		getMessage : function( data, callback ) {

			$.get('/api/v1/messages', {

				quantity : data.quantity,
				room     : data.room,
				fromId   : data.fromId
			})
			.then(function(res){

				callback( res.listMassage ) })
			.fail(function(error){

			 	console.log( error ) })
		},

		createMessage : function( data, callback ) {

			$.post('/api/v1/message', {

				content : data.content,
				user    : data.user,
				room    : data.user,
				data    : new Date().toString().split('').slice(0, 21).join('')//////
			})
			.then(function(res){ callback(res) })
			.fail(function(error){ console.log( error ) })
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

		clearCookie : function ( callback ) {

			 $.ajax({url:'/api/v1/clearCookie', type:'get'})

			.then( function( res ) { callback( res ) } )
			.fail(function(error){ console.log( error ) })

		},

		getMainPage : function ( htmlElement ) {

			$.ajax({url:'/page/chat', type:'get' })
		 	.then( function(res){

		 		htmlElement.html( res );
		 	})
		 	.fail( function(err)  {console.log( err )} )
		},

		on : pubsub.Subscribe.bind(pubsub)
	}

})(PubSub);
