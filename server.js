var http = require('http');

function handle_incoming_req(req, res) {
  if(req.url == "/") req.url = "ROOT REQUEST";
  console.log("INCOMING REQUEST: " + req.method + " from URL: " + req.url);
  res.writeHead(200, { "Content-Type" : "application/json" });
  res.end(JSON.stringify( { error: null }) + "\n");
}

var s = http.createServer(handle_incoming_req);
s.listen(8080);