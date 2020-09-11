let mongoose = require('mongoose');

let bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    author:{
        type:mongoose.Types.ObjectId,
        ref: 'Author'
    },
    ISBN: {
        type: String,
        validate:{
            validator: function(newISBN){
                return newISBN.length == 13;
            },
            message: 'ISBN must be 13 chars'
        }
    },
    dateofPub:{
        type: Date,
        default: Date.now
    },
    summary: String
});

module.exports = mongoose.model('Book',bookSchema);