/*
  inSubnet - By Louis T. <louist@ltdev.im>
  Check an IP(v4 or v6) against a subnet.
*/
Exporter(function (isNode) {
   var proto = {
       version: '0.0.8',
       Auto: function (ip, subnet, prefix) {
             if (!ip || !subnet) {
                return false;
             }
             var sp = this.getPrefix(subnet,prefix),
                 nip = false;
             if (this.isIP(sp[0]) && sp[1] >= 0) {
                return this[this.isIPv4(ip)||(nip = this.isDecimal(ip))?'__IPv4':'__IPv6']((nip||ip),sp[0],sp[1]);
             }
             return false;
       },
       IPv4: function (ip, subnet, prefix) {
             var sp = this.getPrefix(subnet,prefix);
             return this.__IPv4(ip,sp[0],sp[1]);
       },
       IPv4Dec: function (dec, subnet, prefix) {
             return this.IPv4(this.isDecimal(dec), subnet, prefix);
       },
       __IPv4: function (ip, subnet, prefix) {
             if (this.isIPv4(ip) && this.isIPv4(subnet) && prefix >= 0) {
                if (prefix > 32) {
                   return false;
                }
                var pint = this.toInt(ip),
                    sint = this.toInt(subnet),
                    cint = (pint&-1<<(32-prefix));
                return (cint === sint || (pint === cint && sint === 0 && prefix === 0));
             }
             return false;
       },
       isIPv4: function (ip) {
             return /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/.test(ip);
       },
       isDecimal: function (ip) {
             return ((!this.isIPv4(ip) && (ip = this.toInt(ip,0)) && this.isIPv4(ip))?ip:false);
       },
       IPv6: function (ip, subnet, prefix) {
             var sp = this.getPrefix(subnet,prefix);
             return this.__IPv6(ip,sp[0],sp[1]);
       },
       __IPv6: function (ip, subnet, prefix) {
             if (this.isIPv6(ip) && this.isIPv6(subnet) && prefix >= 0) {
                if (prefix > 128) {
                   return false;
                }
                var o = Array.apply(null,Array(Math.floor(prefix/16))).map(function(_){ return 0xffff; });
                if (prefix%16) {
                   o.push((1<<prefix%16)-1);
                }
                var mask = o.concat(Array.apply(null,Array(8-o.length)).map(function(_){ return 0; }));     
                ip = this.toInt(ip,6), subnet = this.toInt(subnet,6);
                return mask.every(function(m,n){ return (ip[n]&m) == (subnet[n]&m) });
             }
             return false;
       },
       isIPv6: function (ip) {
             return !!(this.Expand(ip));
       },
       __isIPv6: function (ip) {
             return /^([0-9a-f]{1,4})(\:([0-9a-f]{1,4})){7}$/i.test(ip);
       },
       isIP: function (ip) {
             return (this.isIPv4(ip)||this.isDecimal(ip)||this.isIPv6(ip));
       },
       Clean: function (ips, ff, sf) {
             if (Array.isArray(ips)) {
                var v4 = [],
                    v6 = [],
                    ff = ff||function(x){ return x; };
                ips.forEach(function(ip) {
                    if (/\/(\d+){1,3}$/.test(ip)) {
                       var sp = this.getPrefix(ip);
                       if (this.isIP(sp[0]) && sp[1] >= 0) {
                          var ip = (this.isIPv4(sp[0])||this.isDecimal(sp[0])?sp[0]:this.Expand(sp[0])),
                              p = sp[0]+'/'+sp[1];
                       }
                     } else {
                       var ip = p = (this.isIPv4(ip)||this.isDecimal(ip)?ip:this.Expand(ip));
                    }
                    if (ip) {
                       (this.isIPv4(ip)?v4:v6).push(p);
                    }
                },this);
                var ret = {
                    ipv4: v4.filter(ff,this).sort(sf),
                    ipv6: v6.filter(ff,this).sort(sf)
                };
                return ((!!(ret.ipv4.length)||!!(ret.ipv6.length))?ret:false);
             }
             return false;
       },
       Filter: function (ip, subnets, noupdate) {
             if (subnets && !noupdate) {
                this.setSubnets(subnets);
             }
             if (Array.isArray(ip)){ 
                return ip.filter(function(ip) {
                   return this.__Validate(ip);
                },this);
              } else {
                return (this.__Validate(ip)?ip:false);
             }
       },
       Validate: function (ip, subnets, noupdate) {
             if (subnets && !noupdate) {
                this.setSubnets(subnets);
             }
             if (Array.isArray(ip)){
                return ip.map(function(ip) {
                   return this.__Validate(ip);
                },this);
              } else {
                return this.__Validate(ip);
             }
       },
       __Validate: function (ip) {
             if (this.subnets && this.isIP(ip)) {
                var ver = ((this.isIPv4(ip)||this.isDecimal(ip))?'ipv4':'ipv6');
                if (!!(this.subnets[ver].length)) {
                   var subs = this.subnets[ver];
                   for (var num in subs) {
                       if (/\/(\d+){1,3}$/.test(subs[num]) && this.Auto(ip,subs[num])) {
                          return true;
                       }
                   }
                }
             }
             return false;
       },
       setSubnets: function (subnets) {
             if (Array.isArray(subnets)) {
                var cleaned = this.Clean(subnets,function(ip){return /\/(\d+){1,3}$/.test(ip)});
                this.subnets = {
                     ipv4: cleaned.ipv4||[],
                     ipv6: cleaned.ipv6||[],
                }
                return (!!(this.subnets.ipv4.length)||!!(this.subnets.ipv6.length));
             }
             return false;
       },
       getPrefix: function (subnet, prefix) {
             if (/\/(\d+){1,3}$/.test(subnet)) {
                var ret = subnet.split("/");
             }
             var ip = (ret?ret[0]:subnet),
                 subnet = ((this.isIPv4(ip)||this.isIPv6(ip))?ip:this.isDecimal(ip));
             return [subnet,parseInt(ret?ret[1]:prefix,10)];
       },
       toInt: function (ip,mode) {
             switch (mode) {
                    case 0:
                         return (isFinite(ip)&&!isNaN(ip)?[ip>>>24,ip>>>16&0xFF,ip>>>8&0xFF,ip&0xFF].join('.'):false);
                    case 6:
                         return this.Expand(ip).split(':').map(function(x){return parseInt(x,16)});
                    case 4:
                    default:
                         return ((ip=ip.split('.'))[0]<<24|ip[1]<<16|ip[2]<<8|ip[3]);
             }
       },
       Expand: function (ip, zero) {
             var ip = String(ip);
             if (ip.indexOf('::') != -1) {
                if (ip.match(/::/g).length > 1) {
                   return false;
                }
                var split = ip.split(/::/),
                    first = (!split[0]?'0':split[0]),
                    last = (!split[1]?'0':split[1]),
                    zeros = ':'+(!zero?'0000':'0'),
                    res = (first+Array(9-(first.split(':').length+last.split(':').length)).join(zeros)+':'+last).split(':');
             }
             var ip = (res||ip.split(':')).map(function (x) {
                 return (zero?(/^0+$/.test(x)?0:x.replace(/^0+/,'')):(x.length<4?('0000'+x).slice(-4):x));
             }).join(':');
             return (this.__isIPv6(ip)?ip:false);
       },
   };
   return Object.create(proto);
},'inSubnet');

/*
  Need to make this better. Should check more than just 
  exports and window as that can be set by anything.
*/
function Exporter (fn,plug) {
         // This just seems silly... There HAS to be a better way!
         var isNode = (typeof exports !== 'undefined' && this.exports !== exports);

         // This also seems like there should be a better way...
         if (isNode) {
            module.exports = fn(isNode);
          } else {
            window[plug] = fn(isNode);
         }
}
