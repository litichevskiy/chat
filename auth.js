var REGEXP_IS_JSON = /application\/json/,
	COOKIE_EXPIRIES = 1000 * 60 * 15; // 15 min

module.exports = function ( storage, cookieParser, pubsub ) {

	return {

		check : function ( req, res, next ) {

			if ( !req.cookies.login ) {

				if ( REGEXP_IS_JSON.test( req.header( 'accept' ) ) ){

					res.status(401).json({
						result : 'failed',
						error  : 'unauthorized'
					})
				} else {
					res.redirect('/login');
				}
			} else{
				req.user = req.cookies.login;
				next();
			}
		},

		extendСookies : function ( req, res, next ) { 

			res.cookie('login', req.body.user, {
      			expires: new Date(Date.now() + COOKIE_EXPIRIES ),
        		Path : '/'
    		});
    		next();
		},

		login : function ( req, res, next ) {

			var login = req.body.login,
				password = req.body.password;

			if ( !login || !password ) {

				return res.status(401).json({result:'password and login are required'});
			}

			storage.getUser( req.body.login )
			.then( function( user ){

				if ( user.password === password ){
					res.cookie('login', req.body.login, { 
        				expires: new Date(Date.now() + COOKIE_EXPIRIES ),
        				Path : '/'
    				});
    				console.log('User ' + user.login + ' logged in');
    				res.status( 200 )
    				res.json({result:'success' });


				} else {
					return res.status(401).json({
						result : 'failed',
						error  : 'unknown user'
					});
				}
			})
			.fail(function(error){
				if ( error instanceof storage.Error ) {
					res.status(401).json({
						result : 'failed',
						error  : 'unknown user'
					});
				} else {
					console.log('AUTH LOGIN ERROR : ', error, error.stack);
					res.status(500).json({
						result : 'failed',
						error  : 'server error'
					});
				}
			})
			.done();
		},

		create : function ( req, res, next ) {
			var login = req.body.login;
				password = req.body.password;
				online = req.body.online;

			if ( login && password ){

				storage.createUser({
					login : login,
					password : password,
					online : online
				})
				.then(function(){
					next();
				})
				.fail(function(error){
					res.status( 403 );
					res.json({result: 'user already exists'})
				})

			} else {

				res.status(401);
				res.json({ result : 'login and password are required'});

			}
		},

		setUserStatusOnline : function ( request ){

			cookieParser( request, {}, function(){
			
				var user = request.cookies.login;

				storage.setStatus( user, true )
				.then(function(user){
					// user.online = true;
					pubsub.publish('userOnline',user.login); 
				})
				.fail(function(err){
					console.log(err);
				})
			})
		},

		setUserStatusOfline : function ( request ){

			cookieParser( request, {}, function(){

				var user = request.cookies.login;

				storage.setStatus( user, false )

				.then(function(user){
					// user.online = false;
					pubsub.publish( 'emitUserDisconnect', user.login );
				})
				.fail(function(err){
					console.log(err);
				})
			})
		}
	}
}