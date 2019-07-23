const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

    const userschema=new mongoose.Schema({
        firstname: {
            type: String   
        },
        lastname: { 
            type: String  
        },
        username: {  
            type: String  
        },
        gender: {  
            type: String  
        },
        phone: {  
            type: String  
        },
        address: {  
            type: String  
        },
        dob: {  
            type: String  
        },  
        email: {  
            type: String
        },
        password: {  
            type: String  
        },
        userType:{
            type: String
        },
        tokens: [{
            token : {
                type: String,
                required: true
            }
        }]
    });
  
   
    userschema.statics.checkCrediantialsDb = async (username, password) =>{

        const user1 = await User.findOne({username : username, password : password})
         return user1;
        }

        userschema.methods.generateAuthToken = async function(){
            const user = this
            const token = jwt.sign({_id:user._id.toString()}, 'logintoken')

            console.log(token);

            user.tokens = user.tokens.concat({token:token})
            await user.save()
            
            return token
        }
        
        const User = mongoose.model('User',userschema);
    module.exports = User;  