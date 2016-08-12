var Chat = function() {};


//Intialization
Chat.prototype.init = function() {
    //initialize express, http and socket.io modules
    this.express = require('express');
    this.app = this.express();
    this.http = require('http').Server(this.app);
    this.io = require('socket.io')(this.http);

    //for ordering the database items
    this.nextItemNum = 0;

    //map: userID => socketId
    this.mapUserSocket = {};

    //map: userID => timePoint
    this.mapUserTime = {};

    //for recording the entering time point of each user
    //this.timeMap = {};

    //for parse cookie
    var cookieParser = require('cookie-parser');
    this.app.use(cookieParser());


    //Initialize database
    var Datastore = require('nedb');
    this.db = new Datastore({filename: 'database/record'});
    this.db.loadDatabase(function(err){
        if(err) throw err;
    });

    //clear the existing database record
    this.db.remove({}, {multi:true}, function(err, numRemoved) {
        if(err) throw err;
    });




    //set static folder
    this.app.use(this.express.static('public'));
    this.app.set('view engine', 'ejs');

    //for parsing post request
    var bodyParser = require('body-parser');
    this.app.use(bodyParser.urlencoded({extended:false}));
    this.app.use(bodyParser.json());
};


//if request for '/' without cookies, send the login page
//if request for '/' with cookies, redirect to the chatroom
Chat.prototype.setLoginPage = function(fileName) {
    this.app.get('/', function(req, res) {
        //if no cookie, send login page
        if(Object.keys(req.cookies) == 0) {
            res.render(fileName);
        }
        //if have cookie, redirect to chatroom
        else {
            res.render('redirect', {
                uID: req.cookies.cookieUID
            });
        }
    });
};


//if use POST method to request for '/main'
//then send the cookie {cookieUID: [user's typein]}
//and send the chat page
Chat.prototype.setMainPage = function(fileName) {
    this.app.post('/main', function(req, res) {
        res.cookie('cookieUID', req.body.uID, {maxAge: 2 * 60 *1000});
        res.render(fileName, {
            uID: req.body.uID
        });
        
        //res.end();
    });
};


//if a new client connects to the server
//then create a socket at the server side
//and send the chat record using database
//and append a event listener {if an item named 'chat message' comes, broadcast it to all} 
Chat.prototype.setBroadCast = function() {
    var __this = this;
    __this.io.on('connection', function(socket){
        var userID = socket.handshake.query.userID;

        //record the userID => socketID
        //and userID => time point the user enter the chat room
        __this.mapUserSocket[userID] = socket.id;
        if(__this.mapUserTime[userID] == undefined) {
            __this.mapUserTime[userID] = __this.nextItemNum;
        }
        //console.log(__this.mapUserSocket);
        //console.log(__this.mapUserTime);
        //console.log(typeof socket.handshake.query.userID);


        //send chat record
        __this.db.find({}).sort({num:1}).exec(function(err, docs) {
            if(err) throw err;
            var len = docs.length;
            //console.log(docs);

            //send user all the messages from when he/she enter the chat room
            for(var i = __this.mapUserTime[userID]; i < len; i++) {
                socket.emit('chat message', docs[i]);
            }
        });

        //append event listener
        socket.on('chat message', function(item){
            item.num = __this.nextItemNum++;
            __this.db.insert(item);
            //console.log(socket.id);
            __this.io.emit('chat message', item);
        });
    });
};


//listen to port: portNum
Chat.prototype.listen = function(portNum) {
    this.http.listen(portNum, function() {
        console.log("The application is running on port:" + portNum);
    });
};


module.exports = Chat;