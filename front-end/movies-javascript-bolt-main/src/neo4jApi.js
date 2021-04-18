require('file-loader?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
const Node = require('./models/Node');
const Link = require('./models/Link');
const Similarity = require('./models/Similarity');
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

function searchNodes(queryString) {
  const session = driver.session({database: database});
  var queryS = '.*' + queryString + '.*';
  return session.readTransaction((tx) =>
      tx.run('MATCH (a) \
      WHERE a.label =~$label \
      RETURN a, labels(a) as labels',
      {label:queryS})
    )
    .then(result => {
      if (_.isEmpty(result.records))
        console.log('found nothing actually');
      return result.records.map(record => {
        return new Node(record.get('a'),record.get('labels'));
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
function searchSimilarity(){
  const session = driver.session({database: database});
  //console.log('searching node');
  var DG = 'Disease Graph';
  var V = 'Virus';
  var D = 'Disease';
  var C = 'CAUSE';
  session.readTransaction((tx)=>tx.run('CALL gds.graph.create(DG,[V, D],{CAUSE: {type: C,properties: {  }}})',{DG:DG,V:V,D:D,C:C}));
  return session.writeTransaction((tx) =>
      tx.run('CALL gds.nodeSimilarity.stream(DG)\
      YIELD node1, node2, similarity\
      RETURN gds.util.asNode(node1).label AS Virus1, gds.util.asNode(node2).label AS Virus2, similarity as Jacard_Score\
      ORDER BY Jacard_Score DESCENDING, Virus1, Virus2',
      {DG:DG})
    )
    .then(result => {
      //console.log('found sth');
      if (_.isEmpty(result.records))
        console.log('found nothing actually');
      return result.records.map(record => {
        console.log('success on getting the similarity');
        //console.log(record.get('a'));
        return new Similarity(record.get('Virus1'),record.get('Virus2'),record.get('Jacard_Score'));
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
function getLink(title) {
  const session = driver.session({database: database});
  //console.log('getting movie');
  return session.readTransaction((tx) =>
      tx.run("MATCH (a)-[r]->(b) WHERE b.label=$id OR a.label=$id RETURN a.id AS id, a.label AS label",{id:title}))
    .then(result => {
      if (_.isEmpty(result.records)){
        console.log("no link here");
        return null;
      }
      console.log("some link here");
      const record = result.records[0];
      return new Link(record.get('id'), record.get('label'));
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
      //console.log("get some node of the class");
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

exports.searchNodes = searchNodes;
exports.searchSimilarity = searchSimilarity;
exports.getLink = getLink;
exports.getGraph = getGraph;

