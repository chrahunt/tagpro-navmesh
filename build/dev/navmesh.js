(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavMesh = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
// rev 452
/********************************************************************************
 *                                                                              *
 * Author    :  Angus Johnson                                                   *
 * Version   :  6.1.3a                                                          *
 * Date      :  22 January 2014                                                 *
 * Website   :  http://www.angusj.com                                           *
 * Copyright :  Angus Johnson 2010-2014                                         *
 *                                                                              *
 * License:                                                                     *
 * Use, modification & distribution is subject to Boost Software License Ver 1. *
 * http://www.boost.org/LICENSE_1_0.txt                                         *
 *                                                                              *
 * Attributions:                                                                *
 * The code in this library is an extension of Bala Vatti's clipping algorithm: *
 * "A generic solution to polygon clipping"                                     *
 * Communications of the ACM, Vol 35, Issue 7 (July 1992) pp 56-63.             *
 * http://portal.acm.org/citation.cfm?id=129906                                 *
 *                                                                              *
 * Computer graphics and geometric modeling: implementation and algorithms      *
 * By Max K. Agoston                                                            *
 * Springer; 1 edition (January 4, 2005)                                        *
 * http://books.google.com/books?q=vatti+clipping+agoston                       *
 *                                                                              *
 * See also:                                                                    *
 * "Polygon Offsetting by Computing Winding Numbers"                            *
 * Paper no. DETC2005-85513 pp. 565-575                                         *
 * ASME 2005 International Design Engineering Technical Conferences             *
 * and Computers and Information in Engineering Conference (IDETC/CIE2005)      *
 * September 24-28, 2005 , Long Beach, California, USA                          *
 * http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf              *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Author    :  Timo                                                            *
 * Version   :  6.1.3.2                                                         *
 * Date      :  1 February 2014                                                 *
 *                                                                              *
 * This is a translation of the C# Clipper library to Javascript.               *
 * Int128 struct of C# is implemented using JSBN of Tom Wu.                     *
 * Because Javascript lacks support for 64-bit integers, the space              *
 * is a little more restricted than in C# version.                              *
 *                                                                              *
 * C# version has support for coordinate space:                                 *
 * +-4611686018427387903 ( sqrt(2^127 -1)/2 )                                   *
 * while Javascript version has support for space:                              *
 * +-4503599627370495 ( sqrt(2^106 -1)/2 )                                      *
 *                                                                              *
 * Tom Wu's JSBN proved to be the fastest big integer library:                  *
 * http://jsperf.com/big-integer-library-test                                   *
 *                                                                              *
 * This class can be made simpler when (if ever) 64-bit integer support comes.  *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Basic JavaScript BN library - subset useful for RSA encryption.              *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/                               *
 * Copyright (c) 2005  Tom Wu                                                   *
 * All Rights Reserved.                                                         *
 * See "LICENSE" for details:                                                   *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE                        *
 *                                                                              *
 *******************************************************************************/
(function(){function k(a,b,c){d.biginteger_used=1;null!=a&&("number"==typeof a&&"undefined"==typeof b?this.fromInt(a):"number"==typeof a?this.fromNumber(a,b,c):null==b&&"string"!=typeof a?this.fromString(a,256):this.fromString(a,b))}function q(){return new k(null)}function Q(a,b,c,e,d,g){for(;0<=--g;){var h=b*this[a++]+c[e]+d;d=Math.floor(h/67108864);c[e++]=h&67108863}return d}function R(a,b,c,e,d,g){var h=b&32767;for(b>>=15;0<=--g;){var l=this[a]&32767,k=this[a++]>>15,n=b*l+k*h,l=h*l+((n&32767)<<
15)+c[e]+(d&1073741823);d=(l>>>30)+(n>>>15)+b*k+(d>>>30);c[e++]=l&1073741823}return d}function S(a,b,c,e,d,g){var h=b&16383;for(b>>=14;0<=--g;){var l=this[a]&16383,k=this[a++]>>14,n=b*l+k*h,l=h*l+((n&16383)<<14)+c[e]+d;d=(l>>28)+(n>>14)+b*k;c[e++]=l&268435455}return d}function L(a,b){var c=B[a.charCodeAt(b)];return null==c?-1:c}function v(a){var b=q();b.fromInt(a);return b}function C(a){var b=1,c;0!=(c=a>>>16)&&(a=c,b+=16);0!=(c=a>>8)&&(a=c,b+=8);0!=(c=a>>4)&&(a=c,b+=4);0!=(c=a>>2)&&(a=c,b+=2);0!=
a>>1&&(b+=1);return b}function x(a){this.m=a}function y(a){this.m=a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<a.DB-15)-1;this.mt2=2*a.t}function T(a,b){return a&b}function I(a,b){return a|b}function M(a,b){return a^b}function N(a,b){return a&~b}function A(){}function O(a){return a}function w(a){this.r2=q();this.q3=q();k.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}var d={},D=!1;"undefined"!==typeof module&&module.exports?(module.exports=d,D=!0):
"undefined"!==typeof document?window.ClipperLib=d:self.ClipperLib=d;var r;if(D)p="chrome",r="Netscape";else{var p=navigator.userAgent.toString().toLowerCase();r=navigator.appName}var E,J,F,G,H,P;E=-1!=p.indexOf("chrome")&&-1==p.indexOf("chromium")?1:0;D=-1!=p.indexOf("chromium")?1:0;J=-1!=p.indexOf("safari")&&-1==p.indexOf("chrome")&&-1==p.indexOf("chromium")?1:0;F=-1!=p.indexOf("firefox")?1:0;p.indexOf("firefox/17");p.indexOf("firefox/15");p.indexOf("firefox/3");G=-1!=p.indexOf("opera")?1:0;p.indexOf("msie 10");
p.indexOf("msie 9");H=-1!=p.indexOf("msie 8")?1:0;P=-1!=p.indexOf("msie 7")?1:0;p=-1!=p.indexOf("msie ")?1:0;d.biginteger_used=null;"Microsoft Internet Explorer"==r?(k.prototype.am=R,r=30):"Netscape"!=r?(k.prototype.am=Q,r=26):(k.prototype.am=S,r=28);k.prototype.DB=r;k.prototype.DM=(1<<r)-1;k.prototype.DV=1<<r;k.prototype.FV=Math.pow(2,52);k.prototype.F1=52-r;k.prototype.F2=2*r-52;var B=[],u;r=48;for(u=0;9>=u;++u)B[r++]=u;r=97;for(u=10;36>u;++u)B[r++]=u;r=65;for(u=10;36>u;++u)B[r++]=u;x.prototype.convert=
function(a){return 0>a.s||0<=a.compareTo(this.m)?a.mod(this.m):a};x.prototype.revert=function(a){return a};x.prototype.reduce=function(a){a.divRemTo(this.m,null,a)};x.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};x.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};y.prototype.convert=function(a){var b=q();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);0>a.s&&0<b.compareTo(k.ZERO)&&this.m.subTo(b,b);return b};y.prototype.revert=function(a){var b=q();a.copyTo(b);
this.reduce(b);return b};y.prototype.reduce=function(a){for(;a.t<=this.mt2;)a[a.t++]=0;for(var b=0;b<this.m.t;++b){var c=a[b]&32767,e=c*this.mpl+((c*this.mph+(a[b]>>15)*this.mpl&this.um)<<15)&a.DM,c=b+this.m.t;for(a[c]+=this.m.am(0,e,a,b,0,this.m.t);a[c]>=a.DV;)a[c]-=a.DV,a[++c]++}a.clamp();a.drShiftTo(this.m.t,a);0<=a.compareTo(this.m)&&a.subTo(this.m,a)};y.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};y.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};k.prototype.copyTo=
function(a){for(var b=this.t-1;0<=b;--b)a[b]=this[b];a.t=this.t;a.s=this.s};k.prototype.fromInt=function(a){this.t=1;this.s=0>a?-1:0;0<a?this[0]=a:-1>a?this[0]=a+this.DV:this.t=0};k.prototype.fromString=function(a,b){var c;if(16==b)c=4;else if(8==b)c=3;else if(256==b)c=8;else if(2==b)c=1;else if(32==b)c=5;else if(4==b)c=2;else{this.fromRadix(a,b);return}this.s=this.t=0;for(var e=a.length,d=!1,g=0;0<=--e;){var h=8==c?a[e]&255:L(a,e);0>h?"-"==a.charAt(e)&&(d=!0):(d=!1,0==g?this[this.t++]=h:g+c>this.DB?
(this[this.t-1]|=(h&(1<<this.DB-g)-1)<<g,this[this.t++]=h>>this.DB-g):this[this.t-1]|=h<<g,g+=c,g>=this.DB&&(g-=this.DB))}8==c&&0!=(a[0]&128)&&(this.s=-1,0<g&&(this[this.t-1]|=(1<<this.DB-g)-1<<g));this.clamp();d&&k.ZERO.subTo(this,this)};k.prototype.clamp=function(){for(var a=this.s&this.DM;0<this.t&&this[this.t-1]==a;)--this.t};k.prototype.dlShiftTo=function(a,b){var c;for(c=this.t-1;0<=c;--c)b[c+a]=this[c];for(c=a-1;0<=c;--c)b[c]=0;b.t=this.t+a;b.s=this.s};k.prototype.drShiftTo=function(a,b){for(var c=
a;c<this.t;++c)b[c-a]=this[c];b.t=Math.max(this.t-a,0);b.s=this.s};k.prototype.lShiftTo=function(a,b){var c=a%this.DB,e=this.DB-c,d=(1<<e)-1,g=Math.floor(a/this.DB),h=this.s<<c&this.DM,l;for(l=this.t-1;0<=l;--l)b[l+g+1]=this[l]>>e|h,h=(this[l]&d)<<c;for(l=g-1;0<=l;--l)b[l]=0;b[g]=h;b.t=this.t+g+1;b.s=this.s;b.clamp()};k.prototype.rShiftTo=function(a,b){b.s=this.s;var c=Math.floor(a/this.DB);if(c>=this.t)b.t=0;else{var e=a%this.DB,d=this.DB-e,g=(1<<e)-1;b[0]=this[c]>>e;for(var h=c+1;h<this.t;++h)b[h-
c-1]|=(this[h]&g)<<d,b[h-c]=this[h]>>e;0<e&&(b[this.t-c-1]|=(this.s&g)<<d);b.t=this.t-c;b.clamp()}};k.prototype.subTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,this.t);c<d;)e+=this[c]-a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<this.t){for(e-=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e-=a[c],b[c++]=e&this.DM,e>>=this.DB;e-=a.s}b.s=0>e?-1:0;-1>e?b[c++]=this.DV+e:0<e&&(b[c++]=e);b.t=c;b.clamp()};k.prototype.multiplyTo=function(a,b){var c=this.abs(),e=
a.abs(),d=c.t;for(b.t=d+e.t;0<=--d;)b[d]=0;for(d=0;d<e.t;++d)b[d+c.t]=c.am(0,e[d],b,d,0,c.t);b.s=0;b.clamp();this.s!=a.s&&k.ZERO.subTo(b,b)};k.prototype.squareTo=function(a){for(var b=this.abs(),c=a.t=2*b.t;0<=--c;)a[c]=0;for(c=0;c<b.t-1;++c){var e=b.am(c,b[c],a,2*c,0,1);(a[c+b.t]+=b.am(c+1,2*b[c],a,2*c+1,e,b.t-c-1))>=b.DV&&(a[c+b.t]-=b.DV,a[c+b.t+1]=1)}0<a.t&&(a[a.t-1]+=b.am(c,b[c],a,2*c,0,1));a.s=0;a.clamp()};k.prototype.divRemTo=function(a,b,c){var e=a.abs();if(!(0>=e.t)){var d=this.abs();if(d.t<
e.t)null!=b&&b.fromInt(0),null!=c&&this.copyTo(c);else{null==c&&(c=q());var g=q(),h=this.s;a=a.s;var l=this.DB-C(e[e.t-1]);0<l?(e.lShiftTo(l,g),d.lShiftTo(l,c)):(e.copyTo(g),d.copyTo(c));e=g.t;d=g[e-1];if(0!=d){var z=d*(1<<this.F1)+(1<e?g[e-2]>>this.F2:0),n=this.FV/z,z=(1<<this.F1)/z,U=1<<this.F2,m=c.t,p=m-e,s=null==b?q():b;g.dlShiftTo(p,s);0<=c.compareTo(s)&&(c[c.t++]=1,c.subTo(s,c));k.ONE.dlShiftTo(e,s);for(s.subTo(g,g);g.t<e;)g[g.t++]=0;for(;0<=--p;){var r=c[--m]==d?this.DM:Math.floor(c[m]*n+(c[m-
1]+U)*z);if((c[m]+=g.am(0,r,c,p,0,e))<r)for(g.dlShiftTo(p,s),c.subTo(s,c);c[m]<--r;)c.subTo(s,c)}null!=b&&(c.drShiftTo(e,b),h!=a&&k.ZERO.subTo(b,b));c.t=e;c.clamp();0<l&&c.rShiftTo(l,c);0>h&&k.ZERO.subTo(c,c)}}}};k.prototype.invDigit=function(){if(1>this.t)return 0;var a=this[0];if(0==(a&1))return 0;var b=a&3,b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%this.DV)%this.DV;return 0<b?this.DV-b:-b};k.prototype.isEven=function(){return 0==(0<this.t?this[0]&1:this.s)};
k.prototype.exp=function(a,b){if(4294967295<a||1>a)return k.ONE;var c=q(),e=q(),d=b.convert(this),g=C(a)-1;for(d.copyTo(c);0<=--g;)if(b.sqrTo(c,e),0<(a&1<<g))b.mulTo(e,d,c);else var h=c,c=e,e=h;return b.revert(c)};k.prototype.toString=function(a){if(0>this.s)return"-"+this.negate().toString(a);if(16==a)a=4;else if(8==a)a=3;else if(2==a)a=1;else if(32==a)a=5;else if(4==a)a=2;else return this.toRadix(a);var b=(1<<a)-1,c,e=!1,d="",g=this.t,h=this.DB-g*this.DB%a;if(0<g--)for(h<this.DB&&0<(c=this[g]>>
h)&&(e=!0,d="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c));0<=g;)h<a?(c=(this[g]&(1<<h)-1)<<a-h,c|=this[--g]>>(h+=this.DB-a)):(c=this[g]>>(h-=a)&b,0>=h&&(h+=this.DB,--g)),0<c&&(e=!0),e&&(d+="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c));return e?d:"0"};k.prototype.negate=function(){var a=q();k.ZERO.subTo(this,a);return a};k.prototype.abs=function(){return 0>this.s?this.negate():this};k.prototype.compareTo=function(a){var b=this.s-a.s;if(0!=b)return b;var c=this.t,b=c-a.t;if(0!=b)return 0>this.s?
-b:b;for(;0<=--c;)if(0!=(b=this[c]-a[c]))return b;return 0};k.prototype.bitLength=function(){return 0>=this.t?0:this.DB*(this.t-1)+C(this[this.t-1]^this.s&this.DM)};k.prototype.mod=function(a){var b=q();this.abs().divRemTo(a,null,b);0>this.s&&0<b.compareTo(k.ZERO)&&a.subTo(b,b);return b};k.prototype.modPowInt=function(a,b){var c;c=256>a||b.isEven()?new x(b):new y(b);return this.exp(a,c)};k.ZERO=v(0);k.ONE=v(1);A.prototype.convert=O;A.prototype.revert=O;A.prototype.mulTo=function(a,b,c){a.multiplyTo(b,
c)};A.prototype.sqrTo=function(a,b){a.squareTo(b)};w.prototype.convert=function(a){if(0>a.s||a.t>2*this.m.t)return a.mod(this.m);if(0>a.compareTo(this.m))return a;var b=q();a.copyTo(b);this.reduce(b);return b};w.prototype.revert=function(a){return a};w.prototype.reduce=function(a){a.drShiftTo(this.m.t-1,this.r2);a.t>this.m.t+1&&(a.t=this.m.t+1,a.clamp());this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);for(this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);0>a.compareTo(this.r2);)a.dAddOffset(1,
this.m.t+1);for(a.subTo(this.r2,a);0<=a.compareTo(this.m);)a.subTo(this.m,a)};w.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};w.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};var t=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,
409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],V=67108864/t[t.length-1];k.prototype.chunkSize=function(a){return Math.floor(Math.LN2*this.DB/Math.log(a))};k.prototype.toRadix=function(a){null==
a&&(a=10);if(0==this.signum()||2>a||36<a)return"0";var b=this.chunkSize(a),b=Math.pow(a,b),c=v(b),e=q(),d=q(),g="";for(this.divRemTo(c,e,d);0<e.signum();)g=(b+d.intValue()).toString(a).substr(1)+g,e.divRemTo(c,e,d);return d.intValue().toString(a)+g};k.prototype.fromRadix=function(a,b){this.fromInt(0);null==b&&(b=10);for(var c=this.chunkSize(b),e=Math.pow(b,c),d=!1,g=0,h=0,l=0;l<a.length;++l){var z=L(a,l);0>z?"-"==a.charAt(l)&&0==this.signum()&&(d=!0):(h=b*h+z,++g>=c&&(this.dMultiply(e),this.dAddOffset(h,
0),h=g=0))}0<g&&(this.dMultiply(Math.pow(b,g)),this.dAddOffset(h,0));d&&k.ZERO.subTo(this,this)};k.prototype.fromNumber=function(a,b,c){if("number"==typeof b)if(2>a)this.fromInt(1);else for(this.fromNumber(a,c),this.testBit(a-1)||this.bitwiseTo(k.ONE.shiftLeft(a-1),I,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(b);)this.dAddOffset(2,0),this.bitLength()>a&&this.subTo(k.ONE.shiftLeft(a-1),this);else{c=[];var e=a&7;c.length=(a>>3)+1;b.nextBytes(c);c[0]=0<e?c[0]&(1<<e)-1:0;this.fromString(c,
256)}};k.prototype.bitwiseTo=function(a,b,c){var e,d,g=Math.min(a.t,this.t);for(e=0;e<g;++e)c[e]=b(this[e],a[e]);if(a.t<this.t){d=a.s&this.DM;for(e=g;e<this.t;++e)c[e]=b(this[e],d);c.t=this.t}else{d=this.s&this.DM;for(e=g;e<a.t;++e)c[e]=b(d,a[e]);c.t=a.t}c.s=b(this.s,a.s);c.clamp()};k.prototype.changeBit=function(a,b){var c=k.ONE.shiftLeft(a);this.bitwiseTo(c,b,c);return c};k.prototype.addTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,this.t);c<d;)e+=this[c]+a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<
this.t){for(e+=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e+=a[c],b[c++]=e&this.DM,e>>=this.DB;e+=a.s}b.s=0>e?-1:0;0<e?b[c++]=e:-1>e&&(b[c++]=this.DV+e);b.t=c;b.clamp()};k.prototype.dMultiply=function(a){this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()};k.prototype.dAddOffset=function(a,b){if(0!=a){for(;this.t<=b;)this[this.t++]=0;for(this[b]+=a;this[b]>=this.DV;)this[b]-=this.DV,++b>=this.t&&(this[this.t++]=0),++this[b]}};k.prototype.multiplyLowerTo=
function(a,b,c){var e=Math.min(this.t+a.t,b);c.s=0;for(c.t=e;0<e;)c[--e]=0;var d;for(d=c.t-this.t;e<d;++e)c[e+this.t]=this.am(0,a[e],c,e,0,this.t);for(d=Math.min(a.t,b);e<d;++e)this.am(0,a[e],c,e,0,b-e);c.clamp()};k.prototype.multiplyUpperTo=function(a,b,c){--b;var e=c.t=this.t+a.t-b;for(c.s=0;0<=--e;)c[e]=0;for(e=Math.max(b-this.t,0);e<a.t;++e)c[this.t+e-b]=this.am(b-e,a[e],c,0,0,this.t+e-b);c.clamp();c.drShiftTo(1,c)};k.prototype.modInt=function(a){if(0>=a)return 0;var b=this.DV%a,c=0>this.s?a-
1:0;if(0<this.t)if(0==b)c=this[0]%a;else for(var e=this.t-1;0<=e;--e)c=(b*c+this[e])%a;return c};k.prototype.millerRabin=function(a){var b=this.subtract(k.ONE),c=b.getLowestSetBit();if(0>=c)return!1;var e=b.shiftRight(c);a=a+1>>1;a>t.length&&(a=t.length);for(var d=q(),g=0;g<a;++g){d.fromInt(t[Math.floor(Math.random()*t.length)]);var h=d.modPow(e,this);if(0!=h.compareTo(k.ONE)&&0!=h.compareTo(b)){for(var l=1;l++<c&&0!=h.compareTo(b);)if(h=h.modPowInt(2,this),0==h.compareTo(k.ONE))return!1;if(0!=h.compareTo(b))return!1}}return!0};
k.prototype.clone=function(){var a=q();this.copyTo(a);return a};k.prototype.intValue=function(){if(0>this.s){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]};k.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24};k.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<16>>16};k.prototype.signum=function(){return 0>this.s?-1:0>=this.t||1==this.t&&0>=this[0]?
0:1};k.prototype.toByteArray=function(){var a=this.t,b=[];b[0]=this.s;var c=this.DB-a*this.DB%8,e,d=0;if(0<a--)for(c<this.DB&&(e=this[a]>>c)!=(this.s&this.DM)>>c&&(b[d++]=e|this.s<<this.DB-c);0<=a;)if(8>c?(e=(this[a]&(1<<c)-1)<<8-c,e|=this[--a]>>(c+=this.DB-8)):(e=this[a]>>(c-=8)&255,0>=c&&(c+=this.DB,--a)),0!=(e&128)&&(e|=-256),0==d&&(this.s&128)!=(e&128)&&++d,0<d||e!=this.s)b[d++]=e;return b};k.prototype.equals=function(a){return 0==this.compareTo(a)};k.prototype.min=function(a){return 0>this.compareTo(a)?
this:a};k.prototype.max=function(a){return 0<this.compareTo(a)?this:a};k.prototype.and=function(a){var b=q();this.bitwiseTo(a,T,b);return b};k.prototype.or=function(a){var b=q();this.bitwiseTo(a,I,b);return b};k.prototype.xor=function(a){var b=q();this.bitwiseTo(a,M,b);return b};k.prototype.andNot=function(a){var b=q();this.bitwiseTo(a,N,b);return b};k.prototype.not=function(){for(var a=q(),b=0;b<this.t;++b)a[b]=this.DM&~this[b];a.t=this.t;a.s=~this.s;return a};k.prototype.shiftLeft=function(a){var b=
q();0>a?this.rShiftTo(-a,b):this.lShiftTo(a,b);return b};k.prototype.shiftRight=function(a){var b=q();0>a?this.lShiftTo(-a,b):this.rShiftTo(a,b);return b};k.prototype.getLowestSetBit=function(){for(var a=0;a<this.t;++a)if(0!=this[a]){var b=a*this.DB;a=this[a];if(0==a)a=-1;else{var c=0;0==(a&65535)&&(a>>=16,c+=16);0==(a&255)&&(a>>=8,c+=8);0==(a&15)&&(a>>=4,c+=4);0==(a&3)&&(a>>=2,c+=2);0==(a&1)&&++c;a=c}return b+a}return 0>this.s?this.t*this.DB:-1};k.prototype.bitCount=function(){for(var a=0,b=this.s&
this.DM,c=0;c<this.t;++c){for(var e=this[c]^b,d=0;0!=e;)e&=e-1,++d;a+=d}return a};k.prototype.testBit=function(a){var b=Math.floor(a/this.DB);return b>=this.t?0!=this.s:0!=(this[b]&1<<a%this.DB)};k.prototype.setBit=function(a){return this.changeBit(a,I)};k.prototype.clearBit=function(a){return this.changeBit(a,N)};k.prototype.flipBit=function(a){return this.changeBit(a,M)};k.prototype.add=function(a){var b=q();this.addTo(a,b);return b};k.prototype.subtract=function(a){var b=q();this.subTo(a,b);return b};
k.prototype.multiply=function(a){var b=q();this.multiplyTo(a,b);return b};k.prototype.divide=function(a){var b=q();this.divRemTo(a,b,null);return b};k.prototype.remainder=function(a){var b=q();this.divRemTo(a,null,b);return b};k.prototype.divideAndRemainder=function(a){var b=q(),c=q();this.divRemTo(a,b,c);return[b,c]};k.prototype.modPow=function(a,b){var c=a.bitLength(),e,d=v(1),g;if(0>=c)return d;e=18>c?1:48>c?3:144>c?4:768>c?5:6;g=8>c?new x(b):b.isEven()?new w(b):new y(b);var h=[],l=3,k=e-1,n=(1<<
e)-1;h[1]=g.convert(this);if(1<e)for(c=q(),g.sqrTo(h[1],c);l<=n;)h[l]=q(),g.mulTo(c,h[l-2],h[l]),l+=2;for(var m=a.t-1,p,r=!0,s=q(),c=C(a[m])-1;0<=m;){c>=k?p=a[m]>>c-k&n:(p=(a[m]&(1<<c+1)-1)<<k-c,0<m&&(p|=a[m-1]>>this.DB+c-k));for(l=e;0==(p&1);)p>>=1,--l;0>(c-=l)&&(c+=this.DB,--m);if(r)h[p].copyTo(d),r=!1;else{for(;1<l;)g.sqrTo(d,s),g.sqrTo(s,d),l-=2;0<l?g.sqrTo(d,s):(l=d,d=s,s=l);g.mulTo(s,h[p],d)}for(;0<=m&&0==(a[m]&1<<c);)g.sqrTo(d,s),l=d,d=s,s=l,0>--c&&(c=this.DB-1,--m)}return g.revert(d)};k.prototype.modInverse=
function(a){var b=a.isEven();if(this.isEven()&&b||0==a.signum())return k.ZERO;for(var c=a.clone(),e=this.clone(),d=v(1),g=v(0),h=v(0),l=v(1);0!=c.signum();){for(;c.isEven();)c.rShiftTo(1,c),b?(d.isEven()&&g.isEven()||(d.addTo(this,d),g.subTo(a,g)),d.rShiftTo(1,d)):g.isEven()||g.subTo(a,g),g.rShiftTo(1,g);for(;e.isEven();)e.rShiftTo(1,e),b?(h.isEven()&&l.isEven()||(h.addTo(this,h),l.subTo(a,l)),h.rShiftTo(1,h)):l.isEven()||l.subTo(a,l),l.rShiftTo(1,l);0<=c.compareTo(e)?(c.subTo(e,c),b&&d.subTo(h,d),
g.subTo(l,g)):(e.subTo(c,e),b&&h.subTo(d,h),l.subTo(g,l))}if(0!=e.compareTo(k.ONE))return k.ZERO;if(0<=l.compareTo(a))return l.subtract(a);if(0>l.signum())l.addTo(a,l);else return l;return 0>l.signum()?l.add(a):l};k.prototype.pow=function(a){return this.exp(a,new A)};k.prototype.gcd=function(a){var b=0>this.s?this.negate():this.clone();a=0>a.s?a.negate():a.clone();if(0>b.compareTo(a)){var c=b,b=a;a=c}var c=b.getLowestSetBit(),e=a.getLowestSetBit();if(0>e)return b;c<e&&(e=c);0<e&&(b.rShiftTo(e,b),
a.rShiftTo(e,a));for(;0<b.signum();)0<(c=b.getLowestSetBit())&&b.rShiftTo(c,b),0<(c=a.getLowestSetBit())&&a.rShiftTo(c,a),0<=b.compareTo(a)?(b.subTo(a,b),b.rShiftTo(1,b)):(a.subTo(b,a),a.rShiftTo(1,a));0<e&&a.lShiftTo(e,a);return a};k.prototype.isProbablePrime=function(a){var b,c=this.abs();if(1==c.t&&c[0]<=t[t.length-1]){for(b=0;b<t.length;++b)if(c[0]==t[b])return!0;return!1}if(c.isEven())return!1;for(b=1;b<t.length;){for(var e=t[b],d=b+1;d<t.length&&e<V;)e*=t[d++];for(e=c.modInt(e);b<d;)if(0==e%
t[b++])return!1}return c.millerRabin(a)};k.prototype.square=function(){var a=q();this.squareTo(a);return a};var m=k;m.prototype.IsNegative=function(){return-1==this.compareTo(m.ZERO)?!0:!1};m.op_Equality=function(a,b){return 0==a.compareTo(b)?!0:!1};m.op_Inequality=function(a,b){return 0!=a.compareTo(b)?!0:!1};m.op_GreaterThan=function(a,b){return 0<a.compareTo(b)?!0:!1};m.op_LessThan=function(a,b){return 0>a.compareTo(b)?!0:!1};m.op_Addition=function(a,b){return(new m(a)).add(new m(b))};m.op_Subtraction=
function(a,b){return(new m(a)).subtract(new m(b))};m.Int128Mul=function(a,b){return(new m(a)).multiply(new m(b))};m.op_Division=function(a,b){return a.divide(b)};m.prototype.ToDouble=function(){return parseFloat(this.toString())};if("undefined"==typeof K)var K=function(a,b){var c;if("undefined"==typeof Object.getOwnPropertyNames)for(c in b.prototype){if("undefined"==typeof a.prototype[c]||a.prototype[c]==Object.prototype[c])a.prototype[c]=b.prototype[c]}else for(var e=Object.getOwnPropertyNames(b.prototype),
d=0;d<e.length;d++)"undefined"==typeof Object.getOwnPropertyDescriptor(a.prototype,e[d])&&Object.defineProperty(a.prototype,e[d],Object.getOwnPropertyDescriptor(b.prototype,e[d]));for(c in b)"undefined"==typeof a[c]&&(a[c]=b[c]);a.$baseCtor=b};d.Path=function(){return[]};d.Paths=function(){return[]};d.DoublePoint=function(){var a=arguments;this.Y=this.X=0;1==a.length?(this.X=a[0].X,this.Y=a[0].Y):2==a.length&&(this.X=a[0],this.Y=a[1])};d.DoublePoint0=function(){this.Y=this.X=0};d.DoublePoint1=function(a){this.X=
a.X;this.Y=a.Y};d.DoublePoint2=function(a,b){this.X=a;this.Y=b};d.PolyNode=function(){this.m_Parent=null;this.m_polygon=new d.Path;this.m_endtype=this.m_jointype=this.m_Index=0;this.m_Childs=[];this.IsOpen=!1};d.PolyNode.prototype.IsHoleNode=function(){for(var a=!0,b=this.m_Parent;null!==b;)a=!a,b=b.m_Parent;return a};d.PolyNode.prototype.ChildCount=function(){return this.m_Childs.length};d.PolyNode.prototype.Contour=function(){return this.m_polygon};d.PolyNode.prototype.AddChild=function(a){var b=
this.m_Childs.length;this.m_Childs.push(a);a.m_Parent=this;a.m_Index=b};d.PolyNode.prototype.GetNext=function(){return 0<this.m_Childs.length?this.m_Childs[0]:this.GetNextSiblingUp()};d.PolyNode.prototype.GetNextSiblingUp=function(){return null===this.m_Parent?null:this.m_Index==this.m_Parent.m_Childs.length-1?this.m_Parent.GetNextSiblingUp():this.m_Parent.m_Childs[this.m_Index+1]};d.PolyNode.prototype.Childs=function(){return this.m_Childs};d.PolyNode.prototype.Parent=function(){return this.m_Parent};
d.PolyNode.prototype.IsHole=function(){return this.IsHoleNode()};d.PolyTree=function(){this.m_AllPolys=[];d.PolyNode.call(this)};d.PolyTree.prototype.Clear=function(){for(var a=0,b=this.m_AllPolys.length;a<b;a++)this.m_AllPolys[a]=null;this.m_AllPolys.length=0;this.m_Childs.length=0};d.PolyTree.prototype.GetFirst=function(){return 0<this.m_Childs.length?this.m_Childs[0]:null};d.PolyTree.prototype.Total=function(){return this.m_AllPolys.length};K(d.PolyTree,d.PolyNode);d.Math_Abs_Int64=d.Math_Abs_Int32=
d.Math_Abs_Double=function(a){return Math.abs(a)};d.Math_Max_Int32_Int32=function(a,b){return Math.max(a,b)};d.Cast_Int32=p||G||J?function(a){return a|0}:function(a){return~~a};d.Cast_Int64=E?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):~~a}:F&&"function"==typeof Number.toInteger?function(a){return Number.toInteger(a)}:P||H?function(a){return parseInt(a,10)}:p?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):a|0}:function(a){return 0>a?Math.ceil(a):
Math.floor(a)};d.Clear=function(a){a.length=0};d.PI=3.141592653589793;d.PI2=6.283185307179586;d.IntPoint=function(){var a;a=arguments;var b=a.length;this.Y=this.X=0;2==b?(this.X=a[0],this.Y=a[1]):1==b?a[0]instanceof d.DoublePoint?(a=a[0],this.X=d.Clipper.Round(a.X),this.Y=d.Clipper.Round(a.Y)):(a=a[0],this.X=a.X,this.Y=a.Y):this.Y=this.X=0};d.IntPoint.op_Equality=function(a,b){return a.X==b.X&&a.Y==b.Y};d.IntPoint.op_Inequality=function(a,b){return a.X!=b.X||a.Y!=b.Y};d.IntPoint0=function(){this.Y=
this.X=0};d.IntPoint1=function(a){this.X=a.X;this.Y=a.Y};d.IntPoint1dp=function(a){this.X=d.Clipper.Round(a.X);this.Y=d.Clipper.Round(a.Y)};d.IntPoint2=function(a,b){this.X=a;this.Y=b};d.IntRect=function(){var a=arguments,b=a.length;4==b?(this.left=a[0],this.top=a[1],this.right=a[2],this.bottom=a[3]):1==b?(this.left=ir.left,this.top=ir.top,this.right=ir.right,this.bottom=ir.bottom):this.bottom=this.right=this.top=this.left=0};d.IntRect0=function(){this.bottom=this.right=this.top=this.left=0};d.IntRect1=
function(a){this.left=a.left;this.top=a.top;this.right=a.right;this.bottom=a.bottom};d.IntRect4=function(a,b,c,e){this.left=a;this.top=b;this.right=c;this.bottom=e};d.ClipType={ctIntersection:0,ctUnion:1,ctDifference:2,ctXor:3};d.PolyType={ptSubject:0,ptClip:1};d.PolyFillType={pftEvenOdd:0,pftNonZero:1,pftPositive:2,pftNegative:3};d.JoinType={jtSquare:0,jtRound:1,jtMiter:2};d.EndType={etOpenSquare:0,etOpenRound:1,etOpenButt:2,etClosedLine:3,etClosedPolygon:4};d.EdgeSide={esLeft:0,esRight:1};d.Direction=
{dRightToLeft:0,dLeftToRight:1};d.TEdge=function(){this.Bot=new d.IntPoint;this.Curr=new d.IntPoint;this.Top=new d.IntPoint;this.Delta=new d.IntPoint;this.Dx=0;this.PolyTyp=d.PolyType.ptSubject;this.Side=d.EdgeSide.esLeft;this.OutIdx=this.WindCnt2=this.WindCnt=this.WindDelta=0;this.PrevInSEL=this.NextInSEL=this.PrevInAEL=this.NextInAEL=this.NextInLML=this.Prev=this.Next=null};d.IntersectNode=function(){this.Edge2=this.Edge1=null;this.Pt=new d.IntPoint};d.MyIntersectNodeSort=function(){};d.MyIntersectNodeSort.Compare=
function(a,b){return b.Pt.Y-a.Pt.Y};d.LocalMinima=function(){this.Y=0;this.Next=this.RightBound=this.LeftBound=null};d.Scanbeam=function(){this.Y=0;this.Next=null};d.OutRec=function(){this.Idx=0;this.IsOpen=this.IsHole=!1;this.PolyNode=this.BottomPt=this.Pts=this.FirstLeft=null};d.OutPt=function(){this.Idx=0;this.Pt=new d.IntPoint;this.Prev=this.Next=null};d.Join=function(){this.OutPt2=this.OutPt1=null;this.OffPt=new d.IntPoint};d.ClipperBase=function(){this.m_CurrentLM=this.m_MinimaList=null;this.m_edges=
[];this.PreserveCollinear=this.m_HasOpenPaths=this.m_UseFullRange=!1;this.m_CurrentLM=this.m_MinimaList=null;this.m_HasOpenPaths=this.m_UseFullRange=!1};d.ClipperBase.horizontal=-9007199254740992;d.ClipperBase.Skip=-2;d.ClipperBase.Unassigned=-1;d.ClipperBase.tolerance=1E-20;d.ClipperBase.loRange=47453132;d.ClipperBase.hiRange=0xfffffffffffff;d.ClipperBase.near_zero=function(a){return a>-d.ClipperBase.tolerance&&a<d.ClipperBase.tolerance};d.ClipperBase.IsHorizontal=function(a){return 0===a.Delta.Y};
d.ClipperBase.prototype.PointIsVertex=function(a,b){var c=b;do{if(d.IntPoint.op_Equality(c.Pt,a))return!0;c=c.Next}while(c!=b);return!1};d.ClipperBase.prototype.PointOnLineSegment=function(a,b,c,e){return e?a.X==b.X&&a.Y==b.Y||a.X==c.X&&a.Y==c.Y||a.X>b.X==a.X<c.X&&a.Y>b.Y==a.Y<c.Y&&m.op_Equality(m.Int128Mul(a.X-b.X,c.Y-b.Y),m.Int128Mul(c.X-b.X,a.Y-b.Y)):a.X==b.X&&a.Y==b.Y||a.X==c.X&&a.Y==c.Y||a.X>b.X==a.X<c.X&&a.Y>b.Y==a.Y<c.Y&&(a.X-b.X)*(c.Y-b.Y)==(c.X-b.X)*(a.Y-b.Y)};d.ClipperBase.prototype.PointOnPolygon=
function(a,b,c){for(var e=b;;){if(this.PointOnLineSegment(a,e.Pt,e.Next.Pt,c))return!0;e=e.Next;if(e==b)break}return!1};d.ClipperBase.prototype.SlopesEqual=d.ClipperBase.SlopesEqual=function(){var a=arguments,b=a.length,c,e,f;if(3==b)return b=a[0],c=a[1],(a=a[2])?m.op_Equality(m.Int128Mul(b.Delta.Y,c.Delta.X),m.Int128Mul(b.Delta.X,c.Delta.Y)):d.Cast_Int64(b.Delta.Y*c.Delta.X)==d.Cast_Int64(b.Delta.X*c.Delta.Y);if(4==b)return b=a[0],c=a[1],e=a[2],(a=a[3])?m.op_Equality(m.Int128Mul(b.Y-c.Y,c.X-e.X),
m.Int128Mul(b.X-c.X,c.Y-e.Y)):0===d.Cast_Int64((b.Y-c.Y)*(c.X-e.X))-d.Cast_Int64((b.X-c.X)*(c.Y-e.Y));b=a[0];c=a[1];e=a[2];f=a[3];return(a=a[4])?m.op_Equality(m.Int128Mul(b.Y-c.Y,e.X-f.X),m.Int128Mul(b.X-c.X,e.Y-f.Y)):0===d.Cast_Int64((b.Y-c.Y)*(e.X-f.X))-d.Cast_Int64((b.X-c.X)*(e.Y-f.Y))};d.ClipperBase.SlopesEqual3=function(a,b,c){return c?m.op_Equality(m.Int128Mul(a.Delta.Y,b.Delta.X),m.Int128Mul(a.Delta.X,b.Delta.Y)):d.Cast_Int64(a.Delta.Y*b.Delta.X)==d.Cast_Int64(a.Delta.X*b.Delta.Y)};d.ClipperBase.SlopesEqual4=
function(a,b,c,e){return e?m.op_Equality(m.Int128Mul(a.Y-b.Y,b.X-c.X),m.Int128Mul(a.X-b.X,b.Y-c.Y)):0===d.Cast_Int64((a.Y-b.Y)*(b.X-c.X))-d.Cast_Int64((a.X-b.X)*(b.Y-c.Y))};d.ClipperBase.SlopesEqual5=function(a,b,c,e,f){return f?m.op_Equality(m.Int128Mul(a.Y-b.Y,c.X-e.X),m.Int128Mul(a.X-b.X,c.Y-e.Y)):0===d.Cast_Int64((a.Y-b.Y)*(c.X-e.X))-d.Cast_Int64((a.X-b.X)*(c.Y-e.Y))};d.ClipperBase.prototype.Clear=function(){this.DisposeLocalMinimaList();for(var a=0,b=this.m_edges.length;a<b;++a){for(var c=0,
e=this.m_edges[a].length;c<e;++c)this.m_edges[a][c]=null;d.Clear(this.m_edges[a])}d.Clear(this.m_edges);this.m_HasOpenPaths=this.m_UseFullRange=!1};d.ClipperBase.prototype.DisposeLocalMinimaList=function(){for(;null!==this.m_MinimaList;){var a=this.m_MinimaList.Next;this.m_MinimaList=null;this.m_MinimaList=a}this.m_CurrentLM=null};d.ClipperBase.prototype.RangeTest=function(a,b){if(b.Value)(a.X>d.ClipperBase.hiRange||a.Y>d.ClipperBase.hiRange||-a.X>d.ClipperBase.hiRange||-a.Y>d.ClipperBase.hiRange)&&
d.Error("Coordinate outside allowed range in RangeTest().");else if(a.X>d.ClipperBase.loRange||a.Y>d.ClipperBase.loRange||-a.X>d.ClipperBase.loRange||-a.Y>d.ClipperBase.loRange)b.Value=!0,this.RangeTest(a,b)};d.ClipperBase.prototype.InitEdge=function(a,b,c,e){a.Next=b;a.Prev=c;a.Curr.X=e.X;a.Curr.Y=e.Y;a.OutIdx=-1};d.ClipperBase.prototype.InitEdge2=function(a,b){a.Curr.Y>=a.Next.Curr.Y?(a.Bot.X=a.Curr.X,a.Bot.Y=a.Curr.Y,a.Top.X=a.Next.Curr.X,a.Top.Y=a.Next.Curr.Y):(a.Top.X=a.Curr.X,a.Top.Y=a.Curr.Y,
a.Bot.X=a.Next.Curr.X,a.Bot.Y=a.Next.Curr.Y);this.SetDx(a);a.PolyTyp=b};d.ClipperBase.prototype.FindNextLocMin=function(a){for(var b;;){for(;d.IntPoint.op_Inequality(a.Bot,a.Prev.Bot)||d.IntPoint.op_Equality(a.Curr,a.Top);)a=a.Next;if(a.Dx!=d.ClipperBase.horizontal&&a.Prev.Dx!=d.ClipperBase.horizontal)break;for(;a.Prev.Dx==d.ClipperBase.horizontal;)a=a.Prev;for(b=a;a.Dx==d.ClipperBase.horizontal;)a=a.Next;if(a.Top.Y!=a.Prev.Bot.Y){b.Prev.Bot.X<a.Bot.X&&(a=b);break}}return a};d.ClipperBase.prototype.ProcessBound=
function(a,b){var c=a,e=a,f;a.Dx==d.ClipperBase.horizontal&&(f=b?a.Prev.Bot.X:a.Next.Bot.X,a.Bot.X!=f&&this.ReverseHorizontal(a));if(e.OutIdx!=d.ClipperBase.Skip)if(b){for(;e.Top.Y==e.Next.Bot.Y&&e.Next.OutIdx!=d.ClipperBase.Skip;)e=e.Next;if(e.Dx==d.ClipperBase.horizontal&&e.Next.OutIdx!=d.ClipperBase.Skip){for(f=e;f.Prev.Dx==d.ClipperBase.horizontal;)f=f.Prev;f.Prev.Top.X==e.Next.Top.X?b||(e=f.Prev):f.Prev.Top.X>e.Next.Top.X&&(e=f.Prev)}for(;a!=e;)a.NextInLML=a.Next,a.Dx==d.ClipperBase.horizontal&&
a!=c&&a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a),a=a.Next;a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a);e=e.Next}else{for(;e.Top.Y==e.Prev.Bot.Y&&e.Prev.OutIdx!=d.ClipperBase.Skip;)e=e.Prev;if(e.Dx==d.ClipperBase.horizontal&&e.Prev.OutIdx!=d.ClipperBase.Skip){for(f=e;f.Next.Dx==d.ClipperBase.horizontal;)f=f.Next;f.Next.Top.X==e.Prev.Top.X?b||(e=f.Next):f.Next.Top.X>e.Prev.Top.X&&(e=f.Next)}for(;a!=e;)a.NextInLML=a.Prev,a.Dx==d.ClipperBase.horizontal&&
a!=c&&a.Bot.X!=a.Next.Top.X&&this.ReverseHorizontal(a),a=a.Prev;a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=a.Next.Top.X&&this.ReverseHorizontal(a);e=e.Prev}if(e.OutIdx==d.ClipperBase.Skip){a=e;if(b){for(;a.Top.Y==a.Next.Bot.Y;)a=a.Next;for(;a!=e&&a.Dx==d.ClipperBase.horizontal;)a=a.Prev}else{for(;a.Top.Y==a.Prev.Bot.Y;)a=a.Prev;for(;a!=e&&a.Dx==d.ClipperBase.horizontal;)a=a.Next}a==e?e=b?a.Next:a.Prev:(a=b?e.Next:e.Prev,c=new d.LocalMinima,c.Next=null,c.Y=a.Bot.Y,c.LeftBound=null,c.RightBound=
a,c.RightBound.WindDelta=0,e=this.ProcessBound(c.RightBound,b),this.InsertLocalMinima(c))}return e};d.ClipperBase.prototype.AddPath=function(a,b,c){c||b!=d.PolyType.ptClip||d.Error("AddPath: Open paths must be subject.");var e=a.length-1;if(c)for(;0<e&&d.IntPoint.op_Equality(a[e],a[0]);)--e;for(;0<e&&d.IntPoint.op_Equality(a[e],a[e-1]);)--e;if(c&&2>e||!c&&1>e)return!1;for(var f=[],g=0;g<=e;g++)f.push(new d.TEdge);var h=!0;f[1].Curr.X=a[1].X;f[1].Curr.Y=a[1].Y;var l={Value:this.m_UseFullRange};this.RangeTest(a[0],
l);this.m_UseFullRange=l.Value;l.Value=this.m_UseFullRange;this.RangeTest(a[e],l);this.m_UseFullRange=l.Value;this.InitEdge(f[0],f[1],f[e],a[0]);this.InitEdge(f[e],f[0],f[e-1],a[e]);for(g=e-1;1<=g;--g)l.Value=this.m_UseFullRange,this.RangeTest(a[g],l),this.m_UseFullRange=l.Value,this.InitEdge(f[g],f[g+1],f[g-1],a[g]);for(g=a=e=f[0];;)if(d.IntPoint.op_Equality(a.Curr,a.Next.Curr)){if(a==a.Next)break;a==e&&(e=a.Next);g=a=this.RemoveEdge(a)}else{if(a.Prev==a.Next)break;else if(c&&d.ClipperBase.SlopesEqual(a.Prev.Curr,
a.Curr,a.Next.Curr,this.m_UseFullRange)&&(!this.PreserveCollinear||!this.Pt2IsBetweenPt1AndPt3(a.Prev.Curr,a.Curr,a.Next.Curr))){a==e&&(e=a.Next);a=this.RemoveEdge(a);g=a=a.Prev;continue}a=a.Next;if(a==g)break}if(!c&&a==a.Next||c&&a.Prev==a.Next)return!1;c||(this.m_HasOpenPaths=!0,e.Prev.OutIdx=d.ClipperBase.Skip);a=e;do this.InitEdge2(a,b),a=a.Next,h&&a.Curr.Y!=e.Curr.Y&&(h=!1);while(a!=e);if(h){if(c)return!1;a.Prev.OutIdx=d.ClipperBase.Skip;a.Prev.Bot.X<a.Prev.Top.X&&this.ReverseHorizontal(a.Prev);
b=new d.LocalMinima;b.Next=null;b.Y=a.Bot.Y;b.LeftBound=null;b.RightBound=a;b.RightBound.Side=d.EdgeSide.esRight;for(b.RightBound.WindDelta=0;a.Next.OutIdx!=d.ClipperBase.Skip;)a.NextInLML=a.Next,a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a),a=a.Next;this.InsertLocalMinima(b);this.m_edges.push(f);return!0}this.m_edges.push(f);for(h=null;;){a=this.FindNextLocMin(a);if(a==h)break;else null==h&&(h=a);b=new d.LocalMinima;b.Next=null;b.Y=a.Bot.Y;a.Dx<a.Prev.Dx?(b.LeftBound=a.Prev,b.RightBound=a,f=!1):
(b.LeftBound=a,b.RightBound=a.Prev,f=!0);b.LeftBound.Side=d.EdgeSide.esLeft;b.RightBound.Side=d.EdgeSide.esRight;b.LeftBound.WindDelta=c?b.LeftBound.Next==b.RightBound?-1:1:0;b.RightBound.WindDelta=-b.LeftBound.WindDelta;a=this.ProcessBound(b.LeftBound,f);e=this.ProcessBound(b.RightBound,!f);b.LeftBound.OutIdx==d.ClipperBase.Skip?b.LeftBound=null:b.RightBound.OutIdx==d.ClipperBase.Skip&&(b.RightBound=null);this.InsertLocalMinima(b);f||(a=e)}return!0};d.ClipperBase.prototype.AddPaths=function(a,b,
c){for(var e=!1,d=0,g=a.length;d<g;++d)this.AddPath(a[d],b,c)&&(e=!0);return e};d.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3=function(a,b,c){return d.IntPoint.op_Equality(a,c)||d.IntPoint.op_Equality(a,b)||d.IntPoint.op_Equality(c,b)?!1:a.X!=c.X?b.X>a.X==b.X<c.X:b.Y>a.Y==b.Y<c.Y};d.ClipperBase.prototype.RemoveEdge=function(a){a.Prev.Next=a.Next;a.Next.Prev=a.Prev;var b=a.Next;a.Prev=null;return b};d.ClipperBase.prototype.SetDx=function(a){a.Delta.X=a.Top.X-a.Bot.X;a.Delta.Y=a.Top.Y-a.Bot.Y;a.Dx=
0===a.Delta.Y?d.ClipperBase.horizontal:a.Delta.X/a.Delta.Y};d.ClipperBase.prototype.InsertLocalMinima=function(a){if(null===this.m_MinimaList)this.m_MinimaList=a;else if(a.Y>=this.m_MinimaList.Y)a.Next=this.m_MinimaList,this.m_MinimaList=a;else{for(var b=this.m_MinimaList;null!==b.Next&&a.Y<b.Next.Y;)b=b.Next;a.Next=b.Next;b.Next=a}};d.ClipperBase.prototype.PopLocalMinima=function(){null!==this.m_CurrentLM&&(this.m_CurrentLM=this.m_CurrentLM.Next)};d.ClipperBase.prototype.ReverseHorizontal=function(a){var b=
a.Top.X;a.Top.X=a.Bot.X;a.Bot.X=b};d.ClipperBase.prototype.Reset=function(){this.m_CurrentLM=this.m_MinimaList;if(null!=this.m_CurrentLM)for(var a=this.m_MinimaList;null!=a;){var b=a.LeftBound;null!=b&&(b.Curr.X=b.Bot.X,b.Curr.Y=b.Bot.Y,b.Side=d.EdgeSide.esLeft,b.OutIdx=d.ClipperBase.Unassigned);b=a.RightBound;null!=b&&(b.Curr.X=b.Bot.X,b.Curr.Y=b.Bot.Y,b.Side=d.EdgeSide.esRight,b.OutIdx=d.ClipperBase.Unassigned);a=a.Next}};d.Clipper=function(a){"undefined"==typeof a&&(a=0);this.m_PolyOuts=null;this.m_ClipType=
d.ClipType.ctIntersection;this.m_IntersectNodeComparer=this.m_IntersectList=this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_ExecuteLocked=!1;this.m_SubjFillType=this.m_ClipFillType=d.PolyFillType.pftEvenOdd;this.m_GhostJoins=this.m_Joins=null;this.StrictlySimple=this.ReverseSolution=this.m_UsingPolyTree=!1;d.ClipperBase.call(this);this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_IntersectList=[];this.m_IntersectNodeComparer=d.MyIntersectNodeSort.Compare;this.m_UsingPolyTree=
this.m_ExecuteLocked=!1;this.m_PolyOuts=[];this.m_Joins=[];this.m_GhostJoins=[];this.ReverseSolution=0!==(1&a);this.StrictlySimple=0!==(2&a);this.PreserveCollinear=0!==(4&a)};d.Clipper.ioReverseSolution=1;d.Clipper.ioStrictlySimple=2;d.Clipper.ioPreserveCollinear=4;d.Clipper.prototype.Clear=function(){0!==this.m_edges.length&&(this.DisposeAllPolyPts(),d.ClipperBase.prototype.Clear.call(this))};d.Clipper.prototype.DisposeScanbeamList=function(){for(;null!==this.m_Scanbeam;){var a=this.m_Scanbeam.Next;
this.m_Scanbeam=null;this.m_Scanbeam=a}};d.Clipper.prototype.Reset=function(){d.ClipperBase.prototype.Reset.call(this);this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;for(var a=this.m_MinimaList;null!==a;)this.InsertScanbeam(a.Y),a=a.Next};d.Clipper.prototype.InsertScanbeam=function(a){if(null===this.m_Scanbeam)this.m_Scanbeam=new d.Scanbeam,this.m_Scanbeam.Next=null,this.m_Scanbeam.Y=a;else if(a>this.m_Scanbeam.Y){var b=new d.Scanbeam;b.Y=a;b.Next=this.m_Scanbeam;this.m_Scanbeam=b}else{for(var c=
this.m_Scanbeam;null!==c.Next&&a<=c.Next.Y;)c=c.Next;a!=c.Y&&(b=new d.Scanbeam,b.Y=a,b.Next=c.Next,c.Next=b)}};d.Clipper.prototype.Execute=function(){var a=arguments,b=a.length,c=a[1]instanceof d.PolyTree;if(4!=b||c){if(4==b&&c){var b=a[0],e=a[1],c=a[2],a=a[3];if(this.m_ExecuteLocked)return!1;this.m_ExecuteLocked=!0;this.m_SubjFillType=c;this.m_ClipFillType=a;this.m_ClipType=b;this.m_UsingPolyTree=!0;try{(f=this.ExecuteInternal())&&this.BuildResult2(e)}finally{this.DisposeAllPolyPts(),this.m_ExecuteLocked=
!1}return f}if(2==b&&!c||2==b&&c)return b=a[0],e=a[1],this.Execute(b,e,d.PolyFillType.pftEvenOdd,d.PolyFillType.pftEvenOdd)}else{b=a[0];e=a[1];c=a[2];a=a[3];if(this.m_ExecuteLocked)return!1;this.m_HasOpenPaths&&d.Error("Error: PolyTree struct is need for open path clipping.");this.m_ExecuteLocked=!0;d.Clear(e);this.m_SubjFillType=c;this.m_ClipFillType=a;this.m_ClipType=b;this.m_UsingPolyTree=!1;try{var f=this.ExecuteInternal();f&&this.BuildResult(e)}finally{this.DisposeAllPolyPts(),this.m_ExecuteLocked=
!1}return f}};d.Clipper.prototype.FixHoleLinkage=function(a){if(null!==a.FirstLeft&&(a.IsHole==a.FirstLeft.IsHole||null===a.FirstLeft.Pts)){for(var b=a.FirstLeft;null!==b&&(b.IsHole==a.IsHole||null===b.Pts);)b=b.FirstLeft;a.FirstLeft=b}};d.Clipper.prototype.ExecuteInternal=function(){try{this.Reset();if(null===this.m_CurrentLM)return!1;var a=this.PopScanbeam();do{this.InsertLocalMinimaIntoAEL(a);d.Clear(this.m_GhostJoins);this.ProcessHorizontals(!1);if(null===this.m_Scanbeam)break;var b=this.PopScanbeam();
if(!this.ProcessIntersections(a,b))return!1;this.ProcessEdgesAtTopOfScanbeam(b);a=b}while(null!==this.m_Scanbeam||null!==this.m_CurrentLM);for(var a=0,c=this.m_PolyOuts.length;a<c;a++){var e=this.m_PolyOuts[a];null===e.Pts||e.IsOpen||(e.IsHole^this.ReverseSolution)==0<this.Area(e)&&this.ReversePolyPtLinks(e.Pts)}this.JoinCommonEdges();a=0;for(c=this.m_PolyOuts.length;a<c;a++)e=this.m_PolyOuts[a],null===e.Pts||e.IsOpen||this.FixupOutPolygon(e);this.StrictlySimple&&this.DoSimplePolygons();return!0}finally{d.Clear(this.m_Joins),
d.Clear(this.m_GhostJoins)}};d.Clipper.prototype.PopScanbeam=function(){var a=this.m_Scanbeam.Y;this.m_Scanbeam=this.m_Scanbeam.Next;return a};d.Clipper.prototype.DisposeAllPolyPts=function(){for(var a=0,b=this.m_PolyOuts.length;a<b;++a)this.DisposeOutRec(a);d.Clear(this.m_PolyOuts)};d.Clipper.prototype.DisposeOutRec=function(a){var b=this.m_PolyOuts[a];null!==b.Pts&&this.DisposeOutPts(b.Pts);this.m_PolyOuts[a]=null};d.Clipper.prototype.DisposeOutPts=function(a){if(null!==a)for(a.Prev.Next=null;null!==
a;)a=a.Next};d.Clipper.prototype.AddJoin=function(a,b,c){var e=new d.Join;e.OutPt1=a;e.OutPt2=b;e.OffPt.X=c.X;e.OffPt.Y=c.Y;this.m_Joins.push(e)};d.Clipper.prototype.AddGhostJoin=function(a,b){var c=new d.Join;c.OutPt1=a;c.OffPt.X=b.X;c.OffPt.Y=b.Y;this.m_GhostJoins.push(c)};d.Clipper.prototype.InsertLocalMinimaIntoAEL=function(a){for(;null!==this.m_CurrentLM&&this.m_CurrentLM.Y==a;){var b=this.m_CurrentLM.LeftBound,c=this.m_CurrentLM.RightBound;this.PopLocalMinima();var e=null;null===b?(this.InsertEdgeIntoAEL(c,
null),this.SetWindingCount(c),this.IsContributing(c)&&(e=this.AddOutPt(c,c.Bot))):(null==c?(this.InsertEdgeIntoAEL(b,null),this.SetWindingCount(b),this.IsContributing(b)&&(e=this.AddOutPt(b,b.Bot))):(this.InsertEdgeIntoAEL(b,null),this.InsertEdgeIntoAEL(c,b),this.SetWindingCount(b),c.WindCnt=b.WindCnt,c.WindCnt2=b.WindCnt2,this.IsContributing(b)&&(e=this.AddLocalMinPoly(b,c,b.Bot))),this.InsertScanbeam(b.Top.Y));null!=c&&(d.ClipperBase.IsHorizontal(c)?this.AddEdgeToSEL(c):this.InsertScanbeam(c.Top.Y));
if(null!=b&&null!=c){if(null!==e&&d.ClipperBase.IsHorizontal(c)&&0<this.m_GhostJoins.length&&0!==c.WindDelta)for(var f=0,g=this.m_GhostJoins.length;f<g;f++){var h=this.m_GhostJoins[f];this.HorzSegmentsOverlap(h.OutPt1.Pt,h.OffPt,c.Bot,c.Top)&&this.AddJoin(h.OutPt1,e,h.OffPt)}0<=b.OutIdx&&null!==b.PrevInAEL&&b.PrevInAEL.Curr.X==b.Bot.X&&0<=b.PrevInAEL.OutIdx&&d.ClipperBase.SlopesEqual(b.PrevInAEL,b,this.m_UseFullRange)&&0!==b.WindDelta&&0!==b.PrevInAEL.WindDelta&&(f=this.AddOutPt(b.PrevInAEL,b.Bot),
this.AddJoin(e,f,b.Top));if(b.NextInAEL!=c&&(0<=c.OutIdx&&0<=c.PrevInAEL.OutIdx&&d.ClipperBase.SlopesEqual(c.PrevInAEL,c,this.m_UseFullRange)&&0!==c.WindDelta&&0!==c.PrevInAEL.WindDelta&&(f=this.AddOutPt(c.PrevInAEL,c.Bot),this.AddJoin(e,f,c.Top)),e=b.NextInAEL,null!==e))for(;e!=c;)this.IntersectEdges(c,e,b.Curr,!1),e=e.NextInAEL}}};d.Clipper.prototype.InsertEdgeIntoAEL=function(a,b){if(null===this.m_ActiveEdges)a.PrevInAEL=null,a.NextInAEL=null,this.m_ActiveEdges=a;else if(null===b&&this.E2InsertsBeforeE1(this.m_ActiveEdges,
a))a.PrevInAEL=null,a.NextInAEL=this.m_ActiveEdges,this.m_ActiveEdges=this.m_ActiveEdges.PrevInAEL=a;else{null===b&&(b=this.m_ActiveEdges);for(;null!==b.NextInAEL&&!this.E2InsertsBeforeE1(b.NextInAEL,a);)b=b.NextInAEL;a.NextInAEL=b.NextInAEL;null!==b.NextInAEL&&(b.NextInAEL.PrevInAEL=a);a.PrevInAEL=b;b.NextInAEL=a}};d.Clipper.prototype.E2InsertsBeforeE1=function(a,b){return b.Curr.X==a.Curr.X?b.Top.Y>a.Top.Y?b.Top.X<d.Clipper.TopX(a,b.Top.Y):a.Top.X>d.Clipper.TopX(b,a.Top.Y):b.Curr.X<a.Curr.X};d.Clipper.prototype.IsEvenOddFillType=
function(a){return a.PolyTyp==d.PolyType.ptSubject?this.m_SubjFillType==d.PolyFillType.pftEvenOdd:this.m_ClipFillType==d.PolyFillType.pftEvenOdd};d.Clipper.prototype.IsEvenOddAltFillType=function(a){return a.PolyTyp==d.PolyType.ptSubject?this.m_ClipFillType==d.PolyFillType.pftEvenOdd:this.m_SubjFillType==d.PolyFillType.pftEvenOdd};d.Clipper.prototype.IsContributing=function(a){var b,c;a.PolyTyp==d.PolyType.ptSubject?(b=this.m_SubjFillType,c=this.m_ClipFillType):(b=this.m_ClipFillType,c=this.m_SubjFillType);
switch(b){case d.PolyFillType.pftEvenOdd:if(0===a.WindDelta&&1!=a.WindCnt)return!1;break;case d.PolyFillType.pftNonZero:if(1!=Math.abs(a.WindCnt))return!1;break;case d.PolyFillType.pftPositive:if(1!=a.WindCnt)return!1;break;default:if(-1!=a.WindCnt)return!1}switch(this.m_ClipType){case d.ClipType.ctIntersection:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!==a.WindCnt2;case d.PolyFillType.pftPositive:return 0<a.WindCnt2;default:return 0>a.WindCnt2}case d.ClipType.ctUnion:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===
a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}case d.ClipType.ctDifference:if(a.PolyTyp==d.PolyType.ptSubject)switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}else switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!==a.WindCnt2;case d.PolyFillType.pftPositive:return 0<a.WindCnt2;default:return 0>
a.WindCnt2}case d.ClipType.ctXor:if(0===a.WindDelta)switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}}return!0};d.Clipper.prototype.SetWindingCount=function(a){for(var b=a.PrevInAEL;null!==b&&(b.PolyTyp!=a.PolyTyp||0===b.WindDelta);)b=b.PrevInAEL;if(null===b)a.WindCnt=0===a.WindDelta?1:a.WindDelta,a.WindCnt2=0,b=this.m_ActiveEdges;else{if(0===a.WindDelta&&this.m_ClipType!=
d.ClipType.ctUnion)a.WindCnt=1;else if(this.IsEvenOddFillType(a))if(0===a.WindDelta){for(var c=!0,e=b.PrevInAEL;null!==e;)e.PolyTyp==b.PolyTyp&&0!==e.WindDelta&&(c=!c),e=e.PrevInAEL;a.WindCnt=c?0:1}else a.WindCnt=a.WindDelta;else 0>b.WindCnt*b.WindDelta?1<Math.abs(b.WindCnt)?a.WindCnt=0>b.WindDelta*a.WindDelta?b.WindCnt:b.WindCnt+a.WindDelta:a.WindCnt=0===a.WindDelta?1:a.WindDelta:a.WindCnt=0===a.WindDelta?0>b.WindCnt?b.WindCnt-1:b.WindCnt+1:0>b.WindDelta*a.WindDelta?b.WindCnt:b.WindCnt+a.WindDelta;
a.WindCnt2=b.WindCnt2;b=b.NextInAEL}if(this.IsEvenOddAltFillType(a))for(;b!=a;)0!==b.WindDelta&&(a.WindCnt2=0===a.WindCnt2?1:0),b=b.NextInAEL;else for(;b!=a;)a.WindCnt2+=b.WindDelta,b=b.NextInAEL};d.Clipper.prototype.AddEdgeToSEL=function(a){null===this.m_SortedEdges?(this.m_SortedEdges=a,a.PrevInSEL=null,a.NextInSEL=null):(a.NextInSEL=this.m_SortedEdges,a.PrevInSEL=null,this.m_SortedEdges=this.m_SortedEdges.PrevInSEL=a)};d.Clipper.prototype.CopyAELToSEL=function(){var a=this.m_ActiveEdges;for(this.m_SortedEdges=
a;null!==a;)a.PrevInSEL=a.PrevInAEL,a=a.NextInSEL=a.NextInAEL};d.Clipper.prototype.SwapPositionsInAEL=function(a,b){if(a.NextInAEL!=a.PrevInAEL&&b.NextInAEL!=b.PrevInAEL){if(a.NextInAEL==b){var c=b.NextInAEL;null!==c&&(c.PrevInAEL=a);var e=a.PrevInAEL;null!==e&&(e.NextInAEL=b);b.PrevInAEL=e;b.NextInAEL=a;a.PrevInAEL=b;a.NextInAEL=c}else b.NextInAEL==a?(c=a.NextInAEL,null!==c&&(c.PrevInAEL=b),e=b.PrevInAEL,null!==e&&(e.NextInAEL=a),a.PrevInAEL=e,a.NextInAEL=b,b.PrevInAEL=a,b.NextInAEL=c):(c=a.NextInAEL,
e=a.PrevInAEL,a.NextInAEL=b.NextInAEL,null!==a.NextInAEL&&(a.NextInAEL.PrevInAEL=a),a.PrevInAEL=b.PrevInAEL,null!==a.PrevInAEL&&(a.PrevInAEL.NextInAEL=a),b.NextInAEL=c,null!==b.NextInAEL&&(b.NextInAEL.PrevInAEL=b),b.PrevInAEL=e,null!==b.PrevInAEL&&(b.PrevInAEL.NextInAEL=b));null===a.PrevInAEL?this.m_ActiveEdges=a:null===b.PrevInAEL&&(this.m_ActiveEdges=b)}};d.Clipper.prototype.SwapPositionsInSEL=function(a,b){if(null!==a.NextInSEL||null!==a.PrevInSEL)if(null!==b.NextInSEL||null!==b.PrevInSEL){if(a.NextInSEL==
b){var c=b.NextInSEL;null!==c&&(c.PrevInSEL=a);var e=a.PrevInSEL;null!==e&&(e.NextInSEL=b);b.PrevInSEL=e;b.NextInSEL=a;a.PrevInSEL=b;a.NextInSEL=c}else b.NextInSEL==a?(c=a.NextInSEL,null!==c&&(c.PrevInSEL=b),e=b.PrevInSEL,null!==e&&(e.NextInSEL=a),a.PrevInSEL=e,a.NextInSEL=b,b.PrevInSEL=a,b.NextInSEL=c):(c=a.NextInSEL,e=a.PrevInSEL,a.NextInSEL=b.NextInSEL,null!==a.NextInSEL&&(a.NextInSEL.PrevInSEL=a),a.PrevInSEL=b.PrevInSEL,null!==a.PrevInSEL&&(a.PrevInSEL.NextInSEL=a),b.NextInSEL=c,null!==b.NextInSEL&&
(b.NextInSEL.PrevInSEL=b),b.PrevInSEL=e,null!==b.PrevInSEL&&(b.PrevInSEL.NextInSEL=b));null===a.PrevInSEL?this.m_SortedEdges=a:null===b.PrevInSEL&&(this.m_SortedEdges=b)}};d.Clipper.prototype.AddLocalMaxPoly=function(a,b,c){this.AddOutPt(a,c);0==b.WindDelta&&this.AddOutPt(b,c);a.OutIdx==b.OutIdx?(a.OutIdx=-1,b.OutIdx=-1):a.OutIdx<b.OutIdx?this.AppendPolygon(a,b):this.AppendPolygon(b,a)};d.Clipper.prototype.AddLocalMinPoly=function(a,b,c){var e,f;d.ClipperBase.IsHorizontal(b)||a.Dx>b.Dx?(e=this.AddOutPt(a,
c),b.OutIdx=a.OutIdx,a.Side=d.EdgeSide.esLeft,b.Side=d.EdgeSide.esRight,f=a,a=f.PrevInAEL==b?b.PrevInAEL:f.PrevInAEL):(e=this.AddOutPt(b,c),a.OutIdx=b.OutIdx,a.Side=d.EdgeSide.esRight,b.Side=d.EdgeSide.esLeft,f=b,a=f.PrevInAEL==a?a.PrevInAEL:f.PrevInAEL);null!==a&&0<=a.OutIdx&&d.Clipper.TopX(a,c.Y)==d.Clipper.TopX(f,c.Y)&&d.ClipperBase.SlopesEqual(f,a,this.m_UseFullRange)&&0!==f.WindDelta&&0!==a.WindDelta&&(c=this.AddOutPt(a,c),this.AddJoin(e,c,f.Top));return e};d.Clipper.prototype.CreateOutRec=function(){var a=
new d.OutRec;a.Idx=-1;a.IsHole=!1;a.IsOpen=!1;a.FirstLeft=null;a.Pts=null;a.BottomPt=null;a.PolyNode=null;this.m_PolyOuts.push(a);a.Idx=this.m_PolyOuts.length-1;return a};d.Clipper.prototype.AddOutPt=function(a,b){var c=a.Side==d.EdgeSide.esLeft;if(0>a.OutIdx){var e=this.CreateOutRec();e.IsOpen=0===a.WindDelta;var f=new d.OutPt;e.Pts=f;f.Idx=e.Idx;f.Pt.X=b.X;f.Pt.Y=b.Y;f.Next=f;f.Prev=f;e.IsOpen||this.SetHoleState(a,e);a.OutIdx=e.Idx}else{var e=this.m_PolyOuts[a.OutIdx],g=e.Pts;if(c&&d.IntPoint.op_Equality(b,
g.Pt))return g;if(!c&&d.IntPoint.op_Equality(b,g.Prev.Pt))return g.Prev;f=new d.OutPt;f.Idx=e.Idx;f.Pt.X=b.X;f.Pt.Y=b.Y;f.Next=g;f.Prev=g.Prev;f.Prev.Next=f;g.Prev=f;c&&(e.Pts=f)}return f};d.Clipper.prototype.SwapPoints=function(a,b){var c=new d.IntPoint(a.Value);a.Value.X=b.Value.X;a.Value.Y=b.Value.Y;b.Value.X=c.X;b.Value.Y=c.Y};d.Clipper.prototype.HorzSegmentsOverlap=function(a,b,c,e){return a.X>c.X==a.X<e.X?!0:b.X>c.X==b.X<e.X?!0:c.X>a.X==c.X<b.X?!0:e.X>a.X==e.X<b.X?!0:a.X==c.X&&b.X==e.X?!0:a.X==
e.X&&b.X==c.X?!0:!1};d.Clipper.prototype.InsertPolyPtBetween=function(a,b,c){var e=new d.OutPt;e.Pt.X=c.X;e.Pt.Y=c.Y;b==a.Next?(a.Next=e,b.Prev=e,e.Next=b,e.Prev=a):(b.Next=e,a.Prev=e,e.Next=a,e.Prev=b);return e};d.Clipper.prototype.SetHoleState=function(a,b){for(var c=!1,e=a.PrevInAEL;null!==e;)0<=e.OutIdx&&0!=e.WindDelta&&(c=!c,null===b.FirstLeft&&(b.FirstLeft=this.m_PolyOuts[e.OutIdx])),e=e.PrevInAEL;c&&(b.IsHole=!0)};d.Clipper.prototype.GetDx=function(a,b){return a.Y==b.Y?d.ClipperBase.horizontal:
(b.X-a.X)/(b.Y-a.Y)};d.Clipper.prototype.FirstIsBottomPt=function(a,b){for(var c=a.Prev;d.IntPoint.op_Equality(c.Pt,a.Pt)&&c!=a;)c=c.Prev;for(var e=Math.abs(this.GetDx(a.Pt,c.Pt)),c=a.Next;d.IntPoint.op_Equality(c.Pt,a.Pt)&&c!=a;)c=c.Next;for(var f=Math.abs(this.GetDx(a.Pt,c.Pt)),c=b.Prev;d.IntPoint.op_Equality(c.Pt,b.Pt)&&c!=b;)c=c.Prev;for(var g=Math.abs(this.GetDx(b.Pt,c.Pt)),c=b.Next;d.IntPoint.op_Equality(c.Pt,b.Pt)&&c!=b;)c=c.Next;c=Math.abs(this.GetDx(b.Pt,c.Pt));return e>=g&&e>=c||f>=g&&f>=
c};d.Clipper.prototype.GetBottomPt=function(a){for(var b=null,c=a.Next;c!=a;)c.Pt.Y>a.Pt.Y?(a=c,b=null):c.Pt.Y==a.Pt.Y&&c.Pt.X<=a.Pt.X&&(c.Pt.X<a.Pt.X?(b=null,a=c):c.Next!=a&&c.Prev!=a&&(b=c)),c=c.Next;if(null!==b)for(;b!=c;)for(this.FirstIsBottomPt(c,b)||(a=b),b=b.Next;d.IntPoint.op_Inequality(b.Pt,a.Pt);)b=b.Next;return a};d.Clipper.prototype.GetLowermostRec=function(a,b){null===a.BottomPt&&(a.BottomPt=this.GetBottomPt(a.Pts));null===b.BottomPt&&(b.BottomPt=this.GetBottomPt(b.Pts));var c=a.BottomPt,
e=b.BottomPt;return c.Pt.Y>e.Pt.Y?a:c.Pt.Y<e.Pt.Y?b:c.Pt.X<e.Pt.X?a:c.Pt.X>e.Pt.X?b:c.Next==c?b:e.Next==e?a:this.FirstIsBottomPt(c,e)?a:b};d.Clipper.prototype.Param1RightOfParam2=function(a,b){do if(a=a.FirstLeft,a==b)return!0;while(null!==a);return!1};d.Clipper.prototype.GetOutRec=function(a){for(a=this.m_PolyOuts[a];a!=this.m_PolyOuts[a.Idx];)a=this.m_PolyOuts[a.Idx];return a};d.Clipper.prototype.AppendPolygon=function(a,b){var c=this.m_PolyOuts[a.OutIdx],e=this.m_PolyOuts[b.OutIdx],f;f=this.Param1RightOfParam2(c,
e)?e:this.Param1RightOfParam2(e,c)?c:this.GetLowermostRec(c,e);var g=c.Pts,h=g.Prev,l=e.Pts,k=l.Prev;a.Side==d.EdgeSide.esLeft?(b.Side==d.EdgeSide.esLeft?(this.ReversePolyPtLinks(l),l.Next=g,g.Prev=l,h.Next=k,k.Prev=h,c.Pts=k):(k.Next=g,g.Prev=k,l.Prev=h,h.Next=l,c.Pts=l),g=d.EdgeSide.esLeft):(b.Side==d.EdgeSide.esRight?(this.ReversePolyPtLinks(l),h.Next=k,k.Prev=h,l.Next=g,g.Prev=l):(h.Next=l,l.Prev=h,g.Prev=k,k.Next=g),g=d.EdgeSide.esRight);c.BottomPt=null;f==e&&(e.FirstLeft!=c&&(c.FirstLeft=e.FirstLeft),
c.IsHole=e.IsHole);e.Pts=null;e.BottomPt=null;e.FirstLeft=c;f=a.OutIdx;h=b.OutIdx;a.OutIdx=-1;b.OutIdx=-1;for(l=this.m_ActiveEdges;null!==l;){if(l.OutIdx==h){l.OutIdx=f;l.Side=g;break}l=l.NextInAEL}e.Idx=c.Idx};d.Clipper.prototype.ReversePolyPtLinks=function(a){if(null!==a){var b,c;b=a;do c=b.Next,b.Next=b.Prev,b=b.Prev=c;while(b!=a)}};d.Clipper.SwapSides=function(a,b){var c=a.Side;a.Side=b.Side;b.Side=c};d.Clipper.SwapPolyIndexes=function(a,b){var c=a.OutIdx;a.OutIdx=b.OutIdx;b.OutIdx=c};d.Clipper.prototype.IntersectEdges=
function(a,b,c,e){var f=!e&&null===a.NextInLML&&a.Top.X==c.X&&a.Top.Y==c.Y;e=!e&&null===b.NextInLML&&b.Top.X==c.X&&b.Top.Y==c.Y;var g=0<=a.OutIdx,h=0<=b.OutIdx;if(0===a.WindDelta||0===b.WindDelta)0===a.WindDelta&&0===b.WindDelta?(f||e)&&g&&h&&this.AddLocalMaxPoly(a,b,c):a.PolyTyp==b.PolyTyp&&a.WindDelta!=b.WindDelta&&this.m_ClipType==d.ClipType.ctUnion?0===a.WindDelta?h&&(this.AddOutPt(a,c),g&&(a.OutIdx=-1)):g&&(this.AddOutPt(b,c),h&&(b.OutIdx=-1)):a.PolyTyp!=b.PolyTyp&&(0!==a.WindDelta||1!=Math.abs(b.WindCnt)||
this.m_ClipType==d.ClipType.ctUnion&&0!==b.WindCnt2?0!==b.WindDelta||1!=Math.abs(a.WindCnt)||this.m_ClipType==d.ClipType.ctUnion&&0!==a.WindCnt2||(this.AddOutPt(b,c),h&&(b.OutIdx=-1)):(this.AddOutPt(a,c),g&&(a.OutIdx=-1))),f&&(0>a.OutIdx?this.DeleteFromAEL(a):d.Error("Error intersecting polylines")),e&&(0>b.OutIdx?this.DeleteFromAEL(b):d.Error("Error intersecting polylines"));else{if(a.PolyTyp==b.PolyTyp)if(this.IsEvenOddFillType(a)){var l=a.WindCnt;a.WindCnt=b.WindCnt;b.WindCnt=l}else a.WindCnt=
0===a.WindCnt+b.WindDelta?-a.WindCnt:a.WindCnt+b.WindDelta,b.WindCnt=0===b.WindCnt-a.WindDelta?-b.WindCnt:b.WindCnt-a.WindDelta;else this.IsEvenOddFillType(b)?a.WindCnt2=0===a.WindCnt2?1:0:a.WindCnt2+=b.WindDelta,this.IsEvenOddFillType(a)?b.WindCnt2=0===b.WindCnt2?1:0:b.WindCnt2-=a.WindDelta;var k,n,m;a.PolyTyp==d.PolyType.ptSubject?(k=this.m_SubjFillType,m=this.m_ClipFillType):(k=this.m_ClipFillType,m=this.m_SubjFillType);b.PolyTyp==d.PolyType.ptSubject?(n=this.m_SubjFillType,l=this.m_ClipFillType):
(n=this.m_ClipFillType,l=this.m_SubjFillType);switch(k){case d.PolyFillType.pftPositive:k=a.WindCnt;break;case d.PolyFillType.pftNegative:k=-a.WindCnt;break;default:k=Math.abs(a.WindCnt)}switch(n){case d.PolyFillType.pftPositive:n=b.WindCnt;break;case d.PolyFillType.pftNegative:n=-b.WindCnt;break;default:n=Math.abs(b.WindCnt)}if(g&&h)f||e||0!==k&&1!=k||0!==n&&1!=n||a.PolyTyp!=b.PolyTyp&&this.m_ClipType!=d.ClipType.ctXor?this.AddLocalMaxPoly(a,b,c):(this.AddOutPt(a,c),this.AddOutPt(b,c),d.Clipper.SwapSides(a,
b),d.Clipper.SwapPolyIndexes(a,b));else if(g){if(0===n||1==n)this.AddOutPt(a,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b)}else if(h){if(0===k||1==k)this.AddOutPt(b,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b)}else if(!(0!==k&&1!=k||0!==n&&1!=n||f||e)){switch(m){case d.PolyFillType.pftPositive:g=a.WindCnt2;break;case d.PolyFillType.pftNegative:g=-a.WindCnt2;break;default:g=Math.abs(a.WindCnt2)}switch(l){case d.PolyFillType.pftPositive:h=b.WindCnt2;break;case d.PolyFillType.pftNegative:h=
-b.WindCnt2;break;default:h=Math.abs(b.WindCnt2)}if(a.PolyTyp!=b.PolyTyp)this.AddLocalMinPoly(a,b,c);else if(1==k&&1==n)switch(this.m_ClipType){case d.ClipType.ctIntersection:0<g&&0<h&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctUnion:0>=g&&0>=h&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctDifference:(a.PolyTyp==d.PolyType.ptClip&&0<g&&0<h||a.PolyTyp==d.PolyType.ptSubject&&0>=g&&0>=h)&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctXor:this.AddLocalMinPoly(a,b,c)}else d.Clipper.SwapSides(a,
b)}f!=e&&(f&&0<=a.OutIdx||e&&0<=b.OutIdx)&&(d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b));f&&this.DeleteFromAEL(a);e&&this.DeleteFromAEL(b)}};d.Clipper.prototype.DeleteFromAEL=function(a){var b=a.PrevInAEL,c=a.NextInAEL;if(null!==b||null!==c||a==this.m_ActiveEdges)null!==b?b.NextInAEL=c:this.m_ActiveEdges=c,null!==c&&(c.PrevInAEL=b),a.NextInAEL=null,a.PrevInAEL=null};d.Clipper.prototype.DeleteFromSEL=function(a){var b=a.PrevInSEL,c=a.NextInSEL;if(null!==b||null!==c||a==this.m_SortedEdges)null!==
b?b.NextInSEL=c:this.m_SortedEdges=c,null!==c&&(c.PrevInSEL=b),a.NextInSEL=null,a.PrevInSEL=null};d.Clipper.prototype.UpdateEdgeIntoAEL=function(a){null===a.NextInLML&&d.Error("UpdateEdgeIntoAEL: invalid call");var b=a.PrevInAEL,c=a.NextInAEL;a.NextInLML.OutIdx=a.OutIdx;null!==b?b.NextInAEL=a.NextInLML:this.m_ActiveEdges=a.NextInLML;null!==c&&(c.PrevInAEL=a.NextInLML);a.NextInLML.Side=a.Side;a.NextInLML.WindDelta=a.WindDelta;a.NextInLML.WindCnt=a.WindCnt;a.NextInLML.WindCnt2=a.WindCnt2;a=a.NextInLML;
a.Curr.X=a.Bot.X;a.Curr.Y=a.Bot.Y;a.PrevInAEL=b;a.NextInAEL=c;d.ClipperBase.IsHorizontal(a)||this.InsertScanbeam(a.Top.Y);return a};d.Clipper.prototype.ProcessHorizontals=function(a){for(var b=this.m_SortedEdges;null!==b;)this.DeleteFromSEL(b),this.ProcessHorizontal(b,a),b=this.m_SortedEdges};d.Clipper.prototype.GetHorzDirection=function(a,b){a.Bot.X<a.Top.X?(b.Left=a.Bot.X,b.Right=a.Top.X,b.Dir=d.Direction.dLeftToRight):(b.Left=a.Top.X,b.Right=a.Bot.X,b.Dir=d.Direction.dRightToLeft)};d.Clipper.prototype.PrepareHorzJoins=
function(a,b){var c=this.m_PolyOuts[a.OutIdx].Pts;a.Side!=d.EdgeSide.esLeft&&(c=c.Prev);b&&(d.IntPoint.op_Equality(c.Pt,a.Top)?this.AddGhostJoin(c,a.Bot):this.AddGhostJoin(c,a.Top))};d.Clipper.prototype.ProcessHorizontal=function(a,b){var c={Dir:null,Left:null,Right:null};this.GetHorzDirection(a,c);for(var e=c.Dir,f=c.Left,g=c.Right,h=a,l=null;null!==h.NextInLML&&d.ClipperBase.IsHorizontal(h.NextInLML);)h=h.NextInLML;for(null===h.NextInLML&&(l=this.GetMaximaPair(h));;){for(var k=a==h,n=this.GetNextInAEL(a,
e);null!==n&&!(n.Curr.X==a.Top.X&&null!==a.NextInLML&&n.Dx<a.NextInLML.Dx);){c=this.GetNextInAEL(n,e);if(e==d.Direction.dLeftToRight&&n.Curr.X<=g||e==d.Direction.dRightToLeft&&n.Curr.X>=f){0<=a.OutIdx&&0!=a.WindDelta&&this.PrepareHorzJoins(a,b);if(n==l&&k){e==d.Direction.dLeftToRight?this.IntersectEdges(a,n,n.Top,!1):this.IntersectEdges(n,a,n.Top,!1);0<=l.OutIdx&&d.Error("ProcessHorizontal error");return}if(e==d.Direction.dLeftToRight){var m=new d.IntPoint(n.Curr.X,a.Curr.Y);this.IntersectEdges(a,
n,m,!0)}else m=new d.IntPoint(n.Curr.X,a.Curr.Y),this.IntersectEdges(n,a,m,!0);this.SwapPositionsInAEL(a,n)}else if(e==d.Direction.dLeftToRight&&n.Curr.X>=g||e==d.Direction.dRightToLeft&&n.Curr.X<=f)break;n=c}0<=a.OutIdx&&0!==a.WindDelta&&this.PrepareHorzJoins(a,b);if(null!==a.NextInLML&&d.ClipperBase.IsHorizontal(a.NextInLML))a=this.UpdateEdgeIntoAEL(a),0<=a.OutIdx&&this.AddOutPt(a,a.Bot),c={Dir:e,Left:f,Right:g},this.GetHorzDirection(a,c),e=c.Dir,f=c.Left,g=c.Right;else break}null!==a.NextInLML?
0<=a.OutIdx?(e=this.AddOutPt(a,a.Top),a=this.UpdateEdgeIntoAEL(a),0!==a.WindDelta&&(f=a.PrevInAEL,c=a.NextInAEL,null!==f&&f.Curr.X==a.Bot.X&&f.Curr.Y==a.Bot.Y&&0!==f.WindDelta&&0<=f.OutIdx&&f.Curr.Y>f.Top.Y&&d.ClipperBase.SlopesEqual(a,f,this.m_UseFullRange)?(c=this.AddOutPt(f,a.Bot),this.AddJoin(e,c,a.Top)):null!==c&&c.Curr.X==a.Bot.X&&c.Curr.Y==a.Bot.Y&&0!==c.WindDelta&&0<=c.OutIdx&&c.Curr.Y>c.Top.Y&&d.ClipperBase.SlopesEqual(a,c,this.m_UseFullRange)&&(c=this.AddOutPt(c,a.Bot),this.AddJoin(e,c,
a.Top)))):this.UpdateEdgeIntoAEL(a):null!==l?0<=l.OutIdx?(e==d.Direction.dLeftToRight?this.IntersectEdges(a,l,a.Top,!1):this.IntersectEdges(l,a,a.Top,!1),0<=l.OutIdx&&d.Error("ProcessHorizontal error")):(this.DeleteFromAEL(a),this.DeleteFromAEL(l)):(0<=a.OutIdx&&this.AddOutPt(a,a.Top),this.DeleteFromAEL(a))};d.Clipper.prototype.GetNextInAEL=function(a,b){return b==d.Direction.dLeftToRight?a.NextInAEL:a.PrevInAEL};d.Clipper.prototype.IsMinima=function(a){return null!==a&&a.Prev.NextInLML!=a&&a.Next.NextInLML!=
a};d.Clipper.prototype.IsMaxima=function(a,b){return null!==a&&a.Top.Y==b&&null===a.NextInLML};d.Clipper.prototype.IsIntermediate=function(a,b){return a.Top.Y==b&&null!==a.NextInLML};d.Clipper.prototype.GetMaximaPair=function(a){var b=null;d.IntPoint.op_Equality(a.Next.Top,a.Top)&&null===a.Next.NextInLML?b=a.Next:d.IntPoint.op_Equality(a.Prev.Top,a.Top)&&null===a.Prev.NextInLML&&(b=a.Prev);return null===b||-2!=b.OutIdx&&(b.NextInAEL!=b.PrevInAEL||d.ClipperBase.IsHorizontal(b))?b:null};d.Clipper.prototype.ProcessIntersections=
function(a,b){if(null==this.m_ActiveEdges)return!0;try{this.BuildIntersectList(a,b);if(0==this.m_IntersectList.length)return!0;if(1==this.m_IntersectList.length||this.FixupIntersectionOrder())this.ProcessIntersectList();else return!1}catch(c){this.m_SortedEdges=null,this.m_IntersectList.length=0,d.Error("ProcessIntersections error")}this.m_SortedEdges=null;return!0};d.Clipper.prototype.BuildIntersectList=function(a,b){if(null!==this.m_ActiveEdges){var c=this.m_ActiveEdges;for(this.m_SortedEdges=c;null!==
c;)c.PrevInSEL=c.PrevInAEL,c.NextInSEL=c.NextInAEL,c.Curr.X=d.Clipper.TopX(c,b),c=c.NextInAEL;for(var e=!0;e&&null!==this.m_SortedEdges;){e=!1;for(c=this.m_SortedEdges;null!==c.NextInSEL;){var f=c.NextInSEL,g=new d.IntPoint;c.Curr.X>f.Curr.X?(!this.IntersectPoint(c,f,g)&&c.Curr.X>f.Curr.X+1&&d.Error("Intersection error"),g.Y>a&&(g.Y=a,Math.abs(c.Dx)>Math.abs(f.Dx)?g.X=d.Clipper.TopX(f,a):g.X=d.Clipper.TopX(c,a)),e=new d.IntersectNode,e.Edge1=c,e.Edge2=f,e.Pt.X=g.X,e.Pt.Y=g.Y,this.m_IntersectList.push(e),
this.SwapPositionsInSEL(c,f),e=!0):c=f}if(null!==c.PrevInSEL)c.PrevInSEL.NextInSEL=null;else break}this.m_SortedEdges=null}};d.Clipper.prototype.EdgesAdjacent=function(a){return a.Edge1.NextInSEL==a.Edge2||a.Edge1.PrevInSEL==a.Edge2};d.Clipper.IntersectNodeSort=function(a,b){return b.Pt.Y-a.Pt.Y};d.Clipper.prototype.FixupIntersectionOrder=function(){this.m_IntersectList.sort(this.m_IntersectNodeComparer);this.CopyAELToSEL();for(var a=this.m_IntersectList.length,b=0;b<a;b++){if(!this.EdgesAdjacent(this.m_IntersectList[b])){for(var c=
b+1;c<a&&!this.EdgesAdjacent(this.m_IntersectList[c]);)c++;if(c==a)return!1;var e=this.m_IntersectList[b];this.m_IntersectList[b]=this.m_IntersectList[c];this.m_IntersectList[c]=e}this.SwapPositionsInSEL(this.m_IntersectList[b].Edge1,this.m_IntersectList[b].Edge2)}return!0};d.Clipper.prototype.ProcessIntersectList=function(){for(var a=0,b=this.m_IntersectList.length;a<b;a++){var c=this.m_IntersectList[a];this.IntersectEdges(c.Edge1,c.Edge2,c.Pt,!0);this.SwapPositionsInAEL(c.Edge1,c.Edge2)}this.m_IntersectList.length=
0};E=function(a){return 0>a?Math.ceil(a-0.5):Math.round(a)};F=function(a){return 0>a?Math.ceil(a-0.5):Math.floor(a+0.5)};G=function(a){return 0>a?-Math.round(Math.abs(a)):Math.round(a)};H=function(a){if(0>a)return a-=0.5,-2147483648>a?Math.ceil(a):a|0;a+=0.5;return 2147483647<a?Math.floor(a):a|0};d.Clipper.Round=p?E:D?G:J?H:F;d.Clipper.TopX=function(a,b){return b==a.Top.Y?a.Top.X:a.Bot.X+d.Clipper.Round(a.Dx*(b-a.Bot.Y))};d.Clipper.prototype.IntersectPoint=function(a,b,c){c.X=0;c.Y=0;var e,f;if(d.ClipperBase.SlopesEqual(a,
b,this.m_UseFullRange)||a.Dx==b.Dx)return b.Bot.Y>a.Bot.Y?(c.X=b.Bot.X,c.Y=b.Bot.Y):(c.X=a.Bot.X,c.Y=a.Bot.Y),!1;if(0===a.Delta.X)c.X=a.Bot.X,d.ClipperBase.IsHorizontal(b)?c.Y=b.Bot.Y:(f=b.Bot.Y-b.Bot.X/b.Dx,c.Y=d.Clipper.Round(c.X/b.Dx+f));else if(0===b.Delta.X)c.X=b.Bot.X,d.ClipperBase.IsHorizontal(a)?c.Y=a.Bot.Y:(e=a.Bot.Y-a.Bot.X/a.Dx,c.Y=d.Clipper.Round(c.X/a.Dx+e));else{e=a.Bot.X-a.Bot.Y*a.Dx;f=b.Bot.X-b.Bot.Y*b.Dx;var g=(f-e)/(a.Dx-b.Dx);c.Y=d.Clipper.Round(g);Math.abs(a.Dx)<Math.abs(b.Dx)?
c.X=d.Clipper.Round(a.Dx*g+e):c.X=d.Clipper.Round(b.Dx*g+f)}if(c.Y<a.Top.Y||c.Y<b.Top.Y){if(a.Top.Y>b.Top.Y)return c.Y=a.Top.Y,c.X=d.Clipper.TopX(b,a.Top.Y),c.X<a.Top.X;c.Y=b.Top.Y;Math.abs(a.Dx)<Math.abs(b.Dx)?c.X=d.Clipper.TopX(a,c.Y):c.X=d.Clipper.TopX(b,c.Y)}return!0};d.Clipper.prototype.ProcessEdgesAtTopOfScanbeam=function(a){for(var b=this.m_ActiveEdges;null!==b;){var c=this.IsMaxima(b,a);c&&(c=this.GetMaximaPair(b),c=null===c||!d.ClipperBase.IsHorizontal(c));if(c){var e=b.PrevInAEL;this.DoMaxima(b);
b=null===e?this.m_ActiveEdges:e.NextInAEL}else this.IsIntermediate(b,a)&&d.ClipperBase.IsHorizontal(b.NextInLML)?(b=this.UpdateEdgeIntoAEL(b),0<=b.OutIdx&&this.AddOutPt(b,b.Bot),this.AddEdgeToSEL(b)):(b.Curr.X=d.Clipper.TopX(b,a),b.Curr.Y=a),this.StrictlySimple&&(e=b.PrevInAEL,0<=b.OutIdx&&0!==b.WindDelta&&null!==e&&0<=e.OutIdx&&e.Curr.X==b.Curr.X&&0!==e.WindDelta&&(c=this.AddOutPt(e,b.Curr),e=this.AddOutPt(b,b.Curr),this.AddJoin(c,e,b.Curr))),b=b.NextInAEL}this.ProcessHorizontals(!0);for(b=this.m_ActiveEdges;null!==
b;){if(this.IsIntermediate(b,a)){c=null;0<=b.OutIdx&&(c=this.AddOutPt(b,b.Top));var b=this.UpdateEdgeIntoAEL(b),e=b.PrevInAEL,f=b.NextInAEL;null!==e&&e.Curr.X==b.Bot.X&&e.Curr.Y==b.Bot.Y&&null!==c&&0<=e.OutIdx&&e.Curr.Y>e.Top.Y&&d.ClipperBase.SlopesEqual(b,e,this.m_UseFullRange)&&0!==b.WindDelta&&0!==e.WindDelta?(e=this.AddOutPt(e,b.Bot),this.AddJoin(c,e,b.Top)):null!==f&&f.Curr.X==b.Bot.X&&f.Curr.Y==b.Bot.Y&&null!==c&&0<=f.OutIdx&&f.Curr.Y>f.Top.Y&&d.ClipperBase.SlopesEqual(b,f,this.m_UseFullRange)&&
0!==b.WindDelta&&0!==f.WindDelta&&(e=this.AddOutPt(f,b.Bot),this.AddJoin(c,e,b.Top))}b=b.NextInAEL}};d.Clipper.prototype.DoMaxima=function(a){var b=this.GetMaximaPair(a);if(null===b)0<=a.OutIdx&&this.AddOutPt(a,a.Top),this.DeleteFromAEL(a);else{for(var c=a.NextInAEL;null!==c&&c!=b;)this.IntersectEdges(a,c,a.Top,!0),this.SwapPositionsInAEL(a,c),c=a.NextInAEL;-1==a.OutIdx&&-1==b.OutIdx?(this.DeleteFromAEL(a),this.DeleteFromAEL(b)):0<=a.OutIdx&&0<=b.OutIdx?this.IntersectEdges(a,b,a.Top,!1):0===a.WindDelta?
(0<=a.OutIdx&&(this.AddOutPt(a,a.Top),a.OutIdx=-1),this.DeleteFromAEL(a),0<=b.OutIdx&&(this.AddOutPt(b,a.Top),b.OutIdx=-1),this.DeleteFromAEL(b)):d.Error("DoMaxima error")}};d.Clipper.ReversePaths=function(a){for(var b=0,c=a.length;b<c;b++)a[b].reverse()};d.Clipper.Orientation=function(a){return 0<=d.Clipper.Area(a)};d.Clipper.prototype.PointCount=function(a){if(null===a)return 0;var b=0,c=a;do b++,c=c.Next;while(c!=a);return b};d.Clipper.prototype.BuildResult=function(a){d.Clear(a);for(var b=0,c=
this.m_PolyOuts.length;b<c;b++){var e=this.m_PolyOuts[b];if(null!==e.Pts){var e=e.Pts.Prev,f=this.PointCount(e);if(!(2>f)){for(var g=Array(f),h=0;h<f;h++)g[h]=e.Pt,e=e.Prev;a.push(g)}}}};d.Clipper.prototype.BuildResult2=function(a){a.Clear();for(var b=0,c=this.m_PolyOuts.length;b<c;b++){var e=this.m_PolyOuts[b],f=this.PointCount(e.Pts);if(!(e.IsOpen&&2>f||!e.IsOpen&&3>f)){this.FixHoleLinkage(e);var g=new d.PolyNode;a.m_AllPolys.push(g);e.PolyNode=g;g.m_polygon.length=f;for(var e=e.Pts.Prev,h=0;h<
f;h++)g.m_polygon[h]=e.Pt,e=e.Prev}}b=0;for(c=this.m_PolyOuts.length;b<c;b++)e=this.m_PolyOuts[b],null!==e.PolyNode&&(e.IsOpen?(e.PolyNode.IsOpen=!0,a.AddChild(e.PolyNode)):null!==e.FirstLeft&&null!=e.FirstLeft.PolyNode?e.FirstLeft.PolyNode.AddChild(e.PolyNode):a.AddChild(e.PolyNode))};d.Clipper.prototype.FixupOutPolygon=function(a){var b=null;a.BottomPt=null;for(var c=a.Pts;;){if(c.Prev==c||c.Prev==c.Next){this.DisposeOutPts(c);a.Pts=null;return}if(d.IntPoint.op_Equality(c.Pt,c.Next.Pt)||d.IntPoint.op_Equality(c.Pt,
c.Prev.Pt)||d.ClipperBase.SlopesEqual(c.Prev.Pt,c.Pt,c.Next.Pt,this.m_UseFullRange)&&(!this.PreserveCollinear||!this.Pt2IsBetweenPt1AndPt3(c.Prev.Pt,c.Pt,c.Next.Pt)))b=null,c.Prev.Next=c.Next,c=c.Next.Prev=c.Prev;else if(c==b)break;else null===b&&(b=c),c=c.Next}a.Pts=c};d.Clipper.prototype.DupOutPt=function(a,b){var c=new d.OutPt;c.Pt.X=a.Pt.X;c.Pt.Y=a.Pt.Y;c.Idx=a.Idx;b?(c.Next=a.Next,c.Prev=a,a.Next.Prev=c,a.Next=c):(c.Prev=a.Prev,c.Next=a,a.Prev.Next=c,a.Prev=c);return c};d.Clipper.prototype.GetOverlap=
function(a,b,c,e,d){a<b?c<e?(d.Left=Math.max(a,c),d.Right=Math.min(b,e)):(d.Left=Math.max(a,e),d.Right=Math.min(b,c)):c<e?(d.Left=Math.max(b,c),d.Right=Math.min(a,e)):(d.Left=Math.max(b,e),d.Right=Math.min(a,c));return d.Left<d.Right};d.Clipper.prototype.JoinHorz=function(a,b,c,e,f,g){var h=a.Pt.X>b.Pt.X?d.Direction.dRightToLeft:d.Direction.dLeftToRight;e=c.Pt.X>e.Pt.X?d.Direction.dRightToLeft:d.Direction.dLeftToRight;if(h==e)return!1;if(h==d.Direction.dLeftToRight){for(;a.Next.Pt.X<=f.X&&a.Next.Pt.X>=
a.Pt.X&&a.Next.Pt.Y==f.Y;)a=a.Next;g&&a.Pt.X!=f.X&&(a=a.Next);b=this.DupOutPt(a,!g);d.IntPoint.op_Inequality(b.Pt,f)&&(a=b,a.Pt.X=f.X,a.Pt.Y=f.Y,b=this.DupOutPt(a,!g))}else{for(;a.Next.Pt.X>=f.X&&a.Next.Pt.X<=a.Pt.X&&a.Next.Pt.Y==f.Y;)a=a.Next;g||a.Pt.X==f.X||(a=a.Next);b=this.DupOutPt(a,g);d.IntPoint.op_Inequality(b.Pt,f)&&(a=b,a.Pt.X=f.X,a.Pt.Y=f.Y,b=this.DupOutPt(a,g))}if(e==d.Direction.dLeftToRight){for(;c.Next.Pt.X<=f.X&&c.Next.Pt.X>=c.Pt.X&&c.Next.Pt.Y==f.Y;)c=c.Next;g&&c.Pt.X!=f.X&&(c=c.Next);
e=this.DupOutPt(c,!g);d.IntPoint.op_Inequality(e.Pt,f)&&(c=e,c.Pt.X=f.X,c.Pt.Y=f.Y,e=this.DupOutPt(c,!g))}else{for(;c.Next.Pt.X>=f.X&&c.Next.Pt.X<=c.Pt.X&&c.Next.Pt.Y==f.Y;)c=c.Next;g||c.Pt.X==f.X||(c=c.Next);e=this.DupOutPt(c,g);d.IntPoint.op_Inequality(e.Pt,f)&&(c=e,c.Pt.X=f.X,c.Pt.Y=f.Y,e=this.DupOutPt(c,g))}h==d.Direction.dLeftToRight==g?(a.Prev=c,c.Next=a,b.Next=e,e.Prev=b):(a.Next=c,c.Prev=a,b.Prev=e,e.Next=b);return!0};d.Clipper.prototype.JoinPoints=function(a,b,c){var e=a.OutPt1,f=new d.OutPt,
g=a.OutPt2,h=new d.OutPt;if((h=a.OutPt1.Pt.Y==a.OffPt.Y)&&d.IntPoint.op_Equality(a.OffPt,a.OutPt1.Pt)&&d.IntPoint.op_Equality(a.OffPt,a.OutPt2.Pt)){for(f=a.OutPt1.Next;f!=e&&d.IntPoint.op_Equality(f.Pt,a.OffPt);)f=f.Next;f=f.Pt.Y>a.OffPt.Y;for(h=a.OutPt2.Next;h!=g&&d.IntPoint.op_Equality(h.Pt,a.OffPt);)h=h.Next;if(f==h.Pt.Y>a.OffPt.Y)return!1;f?(f=this.DupOutPt(e,!1),h=this.DupOutPt(g,!0),e.Prev=g,g.Next=e,f.Next=h,h.Prev=f):(f=this.DupOutPt(e,!0),h=this.DupOutPt(g,!1),e.Next=g,g.Prev=e,f.Prev=h,
h.Next=f);a.OutPt1=e;a.OutPt2=f;return!0}if(h){for(f=e;e.Prev.Pt.Y==e.Pt.Y&&e.Prev!=f&&e.Prev!=g;)e=e.Prev;for(;f.Next.Pt.Y==f.Pt.Y&&f.Next!=e&&f.Next!=g;)f=f.Next;if(f.Next==e||f.Next==g)return!1;for(h=g;g.Prev.Pt.Y==g.Pt.Y&&g.Prev!=h&&g.Prev!=f;)g=g.Prev;for(;h.Next.Pt.Y==h.Pt.Y&&h.Next!=g&&h.Next!=e;)h=h.Next;if(h.Next==g||h.Next==e)return!1;c={Left:null,Right:null};if(!this.GetOverlap(e.Pt.X,f.Pt.X,g.Pt.X,h.Pt.X,c))return!1;b=c.Left;var l=c.Right;c=new d.IntPoint;e.Pt.X>=b&&e.Pt.X<=l?(c.X=e.Pt.X,
c.Y=e.Pt.Y,b=e.Pt.X>f.Pt.X):g.Pt.X>=b&&g.Pt.X<=l?(c.X=g.Pt.X,c.Y=g.Pt.Y,b=g.Pt.X>h.Pt.X):f.Pt.X>=b&&f.Pt.X<=l?(c.X=f.Pt.X,c.Y=f.Pt.Y,b=f.Pt.X>e.Pt.X):(c.X=h.Pt.X,c.Y=h.Pt.Y,b=h.Pt.X>g.Pt.X);a.OutPt1=e;a.OutPt2=g;return this.JoinHorz(e,f,g,h,c,b)}for(f=e.Next;d.IntPoint.op_Equality(f.Pt,e.Pt)&&f!=e;)f=f.Next;if(l=f.Pt.Y>e.Pt.Y||!d.ClipperBase.SlopesEqual(e.Pt,f.Pt,a.OffPt,this.m_UseFullRange)){for(f=e.Prev;d.IntPoint.op_Equality(f.Pt,e.Pt)&&f!=e;)f=f.Prev;if(f.Pt.Y>e.Pt.Y||!d.ClipperBase.SlopesEqual(e.Pt,
f.Pt,a.OffPt,this.m_UseFullRange))return!1}for(h=g.Next;d.IntPoint.op_Equality(h.Pt,g.Pt)&&h!=g;)h=h.Next;var k=h.Pt.Y>g.Pt.Y||!d.ClipperBase.SlopesEqual(g.Pt,h.Pt,a.OffPt,this.m_UseFullRange);if(k){for(h=g.Prev;d.IntPoint.op_Equality(h.Pt,g.Pt)&&h!=g;)h=h.Prev;if(h.Pt.Y>g.Pt.Y||!d.ClipperBase.SlopesEqual(g.Pt,h.Pt,a.OffPt,this.m_UseFullRange))return!1}if(f==e||h==g||f==h||b==c&&l==k)return!1;l?(f=this.DupOutPt(e,!1),h=this.DupOutPt(g,!0),e.Prev=g,g.Next=e,f.Next=h,h.Prev=f):(f=this.DupOutPt(e,!0),
h=this.DupOutPt(g,!1),e.Next=g,g.Prev=e,f.Prev=h,h.Next=f);a.OutPt1=e;a.OutPt2=f;return!0};d.Clipper.GetBounds=function(a){for(var b=0,c=a.length;b<c&&0==a[b].length;)b++;if(b==c)return new d.IntRect(0,0,0,0);var e=new d.IntRect;e.left=a[b][0].X;e.right=e.left;e.top=a[b][0].Y;for(e.bottom=e.top;b<c;b++)for(var f=0,g=a[b].length;f<g;f++)a[b][f].X<e.left?e.left=a[b][f].X:a[b][f].X>e.right&&(e.right=a[b][f].X),a[b][f].Y<e.top?e.top=a[b][f].Y:a[b][f].Y>e.bottom&&(e.bottom=a[b][f].Y);return e};d.Clipper.prototype.GetBounds2=
function(a){var b=a,c=new d.IntRect;c.left=a.Pt.X;c.right=a.Pt.X;c.top=a.Pt.Y;c.bottom=a.Pt.Y;for(a=a.Next;a!=b;)a.Pt.X<c.left&&(c.left=a.Pt.X),a.Pt.X>c.right&&(c.right=a.Pt.X),a.Pt.Y<c.top&&(c.top=a.Pt.Y),a.Pt.Y>c.bottom&&(c.bottom=a.Pt.Y),a=a.Next;return c};d.Clipper.PointInPolygon=function(a,b){var c=0,e=b.length;if(3>e)return 0;for(var d=b[0],g=1;g<=e;++g){var h=g==e?b[0]:b[g];if(h.Y==a.Y&&(h.X==a.X||d.Y==a.Y&&h.X>a.X==d.X<a.X))return-1;if(d.Y<a.Y!=h.Y<a.Y)if(d.X>=a.X)if(h.X>a.X)c=1-c;else{var l=
(d.X-a.X)*(h.Y-a.Y)-(h.X-a.X)*(d.Y-a.Y);if(0==l)return-1;0<l==h.Y>d.Y&&(c=1-c)}else if(h.X>a.X){l=(d.X-a.X)*(h.Y-a.Y)-(h.X-a.X)*(d.Y-a.Y);if(0==l)return-1;0<l==h.Y>d.Y&&(c=1-c)}d=h}return c};d.Clipper.prototype.PointInPolygon=function(a,b){for(var c=0,e=b;;){var d=b.Pt.X,g=b.Pt.Y,h=b.Next.Pt.X,l=b.Next.Pt.Y;if(l==a.Y&&(h==a.X||g==a.Y&&h>a.X==d<a.X))return-1;if(g<a.Y!=l<a.Y)if(d>=a.X)if(h>a.X)c=1-c;else{d=(d-a.X)*(l-a.Y)-(h-a.X)*(g-a.Y);if(0==d)return-1;0<d==l>g&&(c=1-c)}else if(h>a.X){d=(d-a.X)*(l-
a.Y)-(h-a.X)*(g-a.Y);if(0==d)return-1;0<d==l>g&&(c=1-c)}b=b.Next;if(e==b)break}return c};d.Clipper.prototype.Poly2ContainsPoly1=function(a,b){var c=a;do{var e=this.PointInPolygon(c.Pt,b);if(0<=e)return 0!=e;c=c.Next}while(c!=a);return!0};d.Clipper.prototype.FixupFirstLefts1=function(a,b){for(var c=0,e=this.m_PolyOuts.length;c<e;c++){var d=this.m_PolyOuts[c];null!==d.Pts&&d.FirstLeft==a&&this.Poly2ContainsPoly1(d.Pts,b.Pts)&&(d.FirstLeft=b)}};d.Clipper.prototype.FixupFirstLefts2=function(a,b){for(var c=
0,e=this.m_PolyOuts,d=e.length,g=e[c];c<d;c++,g=e[c])g.FirstLeft==a&&(g.FirstLeft=b)};d.Clipper.ParseFirstLeft=function(a){for(;null!=a&&null==a.Pts;)a=a.FirstLeft;return a};d.Clipper.prototype.JoinCommonEdges=function(){for(var a=0,b=this.m_Joins.length;a<b;a++){var c=this.m_Joins[a],e=this.GetOutRec(c.OutPt1.Idx),f=this.GetOutRec(c.OutPt2.Idx);if(null!=e.Pts&&null!=f.Pts){var g;g=e==f?e:this.Param1RightOfParam2(e,f)?f:this.Param1RightOfParam2(f,e)?e:this.GetLowermostRec(e,f);if(this.JoinPoints(c,
e,f))if(e==f){e.Pts=c.OutPt1;e.BottomPt=null;f=this.CreateOutRec();f.Pts=c.OutPt2;this.UpdateOutPtIdxs(f);if(this.m_UsingPolyTree){g=0;for(var h=this.m_PolyOuts.length;g<h-1;g++){var l=this.m_PolyOuts[g];null!=l.Pts&&d.Clipper.ParseFirstLeft(l.FirstLeft)==e&&l.IsHole!=e.IsHole&&this.Poly2ContainsPoly1(l.Pts,c.OutPt2)&&(l.FirstLeft=f)}}this.Poly2ContainsPoly1(f.Pts,e.Pts)?(f.IsHole=!e.IsHole,f.FirstLeft=e,this.m_UsingPolyTree&&this.FixupFirstLefts2(f,e),(f.IsHole^this.ReverseSolution)==0<this.Area(f)&&
this.ReversePolyPtLinks(f.Pts)):this.Poly2ContainsPoly1(e.Pts,f.Pts)?(f.IsHole=e.IsHole,e.IsHole=!f.IsHole,f.FirstLeft=e.FirstLeft,e.FirstLeft=f,this.m_UsingPolyTree&&this.FixupFirstLefts2(e,f),(e.IsHole^this.ReverseSolution)==0<this.Area(e)&&this.ReversePolyPtLinks(e.Pts)):(f.IsHole=e.IsHole,f.FirstLeft=e.FirstLeft,this.m_UsingPolyTree&&this.FixupFirstLefts1(e,f))}else f.Pts=null,f.BottomPt=null,f.Idx=e.Idx,e.IsHole=g.IsHole,g==f&&(e.FirstLeft=f.FirstLeft),f.FirstLeft=e,this.m_UsingPolyTree&&this.FixupFirstLefts2(f,
e)}}};d.Clipper.prototype.UpdateOutPtIdxs=function(a){var b=a.Pts;do b.Idx=a.Idx,b=b.Prev;while(b!=a.Pts)};d.Clipper.prototype.DoSimplePolygons=function(){for(var a=0;a<this.m_PolyOuts.length;){var b=this.m_PolyOuts[a++],c=b.Pts;if(null!==c){do{for(var e=c.Next;e!=b.Pts;){if(d.IntPoint.op_Equality(c.Pt,e.Pt)&&e.Next!=c&&e.Prev!=c){var f=c.Prev,g=e.Prev;c.Prev=g;g.Next=c;e.Prev=f;f.Next=e;b.Pts=c;f=this.CreateOutRec();f.Pts=e;this.UpdateOutPtIdxs(f);this.Poly2ContainsPoly1(f.Pts,b.Pts)?(f.IsHole=!b.IsHole,
f.FirstLeft=b):this.Poly2ContainsPoly1(b.Pts,f.Pts)?(f.IsHole=b.IsHole,b.IsHole=!f.IsHole,f.FirstLeft=b.FirstLeft,b.FirstLeft=f):(f.IsHole=b.IsHole,f.FirstLeft=b.FirstLeft);e=c}e=e.Next}c=c.Next}while(c!=b.Pts)}}};d.Clipper.Area=function(a){var b=a.length;if(3>b)return 0;for(var c=0,e=0,d=b-1;e<b;++e)c+=(a[d].X+a[e].X)*(a[d].Y-a[e].Y),d=e;return 0.5*-c};d.Clipper.prototype.Area=function(a){var b=a.Pts;if(null==b)return 0;var c=0;do c+=(b.Prev.Pt.X+b.Pt.X)*(b.Prev.Pt.Y-b.Pt.Y),b=b.Next;while(b!=a.Pts);
return 0.5*c};d.Clipper.SimplifyPolygon=function(a,b){var c=[],e=new d.Clipper(0);e.StrictlySimple=!0;e.AddPath(a,d.PolyType.ptSubject,!0);e.Execute(d.ClipType.ctUnion,c,b,b);return c};d.Clipper.SimplifyPolygons=function(a,b){"undefined"==typeof b&&(b=d.PolyFillType.pftEvenOdd);var c=[],e=new d.Clipper(0);e.StrictlySimple=!0;e.AddPaths(a,d.PolyType.ptSubject,!0);e.Execute(d.ClipType.ctUnion,c,b,b);return c};d.Clipper.DistanceSqrd=function(a,b){var c=a.X-b.X,e=a.Y-b.Y;return c*c+e*e};d.Clipper.DistanceFromLineSqrd=
function(a,b,c){var e=b.Y-c.Y;c=c.X-b.X;b=e*b.X+c*b.Y;b=e*a.X+c*a.Y-b;return b*b/(e*e+c*c)};d.Clipper.SlopesNearCollinear=function(a,b,c,e){return d.Clipper.DistanceFromLineSqrd(b,a,c)<e};d.Clipper.PointsAreClose=function(a,b,c){var e=a.X-b.X;a=a.Y-b.Y;return e*e+a*a<=c};d.Clipper.ExcludeOp=function(a){var b=a.Prev;b.Next=a.Next;a.Next.Prev=b;b.Idx=0;return b};d.Clipper.CleanPolygon=function(a,b){"undefined"==typeof b&&(b=1.415);var c=a.length;if(0==c)return[];for(var e=Array(c),f=0;f<c;++f)e[f]=
new d.OutPt;for(f=0;f<c;++f)e[f].Pt=a[f],e[f].Next=e[(f+1)%c],e[f].Next.Prev=e[f],e[f].Idx=0;f=b*b;for(e=e[0];0==e.Idx&&e.Next!=e.Prev;)d.Clipper.PointsAreClose(e.Pt,e.Prev.Pt,f)?(e=d.Clipper.ExcludeOp(e),c--):d.Clipper.PointsAreClose(e.Prev.Pt,e.Next.Pt,f)?(d.Clipper.ExcludeOp(e.Next),e=d.Clipper.ExcludeOp(e),c-=2):d.Clipper.SlopesNearCollinear(e.Prev.Pt,e.Pt,e.Next.Pt,f)?(e=d.Clipper.ExcludeOp(e),c--):(e.Idx=1,e=e.Next);3>c&&(c=0);for(var g=Array(c),f=0;f<c;++f)g[f]=new d.IntPoint(e.Pt),e=e.Next;
return g};d.Clipper.CleanPolygons=function(a,b){for(var c=Array(a.length),e=0,f=a.length;e<f;e++)c[e]=d.Clipper.CleanPolygon(a[e],b);return c};d.Clipper.Minkowski=function(a,b,c,e){var f=e?1:0,g=a.length,h=b.length;e=[];if(c)for(c=0;c<h;c++){for(var l=Array(g),k=0,n=a.length,m=a[k];k<n;k++,m=a[k])l[k]=new d.IntPoint(b[c].X+m.X,b[c].Y+m.Y);e.push(l)}else for(c=0;c<h;c++){l=Array(g);k=0;n=a.length;for(m=a[k];k<n;k++,m=a[k])l[k]=new d.IntPoint(b[c].X-m.X,b[c].Y-m.Y);e.push(l)}a=[];for(c=0;c<h-1+f;c++)for(k=
0;k<g;k++)b=[],b.push(e[c%h][k%g]),b.push(e[(c+1)%h][k%g]),b.push(e[(c+1)%h][(k+1)%g]),b.push(e[c%h][(k+1)%g]),d.Clipper.Orientation(b)||b.reverse(),a.push(b);f=new d.Clipper(0);f.AddPaths(a,d.PolyType.ptSubject,!0);f.Execute(d.ClipType.ctUnion,e,d.PolyFillType.pftNonZero,d.PolyFillType.pftNonZero);return e};d.Clipper.MinkowskiSum=function(){var a=arguments,b=a.length;if(3==b){var c=a[0],e=a[2];return d.Clipper.Minkowski(c,a[1],!0,e)}if(4==b){for(var c=a[0],f=a[1],b=a[2],e=a[3],a=new d.Clipper,g,
h=0,l=f.length;h<l;++h)g=d.Clipper.Minkowski(c,f[h],!0,e),a.AddPaths(g,d.PolyType.ptSubject,!0);e&&a.AddPaths(f,d.PolyType.ptClip,!0);c=new d.Paths;a.Execute(d.ClipType.ctUnion,c,b,b);return c}};d.Clipper.MinkowskiDiff=function(a,b,c){return d.Clipper.Minkowski(a,b,!1,c)};d.Clipper.PolyTreeToPaths=function(a){var b=[];d.Clipper.AddPolyNodeToPaths(a,d.Clipper.NodeType.ntAny,b);return b};d.Clipper.AddPolyNodeToPaths=function(a,b,c){var e=!0;switch(b){case d.Clipper.NodeType.ntOpen:return;case d.Clipper.NodeType.ntClosed:e=
!a.IsOpen}0<a.m_polygon.length&&e&&c.push(a.m_polygon);e=0;a=a.Childs();for(var f=a.length,g=a[e];e<f;e++,g=a[e])d.Clipper.AddPolyNodeToPaths(g,b,c)};d.Clipper.OpenPathsFromPolyTree=function(a){for(var b=new d.Paths,c=0,e=a.ChildCount();c<e;c++)a.Childs()[c].IsOpen&&b.push(a.Childs()[c].m_polygon);return b};d.Clipper.ClosedPathsFromPolyTree=function(a){var b=new d.Paths;d.Clipper.AddPolyNodeToPaths(a,d.Clipper.NodeType.ntClosed,b);return b};K(d.Clipper,d.ClipperBase);d.Clipper.NodeType={ntAny:0,ntOpen:1,
ntClosed:2};d.ClipperOffset=function(a,b){"undefined"==typeof a&&(a=2);"undefined"==typeof b&&(b=d.ClipperOffset.def_arc_tolerance);this.m_destPolys=new d.Paths;this.m_srcPoly=new d.Path;this.m_destPoly=new d.Path;this.m_normals=[];this.m_StepsPerRad=this.m_miterLim=this.m_cos=this.m_sin=this.m_sinA=this.m_delta=0;this.m_lowest=new d.IntPoint;this.m_polyNodes=new d.PolyNode;this.MiterLimit=a;this.ArcTolerance=b;this.m_lowest.X=-1};d.ClipperOffset.two_pi=6.28318530717959;d.ClipperOffset.def_arc_tolerance=
0.25;d.ClipperOffset.prototype.Clear=function(){d.Clear(this.m_polyNodes.Childs());this.m_lowest.X=-1};d.ClipperOffset.Round=d.Clipper.Round;d.ClipperOffset.prototype.AddPath=function(a,b,c){var e=a.length-1;if(!(0>e)){var f=new d.PolyNode;f.m_jointype=b;f.m_endtype=c;if(c==d.EndType.etClosedLine||c==d.EndType.etClosedPolygon)for(;0<e&&d.IntPoint.op_Equality(a[0],a[e]);)e--;f.m_polygon.push(a[0]);var g=0;b=0;for(var h=1;h<=e;h++)d.IntPoint.op_Inequality(f.m_polygon[g],a[h])&&(g++,f.m_polygon.push(a[h]),
a[h].Y>f.m_polygon[b].Y||a[h].Y==f.m_polygon[b].Y&&a[h].X<f.m_polygon[b].X)&&(b=g);if(!(c==d.EndType.etClosedPolygon&&2>g||c!=d.EndType.etClosedPolygon&&0>g)&&(this.m_polyNodes.AddChild(f),c==d.EndType.etClosedPolygon))if(0>this.m_lowest.X)this.m_lowest=new d.IntPoint(0,b);else if(a=this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[this.m_lowest.Y],f.m_polygon[b].Y>a.Y||f.m_polygon[b].Y==a.Y&&f.m_polygon[b].X<a.X)this.m_lowest=new d.IntPoint(this.m_polyNodes.ChildCount()-1,b)}};d.ClipperOffset.prototype.AddPaths=
function(a,b,c){for(var e=0,d=a.length;e<d;e++)this.AddPath(a[e],b,c)};d.ClipperOffset.prototype.FixOrientations=function(){if(0<=this.m_lowest.X&&!d.Clipper.Orientation(this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon))for(var a=0;a<this.m_polyNodes.ChildCount();a++){var b=this.m_polyNodes.Childs()[a];(b.m_endtype==d.EndType.etClosedPolygon||b.m_endtype==d.EndType.etClosedLine&&d.Clipper.Orientation(b.m_polygon))&&b.m_polygon.reverse()}else for(a=0;a<this.m_polyNodes.ChildCount();a++)b=this.m_polyNodes.Childs()[a],
b.m_endtype!=d.EndType.etClosedLine||d.Clipper.Orientation(b.m_polygon)||b.m_polygon.reverse()};d.ClipperOffset.GetUnitNormal=function(a,b){var c=b.X-a.X,e=b.Y-a.Y;if(0==c&&0==e)return new d.DoublePoint(0,0);var f=1/Math.sqrt(c*c+e*e);return new d.DoublePoint(e*f,-(c*f))};d.ClipperOffset.prototype.DoOffset=function(a){this.m_destPolys=[];this.m_delta=a;if(d.ClipperBase.near_zero(a))for(var b=0;b<this.m_polyNodes.ChildCount();b++){var c=this.m_polyNodes.Childs()[b];c.m_endtype==d.EndType.etClosedPolygon&&
this.m_destPolys.push(c.m_polygon)}else{this.m_miterLim=2<this.MiterLimit?2/(this.MiterLimit*this.MiterLimit):0.5;var b=0>=this.ArcTolerance?d.ClipperOffset.def_arc_tolerance:this.ArcTolerance>Math.abs(a)*d.ClipperOffset.def_arc_tolerance?Math.abs(a)*d.ClipperOffset.def_arc_tolerance:this.ArcTolerance,e=3.14159265358979/Math.acos(1-b/Math.abs(a));this.m_sin=Math.sin(d.ClipperOffset.two_pi/e);this.m_cos=Math.cos(d.ClipperOffset.two_pi/e);this.m_StepsPerRad=e/d.ClipperOffset.two_pi;0>a&&(this.m_sin=
-this.m_sin);for(b=0;b<this.m_polyNodes.ChildCount();b++){c=this.m_polyNodes.Childs()[b];this.m_srcPoly=c.m_polygon;var f=this.m_srcPoly.length;if(!(0==f||0>=a&&(3>f||c.m_endtype!=d.EndType.etClosedPolygon))){this.m_destPoly=[];if(1==f)if(c.m_jointype==d.JoinType.jtRound)for(var c=1,f=0,g=1;g<=e;g++){this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+c*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+f*a)));var h=c,c=c*this.m_cos-this.m_sin*f,f=h*this.m_sin+f*this.m_cos}else for(f=
c=-1,g=0;4>g;++g)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+c*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+f*a))),0>c?c=1:0>f?f=1:c=-1;else{for(g=this.m_normals.length=0;g<f-1;g++)this.m_normals.push(d.ClipperOffset.GetUnitNormal(this.m_srcPoly[g],this.m_srcPoly[g+1]));c.m_endtype==d.EndType.etClosedLine||c.m_endtype==d.EndType.etClosedPolygon?this.m_normals.push(d.ClipperOffset.GetUnitNormal(this.m_srcPoly[f-1],this.m_srcPoly[0])):this.m_normals.push(new d.DoublePoint(this.m_normals[f-
2]));if(c.m_endtype==d.EndType.etClosedPolygon)for(h=f-1,g=0;g<f;g++)h=this.OffsetPoint(g,h,c.m_jointype);else if(c.m_endtype==d.EndType.etClosedLine){h=f-1;for(g=0;g<f;g++)h=this.OffsetPoint(g,h,c.m_jointype);this.m_destPolys.push(this.m_destPoly);this.m_destPoly=[];h=this.m_normals[f-1];for(g=f-1;0<g;g--)this.m_normals[g]=new d.DoublePoint(-this.m_normals[g-1].X,-this.m_normals[g-1].Y);this.m_normals[0]=new d.DoublePoint(-h.X,-h.Y);h=0;for(g=f-1;0<=g;g--)h=this.OffsetPoint(g,h,c.m_jointype)}else{h=
0;for(g=1;g<f-1;++g)h=this.OffsetPoint(g,h,c.m_jointype);c.m_endtype==d.EndType.etOpenButt?(g=f-1,h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[g].X+this.m_normals[g].X*a),d.ClipperOffset.Round(this.m_srcPoly[g].Y+this.m_normals[g].Y*a)),this.m_destPoly.push(h),h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[g].X-this.m_normals[g].X*a),d.ClipperOffset.Round(this.m_srcPoly[g].Y-this.m_normals[g].Y*a)),this.m_destPoly.push(h)):(g=f-1,h=f-2,this.m_sinA=0,this.m_normals[g]=new d.DoublePoint(-this.m_normals[g].X,
-this.m_normals[g].Y),c.m_endtype==d.EndType.etOpenSquare?this.DoSquare(g,h):this.DoRound(g,h));for(g=f-1;0<g;g--)this.m_normals[g]=new d.DoublePoint(-this.m_normals[g-1].X,-this.m_normals[g-1].Y);this.m_normals[0]=new d.DoublePoint(-this.m_normals[1].X,-this.m_normals[1].Y);h=f-1;for(g=h-1;0<g;--g)h=this.OffsetPoint(g,h,c.m_jointype);c.m_endtype==d.EndType.etOpenButt?(h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X-this.m_normals[0].X*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y-this.m_normals[0].Y*
a)),this.m_destPoly.push(h),h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+this.m_normals[0].X*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+this.m_normals[0].Y*a)),this.m_destPoly.push(h)):(this.m_sinA=0,c.m_endtype==d.EndType.etOpenSquare?this.DoSquare(0,1):this.DoRound(0,1))}}this.m_destPolys.push(this.m_destPoly)}}}};d.ClipperOffset.prototype.Execute=function(){var a=arguments;if(a[0]instanceof d.PolyTree)if(b=a[0],c=a[1],b.Clear(),this.FixOrientations(),this.DoOffset(c),a=new d.Clipper(0),
a.AddPaths(this.m_destPolys,d.PolyType.ptSubject,!0),0<c)a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftPositive,d.PolyFillType.pftPositive);else if(c=d.Clipper.GetBounds(this.m_destPolys),e=new d.Path,e.push(new d.IntPoint(c.left-10,c.bottom+10)),e.push(new d.IntPoint(c.right+10,c.bottom+10)),e.push(new d.IntPoint(c.right+10,c.top-10)),e.push(new d.IntPoint(c.left-10,c.top-10)),a.AddPath(e,d.PolyType.ptSubject,!0),a.ReverseSolution=!0,a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftNegative,d.PolyFillType.pftNegative),
1==b.ChildCount()&&0<b.Childs()[0].ChildCount())for(a=b.Childs()[0],b.Childs()[0]=a.Childs()[0],c=1;c<a.ChildCount();c++)b.AddChild(a.Childs()[c]);else b.Clear();else{var b=a[0],c=a[1];d.Clear(b);this.FixOrientations();this.DoOffset(c);a=new d.Clipper(0);a.AddPaths(this.m_destPolys,d.PolyType.ptSubject,!0);if(0<c)a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftPositive,d.PolyFillType.pftPositive);else{var c=d.Clipper.GetBounds(this.m_destPolys),e=new d.Path;e.push(new d.IntPoint(c.left-10,c.bottom+
10));e.push(new d.IntPoint(c.right+10,c.bottom+10));e.push(new d.IntPoint(c.right+10,c.top-10));e.push(new d.IntPoint(c.left-10,c.top-10));a.AddPath(e,d.PolyType.ptSubject,!0);a.ReverseSolution=!0;a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftNegative,d.PolyFillType.pftNegative);0<b.length&&b.splice(0,1)}}};d.ClipperOffset.prototype.OffsetPoint=function(a,b,c){this.m_sinA=this.m_normals[b].X*this.m_normals[a].Y-this.m_normals[a].X*this.m_normals[b].Y;if(5E-5>this.m_sinA&&-5E-5<this.m_sinA)return b;
1<this.m_sinA?this.m_sinA=1:-1>this.m_sinA&&(this.m_sinA=-1);if(0>this.m_sinA*this.m_delta)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[b].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[b].Y*this.m_delta))),this.m_destPoly.push(new d.IntPoint(this.m_srcPoly[a])),this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[a].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[a].Y*
this.m_delta)));else switch(c){case d.JoinType.jtMiter:c=1+(this.m_normals[a].X*this.m_normals[b].X+this.m_normals[a].Y*this.m_normals[b].Y);c>=this.m_miterLim?this.DoMiter(a,b,c):this.DoSquare(a,b);break;case d.JoinType.jtSquare:this.DoSquare(a,b);break;case d.JoinType.jtRound:this.DoRound(a,b)}return a};d.ClipperOffset.prototype.DoSquare=function(a,b){var c=Math.tan(Math.atan2(this.m_sinA,this.m_normals[b].X*this.m_normals[a].X+this.m_normals[b].Y*this.m_normals[a].Y)/4);this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+
this.m_delta*(this.m_normals[b].X-this.m_normals[b].Y*c)),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_delta*(this.m_normals[b].Y+this.m_normals[b].X*c))));this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_delta*(this.m_normals[a].X+this.m_normals[a].Y*c)),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_delta*(this.m_normals[a].Y-this.m_normals[a].X*c))))};d.ClipperOffset.prototype.DoMiter=function(a,b,c){c=this.m_delta/c;this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+
(this.m_normals[b].X+this.m_normals[a].X)*c),d.ClipperOffset.Round(this.m_srcPoly[a].Y+(this.m_normals[b].Y+this.m_normals[a].Y)*c)))};d.ClipperOffset.prototype.DoRound=function(a,b){for(var c=Math.atan2(this.m_sinA,this.m_normals[b].X*this.m_normals[a].X+this.m_normals[b].Y*this.m_normals[a].Y),c=d.Cast_Int32(d.ClipperOffset.Round(this.m_StepsPerRad*Math.abs(c))),e=this.m_normals[b].X,f=this.m_normals[b].Y,g,h=0;h<c;++h)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+
e*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+f*this.m_delta))),g=e,e=e*this.m_cos-this.m_sin*f,f=g*this.m_sin+f*this.m_cos;this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[a].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[a].Y*this.m_delta)))};d.Error=function(a){try{throw Error(a);}catch(b){alert(b.message)}};d.JS={};d.JS.AreaOfPolygon=function(a,b){b||(b=1);return d.Clipper.Area(a)/(b*b)};d.JS.AreaOfPolygons=function(a,
b){b||(b=1);for(var c=0,e=0;e<a.length;e++)c+=d.Clipper.Area(a[e]);return c/(b*b)};d.JS.BoundsOfPath=function(a,b){return d.JS.BoundsOfPaths([a],b)};d.JS.BoundsOfPaths=function(a,b){b||(b=1);var c=d.Clipper.GetBounds(a);c.left/=b;c.bottom/=b;c.right/=b;c.top/=b;return c};d.JS.Clean=function(a,b){if(!(a instanceof Array))return[];var c=a[0]instanceof Array;a=d.JS.Clone(a);if("number"!=typeof b||null===b)return d.Error("Delta is not a number in Clean()."),a;if(0===a.length||1==a.length&&0===a[0].length||
0>b)return a;c||(a=[a]);for(var e=a.length,f,g,h,l,k,n,m,p=[],q=0;q<e;q++)if(g=a[q],f=g.length,0!==f)if(3>f)h=g,p.push(h);else{h=g;l=b*b;k=g[0];for(m=n=1;m<f;m++)(g[m].X-k.X)*(g[m].X-k.X)+(g[m].Y-k.Y)*(g[m].Y-k.Y)<=l||(h[n]=g[m],k=g[m],n++);k=g[n-1];(g[0].X-k.X)*(g[0].X-k.X)+(g[0].Y-k.Y)*(g[0].Y-k.Y)<=l&&n--;n<f&&h.splice(n,f-n);h.length&&p.push(h)}!c&&p.length?p=p[0]:c||0!==p.length?c&&0===p.length&&(p=[[]]):p=[];return p};d.JS.Clone=function(a){if(!(a instanceof Array)||0===a.length)return[];if(1==
a.length&&0===a[0].length)return[[]];var b=a[0]instanceof Array;b||(a=[a]);var c=a.length,e,d,g,h,l=Array(c);for(d=0;d<c;d++){e=a[d].length;h=Array(e);for(g=0;g<e;g++)h[g]={X:a[d][g].X,Y:a[d][g].Y};l[d]=h}b||(l=l[0]);return l};d.JS.Lighten=function(a,b){if(!(a instanceof Array))return[];if("number"!=typeof b||null===b)return d.Error("Tolerance is not a number in Lighten()."),d.JS.Clone(a);if(0===a.length||1==a.length&&0===a[0].length||0>b)return d.JS.Clone(a);a[0]instanceof Array||(a=[a]);var c,e,
f,g,h,l,k,m,p,q,r,s,t,u,v,x=a.length,y=b*b,w=[];for(c=0;c<x;c++)if(f=a[c],l=f.length,0!=l){for(g=0;1E6>g;g++){h=[];l=f.length;f[l-1].X!=f[0].X||f[l-1].Y!=f[0].Y?(r=1,f.push({X:f[0].X,Y:f[0].Y}),l=f.length):r=0;q=[];for(e=0;e<l-2;e++){k=f[e];p=f[e+1];m=f[e+2];u=k.X;v=k.Y;k=m.X-u;s=m.Y-v;if(0!==k||0!==s)t=((p.X-u)*k+(p.Y-v)*s)/(k*k+s*s),1<t?(u=m.X,v=m.Y):0<t&&(u+=k*t,v+=s*t);k=p.X-u;s=p.Y-v;m=k*k+s*s;m<=y&&(q[e+1]=1,e++)}h.push({X:f[0].X,Y:f[0].Y});for(e=1;e<l-1;e++)q[e]||h.push({X:f[e].X,Y:f[e].Y});
h.push({X:f[l-1].X,Y:f[l-1].Y});r&&f.pop();if(q.length)f=h;else break}l=h.length;h[l-1].X==h[0].X&&h[l-1].Y==h[0].Y&&h.pop();2<h.length&&w.push(h)}!a[0]instanceof Array&&(w=w[0]);"undefined"==typeof w&&(w=[[]]);return w};d.JS.PerimeterOfPath=function(a,b,c){if("undefined"==typeof a)return 0;var e=Math.sqrt,d=0,g,h,k=0,m=g=0;h=0;var n=a.length;if(2>n)return 0;b&&(a[n]=a[0],n++);for(;--n;)g=a[n],k=g.X,g=g.Y,h=a[n-1],m=h.X,h=h.Y,d+=e((k-m)*(k-m)+(g-h)*(g-h));b&&a.pop();return d/c};d.JS.PerimeterOfPaths=
function(a,b,c){c||(c=1);for(var e=0,f=0;f<a.length;f++)e+=d.JS.PerimeterOfPath(a[f],b,c);return e};d.JS.ScaleDownPath=function(a,b){var c,d;b||(b=1);for(c=a.length;c--;)d=a[c],d.X/=b,d.Y/=b};d.JS.ScaleDownPaths=function(a,b){var c,d,f;b||(b=1);for(c=a.length;c--;)for(d=a[c].length;d--;)f=a[c][d],f.X/=b,f.Y/=b};d.JS.ScaleUpPath=function(a,b){var c,d,f=Math.round;b||(b=1);for(c=a.length;c--;)d=a[c],d.X=f(d.X*b),d.Y=f(d.Y*b)};d.JS.ScaleUpPaths=function(a,b){var c,d,f,g=Math.round;b||(b=1);for(c=a.length;c--;)for(d=
a[c].length;d--;)f=a[c][d],f.X=g(f.X*b),f.Y=g(f.Y*b)};d.ExPolygons=function(){return[]};d.ExPolygon=function(){this.holes=this.outer=null};d.JS.AddOuterPolyNodeToExPolygons=function(a,b){var c=new d.ExPolygon;c.outer=a.Contour();var e=a.Childs(),f=e.length;c.holes=Array(f);var g,h,k,m,n;for(h=0;h<f;h++)for(g=e[h],c.holes[h]=g.Contour(),k=0,m=g.Childs(),n=m.length;k<n;k++)g=m[k],d.JS.AddOuterPolyNodeToExPolygons(g,b);b.push(c)};d.JS.ExPolygonsToPaths=function(a){var b,c,e,f,g=new d.Paths;b=0;for(e=
a.length;b<e;b++)for(g.push(a[b].outer),c=0,f=a[b].holes.length;c<f;c++)g.push(a[b].holes[c]);return g};d.JS.PolyTreeToExPolygons=function(a){var b=new d.ExPolygons,c,e,f;c=0;e=a.Childs();for(f=e.length;c<f;c++)a=e[c],d.JS.AddOuterPolyNodeToExPolygons(a,b);return b}})();

; browserify_shim__define__module__export__(typeof ClipperLib != "undefined" ? ClipperLib : window.ClipperLib);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
;(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

},{}],3:[function(require,module,exports){
(function (global){
/*! poly2tri v1.3.5 | (c) 2009-2014 Poly2Tri Contributors */
!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.poly2tri=t()}}(function(){return function t(n,e,i){function o(s,p){if(!e[s]){if(!n[s]){var a="function"==typeof require&&require;if(!p&&a)return a(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var h=e[s]={exports:{}};n[s][0].call(h.exports,function(t){var e=n[s][1][t];return o(e?e:t)},h,h.exports,t,n,e,i)}return e[s].exports}for(var r="function"==typeof require&&require,s=0;s<i.length;s++)o(i[s]);return o}({1:[function(t,n){n.exports={version:"1.3.5"}},{}],2:[function(t,n){"use strict";var e=function(t,n){this.point=t,this.triangle=n||null,this.next=null,this.prev=null,this.value=t.x},i=function(t,n){this.head_=t,this.tail_=n,this.search_node_=t};i.prototype.head=function(){return this.head_},i.prototype.setHead=function(t){this.head_=t},i.prototype.tail=function(){return this.tail_},i.prototype.setTail=function(t){this.tail_=t},i.prototype.search=function(){return this.search_node_},i.prototype.setSearch=function(t){this.search_node_=t},i.prototype.findSearchNode=function(){return this.search_node_},i.prototype.locateNode=function(t){var n=this.search_node_;if(t<n.value){for(;n=n.prev;)if(t>=n.value)return this.search_node_=n,n}else for(;n=n.next;)if(t<n.value)return this.search_node_=n.prev,n.prev;return null},i.prototype.locatePoint=function(t){var n=t.x,e=this.findSearchNode(n),i=e.point.x;if(n===i){if(t!==e.point)if(t===e.prev.point)e=e.prev;else{if(t!==e.next.point)throw new Error("poly2tri Invalid AdvancingFront.locatePoint() call");e=e.next}}else if(i>n)for(;(e=e.prev)&&t!==e.point;);else for(;(e=e.next)&&t!==e.point;);return e&&(this.search_node_=e),e},n.exports=i,n.exports.Node=e},{}],3:[function(t,n){"use strict";function e(t,n){if(!t)throw new Error(n||"Assert Failed")}n.exports=e},{}],4:[function(t,n){"use strict";var e=t("./xy"),i=function(t,n){this.x=+t||0,this.y=+n||0,this._p2t_edge_list=null};i.prototype.toString=function(){return e.toStringBase(this)},i.prototype.toJSON=function(){return{x:this.x,y:this.y}},i.prototype.clone=function(){return new i(this.x,this.y)},i.prototype.set_zero=function(){return this.x=0,this.y=0,this},i.prototype.set=function(t,n){return this.x=+t||0,this.y=+n||0,this},i.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},i.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},i.prototype.sub=function(t){return this.x-=t.x,this.y-=t.y,this},i.prototype.mul=function(t){return this.x*=t,this.y*=t,this},i.prototype.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},i.prototype.normalize=function(){var t=this.length();return this.x/=t,this.y/=t,t},i.prototype.equals=function(t){return this.x===t.x&&this.y===t.y},i.negate=function(t){return new i(-t.x,-t.y)},i.add=function(t,n){return new i(t.x+n.x,t.y+n.y)},i.sub=function(t,n){return new i(t.x-n.x,t.y-n.y)},i.mul=function(t,n){return new i(t*n.x,t*n.y)},i.cross=function(t,n){return"number"==typeof t?"number"==typeof n?t*n:new i(-t*n.y,t*n.x):"number"==typeof n?new i(n*t.y,-n*t.x):t.x*n.y-t.y*n.x},i.toString=e.toString,i.compare=e.compare,i.cmp=e.compare,i.equals=e.equals,i.dot=function(t,n){return t.x*n.x+t.y*n.y},n.exports=i},{"./xy":11}],5:[function(t,n){"use strict";var e=t("./xy"),i=function(t,n){this.name="PointError",this.points=n=n||[],this.message=t||"Invalid Points!";for(var i=0;i<n.length;i++)this.message+=" "+e.toString(n[i])};i.prototype=new Error,i.prototype.constructor=i,n.exports=i},{"./xy":11}],6:[function(t,n,e){(function(n){"use strict";var i=n.poly2tri;e.noConflict=function(){return n.poly2tri=i,e},e.VERSION=t("../dist/version.json").version,e.PointError=t("./pointerror"),e.Point=t("./point"),e.Triangle=t("./triangle"),e.SweepContext=t("./sweepcontext");var o=t("./sweep");e.triangulate=o.triangulate,e.sweep={Triangulate:o.triangulate}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../dist/version.json":1,"./point":4,"./pointerror":5,"./sweep":7,"./sweepcontext":8,"./triangle":9}],7:[function(t,n,e){"use strict";function i(t){t.initTriangulation(),t.createAdvancingFront(),o(t),r(t)}function o(t){var n,e=t.pointCount();for(n=1;e>n;++n)for(var i=t.getPoint(n),o=s(t,i),r=i._p2t_edge_list,a=0;r&&a<r.length;++a)p(t,r[a],o)}function r(t){for(var n=t.front().head().next.triangle,e=t.front().head().next.point;!n.getConstrainedEdgeCW(e);)n=n.neighborCCW(e);t.meshClean(n)}function s(t,n){var e=t.locateNode(n),i=u(t,n,e);return n.x<=e.point.x+F&&d(t,e),g(t,i),i}function p(t,n,e){t.edge_event.constrained_edge=n,t.edge_event.right=n.p.x>n.q.x,h(e.triangle,n.p,n.q)||(C(t,n,e),a(t,n.p,n.q,e.triangle,n.q))}function a(t,n,e,i,o){if(!h(i,n,e)){var r=i.pointCCW(o),s=z(e,r,n);if(s===M.COLLINEAR)throw new D("poly2tri EdgeEvent: Collinear not supported!",[e,r,n]);var p=i.pointCW(o),u=z(e,p,n);if(u===M.COLLINEAR)throw new D("poly2tri EdgeEvent: Collinear not supported!",[e,p,n]);s===u?(i=s===M.CW?i.neighborCCW(o):i.neighborCW(o),a(t,n,e,i,o)):q(t,n,e,i,o)}}function h(t,n,e){var i=t.edgeIndex(n,e);if(-1!==i){t.markConstrainedEdgeByIndex(i);var o=t.getNeighbor(i);return o&&o.markConstrainedEdgeByPoints(n,e),!0}return!1}function u(t,n,e){var i=new O(n,e.point,e.next.point);i.markNeighbor(e.triangle),t.addToMap(i);var o=new B(n);return o.next=e.next,o.prev=e,e.next.prev=o,e.next=o,l(t,i)||t.mapTriangleToNodes(i),o}function d(t,n){var e=new O(n.prev.point,n.point,n.next.point);e.markNeighbor(n.prev.triangle),e.markNeighbor(n.triangle),t.addToMap(e),n.prev.next=n.next,n.next.prev=n.prev,l(t,e)||t.mapTriangleToNodes(e)}function g(t,n){for(var e=n.next;e.next&&!j(e.point,e.next.point,e.prev.point);)d(t,e),e=e.next;for(e=n.prev;e.prev&&!j(e.point,e.next.point,e.prev.point);)d(t,e),e=e.prev;n.next&&n.next.next&&f(n)&&y(t,n)}function f(t){var n=t.point.x-t.next.next.point.x,e=t.point.y-t.next.next.point.y;return S(e>=0,"unordered y"),n>=0||Math.abs(n)<e}function l(t,n){for(var e=0;3>e;++e)if(!n.delaunay_edge[e]){var i=n.getNeighbor(e);if(i){var o=n.getPoint(e),r=i.oppositePoint(n,o),s=i.index(r);if(i.constrained_edge[s]||i.delaunay_edge[s]){n.constrained_edge[e]=i.constrained_edge[s];continue}var p=c(o,n.pointCCW(o),n.pointCW(o),r);if(p){n.delaunay_edge[e]=!0,i.delaunay_edge[s]=!0,_(n,o,i,r);var a=!l(t,n);return a&&t.mapTriangleToNodes(n),a=!l(t,i),a&&t.mapTriangleToNodes(i),n.delaunay_edge[e]=!1,i.delaunay_edge[s]=!1,!0}}}return!1}function c(t,n,e,i){var o=t.x-i.x,r=t.y-i.y,s=n.x-i.x,p=n.y-i.y,a=o*p,h=s*r,u=a-h;if(0>=u)return!1;var d=e.x-i.x,g=e.y-i.y,f=d*r,l=o*g,c=f-l;if(0>=c)return!1;var _=s*g,y=d*p,x=o*o+r*r,v=s*s+p*p,C=d*d+g*g,b=x*(_-y)+v*c+C*u;return b>0}function _(t,n,e,i){var o,r,s,p;o=t.neighborCCW(n),r=t.neighborCW(n),s=e.neighborCCW(i),p=e.neighborCW(i);var a,h,u,d;a=t.getConstrainedEdgeCCW(n),h=t.getConstrainedEdgeCW(n),u=e.getConstrainedEdgeCCW(i),d=e.getConstrainedEdgeCW(i);var g,f,l,c;g=t.getDelaunayEdgeCCW(n),f=t.getDelaunayEdgeCW(n),l=e.getDelaunayEdgeCCW(i),c=e.getDelaunayEdgeCW(i),t.legalize(n,i),e.legalize(i,n),e.setDelaunayEdgeCCW(n,g),t.setDelaunayEdgeCW(n,f),t.setDelaunayEdgeCCW(i,l),e.setDelaunayEdgeCW(i,c),e.setConstrainedEdgeCCW(n,a),t.setConstrainedEdgeCW(n,h),t.setConstrainedEdgeCCW(i,u),e.setConstrainedEdgeCW(i,d),t.clearNeighbors(),e.clearNeighbors(),o&&e.markNeighbor(o),r&&t.markNeighbor(r),s&&t.markNeighbor(s),p&&e.markNeighbor(p),t.markNeighbor(e)}function y(t,n){for(t.basin.left_node=z(n.point,n.next.point,n.next.next.point)===M.CCW?n.next.next:n.next,t.basin.bottom_node=t.basin.left_node;t.basin.bottom_node.next&&t.basin.bottom_node.point.y>=t.basin.bottom_node.next.point.y;)t.basin.bottom_node=t.basin.bottom_node.next;if(t.basin.bottom_node!==t.basin.left_node){for(t.basin.right_node=t.basin.bottom_node;t.basin.right_node.next&&t.basin.right_node.point.y<t.basin.right_node.next.point.y;)t.basin.right_node=t.basin.right_node.next;t.basin.right_node!==t.basin.bottom_node&&(t.basin.width=t.basin.right_node.point.x-t.basin.left_node.point.x,t.basin.left_highest=t.basin.left_node.point.y>t.basin.right_node.point.y,x(t,t.basin.bottom_node))}}function x(t,n){if(!v(t,n)){d(t,n);var e;if(n.prev!==t.basin.left_node||n.next!==t.basin.right_node){if(n.prev===t.basin.left_node){if(e=z(n.point,n.next.point,n.next.next.point),e===M.CW)return;n=n.next}else if(n.next===t.basin.right_node){if(e=z(n.point,n.prev.point,n.prev.prev.point),e===M.CCW)return;n=n.prev}else n=n.prev.point.y<n.next.point.y?n.prev:n.next;x(t,n)}}}function v(t,n){var e;return e=t.basin.left_highest?t.basin.left_node.point.y-n.point.y:t.basin.right_node.point.y-n.point.y,t.basin.width>e?!0:!1}function C(t,n,e){t.edge_event.right?b(t,n,e):E(t,n,e)}function b(t,n,e){for(;e.next.point.x<n.p.x;)z(n.q,e.next.point,n.p)===M.CCW?m(t,n,e):e=e.next}function m(t,n,e){e.point.x<n.p.x&&(z(e.point,e.next.point,e.next.next.point)===M.CCW?W(t,n,e):(w(t,n,e),m(t,n,e)))}function W(t,n,e){d(t,e.next),e.next.point!==n.p&&z(n.q,e.next.point,n.p)===M.CCW&&z(e.point,e.next.point,e.next.next.point)===M.CCW&&W(t,n,e)}function w(t,n,e){z(e.next.point,e.next.next.point,e.next.next.next.point)===M.CCW?W(t,n,e.next):z(n.q,e.next.next.point,n.p)===M.CCW&&w(t,n,e.next)}function E(t,n,e){for(;e.prev.point.x>n.p.x;)z(n.q,e.prev.point,n.p)===M.CW?P(t,n,e):e=e.prev}function P(t,n,e){e.point.x>n.p.x&&(z(e.point,e.prev.point,e.prev.prev.point)===M.CW?T(t,n,e):(N(t,n,e),P(t,n,e)))}function N(t,n,e){z(e.prev.point,e.prev.prev.point,e.prev.prev.prev.point)===M.CW?T(t,n,e.prev):z(n.q,e.prev.prev.point,n.p)===M.CW&&N(t,n,e.prev)}function T(t,n,e){d(t,e.prev),e.prev.point!==n.p&&z(n.q,e.prev.point,n.p)===M.CW&&z(e.point,e.prev.point,e.prev.prev.point)===M.CW&&T(t,n,e)}function q(t,n,e,i,o){var r=i.neighborAcross(o);S(r,"FLIP failed due to missing triangle!");var s=r.oppositePoint(i,o);if(i.getConstrainedEdgeAcross(o)){var p=i.index(o);throw new D("poly2tri Intersecting Constraints",[o,s,i.getPoint((p+1)%3),i.getPoint((p+2)%3)])}if(H(o,i.pointCCW(o),i.pointCW(o),s))if(_(i,o,r,s),t.mapTriangleToNodes(i),t.mapTriangleToNodes(r),o===e&&s===n)e===t.edge_event.constrained_edge.q&&n===t.edge_event.constrained_edge.p&&(i.markConstrainedEdgeByPoints(n,e),r.markConstrainedEdgeByPoints(n,e),l(t,i),l(t,r));else{var h=z(e,s,n);i=I(t,h,i,r,o,s),q(t,n,e,i,o)}else{var u=k(n,e,r,s);A(t,n,e,i,r,u),a(t,n,e,i,o)}}function I(t,n,e,i,o,r){var s;return n===M.CCW?(s=i.edgeIndex(o,r),i.delaunay_edge[s]=!0,l(t,i),i.clearDelaunayEdges(),e):(s=e.edgeIndex(o,r),e.delaunay_edge[s]=!0,l(t,e),e.clearDelaunayEdges(),i)}function k(t,n,e,i){var o=z(n,i,t);if(o===M.CW)return e.pointCCW(i);if(o===M.CCW)return e.pointCW(i);throw new D("poly2tri [Unsupported] nextFlipPoint: opposing point on constrained edge!",[n,i,t])}function A(t,n,e,i,o,r){var s=o.neighborAcross(r);S(s,"FLIP failed due to missing triangle");var p=s.oppositePoint(o,r);if(H(e,i.pointCCW(e),i.pointCW(e),p))q(t,e,p,s,p);else{var a=k(n,e,s,p);A(t,n,e,i,s,a)}}var S=t("./assert"),D=t("./pointerror"),O=t("./triangle"),B=t("./advancingfront").Node,L=t("./utils"),F=L.EPSILON,M=L.Orientation,z=L.orient2d,H=L.inScanArea,j=L.isAngleObtuse;e.triangulate=i},{"./advancingfront":2,"./assert":3,"./pointerror":5,"./triangle":9,"./utils":10}],8:[function(t,n){"use strict";var e=t("./pointerror"),i=t("./point"),o=t("./triangle"),r=t("./sweep"),s=t("./advancingfront"),p=s.Node,a=.3,h=function(t,n){if(this.p=t,this.q=n,t.y>n.y)this.q=t,this.p=n;else if(t.y===n.y)if(t.x>n.x)this.q=t,this.p=n;else if(t.x===n.x)throw new e("poly2tri Invalid Edge constructor: repeated points!",[t]);this.q._p2t_edge_list||(this.q._p2t_edge_list=[]),this.q._p2t_edge_list.push(this)},u=function(){this.left_node=null,this.bottom_node=null,this.right_node=null,this.width=0,this.left_highest=!1};u.prototype.clear=function(){this.left_node=null,this.bottom_node=null,this.right_node=null,this.width=0,this.left_highest=!1};var d=function(){this.constrained_edge=null,this.right=!1},g=function(t,n){n=n||{},this.triangles_=[],this.map_=[],this.points_=n.cloneArrays?t.slice(0):t,this.edge_list=[],this.pmin_=this.pmax_=null,this.front_=null,this.head_=null,this.tail_=null,this.af_head_=null,this.af_middle_=null,this.af_tail_=null,this.basin=new u,this.edge_event=new d,this.initEdges(this.points_)};g.prototype.addHole=function(t){this.initEdges(t);var n,e=t.length;for(n=0;e>n;n++)this.points_.push(t[n]);return this},g.prototype.AddHole=g.prototype.addHole,g.prototype.addHoles=function(t){var n,e=t.length;for(n=0;e>n;n++)this.initEdges(t[n]);return this.points_=this.points_.concat.apply(this.points_,t),this},g.prototype.addPoint=function(t){return this.points_.push(t),this},g.prototype.AddPoint=g.prototype.addPoint,g.prototype.addPoints=function(t){return this.points_=this.points_.concat(t),this},g.prototype.triangulate=function(){return r.triangulate(this),this},g.prototype.getBoundingBox=function(){return{min:this.pmin_,max:this.pmax_}},g.prototype.getTriangles=function(){return this.triangles_},g.prototype.GetTriangles=g.prototype.getTriangles,g.prototype.front=function(){return this.front_},g.prototype.pointCount=function(){return this.points_.length},g.prototype.head=function(){return this.head_},g.prototype.setHead=function(t){this.head_=t},g.prototype.tail=function(){return this.tail_},g.prototype.setTail=function(t){this.tail_=t},g.prototype.getMap=function(){return this.map_},g.prototype.initTriangulation=function(){var t,n=this.points_[0].x,e=this.points_[0].x,o=this.points_[0].y,r=this.points_[0].y,s=this.points_.length;for(t=1;s>t;t++){var p=this.points_[t];p.x>n&&(n=p.x),p.x<e&&(e=p.x),p.y>o&&(o=p.y),p.y<r&&(r=p.y)}this.pmin_=new i(e,r),this.pmax_=new i(n,o);var h=a*(n-e),u=a*(o-r);this.head_=new i(n+h,r-u),this.tail_=new i(e-h,r-u),this.points_.sort(i.compare)},g.prototype.initEdges=function(t){var n,e=t.length;for(n=0;e>n;++n)this.edge_list.push(new h(t[n],t[(n+1)%e]))},g.prototype.getPoint=function(t){return this.points_[t]},g.prototype.addToMap=function(t){this.map_.push(t)},g.prototype.locateNode=function(t){return this.front_.locateNode(t.x)},g.prototype.createAdvancingFront=function(){var t,n,e,i=new o(this.points_[0],this.tail_,this.head_);this.map_.push(i),t=new p(i.getPoint(1),i),n=new p(i.getPoint(0),i),e=new p(i.getPoint(2)),this.front_=new s(t,e),t.next=n,n.next=e,n.prev=t,e.prev=n},g.prototype.removeNode=function(){},g.prototype.mapTriangleToNodes=function(t){for(var n=0;3>n;++n)if(!t.getNeighbor(n)){var e=this.front_.locatePoint(t.pointCW(t.getPoint(n)));e&&(e.triangle=t)}},g.prototype.removeFromMap=function(t){var n,e=this.map_,i=e.length;for(n=0;i>n;n++)if(e[n]===t){e.splice(n,1);break}},g.prototype.meshClean=function(t){for(var n,e,i=[t];n=i.pop();)if(!n.isInterior())for(n.setInterior(!0),this.triangles_.push(n),e=0;3>e;e++)n.constrained_edge[e]||i.push(n.getNeighbor(e))},n.exports=g},{"./advancingfront":2,"./point":4,"./pointerror":5,"./sweep":7,"./triangle":9}],9:[function(t,n){"use strict";var e=t("./xy"),i=function(t,n,e){this.points_=[t,n,e],this.neighbors_=[null,null,null],this.interior_=!1,this.constrained_edge=[!1,!1,!1],this.delaunay_edge=[!1,!1,!1]},o=e.toString;i.prototype.toString=function(){return"["+o(this.points_[0])+o(this.points_[1])+o(this.points_[2])+"]"},i.prototype.getPoint=function(t){return this.points_[t]},i.prototype.GetPoint=i.prototype.getPoint,i.prototype.getPoints=function(){return this.points_},i.prototype.getNeighbor=function(t){return this.neighbors_[t]},i.prototype.containsPoint=function(t){var n=this.points_;return t===n[0]||t===n[1]||t===n[2]},i.prototype.containsEdge=function(t){return this.containsPoint(t.p)&&this.containsPoint(t.q)},i.prototype.containsPoints=function(t,n){return this.containsPoint(t)&&this.containsPoint(n)},i.prototype.isInterior=function(){return this.interior_},i.prototype.setInterior=function(t){return this.interior_=t,this},i.prototype.markNeighborPointers=function(t,n,e){var i=this.points_;if(t===i[2]&&n===i[1]||t===i[1]&&n===i[2])this.neighbors_[0]=e;else if(t===i[0]&&n===i[2]||t===i[2]&&n===i[0])this.neighbors_[1]=e;else{if(!(t===i[0]&&n===i[1]||t===i[1]&&n===i[0]))throw new Error("poly2tri Invalid Triangle.markNeighborPointers() call");this.neighbors_[2]=e}},i.prototype.markNeighbor=function(t){var n=this.points_;t.containsPoints(n[1],n[2])?(this.neighbors_[0]=t,t.markNeighborPointers(n[1],n[2],this)):t.containsPoints(n[0],n[2])?(this.neighbors_[1]=t,t.markNeighborPointers(n[0],n[2],this)):t.containsPoints(n[0],n[1])&&(this.neighbors_[2]=t,t.markNeighborPointers(n[0],n[1],this))},i.prototype.clearNeighbors=function(){this.neighbors_[0]=null,this.neighbors_[1]=null,this.neighbors_[2]=null},i.prototype.clearDelaunayEdges=function(){this.delaunay_edge[0]=!1,this.delaunay_edge[1]=!1,this.delaunay_edge[2]=!1},i.prototype.pointCW=function(t){var n=this.points_;return t===n[0]?n[2]:t===n[1]?n[0]:t===n[2]?n[1]:null},i.prototype.pointCCW=function(t){var n=this.points_;return t===n[0]?n[1]:t===n[1]?n[2]:t===n[2]?n[0]:null},i.prototype.neighborCW=function(t){return t===this.points_[0]?this.neighbors_[1]:t===this.points_[1]?this.neighbors_[2]:this.neighbors_[0]},i.prototype.neighborCCW=function(t){return t===this.points_[0]?this.neighbors_[2]:t===this.points_[1]?this.neighbors_[0]:this.neighbors_[1]},i.prototype.getConstrainedEdgeCW=function(t){return t===this.points_[0]?this.constrained_edge[1]:t===this.points_[1]?this.constrained_edge[2]:this.constrained_edge[0]},i.prototype.getConstrainedEdgeCCW=function(t){return t===this.points_[0]?this.constrained_edge[2]:t===this.points_[1]?this.constrained_edge[0]:this.constrained_edge[1]},i.prototype.getConstrainedEdgeAcross=function(t){return t===this.points_[0]?this.constrained_edge[0]:t===this.points_[1]?this.constrained_edge[1]:this.constrained_edge[2]},i.prototype.setConstrainedEdgeCW=function(t,n){t===this.points_[0]?this.constrained_edge[1]=n:t===this.points_[1]?this.constrained_edge[2]=n:this.constrained_edge[0]=n},i.prototype.setConstrainedEdgeCCW=function(t,n){t===this.points_[0]?this.constrained_edge[2]=n:t===this.points_[1]?this.constrained_edge[0]=n:this.constrained_edge[1]=n},i.prototype.getDelaunayEdgeCW=function(t){return t===this.points_[0]?this.delaunay_edge[1]:t===this.points_[1]?this.delaunay_edge[2]:this.delaunay_edge[0]},i.prototype.getDelaunayEdgeCCW=function(t){return t===this.points_[0]?this.delaunay_edge[2]:t===this.points_[1]?this.delaunay_edge[0]:this.delaunay_edge[1]},i.prototype.setDelaunayEdgeCW=function(t,n){t===this.points_[0]?this.delaunay_edge[1]=n:t===this.points_[1]?this.delaunay_edge[2]=n:this.delaunay_edge[0]=n},i.prototype.setDelaunayEdgeCCW=function(t,n){t===this.points_[0]?this.delaunay_edge[2]=n:t===this.points_[1]?this.delaunay_edge[0]=n:this.delaunay_edge[1]=n},i.prototype.neighborAcross=function(t){return t===this.points_[0]?this.neighbors_[0]:t===this.points_[1]?this.neighbors_[1]:this.neighbors_[2]},i.prototype.oppositePoint=function(t,n){var e=t.pointCW(n);return this.pointCW(e)},i.prototype.legalize=function(t,n){var e=this.points_;if(t===e[0])e[1]=e[0],e[0]=e[2],e[2]=n;else if(t===e[1])e[2]=e[1],e[1]=e[0],e[0]=n;else{if(t!==e[2])throw new Error("poly2tri Invalid Triangle.legalize() call");e[0]=e[2],e[2]=e[1],e[1]=n}},i.prototype.index=function(t){var n=this.points_;if(t===n[0])return 0;if(t===n[1])return 1;if(t===n[2])return 2;throw new Error("poly2tri Invalid Triangle.index() call")},i.prototype.edgeIndex=function(t,n){var e=this.points_;if(t===e[0]){if(n===e[1])return 2;if(n===e[2])return 1}else if(t===e[1]){if(n===e[2])return 0;if(n===e[0])return 2}else if(t===e[2]){if(n===e[0])return 1;if(n===e[1])return 0}return-1},i.prototype.markConstrainedEdgeByIndex=function(t){this.constrained_edge[t]=!0},i.prototype.markConstrainedEdgeByEdge=function(t){this.markConstrainedEdgeByPoints(t.p,t.q)},i.prototype.markConstrainedEdgeByPoints=function(t,n){var e=this.points_;n===e[0]&&t===e[1]||n===e[1]&&t===e[0]?this.constrained_edge[2]=!0:n===e[0]&&t===e[2]||n===e[2]&&t===e[0]?this.constrained_edge[1]=!0:(n===e[1]&&t===e[2]||n===e[2]&&t===e[1])&&(this.constrained_edge[0]=!0)},n.exports=i},{"./xy":11}],10:[function(t,n,e){"use strict";function i(t,n,e){var i=(t.x-e.x)*(n.y-e.y),o=(t.y-e.y)*(n.x-e.x),r=i-o;return r>-s&&s>r?p.COLLINEAR:r>0?p.CCW:p.CW}function o(t,n,e,i){var o=(t.x-n.x)*(i.y-n.y)-(i.x-n.x)*(t.y-n.y);if(o>=-s)return!1;var r=(t.x-e.x)*(i.y-e.y)-(i.x-e.x)*(t.y-e.y);return s>=r?!1:!0}function r(t,n,e){var i=n.x-t.x,o=n.y-t.y,r=e.x-t.x,s=e.y-t.y;return 0>i*r+o*s}var s=1e-12;e.EPSILON=s;var p={CW:1,CCW:-1,COLLINEAR:0};e.Orientation=p,e.orient2d=i,e.inScanArea=o,e.isAngleObtuse=r},{}],11:[function(t,n){"use strict";function e(t){return"("+t.x+";"+t.y+")"}function i(t){var n=t.toString();return"[object Object]"===n?e(t):n}function o(t,n){return t.y===n.y?t.x-n.x:t.y-n.y}function r(t,n){return t.x===n.x&&t.y===n.y}n.exports={toString:i,toStringBase:e,compare:o,equals:r}},{}]},{},[6])(6)});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.PriorityQueue=t()}}(function(){return function t(e,i,r){function o(n,s){if(!i[n]){if(!e[n]){var u="function"==typeof require&&require;if(!s&&u)return u(n,!0);if(a)return a(n,!0);var h=new Error("Cannot find module '"+n+"'");throw h.code="MODULE_NOT_FOUND",h}var p=i[n]={exports:{}};e[n][0].call(p.exports,function(t){var i=e[n][1][t];return o(i?i:t)},p,p.exports,t,e,i,r)}return i[n].exports}for(var a="function"==typeof require&&require,n=0;n<r.length;n++)o(r[n]);return o}({1:[function(t,e){var i,r,o,a,n,s={}.hasOwnProperty,u=function(t,e){function i(){this.constructor=t}for(var r in e)s.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t};i=t("./PriorityQueue/AbstractPriorityQueue"),r=t("./PriorityQueue/ArrayStrategy"),a=t("./PriorityQueue/BinaryHeapStrategy"),o=t("./PriorityQueue/BHeapStrategy"),n=function(t){function e(t){t||(t={}),t.strategy||(t.strategy=a),t.comparator||(t.comparator=function(t,e){return(t||0)-(e||0)}),e.__super__.constructor.call(this,t)}return u(e,t),e}(i),n.ArrayStrategy=r,n.BinaryHeapStrategy=a,n.BHeapStrategy=o,e.exports=n},{"./PriorityQueue/AbstractPriorityQueue":2,"./PriorityQueue/ArrayStrategy":3,"./PriorityQueue/BHeapStrategy":4,"./PriorityQueue/BinaryHeapStrategy":5}],2:[function(t,e){var i;e.exports=i=function(){function t(t){if(null==(null!=t?t.strategy:void 0))throw"Must pass options.strategy, a strategy";if(null==(null!=t?t.comparator:void 0))throw"Must pass options.comparator, a comparator";this.priv=new t.strategy(t),this.length=0}return t.prototype.queue=function(t){return this.length++,void this.priv.queue(t)},t.prototype.dequeue=function(){if(!this.length)throw"Empty queue";return this.length--,this.priv.dequeue()},t.prototype.peek=function(){if(!this.length)throw"Empty queue";return this.priv.peek()},t}()},{}],3:[function(t,e){var i,r;r=function(t,e,i){var r,o,a;for(o=0,r=t.length;r>o;)a=o+r>>>1,i(t[a],e)>=0?o=a+1:r=a;return o},e.exports=i=function(){function t(t){var e;this.options=t,this.comparator=this.options.comparator,this.data=(null!=(e=this.options.initialValues)?e.slice(0):void 0)||[],this.data.sort(this.comparator).reverse()}return t.prototype.queue=function(t){var e;return e=r(this.data,t,this.comparator),void this.data.splice(e,0,t)},t.prototype.dequeue=function(){return this.data.pop()},t.prototype.peek=function(){return this.data[this.data.length-1]},t}()},{}],4:[function(t,e){var i;e.exports=i=function(){function t(t){var e,i,r,o,a,n,s,u,h;for(this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.pageSize=(null!=t?t.pageSize:void 0)||512,this.length=0,r=0;1<<r<this.pageSize;)r+=1;if(1<<r!==this.pageSize)throw"pageSize must be a power of two";for(this._shift=r,this._emptyMemoryPageTemplate=e=[],i=a=0,u=this.pageSize;u>=0?u>a:a>u;i=u>=0?++a:--a)e.push(null);if(this._memory=[],this._mask=this.pageSize-1,t.initialValues)for(h=t.initialValues,n=0,s=h.length;s>n;n++)o=h[n],this.queue(o)}return t.prototype.queue=function(t){return this.length+=1,this._write(this.length,t),void this._bubbleUp(this.length,t)},t.prototype.dequeue=function(){var t,e;return t=this._read(1),e=this._read(this.length),this.length-=1,this.length>0&&(this._write(1,e),this._bubbleDown(1,e)),t},t.prototype.peek=function(){return this._read(1)},t.prototype._write=function(t,e){var i;for(i=t>>this._shift;i>=this._memory.length;)this._memory.push(this._emptyMemoryPageTemplate.slice(0));return this._memory[i][t&this._mask]=e},t.prototype._read=function(t){return this._memory[t>>this._shift][t&this._mask]},t.prototype._bubbleUp=function(t,e){var i,r,o,a;for(i=this.comparator;t>1&&(r=t&this._mask,t<this.pageSize||r>3?o=t&~this._mask|r>>1:2>r?(o=t-this.pageSize>>this._shift,o+=o&~(this._mask>>1),o|=this.pageSize>>1):o=t-2,a=this._read(o),!(i(a,e)<0));)this._write(o,e),this._write(t,a),t=o;return void 0},t.prototype._bubbleDown=function(t,e){var i,r,o,a,n;for(n=this.comparator;t<this.length;)if(t>this._mask&&!(t&this._mask-1)?i=r=t+2:t&this.pageSize>>1?(i=(t&~this._mask)>>1,i|=t&this._mask>>1,i=i+1<<this._shift,r=i+1):(i=t+(t&this._mask),r=i+1),i!==r&&r<=this.length)if(o=this._read(i),a=this._read(r),n(o,e)<0&&n(o,a)<=0)this._write(i,e),this._write(t,o),t=i;else{if(!(n(a,e)<0))break;this._write(r,e),this._write(t,a),t=r}else{if(!(i<=this.length))break;if(o=this._read(i),!(n(o,e)<0))break;this._write(i,e),this._write(t,o),t=i}return void 0},t}()},{}],5:[function(t,e){var i;e.exports=i=function(){function t(t){var e;this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.length=0,this.data=(null!=(e=t.initialValues)?e.slice(0):void 0)||[],this._heapify()}return t.prototype._heapify=function(){var t,e,i;if(this.data.length>0)for(t=e=1,i=this.data.length;i>=1?i>e:e>i;t=i>=1?++e:--e)this._bubbleUp(t);return void 0},t.prototype.queue=function(t){return this.data.push(t),void this._bubbleUp(this.data.length-1)},t.prototype.dequeue=function(){var t,e;return e=this.data[0],t=this.data.pop(),this.data.length>0&&(this.data[0]=t,this._bubbleDown(0)),e},t.prototype.peek=function(){return this.data[0]},t.prototype._bubbleUp=function(t){for(var e,i;t>0&&(e=t-1>>>1,this.comparator(this.data[t],this.data[e])<0);)i=this.data[e],this.data[e]=this.data[t],this.data[t]=i,t=e;return void 0},t.prototype._bubbleDown=function(t){var e,i,r,o,a;for(e=this.data.length-1;;){if(i=(t<<1)+1,o=i+1,r=t,e>=i&&this.comparator(this.data[i],this.data[r])<0&&(r=i),e>=o&&this.comparator(this.data[o],this.data[r])<0&&(r=o),r===t)break;a=this.data[r],this.data[r]=this.data[t],this.data[t]=a,t=r}return void 0},t}()},{}]},{},[1])(1)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
var Pathfinder = require('./pathfinder');
var geo = require('./geometry');

/**
 * Pathfinding web worker implementation.
 * @ignore
 */
module.exports = function () {


var Point = geo.Point;
var Poly = geo.Poly;

/**
 * Object with utility methods for converting objects from serialized
 * message form into the required objects.
 * @private
 */
var Convert = {};

/**
 * The format of a Point as serialized by the Web Worker message-
 * passing interface.
 * @private
 * @typedef {object} PointObj
 * @property {number} x
 * @property {number} y
 */

/**
 * Convert serialized Point object back to Point.
 * @private
 * @param {PointObj} obj - The serialized Point object.
 */
Convert.toPoint = function(obj) {
  return new Point(obj.x, obj.y);
};

/**
 * The format of a Poly as serialized by the Web Worker message-
 * passing interface.
 * @private
 * @typedef {object} PolyObj
 * @property {Array.<PointObj>} points - The array of serialized
 *   Points.
 * @property {boolean} hole - Whether or not the polygon is a hole.
 * @property {integer} numpoints - The number of points in the Poly.
 */

 /**
  * Convert serialized Poly object back to Poly.
  * @private
  * @param {PolyObj} obj - The serialized Poly object.
  */
Convert.toPoly = function(obj) {
  var poly = new Poly();
  poly.points = obj.points.map(Convert.toPoint);
  poly.hole = obj.hole;
  poly.update();
  return poly;
};

var Logger = {};

/**
 * Sends message to parent to be logged to console. Takes same
 * arguments as Bragi logger.
 * @private
 * @param {string} group - The group to associate the message with.
 * @param {...*} - arbitrary arguments to be passed back to the parent
 *   logging function.
 */
Logger.log = function(group) {
  var message = ["log"];
  Array.prototype.push.apply(message, arguments);
  postMessage(message);
};

var Util = {};

Util.splice = function(ary, indices) {
  indices = indices.sort(Util._numberCompare).reverse();
  var removed = [];
  indices.forEach(function(i) {
    removed.push(ary.splice(i, 1)[0]);
  });
  return removed;
};

Util._numberCompare = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
};

/**
 * Set up various actions to take on communication.
 * @private
 * @param {Array} e - An array with the first element being a string
 *   identifier for the message type, and subsequent elements being
 *   arguments to be passed to the relevant function. Message types:
 *   * polys - sets the polygons to use for navigation
 *       - {Array.<Poly>} array of polygons defining the map
 *   * aStar - computes A* on above-set items
 *       - {Point} start location to use for search
 *       - {Point} end location to use for search
 *   * isInitialized - check if the worker is initialized.
 */
onmessage = function(e) {
  var data = e.data;
  var name = data[0];
  Logger.log("worker:debug", "Message received by worker:", data);
  if (name == "polys") {
    // Polygons defining map.
    self.polys = data[1].map(Convert.toPoly);

    // Initialize pathfinder module.
    self.pathfinder = new Pathfinder(self.polys);
  } else if (name == "polyUpdate") {
    // Update to navmesh.
    var newPolys = data[1].map(Convert.toPoly);
    var removedPolys = data[2];

    Util.splice(self.polys, removedPolys);
    Array.prototype.push.apply(self.polys, newPolys);

    // Re-initialize pathfinder.
    self.pathfinder = new Pathfinder(self.polys);
  } else if (name == "aStar") {
    var source = Convert.toPoint(data[1]);
    var target = Convert.toPoint(data[2]);

    var path = self.pathfinder.aStar(source, target);
    postMessage(["result", path]);
  } else if (name == "isInitialized") {
    postMessage(["initialized"]);
  }
};

Logger.log("worker", "Worker loaded.");
// Sent confirmation that worker is initialized.
postMessage(["initialized"]);

};

},{"./geometry":7,"./pathfinder":11}],6:[function(require,module,exports){
/* 
 * These action values correspond to the 256 states possible given empty
 * tiles, diagonal tiles, and square tiles. Generated using diagonals.js.
 * There are two possible forms for an action value. One is as a single object.
 * If an item has only a single object, then there is only one possible entrance/
 * exit possible from that arrangement of tiles. If an item has an array of
 * objects then there are multiple entrance/exits possible. Each of the objects
 * in an array of this sort has a 'loc' property that itself is an object with
 * properties 'in_dir' and 'out_dir' corresponding to the values to get into the
 * cell and the value that should be taken to get out of it. Each of the objects
 * also has a property 'v' which is a boolean corresponding to whether there is 
 * a vertex at a tile with this arrangement. The locations can be n, e, s, w, ne,
 * nw, se, sw.
 * The keys of this object are strings generated using the number values of a
 * contour tile starting from the top left and moving clockwise, separated by hyphens.
 */
module.exports = {"0-0-0-0":{"v":false,"loc":"none"},"1-0-0-0":{"v":true,"loc":"w"},"2-0-0-0":{"v":true,"loc":"w"},"3-0-0-0":{"v":true,"loc":"nw"},"0-1-0-0":{"v":true,"loc":"n"},"1-1-0-0":{"v":false,"loc":"w"},"2-1-0-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-0-0":{"v":true,"loc":"nw"},"0-2-0-0":{"v":true,"loc":"ne"},"1-2-0-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-0-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-0-0":[{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-0-0":{"v":true,"loc":"n"},"1-3-0-0":{"v":true,"loc":"w"},"2-3-0-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"3-3-0-0":{"v":true,"loc":"nw"},"0-0-1-0":{"v":true,"loc":"e"},"1-0-1-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"2-0-1-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"3-0-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-1-0":{"v":false,"loc":"n"},"1-1-1-0":{"v":true,"loc":"w"},"2-1-1-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":false,"loc":{"in_dir":"n","out_dir":"n"}}],"3-1-1-0":{"v":true,"loc":"nw"},"0-2-1-0":{"v":true,"loc":"ne"},"1-2-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}}],"2-2-1-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}}],"3-2-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"1-3-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"2-3-1-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"3-3-1-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"0-0-2-0":{"v":true,"loc":"se"},"1-0-2-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-0-2-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-0-2-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-1-2-0":[{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-1-2-0":[{"v":false,"loc":{"in_dir":"w","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-1-2-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-1-2-0":[{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-2-2-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-2-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-2-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-2-0":[{"v":true,"loc":{"in_dir":"n","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"0-3-2-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-3-2-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"w"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-3-2-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-3-2-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-0-3-0":{"v":true,"loc":"e"},"1-0-3-0":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"2-0-3-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"3-0-3-0":[{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-3-0":{"v":true,"loc":"n"},"1-1-3-0":{"v":true,"loc":"w"},"2-1-3-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"n"}}],"3-1-3-0":{"v":false,"loc":"nw"},"0-2-3-0":{"v":true,"loc":"ne"},"1-2-3-0":[{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}}],"2-2-3-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}}],"3-2-3-0":[{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-3-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"1-3-3-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"2-3-3-0":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"3-3-3-0":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"0-0-0-1":{"v":true,"loc":"s"},"1-0-0-1":{"v":false,"loc":"s"},"2-0-0-1":{"v":true,"loc":"s"},"3-0-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"1-1-0-1":{"v":true,"loc":"s"},"2-1-0-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}}],"0-2-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-0-1":[{"v":false,"loc":{"in_dir":"s","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-0-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"1-3-0-1":{"v":true,"loc":"s"},"2-3-0-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"3-3-0-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}}],"0-0-1-1":{"v":false,"loc":"e"},"1-0-1-1":{"v":true,"loc":"e"},"2-0-1-1":{"v":true,"loc":"e"},"3-0-1-1":[{"v":false,"loc":{"in_dir":"e","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-1-1":{"v":true,"loc":"n"},"1-1-1-1":{"v":false,"loc":"none"},"2-1-1-1":{"v":true,"loc":"n"},"3-1-1-1":{"v":true,"loc":"nw"},"0-2-1-1":{"v":true,"loc":"ne"},"1-2-1-1":{"v":true,"loc":"ne"},"2-2-1-1":{"v":true,"loc":"ne"},"3-2-1-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-1-1":[{"v":false,"loc":{"in_dir":"e","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"1-3-1-1":{"v":true,"loc":"e"},"2-3-1-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"3-3-1-1":[{"v":false,"loc":{"in_dir":"e","out_dir":"e"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}}],"0-0-2-1":{"v":true,"loc":"se"},"1-0-2-1":{"v":true,"loc":"se"},"2-0-2-1":{"v":false,"loc":"se"},"3-0-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"1-1-2-1":{"v":true,"loc":"se"},"2-1-2-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}}],"0-2-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-2-1":[{"v":true,"loc":{"in_dir":"s","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-2-1":[{"v":false,"loc":{"in_dir":"se","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"0-3-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"1-3-2-1":{"v":true,"loc":"se"},"2-3-2-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"3-3-2-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"se"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}}],"0-0-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"1-0-3-1":[{"v":false,"loc":{"in_dir":"s","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"2-0-3-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"3-0-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"1-1-3-1":{"v":true,"loc":"s"},"2-1-3-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"3-1-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"0-2-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"1-2-3-1":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":false,"loc":{"in_dir":"s","out_dir":"s"}}],"2-2-3-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"3-2-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"1-3-3-1":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"2-3-3-1":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"3-3-3-1":[{"v":true,"loc":{"in_dir":"e","out_dir":"s"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}}],"0-0-0-2":{"v":true,"loc":"s"},"1-0-0-2":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-0-0-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-0-0-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-0-2":[{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-1-0-2":[{"v":false,"loc":{"in_dir":"w","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-1-0-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-1-0-2":[{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"0-2-0-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-0-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-0-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-0-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-0-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-3-0-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-3-0-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-3-0-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"0-0-1-2":{"v":true,"loc":"e"},"1-0-1-2":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-0-1-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-0-1-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-1-2":{"v":true,"loc":"n"},"1-1-1-2":{"v":true,"loc":"w"},"2-1-1-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-1-1-2":{"v":true,"loc":"nw"},"0-2-1-2":{"v":false,"loc":"ne"},"1-2-1-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}}],"2-2-1-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-2-1-2":[{"v":false,"loc":{"in_dir":"ne","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-1-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"e"}}],"1-3-1-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-3-1-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-3-1-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"e"}}],"0-0-2-2":{"v":true,"loc":"se"},"1-0-2-2":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-0-2-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-0-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"1-1-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":false,"loc":{"in_dir":"w","out_dir":"w"}}],"2-1-2-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}}],"0-2-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-2-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-2-2":[{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"0-3-2-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}}],"1-3-2-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"w"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-3-2-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-3-2-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"se"}}],"0-0-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-0-3-2":[{"v":true,"loc":{"in_dir":"s","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-0-3-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-0-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-1-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-1-3-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-1-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"0-2-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-2-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}},{"v":true,"loc":{"in_dir":"s","out_dir":"w"}}],"2-2-3-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-2-3-2":[{"v":true,"loc":{"in_dir":"nw","out_dir":"s"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-3-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"1-3-3-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"2-3-3-2":[{"v":true,"loc":{"in_dir":"se","out_dir":"w"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"w"}}],"3-3-3-2":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"ne","out_dir":"s"}}],"0-0-0-3":{"v":true,"loc":"sw"},"1-0-0-3":{"v":true,"loc":"sw"},"2-0-0-3":{"v":true,"loc":"sw"},"3-0-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"1-1-0-3":{"v":true,"loc":"sw"},"2-1-0-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}}],"3-1-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}}],"0-2-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"1-2-0-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"2-2-0-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}}],"3-2-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"1-3-0-3":{"v":false,"loc":"sw"},"2-3-0-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}}],"3-3-0-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}}],"0-0-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"1-0-1-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"2-0-1-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"3-0-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":false,"loc":{"in_dir":"n","out_dir":"n"}}],"1-1-1-3":{"v":true,"loc":"sw"},"2-1-1-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":false,"loc":{"in_dir":"n","out_dir":"n"}}],"3-1-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"nw"}}],"0-2-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}}],"1-2-1-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}}],"2-2-1-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}}],"3-2-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"1-3-1-3":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"2-3-1-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"3-3-1-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"n","out_dir":"e"}}],"0-0-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-0-2-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-0-2-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-0-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-1-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-1-2-3":[{"v":true,"loc":{"in_dir":"w","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-1-2-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"w","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-1-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-2-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-2-2-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-2-2-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-2-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"w","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-3-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"1-3-2-3":[{"v":false,"loc":{"in_dir":"sw","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"2-3-2-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"3-3-2-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"nw"}},{"v":true,"loc":{"in_dir":"n","out_dir":"se"}}],"0-0-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"1-0-3-3":[{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"2-0-3-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"3-0-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-1-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"n"}}],"1-1-3-3":{"v":true,"loc":"sw"},"2-1-3-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"n"}}],"3-1-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":false,"loc":{"in_dir":"nw","out_dir":"nw"}}],"0-2-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}}],"1-2-3-3":[{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"sw"}}],"2-2-3-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}}],"3-2-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"ne"}},{"v":true,"loc":{"in_dir":"s","out_dir":"nw"}}],"0-3-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"1-3-3-3":[{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"2-3-3-3":[{"v":true,"loc":{"in_dir":"se","out_dir":"n"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"n"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}],"3-3-3-3":[{"v":true,"loc":{"in_dir":"e","out_dir":"sw"}},{"v":true,"loc":{"in_dir":"sw","out_dir":"e"}},{"v":true,"loc":{"in_dir":"nw","out_dir":"e"}}]};

},{}],7:[function(require,module,exports){
/**
 * A point can represent a vertex in a 2d environment or a vector.
 * @constructor
 * @param {number} x - The `x` coordinate of the point.
 * @param {number} y - The `y` coordinate of the point.
 */
Point = function(x, y) {
  this.x = x;
  this.y = y;
};
exports.Point = Point;

/**
 * Convert a point-like object into a point.
 * @param {PointLike} p - The point-like object to convert.
 * @return {Point} - The new point representing the point-like
 *   object.
 */
Point.fromPointLike = function(p) {
  return new Point(p.x, p.y);
};

/**
 * String method for point-like objects.
 * @param {PointLike} p - The point-like object to convert.
 * @return {Point} - The new point representing the point-like
 *   object.
 */
Point.toString = function(p) {
  return "x" + p.x + "y" + p.y;
};

/**
 * Takes a point or scalar and adds slotwise in the case of another
 * point, or to each parameter in the case of a scalar.
 * @param {(Point|number)} - The Point, or scalar, to add to this
 *   point.
 */
Point.prototype.add = function(p) {
  if (typeof p == "number")
    return new Point(this.x + p, this.y + p);
  return new Point(this.x + p.x, this.y + p.y);
};

/**
 * Takes a point or scalar and subtracts slotwise in the case of
 * another point or from each parameter in the case of a scalar.
 * @param {(Point|number)} - The Point, or scalar, to subtract from
 *   this point.
 */
Point.prototype.sub = function(p) {
  if (typeof p == "number")
    return new Point(this.x - p, this.y - p);
  return new Point(this.x - p.x, this.y - p.y);
};

/**
 * Takes a scalar value and multiplies each parameter of the point
 * by the scalar.
 * @param  {number} f - The number to multiple the parameters by.
 * @return {Point} - A new point with the calculated coordinates.
 */
Point.prototype.mul = function(f) {
  return new Point(this.x * f, this.y * f);
};

/**
 * Takes a scalar value and divides each parameter of the point
 * by the scalar.
 * @param  {number} f - The number to divide the parameters by.
 * @return {Point} - A new point with the calculated coordinates.
 */
Point.prototype.div = function(f) {
  return new Point(this.x / f, this.y / f);
};

/**
 * Takes another point and returns a boolean indicating whether the
 * points are equal. Two points are equal if their parameters are
 * equal.
 * @param  {Point} p - The point to check equality against.
 * @return {boolean} - Whether or not the two points are equal.
 */
Point.prototype.eq = function(p) {
  return (this.x == p.x && this.y == p.y);
};

/**
 * Takes another point and returns a boolean indicating whether the
 * points are not equal. Two points are considered not equal if their
 * parameters are not equal.
 * @param  {Point} p - The point to check equality against.
 * @return {boolean} - Whether or not the two points are not equal.
 */
Point.prototype.neq = function(p) {
  return (this.x != p.x || this.y != p.y);
};

// Given another point, returns the dot product.
Point.prototype.dot = function(p) {
  return (this.x * p.x + this.y * p.y);
};

// Given another point, returns the 'cross product', or at least the 2d
// equivalent.
Point.prototype.cross = function(p) {
  return (this.x * p.y - this.y * p.x);
};

// Given another point, returns the distance to that point.
Point.prototype.dist = function(p) {
  var diff = this.sub(p);
  return Math.sqrt(diff.dot(diff));
};

// Given another point, returns the squared distance to that point.
Point.prototype.dist2 = function(p) {
  var diff = this.sub(p);
  return diff.dot(diff);
};

/**
 * Returns true if the point is (0, 0).
 * @return {boolean} - Whether or not the point is (0, 0).
 */
Point.prototype.zero = function() {
  return this.x == 0 && this.y == 0;
};

Point.prototype.len = function() {
  return this.dist(new Point(0, 0));
};

Point.prototype.normalize = function() {
  var n = this.dist(new Point(0, 0));
  if (n > 0) return this.div(n);
  return new Point(0, 0);
};

Point.prototype.toString = function() {
  return 'x' + this.x + 'y' + this.y;
};

/**
 * Return a copy of the point.
 * @return {Point} - The new point.
 */
Point.prototype.clone = function() {
  return new Point(this.x, this.y);
};

/**
 * Edges are used to represent the border between two adjacent
 * polygons.
 * @constructor
 * @param {Point} p1 - The first point of the edge.
 * @param {Point} p2 - The second point of the edge.
 */
Edge = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.center = p1.add(p2.sub(p1).div(2));
  this.points = [this.p1, this.center, this.p2];
};
exports.Edge = Edge;

Edge.prototype._CCW = function(p1, p2, p3) {
  a = p1.x; b = p1.y;
  c = p2.x; d = p2.y;
  e = p3.x; f = p3.y;
  return (f - b) * (c - a) > (d - b) * (e - a);
};

/**
 * from http://stackoverflow.com/a/16725715
 * Checks whether this edge intersects the provided edge.
 * @param {Edge} edge - The edge to check intersection for.
 * @return {boolean} - Whether or not the edges intersect.
 */
Edge.prototype.intersects = function(edge) {
  var q1 = edge.p1, q2 = edge.p2;
  if (q1.eq(this.p1) || q1.eq(this.p2) || q2.eq(this.p1) || q2.eq(this.p2)) return false;
  return (this._CCW(this.p1, q1, q2) != this._CCW(this.p2, q1, q2)) && (this._CCW(this.p1, this.p2, q1) != this._CCW(this.p1, this.p2, q2));
};

/**
 * Polygon class.
 * Can be initialized with an array of points.
 * @constructor
 * @param {Array.<Point>} [points] - The points to use to initialize
 *   the poly.
 */
Poly = function(points) {
  if (typeof points == 'undefined') points = false;
  this.hole = false;
  this.points = null;
  this.numpoints = 0;
  if (points) {
    this.numpoints = points.length;
    this.points = points.slice();
  }
};
exports.Poly = Poly;

Poly.prototype.init = function(n) {
  this.points = new Array(n);
  this.numpoints = n;
};

Poly.prototype.update = function() {
  this.numpoints = this.points.length;
};

Poly.prototype.triangle = function(p1, p2, p3) {
  this.init(3);
  this.points[0] = p1;
  this.points[1] = p2;
  this.points[2] = p3;
};

// Takes an index and returns the point at that index, or null.
Poly.prototype.getPoint = function(n) {
  if (this.points && this.numpoints > n)
    return this.points[n];
  return null;
};

// Set a point, fails silently otherwise. TODO: replace with bracket notation.
Poly.prototype.setPoint = function(i, p) {
  if (this.points && this.points.length > i) {
    this.points[i] = p;
  }
};

// Given an index i, return the index of the next point.
Poly.prototype.getNextI = function(i) {
  return (i + 1) % this.numpoints;
};

Poly.prototype.getPrevI = function(i) {
  if (i == 0)
    return (this.numpoints - 1);
  return i - 1;
};

// Returns the signed area of a polygon, if the vertices are given in
// CCW order then the area will be > 0, < 0 otherwise.
Poly.prototype.getArea = function() {
  var area = 0;
  for (var i = 0; i < this.numpoints; i++) {
    var i2 = this.getNextI(i);
    area += this.points[i].x * this.points[i2].y - this.points[i].y * this.points[i2].x;
  }
  return area;
};

Poly.prototype.getOrientation = function() {
  var area = this.getArea();
  if (area > 0) return "CCW";
  if (area < 0) return "CW";
  return 0;
};

Poly.prototype.setOrientation = function(orientation) {
  var current_orientation = this.getOrientation();
  if (current_orientation && (current_orientation !== orientation)) {
    this.invert();
  }
};

Poly.prototype.invert = function() {
  var newpoints = new Array(this.numpoints);
  for (var i = 0; i < this.numpoints; i++) {
    newpoints[i] = this.points[this.numpoints - i - 1];
  }
  this.points = newpoints;
};

Poly.prototype.getCenter = function() {
  var x = this.points.map(function(p) { return p.x });
  var y = this.points.map(function(p) { return p.y });
  var minX = Math.min.apply(null, x);
  var maxX = Math.max.apply(null, x);
  var minY = Math.min.apply(null, y);
  var maxY = Math.max.apply(null, y);
  return new Point((minX + maxX)/2, (minY + maxY)/2);
};

// Adapted from http://stackoverflow.com/a/16283349
Poly.prototype.centroid = function() {
  var x = 0,
      y = 0,
      i,
      j,
      f,
      point1,
      point2;

  for (i = 0, j = this.points.length - 1; i < this.points.length; j = i, i += 1) {
    point1 = this.points[i];
    point2 = this.points[j];
    f = point1.x * point2.y - point2.x * point1.y;
    x += (point1.x + point2.x) * f;
    y += (point1.y + point2.y) * f;
  }

  f = this.getArea() * 3;
  x = Math.abs(x);
  y = Math.abs(y);
  return new Point(x / f, y / f);
};

Poly.prototype.toString = function() {
  var center = this.centroid();
  return "" + center.x + " " + center.y;
};

/**
 * Checks if the given point is contained within the Polygon.
 * Adapted from http://stackoverflow.com/a/8721483
 *
 * @param {Point} p - The point to check.
 * @return {boolean} - Whether or not the point is contained within
 *   the polygon.
 */
Poly.prototype.containsPoint = function(p) {
  var result = false;
  for (var i = 0, j = this.numpoints - 1; i < this.numpoints; j = i++) {
    var p1 = this.points[j], p2 = this.points[i];
    if ((p2.y > p.y) != (p1.y > p.y) &&
        (p.x < (p1.x - p2.x) * (p.y - p2.y) / (p1.y - p2.y) + p2.x)) {
      result = !result;
    }
  }
  return result;
};

/**
 * Clone the given polygon into a new polygon.
 * @return {Poly} - A clone of the polygon.
 */
Poly.prototype.clone = function() {
  return new Poly(this.points.slice().map(function(point) {
    return point.clone();
  }));
};

/**
 * Translate a polygon along a given vector.
 * @param {Point} vec - The vector along which to translate the
 *   polygon.
 * @return {Poly} - The translated polygon.
 */
Poly.prototype.translate = function(vec) {
  return new Poly(this.points.map(function(point) {
    return point.add(vec);
  }));
};

/**
 * Returns an array of edges representing the polygon.
 * @return {Array.<Edge>} - The edges of the polygon.
 */
Poly.prototype.edges = function() {
  if (!this.hasOwnProperty("cached_edges")) {
    this.cached_edges = this.points.map(function(point, i) {
      return new Edge(point, this.points[this.getNextI(i)]);
    }, this);
  }
  return this.cached_edges;
};

/**
 * Naive check if other poly intersects this one, assuming both convex.
 * @param {Poly} poly
 * @return {boolean} - Whether the polygons intersect.
 */
Poly.prototype.intersects = function(poly) {
  var inside = poly.points.some(function(p) {
    return this.containsPoint(p);
  }, this);
  inside = inside || this.points.some(function(p) {
    return poly.containsPoint(p);
  });
  if (inside) {
    return true;
  } else {
    var ownEdges = this.edges();
    var otherEdges = poly.edges();
    var intersect = ownEdges.some(function(ownEdge) {
      return otherEdges.some(function(otherEdge) {
        return ownEdge.intersects(otherEdge);
      });
    });
    return intersect;
  }
};

var util = {};
exports.util = util;

/**
 * Given an array of polygons, returns the one that contains the point.
 * If no polygon is found, null is returned.
 * @param {Point} p - The point to find the polygon for.
 * @param {Array.<Poly>} polys - The polygons to search for the point.
 * @return {?Polygon} - The polygon containing the point.
 */
util.findPolyForPoint = function(p, polys) {
  var i, poly;
  for (i in polys) {
    poly = polys[i];
    if (poly.containsPoint(p)) {
      return poly;
    }
  }
  return null;
};

/**
 * Holds the properties of a collision, if one occurred.
 * @typedef Collision
 * @type {object}
 * @property {boolean} collides - Whether there is a collision.
 * @property {boolean} inside - Whether one object is inside the other.
 * @property {?Point} point - The point of collision, if collision
 *   occurs, and if `inside` is false.
 * @property {?Point} normal - A unit vector normal to the point
 *   of collision, if it occurs and if `inside` is false.
 */
/**
 * If the ray intersects the circle, the distance to the intersection
 * along the ray is returned, otherwise false is returned.
 * @param {Point} p - The start of the ray.
 * @param {Point} ray - Unit vector extending from `p`.
 * @param {Point} c - The center of the circle for the object being
 *   checked for intersection.
 * @param {number} radius - The radius of the circle.
 * @return {Collision} - The collision information.
 */
util.lineCircleIntersection = function(p, ray, c, radius) {
  var collision = {
    collides: false,
    inside: false,
    point: null,
    normal: null
  };
  var vpc = c.sub(p);

  if (vpc.len() <= radius) {
    // Point is inside obstacle.
    collision.collides = true;
    collision.inside = (vpc.len() !== radius);
  } else if (ray.dot(vpc) >= 0) {
    // Circle is ahead of point.
    // Projection of center point onto ray.
    var pc = p.add(ray.mul(ray.dot(vpc)));
    // Length from c to its projection on the ray.
    var len_c_pc = c.sub(pc).len();

    if (len_c_pc <= radius) {
      collision.collides = true;

      // Distance from projected point to intersection.
      var len_intersection = Math.sqrt(len_c_pc * len_c_pc + radius * radius);
      collision.point = pc.sub(ray.mul(len_intersection));
      collision.normal = collision.point.sub(c).normalize();
    }
  }
  return collision;
};

},{}],8:[function(require,module,exports){
var partition = require('./partition');
var geo = require('./geometry');
var Point = geo.Point;
var Poly = geo.Poly;
var Edge = geo.Edge;

var MapParser = require('./parse-map');
var Pathfinder = require('./pathfinder');
var workerPromise = require('./worker');

require('math-round');
var ClipperLib = require('jsclipper');

/**
 * A NavMesh represents the traversable area of a map and gives
 * utilities for pathfinding.
 * Usage:
 * ```javascript
 * // Assuming the 2d map tiles array is available:
 * var navmesh = new NavMesh(map);
 * navmesh.calculatePath(currentlocation, targetLocation, callback);
 * ```
 * @module NavMesh
 */  
/**
 * @constructor
 * @alias module:NavMesh
 * @param {MapTiles} map - The 2d array defining the map tiles.
 * @param {Logger} [logger] - The logger to use.
 */
var NavMesh = function(map, logger) {
  if (typeof logger == 'undefined') {
    logger = {};
    logger.log = function() {};
  }
  this.logger = logger;

  this.initialized = false;

  this.updateFuncs = [];

  this._setupWorker();
  
  // Parse map tiles into polygons.
  var polys = MapParser.parse(map);
  if (!polys) {
    throw "Map parsing failed!";
  }

  // Track map state.
  this.map = JSON.parse(JSON.stringify(map));

  // Initialize navmesh.
  this._init(polys);
};
module.exports = NavMesh;

/**
 * Callback for path calculation requests.
 * @callback PathCallback
 * @param {?Array.<PointLike>} - The calculated path beginning with
 *   the start point, and ending at the target point. If no path is
 *   found then null is passed to the callback.
 */

/**
 * Calculate a path from the source point to the target point, invoking
 * the callback with the path after calculation.
 * @param {PointLike} source - The start location of the search.
 * @param {PointLike} target - The target of the search.
 * @param {PathCallback} callback - The callback function invoked
 *   when the path has been calculated.
 */
NavMesh.prototype.calculatePath = function(source, target, callback) {
  this.logger.log("navmesh:debug", "Calculating path.");

  // Use web worker if present.
  if (this.worker && this.workerInitialized) {
    this.logger.log("navmesh:debug", "Using worker to calculate path.");
    this.worker.postMessage(["aStar", source, target]);
    // Set callback so it is accessible when results are sent back.
    this.lastCallback = callback;
  } else {
    source = Point.fromPointLike(source);
    target = Point.fromPointLike(target);
    path = this.pathfinder.aStar(source, target);
    callback(path);
  }
};

/**
 * Check whether one point is visible from another, without being
 * blocked by obstacles.
 * @param {PointLike} p1 - The first point.
 * @param {PointLike} p2 - The second point.
 * @return {boolean} - Whether `p1` is visible from `p2`.
 */
NavMesh.prototype.checkVisible = function(p1, p2) {
  var edge = new Edge(Point.fromPointLike(p1), Point.fromPointLike(p2));
  var blocked = this.obstacle_edges.some(function(e) {return e.intersects(edge);});
  return !blocked;
};

/**
 * Ensure that passed function is executed when the navmesh has been
 * fully initialized.
 * @param {Function} fn - The function to call when the navmesh is
 *   initialized.
 */
NavMesh.prototype.onInit = function(fn) {
  if (this.initialized) {
    fn();
  } else {
    setTimeout(function() {
      this.onInit(fn);
    }.bind(this), 10);
  }
};

/**
 * @typedef TileUpdate
 * @type {object}
 * @property {integer} x - The x index of the tile to update in the
 *   original map array.
 * @property {integer} y - The y index of the tile to update in the
 *   original map array.
 * @property {(number|string)} v - The new value for the tile.
 */

/**
 * Takes an array of tiles and updates the navigation mesh to reflect
 * the newly traversable area. This should be set as a listener to
 * `mapupdate` socket events.
 * @param {Array.<TileUpdate>} - Information on the tiles updates.
 */
NavMesh.prototype.mapUpdate = function(data) {
  // Check the passed values.
  var error = false;
  // Hold updated tile locations.
  var updates = [];
  data.forEach(function(update) {
    // Update internal map state.
    this.map[update.x][update.y] = update.v;
    if (error) return;
    var tileId = update.v;
    var locId = Point.toString(update);
    var passable = this._isPassable(tileId);
    var currentLocState = this.obstacle_state[locId];
    // All dynamic tile locations should be defined.
    if (typeof currentLocState == 'undefined') {
      error = true;
      this.logger.log("navmesh:error",
        "Dynamic obstacle found but not already initialized.");
      return;
    } else {
      if (passable == currentLocState) {
        // Nothing to do here.
        return;
      } else {
        this.obstacle_state[locId] = passable;
        // Track whether update is making the tiles passable or
        // impassable.
        update.passable = passable;
        updates.push(update);
      }
    }
  }, this);

  if (error) {
    return;
  }

  // Check that we have updates to carry out.
  if (updates.length > 0) {
    // See whether this is an update from passable to impassable
    // or vice-versa.
    var passable = updates[0].passable;

    // Ensure that they all have the same update type.
    updates.forEach(function(update) {
      if (update.passable !== passable) {
        error = true;
      }
    }, this);
    if (error) {
      this.logger.log("navmesh:error",
        "Not all updates of same type.");
      return;
    }
    // Passable/impassable-specific update functions.
    if (passable) {
      this._passableUpdate(updates);
    } else {
      this._impassableUpdate(updates);
    }
  }
};

/**
 * Set up the navmesh to listen to the relevant socket.
 * @param  {Socket} socket - The socket to listen on for `mapupdate`
 *   packets.
 */
NavMesh.prototype.listen = function(socket) {
  socket.on("mapupdate", this.mapUpdate.bind(this));
};

/**
 * A function called when the navigation mesh updates.
 * @callback UpdateCallback
 * @param {Array.<Poly>} - The polys defining the current navigation
 *   mesh.
 * @param {Array.<Poly>} - The polys that were added to the mesh.
 * @param {Array.<integer>} - The indices of the polys that were
 *   removed from the mesh.
 */

/**
 * Register a function to be called when the navigation mesh updates.
 * @param {UpdateCallback} fn - The function to be called.
 */
NavMesh.prototype.onUpdate = function(fn) {
  this.updateFuncs.push(fn);
};

/**
 * Set specific tile identifiers as impassable to the agent.
 * @param {Array.<number>} ids - The tile ids to set as impassable.
 * @param {string} obstacle - The identifier for the polygon for the
 *   obstacles (already passed to addObstaclePoly).
 */
NavMesh.prototype.setImpassable = function(ids) {
  // Remove ids already set as impassable.
  ids = ids.filter(function(id) {
    return this._isPassable(id);
  }, this);
  this.logger.log("navmesh:debug", "Ids passed:", ids);

  var updates = [];
  // Check if any of the dynamic tiles have the values passed.
  this.dynamic_obstacle_locations.forEach(function(loc) {
    var idx = ids.indexOf(this.map[loc.x][loc.y]);
    if (idx !== -1) {
      updates.push({
        x: loc.x,
        y: loc.y,
        v: ids[idx]
      });
    }
  }, this);

  // Add to list of impassable tiles.
  ids.forEach(function(id) {
    this.impassable[id] = true;
  }, this);

  if (updates.length > 0) {
    this.mapUpdate(updates);
  }
};

/**
 * Remove tile identifiers from set of impassable tile types.
 * @param {Array.<number>} ids - The tile ids to set as traversable.
 */
NavMesh.prototype.removeImpassable = function(ids) {
  // Remove ids not set as impassable.
  ids = ids.filter(function(id) {
    return !this._isPassable(id);
  }, this);

  var updates = [];
  // Check if any of the dynamic tiles have the values passed.
  this.dynamic_obstacle_locations.forEach(function(loc) {
    var idx = ids.indexOf(this.map[loc.x][loc.y]);
    if (idx !== -1) {
      updates.push({
        x: loc.x,
        y: loc.y,
        v: ids[idx]
      });
    }
  }, this);

  // Remove from list of impassable tiles.
  ids.forEach(function(id) {
    this.impassable[id] = false;
  }, this);

  if (updates.length > 0) {
    this.mapUpdate(updates);
  }
};

/**
 * Initialize the navigation mesh with the polygons describing the
 * map elements.
 * @private
 * @param {ParsedMap} - The map information parsed into polygons.
 */
NavMesh.prototype._init = function(parsedMap) {
  // Save original parsed map polys.
  this.parsedMap = parsedMap;

  // Static objects relative to the navmesh.
  var navigation_static_objects = {
    walls: parsedMap.walls,
    obstacles: parsedMap.static_obstacles
  }
  var navigation_dynamic_objects = parsedMap.dynamic_obstacles;

  // Offset polys from side so they represent traversable area.
  var areas = this._offsetPolys(navigation_static_objects);

  this.polys = areas.map(NavMesh._geometry.partitionArea);
  this.polys = NavMesh._util.flatten(this.polys);

  if (!this.worker) {
    this.pathfinder = new Pathfinder(this.polys);
  }

  this._setupDynamicObstacles(navigation_dynamic_objects);

  
  // Hold the edges of static obstacles.
  this.static_obstacle_edges = [];
  areas.forEach(function(area) {
    var polys = [area.polygon].concat(area.holes);
    polys.forEach(function(poly) {
      for (var i = 0, j = poly.numpoints - 1; i < poly.numpoints; j = i++) {
        this.static_obstacle_edges.push(new Edge(poly.points[j], poly.points[i]));
      }
    }, this);
  }, this);

  // Holds the edges of static and dynamic obstacles.
  this.obstacle_edges = this.static_obstacle_edges.slice();

  this.initialized = true;
};

/**
 * Set up mesh-dynamic obstacles.
 * @private
 */
NavMesh.prototype._setupDynamicObstacles = function(obstacles) {
  // Holds tile id<->impassable (boolean) associations.
  this.impassable = {};
  // Polygons defining obstacles.
  this.obstacleDefinitions = {};
  // Relation between ids and obstacles.
  this.idToObstacles = {};

  var geo = NavMesh._geometry;

  // Add polygons describing dynamic obstacles.
  this._addObstaclePoly("bomb", geo.getApproximateCircle(15));
  this._addObstaclePoly("boost", geo.getApproximateCircle(15));
  this._addObstaclePoly("portal", geo.getApproximateCircle(15));
  this._addObstaclePoly("spike", geo.getApproximateCircle(14));
  this._addObstaclePoly("gate", geo.getSquare(20));
  this._addObstaclePoly("tile", geo.getSquare(20));
  this._addObstaclePoly("wall", geo.getSquare(20));
  this._addObstaclePoly("sewall", geo.getDiagonal(20, "se"));
  this._addObstaclePoly("newall", geo.getDiagonal(20, "ne"));
  this._addObstaclePoly("swwall", geo.getDiagonal(20, "sw"));
  this._addObstaclePoly("nwwall", geo.getDiagonal(20, "nw"));

  // Add id<->type associations.
  this._setObstacleType([10, 10.1], "bomb");
  this._setObstacleType([5, 5.1, 14, 14.1, 15, 15.1], "boost");
  this._setObstacleType([9, 9.1, 9.2, 9.3], "gate");
  this._setObstacleType([1], "wall");
  this._setObstacleType([1.1], "swwall");
  this._setObstacleType([1.2], "nwwall");
  this._setObstacleType([1.3], "newall");
  this._setObstacleType([1.4], "sewall");
  this._setObstacleType([7], "spike");

  // Set up obstacle state container. Holds whether position is
  // passable or not. Referenced using array location.
  this.obstacle_state = {};

  // Location of dynamic obstacles.
  this.dynamic_obstacle_locations = [];

  // Edges of offsetted obstacled, organized by id.
  this.dynamic_obstacle_polys = {};

  // Container to hold initial obstacle states.
  var initial_states = [];
  obstacles.forEach(function(obstacle) {
    var id = Point.toString(obstacle);

    // Generate offset obstacle.
    var obs = this._offsetDynamicObs([this._getTilePoly(obstacle)]);
    var areas = NavMesh._geometry.getAreas(obs);
    areas = areas.map(function(area) {
      area.holes.push(area.polygon);
      return area.holes;
    });
    areas = NavMesh._util.flatten(areas);
    // Get edges of obstacle.
    var edges = areas.map(function(poly) {
      return poly.edges();
    });
    edges = NavMesh._util.flatten(edges);
    this.dynamic_obstacle_polys[id] = edges;

    // Initialize obstacle states to all be passable.
    this.obstacle_state[id] = true;
    this.dynamic_obstacle_locations.push(Point.fromPointLike(obstacle));
    initial_states.push(obstacle);
  }, this);

  // Set up already-known dynamic impassable values.
  this.setImpassable([10, 5, 9.1]);
  // Walls and spikes.
  this.setImpassable([1, 1.1, 1.2, 1.3, 1.4, 7]);

  // Set up callback to regenerate obstacle edges for visibility checking.
  this.onUpdate(function(polys) {
    var obstacle_edges = [];
    for (id in this.obstacle_state) {
      if (!this.obstacle_state[id]) {
        Array.prototype.push.apply(
          obstacle_edges,
          this.dynamic_obstacle_polys[id]);
      }
    }
    this.obstacle_edges = this.static_obstacle_edges.concat(obstacle_edges);
  }.bind(this));

  // Initialize mapupdate with already-present dynamic obstacles.
  this.mapUpdate(initial_states);
};

/**
 * Add poly definition for obstacle type.
 * edges should be relative to center of tile.
 * @private
 */
NavMesh.prototype._addObstaclePoly = function(name, poly) {
  this.obstacleDefinitions[name] = poly;
};

/**
 * Retrieve the polygon for a given obstacle id.
 * @private
 * @param {number} id - The id to retrieve the obstacle polygon for.
 * @return {Poly} - The polygon representing the obstacle.
 */
NavMesh.prototype._getObstaclePoly = function(id) {
  var poly = this.obstacleDefinitions[this.idToObstacles[id]]
  if (poly) {
    return poly.clone();
  } else {
    this.logger.log("navmesh:debug", "No poly found for id:", id);
  }
};

/**
 * Update the navigation mesh to the given polys and call the update
 * functions.
 * @private
 * @param {Array.<Poly>} polys - The new polys defining the nav mesh.
 * @param {Array.<Poly>} added - The polys that were added to the mesh.
 * @param {Array.<integer>} removed - The indices of the polys that were
 *   removed from the mesh.
 */
NavMesh.prototype._update = function(polys, added, removed) {
  this.polys = polys;
  this.updateFuncs.forEach(function(fn) {
    setTimeout(function() {
      fn(this.polys, added, removed);
    }.bind(this), 0);
  }, this);
};

/**
 * Set the relationship between specific tile identifiers and the
 * polygons representing the shape of the obstacle they correspond
 * to.
 * @private
 * @param {Array.<number>} ids - The tile ids to set as impassable.
 * @param {string} obstacle - The identifier for the polygon for the
 *   obstacles (already passed to addObstaclePoly).
 */
NavMesh.prototype._setObstacleType = function(ids, type) {
  ids.forEach(function(id) {
    this.idToObstacles[id] = type;
  }, this);
};

/**
 * Check whether the provided id corresponds to a passable tile.
 * @return {boolean} - Whether the id is for a passable tile.
 */
NavMesh.prototype._isPassable = function(id) {
  // Check if in list of impassable tiles.
  return !this.impassable.hasOwnProperty(id) || !this.impassable[id];
};

/**
 * Get a polygon corresponding to the dimensions and location of the
 * provided tile update.
 * @private
 * @param {TileUpdate} tile - The tile update information.
 * @return {Poly} - The polygon representing the tile.
 */
NavMesh.prototype._getTilePoly = function(tile) {
  // Get the base poly from a list of such things by tile id
  // then translate according to the array location.
  var id = tile.v;
  var p = this._getWorldCoord(tile);
  var poly = this._getObstaclePoly(id).translate(p);
  return poly;
};

/**
 * Represents a point in space or a location in a 2d array.
 * @typedef PointLike
 * @type {object}
 * @property {number} x - The `x` coordinate for the point, or row
 *   for the array location.
 * @property {number} y - The `y` coordinate for the point. or column
 *   for the array location.
 */

/**
 * Given an array location, return the world coordinate representing
 * the center point of the tile at that array location.
 * @private
 * @param {PointLike} arrayLoc - The location in the map for the point.
 * @returm {Point} - The coordinates for the center of the location.
 */
NavMesh.prototype._getWorldCoord = function(arrayLoc) {
  var TILE_WIDTH = 40;
  return new Point(
    arrayLoc.x * TILE_WIDTH + (TILE_WIDTH / 2),
    arrayLoc.y * TILE_WIDTH + (TILE_WIDTH / 2)
  );
};

/**
 * Carry out the navmesh update for impassable dynamic obstacles that
 * have been removed from the navmesh.
 * @private
 * @param {Array.<TileUpdate>} updates - The tile update information.
 */
NavMesh.prototype._passableUpdate = function(updates) {
  var scale = 100;
  // Assume each of the tiles is now a square of open space.
  var passableTiles = updates.map(function(update) {
    return this._getTilePoly({
      x: update.x,
      y: update.y,
      v: 1
    });
  }, this);

  // Offset and merge newly passable tiles, assuming no tile along
  // with its offset would have been larger than a single tile.
  // Set offset slightly larger that normal so that we catch all
  // relevant polygons that need to be updated in the navmesh.
  var passableArea = this._offsetDynamicObs(passableTiles, 20);

  var cpr = NavMesh._geometry.cpr;

  // Get impassable tiles bordering the now-passable area and offset them.
  var borderingTiles = this._getBorderedTiles(updates);
  var borderingPolys = borderingTiles.map(this._getTilePoly, this);
  var surroundingArea = this._offsetDynamicObs(borderingPolys);

  // Get difference between the open area and the surrounding obstacles.
  cpr.Clear();
  var actualPassableArea = new ClipperLib.Paths();
  cpr.AddPaths(passableArea, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPaths(surroundingArea, ClipperLib.PolyType.ptClip, true);
  cpr.Execute(ClipperLib.ClipType.ctDifference,
    actualPassableArea,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );

  var passableAreas = NavMesh._geometry.getAreas(actualPassableArea, scale);

  var passablePartition = NavMesh._geometry.partitionAreas(passableAreas);

  // Get mesh polys intersected by offsetted passable area.
  var intersection = this._getIntersectedPolys(passablePartition);
  var intersectedMeshPolys = intersection.polys;

  // Create outline with matched mesh polys.
  intersectedMeshPolys = intersectedMeshPolys.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(intersectedMeshPolys, scale);

  // Merge intersected mesh polys and with newly passable area.
  cpr.Clear();
  cpr.AddPaths(intersectedMeshPolys, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPaths(actualPassableArea, ClipperLib.PolyType.ptSubject, true);
  var newMeshArea = new ClipperLib.Paths();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    newMeshArea,
    ClipperLib.PolyFillType.pftNonZero,
    null);

  // Partition the unioned mesh polys and new passable area and add
  // to the existing mesh polys.
  var meshAreas = NavMesh._geometry.getAreas(newMeshArea, scale);
  var newPolys = NavMesh._geometry.partitionAreas(meshAreas);
  Array.prototype.push.apply(this.polys, newPolys);

  this._update(this.polys, newPolys, intersection.indices);
};

/**
 * Carry out the navmesh update for impassable dynamic obstacles that
 * have been added to the navmesh.
 * @private
 * @param {Array.<TileUpdate>} updates - The tile update information.
 */
NavMesh.prototype._impassableUpdate = function(updates) {
  var scale = 100;
  // Get polygons defining these obstacles.
  var obstaclePolys = updates.map(function(update) {
    return this._getTilePoly(update);
  }, this);

  // Offset the obstacle polygons.
  var offsettedObstacles = this._offsetDynamicObs(obstaclePolys);
  var obstacleAreas = NavMesh._geometry.getAreas(offsettedObstacles);

  // Get convex partition of new obstacle areas for finding
  // intersections.
  var obstaclePartition = NavMesh._geometry.partitionAreas(obstacleAreas);

  // Get mesh polys intersected by offsetted obstacles.
  var intersection = this._getIntersectedPolys(obstaclePartition);
  var intersectedMeshPolys = intersection.polys;

  // Create outline with matched mesh polys.
  intersectedMeshPolys = intersectedMeshPolys.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(intersectedMeshPolys, scale);
  var cpr = NavMesh._geometry.cpr;

  // Merge matched polys
  cpr.Clear();
  cpr.AddPaths(intersectedMeshPolys, ClipperLib.PolyType.ptSubject, true);
  var mergedMeshPolys = new ClipperLib.Paths();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    mergedMeshPolys,
    ClipperLib.PolyFillType.pftNonZero,
    null);

  // Take difference of mesh polys and obstacle polys.
  var paths = new ClipperLib.Paths();
  cpr.Clear();
  cpr.AddPaths(mergedMeshPolys, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPaths(offsettedObstacles, ClipperLib.PolyType.ptClip, true);

  cpr.Execute(ClipperLib.ClipType.ctDifference,
    paths,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );

  var areas = NavMesh._geometry.getAreas(paths, scale);
  // Make polys from new space.
  var polys = NavMesh._geometry.partitionAreas(areas);

  // Add to existing polygons.
  Array.prototype.push.apply(this.polys, polys);

  this._update(this.polys, polys, intersection.indices);
};

/**
 * Offsetting function for dynamic obstacles.
 * @private
 * @param {Array.<Poly>} obstacles
 * @param {number} [offset=16]
 * @return {Array.<Poly>}
 */
NavMesh.prototype._offsetDynamicObs = function(obstacles, offset) {
  if (typeof offset == 'undefined') offset = 16;
  var scale = 100;
  obstacles = obstacles.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(obstacles, scale);

  var cpr = NavMesh._geometry.cpr;
  var co = NavMesh._geometry.co;

  // Merge obstacles together, so obstacles that share a common edge
  // will be expanded properly.
  cpr.Clear();
  cpr.AddPaths(obstacles, ClipperLib.PolyType.ptSubject, true);
  var merged_obstacles = new ClipperLib.Paths();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    merged_obstacles,
    ClipperLib.PolyFillType.pftNonZero,
    null);

  // Offset obstacles.
  var offsetted_paths = new ClipperLib.Paths();

  merged_obstacles.forEach(function(obstacle) {
    var offsetted_obstacle = new ClipperLib.Paths();
    co.Clear();
    co.AddPath(obstacle, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_obstacle, offset * scale);
    offsetted_paths.push(offsetted_obstacle[0]);
  });

  // Merge any newly-overlapping obstacles.
  cpr.Clear();
  cpr.AddPaths(offsetted_paths, ClipperLib.PolyType.ptSubject, true);
  merged_obstacles = new ClipperLib.Paths();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    merged_obstacles,
    ClipperLib.PolyFillType.pftNonZero,
    null);
  return merged_obstacles;
};

/**
 * Get and remove the mesh polygons impacted by the addition of new
 * obstacles. The provided obstacles should already be offsetted.
 * @private
 * @param {Array.<Poly>} obstacles - The offsetted obstacles to get
 *   the intersection of. Must be convex.
 * @return {Array.<Poly>} - The affected polys.
 */
NavMesh.prototype._getIntersectedPolys = function(obstacles) {
  var intersectedIndices = NavMesh._geometry.getIntersections(obstacles, this.polys);
  return {
    indices: intersectedIndices,
    polys: NavMesh._util.splice(this.polys, intersectedIndices)
  };
};

/**
 * Get the impassable tiles bordering updated passable tiles.
 * @private
 * @param {Array.<TileUpdate>} tiles - The updated passable tiles.
 * @return {Array.<ArrayLoc>} - The new array locations.
 */
NavMesh.prototype._getBorderedTiles = function(tiles) {
  // Track locations already being updated or added.
  var locations = {};
  tiles.forEach(function(tile) {
    locations[Point.toString(tile)] = true;
  });

  var map = this.map;
  var xUpperBound = map.length;
  var yUpperBound = map[0].length;
  // Get the locations adjacent to a given tile in the map.
  var getAdjacent = function(tile) {
    var x = tile.x;
    var y = tile.y;
    var xUp = x + 1 < xUpperBound;
    var xDown = x >= 0;
    var yUp = y + 1 < yUpperBound;
    var yDown = y >= 0;

    var adjacents = [];
    if (xUp) {
      adjacents.push({x: x + 1, y: y});
      if (yUp) {
        adjacents.push({x: x + 1, y: y + 1});
      }
      if (yDown) {
        adjacents.push({x: x + 1, y: y - 1});
      }
    }
    if (xDown) {
      adjacents.push({x: x - 1, y: y});
      if (yUp) {
        adjacents.push({x: x - 1, y: y + 1});
      }
      if (yDown) {
        adjacents.push({x: x - 1, y: y - 1});
      }
    }
    if (yUp) {
      adjacents.push({x: x, y: y + 1});
    }
    if (yDown) {
      adjacents.push({x: x, y: y - 1});
    }
    return adjacents;
  };

  // Store adjacent impassable tiles.
  var adjacent_tiles = [];
  tiles.forEach(function(tile) {
    var adjacents = getAdjacent(tile);
    adjacents.forEach(function(adjacent) {
      var id = Point.toString(adjacent);
      if (!locations[id]) {
        // Record as having been seen.
        locations[id] = true;
        var val = this.map[adjacent.x][adjacent.y];
        if (!this._isPassable(val)) {
          adjacent.v = val;
          adjacent_tiles.push(adjacent);
        }
      }
    }, this);
  }, this);
  return adjacent_tiles;
};

/**
 * Represents the outline of a shape along with its holes.
 * @typedef MapArea
 * @type {object}
 * @property {Poly} polygon - The polygon defining the exterior of
 *   the shape.
 * @property {Array.<Poly>} holes - The holes of the shape.
 */

/**
 * Offset the polygons such that there is a `offset` unit buffer
 * between the sides of the outline and around the obstacles. This
 * buffer makes it so that the mesh truly represents the movable area
 * in the map. Assumes vertices defining interior shapes (like the
 * main outline of an enclosed map) are given in CCW order and
 * obstacles are given in CW order.
 * @private
 * @param {Array.<Poly>} polys - The polygons to offset.
 * @param {number} [offset=16] - The amount to offset the polygons
 *   from the movable areas.
 * @return {Array.<MapArea>} - The shapes defining the polygons after
 *   offsetting and merging.
 */
NavMesh.prototype._offsetPolys = function(static_objects, offset) {
  // ~= ball radius / 2
  if (typeof offset == 'undefined') offset = 16;

  // Separate interior and exterior walls. The CCW shapes correspond
  // to the interior wall outlines of out map, the CW shapes are walls
  // that were traced on their outside.
  var interior_walls = [];
  var exterior_walls = static_objects.walls.filter(function(poly, index) {
    if (poly.getOrientation() == "CCW") {
      interior_walls.push(poly);
      return false;
    }
    return true;
  });

  var scale = 100;
  
  // Offset the interior walls.
  interior_walls = interior_walls.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(interior_walls, scale);
  
  var offsetted_interior_walls = [];
  interior_walls.forEach(function(wall) {
    var offsetted_paths = NavMesh._geometry.offsetInterior(wall, offset);
    Array.prototype.push.apply(offsetted_interior_walls, offsetted_paths);
  });

  // Reverse paths since from here on we're going to treat the
  // outlines as the exterior of a shape.
  offsetted_interior_walls.forEach(function(path) {
    path.reverse();
  });
  
  exterior_walls = exterior_walls.map(NavMesh._geometry.convertPolyToClipper);

  ClipperLib.JS.ScaleUpPaths(exterior_walls, scale);

  //var cpr = new ClipperLib.Clipper();
  var cpr = NavMesh._geometry.cpr;
  var co = NavMesh._geometry.co;
  
  var wall_fillType = ClipperLib.PolyFillType.pftEvenOdd;
  var obstacle_fillType = ClipperLib.PolyFillType.pftNonZero;
  
  // Offset exterior walls.
  var offsetted_exterior_walls = [];

  exterior_walls.forEach(function(wall) {
    var offsetted_exterior_wall = new ClipperLib.Paths();
    co.Clear();
    co.AddPath(wall, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_exterior_wall, offset * scale);
    offsetted_exterior_walls.push(offsetted_exterior_wall[0]);
  });
  
  // Offset obstacles.
  // Obstacles are offsetted using miter join type to avoid
  // unnecessary small edges.
  var offsetted_obstacles = new ClipperLib.Paths();

  var obstacles = static_objects.obstacles.map(NavMesh._geometry.convertPolyToClipper);
  ClipperLib.JS.ScaleUpPaths(obstacles, scale);
  co.Clear();
  co.AddPaths(obstacles, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
  co.Execute(offsetted_obstacles, offset * scale);

  // Take difference of polygons defining interior wall and polygons
  // defining exterior walls, limiting to exterior wall polygons whose
  // area is less than the interior wall polygons so the difference
  // operation doesn't remove potentially traversable areas.
  var merged_paths = [];
  offsetted_interior_walls.forEach(function(wall) {
    var area = ClipperLib.JS.AreaOfPolygon(wall, scale);
    var smaller_exterior_walls = offsetted_exterior_walls.filter(function(ext_wall) {
      return ClipperLib.JS.AreaOfPolygon(ext_wall, scale) < area;
    });
    var paths = new ClipperLib.Paths();
    cpr.Clear();
    cpr.AddPath(wall, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(smaller_exterior_walls, ClipperLib.PolyType.ptClip, true);
    // Obstacles are small individual solid objects that aren't at
    // risk of enclosing an interior area.
    cpr.AddPaths(offsetted_obstacles, ClipperLib.PolyType.ptClip, true);
    cpr.Execute(ClipperLib.ClipType.ctDifference,
      paths,
      ClipperLib.PolyFillType.pftNonZero,
      ClipperLib.PolyFillType.pftNonZero
    );
    Array.prototype.push.apply(merged_paths, paths);
  });

  return NavMesh._geometry.getAreas(merged_paths, scale);
};

/**
 * Sets up callbacks on the web worker promise object to initialize
 * the web worker interface once loaded.
 * @private
 */
NavMesh.prototype._setupWorker = function() {
  // Initial state.
  this.worker = false;
  this.workerInitialized = false;

  // Set callbacks for worker promise object.
  workerPromise.then(function(worker) {
    this.logger.log("navmesh:debug", "Worker promise returned.");
    this.worker = worker;
    this.worker.onmessage = this._getWorkerInterface();
    // Check if worker is already initialized.
    this.worker.postMessage(["isInitialized"]);
  }.bind(this), function(Error) {
    this.logger.log("navmesh:warn", "No worker, falling back to in-thread computation.");
    this.logger.log("navmesh:warn", "Worker error:", Error);
    this.worker = false;
  }.bind(this));

  // Set up callback to update worker on navmesh update.
  this.onUpdate(function(disregard, newPolys, removedIndices) {
    if (this.worker && this.workerInitialized) {
      this.worker.postMessage(["polyUpdate", newPolys, removedIndices]);
    } else {
      this.logger.log("navmesh:debug", "Worker not loaded yet.");
    }
  }.bind(this));
};

/**
 * Handler for log messages sent by worker.
 * @private
 * @param {Array.<(string|object)>} message - Array of arguments to
 *   pass to `Logger.log`. The first element should be the group to
 *   associate the message with.
 */
NavMesh.prototype._workerLogger = function(message) {
  this.logger.log.apply(null, message);
};

/**
 * Returns the function to be used for the `onmessage` callback for
 * the web worker.
 * @private
 * @return {Function} - The `onmessage` handler for the web worker.
 */
NavMesh.prototype._getWorkerInterface = function() {
  return function(message) {
    var data = message.data;
    var name = data[0];

    // Output debug message for all messages received except "log"
    // messages.
    if (name !== "log")
      this.logger.log("navmesh:debug", "Message received from worker:", data);

    if (name == "log") {
      this._workerLogger(data.slice(1));
    } else if (name == "result") {
      var path = data[1];
      this.lastCallback(path);
    } else if (name == "initialized") {
      this.workerInitialized = true;
      // Send parsed map polygons to worker when available.
      this.onInit(function() {
        this.worker.postMessage(["polys", this.polys]);
      }.bind(this));
    }
  }.bind(this);
};

/**
 * Make utilities in polypartition available without requiring
 * that it be included in external scripts.
 */
NavMesh.poly = geo;

/**
 * Hold methods used for generating the navigation mesh.
 * @private
 */
NavMesh._geometry = {};

/**
 * Initialized Clipper for operations.
 * @private
 * @type {ClipperLib.Clipper}
 */
NavMesh._geometry.cpr = new ClipperLib.Clipper();

/**
 * Initialized ClipperOffset for operations.
 * @private
 * @type {ClipperLib.ClipperOffset}
 */
NavMesh._geometry.co = new ClipperLib.ClipperOffset();

// Defaults.
NavMesh._geometry.co.MiterLimit = 2;
NavMesh._geometry.scale = 100;

/**
 * Get a polygonal approximation of a circle of a given radius
 * centered at the provided point. Vertices of polygon are in CW
 * order.
 * @private
 * @param {number} radius - The radius for the polygon.
 * @param {Point} [point] - The point at which to center the polygon.
 *   If a point is not provided then the polygon is centered at the
 *   origin.
 * @return {Poly} - The approximated circle.
 */
NavMesh._geometry.getApproximateCircle = function(radius, point) {
  var x, y;
  if (point) {
    x = point.x;
    y = point.y;
  } else {
    x = 0;
    y = 0;
  }
  var offset = radius * Math.tan(Math.PI / 8);
  offset = Math.round10(offset, -1);
  var poly = new Poly([
    new Point(x - radius, y - offset),
    new Point(x - radius, y + offset),
    new Point(x - offset, y + radius),
    new Point(x + offset, y + radius),
    new Point(x + radius, y + offset),
    new Point(x + radius, y - offset),
    new Point(x + offset, y - radius),
    new Point(x - offset, y - radius)
  ]);
  return poly;
};

/**
 * Returns a square with side length given by double the provided
 * radius, centered at the origin. Vertices of polygon are in CW
 * order.
 * @private
 * @param {number} radius - The length of half of one side.
 * @return {Poly} - The constructed square.
 */
NavMesh._geometry.getSquare = function(radius) {
  var poly = new Poly([
    new Point(-radius, radius),
    new Point(radius, radius),
    new Point(radius, -radius),
    new Point(-radius, -radius)
  ]);
  return poly;
};

/**
 * Get the upper or lower diagonal of a square of the given
 * radius. 
 * @private
 * @param {number} radius - The length of half of one side of the
 *   square to get the diagonal of.
 * @param {string} corner - One of ne, se, nw, sw indicating which
 *   corner should be filled.
 * @return {Poly} - The diagonal shape.
 */
NavMesh._geometry.getDiagonal = function(radius, corner) {
  var types = {
    "ne": [[radius, -radius], [radius, radius], [-radius, -radius]],
    "se": [[radius, radius], [-radius, radius], [radius, -radius]],
    "sw": [[-radius, radius], [-radius, -radius], [radius, radius]],
    "nw": [[-radius, -radius], [radius, -radius], [-radius, radius]]
  };
  var points = types[corner].map(function(mul) {
    return new Point(mul[0], mul[1]);
  });
  return new Poly(points);
};

/**
 * Given two sets of polygons, return indices of the ones in the blue
 * set that are intersected by ones in red.
 * @private
 * @param {Array.<Poly>} red
 * @param {Array.<Poly>} blue
 * @return {Array.<integer>} - The indices of the intersected blue
 *   polys.
 */
NavMesh._geometry.getIntersections = function(red, blue) {
  var indices = [];
  // Naive solution.
  blue.forEach(function(poly, i) {
    var intersects = red.some(function(polyb) {
      return poly.intersects(polyb);
    });
    if (intersects) {
      indices.push(i);
    }
  });
  return indices;
};

/**
 * An Area is an object that holds a polygon representing a space
 * along with its holes. An Area can represent, for example, a
 * traversable region, if we consider the non-hole area of the
 * polygon as being traversable, or the opposite, if we consider
 * the non-hole area as being solid, blocking movement.
 * @typedef Area
 * @type {object}
 * @property {Poly} polygon - The polygon defining the outside of the
 *   area.
 * @property {Array.<Poly>} holes - The holes in the polygon for this
 *   area.
 */
/**
 * Given a PolyTree, return an array of areas assuming even-odd fill
 * ordering.
 * @private
 * @param {ClipperLib.Paths} paths - The paths output from some
 *   operation. Paths should be non-overlapping, i.e. the edges of
 *   represented polygons should not be overlapping, but polygons
 *   may be fully contained in one another. Paths should already
 *   be scaled up.
 * @param {integer} [scale=100] - The scale to use when bringing the
 *   Clipper paths down to size.
 * @return {Array.<Area>} - The areas represented by the polytree.
 */
NavMesh._geometry.getAreas = function(paths, scale) {
  if (typeof scale == 'undefined') scale = NavMesh._geometry.scale;
  // We are really only concerned with getting the paths into a
  // polytree structure.
  var cpr = NavMesh._geometry.cpr;
  cpr.Clear();
  cpr.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
  var unioned_shapes_polytree = new ClipperLib.PolyTree();
  cpr.Execute(
    ClipperLib.ClipType.ctUnion,
    unioned_shapes_polytree,
    ClipperLib.PolyFillType.pftEvenOdd,
    null);

  var areas = [];

  var outer_polygons = unioned_shapes_polytree.Childs();

  // Organize shapes into their outer polygons and holes, assuming
  // that the first layer of polygons in the polytree represent the
  // outside edge of the desired areas.
  for (var i = 0; i < outer_polygons.length; i++) {
    var outer_polygon = outer_polygons[i];
    var contour = outer_polygon.Contour();
    ClipperLib.JS.ScaleDownPath(contour, scale);
    var area = {
      polygon: contour,
      holes: []
    };

    outer_polygon.Childs().forEach(function(child) {
      var contour = child.Contour();
      ClipperLib.JS.ScaleDownPath(child.Contour(), scale);
      // Add as a hole.
      area.holes.push(contour);

      // Add children as additional outer polygons to be expanded.
      child.Childs().forEach(function(child_outer) {
        outer_polygons.push(child_outer);
      });
    });
    areas.push(area);
  }
  
  // Convert Clipper Paths to Polys.
  areas.forEach(function(area) {
    area.polygon = NavMesh._geometry.convertClipperToPoly(area.polygon);
    area.holes = area.holes.map(NavMesh._geometry.convertClipperToPoly);
  });

  return areas;
};

/**
 * Offset a polygon inwards (as opposed to deflating it). The polygon
 * vertices should be in CCW order and the polygon should already be
 * scaled.
 * @private
 * @param {CLShape} shape - The shape to inflate inwards.
 * @param {number} offset - The amount to offset the shape.
 * @param {integer} [scale=100] - The scale for the operation.
 * @return {ClipperLib.Paths} - The resulting shape from offsetting.
 *   If the process of offsetting resulted in the interior shape
 *   closing completely, then an empty array will be returned. The
 *   returned shape will still be scaled up, for use in other
 *   operations.
 */
NavMesh._geometry.offsetInterior = function(shape, offset, scale) {
  if (typeof scale == 'undefined') scale = NavMesh._geometry.scale;

  var cpr = NavMesh._geometry.cpr;
  var co = NavMesh._geometry.co;

  // First, create a shape with the outline as the interior.
  var boundingShape = NavMesh._geometry.getBoundingShapeForPaths([shape]);

  cpr.Clear();
  cpr.AddPath(boundingShape, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPath(shape, ClipperLib.PolyType.ptClip, true);

  var solution_paths = new ClipperLib.Paths();
  cpr.Execute(ClipperLib.ClipType.ctDifference,
    solution_paths,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero);

  // Once we have the shape as created above, inflate it. This gives
  // better results than treating the outline as the exterior of a
  // shape and deflating it.
  var offsetted_paths = new ClipperLib.Paths();

  co.Clear();
  co.AddPaths(solution_paths, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
  co.Execute(offsetted_paths, offset * scale);

  // If this is not true then the offsetting process shrank the
  // outline into non-existence and only the bounding shape is
  // left.
  // >= 2 in case the offsetting process isolates portions of the
  // outline (see: GamePad).
  if (offsetted_paths.length >= 2) {
    // Get only the paths defining the outlines we were interested
    // in, discarding the exterior bounding shape.
    offsetted_paths.shift();
  } else {
    offsetted_paths = new ClipperLib.Paths();
  }
  return offsetted_paths;
};

/**
 * Offset a polygon. The polygon vertices should be in CW order and
 * the polygon should already be scaled up.
 * @private
 * @param {CLShape} shape - The shape to inflate outwards.
 * @param {number} offset - The amount to offset the shape.
 * @param {integer} [scale=100] - The scale for the operation.
 * @return {ClipperLib.Paths} - The resulting shape from offsetting.
 *   If the process of offsetting resulted in the interior shape
 *   closing completely, then an empty array will be returned. The
 *   returned shape will still be scaled up, for use in other
 *   operations.
 */
NavMesh._geometry.offsetExterior = function(shape, offset, scale) {
  // TODO
};

/**
 * Generate a convex partition of the provided polygon, excluding
 * areas given by the holes.
 * @private
 * @param {Poly} outline - The polygon outline of the area to
 *   partition.
 * @param {Array.<Poly>} holes - Holes in the polygon.
 * @return {Array.<Poly>} - Polygons representing the partitioned
 *   space.
 */
NavMesh._geometry.convexPartition = function(outline, holes) {
  // Ensure proper vertex order for holes and outline.
  outline.setOrientation("CCW");
  holes.forEach(function(e) {
    e.setOrientation("CW");
    e.hole = true;
  });
  
  return partition(outline, holes);
};

/**
 * Partition the provided area.
 * @private
 * @param {Area} area - The Area to partition.
 * @return {Array.<Poly>} - Polygons representing the partitioned
 *   space.
 */
NavMesh._geometry.partitionArea = function(area) {
  return NavMesh._geometry.convexPartition(area.polygon, area.holes);
};

/**
 * Partition the provided areas.
 * @private
 * @param {Array.<Area>} areas - The areas to partition.
 * @return {Array.<Poly>} - Polygons representing the partitioned
 *   space.
 */
NavMesh._geometry.partitionAreas = function(areas) {
  var polys = areas.map(NavMesh._geometry.partitionArea);
  return NavMesh._util.flatten(polys);
};

/**
 * A point in ClipperLib is just an object with properties
 * X and Y corresponding to a point.
 * @typedef CLPoint
 * @type {object}
 * @property {integer} X - The x coordinate of the point.
 * @property {integer} Y - The y coordinate of the point.
 */
/**
 * A shape in ClipperLib is simply an array of CLPoints.
 * @typedef CLShape
 * @type {Array.<CLPoint>}
 */
/**
 * Takes a Poly and converts it into a ClipperLib polygon.
 * @private
 * @param {Poly} poly - The Poly to convert.
 * @return {CLShape} - The converted polygon.
 */
NavMesh._geometry.convertPolyToClipper = function(poly) {
  return poly.points.map(function(p) {
    return {X:p.x, Y:p.y};
  });
};

/**
 * Convert a ClipperLib shape into a Poly.
 * @private
 * @param {CLShape} clip - The shape to convert.
 * @return {Poly} - The converted shape.
 */
NavMesh._geometry.convertClipperToPoly = function(clip) {
  var points = clip.map(function(p) {
    return new Point(p.X, p.Y);
  });
  return new Poly(points);
};

/**
 * Generate a bounding shape for paths with a given buffer. If using
 * for an offsetting operation, the returned CLShape does NOT need to
 * be scaled up.
 * @private
 * @param {Array.<CLShape>} paths - The paths to get a bounding shape for.
 * @param {integer} [buffer=5] - How many units to pad the bounding
 *   rectangle.
 * @return {CLShape} - A bounding rectangle for the paths.
 */
NavMesh._geometry.getBoundingShapeForPaths = function(paths, buffer) {
  if (typeof buffer == "undefined") buffer = 5;
  var bounds = ClipperLib.Clipper.GetBounds(paths);
  bounds.left -= buffer;
  bounds.top -= buffer;
  bounds.right += buffer;
  bounds.bottom += buffer;
  var shape = [];
  shape.push({X: bounds.right, Y: bounds.bottom});
  shape.push({X: bounds.left, Y: bounds.bottom});
  shape.push({X: bounds.left, Y: bounds.top});
  shape.push({X: bounds.right, Y: bounds.top});
  return shape;
};

/**
 * Holds utility methods needed by the navmesh.
 * @private
 */
NavMesh._util = {};

/**
 * Removes and returns the items at the indices identified in
 * `indices`.
 * @private
 * @param {Array} ary - The array to remove items from.
 * @param {Array.<integer>} indices - The indices from which to
 *   remove the items from in ary. Indices should be unique and
 *   each should be less than the length of `ary` itself.
 * @return {Array} - The items removed from ary.
 */
NavMesh._util.splice = function(ary, indices) {
  indices = indices.sort(NavMesh._util._numberCompare).reverse();
  var removed = [];
  indices.forEach(function(i) {
    removed.push(ary.splice(i, 1)[0]);
  });
  return removed;
};

/**
 * Comparison function for numbers.
 * @private
 */
NavMesh._util._numberCompare = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
};

/**
 * Take an array of arrays and flatten it.
 * @private
 * @param  {Array.<Array.<*>>} ary - The array to flatten.
 * @return {Array.<*>} - The flattened array.
 */
NavMesh._util.flatten = function(ary) {
  return Array.prototype.concat.apply([], ary);
};

},{"./geometry":7,"./parse-map":9,"./partition":10,"./pathfinder":11,"./worker":12,"jsclipper":1,"math-round":2}],9:[function(require,module,exports){
/**
 * @ignore
 * @module MapParser
 */

var ActionValues = require('./action-values');
var geo = require('./geometry');
var Point = geo.Point;
var Poly = geo.Poly;

/**
 * Contains utilities for generating usable map representations from
 * map tiles.
 */
var MapParser = {};

/**
 * An object with x and y properties that represents a coordinate pair.
 * @private
 * @typedef MPPoint
 * @type {object}
 * @property {number} x - The x coordinate of the location.
 * @property {number} y - The y coordinate of the location.
 */

/**
 * A Shape is an array of points, where points are objects with x and y properties which represent coordinates on the map.
 * @private
 * @typedef MPShape
 * @type {Array.<MPPoint>}
 */

/**
 * An object with r and c properties that represents a row/column
 * location in a 2d array.
 * @private
 * @typedef ArrayLoc
 * @type {object}
 * @property {integer} r - The row number of the array location.
 * @property {integer} c - The column number of the array location.
 */

/**
 * The 2d tile grid from `tagpro.map`, or a similar 2d grid resulting
 * from an operation on the original.
 * @typedef MapTiles
 * @type {Array.<Array.<number>>}
 */

/**
 * A Cell is just an array that holds the values of the four adjacent
 * cells in a 2d array, recorded in CCW order starting from the upper-
 * left quadrant. For example, given a 2d array:
 * [[1, 0, 1],
 *  [1, 0, 0],
 *  [1, 1, 1]]
 * we would generate the representation using the cells:
 * [1, 0,  [0, 1,  [1, 0,  [0, 0  
 *  1, 0]   0, 0]   1, 1]   1, 1].
 * These correspond to the parts of a tile that would be covered if
 * placed at the intersection of 4 tiles. The value 0 represents a
 * blank location, 1 indicates that the quadrant is covered.
 * To represent how such tiles would be covered in the case of diagonal
 * tiles, we use 2 to indicate that the lower diagonal of a quadrant is
 * filled, and 3 to indicate that the upper diagonal of a quadrant is
 * filled. The tiles available force the diagonals of each quadrant to
 * point to the center, so this is sufficient for describing all
 * possible overlappings.
 * @private
 * @typedef Cell
 * @type {Array.<number>}
 */

/**
 * Callback that receives each of the elements in the 2d map function.
 * @private
 * @callback mapCallback
 * @param {*} - The element from the 2d array.
 * @return {*} - The transformed element.
 */

/**
 * Applies `fn` to every individual element of the 2d array `arr`.
 * @private
 * @param {Array.<Array.<*>>} arr - The 2d array to use.
 * @param {mapCallback} fn - The function to apply to each element.
 * @return {Array.<Array.<*>>} - The 2d array after the function
 *   has been applied to each element.
 */
function map2d(arr, fn) {
  return arr.map(function(row) {
    return row.map(fn);
  });
}

/**
 * Returns 1 if a tile value is one that we want to consider as
 * a wall (we consider empty space to be a wall), or the tile value
 * itself for diagonal walls. 0 is returned otherwise.
 * @private
 * @param {number} elt - The tile value at a row/column location
 * @return {number} - The number to insert in place of the tile value.
 */
function isBadCell(elt) {
  var bad_cells = [1, 1.1, 1.2, 1.3, 1.4];
  if(bad_cells.indexOf(elt) !== -1) {
    // Ensure empty spaces get mapped to full tiles so outside of
    // map isn't traced.
    if (elt == 0) {
      return 1;
    } else {
      return elt;
    }
    return elt;
  } else {
    return 0;
  }
}

/**
 * Converts the provided array into its equivalent representation
 * using cells.
 * @private
 * @param {MapTiles} arr - 
 * @param {Array.<Array.<Cell>>} - The converted array.
 */
function generateContourGrid(arr) {
  // Generate grid for holding values.
  var contour_grid = new Array(arr.length - 1);
  for (var n = 0; n < contour_grid.length; n++) {
    contour_grid[n] = new Array(arr[0].length - 1);
  }
  var corners = [1.1, 1.2, 1.3, 1.4];
  // Specifies the resulting values for the above corner values. The index
  // of the objects in this array corresponds to the proper values for the
  // quadrant of the same index.
  var corner_values = [
    {1.1: 3, 1.2: 0, 1.3: 2, 1.4: 1},
    {1.1: 0, 1.2: 3, 1.3: 1, 1.4: 2},
    {1.1: 3, 1.2: 1, 1.3: 2, 1.4: 0},
    {1.1: 1, 1.2: 3, 1.3: 0, 1.4: 2}
  ];
  for (var i = 0; i < (arr.length - 1); i++) {
    for (var j = 0; j < (arr[0].length - 1); j++) {
      var cell = [arr[i][j], arr[i][j+1], arr[i+1][j+1], arr[i+1][j]];
      // Convert corner tiles to appropriate representation.
      cell.forEach(function(val, i, cell) {
        if (corners.indexOf(val) !== -1) {
          cell[i] = corner_values[i][val];
        }
      });

      contour_grid[i][j] = cell;
    }
  }
  return contour_grid;
}

/**
 * Callback function for testing equality of items.
 * @private
 * @callback comparisonCallback
 * @param {*} - The first item.
 * @param {*} - The second item.
 * @return {boolean} - Whether or not the items are equal.
 */

/**
 * Returns the location of obj in arr with equality determined by cmp.
 * @private
 * @param {Array.<*>} arr - The array to be searched.
 * @param {*} obj - The item to find a match for.
 * @param {comparisonCallback} cmp - The callback that defines
 *   whether `obj` matches.
 * @return {integer} - The index of the first element to match `obj`,
 *   or -1 if no such element was located.
 */
function find(arr, obj, cmp) {
  if (typeof cmp !== 'undefined') {
    for (var i = 0; i < arr.length; i++) {
      if (cmp(arr[i], obj)) {
        return i;
      }
    }
    return -1;
  }
}

/**
 * Compare two objects defining row/col locations in an array
 * and return true if they represent the same row/col location.
 * @private
 * @param {ArrayLoc} elt1
 * @param {ArrayLoc} elt2
 * @return {boolean} - Whether or not these two array locations
 *   represent the same row/column.
 */
function eltCompare(elt1, elt2) {
  return (elt1.c == elt2.c && elt1.r == elt2.r);
}

/**
 * Takes in the vertex/action information and returns an array of arrays,
 * where each array corresponds to a shape and each element of the array is
 * a vertex which is connected to it's previous and next neighbor (circular).
 * @private
 * @param {} actionInfo
 * @return {Array.<Array<ArrayLoc>>} - Array of vertex locations in 
 */
function generateShapes(actionInfo) {
  // Total number of cells.
  var total = actionInfo.length * actionInfo[0].length;
  var directions = {
    "n": [-1, 0],
    "e": [0, 1],
    "s": [1, 0],
    "w": [0, -1],
    "ne": [-1, 1],
    "se": [1, 1],
    "sw": [1, -1],
    "nw": [-1, -1]
  };
  // Takes the current location and direction at this point and
  // returns the next location to check. Returns null if this cell is
  // not part of a shape.
  function nextNeighbor(elt, dir) {
    var drow = 0, dcol = 0;
    if (dir == "none") {
      return null;
    } else {
      var offset = directions[dir];
      return {r: elt.r + offset[0], c: elt.c + offset[1]};
    }
  }

  // Get the next cell, from left to right, top to bottom. Returns null
  // if last element in array reached.
  function nextCell(elt) {
    if (elt.c + 1 < actionInfo[elt.r].length) {
      return {r: elt.r, c: elt.c + 1};
    } else if (elt.r + 1 < actionInfo.length) {
      return {r: elt.r + 1, c: 0};
    }
    return null;
  }

  // Get identifier for given node and direction
  function getIdentifier(node, dir) {
    return "r" + node.r + "c" + node.c + "d" + dir;
  }
  
  var discovered = [];
  var node = {r: 0, c: 0};
  var shapes = [];
  var current_shape = [];
  var shape_node_start = null;
  var last_action = null;
  // Object to track location + actions that have been taken.
  var taken_actions = {};
  var iterations = 0;

  // Iterate until all nodes have been visited.
  while (discovered.length !== total) {
    if (!node) {
      // Reached end.
      break;
    }
    if (iterations > total * 4) {
      // Sanity check on number of iterations. Maximum number of
      // times a single tile would be visited is 4 for a fan-like
      // pattern of triangle wall tiles.
      break;
    } else {
      iterations++;
    }
    // It's okay to be in a discovered node if shapes are adjacent,
    // we just want to keep track of the ones we've seen.
    if (find(discovered, node, eltCompare) == -1) {
      discovered.push(node);
    }

    var action = actionInfo[node.r][node.c];
    var dir;
    // If action has multiple possibilities.
    if (action instanceof Array) {
      // Part of a shape, find the info with that previous action as
      // in_dir.
      if (last_action !== "none") {
        var action_found = false;
        for (var i = 0; i < action.length; i++) {
          var this_action = action[i];
          if (this_action["loc"]["in_dir"] == last_action) {
            action = this_action;
            dir = this_action["loc"]["out_dir"];
            action_found = true;
            break;
          }
        }

        if (!action_found) {
          throw "Error!";
        }
      } else {
        // Find the first action that has not been taken previously.
        var action_found = false;
        for (var i = 0; i < action.length; i++) {
          var this_action = action[i];
          if (!taken_actions[getIdentifier(node, this_action["loc"]["out_dir"])]) {
            action = this_action
            dir = this_action["loc"]["out_dir"];
            action_found = true;
            break;
          }
        }
        if (!action_found) {
          throw "Error!";
        }
      }
    } else { // Action only has single possibility.
      dir = action.loc;
    }

    // Set node/action as having been visited.
    taken_actions[getIdentifier(node, dir)] = true;

    last_action = dir;
    var next = nextNeighbor(node, dir);
    if (next) { // Part of a shape.
      // Save location for restarting after this shape has been defined.
      var first = false;
      if (current_shape.length == 0) {
        first = true;
        shape_node_start = node;
        shape_node_start_action = last_action;
      }
      
      // Current node and direction is same as at start of shape,
      // shape has been explored.
      if (!first && eltCompare(node, shape_node_start) && last_action == shape_node_start_action) {
        shapes.push(current_shape);
        current_shape = [];
        // Get the next undiscovered node.
        node = nextCell(shape_node_start);
        while (node && (find(discovered, node, eltCompare) !== -1)) {
          node = nextCell(node);
        }
        shape_node_start = null;
      } else {
        if (action.v || first) {
          current_shape.push(node);
        }
        node = next;
      }
    } else { // Not part of a shape.
      node = nextCell(node);
      // Get the next undiscovered node.
      while (node && (find(discovered, node, eltCompare) !== -1)) {
        node = nextCell(node);
      }
    }
  } // end while

  if (discovered.length == total) {
    return shapes;
  } else {
    return null;
  }
}

// Return whether there should be a vertex at the given location and
// which location to go next, if any.
// Value returned is an object with properties 'v' and 'loc'. 'v' is a boolean
// indicating whether there is a vertex, and 'loc' gives the next location to move, if any.
// loc is a string, of none, down, left, right, up, down corresponding to
// tracing out a shape clockwise (or the interior of a shape CCW), or a function
// that takes a string corresponding to the direction taken to get to the current
// cell.
// There will never be a vertex without a next direction.
function getAction(cell) {
  var str = cell[0] + "-" + cell[1] + "-" + cell[2] + "-" + cell[3];
  return ActionValues[str];
}

/**
 * Convert an array location to a point representing the top-left
 * corner of the tile in global coordinates.
 * @private
 * @param {ArrayLoc} location - The array location to get the
 *   coordinates for.
 * @return {MPPoint} - The coordinates of the tile.
 */
function getCoordinates(location) {
  var tile_width = 40;
  var x = location.r * tile_width;
  var y = location.c * tile_width;
  return {x: x, y: y};
}

/**
 * Takes in an array of shapes and converts from contour grid layout
 * to actual coordinates.
 * @private
 * @param {Array.<Array.<ArrayLoc>>} shapes - output from generateShapes
 * @return {Array.<Array.<{{x: number, y: number}}>>}
 */
function convertShapesToCoords(shapes) {
  var tile_width = 40;

  var new_shapes = map2d(shapes, function(loc) {
    // It would be loc.r + 1 and loc.c + 1 but that has been removed
    // to account for the one-tile width of padding added in doParse.
    var row = loc.r * tile_width;
    var col = loc.c * tile_width;
    return {x: row, y: col}
  });
  return new_shapes;
}

// Given an x and y value, return a polygon (octagon) that approximates
// a spike at the tile given by that x, y location. Points in CW order.
function getSpikeShape(coord) {
  var x = coord.x + 20, y = coord.y + 20;
  var spike_radius = 14;
  // almost = spike_radius * tan(pi/8) for the vertices of a regular octagon.
  var point_offset = 5.8;
  return [
    {x: x - spike_radius, y: y - point_offset},
    {x: x - spike_radius, y: y + point_offset},
    {x: x - point_offset, y: y + spike_radius},
    {x: x + point_offset, y: y + spike_radius},
    {x: x + spike_radius, y: y + point_offset},
    {x: x + spike_radius, y: y - point_offset},
    {x: x + point_offset, y: y - spike_radius},
    {x: x - point_offset, y: y - spike_radius}
  ];
}

/**
 * Returns an array of the array locations of the spikes contained
 * in the map tiles, replacing those array locations in the original
 * map tiles with 2, which corresponds to a floor tile.
 * @private
 * @param {MapTiles} tiles - The map tiles.
 * @return {Array.<ArrayLoc>} - The array of locations that held
 *   spike tiles.
 */
MapParser.extractSpikes = function(tiles) {
  var spike_locations = [];
  tiles.forEach(function(row, row_n) {
    row.forEach(function(cell_value, index, row) {
      if (cell_value == 7) {
        spike_locations.push({r: row_n, c: index});
        row[index] = 2;
      }
    });
  });
  return spike_locations;
};

var Obstacle = function(type, ids) {
  this.type = type;
  this.vals = [];
  this.info = {};
  ids.forEach(function(id) {
    if (typeof id == "number") {
      this.vals.push(id);
      this.info[id] = this.type;
    } else {
      this.vals.push(id.num);
      this.info[id] = id.name;
    }
  }, this);
};

Obstacle.prototype.describes = function(val) {
  if(this.vals.indexOf(Math.floor(+val)) !== -1) {
    return (this.info[+val] || this.info[Math.floor(+val)]);
  } else {
    return false;
  }
};

var Obstacles = [
  new Obstacle("bomb", [10, 10.1]),
  new Obstacle("boost",
    [5, 5.1, {num: 14, name: "redboost"}, {num: 15, name: "blueboost"}]),
  new Obstacle("gate",
    [9, {num: 9.1, name: "greengate"}, {num: 9.2, name: "redgate"},
    {num: 9.3, name: "bluegate"}])
];

MapParser.extractDynamicObstacles = function(tiles) {
  var dynamic_obstacles = [];
  tiles.forEach(function(row, x) {
    row.forEach(function(tile, y) {
      Obstacles.some(function(obstacle_type) {
        var dynamic_obstacle = obstacle_type.describes(tile)
        if (dynamic_obstacle) {
          dynamic_obstacles.push({
            type: dynamic_obstacle,
            x: x,
            y: y,
            v: tile
          });
          tiles[x][y] = 0;
          return true;
        } else {
          return false;
        }
      });
    });
  });
  return dynamic_obstacles;
};

/**
 * The returned value from the map parsing function.
 * @typedef ParsedMap
 * @type {object}
 * @property {Array.<MPShape>} walls - The parsed walls.
 * @property {Array.<MPShape>} obstacles - The parsed obstacles.
 */

/**
 * Converts the 2d array defining a TagPro map into shapes.
 * @param {MapTiles} tiles - The tiles as retrieved from `tagpro.map`.
 * @return {?ParsedMap} - The result of converting the map into
 *   polygons, or null if there was an issue parsing the map.
 */
MapParser.parse = function(tiles) {
  // Make copy of tiles to preserve original array
  tiles = JSON.parse(JSON.stringify(tiles));

  // Returns a list of the spike locations and removes them from
  // the tiles.
  var spike_locations = MapParser.extractSpikes(tiles);

  var dynamic_obstacles = MapParser.extractDynamicObstacles(tiles);

  // Pad tiles with a ring of wall tiles, to ensure the map is
  // closed.
  var empty_row = [];
  for (var i = 0; i < tiles[0].length + 2; i++) {
    empty_row.push(1);
  }
  tiles.forEach(function(row) {
    row.unshift(1);
    row.push(1);
  });
  tiles.unshift(empty_row);
  tiles.push(empty_row.slice());

  // Actually doing the conversion.
  // Get rid of tile values except those for the walls.
  var threshold_tiles = map2d(tiles, isBadCell);

  // Generate contour grid, essentially a grid whose cells are at the
  // intersection of every set of 4 cells in the original map.
  var contour_grid_2 = generateContourGrid(threshold_tiles);

  // Get tile vertex and actions for each cell in contour grid.
  var tile_actions = map2d(contour_grid_2, getAction);

  var generated_shapes = generateShapes(tile_actions);
  if (!generated_shapes) {
    return null;
  }

  var actual_shapes = generated_shapes.filter(function(elt) {
    return elt.length > 0;
  });

  var converted_shapes = convertShapesToCoords(actual_shapes);

  // Get spike-approximating shapes and add to list.
  var static_obstacles = spike_locations.map(function(spike) {
    return getSpikeShape(getCoordinates(spike));
  });

  return {
    walls: this.convertShapesToPolys(converted_shapes),
    static_obstacles: this.convertShapesToPolys(static_obstacles),
    dynamic_obstacles: dynamic_obstacles
  };
};

/**
 * Convert shapes into polys.
 * @private
 * @param {Array.<Shape>} shapes - The shapes to be converted.
 * @return {Array.<Poly>} - The converted shapes.
 */
MapParser.convertShapesToPolys = function(shapes) {
  var polys = shapes.map(function(shape) {
    return MapParser.convertShapeToPoly(shape);
  });
  return polys;
};


/**
 * Convert a shape into a Poly.
 * @param {MPShape} shape - The shape to convert.
 * @return {Poly} - The converted shape.
 */
MapParser.convertShapeToPoly = function(shape) {
  var poly = new Poly();
  poly.init(shape.length);
  for (var i = 0; i < shape.length; i++) {
    var point = new Point(shape[i].x, shape[i].y);
    poly.setPoint(i, point);
  }
  return poly;
};

module.exports = MapParser;

},{"./action-values":6,"./geometry":7}],10:[function(require,module,exports){
/**
 * Holds classes for points, polygons, and utilities for operating on
 * them.
 * Adapted/copied from https://code.google.com/p/polypartition/
 * @module PolyPartition
 */
var poly2tri = require('poly2tri');
var geo = require('./geometry');

var Point = geo.Point;
var Edge = geo.Edge;
var Poly = geo.Poly;

/**
 * The Point class used by poly2tri.
 * @private
 * @typedef P2TPoint
 */

/**
 * A polygon for use with poly2tri.
 * @private
 * @typedef P2TPoly
 * @type {Array.<P2TPoint>}
 */

/**
 * Convert a polygon into format required by poly2tri.
 * @private
 * @param {Poly} poly - The polygon to convert.
 * @return {P2TPoly} - The converted polygon.
 */
function convertPolyToP2TPoly(poly) {
  return poly.points.map(function(p) {
    return new poly2tri.Point(p.x, p.y);
  });
}

/**
 * Convert a polygon/triangle returned from poly2tri back into a
 * polygon.
 * @private
 * @param {P2TPoly} p2tpoly - The polygon to convert.
 * @return {Poly} - The converted polygon.
 */
function convertP2TPolyToPoly(p2tpoly) {
  var points = p2tpoly.getPoints().map(function(p) {
    return new Point(p.x, p.y);
  });

  return new Poly(points);
}

function isConvex(p1, p2, p3) {
  var tmp = (p3.y - p1.y) * (p2.x - p1.x) - (p3.x - p1.x) * (p2.y - p1.y);
  return (tmp > 0);
}

/**
 * Takes an array of polygons that overlap themselves and others
 * at discrete corner points and separate those overlapping corners
 * slightly so the polygons are suitable for triangulation by
 * poly2tri.js. This changes the Poly objects in the array.
 * @private
 * @param {Array.<Poly>} polys - The polygons to separate.
 * @param {number} [offset=1] - The number of units the vertices
 *   should be moved away from each other.
 */
function separatePolys(polys, offset) {
  offset = offset || 1;
  var discovered = {};
  var dupes = {};
  // Offset to use in calculation.
  // Find duplicates.
  for (var s1 = 0; s1 < polys.length; s1++) {
    var poly = polys[s1];
    for (var i = 0; i < poly.numpoints; i++) {
      var point = poly.points[i].toString();
      if (!discovered.hasOwnProperty(point)) {
        discovered[point] = true;
      } else {
        dupes[point] = true;
      }
    }
  }

  // Get duplicate points.
  var dupe_points = [];
  var dupe;
  for (var s1 = 0; s1 < polys.length; s1++) {
    var poly = polys[s1];
    for (var i = 0; i < poly.numpoints; i++) {
      var point = poly.points[i];
      if (dupes.hasOwnProperty(point.toString())) {
        dupe = [point, i, poly];
        dupe_points.push(dupe);
      }
    }
  }

  // Sort elements in descending order based on their indices to
  // prevent future indices from becoming invalid when changes are made.
  dupe_points.sort(function(a, b) {
    return b[1] - a[1]
  });
  // Edit duplicates.
  var prev, next, point, index, p1, p2;
  dupe_points.forEach(function(e, i, ary) {
    point = e[0], index = e[1], poly = e[2];
    prev = poly.points[poly.getPrevI(index)];
    next = poly.points[poly.getNextI(index)];
    p1 = point.add(prev.sub(point).normalize().mul(offset));
    p2 = point.add(next.sub(point).normalize().mul(offset));
    // Insert new points.
    poly.points.splice(index, 1, p1, p2);
    poly.update();
  });
}

/**
 * Partition a polygon with (optional) holes into a set of convex
 * polygons. The vertices of the polygon must be given in CW order,
 * and the vertices of the holes must be in CCW order. Uses poly2tri
 * for the initial triangulation and Hertel-Mehlhorn to combine them
 * into convex polygons.
 * @param {Poly} poly - The polygon to use as the outline.
 * @param {Array.<Poly>} [holes] - An array of holes present in the
 *   polygon.
 * @param {number} [minArea=5] - An optional parameter that filters
 *   out polygons in the partition smaller than this value.
 * @return {Array.<Poly>} - The set of polygons defining the
 *   partition of the provided polygon.
 */
module.exports = function(poly, holes, minArea) {
  if (typeof holes == 'undefined') holes = false;
  if (typeof minArea == 'undefined') minArea = 5;

  var i11, i12, i13, i21, i22, i23;
  var parts = new Array();

  // Check if poly is already convex only if there are no holes.
  if (!holes || holes.length == 0) {
    var reflex = false;
    // Check if already convex.
    for (var i = 0; i < poly.numpoints; i++) {
      var prev = poly.getPrevI(i);
      var next = poly.getNextI(i);
      if (!isConvex(poly.getPoint(prev), poly.getPoint(i), poly.getPoint(next))) {
        reflex = true;
        break;
      }
    }
    if (!reflex) {
      parts.push(poly);
      return parts;
    }
  }

  // Separate polys to remove collinear points.
  separatePolys(holes.concat(poly));

  // Convert polygon into format required by poly2tri.
  var contour = convertPolyToP2TPoly(poly);

  if (holes) {
    // Convert holes into format required by poly2tri.
    holes = holes.map(convertPolyToP2TPoly);
  }

  var swctx = new poly2tri.SweepContext(contour);
  if (holes) {
    swctx.addHoles(holes);
  }
  var triangles = swctx.triangulate().getTriangles();
  
  // Convert poly2tri triangles back into polygons and filter out the
  // ones too small to be relevant.
  triangles = triangles.map(convertP2TPolyToPoly).filter(function(poly) {
    return poly.getArea() >= minArea;
  });

  for (var s1 = 0; s1 < triangles.length; s1++) {
    var poly1 = triangles[s1];
    var s2_index = null;
    for (i11 = 0; i11 < poly1.numpoints; i11++) {
      var d1 = poly1.getPoint(i11);
      i12 = poly1.getNextI(i11);
      var d2 = poly1.getPoint(i12);

      var isdiagonal = false;
      for (var s2 = s1; s2 < triangles.length; s2++) {
        if (s1 == s2) continue;
        var poly2 = triangles[s2];
        for (i21 = 0; i21 < poly2.numpoints; i21++) {
          if (d2.neq(poly2.getPoint(i21))) continue;
          i22 = poly2.getNextI(i21);
          if (d1.neq(poly2.getPoint(i22))) continue;
          isdiagonal = true;
          object_2_index = s2;
          break;
        }
        if (isdiagonal) break;
      }

      if (!isdiagonal) continue;
      var p1, p2, p3;
      p2 = poly1.getPoint(i11);
      i13 = poly1.getPrevI(i11);
      p1 = poly1.getPoint(i13);
      i23 = poly2.getNextI(i22);
      p3 = poly2.getPoint(i23);

      if (!isConvex(p1, p2, p3)) continue;

      p2 = poly1.getPoint(i12);
      i13 = poly1.getNextI(i12);
      p3 = poly1.getPoint(i13);
      i23 = poly2.getPrevI(i21);
      p1 = poly2.getPoint(i23);

      if (!isConvex(p1, p2, p3)) continue;

      var newpoly = new Poly();
      newpoly.init(poly1.numpoints + poly2.numpoints - 2);
      var k = 0;
      for (var j = i12; j != i11; j = poly1.getNextI(j)) {
        newpoly.setPoint(k, poly1.getPoint(j));
        k++;
      }
      for (var j = i22; j != i21; j = poly2.getNextI(j)) {
        newpoly.setPoint(k, poly2.getPoint(j));
        k++;
      }

      if (s1 > object_2_index) {
        triangles[s1] = newpoly;
        poly1 = triangles[s1];
        triangles.splice(object_2_index, 1);
      } else {
        triangles.splice(object_2_index, 1);
        triangles[s1] = newpoly;
        poly1 = triangles[s1];
      }
      i11 = -1;
    }
  }
  return triangles;
};

},{"./geometry":7,"poly2tri":3}],11:[function(require,module,exports){
var geo = require('./geometry');
var findPolyForPoint = geo.util.findPolyForPoint;
var PriorityQueue = require('priority-queue');

/**
 * Pathfinder implements pathfinding on a navigation mesh.
 * @constructor
 * @param {Array.<Poly>} polys - The polygons defining the navigation mesh.
 * @param {boolean} [init=true] - Whether or not to initialize the pathfinder.
 */
var Pathfinder = function(polys, init) {
  if (typeof init == "undefined") init = true;
  this.polys = polys;
  if (init) {
    this.init();
  }
};
module.exports = Pathfinder;

Pathfinder.prototype.init = function() {
  this.grid = this.generateAdjacencyGrid(this.polys);
};

/**
 * Computes path from source to target, using sides and centers of the edges
 * between adjacent polygons. source and target are Points and polys should
 * be the final partitioned map.
 * @param {Point} source - The start location for the search.
 * @param {Point} target - The target location for the search.
 * @return {?Array.<Point>} - A series of points representing the path from
 *   the source to the target. If a path is not found, `null` is returned.
 */
Pathfinder.prototype.aStar = function(source, target) {
  // Compares the value of two nodes.
  function nodeValue(node1, node2) {
    return (node1.dist + heuristic(node1.point)) - (node2.dist + heuristic(node2.point));
  }

  // Distance between polygons.
  function euclideanDistance(p1, p2) {
    return p1.dist(p2);
  }

  // Distance between polygons. todo: update
  function manhattanDistance(elt1, elt2) {
    return (elt1.r - elt2.r) + (elt1.c - elt2.c);
  }

  // Takes Point and returns value.
  function heuristic(p) {
    return euclideanDistance(p, target);
  }

  var sourcePoly = findPolyForPoint(source, this.polys);

  // We're outside of the mesh somehow. Try a few nearby points.
  if (!sourcePoly) {
    var offsetSource = [new Point(5, 0), new Point(-5, 0), new Point(0, -5), new Point(0, 5)];
    for (var i = 0; i < offsetSource.length; i++) {
      // Make new point.
      var point = source.add(offsetSource[i]);
      sourcePoly = findPolyForPoint(point, this.polys);
      if (sourcePoly) {
        source = point;
        break;
      }
    }
    if (!sourcePoly) {
      return null;
    }
  }
  var targetPoly = findPolyForPoint(target, this.polys);

  // Handle trivial case.
  if (sourcePoly == targetPoly) {
    return [source, target];
  }

  // Warning, may have compatibility issues.
  var discoveredPolys = new WeakSet();
  var discoveredPoints = new WeakSet();
  var pq = new PriorityQueue({ comparator: nodeValue });
  var found = null;
  // Initialize with start location.
  pq.queue({dist: 0, poly: sourcePoly, point: source, parent: null});
  while (pq.length > 0) {
    var node = pq.dequeue();
    if (node.poly == targetPoly) {
      found = node;
      break;
    } else {
      discoveredPolys.add(node.poly);
      discoveredPoints.add(node.point);
    }
    // This may be undefined if there was no polygon found.
    var neighbors = this.grid.get(node.poly);
    for (var i = 0; i < neighbors.length; i++) {
      var elt = neighbors[i];
      var neighborFound = discoveredPolys.has(elt.poly);

      for (var j = 0; j < elt.edge.points.length; j++) {
        var p = elt.edge.points[j];
        if (!neighborFound || !discoveredPoints.has(p))
          pq.queue({dist: node.dist + euclideanDistance(p, node.point), poly: elt.poly, point: p, parent: node});
      }
    }
  }

  if (found) {
    var path = [];
    var current = found;
    while (current.parent) {
      path.unshift(current.point);
      current = current.parent;
    }
    path.unshift(current.point);
    // Add end point to path.
    path.push(target);
    return path;
  } else {
    return null;
  }
};

/**
 * Holds the "neighbor" relationship of Poly objects in the partition
 * using the Poly's themselves as keys, and an array of Poly's as
 * values, where the Polys in the array are neighbors of the Poly
 * that was the key.
 * @typedef AdjacencyGrid
 * @type {Object.<Poly, Array<Poly>>}
 */

/**
 * Given an array of Poly objects, find all neighboring polygons for
 * each polygon.
 * @private
 * @param {Array.<Poly>} polys - The array of polys to find neighbors
 *   among.
 * @return {AdjacencyGrid} - The "neighbor" relationships.
 */
Pathfinder.prototype.generateAdjacencyGrid = function(polys) {
  var neighbors = new WeakMap();
  polys.forEach(function(poly, polyI, polys) {
    if (neighbors.has(poly)) {
      // Maximum number of neighbors already found.
      if (neighbors.get(poly).length == poly.numpoints) {
        return;
      }
    } else {
      // Initialize array.
      neighbors.set(poly, new Array());
    }
    // Of remaining polygons, find some that are adjacent.
    poly.points.forEach(function(p1, i, points) {
      // Next point.
      var p2 = points[poly.getNextI(i)];
      for (var polyJ = polyI + 1; polyJ < polys.length; polyJ++) {
        var poly2 = polys[polyJ];
        // Iterate over points until match is found.
        poly2.points.some(function(q1, j, points2) {
          var q2 = points2[poly2.getNextI(j)];
          var match = p1.eq(q2) && p2.eq(q1);
          if (match) {
            var edge = new Edge(p1, p2);
            neighbors.get(poly).push({ poly: poly2, edge: edge });
            if (!neighbors.has(poly2)) {
              neighbors.set(poly2, new Array());
            }
            neighbors.get(poly2).push({ poly: poly, edge: edge });
          }
          return match;
        });
        if (neighbors.get(poly).length == poly.numpoints) break;
      }
    });
  });
  return neighbors;
};

},{"./geometry":7,"priority-queue":4}],12:[function(require,module,exports){


/**
 * Retrieve the web worker at the given URL. If the worker can be
 * loaded then a Promise is returned. The Promise is fulfilled when
 * the worker is loaded. If the worker cannot be loaded, and the
 * conditions are known on execution of this function, then false
 * is returned.
 * @param {string} content - The content of the web worker to use.
 * @return {Promise} - The Promise object holding the future
 *   web worker, or false if it cannot be loaded.
 */
function getWorkerPromise(content) {
  return new Promise(function(resolve, reject) {
    if (!window.Worker) {
      reject(Error("Web workers not available."));
      return;
    }

    try {
      var worker = makeWebWorker(content);
      resolve(worker);
    } catch (e) {
      reject(Error("Syntax error in worker."));
    }
  });
}

/**
 * Make a web worker from the provided string.
 * @param {string} content - The content to use as the code for the
 *   web worker.
 * @return {Worker} - The constructed web worker.
 * @throws {SyntaxError} - Thrown if the worker has a syntax error.
 */
function makeWebWorker(content) {
  var blob = new Blob(
    [content],
    {type: 'application/javascript'}
  );
  var worker = new Worker(URL.createObjectURL(blob));
  return worker;
}
var aStarWorker = require('./aStarWorker.js');
var workerContent = '(' + aStarWorker.toString() + '())';
module.exports = getWorkerPromise(workerContent);

},{"./aStarWorker.js":5}]},{},[8])(8)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvanNjbGlwcGVyLmpzIiwibGliL21hdGgtcm91bmQuanMiLCJsaWIvcG9seTJ0cmkuanMiLCJub2RlX21vZHVsZXMvanMtcHJpb3JpdHktcXVldWUvcHJpb3JpdHktcXVldWUubWluLmpzIiwic3JjL2FTdGFyV29ya2VyLmpzIiwic3JjL2FjdGlvbi12YWx1ZXMuanMiLCJzcmMvZ2VvbWV0cnkuanMiLCJzcmMvbmF2bWVzaC5qcyIsInNyYy9wYXJzZS1tYXAuanMiLCJzcmMvcGFydGl0aW9uLmpzIiwic3JjL3BhdGhmaW5kZXIuanMiLCJzcmMvd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDelBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoREE7QUFDQTtBQUNBOzs7OztBQ0ZBOzs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3g2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4bUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsgdmFyIF9fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8vIHJldiA0NTJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBBdXRob3IgICAgOiAgQW5ndXMgSm9obnNvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFZlcnNpb24gICA6ICA2LjEuM2EgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogRGF0ZSAgICAgIDogIDIyIEphbnVhcnkgMjAxNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBXZWJzaXRlICAgOiAgaHR0cDovL3d3dy5hbmd1c2ouY29tICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIENvcHlyaWdodCA6ICBBbmd1cyBKb2huc29uIDIwMTAtMjAxNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBMaWNlbnNlOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFVzZSwgbW9kaWZpY2F0aW9uICYgZGlzdHJpYnV0aW9uIGlzIHN1YmplY3QgdG8gQm9vc3QgU29mdHdhcmUgTGljZW5zZSBWZXIgMS4gKlxuICogaHR0cDovL3d3dy5ib29zdC5vcmcvTElDRU5TRV8xXzAudHh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIEF0dHJpYnV0aW9uczogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogVGhlIGNvZGUgaW4gdGhpcyBsaWJyYXJ5IGlzIGFuIGV4dGVuc2lvbiBvZiBCYWxhIFZhdHRpJ3MgY2xpcHBpbmcgYWxnb3JpdGhtOiAqXG4gKiBcIkEgZ2VuZXJpYyBzb2x1dGlvbiB0byBwb2x5Z29uIGNsaXBwaW5nXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQ29tbXVuaWNhdGlvbnMgb2YgdGhlIEFDTSwgVm9sIDM1LCBJc3N1ZSA3IChKdWx5IDE5OTIpIHBwIDU2LTYzLiAgICAgICAgICAgICAqXG4gKiBodHRwOi8vcG9ydGFsLmFjbS5vcmcvY2l0YXRpb24uY2ZtP2lkPTEyOTkwNiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQ29tcHV0ZXIgZ3JhcGhpY3MgYW5kIGdlb21ldHJpYyBtb2RlbGluZzogaW1wbGVtZW50YXRpb24gYW5kIGFsZ29yaXRobXMgICAgICAqXG4gKiBCeSBNYXggSy4gQWdvc3RvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFNwcmluZ2VyOyAxIGVkaXRpb24gKEphbnVhcnkgNCwgMjAwNSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogaHR0cDovL2Jvb2tzLmdvb2dsZS5jb20vYm9va3M/cT12YXR0aStjbGlwcGluZythZ29zdG9uICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFNlZSBhbHNvOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogXCJQb2x5Z29uIE9mZnNldHRpbmcgYnkgQ29tcHV0aW5nIFdpbmRpbmcgTnVtYmVyc1wiICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFBhcGVyIG5vLiBERVRDMjAwNS04NTUxMyBwcC4gNTY1LTU3NSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQVNNRSAyMDA1IEludGVybmF0aW9uYWwgRGVzaWduIEVuZ2luZWVyaW5nIFRlY2huaWNhbCBDb25mZXJlbmNlcyAgICAgICAgICAgICAqXG4gKiBhbmQgQ29tcHV0ZXJzIGFuZCBJbmZvcm1hdGlvbiBpbiBFbmdpbmVlcmluZyBDb25mZXJlbmNlIChJREVUQy9DSUUyMDA1KSAgICAgICpcbiAqIFNlcHRlbWJlciAyNC0yOCwgMjAwNSAsIExvbmcgQmVhY2gsIENhbGlmb3JuaWEsIFVTQSAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogaHR0cDovL3d3dy5tZS5iZXJrZWxleS5lZHUvfm1jbWFpbnMvcHVicy9EQUMwNU9mZnNldFBvbHlnb24ucGRmICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQXV0aG9yICAgIDogIFRpbW8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBWZXJzaW9uICAgOiAgNi4xLjMuMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIERhdGUgICAgICA6ICAxIEZlYnJ1YXJ5IDIwMTQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBUaGlzIGlzIGEgdHJhbnNsYXRpb24gb2YgdGhlIEMjIENsaXBwZXIgbGlicmFyeSB0byBKYXZhc2NyaXB0LiAgICAgICAgICAgICAgICpcbiAqIEludDEyOCBzdHJ1Y3Qgb2YgQyMgaXMgaW1wbGVtZW50ZWQgdXNpbmcgSlNCTiBvZiBUb20gV3UuICAgICAgICAgICAgICAgICAgICAgKlxuICogQmVjYXVzZSBKYXZhc2NyaXB0IGxhY2tzIHN1cHBvcnQgZm9yIDY0LWJpdCBpbnRlZ2VycywgdGhlIHNwYWNlICAgICAgICAgICAgICAqXG4gKiBpcyBhIGxpdHRsZSBtb3JlIHJlc3RyaWN0ZWQgdGhhbiBpbiBDIyB2ZXJzaW9uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogQyMgdmVyc2lvbiBoYXMgc3VwcG9ydCBmb3IgY29vcmRpbmF0ZSBzcGFjZTogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiArLTQ2MTE2ODYwMTg0MjczODc5MDMgKCBzcXJ0KDJeMTI3IC0xKS8yICkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIHdoaWxlIEphdmFzY3JpcHQgdmVyc2lvbiBoYXMgc3VwcG9ydCBmb3Igc3BhY2U6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogKy00NTAzNTk5NjI3MzcwNDk1ICggc3FydCgyXjEwNiAtMSkvMiApICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFRvbSBXdSdzIEpTQk4gcHJvdmVkIHRvIGJlIHRoZSBmYXN0ZXN0IGJpZyBpbnRlZ2VyIGxpYnJhcnk6ICAgICAgICAgICAgICAgICAgKlxuICogaHR0cDovL2pzcGVyZi5jb20vYmlnLWludGVnZXItbGlicmFyeS10ZXN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIFRoaXMgY2xhc3MgY2FuIGJlIG1hZGUgc2ltcGxlciB3aGVuIChpZiBldmVyKSA2NC1iaXQgaW50ZWdlciBzdXBwb3J0IGNvbWVzLiAgKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIEJhc2ljIEphdmFTY3JpcHQgQk4gbGlicmFyeSAtIHN1YnNldCB1c2VmdWwgZm9yIFJTQSBlbmNyeXB0aW9uLiAgICAgICAgICAgICAgKlxuICogaHR0cDovL3d3dy1jcy1zdHVkZW50cy5zdGFuZm9yZC5lZHUvfnRqdy9qc2JuLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDUgIFRvbSBXdSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIEFsbCBSaWdodHMgUmVzZXJ2ZWQuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogU2VlIFwiTElDRU5TRVwiIGZvciBkZXRhaWxzOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqIGh0dHA6Ly93d3ctY3Mtc3R1ZGVudHMuc3RhbmZvcmQuZWR1L350ancvanNibi9MSUNFTlNFICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbihmdW5jdGlvbigpe2Z1bmN0aW9uIGsoYSxiLGMpe2QuYmlnaW50ZWdlcl91c2VkPTE7bnVsbCE9YSYmKFwibnVtYmVyXCI9PXR5cGVvZiBhJiZcInVuZGVmaW5lZFwiPT10eXBlb2YgYj90aGlzLmZyb21JbnQoYSk6XCJudW1iZXJcIj09dHlwZW9mIGE/dGhpcy5mcm9tTnVtYmVyKGEsYixjKTpudWxsPT1iJiZcInN0cmluZ1wiIT10eXBlb2YgYT90aGlzLmZyb21TdHJpbmcoYSwyNTYpOnRoaXMuZnJvbVN0cmluZyhhLGIpKX1mdW5jdGlvbiBxKCl7cmV0dXJuIG5ldyBrKG51bGwpfWZ1bmN0aW9uIFEoYSxiLGMsZSxkLGcpe2Zvcig7MDw9LS1nOyl7dmFyIGg9Yip0aGlzW2ErK10rY1tlXStkO2Q9TWF0aC5mbG9vcihoLzY3MTA4ODY0KTtjW2UrK109aCY2NzEwODg2M31yZXR1cm4gZH1mdW5jdGlvbiBSKGEsYixjLGUsZCxnKXt2YXIgaD1iJjMyNzY3O2ZvcihiPj49MTU7MDw9LS1nOyl7dmFyIGw9dGhpc1thXSYzMjc2NyxrPXRoaXNbYSsrXT4+MTUsbj1iKmwraypoLGw9aCpsKygobiYzMjc2Nyk8PFxuMTUpK2NbZV0rKGQmMTA3Mzc0MTgyMyk7ZD0obD4+PjMwKSsobj4+PjE1KStiKmsrKGQ+Pj4zMCk7Y1tlKytdPWwmMTA3Mzc0MTgyM31yZXR1cm4gZH1mdW5jdGlvbiBTKGEsYixjLGUsZCxnKXt2YXIgaD1iJjE2MzgzO2ZvcihiPj49MTQ7MDw9LS1nOyl7dmFyIGw9dGhpc1thXSYxNjM4MyxrPXRoaXNbYSsrXT4+MTQsbj1iKmwraypoLGw9aCpsKygobiYxNjM4Myk8PDE0KStjW2VdK2Q7ZD0obD4+MjgpKyhuPj4xNCkrYiprO2NbZSsrXT1sJjI2ODQzNTQ1NX1yZXR1cm4gZH1mdW5jdGlvbiBMKGEsYil7dmFyIGM9QlthLmNoYXJDb2RlQXQoYildO3JldHVybiBudWxsPT1jPy0xOmN9ZnVuY3Rpb24gdihhKXt2YXIgYj1xKCk7Yi5mcm9tSW50KGEpO3JldHVybiBifWZ1bmN0aW9uIEMoYSl7dmFyIGI9MSxjOzAhPShjPWE+Pj4xNikmJihhPWMsYis9MTYpOzAhPShjPWE+PjgpJiYoYT1jLGIrPTgpOzAhPShjPWE+PjQpJiYoYT1jLGIrPTQpOzAhPShjPWE+PjIpJiYoYT1jLGIrPTIpOzAhPVxuYT4+MSYmKGIrPTEpO3JldHVybiBifWZ1bmN0aW9uIHgoYSl7dGhpcy5tPWF9ZnVuY3Rpb24geShhKXt0aGlzLm09YTt0aGlzLm1wPWEuaW52RGlnaXQoKTt0aGlzLm1wbD10aGlzLm1wJjMyNzY3O3RoaXMubXBoPXRoaXMubXA+PjE1O3RoaXMudW09KDE8PGEuREItMTUpLTE7dGhpcy5tdDI9MiphLnR9ZnVuY3Rpb24gVChhLGIpe3JldHVybiBhJmJ9ZnVuY3Rpb24gSShhLGIpe3JldHVybiBhfGJ9ZnVuY3Rpb24gTShhLGIpe3JldHVybiBhXmJ9ZnVuY3Rpb24gTihhLGIpe3JldHVybiBhJn5ifWZ1bmN0aW9uIEEoKXt9ZnVuY3Rpb24gTyhhKXtyZXR1cm4gYX1mdW5jdGlvbiB3KGEpe3RoaXMucjI9cSgpO3RoaXMucTM9cSgpO2suT05FLmRsU2hpZnRUbygyKmEudCx0aGlzLnIyKTt0aGlzLm11PXRoaXMucjIuZGl2aWRlKGEpO3RoaXMubT1hfXZhciBkPXt9LEQ9ITE7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzPyhtb2R1bGUuZXhwb3J0cz1kLEQ9ITApOlxuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudD93aW5kb3cuQ2xpcHBlckxpYj1kOnNlbGYuQ2xpcHBlckxpYj1kO3ZhciByO2lmKEQpcD1cImNocm9tZVwiLHI9XCJOZXRzY2FwZVwiO2Vsc2V7dmFyIHA9bmF2aWdhdG9yLnVzZXJBZ2VudC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7cj1uYXZpZ2F0b3IuYXBwTmFtZX12YXIgRSxKLEYsRyxILFA7RT0tMSE9cC5pbmRleE9mKFwiY2hyb21lXCIpJiYtMT09cC5pbmRleE9mKFwiY2hyb21pdW1cIik/MTowO0Q9LTEhPXAuaW5kZXhPZihcImNocm9taXVtXCIpPzE6MDtKPS0xIT1wLmluZGV4T2YoXCJzYWZhcmlcIikmJi0xPT1wLmluZGV4T2YoXCJjaHJvbWVcIikmJi0xPT1wLmluZGV4T2YoXCJjaHJvbWl1bVwiKT8xOjA7Rj0tMSE9cC5pbmRleE9mKFwiZmlyZWZveFwiKT8xOjA7cC5pbmRleE9mKFwiZmlyZWZveC8xN1wiKTtwLmluZGV4T2YoXCJmaXJlZm94LzE1XCIpO3AuaW5kZXhPZihcImZpcmVmb3gvM1wiKTtHPS0xIT1wLmluZGV4T2YoXCJvcGVyYVwiKT8xOjA7cC5pbmRleE9mKFwibXNpZSAxMFwiKTtcbnAuaW5kZXhPZihcIm1zaWUgOVwiKTtIPS0xIT1wLmluZGV4T2YoXCJtc2llIDhcIik/MTowO1A9LTEhPXAuaW5kZXhPZihcIm1zaWUgN1wiKT8xOjA7cD0tMSE9cC5pbmRleE9mKFwibXNpZSBcIik/MTowO2QuYmlnaW50ZWdlcl91c2VkPW51bGw7XCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIj09cj8oay5wcm90b3R5cGUuYW09UixyPTMwKTpcIk5ldHNjYXBlXCIhPXI/KGsucHJvdG90eXBlLmFtPVEscj0yNik6KGsucHJvdG90eXBlLmFtPVMscj0yOCk7ay5wcm90b3R5cGUuREI9cjtrLnByb3RvdHlwZS5ETT0oMTw8ciktMTtrLnByb3RvdHlwZS5EVj0xPDxyO2sucHJvdG90eXBlLkZWPU1hdGgucG93KDIsNTIpO2sucHJvdG90eXBlLkYxPTUyLXI7ay5wcm90b3R5cGUuRjI9MipyLTUyO3ZhciBCPVtdLHU7cj00ODtmb3IodT0wOzk+PXU7Kyt1KUJbcisrXT11O3I9OTc7Zm9yKHU9MTA7MzY+dTsrK3UpQltyKytdPXU7cj02NTtmb3IodT0xMDszNj51OysrdSlCW3IrK109dTt4LnByb3RvdHlwZS5jb252ZXJ0PVxuZnVuY3Rpb24oYSl7cmV0dXJuIDA+YS5zfHwwPD1hLmNvbXBhcmVUbyh0aGlzLm0pP2EubW9kKHRoaXMubSk6YX07eC5wcm90b3R5cGUucmV2ZXJ0PWZ1bmN0aW9uKGEpe3JldHVybiBhfTt4LnByb3RvdHlwZS5yZWR1Y2U9ZnVuY3Rpb24oYSl7YS5kaXZSZW1Ubyh0aGlzLm0sbnVsbCxhKX07eC5wcm90b3R5cGUubXVsVG89ZnVuY3Rpb24oYSxiLGMpe2EubXVsdGlwbHlUbyhiLGMpO3RoaXMucmVkdWNlKGMpfTt4LnByb3RvdHlwZS5zcXJUbz1mdW5jdGlvbihhLGIpe2Euc3F1YXJlVG8oYik7dGhpcy5yZWR1Y2UoYil9O3kucHJvdG90eXBlLmNvbnZlcnQ9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO2EuYWJzKCkuZGxTaGlmdFRvKHRoaXMubS50LGIpO2IuZGl2UmVtVG8odGhpcy5tLG51bGwsYik7MD5hLnMmJjA8Yi5jb21wYXJlVG8oay5aRVJPKSYmdGhpcy5tLnN1YlRvKGIsYik7cmV0dXJuIGJ9O3kucHJvdG90eXBlLnJldmVydD1mdW5jdGlvbihhKXt2YXIgYj1xKCk7YS5jb3B5VG8oYik7XG50aGlzLnJlZHVjZShiKTtyZXR1cm4gYn07eS5wcm90b3R5cGUucmVkdWNlPWZ1bmN0aW9uKGEpe2Zvcig7YS50PD10aGlzLm10MjspYVthLnQrK109MDtmb3IodmFyIGI9MDtiPHRoaXMubS50OysrYil7dmFyIGM9YVtiXSYzMjc2NyxlPWMqdGhpcy5tcGwrKChjKnRoaXMubXBoKyhhW2JdPj4xNSkqdGhpcy5tcGwmdGhpcy51bSk8PDE1KSZhLkRNLGM9Yit0aGlzLm0udDtmb3IoYVtjXSs9dGhpcy5tLmFtKDAsZSxhLGIsMCx0aGlzLm0udCk7YVtjXT49YS5EVjspYVtjXS09YS5EVixhWysrY10rK31hLmNsYW1wKCk7YS5kclNoaWZ0VG8odGhpcy5tLnQsYSk7MDw9YS5jb21wYXJlVG8odGhpcy5tKSYmYS5zdWJUbyh0aGlzLm0sYSl9O3kucHJvdG90eXBlLm11bFRvPWZ1bmN0aW9uKGEsYixjKXthLm11bHRpcGx5VG8oYixjKTt0aGlzLnJlZHVjZShjKX07eS5wcm90b3R5cGUuc3FyVG89ZnVuY3Rpb24oYSxiKXthLnNxdWFyZVRvKGIpO3RoaXMucmVkdWNlKGIpfTtrLnByb3RvdHlwZS5jb3B5VG89XG5mdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy50LTE7MDw9YjstLWIpYVtiXT10aGlzW2JdO2EudD10aGlzLnQ7YS5zPXRoaXMuc307ay5wcm90b3R5cGUuZnJvbUludD1mdW5jdGlvbihhKXt0aGlzLnQ9MTt0aGlzLnM9MD5hPy0xOjA7MDxhP3RoaXNbMF09YTotMT5hP3RoaXNbMF09YSt0aGlzLkRWOnRoaXMudD0wfTtrLnByb3RvdHlwZS5mcm9tU3RyaW5nPWZ1bmN0aW9uKGEsYil7dmFyIGM7aWYoMTY9PWIpYz00O2Vsc2UgaWYoOD09YiljPTM7ZWxzZSBpZigyNTY9PWIpYz04O2Vsc2UgaWYoMj09YiljPTE7ZWxzZSBpZigzMj09YiljPTU7ZWxzZSBpZig0PT1iKWM9MjtlbHNle3RoaXMuZnJvbVJhZGl4KGEsYik7cmV0dXJufXRoaXMucz10aGlzLnQ9MDtmb3IodmFyIGU9YS5sZW5ndGgsZD0hMSxnPTA7MDw9LS1lOyl7dmFyIGg9OD09Yz9hW2VdJjI1NTpMKGEsZSk7MD5oP1wiLVwiPT1hLmNoYXJBdChlKSYmKGQ9ITApOihkPSExLDA9PWc/dGhpc1t0aGlzLnQrK109aDpnK2M+dGhpcy5EQj9cbih0aGlzW3RoaXMudC0xXXw9KGgmKDE8PHRoaXMuREItZyktMSk8PGcsdGhpc1t0aGlzLnQrK109aD4+dGhpcy5EQi1nKTp0aGlzW3RoaXMudC0xXXw9aDw8ZyxnKz1jLGc+PXRoaXMuREImJihnLT10aGlzLkRCKSl9OD09YyYmMCE9KGFbMF0mMTI4KSYmKHRoaXMucz0tMSwwPGcmJih0aGlzW3RoaXMudC0xXXw9KDE8PHRoaXMuREItZyktMTw8ZykpO3RoaXMuY2xhbXAoKTtkJiZrLlpFUk8uc3ViVG8odGhpcyx0aGlzKX07ay5wcm90b3R5cGUuY2xhbXA9ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5zJnRoaXMuRE07MDx0aGlzLnQmJnRoaXNbdGhpcy50LTFdPT1hOyktLXRoaXMudH07ay5wcm90b3R5cGUuZGxTaGlmdFRvPWZ1bmN0aW9uKGEsYil7dmFyIGM7Zm9yKGM9dGhpcy50LTE7MDw9YzstLWMpYltjK2FdPXRoaXNbY107Zm9yKGM9YS0xOzA8PWM7LS1jKWJbY109MDtiLnQ9dGhpcy50K2E7Yi5zPXRoaXMuc307ay5wcm90b3R5cGUuZHJTaGlmdFRvPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPVxuYTtjPHRoaXMudDsrK2MpYltjLWFdPXRoaXNbY107Yi50PU1hdGgubWF4KHRoaXMudC1hLDApO2Iucz10aGlzLnN9O2sucHJvdG90eXBlLmxTaGlmdFRvPWZ1bmN0aW9uKGEsYil7dmFyIGM9YSV0aGlzLkRCLGU9dGhpcy5EQi1jLGQ9KDE8PGUpLTEsZz1NYXRoLmZsb29yKGEvdGhpcy5EQiksaD10aGlzLnM8PGMmdGhpcy5ETSxsO2ZvcihsPXRoaXMudC0xOzA8PWw7LS1sKWJbbCtnKzFdPXRoaXNbbF0+PmV8aCxoPSh0aGlzW2xdJmQpPDxjO2ZvcihsPWctMTswPD1sOy0tbCliW2xdPTA7YltnXT1oO2IudD10aGlzLnQrZysxO2Iucz10aGlzLnM7Yi5jbGFtcCgpfTtrLnByb3RvdHlwZS5yU2hpZnRUbz1mdW5jdGlvbihhLGIpe2Iucz10aGlzLnM7dmFyIGM9TWF0aC5mbG9vcihhL3RoaXMuREIpO2lmKGM+PXRoaXMudCliLnQ9MDtlbHNle3ZhciBlPWEldGhpcy5EQixkPXRoaXMuREItZSxnPSgxPDxlKS0xO2JbMF09dGhpc1tjXT4+ZTtmb3IodmFyIGg9YysxO2g8dGhpcy50OysraCliW2gtXG5jLTFdfD0odGhpc1toXSZnKTw8ZCxiW2gtY109dGhpc1toXT4+ZTswPGUmJihiW3RoaXMudC1jLTFdfD0odGhpcy5zJmcpPDxkKTtiLnQ9dGhpcy50LWM7Yi5jbGFtcCgpfX07ay5wcm90b3R5cGUuc3ViVG89ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MCxlPTAsZD1NYXRoLm1pbihhLnQsdGhpcy50KTtjPGQ7KWUrPXRoaXNbY10tYVtjXSxiW2MrK109ZSZ0aGlzLkRNLGU+Pj10aGlzLkRCO2lmKGEudDx0aGlzLnQpe2ZvcihlLT1hLnM7Yzx0aGlzLnQ7KWUrPXRoaXNbY10sYltjKytdPWUmdGhpcy5ETSxlPj49dGhpcy5EQjtlKz10aGlzLnN9ZWxzZXtmb3IoZSs9dGhpcy5zO2M8YS50OyllLT1hW2NdLGJbYysrXT1lJnRoaXMuRE0sZT4+PXRoaXMuREI7ZS09YS5zfWIucz0wPmU/LTE6MDstMT5lP2JbYysrXT10aGlzLkRWK2U6MDxlJiYoYltjKytdPWUpO2IudD1jO2IuY2xhbXAoKX07ay5wcm90b3R5cGUubXVsdGlwbHlUbz1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuYWJzKCksZT1cbmEuYWJzKCksZD1jLnQ7Zm9yKGIudD1kK2UudDswPD0tLWQ7KWJbZF09MDtmb3IoZD0wO2Q8ZS50OysrZCliW2QrYy50XT1jLmFtKDAsZVtkXSxiLGQsMCxjLnQpO2Iucz0wO2IuY2xhbXAoKTt0aGlzLnMhPWEucyYmay5aRVJPLnN1YlRvKGIsYil9O2sucHJvdG90eXBlLnNxdWFyZVRvPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLmFicygpLGM9YS50PTIqYi50OzA8PS0tYzspYVtjXT0wO2ZvcihjPTA7YzxiLnQtMTsrK2Mpe3ZhciBlPWIuYW0oYyxiW2NdLGEsMipjLDAsMSk7KGFbYytiLnRdKz1iLmFtKGMrMSwyKmJbY10sYSwyKmMrMSxlLGIudC1jLTEpKT49Yi5EViYmKGFbYytiLnRdLT1iLkRWLGFbYytiLnQrMV09MSl9MDxhLnQmJihhW2EudC0xXSs9Yi5hbShjLGJbY10sYSwyKmMsMCwxKSk7YS5zPTA7YS5jbGFtcCgpfTtrLnByb3RvdHlwZS5kaXZSZW1Ubz1mdW5jdGlvbihhLGIsYyl7dmFyIGU9YS5hYnMoKTtpZighKDA+PWUudCkpe3ZhciBkPXRoaXMuYWJzKCk7aWYoZC50PFxuZS50KW51bGwhPWImJmIuZnJvbUludCgwKSxudWxsIT1jJiZ0aGlzLmNvcHlUbyhjKTtlbHNle251bGw9PWMmJihjPXEoKSk7dmFyIGc9cSgpLGg9dGhpcy5zO2E9YS5zO3ZhciBsPXRoaXMuREItQyhlW2UudC0xXSk7MDxsPyhlLmxTaGlmdFRvKGwsZyksZC5sU2hpZnRUbyhsLGMpKTooZS5jb3B5VG8oZyksZC5jb3B5VG8oYykpO2U9Zy50O2Q9Z1tlLTFdO2lmKDAhPWQpe3ZhciB6PWQqKDE8PHRoaXMuRjEpKygxPGU/Z1tlLTJdPj50aGlzLkYyOjApLG49dGhpcy5GVi96LHo9KDE8PHRoaXMuRjEpL3osVT0xPDx0aGlzLkYyLG09Yy50LHA9bS1lLHM9bnVsbD09Yj9xKCk6YjtnLmRsU2hpZnRUbyhwLHMpOzA8PWMuY29tcGFyZVRvKHMpJiYoY1tjLnQrK109MSxjLnN1YlRvKHMsYykpO2suT05FLmRsU2hpZnRUbyhlLHMpO2ZvcihzLnN1YlRvKGcsZyk7Zy50PGU7KWdbZy50KytdPTA7Zm9yKDswPD0tLXA7KXt2YXIgcj1jWy0tbV09PWQ/dGhpcy5ETTpNYXRoLmZsb29yKGNbbV0qbisoY1ttLVxuMV0rVSkqeik7aWYoKGNbbV0rPWcuYW0oMCxyLGMscCwwLGUpKTxyKWZvcihnLmRsU2hpZnRUbyhwLHMpLGMuc3ViVG8ocyxjKTtjW21dPC0tcjspYy5zdWJUbyhzLGMpfW51bGwhPWImJihjLmRyU2hpZnRUbyhlLGIpLGghPWEmJmsuWkVSTy5zdWJUbyhiLGIpKTtjLnQ9ZTtjLmNsYW1wKCk7MDxsJiZjLnJTaGlmdFRvKGwsYyk7MD5oJiZrLlpFUk8uc3ViVG8oYyxjKX19fX07ay5wcm90b3R5cGUuaW52RGlnaXQ9ZnVuY3Rpb24oKXtpZigxPnRoaXMudClyZXR1cm4gMDt2YXIgYT10aGlzWzBdO2lmKDA9PShhJjEpKXJldHVybiAwO3ZhciBiPWEmMyxiPWIqKDItKGEmMTUpKmIpJjE1LGI9YiooMi0oYSYyNTUpKmIpJjI1NSxiPWIqKDItKChhJjY1NTM1KSpiJjY1NTM1KSkmNjU1MzUsYj1iKigyLWEqYiV0aGlzLkRWKSV0aGlzLkRWO3JldHVybiAwPGI/dGhpcy5EVi1iOi1ifTtrLnByb3RvdHlwZS5pc0V2ZW49ZnVuY3Rpb24oKXtyZXR1cm4gMD09KDA8dGhpcy50P3RoaXNbMF0mMTp0aGlzLnMpfTtcbmsucHJvdG90eXBlLmV4cD1mdW5jdGlvbihhLGIpe2lmKDQyOTQ5NjcyOTU8YXx8MT5hKXJldHVybiBrLk9ORTt2YXIgYz1xKCksZT1xKCksZD1iLmNvbnZlcnQodGhpcyksZz1DKGEpLTE7Zm9yKGQuY29weVRvKGMpOzA8PS0tZzspaWYoYi5zcXJUbyhjLGUpLDA8KGEmMTw8ZykpYi5tdWxUbyhlLGQsYyk7ZWxzZSB2YXIgaD1jLGM9ZSxlPWg7cmV0dXJuIGIucmV2ZXJ0KGMpfTtrLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbihhKXtpZigwPnRoaXMucylyZXR1cm5cIi1cIit0aGlzLm5lZ2F0ZSgpLnRvU3RyaW5nKGEpO2lmKDE2PT1hKWE9NDtlbHNlIGlmKDg9PWEpYT0zO2Vsc2UgaWYoMj09YSlhPTE7ZWxzZSBpZigzMj09YSlhPTU7ZWxzZSBpZig0PT1hKWE9MjtlbHNlIHJldHVybiB0aGlzLnRvUmFkaXgoYSk7dmFyIGI9KDE8PGEpLTEsYyxlPSExLGQ9XCJcIixnPXRoaXMudCxoPXRoaXMuREItZyp0aGlzLkRCJWE7aWYoMDxnLS0pZm9yKGg8dGhpcy5EQiYmMDwoYz10aGlzW2ddPj5cbmgpJiYoZT0hMCxkPVwiMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGMpKTswPD1nOyloPGE/KGM9KHRoaXNbZ10mKDE8PGgpLTEpPDxhLWgsY3w9dGhpc1stLWddPj4oaCs9dGhpcy5EQi1hKSk6KGM9dGhpc1tnXT4+KGgtPWEpJmIsMD49aCYmKGgrPXRoaXMuREIsLS1nKSksMDxjJiYoZT0hMCksZSYmKGQrPVwiMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGMpKTtyZXR1cm4gZT9kOlwiMFwifTtrLnByb3RvdHlwZS5uZWdhdGU9ZnVuY3Rpb24oKXt2YXIgYT1xKCk7ay5aRVJPLnN1YlRvKHRoaXMsYSk7cmV0dXJuIGF9O2sucHJvdG90eXBlLmFicz1mdW5jdGlvbigpe3JldHVybiAwPnRoaXMucz90aGlzLm5lZ2F0ZSgpOnRoaXN9O2sucHJvdG90eXBlLmNvbXBhcmVUbz1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnMtYS5zO2lmKDAhPWIpcmV0dXJuIGI7dmFyIGM9dGhpcy50LGI9Yy1hLnQ7aWYoMCE9YilyZXR1cm4gMD50aGlzLnM/XG4tYjpiO2Zvcig7MDw9LS1jOylpZigwIT0oYj10aGlzW2NdLWFbY10pKXJldHVybiBiO3JldHVybiAwfTtrLnByb3RvdHlwZS5iaXRMZW5ndGg9ZnVuY3Rpb24oKXtyZXR1cm4gMD49dGhpcy50PzA6dGhpcy5EQioodGhpcy50LTEpK0ModGhpc1t0aGlzLnQtMV1edGhpcy5zJnRoaXMuRE0pfTtrLnByb3RvdHlwZS5tb2Q9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO3RoaXMuYWJzKCkuZGl2UmVtVG8oYSxudWxsLGIpOzA+dGhpcy5zJiYwPGIuY29tcGFyZVRvKGsuWkVSTykmJmEuc3ViVG8oYixiKTtyZXR1cm4gYn07ay5wcm90b3R5cGUubW9kUG93SW50PWZ1bmN0aW9uKGEsYil7dmFyIGM7Yz0yNTY+YXx8Yi5pc0V2ZW4oKT9uZXcgeChiKTpuZXcgeShiKTtyZXR1cm4gdGhpcy5leHAoYSxjKX07ay5aRVJPPXYoMCk7ay5PTkU9digxKTtBLnByb3RvdHlwZS5jb252ZXJ0PU87QS5wcm90b3R5cGUucmV2ZXJ0PU87QS5wcm90b3R5cGUubXVsVG89ZnVuY3Rpb24oYSxiLGMpe2EubXVsdGlwbHlUbyhiLFxuYyl9O0EucHJvdG90eXBlLnNxclRvPWZ1bmN0aW9uKGEsYil7YS5zcXVhcmVUbyhiKX07dy5wcm90b3R5cGUuY29udmVydD1mdW5jdGlvbihhKXtpZigwPmEuc3x8YS50PjIqdGhpcy5tLnQpcmV0dXJuIGEubW9kKHRoaXMubSk7aWYoMD5hLmNvbXBhcmVUbyh0aGlzLm0pKXJldHVybiBhO3ZhciBiPXEoKTthLmNvcHlUbyhiKTt0aGlzLnJlZHVjZShiKTtyZXR1cm4gYn07dy5wcm90b3R5cGUucmV2ZXJ0PWZ1bmN0aW9uKGEpe3JldHVybiBhfTt3LnByb3RvdHlwZS5yZWR1Y2U9ZnVuY3Rpb24oYSl7YS5kclNoaWZ0VG8odGhpcy5tLnQtMSx0aGlzLnIyKTthLnQ+dGhpcy5tLnQrMSYmKGEudD10aGlzLm0udCsxLGEuY2xhbXAoKSk7dGhpcy5tdS5tdWx0aXBseVVwcGVyVG8odGhpcy5yMix0aGlzLm0udCsxLHRoaXMucTMpO2Zvcih0aGlzLm0ubXVsdGlwbHlMb3dlclRvKHRoaXMucTMsdGhpcy5tLnQrMSx0aGlzLnIyKTswPmEuY29tcGFyZVRvKHRoaXMucjIpOylhLmRBZGRPZmZzZXQoMSxcbnRoaXMubS50KzEpO2ZvcihhLnN1YlRvKHRoaXMucjIsYSk7MDw9YS5jb21wYXJlVG8odGhpcy5tKTspYS5zdWJUbyh0aGlzLm0sYSl9O3cucHJvdG90eXBlLm11bFRvPWZ1bmN0aW9uKGEsYixjKXthLm11bHRpcGx5VG8oYixjKTt0aGlzLnJlZHVjZShjKX07dy5wcm90b3R5cGUuc3FyVG89ZnVuY3Rpb24oYSxiKXthLnNxdWFyZVRvKGIpO3RoaXMucmVkdWNlKGIpfTt2YXIgdD1bMiwzLDUsNywxMSwxMywxNywxOSwyMywyOSwzMSwzNyw0MSw0Myw0Nyw1Myw1OSw2MSw2Nyw3MSw3Myw3OSw4Myw4OSw5NywxMDEsMTAzLDEwNywxMDksMTEzLDEyNywxMzEsMTM3LDEzOSwxNDksMTUxLDE1NywxNjMsMTY3LDE3MywxNzksMTgxLDE5MSwxOTMsMTk3LDE5OSwyMTEsMjIzLDIyNywyMjksMjMzLDIzOSwyNDEsMjUxLDI1NywyNjMsMjY5LDI3MSwyNzcsMjgxLDI4MywyOTMsMzA3LDMxMSwzMTMsMzE3LDMzMSwzMzcsMzQ3LDM0OSwzNTMsMzU5LDM2NywzNzMsMzc5LDM4MywzODksMzk3LDQwMSxcbjQwOSw0MTksNDIxLDQzMSw0MzMsNDM5LDQ0Myw0NDksNDU3LDQ2MSw0NjMsNDY3LDQ3OSw0ODcsNDkxLDQ5OSw1MDMsNTA5LDUyMSw1MjMsNTQxLDU0Nyw1NTcsNTYzLDU2OSw1NzEsNTc3LDU4Nyw1OTMsNTk5LDYwMSw2MDcsNjEzLDYxNyw2MTksNjMxLDY0MSw2NDMsNjQ3LDY1Myw2NTksNjYxLDY3Myw2NzcsNjgzLDY5MSw3MDEsNzA5LDcxOSw3MjcsNzMzLDczOSw3NDMsNzUxLDc1Nyw3NjEsNzY5LDc3Myw3ODcsNzk3LDgwOSw4MTEsODIxLDgyMyw4MjcsODI5LDgzOSw4NTMsODU3LDg1OSw4NjMsODc3LDg4MSw4ODMsODg3LDkwNyw5MTEsOTE5LDkyOSw5MzcsOTQxLDk0Nyw5NTMsOTY3LDk3MSw5NzcsOTgzLDk5MSw5OTddLFY9NjcxMDg4NjQvdFt0Lmxlbmd0aC0xXTtrLnByb3RvdHlwZS5jaHVua1NpemU9ZnVuY3Rpb24oYSl7cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5MTjIqdGhpcy5EQi9NYXRoLmxvZyhhKSl9O2sucHJvdG90eXBlLnRvUmFkaXg9ZnVuY3Rpb24oYSl7bnVsbD09XG5hJiYoYT0xMCk7aWYoMD09dGhpcy5zaWdudW0oKXx8Mj5hfHwzNjxhKXJldHVyblwiMFwiO3ZhciBiPXRoaXMuY2h1bmtTaXplKGEpLGI9TWF0aC5wb3coYSxiKSxjPXYoYiksZT1xKCksZD1xKCksZz1cIlwiO2Zvcih0aGlzLmRpdlJlbVRvKGMsZSxkKTswPGUuc2lnbnVtKCk7KWc9KGIrZC5pbnRWYWx1ZSgpKS50b1N0cmluZyhhKS5zdWJzdHIoMSkrZyxlLmRpdlJlbVRvKGMsZSxkKTtyZXR1cm4gZC5pbnRWYWx1ZSgpLnRvU3RyaW5nKGEpK2d9O2sucHJvdG90eXBlLmZyb21SYWRpeD1mdW5jdGlvbihhLGIpe3RoaXMuZnJvbUludCgwKTtudWxsPT1iJiYoYj0xMCk7Zm9yKHZhciBjPXRoaXMuY2h1bmtTaXplKGIpLGU9TWF0aC5wb3coYixjKSxkPSExLGc9MCxoPTAsbD0wO2w8YS5sZW5ndGg7KytsKXt2YXIgej1MKGEsbCk7MD56P1wiLVwiPT1hLmNoYXJBdChsKSYmMD09dGhpcy5zaWdudW0oKSYmKGQ9ITApOihoPWIqaCt6LCsrZz49YyYmKHRoaXMuZE11bHRpcGx5KGUpLHRoaXMuZEFkZE9mZnNldChoLFxuMCksaD1nPTApKX0wPGcmJih0aGlzLmRNdWx0aXBseShNYXRoLnBvdyhiLGcpKSx0aGlzLmRBZGRPZmZzZXQoaCwwKSk7ZCYmay5aRVJPLnN1YlRvKHRoaXMsdGhpcyl9O2sucHJvdG90eXBlLmZyb21OdW1iZXI9ZnVuY3Rpb24oYSxiLGMpe2lmKFwibnVtYmVyXCI9PXR5cGVvZiBiKWlmKDI+YSl0aGlzLmZyb21JbnQoMSk7ZWxzZSBmb3IodGhpcy5mcm9tTnVtYmVyKGEsYyksdGhpcy50ZXN0Qml0KGEtMSl8fHRoaXMuYml0d2lzZVRvKGsuT05FLnNoaWZ0TGVmdChhLTEpLEksdGhpcyksdGhpcy5pc0V2ZW4oKSYmdGhpcy5kQWRkT2Zmc2V0KDEsMCk7IXRoaXMuaXNQcm9iYWJsZVByaW1lKGIpOyl0aGlzLmRBZGRPZmZzZXQoMiwwKSx0aGlzLmJpdExlbmd0aCgpPmEmJnRoaXMuc3ViVG8oay5PTkUuc2hpZnRMZWZ0KGEtMSksdGhpcyk7ZWxzZXtjPVtdO3ZhciBlPWEmNztjLmxlbmd0aD0oYT4+MykrMTtiLm5leHRCeXRlcyhjKTtjWzBdPTA8ZT9jWzBdJigxPDxlKS0xOjA7dGhpcy5mcm9tU3RyaW5nKGMsXG4yNTYpfX07ay5wcm90b3R5cGUuYml0d2lzZVRvPWZ1bmN0aW9uKGEsYixjKXt2YXIgZSxkLGc9TWF0aC5taW4oYS50LHRoaXMudCk7Zm9yKGU9MDtlPGc7KytlKWNbZV09Yih0aGlzW2VdLGFbZV0pO2lmKGEudDx0aGlzLnQpe2Q9YS5zJnRoaXMuRE07Zm9yKGU9ZztlPHRoaXMudDsrK2UpY1tlXT1iKHRoaXNbZV0sZCk7Yy50PXRoaXMudH1lbHNle2Q9dGhpcy5zJnRoaXMuRE07Zm9yKGU9ZztlPGEudDsrK2UpY1tlXT1iKGQsYVtlXSk7Yy50PWEudH1jLnM9Yih0aGlzLnMsYS5zKTtjLmNsYW1wKCl9O2sucHJvdG90eXBlLmNoYW5nZUJpdD1mdW5jdGlvbihhLGIpe3ZhciBjPWsuT05FLnNoaWZ0TGVmdChhKTt0aGlzLmJpdHdpc2VUbyhjLGIsYyk7cmV0dXJuIGN9O2sucHJvdG90eXBlLmFkZFRvPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTAsZT0wLGQ9TWF0aC5taW4oYS50LHRoaXMudCk7YzxkOyllKz10aGlzW2NdK2FbY10sYltjKytdPWUmdGhpcy5ETSxlPj49dGhpcy5EQjtpZihhLnQ8XG50aGlzLnQpe2ZvcihlKz1hLnM7Yzx0aGlzLnQ7KWUrPXRoaXNbY10sYltjKytdPWUmdGhpcy5ETSxlPj49dGhpcy5EQjtlKz10aGlzLnN9ZWxzZXtmb3IoZSs9dGhpcy5zO2M8YS50OyllKz1hW2NdLGJbYysrXT1lJnRoaXMuRE0sZT4+PXRoaXMuREI7ZSs9YS5zfWIucz0wPmU/LTE6MDswPGU/YltjKytdPWU6LTE+ZSYmKGJbYysrXT10aGlzLkRWK2UpO2IudD1jO2IuY2xhbXAoKX07ay5wcm90b3R5cGUuZE11bHRpcGx5PWZ1bmN0aW9uKGEpe3RoaXNbdGhpcy50XT10aGlzLmFtKDAsYS0xLHRoaXMsMCwwLHRoaXMudCk7Kyt0aGlzLnQ7dGhpcy5jbGFtcCgpfTtrLnByb3RvdHlwZS5kQWRkT2Zmc2V0PWZ1bmN0aW9uKGEsYil7aWYoMCE9YSl7Zm9yKDt0aGlzLnQ8PWI7KXRoaXNbdGhpcy50KytdPTA7Zm9yKHRoaXNbYl0rPWE7dGhpc1tiXT49dGhpcy5EVjspdGhpc1tiXS09dGhpcy5EViwrK2I+PXRoaXMudCYmKHRoaXNbdGhpcy50KytdPTApLCsrdGhpc1tiXX19O2sucHJvdG90eXBlLm11bHRpcGx5TG93ZXJUbz1cbmZ1bmN0aW9uKGEsYixjKXt2YXIgZT1NYXRoLm1pbih0aGlzLnQrYS50LGIpO2Mucz0wO2ZvcihjLnQ9ZTswPGU7KWNbLS1lXT0wO3ZhciBkO2ZvcihkPWMudC10aGlzLnQ7ZTxkOysrZSljW2UrdGhpcy50XT10aGlzLmFtKDAsYVtlXSxjLGUsMCx0aGlzLnQpO2ZvcihkPU1hdGgubWluKGEudCxiKTtlPGQ7KytlKXRoaXMuYW0oMCxhW2VdLGMsZSwwLGItZSk7Yy5jbGFtcCgpfTtrLnByb3RvdHlwZS5tdWx0aXBseVVwcGVyVG89ZnVuY3Rpb24oYSxiLGMpey0tYjt2YXIgZT1jLnQ9dGhpcy50K2EudC1iO2ZvcihjLnM9MDswPD0tLWU7KWNbZV09MDtmb3IoZT1NYXRoLm1heChiLXRoaXMudCwwKTtlPGEudDsrK2UpY1t0aGlzLnQrZS1iXT10aGlzLmFtKGItZSxhW2VdLGMsMCwwLHRoaXMudCtlLWIpO2MuY2xhbXAoKTtjLmRyU2hpZnRUbygxLGMpfTtrLnByb3RvdHlwZS5tb2RJbnQ9ZnVuY3Rpb24oYSl7aWYoMD49YSlyZXR1cm4gMDt2YXIgYj10aGlzLkRWJWEsYz0wPnRoaXMucz9hLVxuMTowO2lmKDA8dGhpcy50KWlmKDA9PWIpYz10aGlzWzBdJWE7ZWxzZSBmb3IodmFyIGU9dGhpcy50LTE7MDw9ZTstLWUpYz0oYipjK3RoaXNbZV0pJWE7cmV0dXJuIGN9O2sucHJvdG90eXBlLm1pbGxlclJhYmluPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc3VidHJhY3Qoay5PTkUpLGM9Yi5nZXRMb3dlc3RTZXRCaXQoKTtpZigwPj1jKXJldHVybiExO3ZhciBlPWIuc2hpZnRSaWdodChjKTthPWErMT4+MTthPnQubGVuZ3RoJiYoYT10Lmxlbmd0aCk7Zm9yKHZhciBkPXEoKSxnPTA7ZzxhOysrZyl7ZC5mcm9tSW50KHRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnQubGVuZ3RoKV0pO3ZhciBoPWQubW9kUG93KGUsdGhpcyk7aWYoMCE9aC5jb21wYXJlVG8oay5PTkUpJiYwIT1oLmNvbXBhcmVUbyhiKSl7Zm9yKHZhciBsPTE7bCsrPGMmJjAhPWguY29tcGFyZVRvKGIpOylpZihoPWgubW9kUG93SW50KDIsdGhpcyksMD09aC5jb21wYXJlVG8oay5PTkUpKXJldHVybiExO2lmKDAhPWguY29tcGFyZVRvKGIpKXJldHVybiExfX1yZXR1cm4hMH07XG5rLnByb3RvdHlwZS5jbG9uZT1mdW5jdGlvbigpe3ZhciBhPXEoKTt0aGlzLmNvcHlUbyhhKTtyZXR1cm4gYX07ay5wcm90b3R5cGUuaW50VmFsdWU9ZnVuY3Rpb24oKXtpZigwPnRoaXMucyl7aWYoMT09dGhpcy50KXJldHVybiB0aGlzWzBdLXRoaXMuRFY7aWYoMD09dGhpcy50KXJldHVybi0xfWVsc2V7aWYoMT09dGhpcy50KXJldHVybiB0aGlzWzBdO2lmKDA9PXRoaXMudClyZXR1cm4gMH1yZXR1cm4odGhpc1sxXSYoMTw8MzItdGhpcy5EQiktMSk8PHRoaXMuREJ8dGhpc1swXX07ay5wcm90b3R5cGUuYnl0ZVZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIDA9PXRoaXMudD90aGlzLnM6dGhpc1swXTw8MjQ+PjI0fTtrLnByb3RvdHlwZS5zaG9ydFZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIDA9PXRoaXMudD90aGlzLnM6dGhpc1swXTw8MTY+PjE2fTtrLnByb3RvdHlwZS5zaWdudW09ZnVuY3Rpb24oKXtyZXR1cm4gMD50aGlzLnM/LTE6MD49dGhpcy50fHwxPT10aGlzLnQmJjA+PXRoaXNbMF0/XG4wOjF9O2sucHJvdG90eXBlLnRvQnl0ZUFycmF5PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy50LGI9W107YlswXT10aGlzLnM7dmFyIGM9dGhpcy5EQi1hKnRoaXMuREIlOCxlLGQ9MDtpZigwPGEtLSlmb3IoYzx0aGlzLkRCJiYoZT10aGlzW2FdPj5jKSE9KHRoaXMucyZ0aGlzLkRNKT4+YyYmKGJbZCsrXT1lfHRoaXMuczw8dGhpcy5EQi1jKTswPD1hOylpZig4PmM/KGU9KHRoaXNbYV0mKDE8PGMpLTEpPDw4LWMsZXw9dGhpc1stLWFdPj4oYys9dGhpcy5EQi04KSk6KGU9dGhpc1thXT4+KGMtPTgpJjI1NSwwPj1jJiYoYys9dGhpcy5EQiwtLWEpKSwwIT0oZSYxMjgpJiYoZXw9LTI1NiksMD09ZCYmKHRoaXMucyYxMjgpIT0oZSYxMjgpJiYrK2QsMDxkfHxlIT10aGlzLnMpYltkKytdPWU7cmV0dXJuIGJ9O2sucHJvdG90eXBlLmVxdWFscz1mdW5jdGlvbihhKXtyZXR1cm4gMD09dGhpcy5jb21wYXJlVG8oYSl9O2sucHJvdG90eXBlLm1pbj1mdW5jdGlvbihhKXtyZXR1cm4gMD50aGlzLmNvbXBhcmVUbyhhKT9cbnRoaXM6YX07ay5wcm90b3R5cGUubWF4PWZ1bmN0aW9uKGEpe3JldHVybiAwPHRoaXMuY29tcGFyZVRvKGEpP3RoaXM6YX07ay5wcm90b3R5cGUuYW5kPWZ1bmN0aW9uKGEpe3ZhciBiPXEoKTt0aGlzLmJpdHdpc2VUbyhhLFQsYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLm9yPWZ1bmN0aW9uKGEpe3ZhciBiPXEoKTt0aGlzLmJpdHdpc2VUbyhhLEksYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLnhvcj1mdW5jdGlvbihhKXt2YXIgYj1xKCk7dGhpcy5iaXR3aXNlVG8oYSxNLGIpO3JldHVybiBifTtrLnByb3RvdHlwZS5hbmROb3Q9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO3RoaXMuYml0d2lzZVRvKGEsTixiKTtyZXR1cm4gYn07ay5wcm90b3R5cGUubm90PWZ1bmN0aW9uKCl7Zm9yKHZhciBhPXEoKSxiPTA7Yjx0aGlzLnQ7KytiKWFbYl09dGhpcy5ETSZ+dGhpc1tiXTthLnQ9dGhpcy50O2Eucz1+dGhpcy5zO3JldHVybiBhfTtrLnByb3RvdHlwZS5zaGlmdExlZnQ9ZnVuY3Rpb24oYSl7dmFyIGI9XG5xKCk7MD5hP3RoaXMuclNoaWZ0VG8oLWEsYik6dGhpcy5sU2hpZnRUbyhhLGIpO3JldHVybiBifTtrLnByb3RvdHlwZS5zaGlmdFJpZ2h0PWZ1bmN0aW9uKGEpe3ZhciBiPXEoKTswPmE/dGhpcy5sU2hpZnRUbygtYSxiKTp0aGlzLnJTaGlmdFRvKGEsYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLmdldExvd2VzdFNldEJpdD1mdW5jdGlvbigpe2Zvcih2YXIgYT0wO2E8dGhpcy50OysrYSlpZigwIT10aGlzW2FdKXt2YXIgYj1hKnRoaXMuREI7YT10aGlzW2FdO2lmKDA9PWEpYT0tMTtlbHNle3ZhciBjPTA7MD09KGEmNjU1MzUpJiYoYT4+PTE2LGMrPTE2KTswPT0oYSYyNTUpJiYoYT4+PTgsYys9OCk7MD09KGEmMTUpJiYoYT4+PTQsYys9NCk7MD09KGEmMykmJihhPj49MixjKz0yKTswPT0oYSYxKSYmKytjO2E9Y31yZXR1cm4gYithfXJldHVybiAwPnRoaXMucz90aGlzLnQqdGhpcy5EQjotMX07ay5wcm90b3R5cGUuYml0Q291bnQ9ZnVuY3Rpb24oKXtmb3IodmFyIGE9MCxiPXRoaXMucyZcbnRoaXMuRE0sYz0wO2M8dGhpcy50OysrYyl7Zm9yKHZhciBlPXRoaXNbY11eYixkPTA7MCE9ZTspZSY9ZS0xLCsrZDthKz1kfXJldHVybiBhfTtrLnByb3RvdHlwZS50ZXN0Qml0PWZ1bmN0aW9uKGEpe3ZhciBiPU1hdGguZmxvb3IoYS90aGlzLkRCKTtyZXR1cm4gYj49dGhpcy50PzAhPXRoaXMuczowIT0odGhpc1tiXSYxPDxhJXRoaXMuREIpfTtrLnByb3RvdHlwZS5zZXRCaXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY2hhbmdlQml0KGEsSSl9O2sucHJvdG90eXBlLmNsZWFyQml0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmNoYW5nZUJpdChhLE4pfTtrLnByb3RvdHlwZS5mbGlwQml0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmNoYW5nZUJpdChhLE0pfTtrLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO3RoaXMuYWRkVG8oYSxiKTtyZXR1cm4gYn07ay5wcm90b3R5cGUuc3VidHJhY3Q9ZnVuY3Rpb24oYSl7dmFyIGI9cSgpO3RoaXMuc3ViVG8oYSxiKTtyZXR1cm4gYn07XG5rLnByb3RvdHlwZS5tdWx0aXBseT1mdW5jdGlvbihhKXt2YXIgYj1xKCk7dGhpcy5tdWx0aXBseVRvKGEsYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLmRpdmlkZT1mdW5jdGlvbihhKXt2YXIgYj1xKCk7dGhpcy5kaXZSZW1UbyhhLGIsbnVsbCk7cmV0dXJuIGJ9O2sucHJvdG90eXBlLnJlbWFpbmRlcj1mdW5jdGlvbihhKXt2YXIgYj1xKCk7dGhpcy5kaXZSZW1UbyhhLG51bGwsYik7cmV0dXJuIGJ9O2sucHJvdG90eXBlLmRpdmlkZUFuZFJlbWFpbmRlcj1mdW5jdGlvbihhKXt2YXIgYj1xKCksYz1xKCk7dGhpcy5kaXZSZW1UbyhhLGIsYyk7cmV0dXJuW2IsY119O2sucHJvdG90eXBlLm1vZFBvdz1mdW5jdGlvbihhLGIpe3ZhciBjPWEuYml0TGVuZ3RoKCksZSxkPXYoMSksZztpZigwPj1jKXJldHVybiBkO2U9MTg+Yz8xOjQ4PmM/MzoxNDQ+Yz80Ojc2OD5jPzU6NjtnPTg+Yz9uZXcgeChiKTpiLmlzRXZlbigpP25ldyB3KGIpOm5ldyB5KGIpO3ZhciBoPVtdLGw9MyxrPWUtMSxuPSgxPDxcbmUpLTE7aFsxXT1nLmNvbnZlcnQodGhpcyk7aWYoMTxlKWZvcihjPXEoKSxnLnNxclRvKGhbMV0sYyk7bDw9bjspaFtsXT1xKCksZy5tdWxUbyhjLGhbbC0yXSxoW2xdKSxsKz0yO2Zvcih2YXIgbT1hLnQtMSxwLHI9ITAscz1xKCksYz1DKGFbbV0pLTE7MDw9bTspe2M+PWs/cD1hW21dPj5jLWsmbjoocD0oYVttXSYoMTw8YysxKS0xKTw8ay1jLDA8bSYmKHB8PWFbbS0xXT4+dGhpcy5EQitjLWspKTtmb3IobD1lOzA9PShwJjEpOylwPj49MSwtLWw7MD4oYy09bCkmJihjKz10aGlzLkRCLC0tbSk7aWYociloW3BdLmNvcHlUbyhkKSxyPSExO2Vsc2V7Zm9yKDsxPGw7KWcuc3FyVG8oZCxzKSxnLnNxclRvKHMsZCksbC09MjswPGw/Zy5zcXJUbyhkLHMpOihsPWQsZD1zLHM9bCk7Zy5tdWxUbyhzLGhbcF0sZCl9Zm9yKDswPD1tJiYwPT0oYVttXSYxPDxjKTspZy5zcXJUbyhkLHMpLGw9ZCxkPXMscz1sLDA+LS1jJiYoYz10aGlzLkRCLTEsLS1tKX1yZXR1cm4gZy5yZXZlcnQoZCl9O2sucHJvdG90eXBlLm1vZEludmVyc2U9XG5mdW5jdGlvbihhKXt2YXIgYj1hLmlzRXZlbigpO2lmKHRoaXMuaXNFdmVuKCkmJmJ8fDA9PWEuc2lnbnVtKCkpcmV0dXJuIGsuWkVSTztmb3IodmFyIGM9YS5jbG9uZSgpLGU9dGhpcy5jbG9uZSgpLGQ9digxKSxnPXYoMCksaD12KDApLGw9digxKTswIT1jLnNpZ251bSgpOyl7Zm9yKDtjLmlzRXZlbigpOyljLnJTaGlmdFRvKDEsYyksYj8oZC5pc0V2ZW4oKSYmZy5pc0V2ZW4oKXx8KGQuYWRkVG8odGhpcyxkKSxnLnN1YlRvKGEsZykpLGQuclNoaWZ0VG8oMSxkKSk6Zy5pc0V2ZW4oKXx8Zy5zdWJUbyhhLGcpLGcuclNoaWZ0VG8oMSxnKTtmb3IoO2UuaXNFdmVuKCk7KWUuclNoaWZ0VG8oMSxlKSxiPyhoLmlzRXZlbigpJiZsLmlzRXZlbigpfHwoaC5hZGRUbyh0aGlzLGgpLGwuc3ViVG8oYSxsKSksaC5yU2hpZnRUbygxLGgpKTpsLmlzRXZlbigpfHxsLnN1YlRvKGEsbCksbC5yU2hpZnRUbygxLGwpOzA8PWMuY29tcGFyZVRvKGUpPyhjLnN1YlRvKGUsYyksYiYmZC5zdWJUbyhoLGQpLFxuZy5zdWJUbyhsLGcpKTooZS5zdWJUbyhjLGUpLGImJmguc3ViVG8oZCxoKSxsLnN1YlRvKGcsbCkpfWlmKDAhPWUuY29tcGFyZVRvKGsuT05FKSlyZXR1cm4gay5aRVJPO2lmKDA8PWwuY29tcGFyZVRvKGEpKXJldHVybiBsLnN1YnRyYWN0KGEpO2lmKDA+bC5zaWdudW0oKSlsLmFkZFRvKGEsbCk7ZWxzZSByZXR1cm4gbDtyZXR1cm4gMD5sLnNpZ251bSgpP2wuYWRkKGEpOmx9O2sucHJvdG90eXBlLnBvdz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5leHAoYSxuZXcgQSl9O2sucHJvdG90eXBlLmdjZD1mdW5jdGlvbihhKXt2YXIgYj0wPnRoaXMucz90aGlzLm5lZ2F0ZSgpOnRoaXMuY2xvbmUoKTthPTA+YS5zP2EubmVnYXRlKCk6YS5jbG9uZSgpO2lmKDA+Yi5jb21wYXJlVG8oYSkpe3ZhciBjPWIsYj1hO2E9Y312YXIgYz1iLmdldExvd2VzdFNldEJpdCgpLGU9YS5nZXRMb3dlc3RTZXRCaXQoKTtpZigwPmUpcmV0dXJuIGI7YzxlJiYoZT1jKTswPGUmJihiLnJTaGlmdFRvKGUsYiksXG5hLnJTaGlmdFRvKGUsYSkpO2Zvcig7MDxiLnNpZ251bSgpOykwPChjPWIuZ2V0TG93ZXN0U2V0Qml0KCkpJiZiLnJTaGlmdFRvKGMsYiksMDwoYz1hLmdldExvd2VzdFNldEJpdCgpKSYmYS5yU2hpZnRUbyhjLGEpLDA8PWIuY29tcGFyZVRvKGEpPyhiLnN1YlRvKGEsYiksYi5yU2hpZnRUbygxLGIpKTooYS5zdWJUbyhiLGEpLGEuclNoaWZ0VG8oMSxhKSk7MDxlJiZhLmxTaGlmdFRvKGUsYSk7cmV0dXJuIGF9O2sucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZT1mdW5jdGlvbihhKXt2YXIgYixjPXRoaXMuYWJzKCk7aWYoMT09Yy50JiZjWzBdPD10W3QubGVuZ3RoLTFdKXtmb3IoYj0wO2I8dC5sZW5ndGg7KytiKWlmKGNbMF09PXRbYl0pcmV0dXJuITA7cmV0dXJuITF9aWYoYy5pc0V2ZW4oKSlyZXR1cm4hMTtmb3IoYj0xO2I8dC5sZW5ndGg7KXtmb3IodmFyIGU9dFtiXSxkPWIrMTtkPHQubGVuZ3RoJiZlPFY7KWUqPXRbZCsrXTtmb3IoZT1jLm1vZEludChlKTtiPGQ7KWlmKDA9PWUlXG50W2IrK10pcmV0dXJuITF9cmV0dXJuIGMubWlsbGVyUmFiaW4oYSl9O2sucHJvdG90eXBlLnNxdWFyZT1mdW5jdGlvbigpe3ZhciBhPXEoKTt0aGlzLnNxdWFyZVRvKGEpO3JldHVybiBhfTt2YXIgbT1rO20ucHJvdG90eXBlLklzTmVnYXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4tMT09dGhpcy5jb21wYXJlVG8obS5aRVJPKT8hMDohMX07bS5vcF9FcXVhbGl0eT1mdW5jdGlvbihhLGIpe3JldHVybiAwPT1hLmNvbXBhcmVUbyhiKT8hMDohMX07bS5vcF9JbmVxdWFsaXR5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIDAhPWEuY29tcGFyZVRvKGIpPyEwOiExfTttLm9wX0dyZWF0ZXJUaGFuPWZ1bmN0aW9uKGEsYil7cmV0dXJuIDA8YS5jb21wYXJlVG8oYik/ITA6ITF9O20ub3BfTGVzc1RoYW49ZnVuY3Rpb24oYSxiKXtyZXR1cm4gMD5hLmNvbXBhcmVUbyhiKT8hMDohMX07bS5vcF9BZGRpdGlvbj1mdW5jdGlvbihhLGIpe3JldHVybihuZXcgbShhKSkuYWRkKG5ldyBtKGIpKX07bS5vcF9TdWJ0cmFjdGlvbj1cbmZ1bmN0aW9uKGEsYil7cmV0dXJuKG5ldyBtKGEpKS5zdWJ0cmFjdChuZXcgbShiKSl9O20uSW50MTI4TXVsPWZ1bmN0aW9uKGEsYil7cmV0dXJuKG5ldyBtKGEpKS5tdWx0aXBseShuZXcgbShiKSl9O20ub3BfRGl2aXNpb249ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5kaXZpZGUoYil9O20ucHJvdG90eXBlLlRvRG91YmxlPWZ1bmN0aW9uKCl7cmV0dXJuIHBhcnNlRmxvYXQodGhpcy50b1N0cmluZygpKX07aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIEspdmFyIEs9ZnVuY3Rpb24oYSxiKXt2YXIgYztpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpZm9yKGMgaW4gYi5wcm90b3R5cGUpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBhLnByb3RvdHlwZVtjXXx8YS5wcm90b3R5cGVbY109PU9iamVjdC5wcm90b3R5cGVbY10pYS5wcm90b3R5cGVbY109Yi5wcm90b3R5cGVbY119ZWxzZSBmb3IodmFyIGU9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYi5wcm90b3R5cGUpLFxuZD0wO2Q8ZS5sZW5ndGg7ZCsrKVwidW5kZWZpbmVkXCI9PXR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGEucHJvdG90eXBlLGVbZF0pJiZPYmplY3QuZGVmaW5lUHJvcGVydHkoYS5wcm90b3R5cGUsZVtkXSxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGIucHJvdG90eXBlLGVbZF0pKTtmb3IoYyBpbiBiKVwidW5kZWZpbmVkXCI9PXR5cGVvZiBhW2NdJiYoYVtjXT1iW2NdKTthLiRiYXNlQ3Rvcj1ifTtkLlBhdGg9ZnVuY3Rpb24oKXtyZXR1cm5bXX07ZC5QYXRocz1mdW5jdGlvbigpe3JldHVybltdfTtkLkRvdWJsZVBvaW50PWZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzO3RoaXMuWT10aGlzLlg9MDsxPT1hLmxlbmd0aD8odGhpcy5YPWFbMF0uWCx0aGlzLlk9YVswXS5ZKToyPT1hLmxlbmd0aCYmKHRoaXMuWD1hWzBdLHRoaXMuWT1hWzFdKX07ZC5Eb3VibGVQb2ludDA9ZnVuY3Rpb24oKXt0aGlzLlk9dGhpcy5YPTB9O2QuRG91YmxlUG9pbnQxPWZ1bmN0aW9uKGEpe3RoaXMuWD1cbmEuWDt0aGlzLlk9YS5ZfTtkLkRvdWJsZVBvaW50Mj1mdW5jdGlvbihhLGIpe3RoaXMuWD1hO3RoaXMuWT1ifTtkLlBvbHlOb2RlPWZ1bmN0aW9uKCl7dGhpcy5tX1BhcmVudD1udWxsO3RoaXMubV9wb2x5Z29uPW5ldyBkLlBhdGg7dGhpcy5tX2VuZHR5cGU9dGhpcy5tX2pvaW50eXBlPXRoaXMubV9JbmRleD0wO3RoaXMubV9DaGlsZHM9W107dGhpcy5Jc09wZW49ITF9O2QuUG9seU5vZGUucHJvdG90eXBlLklzSG9sZU5vZGU9ZnVuY3Rpb24oKXtmb3IodmFyIGE9ITAsYj10aGlzLm1fUGFyZW50O251bGwhPT1iOylhPSFhLGI9Yi5tX1BhcmVudDtyZXR1cm4gYX07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuQ2hpbGRDb3VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1fQ2hpbGRzLmxlbmd0aH07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuQ29udG91cj1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1fcG9seWdvbn07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuQWRkQ2hpbGQ9ZnVuY3Rpb24oYSl7dmFyIGI9XG50aGlzLm1fQ2hpbGRzLmxlbmd0aDt0aGlzLm1fQ2hpbGRzLnB1c2goYSk7YS5tX1BhcmVudD10aGlzO2EubV9JbmRleD1ifTtkLlBvbHlOb2RlLnByb3RvdHlwZS5HZXROZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIDA8dGhpcy5tX0NoaWxkcy5sZW5ndGg/dGhpcy5tX0NoaWxkc1swXTp0aGlzLkdldE5leHRTaWJsaW5nVXAoKX07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuR2V0TmV4dFNpYmxpbmdVcD1mdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy5tX1BhcmVudD9udWxsOnRoaXMubV9JbmRleD09dGhpcy5tX1BhcmVudC5tX0NoaWxkcy5sZW5ndGgtMT90aGlzLm1fUGFyZW50LkdldE5leHRTaWJsaW5nVXAoKTp0aGlzLm1fUGFyZW50Lm1fQ2hpbGRzW3RoaXMubV9JbmRleCsxXX07ZC5Qb2x5Tm9kZS5wcm90b3R5cGUuQ2hpbGRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubV9DaGlsZHN9O2QuUG9seU5vZGUucHJvdG90eXBlLlBhcmVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1fUGFyZW50fTtcbmQuUG9seU5vZGUucHJvdG90eXBlLklzSG9sZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLklzSG9sZU5vZGUoKX07ZC5Qb2x5VHJlZT1mdW5jdGlvbigpe3RoaXMubV9BbGxQb2x5cz1bXTtkLlBvbHlOb2RlLmNhbGwodGhpcyl9O2QuUG9seVRyZWUucHJvdG90eXBlLkNsZWFyPWZ1bmN0aW9uKCl7Zm9yKHZhciBhPTAsYj10aGlzLm1fQWxsUG9seXMubGVuZ3RoO2E8YjthKyspdGhpcy5tX0FsbFBvbHlzW2FdPW51bGw7dGhpcy5tX0FsbFBvbHlzLmxlbmd0aD0wO3RoaXMubV9DaGlsZHMubGVuZ3RoPTB9O2QuUG9seVRyZWUucHJvdG90eXBlLkdldEZpcnN0PWZ1bmN0aW9uKCl7cmV0dXJuIDA8dGhpcy5tX0NoaWxkcy5sZW5ndGg/dGhpcy5tX0NoaWxkc1swXTpudWxsfTtkLlBvbHlUcmVlLnByb3RvdHlwZS5Ub3RhbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1fQWxsUG9seXMubGVuZ3RofTtLKGQuUG9seVRyZWUsZC5Qb2x5Tm9kZSk7ZC5NYXRoX0Fic19JbnQ2ND1kLk1hdGhfQWJzX0ludDMyPVxuZC5NYXRoX0Fic19Eb3VibGU9ZnVuY3Rpb24oYSl7cmV0dXJuIE1hdGguYWJzKGEpfTtkLk1hdGhfTWF4X0ludDMyX0ludDMyPWZ1bmN0aW9uKGEsYil7cmV0dXJuIE1hdGgubWF4KGEsYil9O2QuQ2FzdF9JbnQzMj1wfHxHfHxKP2Z1bmN0aW9uKGEpe3JldHVybiBhfDB9OmZ1bmN0aW9uKGEpe3JldHVybn5+YX07ZC5DYXN0X0ludDY0PUU/ZnVuY3Rpb24oYSl7cmV0dXJuLTIxNDc0ODM2NDg+YXx8MjE0NzQ4MzY0NzxhPzA+YT9NYXRoLmNlaWwoYSk6TWF0aC5mbG9vcihhKTp+fmF9OkYmJlwiZnVuY3Rpb25cIj09dHlwZW9mIE51bWJlci50b0ludGVnZXI/ZnVuY3Rpb24oYSl7cmV0dXJuIE51bWJlci50b0ludGVnZXIoYSl9OlB8fEg/ZnVuY3Rpb24oYSl7cmV0dXJuIHBhcnNlSW50KGEsMTApfTpwP2Z1bmN0aW9uKGEpe3JldHVybi0yMTQ3NDgzNjQ4PmF8fDIxNDc0ODM2NDc8YT8wPmE/TWF0aC5jZWlsKGEpOk1hdGguZmxvb3IoYSk6YXwwfTpmdW5jdGlvbihhKXtyZXR1cm4gMD5hP01hdGguY2VpbChhKTpcbk1hdGguZmxvb3IoYSl9O2QuQ2xlYXI9ZnVuY3Rpb24oYSl7YS5sZW5ndGg9MH07ZC5QST0zLjE0MTU5MjY1MzU4OTc5MztkLlBJMj02LjI4MzE4NTMwNzE3OTU4NjtkLkludFBvaW50PWZ1bmN0aW9uKCl7dmFyIGE7YT1hcmd1bWVudHM7dmFyIGI9YS5sZW5ndGg7dGhpcy5ZPXRoaXMuWD0wOzI9PWI/KHRoaXMuWD1hWzBdLHRoaXMuWT1hWzFdKToxPT1iP2FbMF1pbnN0YW5jZW9mIGQuRG91YmxlUG9pbnQ/KGE9YVswXSx0aGlzLlg9ZC5DbGlwcGVyLlJvdW5kKGEuWCksdGhpcy5ZPWQuQ2xpcHBlci5Sb3VuZChhLlkpKTooYT1hWzBdLHRoaXMuWD1hLlgsdGhpcy5ZPWEuWSk6dGhpcy5ZPXRoaXMuWD0wfTtkLkludFBvaW50Lm9wX0VxdWFsaXR5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuWD09Yi5YJiZhLlk9PWIuWX07ZC5JbnRQb2ludC5vcF9JbmVxdWFsaXR5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuWCE9Yi5YfHxhLlkhPWIuWX07ZC5JbnRQb2ludDA9ZnVuY3Rpb24oKXt0aGlzLlk9XG50aGlzLlg9MH07ZC5JbnRQb2ludDE9ZnVuY3Rpb24oYSl7dGhpcy5YPWEuWDt0aGlzLlk9YS5ZfTtkLkludFBvaW50MWRwPWZ1bmN0aW9uKGEpe3RoaXMuWD1kLkNsaXBwZXIuUm91bmQoYS5YKTt0aGlzLlk9ZC5DbGlwcGVyLlJvdW5kKGEuWSl9O2QuSW50UG9pbnQyPWZ1bmN0aW9uKGEsYil7dGhpcy5YPWE7dGhpcy5ZPWJ9O2QuSW50UmVjdD1mdW5jdGlvbigpe3ZhciBhPWFyZ3VtZW50cyxiPWEubGVuZ3RoOzQ9PWI/KHRoaXMubGVmdD1hWzBdLHRoaXMudG9wPWFbMV0sdGhpcy5yaWdodD1hWzJdLHRoaXMuYm90dG9tPWFbM10pOjE9PWI/KHRoaXMubGVmdD1pci5sZWZ0LHRoaXMudG9wPWlyLnRvcCx0aGlzLnJpZ2h0PWlyLnJpZ2h0LHRoaXMuYm90dG9tPWlyLmJvdHRvbSk6dGhpcy5ib3R0b209dGhpcy5yaWdodD10aGlzLnRvcD10aGlzLmxlZnQ9MH07ZC5JbnRSZWN0MD1mdW5jdGlvbigpe3RoaXMuYm90dG9tPXRoaXMucmlnaHQ9dGhpcy50b3A9dGhpcy5sZWZ0PTB9O2QuSW50UmVjdDE9XG5mdW5jdGlvbihhKXt0aGlzLmxlZnQ9YS5sZWZ0O3RoaXMudG9wPWEudG9wO3RoaXMucmlnaHQ9YS5yaWdodDt0aGlzLmJvdHRvbT1hLmJvdHRvbX07ZC5JbnRSZWN0ND1mdW5jdGlvbihhLGIsYyxlKXt0aGlzLmxlZnQ9YTt0aGlzLnRvcD1iO3RoaXMucmlnaHQ9Yzt0aGlzLmJvdHRvbT1lfTtkLkNsaXBUeXBlPXtjdEludGVyc2VjdGlvbjowLGN0VW5pb246MSxjdERpZmZlcmVuY2U6MixjdFhvcjozfTtkLlBvbHlUeXBlPXtwdFN1YmplY3Q6MCxwdENsaXA6MX07ZC5Qb2x5RmlsbFR5cGU9e3BmdEV2ZW5PZGQ6MCxwZnROb25aZXJvOjEscGZ0UG9zaXRpdmU6MixwZnROZWdhdGl2ZTozfTtkLkpvaW5UeXBlPXtqdFNxdWFyZTowLGp0Um91bmQ6MSxqdE1pdGVyOjJ9O2QuRW5kVHlwZT17ZXRPcGVuU3F1YXJlOjAsZXRPcGVuUm91bmQ6MSxldE9wZW5CdXR0OjIsZXRDbG9zZWRMaW5lOjMsZXRDbG9zZWRQb2x5Z29uOjR9O2QuRWRnZVNpZGU9e2VzTGVmdDowLGVzUmlnaHQ6MX07ZC5EaXJlY3Rpb249XG57ZFJpZ2h0VG9MZWZ0OjAsZExlZnRUb1JpZ2h0OjF9O2QuVEVkZ2U9ZnVuY3Rpb24oKXt0aGlzLkJvdD1uZXcgZC5JbnRQb2ludDt0aGlzLkN1cnI9bmV3IGQuSW50UG9pbnQ7dGhpcy5Ub3A9bmV3IGQuSW50UG9pbnQ7dGhpcy5EZWx0YT1uZXcgZC5JbnRQb2ludDt0aGlzLkR4PTA7dGhpcy5Qb2x5VHlwPWQuUG9seVR5cGUucHRTdWJqZWN0O3RoaXMuU2lkZT1kLkVkZ2VTaWRlLmVzTGVmdDt0aGlzLk91dElkeD10aGlzLldpbmRDbnQyPXRoaXMuV2luZENudD10aGlzLldpbmREZWx0YT0wO3RoaXMuUHJldkluU0VMPXRoaXMuTmV4dEluU0VMPXRoaXMuUHJldkluQUVMPXRoaXMuTmV4dEluQUVMPXRoaXMuTmV4dEluTE1MPXRoaXMuUHJldj10aGlzLk5leHQ9bnVsbH07ZC5JbnRlcnNlY3ROb2RlPWZ1bmN0aW9uKCl7dGhpcy5FZGdlMj10aGlzLkVkZ2UxPW51bGw7dGhpcy5QdD1uZXcgZC5JbnRQb2ludH07ZC5NeUludGVyc2VjdE5vZGVTb3J0PWZ1bmN0aW9uKCl7fTtkLk15SW50ZXJzZWN0Tm9kZVNvcnQuQ29tcGFyZT1cbmZ1bmN0aW9uKGEsYil7cmV0dXJuIGIuUHQuWS1hLlB0Lll9O2QuTG9jYWxNaW5pbWE9ZnVuY3Rpb24oKXt0aGlzLlk9MDt0aGlzLk5leHQ9dGhpcy5SaWdodEJvdW5kPXRoaXMuTGVmdEJvdW5kPW51bGx9O2QuU2NhbmJlYW09ZnVuY3Rpb24oKXt0aGlzLlk9MDt0aGlzLk5leHQ9bnVsbH07ZC5PdXRSZWM9ZnVuY3Rpb24oKXt0aGlzLklkeD0wO3RoaXMuSXNPcGVuPXRoaXMuSXNIb2xlPSExO3RoaXMuUG9seU5vZGU9dGhpcy5Cb3R0b21QdD10aGlzLlB0cz10aGlzLkZpcnN0TGVmdD1udWxsfTtkLk91dFB0PWZ1bmN0aW9uKCl7dGhpcy5JZHg9MDt0aGlzLlB0PW5ldyBkLkludFBvaW50O3RoaXMuUHJldj10aGlzLk5leHQ9bnVsbH07ZC5Kb2luPWZ1bmN0aW9uKCl7dGhpcy5PdXRQdDI9dGhpcy5PdXRQdDE9bnVsbDt0aGlzLk9mZlB0PW5ldyBkLkludFBvaW50fTtkLkNsaXBwZXJCYXNlPWZ1bmN0aW9uKCl7dGhpcy5tX0N1cnJlbnRMTT10aGlzLm1fTWluaW1hTGlzdD1udWxsO3RoaXMubV9lZGdlcz1cbltdO3RoaXMuUHJlc2VydmVDb2xsaW5lYXI9dGhpcy5tX0hhc09wZW5QYXRocz10aGlzLm1fVXNlRnVsbFJhbmdlPSExO3RoaXMubV9DdXJyZW50TE09dGhpcy5tX01pbmltYUxpc3Q9bnVsbDt0aGlzLm1fSGFzT3BlblBhdGhzPXRoaXMubV9Vc2VGdWxsUmFuZ2U9ITF9O2QuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbD0tOTAwNzE5OTI1NDc0MDk5MjtkLkNsaXBwZXJCYXNlLlNraXA9LTI7ZC5DbGlwcGVyQmFzZS5VbmFzc2lnbmVkPS0xO2QuQ2xpcHBlckJhc2UudG9sZXJhbmNlPTFFLTIwO2QuQ2xpcHBlckJhc2UubG9SYW5nZT00NzQ1MzEzMjtkLkNsaXBwZXJCYXNlLmhpUmFuZ2U9MHhmZmZmZmZmZmZmZmZmO2QuQ2xpcHBlckJhc2UubmVhcl96ZXJvPWZ1bmN0aW9uKGEpe3JldHVybiBhPi1kLkNsaXBwZXJCYXNlLnRvbGVyYW5jZSYmYTxkLkNsaXBwZXJCYXNlLnRvbGVyYW5jZX07ZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWw9ZnVuY3Rpb24oYSl7cmV0dXJuIDA9PT1hLkRlbHRhLll9O1xuZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuUG9pbnRJc1ZlcnRleD1mdW5jdGlvbihhLGIpe3ZhciBjPWI7ZG97aWYoZC5JbnRQb2ludC5vcF9FcXVhbGl0eShjLlB0LGEpKXJldHVybiEwO2M9Yy5OZXh0fXdoaWxlKGMhPWIpO3JldHVybiExfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Qb2ludE9uTGluZVNlZ21lbnQ9ZnVuY3Rpb24oYSxiLGMsZSl7cmV0dXJuIGU/YS5YPT1iLlgmJmEuWT09Yi5ZfHxhLlg9PWMuWCYmYS5ZPT1jLll8fGEuWD5iLlg9PWEuWDxjLlgmJmEuWT5iLlk9PWEuWTxjLlkmJm0ub3BfRXF1YWxpdHkobS5JbnQxMjhNdWwoYS5YLWIuWCxjLlktYi5ZKSxtLkludDEyOE11bChjLlgtYi5YLGEuWS1iLlkpKTphLlg9PWIuWCYmYS5ZPT1iLll8fGEuWD09Yy5YJiZhLlk9PWMuWXx8YS5YPmIuWD09YS5YPGMuWCYmYS5ZPmIuWT09YS5ZPGMuWSYmKGEuWC1iLlgpKihjLlktYi5ZKT09KGMuWC1iLlgpKihhLlktYi5ZKX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuUG9pbnRPblBvbHlnb249XG5mdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBlPWI7Oyl7aWYodGhpcy5Qb2ludE9uTGluZVNlZ21lbnQoYSxlLlB0LGUuTmV4dC5QdCxjKSlyZXR1cm4hMDtlPWUuTmV4dDtpZihlPT1iKWJyZWFrfXJldHVybiExfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5TbG9wZXNFcXVhbD1kLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsPWZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzLGI9YS5sZW5ndGgsYyxlLGY7aWYoMz09YilyZXR1cm4gYj1hWzBdLGM9YVsxXSwoYT1hWzJdKT9tLm9wX0VxdWFsaXR5KG0uSW50MTI4TXVsKGIuRGVsdGEuWSxjLkRlbHRhLlgpLG0uSW50MTI4TXVsKGIuRGVsdGEuWCxjLkRlbHRhLlkpKTpkLkNhc3RfSW50NjQoYi5EZWx0YS5ZKmMuRGVsdGEuWCk9PWQuQ2FzdF9JbnQ2NChiLkRlbHRhLlgqYy5EZWx0YS5ZKTtpZig0PT1iKXJldHVybiBiPWFbMF0sYz1hWzFdLGU9YVsyXSwoYT1hWzNdKT9tLm9wX0VxdWFsaXR5KG0uSW50MTI4TXVsKGIuWS1jLlksYy5YLWUuWCksXG5tLkludDEyOE11bChiLlgtYy5YLGMuWS1lLlkpKTowPT09ZC5DYXN0X0ludDY0KChiLlktYy5ZKSooYy5YLWUuWCkpLWQuQ2FzdF9JbnQ2NCgoYi5YLWMuWCkqKGMuWS1lLlkpKTtiPWFbMF07Yz1hWzFdO2U9YVsyXTtmPWFbM107cmV0dXJuKGE9YVs0XSk/bS5vcF9FcXVhbGl0eShtLkludDEyOE11bChiLlktYy5ZLGUuWC1mLlgpLG0uSW50MTI4TXVsKGIuWC1jLlgsZS5ZLWYuWSkpOjA9PT1kLkNhc3RfSW50NjQoKGIuWS1jLlkpKihlLlgtZi5YKSktZC5DYXN0X0ludDY0KChiLlgtYy5YKSooZS5ZLWYuWSkpfTtkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsMz1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIGM/bS5vcF9FcXVhbGl0eShtLkludDEyOE11bChhLkRlbHRhLlksYi5EZWx0YS5YKSxtLkludDEyOE11bChhLkRlbHRhLlgsYi5EZWx0YS5ZKSk6ZC5DYXN0X0ludDY0KGEuRGVsdGEuWSpiLkRlbHRhLlgpPT1kLkNhc3RfSW50NjQoYS5EZWx0YS5YKmIuRGVsdGEuWSl9O2QuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWw0PVxuZnVuY3Rpb24oYSxiLGMsZSl7cmV0dXJuIGU/bS5vcF9FcXVhbGl0eShtLkludDEyOE11bChhLlktYi5ZLGIuWC1jLlgpLG0uSW50MTI4TXVsKGEuWC1iLlgsYi5ZLWMuWSkpOjA9PT1kLkNhc3RfSW50NjQoKGEuWS1iLlkpKihiLlgtYy5YKSktZC5DYXN0X0ludDY0KChhLlgtYi5YKSooYi5ZLWMuWSkpfTtkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsNT1mdW5jdGlvbihhLGIsYyxlLGYpe3JldHVybiBmP20ub3BfRXF1YWxpdHkobS5JbnQxMjhNdWwoYS5ZLWIuWSxjLlgtZS5YKSxtLkludDEyOE11bChhLlgtYi5YLGMuWS1lLlkpKTowPT09ZC5DYXN0X0ludDY0KChhLlktYi5ZKSooYy5YLWUuWCkpLWQuQ2FzdF9JbnQ2NCgoYS5YLWIuWCkqKGMuWS1lLlkpKX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuQ2xlYXI9ZnVuY3Rpb24oKXt0aGlzLkRpc3Bvc2VMb2NhbE1pbmltYUxpc3QoKTtmb3IodmFyIGE9MCxiPXRoaXMubV9lZGdlcy5sZW5ndGg7YTxiOysrYSl7Zm9yKHZhciBjPTAsXG5lPXRoaXMubV9lZGdlc1thXS5sZW5ndGg7YzxlOysrYyl0aGlzLm1fZWRnZXNbYV1bY109bnVsbDtkLkNsZWFyKHRoaXMubV9lZGdlc1thXSl9ZC5DbGVhcih0aGlzLm1fZWRnZXMpO3RoaXMubV9IYXNPcGVuUGF0aHM9dGhpcy5tX1VzZUZ1bGxSYW5nZT0hMX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuRGlzcG9zZUxvY2FsTWluaW1hTGlzdD1mdW5jdGlvbigpe2Zvcig7bnVsbCE9PXRoaXMubV9NaW5pbWFMaXN0Oyl7dmFyIGE9dGhpcy5tX01pbmltYUxpc3QuTmV4dDt0aGlzLm1fTWluaW1hTGlzdD1udWxsO3RoaXMubV9NaW5pbWFMaXN0PWF9dGhpcy5tX0N1cnJlbnRMTT1udWxsfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5SYW5nZVRlc3Q9ZnVuY3Rpb24oYSxiKXtpZihiLlZhbHVlKShhLlg+ZC5DbGlwcGVyQmFzZS5oaVJhbmdlfHxhLlk+ZC5DbGlwcGVyQmFzZS5oaVJhbmdlfHwtYS5YPmQuQ2xpcHBlckJhc2UuaGlSYW5nZXx8LWEuWT5kLkNsaXBwZXJCYXNlLmhpUmFuZ2UpJiZcbmQuRXJyb3IoXCJDb29yZGluYXRlIG91dHNpZGUgYWxsb3dlZCByYW5nZSBpbiBSYW5nZVRlc3QoKS5cIik7ZWxzZSBpZihhLlg+ZC5DbGlwcGVyQmFzZS5sb1JhbmdlfHxhLlk+ZC5DbGlwcGVyQmFzZS5sb1JhbmdlfHwtYS5YPmQuQ2xpcHBlckJhc2UubG9SYW5nZXx8LWEuWT5kLkNsaXBwZXJCYXNlLmxvUmFuZ2UpYi5WYWx1ZT0hMCx0aGlzLlJhbmdlVGVzdChhLGIpfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Jbml0RWRnZT1mdW5jdGlvbihhLGIsYyxlKXthLk5leHQ9YjthLlByZXY9YzthLkN1cnIuWD1lLlg7YS5DdXJyLlk9ZS5ZO2EuT3V0SWR4PS0xfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Jbml0RWRnZTI9ZnVuY3Rpb24oYSxiKXthLkN1cnIuWT49YS5OZXh0LkN1cnIuWT8oYS5Cb3QuWD1hLkN1cnIuWCxhLkJvdC5ZPWEuQ3Vyci5ZLGEuVG9wLlg9YS5OZXh0LkN1cnIuWCxhLlRvcC5ZPWEuTmV4dC5DdXJyLlkpOihhLlRvcC5YPWEuQ3Vyci5YLGEuVG9wLlk9YS5DdXJyLlksXG5hLkJvdC5YPWEuTmV4dC5DdXJyLlgsYS5Cb3QuWT1hLk5leHQuQ3Vyci5ZKTt0aGlzLlNldER4KGEpO2EuUG9seVR5cD1ifTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5GaW5kTmV4dExvY01pbj1mdW5jdGlvbihhKXtmb3IodmFyIGI7Oyl7Zm9yKDtkLkludFBvaW50Lm9wX0luZXF1YWxpdHkoYS5Cb3QsYS5QcmV2LkJvdCl8fGQuSW50UG9pbnQub3BfRXF1YWxpdHkoYS5DdXJyLGEuVG9wKTspYT1hLk5leHQ7aWYoYS5EeCE9ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsJiZhLlByZXYuRHghPWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbClicmVhaztmb3IoO2EuUHJldi5EeD09ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsOylhPWEuUHJldjtmb3IoYj1hO2EuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDspYT1hLk5leHQ7aWYoYS5Ub3AuWSE9YS5QcmV2LkJvdC5ZKXtiLlByZXYuQm90Llg8YS5Cb3QuWCYmKGE9Yik7YnJlYWt9fXJldHVybiBhfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Qcm9jZXNzQm91bmQ9XG5mdW5jdGlvbihhLGIpe3ZhciBjPWEsZT1hLGY7YS5EeD09ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsJiYoZj1iP2EuUHJldi5Cb3QuWDphLk5leHQuQm90LlgsYS5Cb3QuWCE9ZiYmdGhpcy5SZXZlcnNlSG9yaXpvbnRhbChhKSk7aWYoZS5PdXRJZHghPWQuQ2xpcHBlckJhc2UuU2tpcClpZihiKXtmb3IoO2UuVG9wLlk9PWUuTmV4dC5Cb3QuWSYmZS5OZXh0Lk91dElkeCE9ZC5DbGlwcGVyQmFzZS5Ta2lwOyllPWUuTmV4dDtpZihlLkR4PT1kLkNsaXBwZXJCYXNlLmhvcml6b250YWwmJmUuTmV4dC5PdXRJZHghPWQuQ2xpcHBlckJhc2UuU2tpcCl7Zm9yKGY9ZTtmLlByZXYuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDspZj1mLlByZXY7Zi5QcmV2LlRvcC5YPT1lLk5leHQuVG9wLlg/Ynx8KGU9Zi5QcmV2KTpmLlByZXYuVG9wLlg+ZS5OZXh0LlRvcC5YJiYoZT1mLlByZXYpfWZvcig7YSE9ZTspYS5OZXh0SW5MTUw9YS5OZXh0LGEuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbCYmXG5hIT1jJiZhLkJvdC5YIT1hLlByZXYuVG9wLlgmJnRoaXMuUmV2ZXJzZUhvcml6b250YWwoYSksYT1hLk5leHQ7YS5EeD09ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsJiZhIT1jJiZhLkJvdC5YIT1hLlByZXYuVG9wLlgmJnRoaXMuUmV2ZXJzZUhvcml6b250YWwoYSk7ZT1lLk5leHR9ZWxzZXtmb3IoO2UuVG9wLlk9PWUuUHJldi5Cb3QuWSYmZS5QcmV2Lk91dElkeCE9ZC5DbGlwcGVyQmFzZS5Ta2lwOyllPWUuUHJldjtpZihlLkR4PT1kLkNsaXBwZXJCYXNlLmhvcml6b250YWwmJmUuUHJldi5PdXRJZHghPWQuQ2xpcHBlckJhc2UuU2tpcCl7Zm9yKGY9ZTtmLk5leHQuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDspZj1mLk5leHQ7Zi5OZXh0LlRvcC5YPT1lLlByZXYuVG9wLlg/Ynx8KGU9Zi5OZXh0KTpmLk5leHQuVG9wLlg+ZS5QcmV2LlRvcC5YJiYoZT1mLk5leHQpfWZvcig7YSE9ZTspYS5OZXh0SW5MTUw9YS5QcmV2LGEuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbCYmXG5hIT1jJiZhLkJvdC5YIT1hLk5leHQuVG9wLlgmJnRoaXMuUmV2ZXJzZUhvcml6b250YWwoYSksYT1hLlByZXY7YS5EeD09ZC5DbGlwcGVyQmFzZS5ob3Jpem9udGFsJiZhIT1jJiZhLkJvdC5YIT1hLk5leHQuVG9wLlgmJnRoaXMuUmV2ZXJzZUhvcml6b250YWwoYSk7ZT1lLlByZXZ9aWYoZS5PdXRJZHg9PWQuQ2xpcHBlckJhc2UuU2tpcCl7YT1lO2lmKGIpe2Zvcig7YS5Ub3AuWT09YS5OZXh0LkJvdC5ZOylhPWEuTmV4dDtmb3IoO2EhPWUmJmEuRHg9PWQuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDspYT1hLlByZXZ9ZWxzZXtmb3IoO2EuVG9wLlk9PWEuUHJldi5Cb3QuWTspYT1hLlByZXY7Zm9yKDthIT1lJiZhLkR4PT1kLkNsaXBwZXJCYXNlLmhvcml6b250YWw7KWE9YS5OZXh0fWE9PWU/ZT1iP2EuTmV4dDphLlByZXY6KGE9Yj9lLk5leHQ6ZS5QcmV2LGM9bmV3IGQuTG9jYWxNaW5pbWEsYy5OZXh0PW51bGwsYy5ZPWEuQm90LlksYy5MZWZ0Qm91bmQ9bnVsbCxjLlJpZ2h0Qm91bmQ9XG5hLGMuUmlnaHRCb3VuZC5XaW5kRGVsdGE9MCxlPXRoaXMuUHJvY2Vzc0JvdW5kKGMuUmlnaHRCb3VuZCxiKSx0aGlzLkluc2VydExvY2FsTWluaW1hKGMpKX1yZXR1cm4gZX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuQWRkUGF0aD1mdW5jdGlvbihhLGIsYyl7Y3x8YiE9ZC5Qb2x5VHlwZS5wdENsaXB8fGQuRXJyb3IoXCJBZGRQYXRoOiBPcGVuIHBhdGhzIG11c3QgYmUgc3ViamVjdC5cIik7dmFyIGU9YS5sZW5ndGgtMTtpZihjKWZvcig7MDxlJiZkLkludFBvaW50Lm9wX0VxdWFsaXR5KGFbZV0sYVswXSk7KS0tZTtmb3IoOzA8ZSYmZC5JbnRQb2ludC5vcF9FcXVhbGl0eShhW2VdLGFbZS0xXSk7KS0tZTtpZihjJiYyPmV8fCFjJiYxPmUpcmV0dXJuITE7Zm9yKHZhciBmPVtdLGc9MDtnPD1lO2crKylmLnB1c2gobmV3IGQuVEVkZ2UpO3ZhciBoPSEwO2ZbMV0uQ3Vyci5YPWFbMV0uWDtmWzFdLkN1cnIuWT1hWzFdLlk7dmFyIGw9e1ZhbHVlOnRoaXMubV9Vc2VGdWxsUmFuZ2V9O3RoaXMuUmFuZ2VUZXN0KGFbMF0sXG5sKTt0aGlzLm1fVXNlRnVsbFJhbmdlPWwuVmFsdWU7bC5WYWx1ZT10aGlzLm1fVXNlRnVsbFJhbmdlO3RoaXMuUmFuZ2VUZXN0KGFbZV0sbCk7dGhpcy5tX1VzZUZ1bGxSYW5nZT1sLlZhbHVlO3RoaXMuSW5pdEVkZ2UoZlswXSxmWzFdLGZbZV0sYVswXSk7dGhpcy5Jbml0RWRnZShmW2VdLGZbMF0sZltlLTFdLGFbZV0pO2ZvcihnPWUtMTsxPD1nOy0tZylsLlZhbHVlPXRoaXMubV9Vc2VGdWxsUmFuZ2UsdGhpcy5SYW5nZVRlc3QoYVtnXSxsKSx0aGlzLm1fVXNlRnVsbFJhbmdlPWwuVmFsdWUsdGhpcy5Jbml0RWRnZShmW2ddLGZbZysxXSxmW2ctMV0sYVtnXSk7Zm9yKGc9YT1lPWZbMF07OylpZihkLkludFBvaW50Lm9wX0VxdWFsaXR5KGEuQ3VycixhLk5leHQuQ3Vycikpe2lmKGE9PWEuTmV4dClicmVhazthPT1lJiYoZT1hLk5leHQpO2c9YT10aGlzLlJlbW92ZUVkZ2UoYSl9ZWxzZXtpZihhLlByZXY9PWEuTmV4dClicmVhaztlbHNlIGlmKGMmJmQuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWwoYS5QcmV2LkN1cnIsXG5hLkN1cnIsYS5OZXh0LkN1cnIsdGhpcy5tX1VzZUZ1bGxSYW5nZSkmJighdGhpcy5QcmVzZXJ2ZUNvbGxpbmVhcnx8IXRoaXMuUHQySXNCZXR3ZWVuUHQxQW5kUHQzKGEuUHJldi5DdXJyLGEuQ3VycixhLk5leHQuQ3VycikpKXthPT1lJiYoZT1hLk5leHQpO2E9dGhpcy5SZW1vdmVFZGdlKGEpO2c9YT1hLlByZXY7Y29udGludWV9YT1hLk5leHQ7aWYoYT09ZylicmVha31pZighYyYmYT09YS5OZXh0fHxjJiZhLlByZXY9PWEuTmV4dClyZXR1cm4hMTtjfHwodGhpcy5tX0hhc09wZW5QYXRocz0hMCxlLlByZXYuT3V0SWR4PWQuQ2xpcHBlckJhc2UuU2tpcCk7YT1lO2RvIHRoaXMuSW5pdEVkZ2UyKGEsYiksYT1hLk5leHQsaCYmYS5DdXJyLlkhPWUuQ3Vyci5ZJiYoaD0hMSk7d2hpbGUoYSE9ZSk7aWYoaCl7aWYoYylyZXR1cm4hMTthLlByZXYuT3V0SWR4PWQuQ2xpcHBlckJhc2UuU2tpcDthLlByZXYuQm90Llg8YS5QcmV2LlRvcC5YJiZ0aGlzLlJldmVyc2VIb3Jpem9udGFsKGEuUHJldik7XG5iPW5ldyBkLkxvY2FsTWluaW1hO2IuTmV4dD1udWxsO2IuWT1hLkJvdC5ZO2IuTGVmdEJvdW5kPW51bGw7Yi5SaWdodEJvdW5kPWE7Yi5SaWdodEJvdW5kLlNpZGU9ZC5FZGdlU2lkZS5lc1JpZ2h0O2ZvcihiLlJpZ2h0Qm91bmQuV2luZERlbHRhPTA7YS5OZXh0Lk91dElkeCE9ZC5DbGlwcGVyQmFzZS5Ta2lwOylhLk5leHRJbkxNTD1hLk5leHQsYS5Cb3QuWCE9YS5QcmV2LlRvcC5YJiZ0aGlzLlJldmVyc2VIb3Jpem9udGFsKGEpLGE9YS5OZXh0O3RoaXMuSW5zZXJ0TG9jYWxNaW5pbWEoYik7dGhpcy5tX2VkZ2VzLnB1c2goZik7cmV0dXJuITB9dGhpcy5tX2VkZ2VzLnB1c2goZik7Zm9yKGg9bnVsbDs7KXthPXRoaXMuRmluZE5leHRMb2NNaW4oYSk7aWYoYT09aClicmVhaztlbHNlIG51bGw9PWgmJihoPWEpO2I9bmV3IGQuTG9jYWxNaW5pbWE7Yi5OZXh0PW51bGw7Yi5ZPWEuQm90Llk7YS5EeDxhLlByZXYuRHg/KGIuTGVmdEJvdW5kPWEuUHJldixiLlJpZ2h0Qm91bmQ9YSxmPSExKTpcbihiLkxlZnRCb3VuZD1hLGIuUmlnaHRCb3VuZD1hLlByZXYsZj0hMCk7Yi5MZWZ0Qm91bmQuU2lkZT1kLkVkZ2VTaWRlLmVzTGVmdDtiLlJpZ2h0Qm91bmQuU2lkZT1kLkVkZ2VTaWRlLmVzUmlnaHQ7Yi5MZWZ0Qm91bmQuV2luZERlbHRhPWM/Yi5MZWZ0Qm91bmQuTmV4dD09Yi5SaWdodEJvdW5kPy0xOjE6MDtiLlJpZ2h0Qm91bmQuV2luZERlbHRhPS1iLkxlZnRCb3VuZC5XaW5kRGVsdGE7YT10aGlzLlByb2Nlc3NCb3VuZChiLkxlZnRCb3VuZCxmKTtlPXRoaXMuUHJvY2Vzc0JvdW5kKGIuUmlnaHRCb3VuZCwhZik7Yi5MZWZ0Qm91bmQuT3V0SWR4PT1kLkNsaXBwZXJCYXNlLlNraXA/Yi5MZWZ0Qm91bmQ9bnVsbDpiLlJpZ2h0Qm91bmQuT3V0SWR4PT1kLkNsaXBwZXJCYXNlLlNraXAmJihiLlJpZ2h0Qm91bmQ9bnVsbCk7dGhpcy5JbnNlcnRMb2NhbE1pbmltYShiKTtmfHwoYT1lKX1yZXR1cm4hMH07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuQWRkUGF0aHM9ZnVuY3Rpb24oYSxiLFxuYyl7Zm9yKHZhciBlPSExLGQ9MCxnPWEubGVuZ3RoO2Q8ZzsrK2QpdGhpcy5BZGRQYXRoKGFbZF0sYixjKSYmKGU9ITApO3JldHVybiBlfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5QdDJJc0JldHdlZW5QdDFBbmRQdDM9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBkLkludFBvaW50Lm9wX0VxdWFsaXR5KGEsYyl8fGQuSW50UG9pbnQub3BfRXF1YWxpdHkoYSxiKXx8ZC5JbnRQb2ludC5vcF9FcXVhbGl0eShjLGIpPyExOmEuWCE9Yy5YP2IuWD5hLlg9PWIuWDxjLlg6Yi5ZPmEuWT09Yi5ZPGMuWX07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuUmVtb3ZlRWRnZT1mdW5jdGlvbihhKXthLlByZXYuTmV4dD1hLk5leHQ7YS5OZXh0LlByZXY9YS5QcmV2O3ZhciBiPWEuTmV4dDthLlByZXY9bnVsbDtyZXR1cm4gYn07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuU2V0RHg9ZnVuY3Rpb24oYSl7YS5EZWx0YS5YPWEuVG9wLlgtYS5Cb3QuWDthLkRlbHRhLlk9YS5Ub3AuWS1hLkJvdC5ZO2EuRHg9XG4wPT09YS5EZWx0YS5ZP2QuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDphLkRlbHRhLlgvYS5EZWx0YS5ZfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5JbnNlcnRMb2NhbE1pbmltYT1mdW5jdGlvbihhKXtpZihudWxsPT09dGhpcy5tX01pbmltYUxpc3QpdGhpcy5tX01pbmltYUxpc3Q9YTtlbHNlIGlmKGEuWT49dGhpcy5tX01pbmltYUxpc3QuWSlhLk5leHQ9dGhpcy5tX01pbmltYUxpc3QsdGhpcy5tX01pbmltYUxpc3Q9YTtlbHNle2Zvcih2YXIgYj10aGlzLm1fTWluaW1hTGlzdDtudWxsIT09Yi5OZXh0JiZhLlk8Yi5OZXh0Llk7KWI9Yi5OZXh0O2EuTmV4dD1iLk5leHQ7Yi5OZXh0PWF9fTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5Qb3BMb2NhbE1pbmltYT1mdW5jdGlvbigpe251bGwhPT10aGlzLm1fQ3VycmVudExNJiYodGhpcy5tX0N1cnJlbnRMTT10aGlzLm1fQ3VycmVudExNLk5leHQpfTtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5SZXZlcnNlSG9yaXpvbnRhbD1mdW5jdGlvbihhKXt2YXIgYj1cbmEuVG9wLlg7YS5Ub3AuWD1hLkJvdC5YO2EuQm90Llg9Yn07ZC5DbGlwcGVyQmFzZS5wcm90b3R5cGUuUmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLm1fQ3VycmVudExNPXRoaXMubV9NaW5pbWFMaXN0O2lmKG51bGwhPXRoaXMubV9DdXJyZW50TE0pZm9yKHZhciBhPXRoaXMubV9NaW5pbWFMaXN0O251bGwhPWE7KXt2YXIgYj1hLkxlZnRCb3VuZDtudWxsIT1iJiYoYi5DdXJyLlg9Yi5Cb3QuWCxiLkN1cnIuWT1iLkJvdC5ZLGIuU2lkZT1kLkVkZ2VTaWRlLmVzTGVmdCxiLk91dElkeD1kLkNsaXBwZXJCYXNlLlVuYXNzaWduZWQpO2I9YS5SaWdodEJvdW5kO251bGwhPWImJihiLkN1cnIuWD1iLkJvdC5YLGIuQ3Vyci5ZPWIuQm90LlksYi5TaWRlPWQuRWRnZVNpZGUuZXNSaWdodCxiLk91dElkeD1kLkNsaXBwZXJCYXNlLlVuYXNzaWduZWQpO2E9YS5OZXh0fX07ZC5DbGlwcGVyPWZ1bmN0aW9uKGEpe1widW5kZWZpbmVkXCI9PXR5cGVvZiBhJiYoYT0wKTt0aGlzLm1fUG9seU91dHM9bnVsbDt0aGlzLm1fQ2xpcFR5cGU9XG5kLkNsaXBUeXBlLmN0SW50ZXJzZWN0aW9uO3RoaXMubV9JbnRlcnNlY3ROb2RlQ29tcGFyZXI9dGhpcy5tX0ludGVyc2VjdExpc3Q9dGhpcy5tX1NvcnRlZEVkZ2VzPXRoaXMubV9BY3RpdmVFZGdlcz10aGlzLm1fU2NhbmJlYW09bnVsbDt0aGlzLm1fRXhlY3V0ZUxvY2tlZD0hMTt0aGlzLm1fU3ViakZpbGxUeXBlPXRoaXMubV9DbGlwRmlsbFR5cGU9ZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZDt0aGlzLm1fR2hvc3RKb2lucz10aGlzLm1fSm9pbnM9bnVsbDt0aGlzLlN0cmljdGx5U2ltcGxlPXRoaXMuUmV2ZXJzZVNvbHV0aW9uPXRoaXMubV9Vc2luZ1BvbHlUcmVlPSExO2QuQ2xpcHBlckJhc2UuY2FsbCh0aGlzKTt0aGlzLm1fU29ydGVkRWRnZXM9dGhpcy5tX0FjdGl2ZUVkZ2VzPXRoaXMubV9TY2FuYmVhbT1udWxsO3RoaXMubV9JbnRlcnNlY3RMaXN0PVtdO3RoaXMubV9JbnRlcnNlY3ROb2RlQ29tcGFyZXI9ZC5NeUludGVyc2VjdE5vZGVTb3J0LkNvbXBhcmU7dGhpcy5tX1VzaW5nUG9seVRyZWU9XG50aGlzLm1fRXhlY3V0ZUxvY2tlZD0hMTt0aGlzLm1fUG9seU91dHM9W107dGhpcy5tX0pvaW5zPVtdO3RoaXMubV9HaG9zdEpvaW5zPVtdO3RoaXMuUmV2ZXJzZVNvbHV0aW9uPTAhPT0oMSZhKTt0aGlzLlN0cmljdGx5U2ltcGxlPTAhPT0oMiZhKTt0aGlzLlByZXNlcnZlQ29sbGluZWFyPTAhPT0oNCZhKX07ZC5DbGlwcGVyLmlvUmV2ZXJzZVNvbHV0aW9uPTE7ZC5DbGlwcGVyLmlvU3RyaWN0bHlTaW1wbGU9MjtkLkNsaXBwZXIuaW9QcmVzZXJ2ZUNvbGxpbmVhcj00O2QuQ2xpcHBlci5wcm90b3R5cGUuQ2xlYXI9ZnVuY3Rpb24oKXswIT09dGhpcy5tX2VkZ2VzLmxlbmd0aCYmKHRoaXMuRGlzcG9zZUFsbFBvbHlQdHMoKSxkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5DbGVhci5jYWxsKHRoaXMpKX07ZC5DbGlwcGVyLnByb3RvdHlwZS5EaXNwb3NlU2NhbmJlYW1MaXN0PWZ1bmN0aW9uKCl7Zm9yKDtudWxsIT09dGhpcy5tX1NjYW5iZWFtOyl7dmFyIGE9dGhpcy5tX1NjYW5iZWFtLk5leHQ7XG50aGlzLm1fU2NhbmJlYW09bnVsbDt0aGlzLm1fU2NhbmJlYW09YX19O2QuQ2xpcHBlci5wcm90b3R5cGUuUmVzZXQ9ZnVuY3Rpb24oKXtkLkNsaXBwZXJCYXNlLnByb3RvdHlwZS5SZXNldC5jYWxsKHRoaXMpO3RoaXMubV9Tb3J0ZWRFZGdlcz10aGlzLm1fQWN0aXZlRWRnZXM9dGhpcy5tX1NjYW5iZWFtPW51bGw7Zm9yKHZhciBhPXRoaXMubV9NaW5pbWFMaXN0O251bGwhPT1hOyl0aGlzLkluc2VydFNjYW5iZWFtKGEuWSksYT1hLk5leHR9O2QuQ2xpcHBlci5wcm90b3R5cGUuSW5zZXJ0U2NhbmJlYW09ZnVuY3Rpb24oYSl7aWYobnVsbD09PXRoaXMubV9TY2FuYmVhbSl0aGlzLm1fU2NhbmJlYW09bmV3IGQuU2NhbmJlYW0sdGhpcy5tX1NjYW5iZWFtLk5leHQ9bnVsbCx0aGlzLm1fU2NhbmJlYW0uWT1hO2Vsc2UgaWYoYT50aGlzLm1fU2NhbmJlYW0uWSl7dmFyIGI9bmV3IGQuU2NhbmJlYW07Yi5ZPWE7Yi5OZXh0PXRoaXMubV9TY2FuYmVhbTt0aGlzLm1fU2NhbmJlYW09Yn1lbHNle2Zvcih2YXIgYz1cbnRoaXMubV9TY2FuYmVhbTtudWxsIT09Yy5OZXh0JiZhPD1jLk5leHQuWTspYz1jLk5leHQ7YSE9Yy5ZJiYoYj1uZXcgZC5TY2FuYmVhbSxiLlk9YSxiLk5leHQ9Yy5OZXh0LGMuTmV4dD1iKX19O2QuQ2xpcHBlci5wcm90b3R5cGUuRXhlY3V0ZT1mdW5jdGlvbigpe3ZhciBhPWFyZ3VtZW50cyxiPWEubGVuZ3RoLGM9YVsxXWluc3RhbmNlb2YgZC5Qb2x5VHJlZTtpZig0IT1ifHxjKXtpZig0PT1iJiZjKXt2YXIgYj1hWzBdLGU9YVsxXSxjPWFbMl0sYT1hWzNdO2lmKHRoaXMubV9FeGVjdXRlTG9ja2VkKXJldHVybiExO3RoaXMubV9FeGVjdXRlTG9ja2VkPSEwO3RoaXMubV9TdWJqRmlsbFR5cGU9Yzt0aGlzLm1fQ2xpcEZpbGxUeXBlPWE7dGhpcy5tX0NsaXBUeXBlPWI7dGhpcy5tX1VzaW5nUG9seVRyZWU9ITA7dHJ5eyhmPXRoaXMuRXhlY3V0ZUludGVybmFsKCkpJiZ0aGlzLkJ1aWxkUmVzdWx0MihlKX1maW5hbGx5e3RoaXMuRGlzcG9zZUFsbFBvbHlQdHMoKSx0aGlzLm1fRXhlY3V0ZUxvY2tlZD1cbiExfXJldHVybiBmfWlmKDI9PWImJiFjfHwyPT1iJiZjKXJldHVybiBiPWFbMF0sZT1hWzFdLHRoaXMuRXhlY3V0ZShiLGUsZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZCxkLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkKX1lbHNle2I9YVswXTtlPWFbMV07Yz1hWzJdO2E9YVszXTtpZih0aGlzLm1fRXhlY3V0ZUxvY2tlZClyZXR1cm4hMTt0aGlzLm1fSGFzT3BlblBhdGhzJiZkLkVycm9yKFwiRXJyb3I6IFBvbHlUcmVlIHN0cnVjdCBpcyBuZWVkIGZvciBvcGVuIHBhdGggY2xpcHBpbmcuXCIpO3RoaXMubV9FeGVjdXRlTG9ja2VkPSEwO2QuQ2xlYXIoZSk7dGhpcy5tX1N1YmpGaWxsVHlwZT1jO3RoaXMubV9DbGlwRmlsbFR5cGU9YTt0aGlzLm1fQ2xpcFR5cGU9Yjt0aGlzLm1fVXNpbmdQb2x5VHJlZT0hMTt0cnl7dmFyIGY9dGhpcy5FeGVjdXRlSW50ZXJuYWwoKTtmJiZ0aGlzLkJ1aWxkUmVzdWx0KGUpfWZpbmFsbHl7dGhpcy5EaXNwb3NlQWxsUG9seVB0cygpLHRoaXMubV9FeGVjdXRlTG9ja2VkPVxuITF9cmV0dXJuIGZ9fTtkLkNsaXBwZXIucHJvdG90eXBlLkZpeEhvbGVMaW5rYWdlPWZ1bmN0aW9uKGEpe2lmKG51bGwhPT1hLkZpcnN0TGVmdCYmKGEuSXNIb2xlPT1hLkZpcnN0TGVmdC5Jc0hvbGV8fG51bGw9PT1hLkZpcnN0TGVmdC5QdHMpKXtmb3IodmFyIGI9YS5GaXJzdExlZnQ7bnVsbCE9PWImJihiLklzSG9sZT09YS5Jc0hvbGV8fG51bGw9PT1iLlB0cyk7KWI9Yi5GaXJzdExlZnQ7YS5GaXJzdExlZnQ9Yn19O2QuQ2xpcHBlci5wcm90b3R5cGUuRXhlY3V0ZUludGVybmFsPWZ1bmN0aW9uKCl7dHJ5e3RoaXMuUmVzZXQoKTtpZihudWxsPT09dGhpcy5tX0N1cnJlbnRMTSlyZXR1cm4hMTt2YXIgYT10aGlzLlBvcFNjYW5iZWFtKCk7ZG97dGhpcy5JbnNlcnRMb2NhbE1pbmltYUludG9BRUwoYSk7ZC5DbGVhcih0aGlzLm1fR2hvc3RKb2lucyk7dGhpcy5Qcm9jZXNzSG9yaXpvbnRhbHMoITEpO2lmKG51bGw9PT10aGlzLm1fU2NhbmJlYW0pYnJlYWs7dmFyIGI9dGhpcy5Qb3BTY2FuYmVhbSgpO1xuaWYoIXRoaXMuUHJvY2Vzc0ludGVyc2VjdGlvbnMoYSxiKSlyZXR1cm4hMTt0aGlzLlByb2Nlc3NFZGdlc0F0VG9wT2ZTY2FuYmVhbShiKTthPWJ9d2hpbGUobnVsbCE9PXRoaXMubV9TY2FuYmVhbXx8bnVsbCE9PXRoaXMubV9DdXJyZW50TE0pO2Zvcih2YXIgYT0wLGM9dGhpcy5tX1BvbHlPdXRzLmxlbmd0aDthPGM7YSsrKXt2YXIgZT10aGlzLm1fUG9seU91dHNbYV07bnVsbD09PWUuUHRzfHxlLklzT3Blbnx8KGUuSXNIb2xlXnRoaXMuUmV2ZXJzZVNvbHV0aW9uKT09MDx0aGlzLkFyZWEoZSkmJnRoaXMuUmV2ZXJzZVBvbHlQdExpbmtzKGUuUHRzKX10aGlzLkpvaW5Db21tb25FZGdlcygpO2E9MDtmb3IoYz10aGlzLm1fUG9seU91dHMubGVuZ3RoO2E8YzthKyspZT10aGlzLm1fUG9seU91dHNbYV0sbnVsbD09PWUuUHRzfHxlLklzT3Blbnx8dGhpcy5GaXh1cE91dFBvbHlnb24oZSk7dGhpcy5TdHJpY3RseVNpbXBsZSYmdGhpcy5Eb1NpbXBsZVBvbHlnb25zKCk7cmV0dXJuITB9ZmluYWxseXtkLkNsZWFyKHRoaXMubV9Kb2lucyksXG5kLkNsZWFyKHRoaXMubV9HaG9zdEpvaW5zKX19O2QuQ2xpcHBlci5wcm90b3R5cGUuUG9wU2NhbmJlYW09ZnVuY3Rpb24oKXt2YXIgYT10aGlzLm1fU2NhbmJlYW0uWTt0aGlzLm1fU2NhbmJlYW09dGhpcy5tX1NjYW5iZWFtLk5leHQ7cmV0dXJuIGF9O2QuQ2xpcHBlci5wcm90b3R5cGUuRGlzcG9zZUFsbFBvbHlQdHM9ZnVuY3Rpb24oKXtmb3IodmFyIGE9MCxiPXRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7YTxiOysrYSl0aGlzLkRpc3Bvc2VPdXRSZWMoYSk7ZC5DbGVhcih0aGlzLm1fUG9seU91dHMpfTtkLkNsaXBwZXIucHJvdG90eXBlLkRpc3Bvc2VPdXRSZWM9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5tX1BvbHlPdXRzW2FdO251bGwhPT1iLlB0cyYmdGhpcy5EaXNwb3NlT3V0UHRzKGIuUHRzKTt0aGlzLm1fUG9seU91dHNbYV09bnVsbH07ZC5DbGlwcGVyLnByb3RvdHlwZS5EaXNwb3NlT3V0UHRzPWZ1bmN0aW9uKGEpe2lmKG51bGwhPT1hKWZvcihhLlByZXYuTmV4dD1udWxsO251bGwhPT1cbmE7KWE9YS5OZXh0fTtkLkNsaXBwZXIucHJvdG90eXBlLkFkZEpvaW49ZnVuY3Rpb24oYSxiLGMpe3ZhciBlPW5ldyBkLkpvaW47ZS5PdXRQdDE9YTtlLk91dFB0Mj1iO2UuT2ZmUHQuWD1jLlg7ZS5PZmZQdC5ZPWMuWTt0aGlzLm1fSm9pbnMucHVzaChlKX07ZC5DbGlwcGVyLnByb3RvdHlwZS5BZGRHaG9zdEpvaW49ZnVuY3Rpb24oYSxiKXt2YXIgYz1uZXcgZC5Kb2luO2MuT3V0UHQxPWE7Yy5PZmZQdC5YPWIuWDtjLk9mZlB0Llk9Yi5ZO3RoaXMubV9HaG9zdEpvaW5zLnB1c2goYyl9O2QuQ2xpcHBlci5wcm90b3R5cGUuSW5zZXJ0TG9jYWxNaW5pbWFJbnRvQUVMPWZ1bmN0aW9uKGEpe2Zvcig7bnVsbCE9PXRoaXMubV9DdXJyZW50TE0mJnRoaXMubV9DdXJyZW50TE0uWT09YTspe3ZhciBiPXRoaXMubV9DdXJyZW50TE0uTGVmdEJvdW5kLGM9dGhpcy5tX0N1cnJlbnRMTS5SaWdodEJvdW5kO3RoaXMuUG9wTG9jYWxNaW5pbWEoKTt2YXIgZT1udWxsO251bGw9PT1iPyh0aGlzLkluc2VydEVkZ2VJbnRvQUVMKGMsXG5udWxsKSx0aGlzLlNldFdpbmRpbmdDb3VudChjKSx0aGlzLklzQ29udHJpYnV0aW5nKGMpJiYoZT10aGlzLkFkZE91dFB0KGMsYy5Cb3QpKSk6KG51bGw9PWM/KHRoaXMuSW5zZXJ0RWRnZUludG9BRUwoYixudWxsKSx0aGlzLlNldFdpbmRpbmdDb3VudChiKSx0aGlzLklzQ29udHJpYnV0aW5nKGIpJiYoZT10aGlzLkFkZE91dFB0KGIsYi5Cb3QpKSk6KHRoaXMuSW5zZXJ0RWRnZUludG9BRUwoYixudWxsKSx0aGlzLkluc2VydEVkZ2VJbnRvQUVMKGMsYiksdGhpcy5TZXRXaW5kaW5nQ291bnQoYiksYy5XaW5kQ250PWIuV2luZENudCxjLldpbmRDbnQyPWIuV2luZENudDIsdGhpcy5Jc0NvbnRyaWJ1dGluZyhiKSYmKGU9dGhpcy5BZGRMb2NhbE1pblBvbHkoYixjLGIuQm90KSkpLHRoaXMuSW5zZXJ0U2NhbmJlYW0oYi5Ub3AuWSkpO251bGwhPWMmJihkLkNsaXBwZXJCYXNlLklzSG9yaXpvbnRhbChjKT90aGlzLkFkZEVkZ2VUb1NFTChjKTp0aGlzLkluc2VydFNjYW5iZWFtKGMuVG9wLlkpKTtcbmlmKG51bGwhPWImJm51bGwhPWMpe2lmKG51bGwhPT1lJiZkLkNsaXBwZXJCYXNlLklzSG9yaXpvbnRhbChjKSYmMDx0aGlzLm1fR2hvc3RKb2lucy5sZW5ndGgmJjAhPT1jLldpbmREZWx0YSlmb3IodmFyIGY9MCxnPXRoaXMubV9HaG9zdEpvaW5zLmxlbmd0aDtmPGc7ZisrKXt2YXIgaD10aGlzLm1fR2hvc3RKb2luc1tmXTt0aGlzLkhvcnpTZWdtZW50c092ZXJsYXAoaC5PdXRQdDEuUHQsaC5PZmZQdCxjLkJvdCxjLlRvcCkmJnRoaXMuQWRkSm9pbihoLk91dFB0MSxlLGguT2ZmUHQpfTA8PWIuT3V0SWR4JiZudWxsIT09Yi5QcmV2SW5BRUwmJmIuUHJldkluQUVMLkN1cnIuWD09Yi5Cb3QuWCYmMDw9Yi5QcmV2SW5BRUwuT3V0SWR4JiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGIuUHJldkluQUVMLGIsdGhpcy5tX1VzZUZ1bGxSYW5nZSkmJjAhPT1iLldpbmREZWx0YSYmMCE9PWIuUHJldkluQUVMLldpbmREZWx0YSYmKGY9dGhpcy5BZGRPdXRQdChiLlByZXZJbkFFTCxiLkJvdCksXG50aGlzLkFkZEpvaW4oZSxmLGIuVG9wKSk7aWYoYi5OZXh0SW5BRUwhPWMmJigwPD1jLk91dElkeCYmMDw9Yy5QcmV2SW5BRUwuT3V0SWR4JiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGMuUHJldkluQUVMLGMsdGhpcy5tX1VzZUZ1bGxSYW5nZSkmJjAhPT1jLldpbmREZWx0YSYmMCE9PWMuUHJldkluQUVMLldpbmREZWx0YSYmKGY9dGhpcy5BZGRPdXRQdChjLlByZXZJbkFFTCxjLkJvdCksdGhpcy5BZGRKb2luKGUsZixjLlRvcCkpLGU9Yi5OZXh0SW5BRUwsbnVsbCE9PWUpKWZvcig7ZSE9YzspdGhpcy5JbnRlcnNlY3RFZGdlcyhjLGUsYi5DdXJyLCExKSxlPWUuTmV4dEluQUVMfX19O2QuQ2xpcHBlci5wcm90b3R5cGUuSW5zZXJ0RWRnZUludG9BRUw9ZnVuY3Rpb24oYSxiKXtpZihudWxsPT09dGhpcy5tX0FjdGl2ZUVkZ2VzKWEuUHJldkluQUVMPW51bGwsYS5OZXh0SW5BRUw9bnVsbCx0aGlzLm1fQWN0aXZlRWRnZXM9YTtlbHNlIGlmKG51bGw9PT1iJiZ0aGlzLkUySW5zZXJ0c0JlZm9yZUUxKHRoaXMubV9BY3RpdmVFZGdlcyxcbmEpKWEuUHJldkluQUVMPW51bGwsYS5OZXh0SW5BRUw9dGhpcy5tX0FjdGl2ZUVkZ2VzLHRoaXMubV9BY3RpdmVFZGdlcz10aGlzLm1fQWN0aXZlRWRnZXMuUHJldkluQUVMPWE7ZWxzZXtudWxsPT09YiYmKGI9dGhpcy5tX0FjdGl2ZUVkZ2VzKTtmb3IoO251bGwhPT1iLk5leHRJbkFFTCYmIXRoaXMuRTJJbnNlcnRzQmVmb3JlRTEoYi5OZXh0SW5BRUwsYSk7KWI9Yi5OZXh0SW5BRUw7YS5OZXh0SW5BRUw9Yi5OZXh0SW5BRUw7bnVsbCE9PWIuTmV4dEluQUVMJiYoYi5OZXh0SW5BRUwuUHJldkluQUVMPWEpO2EuUHJldkluQUVMPWI7Yi5OZXh0SW5BRUw9YX19O2QuQ2xpcHBlci5wcm90b3R5cGUuRTJJbnNlcnRzQmVmb3JlRTE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYi5DdXJyLlg9PWEuQ3Vyci5YP2IuVG9wLlk+YS5Ub3AuWT9iLlRvcC5YPGQuQ2xpcHBlci5Ub3BYKGEsYi5Ub3AuWSk6YS5Ub3AuWD5kLkNsaXBwZXIuVG9wWChiLGEuVG9wLlkpOmIuQ3Vyci5YPGEuQ3Vyci5YfTtkLkNsaXBwZXIucHJvdG90eXBlLklzRXZlbk9kZEZpbGxUeXBlPVxuZnVuY3Rpb24oYSl7cmV0dXJuIGEuUG9seVR5cD09ZC5Qb2x5VHlwZS5wdFN1YmplY3Q/dGhpcy5tX1N1YmpGaWxsVHlwZT09ZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZDp0aGlzLm1fQ2xpcEZpbGxUeXBlPT1kLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkfTtkLkNsaXBwZXIucHJvdG90eXBlLklzRXZlbk9kZEFsdEZpbGxUeXBlPWZ1bmN0aW9uKGEpe3JldHVybiBhLlBvbHlUeXA9PWQuUG9seVR5cGUucHRTdWJqZWN0P3RoaXMubV9DbGlwRmlsbFR5cGU9PWQuUG9seUZpbGxUeXBlLnBmdEV2ZW5PZGQ6dGhpcy5tX1N1YmpGaWxsVHlwZT09ZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZH07ZC5DbGlwcGVyLnByb3RvdHlwZS5Jc0NvbnRyaWJ1dGluZz1mdW5jdGlvbihhKXt2YXIgYixjO2EuUG9seVR5cD09ZC5Qb2x5VHlwZS5wdFN1YmplY3Q/KGI9dGhpcy5tX1N1YmpGaWxsVHlwZSxjPXRoaXMubV9DbGlwRmlsbFR5cGUpOihiPXRoaXMubV9DbGlwRmlsbFR5cGUsYz10aGlzLm1fU3ViakZpbGxUeXBlKTtcbnN3aXRjaChiKXtjYXNlIGQuUG9seUZpbGxUeXBlLnBmdEV2ZW5PZGQ6aWYoMD09PWEuV2luZERlbHRhJiYxIT1hLldpbmRDbnQpcmV0dXJuITE7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvOmlmKDEhPU1hdGguYWJzKGEuV2luZENudCkpcmV0dXJuITE7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTppZigxIT1hLldpbmRDbnQpcmV0dXJuITE7YnJlYWs7ZGVmYXVsdDppZigtMSE9YS5XaW5kQ250KXJldHVybiExfXN3aXRjaCh0aGlzLm1fQ2xpcFR5cGUpe2Nhc2UgZC5DbGlwVHlwZS5jdEludGVyc2VjdGlvbjpzd2l0Y2goYyl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkOmNhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybzpyZXR1cm4gMCE9PWEuV2luZENudDI7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTpyZXR1cm4gMDxhLldpbmRDbnQyO2RlZmF1bHQ6cmV0dXJuIDA+YS5XaW5kQ250Mn1jYXNlIGQuQ2xpcFR5cGUuY3RVbmlvbjpzd2l0Y2goYyl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkOmNhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybzpyZXR1cm4gMD09PVxuYS5XaW5kQ250MjtjYXNlIGQuUG9seUZpbGxUeXBlLnBmdFBvc2l0aXZlOnJldHVybiAwPj1hLldpbmRDbnQyO2RlZmF1bHQ6cmV0dXJuIDA8PWEuV2luZENudDJ9Y2FzZSBkLkNsaXBUeXBlLmN0RGlmZmVyZW5jZTppZihhLlBvbHlUeXA9PWQuUG9seVR5cGUucHRTdWJqZWN0KXN3aXRjaChjKXtjYXNlIGQuUG9seUZpbGxUeXBlLnBmdEV2ZW5PZGQ6Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvOnJldHVybiAwPT09YS5XaW5kQ250MjtjYXNlIGQuUG9seUZpbGxUeXBlLnBmdFBvc2l0aXZlOnJldHVybiAwPj1hLldpbmRDbnQyO2RlZmF1bHQ6cmV0dXJuIDA8PWEuV2luZENudDJ9ZWxzZSBzd2l0Y2goYyl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkOmNhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybzpyZXR1cm4gMCE9PWEuV2luZENudDI7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTpyZXR1cm4gMDxhLldpbmRDbnQyO2RlZmF1bHQ6cmV0dXJuIDA+XG5hLldpbmRDbnQyfWNhc2UgZC5DbGlwVHlwZS5jdFhvcjppZigwPT09YS5XaW5kRGVsdGEpc3dpdGNoKGMpe2Nhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZDpjYXNlIGQuUG9seUZpbGxUeXBlLnBmdE5vblplcm86cmV0dXJuIDA9PT1hLldpbmRDbnQyO2Nhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0UG9zaXRpdmU6cmV0dXJuIDA+PWEuV2luZENudDI7ZGVmYXVsdDpyZXR1cm4gMDw9YS5XaW5kQ250Mn19cmV0dXJuITB9O2QuQ2xpcHBlci5wcm90b3R5cGUuU2V0V2luZGluZ0NvdW50PWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1hLlByZXZJbkFFTDtudWxsIT09YiYmKGIuUG9seVR5cCE9YS5Qb2x5VHlwfHwwPT09Yi5XaW5kRGVsdGEpOyliPWIuUHJldkluQUVMO2lmKG51bGw9PT1iKWEuV2luZENudD0wPT09YS5XaW5kRGVsdGE/MTphLldpbmREZWx0YSxhLldpbmRDbnQyPTAsYj10aGlzLm1fQWN0aXZlRWRnZXM7ZWxzZXtpZigwPT09YS5XaW5kRGVsdGEmJnRoaXMubV9DbGlwVHlwZSE9XG5kLkNsaXBUeXBlLmN0VW5pb24pYS5XaW5kQ250PTE7ZWxzZSBpZih0aGlzLklzRXZlbk9kZEZpbGxUeXBlKGEpKWlmKDA9PT1hLldpbmREZWx0YSl7Zm9yKHZhciBjPSEwLGU9Yi5QcmV2SW5BRUw7bnVsbCE9PWU7KWUuUG9seVR5cD09Yi5Qb2x5VHlwJiYwIT09ZS5XaW5kRGVsdGEmJihjPSFjKSxlPWUuUHJldkluQUVMO2EuV2luZENudD1jPzA6MX1lbHNlIGEuV2luZENudD1hLldpbmREZWx0YTtlbHNlIDA+Yi5XaW5kQ250KmIuV2luZERlbHRhPzE8TWF0aC5hYnMoYi5XaW5kQ250KT9hLldpbmRDbnQ9MD5iLldpbmREZWx0YSphLldpbmREZWx0YT9iLldpbmRDbnQ6Yi5XaW5kQ250K2EuV2luZERlbHRhOmEuV2luZENudD0wPT09YS5XaW5kRGVsdGE/MTphLldpbmREZWx0YTphLldpbmRDbnQ9MD09PWEuV2luZERlbHRhPzA+Yi5XaW5kQ250P2IuV2luZENudC0xOmIuV2luZENudCsxOjA+Yi5XaW5kRGVsdGEqYS5XaW5kRGVsdGE/Yi5XaW5kQ250OmIuV2luZENudCthLldpbmREZWx0YTtcbmEuV2luZENudDI9Yi5XaW5kQ250MjtiPWIuTmV4dEluQUVMfWlmKHRoaXMuSXNFdmVuT2RkQWx0RmlsbFR5cGUoYSkpZm9yKDtiIT1hOykwIT09Yi5XaW5kRGVsdGEmJihhLldpbmRDbnQyPTA9PT1hLldpbmRDbnQyPzE6MCksYj1iLk5leHRJbkFFTDtlbHNlIGZvcig7YiE9YTspYS5XaW5kQ250Mis9Yi5XaW5kRGVsdGEsYj1iLk5leHRJbkFFTH07ZC5DbGlwcGVyLnByb3RvdHlwZS5BZGRFZGdlVG9TRUw9ZnVuY3Rpb24oYSl7bnVsbD09PXRoaXMubV9Tb3J0ZWRFZGdlcz8odGhpcy5tX1NvcnRlZEVkZ2VzPWEsYS5QcmV2SW5TRUw9bnVsbCxhLk5leHRJblNFTD1udWxsKTooYS5OZXh0SW5TRUw9dGhpcy5tX1NvcnRlZEVkZ2VzLGEuUHJldkluU0VMPW51bGwsdGhpcy5tX1NvcnRlZEVkZ2VzPXRoaXMubV9Tb3J0ZWRFZGdlcy5QcmV2SW5TRUw9YSl9O2QuQ2xpcHBlci5wcm90b3R5cGUuQ29weUFFTFRvU0VMPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5tX0FjdGl2ZUVkZ2VzO2Zvcih0aGlzLm1fU29ydGVkRWRnZXM9XG5hO251bGwhPT1hOylhLlByZXZJblNFTD1hLlByZXZJbkFFTCxhPWEuTmV4dEluU0VMPWEuTmV4dEluQUVMfTtkLkNsaXBwZXIucHJvdG90eXBlLlN3YXBQb3NpdGlvbnNJbkFFTD1mdW5jdGlvbihhLGIpe2lmKGEuTmV4dEluQUVMIT1hLlByZXZJbkFFTCYmYi5OZXh0SW5BRUwhPWIuUHJldkluQUVMKXtpZihhLk5leHRJbkFFTD09Yil7dmFyIGM9Yi5OZXh0SW5BRUw7bnVsbCE9PWMmJihjLlByZXZJbkFFTD1hKTt2YXIgZT1hLlByZXZJbkFFTDtudWxsIT09ZSYmKGUuTmV4dEluQUVMPWIpO2IuUHJldkluQUVMPWU7Yi5OZXh0SW5BRUw9YTthLlByZXZJbkFFTD1iO2EuTmV4dEluQUVMPWN9ZWxzZSBiLk5leHRJbkFFTD09YT8oYz1hLk5leHRJbkFFTCxudWxsIT09YyYmKGMuUHJldkluQUVMPWIpLGU9Yi5QcmV2SW5BRUwsbnVsbCE9PWUmJihlLk5leHRJbkFFTD1hKSxhLlByZXZJbkFFTD1lLGEuTmV4dEluQUVMPWIsYi5QcmV2SW5BRUw9YSxiLk5leHRJbkFFTD1jKTooYz1hLk5leHRJbkFFTCxcbmU9YS5QcmV2SW5BRUwsYS5OZXh0SW5BRUw9Yi5OZXh0SW5BRUwsbnVsbCE9PWEuTmV4dEluQUVMJiYoYS5OZXh0SW5BRUwuUHJldkluQUVMPWEpLGEuUHJldkluQUVMPWIuUHJldkluQUVMLG51bGwhPT1hLlByZXZJbkFFTCYmKGEuUHJldkluQUVMLk5leHRJbkFFTD1hKSxiLk5leHRJbkFFTD1jLG51bGwhPT1iLk5leHRJbkFFTCYmKGIuTmV4dEluQUVMLlByZXZJbkFFTD1iKSxiLlByZXZJbkFFTD1lLG51bGwhPT1iLlByZXZJbkFFTCYmKGIuUHJldkluQUVMLk5leHRJbkFFTD1iKSk7bnVsbD09PWEuUHJldkluQUVMP3RoaXMubV9BY3RpdmVFZGdlcz1hOm51bGw9PT1iLlByZXZJbkFFTCYmKHRoaXMubV9BY3RpdmVFZGdlcz1iKX19O2QuQ2xpcHBlci5wcm90b3R5cGUuU3dhcFBvc2l0aW9uc0luU0VMPWZ1bmN0aW9uKGEsYil7aWYobnVsbCE9PWEuTmV4dEluU0VMfHxudWxsIT09YS5QcmV2SW5TRUwpaWYobnVsbCE9PWIuTmV4dEluU0VMfHxudWxsIT09Yi5QcmV2SW5TRUwpe2lmKGEuTmV4dEluU0VMPT1cbmIpe3ZhciBjPWIuTmV4dEluU0VMO251bGwhPT1jJiYoYy5QcmV2SW5TRUw9YSk7dmFyIGU9YS5QcmV2SW5TRUw7bnVsbCE9PWUmJihlLk5leHRJblNFTD1iKTtiLlByZXZJblNFTD1lO2IuTmV4dEluU0VMPWE7YS5QcmV2SW5TRUw9YjthLk5leHRJblNFTD1jfWVsc2UgYi5OZXh0SW5TRUw9PWE/KGM9YS5OZXh0SW5TRUwsbnVsbCE9PWMmJihjLlByZXZJblNFTD1iKSxlPWIuUHJldkluU0VMLG51bGwhPT1lJiYoZS5OZXh0SW5TRUw9YSksYS5QcmV2SW5TRUw9ZSxhLk5leHRJblNFTD1iLGIuUHJldkluU0VMPWEsYi5OZXh0SW5TRUw9Yyk6KGM9YS5OZXh0SW5TRUwsZT1hLlByZXZJblNFTCxhLk5leHRJblNFTD1iLk5leHRJblNFTCxudWxsIT09YS5OZXh0SW5TRUwmJihhLk5leHRJblNFTC5QcmV2SW5TRUw9YSksYS5QcmV2SW5TRUw9Yi5QcmV2SW5TRUwsbnVsbCE9PWEuUHJldkluU0VMJiYoYS5QcmV2SW5TRUwuTmV4dEluU0VMPWEpLGIuTmV4dEluU0VMPWMsbnVsbCE9PWIuTmV4dEluU0VMJiZcbihiLk5leHRJblNFTC5QcmV2SW5TRUw9YiksYi5QcmV2SW5TRUw9ZSxudWxsIT09Yi5QcmV2SW5TRUwmJihiLlByZXZJblNFTC5OZXh0SW5TRUw9YikpO251bGw9PT1hLlByZXZJblNFTD90aGlzLm1fU29ydGVkRWRnZXM9YTpudWxsPT09Yi5QcmV2SW5TRUwmJih0aGlzLm1fU29ydGVkRWRnZXM9Yil9fTtkLkNsaXBwZXIucHJvdG90eXBlLkFkZExvY2FsTWF4UG9seT1mdW5jdGlvbihhLGIsYyl7dGhpcy5BZGRPdXRQdChhLGMpOzA9PWIuV2luZERlbHRhJiZ0aGlzLkFkZE91dFB0KGIsYyk7YS5PdXRJZHg9PWIuT3V0SWR4PyhhLk91dElkeD0tMSxiLk91dElkeD0tMSk6YS5PdXRJZHg8Yi5PdXRJZHg/dGhpcy5BcHBlbmRQb2x5Z29uKGEsYik6dGhpcy5BcHBlbmRQb2x5Z29uKGIsYSl9O2QuQ2xpcHBlci5wcm90b3R5cGUuQWRkTG9jYWxNaW5Qb2x5PWZ1bmN0aW9uKGEsYixjKXt2YXIgZSxmO2QuQ2xpcHBlckJhc2UuSXNIb3Jpem9udGFsKGIpfHxhLkR4PmIuRHg/KGU9dGhpcy5BZGRPdXRQdChhLFxuYyksYi5PdXRJZHg9YS5PdXRJZHgsYS5TaWRlPWQuRWRnZVNpZGUuZXNMZWZ0LGIuU2lkZT1kLkVkZ2VTaWRlLmVzUmlnaHQsZj1hLGE9Zi5QcmV2SW5BRUw9PWI/Yi5QcmV2SW5BRUw6Zi5QcmV2SW5BRUwpOihlPXRoaXMuQWRkT3V0UHQoYixjKSxhLk91dElkeD1iLk91dElkeCxhLlNpZGU9ZC5FZGdlU2lkZS5lc1JpZ2h0LGIuU2lkZT1kLkVkZ2VTaWRlLmVzTGVmdCxmPWIsYT1mLlByZXZJbkFFTD09YT9hLlByZXZJbkFFTDpmLlByZXZJbkFFTCk7bnVsbCE9PWEmJjA8PWEuT3V0SWR4JiZkLkNsaXBwZXIuVG9wWChhLGMuWSk9PWQuQ2xpcHBlci5Ub3BYKGYsYy5ZKSYmZC5DbGlwcGVyQmFzZS5TbG9wZXNFcXVhbChmLGEsdGhpcy5tX1VzZUZ1bGxSYW5nZSkmJjAhPT1mLldpbmREZWx0YSYmMCE9PWEuV2luZERlbHRhJiYoYz10aGlzLkFkZE91dFB0KGEsYyksdGhpcy5BZGRKb2luKGUsYyxmLlRvcCkpO3JldHVybiBlfTtkLkNsaXBwZXIucHJvdG90eXBlLkNyZWF0ZU91dFJlYz1mdW5jdGlvbigpe3ZhciBhPVxubmV3IGQuT3V0UmVjO2EuSWR4PS0xO2EuSXNIb2xlPSExO2EuSXNPcGVuPSExO2EuRmlyc3RMZWZ0PW51bGw7YS5QdHM9bnVsbDthLkJvdHRvbVB0PW51bGw7YS5Qb2x5Tm9kZT1udWxsO3RoaXMubV9Qb2x5T3V0cy5wdXNoKGEpO2EuSWR4PXRoaXMubV9Qb2x5T3V0cy5sZW5ndGgtMTtyZXR1cm4gYX07ZC5DbGlwcGVyLnByb3RvdHlwZS5BZGRPdXRQdD1mdW5jdGlvbihhLGIpe3ZhciBjPWEuU2lkZT09ZC5FZGdlU2lkZS5lc0xlZnQ7aWYoMD5hLk91dElkeCl7dmFyIGU9dGhpcy5DcmVhdGVPdXRSZWMoKTtlLklzT3Blbj0wPT09YS5XaW5kRGVsdGE7dmFyIGY9bmV3IGQuT3V0UHQ7ZS5QdHM9ZjtmLklkeD1lLklkeDtmLlB0Llg9Yi5YO2YuUHQuWT1iLlk7Zi5OZXh0PWY7Zi5QcmV2PWY7ZS5Jc09wZW58fHRoaXMuU2V0SG9sZVN0YXRlKGEsZSk7YS5PdXRJZHg9ZS5JZHh9ZWxzZXt2YXIgZT10aGlzLm1fUG9seU91dHNbYS5PdXRJZHhdLGc9ZS5QdHM7aWYoYyYmZC5JbnRQb2ludC5vcF9FcXVhbGl0eShiLFxuZy5QdCkpcmV0dXJuIGc7aWYoIWMmJmQuSW50UG9pbnQub3BfRXF1YWxpdHkoYixnLlByZXYuUHQpKXJldHVybiBnLlByZXY7Zj1uZXcgZC5PdXRQdDtmLklkeD1lLklkeDtmLlB0Llg9Yi5YO2YuUHQuWT1iLlk7Zi5OZXh0PWc7Zi5QcmV2PWcuUHJldjtmLlByZXYuTmV4dD1mO2cuUHJldj1mO2MmJihlLlB0cz1mKX1yZXR1cm4gZn07ZC5DbGlwcGVyLnByb3RvdHlwZS5Td2FwUG9pbnRzPWZ1bmN0aW9uKGEsYil7dmFyIGM9bmV3IGQuSW50UG9pbnQoYS5WYWx1ZSk7YS5WYWx1ZS5YPWIuVmFsdWUuWDthLlZhbHVlLlk9Yi5WYWx1ZS5ZO2IuVmFsdWUuWD1jLlg7Yi5WYWx1ZS5ZPWMuWX07ZC5DbGlwcGVyLnByb3RvdHlwZS5Ib3J6U2VnbWVudHNPdmVybGFwPWZ1bmN0aW9uKGEsYixjLGUpe3JldHVybiBhLlg+Yy5YPT1hLlg8ZS5YPyEwOmIuWD5jLlg9PWIuWDxlLlg/ITA6Yy5YPmEuWD09Yy5YPGIuWD8hMDplLlg+YS5YPT1lLlg8Yi5YPyEwOmEuWD09Yy5YJiZiLlg9PWUuWD8hMDphLlg9PVxuZS5YJiZiLlg9PWMuWD8hMDohMX07ZC5DbGlwcGVyLnByb3RvdHlwZS5JbnNlcnRQb2x5UHRCZXR3ZWVuPWZ1bmN0aW9uKGEsYixjKXt2YXIgZT1uZXcgZC5PdXRQdDtlLlB0Llg9Yy5YO2UuUHQuWT1jLlk7Yj09YS5OZXh0PyhhLk5leHQ9ZSxiLlByZXY9ZSxlLk5leHQ9YixlLlByZXY9YSk6KGIuTmV4dD1lLGEuUHJldj1lLGUuTmV4dD1hLGUuUHJldj1iKTtyZXR1cm4gZX07ZC5DbGlwcGVyLnByb3RvdHlwZS5TZXRIb2xlU3RhdGU9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9ITEsZT1hLlByZXZJbkFFTDtudWxsIT09ZTspMDw9ZS5PdXRJZHgmJjAhPWUuV2luZERlbHRhJiYoYz0hYyxudWxsPT09Yi5GaXJzdExlZnQmJihiLkZpcnN0TGVmdD10aGlzLm1fUG9seU91dHNbZS5PdXRJZHhdKSksZT1lLlByZXZJbkFFTDtjJiYoYi5Jc0hvbGU9ITApfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldER4PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuWT09Yi5ZP2QuQ2xpcHBlckJhc2UuaG9yaXpvbnRhbDpcbihiLlgtYS5YKS8oYi5ZLWEuWSl9O2QuQ2xpcHBlci5wcm90b3R5cGUuRmlyc3RJc0JvdHRvbVB0PWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPWEuUHJldjtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGMuUHQsYS5QdCkmJmMhPWE7KWM9Yy5QcmV2O2Zvcih2YXIgZT1NYXRoLmFicyh0aGlzLkdldER4KGEuUHQsYy5QdCkpLGM9YS5OZXh0O2QuSW50UG9pbnQub3BfRXF1YWxpdHkoYy5QdCxhLlB0KSYmYyE9YTspYz1jLk5leHQ7Zm9yKHZhciBmPU1hdGguYWJzKHRoaXMuR2V0RHgoYS5QdCxjLlB0KSksYz1iLlByZXY7ZC5JbnRQb2ludC5vcF9FcXVhbGl0eShjLlB0LGIuUHQpJiZjIT1iOyljPWMuUHJldjtmb3IodmFyIGc9TWF0aC5hYnModGhpcy5HZXREeChiLlB0LGMuUHQpKSxjPWIuTmV4dDtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGMuUHQsYi5QdCkmJmMhPWI7KWM9Yy5OZXh0O2M9TWF0aC5hYnModGhpcy5HZXREeChiLlB0LGMuUHQpKTtyZXR1cm4gZT49ZyYmZT49Y3x8Zj49ZyYmZj49XG5jfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldEJvdHRvbVB0PWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1udWxsLGM9YS5OZXh0O2MhPWE7KWMuUHQuWT5hLlB0Llk/KGE9YyxiPW51bGwpOmMuUHQuWT09YS5QdC5ZJiZjLlB0Llg8PWEuUHQuWCYmKGMuUHQuWDxhLlB0Llg/KGI9bnVsbCxhPWMpOmMuTmV4dCE9YSYmYy5QcmV2IT1hJiYoYj1jKSksYz1jLk5leHQ7aWYobnVsbCE9PWIpZm9yKDtiIT1jOylmb3IodGhpcy5GaXJzdElzQm90dG9tUHQoYyxiKXx8KGE9YiksYj1iLk5leHQ7ZC5JbnRQb2ludC5vcF9JbmVxdWFsaXR5KGIuUHQsYS5QdCk7KWI9Yi5OZXh0O3JldHVybiBhfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldExvd2VybW9zdFJlYz1mdW5jdGlvbihhLGIpe251bGw9PT1hLkJvdHRvbVB0JiYoYS5Cb3R0b21QdD10aGlzLkdldEJvdHRvbVB0KGEuUHRzKSk7bnVsbD09PWIuQm90dG9tUHQmJihiLkJvdHRvbVB0PXRoaXMuR2V0Qm90dG9tUHQoYi5QdHMpKTt2YXIgYz1hLkJvdHRvbVB0LFxuZT1iLkJvdHRvbVB0O3JldHVybiBjLlB0Llk+ZS5QdC5ZP2E6Yy5QdC5ZPGUuUHQuWT9iOmMuUHQuWDxlLlB0Llg/YTpjLlB0Llg+ZS5QdC5YP2I6Yy5OZXh0PT1jP2I6ZS5OZXh0PT1lP2E6dGhpcy5GaXJzdElzQm90dG9tUHQoYyxlKT9hOmJ9O2QuQ2xpcHBlci5wcm90b3R5cGUuUGFyYW0xUmlnaHRPZlBhcmFtMj1mdW5jdGlvbihhLGIpe2RvIGlmKGE9YS5GaXJzdExlZnQsYT09YilyZXR1cm4hMDt3aGlsZShudWxsIT09YSk7cmV0dXJuITF9O2QuQ2xpcHBlci5wcm90b3R5cGUuR2V0T3V0UmVjPWZ1bmN0aW9uKGEpe2ZvcihhPXRoaXMubV9Qb2x5T3V0c1thXTthIT10aGlzLm1fUG9seU91dHNbYS5JZHhdOylhPXRoaXMubV9Qb2x5T3V0c1thLklkeF07cmV0dXJuIGF9O2QuQ2xpcHBlci5wcm90b3R5cGUuQXBwZW5kUG9seWdvbj1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMubV9Qb2x5T3V0c1thLk91dElkeF0sZT10aGlzLm1fUG9seU91dHNbYi5PdXRJZHhdLGY7Zj10aGlzLlBhcmFtMVJpZ2h0T2ZQYXJhbTIoYyxcbmUpP2U6dGhpcy5QYXJhbTFSaWdodE9mUGFyYW0yKGUsYyk/Yzp0aGlzLkdldExvd2VybW9zdFJlYyhjLGUpO3ZhciBnPWMuUHRzLGg9Zy5QcmV2LGw9ZS5QdHMsaz1sLlByZXY7YS5TaWRlPT1kLkVkZ2VTaWRlLmVzTGVmdD8oYi5TaWRlPT1kLkVkZ2VTaWRlLmVzTGVmdD8odGhpcy5SZXZlcnNlUG9seVB0TGlua3MobCksbC5OZXh0PWcsZy5QcmV2PWwsaC5OZXh0PWssay5QcmV2PWgsYy5QdHM9ayk6KGsuTmV4dD1nLGcuUHJldj1rLGwuUHJldj1oLGguTmV4dD1sLGMuUHRzPWwpLGc9ZC5FZGdlU2lkZS5lc0xlZnQpOihiLlNpZGU9PWQuRWRnZVNpZGUuZXNSaWdodD8odGhpcy5SZXZlcnNlUG9seVB0TGlua3MobCksaC5OZXh0PWssay5QcmV2PWgsbC5OZXh0PWcsZy5QcmV2PWwpOihoLk5leHQ9bCxsLlByZXY9aCxnLlByZXY9ayxrLk5leHQ9ZyksZz1kLkVkZ2VTaWRlLmVzUmlnaHQpO2MuQm90dG9tUHQ9bnVsbDtmPT1lJiYoZS5GaXJzdExlZnQhPWMmJihjLkZpcnN0TGVmdD1lLkZpcnN0TGVmdCksXG5jLklzSG9sZT1lLklzSG9sZSk7ZS5QdHM9bnVsbDtlLkJvdHRvbVB0PW51bGw7ZS5GaXJzdExlZnQ9YztmPWEuT3V0SWR4O2g9Yi5PdXRJZHg7YS5PdXRJZHg9LTE7Yi5PdXRJZHg9LTE7Zm9yKGw9dGhpcy5tX0FjdGl2ZUVkZ2VzO251bGwhPT1sOyl7aWYobC5PdXRJZHg9PWgpe2wuT3V0SWR4PWY7bC5TaWRlPWc7YnJlYWt9bD1sLk5leHRJbkFFTH1lLklkeD1jLklkeH07ZC5DbGlwcGVyLnByb3RvdHlwZS5SZXZlcnNlUG9seVB0TGlua3M9ZnVuY3Rpb24oYSl7aWYobnVsbCE9PWEpe3ZhciBiLGM7Yj1hO2RvIGM9Yi5OZXh0LGIuTmV4dD1iLlByZXYsYj1iLlByZXY9Yzt3aGlsZShiIT1hKX19O2QuQ2xpcHBlci5Td2FwU2lkZXM9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLlNpZGU7YS5TaWRlPWIuU2lkZTtiLlNpZGU9Y307ZC5DbGlwcGVyLlN3YXBQb2x5SW5kZXhlcz1mdW5jdGlvbihhLGIpe3ZhciBjPWEuT3V0SWR4O2EuT3V0SWR4PWIuT3V0SWR4O2IuT3V0SWR4PWN9O2QuQ2xpcHBlci5wcm90b3R5cGUuSW50ZXJzZWN0RWRnZXM9XG5mdW5jdGlvbihhLGIsYyxlKXt2YXIgZj0hZSYmbnVsbD09PWEuTmV4dEluTE1MJiZhLlRvcC5YPT1jLlgmJmEuVG9wLlk9PWMuWTtlPSFlJiZudWxsPT09Yi5OZXh0SW5MTUwmJmIuVG9wLlg9PWMuWCYmYi5Ub3AuWT09Yy5ZO3ZhciBnPTA8PWEuT3V0SWR4LGg9MDw9Yi5PdXRJZHg7aWYoMD09PWEuV2luZERlbHRhfHwwPT09Yi5XaW5kRGVsdGEpMD09PWEuV2luZERlbHRhJiYwPT09Yi5XaW5kRGVsdGE/KGZ8fGUpJiZnJiZoJiZ0aGlzLkFkZExvY2FsTWF4UG9seShhLGIsYyk6YS5Qb2x5VHlwPT1iLlBvbHlUeXAmJmEuV2luZERlbHRhIT1iLldpbmREZWx0YSYmdGhpcy5tX0NsaXBUeXBlPT1kLkNsaXBUeXBlLmN0VW5pb24/MD09PWEuV2luZERlbHRhP2gmJih0aGlzLkFkZE91dFB0KGEsYyksZyYmKGEuT3V0SWR4PS0xKSk6ZyYmKHRoaXMuQWRkT3V0UHQoYixjKSxoJiYoYi5PdXRJZHg9LTEpKTphLlBvbHlUeXAhPWIuUG9seVR5cCYmKDAhPT1hLldpbmREZWx0YXx8MSE9TWF0aC5hYnMoYi5XaW5kQ250KXx8XG50aGlzLm1fQ2xpcFR5cGU9PWQuQ2xpcFR5cGUuY3RVbmlvbiYmMCE9PWIuV2luZENudDI/MCE9PWIuV2luZERlbHRhfHwxIT1NYXRoLmFicyhhLldpbmRDbnQpfHx0aGlzLm1fQ2xpcFR5cGU9PWQuQ2xpcFR5cGUuY3RVbmlvbiYmMCE9PWEuV2luZENudDJ8fCh0aGlzLkFkZE91dFB0KGIsYyksaCYmKGIuT3V0SWR4PS0xKSk6KHRoaXMuQWRkT3V0UHQoYSxjKSxnJiYoYS5PdXRJZHg9LTEpKSksZiYmKDA+YS5PdXRJZHg/dGhpcy5EZWxldGVGcm9tQUVMKGEpOmQuRXJyb3IoXCJFcnJvciBpbnRlcnNlY3RpbmcgcG9seWxpbmVzXCIpKSxlJiYoMD5iLk91dElkeD90aGlzLkRlbGV0ZUZyb21BRUwoYik6ZC5FcnJvcihcIkVycm9yIGludGVyc2VjdGluZyBwb2x5bGluZXNcIikpO2Vsc2V7aWYoYS5Qb2x5VHlwPT1iLlBvbHlUeXApaWYodGhpcy5Jc0V2ZW5PZGRGaWxsVHlwZShhKSl7dmFyIGw9YS5XaW5kQ250O2EuV2luZENudD1iLldpbmRDbnQ7Yi5XaW5kQ250PWx9ZWxzZSBhLldpbmRDbnQ9XG4wPT09YS5XaW5kQ250K2IuV2luZERlbHRhPy1hLldpbmRDbnQ6YS5XaW5kQ250K2IuV2luZERlbHRhLGIuV2luZENudD0wPT09Yi5XaW5kQ250LWEuV2luZERlbHRhPy1iLldpbmRDbnQ6Yi5XaW5kQ250LWEuV2luZERlbHRhO2Vsc2UgdGhpcy5Jc0V2ZW5PZGRGaWxsVHlwZShiKT9hLldpbmRDbnQyPTA9PT1hLldpbmRDbnQyPzE6MDphLldpbmRDbnQyKz1iLldpbmREZWx0YSx0aGlzLklzRXZlbk9kZEZpbGxUeXBlKGEpP2IuV2luZENudDI9MD09PWIuV2luZENudDI/MTowOmIuV2luZENudDItPWEuV2luZERlbHRhO3ZhciBrLG4sbTthLlBvbHlUeXA9PWQuUG9seVR5cGUucHRTdWJqZWN0PyhrPXRoaXMubV9TdWJqRmlsbFR5cGUsbT10aGlzLm1fQ2xpcEZpbGxUeXBlKTooaz10aGlzLm1fQ2xpcEZpbGxUeXBlLG09dGhpcy5tX1N1YmpGaWxsVHlwZSk7Yi5Qb2x5VHlwPT1kLlBvbHlUeXBlLnB0U3ViamVjdD8obj10aGlzLm1fU3ViakZpbGxUeXBlLGw9dGhpcy5tX0NsaXBGaWxsVHlwZSk6XG4obj10aGlzLm1fQ2xpcEZpbGxUeXBlLGw9dGhpcy5tX1N1YmpGaWxsVHlwZSk7c3dpdGNoKGspe2Nhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0UG9zaXRpdmU6az1hLldpbmRDbnQ7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZTprPS1hLldpbmRDbnQ7YnJlYWs7ZGVmYXVsdDprPU1hdGguYWJzKGEuV2luZENudCl9c3dpdGNoKG4pe2Nhc2UgZC5Qb2x5RmlsbFR5cGUucGZ0UG9zaXRpdmU6bj1iLldpbmRDbnQ7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZTpuPS1iLldpbmRDbnQ7YnJlYWs7ZGVmYXVsdDpuPU1hdGguYWJzKGIuV2luZENudCl9aWYoZyYmaClmfHxlfHwwIT09ayYmMSE9a3x8MCE9PW4mJjEhPW58fGEuUG9seVR5cCE9Yi5Qb2x5VHlwJiZ0aGlzLm1fQ2xpcFR5cGUhPWQuQ2xpcFR5cGUuY3RYb3I/dGhpcy5BZGRMb2NhbE1heFBvbHkoYSxiLGMpOih0aGlzLkFkZE91dFB0KGEsYyksdGhpcy5BZGRPdXRQdChiLGMpLGQuQ2xpcHBlci5Td2FwU2lkZXMoYSxcbmIpLGQuQ2xpcHBlci5Td2FwUG9seUluZGV4ZXMoYSxiKSk7ZWxzZSBpZihnKXtpZigwPT09bnx8MT09bil0aGlzLkFkZE91dFB0KGEsYyksZC5DbGlwcGVyLlN3YXBTaWRlcyhhLGIpLGQuQ2xpcHBlci5Td2FwUG9seUluZGV4ZXMoYSxiKX1lbHNlIGlmKGgpe2lmKDA9PT1rfHwxPT1rKXRoaXMuQWRkT3V0UHQoYixjKSxkLkNsaXBwZXIuU3dhcFNpZGVzKGEsYiksZC5DbGlwcGVyLlN3YXBQb2x5SW5kZXhlcyhhLGIpfWVsc2UgaWYoISgwIT09ayYmMSE9a3x8MCE9PW4mJjEhPW58fGZ8fGUpKXtzd2l0Y2gobSl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTpnPWEuV2luZENudDI7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZTpnPS1hLldpbmRDbnQyO2JyZWFrO2RlZmF1bHQ6Zz1NYXRoLmFicyhhLldpbmRDbnQyKX1zd2l0Y2gobCl7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZTpoPWIuV2luZENudDI7YnJlYWs7Y2FzZSBkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZTpoPVxuLWIuV2luZENudDI7YnJlYWs7ZGVmYXVsdDpoPU1hdGguYWJzKGIuV2luZENudDIpfWlmKGEuUG9seVR5cCE9Yi5Qb2x5VHlwKXRoaXMuQWRkTG9jYWxNaW5Qb2x5KGEsYixjKTtlbHNlIGlmKDE9PWsmJjE9PW4pc3dpdGNoKHRoaXMubV9DbGlwVHlwZSl7Y2FzZSBkLkNsaXBUeXBlLmN0SW50ZXJzZWN0aW9uOjA8ZyYmMDxoJiZ0aGlzLkFkZExvY2FsTWluUG9seShhLGIsYyk7YnJlYWs7Y2FzZSBkLkNsaXBUeXBlLmN0VW5pb246MD49ZyYmMD49aCYmdGhpcy5BZGRMb2NhbE1pblBvbHkoYSxiLGMpO2JyZWFrO2Nhc2UgZC5DbGlwVHlwZS5jdERpZmZlcmVuY2U6KGEuUG9seVR5cD09ZC5Qb2x5VHlwZS5wdENsaXAmJjA8ZyYmMDxofHxhLlBvbHlUeXA9PWQuUG9seVR5cGUucHRTdWJqZWN0JiYwPj1nJiYwPj1oKSYmdGhpcy5BZGRMb2NhbE1pblBvbHkoYSxiLGMpO2JyZWFrO2Nhc2UgZC5DbGlwVHlwZS5jdFhvcjp0aGlzLkFkZExvY2FsTWluUG9seShhLGIsYyl9ZWxzZSBkLkNsaXBwZXIuU3dhcFNpZGVzKGEsXG5iKX1mIT1lJiYoZiYmMDw9YS5PdXRJZHh8fGUmJjA8PWIuT3V0SWR4KSYmKGQuQ2xpcHBlci5Td2FwU2lkZXMoYSxiKSxkLkNsaXBwZXIuU3dhcFBvbHlJbmRleGVzKGEsYikpO2YmJnRoaXMuRGVsZXRlRnJvbUFFTChhKTtlJiZ0aGlzLkRlbGV0ZUZyb21BRUwoYil9fTtkLkNsaXBwZXIucHJvdG90eXBlLkRlbGV0ZUZyb21BRUw9ZnVuY3Rpb24oYSl7dmFyIGI9YS5QcmV2SW5BRUwsYz1hLk5leHRJbkFFTDtpZihudWxsIT09Ynx8bnVsbCE9PWN8fGE9PXRoaXMubV9BY3RpdmVFZGdlcyludWxsIT09Yj9iLk5leHRJbkFFTD1jOnRoaXMubV9BY3RpdmVFZGdlcz1jLG51bGwhPT1jJiYoYy5QcmV2SW5BRUw9YiksYS5OZXh0SW5BRUw9bnVsbCxhLlByZXZJbkFFTD1udWxsfTtkLkNsaXBwZXIucHJvdG90eXBlLkRlbGV0ZUZyb21TRUw9ZnVuY3Rpb24oYSl7dmFyIGI9YS5QcmV2SW5TRUwsYz1hLk5leHRJblNFTDtpZihudWxsIT09Ynx8bnVsbCE9PWN8fGE9PXRoaXMubV9Tb3J0ZWRFZGdlcyludWxsIT09XG5iP2IuTmV4dEluU0VMPWM6dGhpcy5tX1NvcnRlZEVkZ2VzPWMsbnVsbCE9PWMmJihjLlByZXZJblNFTD1iKSxhLk5leHRJblNFTD1udWxsLGEuUHJldkluU0VMPW51bGx9O2QuQ2xpcHBlci5wcm90b3R5cGUuVXBkYXRlRWRnZUludG9BRUw9ZnVuY3Rpb24oYSl7bnVsbD09PWEuTmV4dEluTE1MJiZkLkVycm9yKFwiVXBkYXRlRWRnZUludG9BRUw6IGludmFsaWQgY2FsbFwiKTt2YXIgYj1hLlByZXZJbkFFTCxjPWEuTmV4dEluQUVMO2EuTmV4dEluTE1MLk91dElkeD1hLk91dElkeDtudWxsIT09Yj9iLk5leHRJbkFFTD1hLk5leHRJbkxNTDp0aGlzLm1fQWN0aXZlRWRnZXM9YS5OZXh0SW5MTUw7bnVsbCE9PWMmJihjLlByZXZJbkFFTD1hLk5leHRJbkxNTCk7YS5OZXh0SW5MTUwuU2lkZT1hLlNpZGU7YS5OZXh0SW5MTUwuV2luZERlbHRhPWEuV2luZERlbHRhO2EuTmV4dEluTE1MLldpbmRDbnQ9YS5XaW5kQ250O2EuTmV4dEluTE1MLldpbmRDbnQyPWEuV2luZENudDI7YT1hLk5leHRJbkxNTDtcbmEuQ3Vyci5YPWEuQm90Llg7YS5DdXJyLlk9YS5Cb3QuWTthLlByZXZJbkFFTD1iO2EuTmV4dEluQUVMPWM7ZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYSl8fHRoaXMuSW5zZXJ0U2NhbmJlYW0oYS5Ub3AuWSk7cmV0dXJuIGF9O2QuQ2xpcHBlci5wcm90b3R5cGUuUHJvY2Vzc0hvcml6b250YWxzPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLm1fU29ydGVkRWRnZXM7bnVsbCE9PWI7KXRoaXMuRGVsZXRlRnJvbVNFTChiKSx0aGlzLlByb2Nlc3NIb3Jpem9udGFsKGIsYSksYj10aGlzLm1fU29ydGVkRWRnZXN9O2QuQ2xpcHBlci5wcm90b3R5cGUuR2V0SG9yekRpcmVjdGlvbj1mdW5jdGlvbihhLGIpe2EuQm90Llg8YS5Ub3AuWD8oYi5MZWZ0PWEuQm90LlgsYi5SaWdodD1hLlRvcC5YLGIuRGlyPWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodCk6KGIuTGVmdD1hLlRvcC5YLGIuUmlnaHQ9YS5Cb3QuWCxiLkRpcj1kLkRpcmVjdGlvbi5kUmlnaHRUb0xlZnQpfTtkLkNsaXBwZXIucHJvdG90eXBlLlByZXBhcmVIb3J6Sm9pbnM9XG5mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMubV9Qb2x5T3V0c1thLk91dElkeF0uUHRzO2EuU2lkZSE9ZC5FZGdlU2lkZS5lc0xlZnQmJihjPWMuUHJldik7YiYmKGQuSW50UG9pbnQub3BfRXF1YWxpdHkoYy5QdCxhLlRvcCk/dGhpcy5BZGRHaG9zdEpvaW4oYyxhLkJvdCk6dGhpcy5BZGRHaG9zdEpvaW4oYyxhLlRvcCkpfTtkLkNsaXBwZXIucHJvdG90eXBlLlByb2Nlc3NIb3Jpem9udGFsPWZ1bmN0aW9uKGEsYil7dmFyIGM9e0RpcjpudWxsLExlZnQ6bnVsbCxSaWdodDpudWxsfTt0aGlzLkdldEhvcnpEaXJlY3Rpb24oYSxjKTtmb3IodmFyIGU9Yy5EaXIsZj1jLkxlZnQsZz1jLlJpZ2h0LGg9YSxsPW51bGw7bnVsbCE9PWguTmV4dEluTE1MJiZkLkNsaXBwZXJCYXNlLklzSG9yaXpvbnRhbChoLk5leHRJbkxNTCk7KWg9aC5OZXh0SW5MTUw7Zm9yKG51bGw9PT1oLk5leHRJbkxNTCYmKGw9dGhpcy5HZXRNYXhpbWFQYWlyKGgpKTs7KXtmb3IodmFyIGs9YT09aCxuPXRoaXMuR2V0TmV4dEluQUVMKGEsXG5lKTtudWxsIT09biYmIShuLkN1cnIuWD09YS5Ub3AuWCYmbnVsbCE9PWEuTmV4dEluTE1MJiZuLkR4PGEuTmV4dEluTE1MLkR4KTspe2M9dGhpcy5HZXROZXh0SW5BRUwobixlKTtpZihlPT1kLkRpcmVjdGlvbi5kTGVmdFRvUmlnaHQmJm4uQ3Vyci5YPD1nfHxlPT1kLkRpcmVjdGlvbi5kUmlnaHRUb0xlZnQmJm4uQ3Vyci5YPj1mKXswPD1hLk91dElkeCYmMCE9YS5XaW5kRGVsdGEmJnRoaXMuUHJlcGFyZUhvcnpKb2lucyhhLGIpO2lmKG49PWwmJmspe2U9PWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodD90aGlzLkludGVyc2VjdEVkZ2VzKGEsbixuLlRvcCwhMSk6dGhpcy5JbnRlcnNlY3RFZGdlcyhuLGEsbi5Ub3AsITEpOzA8PWwuT3V0SWR4JiZkLkVycm9yKFwiUHJvY2Vzc0hvcml6b250YWwgZXJyb3JcIik7cmV0dXJufWlmKGU9PWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodCl7dmFyIG09bmV3IGQuSW50UG9pbnQobi5DdXJyLlgsYS5DdXJyLlkpO3RoaXMuSW50ZXJzZWN0RWRnZXMoYSxcbm4sbSwhMCl9ZWxzZSBtPW5ldyBkLkludFBvaW50KG4uQ3Vyci5YLGEuQ3Vyci5ZKSx0aGlzLkludGVyc2VjdEVkZ2VzKG4sYSxtLCEwKTt0aGlzLlN3YXBQb3NpdGlvbnNJbkFFTChhLG4pfWVsc2UgaWYoZT09ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0JiZuLkN1cnIuWD49Z3x8ZT09ZC5EaXJlY3Rpb24uZFJpZ2h0VG9MZWZ0JiZuLkN1cnIuWDw9ZilicmVhaztuPWN9MDw9YS5PdXRJZHgmJjAhPT1hLldpbmREZWx0YSYmdGhpcy5QcmVwYXJlSG9yekpvaW5zKGEsYik7aWYobnVsbCE9PWEuTmV4dEluTE1MJiZkLkNsaXBwZXJCYXNlLklzSG9yaXpvbnRhbChhLk5leHRJbkxNTCkpYT10aGlzLlVwZGF0ZUVkZ2VJbnRvQUVMKGEpLDA8PWEuT3V0SWR4JiZ0aGlzLkFkZE91dFB0KGEsYS5Cb3QpLGM9e0RpcjplLExlZnQ6ZixSaWdodDpnfSx0aGlzLkdldEhvcnpEaXJlY3Rpb24oYSxjKSxlPWMuRGlyLGY9Yy5MZWZ0LGc9Yy5SaWdodDtlbHNlIGJyZWFrfW51bGwhPT1hLk5leHRJbkxNTD9cbjA8PWEuT3V0SWR4PyhlPXRoaXMuQWRkT3V0UHQoYSxhLlRvcCksYT10aGlzLlVwZGF0ZUVkZ2VJbnRvQUVMKGEpLDAhPT1hLldpbmREZWx0YSYmKGY9YS5QcmV2SW5BRUwsYz1hLk5leHRJbkFFTCxudWxsIT09ZiYmZi5DdXJyLlg9PWEuQm90LlgmJmYuQ3Vyci5ZPT1hLkJvdC5ZJiYwIT09Zi5XaW5kRGVsdGEmJjA8PWYuT3V0SWR4JiZmLkN1cnIuWT5mLlRvcC5ZJiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGEsZix0aGlzLm1fVXNlRnVsbFJhbmdlKT8oYz10aGlzLkFkZE91dFB0KGYsYS5Cb3QpLHRoaXMuQWRkSm9pbihlLGMsYS5Ub3ApKTpudWxsIT09YyYmYy5DdXJyLlg9PWEuQm90LlgmJmMuQ3Vyci5ZPT1hLkJvdC5ZJiYwIT09Yy5XaW5kRGVsdGEmJjA8PWMuT3V0SWR4JiZjLkN1cnIuWT5jLlRvcC5ZJiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGEsYyx0aGlzLm1fVXNlRnVsbFJhbmdlKSYmKGM9dGhpcy5BZGRPdXRQdChjLGEuQm90KSx0aGlzLkFkZEpvaW4oZSxjLFxuYS5Ub3ApKSkpOnRoaXMuVXBkYXRlRWRnZUludG9BRUwoYSk6bnVsbCE9PWw/MDw9bC5PdXRJZHg/KGU9PWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodD90aGlzLkludGVyc2VjdEVkZ2VzKGEsbCxhLlRvcCwhMSk6dGhpcy5JbnRlcnNlY3RFZGdlcyhsLGEsYS5Ub3AsITEpLDA8PWwuT3V0SWR4JiZkLkVycm9yKFwiUHJvY2Vzc0hvcml6b250YWwgZXJyb3JcIikpOih0aGlzLkRlbGV0ZUZyb21BRUwoYSksdGhpcy5EZWxldGVGcm9tQUVMKGwpKTooMDw9YS5PdXRJZHgmJnRoaXMuQWRkT3V0UHQoYSxhLlRvcCksdGhpcy5EZWxldGVGcm9tQUVMKGEpKX07ZC5DbGlwcGVyLnByb3RvdHlwZS5HZXROZXh0SW5BRUw9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj09ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0P2EuTmV4dEluQUVMOmEuUHJldkluQUVMfTtkLkNsaXBwZXIucHJvdG90eXBlLklzTWluaW1hPWZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT09YSYmYS5QcmV2Lk5leHRJbkxNTCE9YSYmYS5OZXh0Lk5leHRJbkxNTCE9XG5hfTtkLkNsaXBwZXIucHJvdG90eXBlLklzTWF4aW1hPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGwhPT1hJiZhLlRvcC5ZPT1iJiZudWxsPT09YS5OZXh0SW5MTUx9O2QuQ2xpcHBlci5wcm90b3R5cGUuSXNJbnRlcm1lZGlhdGU9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5Ub3AuWT09YiYmbnVsbCE9PWEuTmV4dEluTE1MfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldE1heGltYVBhaXI9ZnVuY3Rpb24oYSl7dmFyIGI9bnVsbDtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGEuTmV4dC5Ub3AsYS5Ub3ApJiZudWxsPT09YS5OZXh0Lk5leHRJbkxNTD9iPWEuTmV4dDpkLkludFBvaW50Lm9wX0VxdWFsaXR5KGEuUHJldi5Ub3AsYS5Ub3ApJiZudWxsPT09YS5QcmV2Lk5leHRJbkxNTCYmKGI9YS5QcmV2KTtyZXR1cm4gbnVsbD09PWJ8fC0yIT1iLk91dElkeCYmKGIuTmV4dEluQUVMIT1iLlByZXZJbkFFTHx8ZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYikpP2I6bnVsbH07ZC5DbGlwcGVyLnByb3RvdHlwZS5Qcm9jZXNzSW50ZXJzZWN0aW9ucz1cbmZ1bmN0aW9uKGEsYil7aWYobnVsbD09dGhpcy5tX0FjdGl2ZUVkZ2VzKXJldHVybiEwO3RyeXt0aGlzLkJ1aWxkSW50ZXJzZWN0TGlzdChhLGIpO2lmKDA9PXRoaXMubV9JbnRlcnNlY3RMaXN0Lmxlbmd0aClyZXR1cm4hMDtpZigxPT10aGlzLm1fSW50ZXJzZWN0TGlzdC5sZW5ndGh8fHRoaXMuRml4dXBJbnRlcnNlY3Rpb25PcmRlcigpKXRoaXMuUHJvY2Vzc0ludGVyc2VjdExpc3QoKTtlbHNlIHJldHVybiExfWNhdGNoKGMpe3RoaXMubV9Tb3J0ZWRFZGdlcz1udWxsLHRoaXMubV9JbnRlcnNlY3RMaXN0Lmxlbmd0aD0wLGQuRXJyb3IoXCJQcm9jZXNzSW50ZXJzZWN0aW9ucyBlcnJvclwiKX10aGlzLm1fU29ydGVkRWRnZXM9bnVsbDtyZXR1cm4hMH07ZC5DbGlwcGVyLnByb3RvdHlwZS5CdWlsZEludGVyc2VjdExpc3Q9ZnVuY3Rpb24oYSxiKXtpZihudWxsIT09dGhpcy5tX0FjdGl2ZUVkZ2VzKXt2YXIgYz10aGlzLm1fQWN0aXZlRWRnZXM7Zm9yKHRoaXMubV9Tb3J0ZWRFZGdlcz1jO251bGwhPT1cbmM7KWMuUHJldkluU0VMPWMuUHJldkluQUVMLGMuTmV4dEluU0VMPWMuTmV4dEluQUVMLGMuQ3Vyci5YPWQuQ2xpcHBlci5Ub3BYKGMsYiksYz1jLk5leHRJbkFFTDtmb3IodmFyIGU9ITA7ZSYmbnVsbCE9PXRoaXMubV9Tb3J0ZWRFZGdlczspe2U9ITE7Zm9yKGM9dGhpcy5tX1NvcnRlZEVkZ2VzO251bGwhPT1jLk5leHRJblNFTDspe3ZhciBmPWMuTmV4dEluU0VMLGc9bmV3IGQuSW50UG9pbnQ7Yy5DdXJyLlg+Zi5DdXJyLlg/KCF0aGlzLkludGVyc2VjdFBvaW50KGMsZixnKSYmYy5DdXJyLlg+Zi5DdXJyLlgrMSYmZC5FcnJvcihcIkludGVyc2VjdGlvbiBlcnJvclwiKSxnLlk+YSYmKGcuWT1hLE1hdGguYWJzKGMuRHgpPk1hdGguYWJzKGYuRHgpP2cuWD1kLkNsaXBwZXIuVG9wWChmLGEpOmcuWD1kLkNsaXBwZXIuVG9wWChjLGEpKSxlPW5ldyBkLkludGVyc2VjdE5vZGUsZS5FZGdlMT1jLGUuRWRnZTI9ZixlLlB0Llg9Zy5YLGUuUHQuWT1nLlksdGhpcy5tX0ludGVyc2VjdExpc3QucHVzaChlKSxcbnRoaXMuU3dhcFBvc2l0aW9uc0luU0VMKGMsZiksZT0hMCk6Yz1mfWlmKG51bGwhPT1jLlByZXZJblNFTCljLlByZXZJblNFTC5OZXh0SW5TRUw9bnVsbDtlbHNlIGJyZWFrfXRoaXMubV9Tb3J0ZWRFZGdlcz1udWxsfX07ZC5DbGlwcGVyLnByb3RvdHlwZS5FZGdlc0FkamFjZW50PWZ1bmN0aW9uKGEpe3JldHVybiBhLkVkZ2UxLk5leHRJblNFTD09YS5FZGdlMnx8YS5FZGdlMS5QcmV2SW5TRUw9PWEuRWRnZTJ9O2QuQ2xpcHBlci5JbnRlcnNlY3ROb2RlU29ydD1mdW5jdGlvbihhLGIpe3JldHVybiBiLlB0LlktYS5QdC5ZfTtkLkNsaXBwZXIucHJvdG90eXBlLkZpeHVwSW50ZXJzZWN0aW9uT3JkZXI9ZnVuY3Rpb24oKXt0aGlzLm1fSW50ZXJzZWN0TGlzdC5zb3J0KHRoaXMubV9JbnRlcnNlY3ROb2RlQ29tcGFyZXIpO3RoaXMuQ29weUFFTFRvU0VMKCk7Zm9yKHZhciBhPXRoaXMubV9JbnRlcnNlY3RMaXN0Lmxlbmd0aCxiPTA7YjxhO2IrKyl7aWYoIXRoaXMuRWRnZXNBZGphY2VudCh0aGlzLm1fSW50ZXJzZWN0TGlzdFtiXSkpe2Zvcih2YXIgYz1cbmIrMTtjPGEmJiF0aGlzLkVkZ2VzQWRqYWNlbnQodGhpcy5tX0ludGVyc2VjdExpc3RbY10pOyljKys7aWYoYz09YSlyZXR1cm4hMTt2YXIgZT10aGlzLm1fSW50ZXJzZWN0TGlzdFtiXTt0aGlzLm1fSW50ZXJzZWN0TGlzdFtiXT10aGlzLm1fSW50ZXJzZWN0TGlzdFtjXTt0aGlzLm1fSW50ZXJzZWN0TGlzdFtjXT1lfXRoaXMuU3dhcFBvc2l0aW9uc0luU0VMKHRoaXMubV9JbnRlcnNlY3RMaXN0W2JdLkVkZ2UxLHRoaXMubV9JbnRlcnNlY3RMaXN0W2JdLkVkZ2UyKX1yZXR1cm4hMH07ZC5DbGlwcGVyLnByb3RvdHlwZS5Qcm9jZXNzSW50ZXJzZWN0TGlzdD1mdW5jdGlvbigpe2Zvcih2YXIgYT0wLGI9dGhpcy5tX0ludGVyc2VjdExpc3QubGVuZ3RoO2E8YjthKyspe3ZhciBjPXRoaXMubV9JbnRlcnNlY3RMaXN0W2FdO3RoaXMuSW50ZXJzZWN0RWRnZXMoYy5FZGdlMSxjLkVkZ2UyLGMuUHQsITApO3RoaXMuU3dhcFBvc2l0aW9uc0luQUVMKGMuRWRnZTEsYy5FZGdlMil9dGhpcy5tX0ludGVyc2VjdExpc3QubGVuZ3RoPVxuMH07RT1mdW5jdGlvbihhKXtyZXR1cm4gMD5hP01hdGguY2VpbChhLTAuNSk6TWF0aC5yb3VuZChhKX07Rj1mdW5jdGlvbihhKXtyZXR1cm4gMD5hP01hdGguY2VpbChhLTAuNSk6TWF0aC5mbG9vcihhKzAuNSl9O0c9ZnVuY3Rpb24oYSl7cmV0dXJuIDA+YT8tTWF0aC5yb3VuZChNYXRoLmFicyhhKSk6TWF0aC5yb3VuZChhKX07SD1mdW5jdGlvbihhKXtpZigwPmEpcmV0dXJuIGEtPTAuNSwtMjE0NzQ4MzY0OD5hP01hdGguY2VpbChhKTphfDA7YSs9MC41O3JldHVybiAyMTQ3NDgzNjQ3PGE/TWF0aC5mbG9vcihhKTphfDB9O2QuQ2xpcHBlci5Sb3VuZD1wP0U6RD9HOko/SDpGO2QuQ2xpcHBlci5Ub3BYPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGI9PWEuVG9wLlk/YS5Ub3AuWDphLkJvdC5YK2QuQ2xpcHBlci5Sb3VuZChhLkR4KihiLWEuQm90LlkpKX07ZC5DbGlwcGVyLnByb3RvdHlwZS5JbnRlcnNlY3RQb2ludD1mdW5jdGlvbihhLGIsYyl7Yy5YPTA7Yy5ZPTA7dmFyIGUsZjtpZihkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGEsXG5iLHRoaXMubV9Vc2VGdWxsUmFuZ2UpfHxhLkR4PT1iLkR4KXJldHVybiBiLkJvdC5ZPmEuQm90Llk/KGMuWD1iLkJvdC5YLGMuWT1iLkJvdC5ZKTooYy5YPWEuQm90LlgsYy5ZPWEuQm90LlkpLCExO2lmKDA9PT1hLkRlbHRhLlgpYy5YPWEuQm90LlgsZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYik/Yy5ZPWIuQm90Llk6KGY9Yi5Cb3QuWS1iLkJvdC5YL2IuRHgsYy5ZPWQuQ2xpcHBlci5Sb3VuZChjLlgvYi5EeCtmKSk7ZWxzZSBpZigwPT09Yi5EZWx0YS5YKWMuWD1iLkJvdC5YLGQuQ2xpcHBlckJhc2UuSXNIb3Jpem9udGFsKGEpP2MuWT1hLkJvdC5ZOihlPWEuQm90LlktYS5Cb3QuWC9hLkR4LGMuWT1kLkNsaXBwZXIuUm91bmQoYy5YL2EuRHgrZSkpO2Vsc2V7ZT1hLkJvdC5YLWEuQm90LlkqYS5EeDtmPWIuQm90LlgtYi5Cb3QuWSpiLkR4O3ZhciBnPShmLWUpLyhhLkR4LWIuRHgpO2MuWT1kLkNsaXBwZXIuUm91bmQoZyk7TWF0aC5hYnMoYS5EeCk8TWF0aC5hYnMoYi5EeCk/XG5jLlg9ZC5DbGlwcGVyLlJvdW5kKGEuRHgqZytlKTpjLlg9ZC5DbGlwcGVyLlJvdW5kKGIuRHgqZytmKX1pZihjLlk8YS5Ub3AuWXx8Yy5ZPGIuVG9wLlkpe2lmKGEuVG9wLlk+Yi5Ub3AuWSlyZXR1cm4gYy5ZPWEuVG9wLlksYy5YPWQuQ2xpcHBlci5Ub3BYKGIsYS5Ub3AuWSksYy5YPGEuVG9wLlg7Yy5ZPWIuVG9wLlk7TWF0aC5hYnMoYS5EeCk8TWF0aC5hYnMoYi5EeCk/Yy5YPWQuQ2xpcHBlci5Ub3BYKGEsYy5ZKTpjLlg9ZC5DbGlwcGVyLlRvcFgoYixjLlkpfXJldHVybiEwfTtkLkNsaXBwZXIucHJvdG90eXBlLlByb2Nlc3NFZGdlc0F0VG9wT2ZTY2FuYmVhbT1mdW5jdGlvbihhKXtmb3IodmFyIGI9dGhpcy5tX0FjdGl2ZUVkZ2VzO251bGwhPT1iOyl7dmFyIGM9dGhpcy5Jc01heGltYShiLGEpO2MmJihjPXRoaXMuR2V0TWF4aW1hUGFpcihiKSxjPW51bGw9PT1jfHwhZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYykpO2lmKGMpe3ZhciBlPWIuUHJldkluQUVMO3RoaXMuRG9NYXhpbWEoYik7XG5iPW51bGw9PT1lP3RoaXMubV9BY3RpdmVFZGdlczplLk5leHRJbkFFTH1lbHNlIHRoaXMuSXNJbnRlcm1lZGlhdGUoYixhKSYmZC5DbGlwcGVyQmFzZS5Jc0hvcml6b250YWwoYi5OZXh0SW5MTUwpPyhiPXRoaXMuVXBkYXRlRWRnZUludG9BRUwoYiksMDw9Yi5PdXRJZHgmJnRoaXMuQWRkT3V0UHQoYixiLkJvdCksdGhpcy5BZGRFZGdlVG9TRUwoYikpOihiLkN1cnIuWD1kLkNsaXBwZXIuVG9wWChiLGEpLGIuQ3Vyci5ZPWEpLHRoaXMuU3RyaWN0bHlTaW1wbGUmJihlPWIuUHJldkluQUVMLDA8PWIuT3V0SWR4JiYwIT09Yi5XaW5kRGVsdGEmJm51bGwhPT1lJiYwPD1lLk91dElkeCYmZS5DdXJyLlg9PWIuQ3Vyci5YJiYwIT09ZS5XaW5kRGVsdGEmJihjPXRoaXMuQWRkT3V0UHQoZSxiLkN1cnIpLGU9dGhpcy5BZGRPdXRQdChiLGIuQ3VyciksdGhpcy5BZGRKb2luKGMsZSxiLkN1cnIpKSksYj1iLk5leHRJbkFFTH10aGlzLlByb2Nlc3NIb3Jpem9udGFscyghMCk7Zm9yKGI9dGhpcy5tX0FjdGl2ZUVkZ2VzO251bGwhPT1cbmI7KXtpZih0aGlzLklzSW50ZXJtZWRpYXRlKGIsYSkpe2M9bnVsbDswPD1iLk91dElkeCYmKGM9dGhpcy5BZGRPdXRQdChiLGIuVG9wKSk7dmFyIGI9dGhpcy5VcGRhdGVFZGdlSW50b0FFTChiKSxlPWIuUHJldkluQUVMLGY9Yi5OZXh0SW5BRUw7bnVsbCE9PWUmJmUuQ3Vyci5YPT1iLkJvdC5YJiZlLkN1cnIuWT09Yi5Cb3QuWSYmbnVsbCE9PWMmJjA8PWUuT3V0SWR4JiZlLkN1cnIuWT5lLlRvcC5ZJiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGIsZSx0aGlzLm1fVXNlRnVsbFJhbmdlKSYmMCE9PWIuV2luZERlbHRhJiYwIT09ZS5XaW5kRGVsdGE/KGU9dGhpcy5BZGRPdXRQdChlLGIuQm90KSx0aGlzLkFkZEpvaW4oYyxlLGIuVG9wKSk6bnVsbCE9PWYmJmYuQ3Vyci5YPT1iLkJvdC5YJiZmLkN1cnIuWT09Yi5Cb3QuWSYmbnVsbCE9PWMmJjA8PWYuT3V0SWR4JiZmLkN1cnIuWT5mLlRvcC5ZJiZkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGIsZix0aGlzLm1fVXNlRnVsbFJhbmdlKSYmXG4wIT09Yi5XaW5kRGVsdGEmJjAhPT1mLldpbmREZWx0YSYmKGU9dGhpcy5BZGRPdXRQdChmLGIuQm90KSx0aGlzLkFkZEpvaW4oYyxlLGIuVG9wKSl9Yj1iLk5leHRJbkFFTH19O2QuQ2xpcHBlci5wcm90b3R5cGUuRG9NYXhpbWE9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5HZXRNYXhpbWFQYWlyKGEpO2lmKG51bGw9PT1iKTA8PWEuT3V0SWR4JiZ0aGlzLkFkZE91dFB0KGEsYS5Ub3ApLHRoaXMuRGVsZXRlRnJvbUFFTChhKTtlbHNle2Zvcih2YXIgYz1hLk5leHRJbkFFTDtudWxsIT09YyYmYyE9YjspdGhpcy5JbnRlcnNlY3RFZGdlcyhhLGMsYS5Ub3AsITApLHRoaXMuU3dhcFBvc2l0aW9uc0luQUVMKGEsYyksYz1hLk5leHRJbkFFTDstMT09YS5PdXRJZHgmJi0xPT1iLk91dElkeD8odGhpcy5EZWxldGVGcm9tQUVMKGEpLHRoaXMuRGVsZXRlRnJvbUFFTChiKSk6MDw9YS5PdXRJZHgmJjA8PWIuT3V0SWR4P3RoaXMuSW50ZXJzZWN0RWRnZXMoYSxiLGEuVG9wLCExKTowPT09YS5XaW5kRGVsdGE/XG4oMDw9YS5PdXRJZHgmJih0aGlzLkFkZE91dFB0KGEsYS5Ub3ApLGEuT3V0SWR4PS0xKSx0aGlzLkRlbGV0ZUZyb21BRUwoYSksMDw9Yi5PdXRJZHgmJih0aGlzLkFkZE91dFB0KGIsYS5Ub3ApLGIuT3V0SWR4PS0xKSx0aGlzLkRlbGV0ZUZyb21BRUwoYikpOmQuRXJyb3IoXCJEb01heGltYSBlcnJvclwiKX19O2QuQ2xpcHBlci5SZXZlcnNlUGF0aHM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPTAsYz1hLmxlbmd0aDtiPGM7YisrKWFbYl0ucmV2ZXJzZSgpfTtkLkNsaXBwZXIuT3JpZW50YXRpb249ZnVuY3Rpb24oYSl7cmV0dXJuIDA8PWQuQ2xpcHBlci5BcmVhKGEpfTtkLkNsaXBwZXIucHJvdG90eXBlLlBvaW50Q291bnQ9ZnVuY3Rpb24oYSl7aWYobnVsbD09PWEpcmV0dXJuIDA7dmFyIGI9MCxjPWE7ZG8gYisrLGM9Yy5OZXh0O3doaWxlKGMhPWEpO3JldHVybiBifTtkLkNsaXBwZXIucHJvdG90eXBlLkJ1aWxkUmVzdWx0PWZ1bmN0aW9uKGEpe2QuQ2xlYXIoYSk7Zm9yKHZhciBiPTAsYz1cbnRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7YjxjO2IrKyl7dmFyIGU9dGhpcy5tX1BvbHlPdXRzW2JdO2lmKG51bGwhPT1lLlB0cyl7dmFyIGU9ZS5QdHMuUHJldixmPXRoaXMuUG9pbnRDb3VudChlKTtpZighKDI+Zikpe2Zvcih2YXIgZz1BcnJheShmKSxoPTA7aDxmO2grKylnW2hdPWUuUHQsZT1lLlByZXY7YS5wdXNoKGcpfX19fTtkLkNsaXBwZXIucHJvdG90eXBlLkJ1aWxkUmVzdWx0Mj1mdW5jdGlvbihhKXthLkNsZWFyKCk7Zm9yKHZhciBiPTAsYz10aGlzLm1fUG9seU91dHMubGVuZ3RoO2I8YztiKyspe3ZhciBlPXRoaXMubV9Qb2x5T3V0c1tiXSxmPXRoaXMuUG9pbnRDb3VudChlLlB0cyk7aWYoIShlLklzT3BlbiYmMj5mfHwhZS5Jc09wZW4mJjM+Zikpe3RoaXMuRml4SG9sZUxpbmthZ2UoZSk7dmFyIGc9bmV3IGQuUG9seU5vZGU7YS5tX0FsbFBvbHlzLnB1c2goZyk7ZS5Qb2x5Tm9kZT1nO2cubV9wb2x5Z29uLmxlbmd0aD1mO2Zvcih2YXIgZT1lLlB0cy5QcmV2LGg9MDtoPFxuZjtoKyspZy5tX3BvbHlnb25baF09ZS5QdCxlPWUuUHJldn19Yj0wO2ZvcihjPXRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7YjxjO2IrKyllPXRoaXMubV9Qb2x5T3V0c1tiXSxudWxsIT09ZS5Qb2x5Tm9kZSYmKGUuSXNPcGVuPyhlLlBvbHlOb2RlLklzT3Blbj0hMCxhLkFkZENoaWxkKGUuUG9seU5vZGUpKTpudWxsIT09ZS5GaXJzdExlZnQmJm51bGwhPWUuRmlyc3RMZWZ0LlBvbHlOb2RlP2UuRmlyc3RMZWZ0LlBvbHlOb2RlLkFkZENoaWxkKGUuUG9seU5vZGUpOmEuQWRkQ2hpbGQoZS5Qb2x5Tm9kZSkpfTtkLkNsaXBwZXIucHJvdG90eXBlLkZpeHVwT3V0UG9seWdvbj1mdW5jdGlvbihhKXt2YXIgYj1udWxsO2EuQm90dG9tUHQ9bnVsbDtmb3IodmFyIGM9YS5QdHM7Oyl7aWYoYy5QcmV2PT1jfHxjLlByZXY9PWMuTmV4dCl7dGhpcy5EaXNwb3NlT3V0UHRzKGMpO2EuUHRzPW51bGw7cmV0dXJufWlmKGQuSW50UG9pbnQub3BfRXF1YWxpdHkoYy5QdCxjLk5leHQuUHQpfHxkLkludFBvaW50Lm9wX0VxdWFsaXR5KGMuUHQsXG5jLlByZXYuUHQpfHxkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGMuUHJldi5QdCxjLlB0LGMuTmV4dC5QdCx0aGlzLm1fVXNlRnVsbFJhbmdlKSYmKCF0aGlzLlByZXNlcnZlQ29sbGluZWFyfHwhdGhpcy5QdDJJc0JldHdlZW5QdDFBbmRQdDMoYy5QcmV2LlB0LGMuUHQsYy5OZXh0LlB0KSkpYj1udWxsLGMuUHJldi5OZXh0PWMuTmV4dCxjPWMuTmV4dC5QcmV2PWMuUHJldjtlbHNlIGlmKGM9PWIpYnJlYWs7ZWxzZSBudWxsPT09YiYmKGI9YyksYz1jLk5leHR9YS5QdHM9Y307ZC5DbGlwcGVyLnByb3RvdHlwZS5EdXBPdXRQdD1mdW5jdGlvbihhLGIpe3ZhciBjPW5ldyBkLk91dFB0O2MuUHQuWD1hLlB0Llg7Yy5QdC5ZPWEuUHQuWTtjLklkeD1hLklkeDtiPyhjLk5leHQ9YS5OZXh0LGMuUHJldj1hLGEuTmV4dC5QcmV2PWMsYS5OZXh0PWMpOihjLlByZXY9YS5QcmV2LGMuTmV4dD1hLGEuUHJldi5OZXh0PWMsYS5QcmV2PWMpO3JldHVybiBjfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldE92ZXJsYXA9XG5mdW5jdGlvbihhLGIsYyxlLGQpe2E8Yj9jPGU/KGQuTGVmdD1NYXRoLm1heChhLGMpLGQuUmlnaHQ9TWF0aC5taW4oYixlKSk6KGQuTGVmdD1NYXRoLm1heChhLGUpLGQuUmlnaHQ9TWF0aC5taW4oYixjKSk6YzxlPyhkLkxlZnQ9TWF0aC5tYXgoYixjKSxkLlJpZ2h0PU1hdGgubWluKGEsZSkpOihkLkxlZnQ9TWF0aC5tYXgoYixlKSxkLlJpZ2h0PU1hdGgubWluKGEsYykpO3JldHVybiBkLkxlZnQ8ZC5SaWdodH07ZC5DbGlwcGVyLnByb3RvdHlwZS5Kb2luSG9yej1mdW5jdGlvbihhLGIsYyxlLGYsZyl7dmFyIGg9YS5QdC5YPmIuUHQuWD9kLkRpcmVjdGlvbi5kUmlnaHRUb0xlZnQ6ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0O2U9Yy5QdC5YPmUuUHQuWD9kLkRpcmVjdGlvbi5kUmlnaHRUb0xlZnQ6ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0O2lmKGg9PWUpcmV0dXJuITE7aWYoaD09ZC5EaXJlY3Rpb24uZExlZnRUb1JpZ2h0KXtmb3IoO2EuTmV4dC5QdC5YPD1mLlgmJmEuTmV4dC5QdC5YPj1cbmEuUHQuWCYmYS5OZXh0LlB0Llk9PWYuWTspYT1hLk5leHQ7ZyYmYS5QdC5YIT1mLlgmJihhPWEuTmV4dCk7Yj10aGlzLkR1cE91dFB0KGEsIWcpO2QuSW50UG9pbnQub3BfSW5lcXVhbGl0eShiLlB0LGYpJiYoYT1iLGEuUHQuWD1mLlgsYS5QdC5ZPWYuWSxiPXRoaXMuRHVwT3V0UHQoYSwhZykpfWVsc2V7Zm9yKDthLk5leHQuUHQuWD49Zi5YJiZhLk5leHQuUHQuWDw9YS5QdC5YJiZhLk5leHQuUHQuWT09Zi5ZOylhPWEuTmV4dDtnfHxhLlB0Llg9PWYuWHx8KGE9YS5OZXh0KTtiPXRoaXMuRHVwT3V0UHQoYSxnKTtkLkludFBvaW50Lm9wX0luZXF1YWxpdHkoYi5QdCxmKSYmKGE9YixhLlB0Llg9Zi5YLGEuUHQuWT1mLlksYj10aGlzLkR1cE91dFB0KGEsZykpfWlmKGU9PWQuRGlyZWN0aW9uLmRMZWZ0VG9SaWdodCl7Zm9yKDtjLk5leHQuUHQuWDw9Zi5YJiZjLk5leHQuUHQuWD49Yy5QdC5YJiZjLk5leHQuUHQuWT09Zi5ZOyljPWMuTmV4dDtnJiZjLlB0LlghPWYuWCYmKGM9Yy5OZXh0KTtcbmU9dGhpcy5EdXBPdXRQdChjLCFnKTtkLkludFBvaW50Lm9wX0luZXF1YWxpdHkoZS5QdCxmKSYmKGM9ZSxjLlB0Llg9Zi5YLGMuUHQuWT1mLlksZT10aGlzLkR1cE91dFB0KGMsIWcpKX1lbHNle2Zvcig7Yy5OZXh0LlB0Llg+PWYuWCYmYy5OZXh0LlB0Llg8PWMuUHQuWCYmYy5OZXh0LlB0Llk9PWYuWTspYz1jLk5leHQ7Z3x8Yy5QdC5YPT1mLlh8fChjPWMuTmV4dCk7ZT10aGlzLkR1cE91dFB0KGMsZyk7ZC5JbnRQb2ludC5vcF9JbmVxdWFsaXR5KGUuUHQsZikmJihjPWUsYy5QdC5YPWYuWCxjLlB0Llk9Zi5ZLGU9dGhpcy5EdXBPdXRQdChjLGcpKX1oPT1kLkRpcmVjdGlvbi5kTGVmdFRvUmlnaHQ9PWc/KGEuUHJldj1jLGMuTmV4dD1hLGIuTmV4dD1lLGUuUHJldj1iKTooYS5OZXh0PWMsYy5QcmV2PWEsYi5QcmV2PWUsZS5OZXh0PWIpO3JldHVybiEwfTtkLkNsaXBwZXIucHJvdG90eXBlLkpvaW5Qb2ludHM9ZnVuY3Rpb24oYSxiLGMpe3ZhciBlPWEuT3V0UHQxLGY9bmV3IGQuT3V0UHQsXG5nPWEuT3V0UHQyLGg9bmV3IGQuT3V0UHQ7aWYoKGg9YS5PdXRQdDEuUHQuWT09YS5PZmZQdC5ZKSYmZC5JbnRQb2ludC5vcF9FcXVhbGl0eShhLk9mZlB0LGEuT3V0UHQxLlB0KSYmZC5JbnRQb2ludC5vcF9FcXVhbGl0eShhLk9mZlB0LGEuT3V0UHQyLlB0KSl7Zm9yKGY9YS5PdXRQdDEuTmV4dDtmIT1lJiZkLkludFBvaW50Lm9wX0VxdWFsaXR5KGYuUHQsYS5PZmZQdCk7KWY9Zi5OZXh0O2Y9Zi5QdC5ZPmEuT2ZmUHQuWTtmb3IoaD1hLk91dFB0Mi5OZXh0O2ghPWcmJmQuSW50UG9pbnQub3BfRXF1YWxpdHkoaC5QdCxhLk9mZlB0KTspaD1oLk5leHQ7aWYoZj09aC5QdC5ZPmEuT2ZmUHQuWSlyZXR1cm4hMTtmPyhmPXRoaXMuRHVwT3V0UHQoZSwhMSksaD10aGlzLkR1cE91dFB0KGcsITApLGUuUHJldj1nLGcuTmV4dD1lLGYuTmV4dD1oLGguUHJldj1mKTooZj10aGlzLkR1cE91dFB0KGUsITApLGg9dGhpcy5EdXBPdXRQdChnLCExKSxlLk5leHQ9ZyxnLlByZXY9ZSxmLlByZXY9aCxcbmguTmV4dD1mKTthLk91dFB0MT1lO2EuT3V0UHQyPWY7cmV0dXJuITB9aWYoaCl7Zm9yKGY9ZTtlLlByZXYuUHQuWT09ZS5QdC5ZJiZlLlByZXYhPWYmJmUuUHJldiE9ZzspZT1lLlByZXY7Zm9yKDtmLk5leHQuUHQuWT09Zi5QdC5ZJiZmLk5leHQhPWUmJmYuTmV4dCE9ZzspZj1mLk5leHQ7aWYoZi5OZXh0PT1lfHxmLk5leHQ9PWcpcmV0dXJuITE7Zm9yKGg9ZztnLlByZXYuUHQuWT09Zy5QdC5ZJiZnLlByZXYhPWgmJmcuUHJldiE9ZjspZz1nLlByZXY7Zm9yKDtoLk5leHQuUHQuWT09aC5QdC5ZJiZoLk5leHQhPWcmJmguTmV4dCE9ZTspaD1oLk5leHQ7aWYoaC5OZXh0PT1nfHxoLk5leHQ9PWUpcmV0dXJuITE7Yz17TGVmdDpudWxsLFJpZ2h0Om51bGx9O2lmKCF0aGlzLkdldE92ZXJsYXAoZS5QdC5YLGYuUHQuWCxnLlB0LlgsaC5QdC5YLGMpKXJldHVybiExO2I9Yy5MZWZ0O3ZhciBsPWMuUmlnaHQ7Yz1uZXcgZC5JbnRQb2ludDtlLlB0Llg+PWImJmUuUHQuWDw9bD8oYy5YPWUuUHQuWCxcbmMuWT1lLlB0LlksYj1lLlB0Llg+Zi5QdC5YKTpnLlB0Llg+PWImJmcuUHQuWDw9bD8oYy5YPWcuUHQuWCxjLlk9Zy5QdC5ZLGI9Zy5QdC5YPmguUHQuWCk6Zi5QdC5YPj1iJiZmLlB0Llg8PWw/KGMuWD1mLlB0LlgsYy5ZPWYuUHQuWSxiPWYuUHQuWD5lLlB0LlgpOihjLlg9aC5QdC5YLGMuWT1oLlB0LlksYj1oLlB0Llg+Zy5QdC5YKTthLk91dFB0MT1lO2EuT3V0UHQyPWc7cmV0dXJuIHRoaXMuSm9pbkhvcnooZSxmLGcsaCxjLGIpfWZvcihmPWUuTmV4dDtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGYuUHQsZS5QdCkmJmYhPWU7KWY9Zi5OZXh0O2lmKGw9Zi5QdC5ZPmUuUHQuWXx8IWQuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWwoZS5QdCxmLlB0LGEuT2ZmUHQsdGhpcy5tX1VzZUZ1bGxSYW5nZSkpe2ZvcihmPWUuUHJldjtkLkludFBvaW50Lm9wX0VxdWFsaXR5KGYuUHQsZS5QdCkmJmYhPWU7KWY9Zi5QcmV2O2lmKGYuUHQuWT5lLlB0Lll8fCFkLkNsaXBwZXJCYXNlLlNsb3Blc0VxdWFsKGUuUHQsXG5mLlB0LGEuT2ZmUHQsdGhpcy5tX1VzZUZ1bGxSYW5nZSkpcmV0dXJuITF9Zm9yKGg9Zy5OZXh0O2QuSW50UG9pbnQub3BfRXF1YWxpdHkoaC5QdCxnLlB0KSYmaCE9ZzspaD1oLk5leHQ7dmFyIGs9aC5QdC5ZPmcuUHQuWXx8IWQuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWwoZy5QdCxoLlB0LGEuT2ZmUHQsdGhpcy5tX1VzZUZ1bGxSYW5nZSk7aWYoayl7Zm9yKGg9Zy5QcmV2O2QuSW50UG9pbnQub3BfRXF1YWxpdHkoaC5QdCxnLlB0KSYmaCE9ZzspaD1oLlByZXY7aWYoaC5QdC5ZPmcuUHQuWXx8IWQuQ2xpcHBlckJhc2UuU2xvcGVzRXF1YWwoZy5QdCxoLlB0LGEuT2ZmUHQsdGhpcy5tX1VzZUZ1bGxSYW5nZSkpcmV0dXJuITF9aWYoZj09ZXx8aD09Z3x8Zj09aHx8Yj09YyYmbD09aylyZXR1cm4hMTtsPyhmPXRoaXMuRHVwT3V0UHQoZSwhMSksaD10aGlzLkR1cE91dFB0KGcsITApLGUuUHJldj1nLGcuTmV4dD1lLGYuTmV4dD1oLGguUHJldj1mKTooZj10aGlzLkR1cE91dFB0KGUsITApLFxuaD10aGlzLkR1cE91dFB0KGcsITEpLGUuTmV4dD1nLGcuUHJldj1lLGYuUHJldj1oLGguTmV4dD1mKTthLk91dFB0MT1lO2EuT3V0UHQyPWY7cmV0dXJuITB9O2QuQ2xpcHBlci5HZXRCb3VuZHM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPTAsYz1hLmxlbmd0aDtiPGMmJjA9PWFbYl0ubGVuZ3RoOyliKys7aWYoYj09YylyZXR1cm4gbmV3IGQuSW50UmVjdCgwLDAsMCwwKTt2YXIgZT1uZXcgZC5JbnRSZWN0O2UubGVmdD1hW2JdWzBdLlg7ZS5yaWdodD1lLmxlZnQ7ZS50b3A9YVtiXVswXS5ZO2ZvcihlLmJvdHRvbT1lLnRvcDtiPGM7YisrKWZvcih2YXIgZj0wLGc9YVtiXS5sZW5ndGg7ZjxnO2YrKylhW2JdW2ZdLlg8ZS5sZWZ0P2UubGVmdD1hW2JdW2ZdLlg6YVtiXVtmXS5YPmUucmlnaHQmJihlLnJpZ2h0PWFbYl1bZl0uWCksYVtiXVtmXS5ZPGUudG9wP2UudG9wPWFbYl1bZl0uWTphW2JdW2ZdLlk+ZS5ib3R0b20mJihlLmJvdHRvbT1hW2JdW2ZdLlkpO3JldHVybiBlfTtkLkNsaXBwZXIucHJvdG90eXBlLkdldEJvdW5kczI9XG5mdW5jdGlvbihhKXt2YXIgYj1hLGM9bmV3IGQuSW50UmVjdDtjLmxlZnQ9YS5QdC5YO2MucmlnaHQ9YS5QdC5YO2MudG9wPWEuUHQuWTtjLmJvdHRvbT1hLlB0Llk7Zm9yKGE9YS5OZXh0O2EhPWI7KWEuUHQuWDxjLmxlZnQmJihjLmxlZnQ9YS5QdC5YKSxhLlB0Llg+Yy5yaWdodCYmKGMucmlnaHQ9YS5QdC5YKSxhLlB0Llk8Yy50b3AmJihjLnRvcD1hLlB0LlkpLGEuUHQuWT5jLmJvdHRvbSYmKGMuYm90dG9tPWEuUHQuWSksYT1hLk5leHQ7cmV0dXJuIGN9O2QuQ2xpcHBlci5Qb2ludEluUG9seWdvbj1mdW5jdGlvbihhLGIpe3ZhciBjPTAsZT1iLmxlbmd0aDtpZigzPmUpcmV0dXJuIDA7Zm9yKHZhciBkPWJbMF0sZz0xO2c8PWU7KytnKXt2YXIgaD1nPT1lP2JbMF06YltnXTtpZihoLlk9PWEuWSYmKGguWD09YS5YfHxkLlk9PWEuWSYmaC5YPmEuWD09ZC5YPGEuWCkpcmV0dXJuLTE7aWYoZC5ZPGEuWSE9aC5ZPGEuWSlpZihkLlg+PWEuWClpZihoLlg+YS5YKWM9MS1jO2Vsc2V7dmFyIGw9XG4oZC5YLWEuWCkqKGguWS1hLlkpLShoLlgtYS5YKSooZC5ZLWEuWSk7aWYoMD09bClyZXR1cm4tMTswPGw9PWguWT5kLlkmJihjPTEtYyl9ZWxzZSBpZihoLlg+YS5YKXtsPShkLlgtYS5YKSooaC5ZLWEuWSktKGguWC1hLlgpKihkLlktYS5ZKTtpZigwPT1sKXJldHVybi0xOzA8bD09aC5ZPmQuWSYmKGM9MS1jKX1kPWh9cmV0dXJuIGN9O2QuQ2xpcHBlci5wcm90b3R5cGUuUG9pbnRJblBvbHlnb249ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MCxlPWI7Oyl7dmFyIGQ9Yi5QdC5YLGc9Yi5QdC5ZLGg9Yi5OZXh0LlB0LlgsbD1iLk5leHQuUHQuWTtpZihsPT1hLlkmJihoPT1hLlh8fGc9PWEuWSYmaD5hLlg9PWQ8YS5YKSlyZXR1cm4tMTtpZihnPGEuWSE9bDxhLlkpaWYoZD49YS5YKWlmKGg+YS5YKWM9MS1jO2Vsc2V7ZD0oZC1hLlgpKihsLWEuWSktKGgtYS5YKSooZy1hLlkpO2lmKDA9PWQpcmV0dXJuLTE7MDxkPT1sPmcmJihjPTEtYyl9ZWxzZSBpZihoPmEuWCl7ZD0oZC1hLlgpKihsLVxuYS5ZKS0oaC1hLlgpKihnLWEuWSk7aWYoMD09ZClyZXR1cm4tMTswPGQ9PWw+ZyYmKGM9MS1jKX1iPWIuTmV4dDtpZihlPT1iKWJyZWFrfXJldHVybiBjfTtkLkNsaXBwZXIucHJvdG90eXBlLlBvbHkyQ29udGFpbnNQb2x5MT1mdW5jdGlvbihhLGIpe3ZhciBjPWE7ZG97dmFyIGU9dGhpcy5Qb2ludEluUG9seWdvbihjLlB0LGIpO2lmKDA8PWUpcmV0dXJuIDAhPWU7Yz1jLk5leHR9d2hpbGUoYyE9YSk7cmV0dXJuITB9O2QuQ2xpcHBlci5wcm90b3R5cGUuRml4dXBGaXJzdExlZnRzMT1mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0wLGU9dGhpcy5tX1BvbHlPdXRzLmxlbmd0aDtjPGU7YysrKXt2YXIgZD10aGlzLm1fUG9seU91dHNbY107bnVsbCE9PWQuUHRzJiZkLkZpcnN0TGVmdD09YSYmdGhpcy5Qb2x5MkNvbnRhaW5zUG9seTEoZC5QdHMsYi5QdHMpJiYoZC5GaXJzdExlZnQ9Yil9fTtkLkNsaXBwZXIucHJvdG90eXBlLkZpeHVwRmlyc3RMZWZ0czI9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9XG4wLGU9dGhpcy5tX1BvbHlPdXRzLGQ9ZS5sZW5ndGgsZz1lW2NdO2M8ZDtjKyssZz1lW2NdKWcuRmlyc3RMZWZ0PT1hJiYoZy5GaXJzdExlZnQ9Yil9O2QuQ2xpcHBlci5QYXJzZUZpcnN0TGVmdD1mdW5jdGlvbihhKXtmb3IoO251bGwhPWEmJm51bGw9PWEuUHRzOylhPWEuRmlyc3RMZWZ0O3JldHVybiBhfTtkLkNsaXBwZXIucHJvdG90eXBlLkpvaW5Db21tb25FZGdlcz1mdW5jdGlvbigpe2Zvcih2YXIgYT0wLGI9dGhpcy5tX0pvaW5zLmxlbmd0aDthPGI7YSsrKXt2YXIgYz10aGlzLm1fSm9pbnNbYV0sZT10aGlzLkdldE91dFJlYyhjLk91dFB0MS5JZHgpLGY9dGhpcy5HZXRPdXRSZWMoYy5PdXRQdDIuSWR4KTtpZihudWxsIT1lLlB0cyYmbnVsbCE9Zi5QdHMpe3ZhciBnO2c9ZT09Zj9lOnRoaXMuUGFyYW0xUmlnaHRPZlBhcmFtMihlLGYpP2Y6dGhpcy5QYXJhbTFSaWdodE9mUGFyYW0yKGYsZSk/ZTp0aGlzLkdldExvd2VybW9zdFJlYyhlLGYpO2lmKHRoaXMuSm9pblBvaW50cyhjLFxuZSxmKSlpZihlPT1mKXtlLlB0cz1jLk91dFB0MTtlLkJvdHRvbVB0PW51bGw7Zj10aGlzLkNyZWF0ZU91dFJlYygpO2YuUHRzPWMuT3V0UHQyO3RoaXMuVXBkYXRlT3V0UHRJZHhzKGYpO2lmKHRoaXMubV9Vc2luZ1BvbHlUcmVlKXtnPTA7Zm9yKHZhciBoPXRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7ZzxoLTE7ZysrKXt2YXIgbD10aGlzLm1fUG9seU91dHNbZ107bnVsbCE9bC5QdHMmJmQuQ2xpcHBlci5QYXJzZUZpcnN0TGVmdChsLkZpcnN0TGVmdCk9PWUmJmwuSXNIb2xlIT1lLklzSG9sZSYmdGhpcy5Qb2x5MkNvbnRhaW5zUG9seTEobC5QdHMsYy5PdXRQdDIpJiYobC5GaXJzdExlZnQ9Zil9fXRoaXMuUG9seTJDb250YWluc1BvbHkxKGYuUHRzLGUuUHRzKT8oZi5Jc0hvbGU9IWUuSXNIb2xlLGYuRmlyc3RMZWZ0PWUsdGhpcy5tX1VzaW5nUG9seVRyZWUmJnRoaXMuRml4dXBGaXJzdExlZnRzMihmLGUpLChmLklzSG9sZV50aGlzLlJldmVyc2VTb2x1dGlvbik9PTA8dGhpcy5BcmVhKGYpJiZcbnRoaXMuUmV2ZXJzZVBvbHlQdExpbmtzKGYuUHRzKSk6dGhpcy5Qb2x5MkNvbnRhaW5zUG9seTEoZS5QdHMsZi5QdHMpPyhmLklzSG9sZT1lLklzSG9sZSxlLklzSG9sZT0hZi5Jc0hvbGUsZi5GaXJzdExlZnQ9ZS5GaXJzdExlZnQsZS5GaXJzdExlZnQ9Zix0aGlzLm1fVXNpbmdQb2x5VHJlZSYmdGhpcy5GaXh1cEZpcnN0TGVmdHMyKGUsZiksKGUuSXNIb2xlXnRoaXMuUmV2ZXJzZVNvbHV0aW9uKT09MDx0aGlzLkFyZWEoZSkmJnRoaXMuUmV2ZXJzZVBvbHlQdExpbmtzKGUuUHRzKSk6KGYuSXNIb2xlPWUuSXNIb2xlLGYuRmlyc3RMZWZ0PWUuRmlyc3RMZWZ0LHRoaXMubV9Vc2luZ1BvbHlUcmVlJiZ0aGlzLkZpeHVwRmlyc3RMZWZ0czEoZSxmKSl9ZWxzZSBmLlB0cz1udWxsLGYuQm90dG9tUHQ9bnVsbCxmLklkeD1lLklkeCxlLklzSG9sZT1nLklzSG9sZSxnPT1mJiYoZS5GaXJzdExlZnQ9Zi5GaXJzdExlZnQpLGYuRmlyc3RMZWZ0PWUsdGhpcy5tX1VzaW5nUG9seVRyZWUmJnRoaXMuRml4dXBGaXJzdExlZnRzMihmLFxuZSl9fX07ZC5DbGlwcGVyLnByb3RvdHlwZS5VcGRhdGVPdXRQdElkeHM9ZnVuY3Rpb24oYSl7dmFyIGI9YS5QdHM7ZG8gYi5JZHg9YS5JZHgsYj1iLlByZXY7d2hpbGUoYiE9YS5QdHMpfTtkLkNsaXBwZXIucHJvdG90eXBlLkRvU2ltcGxlUG9seWdvbnM9ZnVuY3Rpb24oKXtmb3IodmFyIGE9MDthPHRoaXMubV9Qb2x5T3V0cy5sZW5ndGg7KXt2YXIgYj10aGlzLm1fUG9seU91dHNbYSsrXSxjPWIuUHRzO2lmKG51bGwhPT1jKXtkb3tmb3IodmFyIGU9Yy5OZXh0O2UhPWIuUHRzOyl7aWYoZC5JbnRQb2ludC5vcF9FcXVhbGl0eShjLlB0LGUuUHQpJiZlLk5leHQhPWMmJmUuUHJldiE9Yyl7dmFyIGY9Yy5QcmV2LGc9ZS5QcmV2O2MuUHJldj1nO2cuTmV4dD1jO2UuUHJldj1mO2YuTmV4dD1lO2IuUHRzPWM7Zj10aGlzLkNyZWF0ZU91dFJlYygpO2YuUHRzPWU7dGhpcy5VcGRhdGVPdXRQdElkeHMoZik7dGhpcy5Qb2x5MkNvbnRhaW5zUG9seTEoZi5QdHMsYi5QdHMpPyhmLklzSG9sZT0hYi5Jc0hvbGUsXG5mLkZpcnN0TGVmdD1iKTp0aGlzLlBvbHkyQ29udGFpbnNQb2x5MShiLlB0cyxmLlB0cyk/KGYuSXNIb2xlPWIuSXNIb2xlLGIuSXNIb2xlPSFmLklzSG9sZSxmLkZpcnN0TGVmdD1iLkZpcnN0TGVmdCxiLkZpcnN0TGVmdD1mKTooZi5Jc0hvbGU9Yi5Jc0hvbGUsZi5GaXJzdExlZnQ9Yi5GaXJzdExlZnQpO2U9Y31lPWUuTmV4dH1jPWMuTmV4dH13aGlsZShjIT1iLlB0cyl9fX07ZC5DbGlwcGVyLkFyZWE9ZnVuY3Rpb24oYSl7dmFyIGI9YS5sZW5ndGg7aWYoMz5iKXJldHVybiAwO2Zvcih2YXIgYz0wLGU9MCxkPWItMTtlPGI7KytlKWMrPShhW2RdLlgrYVtlXS5YKSooYVtkXS5ZLWFbZV0uWSksZD1lO3JldHVybiAwLjUqLWN9O2QuQ2xpcHBlci5wcm90b3R5cGUuQXJlYT1mdW5jdGlvbihhKXt2YXIgYj1hLlB0cztpZihudWxsPT1iKXJldHVybiAwO3ZhciBjPTA7ZG8gYys9KGIuUHJldi5QdC5YK2IuUHQuWCkqKGIuUHJldi5QdC5ZLWIuUHQuWSksYj1iLk5leHQ7d2hpbGUoYiE9YS5QdHMpO1xucmV0dXJuIDAuNSpjfTtkLkNsaXBwZXIuU2ltcGxpZnlQb2x5Z29uPWZ1bmN0aW9uKGEsYil7dmFyIGM9W10sZT1uZXcgZC5DbGlwcGVyKDApO2UuU3RyaWN0bHlTaW1wbGU9ITA7ZS5BZGRQYXRoKGEsZC5Qb2x5VHlwZS5wdFN1YmplY3QsITApO2UuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYyxiLGIpO3JldHVybiBjfTtkLkNsaXBwZXIuU2ltcGxpZnlQb2x5Z29ucz1mdW5jdGlvbihhLGIpe1widW5kZWZpbmVkXCI9PXR5cGVvZiBiJiYoYj1kLlBvbHlGaWxsVHlwZS5wZnRFdmVuT2RkKTt2YXIgYz1bXSxlPW5ldyBkLkNsaXBwZXIoMCk7ZS5TdHJpY3RseVNpbXBsZT0hMDtlLkFkZFBhdGhzKGEsZC5Qb2x5VHlwZS5wdFN1YmplY3QsITApO2UuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYyxiLGIpO3JldHVybiBjfTtkLkNsaXBwZXIuRGlzdGFuY2VTcXJkPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5YLWIuWCxlPWEuWS1iLlk7cmV0dXJuIGMqYytlKmV9O2QuQ2xpcHBlci5EaXN0YW5jZUZyb21MaW5lU3FyZD1cbmZ1bmN0aW9uKGEsYixjKXt2YXIgZT1iLlktYy5ZO2M9Yy5YLWIuWDtiPWUqYi5YK2MqYi5ZO2I9ZSphLlgrYyphLlktYjtyZXR1cm4gYipiLyhlKmUrYypjKX07ZC5DbGlwcGVyLlNsb3Blc05lYXJDb2xsaW5lYXI9ZnVuY3Rpb24oYSxiLGMsZSl7cmV0dXJuIGQuQ2xpcHBlci5EaXN0YW5jZUZyb21MaW5lU3FyZChiLGEsYyk8ZX07ZC5DbGlwcGVyLlBvaW50c0FyZUNsb3NlPWZ1bmN0aW9uKGEsYixjKXt2YXIgZT1hLlgtYi5YO2E9YS5ZLWIuWTtyZXR1cm4gZSplK2EqYTw9Y307ZC5DbGlwcGVyLkV4Y2x1ZGVPcD1mdW5jdGlvbihhKXt2YXIgYj1hLlByZXY7Yi5OZXh0PWEuTmV4dDthLk5leHQuUHJldj1iO2IuSWR4PTA7cmV0dXJuIGJ9O2QuQ2xpcHBlci5DbGVhblBvbHlnb249ZnVuY3Rpb24oYSxiKXtcInVuZGVmaW5lZFwiPT10eXBlb2YgYiYmKGI9MS40MTUpO3ZhciBjPWEubGVuZ3RoO2lmKDA9PWMpcmV0dXJuW107Zm9yKHZhciBlPUFycmF5KGMpLGY9MDtmPGM7KytmKWVbZl09XG5uZXcgZC5PdXRQdDtmb3IoZj0wO2Y8YzsrK2YpZVtmXS5QdD1hW2ZdLGVbZl0uTmV4dD1lWyhmKzEpJWNdLGVbZl0uTmV4dC5QcmV2PWVbZl0sZVtmXS5JZHg9MDtmPWIqYjtmb3IoZT1lWzBdOzA9PWUuSWR4JiZlLk5leHQhPWUuUHJldjspZC5DbGlwcGVyLlBvaW50c0FyZUNsb3NlKGUuUHQsZS5QcmV2LlB0LGYpPyhlPWQuQ2xpcHBlci5FeGNsdWRlT3AoZSksYy0tKTpkLkNsaXBwZXIuUG9pbnRzQXJlQ2xvc2UoZS5QcmV2LlB0LGUuTmV4dC5QdCxmKT8oZC5DbGlwcGVyLkV4Y2x1ZGVPcChlLk5leHQpLGU9ZC5DbGlwcGVyLkV4Y2x1ZGVPcChlKSxjLT0yKTpkLkNsaXBwZXIuU2xvcGVzTmVhckNvbGxpbmVhcihlLlByZXYuUHQsZS5QdCxlLk5leHQuUHQsZik/KGU9ZC5DbGlwcGVyLkV4Y2x1ZGVPcChlKSxjLS0pOihlLklkeD0xLGU9ZS5OZXh0KTszPmMmJihjPTApO2Zvcih2YXIgZz1BcnJheShjKSxmPTA7ZjxjOysrZilnW2ZdPW5ldyBkLkludFBvaW50KGUuUHQpLGU9ZS5OZXh0O1xucmV0dXJuIGd9O2QuQ2xpcHBlci5DbGVhblBvbHlnb25zPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPUFycmF5KGEubGVuZ3RoKSxlPTAsZj1hLmxlbmd0aDtlPGY7ZSsrKWNbZV09ZC5DbGlwcGVyLkNsZWFuUG9seWdvbihhW2VdLGIpO3JldHVybiBjfTtkLkNsaXBwZXIuTWlua293c2tpPWZ1bmN0aW9uKGEsYixjLGUpe3ZhciBmPWU/MTowLGc9YS5sZW5ndGgsaD1iLmxlbmd0aDtlPVtdO2lmKGMpZm9yKGM9MDtjPGg7YysrKXtmb3IodmFyIGw9QXJyYXkoZyksaz0wLG49YS5sZW5ndGgsbT1hW2tdO2s8bjtrKyssbT1hW2tdKWxba109bmV3IGQuSW50UG9pbnQoYltjXS5YK20uWCxiW2NdLlkrbS5ZKTtlLnB1c2gobCl9ZWxzZSBmb3IoYz0wO2M8aDtjKyspe2w9QXJyYXkoZyk7az0wO249YS5sZW5ndGg7Zm9yKG09YVtrXTtrPG47aysrLG09YVtrXSlsW2tdPW5ldyBkLkludFBvaW50KGJbY10uWC1tLlgsYltjXS5ZLW0uWSk7ZS5wdXNoKGwpfWE9W107Zm9yKGM9MDtjPGgtMStmO2MrKylmb3Ioaz1cbjA7azxnO2srKyliPVtdLGIucHVzaChlW2MlaF1bayVnXSksYi5wdXNoKGVbKGMrMSklaF1bayVnXSksYi5wdXNoKGVbKGMrMSklaF1bKGsrMSklZ10pLGIucHVzaChlW2MlaF1bKGsrMSklZ10pLGQuQ2xpcHBlci5PcmllbnRhdGlvbihiKXx8Yi5yZXZlcnNlKCksYS5wdXNoKGIpO2Y9bmV3IGQuQ2xpcHBlcigwKTtmLkFkZFBhdGhzKGEsZC5Qb2x5VHlwZS5wdFN1YmplY3QsITApO2YuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sZSxkLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvLGQuUG9seUZpbGxUeXBlLnBmdE5vblplcm8pO3JldHVybiBlfTtkLkNsaXBwZXIuTWlua293c2tpU3VtPWZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzLGI9YS5sZW5ndGg7aWYoMz09Yil7dmFyIGM9YVswXSxlPWFbMl07cmV0dXJuIGQuQ2xpcHBlci5NaW5rb3dza2koYyxhWzFdLCEwLGUpfWlmKDQ9PWIpe2Zvcih2YXIgYz1hWzBdLGY9YVsxXSxiPWFbMl0sZT1hWzNdLGE9bmV3IGQuQ2xpcHBlcixnLFxuaD0wLGw9Zi5sZW5ndGg7aDxsOysraClnPWQuQ2xpcHBlci5NaW5rb3dza2koYyxmW2hdLCEwLGUpLGEuQWRkUGF0aHMoZyxkLlBvbHlUeXBlLnB0U3ViamVjdCwhMCk7ZSYmYS5BZGRQYXRocyhmLGQuUG9seVR5cGUucHRDbGlwLCEwKTtjPW5ldyBkLlBhdGhzO2EuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYyxiLGIpO3JldHVybiBjfX07ZC5DbGlwcGVyLk1pbmtvd3NraURpZmY9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBkLkNsaXBwZXIuTWlua293c2tpKGEsYiwhMSxjKX07ZC5DbGlwcGVyLlBvbHlUcmVlVG9QYXRocz1mdW5jdGlvbihhKXt2YXIgYj1bXTtkLkNsaXBwZXIuQWRkUG9seU5vZGVUb1BhdGhzKGEsZC5DbGlwcGVyLk5vZGVUeXBlLm50QW55LGIpO3JldHVybiBifTtkLkNsaXBwZXIuQWRkUG9seU5vZGVUb1BhdGhzPWZ1bmN0aW9uKGEsYixjKXt2YXIgZT0hMDtzd2l0Y2goYil7Y2FzZSBkLkNsaXBwZXIuTm9kZVR5cGUubnRPcGVuOnJldHVybjtjYXNlIGQuQ2xpcHBlci5Ob2RlVHlwZS5udENsb3NlZDplPVxuIWEuSXNPcGVufTA8YS5tX3BvbHlnb24ubGVuZ3RoJiZlJiZjLnB1c2goYS5tX3BvbHlnb24pO2U9MDthPWEuQ2hpbGRzKCk7Zm9yKHZhciBmPWEubGVuZ3RoLGc9YVtlXTtlPGY7ZSsrLGc9YVtlXSlkLkNsaXBwZXIuQWRkUG9seU5vZGVUb1BhdGhzKGcsYixjKX07ZC5DbGlwcGVyLk9wZW5QYXRoc0Zyb21Qb2x5VHJlZT1mdW5jdGlvbihhKXtmb3IodmFyIGI9bmV3IGQuUGF0aHMsYz0wLGU9YS5DaGlsZENvdW50KCk7YzxlO2MrKylhLkNoaWxkcygpW2NdLklzT3BlbiYmYi5wdXNoKGEuQ2hpbGRzKClbY10ubV9wb2x5Z29uKTtyZXR1cm4gYn07ZC5DbGlwcGVyLkNsb3NlZFBhdGhzRnJvbVBvbHlUcmVlPWZ1bmN0aW9uKGEpe3ZhciBiPW5ldyBkLlBhdGhzO2QuQ2xpcHBlci5BZGRQb2x5Tm9kZVRvUGF0aHMoYSxkLkNsaXBwZXIuTm9kZVR5cGUubnRDbG9zZWQsYik7cmV0dXJuIGJ9O0soZC5DbGlwcGVyLGQuQ2xpcHBlckJhc2UpO2QuQ2xpcHBlci5Ob2RlVHlwZT17bnRBbnk6MCxudE9wZW46MSxcbm50Q2xvc2VkOjJ9O2QuQ2xpcHBlck9mZnNldD1mdW5jdGlvbihhLGIpe1widW5kZWZpbmVkXCI9PXR5cGVvZiBhJiYoYT0yKTtcInVuZGVmaW5lZFwiPT10eXBlb2YgYiYmKGI9ZC5DbGlwcGVyT2Zmc2V0LmRlZl9hcmNfdG9sZXJhbmNlKTt0aGlzLm1fZGVzdFBvbHlzPW5ldyBkLlBhdGhzO3RoaXMubV9zcmNQb2x5PW5ldyBkLlBhdGg7dGhpcy5tX2Rlc3RQb2x5PW5ldyBkLlBhdGg7dGhpcy5tX25vcm1hbHM9W107dGhpcy5tX1N0ZXBzUGVyUmFkPXRoaXMubV9taXRlckxpbT10aGlzLm1fY29zPXRoaXMubV9zaW49dGhpcy5tX3NpbkE9dGhpcy5tX2RlbHRhPTA7dGhpcy5tX2xvd2VzdD1uZXcgZC5JbnRQb2ludDt0aGlzLm1fcG9seU5vZGVzPW5ldyBkLlBvbHlOb2RlO3RoaXMuTWl0ZXJMaW1pdD1hO3RoaXMuQXJjVG9sZXJhbmNlPWI7dGhpcy5tX2xvd2VzdC5YPS0xfTtkLkNsaXBwZXJPZmZzZXQudHdvX3BpPTYuMjgzMTg1MzA3MTc5NTk7ZC5DbGlwcGVyT2Zmc2V0LmRlZl9hcmNfdG9sZXJhbmNlPVxuMC4yNTtkLkNsaXBwZXJPZmZzZXQucHJvdG90eXBlLkNsZWFyPWZ1bmN0aW9uKCl7ZC5DbGVhcih0aGlzLm1fcG9seU5vZGVzLkNoaWxkcygpKTt0aGlzLm1fbG93ZXN0Llg9LTF9O2QuQ2xpcHBlck9mZnNldC5Sb3VuZD1kLkNsaXBwZXIuUm91bmQ7ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5BZGRQYXRoPWZ1bmN0aW9uKGEsYixjKXt2YXIgZT1hLmxlbmd0aC0xO2lmKCEoMD5lKSl7dmFyIGY9bmV3IGQuUG9seU5vZGU7Zi5tX2pvaW50eXBlPWI7Zi5tX2VuZHR5cGU9YztpZihjPT1kLkVuZFR5cGUuZXRDbG9zZWRMaW5lfHxjPT1kLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29uKWZvcig7MDxlJiZkLkludFBvaW50Lm9wX0VxdWFsaXR5KGFbMF0sYVtlXSk7KWUtLTtmLm1fcG9seWdvbi5wdXNoKGFbMF0pO3ZhciBnPTA7Yj0wO2Zvcih2YXIgaD0xO2g8PWU7aCsrKWQuSW50UG9pbnQub3BfSW5lcXVhbGl0eShmLm1fcG9seWdvbltnXSxhW2hdKSYmKGcrKyxmLm1fcG9seWdvbi5wdXNoKGFbaF0pLFxuYVtoXS5ZPmYubV9wb2x5Z29uW2JdLll8fGFbaF0uWT09Zi5tX3BvbHlnb25bYl0uWSYmYVtoXS5YPGYubV9wb2x5Z29uW2JdLlgpJiYoYj1nKTtpZighKGM9PWQuRW5kVHlwZS5ldENsb3NlZFBvbHlnb24mJjI+Z3x8YyE9ZC5FbmRUeXBlLmV0Q2xvc2VkUG9seWdvbiYmMD5nKSYmKHRoaXMubV9wb2x5Tm9kZXMuQWRkQ2hpbGQoZiksYz09ZC5FbmRUeXBlLmV0Q2xvc2VkUG9seWdvbikpaWYoMD50aGlzLm1fbG93ZXN0LlgpdGhpcy5tX2xvd2VzdD1uZXcgZC5JbnRQb2ludCgwLGIpO2Vsc2UgaWYoYT10aGlzLm1fcG9seU5vZGVzLkNoaWxkcygpW3RoaXMubV9sb3dlc3QuWF0ubV9wb2x5Z29uW3RoaXMubV9sb3dlc3QuWV0sZi5tX3BvbHlnb25bYl0uWT5hLll8fGYubV9wb2x5Z29uW2JdLlk9PWEuWSYmZi5tX3BvbHlnb25bYl0uWDxhLlgpdGhpcy5tX2xvd2VzdD1uZXcgZC5JbnRQb2ludCh0aGlzLm1fcG9seU5vZGVzLkNoaWxkQ291bnQoKS0xLGIpfX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5BZGRQYXRocz1cbmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGU9MCxkPWEubGVuZ3RoO2U8ZDtlKyspdGhpcy5BZGRQYXRoKGFbZV0sYixjKX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5GaXhPcmllbnRhdGlvbnM9ZnVuY3Rpb24oKXtpZigwPD10aGlzLm1fbG93ZXN0LlgmJiFkLkNsaXBwZXIuT3JpZW50YXRpb24odGhpcy5tX3BvbHlOb2Rlcy5DaGlsZHMoKVt0aGlzLm1fbG93ZXN0LlhdLm1fcG9seWdvbikpZm9yKHZhciBhPTA7YTx0aGlzLm1fcG9seU5vZGVzLkNoaWxkQ291bnQoKTthKyspe3ZhciBiPXRoaXMubV9wb2x5Tm9kZXMuQ2hpbGRzKClbYV07KGIubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29ufHxiLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0Q2xvc2VkTGluZSYmZC5DbGlwcGVyLk9yaWVudGF0aW9uKGIubV9wb2x5Z29uKSkmJmIubV9wb2x5Z29uLnJldmVyc2UoKX1lbHNlIGZvcihhPTA7YTx0aGlzLm1fcG9seU5vZGVzLkNoaWxkQ291bnQoKTthKyspYj10aGlzLm1fcG9seU5vZGVzLkNoaWxkcygpW2FdLFxuYi5tX2VuZHR5cGUhPWQuRW5kVHlwZS5ldENsb3NlZExpbmV8fGQuQ2xpcHBlci5PcmllbnRhdGlvbihiLm1fcG9seWdvbil8fGIubV9wb2x5Z29uLnJldmVyc2UoKX07ZC5DbGlwcGVyT2Zmc2V0LkdldFVuaXROb3JtYWw9ZnVuY3Rpb24oYSxiKXt2YXIgYz1iLlgtYS5YLGU9Yi5ZLWEuWTtpZigwPT1jJiYwPT1lKXJldHVybiBuZXcgZC5Eb3VibGVQb2ludCgwLDApO3ZhciBmPTEvTWF0aC5zcXJ0KGMqYytlKmUpO3JldHVybiBuZXcgZC5Eb3VibGVQb2ludChlKmYsLShjKmYpKX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5Eb09mZnNldD1mdW5jdGlvbihhKXt0aGlzLm1fZGVzdFBvbHlzPVtdO3RoaXMubV9kZWx0YT1hO2lmKGQuQ2xpcHBlckJhc2UubmVhcl96ZXJvKGEpKWZvcih2YXIgYj0wO2I8dGhpcy5tX3BvbHlOb2Rlcy5DaGlsZENvdW50KCk7YisrKXt2YXIgYz10aGlzLm1fcG9seU5vZGVzLkNoaWxkcygpW2JdO2MubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29uJiZcbnRoaXMubV9kZXN0UG9seXMucHVzaChjLm1fcG9seWdvbil9ZWxzZXt0aGlzLm1fbWl0ZXJMaW09Mjx0aGlzLk1pdGVyTGltaXQ/Mi8odGhpcy5NaXRlckxpbWl0KnRoaXMuTWl0ZXJMaW1pdCk6MC41O3ZhciBiPTA+PXRoaXMuQXJjVG9sZXJhbmNlP2QuQ2xpcHBlck9mZnNldC5kZWZfYXJjX3RvbGVyYW5jZTp0aGlzLkFyY1RvbGVyYW5jZT5NYXRoLmFicyhhKSpkLkNsaXBwZXJPZmZzZXQuZGVmX2FyY190b2xlcmFuY2U/TWF0aC5hYnMoYSkqZC5DbGlwcGVyT2Zmc2V0LmRlZl9hcmNfdG9sZXJhbmNlOnRoaXMuQXJjVG9sZXJhbmNlLGU9My4xNDE1OTI2NTM1ODk3OS9NYXRoLmFjb3MoMS1iL01hdGguYWJzKGEpKTt0aGlzLm1fc2luPU1hdGguc2luKGQuQ2xpcHBlck9mZnNldC50d29fcGkvZSk7dGhpcy5tX2Nvcz1NYXRoLmNvcyhkLkNsaXBwZXJPZmZzZXQudHdvX3BpL2UpO3RoaXMubV9TdGVwc1BlclJhZD1lL2QuQ2xpcHBlck9mZnNldC50d29fcGk7MD5hJiYodGhpcy5tX3Npbj1cbi10aGlzLm1fc2luKTtmb3IoYj0wO2I8dGhpcy5tX3BvbHlOb2Rlcy5DaGlsZENvdW50KCk7YisrKXtjPXRoaXMubV9wb2x5Tm9kZXMuQ2hpbGRzKClbYl07dGhpcy5tX3NyY1BvbHk9Yy5tX3BvbHlnb247dmFyIGY9dGhpcy5tX3NyY1BvbHkubGVuZ3RoO2lmKCEoMD09Znx8MD49YSYmKDM+Znx8Yy5tX2VuZHR5cGUhPWQuRW5kVHlwZS5ldENsb3NlZFBvbHlnb24pKSl7dGhpcy5tX2Rlc3RQb2x5PVtdO2lmKDE9PWYpaWYoYy5tX2pvaW50eXBlPT1kLkpvaW5UeXBlLmp0Um91bmQpZm9yKHZhciBjPTEsZj0wLGc9MTtnPD1lO2crKyl7dGhpcy5tX2Rlc3RQb2x5LnB1c2gobmV3IGQuSW50UG9pbnQoZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5WzBdLlgrYyphKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbMF0uWStmKmEpKSk7dmFyIGg9YyxjPWMqdGhpcy5tX2Nvcy10aGlzLm1fc2luKmYsZj1oKnRoaXMubV9zaW4rZip0aGlzLm1fY29zfWVsc2UgZm9yKGY9XG5jPS0xLGc9MDs0Pmc7KytnKXRoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVswXS5YK2MqYSksZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5WzBdLlkrZiphKSkpLDA+Yz9jPTE6MD5mP2Y9MTpjPS0xO2Vsc2V7Zm9yKGc9dGhpcy5tX25vcm1hbHMubGVuZ3RoPTA7ZzxmLTE7ZysrKXRoaXMubV9ub3JtYWxzLnB1c2goZC5DbGlwcGVyT2Zmc2V0LkdldFVuaXROb3JtYWwodGhpcy5tX3NyY1BvbHlbZ10sdGhpcy5tX3NyY1BvbHlbZysxXSkpO2MubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRDbG9zZWRMaW5lfHxjLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0Q2xvc2VkUG9seWdvbj90aGlzLm1fbm9ybWFscy5wdXNoKGQuQ2xpcHBlck9mZnNldC5HZXRVbml0Tm9ybWFsKHRoaXMubV9zcmNQb2x5W2YtMV0sdGhpcy5tX3NyY1BvbHlbMF0pKTp0aGlzLm1fbm9ybWFscy5wdXNoKG5ldyBkLkRvdWJsZVBvaW50KHRoaXMubV9ub3JtYWxzW2YtXG4yXSkpO2lmKGMubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRDbG9zZWRQb2x5Z29uKWZvcihoPWYtMSxnPTA7ZzxmO2crKyloPXRoaXMuT2Zmc2V0UG9pbnQoZyxoLGMubV9qb2ludHlwZSk7ZWxzZSBpZihjLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0Q2xvc2VkTGluZSl7aD1mLTE7Zm9yKGc9MDtnPGY7ZysrKWg9dGhpcy5PZmZzZXRQb2ludChnLGgsYy5tX2pvaW50eXBlKTt0aGlzLm1fZGVzdFBvbHlzLnB1c2godGhpcy5tX2Rlc3RQb2x5KTt0aGlzLm1fZGVzdFBvbHk9W107aD10aGlzLm1fbm9ybWFsc1tmLTFdO2ZvcihnPWYtMTswPGc7Zy0tKXRoaXMubV9ub3JtYWxzW2ddPW5ldyBkLkRvdWJsZVBvaW50KC10aGlzLm1fbm9ybWFsc1tnLTFdLlgsLXRoaXMubV9ub3JtYWxzW2ctMV0uWSk7dGhpcy5tX25vcm1hbHNbMF09bmV3IGQuRG91YmxlUG9pbnQoLWguWCwtaC5ZKTtoPTA7Zm9yKGc9Zi0xOzA8PWc7Zy0tKWg9dGhpcy5PZmZzZXRQb2ludChnLGgsYy5tX2pvaW50eXBlKX1lbHNle2g9XG4wO2ZvcihnPTE7ZzxmLTE7KytnKWg9dGhpcy5PZmZzZXRQb2ludChnLGgsYy5tX2pvaW50eXBlKTtjLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0T3BlbkJ1dHQ/KGc9Zi0xLGg9bmV3IGQuSW50UG9pbnQoZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5W2ddLlgrdGhpcy5tX25vcm1hbHNbZ10uWCphKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbZ10uWSt0aGlzLm1fbm9ybWFsc1tnXS5ZKmEpKSx0aGlzLm1fZGVzdFBvbHkucHVzaChoKSxoPW5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVtnXS5YLXRoaXMubV9ub3JtYWxzW2ddLlgqYSksZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5W2ddLlktdGhpcy5tX25vcm1hbHNbZ10uWSphKSksdGhpcy5tX2Rlc3RQb2x5LnB1c2goaCkpOihnPWYtMSxoPWYtMix0aGlzLm1fc2luQT0wLHRoaXMubV9ub3JtYWxzW2ddPW5ldyBkLkRvdWJsZVBvaW50KC10aGlzLm1fbm9ybWFsc1tnXS5YLFxuLXRoaXMubV9ub3JtYWxzW2ddLlkpLGMubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRPcGVuU3F1YXJlP3RoaXMuRG9TcXVhcmUoZyxoKTp0aGlzLkRvUm91bmQoZyxoKSk7Zm9yKGc9Zi0xOzA8ZztnLS0pdGhpcy5tX25vcm1hbHNbZ109bmV3IGQuRG91YmxlUG9pbnQoLXRoaXMubV9ub3JtYWxzW2ctMV0uWCwtdGhpcy5tX25vcm1hbHNbZy0xXS5ZKTt0aGlzLm1fbm9ybWFsc1swXT1uZXcgZC5Eb3VibGVQb2ludCgtdGhpcy5tX25vcm1hbHNbMV0uWCwtdGhpcy5tX25vcm1hbHNbMV0uWSk7aD1mLTE7Zm9yKGc9aC0xOzA8ZzstLWcpaD10aGlzLk9mZnNldFBvaW50KGcsaCxjLm1fam9pbnR5cGUpO2MubV9lbmR0eXBlPT1kLkVuZFR5cGUuZXRPcGVuQnV0dD8oaD1uZXcgZC5JbnRQb2ludChkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbMF0uWC10aGlzLm1fbm9ybWFsc1swXS5YKmEpLGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVswXS5ZLXRoaXMubV9ub3JtYWxzWzBdLlkqXG5hKSksdGhpcy5tX2Rlc3RQb2x5LnB1c2goaCksaD1uZXcgZC5JbnRQb2ludChkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbMF0uWCt0aGlzLm1fbm9ybWFsc1swXS5YKmEpLGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVswXS5ZK3RoaXMubV9ub3JtYWxzWzBdLlkqYSkpLHRoaXMubV9kZXN0UG9seS5wdXNoKGgpKToodGhpcy5tX3NpbkE9MCxjLm1fZW5kdHlwZT09ZC5FbmRUeXBlLmV0T3BlblNxdWFyZT90aGlzLkRvU3F1YXJlKDAsMSk6dGhpcy5Eb1JvdW5kKDAsMSkpfX10aGlzLm1fZGVzdFBvbHlzLnB1c2godGhpcy5tX2Rlc3RQb2x5KX19fX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5FeGVjdXRlPWZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzO2lmKGFbMF1pbnN0YW5jZW9mIGQuUG9seVRyZWUpaWYoYj1hWzBdLGM9YVsxXSxiLkNsZWFyKCksdGhpcy5GaXhPcmllbnRhdGlvbnMoKSx0aGlzLkRvT2Zmc2V0KGMpLGE9bmV3IGQuQ2xpcHBlcigwKSxcbmEuQWRkUGF0aHModGhpcy5tX2Rlc3RQb2x5cyxkLlBvbHlUeXBlLnB0U3ViamVjdCwhMCksMDxjKWEuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYixkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZSxkLlBvbHlGaWxsVHlwZS5wZnRQb3NpdGl2ZSk7ZWxzZSBpZihjPWQuQ2xpcHBlci5HZXRCb3VuZHModGhpcy5tX2Rlc3RQb2x5cyksZT1uZXcgZC5QYXRoLGUucHVzaChuZXcgZC5JbnRQb2ludChjLmxlZnQtMTAsYy5ib3R0b20rMTApKSxlLnB1c2gobmV3IGQuSW50UG9pbnQoYy5yaWdodCsxMCxjLmJvdHRvbSsxMCkpLGUucHVzaChuZXcgZC5JbnRQb2ludChjLnJpZ2h0KzEwLGMudG9wLTEwKSksZS5wdXNoKG5ldyBkLkludFBvaW50KGMubGVmdC0xMCxjLnRvcC0xMCkpLGEuQWRkUGF0aChlLGQuUG9seVR5cGUucHRTdWJqZWN0LCEwKSxhLlJldmVyc2VTb2x1dGlvbj0hMCxhLkV4ZWN1dGUoZC5DbGlwVHlwZS5jdFVuaW9uLGIsZC5Qb2x5RmlsbFR5cGUucGZ0TmVnYXRpdmUsZC5Qb2x5RmlsbFR5cGUucGZ0TmVnYXRpdmUpLFxuMT09Yi5DaGlsZENvdW50KCkmJjA8Yi5DaGlsZHMoKVswXS5DaGlsZENvdW50KCkpZm9yKGE9Yi5DaGlsZHMoKVswXSxiLkNoaWxkcygpWzBdPWEuQ2hpbGRzKClbMF0sYz0xO2M8YS5DaGlsZENvdW50KCk7YysrKWIuQWRkQ2hpbGQoYS5DaGlsZHMoKVtjXSk7ZWxzZSBiLkNsZWFyKCk7ZWxzZXt2YXIgYj1hWzBdLGM9YVsxXTtkLkNsZWFyKGIpO3RoaXMuRml4T3JpZW50YXRpb25zKCk7dGhpcy5Eb09mZnNldChjKTthPW5ldyBkLkNsaXBwZXIoMCk7YS5BZGRQYXRocyh0aGlzLm1fZGVzdFBvbHlzLGQuUG9seVR5cGUucHRTdWJqZWN0LCEwKTtpZigwPGMpYS5FeGVjdXRlKGQuQ2xpcFR5cGUuY3RVbmlvbixiLGQuUG9seUZpbGxUeXBlLnBmdFBvc2l0aXZlLGQuUG9seUZpbGxUeXBlLnBmdFBvc2l0aXZlKTtlbHNle3ZhciBjPWQuQ2xpcHBlci5HZXRCb3VuZHModGhpcy5tX2Rlc3RQb2x5cyksZT1uZXcgZC5QYXRoO2UucHVzaChuZXcgZC5JbnRQb2ludChjLmxlZnQtMTAsYy5ib3R0b20rXG4xMCkpO2UucHVzaChuZXcgZC5JbnRQb2ludChjLnJpZ2h0KzEwLGMuYm90dG9tKzEwKSk7ZS5wdXNoKG5ldyBkLkludFBvaW50KGMucmlnaHQrMTAsYy50b3AtMTApKTtlLnB1c2gobmV3IGQuSW50UG9pbnQoYy5sZWZ0LTEwLGMudG9wLTEwKSk7YS5BZGRQYXRoKGUsZC5Qb2x5VHlwZS5wdFN1YmplY3QsITApO2EuUmV2ZXJzZVNvbHV0aW9uPSEwO2EuRXhlY3V0ZShkLkNsaXBUeXBlLmN0VW5pb24sYixkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZSxkLlBvbHlGaWxsVHlwZS5wZnROZWdhdGl2ZSk7MDxiLmxlbmd0aCYmYi5zcGxpY2UoMCwxKX19fTtkLkNsaXBwZXJPZmZzZXQucHJvdG90eXBlLk9mZnNldFBvaW50PWZ1bmN0aW9uKGEsYixjKXt0aGlzLm1fc2luQT10aGlzLm1fbm9ybWFsc1tiXS5YKnRoaXMubV9ub3JtYWxzW2FdLlktdGhpcy5tX25vcm1hbHNbYV0uWCp0aGlzLm1fbm9ybWFsc1tiXS5ZO2lmKDVFLTU+dGhpcy5tX3NpbkEmJi01RS01PHRoaXMubV9zaW5BKXJldHVybiBiO1xuMTx0aGlzLm1fc2luQT90aGlzLm1fc2luQT0xOi0xPnRoaXMubV9zaW5BJiYodGhpcy5tX3NpbkE9LTEpO2lmKDA+dGhpcy5tX3NpbkEqdGhpcy5tX2RlbHRhKXRoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK3RoaXMubV9ub3JtYWxzW2JdLlgqdGhpcy5tX2RlbHRhKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWSt0aGlzLm1fbm9ybWFsc1tiXS5ZKnRoaXMubV9kZWx0YSkpKSx0aGlzLm1fZGVzdFBvbHkucHVzaChuZXcgZC5JbnRQb2ludCh0aGlzLm1fc3JjUG9seVthXSkpLHRoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK3RoaXMubV9ub3JtYWxzW2FdLlgqdGhpcy5tX2RlbHRhKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWSt0aGlzLm1fbm9ybWFsc1thXS5ZKlxudGhpcy5tX2RlbHRhKSkpO2Vsc2Ugc3dpdGNoKGMpe2Nhc2UgZC5Kb2luVHlwZS5qdE1pdGVyOmM9MSsodGhpcy5tX25vcm1hbHNbYV0uWCp0aGlzLm1fbm9ybWFsc1tiXS5YK3RoaXMubV9ub3JtYWxzW2FdLlkqdGhpcy5tX25vcm1hbHNbYl0uWSk7Yz49dGhpcy5tX21pdGVyTGltP3RoaXMuRG9NaXRlcihhLGIsYyk6dGhpcy5Eb1NxdWFyZShhLGIpO2JyZWFrO2Nhc2UgZC5Kb2luVHlwZS5qdFNxdWFyZTp0aGlzLkRvU3F1YXJlKGEsYik7YnJlYWs7Y2FzZSBkLkpvaW5UeXBlLmp0Um91bmQ6dGhpcy5Eb1JvdW5kKGEsYil9cmV0dXJuIGF9O2QuQ2xpcHBlck9mZnNldC5wcm90b3R5cGUuRG9TcXVhcmU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1NYXRoLnRhbihNYXRoLmF0YW4yKHRoaXMubV9zaW5BLHRoaXMubV9ub3JtYWxzW2JdLlgqdGhpcy5tX25vcm1hbHNbYV0uWCt0aGlzLm1fbm9ybWFsc1tiXS5ZKnRoaXMubV9ub3JtYWxzW2FdLlkpLzQpO3RoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK1xudGhpcy5tX2RlbHRhKih0aGlzLm1fbm9ybWFsc1tiXS5YLXRoaXMubV9ub3JtYWxzW2JdLlkqYykpLGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5ZK3RoaXMubV9kZWx0YSoodGhpcy5tX25vcm1hbHNbYl0uWSt0aGlzLm1fbm9ybWFsc1tiXS5YKmMpKSkpO3RoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK3RoaXMubV9kZWx0YSoodGhpcy5tX25vcm1hbHNbYV0uWCt0aGlzLm1fbm9ybWFsc1thXS5ZKmMpKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWSt0aGlzLm1fZGVsdGEqKHRoaXMubV9ub3JtYWxzW2FdLlktdGhpcy5tX25vcm1hbHNbYV0uWCpjKSkpKX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5Eb01pdGVyPWZ1bmN0aW9uKGEsYixjKXtjPXRoaXMubV9kZWx0YS9jO3RoaXMubV9kZXN0UG9seS5wdXNoKG5ldyBkLkludFBvaW50KGQuQ2xpcHBlck9mZnNldC5Sb3VuZCh0aGlzLm1fc3JjUG9seVthXS5YK1xuKHRoaXMubV9ub3JtYWxzW2JdLlgrdGhpcy5tX25vcm1hbHNbYV0uWCkqYyksZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5W2FdLlkrKHRoaXMubV9ub3JtYWxzW2JdLlkrdGhpcy5tX25vcm1hbHNbYV0uWSkqYykpKX07ZC5DbGlwcGVyT2Zmc2V0LnByb3RvdHlwZS5Eb1JvdW5kPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPU1hdGguYXRhbjIodGhpcy5tX3NpbkEsdGhpcy5tX25vcm1hbHNbYl0uWCp0aGlzLm1fbm9ybWFsc1thXS5YK3RoaXMubV9ub3JtYWxzW2JdLlkqdGhpcy5tX25vcm1hbHNbYV0uWSksYz1kLkNhc3RfSW50MzIoZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9TdGVwc1BlclJhZCpNYXRoLmFicyhjKSkpLGU9dGhpcy5tX25vcm1hbHNbYl0uWCxmPXRoaXMubV9ub3JtYWxzW2JdLlksZyxoPTA7aDxjOysraCl0aGlzLm1fZGVzdFBvbHkucHVzaChuZXcgZC5JbnRQb2ludChkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWCtcbmUqdGhpcy5tX2RlbHRhKSxkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWStmKnRoaXMubV9kZWx0YSkpKSxnPWUsZT1lKnRoaXMubV9jb3MtdGhpcy5tX3NpbipmLGY9Zyp0aGlzLm1fc2luK2YqdGhpcy5tX2Nvczt0aGlzLm1fZGVzdFBvbHkucHVzaChuZXcgZC5JbnRQb2ludChkLkNsaXBwZXJPZmZzZXQuUm91bmQodGhpcy5tX3NyY1BvbHlbYV0uWCt0aGlzLm1fbm9ybWFsc1thXS5YKnRoaXMubV9kZWx0YSksZC5DbGlwcGVyT2Zmc2V0LlJvdW5kKHRoaXMubV9zcmNQb2x5W2FdLlkrdGhpcy5tX25vcm1hbHNbYV0uWSp0aGlzLm1fZGVsdGEpKSl9O2QuRXJyb3I9ZnVuY3Rpb24oYSl7dHJ5e3Rocm93IEVycm9yKGEpO31jYXRjaChiKXthbGVydChiLm1lc3NhZ2UpfX07ZC5KUz17fTtkLkpTLkFyZWFPZlBvbHlnb249ZnVuY3Rpb24oYSxiKXtifHwoYj0xKTtyZXR1cm4gZC5DbGlwcGVyLkFyZWEoYSkvKGIqYil9O2QuSlMuQXJlYU9mUG9seWdvbnM9ZnVuY3Rpb24oYSxcbmIpe2J8fChiPTEpO2Zvcih2YXIgYz0wLGU9MDtlPGEubGVuZ3RoO2UrKyljKz1kLkNsaXBwZXIuQXJlYShhW2VdKTtyZXR1cm4gYy8oYipiKX07ZC5KUy5Cb3VuZHNPZlBhdGg9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gZC5KUy5Cb3VuZHNPZlBhdGhzKFthXSxiKX07ZC5KUy5Cb3VuZHNPZlBhdGhzPWZ1bmN0aW9uKGEsYil7Ynx8KGI9MSk7dmFyIGM9ZC5DbGlwcGVyLkdldEJvdW5kcyhhKTtjLmxlZnQvPWI7Yy5ib3R0b20vPWI7Yy5yaWdodC89YjtjLnRvcC89YjtyZXR1cm4gY307ZC5KUy5DbGVhbj1mdW5jdGlvbihhLGIpe2lmKCEoYSBpbnN0YW5jZW9mIEFycmF5KSlyZXR1cm5bXTt2YXIgYz1hWzBdaW5zdGFuY2VvZiBBcnJheTthPWQuSlMuQ2xvbmUoYSk7aWYoXCJudW1iZXJcIiE9dHlwZW9mIGJ8fG51bGw9PT1iKXJldHVybiBkLkVycm9yKFwiRGVsdGEgaXMgbm90IGEgbnVtYmVyIGluIENsZWFuKCkuXCIpLGE7aWYoMD09PWEubGVuZ3RofHwxPT1hLmxlbmd0aCYmMD09PWFbMF0ubGVuZ3RofHxcbjA+YilyZXR1cm4gYTtjfHwoYT1bYV0pO2Zvcih2YXIgZT1hLmxlbmd0aCxmLGcsaCxsLGssbixtLHA9W10scT0wO3E8ZTtxKyspaWYoZz1hW3FdLGY9Zy5sZW5ndGgsMCE9PWYpaWYoMz5mKWg9ZyxwLnB1c2goaCk7ZWxzZXtoPWc7bD1iKmI7az1nWzBdO2ZvcihtPW49MTttPGY7bSsrKShnW21dLlgtay5YKSooZ1ttXS5YLWsuWCkrKGdbbV0uWS1rLlkpKihnW21dLlktay5ZKTw9bHx8KGhbbl09Z1ttXSxrPWdbbV0sbisrKTtrPWdbbi0xXTsoZ1swXS5YLWsuWCkqKGdbMF0uWC1rLlgpKyhnWzBdLlktay5ZKSooZ1swXS5ZLWsuWSk8PWwmJm4tLTtuPGYmJmguc3BsaWNlKG4sZi1uKTtoLmxlbmd0aCYmcC5wdXNoKGgpfSFjJiZwLmxlbmd0aD9wPXBbMF06Y3x8MCE9PXAubGVuZ3RoP2MmJjA9PT1wLmxlbmd0aCYmKHA9W1tdXSk6cD1bXTtyZXR1cm4gcH07ZC5KUy5DbG9uZT1mdW5jdGlvbihhKXtpZighKGEgaW5zdGFuY2VvZiBBcnJheSl8fDA9PT1hLmxlbmd0aClyZXR1cm5bXTtpZigxPT1cbmEubGVuZ3RoJiYwPT09YVswXS5sZW5ndGgpcmV0dXJuW1tdXTt2YXIgYj1hWzBdaW5zdGFuY2VvZiBBcnJheTtifHwoYT1bYV0pO3ZhciBjPWEubGVuZ3RoLGUsZCxnLGgsbD1BcnJheShjKTtmb3IoZD0wO2Q8YztkKyspe2U9YVtkXS5sZW5ndGg7aD1BcnJheShlKTtmb3IoZz0wO2c8ZTtnKyspaFtnXT17WDphW2RdW2ddLlgsWTphW2RdW2ddLll9O2xbZF09aH1ifHwobD1sWzBdKTtyZXR1cm4gbH07ZC5KUy5MaWdodGVuPWZ1bmN0aW9uKGEsYil7aWYoIShhIGluc3RhbmNlb2YgQXJyYXkpKXJldHVybltdO2lmKFwibnVtYmVyXCIhPXR5cGVvZiBifHxudWxsPT09YilyZXR1cm4gZC5FcnJvcihcIlRvbGVyYW5jZSBpcyBub3QgYSBudW1iZXIgaW4gTGlnaHRlbigpLlwiKSxkLkpTLkNsb25lKGEpO2lmKDA9PT1hLmxlbmd0aHx8MT09YS5sZW5ndGgmJjA9PT1hWzBdLmxlbmd0aHx8MD5iKXJldHVybiBkLkpTLkNsb25lKGEpO2FbMF1pbnN0YW5jZW9mIEFycmF5fHwoYT1bYV0pO3ZhciBjLGUsXG5mLGcsaCxsLGssbSxwLHEscixzLHQsdSx2LHg9YS5sZW5ndGgseT1iKmIsdz1bXTtmb3IoYz0wO2M8eDtjKyspaWYoZj1hW2NdLGw9Zi5sZW5ndGgsMCE9bCl7Zm9yKGc9MDsxRTY+ZztnKyspe2g9W107bD1mLmxlbmd0aDtmW2wtMV0uWCE9ZlswXS5YfHxmW2wtMV0uWSE9ZlswXS5ZPyhyPTEsZi5wdXNoKHtYOmZbMF0uWCxZOmZbMF0uWX0pLGw9Zi5sZW5ndGgpOnI9MDtxPVtdO2ZvcihlPTA7ZTxsLTI7ZSsrKXtrPWZbZV07cD1mW2UrMV07bT1mW2UrMl07dT1rLlg7dj1rLlk7az1tLlgtdTtzPW0uWS12O2lmKDAhPT1rfHwwIT09cyl0PSgocC5YLXUpKmsrKHAuWS12KSpzKS8oayprK3MqcyksMTx0Pyh1PW0uWCx2PW0uWSk6MDx0JiYodSs9ayp0LHYrPXMqdCk7az1wLlgtdTtzPXAuWS12O209ayprK3MqczttPD15JiYocVtlKzFdPTEsZSsrKX1oLnB1c2goe1g6ZlswXS5YLFk6ZlswXS5ZfSk7Zm9yKGU9MTtlPGwtMTtlKyspcVtlXXx8aC5wdXNoKHtYOmZbZV0uWCxZOmZbZV0uWX0pO1xuaC5wdXNoKHtYOmZbbC0xXS5YLFk6ZltsLTFdLll9KTtyJiZmLnBvcCgpO2lmKHEubGVuZ3RoKWY9aDtlbHNlIGJyZWFrfWw9aC5sZW5ndGg7aFtsLTFdLlg9PWhbMF0uWCYmaFtsLTFdLlk9PWhbMF0uWSYmaC5wb3AoKTsyPGgubGVuZ3RoJiZ3LnB1c2goaCl9IWFbMF1pbnN0YW5jZW9mIEFycmF5JiYodz13WzBdKTtcInVuZGVmaW5lZFwiPT10eXBlb2YgdyYmKHc9W1tdXSk7cmV0dXJuIHd9O2QuSlMuUGVyaW1ldGVyT2ZQYXRoPWZ1bmN0aW9uKGEsYixjKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgYSlyZXR1cm4gMDt2YXIgZT1NYXRoLnNxcnQsZD0wLGcsaCxrPTAsbT1nPTA7aD0wO3ZhciBuPWEubGVuZ3RoO2lmKDI+bilyZXR1cm4gMDtiJiYoYVtuXT1hWzBdLG4rKyk7Zm9yKDstLW47KWc9YVtuXSxrPWcuWCxnPWcuWSxoPWFbbi0xXSxtPWguWCxoPWguWSxkKz1lKChrLW0pKihrLW0pKyhnLWgpKihnLWgpKTtiJiZhLnBvcCgpO3JldHVybiBkL2N9O2QuSlMuUGVyaW1ldGVyT2ZQYXRocz1cbmZ1bmN0aW9uKGEsYixjKXtjfHwoYz0xKTtmb3IodmFyIGU9MCxmPTA7ZjxhLmxlbmd0aDtmKyspZSs9ZC5KUy5QZXJpbWV0ZXJPZlBhdGgoYVtmXSxiLGMpO3JldHVybiBlfTtkLkpTLlNjYWxlRG93blBhdGg9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkO2J8fChiPTEpO2ZvcihjPWEubGVuZ3RoO2MtLTspZD1hW2NdLGQuWC89YixkLlkvPWJ9O2QuSlMuU2NhbGVEb3duUGF0aHM9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGY7Ynx8KGI9MSk7Zm9yKGM9YS5sZW5ndGg7Yy0tOylmb3IoZD1hW2NdLmxlbmd0aDtkLS07KWY9YVtjXVtkXSxmLlgvPWIsZi5ZLz1ifTtkLkpTLlNjYWxlVXBQYXRoPWZ1bmN0aW9uKGEsYil7dmFyIGMsZCxmPU1hdGgucm91bmQ7Ynx8KGI9MSk7Zm9yKGM9YS5sZW5ndGg7Yy0tOylkPWFbY10sZC5YPWYoZC5YKmIpLGQuWT1mKGQuWSpiKX07ZC5KUy5TY2FsZVVwUGF0aHM9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGYsZz1NYXRoLnJvdW5kO2J8fChiPTEpO2ZvcihjPWEubGVuZ3RoO2MtLTspZm9yKGQ9XG5hW2NdLmxlbmd0aDtkLS07KWY9YVtjXVtkXSxmLlg9ZyhmLlgqYiksZi5ZPWcoZi5ZKmIpfTtkLkV4UG9seWdvbnM9ZnVuY3Rpb24oKXtyZXR1cm5bXX07ZC5FeFBvbHlnb249ZnVuY3Rpb24oKXt0aGlzLmhvbGVzPXRoaXMub3V0ZXI9bnVsbH07ZC5KUy5BZGRPdXRlclBvbHlOb2RlVG9FeFBvbHlnb25zPWZ1bmN0aW9uKGEsYil7dmFyIGM9bmV3IGQuRXhQb2x5Z29uO2Mub3V0ZXI9YS5Db250b3VyKCk7dmFyIGU9YS5DaGlsZHMoKSxmPWUubGVuZ3RoO2MuaG9sZXM9QXJyYXkoZik7dmFyIGcsaCxrLG0sbjtmb3IoaD0wO2g8ZjtoKyspZm9yKGc9ZVtoXSxjLmhvbGVzW2hdPWcuQ29udG91cigpLGs9MCxtPWcuQ2hpbGRzKCksbj1tLmxlbmd0aDtrPG47aysrKWc9bVtrXSxkLkpTLkFkZE91dGVyUG9seU5vZGVUb0V4UG9seWdvbnMoZyxiKTtiLnB1c2goYyl9O2QuSlMuRXhQb2x5Z29uc1RvUGF0aHM9ZnVuY3Rpb24oYSl7dmFyIGIsYyxlLGYsZz1uZXcgZC5QYXRocztiPTA7Zm9yKGU9XG5hLmxlbmd0aDtiPGU7YisrKWZvcihnLnB1c2goYVtiXS5vdXRlciksYz0wLGY9YVtiXS5ob2xlcy5sZW5ndGg7YzxmO2MrKylnLnB1c2goYVtiXS5ob2xlc1tjXSk7cmV0dXJuIGd9O2QuSlMuUG9seVRyZWVUb0V4UG9seWdvbnM9ZnVuY3Rpb24oYSl7dmFyIGI9bmV3IGQuRXhQb2x5Z29ucyxjLGUsZjtjPTA7ZT1hLkNoaWxkcygpO2ZvcihmPWUubGVuZ3RoO2M8ZjtjKyspYT1lW2NdLGQuSlMuQWRkT3V0ZXJQb2x5Tm9kZVRvRXhQb2x5Z29ucyhhLGIpO3JldHVybiBifX0pKCk7XG5cbjsgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18odHlwZW9mIENsaXBwZXJMaWIgIT0gXCJ1bmRlZmluZWRcIiA/IENsaXBwZXJMaWIgOiB3aW5kb3cuQ2xpcHBlckxpYik7XG5cbn0pLmNhbGwoZ2xvYmFsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZ1bmN0aW9uIGRlZmluZUV4cG9ydChleCkgeyBtb2R1bGUuZXhwb3J0cyA9IGV4OyB9KTtcbiIsIi8vIEZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWF0aC9yb3VuZFxyXG47KGZ1bmN0aW9uKCkge1xyXG4gIC8qKlxyXG4gICAqIERlY2ltYWwgYWRqdXN0bWVudCBvZiBhIG51bWJlci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgdHlwZSAgVGhlIHR5cGUgb2YgYWRqdXN0bWVudC5cclxuICAgKiBAcGFyYW0ge051bWJlcn0gIHZhbHVlIFRoZSBudW1iZXIuXHJcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSBleHAgICBUaGUgZXhwb25lbnQgKHRoZSAxMCBsb2dhcml0aG0gb2YgdGhlIGFkanVzdG1lbnQgYmFzZSkuXHJcbiAgICogQHJldHVybnMge051bWJlcn0gVGhlIGFkanVzdGVkIHZhbHVlLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGRlY2ltYWxBZGp1c3QodHlwZSwgdmFsdWUsIGV4cCkge1xyXG4gICAgLy8gSWYgdGhlIGV4cCBpcyB1bmRlZmluZWQgb3IgemVyby4uLlxyXG4gICAgaWYgKHR5cGVvZiBleHAgPT09ICd1bmRlZmluZWQnIHx8ICtleHAgPT09IDApIHtcclxuICAgICAgcmV0dXJuIE1hdGhbdHlwZV0odmFsdWUpO1xyXG4gICAgfVxyXG4gICAgdmFsdWUgPSArdmFsdWU7XHJcbiAgICBleHAgPSArZXhwO1xyXG4gICAgLy8gSWYgdGhlIHZhbHVlIGlzIG5vdCBhIG51bWJlciBvciB0aGUgZXhwIGlzIG5vdCBhbiBpbnRlZ2VyLi4uXHJcbiAgICBpZiAoaXNOYU4odmFsdWUpIHx8ICEodHlwZW9mIGV4cCA9PT0gJ251bWJlcicgJiYgZXhwICUgMSA9PT0gMCkpIHtcclxuICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH1cclxuICAgIC8vIFNoaWZ0XHJcbiAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJ2UnKTtcclxuICAgIHZhbHVlID0gTWF0aFt0eXBlXSgrKHZhbHVlWzBdICsgJ2UnICsgKHZhbHVlWzFdID8gKCt2YWx1ZVsxXSAtIGV4cCkgOiAtZXhwKSkpO1xyXG4gICAgLy8gU2hpZnQgYmFja1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCdlJyk7XHJcbiAgICByZXR1cm4gKyh2YWx1ZVswXSArICdlJyArICh2YWx1ZVsxXSA/ICgrdmFsdWVbMV0gKyBleHApIDogZXhwKSk7XHJcbiAgfVxyXG5cclxuICAvLyBEZWNpbWFsIHJvdW5kXHJcbiAgaWYgKCFNYXRoLnJvdW5kMTApIHtcclxuICAgIE1hdGgucm91bmQxMCA9IGZ1bmN0aW9uKHZhbHVlLCBleHApIHtcclxuICAgICAgcmV0dXJuIGRlY2ltYWxBZGp1c3QoJ3JvdW5kJywgdmFsdWUsIGV4cCk7XHJcbiAgICB9O1xyXG4gIH1cclxuICAvLyBEZWNpbWFsIGZsb29yXHJcbiAgaWYgKCFNYXRoLmZsb29yMTApIHtcclxuICAgIE1hdGguZmxvb3IxMCA9IGZ1bmN0aW9uKHZhbHVlLCBleHApIHtcclxuICAgICAgcmV0dXJuIGRlY2ltYWxBZGp1c3QoJ2Zsb29yJywgdmFsdWUsIGV4cCk7XHJcbiAgICB9O1xyXG4gIH1cclxuICAvLyBEZWNpbWFsIGNlaWxcclxuICBpZiAoIU1hdGguY2VpbDEwKSB7XHJcbiAgICBNYXRoLmNlaWwxMCA9IGZ1bmN0aW9uKHZhbHVlLCBleHApIHtcclxuICAgICAgcmV0dXJuIGRlY2ltYWxBZGp1c3QoJ2NlaWwnLCB2YWx1ZSwgZXhwKTtcclxuICAgIH07XHJcbiAgfVxyXG59KSgpO1xyXG4iLCIvKiEgcG9seTJ0cmkgdjEuMy41IHwgKGMpIDIwMDktMjAxNCBQb2x5MlRyaSBDb250cmlidXRvcnMgKi9cclxuIWZ1bmN0aW9uKHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzKW1vZHVsZS5leHBvcnRzPXQoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUodCk7ZWxzZXt2YXIgbjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P249d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/bj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihuPXNlbGYpLG4ucG9seTJ0cmk9dCgpfX0oZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24gdChuLGUsaSl7ZnVuY3Rpb24gbyhzLHApe2lmKCFlW3NdKXtpZighbltzXSl7dmFyIGE9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighcCYmYSlyZXR1cm4gYShzLCEwKTtpZihyKXJldHVybiByKHMsITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrcytcIidcIil9dmFyIGg9ZVtzXT17ZXhwb3J0czp7fX07bltzXVswXS5jYWxsKGguZXhwb3J0cyxmdW5jdGlvbih0KXt2YXIgZT1uW3NdWzFdW3RdO3JldHVybiBvKGU/ZTp0KX0saCxoLmV4cG9ydHMsdCxuLGUsaSl9cmV0dXJuIGVbc10uZXhwb3J0c31mb3IodmFyIHI9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxzPTA7czxpLmxlbmd0aDtzKyspbyhpW3NdKTtyZXR1cm4gb30oezE6W2Z1bmN0aW9uKHQsbil7bi5leHBvcnRzPXt2ZXJzaW9uOlwiMS4zLjVcIn19LHt9XSwyOltmdW5jdGlvbih0LG4pe1widXNlIHN0cmljdFwiO3ZhciBlPWZ1bmN0aW9uKHQsbil7dGhpcy5wb2ludD10LHRoaXMudHJpYW5nbGU9bnx8bnVsbCx0aGlzLm5leHQ9bnVsbCx0aGlzLnByZXY9bnVsbCx0aGlzLnZhbHVlPXQueH0saT1mdW5jdGlvbih0LG4pe3RoaXMuaGVhZF89dCx0aGlzLnRhaWxfPW4sdGhpcy5zZWFyY2hfbm9kZV89dH07aS5wcm90b3R5cGUuaGVhZD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmhlYWRffSxpLnByb3RvdHlwZS5zZXRIZWFkPWZ1bmN0aW9uKHQpe3RoaXMuaGVhZF89dH0saS5wcm90b3R5cGUudGFpbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRhaWxffSxpLnByb3RvdHlwZS5zZXRUYWlsPWZ1bmN0aW9uKHQpe3RoaXMudGFpbF89dH0saS5wcm90b3R5cGUuc2VhcmNoPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2VhcmNoX25vZGVffSxpLnByb3RvdHlwZS5zZXRTZWFyY2g9ZnVuY3Rpb24odCl7dGhpcy5zZWFyY2hfbm9kZV89dH0saS5wcm90b3R5cGUuZmluZFNlYXJjaE5vZGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zZWFyY2hfbm9kZV99LGkucHJvdG90eXBlLmxvY2F0ZU5vZGU9ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5zZWFyY2hfbm9kZV87aWYodDxuLnZhbHVlKXtmb3IoO249bi5wcmV2OylpZih0Pj1uLnZhbHVlKXJldHVybiB0aGlzLnNlYXJjaF9ub2RlXz1uLG59ZWxzZSBmb3IoO249bi5uZXh0OylpZih0PG4udmFsdWUpcmV0dXJuIHRoaXMuc2VhcmNoX25vZGVfPW4ucHJldixuLnByZXY7cmV0dXJuIG51bGx9LGkucHJvdG90eXBlLmxvY2F0ZVBvaW50PWZ1bmN0aW9uKHQpe3ZhciBuPXQueCxlPXRoaXMuZmluZFNlYXJjaE5vZGUobiksaT1lLnBvaW50Lng7aWYobj09PWkpe2lmKHQhPT1lLnBvaW50KWlmKHQ9PT1lLnByZXYucG9pbnQpZT1lLnByZXY7ZWxzZXtpZih0IT09ZS5uZXh0LnBvaW50KXRocm93IG5ldyBFcnJvcihcInBvbHkydHJpIEludmFsaWQgQWR2YW5jaW5nRnJvbnQubG9jYXRlUG9pbnQoKSBjYWxsXCIpO2U9ZS5uZXh0fX1lbHNlIGlmKGk+bilmb3IoOyhlPWUucHJldikmJnQhPT1lLnBvaW50Oyk7ZWxzZSBmb3IoOyhlPWUubmV4dCkmJnQhPT1lLnBvaW50Oyk7cmV0dXJuIGUmJih0aGlzLnNlYXJjaF9ub2RlXz1lKSxlfSxuLmV4cG9ydHM9aSxuLmV4cG9ydHMuTm9kZT1lfSx7fV0sMzpbZnVuY3Rpb24odCxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBlKHQsbil7aWYoIXQpdGhyb3cgbmV3IEVycm9yKG58fFwiQXNzZXJ0IEZhaWxlZFwiKX1uLmV4cG9ydHM9ZX0se31dLDQ6W2Z1bmN0aW9uKHQsbil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9dChcIi4veHlcIiksaT1mdW5jdGlvbih0LG4pe3RoaXMueD0rdHx8MCx0aGlzLnk9K258fDAsdGhpcy5fcDJ0X2VkZ2VfbGlzdD1udWxsfTtpLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBlLnRvU3RyaW5nQmFzZSh0aGlzKX0saS5wcm90b3R5cGUudG9KU09OPWZ1bmN0aW9uKCl7cmV0dXJue3g6dGhpcy54LHk6dGhpcy55fX0saS5wcm90b3R5cGUuY2xvbmU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IGkodGhpcy54LHRoaXMueSl9LGkucHJvdG90eXBlLnNldF96ZXJvPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueD0wLHRoaXMueT0wLHRoaXN9LGkucHJvdG90eXBlLnNldD1mdW5jdGlvbih0LG4pe3JldHVybiB0aGlzLng9K3R8fDAsdGhpcy55PStufHwwLHRoaXN9LGkucHJvdG90eXBlLm5lZ2F0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLng9LXRoaXMueCx0aGlzLnk9LXRoaXMueSx0aGlzfSxpLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMueCs9dC54LHRoaXMueSs9dC55LHRoaXN9LGkucHJvdG90eXBlLnN1Yj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy54LT10LngsdGhpcy55LT10LnksdGhpc30saS5wcm90b3R5cGUubXVsPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLngqPXQsdGhpcy55Kj10LHRoaXN9LGkucHJvdG90eXBlLmxlbmd0aD1mdW5jdGlvbigpe3JldHVybiBNYXRoLnNxcnQodGhpcy54KnRoaXMueCt0aGlzLnkqdGhpcy55KX0saS5wcm90b3R5cGUubm9ybWFsaXplPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5sZW5ndGgoKTtyZXR1cm4gdGhpcy54Lz10LHRoaXMueS89dCx0fSxpLnByb3RvdHlwZS5lcXVhbHM9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMueD09PXQueCYmdGhpcy55PT09dC55fSxpLm5lZ2F0ZT1mdW5jdGlvbih0KXtyZXR1cm4gbmV3IGkoLXQueCwtdC55KX0saS5hZGQ9ZnVuY3Rpb24odCxuKXtyZXR1cm4gbmV3IGkodC54K24ueCx0Lnkrbi55KX0saS5zdWI9ZnVuY3Rpb24odCxuKXtyZXR1cm4gbmV3IGkodC54LW4ueCx0Lnktbi55KX0saS5tdWw9ZnVuY3Rpb24odCxuKXtyZXR1cm4gbmV3IGkodCpuLngsdCpuLnkpfSxpLmNyb3NzPWZ1bmN0aW9uKHQsbil7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIHQ/XCJudW1iZXJcIj09dHlwZW9mIG4/dCpuOm5ldyBpKC10Km4ueSx0Km4ueCk6XCJudW1iZXJcIj09dHlwZW9mIG4/bmV3IGkobip0LnksLW4qdC54KTp0Lngqbi55LXQueSpuLnh9LGkudG9TdHJpbmc9ZS50b1N0cmluZyxpLmNvbXBhcmU9ZS5jb21wYXJlLGkuY21wPWUuY29tcGFyZSxpLmVxdWFscz1lLmVxdWFscyxpLmRvdD1mdW5jdGlvbih0LG4pe3JldHVybiB0Lngqbi54K3QueSpuLnl9LG4uZXhwb3J0cz1pfSx7XCIuL3h5XCI6MTF9XSw1OltmdW5jdGlvbih0LG4pe1widXNlIHN0cmljdFwiO3ZhciBlPXQoXCIuL3h5XCIpLGk9ZnVuY3Rpb24odCxuKXt0aGlzLm5hbWU9XCJQb2ludEVycm9yXCIsdGhpcy5wb2ludHM9bj1ufHxbXSx0aGlzLm1lc3NhZ2U9dHx8XCJJbnZhbGlkIFBvaW50cyFcIjtmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl0aGlzLm1lc3NhZ2UrPVwiIFwiK2UudG9TdHJpbmcobltpXSl9O2kucHJvdG90eXBlPW5ldyBFcnJvcixpLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1pLG4uZXhwb3J0cz1pfSx7XCIuL3h5XCI6MTF9XSw2OltmdW5jdGlvbih0LG4sZSl7KGZ1bmN0aW9uKG4pe1widXNlIHN0cmljdFwiO3ZhciBpPW4ucG9seTJ0cmk7ZS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIG4ucG9seTJ0cmk9aSxlfSxlLlZFUlNJT049dChcIi4uL2Rpc3QvdmVyc2lvbi5qc29uXCIpLnZlcnNpb24sZS5Qb2ludEVycm9yPXQoXCIuL3BvaW50ZXJyb3JcIiksZS5Qb2ludD10KFwiLi9wb2ludFwiKSxlLlRyaWFuZ2xlPXQoXCIuL3RyaWFuZ2xlXCIpLGUuU3dlZXBDb250ZXh0PXQoXCIuL3N3ZWVwY29udGV4dFwiKTt2YXIgbz10KFwiLi9zd2VlcFwiKTtlLnRyaWFuZ3VsYXRlPW8udHJpYW5ndWxhdGUsZS5zd2VlcD17VHJpYW5ndWxhdGU6by50cmlhbmd1bGF0ZX19KS5jYWxsKHRoaXMsXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjpcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzp7fSl9LHtcIi4uL2Rpc3QvdmVyc2lvbi5qc29uXCI6MSxcIi4vcG9pbnRcIjo0LFwiLi9wb2ludGVycm9yXCI6NSxcIi4vc3dlZXBcIjo3LFwiLi9zd2VlcGNvbnRleHRcIjo4LFwiLi90cmlhbmdsZVwiOjl9XSw3OltmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXt0LmluaXRUcmlhbmd1bGF0aW9uKCksdC5jcmVhdGVBZHZhbmNpbmdGcm9udCgpLG8odCkscih0KX1mdW5jdGlvbiBvKHQpe3ZhciBuLGU9dC5wb2ludENvdW50KCk7Zm9yKG49MTtlPm47KytuKWZvcih2YXIgaT10LmdldFBvaW50KG4pLG89cyh0LGkpLHI9aS5fcDJ0X2VkZ2VfbGlzdCxhPTA7ciYmYTxyLmxlbmd0aDsrK2EpcCh0LHJbYV0sbyl9ZnVuY3Rpb24gcih0KXtmb3IodmFyIG49dC5mcm9udCgpLmhlYWQoKS5uZXh0LnRyaWFuZ2xlLGU9dC5mcm9udCgpLmhlYWQoKS5uZXh0LnBvaW50OyFuLmdldENvbnN0cmFpbmVkRWRnZUNXKGUpOyluPW4ubmVpZ2hib3JDQ1coZSk7dC5tZXNoQ2xlYW4obil9ZnVuY3Rpb24gcyh0LG4pe3ZhciBlPXQubG9jYXRlTm9kZShuKSxpPXUodCxuLGUpO3JldHVybiBuLng8PWUucG9pbnQueCtGJiZkKHQsZSksZyh0LGkpLGl9ZnVuY3Rpb24gcCh0LG4sZSl7dC5lZGdlX2V2ZW50LmNvbnN0cmFpbmVkX2VkZ2U9bix0LmVkZ2VfZXZlbnQucmlnaHQ9bi5wLng+bi5xLngsaChlLnRyaWFuZ2xlLG4ucCxuLnEpfHwoQyh0LG4sZSksYSh0LG4ucCxuLnEsZS50cmlhbmdsZSxuLnEpKX1mdW5jdGlvbiBhKHQsbixlLGksbyl7aWYoIWgoaSxuLGUpKXt2YXIgcj1pLnBvaW50Q0NXKG8pLHM9eihlLHIsbik7aWYocz09PU0uQ09MTElORUFSKXRocm93IG5ldyBEKFwicG9seTJ0cmkgRWRnZUV2ZW50OiBDb2xsaW5lYXIgbm90IHN1cHBvcnRlZCFcIixbZSxyLG5dKTt2YXIgcD1pLnBvaW50Q1cobyksdT16KGUscCxuKTtpZih1PT09TS5DT0xMSU5FQVIpdGhyb3cgbmV3IEQoXCJwb2x5MnRyaSBFZGdlRXZlbnQ6IENvbGxpbmVhciBub3Qgc3VwcG9ydGVkIVwiLFtlLHAsbl0pO3M9PT11PyhpPXM9PT1NLkNXP2kubmVpZ2hib3JDQ1cobyk6aS5uZWlnaGJvckNXKG8pLGEodCxuLGUsaSxvKSk6cSh0LG4sZSxpLG8pfX1mdW5jdGlvbiBoKHQsbixlKXt2YXIgaT10LmVkZ2VJbmRleChuLGUpO2lmKC0xIT09aSl7dC5tYXJrQ29uc3RyYWluZWRFZGdlQnlJbmRleChpKTt2YXIgbz10LmdldE5laWdoYm9yKGkpO3JldHVybiBvJiZvLm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyhuLGUpLCEwfXJldHVybiExfWZ1bmN0aW9uIHUodCxuLGUpe3ZhciBpPW5ldyBPKG4sZS5wb2ludCxlLm5leHQucG9pbnQpO2kubWFya05laWdoYm9yKGUudHJpYW5nbGUpLHQuYWRkVG9NYXAoaSk7dmFyIG89bmV3IEIobik7cmV0dXJuIG8ubmV4dD1lLm5leHQsby5wcmV2PWUsZS5uZXh0LnByZXY9byxlLm5leHQ9byxsKHQsaSl8fHQubWFwVHJpYW5nbGVUb05vZGVzKGkpLG99ZnVuY3Rpb24gZCh0LG4pe3ZhciBlPW5ldyBPKG4ucHJldi5wb2ludCxuLnBvaW50LG4ubmV4dC5wb2ludCk7ZS5tYXJrTmVpZ2hib3Iobi5wcmV2LnRyaWFuZ2xlKSxlLm1hcmtOZWlnaGJvcihuLnRyaWFuZ2xlKSx0LmFkZFRvTWFwKGUpLG4ucHJldi5uZXh0PW4ubmV4dCxuLm5leHQucHJldj1uLnByZXYsbCh0LGUpfHx0Lm1hcFRyaWFuZ2xlVG9Ob2RlcyhlKX1mdW5jdGlvbiBnKHQsbil7Zm9yKHZhciBlPW4ubmV4dDtlLm5leHQmJiFqKGUucG9pbnQsZS5uZXh0LnBvaW50LGUucHJldi5wb2ludCk7KWQodCxlKSxlPWUubmV4dDtmb3IoZT1uLnByZXY7ZS5wcmV2JiYhaihlLnBvaW50LGUubmV4dC5wb2ludCxlLnByZXYucG9pbnQpOylkKHQsZSksZT1lLnByZXY7bi5uZXh0JiZuLm5leHQubmV4dCYmZihuKSYmeSh0LG4pfWZ1bmN0aW9uIGYodCl7dmFyIG49dC5wb2ludC54LXQubmV4dC5uZXh0LnBvaW50LngsZT10LnBvaW50LnktdC5uZXh0Lm5leHQucG9pbnQueTtyZXR1cm4gUyhlPj0wLFwidW5vcmRlcmVkIHlcIiksbj49MHx8TWF0aC5hYnMobik8ZX1mdW5jdGlvbiBsKHQsbil7Zm9yKHZhciBlPTA7Mz5lOysrZSlpZighbi5kZWxhdW5heV9lZGdlW2VdKXt2YXIgaT1uLmdldE5laWdoYm9yKGUpO2lmKGkpe3ZhciBvPW4uZ2V0UG9pbnQoZSkscj1pLm9wcG9zaXRlUG9pbnQobixvKSxzPWkuaW5kZXgocik7aWYoaS5jb25zdHJhaW5lZF9lZGdlW3NdfHxpLmRlbGF1bmF5X2VkZ2Vbc10pe24uY29uc3RyYWluZWRfZWRnZVtlXT1pLmNvbnN0cmFpbmVkX2VkZ2Vbc107Y29udGludWV9dmFyIHA9YyhvLG4ucG9pbnRDQ1cobyksbi5wb2ludENXKG8pLHIpO2lmKHApe24uZGVsYXVuYXlfZWRnZVtlXT0hMCxpLmRlbGF1bmF5X2VkZ2Vbc109ITAsXyhuLG8saSxyKTt2YXIgYT0hbCh0LG4pO3JldHVybiBhJiZ0Lm1hcFRyaWFuZ2xlVG9Ob2RlcyhuKSxhPSFsKHQsaSksYSYmdC5tYXBUcmlhbmdsZVRvTm9kZXMoaSksbi5kZWxhdW5heV9lZGdlW2VdPSExLGkuZGVsYXVuYXlfZWRnZVtzXT0hMSwhMH19fXJldHVybiExfWZ1bmN0aW9uIGModCxuLGUsaSl7dmFyIG89dC54LWkueCxyPXQueS1pLnkscz1uLngtaS54LHA9bi55LWkueSxhPW8qcCxoPXMqcix1PWEtaDtpZigwPj11KXJldHVybiExO3ZhciBkPWUueC1pLngsZz1lLnktaS55LGY9ZCpyLGw9bypnLGM9Zi1sO2lmKDA+PWMpcmV0dXJuITE7dmFyIF89cypnLHk9ZCpwLHg9bypvK3Iqcix2PXMqcytwKnAsQz1kKmQrZypnLGI9eCooXy15KSt2KmMrQyp1O3JldHVybiBiPjB9ZnVuY3Rpb24gXyh0LG4sZSxpKXt2YXIgbyxyLHMscDtvPXQubmVpZ2hib3JDQ1cobikscj10Lm5laWdoYm9yQ1cobikscz1lLm5laWdoYm9yQ0NXKGkpLHA9ZS5uZWlnaGJvckNXKGkpO3ZhciBhLGgsdSxkO2E9dC5nZXRDb25zdHJhaW5lZEVkZ2VDQ1cobiksaD10LmdldENvbnN0cmFpbmVkRWRnZUNXKG4pLHU9ZS5nZXRDb25zdHJhaW5lZEVkZ2VDQ1coaSksZD1lLmdldENvbnN0cmFpbmVkRWRnZUNXKGkpO3ZhciBnLGYsbCxjO2c9dC5nZXREZWxhdW5heUVkZ2VDQ1cobiksZj10LmdldERlbGF1bmF5RWRnZUNXKG4pLGw9ZS5nZXREZWxhdW5heUVkZ2VDQ1coaSksYz1lLmdldERlbGF1bmF5RWRnZUNXKGkpLHQubGVnYWxpemUobixpKSxlLmxlZ2FsaXplKGksbiksZS5zZXREZWxhdW5heUVkZ2VDQ1cobixnKSx0LnNldERlbGF1bmF5RWRnZUNXKG4sZiksdC5zZXREZWxhdW5heUVkZ2VDQ1coaSxsKSxlLnNldERlbGF1bmF5RWRnZUNXKGksYyksZS5zZXRDb25zdHJhaW5lZEVkZ2VDQ1cobixhKSx0LnNldENvbnN0cmFpbmVkRWRnZUNXKG4saCksdC5zZXRDb25zdHJhaW5lZEVkZ2VDQ1coaSx1KSxlLnNldENvbnN0cmFpbmVkRWRnZUNXKGksZCksdC5jbGVhck5laWdoYm9ycygpLGUuY2xlYXJOZWlnaGJvcnMoKSxvJiZlLm1hcmtOZWlnaGJvcihvKSxyJiZ0Lm1hcmtOZWlnaGJvcihyKSxzJiZ0Lm1hcmtOZWlnaGJvcihzKSxwJiZlLm1hcmtOZWlnaGJvcihwKSx0Lm1hcmtOZWlnaGJvcihlKX1mdW5jdGlvbiB5KHQsbil7Zm9yKHQuYmFzaW4ubGVmdF9ub2RlPXoobi5wb2ludCxuLm5leHQucG9pbnQsbi5uZXh0Lm5leHQucG9pbnQpPT09TS5DQ1c/bi5uZXh0Lm5leHQ6bi5uZXh0LHQuYmFzaW4uYm90dG9tX25vZGU9dC5iYXNpbi5sZWZ0X25vZGU7dC5iYXNpbi5ib3R0b21fbm9kZS5uZXh0JiZ0LmJhc2luLmJvdHRvbV9ub2RlLnBvaW50Lnk+PXQuYmFzaW4uYm90dG9tX25vZGUubmV4dC5wb2ludC55Oyl0LmJhc2luLmJvdHRvbV9ub2RlPXQuYmFzaW4uYm90dG9tX25vZGUubmV4dDtpZih0LmJhc2luLmJvdHRvbV9ub2RlIT09dC5iYXNpbi5sZWZ0X25vZGUpe2Zvcih0LmJhc2luLnJpZ2h0X25vZGU9dC5iYXNpbi5ib3R0b21fbm9kZTt0LmJhc2luLnJpZ2h0X25vZGUubmV4dCYmdC5iYXNpbi5yaWdodF9ub2RlLnBvaW50Lnk8dC5iYXNpbi5yaWdodF9ub2RlLm5leHQucG9pbnQueTspdC5iYXNpbi5yaWdodF9ub2RlPXQuYmFzaW4ucmlnaHRfbm9kZS5uZXh0O3QuYmFzaW4ucmlnaHRfbm9kZSE9PXQuYmFzaW4uYm90dG9tX25vZGUmJih0LmJhc2luLndpZHRoPXQuYmFzaW4ucmlnaHRfbm9kZS5wb2ludC54LXQuYmFzaW4ubGVmdF9ub2RlLnBvaW50LngsdC5iYXNpbi5sZWZ0X2hpZ2hlc3Q9dC5iYXNpbi5sZWZ0X25vZGUucG9pbnQueT50LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueSx4KHQsdC5iYXNpbi5ib3R0b21fbm9kZSkpfX1mdW5jdGlvbiB4KHQsbil7aWYoIXYodCxuKSl7ZCh0LG4pO3ZhciBlO2lmKG4ucHJldiE9PXQuYmFzaW4ubGVmdF9ub2RlfHxuLm5leHQhPT10LmJhc2luLnJpZ2h0X25vZGUpe2lmKG4ucHJldj09PXQuYmFzaW4ubGVmdF9ub2RlKXtpZihlPXoobi5wb2ludCxuLm5leHQucG9pbnQsbi5uZXh0Lm5leHQucG9pbnQpLGU9PT1NLkNXKXJldHVybjtuPW4ubmV4dH1lbHNlIGlmKG4ubmV4dD09PXQuYmFzaW4ucmlnaHRfbm9kZSl7aWYoZT16KG4ucG9pbnQsbi5wcmV2LnBvaW50LG4ucHJldi5wcmV2LnBvaW50KSxlPT09TS5DQ1cpcmV0dXJuO249bi5wcmV2fWVsc2Ugbj1uLnByZXYucG9pbnQueTxuLm5leHQucG9pbnQueT9uLnByZXY6bi5uZXh0O3godCxuKX19fWZ1bmN0aW9uIHYodCxuKXt2YXIgZTtyZXR1cm4gZT10LmJhc2luLmxlZnRfaGlnaGVzdD90LmJhc2luLmxlZnRfbm9kZS5wb2ludC55LW4ucG9pbnQueTp0LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueS1uLnBvaW50LnksdC5iYXNpbi53aWR0aD5lPyEwOiExfWZ1bmN0aW9uIEModCxuLGUpe3QuZWRnZV9ldmVudC5yaWdodD9iKHQsbixlKTpFKHQsbixlKX1mdW5jdGlvbiBiKHQsbixlKXtmb3IoO2UubmV4dC5wb2ludC54PG4ucC54Oyl6KG4ucSxlLm5leHQucG9pbnQsbi5wKT09PU0uQ0NXP20odCxuLGUpOmU9ZS5uZXh0fWZ1bmN0aW9uIG0odCxuLGUpe2UucG9pbnQueDxuLnAueCYmKHooZS5wb2ludCxlLm5leHQucG9pbnQsZS5uZXh0Lm5leHQucG9pbnQpPT09TS5DQ1c/Vyh0LG4sZSk6KHcodCxuLGUpLG0odCxuLGUpKSl9ZnVuY3Rpb24gVyh0LG4sZSl7ZCh0LGUubmV4dCksZS5uZXh0LnBvaW50IT09bi5wJiZ6KG4ucSxlLm5leHQucG9pbnQsbi5wKT09PU0uQ0NXJiZ6KGUucG9pbnQsZS5uZXh0LnBvaW50LGUubmV4dC5uZXh0LnBvaW50KT09PU0uQ0NXJiZXKHQsbixlKX1mdW5jdGlvbiB3KHQsbixlKXt6KGUubmV4dC5wb2ludCxlLm5leHQubmV4dC5wb2ludCxlLm5leHQubmV4dC5uZXh0LnBvaW50KT09PU0uQ0NXP1codCxuLGUubmV4dCk6eihuLnEsZS5uZXh0Lm5leHQucG9pbnQsbi5wKT09PU0uQ0NXJiZ3KHQsbixlLm5leHQpfWZ1bmN0aW9uIEUodCxuLGUpe2Zvcig7ZS5wcmV2LnBvaW50Lng+bi5wLng7KXoobi5xLGUucHJldi5wb2ludCxuLnApPT09TS5DVz9QKHQsbixlKTplPWUucHJldn1mdW5jdGlvbiBQKHQsbixlKXtlLnBvaW50Lng+bi5wLngmJih6KGUucG9pbnQsZS5wcmV2LnBvaW50LGUucHJldi5wcmV2LnBvaW50KT09PU0uQ1c/VCh0LG4sZSk6KE4odCxuLGUpLFAodCxuLGUpKSl9ZnVuY3Rpb24gTih0LG4sZSl7eihlLnByZXYucG9pbnQsZS5wcmV2LnByZXYucG9pbnQsZS5wcmV2LnByZXYucHJldi5wb2ludCk9PT1NLkNXP1QodCxuLGUucHJldik6eihuLnEsZS5wcmV2LnByZXYucG9pbnQsbi5wKT09PU0uQ1cmJk4odCxuLGUucHJldil9ZnVuY3Rpb24gVCh0LG4sZSl7ZCh0LGUucHJldiksZS5wcmV2LnBvaW50IT09bi5wJiZ6KG4ucSxlLnByZXYucG9pbnQsbi5wKT09PU0uQ1cmJnooZS5wb2ludCxlLnByZXYucG9pbnQsZS5wcmV2LnByZXYucG9pbnQpPT09TS5DVyYmVCh0LG4sZSl9ZnVuY3Rpb24gcSh0LG4sZSxpLG8pe3ZhciByPWkubmVpZ2hib3JBY3Jvc3Mobyk7UyhyLFwiRkxJUCBmYWlsZWQgZHVlIHRvIG1pc3NpbmcgdHJpYW5nbGUhXCIpO3ZhciBzPXIub3Bwb3NpdGVQb2ludChpLG8pO2lmKGkuZ2V0Q29uc3RyYWluZWRFZGdlQWNyb3NzKG8pKXt2YXIgcD1pLmluZGV4KG8pO3Rocm93IG5ldyBEKFwicG9seTJ0cmkgSW50ZXJzZWN0aW5nIENvbnN0cmFpbnRzXCIsW28scyxpLmdldFBvaW50KChwKzEpJTMpLGkuZ2V0UG9pbnQoKHArMiklMyldKX1pZihIKG8saS5wb2ludENDVyhvKSxpLnBvaW50Q1cobykscykpaWYoXyhpLG8scixzKSx0Lm1hcFRyaWFuZ2xlVG9Ob2RlcyhpKSx0Lm1hcFRyaWFuZ2xlVG9Ob2RlcyhyKSxvPT09ZSYmcz09PW4pZT09PXQuZWRnZV9ldmVudC5jb25zdHJhaW5lZF9lZGdlLnEmJm49PT10LmVkZ2VfZXZlbnQuY29uc3RyYWluZWRfZWRnZS5wJiYoaS5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMobixlKSxyLm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyhuLGUpLGwodCxpKSxsKHQscikpO2Vsc2V7dmFyIGg9eihlLHMsbik7aT1JKHQsaCxpLHIsbyxzKSxxKHQsbixlLGksbyl9ZWxzZXt2YXIgdT1rKG4sZSxyLHMpO0EodCxuLGUsaSxyLHUpLGEodCxuLGUsaSxvKX19ZnVuY3Rpb24gSSh0LG4sZSxpLG8scil7dmFyIHM7cmV0dXJuIG49PT1NLkNDVz8ocz1pLmVkZ2VJbmRleChvLHIpLGkuZGVsYXVuYXlfZWRnZVtzXT0hMCxsKHQsaSksaS5jbGVhckRlbGF1bmF5RWRnZXMoKSxlKToocz1lLmVkZ2VJbmRleChvLHIpLGUuZGVsYXVuYXlfZWRnZVtzXT0hMCxsKHQsZSksZS5jbGVhckRlbGF1bmF5RWRnZXMoKSxpKX1mdW5jdGlvbiBrKHQsbixlLGkpe3ZhciBvPXoobixpLHQpO2lmKG89PT1NLkNXKXJldHVybiBlLnBvaW50Q0NXKGkpO2lmKG89PT1NLkNDVylyZXR1cm4gZS5wb2ludENXKGkpO3Rocm93IG5ldyBEKFwicG9seTJ0cmkgW1Vuc3VwcG9ydGVkXSBuZXh0RmxpcFBvaW50OiBvcHBvc2luZyBwb2ludCBvbiBjb25zdHJhaW5lZCBlZGdlIVwiLFtuLGksdF0pfWZ1bmN0aW9uIEEodCxuLGUsaSxvLHIpe3ZhciBzPW8ubmVpZ2hib3JBY3Jvc3Mocik7UyhzLFwiRkxJUCBmYWlsZWQgZHVlIHRvIG1pc3NpbmcgdHJpYW5nbGVcIik7dmFyIHA9cy5vcHBvc2l0ZVBvaW50KG8scik7aWYoSChlLGkucG9pbnRDQ1coZSksaS5wb2ludENXKGUpLHApKXEodCxlLHAscyxwKTtlbHNle3ZhciBhPWsobixlLHMscCk7QSh0LG4sZSxpLHMsYSl9fXZhciBTPXQoXCIuL2Fzc2VydFwiKSxEPXQoXCIuL3BvaW50ZXJyb3JcIiksTz10KFwiLi90cmlhbmdsZVwiKSxCPXQoXCIuL2FkdmFuY2luZ2Zyb250XCIpLk5vZGUsTD10KFwiLi91dGlsc1wiKSxGPUwuRVBTSUxPTixNPUwuT3JpZW50YXRpb24sej1MLm9yaWVudDJkLEg9TC5pblNjYW5BcmVhLGo9TC5pc0FuZ2xlT2J0dXNlO2UudHJpYW5ndWxhdGU9aX0se1wiLi9hZHZhbmNpbmdmcm9udFwiOjIsXCIuL2Fzc2VydFwiOjMsXCIuL3BvaW50ZXJyb3JcIjo1LFwiLi90cmlhbmdsZVwiOjksXCIuL3V0aWxzXCI6MTB9XSw4OltmdW5jdGlvbih0LG4pe1widXNlIHN0cmljdFwiO3ZhciBlPXQoXCIuL3BvaW50ZXJyb3JcIiksaT10KFwiLi9wb2ludFwiKSxvPXQoXCIuL3RyaWFuZ2xlXCIpLHI9dChcIi4vc3dlZXBcIikscz10KFwiLi9hZHZhbmNpbmdmcm9udFwiKSxwPXMuTm9kZSxhPS4zLGg9ZnVuY3Rpb24odCxuKXtpZih0aGlzLnA9dCx0aGlzLnE9bix0Lnk+bi55KXRoaXMucT10LHRoaXMucD1uO2Vsc2UgaWYodC55PT09bi55KWlmKHQueD5uLngpdGhpcy5xPXQsdGhpcy5wPW47ZWxzZSBpZih0Lng9PT1uLngpdGhyb3cgbmV3IGUoXCJwb2x5MnRyaSBJbnZhbGlkIEVkZ2UgY29uc3RydWN0b3I6IHJlcGVhdGVkIHBvaW50cyFcIixbdF0pO3RoaXMucS5fcDJ0X2VkZ2VfbGlzdHx8KHRoaXMucS5fcDJ0X2VkZ2VfbGlzdD1bXSksdGhpcy5xLl9wMnRfZWRnZV9saXN0LnB1c2godGhpcyl9LHU9ZnVuY3Rpb24oKXt0aGlzLmxlZnRfbm9kZT1udWxsLHRoaXMuYm90dG9tX25vZGU9bnVsbCx0aGlzLnJpZ2h0X25vZGU9bnVsbCx0aGlzLndpZHRoPTAsdGhpcy5sZWZ0X2hpZ2hlc3Q9ITF9O3UucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5sZWZ0X25vZGU9bnVsbCx0aGlzLmJvdHRvbV9ub2RlPW51bGwsdGhpcy5yaWdodF9ub2RlPW51bGwsdGhpcy53aWR0aD0wLHRoaXMubGVmdF9oaWdoZXN0PSExfTt2YXIgZD1mdW5jdGlvbigpe3RoaXMuY29uc3RyYWluZWRfZWRnZT1udWxsLHRoaXMucmlnaHQ9ITF9LGc9ZnVuY3Rpb24odCxuKXtuPW58fHt9LHRoaXMudHJpYW5nbGVzXz1bXSx0aGlzLm1hcF89W10sdGhpcy5wb2ludHNfPW4uY2xvbmVBcnJheXM/dC5zbGljZSgwKTp0LHRoaXMuZWRnZV9saXN0PVtdLHRoaXMucG1pbl89dGhpcy5wbWF4Xz1udWxsLHRoaXMuZnJvbnRfPW51bGwsdGhpcy5oZWFkXz1udWxsLHRoaXMudGFpbF89bnVsbCx0aGlzLmFmX2hlYWRfPW51bGwsdGhpcy5hZl9taWRkbGVfPW51bGwsdGhpcy5hZl90YWlsXz1udWxsLHRoaXMuYmFzaW49bmV3IHUsdGhpcy5lZGdlX2V2ZW50PW5ldyBkLHRoaXMuaW5pdEVkZ2VzKHRoaXMucG9pbnRzXyl9O2cucHJvdG90eXBlLmFkZEhvbGU9ZnVuY3Rpb24odCl7dGhpcy5pbml0RWRnZXModCk7dmFyIG4sZT10Lmxlbmd0aDtmb3Iobj0wO2U+bjtuKyspdGhpcy5wb2ludHNfLnB1c2godFtuXSk7cmV0dXJuIHRoaXN9LGcucHJvdG90eXBlLkFkZEhvbGU9Zy5wcm90b3R5cGUuYWRkSG9sZSxnLnByb3RvdHlwZS5hZGRIb2xlcz1mdW5jdGlvbih0KXt2YXIgbixlPXQubGVuZ3RoO2ZvcihuPTA7ZT5uO24rKyl0aGlzLmluaXRFZGdlcyh0W25dKTtyZXR1cm4gdGhpcy5wb2ludHNfPXRoaXMucG9pbnRzXy5jb25jYXQuYXBwbHkodGhpcy5wb2ludHNfLHQpLHRoaXN9LGcucHJvdG90eXBlLmFkZFBvaW50PWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLnBvaW50c18ucHVzaCh0KSx0aGlzfSxnLnByb3RvdHlwZS5BZGRQb2ludD1nLnByb3RvdHlwZS5hZGRQb2ludCxnLnByb3RvdHlwZS5hZGRQb2ludHM9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMucG9pbnRzXz10aGlzLnBvaW50c18uY29uY2F0KHQpLHRoaXN9LGcucHJvdG90eXBlLnRyaWFuZ3VsYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHIudHJpYW5ndWxhdGUodGhpcyksdGhpc30sZy5wcm90b3R5cGUuZ2V0Qm91bmRpbmdCb3g9ZnVuY3Rpb24oKXtyZXR1cm57bWluOnRoaXMucG1pbl8sbWF4OnRoaXMucG1heF99fSxnLnByb3RvdHlwZS5nZXRUcmlhbmdsZXM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50cmlhbmdsZXNffSxnLnByb3RvdHlwZS5HZXRUcmlhbmdsZXM9Zy5wcm90b3R5cGUuZ2V0VHJpYW5nbGVzLGcucHJvdG90eXBlLmZyb250PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZnJvbnRffSxnLnByb3RvdHlwZS5wb2ludENvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucG9pbnRzXy5sZW5ndGh9LGcucHJvdG90eXBlLmhlYWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oZWFkX30sZy5wcm90b3R5cGUuc2V0SGVhZD1mdW5jdGlvbih0KXt0aGlzLmhlYWRfPXR9LGcucHJvdG90eXBlLnRhaWw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50YWlsX30sZy5wcm90b3R5cGUuc2V0VGFpbD1mdW5jdGlvbih0KXt0aGlzLnRhaWxfPXR9LGcucHJvdG90eXBlLmdldE1hcD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1hcF99LGcucHJvdG90eXBlLmluaXRUcmlhbmd1bGF0aW9uPWZ1bmN0aW9uKCl7dmFyIHQsbj10aGlzLnBvaW50c19bMF0ueCxlPXRoaXMucG9pbnRzX1swXS54LG89dGhpcy5wb2ludHNfWzBdLnkscj10aGlzLnBvaW50c19bMF0ueSxzPXRoaXMucG9pbnRzXy5sZW5ndGg7Zm9yKHQ9MTtzPnQ7dCsrKXt2YXIgcD10aGlzLnBvaW50c19bdF07cC54Pm4mJihuPXAueCkscC54PGUmJihlPXAueCkscC55Pm8mJihvPXAueSkscC55PHImJihyPXAueSl9dGhpcy5wbWluXz1uZXcgaShlLHIpLHRoaXMucG1heF89bmV3IGkobixvKTt2YXIgaD1hKihuLWUpLHU9YSooby1yKTt0aGlzLmhlYWRfPW5ldyBpKG4raCxyLXUpLHRoaXMudGFpbF89bmV3IGkoZS1oLHItdSksdGhpcy5wb2ludHNfLnNvcnQoaS5jb21wYXJlKX0sZy5wcm90b3R5cGUuaW5pdEVkZ2VzPWZ1bmN0aW9uKHQpe3ZhciBuLGU9dC5sZW5ndGg7Zm9yKG49MDtlPm47KytuKXRoaXMuZWRnZV9saXN0LnB1c2gobmV3IGgodFtuXSx0WyhuKzEpJWVdKSl9LGcucHJvdG90eXBlLmdldFBvaW50PWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLnBvaW50c19bdF19LGcucHJvdG90eXBlLmFkZFRvTWFwPWZ1bmN0aW9uKHQpe3RoaXMubWFwXy5wdXNoKHQpfSxnLnByb3RvdHlwZS5sb2NhdGVOb2RlPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmZyb250Xy5sb2NhdGVOb2RlKHQueCl9LGcucHJvdG90eXBlLmNyZWF0ZUFkdmFuY2luZ0Zyb250PWZ1bmN0aW9uKCl7dmFyIHQsbixlLGk9bmV3IG8odGhpcy5wb2ludHNfWzBdLHRoaXMudGFpbF8sdGhpcy5oZWFkXyk7dGhpcy5tYXBfLnB1c2goaSksdD1uZXcgcChpLmdldFBvaW50KDEpLGkpLG49bmV3IHAoaS5nZXRQb2ludCgwKSxpKSxlPW5ldyBwKGkuZ2V0UG9pbnQoMikpLHRoaXMuZnJvbnRfPW5ldyBzKHQsZSksdC5uZXh0PW4sbi5uZXh0PWUsbi5wcmV2PXQsZS5wcmV2PW59LGcucHJvdG90eXBlLnJlbW92ZU5vZGU9ZnVuY3Rpb24oKXt9LGcucHJvdG90eXBlLm1hcFRyaWFuZ2xlVG9Ob2Rlcz1mdW5jdGlvbih0KXtmb3IodmFyIG49MDszPm47KytuKWlmKCF0LmdldE5laWdoYm9yKG4pKXt2YXIgZT10aGlzLmZyb250Xy5sb2NhdGVQb2ludCh0LnBvaW50Q1codC5nZXRQb2ludChuKSkpO2UmJihlLnRyaWFuZ2xlPXQpfX0sZy5wcm90b3R5cGUucmVtb3ZlRnJvbU1hcD1mdW5jdGlvbih0KXt2YXIgbixlPXRoaXMubWFwXyxpPWUubGVuZ3RoO2ZvcihuPTA7aT5uO24rKylpZihlW25dPT09dCl7ZS5zcGxpY2UobiwxKTticmVha319LGcucHJvdG90eXBlLm1lc2hDbGVhbj1mdW5jdGlvbih0KXtmb3IodmFyIG4sZSxpPVt0XTtuPWkucG9wKCk7KWlmKCFuLmlzSW50ZXJpb3IoKSlmb3Iobi5zZXRJbnRlcmlvcighMCksdGhpcy50cmlhbmdsZXNfLnB1c2gobiksZT0wOzM+ZTtlKyspbi5jb25zdHJhaW5lZF9lZGdlW2VdfHxpLnB1c2gobi5nZXROZWlnaGJvcihlKSl9LG4uZXhwb3J0cz1nfSx7XCIuL2FkdmFuY2luZ2Zyb250XCI6MixcIi4vcG9pbnRcIjo0LFwiLi9wb2ludGVycm9yXCI6NSxcIi4vc3dlZXBcIjo3LFwiLi90cmlhbmdsZVwiOjl9XSw5OltmdW5jdGlvbih0LG4pe1widXNlIHN0cmljdFwiO3ZhciBlPXQoXCIuL3h5XCIpLGk9ZnVuY3Rpb24odCxuLGUpe3RoaXMucG9pbnRzXz1bdCxuLGVdLHRoaXMubmVpZ2hib3JzXz1bbnVsbCxudWxsLG51bGxdLHRoaXMuaW50ZXJpb3JfPSExLHRoaXMuY29uc3RyYWluZWRfZWRnZT1bITEsITEsITFdLHRoaXMuZGVsYXVuYXlfZWRnZT1bITEsITEsITFdfSxvPWUudG9TdHJpbmc7aS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIltcIitvKHRoaXMucG9pbnRzX1swXSkrbyh0aGlzLnBvaW50c19bMV0pK28odGhpcy5wb2ludHNfWzJdKStcIl1cIn0saS5wcm90b3R5cGUuZ2V0UG9pbnQ9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMucG9pbnRzX1t0XX0saS5wcm90b3R5cGUuR2V0UG9pbnQ9aS5wcm90b3R5cGUuZ2V0UG9pbnQsaS5wcm90b3R5cGUuZ2V0UG9pbnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucG9pbnRzX30saS5wcm90b3R5cGUuZ2V0TmVpZ2hib3I9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubmVpZ2hib3JzX1t0XX0saS5wcm90b3R5cGUuY29udGFpbnNQb2ludD1mdW5jdGlvbih0KXt2YXIgbj10aGlzLnBvaW50c187cmV0dXJuIHQ9PT1uWzBdfHx0PT09blsxXXx8dD09PW5bMl19LGkucHJvdG90eXBlLmNvbnRhaW5zRWRnZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5jb250YWluc1BvaW50KHQucCkmJnRoaXMuY29udGFpbnNQb2ludCh0LnEpfSxpLnByb3RvdHlwZS5jb250YWluc1BvaW50cz1mdW5jdGlvbih0LG4pe3JldHVybiB0aGlzLmNvbnRhaW5zUG9pbnQodCkmJnRoaXMuY29udGFpbnNQb2ludChuKX0saS5wcm90b3R5cGUuaXNJbnRlcmlvcj1mdW5jdGlvbigpe3JldHVybiB0aGlzLmludGVyaW9yX30saS5wcm90b3R5cGUuc2V0SW50ZXJpb3I9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuaW50ZXJpb3JfPXQsdGhpc30saS5wcm90b3R5cGUubWFya05laWdoYm9yUG9pbnRlcnM9ZnVuY3Rpb24odCxuLGUpe3ZhciBpPXRoaXMucG9pbnRzXztpZih0PT09aVsyXSYmbj09PWlbMV18fHQ9PT1pWzFdJiZuPT09aVsyXSl0aGlzLm5laWdoYm9yc19bMF09ZTtlbHNlIGlmKHQ9PT1pWzBdJiZuPT09aVsyXXx8dD09PWlbMl0mJm49PT1pWzBdKXRoaXMubmVpZ2hib3JzX1sxXT1lO2Vsc2V7aWYoISh0PT09aVswXSYmbj09PWlbMV18fHQ9PT1pWzFdJiZuPT09aVswXSkpdGhyb3cgbmV3IEVycm9yKFwicG9seTJ0cmkgSW52YWxpZCBUcmlhbmdsZS5tYXJrTmVpZ2hib3JQb2ludGVycygpIGNhbGxcIik7dGhpcy5uZWlnaGJvcnNfWzJdPWV9fSxpLnByb3RvdHlwZS5tYXJrTmVpZ2hib3I9ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5wb2ludHNfO3QuY29udGFpbnNQb2ludHMoblsxXSxuWzJdKT8odGhpcy5uZWlnaGJvcnNfWzBdPXQsdC5tYXJrTmVpZ2hib3JQb2ludGVycyhuWzFdLG5bMl0sdGhpcykpOnQuY29udGFpbnNQb2ludHMoblswXSxuWzJdKT8odGhpcy5uZWlnaGJvcnNfWzFdPXQsdC5tYXJrTmVpZ2hib3JQb2ludGVycyhuWzBdLG5bMl0sdGhpcykpOnQuY29udGFpbnNQb2ludHMoblswXSxuWzFdKSYmKHRoaXMubmVpZ2hib3JzX1syXT10LHQubWFya05laWdoYm9yUG9pbnRlcnMoblswXSxuWzFdLHRoaXMpKX0saS5wcm90b3R5cGUuY2xlYXJOZWlnaGJvcnM9ZnVuY3Rpb24oKXt0aGlzLm5laWdoYm9yc19bMF09bnVsbCx0aGlzLm5laWdoYm9yc19bMV09bnVsbCx0aGlzLm5laWdoYm9yc19bMl09bnVsbH0saS5wcm90b3R5cGUuY2xlYXJEZWxhdW5heUVkZ2VzPWZ1bmN0aW9uKCl7dGhpcy5kZWxhdW5heV9lZGdlWzBdPSExLHRoaXMuZGVsYXVuYXlfZWRnZVsxXT0hMSx0aGlzLmRlbGF1bmF5X2VkZ2VbMl09ITF9LGkucHJvdG90eXBlLnBvaW50Q1c9ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5wb2ludHNfO3JldHVybiB0PT09blswXT9uWzJdOnQ9PT1uWzFdP25bMF06dD09PW5bMl0/blsxXTpudWxsfSxpLnByb3RvdHlwZS5wb2ludENDVz1mdW5jdGlvbih0KXt2YXIgbj10aGlzLnBvaW50c187cmV0dXJuIHQ9PT1uWzBdP25bMV06dD09PW5bMV0/blsyXTp0PT09blsyXT9uWzBdOm51bGx9LGkucHJvdG90eXBlLm5laWdoYm9yQ1c9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9PT10aGlzLnBvaW50c19bMF0/dGhpcy5uZWlnaGJvcnNfWzFdOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5uZWlnaGJvcnNfWzJdOnRoaXMubmVpZ2hib3JzX1swXX0saS5wcm90b3R5cGUubmVpZ2hib3JDQ1c9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9PT10aGlzLnBvaW50c19bMF0/dGhpcy5uZWlnaGJvcnNfWzJdOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5uZWlnaGJvcnNfWzBdOnRoaXMubmVpZ2hib3JzX1sxXX0saS5wcm90b3R5cGUuZ2V0Q29uc3RyYWluZWRFZGdlQ1c9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9PT10aGlzLnBvaW50c19bMF0/dGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdOnRoaXMuY29uc3RyYWluZWRfZWRnZVswXX0saS5wcm90b3R5cGUuZ2V0Q29uc3RyYWluZWRFZGdlQ0NXPWZ1bmN0aW9uKHQpe3JldHVybiB0PT09dGhpcy5wb2ludHNfWzBdP3RoaXMuY29uc3RyYWluZWRfZWRnZVsyXTp0PT09dGhpcy5wb2ludHNfWzFdP3RoaXMuY29uc3RyYWluZWRfZWRnZVswXTp0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV19LGkucHJvdG90eXBlLmdldENvbnN0cmFpbmVkRWRnZUFjcm9zcz1mdW5jdGlvbih0KXtyZXR1cm4gdD09PXRoaXMucG9pbnRzX1swXT90aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF06dD09PXRoaXMucG9pbnRzX1sxXT90aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV06dGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdfSxpLnByb3RvdHlwZS5zZXRDb25zdHJhaW5lZEVkZ2VDVz1mdW5jdGlvbih0LG4pe3Q9PT10aGlzLnBvaW50c19bMF0/dGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdPW46dD09PXRoaXMucG9pbnRzX1sxXT90aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl09bjp0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF09bn0saS5wcm90b3R5cGUuc2V0Q29uc3RyYWluZWRFZGdlQ0NXPWZ1bmN0aW9uKHQsbil7dD09PXRoaXMucG9pbnRzX1swXT90aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl09bjp0PT09dGhpcy5wb2ludHNfWzFdP3RoaXMuY29uc3RyYWluZWRfZWRnZVswXT1uOnRoaXMuY29uc3RyYWluZWRfZWRnZVsxXT1ufSxpLnByb3RvdHlwZS5nZXREZWxhdW5heUVkZ2VDVz1mdW5jdGlvbih0KXtyZXR1cm4gdD09PXRoaXMucG9pbnRzX1swXT90aGlzLmRlbGF1bmF5X2VkZ2VbMV06dD09PXRoaXMucG9pbnRzX1sxXT90aGlzLmRlbGF1bmF5X2VkZ2VbMl06dGhpcy5kZWxhdW5heV9lZGdlWzBdfSxpLnByb3RvdHlwZS5nZXREZWxhdW5heUVkZ2VDQ1c9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9PT10aGlzLnBvaW50c19bMF0/dGhpcy5kZWxhdW5heV9lZGdlWzJdOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5kZWxhdW5heV9lZGdlWzBdOnRoaXMuZGVsYXVuYXlfZWRnZVsxXX0saS5wcm90b3R5cGUuc2V0RGVsYXVuYXlFZGdlQ1c9ZnVuY3Rpb24odCxuKXt0PT09dGhpcy5wb2ludHNfWzBdP3RoaXMuZGVsYXVuYXlfZWRnZVsxXT1uOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5kZWxhdW5heV9lZGdlWzJdPW46dGhpcy5kZWxhdW5heV9lZGdlWzBdPW59LGkucHJvdG90eXBlLnNldERlbGF1bmF5RWRnZUNDVz1mdW5jdGlvbih0LG4pe3Q9PT10aGlzLnBvaW50c19bMF0/dGhpcy5kZWxhdW5heV9lZGdlWzJdPW46dD09PXRoaXMucG9pbnRzX1sxXT90aGlzLmRlbGF1bmF5X2VkZ2VbMF09bjp0aGlzLmRlbGF1bmF5X2VkZ2VbMV09bn0saS5wcm90b3R5cGUubmVpZ2hib3JBY3Jvc3M9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9PT10aGlzLnBvaW50c19bMF0/dGhpcy5uZWlnaGJvcnNfWzBdOnQ9PT10aGlzLnBvaW50c19bMV0/dGhpcy5uZWlnaGJvcnNfWzFdOnRoaXMubmVpZ2hib3JzX1syXX0saS5wcm90b3R5cGUub3Bwb3NpdGVQb2ludD1mdW5jdGlvbih0LG4pe3ZhciBlPXQucG9pbnRDVyhuKTtyZXR1cm4gdGhpcy5wb2ludENXKGUpfSxpLnByb3RvdHlwZS5sZWdhbGl6ZT1mdW5jdGlvbih0LG4pe3ZhciBlPXRoaXMucG9pbnRzXztpZih0PT09ZVswXSllWzFdPWVbMF0sZVswXT1lWzJdLGVbMl09bjtlbHNlIGlmKHQ9PT1lWzFdKWVbMl09ZVsxXSxlWzFdPWVbMF0sZVswXT1uO2Vsc2V7aWYodCE9PWVbMl0pdGhyb3cgbmV3IEVycm9yKFwicG9seTJ0cmkgSW52YWxpZCBUcmlhbmdsZS5sZWdhbGl6ZSgpIGNhbGxcIik7ZVswXT1lWzJdLGVbMl09ZVsxXSxlWzFdPW59fSxpLnByb3RvdHlwZS5pbmRleD1mdW5jdGlvbih0KXt2YXIgbj10aGlzLnBvaW50c187aWYodD09PW5bMF0pcmV0dXJuIDA7aWYodD09PW5bMV0pcmV0dXJuIDE7aWYodD09PW5bMl0pcmV0dXJuIDI7dGhyb3cgbmV3IEVycm9yKFwicG9seTJ0cmkgSW52YWxpZCBUcmlhbmdsZS5pbmRleCgpIGNhbGxcIil9LGkucHJvdG90eXBlLmVkZ2VJbmRleD1mdW5jdGlvbih0LG4pe3ZhciBlPXRoaXMucG9pbnRzXztpZih0PT09ZVswXSl7aWYobj09PWVbMV0pcmV0dXJuIDI7aWYobj09PWVbMl0pcmV0dXJuIDF9ZWxzZSBpZih0PT09ZVsxXSl7aWYobj09PWVbMl0pcmV0dXJuIDA7aWYobj09PWVbMF0pcmV0dXJuIDJ9ZWxzZSBpZih0PT09ZVsyXSl7aWYobj09PWVbMF0pcmV0dXJuIDE7aWYobj09PWVbMV0pcmV0dXJuIDB9cmV0dXJuLTF9LGkucHJvdG90eXBlLm1hcmtDb25zdHJhaW5lZEVkZ2VCeUluZGV4PWZ1bmN0aW9uKHQpe3RoaXMuY29uc3RyYWluZWRfZWRnZVt0XT0hMH0saS5wcm90b3R5cGUubWFya0NvbnN0cmFpbmVkRWRnZUJ5RWRnZT1mdW5jdGlvbih0KXt0aGlzLm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyh0LnAsdC5xKX0saS5wcm90b3R5cGUubWFya0NvbnN0cmFpbmVkRWRnZUJ5UG9pbnRzPWZ1bmN0aW9uKHQsbil7dmFyIGU9dGhpcy5wb2ludHNfO249PT1lWzBdJiZ0PT09ZVsxXXx8bj09PWVbMV0mJnQ9PT1lWzBdP3RoaXMuY29uc3RyYWluZWRfZWRnZVsyXT0hMDpuPT09ZVswXSYmdD09PWVbMl18fG49PT1lWzJdJiZ0PT09ZVswXT90aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV09ITA6KG49PT1lWzFdJiZ0PT09ZVsyXXx8bj09PWVbMl0mJnQ9PT1lWzFdKSYmKHRoaXMuY29uc3RyYWluZWRfZWRnZVswXT0hMCl9LG4uZXhwb3J0cz1pfSx7XCIuL3h5XCI6MTF9XSwxMDpbZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCxuLGUpe3ZhciBpPSh0LngtZS54KSoobi55LWUueSksbz0odC55LWUueSkqKG4ueC1lLngpLHI9aS1vO3JldHVybiByPi1zJiZzPnI/cC5DT0xMSU5FQVI6cj4wP3AuQ0NXOnAuQ1d9ZnVuY3Rpb24gbyh0LG4sZSxpKXt2YXIgbz0odC54LW4ueCkqKGkueS1uLnkpLShpLngtbi54KSoodC55LW4ueSk7aWYobz49LXMpcmV0dXJuITE7dmFyIHI9KHQueC1lLngpKihpLnktZS55KS0oaS54LWUueCkqKHQueS1lLnkpO3JldHVybiBzPj1yPyExOiEwfWZ1bmN0aW9uIHIodCxuLGUpe3ZhciBpPW4ueC10Lngsbz1uLnktdC55LHI9ZS54LXQueCxzPWUueS10Lnk7cmV0dXJuIDA+aSpyK28qc312YXIgcz0xZS0xMjtlLkVQU0lMT049czt2YXIgcD17Q1c6MSxDQ1c6LTEsQ09MTElORUFSOjB9O2UuT3JpZW50YXRpb249cCxlLm9yaWVudDJkPWksZS5pblNjYW5BcmVhPW8sZS5pc0FuZ2xlT2J0dXNlPXJ9LHt9XSwxMTpbZnVuY3Rpb24odCxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBlKHQpe3JldHVyblwiKFwiK3QueCtcIjtcIit0LnkrXCIpXCJ9ZnVuY3Rpb24gaSh0KXt2YXIgbj10LnRvU3RyaW5nKCk7cmV0dXJuXCJbb2JqZWN0IE9iamVjdF1cIj09PW4/ZSh0KTpufWZ1bmN0aW9uIG8odCxuKXtyZXR1cm4gdC55PT09bi55P3QueC1uLng6dC55LW4ueX1mdW5jdGlvbiByKHQsbil7cmV0dXJuIHQueD09PW4ueCYmdC55PT09bi55fW4uZXhwb3J0cz17dG9TdHJpbmc6aSx0b1N0cmluZ0Jhc2U6ZSxjb21wYXJlOm8sZXF1YWxzOnJ9fSx7fV19LHt9LFs2XSkoNil9KTtcclxuIiwiIWZ1bmN0aW9uKHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPXQoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sdCk7ZWxzZXt2YXIgZTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2U9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/ZT1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihlPXNlbGYpLGUuUHJpb3JpdHlRdWV1ZT10KCl9fShmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbiB0KGUsaSxyKXtmdW5jdGlvbiBvKG4scyl7aWYoIWlbbl0pe2lmKCFlW25dKXt2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFzJiZ1KXJldHVybiB1KG4sITApO2lmKGEpcmV0dXJuIGEobiwhMCk7dmFyIGg9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIituK1wiJ1wiKTt0aHJvdyBoLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsaH12YXIgcD1pW25dPXtleHBvcnRzOnt9fTtlW25dWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHQpe3ZhciBpPWVbbl1bMV1bdF07cmV0dXJuIG8oaT9pOnQpfSxwLHAuZXhwb3J0cyx0LGUsaSxyKX1yZXR1cm4gaVtuXS5leHBvcnRzfWZvcih2YXIgYT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLG49MDtuPHIubGVuZ3RoO24rKylvKHJbbl0pO3JldHVybiBvfSh7MTpbZnVuY3Rpb24odCxlKXt2YXIgaSxyLG8sYSxuLHM9e30uaGFzT3duUHJvcGVydHksdT1mdW5jdGlvbih0LGUpe2Z1bmN0aW9uIGkoKXt0aGlzLmNvbnN0cnVjdG9yPXR9Zm9yKHZhciByIGluIGUpcy5jYWxsKGUscikmJih0W3JdPWVbcl0pO3JldHVybiBpLnByb3RvdHlwZT1lLnByb3RvdHlwZSx0LnByb3RvdHlwZT1uZXcgaSx0Ll9fc3VwZXJfXz1lLnByb3RvdHlwZSx0fTtpPXQoXCIuL1ByaW9yaXR5UXVldWUvQWJzdHJhY3RQcmlvcml0eVF1ZXVlXCIpLHI9dChcIi4vUHJpb3JpdHlRdWV1ZS9BcnJheVN0cmF0ZWd5XCIpLGE9dChcIi4vUHJpb3JpdHlRdWV1ZS9CaW5hcnlIZWFwU3RyYXRlZ3lcIiksbz10KFwiLi9Qcmlvcml0eVF1ZXVlL0JIZWFwU3RyYXRlZ3lcIiksbj1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQpe3R8fCh0PXt9KSx0LnN0cmF0ZWd5fHwodC5zdHJhdGVneT1hKSx0LmNvbXBhcmF0b3J8fCh0LmNvbXBhcmF0b3I9ZnVuY3Rpb24odCxlKXtyZXR1cm4odHx8MCktKGV8fDApfSksZS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLHQpfXJldHVybiB1KGUsdCksZX0oaSksbi5BcnJheVN0cmF0ZWd5PXIsbi5CaW5hcnlIZWFwU3RyYXRlZ3k9YSxuLkJIZWFwU3RyYXRlZ3k9byxlLmV4cG9ydHM9bn0se1wiLi9Qcmlvcml0eVF1ZXVlL0Fic3RyYWN0UHJpb3JpdHlRdWV1ZVwiOjIsXCIuL1ByaW9yaXR5UXVldWUvQXJyYXlTdHJhdGVneVwiOjMsXCIuL1ByaW9yaXR5UXVldWUvQkhlYXBTdHJhdGVneVwiOjQsXCIuL1ByaW9yaXR5UXVldWUvQmluYXJ5SGVhcFN0cmF0ZWd5XCI6NX1dLDI6W2Z1bmN0aW9uKHQsZSl7dmFyIGk7ZS5leHBvcnRzPWk9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQpe2lmKG51bGw9PShudWxsIT10P3Quc3RyYXRlZ3k6dm9pZCAwKSl0aHJvd1wiTXVzdCBwYXNzIG9wdGlvbnMuc3RyYXRlZ3ksIGEgc3RyYXRlZ3lcIjtpZihudWxsPT0obnVsbCE9dD90LmNvbXBhcmF0b3I6dm9pZCAwKSl0aHJvd1wiTXVzdCBwYXNzIG9wdGlvbnMuY29tcGFyYXRvciwgYSBjb21wYXJhdG9yXCI7dGhpcy5wcml2PW5ldyB0LnN0cmF0ZWd5KHQpLHRoaXMubGVuZ3RoPTB9cmV0dXJuIHQucHJvdG90eXBlLnF1ZXVlPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmxlbmd0aCsrLHZvaWQgdGhpcy5wcml2LnF1ZXVlKHQpfSx0LnByb3RvdHlwZS5kZXF1ZXVlPWZ1bmN0aW9uKCl7aWYoIXRoaXMubGVuZ3RoKXRocm93XCJFbXB0eSBxdWV1ZVwiO3JldHVybiB0aGlzLmxlbmd0aC0tLHRoaXMucHJpdi5kZXF1ZXVlKCl9LHQucHJvdG90eXBlLnBlZWs9ZnVuY3Rpb24oKXtpZighdGhpcy5sZW5ndGgpdGhyb3dcIkVtcHR5IHF1ZXVlXCI7cmV0dXJuIHRoaXMucHJpdi5wZWVrKCl9LHR9KCl9LHt9XSwzOltmdW5jdGlvbih0LGUpe3ZhciBpLHI7cj1mdW5jdGlvbih0LGUsaSl7dmFyIHIsbyxhO2ZvcihvPTAscj10Lmxlbmd0aDtyPm87KWE9bytyPj4+MSxpKHRbYV0sZSk+PTA/bz1hKzE6cj1hO3JldHVybiBvfSxlLmV4cG9ydHM9aT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCl7dmFyIGU7dGhpcy5vcHRpb25zPXQsdGhpcy5jb21wYXJhdG9yPXRoaXMub3B0aW9ucy5jb21wYXJhdG9yLHRoaXMuZGF0YT0obnVsbCE9KGU9dGhpcy5vcHRpb25zLmluaXRpYWxWYWx1ZXMpP2Uuc2xpY2UoMCk6dm9pZCAwKXx8W10sdGhpcy5kYXRhLnNvcnQodGhpcy5jb21wYXJhdG9yKS5yZXZlcnNlKCl9cmV0dXJuIHQucHJvdG90eXBlLnF1ZXVlPWZ1bmN0aW9uKHQpe3ZhciBlO3JldHVybiBlPXIodGhpcy5kYXRhLHQsdGhpcy5jb21wYXJhdG9yKSx2b2lkIHRoaXMuZGF0YS5zcGxpY2UoZSwwLHQpfSx0LnByb3RvdHlwZS5kZXF1ZXVlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGF0YS5wb3AoKX0sdC5wcm90b3R5cGUucGVlaz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aC0xXX0sdH0oKX0se31dLDQ6W2Z1bmN0aW9uKHQsZSl7dmFyIGk7ZS5leHBvcnRzPWk9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQpe3ZhciBlLGkscixvLGEsbixzLHUsaDtmb3IodGhpcy5jb21wYXJhdG9yPShudWxsIT10P3QuY29tcGFyYXRvcjp2b2lkIDApfHxmdW5jdGlvbih0LGUpe3JldHVybiB0LWV9LHRoaXMucGFnZVNpemU9KG51bGwhPXQ/dC5wYWdlU2l6ZTp2b2lkIDApfHw1MTIsdGhpcy5sZW5ndGg9MCxyPTA7MTw8cjx0aGlzLnBhZ2VTaXplOylyKz0xO2lmKDE8PHIhPT10aGlzLnBhZ2VTaXplKXRocm93XCJwYWdlU2l6ZSBtdXN0IGJlIGEgcG93ZXIgb2YgdHdvXCI7Zm9yKHRoaXMuX3NoaWZ0PXIsdGhpcy5fZW1wdHlNZW1vcnlQYWdlVGVtcGxhdGU9ZT1bXSxpPWE9MCx1PXRoaXMucGFnZVNpemU7dT49MD91PmE6YT51O2k9dT49MD8rK2E6LS1hKWUucHVzaChudWxsKTtpZih0aGlzLl9tZW1vcnk9W10sdGhpcy5fbWFzaz10aGlzLnBhZ2VTaXplLTEsdC5pbml0aWFsVmFsdWVzKWZvcihoPXQuaW5pdGlhbFZhbHVlcyxuPTAscz1oLmxlbmd0aDtzPm47bisrKW89aFtuXSx0aGlzLnF1ZXVlKG8pfXJldHVybiB0LnByb3RvdHlwZS5xdWV1ZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5sZW5ndGgrPTEsdGhpcy5fd3JpdGUodGhpcy5sZW5ndGgsdCksdm9pZCB0aGlzLl9idWJibGVVcCh0aGlzLmxlbmd0aCx0KX0sdC5wcm90b3R5cGUuZGVxdWV1ZT1mdW5jdGlvbigpe3ZhciB0LGU7cmV0dXJuIHQ9dGhpcy5fcmVhZCgxKSxlPXRoaXMuX3JlYWQodGhpcy5sZW5ndGgpLHRoaXMubGVuZ3RoLT0xLHRoaXMubGVuZ3RoPjAmJih0aGlzLl93cml0ZSgxLGUpLHRoaXMuX2J1YmJsZURvd24oMSxlKSksdH0sdC5wcm90b3R5cGUucGVlaz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWFkKDEpfSx0LnByb3RvdHlwZS5fd3JpdGU9ZnVuY3Rpb24odCxlKXt2YXIgaTtmb3IoaT10Pj50aGlzLl9zaGlmdDtpPj10aGlzLl9tZW1vcnkubGVuZ3RoOyl0aGlzLl9tZW1vcnkucHVzaCh0aGlzLl9lbXB0eU1lbW9yeVBhZ2VUZW1wbGF0ZS5zbGljZSgwKSk7cmV0dXJuIHRoaXMuX21lbW9yeVtpXVt0JnRoaXMuX21hc2tdPWV9LHQucHJvdG90eXBlLl9yZWFkPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9tZW1vcnlbdD4+dGhpcy5fc2hpZnRdW3QmdGhpcy5fbWFza119LHQucHJvdG90eXBlLl9idWJibGVVcD1mdW5jdGlvbih0LGUpe3ZhciBpLHIsbyxhO2ZvcihpPXRoaXMuY29tcGFyYXRvcjt0PjEmJihyPXQmdGhpcy5fbWFzayx0PHRoaXMucGFnZVNpemV8fHI+Mz9vPXQmfnRoaXMuX21hc2t8cj4+MToyPnI/KG89dC10aGlzLnBhZ2VTaXplPj50aGlzLl9zaGlmdCxvKz1vJn4odGhpcy5fbWFzaz4+MSksb3w9dGhpcy5wYWdlU2l6ZT4+MSk6bz10LTIsYT10aGlzLl9yZWFkKG8pLCEoaShhLGUpPDApKTspdGhpcy5fd3JpdGUobyxlKSx0aGlzLl93cml0ZSh0LGEpLHQ9bztyZXR1cm4gdm9pZCAwfSx0LnByb3RvdHlwZS5fYnViYmxlRG93bj1mdW5jdGlvbih0LGUpe3ZhciBpLHIsbyxhLG47Zm9yKG49dGhpcy5jb21wYXJhdG9yO3Q8dGhpcy5sZW5ndGg7KWlmKHQ+dGhpcy5fbWFzayYmISh0JnRoaXMuX21hc2stMSk/aT1yPXQrMjp0JnRoaXMucGFnZVNpemU+PjE/KGk9KHQmfnRoaXMuX21hc2spPj4xLGl8PXQmdGhpcy5fbWFzaz4+MSxpPWkrMTw8dGhpcy5fc2hpZnQscj1pKzEpOihpPXQrKHQmdGhpcy5fbWFzaykscj1pKzEpLGkhPT1yJiZyPD10aGlzLmxlbmd0aClpZihvPXRoaXMuX3JlYWQoaSksYT10aGlzLl9yZWFkKHIpLG4obyxlKTwwJiZuKG8sYSk8PTApdGhpcy5fd3JpdGUoaSxlKSx0aGlzLl93cml0ZSh0LG8pLHQ9aTtlbHNle2lmKCEobihhLGUpPDApKWJyZWFrO3RoaXMuX3dyaXRlKHIsZSksdGhpcy5fd3JpdGUodCxhKSx0PXJ9ZWxzZXtpZighKGk8PXRoaXMubGVuZ3RoKSlicmVhaztpZihvPXRoaXMuX3JlYWQoaSksIShuKG8sZSk8MCkpYnJlYWs7dGhpcy5fd3JpdGUoaSxlKSx0aGlzLl93cml0ZSh0LG8pLHQ9aX1yZXR1cm4gdm9pZCAwfSx0fSgpfSx7fV0sNTpbZnVuY3Rpb24odCxlKXt2YXIgaTtlLmV4cG9ydHM9aT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCl7dmFyIGU7dGhpcy5jb21wYXJhdG9yPShudWxsIT10P3QuY29tcGFyYXRvcjp2b2lkIDApfHxmdW5jdGlvbih0LGUpe3JldHVybiB0LWV9LHRoaXMubGVuZ3RoPTAsdGhpcy5kYXRhPShudWxsIT0oZT10LmluaXRpYWxWYWx1ZXMpP2Uuc2xpY2UoMCk6dm9pZCAwKXx8W10sdGhpcy5faGVhcGlmeSgpfXJldHVybiB0LnByb3RvdHlwZS5faGVhcGlmeT1mdW5jdGlvbigpe3ZhciB0LGUsaTtpZih0aGlzLmRhdGEubGVuZ3RoPjApZm9yKHQ9ZT0xLGk9dGhpcy5kYXRhLmxlbmd0aDtpPj0xP2k+ZTplPmk7dD1pPj0xPysrZTotLWUpdGhpcy5fYnViYmxlVXAodCk7cmV0dXJuIHZvaWQgMH0sdC5wcm90b3R5cGUucXVldWU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZGF0YS5wdXNoKHQpLHZvaWQgdGhpcy5fYnViYmxlVXAodGhpcy5kYXRhLmxlbmd0aC0xKX0sdC5wcm90b3R5cGUuZGVxdWV1ZT1mdW5jdGlvbigpe3ZhciB0LGU7cmV0dXJuIGU9dGhpcy5kYXRhWzBdLHQ9dGhpcy5kYXRhLnBvcCgpLHRoaXMuZGF0YS5sZW5ndGg+MCYmKHRoaXMuZGF0YVswXT10LHRoaXMuX2J1YmJsZURvd24oMCkpLGV9LHQucHJvdG90eXBlLnBlZWs9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kYXRhWzBdfSx0LnByb3RvdHlwZS5fYnViYmxlVXA9ZnVuY3Rpb24odCl7Zm9yKHZhciBlLGk7dD4wJiYoZT10LTE+Pj4xLHRoaXMuY29tcGFyYXRvcih0aGlzLmRhdGFbdF0sdGhpcy5kYXRhW2VdKTwwKTspaT10aGlzLmRhdGFbZV0sdGhpcy5kYXRhW2VdPXRoaXMuZGF0YVt0XSx0aGlzLmRhdGFbdF09aSx0PWU7cmV0dXJuIHZvaWQgMH0sdC5wcm90b3R5cGUuX2J1YmJsZURvd249ZnVuY3Rpb24odCl7dmFyIGUsaSxyLG8sYTtmb3IoZT10aGlzLmRhdGEubGVuZ3RoLTE7Oyl7aWYoaT0odDw8MSkrMSxvPWkrMSxyPXQsZT49aSYmdGhpcy5jb21wYXJhdG9yKHRoaXMuZGF0YVtpXSx0aGlzLmRhdGFbcl0pPDAmJihyPWkpLGU+PW8mJnRoaXMuY29tcGFyYXRvcih0aGlzLmRhdGFbb10sdGhpcy5kYXRhW3JdKTwwJiYocj1vKSxyPT09dClicmVhazthPXRoaXMuZGF0YVtyXSx0aGlzLmRhdGFbcl09dGhpcy5kYXRhW3RdLHRoaXMuZGF0YVt0XT1hLHQ9cn1yZXR1cm4gdm9pZCAwfSx0fSgpfSx7fV19LHt9LFsxXSkoMSl9KTsiLCJ2YXIgUGF0aGZpbmRlciA9IHJlcXVpcmUoJy4vcGF0aGZpbmRlcicpO1xyXG52YXIgZ2VvID0gcmVxdWlyZSgnLi9nZW9tZXRyeScpO1xyXG5cclxuLyoqXHJcbiAqIFBhdGhmaW5kaW5nIHdlYiB3b3JrZXIgaW1wbGVtZW50YXRpb24uXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbnZhciBQb2ludCA9IGdlby5Qb2ludDtcclxudmFyIFBvbHkgPSBnZW8uUG9seTtcclxuXHJcbi8qKlxyXG4gKiBPYmplY3Qgd2l0aCB1dGlsaXR5IG1ldGhvZHMgZm9yIGNvbnZlcnRpbmcgb2JqZWN0cyBmcm9tIHNlcmlhbGl6ZWRcclxuICogbWVzc2FnZSBmb3JtIGludG8gdGhlIHJlcXVpcmVkIG9iamVjdHMuXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG52YXIgQ29udmVydCA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBmb3JtYXQgb2YgYSBQb2ludCBhcyBzZXJpYWxpemVkIGJ5IHRoZSBXZWIgV29ya2VyIG1lc3NhZ2UtXHJcbiAqIHBhc3NpbmcgaW50ZXJmYWNlLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQb2ludE9ialxyXG4gKiBAcHJvcGVydHkge251bWJlcn0geFxyXG4gKiBAcHJvcGVydHkge251bWJlcn0geVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IHNlcmlhbGl6ZWQgUG9pbnQgb2JqZWN0IGJhY2sgdG8gUG9pbnQuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7UG9pbnRPYmp9IG9iaiAtIFRoZSBzZXJpYWxpemVkIFBvaW50IG9iamVjdC5cclxuICovXHJcbkNvbnZlcnQudG9Qb2ludCA9IGZ1bmN0aW9uKG9iaikge1xyXG4gIHJldHVybiBuZXcgUG9pbnQob2JqLngsIG9iai55KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgZm9ybWF0IG9mIGEgUG9seSBhcyBzZXJpYWxpemVkIGJ5IHRoZSBXZWIgV29ya2VyIG1lc3NhZ2UtXHJcbiAqIHBhc3NpbmcgaW50ZXJmYWNlLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQb2x5T2JqXHJcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPFBvaW50T2JqPn0gcG9pbnRzIC0gVGhlIGFycmF5IG9mIHNlcmlhbGl6ZWRcclxuICogICBQb2ludHMuXHJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaG9sZSAtIFdoZXRoZXIgb3Igbm90IHRoZSBwb2x5Z29uIGlzIGEgaG9sZS5cclxuICogQHByb3BlcnR5IHtpbnRlZ2VyfSBudW1wb2ludHMgLSBUaGUgbnVtYmVyIG9mIHBvaW50cyBpbiB0aGUgUG9seS5cclxuICovXHJcblxyXG4gLyoqXHJcbiAgKiBDb252ZXJ0IHNlcmlhbGl6ZWQgUG9seSBvYmplY3QgYmFjayB0byBQb2x5LlxyXG4gICogQHByaXZhdGVcclxuICAqIEBwYXJhbSB7UG9seU9ian0gb2JqIC0gVGhlIHNlcmlhbGl6ZWQgUG9seSBvYmplY3QuXHJcbiAgKi9cclxuQ29udmVydC50b1BvbHkgPSBmdW5jdGlvbihvYmopIHtcclxuICB2YXIgcG9seSA9IG5ldyBQb2x5KCk7XHJcbiAgcG9seS5wb2ludHMgPSBvYmoucG9pbnRzLm1hcChDb252ZXJ0LnRvUG9pbnQpO1xyXG4gIHBvbHkuaG9sZSA9IG9iai5ob2xlO1xyXG4gIHBvbHkudXBkYXRlKCk7XHJcbiAgcmV0dXJuIHBvbHk7XHJcbn07XHJcblxyXG52YXIgTG9nZ2VyID0ge307XHJcblxyXG4vKipcclxuICogU2VuZHMgbWVzc2FnZSB0byBwYXJlbnQgdG8gYmUgbG9nZ2VkIHRvIGNvbnNvbGUuIFRha2VzIHNhbWVcclxuICogYXJndW1lbnRzIGFzIEJyYWdpIGxvZ2dlci5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtzdHJpbmd9IGdyb3VwIC0gVGhlIGdyb3VwIHRvIGFzc29jaWF0ZSB0aGUgbWVzc2FnZSB3aXRoLlxyXG4gKiBAcGFyYW0gey4uLip9IC0gYXJiaXRyYXJ5IGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgYmFjayB0byB0aGUgcGFyZW50XHJcbiAqICAgbG9nZ2luZyBmdW5jdGlvbi5cclxuICovXHJcbkxvZ2dlci5sb2cgPSBmdW5jdGlvbihncm91cCkge1xyXG4gIHZhciBtZXNzYWdlID0gW1wibG9nXCJdO1xyXG4gIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG1lc3NhZ2UsIGFyZ3VtZW50cyk7XHJcbiAgcG9zdE1lc3NhZ2UobWVzc2FnZSk7XHJcbn07XHJcblxyXG52YXIgVXRpbCA9IHt9O1xyXG5cclxuVXRpbC5zcGxpY2UgPSBmdW5jdGlvbihhcnksIGluZGljZXMpIHtcclxuICBpbmRpY2VzID0gaW5kaWNlcy5zb3J0KFV0aWwuX251bWJlckNvbXBhcmUpLnJldmVyc2UoKTtcclxuICB2YXIgcmVtb3ZlZCA9IFtdO1xyXG4gIGluZGljZXMuZm9yRWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICByZW1vdmVkLnB1c2goYXJ5LnNwbGljZShpLCAxKVswXSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJlbW92ZWQ7XHJcbn07XHJcblxyXG5VdGlsLl9udW1iZXJDb21wYXJlID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIGlmIChhIDwgYikge1xyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH0gZWxzZSBpZiAoYSA+IGIpIHtcclxuICAgIHJldHVybiAxO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHVwIHZhcmlvdXMgYWN0aW9ucyB0byB0YWtlIG9uIGNvbW11bmljYXRpb24uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGUgLSBBbiBhcnJheSB3aXRoIHRoZSBmaXJzdCBlbGVtZW50IGJlaW5nIGEgc3RyaW5nXHJcbiAqICAgaWRlbnRpZmllciBmb3IgdGhlIG1lc3NhZ2UgdHlwZSwgYW5kIHN1YnNlcXVlbnQgZWxlbWVudHMgYmVpbmdcclxuICogICBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIHRoZSByZWxldmFudCBmdW5jdGlvbi4gTWVzc2FnZSB0eXBlczpcclxuICogICAqIHBvbHlzIC0gc2V0cyB0aGUgcG9seWdvbnMgdG8gdXNlIGZvciBuYXZpZ2F0aW9uXHJcbiAqICAgICAgIC0ge0FycmF5LjxQb2x5Pn0gYXJyYXkgb2YgcG9seWdvbnMgZGVmaW5pbmcgdGhlIG1hcFxyXG4gKiAgICogYVN0YXIgLSBjb21wdXRlcyBBKiBvbiBhYm92ZS1zZXQgaXRlbXNcclxuICogICAgICAgLSB7UG9pbnR9IHN0YXJ0IGxvY2F0aW9uIHRvIHVzZSBmb3Igc2VhcmNoXHJcbiAqICAgICAgIC0ge1BvaW50fSBlbmQgbG9jYXRpb24gdG8gdXNlIGZvciBzZWFyY2hcclxuICogICAqIGlzSW5pdGlhbGl6ZWQgLSBjaGVjayBpZiB0aGUgd29ya2VyIGlzIGluaXRpYWxpemVkLlxyXG4gKi9cclxub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xyXG4gIHZhciBkYXRhID0gZS5kYXRhO1xyXG4gIHZhciBuYW1lID0gZGF0YVswXTtcclxuICBMb2dnZXIubG9nKFwid29ya2VyOmRlYnVnXCIsIFwiTWVzc2FnZSByZWNlaXZlZCBieSB3b3JrZXI6XCIsIGRhdGEpO1xyXG4gIGlmIChuYW1lID09IFwicG9seXNcIikge1xyXG4gICAgLy8gUG9seWdvbnMgZGVmaW5pbmcgbWFwLlxyXG4gICAgc2VsZi5wb2x5cyA9IGRhdGFbMV0ubWFwKENvbnZlcnQudG9Qb2x5KTtcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIHBhdGhmaW5kZXIgbW9kdWxlLlxyXG4gICAgc2VsZi5wYXRoZmluZGVyID0gbmV3IFBhdGhmaW5kZXIoc2VsZi5wb2x5cyk7XHJcbiAgfSBlbHNlIGlmIChuYW1lID09IFwicG9seVVwZGF0ZVwiKSB7XHJcbiAgICAvLyBVcGRhdGUgdG8gbmF2bWVzaC5cclxuICAgIHZhciBuZXdQb2x5cyA9IGRhdGFbMV0ubWFwKENvbnZlcnQudG9Qb2x5KTtcclxuICAgIHZhciByZW1vdmVkUG9seXMgPSBkYXRhWzJdO1xyXG5cclxuICAgIFV0aWwuc3BsaWNlKHNlbGYucG9seXMsIHJlbW92ZWRQb2x5cyk7XHJcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShzZWxmLnBvbHlzLCBuZXdQb2x5cyk7XHJcblxyXG4gICAgLy8gUmUtaW5pdGlhbGl6ZSBwYXRoZmluZGVyLlxyXG4gICAgc2VsZi5wYXRoZmluZGVyID0gbmV3IFBhdGhmaW5kZXIoc2VsZi5wb2x5cyk7XHJcbiAgfSBlbHNlIGlmIChuYW1lID09IFwiYVN0YXJcIikge1xyXG4gICAgdmFyIHNvdXJjZSA9IENvbnZlcnQudG9Qb2ludChkYXRhWzFdKTtcclxuICAgIHZhciB0YXJnZXQgPSBDb252ZXJ0LnRvUG9pbnQoZGF0YVsyXSk7XHJcblxyXG4gICAgdmFyIHBhdGggPSBzZWxmLnBhdGhmaW5kZXIuYVN0YXIoc291cmNlLCB0YXJnZXQpO1xyXG4gICAgcG9zdE1lc3NhZ2UoW1wicmVzdWx0XCIsIHBhdGhdKTtcclxuICB9IGVsc2UgaWYgKG5hbWUgPT0gXCJpc0luaXRpYWxpemVkXCIpIHtcclxuICAgIHBvc3RNZXNzYWdlKFtcImluaXRpYWxpemVkXCJdKTtcclxuICB9XHJcbn07XHJcblxyXG5Mb2dnZXIubG9nKFwid29ya2VyXCIsIFwiV29ya2VyIGxvYWRlZC5cIik7XHJcbi8vIFNlbnQgY29uZmlybWF0aW9uIHRoYXQgd29ya2VyIGlzIGluaXRpYWxpemVkLlxyXG5wb3N0TWVzc2FnZShbXCJpbml0aWFsaXplZFwiXSk7XHJcblxyXG59O1xyXG4iLCIvKiBcclxuICogVGhlc2UgYWN0aW9uIHZhbHVlcyBjb3JyZXNwb25kIHRvIHRoZSAyNTYgc3RhdGVzIHBvc3NpYmxlIGdpdmVuIGVtcHR5XHJcbiAqIHRpbGVzLCBkaWFnb25hbCB0aWxlcywgYW5kIHNxdWFyZSB0aWxlcy4gR2VuZXJhdGVkIHVzaW5nIGRpYWdvbmFscy5qcy5cclxuICogVGhlcmUgYXJlIHR3byBwb3NzaWJsZSBmb3JtcyBmb3IgYW4gYWN0aW9uIHZhbHVlLiBPbmUgaXMgYXMgYSBzaW5nbGUgb2JqZWN0LlxyXG4gKiBJZiBhbiBpdGVtIGhhcyBvbmx5IGEgc2luZ2xlIG9iamVjdCwgdGhlbiB0aGVyZSBpcyBvbmx5IG9uZSBwb3NzaWJsZSBlbnRyYW5jZS9cclxuICogZXhpdCBwb3NzaWJsZSBmcm9tIHRoYXQgYXJyYW5nZW1lbnQgb2YgdGlsZXMuIElmIGFuIGl0ZW0gaGFzIGFuIGFycmF5IG9mXHJcbiAqIG9iamVjdHMgdGhlbiB0aGVyZSBhcmUgbXVsdGlwbGUgZW50cmFuY2UvZXhpdHMgcG9zc2libGUuIEVhY2ggb2YgdGhlIG9iamVjdHNcclxuICogaW4gYW4gYXJyYXkgb2YgdGhpcyBzb3J0IGhhcyBhICdsb2MnIHByb3BlcnR5IHRoYXQgaXRzZWxmIGlzIGFuIG9iamVjdCB3aXRoXHJcbiAqIHByb3BlcnRpZXMgJ2luX2RpcicgYW5kICdvdXRfZGlyJyBjb3JyZXNwb25kaW5nIHRvIHRoZSB2YWx1ZXMgdG8gZ2V0IGludG8gdGhlXHJcbiAqIGNlbGwgYW5kIHRoZSB2YWx1ZSB0aGF0IHNob3VsZCBiZSB0YWtlbiB0byBnZXQgb3V0IG9mIGl0LiBFYWNoIG9mIHRoZSBvYmplY3RzXHJcbiAqIGFsc28gaGFzIGEgcHJvcGVydHkgJ3YnIHdoaWNoIGlzIGEgYm9vbGVhbiBjb3JyZXNwb25kaW5nIHRvIHdoZXRoZXIgdGhlcmUgaXMgXHJcbiAqIGEgdmVydGV4IGF0IGEgdGlsZSB3aXRoIHRoaXMgYXJyYW5nZW1lbnQuIFRoZSBsb2NhdGlvbnMgY2FuIGJlIG4sIGUsIHMsIHcsIG5lLFxyXG4gKiBudywgc2UsIHN3LlxyXG4gKiBUaGUga2V5cyBvZiB0aGlzIG9iamVjdCBhcmUgc3RyaW5ncyBnZW5lcmF0ZWQgdXNpbmcgdGhlIG51bWJlciB2YWx1ZXMgb2YgYVxyXG4gKiBjb250b3VyIHRpbGUgc3RhcnRpbmcgZnJvbSB0aGUgdG9wIGxlZnQgYW5kIG1vdmluZyBjbG9ja3dpc2UsIHNlcGFyYXRlZCBieSBoeXBoZW5zLlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XCIwLTAtMC0wXCI6e1widlwiOmZhbHNlLFwibG9jXCI6XCJub25lXCJ9LFwiMS0wLTAtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJ3XCJ9LFwiMi0wLTAtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJ3XCJ9LFwiMy0wLTAtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJud1wifSxcIjAtMS0wLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwiblwifSxcIjEtMS0wLTBcIjp7XCJ2XCI6ZmFsc2UsXCJsb2NcIjpcIndcIn0sXCIyLTEtMC0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMS0wLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwibndcIn0sXCIwLTItMC0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm5lXCJ9LFwiMS0yLTAtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIyLTItMC0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMC0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMC0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm5cIn0sXCIxLTMtMC0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIndcIn0sXCIyLTMtMC0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIzLTMtMC0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm53XCJ9LFwiMC0wLTEtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJlXCJ9LFwiMS0wLTEtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjItMC0xLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMy0wLTEtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTEtMS0wXCI6e1widlwiOmZhbHNlLFwibG9jXCI6XCJuXCJ9LFwiMS0xLTEtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJ3XCJ9LFwiMi0xLTEtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMy0xLTEtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJud1wifSxcIjAtMi0xLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwibmVcIn0sXCIxLTItMS0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjItMi0xLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjMtMi0xLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm5lXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMy0xLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMS0zLTEtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIyLTMtMS0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMy0zLTEtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIwLTAtMi0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNlXCJ9LFwiMS0wLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIyLTAtMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIzLTAtMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIwLTEtMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjEtMS0yLTBcIjpbe1widlwiOmZhbHNlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjItMS0yLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIzLTEtMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJud1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIwLTItMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIxLTItMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMi0yLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMi0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjAtMy0yLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjEtMy0yLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjItMy0yLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMy0zLTItMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm53XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjAtMC0zLTBcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwiZVwifSxcIjEtMC0zLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMi0wLTMtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMy0wLTMtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTMtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJuXCJ9LFwiMS0xLTMtMFwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJ3XCJ9LFwiMi0xLTMtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMy0xLTMtMFwiOntcInZcIjpmYWxzZSxcImxvY1wiOlwibndcIn0sXCIwLTItMy0wXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm5lXCJ9LFwiMS0yLTMtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0yLTMtMFwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjMtMi0zLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMy0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIxLTMtMy0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIyLTMtMy0wXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjMtMy0zLTBcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjAtMC0wLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic1wifSxcIjEtMC0wLTFcIjp7XCJ2XCI6ZmFsc2UsXCJsb2NcIjpcInNcIn0sXCIyLTAtMC0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNcIn0sXCIzLTAtMC0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMS0wLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIxLTEtMC0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNcIn0sXCIyLTEtMC0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMS0wLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0yLTAtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIxLTItMC0xXCI6W3tcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIyLTItMC0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMC0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0zLTAtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIxLTMtMC0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNcIn0sXCIyLTMtMC0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIzLTMtMC0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTAtMS0xXCI6e1widlwiOmZhbHNlLFwibG9jXCI6XCJlXCJ9LFwiMS0wLTEtMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJlXCJ9LFwiMi0wLTEtMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJlXCJ9LFwiMy0wLTEtMVwiOlt7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTEtMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJuXCJ9LFwiMS0xLTEtMVwiOntcInZcIjpmYWxzZSxcImxvY1wiOlwibm9uZVwifSxcIjItMS0xLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwiblwifSxcIjMtMS0xLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwibndcIn0sXCIwLTItMS0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcIm5lXCJ9LFwiMS0yLTEtMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJuZVwifSxcIjItMi0xLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwibmVcIn0sXCIzLTItMS0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMS0xXCI6W3tcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIxLTMtMS0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcImVcIn0sXCIyLTMtMS0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIzLTMtMS0xXCI6W3tcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIwLTAtMi0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNlXCJ9LFwiMS0wLTItMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzZVwifSxcIjItMC0yLTFcIjp7XCJ2XCI6ZmFsc2UsXCJsb2NcIjpcInNlXCJ9LFwiMy0wLTItMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTItMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIxLTEtMi0xXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInNlXCJ9LFwiMi0xLTItMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIzLTEtMi0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTItMi0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIxLTItMi0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIyLTItMi0xXCI6W3tcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjMtMi0yLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMC0zLTItMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMS0zLTItMVwiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzZVwifSxcIjItMy0yLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMy0yLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTAtMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjEtMC0zLTFcIjpbe1widlwiOmZhbHNlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjItMC0zLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjMtMC0zLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTEtMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjEtMS0zLTFcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic1wifSxcIjItMS0zLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjMtMS0zLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMC0yLTMtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIxLTItMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOmZhbHNlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIyLTItMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIzLTItMy0xXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0zLTMtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjEtMy0zLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjItMy0zLTFcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMy0zLTMtMVwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjAtMC0wLTJcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic1wifSxcIjEtMC0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0wLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMy0wLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIxLTEtMC0yXCI6W3tcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIyLTEtMC0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMy0xLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMC0yLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMS0yLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjItMi0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMy0yLTAtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMC0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIxLTMtMC0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIyLTMtMC0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMy0wLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJud1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIwLTAtMS0yXCI6e1widlwiOnRydWUsXCJsb2NcIjpcImVcIn0sXCIxLTAtMS0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjItMC0xLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMC0xLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMS0xLTJcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwiblwifSxcIjEtMS0xLTJcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwid1wifSxcIjItMS0xLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMS0xLTJcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwibndcIn0sXCIwLTItMS0yXCI6e1widlwiOmZhbHNlLFwibG9jXCI6XCJuZVwifSxcIjEtMi0xLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0yLTEtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMy0yLTEtMlwiOlt7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTMtMS0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIxLTMtMS0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIyLTMtMS0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMy0xLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjAtMC0yLTJcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic2VcIn0sXCIxLTAtMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjItMC0yLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMC0yLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTEtMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fV0sXCIxLTEtMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOmZhbHNlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIyLTEtMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMy0xLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMi0yLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIxLTItMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX1dLFwiMi0yLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic2VcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIwLTMtMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMS0zLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0zLTItMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIzLTMtMi0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwibndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjAtMC0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNcIn19XSxcIjEtMC0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIyLTAtMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcIndcIn19XSxcIjMtMC0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibmVcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMS0xLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcInNcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0xLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIzLTEtMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIwLTItMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIxLTItMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMi0yLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIzLTItMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwic1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMy0zLTJcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwic1wifX1dLFwiMS0zLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJ3XCJ9fV0sXCIyLTMtMy0yXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwid1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuZVwiLFwib3V0X2RpclwiOlwid1wifX1dLFwiMy0zLTMtMlwiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5lXCIsXCJvdXRfZGlyXCI6XCJzXCJ9fV0sXCIwLTAtMC0zXCI6e1widlwiOnRydWUsXCJsb2NcIjpcInN3XCJ9LFwiMS0wLTAtM1wiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzd1wifSxcIjItMC0wLTNcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic3dcIn0sXCIzLTAtMC0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fV0sXCIwLTEtMC0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjEtMS0wLTNcIjp7XCJ2XCI6dHJ1ZSxcImxvY1wiOlwic3dcIn0sXCIyLTEtMC0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMS0wLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMi0wLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjEtMi0wLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjItMi0wLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMC0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMy0wLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjEtMy0wLTNcIjp7XCJ2XCI6ZmFsc2UsXCJsb2NcIjpcInN3XCJ9LFwiMi0zLTAtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMy0zLTAtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMC0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMS0wLTEtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIyLTAtMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIzLTAtMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTEtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMS0xLTEtM1wiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzd1wifSxcIjItMS0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMS0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMi0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjEtMi0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjItMi0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm5lXCJ9fV0sXCIzLTItMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcIm5lXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMy0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIxLTMtMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjItMy0xLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIzLTMtMS0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMC0wLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMS0wLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMi0wLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjMtMC0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMC0xLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjEtMS0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjItMS0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIzLTEtMi0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIndcIixcIm91dF9kaXJcIjpcIm53XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjAtMi0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMS0yLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIyLTItMi0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJ3XCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIzLTItMi0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcIm53XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwid1wiLFwib3V0X2RpclwiOlwibmVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMC0zLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm5cIixcIm91dF9kaXJcIjpcInNlXCJ9fV0sXCIxLTMtMi0zXCI6W3tcInZcIjpmYWxzZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiblwiLFwib3V0X2RpclwiOlwic2VcIn19XSxcIjItMy0yLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMy0zLTItM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwibndcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJuXCIsXCJvdXRfZGlyXCI6XCJzZVwifX1dLFwiMC0wLTMtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMS0wLTMtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMi0wLTMtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XSxcIjMtMC0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzXCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0xLTMtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiblwifX1dLFwiMS0xLTMtM1wiOntcInZcIjp0cnVlLFwibG9jXCI6XCJzd1wifSxcIjItMS0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNlXCIsXCJvdXRfZGlyXCI6XCJuXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcIm5cIn19XSxcIjMtMS0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6ZmFsc2UsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJud1wifX1dLFwiMC0yLTMtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwiZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjEtMi0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJuZVwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInNcIixcIm91dF9kaXJcIjpcInN3XCJ9fV0sXCIyLTItMy0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzZVwiLFwib3V0X2RpclwiOlwic3dcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwibmVcIn19XSxcIjMtMi0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcIm5lXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic1wiLFwib3V0X2RpclwiOlwibndcIn19XSxcIjAtMy0zLTNcIjpbe1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcImVcIixcIm91dF9kaXJcIjpcInN3XCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMS0zLTMtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic3dcIixcIm91dF9kaXJcIjpcImVcIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJud1wiLFwib3V0X2RpclwiOlwiZVwifX1dLFwiMi0zLTMtM1wiOlt7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwic2VcIixcIm91dF9kaXJcIjpcIm5cIn19LHtcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJzd1wiLFwib3V0X2RpclwiOlwiblwifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcIm53XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fV0sXCIzLTMtMy0zXCI6W3tcInZcIjp0cnVlLFwibG9jXCI6e1wiaW5fZGlyXCI6XCJlXCIsXCJvdXRfZGlyXCI6XCJzd1wifX0se1widlwiOnRydWUsXCJsb2NcIjp7XCJpbl9kaXJcIjpcInN3XCIsXCJvdXRfZGlyXCI6XCJlXCJ9fSx7XCJ2XCI6dHJ1ZSxcImxvY1wiOntcImluX2RpclwiOlwibndcIixcIm91dF9kaXJcIjpcImVcIn19XX07XHJcbiIsIi8qKlxyXG4gKiBBIHBvaW50IGNhbiByZXByZXNlbnQgYSB2ZXJ0ZXggaW4gYSAyZCBlbnZpcm9ubWVudCBvciBhIHZlY3Rvci5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIGB4YCBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgYHlgIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxyXG4gKi9cclxuUG9pbnQgPSBmdW5jdGlvbih4LCB5KSB7XHJcbiAgdGhpcy54ID0geDtcclxuICB0aGlzLnkgPSB5O1xyXG59O1xyXG5leHBvcnRzLlBvaW50ID0gUG9pbnQ7XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIHBvaW50LWxpa2Ugb2JqZWN0IGludG8gYSBwb2ludC5cclxuICogQHBhcmFtIHtQb2ludExpa2V9IHAgLSBUaGUgcG9pbnQtbGlrZSBvYmplY3QgdG8gY29udmVydC5cclxuICogQHJldHVybiB7UG9pbnR9IC0gVGhlIG5ldyBwb2ludCByZXByZXNlbnRpbmcgdGhlIHBvaW50LWxpa2VcclxuICogICBvYmplY3QuXHJcbiAqL1xyXG5Qb2ludC5mcm9tUG9pbnRMaWtlID0gZnVuY3Rpb24ocCkge1xyXG4gIHJldHVybiBuZXcgUG9pbnQocC54LCBwLnkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN0cmluZyBtZXRob2QgZm9yIHBvaW50LWxpa2Ugb2JqZWN0cy5cclxuICogQHBhcmFtIHtQb2ludExpa2V9IHAgLSBUaGUgcG9pbnQtbGlrZSBvYmplY3QgdG8gY29udmVydC5cclxuICogQHJldHVybiB7UG9pbnR9IC0gVGhlIG5ldyBwb2ludCByZXByZXNlbnRpbmcgdGhlIHBvaW50LWxpa2VcclxuICogICBvYmplY3QuXHJcbiAqL1xyXG5Qb2ludC50b1N0cmluZyA9IGZ1bmN0aW9uKHApIHtcclxuICByZXR1cm4gXCJ4XCIgKyBwLnggKyBcInlcIiArIHAueTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhIHBvaW50IG9yIHNjYWxhciBhbmQgYWRkcyBzbG90d2lzZSBpbiB0aGUgY2FzZSBvZiBhbm90aGVyXHJcbiAqIHBvaW50LCBvciB0byBlYWNoIHBhcmFtZXRlciBpbiB0aGUgY2FzZSBvZiBhIHNjYWxhci5cclxuICogQHBhcmFtIHsoUG9pbnR8bnVtYmVyKX0gLSBUaGUgUG9pbnQsIG9yIHNjYWxhciwgdG8gYWRkIHRvIHRoaXNcclxuICogICBwb2ludC5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihwKSB7XHJcbiAgaWYgKHR5cGVvZiBwID09IFwibnVtYmVyXCIpXHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCArIHAsIHRoaXMueSArIHApO1xyXG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy54ICsgcC54LCB0aGlzLnkgKyBwLnkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGEgcG9pbnQgb3Igc2NhbGFyIGFuZCBzdWJ0cmFjdHMgc2xvdHdpc2UgaW4gdGhlIGNhc2Ugb2ZcclxuICogYW5vdGhlciBwb2ludCBvciBmcm9tIGVhY2ggcGFyYW1ldGVyIGluIHRoZSBjYXNlIG9mIGEgc2NhbGFyLlxyXG4gKiBAcGFyYW0geyhQb2ludHxudW1iZXIpfSAtIFRoZSBQb2ludCwgb3Igc2NhbGFyLCB0byBzdWJ0cmFjdCBmcm9tXHJcbiAqICAgdGhpcyBwb2ludC5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbihwKSB7XHJcbiAgaWYgKHR5cGVvZiBwID09IFwibnVtYmVyXCIpXHJcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCAtIHAsIHRoaXMueSAtIHApO1xyXG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy54IC0gcC54LCB0aGlzLnkgLSBwLnkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGEgc2NhbGFyIHZhbHVlIGFuZCBtdWx0aXBsaWVzIGVhY2ggcGFyYW1ldGVyIG9mIHRoZSBwb2ludFxyXG4gKiBieSB0aGUgc2NhbGFyLlxyXG4gKiBAcGFyYW0gIHtudW1iZXJ9IGYgLSBUaGUgbnVtYmVyIHRvIG11bHRpcGxlIHRoZSBwYXJhbWV0ZXJzIGJ5LlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBBIG5ldyBwb2ludCB3aXRoIHRoZSBjYWxjdWxhdGVkIGNvb3JkaW5hdGVzLlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uKGYpIHtcclxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCAqIGYsIHRoaXMueSAqIGYpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGEgc2NhbGFyIHZhbHVlIGFuZCBkaXZpZGVzIGVhY2ggcGFyYW1ldGVyIG9mIHRoZSBwb2ludFxyXG4gKiBieSB0aGUgc2NhbGFyLlxyXG4gKiBAcGFyYW0gIHtudW1iZXJ9IGYgLSBUaGUgbnVtYmVyIHRvIGRpdmlkZSB0aGUgcGFyYW1ldGVycyBieS5cclxuICogQHJldHVybiB7UG9pbnR9IC0gQSBuZXcgcG9pbnQgd2l0aCB0aGUgY2FsY3VsYXRlZCBjb29yZGluYXRlcy5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbihmKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnggLyBmLCB0aGlzLnkgLyBmKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhbm90aGVyIHBvaW50IGFuZCByZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlXHJcbiAqIHBvaW50cyBhcmUgZXF1YWwuIFR3byBwb2ludHMgYXJlIGVxdWFsIGlmIHRoZWlyIHBhcmFtZXRlcnMgYXJlXHJcbiAqIGVxdWFsLlxyXG4gKiBAcGFyYW0gIHtQb2ludH0gcCAtIFRoZSBwb2ludCB0byBjaGVjayBlcXVhbGl0eSBhZ2FpbnN0LlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSB0d28gcG9pbnRzIGFyZSBlcXVhbC5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS5lcSA9IGZ1bmN0aW9uKHApIHtcclxuICByZXR1cm4gKHRoaXMueCA9PSBwLnggJiYgdGhpcy55ID09IHAueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogVGFrZXMgYW5vdGhlciBwb2ludCBhbmQgcmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZVxyXG4gKiBwb2ludHMgYXJlIG5vdCBlcXVhbC4gVHdvIHBvaW50cyBhcmUgY29uc2lkZXJlZCBub3QgZXF1YWwgaWYgdGhlaXJcclxuICogcGFyYW1ldGVycyBhcmUgbm90IGVxdWFsLlxyXG4gKiBAcGFyYW0gIHtQb2ludH0gcCAtIFRoZSBwb2ludCB0byBjaGVjayBlcXVhbGl0eSBhZ2FpbnN0LlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSB0d28gcG9pbnRzIGFyZSBub3QgZXF1YWwuXHJcbiAqL1xyXG5Qb2ludC5wcm90b3R5cGUubmVxID0gZnVuY3Rpb24ocCkge1xyXG4gIHJldHVybiAodGhpcy54ICE9IHAueCB8fCB0aGlzLnkgIT0gcC55KTtcclxufTtcclxuXHJcbi8vIEdpdmVuIGFub3RoZXIgcG9pbnQsIHJldHVybnMgdGhlIGRvdCBwcm9kdWN0LlxyXG5Qb2ludC5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24ocCkge1xyXG4gIHJldHVybiAodGhpcy54ICogcC54ICsgdGhpcy55ICogcC55KTtcclxufTtcclxuXHJcbi8vIEdpdmVuIGFub3RoZXIgcG9pbnQsIHJldHVybnMgdGhlICdjcm9zcyBwcm9kdWN0Jywgb3IgYXQgbGVhc3QgdGhlIDJkXHJcbi8vIGVxdWl2YWxlbnQuXHJcblBvaW50LnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uKHApIHtcclxuICByZXR1cm4gKHRoaXMueCAqIHAueSAtIHRoaXMueSAqIHAueCk7XHJcbn07XHJcblxyXG4vLyBHaXZlbiBhbm90aGVyIHBvaW50LCByZXR1cm5zIHRoZSBkaXN0YW5jZSB0byB0aGF0IHBvaW50LlxyXG5Qb2ludC5wcm90b3R5cGUuZGlzdCA9IGZ1bmN0aW9uKHApIHtcclxuICB2YXIgZGlmZiA9IHRoaXMuc3ViKHApO1xyXG4gIHJldHVybiBNYXRoLnNxcnQoZGlmZi5kb3QoZGlmZikpO1xyXG59O1xyXG5cclxuLy8gR2l2ZW4gYW5vdGhlciBwb2ludCwgcmV0dXJucyB0aGUgc3F1YXJlZCBkaXN0YW5jZSB0byB0aGF0IHBvaW50LlxyXG5Qb2ludC5wcm90b3R5cGUuZGlzdDIgPSBmdW5jdGlvbihwKSB7XHJcbiAgdmFyIGRpZmYgPSB0aGlzLnN1YihwKTtcclxuICByZXR1cm4gZGlmZi5kb3QoZGlmZik7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBwb2ludCBpcyAoMCwgMCkuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBvciBub3QgdGhlIHBvaW50IGlzICgwLCAwKS5cclxuICovXHJcblBvaW50LnByb3RvdHlwZS56ZXJvID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMueCA9PSAwICYmIHRoaXMueSA9PSAwO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmxlbiA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmRpc3QobmV3IFBvaW50KDAsIDApKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgbiA9IHRoaXMuZGlzdChuZXcgUG9pbnQoMCwgMCkpO1xyXG4gIGlmIChuID4gMCkgcmV0dXJuIHRoaXMuZGl2KG4pO1xyXG4gIHJldHVybiBuZXcgUG9pbnQoMCwgMCk7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gJ3gnICsgdGhpcy54ICsgJ3knICsgdGhpcy55O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhIGNvcHkgb2YgdGhlIHBvaW50LlxyXG4gKiBAcmV0dXJuIHtQb2ludH0gLSBUaGUgbmV3IHBvaW50LlxyXG4gKi9cclxuUG9pbnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XHJcbn07XHJcblxyXG4vKipcclxuICogRWRnZXMgYXJlIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBib3JkZXIgYmV0d2VlbiB0d28gYWRqYWNlbnRcclxuICogcG9seWdvbnMuXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAcGFyYW0ge1BvaW50fSBwMSAtIFRoZSBmaXJzdCBwb2ludCBvZiB0aGUgZWRnZS5cclxuICogQHBhcmFtIHtQb2ludH0gcDIgLSBUaGUgc2Vjb25kIHBvaW50IG9mIHRoZSBlZGdlLlxyXG4gKi9cclxuRWRnZSA9IGZ1bmN0aW9uKHAxLCBwMikge1xyXG4gIHRoaXMucDEgPSBwMTtcclxuICB0aGlzLnAyID0gcDI7XHJcbiAgdGhpcy5jZW50ZXIgPSBwMS5hZGQocDIuc3ViKHAxKS5kaXYoMikpO1xyXG4gIHRoaXMucG9pbnRzID0gW3RoaXMucDEsIHRoaXMuY2VudGVyLCB0aGlzLnAyXTtcclxufTtcclxuZXhwb3J0cy5FZGdlID0gRWRnZTtcclxuXHJcbkVkZ2UucHJvdG90eXBlLl9DQ1cgPSBmdW5jdGlvbihwMSwgcDIsIHAzKSB7XHJcbiAgYSA9IHAxLng7IGIgPSBwMS55O1xyXG4gIGMgPSBwMi54OyBkID0gcDIueTtcclxuICBlID0gcDMueDsgZiA9IHAzLnk7XHJcbiAgcmV0dXJuIChmIC0gYikgKiAoYyAtIGEpID4gKGQgLSBiKSAqIChlIC0gYSk7XHJcbn07XHJcblxyXG4vKipcclxuICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjcyNTcxNVxyXG4gKiBDaGVja3Mgd2hldGhlciB0aGlzIGVkZ2UgaW50ZXJzZWN0cyB0aGUgcHJvdmlkZWQgZWRnZS5cclxuICogQHBhcmFtIHtFZGdlfSBlZGdlIC0gVGhlIGVkZ2UgdG8gY2hlY2sgaW50ZXJzZWN0aW9uIGZvci5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgZWRnZXMgaW50ZXJzZWN0LlxyXG4gKi9cclxuRWRnZS5wcm90b3R5cGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uKGVkZ2UpIHtcclxuICB2YXIgcTEgPSBlZGdlLnAxLCBxMiA9IGVkZ2UucDI7XHJcbiAgaWYgKHExLmVxKHRoaXMucDEpIHx8IHExLmVxKHRoaXMucDIpIHx8IHEyLmVxKHRoaXMucDEpIHx8IHEyLmVxKHRoaXMucDIpKSByZXR1cm4gZmFsc2U7XHJcbiAgcmV0dXJuICh0aGlzLl9DQ1codGhpcy5wMSwgcTEsIHEyKSAhPSB0aGlzLl9DQ1codGhpcy5wMiwgcTEsIHEyKSkgJiYgKHRoaXMuX0NDVyh0aGlzLnAxLCB0aGlzLnAyLCBxMSkgIT0gdGhpcy5fQ0NXKHRoaXMucDEsIHRoaXMucDIsIHEyKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUG9seWdvbiBjbGFzcy5cclxuICogQ2FuIGJlIGluaXRpYWxpemVkIHdpdGggYW4gYXJyYXkgb2YgcG9pbnRzLlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHBhcmFtIHtBcnJheS48UG9pbnQ+fSBbcG9pbnRzXSAtIFRoZSBwb2ludHMgdG8gdXNlIHRvIGluaXRpYWxpemVcclxuICogICB0aGUgcG9seS5cclxuICovXHJcblBvbHkgPSBmdW5jdGlvbihwb2ludHMpIHtcclxuICBpZiAodHlwZW9mIHBvaW50cyA9PSAndW5kZWZpbmVkJykgcG9pbnRzID0gZmFsc2U7XHJcbiAgdGhpcy5ob2xlID0gZmFsc2U7XHJcbiAgdGhpcy5wb2ludHMgPSBudWxsO1xyXG4gIHRoaXMubnVtcG9pbnRzID0gMDtcclxuICBpZiAocG9pbnRzKSB7XHJcbiAgICB0aGlzLm51bXBvaW50cyA9IHBvaW50cy5sZW5ndGg7XHJcbiAgICB0aGlzLnBvaW50cyA9IHBvaW50cy5zbGljZSgpO1xyXG4gIH1cclxufTtcclxuZXhwb3J0cy5Qb2x5ID0gUG9seTtcclxuXHJcblBvbHkucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihuKSB7XHJcbiAgdGhpcy5wb2ludHMgPSBuZXcgQXJyYXkobik7XHJcbiAgdGhpcy5udW1wb2ludHMgPSBuO1xyXG59O1xyXG5cclxuUG9seS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5udW1wb2ludHMgPSB0aGlzLnBvaW50cy5sZW5ndGg7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS50cmlhbmdsZSA9IGZ1bmN0aW9uKHAxLCBwMiwgcDMpIHtcclxuICB0aGlzLmluaXQoMyk7XHJcbiAgdGhpcy5wb2ludHNbMF0gPSBwMTtcclxuICB0aGlzLnBvaW50c1sxXSA9IHAyO1xyXG4gIHRoaXMucG9pbnRzWzJdID0gcDM7XHJcbn07XHJcblxyXG4vLyBUYWtlcyBhbiBpbmRleCBhbmQgcmV0dXJucyB0aGUgcG9pbnQgYXQgdGhhdCBpbmRleCwgb3IgbnVsbC5cclxuUG9seS5wcm90b3R5cGUuZ2V0UG9pbnQgPSBmdW5jdGlvbihuKSB7XHJcbiAgaWYgKHRoaXMucG9pbnRzICYmIHRoaXMubnVtcG9pbnRzID4gbilcclxuICAgIHJldHVybiB0aGlzLnBvaW50c1tuXTtcclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8vIFNldCBhIHBvaW50LCBmYWlscyBzaWxlbnRseSBvdGhlcndpc2UuIFRPRE86IHJlcGxhY2Ugd2l0aCBicmFja2V0IG5vdGF0aW9uLlxyXG5Qb2x5LnByb3RvdHlwZS5zZXRQb2ludCA9IGZ1bmN0aW9uKGksIHApIHtcclxuICBpZiAodGhpcy5wb2ludHMgJiYgdGhpcy5wb2ludHMubGVuZ3RoID4gaSkge1xyXG4gICAgdGhpcy5wb2ludHNbaV0gPSBwO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEdpdmVuIGFuIGluZGV4IGksIHJldHVybiB0aGUgaW5kZXggb2YgdGhlIG5leHQgcG9pbnQuXHJcblBvbHkucHJvdG90eXBlLmdldE5leHRJID0gZnVuY3Rpb24oaSkge1xyXG4gIHJldHVybiAoaSArIDEpICUgdGhpcy5udW1wb2ludHM7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS5nZXRQcmV2SSA9IGZ1bmN0aW9uKGkpIHtcclxuICBpZiAoaSA9PSAwKVxyXG4gICAgcmV0dXJuICh0aGlzLm51bXBvaW50cyAtIDEpO1xyXG4gIHJldHVybiBpIC0gMTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgdGhlIHNpZ25lZCBhcmVhIG9mIGEgcG9seWdvbiwgaWYgdGhlIHZlcnRpY2VzIGFyZSBnaXZlbiBpblxyXG4vLyBDQ1cgb3JkZXIgdGhlbiB0aGUgYXJlYSB3aWxsIGJlID4gMCwgPCAwIG90aGVyd2lzZS5cclxuUG9seS5wcm90b3R5cGUuZ2V0QXJlYSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBhcmVhID0gMDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtcG9pbnRzOyBpKyspIHtcclxuICAgIHZhciBpMiA9IHRoaXMuZ2V0TmV4dEkoaSk7XHJcbiAgICBhcmVhICs9IHRoaXMucG9pbnRzW2ldLnggKiB0aGlzLnBvaW50c1tpMl0ueSAtIHRoaXMucG9pbnRzW2ldLnkgKiB0aGlzLnBvaW50c1tpMl0ueDtcclxuICB9XHJcbiAgcmV0dXJuIGFyZWE7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS5nZXRPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBhcmVhID0gdGhpcy5nZXRBcmVhKCk7XHJcbiAgaWYgKGFyZWEgPiAwKSByZXR1cm4gXCJDQ1dcIjtcclxuICBpZiAoYXJlYSA8IDApIHJldHVybiBcIkNXXCI7XHJcbiAgcmV0dXJuIDA7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS5zZXRPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKG9yaWVudGF0aW9uKSB7XHJcbiAgdmFyIGN1cnJlbnRfb3JpZW50YXRpb24gPSB0aGlzLmdldE9yaWVudGF0aW9uKCk7XHJcbiAgaWYgKGN1cnJlbnRfb3JpZW50YXRpb24gJiYgKGN1cnJlbnRfb3JpZW50YXRpb24gIT09IG9yaWVudGF0aW9uKSkge1xyXG4gICAgdGhpcy5pbnZlcnQoKTtcclxuICB9XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgbmV3cG9pbnRzID0gbmV3IEFycmF5KHRoaXMubnVtcG9pbnRzKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtcG9pbnRzOyBpKyspIHtcclxuICAgIG5ld3BvaW50c1tpXSA9IHRoaXMucG9pbnRzW3RoaXMubnVtcG9pbnRzIC0gaSAtIDFdO1xyXG4gIH1cclxuICB0aGlzLnBvaW50cyA9IG5ld3BvaW50cztcclxufTtcclxuXHJcblBvbHkucHJvdG90eXBlLmdldENlbnRlciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciB4ID0gdGhpcy5wb2ludHMubWFwKGZ1bmN0aW9uKHApIHsgcmV0dXJuIHAueCB9KTtcclxuICB2YXIgeSA9IHRoaXMucG9pbnRzLm1hcChmdW5jdGlvbihwKSB7IHJldHVybiBwLnkgfSk7XHJcbiAgdmFyIG1pblggPSBNYXRoLm1pbi5hcHBseShudWxsLCB4KTtcclxuICB2YXIgbWF4WCA9IE1hdGgubWF4LmFwcGx5KG51bGwsIHgpO1xyXG4gIHZhciBtaW5ZID0gTWF0aC5taW4uYXBwbHkobnVsbCwgeSk7XHJcbiAgdmFyIG1heFkgPSBNYXRoLm1heC5hcHBseShudWxsLCB5KTtcclxuICByZXR1cm4gbmV3IFBvaW50KChtaW5YICsgbWF4WCkvMiwgKG1pblkgKyBtYXhZKS8yKTtcclxufTtcclxuXHJcbi8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjI4MzM0OVxyXG5Qb2x5LnByb3RvdHlwZS5jZW50cm9pZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciB4ID0gMCxcclxuICAgICAgeSA9IDAsXHJcbiAgICAgIGksXHJcbiAgICAgIGosXHJcbiAgICAgIGYsXHJcbiAgICAgIHBvaW50MSxcclxuICAgICAgcG9pbnQyO1xyXG5cclxuICBmb3IgKGkgPSAwLCBqID0gdGhpcy5wb2ludHMubGVuZ3RoIC0gMTsgaSA8IHRoaXMucG9pbnRzLmxlbmd0aDsgaiA9IGksIGkgKz0gMSkge1xyXG4gICAgcG9pbnQxID0gdGhpcy5wb2ludHNbaV07XHJcbiAgICBwb2ludDIgPSB0aGlzLnBvaW50c1tqXTtcclxuICAgIGYgPSBwb2ludDEueCAqIHBvaW50Mi55IC0gcG9pbnQyLnggKiBwb2ludDEueTtcclxuICAgIHggKz0gKHBvaW50MS54ICsgcG9pbnQyLngpICogZjtcclxuICAgIHkgKz0gKHBvaW50MS55ICsgcG9pbnQyLnkpICogZjtcclxuICB9XHJcblxyXG4gIGYgPSB0aGlzLmdldEFyZWEoKSAqIDM7XHJcbiAgeCA9IE1hdGguYWJzKHgpO1xyXG4gIHkgPSBNYXRoLmFicyh5KTtcclxuICByZXR1cm4gbmV3IFBvaW50KHggLyBmLCB5IC8gZik7XHJcbn07XHJcblxyXG5Qb2x5LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBjZW50ZXIgPSB0aGlzLmNlbnRyb2lkKCk7XHJcbiAgcmV0dXJuIFwiXCIgKyBjZW50ZXIueCArIFwiIFwiICsgY2VudGVyLnk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBwb2ludCBpcyBjb250YWluZWQgd2l0aGluIHRoZSBQb2x5Z29uLlxyXG4gKiBBZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODcyMTQ4M1xyXG4gKlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwIC0gVGhlIHBvaW50IHRvIGNoZWNrLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZSBwb2ludCBpcyBjb250YWluZWQgd2l0aGluXHJcbiAqICAgdGhlIHBvbHlnb24uXHJcbiAqL1xyXG5Qb2x5LnByb3RvdHlwZS5jb250YWluc1BvaW50ID0gZnVuY3Rpb24ocCkge1xyXG4gIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICBmb3IgKHZhciBpID0gMCwgaiA9IHRoaXMubnVtcG9pbnRzIC0gMTsgaSA8IHRoaXMubnVtcG9pbnRzOyBqID0gaSsrKSB7XHJcbiAgICB2YXIgcDEgPSB0aGlzLnBvaW50c1tqXSwgcDIgPSB0aGlzLnBvaW50c1tpXTtcclxuICAgIGlmICgocDIueSA+IHAueSkgIT0gKHAxLnkgPiBwLnkpICYmXHJcbiAgICAgICAgKHAueCA8IChwMS54IC0gcDIueCkgKiAocC55IC0gcDIueSkgLyAocDEueSAtIHAyLnkpICsgcDIueCkpIHtcclxuICAgICAgcmVzdWx0ID0gIXJlc3VsdDtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9uZSB0aGUgZ2l2ZW4gcG9seWdvbiBpbnRvIGEgbmV3IHBvbHlnb24uXHJcbiAqIEByZXR1cm4ge1BvbHl9IC0gQSBjbG9uZSBvZiB0aGUgcG9seWdvbi5cclxuICovXHJcblBvbHkucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2x5KHRoaXMucG9pbnRzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKHBvaW50KSB7XHJcbiAgICByZXR1cm4gcG9pbnQuY2xvbmUoKTtcclxuICB9KSk7XHJcbn07XHJcblxyXG4vKipcclxuICogVHJhbnNsYXRlIGEgcG9seWdvbiBhbG9uZyBhIGdpdmVuIHZlY3Rvci5cclxuICogQHBhcmFtIHtQb2ludH0gdmVjIC0gVGhlIHZlY3RvciBhbG9uZyB3aGljaCB0byB0cmFuc2xhdGUgdGhlXHJcbiAqICAgcG9seWdvbi5cclxuICogQHJldHVybiB7UG9seX0gLSBUaGUgdHJhbnNsYXRlZCBwb2x5Z29uLlxyXG4gKi9cclxuUG9seS5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24odmVjKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2x5KHRoaXMucG9pbnRzLm1hcChmdW5jdGlvbihwb2ludCkge1xyXG4gICAgcmV0dXJuIHBvaW50LmFkZCh2ZWMpO1xyXG4gIH0pKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGVkZ2VzIHJlcHJlc2VudGluZyB0aGUgcG9seWdvbi5cclxuICogQHJldHVybiB7QXJyYXkuPEVkZ2U+fSAtIFRoZSBlZGdlcyBvZiB0aGUgcG9seWdvbi5cclxuICovXHJcblBvbHkucHJvdG90eXBlLmVkZ2VzID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KFwiY2FjaGVkX2VkZ2VzXCIpKSB7XHJcbiAgICB0aGlzLmNhY2hlZF9lZGdlcyA9IHRoaXMucG9pbnRzLm1hcChmdW5jdGlvbihwb2ludCwgaSkge1xyXG4gICAgICByZXR1cm4gbmV3IEVkZ2UocG9pbnQsIHRoaXMucG9pbnRzW3RoaXMuZ2V0TmV4dEkoaSldKTtcclxuICAgIH0sIHRoaXMpO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5jYWNoZWRfZWRnZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogTmFpdmUgY2hlY2sgaWYgb3RoZXIgcG9seSBpbnRlcnNlY3RzIHRoaXMgb25lLCBhc3N1bWluZyBib3RoIGNvbnZleC5cclxuICogQHBhcmFtIHtQb2x5fSBwb2x5XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciB0aGUgcG9seWdvbnMgaW50ZXJzZWN0LlxyXG4gKi9cclxuUG9seS5wcm90b3R5cGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uKHBvbHkpIHtcclxuICB2YXIgaW5zaWRlID0gcG9seS5wb2ludHMuc29tZShmdW5jdGlvbihwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluc1BvaW50KHApO1xyXG4gIH0sIHRoaXMpO1xyXG4gIGluc2lkZSA9IGluc2lkZSB8fCB0aGlzLnBvaW50cy5zb21lKGZ1bmN0aW9uKHApIHtcclxuICAgIHJldHVybiBwb2x5LmNvbnRhaW5zUG9pbnQocCk7XHJcbiAgfSk7XHJcbiAgaWYgKGluc2lkZSkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBvd25FZGdlcyA9IHRoaXMuZWRnZXMoKTtcclxuICAgIHZhciBvdGhlckVkZ2VzID0gcG9seS5lZGdlcygpO1xyXG4gICAgdmFyIGludGVyc2VjdCA9IG93bkVkZ2VzLnNvbWUoZnVuY3Rpb24ob3duRWRnZSkge1xyXG4gICAgICByZXR1cm4gb3RoZXJFZGdlcy5zb21lKGZ1bmN0aW9uKG90aGVyRWRnZSkge1xyXG4gICAgICAgIHJldHVybiBvd25FZGdlLmludGVyc2VjdHMob3RoZXJFZGdlKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBpbnRlcnNlY3Q7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIHV0aWwgPSB7fTtcclxuZXhwb3J0cy51dGlsID0gdXRpbDtcclxuXHJcbi8qKlxyXG4gKiBHaXZlbiBhbiBhcnJheSBvZiBwb2x5Z29ucywgcmV0dXJucyB0aGUgb25lIHRoYXQgY29udGFpbnMgdGhlIHBvaW50LlxyXG4gKiBJZiBubyBwb2x5Z29uIGlzIGZvdW5kLCBudWxsIGlzIHJldHVybmVkLlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwIC0gVGhlIHBvaW50IHRvIGZpbmQgdGhlIHBvbHlnb24gZm9yLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gcG9seXMgLSBUaGUgcG9seWdvbnMgdG8gc2VhcmNoIGZvciB0aGUgcG9pbnQuXHJcbiAqIEByZXR1cm4gez9Qb2x5Z29ufSAtIFRoZSBwb2x5Z29uIGNvbnRhaW5pbmcgdGhlIHBvaW50LlxyXG4gKi9cclxudXRpbC5maW5kUG9seUZvclBvaW50ID0gZnVuY3Rpb24ocCwgcG9seXMpIHtcclxuICB2YXIgaSwgcG9seTtcclxuICBmb3IgKGkgaW4gcG9seXMpIHtcclxuICAgIHBvbHkgPSBwb2x5c1tpXTtcclxuICAgIGlmIChwb2x5LmNvbnRhaW5zUG9pbnQocCkpIHtcclxuICAgICAgcmV0dXJuIHBvbHk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhvbGRzIHRoZSBwcm9wZXJ0aWVzIG9mIGEgY29sbGlzaW9uLCBpZiBvbmUgb2NjdXJyZWQuXHJcbiAqIEB0eXBlZGVmIENvbGxpc2lvblxyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGNvbGxpZGVzIC0gV2hldGhlciB0aGVyZSBpcyBhIGNvbGxpc2lvbi5cclxuICogQHByb3BlcnR5IHtib29sZWFufSBpbnNpZGUgLSBXaGV0aGVyIG9uZSBvYmplY3QgaXMgaW5zaWRlIHRoZSBvdGhlci5cclxuICogQHByb3BlcnR5IHs/UG9pbnR9IHBvaW50IC0gVGhlIHBvaW50IG9mIGNvbGxpc2lvbiwgaWYgY29sbGlzaW9uXHJcbiAqICAgb2NjdXJzLCBhbmQgaWYgYGluc2lkZWAgaXMgZmFsc2UuXHJcbiAqIEBwcm9wZXJ0eSB7P1BvaW50fSBub3JtYWwgLSBBIHVuaXQgdmVjdG9yIG5vcm1hbCB0byB0aGUgcG9pbnRcclxuICogICBvZiBjb2xsaXNpb24sIGlmIGl0IG9jY3VycyBhbmQgaWYgYGluc2lkZWAgaXMgZmFsc2UuXHJcbiAqL1xyXG4vKipcclxuICogSWYgdGhlIHJheSBpbnRlcnNlY3RzIHRoZSBjaXJjbGUsIHRoZSBkaXN0YW5jZSB0byB0aGUgaW50ZXJzZWN0aW9uXHJcbiAqIGFsb25nIHRoZSByYXkgaXMgcmV0dXJuZWQsIG90aGVyd2lzZSBmYWxzZSBpcyByZXR1cm5lZC5cclxuICogQHBhcmFtIHtQb2ludH0gcCAtIFRoZSBzdGFydCBvZiB0aGUgcmF5LlxyXG4gKiBAcGFyYW0ge1BvaW50fSByYXkgLSBVbml0IHZlY3RvciBleHRlbmRpbmcgZnJvbSBgcGAuXHJcbiAqIEBwYXJhbSB7UG9pbnR9IGMgLSBUaGUgY2VudGVyIG9mIHRoZSBjaXJjbGUgZm9yIHRoZSBvYmplY3QgYmVpbmdcclxuICogICBjaGVja2VkIGZvciBpbnRlcnNlY3Rpb24uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjbGUuXHJcbiAqIEByZXR1cm4ge0NvbGxpc2lvbn0gLSBUaGUgY29sbGlzaW9uIGluZm9ybWF0aW9uLlxyXG4gKi9cclxudXRpbC5saW5lQ2lyY2xlSW50ZXJzZWN0aW9uID0gZnVuY3Rpb24ocCwgcmF5LCBjLCByYWRpdXMpIHtcclxuICB2YXIgY29sbGlzaW9uID0ge1xyXG4gICAgY29sbGlkZXM6IGZhbHNlLFxyXG4gICAgaW5zaWRlOiBmYWxzZSxcclxuICAgIHBvaW50OiBudWxsLFxyXG4gICAgbm9ybWFsOiBudWxsXHJcbiAgfTtcclxuICB2YXIgdnBjID0gYy5zdWIocCk7XHJcblxyXG4gIGlmICh2cGMubGVuKCkgPD0gcmFkaXVzKSB7XHJcbiAgICAvLyBQb2ludCBpcyBpbnNpZGUgb2JzdGFjbGUuXHJcbiAgICBjb2xsaXNpb24uY29sbGlkZXMgPSB0cnVlO1xyXG4gICAgY29sbGlzaW9uLmluc2lkZSA9ICh2cGMubGVuKCkgIT09IHJhZGl1cyk7XHJcbiAgfSBlbHNlIGlmIChyYXkuZG90KHZwYykgPj0gMCkge1xyXG4gICAgLy8gQ2lyY2xlIGlzIGFoZWFkIG9mIHBvaW50LlxyXG4gICAgLy8gUHJvamVjdGlvbiBvZiBjZW50ZXIgcG9pbnQgb250byByYXkuXHJcbiAgICB2YXIgcGMgPSBwLmFkZChyYXkubXVsKHJheS5kb3QodnBjKSkpO1xyXG4gICAgLy8gTGVuZ3RoIGZyb20gYyB0byBpdHMgcHJvamVjdGlvbiBvbiB0aGUgcmF5LlxyXG4gICAgdmFyIGxlbl9jX3BjID0gYy5zdWIocGMpLmxlbigpO1xyXG5cclxuICAgIGlmIChsZW5fY19wYyA8PSByYWRpdXMpIHtcclxuICAgICAgY29sbGlzaW9uLmNvbGxpZGVzID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIERpc3RhbmNlIGZyb20gcHJvamVjdGVkIHBvaW50IHRvIGludGVyc2VjdGlvbi5cclxuICAgICAgdmFyIGxlbl9pbnRlcnNlY3Rpb24gPSBNYXRoLnNxcnQobGVuX2NfcGMgKiBsZW5fY19wYyArIHJhZGl1cyAqIHJhZGl1cyk7XHJcbiAgICAgIGNvbGxpc2lvbi5wb2ludCA9IHBjLnN1YihyYXkubXVsKGxlbl9pbnRlcnNlY3Rpb24pKTtcclxuICAgICAgY29sbGlzaW9uLm5vcm1hbCA9IGNvbGxpc2lvbi5wb2ludC5zdWIoYykubm9ybWFsaXplKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBjb2xsaXNpb247XHJcbn07XHJcbiIsInZhciBwYXJ0aXRpb24gPSByZXF1aXJlKCcuL3BhcnRpdGlvbicpO1xyXG52YXIgZ2VvID0gcmVxdWlyZSgnLi9nZW9tZXRyeScpO1xyXG52YXIgUG9pbnQgPSBnZW8uUG9pbnQ7XHJcbnZhciBQb2x5ID0gZ2VvLlBvbHk7XHJcbnZhciBFZGdlID0gZ2VvLkVkZ2U7XHJcblxyXG52YXIgTWFwUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZS1tYXAnKTtcclxudmFyIFBhdGhmaW5kZXIgPSByZXF1aXJlKCcuL3BhdGhmaW5kZXInKTtcclxudmFyIHdvcmtlclByb21pc2UgPSByZXF1aXJlKCcuL3dvcmtlcicpO1xyXG5cclxucmVxdWlyZSgnbWF0aC1yb3VuZCcpO1xyXG52YXIgQ2xpcHBlckxpYiA9IHJlcXVpcmUoJ2pzY2xpcHBlcicpO1xyXG5cclxuLyoqXHJcbiAqIEEgTmF2TWVzaCByZXByZXNlbnRzIHRoZSB0cmF2ZXJzYWJsZSBhcmVhIG9mIGEgbWFwIGFuZCBnaXZlc1xyXG4gKiB1dGlsaXRpZXMgZm9yIHBhdGhmaW5kaW5nLlxyXG4gKiBVc2FnZTpcclxuICogYGBgamF2YXNjcmlwdFxyXG4gKiAvLyBBc3N1bWluZyB0aGUgMmQgbWFwIHRpbGVzIGFycmF5IGlzIGF2YWlsYWJsZTpcclxuICogdmFyIG5hdm1lc2ggPSBuZXcgTmF2TWVzaChtYXApO1xyXG4gKiBuYXZtZXNoLmNhbGN1bGF0ZVBhdGgoY3VycmVudGxvY2F0aW9uLCB0YXJnZXRMb2NhdGlvbiwgY2FsbGJhY2spO1xyXG4gKiBgYGBcclxuICogQG1vZHVsZSBOYXZNZXNoXHJcbiAqLyAgXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQGFsaWFzIG1vZHVsZTpOYXZNZXNoXHJcbiAqIEBwYXJhbSB7TWFwVGlsZXN9IG1hcCAtIFRoZSAyZCBhcnJheSBkZWZpbmluZyB0aGUgbWFwIHRpbGVzLlxyXG4gKiBAcGFyYW0ge0xvZ2dlcn0gW2xvZ2dlcl0gLSBUaGUgbG9nZ2VyIHRvIHVzZS5cclxuICovXHJcbnZhciBOYXZNZXNoID0gZnVuY3Rpb24obWFwLCBsb2dnZXIpIHtcclxuICBpZiAodHlwZW9mIGxvZ2dlciA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgbG9nZ2VyID0ge307XHJcbiAgICBsb2dnZXIubG9nID0gZnVuY3Rpb24oKSB7fTtcclxuICB9XHJcbiAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcblxyXG4gIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuXHJcbiAgdGhpcy51cGRhdGVGdW5jcyA9IFtdO1xyXG5cclxuICB0aGlzLl9zZXR1cFdvcmtlcigpO1xyXG4gIFxyXG4gIC8vIFBhcnNlIG1hcCB0aWxlcyBpbnRvIHBvbHlnb25zLlxyXG4gIHZhciBwb2x5cyA9IE1hcFBhcnNlci5wYXJzZShtYXApO1xyXG4gIGlmICghcG9seXMpIHtcclxuICAgIHRocm93IFwiTWFwIHBhcnNpbmcgZmFpbGVkIVwiO1xyXG4gIH1cclxuXHJcbiAgLy8gVHJhY2sgbWFwIHN0YXRlLlxyXG4gIHRoaXMubWFwID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShtYXApKTtcclxuXHJcbiAgLy8gSW5pdGlhbGl6ZSBuYXZtZXNoLlxyXG4gIHRoaXMuX2luaXQocG9seXMpO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IE5hdk1lc2g7XHJcblxyXG4vKipcclxuICogQ2FsbGJhY2sgZm9yIHBhdGggY2FsY3VsYXRpb24gcmVxdWVzdHMuXHJcbiAqIEBjYWxsYmFjayBQYXRoQ2FsbGJhY2tcclxuICogQHBhcmFtIHs/QXJyYXkuPFBvaW50TGlrZT59IC0gVGhlIGNhbGN1bGF0ZWQgcGF0aCBiZWdpbm5pbmcgd2l0aFxyXG4gKiAgIHRoZSBzdGFydCBwb2ludCwgYW5kIGVuZGluZyBhdCB0aGUgdGFyZ2V0IHBvaW50LiBJZiBubyBwYXRoIGlzXHJcbiAqICAgZm91bmQgdGhlbiBudWxsIGlzIHBhc3NlZCB0byB0aGUgY2FsbGJhY2suXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIENhbGN1bGF0ZSBhIHBhdGggZnJvbSB0aGUgc291cmNlIHBvaW50IHRvIHRoZSB0YXJnZXQgcG9pbnQsIGludm9raW5nXHJcbiAqIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBwYXRoIGFmdGVyIGNhbGN1bGF0aW9uLlxyXG4gKiBAcGFyYW0ge1BvaW50TGlrZX0gc291cmNlIC0gVGhlIHN0YXJ0IGxvY2F0aW9uIG9mIHRoZSBzZWFyY2guXHJcbiAqIEBwYXJhbSB7UG9pbnRMaWtlfSB0YXJnZXQgLSBUaGUgdGFyZ2V0IG9mIHRoZSBzZWFyY2guXHJcbiAqIEBwYXJhbSB7UGF0aENhbGxiYWNrfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiBpbnZva2VkXHJcbiAqICAgd2hlbiB0aGUgcGF0aCBoYXMgYmVlbiBjYWxjdWxhdGVkLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuY2FsY3VsYXRlUGF0aCA9IGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0LCBjYWxsYmFjaykge1xyXG4gIHRoaXMubG9nZ2VyLmxvZyhcIm5hdm1lc2g6ZGVidWdcIiwgXCJDYWxjdWxhdGluZyBwYXRoLlwiKTtcclxuXHJcbiAgLy8gVXNlIHdlYiB3b3JrZXIgaWYgcHJlc2VudC5cclxuICBpZiAodGhpcy53b3JrZXIgJiYgdGhpcy53b3JrZXJJbml0aWFsaXplZCkge1xyXG4gICAgdGhpcy5sb2dnZXIubG9nKFwibmF2bWVzaDpkZWJ1Z1wiLCBcIlVzaW5nIHdvcmtlciB0byBjYWxjdWxhdGUgcGF0aC5cIik7XHJcbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZShbXCJhU3RhclwiLCBzb3VyY2UsIHRhcmdldF0pO1xyXG4gICAgLy8gU2V0IGNhbGxiYWNrIHNvIGl0IGlzIGFjY2Vzc2libGUgd2hlbiByZXN1bHRzIGFyZSBzZW50IGJhY2suXHJcbiAgICB0aGlzLmxhc3RDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzb3VyY2UgPSBQb2ludC5mcm9tUG9pbnRMaWtlKHNvdXJjZSk7XHJcbiAgICB0YXJnZXQgPSBQb2ludC5mcm9tUG9pbnRMaWtlKHRhcmdldCk7XHJcbiAgICBwYXRoID0gdGhpcy5wYXRoZmluZGVyLmFTdGFyKHNvdXJjZSwgdGFyZ2V0KTtcclxuICAgIGNhbGxiYWNrKHBhdGgpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayB3aGV0aGVyIG9uZSBwb2ludCBpcyB2aXNpYmxlIGZyb20gYW5vdGhlciwgd2l0aG91dCBiZWluZ1xyXG4gKiBibG9ja2VkIGJ5IG9ic3RhY2xlcy5cclxuICogQHBhcmFtIHtQb2ludExpa2V9IHAxIC0gVGhlIGZpcnN0IHBvaW50LlxyXG4gKiBAcGFyYW0ge1BvaW50TGlrZX0gcDIgLSBUaGUgc2Vjb25kIHBvaW50LlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgYHAxYCBpcyB2aXNpYmxlIGZyb20gYHAyYC5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLmNoZWNrVmlzaWJsZSA9IGZ1bmN0aW9uKHAxLCBwMikge1xyXG4gIHZhciBlZGdlID0gbmV3IEVkZ2UoUG9pbnQuZnJvbVBvaW50TGlrZShwMSksIFBvaW50LmZyb21Qb2ludExpa2UocDIpKTtcclxuICB2YXIgYmxvY2tlZCA9IHRoaXMub2JzdGFjbGVfZWRnZXMuc29tZShmdW5jdGlvbihlKSB7cmV0dXJuIGUuaW50ZXJzZWN0cyhlZGdlKTt9KTtcclxuICByZXR1cm4gIWJsb2NrZWQ7XHJcbn07XHJcblxyXG4vKipcclxuICogRW5zdXJlIHRoYXQgcGFzc2VkIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIHdoZW4gdGhlIG5hdm1lc2ggaGFzIGJlZW5cclxuICogZnVsbHkgaW5pdGlhbGl6ZWQuXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgbmF2bWVzaCBpc1xyXG4gKiAgIGluaXRpYWxpemVkLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUub25Jbml0ID0gZnVuY3Rpb24oZm4pIHtcclxuICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xyXG4gICAgZm4oKTtcclxuICB9IGVsc2Uge1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5vbkluaXQoZm4pO1xyXG4gICAgfS5iaW5kKHRoaXMpLCAxMCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIFRpbGVVcGRhdGVcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtpbnRlZ2VyfSB4IC0gVGhlIHggaW5kZXggb2YgdGhlIHRpbGUgdG8gdXBkYXRlIGluIHRoZVxyXG4gKiAgIG9yaWdpbmFsIG1hcCBhcnJheS5cclxuICogQHByb3BlcnR5IHtpbnRlZ2VyfSB5IC0gVGhlIHkgaW5kZXggb2YgdGhlIHRpbGUgdG8gdXBkYXRlIGluIHRoZVxyXG4gKiAgIG9yaWdpbmFsIG1hcCBhcnJheS5cclxuICogQHByb3BlcnR5IHsobnVtYmVyfHN0cmluZyl9IHYgLSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgdGlsZS5cclxuICovXHJcblxyXG4vKipcclxuICogVGFrZXMgYW4gYXJyYXkgb2YgdGlsZXMgYW5kIHVwZGF0ZXMgdGhlIG5hdmlnYXRpb24gbWVzaCB0byByZWZsZWN0XHJcbiAqIHRoZSBuZXdseSB0cmF2ZXJzYWJsZSBhcmVhLiBUaGlzIHNob3VsZCBiZSBzZXQgYXMgYSBsaXN0ZW5lciB0b1xyXG4gKiBgbWFwdXBkYXRlYCBzb2NrZXQgZXZlbnRzLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxUaWxlVXBkYXRlPn0gLSBJbmZvcm1hdGlvbiBvbiB0aGUgdGlsZXMgdXBkYXRlcy5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLm1hcFVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAvLyBDaGVjayB0aGUgcGFzc2VkIHZhbHVlcy5cclxuICB2YXIgZXJyb3IgPSBmYWxzZTtcclxuICAvLyBIb2xkIHVwZGF0ZWQgdGlsZSBsb2NhdGlvbnMuXHJcbiAgdmFyIHVwZGF0ZXMgPSBbXTtcclxuICBkYXRhLmZvckVhY2goZnVuY3Rpb24odXBkYXRlKSB7XHJcbiAgICAvLyBVcGRhdGUgaW50ZXJuYWwgbWFwIHN0YXRlLlxyXG4gICAgdGhpcy5tYXBbdXBkYXRlLnhdW3VwZGF0ZS55XSA9IHVwZGF0ZS52O1xyXG4gICAgaWYgKGVycm9yKSByZXR1cm47XHJcbiAgICB2YXIgdGlsZUlkID0gdXBkYXRlLnY7XHJcbiAgICB2YXIgbG9jSWQgPSBQb2ludC50b1N0cmluZyh1cGRhdGUpO1xyXG4gICAgdmFyIHBhc3NhYmxlID0gdGhpcy5faXNQYXNzYWJsZSh0aWxlSWQpO1xyXG4gICAgdmFyIGN1cnJlbnRMb2NTdGF0ZSA9IHRoaXMub2JzdGFjbGVfc3RhdGVbbG9jSWRdO1xyXG4gICAgLy8gQWxsIGR5bmFtaWMgdGlsZSBsb2NhdGlvbnMgc2hvdWxkIGJlIGRlZmluZWQuXHJcbiAgICBpZiAodHlwZW9mIGN1cnJlbnRMb2NTdGF0ZSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBlcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubG9nZ2VyLmxvZyhcIm5hdm1lc2g6ZXJyb3JcIixcclxuICAgICAgICBcIkR5bmFtaWMgb2JzdGFjbGUgZm91bmQgYnV0IG5vdCBhbHJlYWR5IGluaXRpYWxpemVkLlwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHBhc3NhYmxlID09IGN1cnJlbnRMb2NTdGF0ZSkge1xyXG4gICAgICAgIC8vIE5vdGhpbmcgdG8gZG8gaGVyZS5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vYnN0YWNsZV9zdGF0ZVtsb2NJZF0gPSBwYXNzYWJsZTtcclxuICAgICAgICAvLyBUcmFjayB3aGV0aGVyIHVwZGF0ZSBpcyBtYWtpbmcgdGhlIHRpbGVzIHBhc3NhYmxlIG9yXHJcbiAgICAgICAgLy8gaW1wYXNzYWJsZS5cclxuICAgICAgICB1cGRhdGUucGFzc2FibGUgPSBwYXNzYWJsZTtcclxuICAgICAgICB1cGRhdGVzLnB1c2godXBkYXRlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIHRoaXMpO1xyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIENoZWNrIHRoYXQgd2UgaGF2ZSB1cGRhdGVzIHRvIGNhcnJ5IG91dC5cclxuICBpZiAodXBkYXRlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAvLyBTZWUgd2hldGhlciB0aGlzIGlzIGFuIHVwZGF0ZSBmcm9tIHBhc3NhYmxlIHRvIGltcGFzc2FibGVcclxuICAgIC8vIG9yIHZpY2UtdmVyc2EuXHJcbiAgICB2YXIgcGFzc2FibGUgPSB1cGRhdGVzWzBdLnBhc3NhYmxlO1xyXG5cclxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZXkgYWxsIGhhdmUgdGhlIHNhbWUgdXBkYXRlIHR5cGUuXHJcbiAgICB1cGRhdGVzLmZvckVhY2goZnVuY3Rpb24odXBkYXRlKSB7XHJcbiAgICAgIGlmICh1cGRhdGUucGFzc2FibGUgIT09IHBhc3NhYmxlKSB7XHJcbiAgICAgICAgZXJyb3IgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9LCB0aGlzKTtcclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICB0aGlzLmxvZ2dlci5sb2coXCJuYXZtZXNoOmVycm9yXCIsXHJcbiAgICAgICAgXCJOb3QgYWxsIHVwZGF0ZXMgb2Ygc2FtZSB0eXBlLlwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gUGFzc2FibGUvaW1wYXNzYWJsZS1zcGVjaWZpYyB1cGRhdGUgZnVuY3Rpb25zLlxyXG4gICAgaWYgKHBhc3NhYmxlKSB7XHJcbiAgICAgIHRoaXMuX3Bhc3NhYmxlVXBkYXRlKHVwZGF0ZXMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5faW1wYXNzYWJsZVVwZGF0ZSh1cGRhdGVzKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHVwIHRoZSBuYXZtZXNoIHRvIGxpc3RlbiB0byB0aGUgcmVsZXZhbnQgc29ja2V0LlxyXG4gKiBAcGFyYW0gIHtTb2NrZXR9IHNvY2tldCAtIFRoZSBzb2NrZXQgdG8gbGlzdGVuIG9uIGZvciBgbWFwdXBkYXRlYFxyXG4gKiAgIHBhY2tldHMuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5saXN0ZW4gPSBmdW5jdGlvbihzb2NrZXQpIHtcclxuICBzb2NrZXQub24oXCJtYXB1cGRhdGVcIiwgdGhpcy5tYXBVcGRhdGUuYmluZCh0aGlzKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgbmF2aWdhdGlvbiBtZXNoIHVwZGF0ZXMuXHJcbiAqIEBjYWxsYmFjayBVcGRhdGVDYWxsYmFja1xyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gLSBUaGUgcG9seXMgZGVmaW5pbmcgdGhlIGN1cnJlbnQgbmF2aWdhdGlvblxyXG4gKiAgIG1lc2guXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFBvbHk+fSAtIFRoZSBwb2x5cyB0aGF0IHdlcmUgYWRkZWQgdG8gdGhlIG1lc2guXHJcbiAqIEBwYXJhbSB7QXJyYXkuPGludGVnZXI+fSAtIFRoZSBpbmRpY2VzIG9mIHRoZSBwb2x5cyB0aGF0IHdlcmVcclxuICogICByZW1vdmVkIGZyb20gdGhlIG1lc2guXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIG5hdmlnYXRpb24gbWVzaCB1cGRhdGVzLlxyXG4gKiBAcGFyYW0ge1VwZGF0ZUNhbGxiYWNrfSBmbiAtIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5vblVwZGF0ZSA9IGZ1bmN0aW9uKGZuKSB7XHJcbiAgdGhpcy51cGRhdGVGdW5jcy5wdXNoKGZuKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgc3BlY2lmaWMgdGlsZSBpZGVudGlmaWVycyBhcyBpbXBhc3NhYmxlIHRvIHRoZSBhZ2VudC5cclxuICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gaWRzIC0gVGhlIHRpbGUgaWRzIHRvIHNldCBhcyBpbXBhc3NhYmxlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JzdGFjbGUgLSBUaGUgaWRlbnRpZmllciBmb3IgdGhlIHBvbHlnb24gZm9yIHRoZVxyXG4gKiAgIG9ic3RhY2xlcyAoYWxyZWFkeSBwYXNzZWQgdG8gYWRkT2JzdGFjbGVQb2x5KS5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLnNldEltcGFzc2FibGUgPSBmdW5jdGlvbihpZHMpIHtcclxuICAvLyBSZW1vdmUgaWRzIGFscmVhZHkgc2V0IGFzIGltcGFzc2FibGUuXHJcbiAgaWRzID0gaWRzLmZpbHRlcihmdW5jdGlvbihpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzUGFzc2FibGUoaWQpO1xyXG4gIH0sIHRoaXMpO1xyXG4gIHRoaXMubG9nZ2VyLmxvZyhcIm5hdm1lc2g6ZGVidWdcIiwgXCJJZHMgcGFzc2VkOlwiLCBpZHMpO1xyXG5cclxuICB2YXIgdXBkYXRlcyA9IFtdO1xyXG4gIC8vIENoZWNrIGlmIGFueSBvZiB0aGUgZHluYW1pYyB0aWxlcyBoYXZlIHRoZSB2YWx1ZXMgcGFzc2VkLlxyXG4gIHRoaXMuZHluYW1pY19vYnN0YWNsZV9sb2NhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihsb2MpIHtcclxuICAgIHZhciBpZHggPSBpZHMuaW5kZXhPZih0aGlzLm1hcFtsb2MueF1bbG9jLnldKTtcclxuICAgIGlmIChpZHggIT09IC0xKSB7XHJcbiAgICAgIHVwZGF0ZXMucHVzaCh7XHJcbiAgICAgICAgeDogbG9jLngsXHJcbiAgICAgICAgeTogbG9jLnksXHJcbiAgICAgICAgdjogaWRzW2lkeF1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSwgdGhpcyk7XHJcblxyXG4gIC8vIEFkZCB0byBsaXN0IG9mIGltcGFzc2FibGUgdGlsZXMuXHJcbiAgaWRzLmZvckVhY2goZnVuY3Rpb24oaWQpIHtcclxuICAgIHRoaXMuaW1wYXNzYWJsZVtpZF0gPSB0cnVlO1xyXG4gIH0sIHRoaXMpO1xyXG5cclxuICBpZiAodXBkYXRlcy5sZW5ndGggPiAwKSB7XHJcbiAgICB0aGlzLm1hcFVwZGF0ZSh1cGRhdGVzKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRpbGUgaWRlbnRpZmllcnMgZnJvbSBzZXQgb2YgaW1wYXNzYWJsZSB0aWxlIHR5cGVzLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBpZHMgLSBUaGUgdGlsZSBpZHMgdG8gc2V0IGFzIHRyYXZlcnNhYmxlLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUucmVtb3ZlSW1wYXNzYWJsZSA9IGZ1bmN0aW9uKGlkcykge1xyXG4gIC8vIFJlbW92ZSBpZHMgbm90IHNldCBhcyBpbXBhc3NhYmxlLlxyXG4gIGlkcyA9IGlkcy5maWx0ZXIoZnVuY3Rpb24oaWQpIHtcclxuICAgIHJldHVybiAhdGhpcy5faXNQYXNzYWJsZShpZCk7XHJcbiAgfSwgdGhpcyk7XHJcblxyXG4gIHZhciB1cGRhdGVzID0gW107XHJcbiAgLy8gQ2hlY2sgaWYgYW55IG9mIHRoZSBkeW5hbWljIHRpbGVzIGhhdmUgdGhlIHZhbHVlcyBwYXNzZWQuXHJcbiAgdGhpcy5keW5hbWljX29ic3RhY2xlX2xvY2F0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGxvYykge1xyXG4gICAgdmFyIGlkeCA9IGlkcy5pbmRleE9mKHRoaXMubWFwW2xvYy54XVtsb2MueV0pO1xyXG4gICAgaWYgKGlkeCAhPT0gLTEpIHtcclxuICAgICAgdXBkYXRlcy5wdXNoKHtcclxuICAgICAgICB4OiBsb2MueCxcclxuICAgICAgICB5OiBsb2MueSxcclxuICAgICAgICB2OiBpZHNbaWR4XVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LCB0aGlzKTtcclxuXHJcbiAgLy8gUmVtb3ZlIGZyb20gbGlzdCBvZiBpbXBhc3NhYmxlIHRpbGVzLlxyXG4gIGlkcy5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XHJcbiAgICB0aGlzLmltcGFzc2FibGVbaWRdID0gZmFsc2U7XHJcbiAgfSwgdGhpcyk7XHJcblxyXG4gIGlmICh1cGRhdGVzLmxlbmd0aCA+IDApIHtcclxuICAgIHRoaXMubWFwVXBkYXRlKHVwZGF0ZXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIHRoZSBuYXZpZ2F0aW9uIG1lc2ggd2l0aCB0aGUgcG9seWdvbnMgZGVzY3JpYmluZyB0aGVcclxuICogbWFwIGVsZW1lbnRzLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge1BhcnNlZE1hcH0gLSBUaGUgbWFwIGluZm9ybWF0aW9uIHBhcnNlZCBpbnRvIHBvbHlnb25zLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbihwYXJzZWRNYXApIHtcclxuICAvLyBTYXZlIG9yaWdpbmFsIHBhcnNlZCBtYXAgcG9seXMuXHJcbiAgdGhpcy5wYXJzZWRNYXAgPSBwYXJzZWRNYXA7XHJcblxyXG4gIC8vIFN0YXRpYyBvYmplY3RzIHJlbGF0aXZlIHRvIHRoZSBuYXZtZXNoLlxyXG4gIHZhciBuYXZpZ2F0aW9uX3N0YXRpY19vYmplY3RzID0ge1xyXG4gICAgd2FsbHM6IHBhcnNlZE1hcC53YWxscyxcclxuICAgIG9ic3RhY2xlczogcGFyc2VkTWFwLnN0YXRpY19vYnN0YWNsZXNcclxuICB9XHJcbiAgdmFyIG5hdmlnYXRpb25fZHluYW1pY19vYmplY3RzID0gcGFyc2VkTWFwLmR5bmFtaWNfb2JzdGFjbGVzO1xyXG5cclxuICAvLyBPZmZzZXQgcG9seXMgZnJvbSBzaWRlIHNvIHRoZXkgcmVwcmVzZW50IHRyYXZlcnNhYmxlIGFyZWEuXHJcbiAgdmFyIGFyZWFzID0gdGhpcy5fb2Zmc2V0UG9seXMobmF2aWdhdGlvbl9zdGF0aWNfb2JqZWN0cyk7XHJcblxyXG4gIHRoaXMucG9seXMgPSBhcmVhcy5tYXAoTmF2TWVzaC5fZ2VvbWV0cnkucGFydGl0aW9uQXJlYSk7XHJcbiAgdGhpcy5wb2x5cyA9IE5hdk1lc2guX3V0aWwuZmxhdHRlbih0aGlzLnBvbHlzKTtcclxuXHJcbiAgaWYgKCF0aGlzLndvcmtlcikge1xyXG4gICAgdGhpcy5wYXRoZmluZGVyID0gbmV3IFBhdGhmaW5kZXIodGhpcy5wb2x5cyk7XHJcbiAgfVxyXG5cclxuICB0aGlzLl9zZXR1cER5bmFtaWNPYnN0YWNsZXMobmF2aWdhdGlvbl9keW5hbWljX29iamVjdHMpO1xyXG5cclxuICBcclxuICAvLyBIb2xkIHRoZSBlZGdlcyBvZiBzdGF0aWMgb2JzdGFjbGVzLlxyXG4gIHRoaXMuc3RhdGljX29ic3RhY2xlX2VkZ2VzID0gW107XHJcbiAgYXJlYXMuZm9yRWFjaChmdW5jdGlvbihhcmVhKSB7XHJcbiAgICB2YXIgcG9seXMgPSBbYXJlYS5wb2x5Z29uXS5jb25jYXQoYXJlYS5ob2xlcyk7XHJcbiAgICBwb2x5cy5mb3JFYWNoKGZ1bmN0aW9uKHBvbHkpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBwb2x5Lm51bXBvaW50cyAtIDE7IGkgPCBwb2x5Lm51bXBvaW50czsgaiA9IGkrKykge1xyXG4gICAgICAgIHRoaXMuc3RhdGljX29ic3RhY2xlX2VkZ2VzLnB1c2gobmV3IEVkZ2UocG9seS5wb2ludHNbal0sIHBvbHkucG9pbnRzW2ldKSk7XHJcbiAgICAgIH1cclxuICAgIH0sIHRoaXMpO1xyXG4gIH0sIHRoaXMpO1xyXG5cclxuICAvLyBIb2xkcyB0aGUgZWRnZXMgb2Ygc3RhdGljIGFuZCBkeW5hbWljIG9ic3RhY2xlcy5cclxuICB0aGlzLm9ic3RhY2xlX2VkZ2VzID0gdGhpcy5zdGF0aWNfb2JzdGFjbGVfZWRnZXMuc2xpY2UoKTtcclxuXHJcbiAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHVwIG1lc2gtZHluYW1pYyBvYnN0YWNsZXMuXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fc2V0dXBEeW5hbWljT2JzdGFjbGVzID0gZnVuY3Rpb24ob2JzdGFjbGVzKSB7XHJcbiAgLy8gSG9sZHMgdGlsZSBpZDwtPmltcGFzc2FibGUgKGJvb2xlYW4pIGFzc29jaWF0aW9ucy5cclxuICB0aGlzLmltcGFzc2FibGUgPSB7fTtcclxuICAvLyBQb2x5Z29ucyBkZWZpbmluZyBvYnN0YWNsZXMuXHJcbiAgdGhpcy5vYnN0YWNsZURlZmluaXRpb25zID0ge307XHJcbiAgLy8gUmVsYXRpb24gYmV0d2VlbiBpZHMgYW5kIG9ic3RhY2xlcy5cclxuICB0aGlzLmlkVG9PYnN0YWNsZXMgPSB7fTtcclxuXHJcbiAgdmFyIGdlbyA9IE5hdk1lc2guX2dlb21ldHJ5O1xyXG5cclxuICAvLyBBZGQgcG9seWdvbnMgZGVzY3JpYmluZyBkeW5hbWljIG9ic3RhY2xlcy5cclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJib21iXCIsIGdlby5nZXRBcHByb3hpbWF0ZUNpcmNsZSgxNSkpO1xyXG4gIHRoaXMuX2FkZE9ic3RhY2xlUG9seShcImJvb3N0XCIsIGdlby5nZXRBcHByb3hpbWF0ZUNpcmNsZSgxNSkpO1xyXG4gIHRoaXMuX2FkZE9ic3RhY2xlUG9seShcInBvcnRhbFwiLCBnZW8uZ2V0QXBwcm94aW1hdGVDaXJjbGUoMTUpKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJzcGlrZVwiLCBnZW8uZ2V0QXBwcm94aW1hdGVDaXJjbGUoMTQpKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJnYXRlXCIsIGdlby5nZXRTcXVhcmUoMjApKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJ0aWxlXCIsIGdlby5nZXRTcXVhcmUoMjApKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJ3YWxsXCIsIGdlby5nZXRTcXVhcmUoMjApKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJzZXdhbGxcIiwgZ2VvLmdldERpYWdvbmFsKDIwLCBcInNlXCIpKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJuZXdhbGxcIiwgZ2VvLmdldERpYWdvbmFsKDIwLCBcIm5lXCIpKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJzd3dhbGxcIiwgZ2VvLmdldERpYWdvbmFsKDIwLCBcInN3XCIpKTtcclxuICB0aGlzLl9hZGRPYnN0YWNsZVBvbHkoXCJud3dhbGxcIiwgZ2VvLmdldERpYWdvbmFsKDIwLCBcIm53XCIpKTtcclxuXHJcbiAgLy8gQWRkIGlkPC0+dHlwZSBhc3NvY2lhdGlvbnMuXHJcbiAgdGhpcy5fc2V0T2JzdGFjbGVUeXBlKFsxMCwgMTAuMV0sIFwiYm9tYlwiKTtcclxuICB0aGlzLl9zZXRPYnN0YWNsZVR5cGUoWzUsIDUuMSwgMTQsIDE0LjEsIDE1LCAxNS4xXSwgXCJib29zdFwiKTtcclxuICB0aGlzLl9zZXRPYnN0YWNsZVR5cGUoWzksIDkuMSwgOS4yLCA5LjNdLCBcImdhdGVcIik7XHJcbiAgdGhpcy5fc2V0T2JzdGFjbGVUeXBlKFsxXSwgXCJ3YWxsXCIpO1xyXG4gIHRoaXMuX3NldE9ic3RhY2xlVHlwZShbMS4xXSwgXCJzd3dhbGxcIik7XHJcbiAgdGhpcy5fc2V0T2JzdGFjbGVUeXBlKFsxLjJdLCBcIm53d2FsbFwiKTtcclxuICB0aGlzLl9zZXRPYnN0YWNsZVR5cGUoWzEuM10sIFwibmV3YWxsXCIpO1xyXG4gIHRoaXMuX3NldE9ic3RhY2xlVHlwZShbMS40XSwgXCJzZXdhbGxcIik7XHJcbiAgdGhpcy5fc2V0T2JzdGFjbGVUeXBlKFs3XSwgXCJzcGlrZVwiKTtcclxuXHJcbiAgLy8gU2V0IHVwIG9ic3RhY2xlIHN0YXRlIGNvbnRhaW5lci4gSG9sZHMgd2hldGhlciBwb3NpdGlvbiBpc1xyXG4gIC8vIHBhc3NhYmxlIG9yIG5vdC4gUmVmZXJlbmNlZCB1c2luZyBhcnJheSBsb2NhdGlvbi5cclxuICB0aGlzLm9ic3RhY2xlX3N0YXRlID0ge307XHJcblxyXG4gIC8vIExvY2F0aW9uIG9mIGR5bmFtaWMgb2JzdGFjbGVzLlxyXG4gIHRoaXMuZHluYW1pY19vYnN0YWNsZV9sb2NhdGlvbnMgPSBbXTtcclxuXHJcbiAgLy8gRWRnZXMgb2Ygb2Zmc2V0dGVkIG9ic3RhY2xlZCwgb3JnYW5pemVkIGJ5IGlkLlxyXG4gIHRoaXMuZHluYW1pY19vYnN0YWNsZV9wb2x5cyA9IHt9O1xyXG5cclxuICAvLyBDb250YWluZXIgdG8gaG9sZCBpbml0aWFsIG9ic3RhY2xlIHN0YXRlcy5cclxuICB2YXIgaW5pdGlhbF9zdGF0ZXMgPSBbXTtcclxuICBvYnN0YWNsZXMuZm9yRWFjaChmdW5jdGlvbihvYnN0YWNsZSkge1xyXG4gICAgdmFyIGlkID0gUG9pbnQudG9TdHJpbmcob2JzdGFjbGUpO1xyXG5cclxuICAgIC8vIEdlbmVyYXRlIG9mZnNldCBvYnN0YWNsZS5cclxuICAgIHZhciBvYnMgPSB0aGlzLl9vZmZzZXREeW5hbWljT2JzKFt0aGlzLl9nZXRUaWxlUG9seShvYnN0YWNsZSldKTtcclxuICAgIHZhciBhcmVhcyA9IE5hdk1lc2guX2dlb21ldHJ5LmdldEFyZWFzKG9icyk7XHJcbiAgICBhcmVhcyA9IGFyZWFzLm1hcChmdW5jdGlvbihhcmVhKSB7XHJcbiAgICAgIGFyZWEuaG9sZXMucHVzaChhcmVhLnBvbHlnb24pO1xyXG4gICAgICByZXR1cm4gYXJlYS5ob2xlcztcclxuICAgIH0pO1xyXG4gICAgYXJlYXMgPSBOYXZNZXNoLl91dGlsLmZsYXR0ZW4oYXJlYXMpO1xyXG4gICAgLy8gR2V0IGVkZ2VzIG9mIG9ic3RhY2xlLlxyXG4gICAgdmFyIGVkZ2VzID0gYXJlYXMubWFwKGZ1bmN0aW9uKHBvbHkpIHtcclxuICAgICAgcmV0dXJuIHBvbHkuZWRnZXMoKTtcclxuICAgIH0pO1xyXG4gICAgZWRnZXMgPSBOYXZNZXNoLl91dGlsLmZsYXR0ZW4oZWRnZXMpO1xyXG4gICAgdGhpcy5keW5hbWljX29ic3RhY2xlX3BvbHlzW2lkXSA9IGVkZ2VzO1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgb2JzdGFjbGUgc3RhdGVzIHRvIGFsbCBiZSBwYXNzYWJsZS5cclxuICAgIHRoaXMub2JzdGFjbGVfc3RhdGVbaWRdID0gdHJ1ZTtcclxuICAgIHRoaXMuZHluYW1pY19vYnN0YWNsZV9sb2NhdGlvbnMucHVzaChQb2ludC5mcm9tUG9pbnRMaWtlKG9ic3RhY2xlKSk7XHJcbiAgICBpbml0aWFsX3N0YXRlcy5wdXNoKG9ic3RhY2xlKTtcclxuICB9LCB0aGlzKTtcclxuXHJcbiAgLy8gU2V0IHVwIGFscmVhZHkta25vd24gZHluYW1pYyBpbXBhc3NhYmxlIHZhbHVlcy5cclxuICB0aGlzLnNldEltcGFzc2FibGUoWzEwLCA1LCA5LjFdKTtcclxuICAvLyBXYWxscyBhbmQgc3Bpa2VzLlxyXG4gIHRoaXMuc2V0SW1wYXNzYWJsZShbMSwgMS4xLCAxLjIsIDEuMywgMS40LCA3XSk7XHJcblxyXG4gIC8vIFNldCB1cCBjYWxsYmFjayB0byByZWdlbmVyYXRlIG9ic3RhY2xlIGVkZ2VzIGZvciB2aXNpYmlsaXR5IGNoZWNraW5nLlxyXG4gIHRoaXMub25VcGRhdGUoZnVuY3Rpb24ocG9seXMpIHtcclxuICAgIHZhciBvYnN0YWNsZV9lZGdlcyA9IFtdO1xyXG4gICAgZm9yIChpZCBpbiB0aGlzLm9ic3RhY2xlX3N0YXRlKSB7XHJcbiAgICAgIGlmICghdGhpcy5vYnN0YWNsZV9zdGF0ZVtpZF0pIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShcclxuICAgICAgICAgIG9ic3RhY2xlX2VkZ2VzLFxyXG4gICAgICAgICAgdGhpcy5keW5hbWljX29ic3RhY2xlX3BvbHlzW2lkXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMub2JzdGFjbGVfZWRnZXMgPSB0aGlzLnN0YXRpY19vYnN0YWNsZV9lZGdlcy5jb25jYXQob2JzdGFjbGVfZWRnZXMpO1xyXG4gIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gIC8vIEluaXRpYWxpemUgbWFwdXBkYXRlIHdpdGggYWxyZWFkeS1wcmVzZW50IGR5bmFtaWMgb2JzdGFjbGVzLlxyXG4gIHRoaXMubWFwVXBkYXRlKGluaXRpYWxfc3RhdGVzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgcG9seSBkZWZpbml0aW9uIGZvciBvYnN0YWNsZSB0eXBlLlxyXG4gKiBlZGdlcyBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY2VudGVyIG9mIHRpbGUuXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fYWRkT2JzdGFjbGVQb2x5ID0gZnVuY3Rpb24obmFtZSwgcG9seSkge1xyXG4gIHRoaXMub2JzdGFjbGVEZWZpbml0aW9uc1tuYW1lXSA9IHBvbHk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0cmlldmUgdGhlIHBvbHlnb24gZm9yIGEgZ2l2ZW4gb2JzdGFjbGUgaWQuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIFRoZSBpZCB0byByZXRyaWV2ZSB0aGUgb2JzdGFjbGUgcG9seWdvbiBmb3IuXHJcbiAqIEByZXR1cm4ge1BvbHl9IC0gVGhlIHBvbHlnb24gcmVwcmVzZW50aW5nIHRoZSBvYnN0YWNsZS5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLl9nZXRPYnN0YWNsZVBvbHkgPSBmdW5jdGlvbihpZCkge1xyXG4gIHZhciBwb2x5ID0gdGhpcy5vYnN0YWNsZURlZmluaXRpb25zW3RoaXMuaWRUb09ic3RhY2xlc1tpZF1dXHJcbiAgaWYgKHBvbHkpIHtcclxuICAgIHJldHVybiBwb2x5LmNsb25lKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMubG9nZ2VyLmxvZyhcIm5hdm1lc2g6ZGVidWdcIiwgXCJObyBwb2x5IGZvdW5kIGZvciBpZDpcIiwgaWQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgdGhlIG5hdmlnYXRpb24gbWVzaCB0byB0aGUgZ2l2ZW4gcG9seXMgYW5kIGNhbGwgdGhlIHVwZGF0ZVxyXG4gKiBmdW5jdGlvbnMuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFBvbHk+fSBwb2x5cyAtIFRoZSBuZXcgcG9seXMgZGVmaW5pbmcgdGhlIG5hdiBtZXNoLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gYWRkZWQgLSBUaGUgcG9seXMgdGhhdCB3ZXJlIGFkZGVkIHRvIHRoZSBtZXNoLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxpbnRlZ2VyPn0gcmVtb3ZlZCAtIFRoZSBpbmRpY2VzIG9mIHRoZSBwb2x5cyB0aGF0IHdlcmVcclxuICogICByZW1vdmVkIGZyb20gdGhlIG1lc2guXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24ocG9seXMsIGFkZGVkLCByZW1vdmVkKSB7XHJcbiAgdGhpcy5wb2x5cyA9IHBvbHlzO1xyXG4gIHRoaXMudXBkYXRlRnVuY3MuZm9yRWFjaChmdW5jdGlvbihmbikge1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgZm4odGhpcy5wb2x5cywgYWRkZWQsIHJlbW92ZWQpO1xyXG4gICAgfS5iaW5kKHRoaXMpLCAwKTtcclxuICB9LCB0aGlzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHNwZWNpZmljIHRpbGUgaWRlbnRpZmllcnMgYW5kIHRoZVxyXG4gKiBwb2x5Z29ucyByZXByZXNlbnRpbmcgdGhlIHNoYXBlIG9mIHRoZSBvYnN0YWNsZSB0aGV5IGNvcnJlc3BvbmRcclxuICogdG8uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGlkcyAtIFRoZSB0aWxlIGlkcyB0byBzZXQgYXMgaW1wYXNzYWJsZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IG9ic3RhY2xlIC0gVGhlIGlkZW50aWZpZXIgZm9yIHRoZSBwb2x5Z29uIGZvciB0aGVcclxuICogICBvYnN0YWNsZXMgKGFscmVhZHkgcGFzc2VkIHRvIGFkZE9ic3RhY2xlUG9seSkuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fc2V0T2JzdGFjbGVUeXBlID0gZnVuY3Rpb24oaWRzLCB0eXBlKSB7XHJcbiAgaWRzLmZvckVhY2goZnVuY3Rpb24oaWQpIHtcclxuICAgIHRoaXMuaWRUb09ic3RhY2xlc1tpZF0gPSB0eXBlO1xyXG4gIH0sIHRoaXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3ZpZGVkIGlkIGNvcnJlc3BvbmRzIHRvIGEgcGFzc2FibGUgdGlsZS5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIHRoZSBpZCBpcyBmb3IgYSBwYXNzYWJsZSB0aWxlLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX2lzUGFzc2FibGUgPSBmdW5jdGlvbihpZCkge1xyXG4gIC8vIENoZWNrIGlmIGluIGxpc3Qgb2YgaW1wYXNzYWJsZSB0aWxlcy5cclxuICByZXR1cm4gIXRoaXMuaW1wYXNzYWJsZS5oYXNPd25Qcm9wZXJ0eShpZCkgfHwgIXRoaXMuaW1wYXNzYWJsZVtpZF07XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGEgcG9seWdvbiBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaW1lbnNpb25zIGFuZCBsb2NhdGlvbiBvZiB0aGVcclxuICogcHJvdmlkZWQgdGlsZSB1cGRhdGUuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7VGlsZVVwZGF0ZX0gdGlsZSAtIFRoZSB0aWxlIHVwZGF0ZSBpbmZvcm1hdGlvbi5cclxuICogQHJldHVybiB7UG9seX0gLSBUaGUgcG9seWdvbiByZXByZXNlbnRpbmcgdGhlIHRpbGUuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fZ2V0VGlsZVBvbHkgPSBmdW5jdGlvbih0aWxlKSB7XHJcbiAgLy8gR2V0IHRoZSBiYXNlIHBvbHkgZnJvbSBhIGxpc3Qgb2Ygc3VjaCB0aGluZ3MgYnkgdGlsZSBpZFxyXG4gIC8vIHRoZW4gdHJhbnNsYXRlIGFjY29yZGluZyB0byB0aGUgYXJyYXkgbG9jYXRpb24uXHJcbiAgdmFyIGlkID0gdGlsZS52O1xyXG4gIHZhciBwID0gdGhpcy5fZ2V0V29ybGRDb29yZCh0aWxlKTtcclxuICB2YXIgcG9seSA9IHRoaXMuX2dldE9ic3RhY2xlUG9seShpZCkudHJhbnNsYXRlKHApO1xyXG4gIHJldHVybiBwb2x5O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgYSBwb2ludCBpbiBzcGFjZSBvciBhIGxvY2F0aW9uIGluIGEgMmQgYXJyYXkuXHJcbiAqIEB0eXBlZGVmIFBvaW50TGlrZVxyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge251bWJlcn0geCAtIFRoZSBgeGAgY29vcmRpbmF0ZSBmb3IgdGhlIHBvaW50LCBvciByb3dcclxuICogICBmb3IgdGhlIGFycmF5IGxvY2F0aW9uLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0geSAtIFRoZSBgeWAgY29vcmRpbmF0ZSBmb3IgdGhlIHBvaW50LiBvciBjb2x1bW5cclxuICogICBmb3IgdGhlIGFycmF5IGxvY2F0aW9uLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBHaXZlbiBhbiBhcnJheSBsb2NhdGlvbiwgcmV0dXJuIHRoZSB3b3JsZCBjb29yZGluYXRlIHJlcHJlc2VudGluZ1xyXG4gKiB0aGUgY2VudGVyIHBvaW50IG9mIHRoZSB0aWxlIGF0IHRoYXQgYXJyYXkgbG9jYXRpb24uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7UG9pbnRMaWtlfSBhcnJheUxvYyAtIFRoZSBsb2NhdGlvbiBpbiB0aGUgbWFwIGZvciB0aGUgcG9pbnQuXHJcbiAqIEByZXR1cm0ge1BvaW50fSAtIFRoZSBjb29yZGluYXRlcyBmb3IgdGhlIGNlbnRlciBvZiB0aGUgbG9jYXRpb24uXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fZ2V0V29ybGRDb29yZCA9IGZ1bmN0aW9uKGFycmF5TG9jKSB7XHJcbiAgdmFyIFRJTEVfV0lEVEggPSA0MDtcclxuICByZXR1cm4gbmV3IFBvaW50KFxyXG4gICAgYXJyYXlMb2MueCAqIFRJTEVfV0lEVEggKyAoVElMRV9XSURUSCAvIDIpLFxyXG4gICAgYXJyYXlMb2MueSAqIFRJTEVfV0lEVEggKyAoVElMRV9XSURUSCAvIDIpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDYXJyeSBvdXQgdGhlIG5hdm1lc2ggdXBkYXRlIGZvciBpbXBhc3NhYmxlIGR5bmFtaWMgb2JzdGFjbGVzIHRoYXRcclxuICogaGF2ZSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgbmF2bWVzaC5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48VGlsZVVwZGF0ZT59IHVwZGF0ZXMgLSBUaGUgdGlsZSB1cGRhdGUgaW5mb3JtYXRpb24uXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fcGFzc2FibGVVcGRhdGUgPSBmdW5jdGlvbih1cGRhdGVzKSB7XHJcbiAgdmFyIHNjYWxlID0gMTAwO1xyXG4gIC8vIEFzc3VtZSBlYWNoIG9mIHRoZSB0aWxlcyBpcyBub3cgYSBzcXVhcmUgb2Ygb3BlbiBzcGFjZS5cclxuICB2YXIgcGFzc2FibGVUaWxlcyA9IHVwZGF0ZXMubWFwKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2dldFRpbGVQb2x5KHtcclxuICAgICAgeDogdXBkYXRlLngsXHJcbiAgICAgIHk6IHVwZGF0ZS55LFxyXG4gICAgICB2OiAxXHJcbiAgICB9KTtcclxuICB9LCB0aGlzKTtcclxuXHJcbiAgLy8gT2Zmc2V0IGFuZCBtZXJnZSBuZXdseSBwYXNzYWJsZSB0aWxlcywgYXNzdW1pbmcgbm8gdGlsZSBhbG9uZ1xyXG4gIC8vIHdpdGggaXRzIG9mZnNldCB3b3VsZCBoYXZlIGJlZW4gbGFyZ2VyIHRoYW4gYSBzaW5nbGUgdGlsZS5cclxuICAvLyBTZXQgb2Zmc2V0IHNsaWdodGx5IGxhcmdlciB0aGF0IG5vcm1hbCBzbyB0aGF0IHdlIGNhdGNoIGFsbFxyXG4gIC8vIHJlbGV2YW50IHBvbHlnb25zIHRoYXQgbmVlZCB0byBiZSB1cGRhdGVkIGluIHRoZSBuYXZtZXNoLlxyXG4gIHZhciBwYXNzYWJsZUFyZWEgPSB0aGlzLl9vZmZzZXREeW5hbWljT2JzKHBhc3NhYmxlVGlsZXMsIDIwKTtcclxuXHJcbiAgdmFyIGNwciA9IE5hdk1lc2guX2dlb21ldHJ5LmNwcjtcclxuXHJcbiAgLy8gR2V0IGltcGFzc2FibGUgdGlsZXMgYm9yZGVyaW5nIHRoZSBub3ctcGFzc2FibGUgYXJlYSBhbmQgb2Zmc2V0IHRoZW0uXHJcbiAgdmFyIGJvcmRlcmluZ1RpbGVzID0gdGhpcy5fZ2V0Qm9yZGVyZWRUaWxlcyh1cGRhdGVzKTtcclxuICB2YXIgYm9yZGVyaW5nUG9seXMgPSBib3JkZXJpbmdUaWxlcy5tYXAodGhpcy5fZ2V0VGlsZVBvbHksIHRoaXMpO1xyXG4gIHZhciBzdXJyb3VuZGluZ0FyZWEgPSB0aGlzLl9vZmZzZXREeW5hbWljT2JzKGJvcmRlcmluZ1BvbHlzKTtcclxuXHJcbiAgLy8gR2V0IGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgb3BlbiBhcmVhIGFuZCB0aGUgc3Vycm91bmRpbmcgb2JzdGFjbGVzLlxyXG4gIGNwci5DbGVhcigpO1xyXG4gIHZhciBhY3R1YWxQYXNzYWJsZUFyZWEgPSBuZXcgQ2xpcHBlckxpYi5QYXRocygpO1xyXG4gIGNwci5BZGRQYXRocyhwYXNzYWJsZUFyZWEsIENsaXBwZXJMaWIuUG9seVR5cGUucHRTdWJqZWN0LCB0cnVlKTtcclxuICBjcHIuQWRkUGF0aHMoc3Vycm91bmRpbmdBcmVhLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0Q2xpcCwgdHJ1ZSk7XHJcbiAgY3ByLkV4ZWN1dGUoQ2xpcHBlckxpYi5DbGlwVHlwZS5jdERpZmZlcmVuY2UsXHJcbiAgICBhY3R1YWxQYXNzYWJsZUFyZWEsXHJcbiAgICBDbGlwcGVyTGliLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVyb1xyXG4gICk7XHJcblxyXG4gIHZhciBwYXNzYWJsZUFyZWFzID0gTmF2TWVzaC5fZ2VvbWV0cnkuZ2V0QXJlYXMoYWN0dWFsUGFzc2FibGVBcmVhLCBzY2FsZSk7XHJcblxyXG4gIHZhciBwYXNzYWJsZVBhcnRpdGlvbiA9IE5hdk1lc2guX2dlb21ldHJ5LnBhcnRpdGlvbkFyZWFzKHBhc3NhYmxlQXJlYXMpO1xyXG5cclxuICAvLyBHZXQgbWVzaCBwb2x5cyBpbnRlcnNlY3RlZCBieSBvZmZzZXR0ZWQgcGFzc2FibGUgYXJlYS5cclxuICB2YXIgaW50ZXJzZWN0aW9uID0gdGhpcy5fZ2V0SW50ZXJzZWN0ZWRQb2x5cyhwYXNzYWJsZVBhcnRpdGlvbik7XHJcbiAgdmFyIGludGVyc2VjdGVkTWVzaFBvbHlzID0gaW50ZXJzZWN0aW9uLnBvbHlzO1xyXG5cclxuICAvLyBDcmVhdGUgb3V0bGluZSB3aXRoIG1hdGNoZWQgbWVzaCBwb2x5cy5cclxuICBpbnRlcnNlY3RlZE1lc2hQb2x5cyA9IGludGVyc2VjdGVkTWVzaFBvbHlzLm1hcChOYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0UG9seVRvQ2xpcHBlcik7XHJcbiAgQ2xpcHBlckxpYi5KUy5TY2FsZVVwUGF0aHMoaW50ZXJzZWN0ZWRNZXNoUG9seXMsIHNjYWxlKTtcclxuXHJcbiAgLy8gTWVyZ2UgaW50ZXJzZWN0ZWQgbWVzaCBwb2x5cyBhbmQgd2l0aCBuZXdseSBwYXNzYWJsZSBhcmVhLlxyXG4gIGNwci5DbGVhcigpO1xyXG4gIGNwci5BZGRQYXRocyhpbnRlcnNlY3RlZE1lc2hQb2x5cywgQ2xpcHBlckxpYi5Qb2x5VHlwZS5wdFN1YmplY3QsIHRydWUpO1xyXG4gIGNwci5BZGRQYXRocyhhY3R1YWxQYXNzYWJsZUFyZWEsIENsaXBwZXJMaWIuUG9seVR5cGUucHRTdWJqZWN0LCB0cnVlKTtcclxuICB2YXIgbmV3TWVzaEFyZWEgPSBuZXcgQ2xpcHBlckxpYi5QYXRocygpO1xyXG4gIGNwci5FeGVjdXRlKFxyXG4gICAgQ2xpcHBlckxpYi5DbGlwVHlwZS5jdFVuaW9uLFxyXG4gICAgbmV3TWVzaEFyZWEsXHJcbiAgICBDbGlwcGVyTGliLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvLFxyXG4gICAgbnVsbCk7XHJcblxyXG4gIC8vIFBhcnRpdGlvbiB0aGUgdW5pb25lZCBtZXNoIHBvbHlzIGFuZCBuZXcgcGFzc2FibGUgYXJlYSBhbmQgYWRkXHJcbiAgLy8gdG8gdGhlIGV4aXN0aW5nIG1lc2ggcG9seXMuXHJcbiAgdmFyIG1lc2hBcmVhcyA9IE5hdk1lc2guX2dlb21ldHJ5LmdldEFyZWFzKG5ld01lc2hBcmVhLCBzY2FsZSk7XHJcbiAgdmFyIG5ld1BvbHlzID0gTmF2TWVzaC5fZ2VvbWV0cnkucGFydGl0aW9uQXJlYXMobWVzaEFyZWFzKTtcclxuICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLnBvbHlzLCBuZXdQb2x5cyk7XHJcblxyXG4gIHRoaXMuX3VwZGF0ZSh0aGlzLnBvbHlzLCBuZXdQb2x5cywgaW50ZXJzZWN0aW9uLmluZGljZXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENhcnJ5IG91dCB0aGUgbmF2bWVzaCB1cGRhdGUgZm9yIGltcGFzc2FibGUgZHluYW1pYyBvYnN0YWNsZXMgdGhhdFxyXG4gKiBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIG5hdm1lc2guXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFRpbGVVcGRhdGU+fSB1cGRhdGVzIC0gVGhlIHRpbGUgdXBkYXRlIGluZm9ybWF0aW9uLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX2ltcGFzc2FibGVVcGRhdGUgPSBmdW5jdGlvbih1cGRhdGVzKSB7XHJcbiAgdmFyIHNjYWxlID0gMTAwO1xyXG4gIC8vIEdldCBwb2x5Z29ucyBkZWZpbmluZyB0aGVzZSBvYnN0YWNsZXMuXHJcbiAgdmFyIG9ic3RhY2xlUG9seXMgPSB1cGRhdGVzLm1hcChmdW5jdGlvbih1cGRhdGUpIHtcclxuICAgIHJldHVybiB0aGlzLl9nZXRUaWxlUG9seSh1cGRhdGUpO1xyXG4gIH0sIHRoaXMpO1xyXG5cclxuICAvLyBPZmZzZXQgdGhlIG9ic3RhY2xlIHBvbHlnb25zLlxyXG4gIHZhciBvZmZzZXR0ZWRPYnN0YWNsZXMgPSB0aGlzLl9vZmZzZXREeW5hbWljT2JzKG9ic3RhY2xlUG9seXMpO1xyXG4gIHZhciBvYnN0YWNsZUFyZWFzID0gTmF2TWVzaC5fZ2VvbWV0cnkuZ2V0QXJlYXMob2Zmc2V0dGVkT2JzdGFjbGVzKTtcclxuXHJcbiAgLy8gR2V0IGNvbnZleCBwYXJ0aXRpb24gb2YgbmV3IG9ic3RhY2xlIGFyZWFzIGZvciBmaW5kaW5nXHJcbiAgLy8gaW50ZXJzZWN0aW9ucy5cclxuICB2YXIgb2JzdGFjbGVQYXJ0aXRpb24gPSBOYXZNZXNoLl9nZW9tZXRyeS5wYXJ0aXRpb25BcmVhcyhvYnN0YWNsZUFyZWFzKTtcclxuXHJcbiAgLy8gR2V0IG1lc2ggcG9seXMgaW50ZXJzZWN0ZWQgYnkgb2Zmc2V0dGVkIG9ic3RhY2xlcy5cclxuICB2YXIgaW50ZXJzZWN0aW9uID0gdGhpcy5fZ2V0SW50ZXJzZWN0ZWRQb2x5cyhvYnN0YWNsZVBhcnRpdGlvbik7XHJcbiAgdmFyIGludGVyc2VjdGVkTWVzaFBvbHlzID0gaW50ZXJzZWN0aW9uLnBvbHlzO1xyXG5cclxuICAvLyBDcmVhdGUgb3V0bGluZSB3aXRoIG1hdGNoZWQgbWVzaCBwb2x5cy5cclxuICBpbnRlcnNlY3RlZE1lc2hQb2x5cyA9IGludGVyc2VjdGVkTWVzaFBvbHlzLm1hcChOYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0UG9seVRvQ2xpcHBlcik7XHJcbiAgQ2xpcHBlckxpYi5KUy5TY2FsZVVwUGF0aHMoaW50ZXJzZWN0ZWRNZXNoUG9seXMsIHNjYWxlKTtcclxuICB2YXIgY3ByID0gTmF2TWVzaC5fZ2VvbWV0cnkuY3ByO1xyXG5cclxuICAvLyBNZXJnZSBtYXRjaGVkIHBvbHlzXHJcbiAgY3ByLkNsZWFyKCk7XHJcbiAgY3ByLkFkZFBhdGhzKGludGVyc2VjdGVkTWVzaFBvbHlzLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgdmFyIG1lcmdlZE1lc2hQb2x5cyA9IG5ldyBDbGlwcGVyTGliLlBhdGhzKCk7XHJcbiAgY3ByLkV4ZWN1dGUoXHJcbiAgICBDbGlwcGVyTGliLkNsaXBUeXBlLmN0VW5pb24sXHJcbiAgICBtZXJnZWRNZXNoUG9seXMsXHJcbiAgICBDbGlwcGVyTGliLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvLFxyXG4gICAgbnVsbCk7XHJcblxyXG4gIC8vIFRha2UgZGlmZmVyZW5jZSBvZiBtZXNoIHBvbHlzIGFuZCBvYnN0YWNsZSBwb2x5cy5cclxuICB2YXIgcGF0aHMgPSBuZXcgQ2xpcHBlckxpYi5QYXRocygpO1xyXG4gIGNwci5DbGVhcigpO1xyXG4gIGNwci5BZGRQYXRocyhtZXJnZWRNZXNoUG9seXMsIENsaXBwZXJMaWIuUG9seVR5cGUucHRTdWJqZWN0LCB0cnVlKTtcclxuICBjcHIuQWRkUGF0aHMob2Zmc2V0dGVkT2JzdGFjbGVzLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0Q2xpcCwgdHJ1ZSk7XHJcblxyXG4gIGNwci5FeGVjdXRlKENsaXBwZXJMaWIuQ2xpcFR5cGUuY3REaWZmZXJlbmNlLFxyXG4gICAgcGF0aHMsXHJcbiAgICBDbGlwcGVyTGliLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVyb1xyXG4gICk7XHJcblxyXG4gIHZhciBhcmVhcyA9IE5hdk1lc2guX2dlb21ldHJ5LmdldEFyZWFzKHBhdGhzLCBzY2FsZSk7XHJcbiAgLy8gTWFrZSBwb2x5cyBmcm9tIG5ldyBzcGFjZS5cclxuICB2YXIgcG9seXMgPSBOYXZNZXNoLl9nZW9tZXRyeS5wYXJ0aXRpb25BcmVhcyhhcmVhcyk7XHJcblxyXG4gIC8vIEFkZCB0byBleGlzdGluZyBwb2x5Z29ucy5cclxuICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLnBvbHlzLCBwb2x5cyk7XHJcblxyXG4gIHRoaXMuX3VwZGF0ZSh0aGlzLnBvbHlzLCBwb2x5cywgaW50ZXJzZWN0aW9uLmluZGljZXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE9mZnNldHRpbmcgZnVuY3Rpb24gZm9yIGR5bmFtaWMgb2JzdGFjbGVzLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gb2JzdGFjbGVzXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb2Zmc2V0PTE2XVxyXG4gKiBAcmV0dXJuIHtBcnJheS48UG9seT59XHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fb2Zmc2V0RHluYW1pY09icyA9IGZ1bmN0aW9uKG9ic3RhY2xlcywgb2Zmc2V0KSB7XHJcbiAgaWYgKHR5cGVvZiBvZmZzZXQgPT0gJ3VuZGVmaW5lZCcpIG9mZnNldCA9IDE2O1xyXG4gIHZhciBzY2FsZSA9IDEwMDtcclxuICBvYnN0YWNsZXMgPSBvYnN0YWNsZXMubWFwKE5hdk1lc2guX2dlb21ldHJ5LmNvbnZlcnRQb2x5VG9DbGlwcGVyKTtcclxuICBDbGlwcGVyTGliLkpTLlNjYWxlVXBQYXRocyhvYnN0YWNsZXMsIHNjYWxlKTtcclxuXHJcbiAgdmFyIGNwciA9IE5hdk1lc2guX2dlb21ldHJ5LmNwcjtcclxuICB2YXIgY28gPSBOYXZNZXNoLl9nZW9tZXRyeS5jbztcclxuXHJcbiAgLy8gTWVyZ2Ugb2JzdGFjbGVzIHRvZ2V0aGVyLCBzbyBvYnN0YWNsZXMgdGhhdCBzaGFyZSBhIGNvbW1vbiBlZGdlXHJcbiAgLy8gd2lsbCBiZSBleHBhbmRlZCBwcm9wZXJseS5cclxuICBjcHIuQ2xlYXIoKTtcclxuICBjcHIuQWRkUGF0aHMob2JzdGFjbGVzLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgdmFyIG1lcmdlZF9vYnN0YWNsZXMgPSBuZXcgQ2xpcHBlckxpYi5QYXRocygpO1xyXG4gIGNwci5FeGVjdXRlKFxyXG4gICAgQ2xpcHBlckxpYi5DbGlwVHlwZS5jdFVuaW9uLFxyXG4gICAgbWVyZ2VkX29ic3RhY2xlcyxcclxuICAgIENsaXBwZXJMaWIuUG9seUZpbGxUeXBlLnBmdE5vblplcm8sXHJcbiAgICBudWxsKTtcclxuXHJcbiAgLy8gT2Zmc2V0IG9ic3RhY2xlcy5cclxuICB2YXIgb2Zmc2V0dGVkX3BhdGhzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuXHJcbiAgbWVyZ2VkX29ic3RhY2xlcy5mb3JFYWNoKGZ1bmN0aW9uKG9ic3RhY2xlKSB7XHJcbiAgICB2YXIgb2Zmc2V0dGVkX29ic3RhY2xlID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICAgIGNvLkNsZWFyKCk7XHJcbiAgICBjby5BZGRQYXRoKG9ic3RhY2xlLCBDbGlwcGVyTGliLkpvaW5UeXBlLmp0TWl0ZXIsIENsaXBwZXJMaWIuRW5kVHlwZS5ldENsb3NlZFBvbHlnb24pO1xyXG4gICAgY28uRXhlY3V0ZShvZmZzZXR0ZWRfb2JzdGFjbGUsIG9mZnNldCAqIHNjYWxlKTtcclxuICAgIG9mZnNldHRlZF9wYXRocy5wdXNoKG9mZnNldHRlZF9vYnN0YWNsZVswXSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIE1lcmdlIGFueSBuZXdseS1vdmVybGFwcGluZyBvYnN0YWNsZXMuXHJcbiAgY3ByLkNsZWFyKCk7XHJcbiAgY3ByLkFkZFBhdGhzKG9mZnNldHRlZF9wYXRocywgQ2xpcHBlckxpYi5Qb2x5VHlwZS5wdFN1YmplY3QsIHRydWUpO1xyXG4gIG1lcmdlZF9vYnN0YWNsZXMgPSBuZXcgQ2xpcHBlckxpYi5QYXRocygpO1xyXG4gIGNwci5FeGVjdXRlKFxyXG4gICAgQ2xpcHBlckxpYi5DbGlwVHlwZS5jdFVuaW9uLFxyXG4gICAgbWVyZ2VkX29ic3RhY2xlcyxcclxuICAgIENsaXBwZXJMaWIuUG9seUZpbGxUeXBlLnBmdE5vblplcm8sXHJcbiAgICBudWxsKTtcclxuICByZXR1cm4gbWVyZ2VkX29ic3RhY2xlcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYW5kIHJlbW92ZSB0aGUgbWVzaCBwb2x5Z29ucyBpbXBhY3RlZCBieSB0aGUgYWRkaXRpb24gb2YgbmV3XHJcbiAqIG9ic3RhY2xlcy4gVGhlIHByb3ZpZGVkIG9ic3RhY2xlcyBzaG91bGQgYWxyZWFkeSBiZSBvZmZzZXR0ZWQuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFBvbHk+fSBvYnN0YWNsZXMgLSBUaGUgb2Zmc2V0dGVkIG9ic3RhY2xlcyB0byBnZXRcclxuICogICB0aGUgaW50ZXJzZWN0aW9uIG9mLiBNdXN0IGJlIGNvbnZleC5cclxuICogQHJldHVybiB7QXJyYXkuPFBvbHk+fSAtIFRoZSBhZmZlY3RlZCBwb2x5cy5cclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLl9nZXRJbnRlcnNlY3RlZFBvbHlzID0gZnVuY3Rpb24ob2JzdGFjbGVzKSB7XHJcbiAgdmFyIGludGVyc2VjdGVkSW5kaWNlcyA9IE5hdk1lc2guX2dlb21ldHJ5LmdldEludGVyc2VjdGlvbnMob2JzdGFjbGVzLCB0aGlzLnBvbHlzKTtcclxuICByZXR1cm4ge1xyXG4gICAgaW5kaWNlczogaW50ZXJzZWN0ZWRJbmRpY2VzLFxyXG4gICAgcG9seXM6IE5hdk1lc2guX3V0aWwuc3BsaWNlKHRoaXMucG9seXMsIGludGVyc2VjdGVkSW5kaWNlcylcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgaW1wYXNzYWJsZSB0aWxlcyBib3JkZXJpbmcgdXBkYXRlZCBwYXNzYWJsZSB0aWxlcy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48VGlsZVVwZGF0ZT59IHRpbGVzIC0gVGhlIHVwZGF0ZWQgcGFzc2FibGUgdGlsZXMuXHJcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheUxvYz59IC0gVGhlIG5ldyBhcnJheSBsb2NhdGlvbnMuXHJcbiAqL1xyXG5OYXZNZXNoLnByb3RvdHlwZS5fZ2V0Qm9yZGVyZWRUaWxlcyA9IGZ1bmN0aW9uKHRpbGVzKSB7XHJcbiAgLy8gVHJhY2sgbG9jYXRpb25zIGFscmVhZHkgYmVpbmcgdXBkYXRlZCBvciBhZGRlZC5cclxuICB2YXIgbG9jYXRpb25zID0ge307XHJcbiAgdGlsZXMuZm9yRWFjaChmdW5jdGlvbih0aWxlKSB7XHJcbiAgICBsb2NhdGlvbnNbUG9pbnQudG9TdHJpbmcodGlsZSldID0gdHJ1ZTtcclxuICB9KTtcclxuXHJcbiAgdmFyIG1hcCA9IHRoaXMubWFwO1xyXG4gIHZhciB4VXBwZXJCb3VuZCA9IG1hcC5sZW5ndGg7XHJcbiAgdmFyIHlVcHBlckJvdW5kID0gbWFwWzBdLmxlbmd0aDtcclxuICAvLyBHZXQgdGhlIGxvY2F0aW9ucyBhZGphY2VudCB0byBhIGdpdmVuIHRpbGUgaW4gdGhlIG1hcC5cclxuICB2YXIgZ2V0QWRqYWNlbnQgPSBmdW5jdGlvbih0aWxlKSB7XHJcbiAgICB2YXIgeCA9IHRpbGUueDtcclxuICAgIHZhciB5ID0gdGlsZS55O1xyXG4gICAgdmFyIHhVcCA9IHggKyAxIDwgeFVwcGVyQm91bmQ7XHJcbiAgICB2YXIgeERvd24gPSB4ID49IDA7XHJcbiAgICB2YXIgeVVwID0geSArIDEgPCB5VXBwZXJCb3VuZDtcclxuICAgIHZhciB5RG93biA9IHkgPj0gMDtcclxuXHJcbiAgICB2YXIgYWRqYWNlbnRzID0gW107XHJcbiAgICBpZiAoeFVwKSB7XHJcbiAgICAgIGFkamFjZW50cy5wdXNoKHt4OiB4ICsgMSwgeTogeX0pO1xyXG4gICAgICBpZiAoeVVwKSB7XHJcbiAgICAgICAgYWRqYWNlbnRzLnB1c2goe3g6IHggKyAxLCB5OiB5ICsgMX0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh5RG93bikge1xyXG4gICAgICAgIGFkamFjZW50cy5wdXNoKHt4OiB4ICsgMSwgeTogeSAtIDF9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHhEb3duKSB7XHJcbiAgICAgIGFkamFjZW50cy5wdXNoKHt4OiB4IC0gMSwgeTogeX0pO1xyXG4gICAgICBpZiAoeVVwKSB7XHJcbiAgICAgICAgYWRqYWNlbnRzLnB1c2goe3g6IHggLSAxLCB5OiB5ICsgMX0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh5RG93bikge1xyXG4gICAgICAgIGFkamFjZW50cy5wdXNoKHt4OiB4IC0gMSwgeTogeSAtIDF9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHlVcCkge1xyXG4gICAgICBhZGphY2VudHMucHVzaCh7eDogeCwgeTogeSArIDF9KTtcclxuICAgIH1cclxuICAgIGlmICh5RG93bikge1xyXG4gICAgICBhZGphY2VudHMucHVzaCh7eDogeCwgeTogeSAtIDF9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhZGphY2VudHM7XHJcbiAgfTtcclxuXHJcbiAgLy8gU3RvcmUgYWRqYWNlbnQgaW1wYXNzYWJsZSB0aWxlcy5cclxuICB2YXIgYWRqYWNlbnRfdGlsZXMgPSBbXTtcclxuICB0aWxlcy5mb3JFYWNoKGZ1bmN0aW9uKHRpbGUpIHtcclxuICAgIHZhciBhZGphY2VudHMgPSBnZXRBZGphY2VudCh0aWxlKTtcclxuICAgIGFkamFjZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGFkamFjZW50KSB7XHJcbiAgICAgIHZhciBpZCA9IFBvaW50LnRvU3RyaW5nKGFkamFjZW50KTtcclxuICAgICAgaWYgKCFsb2NhdGlvbnNbaWRdKSB7XHJcbiAgICAgICAgLy8gUmVjb3JkIGFzIGhhdmluZyBiZWVuIHNlZW4uXHJcbiAgICAgICAgbG9jYXRpb25zW2lkXSA9IHRydWU7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMubWFwW2FkamFjZW50LnhdW2FkamFjZW50LnldO1xyXG4gICAgICAgIGlmICghdGhpcy5faXNQYXNzYWJsZSh2YWwpKSB7XHJcbiAgICAgICAgICBhZGphY2VudC52ID0gdmFsO1xyXG4gICAgICAgICAgYWRqYWNlbnRfdGlsZXMucHVzaChhZGphY2VudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCB0aGlzKTtcclxuICB9LCB0aGlzKTtcclxuICByZXR1cm4gYWRqYWNlbnRfdGlsZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVwcmVzZW50cyB0aGUgb3V0bGluZSBvZiBhIHNoYXBlIGFsb25nIHdpdGggaXRzIGhvbGVzLlxyXG4gKiBAdHlwZWRlZiBNYXBBcmVhXHJcbiAqIEB0eXBlIHtvYmplY3R9XHJcbiAqIEBwcm9wZXJ0eSB7UG9seX0gcG9seWdvbiAtIFRoZSBwb2x5Z29uIGRlZmluaW5nIHRoZSBleHRlcmlvciBvZlxyXG4gKiAgIHRoZSBzaGFwZS5cclxuICogQHByb3BlcnR5IHtBcnJheS48UG9seT59IGhvbGVzIC0gVGhlIGhvbGVzIG9mIHRoZSBzaGFwZS5cclxuICovXHJcblxyXG4vKipcclxuICogT2Zmc2V0IHRoZSBwb2x5Z29ucyBzdWNoIHRoYXQgdGhlcmUgaXMgYSBgb2Zmc2V0YCB1bml0IGJ1ZmZlclxyXG4gKiBiZXR3ZWVuIHRoZSBzaWRlcyBvZiB0aGUgb3V0bGluZSBhbmQgYXJvdW5kIHRoZSBvYnN0YWNsZXMuIFRoaXNcclxuICogYnVmZmVyIG1ha2VzIGl0IHNvIHRoYXQgdGhlIG1lc2ggdHJ1bHkgcmVwcmVzZW50cyB0aGUgbW92YWJsZSBhcmVhXHJcbiAqIGluIHRoZSBtYXAuIEFzc3VtZXMgdmVydGljZXMgZGVmaW5pbmcgaW50ZXJpb3Igc2hhcGVzIChsaWtlIHRoZVxyXG4gKiBtYWluIG91dGxpbmUgb2YgYW4gZW5jbG9zZWQgbWFwKSBhcmUgZ2l2ZW4gaW4gQ0NXIG9yZGVyIGFuZFxyXG4gKiBvYnN0YWNsZXMgYXJlIGdpdmVuIGluIENXIG9yZGVyLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gcG9seXMgLSBUaGUgcG9seWdvbnMgdG8gb2Zmc2V0LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW29mZnNldD0xNl0gLSBUaGUgYW1vdW50IHRvIG9mZnNldCB0aGUgcG9seWdvbnNcclxuICogICBmcm9tIHRoZSBtb3ZhYmxlIGFyZWFzLlxyXG4gKiBAcmV0dXJuIHtBcnJheS48TWFwQXJlYT59IC0gVGhlIHNoYXBlcyBkZWZpbmluZyB0aGUgcG9seWdvbnMgYWZ0ZXJcclxuICogICBvZmZzZXR0aW5nIGFuZCBtZXJnaW5nLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX29mZnNldFBvbHlzID0gZnVuY3Rpb24oc3RhdGljX29iamVjdHMsIG9mZnNldCkge1xyXG4gIC8vIH49IGJhbGwgcmFkaXVzIC8gMlxyXG4gIGlmICh0eXBlb2Ygb2Zmc2V0ID09ICd1bmRlZmluZWQnKSBvZmZzZXQgPSAxNjtcclxuXHJcbiAgLy8gU2VwYXJhdGUgaW50ZXJpb3IgYW5kIGV4dGVyaW9yIHdhbGxzLiBUaGUgQ0NXIHNoYXBlcyBjb3JyZXNwb25kXHJcbiAgLy8gdG8gdGhlIGludGVyaW9yIHdhbGwgb3V0bGluZXMgb2Ygb3V0IG1hcCwgdGhlIENXIHNoYXBlcyBhcmUgd2FsbHNcclxuICAvLyB0aGF0IHdlcmUgdHJhY2VkIG9uIHRoZWlyIG91dHNpZGUuXHJcbiAgdmFyIGludGVyaW9yX3dhbGxzID0gW107XHJcbiAgdmFyIGV4dGVyaW9yX3dhbGxzID0gc3RhdGljX29iamVjdHMud2FsbHMuZmlsdGVyKGZ1bmN0aW9uKHBvbHksIGluZGV4KSB7XHJcbiAgICBpZiAocG9seS5nZXRPcmllbnRhdGlvbigpID09IFwiQ0NXXCIpIHtcclxuICAgICAgaW50ZXJpb3Jfd2FsbHMucHVzaChwb2x5KTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBzY2FsZSA9IDEwMDtcclxuICBcclxuICAvLyBPZmZzZXQgdGhlIGludGVyaW9yIHdhbGxzLlxyXG4gIGludGVyaW9yX3dhbGxzID0gaW50ZXJpb3Jfd2FsbHMubWFwKE5hdk1lc2guX2dlb21ldHJ5LmNvbnZlcnRQb2x5VG9DbGlwcGVyKTtcclxuICBDbGlwcGVyTGliLkpTLlNjYWxlVXBQYXRocyhpbnRlcmlvcl93YWxscywgc2NhbGUpO1xyXG4gIFxyXG4gIHZhciBvZmZzZXR0ZWRfaW50ZXJpb3Jfd2FsbHMgPSBbXTtcclxuICBpbnRlcmlvcl93YWxscy5mb3JFYWNoKGZ1bmN0aW9uKHdhbGwpIHtcclxuICAgIHZhciBvZmZzZXR0ZWRfcGF0aHMgPSBOYXZNZXNoLl9nZW9tZXRyeS5vZmZzZXRJbnRlcmlvcih3YWxsLCBvZmZzZXQpO1xyXG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob2Zmc2V0dGVkX2ludGVyaW9yX3dhbGxzLCBvZmZzZXR0ZWRfcGF0aHMpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBSZXZlcnNlIHBhdGhzIHNpbmNlIGZyb20gaGVyZSBvbiB3ZSdyZSBnb2luZyB0byB0cmVhdCB0aGVcclxuICAvLyBvdXRsaW5lcyBhcyB0aGUgZXh0ZXJpb3Igb2YgYSBzaGFwZS5cclxuICBvZmZzZXR0ZWRfaW50ZXJpb3Jfd2FsbHMuZm9yRWFjaChmdW5jdGlvbihwYXRoKSB7XHJcbiAgICBwYXRoLnJldmVyc2UoKTtcclxuICB9KTtcclxuICBcclxuICBleHRlcmlvcl93YWxscyA9IGV4dGVyaW9yX3dhbGxzLm1hcChOYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0UG9seVRvQ2xpcHBlcik7XHJcblxyXG4gIENsaXBwZXJMaWIuSlMuU2NhbGVVcFBhdGhzKGV4dGVyaW9yX3dhbGxzLCBzY2FsZSk7XHJcblxyXG4gIC8vdmFyIGNwciA9IG5ldyBDbGlwcGVyTGliLkNsaXBwZXIoKTtcclxuICB2YXIgY3ByID0gTmF2TWVzaC5fZ2VvbWV0cnkuY3ByO1xyXG4gIHZhciBjbyA9IE5hdk1lc2guX2dlb21ldHJ5LmNvO1xyXG4gIFxyXG4gIHZhciB3YWxsX2ZpbGxUeXBlID0gQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZDtcclxuICB2YXIgb2JzdGFjbGVfZmlsbFR5cGUgPSBDbGlwcGVyTGliLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvO1xyXG4gIFxyXG4gIC8vIE9mZnNldCBleHRlcmlvciB3YWxscy5cclxuICB2YXIgb2Zmc2V0dGVkX2V4dGVyaW9yX3dhbGxzID0gW107XHJcblxyXG4gIGV4dGVyaW9yX3dhbGxzLmZvckVhY2goZnVuY3Rpb24od2FsbCkge1xyXG4gICAgdmFyIG9mZnNldHRlZF9leHRlcmlvcl93YWxsID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICAgIGNvLkNsZWFyKCk7XHJcbiAgICBjby5BZGRQYXRoKHdhbGwsIENsaXBwZXJMaWIuSm9pblR5cGUuanRTcXVhcmUsIENsaXBwZXJMaWIuRW5kVHlwZS5ldENsb3NlZFBvbHlnb24pO1xyXG4gICAgY28uRXhlY3V0ZShvZmZzZXR0ZWRfZXh0ZXJpb3Jfd2FsbCwgb2Zmc2V0ICogc2NhbGUpO1xyXG4gICAgb2Zmc2V0dGVkX2V4dGVyaW9yX3dhbGxzLnB1c2gob2Zmc2V0dGVkX2V4dGVyaW9yX3dhbGxbMF0pO1xyXG4gIH0pO1xyXG4gIFxyXG4gIC8vIE9mZnNldCBvYnN0YWNsZXMuXHJcbiAgLy8gT2JzdGFjbGVzIGFyZSBvZmZzZXR0ZWQgdXNpbmcgbWl0ZXIgam9pbiB0eXBlIHRvIGF2b2lkXHJcbiAgLy8gdW5uZWNlc3Nhcnkgc21hbGwgZWRnZXMuXHJcbiAgdmFyIG9mZnNldHRlZF9vYnN0YWNsZXMgPSBuZXcgQ2xpcHBlckxpYi5QYXRocygpO1xyXG5cclxuICB2YXIgb2JzdGFjbGVzID0gc3RhdGljX29iamVjdHMub2JzdGFjbGVzLm1hcChOYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0UG9seVRvQ2xpcHBlcik7XHJcbiAgQ2xpcHBlckxpYi5KUy5TY2FsZVVwUGF0aHMob2JzdGFjbGVzLCBzY2FsZSk7XHJcbiAgY28uQ2xlYXIoKTtcclxuICBjby5BZGRQYXRocyhvYnN0YWNsZXMsIENsaXBwZXJMaWIuSm9pblR5cGUuanRNaXRlciwgQ2xpcHBlckxpYi5FbmRUeXBlLmV0Q2xvc2VkUG9seWdvbik7XHJcbiAgY28uRXhlY3V0ZShvZmZzZXR0ZWRfb2JzdGFjbGVzLCBvZmZzZXQgKiBzY2FsZSk7XHJcblxyXG4gIC8vIFRha2UgZGlmZmVyZW5jZSBvZiBwb2x5Z29ucyBkZWZpbmluZyBpbnRlcmlvciB3YWxsIGFuZCBwb2x5Z29uc1xyXG4gIC8vIGRlZmluaW5nIGV4dGVyaW9yIHdhbGxzLCBsaW1pdGluZyB0byBleHRlcmlvciB3YWxsIHBvbHlnb25zIHdob3NlXHJcbiAgLy8gYXJlYSBpcyBsZXNzIHRoYW4gdGhlIGludGVyaW9yIHdhbGwgcG9seWdvbnMgc28gdGhlIGRpZmZlcmVuY2VcclxuICAvLyBvcGVyYXRpb24gZG9lc24ndCByZW1vdmUgcG90ZW50aWFsbHkgdHJhdmVyc2FibGUgYXJlYXMuXHJcbiAgdmFyIG1lcmdlZF9wYXRocyA9IFtdO1xyXG4gIG9mZnNldHRlZF9pbnRlcmlvcl93YWxscy5mb3JFYWNoKGZ1bmN0aW9uKHdhbGwpIHtcclxuICAgIHZhciBhcmVhID0gQ2xpcHBlckxpYi5KUy5BcmVhT2ZQb2x5Z29uKHdhbGwsIHNjYWxlKTtcclxuICAgIHZhciBzbWFsbGVyX2V4dGVyaW9yX3dhbGxzID0gb2Zmc2V0dGVkX2V4dGVyaW9yX3dhbGxzLmZpbHRlcihmdW5jdGlvbihleHRfd2FsbCkge1xyXG4gICAgICByZXR1cm4gQ2xpcHBlckxpYi5KUy5BcmVhT2ZQb2x5Z29uKGV4dF93YWxsLCBzY2FsZSkgPCBhcmVhO1xyXG4gICAgfSk7XHJcbiAgICB2YXIgcGF0aHMgPSBuZXcgQ2xpcHBlckxpYi5QYXRocygpO1xyXG4gICAgY3ByLkNsZWFyKCk7XHJcbiAgICBjcHIuQWRkUGF0aCh3YWxsLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgICBjcHIuQWRkUGF0aHMoc21hbGxlcl9leHRlcmlvcl93YWxscywgQ2xpcHBlckxpYi5Qb2x5VHlwZS5wdENsaXAsIHRydWUpO1xyXG4gICAgLy8gT2JzdGFjbGVzIGFyZSBzbWFsbCBpbmRpdmlkdWFsIHNvbGlkIG9iamVjdHMgdGhhdCBhcmVuJ3QgYXRcclxuICAgIC8vIHJpc2sgb2YgZW5jbG9zaW5nIGFuIGludGVyaW9yIGFyZWEuXHJcbiAgICBjcHIuQWRkUGF0aHMob2Zmc2V0dGVkX29ic3RhY2xlcywgQ2xpcHBlckxpYi5Qb2x5VHlwZS5wdENsaXAsIHRydWUpO1xyXG4gICAgY3ByLkV4ZWN1dGUoQ2xpcHBlckxpYi5DbGlwVHlwZS5jdERpZmZlcmVuY2UsXHJcbiAgICAgIHBhdGhzLFxyXG4gICAgICBDbGlwcGVyTGliLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvLFxyXG4gICAgICBDbGlwcGVyTGliLlBvbHlGaWxsVHlwZS5wZnROb25aZXJvXHJcbiAgICApO1xyXG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkobWVyZ2VkX3BhdGhzLCBwYXRocyk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBOYXZNZXNoLl9nZW9tZXRyeS5nZXRBcmVhcyhtZXJnZWRfcGF0aHMsIHNjYWxlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXRzIHVwIGNhbGxiYWNrcyBvbiB0aGUgd2ViIHdvcmtlciBwcm9taXNlIG9iamVjdCB0byBpbml0aWFsaXplXHJcbiAqIHRoZSB3ZWIgd29ya2VyIGludGVyZmFjZSBvbmNlIGxvYWRlZC5cclxuICogQHByaXZhdGVcclxuICovXHJcbk5hdk1lc2gucHJvdG90eXBlLl9zZXR1cFdvcmtlciA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIEluaXRpYWwgc3RhdGUuXHJcbiAgdGhpcy53b3JrZXIgPSBmYWxzZTtcclxuICB0aGlzLndvcmtlckluaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gIC8vIFNldCBjYWxsYmFja3MgZm9yIHdvcmtlciBwcm9taXNlIG9iamVjdC5cclxuICB3b3JrZXJQcm9taXNlLnRoZW4oZnVuY3Rpb24od29ya2VyKSB7XHJcbiAgICB0aGlzLmxvZ2dlci5sb2coXCJuYXZtZXNoOmRlYnVnXCIsIFwiV29ya2VyIHByb21pc2UgcmV0dXJuZWQuXCIpO1xyXG4gICAgdGhpcy53b3JrZXIgPSB3b3JrZXI7XHJcbiAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2UgPSB0aGlzLl9nZXRXb3JrZXJJbnRlcmZhY2UoKTtcclxuICAgIC8vIENoZWNrIGlmIHdvcmtlciBpcyBhbHJlYWR5IGluaXRpYWxpemVkLlxyXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoW1wiaXNJbml0aWFsaXplZFwiXSk7XHJcbiAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbihFcnJvcikge1xyXG4gICAgdGhpcy5sb2dnZXIubG9nKFwibmF2bWVzaDp3YXJuXCIsIFwiTm8gd29ya2VyLCBmYWxsaW5nIGJhY2sgdG8gaW4tdGhyZWFkIGNvbXB1dGF0aW9uLlwiKTtcclxuICAgIHRoaXMubG9nZ2VyLmxvZyhcIm5hdm1lc2g6d2FyblwiLCBcIldvcmtlciBlcnJvcjpcIiwgRXJyb3IpO1xyXG4gICAgdGhpcy53b3JrZXIgPSBmYWxzZTtcclxuICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAvLyBTZXQgdXAgY2FsbGJhY2sgdG8gdXBkYXRlIHdvcmtlciBvbiBuYXZtZXNoIHVwZGF0ZS5cclxuICB0aGlzLm9uVXBkYXRlKGZ1bmN0aW9uKGRpc3JlZ2FyZCwgbmV3UG9seXMsIHJlbW92ZWRJbmRpY2VzKSB7XHJcbiAgICBpZiAodGhpcy53b3JrZXIgJiYgdGhpcy53b3JrZXJJbml0aWFsaXplZCkge1xyXG4gICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZShbXCJwb2x5VXBkYXRlXCIsIG5ld1BvbHlzLCByZW1vdmVkSW5kaWNlc10pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sb2dnZXIubG9nKFwibmF2bWVzaDpkZWJ1Z1wiLCBcIldvcmtlciBub3QgbG9hZGVkIHlldC5cIik7XHJcbiAgICB9XHJcbiAgfS5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIYW5kbGVyIGZvciBsb2cgbWVzc2FnZXMgc2VudCBieSB3b3JrZXIuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPChzdHJpbmd8b2JqZWN0KT59IG1lc3NhZ2UgLSBBcnJheSBvZiBhcmd1bWVudHMgdG9cclxuICogICBwYXNzIHRvIGBMb2dnZXIubG9nYC4gVGhlIGZpcnN0IGVsZW1lbnQgc2hvdWxkIGJlIHRoZSBncm91cCB0b1xyXG4gKiAgIGFzc29jaWF0ZSB0aGUgbWVzc2FnZSB3aXRoLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX3dvcmtlckxvZ2dlciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcclxuICB0aGlzLmxvZ2dlci5sb2cuYXBwbHkobnVsbCwgbWVzc2FnZSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgZnVuY3Rpb24gdG8gYmUgdXNlZCBmb3IgdGhlIGBvbm1lc3NhZ2VgIGNhbGxiYWNrIGZvclxyXG4gKiB0aGUgd2ViIHdvcmtlci5cclxuICogQHByaXZhdGVcclxuICogQHJldHVybiB7RnVuY3Rpb259IC0gVGhlIGBvbm1lc3NhZ2VgIGhhbmRsZXIgZm9yIHRoZSB3ZWIgd29ya2VyLlxyXG4gKi9cclxuTmF2TWVzaC5wcm90b3R5cGUuX2dldFdvcmtlckludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBmdW5jdGlvbihtZXNzYWdlKSB7XHJcbiAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YTtcclxuICAgIHZhciBuYW1lID0gZGF0YVswXTtcclxuXHJcbiAgICAvLyBPdXRwdXQgZGVidWcgbWVzc2FnZSBmb3IgYWxsIG1lc3NhZ2VzIHJlY2VpdmVkIGV4Y2VwdCBcImxvZ1wiXHJcbiAgICAvLyBtZXNzYWdlcy5cclxuICAgIGlmIChuYW1lICE9PSBcImxvZ1wiKVxyXG4gICAgICB0aGlzLmxvZ2dlci5sb2coXCJuYXZtZXNoOmRlYnVnXCIsIFwiTWVzc2FnZSByZWNlaXZlZCBmcm9tIHdvcmtlcjpcIiwgZGF0YSk7XHJcblxyXG4gICAgaWYgKG5hbWUgPT0gXCJsb2dcIikge1xyXG4gICAgICB0aGlzLl93b3JrZXJMb2dnZXIoZGF0YS5zbGljZSgxKSk7XHJcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT0gXCJyZXN1bHRcIikge1xyXG4gICAgICB2YXIgcGF0aCA9IGRhdGFbMV07XHJcbiAgICAgIHRoaXMubGFzdENhbGxiYWNrKHBhdGgpO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09IFwiaW5pdGlhbGl6ZWRcIikge1xyXG4gICAgICB0aGlzLndvcmtlckluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgLy8gU2VuZCBwYXJzZWQgbWFwIHBvbHlnb25zIHRvIHdvcmtlciB3aGVuIGF2YWlsYWJsZS5cclxuICAgICAgdGhpcy5vbkluaXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoW1wicG9seXNcIiwgdGhpcy5wb2x5c10pO1xyXG4gICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG4gIH0uYmluZCh0aGlzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYWtlIHV0aWxpdGllcyBpbiBwb2x5cGFydGl0aW9uIGF2YWlsYWJsZSB3aXRob3V0IHJlcXVpcmluZ1xyXG4gKiB0aGF0IGl0IGJlIGluY2x1ZGVkIGluIGV4dGVybmFsIHNjcmlwdHMuXHJcbiAqL1xyXG5OYXZNZXNoLnBvbHkgPSBnZW87XHJcblxyXG4vKipcclxuICogSG9sZCBtZXRob2RzIHVzZWQgZm9yIGdlbmVyYXRpbmcgdGhlIG5hdmlnYXRpb24gbWVzaC5cclxuICogQHByaXZhdGVcclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5ID0ge307XHJcblxyXG4vKipcclxuICogSW5pdGlhbGl6ZWQgQ2xpcHBlciBmb3Igb3BlcmF0aW9ucy5cclxuICogQHByaXZhdGVcclxuICogQHR5cGUge0NsaXBwZXJMaWIuQ2xpcHBlcn1cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LmNwciA9IG5ldyBDbGlwcGVyTGliLkNsaXBwZXIoKTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplZCBDbGlwcGVyT2Zmc2V0IGZvciBvcGVyYXRpb25zLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAdHlwZSB7Q2xpcHBlckxpYi5DbGlwcGVyT2Zmc2V0fVxyXG4gKi9cclxuTmF2TWVzaC5fZ2VvbWV0cnkuY28gPSBuZXcgQ2xpcHBlckxpYi5DbGlwcGVyT2Zmc2V0KCk7XHJcblxyXG4vLyBEZWZhdWx0cy5cclxuTmF2TWVzaC5fZ2VvbWV0cnkuY28uTWl0ZXJMaW1pdCA9IDI7XHJcbk5hdk1lc2guX2dlb21ldHJ5LnNjYWxlID0gMTAwO1xyXG5cclxuLyoqXHJcbiAqIEdldCBhIHBvbHlnb25hbCBhcHByb3hpbWF0aW9uIG9mIGEgY2lyY2xlIG9mIGEgZ2l2ZW4gcmFkaXVzXHJcbiAqIGNlbnRlcmVkIGF0IHRoZSBwcm92aWRlZCBwb2ludC4gVmVydGljZXMgb2YgcG9seWdvbiBhcmUgaW4gQ1dcclxuICogb3JkZXIuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIGZvciB0aGUgcG9seWdvbi5cclxuICogQHBhcmFtIHtQb2ludH0gW3BvaW50XSAtIFRoZSBwb2ludCBhdCB3aGljaCB0byBjZW50ZXIgdGhlIHBvbHlnb24uXHJcbiAqICAgSWYgYSBwb2ludCBpcyBub3QgcHJvdmlkZWQgdGhlbiB0aGUgcG9seWdvbiBpcyBjZW50ZXJlZCBhdCB0aGVcclxuICogICBvcmlnaW4uXHJcbiAqIEByZXR1cm4ge1BvbHl9IC0gVGhlIGFwcHJveGltYXRlZCBjaXJjbGUuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5nZXRBcHByb3hpbWF0ZUNpcmNsZSA9IGZ1bmN0aW9uKHJhZGl1cywgcG9pbnQpIHtcclxuICB2YXIgeCwgeTtcclxuICBpZiAocG9pbnQpIHtcclxuICAgIHggPSBwb2ludC54O1xyXG4gICAgeSA9IHBvaW50Lnk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHggPSAwO1xyXG4gICAgeSA9IDA7XHJcbiAgfVxyXG4gIHZhciBvZmZzZXQgPSByYWRpdXMgKiBNYXRoLnRhbihNYXRoLlBJIC8gOCk7XHJcbiAgb2Zmc2V0ID0gTWF0aC5yb3VuZDEwKG9mZnNldCwgLTEpO1xyXG4gIHZhciBwb2x5ID0gbmV3IFBvbHkoW1xyXG4gICAgbmV3IFBvaW50KHggLSByYWRpdXMsIHkgLSBvZmZzZXQpLFxyXG4gICAgbmV3IFBvaW50KHggLSByYWRpdXMsIHkgKyBvZmZzZXQpLFxyXG4gICAgbmV3IFBvaW50KHggLSBvZmZzZXQsIHkgKyByYWRpdXMpLFxyXG4gICAgbmV3IFBvaW50KHggKyBvZmZzZXQsIHkgKyByYWRpdXMpLFxyXG4gICAgbmV3IFBvaW50KHggKyByYWRpdXMsIHkgKyBvZmZzZXQpLFxyXG4gICAgbmV3IFBvaW50KHggKyByYWRpdXMsIHkgLSBvZmZzZXQpLFxyXG4gICAgbmV3IFBvaW50KHggKyBvZmZzZXQsIHkgLSByYWRpdXMpLFxyXG4gICAgbmV3IFBvaW50KHggLSBvZmZzZXQsIHkgLSByYWRpdXMpXHJcbiAgXSk7XHJcbiAgcmV0dXJuIHBvbHk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIHNxdWFyZSB3aXRoIHNpZGUgbGVuZ3RoIGdpdmVuIGJ5IGRvdWJsZSB0aGUgcHJvdmlkZWRcclxuICogcmFkaXVzLCBjZW50ZXJlZCBhdCB0aGUgb3JpZ2luLiBWZXJ0aWNlcyBvZiBwb2x5Z29uIGFyZSBpbiBDV1xyXG4gKiBvcmRlci5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSBsZW5ndGggb2YgaGFsZiBvZiBvbmUgc2lkZS5cclxuICogQHJldHVybiB7UG9seX0gLSBUaGUgY29uc3RydWN0ZWQgc3F1YXJlLlxyXG4gKi9cclxuTmF2TWVzaC5fZ2VvbWV0cnkuZ2V0U3F1YXJlID0gZnVuY3Rpb24ocmFkaXVzKSB7XHJcbiAgdmFyIHBvbHkgPSBuZXcgUG9seShbXHJcbiAgICBuZXcgUG9pbnQoLXJhZGl1cywgcmFkaXVzKSxcclxuICAgIG5ldyBQb2ludChyYWRpdXMsIHJhZGl1cyksXHJcbiAgICBuZXcgUG9pbnQocmFkaXVzLCAtcmFkaXVzKSxcclxuICAgIG5ldyBQb2ludCgtcmFkaXVzLCAtcmFkaXVzKVxyXG4gIF0pO1xyXG4gIHJldHVybiBwb2x5O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgdXBwZXIgb3IgbG93ZXIgZGlhZ29uYWwgb2YgYSBzcXVhcmUgb2YgdGhlIGdpdmVuXHJcbiAqIHJhZGl1cy4gXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgbGVuZ3RoIG9mIGhhbGYgb2Ygb25lIHNpZGUgb2YgdGhlXHJcbiAqICAgc3F1YXJlIHRvIGdldCB0aGUgZGlhZ29uYWwgb2YuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb3JuZXIgLSBPbmUgb2YgbmUsIHNlLCBudywgc3cgaW5kaWNhdGluZyB3aGljaFxyXG4gKiAgIGNvcm5lciBzaG91bGQgYmUgZmlsbGVkLlxyXG4gKiBAcmV0dXJuIHtQb2x5fSAtIFRoZSBkaWFnb25hbCBzaGFwZS5cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LmdldERpYWdvbmFsID0gZnVuY3Rpb24ocmFkaXVzLCBjb3JuZXIpIHtcclxuICB2YXIgdHlwZXMgPSB7XHJcbiAgICBcIm5lXCI6IFtbcmFkaXVzLCAtcmFkaXVzXSwgW3JhZGl1cywgcmFkaXVzXSwgWy1yYWRpdXMsIC1yYWRpdXNdXSxcclxuICAgIFwic2VcIjogW1tyYWRpdXMsIHJhZGl1c10sIFstcmFkaXVzLCByYWRpdXNdLCBbcmFkaXVzLCAtcmFkaXVzXV0sXHJcbiAgICBcInN3XCI6IFtbLXJhZGl1cywgcmFkaXVzXSwgWy1yYWRpdXMsIC1yYWRpdXNdLCBbcmFkaXVzLCByYWRpdXNdXSxcclxuICAgIFwibndcIjogW1stcmFkaXVzLCAtcmFkaXVzXSwgW3JhZGl1cywgLXJhZGl1c10sIFstcmFkaXVzLCByYWRpdXNdXVxyXG4gIH07XHJcbiAgdmFyIHBvaW50cyA9IHR5cGVzW2Nvcm5lcl0ubWFwKGZ1bmN0aW9uKG11bCkge1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludChtdWxbMF0sIG11bFsxXSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG5ldyBQb2x5KHBvaW50cyk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2l2ZW4gdHdvIHNldHMgb2YgcG9seWdvbnMsIHJldHVybiBpbmRpY2VzIG9mIHRoZSBvbmVzIGluIHRoZSBibHVlXHJcbiAqIHNldCB0aGF0IGFyZSBpbnRlcnNlY3RlZCBieSBvbmVzIGluIHJlZC5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IHJlZFxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gYmx1ZVxyXG4gKiBAcmV0dXJuIHtBcnJheS48aW50ZWdlcj59IC0gVGhlIGluZGljZXMgb2YgdGhlIGludGVyc2VjdGVkIGJsdWVcclxuICogICBwb2x5cy5cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LmdldEludGVyc2VjdGlvbnMgPSBmdW5jdGlvbihyZWQsIGJsdWUpIHtcclxuICB2YXIgaW5kaWNlcyA9IFtdO1xyXG4gIC8vIE5haXZlIHNvbHV0aW9uLlxyXG4gIGJsdWUuZm9yRWFjaChmdW5jdGlvbihwb2x5LCBpKSB7XHJcbiAgICB2YXIgaW50ZXJzZWN0cyA9IHJlZC5zb21lKGZ1bmN0aW9uKHBvbHliKSB7XHJcbiAgICAgIHJldHVybiBwb2x5LmludGVyc2VjdHMocG9seWIpO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoaW50ZXJzZWN0cykge1xyXG4gICAgICBpbmRpY2VzLnB1c2goaSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGluZGljZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQW4gQXJlYSBpcyBhbiBvYmplY3QgdGhhdCBob2xkcyBhIHBvbHlnb24gcmVwcmVzZW50aW5nIGEgc3BhY2VcclxuICogYWxvbmcgd2l0aCBpdHMgaG9sZXMuIEFuIEFyZWEgY2FuIHJlcHJlc2VudCwgZm9yIGV4YW1wbGUsIGFcclxuICogdHJhdmVyc2FibGUgcmVnaW9uLCBpZiB3ZSBjb25zaWRlciB0aGUgbm9uLWhvbGUgYXJlYSBvZiB0aGVcclxuICogcG9seWdvbiBhcyBiZWluZyB0cmF2ZXJzYWJsZSwgb3IgdGhlIG9wcG9zaXRlLCBpZiB3ZSBjb25zaWRlclxyXG4gKiB0aGUgbm9uLWhvbGUgYXJlYSBhcyBiZWluZyBzb2xpZCwgYmxvY2tpbmcgbW92ZW1lbnQuXHJcbiAqIEB0eXBlZGVmIEFyZWFcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtQb2x5fSBwb2x5Z29uIC0gVGhlIHBvbHlnb24gZGVmaW5pbmcgdGhlIG91dHNpZGUgb2YgdGhlXHJcbiAqICAgYXJlYS5cclxuICogQHByb3BlcnR5IHtBcnJheS48UG9seT59IGhvbGVzIC0gVGhlIGhvbGVzIGluIHRoZSBwb2x5Z29uIGZvciB0aGlzXHJcbiAqICAgYXJlYS5cclxuICovXHJcbi8qKlxyXG4gKiBHaXZlbiBhIFBvbHlUcmVlLCByZXR1cm4gYW4gYXJyYXkgb2YgYXJlYXMgYXNzdW1pbmcgZXZlbi1vZGQgZmlsbFxyXG4gKiBvcmRlcmluZy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtDbGlwcGVyTGliLlBhdGhzfSBwYXRocyAtIFRoZSBwYXRocyBvdXRwdXQgZnJvbSBzb21lXHJcbiAqICAgb3BlcmF0aW9uLiBQYXRocyBzaG91bGQgYmUgbm9uLW92ZXJsYXBwaW5nLCBpLmUuIHRoZSBlZGdlcyBvZlxyXG4gKiAgIHJlcHJlc2VudGVkIHBvbHlnb25zIHNob3VsZCBub3QgYmUgb3ZlcmxhcHBpbmcsIGJ1dCBwb2x5Z29uc1xyXG4gKiAgIG1heSBiZSBmdWxseSBjb250YWluZWQgaW4gb25lIGFub3RoZXIuIFBhdGhzIHNob3VsZCBhbHJlYWR5XHJcbiAqICAgYmUgc2NhbGVkIHVwLlxyXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtzY2FsZT0xMDBdIC0gVGhlIHNjYWxlIHRvIHVzZSB3aGVuIGJyaW5naW5nIHRoZVxyXG4gKiAgIENsaXBwZXIgcGF0aHMgZG93biB0byBzaXplLlxyXG4gKiBAcmV0dXJuIHtBcnJheS48QXJlYT59IC0gVGhlIGFyZWFzIHJlcHJlc2VudGVkIGJ5IHRoZSBwb2x5dHJlZS5cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LmdldEFyZWFzID0gZnVuY3Rpb24ocGF0aHMsIHNjYWxlKSB7XHJcbiAgaWYgKHR5cGVvZiBzY2FsZSA9PSAndW5kZWZpbmVkJykgc2NhbGUgPSBOYXZNZXNoLl9nZW9tZXRyeS5zY2FsZTtcclxuICAvLyBXZSBhcmUgcmVhbGx5IG9ubHkgY29uY2VybmVkIHdpdGggZ2V0dGluZyB0aGUgcGF0aHMgaW50byBhXHJcbiAgLy8gcG9seXRyZWUgc3RydWN0dXJlLlxyXG4gIHZhciBjcHIgPSBOYXZNZXNoLl9nZW9tZXRyeS5jcHI7XHJcbiAgY3ByLkNsZWFyKCk7XHJcbiAgY3ByLkFkZFBhdGhzKHBhdGhzLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgdmFyIHVuaW9uZWRfc2hhcGVzX3BvbHl0cmVlID0gbmV3IENsaXBwZXJMaWIuUG9seVRyZWUoKTtcclxuICBjcHIuRXhlY3V0ZShcclxuICAgIENsaXBwZXJMaWIuQ2xpcFR5cGUuY3RVbmlvbixcclxuICAgIHVuaW9uZWRfc2hhcGVzX3BvbHl0cmVlLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0RXZlbk9kZCxcclxuICAgIG51bGwpO1xyXG5cclxuICB2YXIgYXJlYXMgPSBbXTtcclxuXHJcbiAgdmFyIG91dGVyX3BvbHlnb25zID0gdW5pb25lZF9zaGFwZXNfcG9seXRyZWUuQ2hpbGRzKCk7XHJcblxyXG4gIC8vIE9yZ2FuaXplIHNoYXBlcyBpbnRvIHRoZWlyIG91dGVyIHBvbHlnb25zIGFuZCBob2xlcywgYXNzdW1pbmdcclxuICAvLyB0aGF0IHRoZSBmaXJzdCBsYXllciBvZiBwb2x5Z29ucyBpbiB0aGUgcG9seXRyZWUgcmVwcmVzZW50IHRoZVxyXG4gIC8vIG91dHNpZGUgZWRnZSBvZiB0aGUgZGVzaXJlZCBhcmVhcy5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG91dGVyX3BvbHlnb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgb3V0ZXJfcG9seWdvbiA9IG91dGVyX3BvbHlnb25zW2ldO1xyXG4gICAgdmFyIGNvbnRvdXIgPSBvdXRlcl9wb2x5Z29uLkNvbnRvdXIoKTtcclxuICAgIENsaXBwZXJMaWIuSlMuU2NhbGVEb3duUGF0aChjb250b3VyLCBzY2FsZSk7XHJcbiAgICB2YXIgYXJlYSA9IHtcclxuICAgICAgcG9seWdvbjogY29udG91cixcclxuICAgICAgaG9sZXM6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgIG91dGVyX3BvbHlnb24uQ2hpbGRzKCkuZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xyXG4gICAgICB2YXIgY29udG91ciA9IGNoaWxkLkNvbnRvdXIoKTtcclxuICAgICAgQ2xpcHBlckxpYi5KUy5TY2FsZURvd25QYXRoKGNoaWxkLkNvbnRvdXIoKSwgc2NhbGUpO1xyXG4gICAgICAvLyBBZGQgYXMgYSBob2xlLlxyXG4gICAgICBhcmVhLmhvbGVzLnB1c2goY29udG91cik7XHJcblxyXG4gICAgICAvLyBBZGQgY2hpbGRyZW4gYXMgYWRkaXRpb25hbCBvdXRlciBwb2x5Z29ucyB0byBiZSBleHBhbmRlZC5cclxuICAgICAgY2hpbGQuQ2hpbGRzKCkuZm9yRWFjaChmdW5jdGlvbihjaGlsZF9vdXRlcikge1xyXG4gICAgICAgIG91dGVyX3BvbHlnb25zLnB1c2goY2hpbGRfb3V0ZXIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgYXJlYXMucHVzaChhcmVhKTtcclxuICB9XHJcbiAgXHJcbiAgLy8gQ29udmVydCBDbGlwcGVyIFBhdGhzIHRvIFBvbHlzLlxyXG4gIGFyZWFzLmZvckVhY2goZnVuY3Rpb24oYXJlYSkge1xyXG4gICAgYXJlYS5wb2x5Z29uID0gTmF2TWVzaC5fZ2VvbWV0cnkuY29udmVydENsaXBwZXJUb1BvbHkoYXJlYS5wb2x5Z29uKTtcclxuICAgIGFyZWEuaG9sZXMgPSBhcmVhLmhvbGVzLm1hcChOYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0Q2xpcHBlclRvUG9seSk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBhcmVhcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBPZmZzZXQgYSBwb2x5Z29uIGlud2FyZHMgKGFzIG9wcG9zZWQgdG8gZGVmbGF0aW5nIGl0KS4gVGhlIHBvbHlnb25cclxuICogdmVydGljZXMgc2hvdWxkIGJlIGluIENDVyBvcmRlciBhbmQgdGhlIHBvbHlnb24gc2hvdWxkIGFscmVhZHkgYmVcclxuICogc2NhbGVkLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0NMU2hhcGV9IHNoYXBlIC0gVGhlIHNoYXBlIHRvIGluZmxhdGUgaW53YXJkcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCAtIFRoZSBhbW91bnQgdG8gb2Zmc2V0IHRoZSBzaGFwZS5cclxuICogQHBhcmFtIHtpbnRlZ2VyfSBbc2NhbGU9MTAwXSAtIFRoZSBzY2FsZSBmb3IgdGhlIG9wZXJhdGlvbi5cclxuICogQHJldHVybiB7Q2xpcHBlckxpYi5QYXRoc30gLSBUaGUgcmVzdWx0aW5nIHNoYXBlIGZyb20gb2Zmc2V0dGluZy5cclxuICogICBJZiB0aGUgcHJvY2VzcyBvZiBvZmZzZXR0aW5nIHJlc3VsdGVkIGluIHRoZSBpbnRlcmlvciBzaGFwZVxyXG4gKiAgIGNsb3NpbmcgY29tcGxldGVseSwgdGhlbiBhbiBlbXB0eSBhcnJheSB3aWxsIGJlIHJldHVybmVkLiBUaGVcclxuICogICByZXR1cm5lZCBzaGFwZSB3aWxsIHN0aWxsIGJlIHNjYWxlZCB1cCwgZm9yIHVzZSBpbiBvdGhlclxyXG4gKiAgIG9wZXJhdGlvbnMuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5vZmZzZXRJbnRlcmlvciA9IGZ1bmN0aW9uKHNoYXBlLCBvZmZzZXQsIHNjYWxlKSB7XHJcbiAgaWYgKHR5cGVvZiBzY2FsZSA9PSAndW5kZWZpbmVkJykgc2NhbGUgPSBOYXZNZXNoLl9nZW9tZXRyeS5zY2FsZTtcclxuXHJcbiAgdmFyIGNwciA9IE5hdk1lc2guX2dlb21ldHJ5LmNwcjtcclxuICB2YXIgY28gPSBOYXZNZXNoLl9nZW9tZXRyeS5jbztcclxuXHJcbiAgLy8gRmlyc3QsIGNyZWF0ZSBhIHNoYXBlIHdpdGggdGhlIG91dGxpbmUgYXMgdGhlIGludGVyaW9yLlxyXG4gIHZhciBib3VuZGluZ1NoYXBlID0gTmF2TWVzaC5fZ2VvbWV0cnkuZ2V0Qm91bmRpbmdTaGFwZUZvclBhdGhzKFtzaGFwZV0pO1xyXG5cclxuICBjcHIuQ2xlYXIoKTtcclxuICBjcHIuQWRkUGF0aChib3VuZGluZ1NoYXBlLCBDbGlwcGVyTGliLlBvbHlUeXBlLnB0U3ViamVjdCwgdHJ1ZSk7XHJcbiAgY3ByLkFkZFBhdGgoc2hhcGUsIENsaXBwZXJMaWIuUG9seVR5cGUucHRDbGlwLCB0cnVlKTtcclxuXHJcbiAgdmFyIHNvbHV0aW9uX3BhdGhzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuICBjcHIuRXhlY3V0ZShDbGlwcGVyTGliLkNsaXBUeXBlLmN0RGlmZmVyZW5jZSxcclxuICAgIHNvbHV0aW9uX3BhdGhzLFxyXG4gICAgQ2xpcHBlckxpYi5Qb2x5RmlsbFR5cGUucGZ0Tm9uWmVybyxcclxuICAgIENsaXBwZXJMaWIuUG9seUZpbGxUeXBlLnBmdE5vblplcm8pO1xyXG5cclxuICAvLyBPbmNlIHdlIGhhdmUgdGhlIHNoYXBlIGFzIGNyZWF0ZWQgYWJvdmUsIGluZmxhdGUgaXQuIFRoaXMgZ2l2ZXNcclxuICAvLyBiZXR0ZXIgcmVzdWx0cyB0aGFuIHRyZWF0aW5nIHRoZSBvdXRsaW5lIGFzIHRoZSBleHRlcmlvciBvZiBhXHJcbiAgLy8gc2hhcGUgYW5kIGRlZmxhdGluZyBpdC5cclxuICB2YXIgb2Zmc2V0dGVkX3BhdGhzID0gbmV3IENsaXBwZXJMaWIuUGF0aHMoKTtcclxuXHJcbiAgY28uQ2xlYXIoKTtcclxuICBjby5BZGRQYXRocyhzb2x1dGlvbl9wYXRocywgQ2xpcHBlckxpYi5Kb2luVHlwZS5qdFNxdWFyZSwgQ2xpcHBlckxpYi5FbmRUeXBlLmV0Q2xvc2VkUG9seWdvbik7XHJcbiAgY28uRXhlY3V0ZShvZmZzZXR0ZWRfcGF0aHMsIG9mZnNldCAqIHNjYWxlKTtcclxuXHJcbiAgLy8gSWYgdGhpcyBpcyBub3QgdHJ1ZSB0aGVuIHRoZSBvZmZzZXR0aW5nIHByb2Nlc3Mgc2hyYW5rIHRoZVxyXG4gIC8vIG91dGxpbmUgaW50byBub24tZXhpc3RlbmNlIGFuZCBvbmx5IHRoZSBib3VuZGluZyBzaGFwZSBpc1xyXG4gIC8vIGxlZnQuXHJcbiAgLy8gPj0gMiBpbiBjYXNlIHRoZSBvZmZzZXR0aW5nIHByb2Nlc3MgaXNvbGF0ZXMgcG9ydGlvbnMgb2YgdGhlXHJcbiAgLy8gb3V0bGluZSAoc2VlOiBHYW1lUGFkKS5cclxuICBpZiAob2Zmc2V0dGVkX3BhdGhzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAvLyBHZXQgb25seSB0aGUgcGF0aHMgZGVmaW5pbmcgdGhlIG91dGxpbmVzIHdlIHdlcmUgaW50ZXJlc3RlZFxyXG4gICAgLy8gaW4sIGRpc2NhcmRpbmcgdGhlIGV4dGVyaW9yIGJvdW5kaW5nIHNoYXBlLlxyXG4gICAgb2Zmc2V0dGVkX3BhdGhzLnNoaWZ0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG9mZnNldHRlZF9wYXRocyA9IG5ldyBDbGlwcGVyTGliLlBhdGhzKCk7XHJcbiAgfVxyXG4gIHJldHVybiBvZmZzZXR0ZWRfcGF0aHM7XHJcbn07XHJcblxyXG4vKipcclxuICogT2Zmc2V0IGEgcG9seWdvbi4gVGhlIHBvbHlnb24gdmVydGljZXMgc2hvdWxkIGJlIGluIENXIG9yZGVyIGFuZFxyXG4gKiB0aGUgcG9seWdvbiBzaG91bGQgYWxyZWFkeSBiZSBzY2FsZWQgdXAuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7Q0xTaGFwZX0gc2hhcGUgLSBUaGUgc2hhcGUgdG8gaW5mbGF0ZSBvdXR3YXJkcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCAtIFRoZSBhbW91bnQgdG8gb2Zmc2V0IHRoZSBzaGFwZS5cclxuICogQHBhcmFtIHtpbnRlZ2VyfSBbc2NhbGU9MTAwXSAtIFRoZSBzY2FsZSBmb3IgdGhlIG9wZXJhdGlvbi5cclxuICogQHJldHVybiB7Q2xpcHBlckxpYi5QYXRoc30gLSBUaGUgcmVzdWx0aW5nIHNoYXBlIGZyb20gb2Zmc2V0dGluZy5cclxuICogICBJZiB0aGUgcHJvY2VzcyBvZiBvZmZzZXR0aW5nIHJlc3VsdGVkIGluIHRoZSBpbnRlcmlvciBzaGFwZVxyXG4gKiAgIGNsb3NpbmcgY29tcGxldGVseSwgdGhlbiBhbiBlbXB0eSBhcnJheSB3aWxsIGJlIHJldHVybmVkLiBUaGVcclxuICogICByZXR1cm5lZCBzaGFwZSB3aWxsIHN0aWxsIGJlIHNjYWxlZCB1cCwgZm9yIHVzZSBpbiBvdGhlclxyXG4gKiAgIG9wZXJhdGlvbnMuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5vZmZzZXRFeHRlcmlvciA9IGZ1bmN0aW9uKHNoYXBlLCBvZmZzZXQsIHNjYWxlKSB7XHJcbiAgLy8gVE9ET1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlIGEgY29udmV4IHBhcnRpdGlvbiBvZiB0aGUgcHJvdmlkZWQgcG9seWdvbiwgZXhjbHVkaW5nXHJcbiAqIGFyZWFzIGdpdmVuIGJ5IHRoZSBob2xlcy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtQb2x5fSBvdXRsaW5lIC0gVGhlIHBvbHlnb24gb3V0bGluZSBvZiB0aGUgYXJlYSB0b1xyXG4gKiAgIHBhcnRpdGlvbi5cclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IGhvbGVzIC0gSG9sZXMgaW4gdGhlIHBvbHlnb24uXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQb2x5Pn0gLSBQb2x5Z29ucyByZXByZXNlbnRpbmcgdGhlIHBhcnRpdGlvbmVkXHJcbiAqICAgc3BhY2UuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5jb252ZXhQYXJ0aXRpb24gPSBmdW5jdGlvbihvdXRsaW5lLCBob2xlcykge1xyXG4gIC8vIEVuc3VyZSBwcm9wZXIgdmVydGV4IG9yZGVyIGZvciBob2xlcyBhbmQgb3V0bGluZS5cclxuICBvdXRsaW5lLnNldE9yaWVudGF0aW9uKFwiQ0NXXCIpO1xyXG4gIGhvbGVzLmZvckVhY2goZnVuY3Rpb24oZSkge1xyXG4gICAgZS5zZXRPcmllbnRhdGlvbihcIkNXXCIpO1xyXG4gICAgZS5ob2xlID0gdHJ1ZTtcclxuICB9KTtcclxuICBcclxuICByZXR1cm4gcGFydGl0aW9uKG91dGxpbmUsIGhvbGVzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQYXJ0aXRpb24gdGhlIHByb3ZpZGVkIGFyZWEuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJlYX0gYXJlYSAtIFRoZSBBcmVhIHRvIHBhcnRpdGlvbi5cclxuICogQHJldHVybiB7QXJyYXkuPFBvbHk+fSAtIFBvbHlnb25zIHJlcHJlc2VudGluZyB0aGUgcGFydGl0aW9uZWRcclxuICogICBzcGFjZS5cclxuICovXHJcbk5hdk1lc2guX2dlb21ldHJ5LnBhcnRpdGlvbkFyZWEgPSBmdW5jdGlvbihhcmVhKSB7XHJcbiAgcmV0dXJuIE5hdk1lc2guX2dlb21ldHJ5LmNvbnZleFBhcnRpdGlvbihhcmVhLnBvbHlnb24sIGFyZWEuaG9sZXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBhcnRpdGlvbiB0aGUgcHJvdmlkZWQgYXJlYXMuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPEFyZWE+fSBhcmVhcyAtIFRoZSBhcmVhcyB0byBwYXJ0aXRpb24uXHJcbiAqIEByZXR1cm4ge0FycmF5LjxQb2x5Pn0gLSBQb2x5Z29ucyByZXByZXNlbnRpbmcgdGhlIHBhcnRpdGlvbmVkXHJcbiAqICAgc3BhY2UuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5wYXJ0aXRpb25BcmVhcyA9IGZ1bmN0aW9uKGFyZWFzKSB7XHJcbiAgdmFyIHBvbHlzID0gYXJlYXMubWFwKE5hdk1lc2guX2dlb21ldHJ5LnBhcnRpdGlvbkFyZWEpO1xyXG4gIHJldHVybiBOYXZNZXNoLl91dGlsLmZsYXR0ZW4ocG9seXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEEgcG9pbnQgaW4gQ2xpcHBlckxpYiBpcyBqdXN0IGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXNcclxuICogWCBhbmQgWSBjb3JyZXNwb25kaW5nIHRvIGEgcG9pbnQuXHJcbiAqIEB0eXBlZGVmIENMUG9pbnRcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtpbnRlZ2VyfSBYIC0gVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXHJcbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gWSAtIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxyXG4gKi9cclxuLyoqXHJcbiAqIEEgc2hhcGUgaW4gQ2xpcHBlckxpYiBpcyBzaW1wbHkgYW4gYXJyYXkgb2YgQ0xQb2ludHMuXHJcbiAqIEB0eXBlZGVmIENMU2hhcGVcclxuICogQHR5cGUge0FycmF5LjxDTFBvaW50Pn1cclxuICovXHJcbi8qKlxyXG4gKiBUYWtlcyBhIFBvbHkgYW5kIGNvbnZlcnRzIGl0IGludG8gYSBDbGlwcGVyTGliIHBvbHlnb24uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7UG9seX0gcG9seSAtIFRoZSBQb2x5IHRvIGNvbnZlcnQuXHJcbiAqIEByZXR1cm4ge0NMU2hhcGV9IC0gVGhlIGNvbnZlcnRlZCBwb2x5Z29uLlxyXG4gKi9cclxuTmF2TWVzaC5fZ2VvbWV0cnkuY29udmVydFBvbHlUb0NsaXBwZXIgPSBmdW5jdGlvbihwb2x5KSB7XHJcbiAgcmV0dXJuIHBvbHkucG9pbnRzLm1hcChmdW5jdGlvbihwKSB7XHJcbiAgICByZXR1cm4ge1g6cC54LCBZOnAueX07XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIENsaXBwZXJMaWIgc2hhcGUgaW50byBhIFBvbHkuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7Q0xTaGFwZX0gY2xpcCAtIFRoZSBzaGFwZSB0byBjb252ZXJ0LlxyXG4gKiBAcmV0dXJuIHtQb2x5fSAtIFRoZSBjb252ZXJ0ZWQgc2hhcGUuXHJcbiAqL1xyXG5OYXZNZXNoLl9nZW9tZXRyeS5jb252ZXJ0Q2xpcHBlclRvUG9seSA9IGZ1bmN0aW9uKGNsaXApIHtcclxuICB2YXIgcG9pbnRzID0gY2xpcC5tYXAoZnVuY3Rpb24ocCkge1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludChwLlgsIHAuWSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG5ldyBQb2x5KHBvaW50cyk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2VuZXJhdGUgYSBib3VuZGluZyBzaGFwZSBmb3IgcGF0aHMgd2l0aCBhIGdpdmVuIGJ1ZmZlci4gSWYgdXNpbmdcclxuICogZm9yIGFuIG9mZnNldHRpbmcgb3BlcmF0aW9uLCB0aGUgcmV0dXJuZWQgQ0xTaGFwZSBkb2VzIE5PVCBuZWVkIHRvXHJcbiAqIGJlIHNjYWxlZCB1cC5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48Q0xTaGFwZT59IHBhdGhzIC0gVGhlIHBhdGhzIHRvIGdldCBhIGJvdW5kaW5nIHNoYXBlIGZvci5cclxuICogQHBhcmFtIHtpbnRlZ2VyfSBbYnVmZmVyPTVdIC0gSG93IG1hbnkgdW5pdHMgdG8gcGFkIHRoZSBib3VuZGluZ1xyXG4gKiAgIHJlY3RhbmdsZS5cclxuICogQHJldHVybiB7Q0xTaGFwZX0gLSBBIGJvdW5kaW5nIHJlY3RhbmdsZSBmb3IgdGhlIHBhdGhzLlxyXG4gKi9cclxuTmF2TWVzaC5fZ2VvbWV0cnkuZ2V0Qm91bmRpbmdTaGFwZUZvclBhdGhzID0gZnVuY3Rpb24ocGF0aHMsIGJ1ZmZlcikge1xyXG4gIGlmICh0eXBlb2YgYnVmZmVyID09IFwidW5kZWZpbmVkXCIpIGJ1ZmZlciA9IDU7XHJcbiAgdmFyIGJvdW5kcyA9IENsaXBwZXJMaWIuQ2xpcHBlci5HZXRCb3VuZHMocGF0aHMpO1xyXG4gIGJvdW5kcy5sZWZ0IC09IGJ1ZmZlcjtcclxuICBib3VuZHMudG9wIC09IGJ1ZmZlcjtcclxuICBib3VuZHMucmlnaHQgKz0gYnVmZmVyO1xyXG4gIGJvdW5kcy5ib3R0b20gKz0gYnVmZmVyO1xyXG4gIHZhciBzaGFwZSA9IFtdO1xyXG4gIHNoYXBlLnB1c2goe1g6IGJvdW5kcy5yaWdodCwgWTogYm91bmRzLmJvdHRvbX0pO1xyXG4gIHNoYXBlLnB1c2goe1g6IGJvdW5kcy5sZWZ0LCBZOiBib3VuZHMuYm90dG9tfSk7XHJcbiAgc2hhcGUucHVzaCh7WDogYm91bmRzLmxlZnQsIFk6IGJvdW5kcy50b3B9KTtcclxuICBzaGFwZS5wdXNoKHtYOiBib3VuZHMucmlnaHQsIFk6IGJvdW5kcy50b3B9KTtcclxuICByZXR1cm4gc2hhcGU7XHJcbn07XHJcblxyXG4vKipcclxuICogSG9sZHMgdXRpbGl0eSBtZXRob2RzIG5lZWRlZCBieSB0aGUgbmF2bWVzaC5cclxuICogQHByaXZhdGVcclxuICovXHJcbk5hdk1lc2guX3V0aWwgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBpdGVtcyBhdCB0aGUgaW5kaWNlcyBpZGVudGlmaWVkIGluXHJcbiAqIGBpbmRpY2VzYC5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheX0gYXJ5IC0gVGhlIGFycmF5IHRvIHJlbW92ZSBpdGVtcyBmcm9tLlxyXG4gKiBAcGFyYW0ge0FycmF5LjxpbnRlZ2VyPn0gaW5kaWNlcyAtIFRoZSBpbmRpY2VzIGZyb20gd2hpY2ggdG9cclxuICogICByZW1vdmUgdGhlIGl0ZW1zIGZyb20gaW4gYXJ5LiBJbmRpY2VzIHNob3VsZCBiZSB1bmlxdWUgYW5kXHJcbiAqICAgZWFjaCBzaG91bGQgYmUgbGVzcyB0aGFuIHRoZSBsZW5ndGggb2YgYGFyeWAgaXRzZWxmLlxyXG4gKiBAcmV0dXJuIHtBcnJheX0gLSBUaGUgaXRlbXMgcmVtb3ZlZCBmcm9tIGFyeS5cclxuICovXHJcbk5hdk1lc2guX3V0aWwuc3BsaWNlID0gZnVuY3Rpb24oYXJ5LCBpbmRpY2VzKSB7XHJcbiAgaW5kaWNlcyA9IGluZGljZXMuc29ydChOYXZNZXNoLl91dGlsLl9udW1iZXJDb21wYXJlKS5yZXZlcnNlKCk7XHJcbiAgdmFyIHJlbW92ZWQgPSBbXTtcclxuICBpbmRpY2VzLmZvckVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgcmVtb3ZlZC5wdXNoKGFyeS5zcGxpY2UoaSwgMSlbMF0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiByZW1vdmVkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXBhcmlzb24gZnVuY3Rpb24gZm9yIG51bWJlcnMuXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5OYXZNZXNoLl91dGlsLl9udW1iZXJDb21wYXJlID0gZnVuY3Rpb24oYSwgYikge1xyXG4gIGlmIChhIDwgYikge1xyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH0gZWxzZSBpZiAoYSA+IGIpIHtcclxuICAgIHJldHVybiAxO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVGFrZSBhbiBhcnJheSBvZiBhcnJheXMgYW5kIGZsYXR0ZW4gaXQuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSAge0FycmF5LjxBcnJheS48Kj4+fSBhcnkgLSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cclxuICogQHJldHVybiB7QXJyYXkuPCo+fSAtIFRoZSBmbGF0dGVuZWQgYXJyYXkuXHJcbiAqL1xyXG5OYXZNZXNoLl91dGlsLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnkpIHtcclxuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgYXJ5KTtcclxufTtcclxuIiwiLyoqXHJcbiAqIEBpZ25vcmVcclxuICogQG1vZHVsZSBNYXBQYXJzZXJcclxuICovXHJcblxyXG52YXIgQWN0aW9uVmFsdWVzID0gcmVxdWlyZSgnLi9hY3Rpb24tdmFsdWVzJyk7XHJcbnZhciBnZW8gPSByZXF1aXJlKCcuL2dlb21ldHJ5Jyk7XHJcbnZhciBQb2ludCA9IGdlby5Qb2ludDtcclxudmFyIFBvbHkgPSBnZW8uUG9seTtcclxuXHJcbi8qKlxyXG4gKiBDb250YWlucyB1dGlsaXRpZXMgZm9yIGdlbmVyYXRpbmcgdXNhYmxlIG1hcCByZXByZXNlbnRhdGlvbnMgZnJvbVxyXG4gKiBtYXAgdGlsZXMuXHJcbiAqL1xyXG52YXIgTWFwUGFyc2VyID0ge307XHJcblxyXG4vKipcclxuICogQW4gb2JqZWN0IHdpdGggeCBhbmQgeSBwcm9wZXJ0aWVzIHRoYXQgcmVwcmVzZW50cyBhIGNvb3JkaW5hdGUgcGFpci5cclxuICogQHByaXZhdGVcclxuICogQHR5cGVkZWYgTVBQb2ludFxyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGxvY2F0aW9uLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIGxvY2F0aW9uLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBIFNoYXBlIGlzIGFuIGFycmF5IG9mIHBvaW50cywgd2hlcmUgcG9pbnRzIGFyZSBvYmplY3RzIHdpdGggeCBhbmQgeSBwcm9wZXJ0aWVzIHdoaWNoIHJlcHJlc2VudCBjb29yZGluYXRlcyBvbiB0aGUgbWFwLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAdHlwZWRlZiBNUFNoYXBlXHJcbiAqIEB0eXBlIHtBcnJheS48TVBQb2ludD59XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEFuIG9iamVjdCB3aXRoIHIgYW5kIGMgcHJvcGVydGllcyB0aGF0IHJlcHJlc2VudHMgYSByb3cvY29sdW1uXHJcbiAqIGxvY2F0aW9uIGluIGEgMmQgYXJyYXkuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEB0eXBlZGVmIEFycmF5TG9jXHJcbiAqIEB0eXBlIHtvYmplY3R9XHJcbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gciAtIFRoZSByb3cgbnVtYmVyIG9mIHRoZSBhcnJheSBsb2NhdGlvbi5cclxuICogQHByb3BlcnR5IHtpbnRlZ2VyfSBjIC0gVGhlIGNvbHVtbiBudW1iZXIgb2YgdGhlIGFycmF5IGxvY2F0aW9uLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBUaGUgMmQgdGlsZSBncmlkIGZyb20gYHRhZ3Byby5tYXBgLCBvciBhIHNpbWlsYXIgMmQgZ3JpZCByZXN1bHRpbmdcclxuICogZnJvbSBhbiBvcGVyYXRpb24gb24gdGhlIG9yaWdpbmFsLlxyXG4gKiBAdHlwZWRlZiBNYXBUaWxlc1xyXG4gKiBAdHlwZSB7QXJyYXkuPEFycmF5LjxudW1iZXI+Pn1cclxuICovXHJcblxyXG4vKipcclxuICogQSBDZWxsIGlzIGp1c3QgYW4gYXJyYXkgdGhhdCBob2xkcyB0aGUgdmFsdWVzIG9mIHRoZSBmb3VyIGFkamFjZW50XHJcbiAqIGNlbGxzIGluIGEgMmQgYXJyYXksIHJlY29yZGVkIGluIENDVyBvcmRlciBzdGFydGluZyBmcm9tIHRoZSB1cHBlci1cclxuICogbGVmdCBxdWFkcmFudC4gRm9yIGV4YW1wbGUsIGdpdmVuIGEgMmQgYXJyYXk6XHJcbiAqIFtbMSwgMCwgMV0sXHJcbiAqICBbMSwgMCwgMF0sXHJcbiAqICBbMSwgMSwgMV1dXHJcbiAqIHdlIHdvdWxkIGdlbmVyYXRlIHRoZSByZXByZXNlbnRhdGlvbiB1c2luZyB0aGUgY2VsbHM6XHJcbiAqIFsxLCAwLCAgWzAsIDEsICBbMSwgMCwgIFswLCAwICBcclxuICogIDEsIDBdICAgMCwgMF0gICAxLCAxXSAgIDEsIDFdLlxyXG4gKiBUaGVzZSBjb3JyZXNwb25kIHRvIHRoZSBwYXJ0cyBvZiBhIHRpbGUgdGhhdCB3b3VsZCBiZSBjb3ZlcmVkIGlmXHJcbiAqIHBsYWNlZCBhdCB0aGUgaW50ZXJzZWN0aW9uIG9mIDQgdGlsZXMuIFRoZSB2YWx1ZSAwIHJlcHJlc2VudHMgYVxyXG4gKiBibGFuayBsb2NhdGlvbiwgMSBpbmRpY2F0ZXMgdGhhdCB0aGUgcXVhZHJhbnQgaXMgY292ZXJlZC5cclxuICogVG8gcmVwcmVzZW50IGhvdyBzdWNoIHRpbGVzIHdvdWxkIGJlIGNvdmVyZWQgaW4gdGhlIGNhc2Ugb2YgZGlhZ29uYWxcclxuICogdGlsZXMsIHdlIHVzZSAyIHRvIGluZGljYXRlIHRoYXQgdGhlIGxvd2VyIGRpYWdvbmFsIG9mIGEgcXVhZHJhbnQgaXNcclxuICogZmlsbGVkLCBhbmQgMyB0byBpbmRpY2F0ZSB0aGF0IHRoZSB1cHBlciBkaWFnb25hbCBvZiBhIHF1YWRyYW50IGlzXHJcbiAqIGZpbGxlZC4gVGhlIHRpbGVzIGF2YWlsYWJsZSBmb3JjZSB0aGUgZGlhZ29uYWxzIG9mIGVhY2ggcXVhZHJhbnQgdG9cclxuICogcG9pbnQgdG8gdGhlIGNlbnRlciwgc28gdGhpcyBpcyBzdWZmaWNpZW50IGZvciBkZXNjcmliaW5nIGFsbFxyXG4gKiBwb3NzaWJsZSBvdmVybGFwcGluZ3MuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEB0eXBlZGVmIENlbGxcclxuICogQHR5cGUge0FycmF5LjxudW1iZXI+fVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBDYWxsYmFjayB0aGF0IHJlY2VpdmVzIGVhY2ggb2YgdGhlIGVsZW1lbnRzIGluIHRoZSAyZCBtYXAgZnVuY3Rpb24uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBjYWxsYmFjayBtYXBDYWxsYmFja1xyXG4gKiBAcGFyYW0geyp9IC0gVGhlIGVsZW1lbnQgZnJvbSB0aGUgMmQgYXJyYXkuXHJcbiAqIEByZXR1cm4geyp9IC0gVGhlIHRyYW5zZm9ybWVkIGVsZW1lbnQuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEFwcGxpZXMgYGZuYCB0byBldmVyeSBpbmRpdmlkdWFsIGVsZW1lbnQgb2YgdGhlIDJkIGFycmF5IGBhcnJgLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjxBcnJheS48Kj4+fSBhcnIgLSBUaGUgMmQgYXJyYXkgdG8gdXNlLlxyXG4gKiBAcGFyYW0ge21hcENhbGxiYWNrfSBmbiAtIFRoZSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQuXHJcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48Kj4+fSAtIFRoZSAyZCBhcnJheSBhZnRlciB0aGUgZnVuY3Rpb25cclxuICogICBoYXMgYmVlbiBhcHBsaWVkIHRvIGVhY2ggZWxlbWVudC5cclxuICovXHJcbmZ1bmN0aW9uIG1hcDJkKGFyciwgZm4pIHtcclxuICByZXR1cm4gYXJyLm1hcChmdW5jdGlvbihyb3cpIHtcclxuICAgIHJldHVybiByb3cubWFwKGZuKTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgMSBpZiBhIHRpbGUgdmFsdWUgaXMgb25lIHRoYXQgd2Ugd2FudCB0byBjb25zaWRlciBhc1xyXG4gKiBhIHdhbGwgKHdlIGNvbnNpZGVyIGVtcHR5IHNwYWNlIHRvIGJlIGEgd2FsbCksIG9yIHRoZSB0aWxlIHZhbHVlXHJcbiAqIGl0c2VsZiBmb3IgZGlhZ29uYWwgd2FsbHMuIDAgaXMgcmV0dXJuZWQgb3RoZXJ3aXNlLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gZWx0IC0gVGhlIHRpbGUgdmFsdWUgYXQgYSByb3cvY29sdW1uIGxvY2F0aW9uXHJcbiAqIEByZXR1cm4ge251bWJlcn0gLSBUaGUgbnVtYmVyIHRvIGluc2VydCBpbiBwbGFjZSBvZiB0aGUgdGlsZSB2YWx1ZS5cclxuICovXHJcbmZ1bmN0aW9uIGlzQmFkQ2VsbChlbHQpIHtcclxuICB2YXIgYmFkX2NlbGxzID0gWzEsIDEuMSwgMS4yLCAxLjMsIDEuNF07XHJcbiAgaWYoYmFkX2NlbGxzLmluZGV4T2YoZWx0KSAhPT0gLTEpIHtcclxuICAgIC8vIEVuc3VyZSBlbXB0eSBzcGFjZXMgZ2V0IG1hcHBlZCB0byBmdWxsIHRpbGVzIHNvIG91dHNpZGUgb2ZcclxuICAgIC8vIG1hcCBpc24ndCB0cmFjZWQuXHJcbiAgICBpZiAoZWx0ID09IDApIHtcclxuICAgICAgcmV0dXJuIDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZWx0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsdDtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdGhlIHByb3ZpZGVkIGFycmF5IGludG8gaXRzIGVxdWl2YWxlbnQgcmVwcmVzZW50YXRpb25cclxuICogdXNpbmcgY2VsbHMuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7TWFwVGlsZXN9IGFyciAtIFxyXG4gKiBAcGFyYW0ge0FycmF5LjxBcnJheS48Q2VsbD4+fSAtIFRoZSBjb252ZXJ0ZWQgYXJyYXkuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbnRvdXJHcmlkKGFycikge1xyXG4gIC8vIEdlbmVyYXRlIGdyaWQgZm9yIGhvbGRpbmcgdmFsdWVzLlxyXG4gIHZhciBjb250b3VyX2dyaWQgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCAtIDEpO1xyXG4gIGZvciAodmFyIG4gPSAwOyBuIDwgY29udG91cl9ncmlkLmxlbmd0aDsgbisrKSB7XHJcbiAgICBjb250b3VyX2dyaWRbbl0gPSBuZXcgQXJyYXkoYXJyWzBdLmxlbmd0aCAtIDEpO1xyXG4gIH1cclxuICB2YXIgY29ybmVycyA9IFsxLjEsIDEuMiwgMS4zLCAxLjRdO1xyXG4gIC8vIFNwZWNpZmllcyB0aGUgcmVzdWx0aW5nIHZhbHVlcyBmb3IgdGhlIGFib3ZlIGNvcm5lciB2YWx1ZXMuIFRoZSBpbmRleFxyXG4gIC8vIG9mIHRoZSBvYmplY3RzIGluIHRoaXMgYXJyYXkgY29ycmVzcG9uZHMgdG8gdGhlIHByb3BlciB2YWx1ZXMgZm9yIHRoZVxyXG4gIC8vIHF1YWRyYW50IG9mIHRoZSBzYW1lIGluZGV4LlxyXG4gIHZhciBjb3JuZXJfdmFsdWVzID0gW1xyXG4gICAgezEuMTogMywgMS4yOiAwLCAxLjM6IDIsIDEuNDogMX0sXHJcbiAgICB7MS4xOiAwLCAxLjI6IDMsIDEuMzogMSwgMS40OiAyfSxcclxuICAgIHsxLjE6IDMsIDEuMjogMSwgMS4zOiAyLCAxLjQ6IDB9LFxyXG4gICAgezEuMTogMSwgMS4yOiAzLCAxLjM6IDAsIDEuNDogMn1cclxuICBdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgKGFyci5sZW5ndGggLSAxKTsgaSsrKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IChhcnJbMF0ubGVuZ3RoIC0gMSk7IGorKykge1xyXG4gICAgICB2YXIgY2VsbCA9IFthcnJbaV1bal0sIGFycltpXVtqKzFdLCBhcnJbaSsxXVtqKzFdLCBhcnJbaSsxXVtqXV07XHJcbiAgICAgIC8vIENvbnZlcnQgY29ybmVyIHRpbGVzIHRvIGFwcHJvcHJpYXRlIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICBjZWxsLmZvckVhY2goZnVuY3Rpb24odmFsLCBpLCBjZWxsKSB7XHJcbiAgICAgICAgaWYgKGNvcm5lcnMuaW5kZXhPZih2YWwpICE9PSAtMSkge1xyXG4gICAgICAgICAgY2VsbFtpXSA9IGNvcm5lcl92YWx1ZXNbaV1bdmFsXTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29udG91cl9ncmlkW2ldW2pdID0gY2VsbDtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGNvbnRvdXJfZ3JpZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENhbGxiYWNrIGZ1bmN0aW9uIGZvciB0ZXN0aW5nIGVxdWFsaXR5IG9mIGl0ZW1zLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAY2FsbGJhY2sgY29tcGFyaXNvbkNhbGxiYWNrXHJcbiAqIEBwYXJhbSB7Kn0gLSBUaGUgZmlyc3QgaXRlbS5cclxuICogQHBhcmFtIHsqfSAtIFRoZSBzZWNvbmQgaXRlbS5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIG9yIG5vdCB0aGUgaXRlbXMgYXJlIGVxdWFsLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBsb2NhdGlvbiBvZiBvYmogaW4gYXJyIHdpdGggZXF1YWxpdHkgZGV0ZXJtaW5lZCBieSBjbXAuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBhcnIgLSBUaGUgYXJyYXkgdG8gYmUgc2VhcmNoZWQuXHJcbiAqIEBwYXJhbSB7Kn0gb2JqIC0gVGhlIGl0ZW0gdG8gZmluZCBhIG1hdGNoIGZvci5cclxuICogQHBhcmFtIHtjb21wYXJpc29uQ2FsbGJhY2t9IGNtcCAtIFRoZSBjYWxsYmFjayB0aGF0IGRlZmluZXNcclxuICogICB3aGV0aGVyIGBvYmpgIG1hdGNoZXMuXHJcbiAqIEByZXR1cm4ge2ludGVnZXJ9IC0gVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IHRvIG1hdGNoIGBvYmpgLFxyXG4gKiAgIG9yIC0xIGlmIG5vIHN1Y2ggZWxlbWVudCB3YXMgbG9jYXRlZC5cclxuICovXHJcbmZ1bmN0aW9uIGZpbmQoYXJyLCBvYmosIGNtcCkge1xyXG4gIGlmICh0eXBlb2YgY21wICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGNtcChhcnJbaV0sIG9iaikpIHtcclxuICAgICAgICByZXR1cm4gaTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENvbXBhcmUgdHdvIG9iamVjdHMgZGVmaW5pbmcgcm93L2NvbCBsb2NhdGlvbnMgaW4gYW4gYXJyYXlcclxuICogYW5kIHJldHVybiB0cnVlIGlmIHRoZXkgcmVwcmVzZW50IHRoZSBzYW1lIHJvdy9jb2wgbG9jYXRpb24uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXlMb2N9IGVsdDFcclxuICogQHBhcmFtIHtBcnJheUxvY30gZWx0MlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgb3Igbm90IHRoZXNlIHR3byBhcnJheSBsb2NhdGlvbnNcclxuICogICByZXByZXNlbnQgdGhlIHNhbWUgcm93L2NvbHVtbi5cclxuICovXHJcbmZ1bmN0aW9uIGVsdENvbXBhcmUoZWx0MSwgZWx0Mikge1xyXG4gIHJldHVybiAoZWx0MS5jID09IGVsdDIuYyAmJiBlbHQxLnIgPT0gZWx0Mi5yKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRha2VzIGluIHRoZSB2ZXJ0ZXgvYWN0aW9uIGluZm9ybWF0aW9uIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFycmF5cyxcclxuICogd2hlcmUgZWFjaCBhcnJheSBjb3JyZXNwb25kcyB0byBhIHNoYXBlIGFuZCBlYWNoIGVsZW1lbnQgb2YgdGhlIGFycmF5IGlzXHJcbiAqIGEgdmVydGV4IHdoaWNoIGlzIGNvbm5lY3RlZCB0byBpdCdzIHByZXZpb3VzIGFuZCBuZXh0IG5laWdoYm9yIChjaXJjdWxhcikuXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7fSBhY3Rpb25JbmZvXHJcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheTxBcnJheUxvYz4+fSAtIEFycmF5IG9mIHZlcnRleCBsb2NhdGlvbnMgaW4gXHJcbiAqL1xyXG5mdW5jdGlvbiBnZW5lcmF0ZVNoYXBlcyhhY3Rpb25JbmZvKSB7XHJcbiAgLy8gVG90YWwgbnVtYmVyIG9mIGNlbGxzLlxyXG4gIHZhciB0b3RhbCA9IGFjdGlvbkluZm8ubGVuZ3RoICogYWN0aW9uSW5mb1swXS5sZW5ndGg7XHJcbiAgdmFyIGRpcmVjdGlvbnMgPSB7XHJcbiAgICBcIm5cIjogWy0xLCAwXSxcclxuICAgIFwiZVwiOiBbMCwgMV0sXHJcbiAgICBcInNcIjogWzEsIDBdLFxyXG4gICAgXCJ3XCI6IFswLCAtMV0sXHJcbiAgICBcIm5lXCI6IFstMSwgMV0sXHJcbiAgICBcInNlXCI6IFsxLCAxXSxcclxuICAgIFwic3dcIjogWzEsIC0xXSxcclxuICAgIFwibndcIjogWy0xLCAtMV1cclxuICB9O1xyXG4gIC8vIFRha2VzIHRoZSBjdXJyZW50IGxvY2F0aW9uIGFuZCBkaXJlY3Rpb24gYXQgdGhpcyBwb2ludCBhbmRcclxuICAvLyByZXR1cm5zIHRoZSBuZXh0IGxvY2F0aW9uIHRvIGNoZWNrLiBSZXR1cm5zIG51bGwgaWYgdGhpcyBjZWxsIGlzXHJcbiAgLy8gbm90IHBhcnQgb2YgYSBzaGFwZS5cclxuICBmdW5jdGlvbiBuZXh0TmVpZ2hib3IoZWx0LCBkaXIpIHtcclxuICAgIHZhciBkcm93ID0gMCwgZGNvbCA9IDA7XHJcbiAgICBpZiAoZGlyID09IFwibm9uZVwiKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG9mZnNldCA9IGRpcmVjdGlvbnNbZGlyXTtcclxuICAgICAgcmV0dXJuIHtyOiBlbHQuciArIG9mZnNldFswXSwgYzogZWx0LmMgKyBvZmZzZXRbMV19O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gR2V0IHRoZSBuZXh0IGNlbGwsIGZyb20gbGVmdCB0byByaWdodCwgdG9wIHRvIGJvdHRvbS4gUmV0dXJucyBudWxsXHJcbiAgLy8gaWYgbGFzdCBlbGVtZW50IGluIGFycmF5IHJlYWNoZWQuXHJcbiAgZnVuY3Rpb24gbmV4dENlbGwoZWx0KSB7XHJcbiAgICBpZiAoZWx0LmMgKyAxIDwgYWN0aW9uSW5mb1tlbHQucl0ubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiB7cjogZWx0LnIsIGM6IGVsdC5jICsgMX07XHJcbiAgICB9IGVsc2UgaWYgKGVsdC5yICsgMSA8IGFjdGlvbkluZm8ubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiB7cjogZWx0LnIgKyAxLCBjOiAwfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IGlkZW50aWZpZXIgZm9yIGdpdmVuIG5vZGUgYW5kIGRpcmVjdGlvblxyXG4gIGZ1bmN0aW9uIGdldElkZW50aWZpZXIobm9kZSwgZGlyKSB7XHJcbiAgICByZXR1cm4gXCJyXCIgKyBub2RlLnIgKyBcImNcIiArIG5vZGUuYyArIFwiZFwiICsgZGlyO1xyXG4gIH1cclxuICBcclxuICB2YXIgZGlzY292ZXJlZCA9IFtdO1xyXG4gIHZhciBub2RlID0ge3I6IDAsIGM6IDB9O1xyXG4gIHZhciBzaGFwZXMgPSBbXTtcclxuICB2YXIgY3VycmVudF9zaGFwZSA9IFtdO1xyXG4gIHZhciBzaGFwZV9ub2RlX3N0YXJ0ID0gbnVsbDtcclxuICB2YXIgbGFzdF9hY3Rpb24gPSBudWxsO1xyXG4gIC8vIE9iamVjdCB0byB0cmFjayBsb2NhdGlvbiArIGFjdGlvbnMgdGhhdCBoYXZlIGJlZW4gdGFrZW4uXHJcbiAgdmFyIHRha2VuX2FjdGlvbnMgPSB7fTtcclxuICB2YXIgaXRlcmF0aW9ucyA9IDA7XHJcblxyXG4gIC8vIEl0ZXJhdGUgdW50aWwgYWxsIG5vZGVzIGhhdmUgYmVlbiB2aXNpdGVkLlxyXG4gIHdoaWxlIChkaXNjb3ZlcmVkLmxlbmd0aCAhPT0gdG90YWwpIHtcclxuICAgIGlmICghbm9kZSkge1xyXG4gICAgICAvLyBSZWFjaGVkIGVuZC5cclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBpZiAoaXRlcmF0aW9ucyA+IHRvdGFsICogNCkge1xyXG4gICAgICAvLyBTYW5pdHkgY2hlY2sgb24gbnVtYmVyIG9mIGl0ZXJhdGlvbnMuIE1heGltdW0gbnVtYmVyIG9mXHJcbiAgICAgIC8vIHRpbWVzIGEgc2luZ2xlIHRpbGUgd291bGQgYmUgdmlzaXRlZCBpcyA0IGZvciBhIGZhbi1saWtlXHJcbiAgICAgIC8vIHBhdHRlcm4gb2YgdHJpYW5nbGUgd2FsbCB0aWxlcy5cclxuICAgICAgYnJlYWs7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVyYXRpb25zKys7XHJcbiAgICB9XHJcbiAgICAvLyBJdCdzIG9rYXkgdG8gYmUgaW4gYSBkaXNjb3ZlcmVkIG5vZGUgaWYgc2hhcGVzIGFyZSBhZGphY2VudCxcclxuICAgIC8vIHdlIGp1c3Qgd2FudCB0byBrZWVwIHRyYWNrIG9mIHRoZSBvbmVzIHdlJ3ZlIHNlZW4uXHJcbiAgICBpZiAoZmluZChkaXNjb3ZlcmVkLCBub2RlLCBlbHRDb21wYXJlKSA9PSAtMSkge1xyXG4gICAgICBkaXNjb3ZlcmVkLnB1c2gobm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFjdGlvbiA9IGFjdGlvbkluZm9bbm9kZS5yXVtub2RlLmNdO1xyXG4gICAgdmFyIGRpcjtcclxuICAgIC8vIElmIGFjdGlvbiBoYXMgbXVsdGlwbGUgcG9zc2liaWxpdGllcy5cclxuICAgIGlmIChhY3Rpb24gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAvLyBQYXJ0IG9mIGEgc2hhcGUsIGZpbmQgdGhlIGluZm8gd2l0aCB0aGF0IHByZXZpb3VzIGFjdGlvbiBhc1xyXG4gICAgICAvLyBpbl9kaXIuXHJcbiAgICAgIGlmIChsYXN0X2FjdGlvbiAhPT0gXCJub25lXCIpIHtcclxuICAgICAgICB2YXIgYWN0aW9uX2ZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3Rpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciB0aGlzX2FjdGlvbiA9IGFjdGlvbltpXTtcclxuICAgICAgICAgIGlmICh0aGlzX2FjdGlvbltcImxvY1wiXVtcImluX2RpclwiXSA9PSBsYXN0X2FjdGlvbikge1xyXG4gICAgICAgICAgICBhY3Rpb24gPSB0aGlzX2FjdGlvbjtcclxuICAgICAgICAgICAgZGlyID0gdGhpc19hY3Rpb25bXCJsb2NcIl1bXCJvdXRfZGlyXCJdO1xyXG4gICAgICAgICAgICBhY3Rpb25fZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYWN0aW9uX2ZvdW5kKSB7XHJcbiAgICAgICAgICB0aHJvdyBcIkVycm9yIVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBGaW5kIHRoZSBmaXJzdCBhY3Rpb24gdGhhdCBoYXMgbm90IGJlZW4gdGFrZW4gcHJldmlvdXNseS5cclxuICAgICAgICB2YXIgYWN0aW9uX2ZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3Rpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciB0aGlzX2FjdGlvbiA9IGFjdGlvbltpXTtcclxuICAgICAgICAgIGlmICghdGFrZW5fYWN0aW9uc1tnZXRJZGVudGlmaWVyKG5vZGUsIHRoaXNfYWN0aW9uW1wibG9jXCJdW1wib3V0X2RpclwiXSldKSB7XHJcbiAgICAgICAgICAgIGFjdGlvbiA9IHRoaXNfYWN0aW9uXHJcbiAgICAgICAgICAgIGRpciA9IHRoaXNfYWN0aW9uW1wibG9jXCJdW1wib3V0X2RpclwiXTtcclxuICAgICAgICAgICAgYWN0aW9uX2ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghYWN0aW9uX2ZvdW5kKSB7XHJcbiAgICAgICAgICB0aHJvdyBcIkVycm9yIVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHsgLy8gQWN0aW9uIG9ubHkgaGFzIHNpbmdsZSBwb3NzaWJpbGl0eS5cclxuICAgICAgZGlyID0gYWN0aW9uLmxvYztcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZXQgbm9kZS9hY3Rpb24gYXMgaGF2aW5nIGJlZW4gdmlzaXRlZC5cclxuICAgIHRha2VuX2FjdGlvbnNbZ2V0SWRlbnRpZmllcihub2RlLCBkaXIpXSA9IHRydWU7XHJcblxyXG4gICAgbGFzdF9hY3Rpb24gPSBkaXI7XHJcbiAgICB2YXIgbmV4dCA9IG5leHROZWlnaGJvcihub2RlLCBkaXIpO1xyXG4gICAgaWYgKG5leHQpIHsgLy8gUGFydCBvZiBhIHNoYXBlLlxyXG4gICAgICAvLyBTYXZlIGxvY2F0aW9uIGZvciByZXN0YXJ0aW5nIGFmdGVyIHRoaXMgc2hhcGUgaGFzIGJlZW4gZGVmaW5lZC5cclxuICAgICAgdmFyIGZpcnN0ID0gZmFsc2U7XHJcbiAgICAgIGlmIChjdXJyZW50X3NoYXBlLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgZmlyc3QgPSB0cnVlO1xyXG4gICAgICAgIHNoYXBlX25vZGVfc3RhcnQgPSBub2RlO1xyXG4gICAgICAgIHNoYXBlX25vZGVfc3RhcnRfYWN0aW9uID0gbGFzdF9hY3Rpb247XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIEN1cnJlbnQgbm9kZSBhbmQgZGlyZWN0aW9uIGlzIHNhbWUgYXMgYXQgc3RhcnQgb2Ygc2hhcGUsXHJcbiAgICAgIC8vIHNoYXBlIGhhcyBiZWVuIGV4cGxvcmVkLlxyXG4gICAgICBpZiAoIWZpcnN0ICYmIGVsdENvbXBhcmUobm9kZSwgc2hhcGVfbm9kZV9zdGFydCkgJiYgbGFzdF9hY3Rpb24gPT0gc2hhcGVfbm9kZV9zdGFydF9hY3Rpb24pIHtcclxuICAgICAgICBzaGFwZXMucHVzaChjdXJyZW50X3NoYXBlKTtcclxuICAgICAgICBjdXJyZW50X3NoYXBlID0gW107XHJcbiAgICAgICAgLy8gR2V0IHRoZSBuZXh0IHVuZGlzY292ZXJlZCBub2RlLlxyXG4gICAgICAgIG5vZGUgPSBuZXh0Q2VsbChzaGFwZV9ub2RlX3N0YXJ0KTtcclxuICAgICAgICB3aGlsZSAobm9kZSAmJiAoZmluZChkaXNjb3ZlcmVkLCBub2RlLCBlbHRDb21wYXJlKSAhPT0gLTEpKSB7XHJcbiAgICAgICAgICBub2RlID0gbmV4dENlbGwobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYXBlX25vZGVfc3RhcnQgPSBudWxsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChhY3Rpb24udiB8fCBmaXJzdCkge1xyXG4gICAgICAgICAgY3VycmVudF9zaGFwZS5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBub2RlID0gbmV4dDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHsgLy8gTm90IHBhcnQgb2YgYSBzaGFwZS5cclxuICAgICAgbm9kZSA9IG5leHRDZWxsKG5vZGUpO1xyXG4gICAgICAvLyBHZXQgdGhlIG5leHQgdW5kaXNjb3ZlcmVkIG5vZGUuXHJcbiAgICAgIHdoaWxlIChub2RlICYmIChmaW5kKGRpc2NvdmVyZWQsIG5vZGUsIGVsdENvbXBhcmUpICE9PSAtMSkpIHtcclxuICAgICAgICBub2RlID0gbmV4dENlbGwobm9kZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9IC8vIGVuZCB3aGlsZVxyXG5cclxuICBpZiAoZGlzY292ZXJlZC5sZW5ndGggPT0gdG90YWwpIHtcclxuICAgIHJldHVybiBzaGFwZXM7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG5cclxuLy8gUmV0dXJuIHdoZXRoZXIgdGhlcmUgc2hvdWxkIGJlIGEgdmVydGV4IGF0IHRoZSBnaXZlbiBsb2NhdGlvbiBhbmRcclxuLy8gd2hpY2ggbG9jYXRpb24gdG8gZ28gbmV4dCwgaWYgYW55LlxyXG4vLyBWYWx1ZSByZXR1cm5lZCBpcyBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzICd2JyBhbmQgJ2xvYycuICd2JyBpcyBhIGJvb2xlYW5cclxuLy8gaW5kaWNhdGluZyB3aGV0aGVyIHRoZXJlIGlzIGEgdmVydGV4LCBhbmQgJ2xvYycgZ2l2ZXMgdGhlIG5leHQgbG9jYXRpb24gdG8gbW92ZSwgaWYgYW55LlxyXG4vLyBsb2MgaXMgYSBzdHJpbmcsIG9mIG5vbmUsIGRvd24sIGxlZnQsIHJpZ2h0LCB1cCwgZG93biBjb3JyZXNwb25kaW5nIHRvXHJcbi8vIHRyYWNpbmcgb3V0IGEgc2hhcGUgY2xvY2t3aXNlIChvciB0aGUgaW50ZXJpb3Igb2YgYSBzaGFwZSBDQ1cpLCBvciBhIGZ1bmN0aW9uXHJcbi8vIHRoYXQgdGFrZXMgYSBzdHJpbmcgY29ycmVzcG9uZGluZyB0byB0aGUgZGlyZWN0aW9uIHRha2VuIHRvIGdldCB0byB0aGUgY3VycmVudFxyXG4vLyBjZWxsLlxyXG4vLyBUaGVyZSB3aWxsIG5ldmVyIGJlIGEgdmVydGV4IHdpdGhvdXQgYSBuZXh0IGRpcmVjdGlvbi5cclxuZnVuY3Rpb24gZ2V0QWN0aW9uKGNlbGwpIHtcclxuICB2YXIgc3RyID0gY2VsbFswXSArIFwiLVwiICsgY2VsbFsxXSArIFwiLVwiICsgY2VsbFsyXSArIFwiLVwiICsgY2VsbFszXTtcclxuICByZXR1cm4gQWN0aW9uVmFsdWVzW3N0cl07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGFuIGFycmF5IGxvY2F0aW9uIHRvIGEgcG9pbnQgcmVwcmVzZW50aW5nIHRoZSB0b3AtbGVmdFxyXG4gKiBjb3JuZXIgb2YgdGhlIHRpbGUgaW4gZ2xvYmFsIGNvb3JkaW5hdGVzLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5TG9jfSBsb2NhdGlvbiAtIFRoZSBhcnJheSBsb2NhdGlvbiB0byBnZXQgdGhlXHJcbiAqICAgY29vcmRpbmF0ZXMgZm9yLlxyXG4gKiBAcmV0dXJuIHtNUFBvaW50fSAtIFRoZSBjb29yZGluYXRlcyBvZiB0aGUgdGlsZS5cclxuICovXHJcbmZ1bmN0aW9uIGdldENvb3JkaW5hdGVzKGxvY2F0aW9uKSB7XHJcbiAgdmFyIHRpbGVfd2lkdGggPSA0MDtcclxuICB2YXIgeCA9IGxvY2F0aW9uLnIgKiB0aWxlX3dpZHRoO1xyXG4gIHZhciB5ID0gbG9jYXRpb24uYyAqIHRpbGVfd2lkdGg7XHJcbiAgcmV0dXJuIHt4OiB4LCB5OiB5fTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRha2VzIGluIGFuIGFycmF5IG9mIHNoYXBlcyBhbmQgY29udmVydHMgZnJvbSBjb250b3VyIGdyaWQgbGF5b3V0XHJcbiAqIHRvIGFjdHVhbCBjb29yZGluYXRlcy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48QXJyYXkuPEFycmF5TG9jPj59IHNoYXBlcyAtIG91dHB1dCBmcm9tIGdlbmVyYXRlU2hhcGVzXHJcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48e3t4OiBudW1iZXIsIHk6IG51bWJlcn19Pj59XHJcbiAqL1xyXG5mdW5jdGlvbiBjb252ZXJ0U2hhcGVzVG9Db29yZHMoc2hhcGVzKSB7XHJcbiAgdmFyIHRpbGVfd2lkdGggPSA0MDtcclxuXHJcbiAgdmFyIG5ld19zaGFwZXMgPSBtYXAyZChzaGFwZXMsIGZ1bmN0aW9uKGxvYykge1xyXG4gICAgLy8gSXQgd291bGQgYmUgbG9jLnIgKyAxIGFuZCBsb2MuYyArIDEgYnV0IHRoYXQgaGFzIGJlZW4gcmVtb3ZlZFxyXG4gICAgLy8gdG8gYWNjb3VudCBmb3IgdGhlIG9uZS10aWxlIHdpZHRoIG9mIHBhZGRpbmcgYWRkZWQgaW4gZG9QYXJzZS5cclxuICAgIHZhciByb3cgPSBsb2MuciAqIHRpbGVfd2lkdGg7XHJcbiAgICB2YXIgY29sID0gbG9jLmMgKiB0aWxlX3dpZHRoO1xyXG4gICAgcmV0dXJuIHt4OiByb3csIHk6IGNvbH1cclxuICB9KTtcclxuICByZXR1cm4gbmV3X3NoYXBlcztcclxufVxyXG5cclxuLy8gR2l2ZW4gYW4geCBhbmQgeSB2YWx1ZSwgcmV0dXJuIGEgcG9seWdvbiAob2N0YWdvbikgdGhhdCBhcHByb3hpbWF0ZXNcclxuLy8gYSBzcGlrZSBhdCB0aGUgdGlsZSBnaXZlbiBieSB0aGF0IHgsIHkgbG9jYXRpb24uIFBvaW50cyBpbiBDVyBvcmRlci5cclxuZnVuY3Rpb24gZ2V0U3Bpa2VTaGFwZShjb29yZCkge1xyXG4gIHZhciB4ID0gY29vcmQueCArIDIwLCB5ID0gY29vcmQueSArIDIwO1xyXG4gIHZhciBzcGlrZV9yYWRpdXMgPSAxNDtcclxuICAvLyBhbG1vc3QgPSBzcGlrZV9yYWRpdXMgKiB0YW4ocGkvOCkgZm9yIHRoZSB2ZXJ0aWNlcyBvZiBhIHJlZ3VsYXIgb2N0YWdvbi5cclxuICB2YXIgcG9pbnRfb2Zmc2V0ID0gNS44O1xyXG4gIHJldHVybiBbXHJcbiAgICB7eDogeCAtIHNwaWtlX3JhZGl1cywgeTogeSAtIHBvaW50X29mZnNldH0sXHJcbiAgICB7eDogeCAtIHNwaWtlX3JhZGl1cywgeTogeSArIHBvaW50X29mZnNldH0sXHJcbiAgICB7eDogeCAtIHBvaW50X29mZnNldCwgeTogeSArIHNwaWtlX3JhZGl1c30sXHJcbiAgICB7eDogeCArIHBvaW50X29mZnNldCwgeTogeSArIHNwaWtlX3JhZGl1c30sXHJcbiAgICB7eDogeCArIHNwaWtlX3JhZGl1cywgeTogeSArIHBvaW50X29mZnNldH0sXHJcbiAgICB7eDogeCArIHNwaWtlX3JhZGl1cywgeTogeSAtIHBvaW50X29mZnNldH0sXHJcbiAgICB7eDogeCArIHBvaW50X29mZnNldCwgeTogeSAtIHNwaWtlX3JhZGl1c30sXHJcbiAgICB7eDogeCAtIHBvaW50X29mZnNldCwgeTogeSAtIHNwaWtlX3JhZGl1c31cclxuICBdO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgYXJyYXkgbG9jYXRpb25zIG9mIHRoZSBzcGlrZXMgY29udGFpbmVkXHJcbiAqIGluIHRoZSBtYXAgdGlsZXMsIHJlcGxhY2luZyB0aG9zZSBhcnJheSBsb2NhdGlvbnMgaW4gdGhlIG9yaWdpbmFsXHJcbiAqIG1hcCB0aWxlcyB3aXRoIDIsIHdoaWNoIGNvcnJlc3BvbmRzIHRvIGEgZmxvb3IgdGlsZS5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtNYXBUaWxlc30gdGlsZXMgLSBUaGUgbWFwIHRpbGVzLlxyXG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXlMb2M+fSAtIFRoZSBhcnJheSBvZiBsb2NhdGlvbnMgdGhhdCBoZWxkXHJcbiAqICAgc3Bpa2UgdGlsZXMuXHJcbiAqL1xyXG5NYXBQYXJzZXIuZXh0cmFjdFNwaWtlcyA9IGZ1bmN0aW9uKHRpbGVzKSB7XHJcbiAgdmFyIHNwaWtlX2xvY2F0aW9ucyA9IFtdO1xyXG4gIHRpbGVzLmZvckVhY2goZnVuY3Rpb24ocm93LCByb3dfbikge1xyXG4gICAgcm93LmZvckVhY2goZnVuY3Rpb24oY2VsbF92YWx1ZSwgaW5kZXgsIHJvdykge1xyXG4gICAgICBpZiAoY2VsbF92YWx1ZSA9PSA3KSB7XHJcbiAgICAgICAgc3Bpa2VfbG9jYXRpb25zLnB1c2goe3I6IHJvd19uLCBjOiBpbmRleH0pO1xyXG4gICAgICAgIHJvd1tpbmRleF0gPSAyO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4gc3Bpa2VfbG9jYXRpb25zO1xyXG59O1xyXG5cclxudmFyIE9ic3RhY2xlID0gZnVuY3Rpb24odHlwZSwgaWRzKSB7XHJcbiAgdGhpcy50eXBlID0gdHlwZTtcclxuICB0aGlzLnZhbHMgPSBbXTtcclxuICB0aGlzLmluZm8gPSB7fTtcclxuICBpZHMuZm9yRWFjaChmdW5jdGlvbihpZCkge1xyXG4gICAgaWYgKHR5cGVvZiBpZCA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIHRoaXMudmFscy5wdXNoKGlkKTtcclxuICAgICAgdGhpcy5pbmZvW2lkXSA9IHRoaXMudHlwZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmFscy5wdXNoKGlkLm51bSk7XHJcbiAgICAgIHRoaXMuaW5mb1tpZF0gPSBpZC5uYW1lO1xyXG4gICAgfVxyXG4gIH0sIHRoaXMpO1xyXG59O1xyXG5cclxuT2JzdGFjbGUucHJvdG90eXBlLmRlc2NyaWJlcyA9IGZ1bmN0aW9uKHZhbCkge1xyXG4gIGlmKHRoaXMudmFscy5pbmRleE9mKE1hdGguZmxvb3IoK3ZhbCkpICE9PSAtMSkge1xyXG4gICAgcmV0dXJuICh0aGlzLmluZm9bK3ZhbF0gfHwgdGhpcy5pbmZvW01hdGguZmxvb3IoK3ZhbCldKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbnZhciBPYnN0YWNsZXMgPSBbXHJcbiAgbmV3IE9ic3RhY2xlKFwiYm9tYlwiLCBbMTAsIDEwLjFdKSxcclxuICBuZXcgT2JzdGFjbGUoXCJib29zdFwiLFxyXG4gICAgWzUsIDUuMSwge251bTogMTQsIG5hbWU6IFwicmVkYm9vc3RcIn0sIHtudW06IDE1LCBuYW1lOiBcImJsdWVib29zdFwifV0pLFxyXG4gIG5ldyBPYnN0YWNsZShcImdhdGVcIixcclxuICAgIFs5LCB7bnVtOiA5LjEsIG5hbWU6IFwiZ3JlZW5nYXRlXCJ9LCB7bnVtOiA5LjIsIG5hbWU6IFwicmVkZ2F0ZVwifSxcclxuICAgIHtudW06IDkuMywgbmFtZTogXCJibHVlZ2F0ZVwifV0pXHJcbl07XHJcblxyXG5NYXBQYXJzZXIuZXh0cmFjdER5bmFtaWNPYnN0YWNsZXMgPSBmdW5jdGlvbih0aWxlcykge1xyXG4gIHZhciBkeW5hbWljX29ic3RhY2xlcyA9IFtdO1xyXG4gIHRpbGVzLmZvckVhY2goZnVuY3Rpb24ocm93LCB4KSB7XHJcbiAgICByb3cuZm9yRWFjaChmdW5jdGlvbih0aWxlLCB5KSB7XHJcbiAgICAgIE9ic3RhY2xlcy5zb21lKGZ1bmN0aW9uKG9ic3RhY2xlX3R5cGUpIHtcclxuICAgICAgICB2YXIgZHluYW1pY19vYnN0YWNsZSA9IG9ic3RhY2xlX3R5cGUuZGVzY3JpYmVzKHRpbGUpXHJcbiAgICAgICAgaWYgKGR5bmFtaWNfb2JzdGFjbGUpIHtcclxuICAgICAgICAgIGR5bmFtaWNfb2JzdGFjbGVzLnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBkeW5hbWljX29ic3RhY2xlLFxyXG4gICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICB2OiB0aWxlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRpbGVzW3hdW3ldID0gMDtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBkeW5hbWljX29ic3RhY2xlcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgcmV0dXJuZWQgdmFsdWUgZnJvbSB0aGUgbWFwIHBhcnNpbmcgZnVuY3Rpb24uXHJcbiAqIEB0eXBlZGVmIFBhcnNlZE1hcFxyXG4gKiBAdHlwZSB7b2JqZWN0fVxyXG4gKiBAcHJvcGVydHkge0FycmF5LjxNUFNoYXBlPn0gd2FsbHMgLSBUaGUgcGFyc2VkIHdhbGxzLlxyXG4gKiBAcHJvcGVydHkge0FycmF5LjxNUFNoYXBlPn0gb2JzdGFjbGVzIC0gVGhlIHBhcnNlZCBvYnN0YWNsZXMuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRoZSAyZCBhcnJheSBkZWZpbmluZyBhIFRhZ1BybyBtYXAgaW50byBzaGFwZXMuXHJcbiAqIEBwYXJhbSB7TWFwVGlsZXN9IHRpbGVzIC0gVGhlIHRpbGVzIGFzIHJldHJpZXZlZCBmcm9tIGB0YWdwcm8ubWFwYC5cclxuICogQHJldHVybiB7P1BhcnNlZE1hcH0gLSBUaGUgcmVzdWx0IG9mIGNvbnZlcnRpbmcgdGhlIG1hcCBpbnRvXHJcbiAqICAgcG9seWdvbnMsIG9yIG51bGwgaWYgdGhlcmUgd2FzIGFuIGlzc3VlIHBhcnNpbmcgdGhlIG1hcC5cclxuICovXHJcbk1hcFBhcnNlci5wYXJzZSA9IGZ1bmN0aW9uKHRpbGVzKSB7XHJcbiAgLy8gTWFrZSBjb3B5IG9mIHRpbGVzIHRvIHByZXNlcnZlIG9yaWdpbmFsIGFycmF5XHJcbiAgdGlsZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRpbGVzKSk7XHJcblxyXG4gIC8vIFJldHVybnMgYSBsaXN0IG9mIHRoZSBzcGlrZSBsb2NhdGlvbnMgYW5kIHJlbW92ZXMgdGhlbSBmcm9tXHJcbiAgLy8gdGhlIHRpbGVzLlxyXG4gIHZhciBzcGlrZV9sb2NhdGlvbnMgPSBNYXBQYXJzZXIuZXh0cmFjdFNwaWtlcyh0aWxlcyk7XHJcblxyXG4gIHZhciBkeW5hbWljX29ic3RhY2xlcyA9IE1hcFBhcnNlci5leHRyYWN0RHluYW1pY09ic3RhY2xlcyh0aWxlcyk7XHJcblxyXG4gIC8vIFBhZCB0aWxlcyB3aXRoIGEgcmluZyBvZiB3YWxsIHRpbGVzLCB0byBlbnN1cmUgdGhlIG1hcCBpc1xyXG4gIC8vIGNsb3NlZC5cclxuICB2YXIgZW1wdHlfcm93ID0gW107XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aWxlc1swXS5sZW5ndGggKyAyOyBpKyspIHtcclxuICAgIGVtcHR5X3Jvdy5wdXNoKDEpO1xyXG4gIH1cclxuICB0aWxlcy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xyXG4gICAgcm93LnVuc2hpZnQoMSk7XHJcbiAgICByb3cucHVzaCgxKTtcclxuICB9KTtcclxuICB0aWxlcy51bnNoaWZ0KGVtcHR5X3Jvdyk7XHJcbiAgdGlsZXMucHVzaChlbXB0eV9yb3cuc2xpY2UoKSk7XHJcblxyXG4gIC8vIEFjdHVhbGx5IGRvaW5nIHRoZSBjb252ZXJzaW9uLlxyXG4gIC8vIEdldCByaWQgb2YgdGlsZSB2YWx1ZXMgZXhjZXB0IHRob3NlIGZvciB0aGUgd2FsbHMuXHJcbiAgdmFyIHRocmVzaG9sZF90aWxlcyA9IG1hcDJkKHRpbGVzLCBpc0JhZENlbGwpO1xyXG5cclxuICAvLyBHZW5lcmF0ZSBjb250b3VyIGdyaWQsIGVzc2VudGlhbGx5IGEgZ3JpZCB3aG9zZSBjZWxscyBhcmUgYXQgdGhlXHJcbiAgLy8gaW50ZXJzZWN0aW9uIG9mIGV2ZXJ5IHNldCBvZiA0IGNlbGxzIGluIHRoZSBvcmlnaW5hbCBtYXAuXHJcbiAgdmFyIGNvbnRvdXJfZ3JpZF8yID0gZ2VuZXJhdGVDb250b3VyR3JpZCh0aHJlc2hvbGRfdGlsZXMpO1xyXG5cclxuICAvLyBHZXQgdGlsZSB2ZXJ0ZXggYW5kIGFjdGlvbnMgZm9yIGVhY2ggY2VsbCBpbiBjb250b3VyIGdyaWQuXHJcbiAgdmFyIHRpbGVfYWN0aW9ucyA9IG1hcDJkKGNvbnRvdXJfZ3JpZF8yLCBnZXRBY3Rpb24pO1xyXG5cclxuICB2YXIgZ2VuZXJhdGVkX3NoYXBlcyA9IGdlbmVyYXRlU2hhcGVzKHRpbGVfYWN0aW9ucyk7XHJcbiAgaWYgKCFnZW5lcmF0ZWRfc2hhcGVzKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHZhciBhY3R1YWxfc2hhcGVzID0gZ2VuZXJhdGVkX3NoYXBlcy5maWx0ZXIoZnVuY3Rpb24oZWx0KSB7XHJcbiAgICByZXR1cm4gZWx0Lmxlbmd0aCA+IDA7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBjb252ZXJ0ZWRfc2hhcGVzID0gY29udmVydFNoYXBlc1RvQ29vcmRzKGFjdHVhbF9zaGFwZXMpO1xyXG5cclxuICAvLyBHZXQgc3Bpa2UtYXBwcm94aW1hdGluZyBzaGFwZXMgYW5kIGFkZCB0byBsaXN0LlxyXG4gIHZhciBzdGF0aWNfb2JzdGFjbGVzID0gc3Bpa2VfbG9jYXRpb25zLm1hcChmdW5jdGlvbihzcGlrZSkge1xyXG4gICAgcmV0dXJuIGdldFNwaWtlU2hhcGUoZ2V0Q29vcmRpbmF0ZXMoc3Bpa2UpKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHdhbGxzOiB0aGlzLmNvbnZlcnRTaGFwZXNUb1BvbHlzKGNvbnZlcnRlZF9zaGFwZXMpLFxyXG4gICAgc3RhdGljX29ic3RhY2xlczogdGhpcy5jb252ZXJ0U2hhcGVzVG9Qb2x5cyhzdGF0aWNfb2JzdGFjbGVzKSxcclxuICAgIGR5bmFtaWNfb2JzdGFjbGVzOiBkeW5hbWljX29ic3RhY2xlc1xyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBzaGFwZXMgaW50byBwb2x5cy5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtBcnJheS48U2hhcGU+fSBzaGFwZXMgLSBUaGUgc2hhcGVzIHRvIGJlIGNvbnZlcnRlZC5cclxuICogQHJldHVybiB7QXJyYXkuPFBvbHk+fSAtIFRoZSBjb252ZXJ0ZWQgc2hhcGVzLlxyXG4gKi9cclxuTWFwUGFyc2VyLmNvbnZlcnRTaGFwZXNUb1BvbHlzID0gZnVuY3Rpb24oc2hhcGVzKSB7XHJcbiAgdmFyIHBvbHlzID0gc2hhcGVzLm1hcChmdW5jdGlvbihzaGFwZSkge1xyXG4gICAgcmV0dXJuIE1hcFBhcnNlci5jb252ZXJ0U2hhcGVUb1BvbHkoc2hhcGUpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBwb2x5cztcclxufTtcclxuXHJcblxyXG4vKipcclxuICogQ29udmVydCBhIHNoYXBlIGludG8gYSBQb2x5LlxyXG4gKiBAcGFyYW0ge01QU2hhcGV9IHNoYXBlIC0gVGhlIHNoYXBlIHRvIGNvbnZlcnQuXHJcbiAqIEByZXR1cm4ge1BvbHl9IC0gVGhlIGNvbnZlcnRlZCBzaGFwZS5cclxuICovXHJcbk1hcFBhcnNlci5jb252ZXJ0U2hhcGVUb1BvbHkgPSBmdW5jdGlvbihzaGFwZSkge1xyXG4gIHZhciBwb2x5ID0gbmV3IFBvbHkoKTtcclxuICBwb2x5LmluaXQoc2hhcGUubGVuZ3RoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNoYXBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgcG9pbnQgPSBuZXcgUG9pbnQoc2hhcGVbaV0ueCwgc2hhcGVbaV0ueSk7XHJcbiAgICBwb2x5LnNldFBvaW50KGksIHBvaW50KTtcclxuICB9XHJcbiAgcmV0dXJuIHBvbHk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcFBhcnNlcjtcclxuIiwiLyoqXHJcbiAqIEhvbGRzIGNsYXNzZXMgZm9yIHBvaW50cywgcG9seWdvbnMsIGFuZCB1dGlsaXRpZXMgZm9yIG9wZXJhdGluZyBvblxyXG4gKiB0aGVtLlxyXG4gKiBBZGFwdGVkL2NvcGllZCBmcm9tIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvcG9seXBhcnRpdGlvbi9cclxuICogQG1vZHVsZSBQb2x5UGFydGl0aW9uXHJcbiAqL1xyXG52YXIgcG9seTJ0cmkgPSByZXF1aXJlKCdwb2x5MnRyaScpO1xyXG52YXIgZ2VvID0gcmVxdWlyZSgnLi9nZW9tZXRyeScpO1xyXG5cclxudmFyIFBvaW50ID0gZ2VvLlBvaW50O1xyXG52YXIgRWRnZSA9IGdlby5FZGdlO1xyXG52YXIgUG9seSA9IGdlby5Qb2x5O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBQb2ludCBjbGFzcyB1c2VkIGJ5IHBvbHkydHJpLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAdHlwZWRlZiBQMlRQb2ludFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBBIHBvbHlnb24gZm9yIHVzZSB3aXRoIHBvbHkydHJpLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAdHlwZWRlZiBQMlRQb2x5XHJcbiAqIEB0eXBlIHtBcnJheS48UDJUUG9pbnQ+fVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgcG9seWdvbiBpbnRvIGZvcm1hdCByZXF1aXJlZCBieSBwb2x5MnRyaS5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtQb2x5fSBwb2x5IC0gVGhlIHBvbHlnb24gdG8gY29udmVydC5cclxuICogQHJldHVybiB7UDJUUG9seX0gLSBUaGUgY29udmVydGVkIHBvbHlnb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBjb252ZXJ0UG9seVRvUDJUUG9seShwb2x5KSB7XHJcbiAgcmV0dXJuIHBvbHkucG9pbnRzLm1hcChmdW5jdGlvbihwKSB7XHJcbiAgICByZXR1cm4gbmV3IHBvbHkydHJpLlBvaW50KHAueCwgcC55KTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBwb2x5Z29uL3RyaWFuZ2xlIHJldHVybmVkIGZyb20gcG9seTJ0cmkgYmFjayBpbnRvIGFcclxuICogcG9seWdvbi5cclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtQMlRQb2x5fSBwMnRwb2x5IC0gVGhlIHBvbHlnb24gdG8gY29udmVydC5cclxuICogQHJldHVybiB7UG9seX0gLSBUaGUgY29udmVydGVkIHBvbHlnb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBjb252ZXJ0UDJUUG9seVRvUG9seShwMnRwb2x5KSB7XHJcbiAgdmFyIHBvaW50cyA9IHAydHBvbHkuZ2V0UG9pbnRzKCkubWFwKGZ1bmN0aW9uKHApIHtcclxuICAgIHJldHVybiBuZXcgUG9pbnQocC54LCBwLnkpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gbmV3IFBvbHkocG9pbnRzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNDb252ZXgocDEsIHAyLCBwMykge1xyXG4gIHZhciB0bXAgPSAocDMueSAtIHAxLnkpICogKHAyLnggLSBwMS54KSAtIChwMy54IC0gcDEueCkgKiAocDIueSAtIHAxLnkpO1xyXG4gIHJldHVybiAodG1wID4gMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhbiBhcnJheSBvZiBwb2x5Z29ucyB0aGF0IG92ZXJsYXAgdGhlbXNlbHZlcyBhbmQgb3RoZXJzXHJcbiAqIGF0IGRpc2NyZXRlIGNvcm5lciBwb2ludHMgYW5kIHNlcGFyYXRlIHRob3NlIG92ZXJsYXBwaW5nIGNvcm5lcnNcclxuICogc2xpZ2h0bHkgc28gdGhlIHBvbHlnb25zIGFyZSBzdWl0YWJsZSBmb3IgdHJpYW5ndWxhdGlvbiBieVxyXG4gKiBwb2x5MnRyaS5qcy4gVGhpcyBjaGFuZ2VzIHRoZSBQb2x5IG9iamVjdHMgaW4gdGhlIGFycmF5LlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gcG9seXMgLSBUaGUgcG9seWdvbnMgdG8gc2VwYXJhdGUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb2Zmc2V0PTFdIC0gVGhlIG51bWJlciBvZiB1bml0cyB0aGUgdmVydGljZXNcclxuICogICBzaG91bGQgYmUgbW92ZWQgYXdheSBmcm9tIGVhY2ggb3RoZXIuXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXBhcmF0ZVBvbHlzKHBvbHlzLCBvZmZzZXQpIHtcclxuICBvZmZzZXQgPSBvZmZzZXQgfHwgMTtcclxuICB2YXIgZGlzY292ZXJlZCA9IHt9O1xyXG4gIHZhciBkdXBlcyA9IHt9O1xyXG4gIC8vIE9mZnNldCB0byB1c2UgaW4gY2FsY3VsYXRpb24uXHJcbiAgLy8gRmluZCBkdXBsaWNhdGVzLlxyXG4gIGZvciAodmFyIHMxID0gMDsgczEgPCBwb2x5cy5sZW5ndGg7IHMxKyspIHtcclxuICAgIHZhciBwb2x5ID0gcG9seXNbczFdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2x5Lm51bXBvaW50czsgaSsrKSB7XHJcbiAgICAgIHZhciBwb2ludCA9IHBvbHkucG9pbnRzW2ldLnRvU3RyaW5nKCk7XHJcbiAgICAgIGlmICghZGlzY292ZXJlZC5oYXNPd25Qcm9wZXJ0eShwb2ludCkpIHtcclxuICAgICAgICBkaXNjb3ZlcmVkW3BvaW50XSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZHVwZXNbcG9pbnRdID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gR2V0IGR1cGxpY2F0ZSBwb2ludHMuXHJcbiAgdmFyIGR1cGVfcG9pbnRzID0gW107XHJcbiAgdmFyIGR1cGU7XHJcbiAgZm9yICh2YXIgczEgPSAwOyBzMSA8IHBvbHlzLmxlbmd0aDsgczErKykge1xyXG4gICAgdmFyIHBvbHkgPSBwb2x5c1tzMV07XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvbHkubnVtcG9pbnRzOyBpKyspIHtcclxuICAgICAgdmFyIHBvaW50ID0gcG9seS5wb2ludHNbaV07XHJcbiAgICAgIGlmIChkdXBlcy5oYXNPd25Qcm9wZXJ0eShwb2ludC50b1N0cmluZygpKSkge1xyXG4gICAgICAgIGR1cGUgPSBbcG9pbnQsIGksIHBvbHldO1xyXG4gICAgICAgIGR1cGVfcG9pbnRzLnB1c2goZHVwZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFNvcnQgZWxlbWVudHMgaW4gZGVzY2VuZGluZyBvcmRlciBiYXNlZCBvbiB0aGVpciBpbmRpY2VzIHRvXHJcbiAgLy8gcHJldmVudCBmdXR1cmUgaW5kaWNlcyBmcm9tIGJlY29taW5nIGludmFsaWQgd2hlbiBjaGFuZ2VzIGFyZSBtYWRlLlxyXG4gIGR1cGVfcG9pbnRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgcmV0dXJuIGJbMV0gLSBhWzFdXHJcbiAgfSk7XHJcbiAgLy8gRWRpdCBkdXBsaWNhdGVzLlxyXG4gIHZhciBwcmV2LCBuZXh0LCBwb2ludCwgaW5kZXgsIHAxLCBwMjtcclxuICBkdXBlX3BvaW50cy5mb3JFYWNoKGZ1bmN0aW9uKGUsIGksIGFyeSkge1xyXG4gICAgcG9pbnQgPSBlWzBdLCBpbmRleCA9IGVbMV0sIHBvbHkgPSBlWzJdO1xyXG4gICAgcHJldiA9IHBvbHkucG9pbnRzW3BvbHkuZ2V0UHJldkkoaW5kZXgpXTtcclxuICAgIG5leHQgPSBwb2x5LnBvaW50c1twb2x5LmdldE5leHRJKGluZGV4KV07XHJcbiAgICBwMSA9IHBvaW50LmFkZChwcmV2LnN1Yihwb2ludCkubm9ybWFsaXplKCkubXVsKG9mZnNldCkpO1xyXG4gICAgcDIgPSBwb2ludC5hZGQobmV4dC5zdWIocG9pbnQpLm5vcm1hbGl6ZSgpLm11bChvZmZzZXQpKTtcclxuICAgIC8vIEluc2VydCBuZXcgcG9pbnRzLlxyXG4gICAgcG9seS5wb2ludHMuc3BsaWNlKGluZGV4LCAxLCBwMSwgcDIpO1xyXG4gICAgcG9seS51cGRhdGUoKTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFBhcnRpdGlvbiBhIHBvbHlnb24gd2l0aCAob3B0aW9uYWwpIGhvbGVzIGludG8gYSBzZXQgb2YgY29udmV4XHJcbiAqIHBvbHlnb25zLiBUaGUgdmVydGljZXMgb2YgdGhlIHBvbHlnb24gbXVzdCBiZSBnaXZlbiBpbiBDVyBvcmRlcixcclxuICogYW5kIHRoZSB2ZXJ0aWNlcyBvZiB0aGUgaG9sZXMgbXVzdCBiZSBpbiBDQ1cgb3JkZXIuIFVzZXMgcG9seTJ0cmlcclxuICogZm9yIHRoZSBpbml0aWFsIHRyaWFuZ3VsYXRpb24gYW5kIEhlcnRlbC1NZWhsaG9ybiB0byBjb21iaW5lIHRoZW1cclxuICogaW50byBjb252ZXggcG9seWdvbnMuXHJcbiAqIEBwYXJhbSB7UG9seX0gcG9seSAtIFRoZSBwb2x5Z29uIHRvIHVzZSBhcyB0aGUgb3V0bGluZS5cclxuICogQHBhcmFtIHtBcnJheS48UG9seT59IFtob2xlc10gLSBBbiBhcnJheSBvZiBob2xlcyBwcmVzZW50IGluIHRoZVxyXG4gKiAgIHBvbHlnb24uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbWluQXJlYT01XSAtIEFuIG9wdGlvbmFsIHBhcmFtZXRlciB0aGF0IGZpbHRlcnNcclxuICogICBvdXQgcG9seWdvbnMgaW4gdGhlIHBhcnRpdGlvbiBzbWFsbGVyIHRoYW4gdGhpcyB2YWx1ZS5cclxuICogQHJldHVybiB7QXJyYXkuPFBvbHk+fSAtIFRoZSBzZXQgb2YgcG9seWdvbnMgZGVmaW5pbmcgdGhlXHJcbiAqICAgcGFydGl0aW9uIG9mIHRoZSBwcm92aWRlZCBwb2x5Z29uLlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwb2x5LCBob2xlcywgbWluQXJlYSkge1xyXG4gIGlmICh0eXBlb2YgaG9sZXMgPT0gJ3VuZGVmaW5lZCcpIGhvbGVzID0gZmFsc2U7XHJcbiAgaWYgKHR5cGVvZiBtaW5BcmVhID09ICd1bmRlZmluZWQnKSBtaW5BcmVhID0gNTtcclxuXHJcbiAgdmFyIGkxMSwgaTEyLCBpMTMsIGkyMSwgaTIyLCBpMjM7XHJcbiAgdmFyIHBhcnRzID0gbmV3IEFycmF5KCk7XHJcblxyXG4gIC8vIENoZWNrIGlmIHBvbHkgaXMgYWxyZWFkeSBjb252ZXggb25seSBpZiB0aGVyZSBhcmUgbm8gaG9sZXMuXHJcbiAgaWYgKCFob2xlcyB8fCBob2xlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgdmFyIHJlZmxleCA9IGZhbHNlO1xyXG4gICAgLy8gQ2hlY2sgaWYgYWxyZWFkeSBjb252ZXguXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvbHkubnVtcG9pbnRzOyBpKyspIHtcclxuICAgICAgdmFyIHByZXYgPSBwb2x5LmdldFByZXZJKGkpO1xyXG4gICAgICB2YXIgbmV4dCA9IHBvbHkuZ2V0TmV4dEkoaSk7XHJcbiAgICAgIGlmICghaXNDb252ZXgocG9seS5nZXRQb2ludChwcmV2KSwgcG9seS5nZXRQb2ludChpKSwgcG9seS5nZXRQb2ludChuZXh0KSkpIHtcclxuICAgICAgICByZWZsZXggPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlZmxleCkge1xyXG4gICAgICBwYXJ0cy5wdXNoKHBvbHkpO1xyXG4gICAgICByZXR1cm4gcGFydHM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTZXBhcmF0ZSBwb2x5cyB0byByZW1vdmUgY29sbGluZWFyIHBvaW50cy5cclxuICBzZXBhcmF0ZVBvbHlzKGhvbGVzLmNvbmNhdChwb2x5KSk7XHJcblxyXG4gIC8vIENvbnZlcnQgcG9seWdvbiBpbnRvIGZvcm1hdCByZXF1aXJlZCBieSBwb2x5MnRyaS5cclxuICB2YXIgY29udG91ciA9IGNvbnZlcnRQb2x5VG9QMlRQb2x5KHBvbHkpO1xyXG5cclxuICBpZiAoaG9sZXMpIHtcclxuICAgIC8vIENvbnZlcnQgaG9sZXMgaW50byBmb3JtYXQgcmVxdWlyZWQgYnkgcG9seTJ0cmkuXHJcbiAgICBob2xlcyA9IGhvbGVzLm1hcChjb252ZXJ0UG9seVRvUDJUUG9seSk7XHJcbiAgfVxyXG5cclxuICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xyXG4gIGlmIChob2xlcykge1xyXG4gICAgc3djdHguYWRkSG9sZXMoaG9sZXMpO1xyXG4gIH1cclxuICB2YXIgdHJpYW5nbGVzID0gc3djdHgudHJpYW5ndWxhdGUoKS5nZXRUcmlhbmdsZXMoKTtcclxuICBcclxuICAvLyBDb252ZXJ0IHBvbHkydHJpIHRyaWFuZ2xlcyBiYWNrIGludG8gcG9seWdvbnMgYW5kIGZpbHRlciBvdXQgdGhlXHJcbiAgLy8gb25lcyB0b28gc21hbGwgdG8gYmUgcmVsZXZhbnQuXHJcbiAgdHJpYW5nbGVzID0gdHJpYW5nbGVzLm1hcChjb252ZXJ0UDJUUG9seVRvUG9seSkuZmlsdGVyKGZ1bmN0aW9uKHBvbHkpIHtcclxuICAgIHJldHVybiBwb2x5LmdldEFyZWEoKSA+PSBtaW5BcmVhO1xyXG4gIH0pO1xyXG5cclxuICBmb3IgKHZhciBzMSA9IDA7IHMxIDwgdHJpYW5nbGVzLmxlbmd0aDsgczErKykge1xyXG4gICAgdmFyIHBvbHkxID0gdHJpYW5nbGVzW3MxXTtcclxuICAgIHZhciBzMl9pbmRleCA9IG51bGw7XHJcbiAgICBmb3IgKGkxMSA9IDA7IGkxMSA8IHBvbHkxLm51bXBvaW50czsgaTExKyspIHtcclxuICAgICAgdmFyIGQxID0gcG9seTEuZ2V0UG9pbnQoaTExKTtcclxuICAgICAgaTEyID0gcG9seTEuZ2V0TmV4dEkoaTExKTtcclxuICAgICAgdmFyIGQyID0gcG9seTEuZ2V0UG9pbnQoaTEyKTtcclxuXHJcbiAgICAgIHZhciBpc2RpYWdvbmFsID0gZmFsc2U7XHJcbiAgICAgIGZvciAodmFyIHMyID0gczE7IHMyIDwgdHJpYW5nbGVzLmxlbmd0aDsgczIrKykge1xyXG4gICAgICAgIGlmIChzMSA9PSBzMikgY29udGludWU7XHJcbiAgICAgICAgdmFyIHBvbHkyID0gdHJpYW5nbGVzW3MyXTtcclxuICAgICAgICBmb3IgKGkyMSA9IDA7IGkyMSA8IHBvbHkyLm51bXBvaW50czsgaTIxKyspIHtcclxuICAgICAgICAgIGlmIChkMi5uZXEocG9seTIuZ2V0UG9pbnQoaTIxKSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgaTIyID0gcG9seTIuZ2V0TmV4dEkoaTIxKTtcclxuICAgICAgICAgIGlmIChkMS5uZXEocG9seTIuZ2V0UG9pbnQoaTIyKSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgaXNkaWFnb25hbCA9IHRydWU7XHJcbiAgICAgICAgICBvYmplY3RfMl9pbmRleCA9IHMyO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc2RpYWdvbmFsKSBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFpc2RpYWdvbmFsKSBjb250aW51ZTtcclxuICAgICAgdmFyIHAxLCBwMiwgcDM7XHJcbiAgICAgIHAyID0gcG9seTEuZ2V0UG9pbnQoaTExKTtcclxuICAgICAgaTEzID0gcG9seTEuZ2V0UHJldkkoaTExKTtcclxuICAgICAgcDEgPSBwb2x5MS5nZXRQb2ludChpMTMpO1xyXG4gICAgICBpMjMgPSBwb2x5Mi5nZXROZXh0SShpMjIpO1xyXG4gICAgICBwMyA9IHBvbHkyLmdldFBvaW50KGkyMyk7XHJcblxyXG4gICAgICBpZiAoIWlzQ29udmV4KHAxLCBwMiwgcDMpKSBjb250aW51ZTtcclxuXHJcbiAgICAgIHAyID0gcG9seTEuZ2V0UG9pbnQoaTEyKTtcclxuICAgICAgaTEzID0gcG9seTEuZ2V0TmV4dEkoaTEyKTtcclxuICAgICAgcDMgPSBwb2x5MS5nZXRQb2ludChpMTMpO1xyXG4gICAgICBpMjMgPSBwb2x5Mi5nZXRQcmV2SShpMjEpO1xyXG4gICAgICBwMSA9IHBvbHkyLmdldFBvaW50KGkyMyk7XHJcblxyXG4gICAgICBpZiAoIWlzQ29udmV4KHAxLCBwMiwgcDMpKSBjb250aW51ZTtcclxuXHJcbiAgICAgIHZhciBuZXdwb2x5ID0gbmV3IFBvbHkoKTtcclxuICAgICAgbmV3cG9seS5pbml0KHBvbHkxLm51bXBvaW50cyArIHBvbHkyLm51bXBvaW50cyAtIDIpO1xyXG4gICAgICB2YXIgayA9IDA7XHJcbiAgICAgIGZvciAodmFyIGogPSBpMTI7IGogIT0gaTExOyBqID0gcG9seTEuZ2V0TmV4dEkoaikpIHtcclxuICAgICAgICBuZXdwb2x5LnNldFBvaW50KGssIHBvbHkxLmdldFBvaW50KGopKTtcclxuICAgICAgICBrKys7XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgaiA9IGkyMjsgaiAhPSBpMjE7IGogPSBwb2x5Mi5nZXROZXh0SShqKSkge1xyXG4gICAgICAgIG5ld3BvbHkuc2V0UG9pbnQoaywgcG9seTIuZ2V0UG9pbnQoaikpO1xyXG4gICAgICAgIGsrKztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHMxID4gb2JqZWN0XzJfaW5kZXgpIHtcclxuICAgICAgICB0cmlhbmdsZXNbczFdID0gbmV3cG9seTtcclxuICAgICAgICBwb2x5MSA9IHRyaWFuZ2xlc1tzMV07XHJcbiAgICAgICAgdHJpYW5nbGVzLnNwbGljZShvYmplY3RfMl9pbmRleCwgMSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdHJpYW5nbGVzLnNwbGljZShvYmplY3RfMl9pbmRleCwgMSk7XHJcbiAgICAgICAgdHJpYW5nbGVzW3MxXSA9IG5ld3BvbHk7XHJcbiAgICAgICAgcG9seTEgPSB0cmlhbmdsZXNbczFdO1xyXG4gICAgICB9XHJcbiAgICAgIGkxMSA9IC0xO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdHJpYW5nbGVzO1xyXG59O1xyXG4iLCJ2YXIgZ2VvID0gcmVxdWlyZSgnLi9nZW9tZXRyeScpO1xyXG52YXIgZmluZFBvbHlGb3JQb2ludCA9IGdlby51dGlsLmZpbmRQb2x5Rm9yUG9pbnQ7XHJcbnZhciBQcmlvcml0eVF1ZXVlID0gcmVxdWlyZSgncHJpb3JpdHktcXVldWUnKTtcclxuXHJcbi8qKlxyXG4gKiBQYXRoZmluZGVyIGltcGxlbWVudHMgcGF0aGZpbmRpbmcgb24gYSBuYXZpZ2F0aW9uIG1lc2guXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAcGFyYW0ge0FycmF5LjxQb2x5Pn0gcG9seXMgLSBUaGUgcG9seWdvbnMgZGVmaW5pbmcgdGhlIG5hdmlnYXRpb24gbWVzaC5cclxuICogQHBhcmFtIHtib29sZWFufSBbaW5pdD10cnVlXSAtIFdoZXRoZXIgb3Igbm90IHRvIGluaXRpYWxpemUgdGhlIHBhdGhmaW5kZXIuXHJcbiAqL1xyXG52YXIgUGF0aGZpbmRlciA9IGZ1bmN0aW9uKHBvbHlzLCBpbml0KSB7XHJcbiAgaWYgKHR5cGVvZiBpbml0ID09IFwidW5kZWZpbmVkXCIpIGluaXQgPSB0cnVlO1xyXG4gIHRoaXMucG9seXMgPSBwb2x5cztcclxuICBpZiAoaW5pdCkge1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGhmaW5kZXI7XHJcblxyXG5QYXRoZmluZGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5ncmlkID0gdGhpcy5nZW5lcmF0ZUFkamFjZW5jeUdyaWQodGhpcy5wb2x5cyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZXMgcGF0aCBmcm9tIHNvdXJjZSB0byB0YXJnZXQsIHVzaW5nIHNpZGVzIGFuZCBjZW50ZXJzIG9mIHRoZSBlZGdlc1xyXG4gKiBiZXR3ZWVuIGFkamFjZW50IHBvbHlnb25zLiBzb3VyY2UgYW5kIHRhcmdldCBhcmUgUG9pbnRzIGFuZCBwb2x5cyBzaG91bGRcclxuICogYmUgdGhlIGZpbmFsIHBhcnRpdGlvbmVkIG1hcC5cclxuICogQHBhcmFtIHtQb2ludH0gc291cmNlIC0gVGhlIHN0YXJ0IGxvY2F0aW9uIGZvciB0aGUgc2VhcmNoLlxyXG4gKiBAcGFyYW0ge1BvaW50fSB0YXJnZXQgLSBUaGUgdGFyZ2V0IGxvY2F0aW9uIGZvciB0aGUgc2VhcmNoLlxyXG4gKiBAcmV0dXJuIHs/QXJyYXkuPFBvaW50Pn0gLSBBIHNlcmllcyBvZiBwb2ludHMgcmVwcmVzZW50aW5nIHRoZSBwYXRoIGZyb21cclxuICogICB0aGUgc291cmNlIHRvIHRoZSB0YXJnZXQuIElmIGEgcGF0aCBpcyBub3QgZm91bmQsIGBudWxsYCBpcyByZXR1cm5lZC5cclxuICovXHJcblBhdGhmaW5kZXIucHJvdG90eXBlLmFTdGFyID0gZnVuY3Rpb24oc291cmNlLCB0YXJnZXQpIHtcclxuICAvLyBDb21wYXJlcyB0aGUgdmFsdWUgb2YgdHdvIG5vZGVzLlxyXG4gIGZ1bmN0aW9uIG5vZGVWYWx1ZShub2RlMSwgbm9kZTIpIHtcclxuICAgIHJldHVybiAobm9kZTEuZGlzdCArIGhldXJpc3RpYyhub2RlMS5wb2ludCkpIC0gKG5vZGUyLmRpc3QgKyBoZXVyaXN0aWMobm9kZTIucG9pbnQpKTtcclxuICB9XHJcblxyXG4gIC8vIERpc3RhbmNlIGJldHdlZW4gcG9seWdvbnMuXHJcbiAgZnVuY3Rpb24gZXVjbGlkZWFuRGlzdGFuY2UocDEsIHAyKSB7XHJcbiAgICByZXR1cm4gcDEuZGlzdChwMik7XHJcbiAgfVxyXG5cclxuICAvLyBEaXN0YW5jZSBiZXR3ZWVuIHBvbHlnb25zLiB0b2RvOiB1cGRhdGVcclxuICBmdW5jdGlvbiBtYW5oYXR0YW5EaXN0YW5jZShlbHQxLCBlbHQyKSB7XHJcbiAgICByZXR1cm4gKGVsdDEuciAtIGVsdDIucikgKyAoZWx0MS5jIC0gZWx0Mi5jKTtcclxuICB9XHJcblxyXG4gIC8vIFRha2VzIFBvaW50IGFuZCByZXR1cm5zIHZhbHVlLlxyXG4gIGZ1bmN0aW9uIGhldXJpc3RpYyhwKSB7XHJcbiAgICByZXR1cm4gZXVjbGlkZWFuRGlzdGFuY2UocCwgdGFyZ2V0KTtcclxuICB9XHJcblxyXG4gIHZhciBzb3VyY2VQb2x5ID0gZmluZFBvbHlGb3JQb2ludChzb3VyY2UsIHRoaXMucG9seXMpO1xyXG5cclxuICAvLyBXZSdyZSBvdXRzaWRlIG9mIHRoZSBtZXNoIHNvbWVob3cuIFRyeSBhIGZldyBuZWFyYnkgcG9pbnRzLlxyXG4gIGlmICghc291cmNlUG9seSkge1xyXG4gICAgdmFyIG9mZnNldFNvdXJjZSA9IFtuZXcgUG9pbnQoNSwgMCksIG5ldyBQb2ludCgtNSwgMCksIG5ldyBQb2ludCgwLCAtNSksIG5ldyBQb2ludCgwLCA1KV07XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9mZnNldFNvdXJjZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvLyBNYWtlIG5ldyBwb2ludC5cclxuICAgICAgdmFyIHBvaW50ID0gc291cmNlLmFkZChvZmZzZXRTb3VyY2VbaV0pO1xyXG4gICAgICBzb3VyY2VQb2x5ID0gZmluZFBvbHlGb3JQb2ludChwb2ludCwgdGhpcy5wb2x5cyk7XHJcbiAgICAgIGlmIChzb3VyY2VQb2x5KSB7XHJcbiAgICAgICAgc291cmNlID0gcG9pbnQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghc291cmNlUG9seSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbiAgdmFyIHRhcmdldFBvbHkgPSBmaW5kUG9seUZvclBvaW50KHRhcmdldCwgdGhpcy5wb2x5cyk7XHJcblxyXG4gIC8vIEhhbmRsZSB0cml2aWFsIGNhc2UuXHJcbiAgaWYgKHNvdXJjZVBvbHkgPT0gdGFyZ2V0UG9seSkge1xyXG4gICAgcmV0dXJuIFtzb3VyY2UsIHRhcmdldF07XHJcbiAgfVxyXG5cclxuICAvLyBXYXJuaW5nLCBtYXkgaGF2ZSBjb21wYXRpYmlsaXR5IGlzc3Vlcy5cclxuICB2YXIgZGlzY292ZXJlZFBvbHlzID0gbmV3IFdlYWtTZXQoKTtcclxuICB2YXIgZGlzY292ZXJlZFBvaW50cyA9IG5ldyBXZWFrU2V0KCk7XHJcbiAgdmFyIHBxID0gbmV3IFByaW9yaXR5UXVldWUoeyBjb21wYXJhdG9yOiBub2RlVmFsdWUgfSk7XHJcbiAgdmFyIGZvdW5kID0gbnVsbDtcclxuICAvLyBJbml0aWFsaXplIHdpdGggc3RhcnQgbG9jYXRpb24uXHJcbiAgcHEucXVldWUoe2Rpc3Q6IDAsIHBvbHk6IHNvdXJjZVBvbHksIHBvaW50OiBzb3VyY2UsIHBhcmVudDogbnVsbH0pO1xyXG4gIHdoaWxlIChwcS5sZW5ndGggPiAwKSB7XHJcbiAgICB2YXIgbm9kZSA9IHBxLmRlcXVldWUoKTtcclxuICAgIGlmIChub2RlLnBvbHkgPT0gdGFyZ2V0UG9seSkge1xyXG4gICAgICBmb3VuZCA9IG5vZGU7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGlzY292ZXJlZFBvbHlzLmFkZChub2RlLnBvbHkpO1xyXG4gICAgICBkaXNjb3ZlcmVkUG9pbnRzLmFkZChub2RlLnBvaW50KTtcclxuICAgIH1cclxuICAgIC8vIFRoaXMgbWF5IGJlIHVuZGVmaW5lZCBpZiB0aGVyZSB3YXMgbm8gcG9seWdvbiBmb3VuZC5cclxuICAgIHZhciBuZWlnaGJvcnMgPSB0aGlzLmdyaWQuZ2V0KG5vZGUucG9seSk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZWx0ID0gbmVpZ2hib3JzW2ldO1xyXG4gICAgICB2YXIgbmVpZ2hib3JGb3VuZCA9IGRpc2NvdmVyZWRQb2x5cy5oYXMoZWx0LnBvbHkpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBlbHQuZWRnZS5wb2ludHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICB2YXIgcCA9IGVsdC5lZGdlLnBvaW50c1tqXTtcclxuICAgICAgICBpZiAoIW5laWdoYm9yRm91bmQgfHwgIWRpc2NvdmVyZWRQb2ludHMuaGFzKHApKVxyXG4gICAgICAgICAgcHEucXVldWUoe2Rpc3Q6IG5vZGUuZGlzdCArIGV1Y2xpZGVhbkRpc3RhbmNlKHAsIG5vZGUucG9pbnQpLCBwb2x5OiBlbHQucG9seSwgcG9pbnQ6IHAsIHBhcmVudDogbm9kZX0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoZm91bmQpIHtcclxuICAgIHZhciBwYXRoID0gW107XHJcbiAgICB2YXIgY3VycmVudCA9IGZvdW5kO1xyXG4gICAgd2hpbGUgKGN1cnJlbnQucGFyZW50KSB7XHJcbiAgICAgIHBhdGgudW5zaGlmdChjdXJyZW50LnBvaW50KTtcclxuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xyXG4gICAgfVxyXG4gICAgcGF0aC51bnNoaWZ0KGN1cnJlbnQucG9pbnQpO1xyXG4gICAgLy8gQWRkIGVuZCBwb2ludCB0byBwYXRoLlxyXG4gICAgcGF0aC5wdXNoKHRhcmdldCk7XHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhvbGRzIHRoZSBcIm5laWdoYm9yXCIgcmVsYXRpb25zaGlwIG9mIFBvbHkgb2JqZWN0cyBpbiB0aGUgcGFydGl0aW9uXHJcbiAqIHVzaW5nIHRoZSBQb2x5J3MgdGhlbXNlbHZlcyBhcyBrZXlzLCBhbmQgYW4gYXJyYXkgb2YgUG9seSdzIGFzXHJcbiAqIHZhbHVlcywgd2hlcmUgdGhlIFBvbHlzIGluIHRoZSBhcnJheSBhcmUgbmVpZ2hib3JzIG9mIHRoZSBQb2x5XHJcbiAqIHRoYXQgd2FzIHRoZSBrZXkuXHJcbiAqIEB0eXBlZGVmIEFkamFjZW5jeUdyaWRcclxuICogQHR5cGUge09iamVjdC48UG9seSwgQXJyYXk8UG9seT4+fVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBHaXZlbiBhbiBhcnJheSBvZiBQb2x5IG9iamVjdHMsIGZpbmQgYWxsIG5laWdoYm9yaW5nIHBvbHlnb25zIGZvclxyXG4gKiBlYWNoIHBvbHlnb24uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFBvbHk+fSBwb2x5cyAtIFRoZSBhcnJheSBvZiBwb2x5cyB0byBmaW5kIG5laWdoYm9yc1xyXG4gKiAgIGFtb25nLlxyXG4gKiBAcmV0dXJuIHtBZGphY2VuY3lHcmlkfSAtIFRoZSBcIm5laWdoYm9yXCIgcmVsYXRpb25zaGlwcy5cclxuICovXHJcblBhdGhmaW5kZXIucHJvdG90eXBlLmdlbmVyYXRlQWRqYWNlbmN5R3JpZCA9IGZ1bmN0aW9uKHBvbHlzKSB7XHJcbiAgdmFyIG5laWdoYm9ycyA9IG5ldyBXZWFrTWFwKCk7XHJcbiAgcG9seXMuZm9yRWFjaChmdW5jdGlvbihwb2x5LCBwb2x5SSwgcG9seXMpIHtcclxuICAgIGlmIChuZWlnaGJvcnMuaGFzKHBvbHkpKSB7XHJcbiAgICAgIC8vIE1heGltdW0gbnVtYmVyIG9mIG5laWdoYm9ycyBhbHJlYWR5IGZvdW5kLlxyXG4gICAgICBpZiAobmVpZ2hib3JzLmdldChwb2x5KS5sZW5ndGggPT0gcG9seS5udW1wb2ludHMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEluaXRpYWxpemUgYXJyYXkuXHJcbiAgICAgIG5laWdoYm9ycy5zZXQocG9seSwgbmV3IEFycmF5KCkpO1xyXG4gICAgfVxyXG4gICAgLy8gT2YgcmVtYWluaW5nIHBvbHlnb25zLCBmaW5kIHNvbWUgdGhhdCBhcmUgYWRqYWNlbnQuXHJcbiAgICBwb2x5LnBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uKHAxLCBpLCBwb2ludHMpIHtcclxuICAgICAgLy8gTmV4dCBwb2ludC5cclxuICAgICAgdmFyIHAyID0gcG9pbnRzW3BvbHkuZ2V0TmV4dEkoaSldO1xyXG4gICAgICBmb3IgKHZhciBwb2x5SiA9IHBvbHlJICsgMTsgcG9seUogPCBwb2x5cy5sZW5ndGg7IHBvbHlKKyspIHtcclxuICAgICAgICB2YXIgcG9seTIgPSBwb2x5c1twb2x5Sl07XHJcbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIHBvaW50cyB1bnRpbCBtYXRjaCBpcyBmb3VuZC5cclxuICAgICAgICBwb2x5Mi5wb2ludHMuc29tZShmdW5jdGlvbihxMSwgaiwgcG9pbnRzMikge1xyXG4gICAgICAgICAgdmFyIHEyID0gcG9pbnRzMltwb2x5Mi5nZXROZXh0SShqKV07XHJcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBwMS5lcShxMikgJiYgcDIuZXEocTEpO1xyXG4gICAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgIHZhciBlZGdlID0gbmV3IEVkZ2UocDEsIHAyKTtcclxuICAgICAgICAgICAgbmVpZ2hib3JzLmdldChwb2x5KS5wdXNoKHsgcG9seTogcG9seTIsIGVkZ2U6IGVkZ2UgfSk7XHJcbiAgICAgICAgICAgIGlmICghbmVpZ2hib3JzLmhhcyhwb2x5MikpIHtcclxuICAgICAgICAgICAgICBuZWlnaGJvcnMuc2V0KHBvbHkyLCBuZXcgQXJyYXkoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmVpZ2hib3JzLmdldChwb2x5MikucHVzaCh7IHBvbHk6IHBvbHksIGVkZ2U6IGVkZ2UgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKG5laWdoYm9ycy5nZXQocG9seSkubGVuZ3RoID09IHBvbHkubnVtcG9pbnRzKSBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG5laWdoYm9ycztcclxufTtcclxuIiwiXHJcblxyXG4vKipcclxuICogUmV0cmlldmUgdGhlIHdlYiB3b3JrZXIgYXQgdGhlIGdpdmVuIFVSTC4gSWYgdGhlIHdvcmtlciBjYW4gYmVcclxuICogbG9hZGVkIHRoZW4gYSBQcm9taXNlIGlzIHJldHVybmVkLiBUaGUgUHJvbWlzZSBpcyBmdWxmaWxsZWQgd2hlblxyXG4gKiB0aGUgd29ya2VyIGlzIGxvYWRlZC4gSWYgdGhlIHdvcmtlciBjYW5ub3QgYmUgbG9hZGVkLCBhbmQgdGhlXHJcbiAqIGNvbmRpdGlvbnMgYXJlIGtub3duIG9uIGV4ZWN1dGlvbiBvZiB0aGlzIGZ1bmN0aW9uLCB0aGVuIGZhbHNlXHJcbiAqIGlzIHJldHVybmVkLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCAtIFRoZSBjb250ZW50IG9mIHRoZSB3ZWIgd29ya2VyIHRvIHVzZS5cclxuICogQHJldHVybiB7UHJvbWlzZX0gLSBUaGUgUHJvbWlzZSBvYmplY3QgaG9sZGluZyB0aGUgZnV0dXJlXHJcbiAqICAgd2ViIHdvcmtlciwgb3IgZmFsc2UgaWYgaXQgY2Fubm90IGJlIGxvYWRlZC5cclxuICovXHJcbmZ1bmN0aW9uIGdldFdvcmtlclByb21pc2UoY29udGVudCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgIGlmICghd2luZG93Lldvcmtlcikge1xyXG4gICAgICByZWplY3QoRXJyb3IoXCJXZWIgd29ya2VycyBub3QgYXZhaWxhYmxlLlwiKSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB2YXIgd29ya2VyID0gbWFrZVdlYldvcmtlcihjb250ZW50KTtcclxuICAgICAgcmVzb2x2ZSh3b3JrZXIpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICByZWplY3QoRXJyb3IoXCJTeW50YXggZXJyb3IgaW4gd29ya2VyLlwiKSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYWtlIGEgd2ViIHdvcmtlciBmcm9tIHRoZSBwcm92aWRlZCBzdHJpbmcuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IC0gVGhlIGNvbnRlbnQgdG8gdXNlIGFzIHRoZSBjb2RlIGZvciB0aGVcclxuICogICB3ZWIgd29ya2VyLlxyXG4gKiBAcmV0dXJuIHtXb3JrZXJ9IC0gVGhlIGNvbnN0cnVjdGVkIHdlYiB3b3JrZXIuXHJcbiAqIEB0aHJvd3Mge1N5bnRheEVycm9yfSAtIFRocm93biBpZiB0aGUgd29ya2VyIGhhcyBhIHN5bnRheCBlcnJvci5cclxuICovXHJcbmZ1bmN0aW9uIG1ha2VXZWJXb3JrZXIoY29udGVudCkge1xyXG4gIHZhciBibG9iID0gbmV3IEJsb2IoXHJcbiAgICBbY29udGVudF0sXHJcbiAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnfVxyXG4gICk7XHJcbiAgdmFyIHdvcmtlciA9IG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XHJcbiAgcmV0dXJuIHdvcmtlcjtcclxufVxyXG52YXIgYVN0YXJXb3JrZXIgPSByZXF1aXJlKCcuL2FTdGFyV29ya2VyLmpzJyk7XHJcbnZhciB3b3JrZXJDb250ZW50ID0gJygnICsgYVN0YXJXb3JrZXIudG9TdHJpbmcoKSArICcoKSknO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGdldFdvcmtlclByb21pc2Uod29ya2VyQ29udGVudCk7XHJcbiJdfQ==
