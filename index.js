const express = require('express');
var path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongodb = require('mongodb');
//encrypting the password
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('./config/auth');


//order model
var Order = require('./models/order');
//passport config
require('./config/passport')(passport);
//User model
const User = require('./models/User');
//requiring product model
var Product = require('./models/products');

const app = express();

//adding static files like css
app.use('/css',express.static('css'));

//Express Session
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180*60*1000}    
}));

//connect-flash. Flash needs session hence should be below session. Flash messages weree earlier not displayed because they were place above session and also instead of connect flash wrong library was required.
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//static files from public folder
app.use(express.static(__dirname + '/public'));


//User model
var Product = require('./models/products');
var Cart = require('./models/cart');

//connect to mongodb
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/addToCart',{ useNewUrlParser: true}).then(() => console.log('connected')).catch((err)=>console.log('err'));
    


//ejs
app.set('view engine' , 'ejs');

//body-parser
app.use(express.urlencoded({ extended: false}));
var urlencodedParser = bodyParser.urlencoded({ extended: false});

//Global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

//global variable loggedin for all the views
app.use(function(req, res, next) {
	res.locals.loggedIn = req.isAuthenticated();
	res.locals.session = req.session;
	next();
});

//routes
app.get('/index',function(req,res){
    var successMsg = req.flash('success')[0];
      Product.find(function(err,docs){
        var productChunks = [];
          var chunkSize = 3;
          for(var i = 0; i<docs.length; i = i+chunkSize){
              productChunks.push(docs.slice(i, i+chunkSize));
          }
      res.render('index', {products: productChunks, successMsg: successMsg, noMsg: !successMsg });
    }); 
});

app.get('/automobile',function(req,res){
      Product.find(function(err,docs){
        var productChunks = [];
          var chunkSize = 3;
          for(var i = 0; i<docs.length; i = i+chunkSize){
              productChunks.push(docs.slice(i, i+chunkSize));
          }
      res.render('AutomobileTest', {products: productChunks});
    }); 
});

app.get('/fashion',function(req,res){
    Product.find(function(err,docs){
      var productChunks = [];
        var chunkSize = 3;
        for(var i = 0; i<docs.length; i = i+chunkSize){
            productChunks.push(docs.slice(i, i+chunkSize));
        }
    res.render('FashionTest', {products: productChunks});
  }); 
});

app.get('/home',function(req,res){
    Product.find(function(err,docs){
      var productChunks = [];
        var chunkSize = 3;
        for(var i = 0; i<docs.length; i = i+chunkSize){
            productChunks.push(docs.slice(i, i+chunkSize));
        }
    res.render('HomeTest', {products: productChunks});
  }); 
});

app.get('/sports',function(req,res){
    Product.find(function(err,docs){
      var productChunks = [];
        var chunkSize = 3;
        for(var i = 0; i<docs.length; i = i+chunkSize){
            productChunks.push(docs.slice(i, i+chunkSize));
        }
    res.render('SportsTest', {products: productChunks});
  }); 
});

app.get('/beauty',function(req,res){
    Product.find(function(err,docs){
      var productChunks = [];
        var chunkSize = 3;
        for(var i = 0; i<docs.length; i = i+chunkSize){
            productChunks.push(docs.slice(i, i+chunkSize));
        }
    res.render('BeautyTest', {products: productChunks});
  }); 
});

app.get('/',function(req,res){
    var successMsg = req.flash('success')[0];
      Product.find(function(err,docs){
        var productChunks = [];
          var chunkSize = 3;
          for(var i = 0; i<docs.length; i = i+chunkSize){
              productChunks.push(docs.slice(i, i+chunkSize));
          }
      res.render('landingpage2', {products: productChunks, successMsg: successMsg, noMsg: !successMsg });
    }); 
});


app.get('/admin' ,function(req,res){
      res.render('admin');
});

app.post('/admin', urlencodedParser, (req,res) =>{
    const{imagePath,
         product_id,
         title,
         description,
         manufacturer,
         price,
        category } = req.body;
        
        const newProduct = new Product({
                            imagePath,
                             product_id,
                             title,
                             description,
                             manufacturer,
                             price,
                             category
                        });
                console.log(newProduct);
                //save user
                    newProduct.save()
                    .then(user=>{
                       req.flash('success_msg', 'Product saved successfully');
                       res.redirect('/admin');
                    })
                    .catch(err => console.log(err));
                
    });



