function t(t,e,i,s){var r,o=arguments.length,a=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(a=(o<3?r(a):o>3?r(e,i,a):r(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,f=g.trustedTypes,m=f?f.emptyScript:"",_=g.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??b)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,_?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,k=w.trustedTypes,D=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,T=`<${C}>`,P=document,M=()=>P.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,U="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,R=/>/g,H=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,I=/"/g,j=/^(?:script|style|textarea|title)$/i,L=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),K=new WeakMap,V=P.createTreeWalker(P,129);function Z(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==D?D.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",a=N;for(let e=0;e<i;e++){const i=t[e];let n,l,d=-1,c=0;for(;c<i.length&&(a.lastIndex=c,l=a.exec(i),null!==l);)c=a.lastIndex,a===N?"!--"===l[1]?a=F:void 0!==l[1]?a=R:void 0!==l[2]?(j.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=H):void 0!==l[3]&&(a=H):a===H?">"===l[0]?(a=r??N,d=-1):void 0===l[1]?d=-2:(d=a.lastIndex-l[2].length,n=l[1],a=void 0===l[3]?H:'"'===l[3]?I:B):a===I||a===B?a=H:a===F||a===R?a=N:(a=H,r=void 0);const h=a===H&&t[e+1].startsWith("/>")?" ":"";o+=a===N?i+T:d>=0?(s.push(n),i.slice(0,d)+E+i.slice(d)+S+h):i+S+(-2===d?e:h)}return[Z(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const a=t.length-1,n=this.parts,[l,d]=J(t,e);if(this.el=Y.createElement(l,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&n.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=d[o++],i=s.getAttribute(t).split(S),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?et:"?"===a[1]?it:"@"===a[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(S)&&(n.push({type:6,index:r}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),V.nextNode(),n.push({type:2,index:++r});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===C)n.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)n.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=z(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=G(t,r._$AS(t,e.values),r,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);V.currentNode=s;let r=V.nextNode(),o=0,a=0,n=i[0];for(;void 0!==n;){if(o===n.index){let e;2===n.type?e=new X(r,r.nextSibling,this,t):1===n.type?e=new n.ctor(r,n.name,n.strings,this,t):6===n.type&&(e=new rt(r,this,t)),this._$AV.push(e),n=i[++a]}o!==n?.index&&(r=V.nextNode(),o++)}return V.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),z(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new Y(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new X(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=G(this,t,e,0),o=!z(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{const s=t;let a,n;for(t=r[0],a=0;a<r.length-1;a++)n=G(this,s[i+a],e,a),n===W&&(n=this._$AH[a]),o||=!z(n)||n!==this._$AH[a],n===q?t=q:t!==q&&(t+=(n??"")+r[a+1]),this._$AH[a]=n}o&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class st extends tt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??q)===W)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(Y,X),(w.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class nt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new X(e.insertBefore(M(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}nt._$litElement$=!0,nt.finalized=!0,at.litElementHydrateSupport?.({LitElement:nt});const lt=at.litElementPolyfillSupport;lt?.({LitElement:nt}),(at.litElementVersions??=[]).push("4.2.2");const dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ct=(t=dt,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,i)=>"object"==typeof i?ct(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ht({...t,state:!0,attribute:!1})}const ut=["#8B7CF6","#34D399","#FBBF24","#FB7185","#22D3EE","#C084FC","#A3E635","#FB923C","#F472B6","#60A5FA"],gt=["Mo","Di","Mi","Do","Fr","Sa","So"],ft=["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],mt={60:.95,30:1.25,15:1.7},_t=864e5,vt=t=>String(t).padStart(2,"0"),yt=t=>`${vt(Math.floor(t/60)%24)}:${vt(t%60)}`,bt=(t,e)=>t.color||ut[e%ut.length],$t=t=>new Date(t.getTime()-6e4*t.getTimezoneOffset()).toISOString().slice(0,16),xt=t=>new Date(t.getTime()-6e4*t.getTimezoneOffset()).toISOString().slice(0,10);class wt extends nt{constructor(){super(...arguments),this._events=[],this._view="day",this._day=((new Date).getDay()+6)%7,this._fetchedKey=""}static async getConfigElement(){return await Promise.resolve().then(function(){return St}),document.createElement("ha-family-board-card-editor")}static getStubConfig(){return{type:"custom:family-board-card",view:"day",time_grid:30,start_hour:6,end_hour:22,show_weekends:!0,show_now_line:!0,color_by:"person",persons:[{name:"Person 1",person:"",calendar:""},{name:"Person 2",person:"",calendar:""}]}}setConfig(t){if(!t.persons||!Array.isArray(t.persons))throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");this._config=t,this._view=t.view??"day"}getCardSize(){return 12}updated(t){(t.has("hass")||t.has("_config"))&&this.hass&&this._config&&this._maybeFetch()}_weekBounds(){const t=new Date,e=new Date(t);e.setHours(0,0,0,0),e.setDate(t.getDate()-(t.getDay()+6)%7);const i=new Date(e);return i.setDate(e.getDate()+7),{monday:e,nextMonday:i}}async _maybeFetch(){const{monday:t}=this._weekBounds(),e=this._config.persons.map(t=>t.calendar||"").join(","),i=`${t.toISOString().slice(0,10)}|${e}`;i!==this._fetchedKey&&(this._fetchedKey=i,await this._fetchEvents())}async _refetch(){this._fetchedKey="",await this._maybeFetch()}async _fetchEvents(){const{monday:t,nextMonday:e}=this._weekBounds(),i=t.toISOString(),s=e.toISOString(),r=[];await Promise.all(this._config.persons.map(async(e,o)=>{if(!e.calendar||!this.hass.states[e.calendar])return;const a=bt(e,o);try{const n=await this.hass.callApi("GET",`calendars/${e.calendar}?start=${encodeURIComponent(i)}&end=${encodeURIComponent(s)}`);for(const i of n){const s=this._toRawEvent(i,o,e.calendar,a);s&&r.push(...this._segments(s,t))}}catch(t){}})),this._events=r}_toRawEvent(t,e,i,s){const r=!t.start?.dateTime;let o,a;if(r){if(!t.start?.date)return null;o=new Date(`${t.start.date}T00:00:00`),a=t.end?.date?new Date(`${t.end.date}T00:00:00`):new Date(o.getTime()+_t)}else o=new Date(t.start.dateTime),a=new Date(t.end?.dateTime??t.start.dateTime);return isNaN(o.getTime())||isNaN(a.getTime())?null:(a.getTime()<=o.getTime()&&(a=new Date(o.getTime()+(r?_t:0)+1)),{personIdx:e,calendar:i,uid:t.uid,recurrence_id:t.recurrence_id,summary:t.summary||"Termin",description:t.description,location:t.location,allDay:r,start:o,end:a,color:s})}_segments(t,e){const i=[];for(let s=0;s<7;s++){const r=new Date(e.getTime()+s*_t),o=new Date(r.getTime()+_t),a=Math.max(t.start.getTime(),r.getTime()),n=Math.min(t.end.getTime(),o.getTime());if(n<=a)continue;const l=t.allDay?0:Math.round((a-r.getTime())/6e4),d=t.allDay?1440:Math.round((n-r.getTime())/6e4);i.push({ref:t,personIdx:t.personIdx,day:s,startMin:l,endMin:Math.min(d,1440),title:t.summary,location:t.location,allDay:t.allDay,color:t.color,continuesBefore:t.start.getTime()<r.getTime(),continuesAfter:t.end.getTime()>o.getTime()})}return i}_calFeatures(t){if(!t)return 0;const e=this.hass.states[t];return Number(e?.attributes?.supported_features??0)}_canCreate(t){return!!(1&this._calFeatures(t))}_canUpdate(t){return!!(4&this._calFeatures(t))}_canDelete(t){return!!(2&this._calFeatures(t))}get _persons(){return this._config.persons}get _grid(){return this._config.time_grid??30}get _startMin(){return 60*(this._config.start_hour??6)}get _endMin(){return 60*(this._config.end_hour??22)}get _visibleDays(){return!1===this._config.show_weekends?[0,1,2,3,4]:[0,1,2,3,4,5,6]}_timedFor(t,e){return this._events.filter(i=>i.day===t&&i.personIdx===e&&!i.allDay).sort((t,e)=>t.startMin-e.startMin)}_allDayFor(t,e){return this._events.filter(i=>i.day===t&&i.personIdx===e&&i.allDay)}_eventsFor(t,e){return this._events.filter(i=>i.day===t&&i.personIdx===e).sort((t,e)=>Number(e.allDay)-Number(t.allDay)||t.startMin-e.startMin)}_dateForDay(t){const{monday:e}=this._weekBounds();return new Date(e.getTime()+t*_t)}_avatar(t,e){const i=bt(t,e),s=t.person?this.hass.states[t.person]:void 0,r=s?.attributes?.entity_picture,o=(t.name||s?.attributes?.friendly_name||`Person ${e+1}`).slice(0,2).toUpperCase();return r?L`<div class="avatar" style="background-image:url('${r}');box-shadow:0 0 0 2px ${i}55"></div>`:L`<div class="avatar initials" style="background:${i}">${o}</div>`}render(){return this._config&&this.hass?L`
      <ha-card>
        <div class="top">
          <div class="title">Familienplan</div>
          <div class="switch">
            <button class=${"day"===this._view?"on":""} @click=${()=>this._view="day"}>Tag</button>
            <button class=${"week"===this._view?"on":""} @click=${()=>this._view="week"}>Woche</button>
          </div>
        </div>
        ${"day"===this._view?this._renderDay():this._renderWeek()}
      </ha-card>
      ${this._dialog?this._renderDialog():q}
    `:q}_renderDayTabs(){return L`
      <div class="tabs">
        ${this._visibleDays.map(t=>L`
            <button
              class=${t===this._day?"on":""}
              @click=${()=>this._day=t}
            >
              ${gt[t]}
            </button>
          `)}
      </div>
    `}_renderDay(){const t=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],e=mt[this._grid]??1.25,i=this._startMin,s=this._endMin,r=(s-i)*e,o=[];for(let t=i/60;t<=s/60;t++)o.push(t);const a=((new Date).getDay()+6)%7,n=new Date,l=Math.max(i,Math.min(s,60*n.getHours()+n.getMinutes())),d=!1!==this._config.show_now_line&&t===a,c=this._persons.some((e,i)=>this._allDayFor(t,i).length>0);return L`
      <div class="dayhead">
        <span class="dayname">${ft[t]}</span>
        ${this._renderDayTabs()}
      </div>
      <div class="board">
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((e,i)=>{const s=e.name||this.hass.states[e.person??""]?.attributes?.friendly_name||`Person ${i+1}`,r=e.person?this.hass.states[e.person]:void 0,o=this._canCreate(e.calendar);return L`
              <div class="phead">
                ${this._avatar(e,i)}
                <div class="pname">${s}</div>
                <div class="pstatus">${r?this._statusLabel(r.state):""}</div>
                ${o?L`<button class="addbtn" title="Termin hinzufügen"
                      @click=${()=>this._openCreate(i,t)}>＋</button>`:q}
              </div>
            `})}
        </div>
        ${c?L`
              <div class="allday-row">
                <div class="axis-spacer allday-label">ganztägig</div>
                ${this._persons.map((e,i)=>L`
                  <div class="allday-cell">
                    ${this._allDayFor(t,i).map(t=>L`
                        <div class="adchip" style="border-left:3px solid ${t.color};background:${t.color}22"
                          title="${t.title}" @click=${()=>this._openEvent(t)}>
                          ${t.continuesBefore?"« ":""}${t.title}${t.continuesAfter?" »":""}
                        </div>
                      `)}
                  </div>
                `)}
              </div>
            `:q}
        <div class="body" style="height:${r}px">
          <div class="axis">
            ${o.map(t=>L`<div class="hour" style="top:${(60*t-i)*e}px">${vt(t)}:00</div>`)}
          </div>
          ${this._persons.map((r,o)=>{const a=this._grid*e,n=this._canCreate(r.calendar);return L`
              <div
                class="col ${n?"creatable":""}"
                @click=${s=>this._onColClick(s,o,t,e,i)}
                style="background-image:
                  repeating-linear-gradient(var(--divider-color,#8884) 0 1px, transparent 1px ${a}px),
                  repeating-linear-gradient(var(--divider-color,#8888) 0 1px, transparent 1px ${60*e}px)"
              >
                ${this._timedFor(t,o).filter(t=>t.endMin>i&&t.startMin<s).map(t=>{const s=(t.startMin-i)*e,r=Math.max((t.endMin-t.startMin)*e-3,16),o=t.color;return L`
                      <div
                        class="event"
                        @click=${e=>{e.stopPropagation(),this._openEvent(t)}}
                        style="top:${s+1.5}px;height:${r}px;border-left:3px solid ${o};
                               background:linear-gradient(135deg, ${o}30, ${o}1a)"
                        title="${t.title} · ${yt(t.startMin)}–${yt(t.endMin)}"
                      >
                        <span class="etitle">${t.continuesBefore?"« ":""}${t.title}</span>
                        ${r>32?L`<span class="etime">${yt(t.startMin)}–${yt(t.endMin)}</span>`:q}
                      </div>
                    `})}
              </div>
            `})}
          ${d?L`<div class="nowline" style="top:${(l-i)*e}px"><span>${yt(l)}</span></div>`:q}
        </div>
      </div>
    `}_renderWeek(){const t=((new Date).getDay()+6)%7,e=`70px repeat(${this._persons.length}, minmax(110px, 1fr))`;return L`
      <div class="weekhead"><span class="dayname">Diese Woche</span></div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${e}">
          <div class="corner"></div>
          ${this._persons.map((t,e)=>L`<div class="wphead">${this._avatar(t,e)}<span>${t.name||`Person ${e+1}`}</span></div>`)}
          ${this._visibleDays.map(e=>L`
              <div class="wday ${e===t?"today":""}">
                <b>${gt[e]}</b>
              </div>
              ${this._persons.map((i,s)=>{const r=this._canCreate(i.calendar);return L`
                  <div class="wcell ${e===t?"today":""} ${r?"creatable":""}"
                    @click=${()=>r&&this._openCreate(s,e)}>
                    ${this._eventsFor(e,s).map(t=>{const e=t.color;return L`
                        <div class="wchip" style="border-left:2.5px solid ${e};background:${e}22" title="${t.title}"
                          @click=${e=>{e.stopPropagation(),this._openEvent(t)}}>
                          <span>${t.continuesBefore?"« ":""}${t.title}</span>
                          ${t.allDay?q:L`<small>${yt(t.startMin)}</small>`}
                        </div>
                      `})}
                  </div>
                `})}
            `)}
        </div>
      </div>
    `}_statusLabel(t){return"home"===t?"zuhause":"not_home"===t?"unterwegs":t}_onColClick(t,e,i,s,r){const o=this._persons[e];if(!this._canCreate(o.calendar))return;const a=t.currentTarget.getBoundingClientRect();let n=r+(t.clientY-a.top)/s;const l=this._grid;n=Math.round(n/l)*l,n=Math.max(0,Math.min(n,1440-l)),this._openCreate(e,i,n)}_openCreate(t,e,i){const s=this._persons[t];if(!s.calendar||!this._canCreate(s.calendar))return;const r=(t=>{const e=new Date(t);return e.setHours(0,0,0,0),e})(this._dateForDay(e)),o=i??Math.max(this._startMin,540),a=new Date(r.getTime()+6e4*o),n=new Date(a.getTime()+36e5);this._dialog={mode:"create",personIdx:t,calendar:s.calendar,canUpdate:!0,canDelete:!1,summary:"",location:"",description:"",allDay:!1,start:$t(a),end:$t(n)}}_openEvent(t){const e=t.ref,i=e.calendar,s=this._canUpdate(i)&&!!e.uid,r=this._canDelete(i)&&!!e.uid;this._dialog={mode:"edit",personIdx:e.personIdx,calendar:i,uid:e.uid,recurrence_id:e.recurrence_id,canUpdate:s,canDelete:r,summary:e.summary,location:e.location??"",description:e.description??"",allDay:e.allDay,start:e.allDay?xt(e.start):$t(e.start),end:e.allDay?xt(new Date(e.end.getTime()-_t)):$t(e.end)}}_dlgField(t,e){this._dialog&&(this._dialog={...this._dialog,[t]:e,error:void 0})}_toggleAllDay(t){if(!this._dialog)return;const e=this._dialog;t&&!e.allDay?this._dialog={...e,allDay:t,start:e.start.slice(0,10),end:e.end.slice(0,10),error:void 0}:!t&&e.allDay&&(this._dialog={...e,allDay:t,start:`${e.start}T09:00`,end:`${e.end}T10:00`,error:void 0})}_buildPayload(t){const e={summary:t.summary.trim()||"Termin"};if(t.location.trim()&&(e.location=t.location.trim()),t.description.trim()&&(e.description=t.description.trim()),t.allDay){const i=new Date(`${t.end}T00:00:00`);i.setDate(i.getDate()+1),e.dtstart=t.start,e.dtend=xt(i)}else e.dtstart=new Date(t.start).toISOString(),e.dtend=new Date(t.end).toISOString();return e}_validate(t){const e=t.allDay?new Date(`${t.start}T00:00:00`):new Date(t.start),i=t.allDay?new Date(`${t.end}T00:00:00`):new Date(t.end);return isNaN(e.getTime())||isNaN(i.getTime())?"Bitte gültige Zeiten angeben.":i.getTime()<e.getTime()?"Ende liegt vor dem Start.":t.allDay||i.getTime()!==e.getTime()?null:"Ende muss nach dem Start liegen."}async _saveDialog(){if(!this._dialog)return;const t=this._dialog,e=this._validate(t);if(e)this._dialog={...t,error:e};else{this._dialog={...t,busy:!0,error:void 0};try{const e=this._buildPayload(t);"create"===t.mode?await this.hass.callWS({type:"calendar/event/create",entity_id:t.calendar,event:e}):await this.hass.callWS({type:"calendar/event/update",entity_id:t.calendar,uid:t.uid,recurrence_id:t.recurrence_id,recurrence_range:"",event:e}),this._dialog=void 0,await this._refetch()}catch(e){this._dialog={...t,busy:!1,error:e?.message||"Speichern fehlgeschlagen."}}}}async _deleteDialog(){if(!this._dialog||!this._dialog.uid)return;const t=this._dialog;this._dialog={...t,busy:!0,error:void 0};try{await this.hass.callWS({type:"calendar/event/delete",entity_id:t.calendar,uid:t.uid,recurrence_id:t.recurrence_id,recurrence_range:""}),this._dialog=void 0,await this._refetch()}catch(e){this._dialog={...t,busy:!1,error:e?.message||"Löschen fehlgeschlagen."}}}_closeDialog(){this._dialog=void 0}_renderDialog(){const t=this._dialog,e="edit"===t.mode&&!t.canUpdate,i=this.hass.states[t.calendar]?.attributes?.friendly_name||t.calendar;return L`
      <div class="overlay" @click=${t=>{t.target===t.currentTarget&&this._closeDialog()}}>
        <div class="dialog" role="dialog" aria-modal="true">
          <div class="dlg-head">
            <span>${"create"===t.mode?"Neuer Termin":e?"Termin":"Termin bearbeiten"}</span>
            <button class="icon" @click=${this._closeDialog} title="Schließen">✕</button>
          </div>
          <div class="dlg-cal">${i}</div>

          <label class="fld">
            <span>Titel</span>
            <input type="text" .value=${t.summary} ?disabled=${e}
              @input=${t=>this._dlgField("summary",t.target.value)} />
          </label>

          <label class="chk">
            <input type="checkbox" .checked=${t.allDay} ?disabled=${e}
              @change=${t=>this._toggleAllDay(t.target.checked)} />
            <span>Ganztägig</span>
          </label>

          <div class="row">
            <label class="fld">
              <span>Start</span>
              <input type=${t.allDay?"date":"datetime-local"} .value=${t.start} ?disabled=${e}
                @input=${t=>this._dlgField("start",t.target.value)} />
            </label>
            <label class="fld">
              <span>Ende</span>
              <input type=${t.allDay?"date":"datetime-local"} .value=${t.end} ?disabled=${e}
                @input=${t=>this._dlgField("end",t.target.value)} />
            </label>
          </div>

          <label class="fld">
            <span>Ort</span>
            <input type="text" .value=${t.location} ?disabled=${e}
              @input=${t=>this._dlgField("location",t.target.value)} />
          </label>

          <label class="fld">
            <span>Notiz</span>
            <textarea rows="2" .value=${t.description} ?disabled=${e}
              @input=${t=>this._dlgField("description",t.target.value)}></textarea>
          </label>

          ${e?L`<div class="ro-note">Dieser Kalender ist schreibgeschützt.</div>`:q}
          ${t.error?L`<div class="dlg-error">${t.error}</div>`:q}

          <div class="dlg-actions">
            ${"edit"===t.mode&&t.canDelete?L`<button class="danger" ?disabled=${t.busy} @click=${this._deleteDialog}>Löschen</button>`:q}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${t.busy} @click=${this._closeDialog}>Abbrechen</button>
            ${e?q:L`<button class="primary" ?disabled=${t.busy} @click=${this._saveDialog}>
                  ${t.busy?"…":"Speichern"}
                </button>`}
          </div>
        </div>
      </div>
    `}}wt.styles=a`
    :host {
      /* inherit dashboard font; fall back to HA body font */
      font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
    }
    ha-card {
      overflow: hidden;
      color: var(--primary-text-color);
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    .title {
      font-weight: 600;
      font-size: 16px;
    }
    .switch,
    .tabs {
      display: inline-flex;
      gap: 2px;
      background: var(--secondary-background-color);
      border-radius: 9px;
      padding: 2px;
    }
    .switch button,
    .tabs button {
      border: none;
      cursor: pointer;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 5px 11px;
      border-radius: 7px;
      font: inherit;
      font-size: 13px;
    }
    .switch button.on,
    .tabs button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
    }
    .dayhead,
    .weekhead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--divider-color);
      flex-wrap: wrap;
    }
    .dayname {
      font-weight: 600;
      font-size: 15px;
    }
    .board {
      max-height: 58vh;
      overflow: auto;
    }
    .header-row {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .axis-spacer {
      width: 56px;
      flex: 0 0 56px;
      position: sticky;
      left: 0;
      background: inherit;
    }
    .phead {
      width: 140px;
      flex: 0 0 140px;
      padding: 10px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-left: 1px solid var(--divider-color);
      position: relative;
    }
    .addbtn {
      position: absolute;
      top: 6px;
      right: 6px;
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 15px;
      line-height: 1;
      padding: 0;
    }
    .addbtn:hover {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .allday-row {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--ha-card-background));
    }
    .allday-label {
      font-size: 10px;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
    }
    .allday-cell {
      width: 140px;
      flex: 0 0 140px;
      border-left: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .adchip {
      border-radius: 5px;
      padding: 2px 6px;
      font-size: 10.5px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
    }
    .avatar.initials {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #11181f;
      font-weight: 700;
      font-size: 13px;
    }
    .pname {
      font-weight: 600;
      font-size: 13px;
    }
    .pstatus {
      font-size: 10.5px;
      color: var(--secondary-text-color);
    }
    .body {
      display: flex;
      position: relative;
    }
    .axis {
      width: 56px;
      flex: 0 0 56px;
      position: sticky;
      left: 0;
      background: var(--card-background-color, var(--ha-card-background));
      z-index: 4;
      border-right: 1px solid var(--divider-color);
    }
    .hour {
      position: absolute;
      right: 8px;
      transform: translateY(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .col {
      width: 140px;
      flex: 0 0 140px;
      position: relative;
      border-left: 1px solid var(--divider-color);
    }
    .col.creatable {
      cursor: copy;
    }
    .event {
      position: absolute;
      left: 4px;
      right: 4px;
      border-radius: 7px;
      padding: 4px 7px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .etitle {
      font-size: 11.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .etime {
      font-size: 9.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .nowline {
      position: absolute;
      left: 56px;
      right: 0;
      border-top: 2px solid var(--error-color, #ff5252);
      z-index: 7;
      pointer-events: none;
    }
    .nowline span {
      position: absolute;
      left: -50px;
      top: -8px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--error-color, #ff5252);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* week */
    .weekwrap {
      overflow: auto;
      max-height: 60vh;
    }
    .weekgrid {
      display: grid;
    }
    .corner {
      position: sticky;
      left: 0;
      top: 0;
      z-index: 6;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .wphead {
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      border-left: 1px solid var(--divider-color);
      padding: 8px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .wphead .avatar {
      width: 28px;
      height: 28px;
    }
    .wday {
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 8px;
      display: flex;
      align-items: center;
      font-size: 12.5px;
    }
    .wcell {
      min-height: 70px;
      border-left: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .wcell.creatable {
      cursor: copy;
    }
    .wday.today,
    .wcell.today {
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }
    .wchip {
      border-radius: 5px;
      padding: 3px 5px;
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      cursor: pointer;
    }
    .wchip span {
      font-size: 10.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wchip small {
      margin-left: auto;
      font-size: 8.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    /* dialog */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99;
      padding: 16px;
    }
    .dialog {
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
      border-radius: 14px;
      padding: 16px;
      width: 100%;
      max-width: 420px;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
    }
    .dlg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 16px;
    }
    .dlg-cal {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 2px 0 10px;
    }
    .icon {
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 16px;
    }
    .fld {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-bottom: 10px;
    }
    .fld > span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .row {
      display: flex;
      gap: 10px;
    }
    .row .fld {
      flex: 1;
    }
    input,
    textarea {
      font: inherit;
      font-size: 14px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
      width: 100%;
    }
    input:disabled,
    textarea:disabled {
      opacity: 0.7;
    }
    .chk {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 13px;
    }
    .chk input {
      width: auto;
    }
    .ro-note {
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 8px 10px;
      margin-bottom: 10px;
    }
    .dlg-error {
      font-size: 12.5px;
      color: var(--error-color, #ff5252);
      margin-bottom: 10px;
    }
    .dlg-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }
    .dlg-actions .spacer {
      flex: 1;
    }
    .dlg-actions button {
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .ghost {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .danger {
      background: var(--error-color, #ff5252);
      color: #fff;
    }
    button:disabled {
      opacity: 0.6;
      cursor: default;
    }
  `,t([ht({attribute:!1})],wt.prototype,"hass",void 0),t([pt()],wt.prototype,"_config",void 0),t([pt()],wt.prototype,"_events",void 0),t([pt()],wt.prototype,"_view",void 0),t([pt()],wt.prototype,"_day",void 0),t([pt()],wt.prototype,"_dialog",void 0),customElements.define("family-board-card",wt),window.customCards=window.customCards||[],window.customCards.push({type:"family-board-card",name:"Family Board Card",description:"Familienkalender / Wer-ist-wann-wo Übersicht für mehrere Personen.",preview:!0,documentationURL:"https://github.com/renespeaker/ha-family-board-card"}),console.info("%c FAMILY-BOARD-CARD %c v0.2.0 ","background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px","background:#222;color:#fff;border-radius:0 3px 3px 0");const At=[{name:"view",selector:{select:{mode:"dropdown",options:[{value:"day",label:"Tag"},{value:"week",label:"Woche"}]}}},{name:"time_grid",selector:{select:{mode:"dropdown",options:[{value:"60",label:"60 min"},{value:"30",label:"30 min"},{value:"15",label:"15 min"}]}}},{name:"start_hour",selector:{number:{min:0,max:23,mode:"box"}}},{name:"end_hour",selector:{number:{min:1,max:24,mode:"box"}}},{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"person",label:"Person"},{value:"location",label:"Ort"}]}}},{name:"show_weekends",selector:{boolean:{}}},{name:"show_now_line",selector:{boolean:{}}}],kt={view:"Standardansicht",time_grid:"Zeitraster",start_hour:"Startstunde",end_hour:"Endstunde",color_by:"Einfärben nach",show_weekends:"Wochenende anzeigen",show_now_line:"Jetzt-Linie",name:"Anzeigename",person:"Person (Avatar & Status)",calendar:"Kalender (Termine)",color:"Farbe (optional)"},Dt=[{name:"name",selector:{text:{}}},{name:"person",selector:{entity:{filter:{domain:"person"}}}},{name:"calendar",selector:{entity:{filter:{domain:"calendar"}}}},{name:"color",selector:{text:{}}}];class Et extends nt{setConfig(t){this._config=t}get _persons(){return Array.isArray(this._config.persons)?this._config.persons:[]}get _settingsData(){return{...this._config,time_grid:String(this._config.time_grid??30)}}_emit(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t}}))}_settingsChanged(t){t.stopPropagation();const e={...t.detail.value};"string"==typeof e.time_grid&&(e.time_grid=Number(e.time_grid)),this._emit({...this._config,...e,persons:this._persons})}_personChanged(t,e){e.stopPropagation();const i={...e.detail.value};i.color||delete i.color;const s=this._persons.map((e,s)=>s===t?i:e);this._emit({...this._config,persons:s})}_addPerson(){const t=[...this._persons,{name:"",person:"",calendar:""}];this._emit({...this._config,persons:t})}_removePerson(t){const e=this._persons.filter((e,i)=>i!==t);this._emit({...this._config,persons:e})}_movePerson(t,e){const i=[...this._persons],s=t+e;s<0||s>=i.length||([i[t],i[s]]=[i[s],i[t]],this._emit({...this._config,persons:i}))}render(){if(!this._config)return q;const t=this._persons;return L`
      <div class="section-title">Personen</div>
      <div class="persons">
        ${0===t.length?L`<div class="hint">Noch keine Person. Füge unten die erste hinzu.</div>`:q}
        ${t.map((e,i)=>L`
            <div class="person">
              <div class="person-head">
                <span class="pidx">${e.name||`Person ${i+1}`}</span>
                <div class="ptools">
                  <button class="icon" title="Nach oben" ?disabled=${0===i}
                    @click=${()=>this._movePerson(i,-1)}>↑</button>
                  <button class="icon" title="Nach unten" ?disabled=${i===t.length-1}
                    @click=${()=>this._movePerson(i,1)}>↓</button>
                  <button class="icon danger" title="Entfernen"
                    @click=${()=>this._removePerson(i)}>✕</button>
                </div>
              </div>
              <ha-form
                .hass=${this.hass}
                .data=${e}
                .schema=${Dt}
                .computeLabel=${t=>kt[t.name]??t.name}
                @value-changed=${t=>this._personChanged(i,t)}
              ></ha-form>
            </div>
          `)}
        <button class="add" @click=${this._addPerson}>＋ Person hinzufügen</button>
      </div>

      <div class="section-title">Darstellung</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._settingsData}
        .schema=${At}
        .computeLabel=${t=>kt[t.name]??t.name}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `}}Et.styles=a`
    .section-title {
      font-weight: 600;
      font-size: 14px;
      margin: 14px 2px 8px;
    }
    .section-title:first-child {
      margin-top: 4px;
    }
    .hint {
      font-size: 12.5px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .persons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .person {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 8px 10px 4px;
    }
    .person-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .pidx {
      font-weight: 600;
      font-size: 13px;
    }
    .ptools {
      display: inline-flex;
      gap: 2px;
    }
    .icon {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 6px;
      width: 26px;
      height: 26px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
    }
    .icon:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .icon.danger:hover {
      background: var(--error-color, #ff5252);
      color: #fff;
    }
    .add {
      border: 1px dashed var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      border-radius: 10px;
      padding: 10px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
    }
    code {
      font-family: var(--code-font-family, monospace);
      font-size: 11.5px;
    }
  `,t([ht({attribute:!1})],Et.prototype,"hass",void 0),t([pt()],Et.prototype,"_config",void 0),customElements.define("ha-family-board-card-editor",Et);var St=Object.freeze({__proto__:null,FamilyBoardCardEditor:Et});export{wt as FamilyBoardCard};
