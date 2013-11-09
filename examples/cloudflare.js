/*
  Node.js HTTP example for CloudFlare using inSubnet.
  inSubnet - https://github.com/LouisT/inSubnet
*/
var http = require('http'),
    inSubnet = require('../');

/*
  CloudFlare Network Subnets
  Updated list here: https://www.cloudflare.com/ips
*/
var cf = {
    ipv4: ['204.93.240.0/24','204.93.177.0/24','199.27.128.0/21','173.245.48.0/20','103.21.244.0/22',
           '103.22.200.0/22','103.31.4.0/22','141.101.64.0/18','108.162.192.0/18','190.93.240.0/20',
           '188.114.96.0/20','197.234.240.0/22','198.41.128.0/17','162.158.0.0/15'],
    ipv6: ['2400:cb00::/32','2606:4700::/32','2803:f800::/32','2405:b500::/32','2405:8100::/32'],
};

/*
  Create the HTTP server.
  http://nodejs.org/api/http.html#http_http_createserver_requestlistener
*/
var server = http.createServer();

/*
  Add the request handler.
  http://nodejs.org/api/events.html#events_emitter_addlistener_event_listener
*/
server.addListener("request",handler);

/*
  The request handler itself.
*/
function handler (req, res) {

         // Get the IP adress of the remote user.
         var ip = req.connection.remoteAddress;
 
         // Check the version of IP.
         var version = (inSubnet.isIPv4(ip)?'ipv4':'ipv6');

         // You can't break from forEach, use some()!
         // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
         var isCf = cf[version].some(function(subnet) {
             // Check for IP in subnet.
             if (inSubnet.Auto(ip,subnet)) {
                   
                // Found IP in Subnet, tell the connecting user.
                var out = "You are using CloudFlare!<br />CloudFlare IP: "+
                          "<strong>"+ip+"</strong><br />Your IP: <strong> "+
                          req.headers['cf-connecting-ip']+"</strong>";
                res.writeHead(200,{"content-type":"text/html"});
                res.end(out);

                return true;
             };
             return false;
         });

         if (!isCf) {
            // Not using CloudFlare, so tell the user.
            res.writeHead(200,{"content-type":"text/html"});
            res.end("You're not using CloudFlare!<br />Your IP: <strong>"+ip+"</strong>");
         };
};

// Start listening on a CloudFlare enabled port.
server.listen(8880);
