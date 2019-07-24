/** 
*Created by modo on 2019/01/04.
*/
let mongoose =require('mongoose');
let usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);