const mongoose  = require('mongoose');

var Schema  = mongoose.Schema;

var ProductSchema = new Schema({
    imagePath: { type:String,required:true},
    product_id: { type:Number,required:true},
    title: { type:String,required:true},
    description: { type:String,required:true},
    manufacturer: { type:String,required:true},
    price: { type:Number,required:true},
});

module.exports = mongoose.model('Product', ProductSchema);