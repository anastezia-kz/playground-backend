const express = require("express");
const ensureLogin = require('connect-ensure-login').ensureLoggedIn
const router = express.Router();
const PG = require('../models/Playground');
const Multer = require("multer");
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const s3 = new aws.S3();
const checkRoles = require('../passport/checkRole')

const uploader = new Multer({
  
  storage: multerS3({
    s3: s3,
    bucket: 'starbookbucket',
    acl: 'public-read',
    key: function(req, files, cb) {
      cb(null, Date.now().toString())
    }
  })
})  
.array('photo')

router.post('/addPG',ensureLogin('/auth/login'),uploader,(req,res) => {
  const photoTittles = []
  req.files.forEach(photo => {
    photoTittles.push(photo.location)
  })
  const newPG = new PG({
    address:req.body.address,
    photo:photoTittles,
    attributes:{
      slide:req.body.slide,
      swing:req.body.swing,
      rollerBungge:req.body.rollerBungge
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

router.get('/admin',  (req,res) =>{
  //checkRoles('ADMIN'), ^
  PG.find()
  .then(PG => {
    res.status(200).json({PG})
  })
  .catch(() => {
    res.status(404).json({message: "Something went wrong" })
  }) 
} )





module.exports =router;