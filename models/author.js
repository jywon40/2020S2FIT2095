let mongoose = require('mongoose');
let moment = require('moment');

let authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type:String,
            required: true
        },
        lastName: String
    },
    dob: {
        type: Date,
        get: function(newDate){ //post-processing
            return moment(newDate).format('DD-MM-YYYY');
        }
        // set: function(value){ //preprocessing

        // }
    },
    address:{
        state: {
            type: String,
            validate:{
                validator: function(newState){
                    return newState.length >= 2 && newState.length <= 3;
                },
                message: 'State should be between 2 and 3 chars'
            }
            //could also use min max after type
        },
        suburb: String,
        street: String,
        unit: Number
    },
    numBooks:{
        type: Number,
        validate:{
            validator: function(newNumBooks){
                return newNumBooks >= 1 && newNumBooks <= 150;
            },
            message: 'Number of Books must be between 1 and 150'
        }
    },
    created:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Author',authorSchema);