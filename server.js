const
    SERVER_PORT = 3000;

var express = require('express'),
    http = require('http'),
    Q = require('q'),
    storage = require('./storage'),
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


app.get('/', auth.check, function( req, res, next ){
    res.render('chat.jade', {login : req.user } )
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
    server.listen(SERVER_PORT, function(){
    console.log('Server is strarted. at port ' + SERVER_PORT);
});

require('./socket.js')(server, pubsub);

// require('./user.js')(storage);
pubsub.subscribe( 'userConnect', auth.setUserStatusOnline );
pubsub.subscribe( 'userDisconnect', auth.setUserStatusOfline );