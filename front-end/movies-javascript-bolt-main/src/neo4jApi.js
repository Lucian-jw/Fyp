require('file-loader?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
const Movie = require('./models/Movie');
const MovieCast = require('./models/MovieCast');
const _ = require('lodash');

const neo4j = window.neo4j;
const neo4jUri = process.env.NEO4J_URI;
const neo4jVersion = process.env.NEO4J_VERSION;
let database = process.env.NEO4J_DATABASE;
if (!neo4jVersion.startsWith("4")) {
  database = null;
}
const driver = neo4j.driver(
  'neo4j://localhost:7687',
    neo4j.auth.basic('neo4j', '1317Qscgy55'),
);

console.log(`Database running at ${neo4jUri}`)

function searchMovies(queryString) {
  const session = driver.session({database: database});
  //console.log('searching movie');
  return session.readTransaction((tx) =>
      tx.run('MATCH (a:Disease) \
      WHERE a.id =~$id \
      RETURN a',
      {id:queryString})
    )
    .then(result => {
      //console.log('found sth');
      if (_.isEmpty(result.records))
        console.log('found nothing actually');
      return result.records.map(record => {
        //console.log('success on searching');
        //console.log(record.get('a'));
        return new Movie(record.get('a'));
      });
    })
    .catch(error => {
      console.log('error');
      throw error;
    })
    .finally(() => {
      console.log('close');
      return session.close();
    });
}

function getMovie(title) {
  const session = driver.session({database: database});
  console.log('getting movie');
  return session.readTransaction((tx) =>
      tx.run("MATCH (a:Virus)-[r:CAUSE]->(b:Disease) WHERE b.id=~$id RETURN a.id AS id, a.label AS label",{id:title}))
    .then(result => {
      if (_.isEmpty(result.records))
        return null;

      const record = result.records[0];
      return new MovieCast(record.get('id'), record.get('label'));
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

function getGraph() {
  const session = driver.session({database: database});
  var type = $("#s_type").val();
  console.log(type);
  return session.readTransaction((tx) =>
    tx.run('MATCH p=(a)-[r]->(c) \
    WHERE a.labels=$type or c.labels=$type\
    RETURN a.label AS name ,collect(c.label) AS cast  ', {type: type}))
    .then(results => {
      console.log("get some node of the class");
      const nodes = [], rels = [];
      let i = 0;
      results.records.forEach(res => {
        console.log(res.get('name'));
        nodes.push({title: res.get('name'), label: 'name'});
        const target = i;
        i++;

        res.get('cast').forEach(name => {
          const actor = {title: name, label: 'actor'};
          let source = _.findIndex(nodes, actor);
          if (source === -1) {
            nodes.push(actor);
            source = i;
            i++;
          }
          rels.push({source, target})
        })
      });

      return {nodes, links: rels};
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

exports.searchMovies = searchMovies;
exports.getMovie = getMovie;
exports.getGraph = getGraph;

