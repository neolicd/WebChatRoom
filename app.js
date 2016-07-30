var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



app.get('/', function (req, res){
	res.sendFile(__dirname+"/app.html");
});



io.on('connection', function(socket){
	socket.on('message', function(msg){
		io.emit('message', msg);
	});
});


http.listen(4000, function() {
	console.log("The application is running on port:4000");
});

