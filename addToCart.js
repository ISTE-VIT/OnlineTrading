const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);

const app = express();

//User model
const Product = require('./models/products');
const Cart = require('./models/cart');

//connect to mongodb
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/addToCart',{ useNewUrlParser: true}).then(() => console.log('connected')).catch((err)=>console.log('err'));
    


//ejs
app.set('view engine' , 'ejs');

//body-parser
app.use(express.urlencoded({ extended: false}));

//Express Session
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180*60*1000}    
}));

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

//routes
app.get('/',function(req,res){
      Product.find(function(err,docs){
        var productChunks = [];
          var chunkSize = 3;
          for(var i = 0; i<docs.length; i = i+chunkSize){
              productChunks.push(docs.slice(i, i+chunkSize));
          }
      res.render('index', {products: productChunks});
    }); 
});

app.get('/addTocart/:id', function(req,res){
      var productId = req.params.id;
      var cart = new Cart(req.session.cart ? req.session.cart : {items:{}} );
      
      Product.findById(productId, function(err, product){
          if(err){
              return res.redirect('/');
          }
          cart.add(product, product.id);
          req.session.cart = cart;
          console.log(req.session.cart);
          res.redirect('/');
      });
});

app.get('/reduce/:id',function(req,res,next){
               var productId = req.params.id;
      var cart = new Cart(req.session.cart ? req.session.cart : {} );
        
        cart.reduceByOne(productId);
        req.session.cart = cart;
        res.redirect('addtocart');
});

app.get('/remove/:id',function(req,res,next){
               var productId = req.params.id;
      var cart = new Cart(req.session.cart ? req.session.cart : {} );
        
       
        cart.removeItem(productId);
        req.session.cart = cart;
        res.render('addtocart');
});


app.get('/shoppingCart/', function(req,res,next){
   if(!req.session.cart){
       return res.render('addtocart',{product:null});
   } 
    var cart = new Cart(req.session.cart);
    res.render('addtocart', {products: cart.generateArray(),totalPrice: cart.totalPrice});
});


app.get('/checkout', function(req,res,next){
   if(!req.session.cart){
       return res.redirect('addtocart');
   } 
    var cart = new Cart(req.session.cart);
    res.render('checkout', {products: cart.generateArray(),totalPrice: cart.totalPrice});
});

app.listen(6969);
console.log('listening to magic port 6969');