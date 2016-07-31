var Chat = function() {
	this.app = require('express')();
	this.http = require('http').Server(this.app);
	this.io = require('socket.io')(this.http);
}

Chat.prototype.setHomePage = function(fileName) {
	this.app.get('/', function (req, res){
		res.sendFile(__dirname + "/" + fileName);
	});
};

Chat.prototype.setBroadCast = function() {
	var __this = this;
	__this.io.on('connection', function(socket){
		socket.on('message', function(msg){
			__this.io.emit('message', msg);
		});
	});
};

Chat.prototype.listen = function(portNum) {
	this.http.listen(portNum, function() {
		console.log("The application is running on port:" + portNum);
	});
};

var chat = new Chat();
chat.setHomePage("app.html");
chat.setBroadCast();
chat.listen(4000);






