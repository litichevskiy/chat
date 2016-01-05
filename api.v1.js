module.exports = function( storage ) {

	return {

		createMessage : function( req, res, next ) {

			var content = req.body.content,
				room = req.body.room,
				user = req.user;

			if ( !content || !room || !user ){
				res.status( 400 )
				res.json({
					result : 'failed',
					error  : 'content, room, user are required'
				})

			} else {

				storage.createMessage({

					content : req.body.content,
					room 	: req.body.room,
					user 	: req.user,
					data    : req.body.time
				})
				.then( function( ) {
					res.json({ result : 'success' })

				// 	console.log({

				// 	content : req.body.content,
				// 	room 	: req.body.room,
				// 	user 	: req.user,
				// 	data    : req.body.data
				// })
				})
				.fail(function(error){
					console.log( error );
					res.status( 500 )
					res.json({ result : 'failed' })
				})
			}
		},

		getMessages : function( req, res, next ) {

			var room = req.query.room,
				quantity = req.query.quantity,
				fromId = req.query.fromId;

			if ( !room ||  !quantity ){
				res.status( 500 );
				res.json({ result : 'failed' });

			} else {

				storage.getMessages( room, quantity, fromId )
				.then( function( list ) {
					// console.log( res.json({ listMassage : list }) )

					res.json({ listMassage : list })
				})
				.fail( function(){
					res.status( 500 );
					res.json({ result : 'failed' });
				})

			}

		},

		clear : function( req, res, next ) {
			res.clearCookie( 'login',
				{ Path : '/' ,expires : new Date(Date.now() )} )

			res.json({'res':res._headers})

		}
	}
}