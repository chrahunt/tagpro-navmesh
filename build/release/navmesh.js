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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var partition = require('./partition');
var geo = require('./geometry');
var Point = geo.Point;
var Poly = geo.Poly;
var Edge = geo.Edge;

var MapParser = require('./parse-map');
var Pathfinder = require('./pathfinder');

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
  };
  var navigation_dynamic_objects = parsedMap.dynamic_obstacles;

  // Offset polys from side so they represent traversable area.
  var areas = this._offsetPolys(navigation_static_objects);

  this.polys = areas.map(NavMesh._geometry.partitionArea);
  this.polys = NavMesh._util.flatten(this.polys);

  if (!this.workerInitialized) {
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
  this.worker = new Worker(window.URL.createObjectURL(new Blob(['(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n(function (global){\n!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.PriorityQueue=t()}}(function(){return function t(e,i,r){function o(n,s){if(!i[n]){if(!e[n]){var u="function"==typeof require&&require;if(!s&&u)return u(n,!0);if(a)return a(n,!0);var h=new Error("Cannot find module \'"+n+"\'");throw h.code="MODULE_NOT_FOUND",h}var p=i[n]={exports:{}};e[n][0].call(p.exports,function(t){var i=e[n][1][t];return o(i?i:t)},p,p.exports,t,e,i,r)}return i[n].exports}for(var a="function"==typeof require&&require,n=0;n<r.length;n++)o(r[n]);return o}({1:[function(t,e){var i,r,o,a,n,s={}.hasOwnProperty,u=function(t,e){function i(){this.constructor=t}for(var r in e)s.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t};i=t("./PriorityQueue/AbstractPriorityQueue"),r=t("./PriorityQueue/ArrayStrategy"),a=t("./PriorityQueue/BinaryHeapStrategy"),o=t("./PriorityQueue/BHeapStrategy"),n=function(t){function e(t){t||(t={}),t.strategy||(t.strategy=a),t.comparator||(t.comparator=function(t,e){return(t||0)-(e||0)}),e.__super__.constructor.call(this,t)}return u(e,t),e}(i),n.ArrayStrategy=r,n.BinaryHeapStrategy=a,n.BHeapStrategy=o,e.exports=n},{"./PriorityQueue/AbstractPriorityQueue":2,"./PriorityQueue/ArrayStrategy":3,"./PriorityQueue/BHeapStrategy":4,"./PriorityQueue/BinaryHeapStrategy":5}],2:[function(t,e){var i;e.exports=i=function(){function t(t){if(null==(null!=t?t.strategy:void 0))throw"Must pass options.strategy, a strategy";if(null==(null!=t?t.comparator:void 0))throw"Must pass options.comparator, a comparator";this.priv=new t.strategy(t),this.length=0}return t.prototype.queue=function(t){return this.length++,void this.priv.queue(t)},t.prototype.dequeue=function(){if(!this.length)throw"Empty queue";return this.length--,this.priv.dequeue()},t.prototype.peek=function(){if(!this.length)throw"Empty queue";return this.priv.peek()},t}()},{}],3:[function(t,e){var i,r;r=function(t,e,i){var r,o,a;for(o=0,r=t.length;r>o;)a=o+r>>>1,i(t[a],e)>=0?o=a+1:r=a;return o},e.exports=i=function(){function t(t){var e;this.options=t,this.comparator=this.options.comparator,this.data=(null!=(e=this.options.initialValues)?e.slice(0):void 0)||[],this.data.sort(this.comparator).reverse()}return t.prototype.queue=function(t){var e;return e=r(this.data,t,this.comparator),void this.data.splice(e,0,t)},t.prototype.dequeue=function(){return this.data.pop()},t.prototype.peek=function(){return this.data[this.data.length-1]},t}()},{}],4:[function(t,e){var i;e.exports=i=function(){function t(t){var e,i,r,o,a,n,s,u,h;for(this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.pageSize=(null!=t?t.pageSize:void 0)||512,this.length=0,r=0;1<<r<this.pageSize;)r+=1;if(1<<r!==this.pageSize)throw"pageSize must be a power of two";for(this._shift=r,this._emptyMemoryPageTemplate=e=[],i=a=0,u=this.pageSize;u>=0?u>a:a>u;i=u>=0?++a:--a)e.push(null);if(this._memory=[],this._mask=this.pageSize-1,t.initialValues)for(h=t.initialValues,n=0,s=h.length;s>n;n++)o=h[n],this.queue(o)}return t.prototype.queue=function(t){return this.length+=1,this._write(this.length,t),void this._bubbleUp(this.length,t)},t.prototype.dequeue=function(){var t,e;return t=this._read(1),e=this._read(this.length),this.length-=1,this.length>0&&(this._write(1,e),this._bubbleDown(1,e)),t},t.prototype.peek=function(){return this._read(1)},t.prototype._write=function(t,e){var i;for(i=t>>this._shift;i>=this._memory.length;)this._memory.push(this._emptyMemoryPageTemplate.slice(0));return this._memory[i][t&this._mask]=e},t.prototype._read=function(t){return this._memory[t>>this._shift][t&this._mask]},t.prototype._bubbleUp=function(t,e){var i,r,o,a;for(i=this.comparator;t>1&&(r=t&this._mask,t<this.pageSize||r>3?o=t&~this._mask|r>>1:2>r?(o=t-this.pageSize>>this._shift,o+=o&~(this._mask>>1),o|=this.pageSize>>1):o=t-2,a=this._read(o),!(i(a,e)<0));)this._write(o,e),this._write(t,a),t=o;return void 0},t.prototype._bubbleDown=function(t,e){var i,r,o,a,n;for(n=this.comparator;t<this.length;)if(t>this._mask&&!(t&this._mask-1)?i=r=t+2:t&this.pageSize>>1?(i=(t&~this._mask)>>1,i|=t&this._mask>>1,i=i+1<<this._shift,r=i+1):(i=t+(t&this._mask),r=i+1),i!==r&&r<=this.length)if(o=this._read(i),a=this._read(r),n(o,e)<0&&n(o,a)<=0)this._write(i,e),this._write(t,o),t=i;else{if(!(n(a,e)<0))break;this._write(r,e),this._write(t,a),t=r}else{if(!(i<=this.length))break;if(o=this._read(i),!(n(o,e)<0))break;this._write(i,e),this._write(t,o),t=i}return void 0},t}()},{}],5:[function(t,e){var i;e.exports=i=function(){function t(t){var e;this.comparator=(null!=t?t.comparator:void 0)||function(t,e){return t-e},this.length=0,this.data=(null!=(e=t.initialValues)?e.slice(0):void 0)||[],this._heapify()}return t.prototype._heapify=function(){var t,e,i;if(this.data.length>0)for(t=e=1,i=this.data.length;i>=1?i>e:e>i;t=i>=1?++e:--e)this._bubbleUp(t);return void 0},t.prototype.queue=function(t){return this.data.push(t),void this._bubbleUp(this.data.length-1)},t.prototype.dequeue=function(){var t,e;return e=this.data[0],t=this.data.pop(),this.data.length>0&&(this.data[0]=t,this._bubbleDown(0)),e},t.prototype.peek=function(){return this.data[0]},t.prototype._bubbleUp=function(t){for(var e,i;t>0&&(e=t-1>>>1,this.comparator(this.data[t],this.data[e])<0);)i=this.data[e],this.data[e]=this.data[t],this.data[t]=i,t=e;return void 0},t.prototype._bubbleDown=function(t){var e,i,r,o,a;for(e=this.data.length-1;;){if(i=(t<<1)+1,o=i+1,r=t,e>=i&&this.comparator(this.data[i],this.data[r])<0&&(r=i),e>=o&&this.comparator(this.data[o],this.data[r])<0&&(r=o),r===t)break;a=this.data[r],this.data[r]=this.data[t],this.data[t]=a,t=r}return void 0},t}()},{}]},{},[1])(1)});\n}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})\n},{}],2:[function(require,module,exports){\nvar Pathfinder = require(\'./pathfinder\');\r\nvar geo = require(\'./geometry\');\r\n\r\n/**\r\n * Pathfinding web worker implementation.\r\n * @ignore\r\n */\r\nvar Point = geo.Point;\r\nvar Poly = geo.Poly;\r\n\r\n/**\r\n * Object with utility methods for converting objects from serialized\r\n * message form into the required objects.\r\n * @private\r\n */\r\nvar Convert = {};\r\n\r\n/**\r\n * The format of a Point as serialized by the Web Worker message-\r\n * passing interface.\r\n * @private\r\n * @typedef {object} PointObj\r\n * @property {number} x\r\n * @property {number} y\r\n */\r\n\r\n/**\r\n * Convert serialized Point object back to Point.\r\n * @private\r\n * @param {PointObj} obj - The serialized Point object.\r\n */\r\nConvert.toPoint = function(obj) {\r\n  return new Point(obj.x, obj.y);\r\n};\r\n\r\n/**\r\n * The format of a Poly as serialized by the Web Worker message-\r\n * passing interface.\r\n * @private\r\n * @typedef {object} PolyObj\r\n * @property {Array.<PointObj>} points - The array of serialized\r\n *   Points.\r\n * @property {boolean} hole - Whether or not the polygon is a hole.\r\n * @property {integer} numpoints - The number of points in the Poly.\r\n */\r\n\r\n /**\r\n  * Convert serialized Poly object back to Poly.\r\n  * @private\r\n  * @param {PolyObj} obj - The serialized Poly object.\r\n  */\r\nConvert.toPoly = function(obj) {\r\n  var poly = new Poly();\r\n  poly.points = obj.points.map(Convert.toPoint);\r\n  poly.hole = obj.hole;\r\n  poly.update();\r\n  return poly;\r\n};\r\n\r\nvar Logger = {};\r\n\r\n/**\r\n * Sends message to parent to be logged to console. Takes same\r\n * arguments as Bragi logger.\r\n * @private\r\n * @param {string} group - The group to associate the message with.\r\n * @param {...*} - arbitrary arguments to be passed back to the parent\r\n *   logging function.\r\n */\r\nLogger.log = function(group) {\r\n  var message = ["log"];\r\n  Array.prototype.push.apply(message, arguments);\r\n  postMessage(message);\r\n};\r\n\r\nvar Util = {};\r\n\r\nUtil.splice = function(ary, indices) {\r\n  indices = indices.sort(Util._numberCompare).reverse();\r\n  var removed = [];\r\n  indices.forEach(function(i) {\r\n    removed.push(ary.splice(i, 1)[0]);\r\n  });\r\n  return removed;\r\n};\r\n\r\nUtil._numberCompare = function(a, b) {\r\n  if (a < b) {\r\n    return -1;\r\n  } else if (a > b) {\r\n    return 1;\r\n  } else {\r\n    return 0;\r\n  }\r\n};\r\n\r\n/**\r\n * Set up various actions to take on communication.\r\n * @private\r\n * @param {Array} e - An array with the first element being a string\r\n *   identifier for the message type, and subsequent elements being\r\n *   arguments to be passed to the relevant function. Message types:\r\n *   * polys - sets the polygons to use for navigation\r\n *       - {Array.<Poly>} array of polygons defining the map\r\n *   * aStar - computes A* on above-set items\r\n *       - {Point} start location to use for search\r\n *       - {Point} end location to use for search\r\n *   * isInitialized - check if the worker is initialized.\r\n */\r\nonmessage = function(e) {\r\n  var data = e.data;\r\n  var name = data[0];\r\n  Logger.log("worker:debug", "Message received by worker:", data);\r\n  if (name == "polys") {\r\n    // Polygons defining map.\r\n    self.polys = data[1].map(Convert.toPoly);\r\n\r\n    // Initialize pathfinder module.\r\n    self.pathfinder = new Pathfinder(self.polys);\r\n  } else if (name == "polyUpdate") {\r\n    // Update to navmesh.\r\n    var newPolys = data[1].map(Convert.toPoly);\r\n    var removedPolys = data[2];\r\n\r\n    Util.splice(self.polys, removedPolys);\r\n    Array.prototype.push.apply(self.polys, newPolys);\r\n\r\n    // Re-initialize pathfinder.\r\n    self.pathfinder = new Pathfinder(self.polys);\r\n  } else if (name == "aStar") {\r\n    var source = Convert.toPoint(data[1]);\r\n    var target = Convert.toPoint(data[2]);\r\n\r\n    var path = self.pathfinder.aStar(source, target);\r\n    postMessage(["result", path]);\r\n  } else if (name == "isInitialized") {\r\n    postMessage(["initialized"]);\r\n  }\r\n};\r\n\r\nLogger.log("worker", "Worker loaded.");\r\n// Sent confirmation that worker is initialized.\r\npostMessage(["initialized"]);\r\n\n},{"./geometry":3,"./pathfinder":4}],3:[function(require,module,exports){\n/**\r\n * A point can represent a vertex in a 2d environment or a vector.\r\n * @constructor\r\n * @param {number} x - The `x` coordinate of the point.\r\n * @param {number} y - The `y` coordinate of the point.\r\n */\r\nPoint = function(x, y) {\r\n  this.x = x;\r\n  this.y = y;\r\n};\r\nexports.Point = Point;\r\n\r\n/**\r\n * Convert a point-like object into a point.\r\n * @param {PointLike} p - The point-like object to convert.\r\n * @return {Point} - The new point representing the point-like\r\n *   object.\r\n */\r\nPoint.fromPointLike = function(p) {\r\n  return new Point(p.x, p.y);\r\n};\r\n\r\n/**\r\n * String method for point-like objects.\r\n * @param {PointLike} p - The point-like object to convert.\r\n * @return {Point} - The new point representing the point-like\r\n *   object.\r\n */\r\nPoint.toString = function(p) {\r\n  return "x" + p.x + "y" + p.y;\r\n};\r\n\r\n/**\r\n * Takes a point or scalar and adds slotwise in the case of another\r\n * point, or to each parameter in the case of a scalar.\r\n * @param {(Point|number)} - The Point, or scalar, to add to this\r\n *   point.\r\n */\r\nPoint.prototype.add = function(p) {\r\n  if (typeof p == "number")\r\n    return new Point(this.x + p, this.y + p);\r\n  return new Point(this.x + p.x, this.y + p.y);\r\n};\r\n\r\n/**\r\n * Takes a point or scalar and subtracts slotwise in the case of\r\n * another point or from each parameter in the case of a scalar.\r\n * @param {(Point|number)} - The Point, or scalar, to subtract from\r\n *   this point.\r\n */\r\nPoint.prototype.sub = function(p) {\r\n  if (typeof p == "number")\r\n    return new Point(this.x - p, this.y - p);\r\n  return new Point(this.x - p.x, this.y - p.y);\r\n};\r\n\r\n/**\r\n * Takes a scalar value and multiplies each parameter of the point\r\n * by the scalar.\r\n * @param  {number} f - The number to multiple the parameters by.\r\n * @return {Point} - A new point with the calculated coordinates.\r\n */\r\nPoint.prototype.mul = function(f) {\r\n  return new Point(this.x * f, this.y * f);\r\n};\r\n\r\n/**\r\n * Takes a scalar value and divides each parameter of the point\r\n * by the scalar.\r\n * @param  {number} f - The number to divide the parameters by.\r\n * @return {Point} - A new point with the calculated coordinates.\r\n */\r\nPoint.prototype.div = function(f) {\r\n  return new Point(this.x / f, this.y / f);\r\n};\r\n\r\n/**\r\n * Takes another point and returns a boolean indicating whether the\r\n * points are equal. Two points are equal if their parameters are\r\n * equal.\r\n * @param  {Point} p - The point to check equality against.\r\n * @return {boolean} - Whether or not the two points are equal.\r\n */\r\nPoint.prototype.eq = function(p) {\r\n  return (this.x == p.x && this.y == p.y);\r\n};\r\n\r\n/**\r\n * Takes another point and returns a boolean indicating whether the\r\n * points are not equal. Two points are considered not equal if their\r\n * parameters are not equal.\r\n * @param  {Point} p - The point to check equality against.\r\n * @return {boolean} - Whether or not the two points are not equal.\r\n */\r\nPoint.prototype.neq = function(p) {\r\n  return (this.x != p.x || this.y != p.y);\r\n};\r\n\r\n// Given another point, returns the dot product.\r\nPoint.prototype.dot = function(p) {\r\n  return (this.x * p.x + this.y * p.y);\r\n};\r\n\r\n// Given another point, returns the \'cross product\', or at least the 2d\r\n// equivalent.\r\nPoint.prototype.cross = function(p) {\r\n  return (this.x * p.y - this.y * p.x);\r\n};\r\n\r\n// Given another point, returns the distance to that point.\r\nPoint.prototype.dist = function(p) {\r\n  var diff = this.sub(p);\r\n  return Math.sqrt(diff.dot(diff));\r\n};\r\n\r\n// Given another point, returns the squared distance to that point.\r\nPoint.prototype.dist2 = function(p) {\r\n  var diff = this.sub(p);\r\n  return diff.dot(diff);\r\n};\r\n\r\n/**\r\n * Returns true if the point is (0, 0).\r\n * @return {boolean} - Whether or not the point is (0, 0).\r\n */\r\nPoint.prototype.zero = function() {\r\n  return this.x == 0 && this.y == 0;\r\n};\r\n\r\nPoint.prototype.len = function() {\r\n  return this.dist(new Point(0, 0));\r\n};\r\n\r\nPoint.prototype.normalize = function() {\r\n  var n = this.dist(new Point(0, 0));\r\n  if (n > 0) return this.div(n);\r\n  return new Point(0, 0);\r\n};\r\n\r\nPoint.prototype.toString = function() {\r\n  return \'x\' + this.x + \'y\' + this.y;\r\n};\r\n\r\n/**\r\n * Return a copy of the point.\r\n * @return {Point} - The new point.\r\n */\r\nPoint.prototype.clone = function() {\r\n  return new Point(this.x, this.y);\r\n};\r\n\r\n/**\r\n * Edges are used to represent the border between two adjacent\r\n * polygons.\r\n * @constructor\r\n * @param {Point} p1 - The first point of the edge.\r\n * @param {Point} p2 - The second point of the edge.\r\n */\r\nEdge = function(p1, p2) {\r\n  this.p1 = p1;\r\n  this.p2 = p2;\r\n  this.center = p1.add(p2.sub(p1).div(2));\r\n  this.points = [this.p1, this.center, this.p2];\r\n};\r\nexports.Edge = Edge;\r\n\r\nEdge.prototype._CCW = function(p1, p2, p3) {\r\n  a = p1.x; b = p1.y;\r\n  c = p2.x; d = p2.y;\r\n  e = p3.x; f = p3.y;\r\n  return (f - b) * (c - a) > (d - b) * (e - a);\r\n};\r\n\r\n/**\r\n * from http://stackoverflow.com/a/16725715\r\n * Checks whether this edge intersects the provided edge.\r\n * @param {Edge} edge - The edge to check intersection for.\r\n * @return {boolean} - Whether or not the edges intersect.\r\n */\r\nEdge.prototype.intersects = function(edge) {\r\n  var q1 = edge.p1, q2 = edge.p2;\r\n  if (q1.eq(this.p1) || q1.eq(this.p2) || q2.eq(this.p1) || q2.eq(this.p2)) return false;\r\n  return (this._CCW(this.p1, q1, q2) != this._CCW(this.p2, q1, q2)) && (this._CCW(this.p1, this.p2, q1) != this._CCW(this.p1, this.p2, q2));\r\n};\r\n\r\n/**\r\n * Polygon class.\r\n * Can be initialized with an array of points.\r\n * @constructor\r\n * @param {Array.<Point>} [points] - The points to use to initialize\r\n *   the poly.\r\n */\r\nPoly = function(points) {\r\n  if (typeof points == \'undefined\') points = false;\r\n  this.hole = false;\r\n  this.points = null;\r\n  this.numpoints = 0;\r\n  if (points) {\r\n    this.numpoints = points.length;\r\n    this.points = points.slice();\r\n  }\r\n};\r\nexports.Poly = Poly;\r\n\r\nPoly.prototype.init = function(n) {\r\n  this.points = new Array(n);\r\n  this.numpoints = n;\r\n};\r\n\r\nPoly.prototype.update = function() {\r\n  this.numpoints = this.points.length;\r\n};\r\n\r\nPoly.prototype.triangle = function(p1, p2, p3) {\r\n  this.init(3);\r\n  this.points[0] = p1;\r\n  this.points[1] = p2;\r\n  this.points[2] = p3;\r\n};\r\n\r\n// Takes an index and returns the point at that index, or null.\r\nPoly.prototype.getPoint = function(n) {\r\n  if (this.points && this.numpoints > n)\r\n    return this.points[n];\r\n  return null;\r\n};\r\n\r\n// Set a point, fails silently otherwise. TODO: replace with bracket notation.\r\nPoly.prototype.setPoint = function(i, p) {\r\n  if (this.points && this.points.length > i) {\r\n    this.points[i] = p;\r\n  }\r\n};\r\n\r\n// Given an index i, return the index of the next point.\r\nPoly.prototype.getNextI = function(i) {\r\n  return (i + 1) % this.numpoints;\r\n};\r\n\r\nPoly.prototype.getPrevI = function(i) {\r\n  if (i == 0)\r\n    return (this.numpoints - 1);\r\n  return i - 1;\r\n};\r\n\r\n// Returns the signed area of a polygon, if the vertices are given in\r\n// CCW order then the area will be > 0, < 0 otherwise.\r\nPoly.prototype.getArea = function() {\r\n  var area = 0;\r\n  for (var i = 0; i < this.numpoints; i++) {\r\n    var i2 = this.getNextI(i);\r\n    area += this.points[i].x * this.points[i2].y - this.points[i].y * this.points[i2].x;\r\n  }\r\n  return area;\r\n};\r\n\r\nPoly.prototype.getOrientation = function() {\r\n  var area = this.getArea();\r\n  if (area > 0) return "CCW";\r\n  if (area < 0) return "CW";\r\n  return 0;\r\n};\r\n\r\nPoly.prototype.setOrientation = function(orientation) {\r\n  var current_orientation = this.getOrientation();\r\n  if (current_orientation && (current_orientation !== orientation)) {\r\n    this.invert();\r\n  }\r\n};\r\n\r\nPoly.prototype.invert = function() {\r\n  var newpoints = new Array(this.numpoints);\r\n  for (var i = 0; i < this.numpoints; i++) {\r\n    newpoints[i] = this.points[this.numpoints - i - 1];\r\n  }\r\n  this.points = newpoints;\r\n};\r\n\r\nPoly.prototype.getCenter = function() {\r\n  var x = this.points.map(function(p) { return p.x });\r\n  var y = this.points.map(function(p) { return p.y });\r\n  var minX = Math.min.apply(null, x);\r\n  var maxX = Math.max.apply(null, x);\r\n  var minY = Math.min.apply(null, y);\r\n  var maxY = Math.max.apply(null, y);\r\n  return new Point((minX + maxX)/2, (minY + maxY)/2);\r\n};\r\n\r\n// Adapted from http://stackoverflow.com/a/16283349\r\nPoly.prototype.centroid = function() {\r\n  var x = 0,\r\n      y = 0,\r\n      i,\r\n      j,\r\n      f,\r\n      point1,\r\n      point2;\r\n\r\n  for (i = 0, j = this.points.length - 1; i < this.points.length; j = i, i += 1) {\r\n    point1 = this.points[i];\r\n    point2 = this.points[j];\r\n    f = point1.x * point2.y - point2.x * point1.y;\r\n    x += (point1.x + point2.x) * f;\r\n    y += (point1.y + point2.y) * f;\r\n  }\r\n\r\n  f = this.getArea() * 3;\r\n  x = Math.abs(x);\r\n  y = Math.abs(y);\r\n  return new Point(x / f, y / f);\r\n};\r\n\r\nPoly.prototype.toString = function() {\r\n  var center = this.centroid();\r\n  return "" + center.x + " " + center.y;\r\n};\r\n\r\n/**\r\n * Checks if the given point is contained within the Polygon.\r\n * Adapted from http://stackoverflow.com/a/8721483\r\n *\r\n * @param {Point} p - The point to check.\r\n * @return {boolean} - Whether or not the point is contained within\r\n *   the polygon.\r\n */\r\nPoly.prototype.containsPoint = function(p) {\r\n  var result = false;\r\n  for (var i = 0, j = this.numpoints - 1; i < this.numpoints; j = i++) {\r\n    var p1 = this.points[j], p2 = this.points[i];\r\n    if ((p2.y > p.y) != (p1.y > p.y) &&\r\n        (p.x < (p1.x - p2.x) * (p.y - p2.y) / (p1.y - p2.y) + p2.x)) {\r\n      result = !result;\r\n    }\r\n  }\r\n  return result;\r\n};\r\n\r\n/**\r\n * Clone the given polygon into a new polygon.\r\n * @return {Poly} - A clone of the polygon.\r\n */\r\nPoly.prototype.clone = function() {\r\n  return new Poly(this.points.slice().map(function(point) {\r\n    return point.clone();\r\n  }));\r\n};\r\n\r\n/**\r\n * Translate a polygon along a given vector.\r\n * @param {Point} vec - The vector along which to translate the\r\n *   polygon.\r\n * @return {Poly} - The translated polygon.\r\n */\r\nPoly.prototype.translate = function(vec) {\r\n  return new Poly(this.points.map(function(point) {\r\n    return point.add(vec);\r\n  }));\r\n};\r\n\r\n/**\r\n * Returns an array of edges representing the polygon.\r\n * @return {Array.<Edge>} - The edges of the polygon.\r\n */\r\nPoly.prototype.edges = function() {\r\n  if (!this.hasOwnProperty("cached_edges")) {\r\n    this.cached_edges = this.points.map(function(point, i) {\r\n      return new Edge(point, this.points[this.getNextI(i)]);\r\n    }, this);\r\n  }\r\n  return this.cached_edges;\r\n};\r\n\r\n/**\r\n * Naive check if other poly intersects this one, assuming both convex.\r\n * @param {Poly} poly\r\n * @return {boolean} - Whether the polygons intersect.\r\n */\r\nPoly.prototype.intersects = function(poly) {\r\n  var inside = poly.points.some(function(p) {\r\n    return this.containsPoint(p);\r\n  }, this);\r\n  inside = inside || this.points.some(function(p) {\r\n    return poly.containsPoint(p);\r\n  });\r\n  if (inside) {\r\n    return true;\r\n  } else {\r\n    var ownEdges = this.edges();\r\n    var otherEdges = poly.edges();\r\n    var intersect = ownEdges.some(function(ownEdge) {\r\n      return otherEdges.some(function(otherEdge) {\r\n        return ownEdge.intersects(otherEdge);\r\n      });\r\n    });\r\n    return intersect;\r\n  }\r\n};\r\n\r\nvar util = {};\r\nexports.util = util;\r\n\r\n/**\r\n * Given an array of polygons, returns the one that contains the point.\r\n * If no polygon is found, null is returned.\r\n * @param {Point} p - The point to find the polygon for.\r\n * @param {Array.<Poly>} polys - The polygons to search for the point.\r\n * @return {?Polygon} - The polygon containing the point.\r\n */\r\nutil.findPolyForPoint = function(p, polys) {\r\n  var i, poly;\r\n  for (i in polys) {\r\n    poly = polys[i];\r\n    if (poly.containsPoint(p)) {\r\n      return poly;\r\n    }\r\n  }\r\n  return null;\r\n};\r\n\r\n/**\r\n * Holds the properties of a collision, if one occurred.\r\n * @typedef Collision\r\n * @type {object}\r\n * @property {boolean} collides - Whether there is a collision.\r\n * @property {boolean} inside - Whether one object is inside the other.\r\n * @property {?Point} point - The point of collision, if collision\r\n *   occurs, and if `inside` is false.\r\n * @property {?Point} normal - A unit vector normal to the point\r\n *   of collision, if it occurs and if `inside` is false.\r\n */\r\n/**\r\n * If the ray intersects the circle, the distance to the intersection\r\n * along the ray is returned, otherwise false is returned.\r\n * @param {Point} p - The start of the ray.\r\n * @param {Point} ray - Unit vector extending from `p`.\r\n * @param {Point} c - The center of the circle for the object being\r\n *   checked for intersection.\r\n * @param {number} radius - The radius of the circle.\r\n * @return {Collision} - The collision information.\r\n */\r\nutil.lineCircleIntersection = function(p, ray, c, radius) {\r\n  var collision = {\r\n    collides: false,\r\n    inside: false,\r\n    point: null,\r\n    normal: null\r\n  };\r\n  var vpc = c.sub(p);\r\n\r\n  if (vpc.len() <= radius) {\r\n    // Point is inside obstacle.\r\n    collision.collides = true;\r\n    collision.inside = (vpc.len() !== radius);\r\n  } else if (ray.dot(vpc) >= 0) {\r\n    // Circle is ahead of point.\r\n    // Projection of center point onto ray.\r\n    var pc = p.add(ray.mul(ray.dot(vpc)));\r\n    // Length from c to its projection on the ray.\r\n    var len_c_pc = c.sub(pc).len();\r\n\r\n    if (len_c_pc <= radius) {\r\n      collision.collides = true;\r\n\r\n      // Distance from projected point to intersection.\r\n      var len_intersection = Math.sqrt(len_c_pc * len_c_pc + radius * radius);\r\n      collision.point = pc.sub(ray.mul(len_intersection));\r\n      collision.normal = collision.point.sub(c).normalize();\r\n    }\r\n  }\r\n  return collision;\r\n};\r\n\n},{}],4:[function(require,module,exports){\nvar geo = require(\'./geometry\');\r\nvar findPolyForPoint = geo.util.findPolyForPoint;\r\nvar PriorityQueue = require(\'priority-queue\');\r\n\r\n/**\r\n * Pathfinder implements pathfinding on a navigation mesh.\r\n * @constructor\r\n * @param {Array.<Poly>} polys - The polygons defining the navigation mesh.\r\n * @param {boolean} [init=true] - Whether or not to initialize the pathfinder.\r\n */\r\nvar Pathfinder = function(polys, init) {\r\n  if (typeof init == "undefined") init = true;\r\n  this.polys = polys;\r\n  if (init) {\r\n    this.init();\r\n  }\r\n};\r\nmodule.exports = Pathfinder;\r\n\r\nPathfinder.prototype.init = function() {\r\n  this.grid = this.generateAdjacencyGrid(this.polys);\r\n};\r\n\r\n/**\r\n * Computes path from source to target, using sides and centers of the edges\r\n * between adjacent polygons. source and target are Points and polys should\r\n * be the final partitioned map.\r\n * @param {Point} source - The start location for the search.\r\n * @param {Point} target - The target location for the search.\r\n * @return {?Array.<Point>} - A series of points representing the path from\r\n *   the source to the target. If a path is not found, `null` is returned.\r\n */\r\nPathfinder.prototype.aStar = function(source, target) {\r\n  // Compares the value of two nodes.\r\n  function nodeValue(node1, node2) {\r\n    return (node1.dist + heuristic(node1.point)) - (node2.dist + heuristic(node2.point));\r\n  }\r\n\r\n  // Distance between polygons.\r\n  function euclideanDistance(p1, p2) {\r\n    return p1.dist(p2);\r\n  }\r\n\r\n  // Distance between polygons. todo: update\r\n  function manhattanDistance(elt1, elt2) {\r\n    return (elt1.r - elt2.r) + (elt1.c - elt2.c);\r\n  }\r\n\r\n  // Takes Point and returns value.\r\n  function heuristic(p) {\r\n    return euclideanDistance(p, target);\r\n  }\r\n\r\n  var sourcePoly = findPolyForPoint(source, this.polys);\r\n\r\n  // We\'re outside of the mesh somehow. Try a few nearby points.\r\n  if (!sourcePoly) {\r\n    var offsetSource = [new Point(5, 0), new Point(-5, 0), new Point(0, -5), new Point(0, 5)];\r\n    for (var i = 0; i < offsetSource.length; i++) {\r\n      // Make new point.\r\n      var point = source.add(offsetSource[i]);\r\n      sourcePoly = findPolyForPoint(point, this.polys);\r\n      if (sourcePoly) {\r\n        source = point;\r\n        break;\r\n      }\r\n    }\r\n    if (!sourcePoly) {\r\n      return null;\r\n    }\r\n  }\r\n  var targetPoly = findPolyForPoint(target, this.polys);\r\n\r\n  // Handle trivial case.\r\n  if (sourcePoly == targetPoly) {\r\n    return [source, target];\r\n  }\r\n\r\n  // Warning, may have compatibility issues.\r\n  var discoveredPolys = new WeakSet();\r\n  var discoveredPoints = new WeakSet();\r\n  var pq = new PriorityQueue({ comparator: nodeValue });\r\n  var found = null;\r\n  // Initialize with start location.\r\n  pq.queue({dist: 0, poly: sourcePoly, point: source, parent: null});\r\n  while (pq.length > 0) {\r\n    var node = pq.dequeue();\r\n    if (node.poly == targetPoly) {\r\n      found = node;\r\n      break;\r\n    } else {\r\n      discoveredPolys.add(node.poly);\r\n      discoveredPoints.add(node.point);\r\n    }\r\n    // This may be undefined if there was no polygon found.\r\n    var neighbors = this.grid.get(node.poly);\r\n    for (var i = 0; i < neighbors.length; i++) {\r\n      var elt = neighbors[i];\r\n      var neighborFound = discoveredPolys.has(elt.poly);\r\n\r\n      for (var j = 0; j < elt.edge.points.length; j++) {\r\n        var p = elt.edge.points[j];\r\n        if (!neighborFound || !discoveredPoints.has(p))\r\n          pq.queue({dist: node.dist + euclideanDistance(p, node.point), poly: elt.poly, point: p, parent: node});\r\n      }\r\n    }\r\n  }\r\n\r\n  if (found) {\r\n    var path = [];\r\n    var current = found;\r\n    while (current.parent) {\r\n      path.unshift(current.point);\r\n      current = current.parent;\r\n    }\r\n    path.unshift(current.point);\r\n    // Add end point to path.\r\n    path.push(target);\r\n    return path;\r\n  } else {\r\n    return null;\r\n  }\r\n};\r\n\r\n/**\r\n * Holds the "neighbor" relationship of Poly objects in the partition\r\n * using the Poly\'s themselves as keys, and an array of Poly\'s as\r\n * values, where the Polys in the array are neighbors of the Poly\r\n * that was the key.\r\n * @typedef AdjacencyGrid\r\n * @type {Object.<Poly, Array<Poly>>}\r\n */\r\n\r\n/**\r\n * Given an array of Poly objects, find all neighboring polygons for\r\n * each polygon.\r\n * @private\r\n * @param {Array.<Poly>} polys - The array of polys to find neighbors\r\n *   among.\r\n * @return {AdjacencyGrid} - The "neighbor" relationships.\r\n */\r\nPathfinder.prototype.generateAdjacencyGrid = function(polys) {\r\n  var neighbors = new WeakMap();\r\n  polys.forEach(function(poly, polyI, polys) {\r\n    if (neighbors.has(poly)) {\r\n      // Maximum number of neighbors already found.\r\n      if (neighbors.get(poly).length == poly.numpoints) {\r\n        return;\r\n      }\r\n    } else {\r\n      // Initialize array.\r\n      neighbors.set(poly, new Array());\r\n    }\r\n    // Of remaining polygons, find some that are adjacent.\r\n    poly.points.forEach(function(p1, i, points) {\r\n      // Next point.\r\n      var p2 = points[poly.getNextI(i)];\r\n      for (var polyJ = polyI + 1; polyJ < polys.length; polyJ++) {\r\n        var poly2 = polys[polyJ];\r\n        // Iterate over points until match is found.\r\n        poly2.points.some(function(q1, j, points2) {\r\n          var q2 = points2[poly2.getNextI(j)];\r\n          var match = p1.eq(q2) && p2.eq(q1);\r\n          if (match) {\r\n            var edge = new Edge(p1, p2);\r\n            neighbors.get(poly).push({ poly: poly2, edge: edge });\r\n            if (!neighbors.has(poly2)) {\r\n              neighbors.set(poly2, new Array());\r\n            }\r\n            neighbors.get(poly2).push({ poly: poly, edge: edge });\r\n          }\r\n          return match;\r\n        });\r\n        if (neighbors.get(poly).length == poly.numpoints) break;\r\n      }\r\n    });\r\n  });\r\n  return neighbors;\r\n};\r\n\n},{"./geometry":3,"priority-queue":1}]},{},[2])'],{type:"text/javascript"})));
  this.worker.onmessage = this._getWorkerInterface();
  // Check if worker is already initialized.
  this.worker.postMessage(["isInitialized"]);
  this.workerInitialized = false;

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

},{"./geometry":6,"./parse-map":8,"./partition":9,"./pathfinder":10,"jsclipper":1,"math-round":2}],8:[function(require,module,exports){
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

},{"./action-values":5,"./geometry":6}],9:[function(require,module,exports){
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

},{"./geometry":6,"poly2tri":3}],10:[function(require,module,exports){
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

},{"./geometry":6,"priority-queue":4}]},{},[7])(7)
});