var q_mysql = require('./q_mysql'),
	Q = require('q'),
	QUANTITY = 20,
	config,
	connection,	
	createTableMessages = "CREATE TABLE table_messages("+
		"id INT(11) AUTO_INCREMENT NOT NULL," + 
		"content VARCHAR(650) NOT NULL," +
		"time VARCHAR(50) NOT NULL," + 
		"room VARCHAR(20) NOT NULL,"+ 
		"user VARCHAR(30) NOT NULL,"+
		"PRIMARY KEY(id)"+
	")",
	createTableUser = "CREATE TABLE users_chat("+
		"id INT(11) AUTO_INCREMENT NOT NULL,"+  
		"login VARCHAR(30) NOT NULL,"+ 
		"password VARCHAR(30) NOT NULL,"+ 
		"online VARCHAR(10) NOT NULL,"+ 
		"PRIMARY KEY(id)"+ 
	")",
	createBaseData = "CREATE DATABASE",
	tableUsers = 'users_chat',//????????????????????????
	tableMessage = 'table_messages';/////???????????????????

Q.longStackSupport = true;

function initStorage ( init_config ){

	config = init_config;

	connection = q_mysql.createConnection({  
	        host     : config.host,
	        user     : config.user,
	        password : config.password
	    });
	connection.connect();

	return checkBDExists(config, connection)
	.fail(function(error){
		if ( typeof error !== 'boolean' ) return Q.reject(error);
		return createBD(config, connection);
	})
	.then(function(){
		console.log('USE DB: ')
		return connection.query('use '+config.nameDataBase)
		.then(function(){
			console.log('>> use '+ config.nameDataBase)
			return Q.resolve(storage);
		})
	});
};

function checkBDExists (config, connection) {
	var checkBaseData = false;

	return connection.query('show databases')
	.then(function( db ) {
		
		db.forEach(function(base){
	    	if ( base.Database === config.nameDataBase ) checkBaseData = true;
	    });

		return checkBaseData
			? Q.resolve()
			: Q.reject(false);
	});
}

function createBD (config, connection) {
	console.log( '---BD' )
	return connection.query( createBaseData + ' ' + config.nameDataBase + ' ' ) //config
	.then(function(){
		connection.query('use '+config.nameDataBase)
		return connection.query( createTableMessages ) // config
		.then(function(){
			console.log( '---TABLE USER' )
			return connection.query( createTableUser ) //config
		})  		
	})

}

var storage = {

	getMessages : function( room, fromId ) {
	
		var list,
			cashFromId,
			cashQuantity;

		if ( fromId !== undefined ) {

			fromId = Number( fromId );

			cashFromId = fromId;
			fromId = fromId -1 - QUANTITY;
			cashQuantity = QUANTITY;

			if ( fromId <= 1 ){
				fromId = 0 ; cashQuantity = cashFromId -1;
			} 
			
			return connection.query(
					'SELECT * FROM table_messages LIMIT'+' '+ fromId+', '+cashQuantity
					);
		} else{  
		
			var numberMessages,
				cashFromId;
				
			return connection.query('SELECT COUNT(*) FROM table_messages')
			.then(function(response){

				numberMessages = response[0]['COUNT(*)'];
				cashFromId = numberMessages;
				numberMessages -= QUANTITY;
				if ( numberMessages < 0 ) numberMessages = 0;
				
				return connection.query(
					'SELECT * FROM table_messages LIMIT'+' '+numberMessages + ',' + cashFromId
					)
				.then(function(response){
					return Q.resolve( response );
				})
			}) 
		}
	},

	getUser : function( login ) {
		
		var request = 'SELECT login, password FROM users_chat WHERE login='+'"'+login+'"';

		return connection.query( request )
		.then(function(response){
			if ( response.length === 0 ) {
				return Q.reject( new StorageError('STORAGE: no such user "' + login + '"') );
			}
			return Q.resolve( response[0] );
		})
	},

	getAllUsers : function () {
		var users = [];

		return connection.query('SELECT * FROM users_chat')
		.then(function(response){
			
			response.forEach(function(user){
				users.push({ name : user.login, status : user.online})
			});
			return Q.resolve( users );
		})
	},

	createUser : function( user ) {

		return connection.query('SELECT login FROM users_chat')
		.then(function(response){

			for (var i = 0; i < response.length; i++){
				
				if ( user.login === response[i].login ){
					return Q.reject( new Error('user already exists') )
				}
			}  

			return connection.query( 
				'INSERT INTO users_chat (login, password, online) VALUE ('+'"'+user.login+'"'+ 
				', ' +'"'+ user.password + '"' + ', ' + '"'+ user.online + '"' + ')'  
			)
			.then(function(){
				return Q.resolve()
			})
		})
	},

	createMessage : function( data ) {
		var lastIdMessage;
		
		return connection.query('SELECT COUNT(*) FROM table_messages') 
		.then(function(response){
			
			lastIdMessage = response[0]['COUNT(*)']; 
			data.id = lastIdMessage;
			
			return connection.query(
				'INSERT INTO table_messages (content, time, room, user) VALUE ('+
				'"'+data.content+'"'+', '+'"'+data.time+'"'+', '+'"'+data.room+'"'
				+', '+'"'+data.user+'"'+')' 
			)
			.then(function(response){
				return Q.resolve( data );
			})
		})
	},

	setStatus : function ( login, status ) {
		
		var request = 'SELECT login, password FROM users_chat WHERE login='+'"'+login+'"',
			user;
		return connection.query( request )
		.then(function(response){
			if ( response.length === 0 ) {
				return Q.reject( new StorageError('STORAGE: no such user "' + login + '"') );
			}
			user = response[0];
				
			var request = 'UPDATE users_chat SET online='+'"'+status+'" '+'WHERE login="'+login+'"';
			return connection.query( request )
			.then(function(response){
				return Q.resolve( user )
			})
		})

	},

	Error : StorageError
};

function StorageError ( text ) { 
	this.message = text;
}

module.exports = initStorage;