var Record = function() {
	this.messages = {items:[]}; 
};

Record.prototype.add = function(item) {
	var len = this.messages.items.length;
	this.messages.items[len] = item;
};

Record.prototype.getItems = function() {
	return this.messages.items;
};

Record.prototype.read = function() {
	var fs = require('fs');
	var content = fs.readFileSync(__dirname + '/../database/record.json');
	this.messages = JSON.parse(content);
};


Record.prototype.save = function() {
	var fs = require('fs');
	fs.writeFileSync(__dirname + '/../database/record.json', JSON.stringify(this.messages, null, 2));
};

module.exports = Record;