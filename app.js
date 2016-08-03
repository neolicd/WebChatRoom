var Record = function() {
	this.messages = {items:[]}; 
};

Record.prototype.add = function(item) {
	var len = this.messages.items.length;
	this.messages.items[len] = item;
};

Record.prototype.getItems = function() {
	return this.messages.items;
}

Record.prototype.read = function() {
	var fs = require('fs');
	var content = fs.readFileSync('record.json');
	this.messages = JSON.parse(content);
}


Record.prototype.save = function() {
	var fs = require('fs');
	fs.writeFileSync('record.json', JSON.stringify(this.messages, null, 2));
}

var Chat = function() {
	this.app = require('express')();
	this.http = require('http').Server(this.app);
	this.io = require('socket.io')(this.http);
	this.record = new Record();
}

Chat.prototype.setHomePage = function(fileName) {
	this.app.get('/', function (req, res){
		res.sendFile(__dirname + "/" + fileName);
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


var chat = new Chat();
chat.setHomePage("app.html");
chat.setBroadCast();
chat.listen(3000);
