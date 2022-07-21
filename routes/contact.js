const express=require('express');
const router= express.Router();
const Contact= require('../models/Contact');
// const { body, validationResult } = require('express-validator');

// ROUTE 2: Add a new Note using: Post "/api/contact/contactdetails"
router.post('/contactdetails', [
    // body('name','Enter a valid title').isLength({ min: 3 }),
    // body('message','Description must be of atleast 5 characters').isLength({ min: 5 }), 
] , async (req, res)=>{

    try {
        

     const {name, email, phone }=req.body;
     // If there are errors, return Bad requests and errors. 
    //  const errors = validationResult(req);
    //  if (!errors.isEmpty()) {
    //    return res.status(400).json({ errors: errors.array() });
    //  }
    
    const contact= new Contact({
        name, email, phone: req.body
    })
    // const contact= await Contact.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     phone: req.body.phone,
    //     // message:req.body.message
    //   });


     const savedContact= await contact.save(); 
     
    
    res.json(savedContact)


 } catch (error) {

    console.error(error.message);
    res.status(500).send("Internal server error");

 }

})

module.exports=router