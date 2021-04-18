const _ = require('lodash');

function Link(name,id ) {
  _.extend(this, {
    
    label : name,
    id:id,
    link_type:'Cause'
  });
}

module.exports = Link;
