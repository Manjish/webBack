const mongoose = require('mongoose');
const databaseName = 'manjish_webApiFinal';
mongoose.connect('mongodb://127.0.0.1:27017/' + databaseName, 
    {
        useNewUrlParser: true,
        useCreateIndex: true
    })