const express = require("express");
const ensureLogin = require('connect-ensure-login').ensureLoggedIn
const router = express.Router();
const PG = require('../models/Playground');
const Multer = require("multer");
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const s3 = new aws.S3();

const uploader = new Multer({
  
  storage: multerS3({
    s3: s3,
    bucket: 'starbookbucket',
    acl: 'public-read',
    key: function(req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

router.post('/add-photo',  uploader.single('photo'), (req,res) => {
  console.log("#############",req.file)
  // put ensureLogin back ^
  res.status(200).end()
  // if(!req.user) {
  //   res.status(400).json({message: 'authentication required'})
  // }
  // PG.updateOne({_id: req.pg.id}, {  photo: req.file && req.file.location})
  // .then(operation => {
  //   console.log('***********************', operation)
  //   res.status(200).json(operation)
  // })
  // .catch(e => {
  //   res.status(500).json({error: e})
  // })
  
})
  

router.post('/addPG',ensureLogin('/auth/login'),(req,res) => {
  const newPG = new PG({
    address:req.body.address,
    attributes:{
      slide:req.body.slide,
      swing:req.body.swing,
      rollerBungge:req.body.ollerBungge
    }
  });

  newPG.save()
  .then(PG => {
    res.status(200).json({PG})
  })
  .catch(() => {
    res.status(404).json({message: "Something went wrong" })
  })
})



const checkRoles = require('../passport/checkRole')

router.post('/adminpage',
checkRoles('ADMIN'),
(req, res, next) => {
    res.send('welcome to the admin page')
})

module.exports =router;