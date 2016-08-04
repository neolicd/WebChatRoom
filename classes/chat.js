var Chat = function() {};

Chat.prototype.init = function() {
	this.express = require('express');
	this.app = this.express();
	this.http = require('http').Server(this.app);
	this.io = require('socket.io')(this.http);
	this.record = new (require('./record.js'))();
	this.app.use(this.express.static('public'));
};

Chat.prototype.setHomePage = function(filePath) {
	this.app.get('/', function (req, res){
		res.sendFile(filePath);
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

module.exports = Chat;