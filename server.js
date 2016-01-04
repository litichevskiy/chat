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


require('./routes')(app);


app.set('views', __dirname + '/client/views/');
app.set('view engine', 'jade');


app.use('/css', express.static( path.join(__dirname, '/client/css') ));
app.use('/blocks', express.static( path.join(__dirname, '/client/blocks') ));
app.use('/js', express.static( path.join(__dirname, '/client/js') ));


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
    content : 'Отдача файла через pipe с обработкой ошибок и обрыва связи',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Замена на встроенный метод pipe',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла через read - drain - write',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла без потоков',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача файла через pipe с обработкой ошибок и обрыва связи',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Замена на встроенный метод pipe',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла через read - drain - write',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла без потоков',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача файла через pipe с обработкой ошибок и обрыва связи',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Замена на встроенный метод pipe',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла через read - drain - write',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла без потоков',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача файла через pipe с обработкой ошибок и обрыва связи',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Замена на встроенный метод pipe',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла через read - drain - write',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла без потоков',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача файла через pipe с обработкой ошибок и обрыва связи',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Замена на встроенный метод pipe',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла через read - drain - write',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла без потоков',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача файла через pipe с обработкой ошибок и обрыва связи',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Замена на встроенный метод pipe',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла через read - drain - write',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Отдача большого файла без потоков',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
storage.createMessage({
    content : 'Тот же сервер с выводом памяти по setInterval',
    user    : 'john',
    room    : '111',
    data    : new Date().toString().split('').slice(0, 21).join('')
});
