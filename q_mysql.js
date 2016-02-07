var Q = require('q'),
	mysql = require('mysql');

module.exports = {

	createConnection : function ( config ) {

		var real_connection = mysql.createConnection(config),

			wrapped_connection = {

				connect : function (func) {
					return real_connection.connect(func)
				},

				query : function ( query ) {
					var defer = Q.defer();

					real_connection.query( query, function( err, data ) {

						if ( err ) defer.reject( err );
						else defer.resolve( data );
					})

					return defer.promise;
				},

				_realConnection : real_connection

			};

		return wrapped_connection;
	},
};