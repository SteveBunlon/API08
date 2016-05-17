/**
 * Created by sbunlon on 17/05/2016.
 */
var mongoose = require('mongoose');

var annalSchema = new mongoose.Schema({
    name:  {type: String, required: true},
    saison: {type:String, enum:["printemps", "automne"], required:true},
    type: {type:String, enum:["final", "partiel", "median"], required:true},
    nbPage: {type:Number, required:true},
    link: {type: String, required:true},
    date: {type: String, required:true}

});

module.exports = mongoose.model("Annal", annalSchema);
