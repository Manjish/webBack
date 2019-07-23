const Doctor = require('../model/doctor');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/test_database';

beforeAll(async () => {
 await mongoose.connect(url, {
 useNewUrlParser: true,
 useCreateIndex: true
 });
});
afterAll(async () => {
 await mongoose.connection.close();
});

describe('Doctor Schema test', () => {
    var id="";

 it('Adding new doctor test', () => {
     const availableTime=[{"time":"9:00am - 2:00pm"},{"time":"8:00am - 1:00pm"},{"time":"7:00am - 12:00pm"},{"time":"10:00am - 3:00pm"},
     {"time":"11:00am - 3:00pm"},{"time":"8:00am - 11:00am"},{"time":"3:00pm - 6:00pm"}];
 const doctor = {
 'docName': 'testDoctorName',
 'docDetails': 'This is just a test for adding doctor',
 'docEducation':'testEducation',
 'docHosName':'5f5s64f6sdf4654s4dv46s',
 'docDepartment':'testDepartment',
 'docImage':'testDocImage.jpg',
 'docAvailable':availableTime
};

 return Doctor.create(doctor)
 .then((doc_test) => {
     id=doc_test._id;
 expect(doc_test.docName).toEqual('testDoctorName');
 });
 });

 it('Doctor update test', async () => {
    return Doctor.updateOne({_id :id},
   {$set : {docImage:'updatedImage.jpg'}})
    .then((docUpdate)=>{
    expect(docUpdate.ok).toEqual(1)
    })
   
   });

   it('Doctor select test',async()=>{
    return Doctor.findById(id).then((docSelect)=>{
        expect(docSelect.docDepartment).toEqual("testDepartment")
    })
})

 it('Delete single doctor test', async () => {
 const status = await Doctor.deleteOne({_id:id});
 expect(status.ok).toBe(1);
});


   })