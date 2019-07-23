const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const multer = require('multer')


const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(cors());

require('./DB/db');
const User = require('./model/user');
const Hospital = require('./model/hospital');
const Doctor = require('./model/doctor');
const Booking = require('./model/booking');
const auth = require('./middleware/auth');

/* Route for image folder */
app.use("/uploads", express.static("public/uploads"))

app.use(bodyParser.urlencoded({
  extended: false
}))


/* User Routes Start */

app.post("/login", async function (req, res) {
  try {
    const user = await User.checkCrediantialsDb(req.body.username,
      req.body.password)
    if (user) {
      const token = await user.generateAuthToken(); //generateAuthToken chnage
      res.send({
        "token":token,
        "userType":user.userType
      });
    } else {
      res.json("")
    }
  } catch (e) {
    console.log(e)
  }
})

app.get("/users/me", auth, function (req, res) {
  res.send(req.user)
})

app.put('/updateProfile/:userId',auth,(req,res)=>{
  userId = req.params.userId;
  User.findByIdAndUpdate(userId,req.body,{new:true}).then(function(){ 
    res.json("Success");
}).catch(function(e){
 res.send(e)
});
})

app.post('/register', (req, res) => {
  var user = new User(req.body);
  user.save();
  res.json("success");
});

app.post('/logout', auth, async (req, res) => {
  try {
      req.user.tokens = []
      await req.user.save()
      res.send()
  } catch (e) {
      res.status(500).send()
  }
})

app.get('/getAllUsers',(req,res)=>{
  User.find({userType:"user"}).then(function(user){
    res.send(user);
  }).catch(function(e){
    res.send(e);
  })
})

/* User Routes End */


/* Hospital Routes Start */

app.get('/getAllHospitals', function (req, res) {
  Hospital.find().then(function (hospitals) {
    res.send(hospitals);
  }).catch(function (e) {
    res.send(e)
  });
});

app.get('/getSingleHospital/:id',(req,res)=>{
  hosId = req.params.id.toString();
        Hospital.findById(hosId).then(function(hospital){ 
            res.send(hospital);
        }).catch(function(e){
         res.send(e)
        });
})

var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, callback) => {
      let ext = path.extname(file.originalname);
      callback(null, "img" + '-' + Date.now() + ext);
  }
});

var imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('You can upload only image files!'), false);
  }
  cb(null, true);
};

var upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 1000000 }
});

app.post('/uploadHosImage', upload.single('imageFile'), auth,(req, res) => {
  res.json(req.file)
 })
 
 app.post('/addHospital',auth,(req,res)=>{
  var hosName = req.body.hosName;
  var hosDetails = req.body.hosDetails;
  var hosAddress = req.body.hosAddress;
  var hosContact = req.body.hosContact;
  var hosEmail = req.body.hosEmail;
  var hosWebsite = req.body.hosWebsite;
  var hosImage = req.body.hosImage;

  var stringDept = req.body.hosDepartmentsString;
  var deptArray = stringDept.split(',');
  var hosDepartments = [];
  deptArray.forEach(element => {
    hosDepartments=hosDepartments.concat({department:element});  
  });
  
  var hospital = new Hospital({hosName,hosDetails,hosAddress,hosContact,hosEmail,hosWebsite,hosImage,hosDepartments});
  hospital.save();
  res.json("success");
 })

 app.put('/editHospital/:hosId',auth,(req,res)=>{
  var hosId=req.params.hosId;
  var hosName = req.body.hosName;
  var hosDetails = req.body.hosDetails;
  var hosAddress = req.body.hosAddress;
  var hosContact = req.body.hosContact;
  var hosEmail = req.body.hosEmail;
  var hosWebsite = req.body.hosWebsite;
  var hosImage = req.body.hosImage;

  console.log(hosId)

  var stringDept = req.body.hosDepartmentsString;
  var deptArray = stringDept.split(',');
  var hosDepartments = [];
  deptArray.forEach(element => {
    hosDepartments=hosDepartments.concat({department:element});  
  });
  var hospital = {hosName,hosDetails,hosAddress,hosContact,hosEmail,hosWebsite,hosImage,hosDepartments};
  Hospital.findByIdAndUpdate(hosId,hospital,{new:true}).then(function(){ 
    res.json("Success");
}).catch(function(e){
 res.send(e)
});
 })

 app.delete('/deleteHospital/:id',(req,res)=>{
  var hosid = req.params.id.toString();
       Hospital.findByIdAndDelete(hosid).then(function(hospital){
       res.send("DELETED");  
       })
})

