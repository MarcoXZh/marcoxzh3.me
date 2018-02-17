let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let TocSchema = /* module.exports.TocSchema = */ new Schema({
    order: Number,
    created: Date,
    hidden: Boolean,
    cat: String,
    name: String,
    url: String,
    desc: String,
}); // let TocSchema = /* module.exports.TocSchema =  */new Schema({ ... });


module.exports/* .Toc */ = mongoose.model('Toc', TocSchema);
