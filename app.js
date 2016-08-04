var Chat = require('./classes/chat.js');
var chat = new Chat();
chat.init();
chat.setHomePage(__dirname + '/views/' + 'app.html');
chat.setBroadCast();
chat.listen(3000);