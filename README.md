inSubnet (v0.0.1)
======

Install: npm install [insubnet](https://npmjs.org/package/insubnet "Title")

This project is [Unlicensed](http://unlicense.org/ "Title").
In other words, I don't care what you do with it.
However, if you make something interesting, I would like to check it out.

Browser example at [http://louist.github.io/inSubnet/example.html](http://louist.github.io/inSubnet/example.html "Title").

Functions:
------
    Examples in `./examples/` folder.

    inSubnet.Auto(ip, subnet[, mask]) - Check to find out if <ip> is in <subnet>. Works with IPv4 and IPv6. Returns true or false.
         Examples: inSubnet.Auto('1.2.3.4','1.2.0.0/16'); OR inSubnet.Auto('1.2.3.4','1.2.0.0','16');

    inSubnet.IPv4(ip, subnet[, mask]) - Same as "Auto()" but for IPv4 only. - Returns true or false.
         Examples: inSubnet.IPv4('1.2.3.4','1.2.0.0/16'); OR inSubnet.IPv4('1.2.3.4','1.2.0.0','16');

    inSubnet.IPv6(ip, subnet[, mask]) - Same as "Auto()" but for IPv6 only. - Returns true or false.
         Examples: inSubnet.IPv6('2400:cb00::123','2400:cb00::/32'); OR inSubnet.IPv6('2400:cb00::123','2400:cb00::','32');

    inSubnet.isIP(string) - Check if <string> is an IP address. Works for IPv6 and IPv4. - Returns true or false.
         Examples: inSubnet.isIP("127.0.0.1"); OR inSubnet.isIP("afd::1");
 
    inSubnet.isIPv4(string) - Same as "isIP()" but for IPv4 only. - Returns true or false.
         Example: inSubnet.isIPv4("127.0.0.1");

    inSubnet.isIPv6(string) - Same as "isIP()" but for IPv6 only. - Returns true or false.
         Example: inSubnet.isIPv6("adf::1");

    inSubnet.expand(ipv6) - Expands an IPv6. - Returns IPv6 or false.
         Example: inSubnet.expand("afd::1");

TODO:
------
- [x] Figure out what should be in the TODO and then write it! (Done!?)
- [ ] Write a better README!
- [ ] Write a simple HTTP example for CloudFlare.
- [ ] Everything else!
