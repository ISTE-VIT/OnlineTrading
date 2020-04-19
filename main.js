const express = require('express');
const mongoose = require('mongoose');
//encrypting the password
const bcrypt = require('bcryptjs');
//for dislaying message
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/auth');

const app = express();

//passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//User model
const User = require('./models/User');

//connect to mongodb
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/loginData',{ useNewUrlParser: true}).then(() => console.log('connected')).catch((err)=>console.log('err'));
    


//ejs
app.set('view engine' , 'ejs');

//body-parser
app.use(express.urlencoded({ extended: false}));

//Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//adding static files like css
app.use('/css',express.static('css'));

//routes
app.get('/',function(req,res){
      res.render('welcome1');
});
app.get('/login',function(req,res){
      res.render('login');
});
app.get('/signup',function(req,res){
      res.render('signup');
});
app.get('/dashboard',ensureAuthenticated,function(req,res){
    res.render('dashboard',{user:req.user});
})
app.post('/signup', (req,res) =>{
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
        successRedirect:'/dashboard',
        failureRedirect:'/login',
        failureFlash:true,
    })(req,res,next);
});

//logout handle
app.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out.');
    res.redirect('/login');
})
 

app.listen(3000);
console.log('listening to magic port 3000');