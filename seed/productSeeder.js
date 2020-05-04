var Product = require('../models/products');
var mongoose = require('mongoose');

//connect to mongodb
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/addToCart',{ useNewUrlParser: true}).then(() => console.log('connected')).catch((err)=>console.log('err'));
  

var products = [
    new Product({
        imagePath: 'https://i.ytimg.com/vi/9j2ptpwNECg/maxresdefault.jpg',
    product_id: 1111,
    title: 'Best cycle 1',
    description: 'Awesome product 1',
    manufacturer: 'aditya jain',
    price: 10.00,
    }),
    
    new Product ({
        imagePath: 'https://i.ytimg.com/vi/9j2ptpwNECg/maxresdefault.jpg',
    product_id: 1112,
    title: 'Best cycle 2',
    description: 'Awesome product 2',
    manufacturer: 'aditya jain',
    price: 9.00,
    }),
    
    new Product ({
        imagePath: 'https://i.ytimg.com/vi/9j2ptpwNECg/maxresdefault.jpg',
    product_id: 1113,
    title: 'Best cycle 3',
    description: 'Awesome product 3',
    manufacturer: 'aditya jain',
    price: 8.00,
    })
];

var done = 0;
for(var i = 0; i<products.length; i++){
    products[i].save(function(err,result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}

function exit (){
    mongoose.disconnect();
}