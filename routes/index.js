module.exports = function ( app ) {

	app.get('/', require('./mainPage').get);
	app.get('/page/chat', require('./chatPage').get);
	app.get('/page/login', require('./loginPage').get);
};