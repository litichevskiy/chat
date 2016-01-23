module.exports = function( storage, pubsub ) {

	var MAX_LEHGTH_MESSAGE = 500;

	return {

		createMessage : function( req, res, next ) {

			var content = req.body.content,
				room = req.body.room,
				user = req.user;

			if ( !content || !room || !user ) {
				res.status( 400 );
				res.json({
					result : 'failed',
					error  : 'content, room, user are required'
				});

			} else {

				if ( req.body.content.length <= MAX_LEHGTH_MESSAGE ){

					storage.createMessage({

						content : req.body.content,
						room 	: req.body.room,
						user 	: req.user,
						time    : req.body.time
					})
					.then( function( data ) {
						pubsub.publish( 'newMessage',data );
						res.status(200);
						res.json({ res : data });
					})
					.fail(function(error){
						console.log( error );
						res.status( 500 );
						res.json({ result : 'server error' });
					})

				} else {

					res.status( 406 );
					res.json({ result : 'maximum ' + MAX_LEHGTH_MESSAGE + ' simbol' });
				}
			}
		},

		getMessages : function( req, res, next ) {

			var room = req.query.room,
				fromId = req.query.fromId;

			if ( !room ){
				res.status( 400 );
				res.json({ result : 'room are required' });

			} else {

				storage.getMessages( room, fromId )
				.then( function( list ) {
					res.status( 200 );
					res.json({ listMassage : list });
				})
				.fail( function(){
					res.status( 500 );
					res.json({ result : 'server error' });
				})
			}
		},

		clear : function( req, res, next ) {
			res.clearCookie( 'login',
				{ Path : '/' ,expires : new Date(Date.now() )} );
			res.status( 200 );
			res.json({result:'OK'});

		},

		getAllUsers : function ( req, res, next ) { 
        			
			storage.getAllUsers()
			.then(function(list){
				res.status( 200 );
				res.json({ list : list });
			})
			.fail(function(err){
				console.log(err)
			})
		}
	}
}