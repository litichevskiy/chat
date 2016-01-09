// fake memory storage

var Q = require('q'),
	bd_Users = {},
	bd_Messages = [],
	LAST_MESSAGE = 0,
	MESSAGE = 'больше сообщений нет';

var storage = {

	getMessages : function( room, quantity, fromId ) {
		var defer = Q.defer(),
			list;

			quantity = Number( quantity );

		if ( fromId !== undefined ){
			fromId = Number( fromId );

			if( fromId === LAST_MESSAGE ) {

				list = bd_Messages.slice( fromId, quantity );
				list.unshift( {content:MESSAGE} )
				defer.resolve( list );
			} else{

				list = bd_Messages.slice( fromId,  quantity + fromId );
				defer.resolve( list );
			}

		} else{

			list = bd_Messages.slice( bd_Messages.length - quantity );
			defer.resolve( list );
		}

		return defer.promise;
	},

	createMessage : function( data ) {
		var defer = Q.defer();

		data.id = bd_Messages.length;
		bd_Messages.push( data );
		defer.resolve( data );

		return defer.promise;
	},

	createUser : function( user ) {
		var defer = Q.defer();

		if ( !bd_Users.hasOwnProperty( user.login ) ){
			bd_Users[user.login] = user;
			defer.resolve( user );
		} else {
			defer.reject(new Error('user already exists'));
		}

		return defer.promise;
	},

	getUser : function( login ) {
		var defer = Q.defer();

		if ( bd_Users.hasOwnProperty(login) ){
			defer.resolve(bd_Users[login]);
		} else {
			defer.reject(new Error('no such user "' + login + '"'));
		}

		return defer.promise;
	}
};

module.exports = storage;