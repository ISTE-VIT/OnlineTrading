var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   cart : {type: Object, require: true}, 
   address : {type: String, require: true}, 
   name : {type: String, require: true}
});

module.exports = mongoose.model('Order', schema);

