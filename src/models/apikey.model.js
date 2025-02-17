"use strict"
const mongoose = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = "Apikey"
const COLLECTION_NAME = "Apikeys"

const apiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        require: true,
        unique: true
    },
    status: {
        type: String,
        default: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    Permissions: {
        type: [String],
        required: true,
        enum: ["0000", "1111", "2222"]
    },
}, {
    timestamp: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);