const _ = require('lodash');

function Link(aid,bid,name,link) {
  
  _.extend(this, {
    
    label : name,
    aid:aid,
    bid:bid,
    link_type:link
  });
}

module.exports = Link;
