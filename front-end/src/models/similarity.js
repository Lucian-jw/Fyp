const _ = require('lodash');

function Similarity(node1,node2,rate ) {
  _.extend(this, {
    
    name1 : node1,
    name2 : node2,
    similarity_rate : rate
  });
}

module.exports = Similarity;