app.get('/getDepartments/:id',(req,res)=>{
  id = req.params.id
  Hospital.findById(id).then(function(hospital){ 
      res.send(hospital);
  }).catch(function(e){
   res.send(e)
  });
 })

 /* Hospital Routes End */


 /* Doctor Routes Start */

 app.put('/editDoctor/:docId',auth,(req,res)=>{
  var docId=req.params.docId;
  var stringTime = req.body.docAvailable;
  var timeArray = stringTime.split(',');
  var docAvailable = [];
  timeArray.forEach(element => {
    docAvailable=docAvailable.concat({time:element});  
  });
  req.body.docAvailable=docAvailable;
  Doctor.findByIdAndUpdate(docId,req.body,{new:true}).then(function(){ 
    res.json("Success");
}).catch(function(e){
 res.send(e)
});
 });

 app.post('/uploadDocImage', upload.single('imageFile'), auth,(req, res) => {
  res.json(req.file)
 })

 app.post('/addDoctor',auth,(req,res)=>{
  var docName = req.body.docName;
  var docDetails = req.body.docDetails;
  var docEducation = req.body.docEducation;
  var docHosName = req.body.docHosName;
  var docDepartment = req.body.docDepartment;
  var docImage = req.body.docImage;

  var availableTime = req.body.docAvailable;
  var availableArray=availableTime.split(',');
  var docAvailable=[];
  availableArray.forEach(element=>{
    docAvailable=docAvailable.concat({time:element});
  })  
  var doctor = new Doctor({docName,docDetails,docEducation,docHosName,docDepartment,docImage,docAvailable});
  doctor.save();
  res.json("success");
 })

 app.delete('/deleteDoctor/:id',(req,res)=>{
  var docid = req.params.id.toString();
       Doctor.findByIdAndDelete(docid).then(function(doctor){
       res.send("DELETED");  
       })
})

 app.get('/getDoctorBy/:hosId/:departmentName',(req,res)=>{
  hosId = req.params.hosId
  departmentName = req.params.departmentName
  Doctor.find({docHosName:hosId,docDepartment:departmentName}).then(function(doctor){ 
      res.send(doctor);
  }).catch(function(e){
   res.send(e)
  });
 })

 app.get('/getDoctorById/:docId',(req,res)=>{
   docId = req.params.docId
   Doctor.findById(docId).then((doctor)=>{
     res.send(doctor);
   }).catch((e)=>{
     res.send(e);
   })
 })

 app.get('/getDoctors/:hosId',(req,res)=>{
   hosId=req.params.hosId;
   Doctor.find({docHosName:hosId}).then(function(doctor){
     res.send(doctor);
   }).catch(function(e){
     res.send(e);
   })
 })

 app.get('/getAllDoctors', function (req, res) {
  Doctor.find().then(function (doctors) {
    res.send(doctors);
  }).catch(function (e) {
    res.send(e)
  });
});

/* Doctor Routes End */


/* Booking Routes Start */

 app.post('/checkBooking',(req,res)=>{
   var bookingUsername=req.body.bookingUsername;
   var bookingHosId=req.body.bookingHosId;
   var bookingDepartment=req.body.bookingDepartment;
   var bookingDocId=req.body.bookingDocId;
   var bookingDate=req.body.bookingDate;
   Booking.findOne({
     bookingUsername:bookingUsername,
     bookingHosId:bookingHosId,
     bookingDepartment:bookingDepartment,
     bookingDocId:bookingDocId,
     bookingDate:bookingDate
  }).then(function(booking){
    if(booking){
    res.json("Found")
    }else{
      res.json("Not found")
    }
  });
 })

 app.post('/addBooking',(req,res)=>{
  var booking = new Booking(req.body);
  booking.save();
  res.json("success");
})

app.get('/getAllBookings',(req,res)=>{
  Booking.find().then(function(booking){
    res.send(booking);
  }).catch(function(e){
    res.send(e);
  })
})

app.get('/getAllBooking/:username',(req,res)=>{
  username = req.params.username;
  Booking.find({bookingUsername:username}).then(function(booking){
    res.send(booking);
  }).catch(function(e){
    res.send(e);
  })
})

app.put('/cancelBooking/:id',auth,(req,res)=>{
  id=req.params.id;
  Booking.findByIdAndUpdate(id,{
    $set:{bookingStatus:"2"}}).then(function(){ 
    res.json("Success");
}).catch(function(e){
 res.send(e)
});

})

/* Booking Routes End */


module.exports = app;
app.listen(7777);