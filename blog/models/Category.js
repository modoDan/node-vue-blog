/** 
*Created by modo on 2019/01/07.
*/
let mongoose =require('mongoose');
let categorysSchema = require('../schemas/categorys');

module.exports = mongoose.model('Category',categorysSchema);