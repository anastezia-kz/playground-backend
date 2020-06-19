const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const PGSchema = new Schema({
  
  photo:Array,
  coordinates:{
    lat:Number,
    lng:Number
  },
  attributes:{
    slide:{
      type:Boolean,
      default:false
    },
    swing:{
      type:Boolean,
      default:false
    },
    rollerBungge:{
      type:Boolean,
      default:false
    },
    sander:{
      type:Boolean,
      default:false
    },
    toilet:{
      type:Boolean,
      default:false
    },
    pitch:{
      type:Boolean,
      default:false
    }
  },
  approved:{
    type: Boolean,
    default:false
  }
});

const PG = mongoose.model('PG', PGSchema);
module.exports = PG;