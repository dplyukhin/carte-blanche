(this.webpackJsonpdse=this.webpackJsonpdse||[]).push([[0],{151:function(e,t,n){e.exports=n.p+"static/media/logo.743a2742.jpeg"},156:function(e,t,n){e.exports=n(865)},447:function(e,t,n){},865:function(e,t,n){"use strict";n.r(t);var o=n(5),r=n.n(o),a=n(16),i=n(0),c=n(1),s=n.n(c),u=n(52),l=n.n(u),d=n(74),f=n.n(d),h=n(37),p=n.n(h),v=n(75),m=n(870),g=n(869),b=n(76),w=n(154),y=(n(447),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)));function x(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var k=n(4),j=n(53),E=n(143),I=n(871),O=n(144),S=n.n(O),N=n(145),D=n.n(N),A=n(146),U=n.n(A),C=n(147),W=n.n(C);function R(e){return M.apply(this,arguments)}function M(){return(M=Object(a.a)(r.a.mark((function e(t){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){S()().use(p.a).use(D.a).process(t,(function(t,o){t?n(t):e(String(o))}))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(e){var t,n=W.a.expand(e),o=U.a.PorterStemmer.tokenizeAndStem(n),r={},a=Object(k.a)(o);try{for(a.s();!(t=a.n()).done;){var i=t.value;r[i]=void 0===r[i]?1:r[i]+1}}catch(l){a.e(l)}finally{a.f()}for(var c=0,s=Object.keys(r);c<s.length;c++){var u=s[c];r[u]=r[u]/o.length}return r}function F(e,t,n){for(var o=0,r=Object.entries(t);o<r.length;o++){var a=Object(i.a)(r[o],2),c=a[0],s=a[1];void 0===n[c]&&(n[c]={}),n[c][e]=s}}function _(e,t,n){return J.apply(this,arguments)}function J(){return(J=Object(a.a)(r.a.mark((function e(t,n,o){var a,i;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,R(n);case 2:a=e.sent,i=B(a),F(t,i,o);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function P(e,t){for(var n=0,o=0,r=Object.keys(e);o<r.length;o++){var a=r[o];Object.keys(t).includes(a)&&(n+=1)}return n+function(e,t){for(var n=0,o=0,r=Object.keys(e);o<r.length;o++){var a=r[o];n+=(e[a]||0)*(t[a]||0)}return n}(e,t)}var T=function(){function e(t){Object(j.a)(this,e),this.db=void 0,this.root=void 0,this.currentIndexID=void 0,this.focus=void 0,this.mode=void 0,this.clipboard=void 0,this.selection=void 0,this.dirty=void 0,this.index=void 0,null===t?(this.root=Object(I.a)(),this.db={},this.db[this.root]={type:"index",contents:[]}):(this.root=t.root,this.db=t.db),""!==window.location.hash?(this.currentIndexID=window.location.hash.slice(1),this.focus=window.history.state.focus||-1):(this.currentIndexID=this.root,this.focus=-1),this.mode="viewing",this.clipboard=[],this.dirty=!1,this.index={};var n,o=Object(k.a)(this.notes());try{for(o.s();!(n=o.n()).done;){var r=Object(i.a)(n.value,2);_(r[0],r[1].contents,this.index)}}catch(a){o.e(a)}finally{o.f()}}return Object(E.a)(e,[{key:"save",value:function(){localStorage.setItem("database",JSON.stringify(this.snapshot)),console.log("Saved change to local storage"),this.dirty=!0}},{key:"notes",value:r.a.mark((function e(){var t,n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:e.t0=r.a.keys(this.db);case 1:if((e.t1=e.t0()).done){e.next=10;break}if(t=e.t1.value,!Object.prototype.hasOwnProperty.call(this.db,t)){e.next=8;break}if("note"!==(n=this.db[t]).type){e.next=8;break}return e.next=8,[t,n];case 8:e.next=1;break;case 10:case"end":return e.stop()}}),e,this)}))},{key:"view",value:function(e,t){this.currentIndexID=e,this.focus=void 0===t?-1:t}},{key:"enter",value:function(e){var t=this.db[e].contents.length>0?0:-1;window.history.replaceState({focus:this.focus},"","#"+this.currentIndexID),window.history.pushState({focus:t},"","#"+e),this.view(e,t)}},{key:"goBack",value:function(){window.history.back()}},{key:"goForward",value:function(){window.history.forward()}},{key:"goUp",value:function(){"viewing"===this.mode&&this.focus>-1&&(this.focus=this.focus-1),"selecting"===this.mode&&this.focus>0&&(this.focus=this.focus-1)}},{key:"goDown",value:function(){this.focus<this.currentIndex.contents.length-1&&(this.focus=this.focus+1)}},{key:"search",value:function(e){var t=function(e,t){var n=B(e);if(0===Object.keys(n).length)return[];for(var o=new Map,r=0,a=Object.keys(n);r<a.length;r++)for(var c=a[r],s=t[c]||{},u=0,l=Object.entries(s);u<l.length;u++){var d=Object(i.a)(l[u],2),f=d[0],h=d[1],p=o.get(f)||{};p[c]=h,o.set(f,p)}var v,m=[],g=Object(k.a)(o.entries());try{for(g.s();!(v=g.n()).done;){var b=Object(i.a)(v.value,2),w=b[0],y=b[1];m.push([w,P(n,y)])}}catch(x){g.e(x)}finally{g.f()}return m.sort((function(e,t){return t[1]-e[1]})),m.map((function(e){var t=Object(i.a)(e,2),n=t[0];t[1];return n})).slice(0,30)}(e,this.index),n=this.newIndex();this.db[n].contents=t,this.enter(n),this.save()}},{key:"updateNote",value:function(e,t){var n=this.db[e];return!(!n||"note"!==n.type)&&(n.contents=t,!0)}},{key:"insertAfter",value:function(e,t){this.currentIndex.contents.splice(e+1,0,t);var n=this.currentIndexID;if(n.endsWith("-outgoing")){var o=n.substr(0,n.length-9);this.db[t+"-incoming"].contents.push(o)}if(n.endsWith("-incoming")){var r=n.substr(0,n.length-9);this.db[t+"-outgoing"].contents.push(r)}this.save()}},{key:"remove",value:function(e){var t=this.currentIndex.contents[e];this.currentIndex.contents.splice(e,1),this.focus>this.currentIndex.contents.length-1&&(this.focus=this.focus-1);var n=this.currentIndexID;if(n.endsWith("-outgoing")){var o=n.substr(0,n.length-9),r=this.db[t+"-incoming"],a=r.contents.findIndex((function(e){return e===o}));r.contents.splice(a,1)}if(n.endsWith("-incoming")){var i=n.substr(0,n.length-9),c=this.db[t+"-outgoing"],s=c.contents.findIndex((function(e){return e===i}));c.contents.splice(s,1)}this.save()}},{key:"newNote",value:function(){var e=Object(I.a)();return this.db[e]={type:"note",contents:""},this.db[e+"-incoming"]={type:"index",contents:[]},this.db[e+"-outgoing"]={type:"index",contents:[]},this.save(),e}},{key:"newIndex",value:function(){var e=Object(I.a)();return this.db[e]={type:"index",contents:[]},this.save(),e}},{key:"removeSelection",value:function(){if("viewing"===this.mode)this.remove(this.focus);else if("selecting"===this.mode){for(var e=Math.min(this.focus,this.selection),t=Math.max(this.focus,this.selection),n=e;n<=t;n++)this.remove(e);this.mode="viewing",this.selection=void 0,this.focus=e}this.focus>this.currentIndex.contents.length-1&&(this.focus=this.focus-1)}},{key:"copy",value:function(){if("viewing"===this.mode)this.clipboard=[this.focusedCardID];else if("selecting"===this.mode){var e=this.currentIndex,t=Math.min(this.focus,this.selection),n=Math.max(this.focus,this.selection);this.clipboard=[];for(var o=t;o<=n;o++)this.clipboard.push(e.contents[o])}}},{key:"paste",value:function(){for(var e=0;e<this.clipboard.length;e++)this.insertAfter(this.focus+e,this.clipboard[e])}},{key:"snapshot",get:function(){return{db:this.db,root:this.root,timestamp:Date.now()}}},{key:"currentIndex",get:function(){return this.db[this.currentIndexID]}},{key:"focusedCardID",get:function(){return this.currentIndex.contents[this.focus]}},{key:"focusedCard",get:function(){return this.focusedCardID?this.db[this.focusedCardID]:void 0}}]),e}(),z=(n(663),n(664),n(2)),K=n(56),L=n(155),G=function(e){return e.map((function(e){return z.c.string(e)})).join("\n")},V=function(e){return e.split("\n").map((function(e){return{children:[{text:e}]}}))},$=function(e){var t=Object(c.useState)(V(e.note.contents)),n=Object(i.a)(t,2),o=n[0],r=n[1],a=Object(c.useMemo)((function(){return Object(L.a)(Object(K.c)(Object(z.i)()))}),[]);return s.a.createElement(K.b,{editor:a,value:o,onChange:function(t){r(t),e.updateNote(e.id,G(t))}},s.a.createElement(K.a,{autoFocus:!0,onKeyDown:e.onKeyDown,placeholder:"Enter some text...",style:{marginTop:"14px",marginBottom:"14px"}}))},q=n(77),H=n.n(q),Q=n(78);function X(e){return new Promise((function(t,n){var o=new FileReader;o.onload=function(e){e&&e.target&&e.target.result?t(e.target.result):n("Blob had an unexpected format: blob.target.result is undefined\n"+e)},o.onerror=function(e){n(e)},o.readAsText(e)}))}function Y(){var e=localStorage.getItem("dropbox_access_token");if(null!==e)return e;var t=function(e){var t=Object.create(null);return"string"!==typeof e?t:(e=e.trim().replace(/^(\?|#|&)/,""))?(e.split("&").forEach((function(e){var n=e.replace(/\+/g," ").split("="),o=n.shift(),r=n.length>0?n.join("="):void 0;o=decodeURIComponent(o);var a=void 0===r?null:decodeURIComponent(r);void 0===t[o]?t[o]=a:Array.isArray(t[o])?t[o].push(a):t[o]=[t[o],a]})),t):t}(window.location.hash).access_token;return t&&localStorage.setItem("dropbox_access_token",t),t}function Z(){return!!Y()}var ee=Z()?new Q.Dropbox({fetch:H.a,accessToken:Y()}):new Q.Dropbox({fetch:H.a,clientId:"31ybvx3rsag1cih"});function te(){return(te=Object(a.a)(r.a.mark((function e(t){var n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t.dirty=!1,e.next=4,ee.filesUpload({contents:JSON.stringify(t.snapshot),path:"/database.json",mode:{".tag":"overwrite"},mute:!0});case 4:n=e.sent,console.log("Upload successful"),console.log(n),e.next=14;break;case 9:e.prev=9,e.t0=e.catch(0),console.error("Upload failed!"),console.error(e.t0),t.dirty=!0;case 14:case"end":return e.stop()}}),e,null,[[0,9]])})))).apply(this,arguments)}function ne(){return(ne=Object(a.a)(r.a.mark((function e(){var t,n,o;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,ee.filesDownload({path:"/database.json"});case 3:return t=e.sent,e.next=6,X(t.fileBlob);case 6:return n=e.sent,o=JSON.parse(n),e.abrupt("return",o);case 11:return e.prev=11,e.t0=e.catch(0),console.error("Error fetching data from cloud:"),console.error(e.t0),e.abrupt("return",null);case 16:case"end":return e.stop()}}),e,null,[[0,11]])})))).apply(this,arguments)}var oe=Z()?{isAuthenticated:!0,upload:function(e){return te.apply(this,arguments)},download:function(){return ne.apply(this,arguments)}}:{isAuthenticated:!1,authenticationURL:ee.getAuthenticationUrl(window.location.toString())},re=n(151),ae=n.n(re);function ie(e){be&&"Escape"===e.key&&(be.mode="viewing",be.save(),xe())}function ce(e){e.scrollIntoView({behavior:"smooth",block:"center"})}function se(e){var t=e.note,n=e.id,o=Object(c.useRef)(null);return o.current&&ce(o.current),s.a.createElement("div",{className:"card-panel z-depth-3 edited-note"},s.a.createElement($,{note:t,id:n,updateNote:ye,onKeyDown:ie}))}var ue={math:function(e){var t=e.value;return s.a.createElement(b.BlockMath,null,t)},inlineMath:function(e){var t=e.value;return s.a.createElement(b.InlineMath,null,t)},code:function(e){var t=e.language,n=e.value;return s.a.createElement(m.a,{language:t,style:g.a},n)}};function le(e){var t=["card-panel",e.isFocused?"z-depth-3":"",e.isSelected?"blue lighten-5":""].join(" "),n=Object(c.useRef)(null);return Object(c.useEffect)((function(){var t=n.current;t&&e.isFocused&&(console.log("Scrolling to",e.id),setTimeout((function(){ce(t)}),20))})),s.a.createElement("div",{className:t,ref:n},s.a.createElement(f.a,{source:e.card.contents,plugins:[p.a,v.a],renderers:ue}))}function de(e){var t=e.card,n=e.id,o=e.state,r=e.isFocused;return"index"===t.type?s.a.createElement("div",null,"Index: (".concat(t.contents.length," cards)")):r&&"editing"===o.mode?s.a.createElement(se,{note:t,id:n}):s.a.createElement(le,Object.assign({},e,{card:t}))}function fe(e){var t=e.card;e.id,e.state;if("index"===t.type)return s.a.createElement("div",{className:"card-panel truncate"},"Index: (".concat(t.contents.length," cards)"));var n=t.contents.split(" "),o=n.length>20?n.slice(0,20).join(" ")+"...":t.contents;return s.a.createElement("div",{className:"card-panel"},s.a.createElement(f.a,{source:o,plugins:[p.a,v.a],renderers:ue}))}function he(e){var t=e.state,n=Object(c.useState)(""),o=Object(i.a)(n,2),r=o[0],a=o[1],u=Object(c.useRef)(null);return s.a.createElement("form",{className:"input-field",onSubmit:function(e){e.preventDefault(),t&&(t.search(r),xe(),u.current&&u.current.blur())}},s.a.createElement("i",{className:"material-icons prefix"},"search"),s.a.createElement("input",{id:"icon_prefix",type:"text",ref:u,onChange:function(e){return a(e.target.value)},onKeyDown:function(e){"Escape"===e.key&&u.current&&u.current.blur()}}),s.a.createElement("label",{htmlFor:"icon_prefix"},"Search"))}function pe(e){var t=e.state;if(null===t)return s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col s3 offset-s4"},s.a.createElement("div",{className:"card-panel valign-wrapper"},s.a.createElement("b",{className:"center-align"},"Loading..."))));var n=t.currentIndex.contents,o=n[t.focus],r=t.db[o+"-outgoing"],a=t.db[o+"-incoming"];return s.a.createElement("div",{className:"row"},s.a.createElement("div",{id:"left-panel",className:"pinned col l3 offset-l1 m3 hide-on-small-only"},s.a.createElement("a",{href:"/"},s.a.createElement("img",{id:"logo",src:ae.a,alt:"Go home"})),a&&a.contents.map((function(e,n){return s.a.createElement(fe,{key:n,card:t.db[e],id:e,state:t})}))),s.a.createElement("div",{id:"main-panel",className:"col l4 offset-l4 m6 offset-m3 s10 offset-s1"},s.a.createElement(he,{state:t}),oe.isAuthenticated||s.a.createElement("div",{className:"card-panel"},s.a.createElement("a",{href:oe.authenticationURL},"Sign in to Dropbox")),n.map((function(e,n){var o=t.db[e],r=t.focus===n,a="selecting"===t.mode&&(t.focus<=n&&n<=t.selection||t.focus>=n&&n>=t.selection);return s.a.createElement(de,{id:e,card:o,key:n,state:t,isFocused:r,isSelected:a})}))),s.a.createElement("div",{id:"right-panel",className:"pinned col l3 offset-l8 m3 offset-m9 hide-on-small-only"},r&&r.contents.map((function(e,n){return s.a.createElement(fe,{key:n,card:t.db[e],id:e,state:t})}))))}var ve={Enter:"enter","command+c":"copy","command+x":"cut","command+v":"paste","command+z":"undo","command+shift+z":"redo",Space:"space",right:"right",left:"left",up:"up",down:"down",Escape:"back",Backspace:"backspace","shift+down":"shift+down","shift+up":"shift+up",j:"down",k:"up",h:"left",l:"right","shift+h":"back","shift+l":"forward",u:"undo","ctrl+r":"redo",y:"copy",p:"paste",x:"cut",d:"backspace",i:"enter",a:"space"},me=Object.keys(ve).join(",");function ge(){return s.a.createElement(w.a,{keyName:me,onKeyDown:we},s.a.createElement(pe,{state:be}))}var be=null;function we(e,t){be&&(t.preventDefault(),console.log(ve[e]),function(e,t){if("viewing"===t.mode)if("enter"===e&&t.focus>=0)t.mode="editing";else if("back"===e)t.goBack();else if("forward"===e)t.goForward();else if("space"===e){var n=t.newNote();t.insertAfter(t.focus,n),t.focus=t.focus+1,t.mode="editing"}else if("paste"===e)t.paste();else if("right"===e&&t.focus>=0){var o=t.currentIndex.contents[t.focus];t.enter(o+"-outgoing")}else if("left"===e&&t.focus>=0){var r=t.currentIndex.contents[t.focus];t.enter(r+"-incoming")}"viewing"!==t.mode&&"selecting"!==t.mode||("backspace"===e&&t.focus>=0?t.removeSelection():"copy"===e&&t.focus>=0?(t.copy(),t.mode="viewing",t.selection=void 0):"cut"===e&&t.focus>=0?(t.copy(),t.removeSelection()):"escape"===e?(t.mode="viewing",t.selection=void 0):"up"===e?t.goUp():"down"===e?t.goDown():"shift+down"===e&&t.focus>=0?(t.mode="selecting",void 0===t.selection&&(t.selection=t.focus),t.goDown()):"shift+up"===e&&(t.mode="selecting",void 0===t.selection&&(t.selection=t.focus),t.goUp())),"editing"===t.mode&&"escape"===e&&(t.mode="viewing")}(ve[e],be),console.log(be),xe())}function ye(e,t){be&&(be.updateNote(e,t)?xe():console.error("Cannot update card ".concat(e,": not a note")))}function xe(){l.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(ge,null)),document.getElementById("root"))}oe.isAuthenticated&&setInterval((function(){null!==be&&be.dirty&&oe.upload(be)}),1e4),Object(a.a)(r.a.mark((function e(){var t,n,o;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!oe.isAuthenticated){e.next=6;break}return e.next=3,oe.download();case 3:e.t0=e.sent,e.next=7;break;case 6:e.t0=null;case 7:(t=e.t0)&&console.log("Got cloud snapshot:",t),n=localStorage.getItem("database"),o=n?JSON.parse(n):null,console.log("Got snapshot from localstorage:",o),be=null===o&&null===t?new T(null):null===o&&null!==t?new T(t):null!==o&&null===t?new T(o):o.timestamp<t.timestamp?new T(t):new T(o),xe();case 14:case"end":return e.stop()}}),e)})))(),window.onpopstate=function(e){console.log("Entered index "+window.location.hash+" focus "+e.state.focus),be&&(be.view(window.location.hash.slice(1),e.state.focus),xe())},xe(),function(e){if("serviceWorker"in navigator){if(new URL("/carte-blanche",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/carte-blanche","/service-worker.js");y?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var o=n.headers.get("content-type");404===n.status||null!=o&&-1===o.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):x(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):x(t,e)}))}}()}},[[156,1,2]]]);
//# sourceMappingURL=main.4ae913ca.chunk.js.map