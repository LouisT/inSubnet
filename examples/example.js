var inSubnet = require('../');

var subTests = [
 ["1.2.3.4","1.2.0.0","16"],
 ["1.3.2.4","1.2.0.0","16"],
 ["192.168.255.14","192.168.255.0","27"],
 ["192.168.255.143","192.168.255.0","27"],
 ["2400:cb00::123","2400:cb00::","32"],
 ["2606:4700::123","2400:cb00::","32"],
];

var ipTests = [
 "1.2.3.4",
 "1.3.2.4",
 "999.999.999.999",
 "2400:cb00::123",
 "2606:4700::asd",
 "2001:DB8::8:800:200C:417A",
 "::1",
 "afd::1",
 "2400:cb00:0000:0000:0000:0000:0000:0123",
 "2606:4700:0000:0000:0000:0000:0000:0asd",
 "0000:0000:0000:0000:0000:0000:0000:0001",
 "0afd:0000:0000:0000:0000:0000:0000:0001",
 "Not an IP!",
];

console.log("--- Subnet Validation (Auto) ---");
subTests.forEach(function(test) {
  console.log("Auto: "+test[0]+" in "+test[1]+"/"+test[2]+": "+inSubnet.Auto(test[0],test[1],test[2]));
});

console.log("\n--- Subnet Validation (Specified) ---");
subTests.forEach(function(test) {
  if (test[0].indexOf(':') == -1) {
     console.log("IPv4: "+test[0]+" in "+test[1]+"/"+test[2]+": "+inSubnet.IPv4(test[0],test[1],test[2]));
   } else {
     console.log("IPv6: "+test[0]+" in "+test[1]+"/"+test[2]+": "+inSubnet.IPv6(test[0],test[1],test[2]));
  };
});

console.log("\n--- IP Validation ---");
ipTests.forEach(function(test) {
  console.log("isIP: "+test+": "+inSubnet.isIP(test));
});

console.log("\n--- IPv4 Validation ---");
ipTests.forEach(function(test) {
  console.log("isIPv4: "+test+": "+inSubnet.isIPv4(test));
});

console.log("\n--- IPv6 Validation ---");
ipTests.forEach(function(test) {
  console.log("isIPv6: "+test+": "+inSubnet.isIPv6(test));
});

