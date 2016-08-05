var chat = require('./classes/chat')();
chat.init();
chat.setLoginPage('login');
chat.setMainPage('app');
chat.setBroadCast();
chat.listen(3000);