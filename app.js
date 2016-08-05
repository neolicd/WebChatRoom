var Chat = require('./classes/chat.js');
var chat = new Chat();
chat.init();
chat.setLoginPage('login');
chat.setMainPage('app');
chat.setBroadCast();
chat.listen(3000);