const _ = require('lodash');

function MovieCast(title, name_en,subclassof ) {
  _.extend(this, {
    title: title,
    name_en: name_en,
    subclassof: subclassof
  });
}

module.exports = MovieCast;
