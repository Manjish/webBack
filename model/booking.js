const mongoose = require('mongoose');

const bookingschema=new mongoose.Schema({
    bookingUsername: {
        type: String   
    },
    bookingHosId: { 
        type: String  
    },
    bookingDepartment:{
        type:String
    },
    bookingDocId:{
        type: String
    },
    bookingDate: {  
        type: String  
    },
    bookingStatus: {  
        type: String  
    }
});

const Booking = mongoose.model('Booking',bookingschema);
module.exports = Booking