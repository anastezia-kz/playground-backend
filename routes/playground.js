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
  console.log(req.body)
  const photoTittles = []
  req.files.forEach(photo => {
    photoTittles.push(photo.location)
  })
  const playground =
    {
      
      photo:photoTittles,
      attributes:{
        slide:req.body.slide,
        swing:req.body.swing,
        rollerBungge:req.body.rollerBungge,
        sander:req.body.sander,
        toilet:req.body.toilet,
        pitch:req.body.pitch
  
      }
    }
  if (req.body.lat&&req.body.lng) {
    playground.coordinates={lat:req.body.lat,lng:req.body.lng}
  }
  
  const newPG = new PG(
    playground
  );

  newPG.save()
  .then(PG => {
    
    res.status(200).json({PG})
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: "Something went wrong" })
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


router.get('/approvedPlaygrounds',  (req,res) =>{
  PG.find({ "approved": true })
  .then(PG => {
    res.status(200).json({PG})
  })
  .catch(() => {
    res.status(404).json({message: "Something went wrong" })
  }) 
} )


router.get('/admin/filter', (req,res) => {
  if (req.query.filterApproved === "all") {
    PG.find()
    .then(PG => {
      res.status(200).json({PG})
    })
    .catch(() => {
      res.status(404).json({message: "Something went wrong" })
    })
  } else {
    let filter = { "approved": req.query.filterApproved }
    PG.find( filter )
    .then(PG => {
      res.status(200).json({PG})
    })
    .catch(() => {
      res.status(404).json({message: "Something went wrong" })
    })
  }
})

router.get('/admin/edit/:id', (req,res) =>{
  
  PG.findById(req.params.id)
  .then(PG => {
    //console.log(photoTittles)
    const {photo, coordinates, attributes, approved}= PG
    res.status(200).json({photo, coordinates, attributes, approved})
  })
  .catch(() => {
    res.status(404).json({message: "Something went wrong" })
  })
})

router.post('/admin/edit/:id', (req,res) => {
  const { coordinates, attributes,approved} = req.body
  PG.findByIdAndUpdate(
    {_id:req.params.id}, { coordinates, attributes,approved},{new:true}
  )
  .then(PG => {
    res.status(200).json({PG})
  })
  .catch(() => {
    res.status(404).json({message: "Something went wrong" })
  })
  res.status(200).json({})
})


router.get('/deletePG/:id' , (req,res) => {
  PG.deleteOne( {_id:req.params.id})
  .then( (PG) => {
    res.status(200).json({PG})
  })
  .catch(() => {
    res.status(404).json({message: "Something went wrong" })
  })
})

module.exports =router;