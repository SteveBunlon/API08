var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name:  {type: String, required: true, unique: true },
    price: {type: Number, required: true, min : 0},
    category: {type: String, required: true},
    img: {type: String},
    onSale: {type: Boolean, default: true}
});

module.exports = mongoose.model("Product", productSchema);
