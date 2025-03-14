const mongoose = require('mongoose');

const connectToDB = () => {
    mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('connect to momgoDB')
    }).catch((err) => {
        console.log('disconnect from mongoDB')
    })
};

mongoose.connection.on('connected', () => {
    console.log('DB connected establish');
})
mongoose.connection.on('Disconnect', () => {
    console.log('DB has Disconnected');
});


module.exports = {
    connectToDB
};