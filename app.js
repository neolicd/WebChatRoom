var express = require("express");
var app = express();

app.get('/', function (req, res){
	res.sendFile(__dirname+"/app.html");
});

app.listen(3000, function() {
	console.log("The application is running on port:3000");
});