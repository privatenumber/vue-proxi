!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("vue")):"function"==typeof define&&define.amd?define(["exports","vue"],t):t((e=e||self).VoodooDoll={},e.Vue)}(this,(function(e,t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var n=Object.prototype.hasOwnProperty,r=function(e,t){return n.call(e,t)},i=/-(\w)/g;var o={functional:!0,props:{secret:{type:[Symbol,String],required:!0}},render:function(e,n){var r=n.props.secret;if(r){var i=n.data;!function(e,n,r){e._provided||(e._provided={}),e._provided[n]?Object.assign(e._provided[n],r):e._provided[n]=t.observable(r)}(n.parent,r,{data:i})}return n.slots().default}};e.VoodooMixin=function(e){var t,n=void 0===e?{}:e,o=n.from,u=n.props,f=void 0===u?[]:u;return{inject:(t={},t.__voodooInjection={from:o,default:void 0},t),created:function(){var e=(this.__voodooInjection||{}).data;if(e)for(var t in e.on)r(e.on,t)&&this.$on(t,e.on[t])},computed:f.reduce((function(e,t){return e[t]=function(){return this.$$.props[t]},e}),{$$:function(){var e=(this.__voodooInjection||{}).data;return e?Object.assign({class:e.staticClass||e.class?[e.staticClass,e.class]:void 0,listeners:e.on},function(e,t){var n={};for(var o in t)if(r(t,o)){var u=o.replace(i,(function(e,t){return t?t.toUpperCase():""})),f=t[o];e.includes(u)&&(n[u]=f,delete t[o])}return{attrs:t,props:n}}(f,Object.assign({},e.attrs))):{}}})}},e.default=o,Object.defineProperty(e,"__esModule",{value:!0})}));