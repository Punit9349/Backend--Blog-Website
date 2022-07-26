const express=require('express');
const router= express.Router();
const Contact= require('../models/Contact');
const { body , validationResult} = require('express-validator');

// ROUTE 2: Add a new Note using: Post "/api/contact/contactdetails"
router.post('/contactdetails', [
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('phone','Phone no must be of 10 characters').isLength({ min: 10, max: 10 }), 
] , async (req, res)=>{

  let success=false;
  // If there are errors, return Bad requests and errors. 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success,errors: errors.array() });
  }

    try {
        
    console.log(req.body);
    const contact= await Contact.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message:req.body.message
      });


      const savedContact= await contact.save(); 
      
      console.log(savedContact);
    
      res.json(savedContact)


 } catch (error) {

    console.error(error.message);
    res.status(500).send("Internal server error");

 }

})

module.exports=router