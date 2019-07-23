const Booking = require('../model/booking');
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

describe('Booking Schema test', () => {
    var id="";

 it('Adding new appointment test', () => {
 const booking = {
 'bookingUsername': 'testUsername',
 'bookingHosId': '5fsdf4sf6s4s8d64f6s8a',
 'bookingDepartment':'testDepartment',
 'bookingDocId':'56sd4fsdfdsf5646d',
 'bookingDate':'2019-07-10',
 'bookingStatus':'0'
};

 return Booking.create(booking)
 .then((book_test) => {
     id=book_test._id;
 expect(book_test.bookingUsername).toEqual('testUsername');
 });
 });

 it('Booking status update test', async () => {
    return Booking.updateOne({_id :id},
   {$set : {bookingStatus:'1'}})
    .then((bookUpdate)=>{
    expect(bookUpdate.ok).toEqual(1)
    })
   
   });

   it('Booking select test',async()=>{
       return Booking.findById(id).then((bookSelect)=>{
           expect(bookSelect.bookingStatus).toEqual("1")
       })
   })

 it('Delete single booking test', async () => {
 const status = await Booking.deleteOne({_id:id});
 expect(status.ok).toBe(1);
});


   
   })