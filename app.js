var Chat = function() {
	this.app = require('express')();
	this.http = require('http').Server(this.app);
	this.io = require('socket.io')(this.http);
}

Chat.prototype.setHomePage = function() {
	this.app.get('/', function (req, res){
		res.sendFile(__dirname+"/app.html");
	});
};

Chat.prototype.setBroadCast = function(io) {
	io = this.io;
	io.on('connection', function(socket){
		socket.on('message', function(msg){
			io.emit('message', msg);
		});
	});
};

Chat.prototype.listen = function() {
	this.http.listen(3000, function() {
		console.log("The application is running on port:3000");
	});
};

var chat = new Chat();
chat.setHomePage();
var io;
chat.setBroadCast(io);
chat.listen();






