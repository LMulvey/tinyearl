var http = require('http'),
    earl = require('./lib/earl.js');

function handle_incoming_req(req, res) {
  /* Carve our routes out */
  if(req.url == "/") {
    req.url = "ROOT REQUEST";
    console.log("INCOMING REQUEST: " + req.method + " from URL: " + req.url);
    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end(JSON.stringify( { error: null }) + "\n");
  }

  if(req.url == "new") {
    /* Create new URL forwarder */

    /* Parse URL, confirm that it is indeed a valid URL.
        Create a new EARL, output the view_created w/
        new URL information */
    console.log("Created new EARL. http://tinyearl.com/ " + earl.generateEarlID());
    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end(JSON.stringify( { error: null }) + "\n");
 }

}

var s = http.createServer(handle_incoming_req);
s.listen(8080);