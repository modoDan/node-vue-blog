/** 
*Created by modo on 2019/01/08.
*/
let mongoose =require('mongoose');
let contentsSchema = require('../schemas/contents');

module.exports = mongoose.model('Content',contentsSchema);