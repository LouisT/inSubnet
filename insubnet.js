/*
  inSubnet - By Louis T. <louist@ltdev.im>
  Check an IP(v4 or v6) against a subnet.
*/
Exporter(function (isNode) {
   var proto = {
       version: '0.0.3',
       Auto: function (ip, subnet, prefix) {
             if (!ip || !subnet) {
                return false;
             };
             var sm = this.getPrefix(subnet,prefix);
             if (sm[0] && sm[1] && !isNaN(sm[1])) {
                if (this.isIPv4(ip)) {
                   return this.__IPv4(ip,sm[0],sm[1]);
                 } else {
                   return this.__IPv6(ip,sm[0],sm[1]);
                };
             };
             return false;
       },
       IPv4: function (ip, subnet, prefix) {
             var sm = this.getPrefix(subnet,prefix);
             return this.__IPv4(ip,sm[0],sm[1]);
       },
       __IPv4: function (ip, subnet, prefix) {
             if (this.isIPv4(ip) && this.isIPv4(subnet) && (prefix && !isNaN(prefix))) {
                return ((this.toInt(ip)&-1<<(32-prefix)) == this.toInt(subnet));
             };
             return false;
       },
       isIPv4: function (ip) {
             return /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/.test(ip);
       },
       IPv6: function (ip, subnet, prefix) {
             var sm = this.getPrefix(subnet,prefix);
             return this.__IPv6(ip,sm[0],sm[1]);
       },
       __IPv6: function (ip, subnet, prefix) {
             if (this.isIPv6(ip) && this.isIPv6(subnet) && (prefix && !isNaN(prefix))) {
                var o = Array.apply(null,Array(Math.floor(prefix/16))).map(function(_){ return 0xffff; });
                if (prefix%16) {
                   o.push((1<<prefix%16)-1);
                };
                var mask = o.concat(Array.apply(null,Array(8-o.length)).map(function(_){ return 0; }));     
                ip = this.toInt(ip,6), subnet = this.toInt(subnet,6);
                return mask.every(function(m,n){ return (ip[n]&m) == (subnet[n]&m) });
             };
             return false;
       },
       isIPv6: function (ip) {
             return !!(this.Expand(ip));
       },
       __isIPv6: function (ip) {
             return /^([0-9a-f]{4}|0)(\:([0-9a-f]{4}|0)){7}$/i.test(ip);
       },
       isIP: function (ip) {
             return (this.isIPv4(ip)||this.isIPv6(ip));
       },
       Validate: function (ip) {
              if (this.subnets && this.isIP(ip) && (!!(this.subnets[this.isIPv4(ip)?"ipv4":"ipv6"].length))) {
                 var subs = this.subnets[(this.isIPv4(ip)?"ipv4":"ipv6")];
                 for (var num in subs) {
                     if (this.Auto(ip,subs[num])) {
                        return true;
                     };
                 };
              };
              return false;
       },
       setSubnets: function (subnets) {
             this.subnets = {ipv4:[],ipv6:[]};
             if (Array.isArray(subnets)) {
                for (var num in subnets) {
                    var subnet = subnets[num];
                    if (/\/(\d+){1,3}$/.test(subnet)) {
                       if (this.isIPv4(subnet.split('/')[0])) {
                          this.subnets.ipv4.push(subnet);
                        } else if (this.isIPv6(subnet.split('/')[0])) {
                          this.subnets.ipv6.push(subnet);   
                       };
                    };
                };
                return (!!(this.subnets.ipv4.length)||!!(this.subnets.ipv6.length));
             };
             return false;
       },
       getPrefix: function (subnet, prefix) {
             if (/\/(\d+){1,3}$/.test(subnet)) {
                try {
                   var split = subnet.split('/');
                       subnet = split[0],
                       prefix = split[1];
                } catch (e) { }; // Handle the error!?
             };
             return [subnet,prefix];
       },
       toInt: function (ip,mode) {
             switch (mode) {
                    case 6:
                         return this.Expand(ip).split(":").map(function(x){return parseInt(x,16)});
                    case 4:
                    default:
                         return ((ip=ip.split('.'))[0]<<24|ip[1]<<16|ip[2]<<8|ip[3]);
             };
       },
       Expand: function (ip) {
             var ip = String(ip);
             if (ip.indexOf("::") != -1) {
                if (ip.match(/::/g).length > 1) {
                   return false;
                };
                var split = ip.split("::"),
                    res = (split[0]+Array(9-(split[0].split(":").length+split[1].split(":").length)).join(':0000')+':'+split[1]).split(":");
             };
             var ip = (res||ip.split(":")).map(function (x) {
                 return (x.length<4?(new Array(5-x.length).join('0')+x):x);
             }).join(":");
             return (this.__isIPv6(ip)?ip:false);
       },
   };
   return Object.create(proto);
},"inSubnet");

/*
  Need to make this better. Should check more than just 
  exports and window as that can be set by anything.
*/
function Exporter (fn,plug) {
         // This just seems silly... There HAS to be a better way!
         var isNode = (typeof process==='object' && process.toString()==='[object process]' && typeof exports!=='undefined');

         // This also seems like there should be a better way...
         if (isNode) {
            module.exports = fn(isNode);
          } else {
            window[plug] = fn(isNode);
         };
};
