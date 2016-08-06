var Chat = require('./classes/chat'), chat = new Chat();
chat.init();
chat.setLoginPage('login');
chat.setMainPage('app');
chat.setBroadCast();
chat.listen(3000);