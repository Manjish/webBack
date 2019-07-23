const mongoose = require('mongoose');

const doctorschema=new mongoose.Schema({
    docName: {
        type: String   
    },
    docDetails:{
        type: String
    },
    docEducation: { 
        type: String  
    },
    docHosName: {  
        type: String  
    },
    docDepartment: {  
        type: String  
    },
    docImage:{
        type: String
    },
    docAvailable: [{
        time : {
            type: String,
            required: true
        }
    }]
});

const Doctor = mongoose.model('Doctor',doctorschema);
module.exports = Doctor