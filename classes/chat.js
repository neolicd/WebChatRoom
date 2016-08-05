var Chat = function() {};

Chat.prototype.init = function() {
    this.express = require('express');
    this.app = this.express();
    this.http = require('http').Server(this.app);
    this.io = require('socket.io')(this.http);
    this.record = require('./record')();
    this.app.use(this.express.static('public'));
    this.app.set('view engine', 'ejs');

    var bodyParser = require('body-parser');
    this.app.use(bodyParser.urlencoded({extended:false}));
    this.app.use(bodyParser.json());
};

Chat.prototype.setLoginPage = function(fileName) {
    this.app.get('/', function(req, res) {
        res.render(fileName);
    });
};

Chat.prototype.setMainPage = function(fileName) {
    this.app.post('/main', function(req, res) {
        res.render(fileName, {
            uID: req.body.uID
        });
    });
};

Chat.prototype.setBroadCast = function() {
    var __this = this;
    __this.io.on('connection', function(socket){
        var items = __this.record.getItems();
        var len = items.length;
        for(var i = 0; i < len; i++) {
            socket.emit('chat message', items[i]);
        }

        socket.on('chat message', function(item){
            __this.record.add(item);
            //__this.record.save();
            __this.io.emit('chat message', item);
        });
    });
};

Chat.prototype.listen = function(portNum) {
    this.http.listen(portNum, function() {
        console.log("The application is running on port:" + portNum);
    });
};

var create = function() {
    return new Chat();
}

module.exports = create;