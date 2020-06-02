const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const PGSchema = new Schema({
  address:String,
  photo:Array,
  attributes:{
    slide:Boolean,
    swing:Boolean,
    rollerBungge:Boolean
  },
  approved:{
    type: Boolean,
    default:false
  }
});

const PG = mongoose.model('PG', PGSchema);
module.exports = PG;