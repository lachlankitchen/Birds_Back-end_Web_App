const mongoose = require("mongoose");

// create a schema
const birdSchema = new mongoose.Schema({
    primary_name: {
        type: String
    },
    english_name: {
        type: String
    },
    scientific_name: {
        type: String
    },
    order: {
        type: String
    },
    family: {
        type: String
    },
    other_names: [{
        type: String
    }],
    status: {
        type: String
    },
    photo: {
        credit: { type: String },
        source: { type: String }
    },
    size: {
        length: {
            value: { type: Number },
            units: { type: String }
        },
        weight: {
            value: { type: Number },
            units: { type: String }
        }
    }

}, {collection:"Birds"});

// compile the schema into a model (named 'message')
const Birds = mongoose.model('Birds', birdSchema);

// export the model
module.exports = Birds;
