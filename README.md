inSubnet (v0.0.8)
======

Install: npm install [insubnet](https://npmjs.org/package/insubnet "Title")

This project is [Unlicensed](http://unlicense.org/ "Title").
In other words, I don't care what you do with it.
However, if you make something interesting, I would like to check it out.
I'm also accepting pull requests.

[![Build Status](https://travis-ci.org/LouisT/inSubnet.png?branch=master)](https://travis-ci.org/LouisT/inSubnet)

Browser example at [http://louist.github.io/inSubnet/example.html](http://louist.github.io/inSubnet/example.html "Title").

[IPv4 Address Notation Support](http://en.wikipedia.org/wiki/IPv4#Address_representations "Title"): 
------
- [x] Dotted decimal (127.0.0.1)
- [ ] Dotted hexadecimal (0xC0.0x00.0x02.0xEB)
- [ ] Dotted octal (0301.0250.0002.0353)
- [ ] Hexadecimal (0xC00002EB)
- [x] Decimal (3221226219)
- [ ] Octal (030000001353)

Functions:
------
    Examples in `./examples/` folder.

    inSubnet.Auto(ip, subnet[, prefix length]) - Check to find out if <ip> is in <subnet>. Works with IPv4 and IPv6. Returns boolean.

         Examples: inSubnet.Auto('1.2.3.4','1.2.0.0/16'); // true
                   inSubnet.Auto('1.2.3.4','1.2.0.0','16'); // true
                   inSubnet.Auto('16909060','1.2.0.0/16'); // true
                   inSubnet.Auto('16909060','16908288/16'); // true
                   inSubnet.Auto('2400:cb00::123','2400:cb00::/32'); // true
                   inSubnet.Auto('1.4.3.4','1.2.0.0','16'); // false

    inSubnet.IPv4(ip, subnet[, prefix length]) - Same as "Auto()" but for IPv4 only. - Returns boolean.

         Examples: See "Auto()" examples.

    inSubnet.IPv4Dec(decimal, subnet[, prefix length]) - Same as "Auto()" but for IPv4 only. - Returns boolean.

         Examples: See "Auto()" examples.


    inSubnet.IPv6(ip, subnet[, prefix length]) - Same as "Auto()" but for IPv6 only. - Returns boolean.

         Examples: inSubnet.IPv6('2400:cb00::123','2400:cb00::/32'); // true
                   inSubnet.IPv6('2400:cb00::123','2400:cb00::','32'); // true
                   inSubnet.IPv6('2500:cb00::123','2400:cb00::','32'); // false

    inSubnet.isIP(string) - Check if <string> is an IP address. Works for IPv6 and IPv4. - Returns boolean.

         Examples: inSubnet.isIP("127.0.0.1"); // true
                   inSubnet.isIP("afd::1"); // true
                   inSubnet.isIP("asd::1"); // false
 
    inSubnet.isIPv4(string) - Same as "isIP()" but for IPv4 only. - Returns boolean.
         Examples: inSubnet.isIPv4("127.0.0.1"); // true
                   inSubnet.isIPv4("127.0.0.256"); // false

    inSubnet.isDecimal(string) - Same as "isIP()" but for IPv4 decimal notation only. - Returns boolean.
         Examples: inSubnet.isDecimal("16909060"); // true
                   inSubnet.isDecimal("a16909060"); // false

    inSubnet.isIPv6(string) - Same as "isIP()" but for IPv6 only. - Returns boolean.

         Examples: inSubnet.isIPv6("adf::1"); // true
                   inSubnet.isIPv6("asf::1"); // false

    inSubnet.Expand(ipv6[, zero]) - Expands an IPv6.
                                    If <zero> is true, use single zeros. - Returns IPv6 or false.

         Examples: inSubnet.Expand("afd::1"); // 0afd:0000:0000:0000:0000:0000:0000:0001
                   inSubnet.Expand("2001:4860:4860::8888"); // 2001:4860:4860:0000:0000:0000:0000:8888
                   inSubnet.Expand("afd::1",true); // afd:0:0:0:0:0:0:1
                   inSubnet.Expand("asd::1"); // false

    inSubnet.Validate(ip[, subnets[, no update]]) - Check <ip> or an Array of IPs against an array of subnets set by "setSubnets()".
                                       If <subnets> is passed, uses "setSubnets()". If <no update> is true, do not call "setSubnets()".
                                       Returns boolean or an Array of boolean.

         Examples: inSubnet.Validate('127.0.0.1',['127.0.0.1/32','adf::1/32']);  // true
                   inSubnet.Validate('2130706433'); // true - Uses previously set subnets.
                   inSubnet.Validate(['127.0.0.1','127.0.0.2','adf::1']); // [true,false,true] - Uses previously set subnets.
                   inSubnet.Validate(['127.0.0.1','127.0.0.2','adf::1'],['127.0.0.1/32']); // [true,false,false] - Overwrite previously set subnets.

    *inSubnet.Filter(array[, subnets[, no update]]) - Filter an Array of IP addresses against subnets set with "setSubnets()".
                                        If <subnets> is passed, uses "setSubnets()". If <no update> is true, do not call "setSubnets()".
                                        Returns IP or false, Array of valid IPs.

         Examples: inSubnet.Filter(['127.0.0.1','adf::1','127.0.0.2'],['127.0.0.1/32','adf::1/32']); // ['127.0.0.1','adf::1']
                   inSubnet.Filter('127.0.0.1',['127.0.0.1/32','adf::1/32']); // 127.0.0.1
                   inSubnet.Filter('adf::1',['127.0.0.1/32'],true); // true - Uses previously set subnets.
                   inSubnet.Filter('adf::1',['127.0.0.1/32']); // false - Overwrite previously set subnets.
                   inSubnet.Filter('127.0.0.2',['127.0.0.1/32','adf::1/32']); // false

    *inSubnet.Clean(array[, filter[, sort]]) - Filter an array of IPs/subnets and return only valid IPs. Used in "setSubnets()".
                                              <filter> is the function to pass to "Array.filter()".
                                              <sort> is the function to pass to "Array.sort()" - Returns Object or false.
                                              NOTE: "Array.filter()" and "Array.sort()" are ran LAST after validating and expanding.

         Examples: inSubnet.Clean(['127.0.0.2','127.0.0.29/32']); // {ipv4:['127.0.0.2','127.0.0.29/32'],ipv6:[]}
                   inSubnet.Clean(['127.0.0.1','adf::1']); // {ipv4:['127.0.0.1'],ipv6:['0adf:0000:0000:0000:0000:0000:0000:0001']}
                   inSubnet.Clean(['adf::1','::1']); // {ipv4:[],ipv6:['0000:0000:0000:0000:0000:0000:0000:0001','0adf:0000:0000:0000:0000:0000:0000:0001']}
                   inSubnet.Clean(['not an IP','subnet/23','asd::1']); // false

    *inSubnet.setSubnets(subnets) - Set a list of subnets for "Validate()" and "Filter()".
                                   WARNING: Overrides all previous "setSubnets()" calls. - Returns boolean.

         Examples: inSubnet.setSubnets(["192.168.1.0/30","::1/32"]); // true
                   inSubnet.setSubnets(["not","subnets","subnet/32"]); // false

    *Only supports IPv4 dotted decimal notation and IPv6.

TODO:
------
- [x] Figure out what should be in the TODO and then write it! (Done!?)
- [ ] Write a better README! (Is this happening?)
- [x] Write a simple HTTP example for CloudFlare. (Look in ./examples/cloudflare.js)
- [ ] Make "Exporter" better.

Functionality Requests:
------
- [ ] *Add support for IPv6 dotted notation. (::127.0.0.1)
- [ ] Add support for more IPv4 notations. See "IPv4 Address Notation Support" above.

    *I probably wont get to this any time soon... Sorry for those who need/want it. Please feel free to submit a pull request.
