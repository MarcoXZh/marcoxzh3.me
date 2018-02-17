const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;


const ContactSchema = /* module.exports.ContactSchema = */ new Schema({
    created: Date,
    name: String,
    email: String,
    subject: String,
    location: String,
    message: String,
}); // const ContactSchema ...


module.exports/* .Contact */ = Mongoose.model('Contact', ContactSchema);
