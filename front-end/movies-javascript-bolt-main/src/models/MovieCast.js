const _ = require('lodash');

function MovieCast(name,id ) {
  _.extend(this, {
    
    label : name,
    id:id,
    link_type:'Cause'
  });
}

module.exports = MovieCast;
