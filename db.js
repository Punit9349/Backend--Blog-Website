const mongoose= require('mongoose');
const mongoURI="mongodb+srv://iNote:Book123@cluster0.thuuv13.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo successfully");
    })
}

module.exports=connectToMongo;