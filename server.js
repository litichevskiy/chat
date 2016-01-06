const
    SERVER_PORT = 3000;

var express = require('express'),
    http = require('http'),
    Q = require('q'),
    storage = require('./storage'),
    apiv1 = require('./api.v1.js')(storage),
    auth = require('./auth.js')(storage),
    path = require('path');;

    app = express();


app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);


// require('./routes')(app);


app.set('views', __dirname + '/client/views/');
app.set('view engine', 'jade');


app.use('/css', express.static( path.join(__dirname, '/client/css') ));
app.use('/blocks', express.static( path.join(__dirname, '/client/blocks') ));
app.use('/js', express.static( path.join(__dirname, '/client/js') ));
app.use('/views', express.static( path.join(__dirname, '/client/views') ));


app.get('/', function( req, res, next ){
    res.render('chat.jade')     //user_login.jade
});
app.get('/page/chat', function( req, res, next ){
    res.render('chat.jade')
});
app.get('/page/login', function( req, res, next ){
    res.render('user_login.jade')
});
app.get('/template', function( req, res, next ){
    res.render('messageTemplate.jade')
});
app.get('/views/renderSocket', function( req, res, next ){
    res.render('renderSocket.jade')
});


app.post( '/login/create', auth.create, auth.login );
app.post( '/login', auth.login);
app.get(  '/api/*', auth.check);
app.post( '/api/*', auth.check); //auth.check
app.get(  '/api/v1/messages', apiv1.getMessages );
app.post( '/api/v1/message', apiv1.createMessage );
app.get(  '/api/v1/clearCookie', apiv1.clear );


var server = http.createServer(app);
    server.listen(SERVER_PORT, function(){
    console.log('Server is strarted. at port ' + SERVER_PORT);
});

require('./socket.js')(server);

storage.createUser({
    login : 'john',
    password : '111'
});
storage.createMessage({
    content : '1 Отдача файла через pipe с обработкой ошибок и обрыва связи',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : '2 Замена на встроенный метод pipe',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : '3 Отдача большого файла через read - drain - write',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : '4 Отдача большого файла без потоков',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : '5 Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : '6 Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : '7 Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : '8 Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : '9 Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : '10 Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    time    : new Date().toString().split('').slice(0, 21).join('')
});
