var assert = require('assert'),
    inSubnet = require('./');
function subTests () {
         var errors = [], pass = 0;
         try {
            assert(!inSubnet.Auto(),"Empty \"Auto()\" should return false.");
            pass++;
         } catch (e) { errors.push(e.message); }
         try {
            assert(inSubnet.Auto('1.2.3.4','1.2.0.0/16'),"1.2.3.4 should be in 1.2.0.0/16.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Auto('1.3.4.5','1.2.0.0/16'),"1.3.4.5 should NOT be in 1.2.0.0/16.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(inSubnet.Auto('192.168.255.14','192.168.255.0/27'),"192.168.255.14 should be in 192.168.255.0/27.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Auto('192.168.255.32','192.168.255.0/27'),"192.168.255.32 should NOT be in 192.168.255.0/27.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Auto('192.168.255.32','2400:cb00::/32'),"192.168.255.32 should NOT be in 2400:cb00::/32.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Auto('2400:cb00::123','192.168.255.0/27'),"2400:cb00::123 should NOT be in 192.168.255.0/27.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(inSubnet.Auto('2400:cb00::123','2400:cb00::/32'),"2400:cb00::123 should be in 2400:cb00::/32.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Auto('2500:cb00::123','2400:cb00::/32'),"2500:cb00::123 should NOT be in 2400:cb00::/32.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Auto('Not an IP','2400:cb00::/32'),"This isn't even a valid IP!");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Auto('2400:cb00::123','Not a Subnet!'),"This isn't even a valid Subnet!");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Auto('Not an IP','Not a Subnet!/32'),"This isn't even a valid IP OR Subnet!");
            pass++;
         } catch (e) { errors.push(e.message); };
         console.log("[Subnet Validation] Number of errors found: "+errors.length+" - Tests passed: "+pass+" ("+((pass/(errors.length+pass)*100))+"%)");
         errors.forEach(function(err) { console.log('\033[1;31mERROR:\033[0m '+err); });
};
function ipTests () {
         var errors = [], pass = 0;
         try {
            assert(!inSubnet.isIP(),"Empty \"isIP()\" should return false.");
            pass++;
         } catch (e) { errors.push(e.message); }
         try {
            assert(inSubnet.isIP('1.2.3.4'),"1.2.3.4 should be an IP.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.isIP('999.999.999.999'),"999.999.999.999 should NOT be an IP.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(inSubnet.isIP('2400:cb00::123'),"2400:cb00::123 should be an IP.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.isIP('2400::cb00::123'),"2400::cb00::123 should NOT be an IP.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(inSubnet.isIPv4('127.0.0.1'),"127.0.0.1 should be an IPv4.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.isIPv4('256.0.0.0'),"256.0.0.0 should NOT be an IPv4.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(inSubnet.isIPv6('afd::1'),"afd::1 should be an IPv6.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.isIPv6('asd::1'),"afd::1 should NOT be an IPv6.");
            pass++;
         } catch (e) { errors.push(e.message); };
         console.log("[IP Validation] Number of errors found: "+errors.length+" - Tests passed: "+pass+" ("+((pass/(errors.length+pass)*100))+"%)");
         errors.forEach(function(err) { console.log('\033[1;31mERROR:\033[0m '+err); });
};
subTests();
ipTests();
