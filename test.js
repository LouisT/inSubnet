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
         console.log("[Subnet String Tests] Number of errors found: "+errors.length+" - Tests passed: "+pass+" ("+((pass/(errors.length+pass)*100))+"%)");
         errors.forEach(function(err) { console.log('\033[1;31mERROR:\033[0m '+err); });   
         return !(errors.length);
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
            assert(!inSubnet.isIPv6('asd::1'),"asd::1 should NOT be an IPv6.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(inSubnet.Clean(['127.0.0.1','adf::1']),"Returned Object should be {ipv4:['127.0.0.1'],ipv6:['0adf:0000:0000:0000:0000:0000:0000:0001']}.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Clean(['not an IP','subnet/23','asd::1']),"Returned NOT should be an Object.");
            pass++;
         } catch (e) { errors.push(e.message); };
         console.log("[IP Validation Tests] Number of errors found: "+errors.length+" - Tests passed: "+pass+" ("+((pass/(errors.length+pass)*100))+"%)");
         errors.forEach(function(err) { console.log('\033[1;31mERROR:\033[0m '+err); });
         return !(errors.length);
};
function arrTests () {
         // CloudFlare Subnets! (https://www.cloudflare.com/ips)
         var subs = ['204.93.240.0/24','204.93.177.0/24','199.27.128.0/21','173.245.48.0/20','103.21.244.0/22',
                     '103.22.200.0/22','103.31.4.0/22','141.101.64.0/18','108.162.192.0/18','190.93.240.0/20',
                     '188.114.96.0/20','197.234.240.0/22','198.41.128.0/17','162.158.0.0/15','2400:cb00::/32',
                     '2606:4700::/32','2803:f800::/32','2405:b500::/32','2405:8100::/32'],
             errors = [], pass = 0;
         try {
            assert(!inSubnet.Validate(),"Empty \"Validate()\" should return false.");
            pass++;
         } catch (e) { errors.push(e.message); }
         try {
            assert(inSubnet.setSubnets(subs),"Empty \"setSubnets([subs])\" should return true.");
            pass++;
         } catch (e) { errors.push(e.message); }
         try {
            assert(inSubnet.Validate('204.93.240.15'),"204.93.240.15 should be in subnet array.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Validate('204.93.240.256'),"204.93.240.256 should NOT be in subnet array.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(inSubnet.Validate('2405:b500::123'),"2405:b500::123 should be in subnet array.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Validate('2406:b500::123'),"2406:b500::123 should NOT be in subnet array.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(inSubnet.Validate(['2405:b500::123'])[0],"Index 0 should be true.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!inSubnet.Validate(['2406:b500::123'])[0],"Index 0 should NOT be true.");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            var ret = inSubnet.Filter(['127.0.0.1','adf::1','127.0.0.2'],['127.0.0.1/32','adf::1/32']).toString();
            assert(ret === '127.0.0.1,adf::1',"Returned array should be ['127.0.0.1','adf::1'].");
            pass++;
         } catch (e) { errors.push(e.message); };
         try {
            assert(!(inSubnet.Filter(['127.0.0.2'],['127.0.0.1/32','adf::1/32']).length),"Returned array should be empty.");
            pass++;
         } catch (e) { errors.push(e.message); };
         console.log("[Subnet Array Tests] Number of errors found: "+errors.length+" - Tests passed: "+pass+" ("+((pass/(errors.length+pass)*100))+"%)");
         errors.forEach(function(err) { console.log('\033[1;31mERROR:\033[0m '+err); });
         return !(errors.length);
};
if ([subTests(),arrTests(),ipTests()].indexOf(false) !== -1) {
   process.exit(1);
};
