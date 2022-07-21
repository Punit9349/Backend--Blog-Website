const express=require('express');
const User= require('../models/User');
const router= express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt= require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser');

const JWT_SECRET = 'Harryisagoodb$oy';

// ROUTE 1: create a User using: POST "/api/auth/createuser". No login required.  
router.post('/createnewuser',[ 
     body('name','Enter a valid name').isLength({ min: 3 }),
     body('email', 'Enter a valid email').isEmail(),
     body('password','Password must be of atleast 5 characters').isLength({ min: 5 }),
    
    ], async (req,res)=>{ 
      let success=false;
        // If there are errors, return Bad requests and errors. 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ success,errors: errors.array() });
        }

        // check whether user with this email exists already
        try{
        let user= await User.findOne({email: req.body.email});
        console.log(user);
        if(user){
            return res.status(400).json({success, error: "Sorry a user with this email already exists"})
        }

        const salt= await bcrypt.genSalt(10);
        const secPass= await bcrypt.hash(req.body.password,salt);
        // create a new user
         user= await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
          });

          const data={
            user:{
              id: user.id
            }
          }

          const authToken= jwt.sign(data, JWT_SECRET);
          //console.log(jwtData);
          success=true;
          res.json({success,authToken});
          // res.json({user});
        } catch(error){
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    })


    // ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required.  
    router.post('/login',[ 
      body('email', 'Enter a valid email').isEmail(),
      body('password','Password can not be blank').exists(),
     
  ], async (req,res)=>{ 
    let success=false;

      // If there are errors, return Bad requests and errors. 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {email, password}= req.body;
      try {
        let user= await User.findOne({email});
        if(!user){
          success=false;
          return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        const passwordCompare= await bcrypt.compare(password,user.password);
        if(!passwordCompare){
          success=false;
          return res.status(400).json({ success,error: "Please try to login with correct credentials"});
        }

        const data={
          user:{
            id: user.id
          }
        }

        const authToken= jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success, authToken});

      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
      }
  })


  // ROUTE 3: Get loggedin user details  using: POST "/api/auth/getuser". Login required.  


  router.post('/getuser', fetchuser,  async (req,res)=>{ 

  try {
    userId= req.user.id;
    const user= await User.findById(userId).select("-password");
    res.send(user);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

})
    
module.exports=router