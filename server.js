var config = require('./config.json'),
    initStorage = require('./storage');


initStorage( config )
.then(function(storage){

    console.log('SERVER: OK')
    var express = require('express'),
        http = require('http'),
        Q = require('q'),
        pubsub = new (require('./pubsub')),
        apiv1 = require('./api.v1.js')( storage, pubsub ),
        auth = require('./auth.js')( storage, express.cookieParser(), pubsub ),
        path = require('path');

        app = express();


    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(app.router);


    app.set('views', __dirname + '/client/views/');
    app.set('view engine', 'jade');


    app.use('/css', express.static( path.join(__dirname, '/client/css') ));
    app.use('/blocks', express.static( path.join(__dirname, '/client/blocks') ));
    app.use('/js', express.static( path.join(__dirname, '/client/js') ));
    app.use('/views', express.static( path.join(__dirname, '/client/views') ));
    app.use('/ringtone', express.static( path.join(__dirname, '/client/ringtone') ));
    app.use('/bootstrap', express.static( path.join(__dirname, '/client/bootstrap') ));


    app.get('/', auth.check, function( req, res, next ){
        res.render('chat.jade', {
            login : req.user,
            theme : req.cookies.theme
        });
    });
    app.get('/settings/theme', function (req, res, next){
        res.cookie('theme', req.query.url, {
            expires: new Date(Date.now() +  10 * 365 * 24 * 60 * 60),
            Path : '/'
        });
        res.redirect('/');
    });
    app.get('/login', function( req, res, next ){
        res.render('user_login.jade')
    });
    app.get('/template', function( req, res, next ){
        res.render('messageTemplate.jade')
    });


    app.post( '/login/create', auth.create, auth.login );
    app.post( '/login', auth.login );
    app.get(  '/api/*', auth.check );
    app.post( '/api/*', auth.check, auth.extendСookies );
    app.get(  '/api/v1/messages', apiv1.getMessages, auth.extendСookies  );
    app.post( '/api/v1/message', apiv1.createMessage );
    app.get(  '/api/v1/clearCookie', apiv1.clear );
    app.get(  '/api/v1/getAllUsers', apiv1.getAllUsers );

    var server = http.createServer(app);
        server.listen(config.serverPort, function(){
        console.log('Server is strarted. at port ' + config.serverPort);
    });

    require('./socket.js')(server, pubsub);

    // require('./user.js')(storage);
    pubsub.subscribe( 'userConnect', auth.setUserStatusOnline );
    pubsub.subscribe( 'userDisconnect', auth.setUserStatusOfline );

})
.fail(function( err ) {
    console.log( err )
});