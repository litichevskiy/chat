var REGEXP_IS_JSON = /application\/json/,
	COOKIE_EXPIRIES = 1000 * 60 * 15; // 15 min

module.exports = function ( storage ) {

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
				console.log( error );
				res.status(401).json({
					result : 'failed',
					error  : 'unknown user'
				});
			})
		},

		create : function ( req, res, next ) {
			var login = req.body.login;
				password = req.body.password;

			if ( login && password ){

				storage.createUser({
					login : login,
					password : password
				})
				.then(function(){
					next();
				})
				.fail(function(error){
					res.status( 500 );
					res.json({result: 'server error'})
				})

			} else {

				res.status(401);
				res.json({ result : 'login and password are required'});

			}
		}
	}
}