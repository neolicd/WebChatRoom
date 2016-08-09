var Method = {};
//modify the message format
Method.formatMessage = function(item) {
    return '<li>' + '<div class="header">' +
                        '<span class="name">' + item.name + '</span>' + 
                        '<span class="time">' + item.time + '</span>' +
                    '</div>' +
                    '<p>' + item.msg + '</p>' +

          '</li>';
};

//modify the date format
Method.formatDate = function(date) {
    var h = date.getHours();
    var ap = '';
    if(h < 12) {
        ap = 'AM';
    }
    else {
        h -= 12;
        ap = 'PM';
    }
    var m = date.getMonth() + 1;
    if(m < 10){
        m = '0' + m;
    }
    var d = date.getDate();
    if(d < 10) {
        d = '0' + d;
    }
    return m + '.' + d + '.' +date.getFullYear() +
            ' ' + h + ':' + date.getMinutes() + ap;
};
//Sock class is for socket management
var Sock = function () {
    this.socket = io();
};

//set the userID
Sock.prototype.setUserID = function(uID) {
    this.uID = uID;
}


//if click the submit button, send the sever a message together with user ID and date
Sock.prototype.setSubmitAction = function() {
    var __this = this;
    $('button').click(function() {
        __this.socket.emit('chat message', {name:__this.uID,time:Method.formatDate(new Date()),msg:$('#m').val(),num:0});
        $('#m').val('');
    });
};

//if receive 'chat message', append it to the chat box
Sock.prototype.setReceiveAction = function() {
    this.socket.on('chat message',function(item){
        var $messages = $('#messages');
        $messages.append(Method.formatMessage(item));
        // var element = document.getElementById('messages');
        // element.scrollTop = element.scrollHeight;
        $messages.scrollTop($messages.get(0).scrollHeight);
    });
};