app.get('/addTocart/:id', function(req,res){
      var productId = req.params.id;
      var cart = new Cart(req.session.cart ? req.session.cart : {} );
      
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
        res.redirect('addtocart');
});


app.get('/shoppingCart/', function(req,res,next){
   if(!req.session.cart){
       return res.render('emptyCart');
   } 
    var cart = new Cart(req.session.cart);
    res.render('addtocart', {products: cart.generateArray(),totalPrice: cart.totalPrice});
});


app.get('/checkout', isLoggedIn, function(req,res,next){
   if(!req.session.cart){
       return res.redirect('/');
   } 
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('checkout', {products: cart.generateArray(),totalPrice: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

app.post('/checkout', isLoggedIn, function(req,res,next){
  if(!req.session.cart){
       return res.redirect('addtocart');
   } 
    var cart = new Cart(req.session.cart);
    
    var stripe = require('stripe')('sk_test_nyrMppk4c6wXK9vWBNnNk7NW00DEyxm8RD');

// `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
stripe.charges.create(
  {
    amount: cart.totalPrice * 100,
    currency: 'inr',
    source: req.body.stripeToken,
    description: 'My First Test Charge',
  },
  function(err, charge) {
      var order = new Order({
			user: req.user,
			cart: req.session.cart,
			name: req.body.name,
			address: req.body.address,
			paymentId: charge.id
		});
		order.save(function(err, result) {
			if(err)
			{
				req.flash('error', err.message);
	  			return res.redirect('/checkout');
			}
		});
      if(err){
          req.flash('error', err.message);
          return res.redirect('/checkout');
          
  }
      req.flash('success', 'Successfully bought product!!');
      req.session.cart = null;
      res.redirect('/');
      console.log('Successfully bought product!!');
  });
});

app.get('/login',notLoggedIn,function(req,res){
      res.render('login.ejs');
});
 
app.get('/signup', notLoggedIn,function(req,res){
      res.render('signup');
});

app.get('/profile', isLoggedIn, function(req, res, next) {
	Order.find({'user': req.user}, function(err, orders) {
		if(err)
		{
			res.write('error');
		}
		var cart;
		orders.forEach(function(order) {
			var cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		res.render('profile', { orders: orders });	
	});
});


app.post('/signup',(req,res) =>{
    const{username, 
          email, 
          password, 
          password2 } = req.body;
    let errors = [];
    
    //check required field
    if(!username || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'});
    }
    
    //check password match
    if(password !== password2){
        errors.push({msg:'Passwords do not match'});
    }
    //check password length
    if(password.length < 6){
        errors.push({msg:'Password shoud be atleast 6 characters'});
    }
    if(errors.length > 0){
        res.render('signup', { errors,
                                username,
                                email,
                                password,
                                password2
        });
    }
    else{
        //when validation is passed
        //checking if user already registered
        User.findOne({ email:email })
        .then(user =>{
            if(user){
                errors.push({msg: 'Email already registered'})
                 res.render('signup', { errors,username,email,password,password2
        });
            } else{
                const newUser = new User({
                    username,
                    email,
                    password
                });
                console.log(newUser);
                //hashing the password
                bcrypt.genSalt(10,(err,salt)=> bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err) throw err;
                    //set password to hashed
                    newUser.password = hash;
                    //save user
                    newUser.save()
                    .then(user=>{
                       req.flash('success_msg', 'You are now registered and can login');
                       res.redirect('/login');
                    })
                    .catch(err => console.log(err));
                }))
            }
        })
    }
});

//Login Handle Post
app.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true,
    })(req,res,next);
});

//logout handle
app.get('/logout',isLoggedIn,(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out.');
    res.redirect('/');
})

function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated())
		return next();
	res.redirect('/login');
}

function notLoggedIn(req, res, next)
{
	if(!req.isAuthenticated())
		return next();
	res.redirect('/');
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 6969;
}
app.listen(port);
console.log('listening to magic port 6969');