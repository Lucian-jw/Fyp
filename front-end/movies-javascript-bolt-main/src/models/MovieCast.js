const _ = require('lodash');

function MovieCast(name,id ) {
  _.extend(this, {
    
    name: name,
    id:id
  });
}

module.exports = MovieCast;
