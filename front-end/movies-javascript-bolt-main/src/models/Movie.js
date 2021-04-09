const _ = require('lodash');

function Movie(_node) {
  _.extend(this, _node.properties);
  /*
  if (this.id) {
    console.log(this.id);
  }
  */
}

module.exports = Movie;
