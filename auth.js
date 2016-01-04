module.exports = function ( storage ) {

	return {

		check : function ( req, res, next ) {

			if ( !req.cookies.login ) {
				res.status(401).json({
					result : 'failed',
					error  : 'unauthorized'
				});

			} else{

				req.user = req.cookies.login;
				next();
			}

		},

		login : function ( req, res, next ) {

			var login = req.body.login,
				password = req.body.password;

			if ( !login || !password ) return res.status(401).json({
				result : 'failed',
				error  : 'password and login are required'
			});

			storage.getUser( req.body.login )
			.then( function( user ){

				if ( user.password === password ){
					res.cookie('login', req.body.login, {
        				expires: new Date(Date.now() + 900000),
        				Path : '/'
    				});
    				res.json({result:'success' });
    				// res.redirect('/');
    				console.log('User ' + user.login + ' logged in');
    				next();

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
				.then(function(){ next() })
				.fail(function(error){
					res.json({'ERROR':error.message})
				})

			} else {

				res.status(401).json({
					'login' : login,
					'password' : password
				});

			}
		}
	}
}