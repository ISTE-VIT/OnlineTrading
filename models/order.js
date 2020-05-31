var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   user: {type: Schema.Types.ObjectId, ref: 'User'},
   cart : {type: Object, require: true}, 
   address : {type: String, require: true}, 
   name : {type: String, require: true},
   paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);


