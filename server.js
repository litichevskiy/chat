const
    SERVER_PORT = 3000;

var express = require('express'),
    http = require('http'),
    Q = require('q'),
    storage = require('./storage'),

    app = express();


app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);



http.createServer(app).listen(SERVER_PORT, function(){
    console.log('Server is strarted. at port ' + SERVER_PORT);
});