const _ = require('lodash');

function Node(_node,labels) {
  _.extend(this, _node.properties);
  /*
  if (this.id) {
    console.log(this.id);
  }
  */

  _.extend(this, {labels:labels});
  //console.log(this.labels);
}

module.exports = Node;
