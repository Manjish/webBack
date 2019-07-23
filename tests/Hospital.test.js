const Hospital = require('../model/hospital');
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

describe('Hospital Schema test', () => {
    var id="";

 it('Adding new hospital test', () => {
     const departments=[{"department":"testDepartment1"},{"department":"testDepartment2"},{"department":"testDepartment3"}];
 const hospital = {
 'hosName': 'testHospitalName',
 'hosDetails': 'This is just a test for adding hospital',
 'hosAddress':'testAddress',
 'hosContact':'7464981354',
 'hosEmail':'test@hospital.com',
 'hosWebsite':'http://test.hospital.com',
 'hosImage':'testImage.jpg',
 'hosDepartments':departments
};

 return Hospital.create(hospital)
 .then((hos_test) => {
     id=hos_test._id;
 expect(hos_test.hosName).toEqual('testHospitalName');
 });
 });

 it('Hospital update test', async () => {
    return Hospital.updateOne({_id :id},
   {$set : {hosContact:'456553578'}})
    .then((hosUpdate)=>{
    expect(hosUpdate.ok).toEqual(1)
    })
   
   });

   it('Hospital select test',async()=>{
    return Hospital.findById(id).then((hosSelect)=>{
        expect(hosSelect.hosName).toEqual("testHospitalName")
    })
})

 it('Delete single hospital test', async () => {
 const status = await Hospital.deleteOne({_id:id});
 expect(status.ok).toBe(1);
});


   })