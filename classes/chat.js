var Chat = function() {};

Chat.prototype.init = function() {
    this.express = require('express');
    this.app = this.express();
    this.http = require('http').Server(this.app);
    this.io = require('socket.io')(this.http);

    var cookieParser = require('cookie-parser');
    this.app.use(cookieParser());



    var Datastore = require('nedb');
    this.db = new Datastore({filename: 'database/record'});
    this.db.loadDatabase(function(err){
        if(err) throw err;
    });

    this.db.remove({}, {multi:true}, function(err, numRemoved) {
        if(err) throw err;
    });




    
    this.app.use(this.express.static('public'));
    this.app.set('view engine', 'ejs');

    var bodyParser = require('body-parser');
    this.app.use(bodyParser.urlencoded({extended:false}));
    this.app.use(bodyParser.json());
};

Chat.prototype.setLoginPage = function(fileName) {
    this.app.get('/', function(req, res) {
        if(Object.keys(req.cookies) == 0) {
            res.render(fileName);
        }
        else {
            res.render('redirect', {
                uID: req.cookies.cookieUID
            });
        }
    });
};

Chat.prototype.setMainPage = function(fileName) {
    this.app.post('/main', function(req, res) {
        res.cookie('cookieUID', req.body.uID, {maxAge: 2 * 60 *1000});
        res.render(fileName, {
            uID: req.body.uID
        });
        
        //res.end();
    });
};

Chat.prototype.setBroadCast = function() {
    var __this = this;
    __this.io.on('connection', function(socket){
        __this.db.find({}, function(err, docs) {
            if(err) throw err;
            var len = docs.length;
            for(var i = 0; i<len; i++){
                socket.emit('chat message', docs[i]);
            }
        })

        socket.on('chat message', function(item){
            __this.db.insert(item);
            __this.io.emit('chat message', item);
        });
    });
};

Chat.prototype.listen = function(portNum) {
    this.http.listen(portNum, function() {
        console.log("The application is running on port:" + portNum);
    });
};


module.exports = Chat;