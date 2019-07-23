const User = require('../model/user');
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
describe('User Schema test', () => {
    var id="";

 it('Register user test', () => {
 const user = {
 'firstname': 'TestFname',
 'lastname': 'TestLname',
 'username':'TestUsername',
 'gender':'male',
 'phone':'984146535',
 'address':'TestAddress',
 'dob':'2019-JUL-08',
 'email':'test@email.com',
 'password':'testPassword',
 'userType':'user'
 };

 return User.create(user)
 .then((user_test) => {
     id=user_test._id;
 expect(user_test.firstname).toEqual('TestFname');
 });
 });

 it('User update test', async () => {
    return User.updateOne({_id :id},
   {$set : {firstname:'UpdatedName'}})
    .then((userUpdate)=>{
    expect(userUpdate.ok).toEqual(1)
    })
   
   });

   it('User select test',async()=>{
    return User.findOne({username:"TestUsername",password:"password"}).then((userSelect)=>{
        expect(userSelect.userType).toEqual("user")
    })
})

 it('Delete all user test', async () => {
 const status = await User.deleteMany();
 expect(status.ok).toBe(1);
});


   
   })