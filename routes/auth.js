const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.post("/login", (req, res,next) =>{
  passport.authenticate("local", (err, user) => {
    if(err){return next(err)}
    if (!user){return res.status(401).json({error:'user not authenticated'});}
    req.logIn(user, function(err){
      if (err){return next(err);}
      return res.status(200).json(user);
    });
  })(req, res,next)
})


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.status(401).json({ message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.status(409).json({ message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
    .then((user) => {
      res.status(200).json({user})
      //res.redirect("/");
    })
    .catch(err => {
      res.status(404)({ message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({message:'User logged out'});
});

router.get("/isLoggedIn", (req, res) => {
  req.isAuthenticated() ? res.status(200).json(req.user) : res.status(403).json({message: "please authenticate"}) 
})

module.exports = router;
