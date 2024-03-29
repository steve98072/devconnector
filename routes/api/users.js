const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key');
const passport = require('passport');

//Load input validator
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


//Load user model
const User = require('../../models/User');

// @route GET api/users/test
// @desc Tests post route
// access Public
router.get('/test', (req, res) => {
  res.json(
    {
      msg: 'Users Works'
    }
  );
});

// @route POST api/users/register
// @desc Register User
// access Public
router.post('/register', (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);
  
  // check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if(user){
        errors.email = "Email already exisits" 
        return res.status(400).json({errors});
      }else{
        const avatar = gravatar.url(req.body.email, {
            s: '200', //Size
            r: 'pg', //rating
            d: 'mm' //default
        });

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
            })
        })
      }
    });
});

// @route POST api/users/login
// @desc Login User
// access Public
router.post('/login', (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);
  
  // check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({email})
    .then(user => {
      //Check for user
      if(!user){
        errors.email = 'User not found!'
        return res.status(404).json({errors});
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            //use matched
            //res.json({msg: 'Success'});
            const payload = {id: user.id, name: user.name, avatar: user.avatar }
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) =>{
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });

          }else{
            errors.password = 'Password incorrect!'
            return res.status(400).json({errors});
          }
        });
    });

});

// @route POST api/users/current
// @desc Return Current User
// access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;