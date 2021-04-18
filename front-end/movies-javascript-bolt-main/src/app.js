require('file-loader?name=[name].[ext]!./assets/images/favicon.ico')
const Similarity = require('./models/similarity');
const api = require('./neo4jApi');
/*
var express = require('express');
var app = express();
var path = require('path');

app.get('/front', function(req, res) {
  res.sendFile(path.join(__dirname + '/assets/frontpage.html'));
});

//app.listen(8000);
*/

$(function () {
  //renderGraph();
  search();
  ////findSimilarity();

  $("#search").submit(e => {
    e.preventDefault();
    search();
  });
  $("#s_type").change(e => {
    e.preventDefault();
    renderGraph();
  });
});

function showNode(title) {
  api
    .getLink(title)
    .then(link => {
      if (!link) return;
      console.log('get link complete');
      //console.log(link.id);
      $("#title").text("Links info");
      //$("#poster").attr("src","https://neo4j-documentation.github.io/developer-resources/language-guides/assets/posters/"+encodeURIComponent(movie.title)+".jpg");
      const $list = $("#ancestor").empty();
      $list.append($("<li>" +  "Link type is " + link.link_type + "</li>"));
      $list.append($("<li>" +  "The Virus ID is " + link.label + "</li>"));
      $list.append($("<li>" +  "Virus name is " + link.id + "</li>"));
    }, "json");
}

function search() {
  const query = $("#search").find("input[name=search]").val();
  //console.log(query);
  api
    .searchNodes(query)
    .then(nodes => {
      const t = $("table#results tbody").empty();

      if (nodes) {
        //console.log('append node');
        //console.log(nodes);
        nodes.forEach(node => {
          $("<tr><td class='movie'>" + node.id + "</td><td>" + node.label + "</td><td>" + node.labels + "</td></tr>").appendTo(t)
            .click(function() {
              showNode($(this).find("td.movie").text());
            });
            //console.log('node added');
        });
        //console.log('search node complete');
        const first = nodes[0];
        if (first) {
          showNode(first.label);
        }
      }
    });
}
function findSimilarity(){
  api.searchSimilarity().
      then(nodes=>{
        console.log('found Similarity');
      });
}
function renderGraph() {
  const width = 800, height = 800;
  const force = d3.layout.force()
    .charge(-200).linkDistance(30).size([width, height]);

  const svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
    .attr("pointer-events", "all");

  api
    .getGraph()
    .then(graph => {
      force.nodes(graph.nodes).links(graph.links).start();

      const link = svg.selectAll(".link")
        .data(graph.links).enter()
        .append("line").attr("class", "link");

      const node = svg.selectAll(".node")
        .data(graph.nodes).enter()
        .append("circle")
        .attr("class", d => {
          return "node " + d.label
        })
        .attr("r", 10)
        .call(force.drag);

      // html title attribute
      node.append("title")
        .text(d => {
          return d.title;
        });

      // force feed algo ticks
      force.on("tick", () => {
        link.attr("x1", d => {
          return d.source.x;
        }).attr("y1", d => {
          return d.source.y;
        }).attr("x2", d => {
          return d.target.x;
        }).attr("y2", d => {
          return d.target.y;
        });

        node.attr("cx", d => {
          return d.x;
        }).attr("cy", d => {
          return d.y;
        });
      });
    });
}
