function e(e,t,a,i){var s,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(r<3?s(n):r>3?s(t,a,n):s(t,a))||n);return r>3&&n&&Object.defineProperty(t,a,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,a=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(a&&void 0===e){const a=void 0!==t&&1===t.length;a&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&s.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const a=1===e.length?e[0]:t.reduce((t,a,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[i+1],e[0]);return new r(a,e,i)},o=a?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:_}=Object,u=globalThis,m=u.trustedTypes,g=m?m.emptyScript:"",f=u.reactiveElementPolyfillSupport,v=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let a=e;switch(t){case Boolean:a=null!==e;break;case Number:a=null===e?null:Number(e);break;case Object:case Array:try{a=JSON.parse(e)}catch(e){a=null}}return a}},y=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),i=this.getPropertyDescriptor(e,a,t);void 0!==i&&d(this.prototype,e,i)}}static getPropertyDescriptor(e,t,a){const{get:i,set:s}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const r=i?.call(this);s?.call(this,t),this.requestUpdate(e,r,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=_(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const a of t)this.createProperty(a,e[a])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,a]of t)this.elementProperties.set(e,a)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const a=this._$Eu(e,t);void 0!==a&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const e of a)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const a=t.attribute;return!1===a?void 0:"string"==typeof a?a:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(a)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const a of i){const i=document.createElement("style"),s=t.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=a.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,a);if(void 0!==i&&!0===a.reflect){const s=(void 0!==a.converter?.toAttribute?a.converter:b).toAttribute(t,a.type);this._$Em=e,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){const a=this.constructor,i=a._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=a.getPropertyOptions(i),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=i;const r=s.fromAttribute(t,e.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(e,t,a,i=!1,s){if(void 0!==e){const r=this.constructor;if(!1===i&&(s=this[e]),a??=r.getPropertyOptions(e),!((a.hasChanged??y)(s,t)||a.useDefault&&a.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,a))))return;this.C(e,t,a)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:i,wrapped:s},r){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==s||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,a]of e){const{wrapped:e}=a,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,a,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,f?.({ReactiveElement:x}),(u.reactiveElementVersions??=[]).push("2.1.2");const k=globalThis,$=e=>e,M=k.trustedTypes,D=M?M.createPolicy("lit-html",{createHTML:e=>e}):void 0,T="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+A,S=`<${z}>`,C=document,P=()=>C.createComment(""),E=e=>null===e||"object"!=typeof e&&"function"!=typeof e,j=Array.isArray,O="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,N=/>/g,L=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,H=/"/g,B=/^(?:script|style|textarea|title)$/i,U=(e=>(t,...a)=>({_$litType$:e,strings:t,values:a}))(1),q=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),K=new WeakMap,V=C.createTreeWalker(C,129);function J(e,t){if(!j(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==D?D.createHTML(t):t}const G=(e,t)=>{const a=e.length-1,i=[];let s,r=2===t?"<svg>":3===t?"<math>":"",n=F;for(let t=0;t<a;t++){const a=e[t];let o,l,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,l=n.exec(a),null!==l);)c=n.lastIndex,n===F?"!--"===l[1]?n=I:void 0!==l[1]?n=N:void 0!==l[2]?(B.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=L):void 0!==l[3]&&(n=L):n===L?">"===l[0]?(n=s??F,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,o=l[1],n=void 0===l[3]?L:'"'===l[3]?H:R):n===H||n===R?n=L:n===I||n===N?n=F:(n=L,s=void 0);const h=n===L&&e[t+1].startsWith("/>")?" ":"";r+=n===F?a+S:d>=0?(i.push(o),a.slice(0,d)+T+a.slice(d)+A+h):a+A+(-2===d?t:h)}return[J(e,r+(e[a]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Y{constructor({strings:e,_$litType$:t},a){let i;this.parts=[];let s=0,r=0;const n=e.length-1,o=this.parts,[l,d]=G(e,t);if(this.el=Y.createElement(l,a),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=V.nextNode())&&o.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(T)){const t=d[r++],a=i.getAttribute(e).split(A),n=/([.?@])?(.*)/.exec(t);o.push({type:1,index:s,name:n[2],strings:a,ctor:"."===n[1]?te:"?"===n[1]?ae:"@"===n[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(A)&&(o.push({type:6,index:s}),i.removeAttribute(e));if(B.test(i.tagName)){const e=i.textContent.split(A),t=e.length-1;if(t>0){i.textContent=M?M.emptyScript:"";for(let a=0;a<t;a++)i.append(e[a],P()),V.nextNode(),o.push({type:2,index:++s});i.append(e[t],P())}}}else if(8===i.nodeType)if(i.data===z)o.push({type:2,index:s});else{let e=-1;for(;-1!==(e=i.data.indexOf(A,e+1));)o.push({type:7,index:s}),e+=A.length-1}s++}}static createElement(e,t){const a=C.createElement("template");return a.innerHTML=e,a}}function X(e,t,a=e,i){if(t===q)return t;let s=void 0!==i?a._$Co?.[i]:a._$Cl;const r=E(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(e),s._$AT(e,a,i)),void 0!==i?(a._$Co??=[])[i]=s:a._$Cl=s),void 0!==s&&(t=X(e,s._$AS(e,t.values),s,i)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,i=(e?.creationScope??C).importNode(t,!0);V.currentNode=i;let s=V.nextNode(),r=0,n=0,o=a[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new Q(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new se(s,this,e)),this._$AV.push(t),o=a[++n]}r!==o?.index&&(s=V.nextNode(),r++)}return V.currentNode=C,i}p(e){let t=0;for(const a of this._$AV)void 0!==a&&(void 0!==a.strings?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),E(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>j(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&E(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,i="number"==typeof a?this._$AC(e):(void 0===a.el&&(a.el=Y.createElement(J(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Z(i,this),a=e.u(this.options);e.p(t),this.T(a),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new Y(e)),t}k(e){j(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,i=0;for(const s of e)i===t.length?t.push(a=new Q(this.O(P()),this.O(P()),this,this.options)):a=t[i],a._$AI(s),i++;i<t.length&&(this._$AR(a&&a._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,i,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,a.length>2||""!==a[0]||""!==a[1]?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=W}_$AI(e,t=this,a,i){const s=this.strings;let r=!1;if(void 0===s)e=X(this,e,t,0),r=!E(e)||e!==this._$AH&&e!==q,r&&(this._$AH=e);else{const i=e;let n,o;for(e=s[0],n=0;n<s.length-1;n++)o=X(this,i[a+n],t,n),o===q&&(o=this._$AH[n]),r||=!E(o)||o!==this._$AH[n],o===W?e=W:e!==W&&(e+=(o??"")+s[n+1]),this._$AH[n]=o}r&&!i&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class ae extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class ie extends ee{constructor(e,t,a,i,s){super(e,t,a,i,s),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??W)===q)return;const a=this._$AH,i=e===W&&a!==W||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,s=e!==W&&(a===W||i);i&&this.element.removeEventListener(this.name,this,a),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=k.litHtmlPolyfillSupport;re?.(Y,Q),(k.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;class oe extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,a)=>{const i=a?.renderBefore??t;let s=i._$litPart$;if(void 0===s){const e=a?.renderBefore??null;i._$litPart$=s=new Q(t.insertBefore(P(),e),e,void 0,a??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}oe._$litElement$=!0,oe.finalized=!0,ne.litElementHydrateSupport?.({LitElement:oe});const le=ne.litElementPolyfillSupport;le?.({LitElement:oe}),(ne.litElementVersions??=[]).push("4.2.2");const de={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},ce=(e=de,t,a)=>{const{kind:i,metadata:s}=a;let r=globalThis.litPropertyMetadata.get(s);if(void 0===r&&globalThis.litPropertyMetadata.set(s,r=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),r.set(a.name,e),"accessor"===i){const{name:i}=a;return{set(a){const s=t.get.call(this);t.set.call(this,a),this.requestUpdate(i,s,e,!0,a)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=a;return function(a){const s=this[i];t.call(this,a),this.requestUpdate(i,s,e,!0,a)}}throw Error("Unsupported decorator location: "+i)};function he(e){return(t,a)=>"object"==typeof a?ce(e,t,a):((e,t,a)=>{const i=t.hasOwnProperty(a);return t.constructor.createProperty(a,e),i?Object.getOwnPropertyDescriptor(t,a):void 0})(e,t,a)}function pe(e){return he({...e,state:!0,attribute:!1})}function _e(e,t){const a=new Date(e);return a.setDate(a.getDate()+t),a}function ue(e){return 60*e.getHours()+e.getMinutes()}function me(e,t){const a=new Date(e);a.setHours(0,0,0,0);const i=new Date(t);return i.setHours(0,0,0,0),Math.round((i.getTime()-a.getTime())/864e5)}function ge(e){if(!e||"string"!=typeof e.start)return e;const t=t=>!0===e.all_day||/^\d{4}-\d{2}-\d{2}$/.test(t)?{date:t}:{dateTime:t};return{...e,start:t(e.start),end:t("string"==typeof e.end?e.end:e.start)}}function fe(e,t,a,i){const s=!e?.start?.dateTime;let r,n;if(s){if(!e?.start?.date)return null;r=new Date(`${e.start.date}T00:00:00`),n=e.end?.date?new Date(`${e.end.date}T00:00:00`):_e(r,1)}else r=new Date(e.start.dateTime),n=new Date(e.end?.dateTime??e.start.dateTime);return isNaN(r.getTime())||isNaN(n.getTime())?null:(n.getTime()<=r.getTime()&&(n=s?_e(r,1):new Date(r.getTime()+6e4)),{personIdx:t,calendar:a,uid:e.uid,recurrence_id:e.recurrence_id,rrule:e.rrule,summary:e.summary||"Termin",description:e.description,location:e.location,allDay:s,start:r,end:n,color:i,tentative:!1})}function ve(e,t,a){const i=[],s=new Date(e.start);s.setHours(0,0,0,0);const r=new Date(e.end.getTime()-1),n=Math.max(1,me(s,r)+1);for(let r=0;r<a;r++){const a=_e(t,r),o=_e(a,1),l=Math.max(e.start.getTime(),a.getTime()),d=Math.min(e.end.getTime(),o.getTime());if(d<=l)continue;const c=e.allDay||l<=a.getTime()?0:ue(new Date(l)),h=e.allDay||d>=o.getTime()?1440:ue(new Date(d)),p=n>1?me(s,a)+1:void 0;i.push({part:p,parts:n>1?n:void 0,ref:e,personIdx:e.personIdx,day:r,startMin:c,endMin:Math.min(h,1440),title:e.summary,location:e.location,allDay:e.allDay,color:e.color,continuesBefore:e.start.getTime()<a.getTime(),continuesAfter:e.end.getTime()>o.getTime()})}return i}function be(e){const t=[...e].sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin),a=[];let i=[],s=-1,r=0;const n=[],o=()=>{if(i.length){const e=Math.max(...i.map(e=>e.col))+1;i.forEach(t=>{t.cols=e,t.cluster=r;let a=e;for(const e of i)e!==t&&e.col>t.col&&e.startMin<t.endMin&&e.endMin>t.startMin&&(a=Math.min(a,e.col));t.span=Math.max(1,a-t.col)}),r++}i=[]};for(const e of t){i.length&&e.startMin>=s&&(o(),n.length=0);let t=n.findIndex(t=>t<=e.startMin);-1===t?(t=n.length,n.push(e.endMin)):n[t]=e.endMin;const l={...e,col:t,cols:1,span:1,cluster:r};i.push(l),a.push(l),s=1===i.length?e.endMin:Math.max(s,e.endMin)}return o(),a}const ye=/^(zu ?hause|daheim|home|at home)$/i;const we=["abholen","abholung","bringen","hinbringen","fahrdienst","fahrt","pick up","pick-up","pickup","drop off","drop-off","ride"],xe=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function ke(e,t){const a=t.map(e=>e.trim()).filter(Boolean);if(!e||0===a.length)return!1;return new RegExp(`(^|[^\\p{L}\\p{N}])(${a.map(xe).join("|")})($|[^\\p{L}\\p{N}])`,"iu").test(e)}function $e(e,t){const a=`${e.summary} ${e.description??""}`,i=t.find(e=>e.name&&ke(a,[e.name]));return i?i.idx:t.some(t=>t.idx===e.personIdx)?e.personIdx:void 0}const Me=/geburtstag|birthday|b-?day|🎂/iu,De=/\s*\(\s*\*?\s*((?:18|19|20)\d{2})\s*\)|\s*\*\s*((?:18|19|20)\d{2})\b/u;const Te={board_title:"Family board",day:"Day",week:"Week",month:"Month",agenda:"Agenda",timeline:"Timeline",now:"Now",family:"Family",all_day:"all-day",this_week:"This week",prev_week:"Previous week",next_week:"Next week",prev_month:"Previous month",next_month:"Next month",today:"Today",tomorrow:"Tomorrow",yesterday:"Yesterday",open_map:"Map",status_home:"home",status_away:"away",add_event:"Add event",new_event:"New event",event:"Event",edit_event:"Edit event",close:"Close",field_title:"Title",field_all_day:"All-day",field_repeat:"Repeat",field_repeat_until:"Until (optional)",repeat_none:"Never",repeat_daily:"Every day",repeat_weekly:"Every week",repeat_monthly:"Every month",repeat_yearly:"Every year",err_until_before:"The series cannot end before it starts.",field_start:"Start",field_end:"End",field_location:"Location",field_note:"Note",field_calendar:"Calendar",recurring:"Recurring event",recur_this:"This event only",recur_future:"This and following",read_only:"This calendar is read-only.",delete:"Delete",cancel:"Cancel",save:"Save",err_invalid:"Please enter valid times.",err_end_before:"End is before start.",err_end_equal:"End must be after start.",save_failed:"Saving failed.",delete_failed:"Deleting failed.",default_title:"Event",load_error:"Calendar could not be loaded.",err_no_persons:"Please configure at least one person under 'persons'.",no_events:"No events.",more_events:"more events",focus_next:"next",focus_free:"free",until:"until",alert_conflict:"two events at once",alert_gap:"gap between events",alert_empty:"nobody home",alert_late:"still at home",private:"Private",turns_age:"turns {n}",saver_close:"Photos – tap to show the board",alert_no_driver:"no driver",alert_driver_busy:"is busy",ride_by:"Driver:",task_due:"task due",task_overdue:"task overdue"},Ae={en:Te,de:{board_title:"Familienplan",day:"Tag",week:"Woche",month:"Monat",agenda:"Agenda",timeline:"Zeitstrahl",now:"Jetzt",family:"Familie",all_day:"ganztägig",this_week:"Diese Woche",prev_week:"Vorherige Woche",next_week:"Nächste Woche",prev_month:"Vorheriger Monat",next_month:"Nächster Monat",today:"Heute",tomorrow:"Morgen",yesterday:"Gestern",open_map:"Karte",status_home:"zuhause",status_away:"unterwegs",add_event:"Termin hinzufügen",new_event:"Neuer Termin",event:"Termin",edit_event:"Termin bearbeiten",close:"Schließen",field_title:"Titel",field_all_day:"Ganztägig",field_repeat:"Wiederholen",field_repeat_until:"Bis (optional)",repeat_none:"Nie",repeat_daily:"Jeden Tag",repeat_weekly:"Jede Woche",repeat_monthly:"Jeden Monat",repeat_yearly:"Jedes Jahr",err_until_before:"Die Serie kann nicht vor ihrem Beginn enden.",field_start:"Start",field_end:"Ende",field_location:"Ort",field_note:"Notiz",field_calendar:"Kalender",recurring:"Wiederkehrender Termin",recur_this:"Nur dieser Termin",recur_future:"Dieser und folgende",read_only:"Dieser Kalender ist schreibgeschützt.",delete:"Löschen",cancel:"Abbrechen",save:"Speichern",err_invalid:"Bitte gültige Zeiten angeben.",err_end_before:"Ende liegt vor dem Start.",err_end_equal:"Ende muss nach dem Start liegen.",save_failed:"Speichern fehlgeschlagen.",delete_failed:"Löschen fehlgeschlagen.",default_title:"Termin",load_error:"Kalender konnte nicht geladen werden.",err_no_persons:"Bitte mindestens eine Person unter 'persons' konfigurieren.",no_events:"Keine Termine.",more_events:"weitere Termine",focus_next:"als Nächstes",focus_free:"frei",until:"bis",alert_conflict:"zwei Termine gleichzeitig",alert_gap:"Lücke zwischen Terminen",alert_empty:"niemand zuhause",alert_late:"noch zuhause",private:"Privat",turns_age:"wird {n}",saver_close:"Fotos – antippen zeigt das Board",alert_no_driver:"kein Fahrer",alert_driver_busy:"ist belegt",ride_by:"Fahrer:",task_due:"Aufgabe fällig",task_overdue:"Aufgabe überfällig"},nl:{board_title:"Gezinsbord",day:"Dag",week:"Week",month:"Maand",agenda:"Agenda",timeline:"Tijdlijn",now:"Nu",family:"Gezin",all_day:"hele dag",this_week:"Deze week",prev_week:"Vorige week",next_week:"Volgende week",prev_month:"Vorige maand",next_month:"Volgende maand",today:"Vandaag",tomorrow:"Morgen",yesterday:"Gisteren",open_map:"Kaart",status_home:"thuis",status_away:"afwezig",add_event:"Afspraak toevoegen",new_event:"Nieuwe afspraak",event:"Afspraak",edit_event:"Afspraak bewerken",close:"Sluiten",field_title:"Titel",field_all_day:"Hele dag",field_repeat:"Herhalen",field_repeat_until:"Tot (optioneel)",repeat_none:"Nooit",repeat_daily:"Elke dag",repeat_weekly:"Elke week",repeat_monthly:"Elke maand",repeat_yearly:"Elk jaar",err_until_before:"De reeks kan niet eindigen voordat deze begint.",field_start:"Start",field_end:"Einde",field_location:"Locatie",field_note:"Notitie",field_calendar:"Agenda",recurring:"Terugkerende afspraak",recur_this:"Alleen deze afspraak",recur_future:"Deze en volgende",read_only:"Deze agenda is alleen-lezen.",delete:"Verwijderen",cancel:"Annuleren",save:"Opslaan",err_invalid:"Voer geldige tijden in.",err_end_before:"Eindtijd ligt vóór de starttijd.",err_end_equal:"Eindtijd moet na de starttijd liggen.",save_failed:"Opslaan mislukt.",delete_failed:"Verwijderen mislukt.",default_title:"Afspraak",load_error:"Agenda kon niet worden geladen.",err_no_persons:"Configureer minimaal één persoon onder 'persons'.",no_events:"Geen afspraken.",more_events:"meer afspraken",focus_next:"straks",focus_free:"vrij",until:"tot",alert_conflict:"twee afspraken tegelijk",alert_gap:"gat tussen afspraken",alert_empty:"niemand thuis",alert_late:"nog thuis",private:"Privé",turns_age:"wordt {n}",saver_close:"Foto's – tik om het bord te tonen",alert_no_driver:"geen bestuurder",alert_driver_busy:"is bezet",ride_by:"Rijdt:",task_due:"taak vandaag",task_overdue:"taak te laat"},fr:{board_title:"Tableau familial",day:"Jour",week:"Semaine",month:"Mois",agenda:"Agenda",timeline:"Chronologie",now:"Maintenant",family:"Famille",all_day:"toute la journée",this_week:"Cette semaine",prev_week:"Semaine précédente",next_week:"Semaine suivante",prev_month:"Mois précédent",next_month:"Mois suivant",today:"Aujourd'hui",tomorrow:"Demain",yesterday:"Hier",open_map:"Carte",status_home:"à la maison",status_away:"absent",add_event:"Ajouter un événement",new_event:"Nouvel événement",event:"Événement",edit_event:"Modifier l'événement",close:"Fermer",field_title:"Titre",field_all_day:"Toute la journée",field_repeat:"Répéter",field_repeat_until:"Jusqu'au (optionnel)",repeat_none:"Jamais",repeat_daily:"Chaque jour",repeat_weekly:"Chaque semaine",repeat_monthly:"Chaque mois",repeat_yearly:"Chaque année",err_until_before:"La série ne peut pas se terminer avant d'avoir commencé.",field_start:"Début",field_end:"Fin",field_location:"Lieu",field_note:"Note",field_calendar:"Calendrier",recurring:"Événement récurrent",recur_this:"Cet événement uniquement",recur_future:"Celui-ci et les suivants",read_only:"Ce calendrier est en lecture seule.",delete:"Supprimer",cancel:"Annuler",save:"Enregistrer",err_invalid:"Veuillez saisir des heures valides.",err_end_before:"La fin précède le début.",err_end_equal:"La fin doit être après le début.",save_failed:"Échec de l'enregistrement.",delete_failed:"Échec de la suppression.",default_title:"Événement",load_error:"Impossible de charger le calendrier.",err_no_persons:"Veuillez configurer au moins une personne sous 'persons'.",no_events:"Aucun événement.",more_events:"autres événements",focus_next:"à suivre",focus_free:"libre",until:"jusqu'à",alert_conflict:"deux événements en même temps",alert_gap:"creux entre deux événements",alert_empty:"personne à la maison",alert_late:"encore à la maison",private:"Privé",turns_age:"aura {n} ans",saver_close:"Photos – toucher pour afficher le tableau",alert_no_driver:"aucun conducteur",alert_driver_busy:"est occupé(e)",ride_by:"Conducteur :",task_due:"tâche du jour",task_overdue:"tâche en retard"},es:{board_title:"Panel familiar",day:"Día",week:"Semana",month:"Mes",agenda:"Agenda",timeline:"Línea de tiempo",now:"Ahora",family:"Familia",all_day:"todo el día",this_week:"Esta semana",prev_week:"Semana anterior",next_week:"Semana siguiente",prev_month:"Mes anterior",next_month:"Mes siguiente",today:"Hoy",tomorrow:"Mañana",yesterday:"Ayer",open_map:"Mapa",status_home:"en casa",status_away:"fuera",add_event:"Añadir evento",new_event:"Nuevo evento",event:"Evento",edit_event:"Editar evento",close:"Cerrar",field_title:"Título",field_all_day:"Todo el día",field_repeat:"Repetir",field_repeat_until:"Hasta (opcional)",repeat_none:"Nunca",repeat_daily:"Cada día",repeat_weekly:"Cada semana",repeat_monthly:"Cada mes",repeat_yearly:"Cada año",err_until_before:"La serie no puede terminar antes de empezar.",field_start:"Inicio",field_end:"Fin",field_location:"Ubicación",field_note:"Nota",field_calendar:"Calendario",recurring:"Evento recurrente",recur_this:"Solo este evento",recur_future:"Este y los siguientes",read_only:"Este calendario es de solo lectura.",delete:"Eliminar",cancel:"Cancelar",save:"Guardar",err_invalid:"Introduce horas válidas.",err_end_before:"El fin es anterior al inicio.",err_end_equal:"El fin debe ser posterior al inicio.",save_failed:"Error al guardar.",delete_failed:"Error al eliminar.",default_title:"Evento",load_error:"No se pudo cargar el calendario.",err_no_persons:"Configura al menos una persona en 'persons'.",no_events:"Sin eventos.",more_events:"eventos más",focus_next:"próximo",focus_free:"libre",until:"hasta",alert_conflict:"dos eventos a la vez",alert_gap:"hueco entre eventos",alert_empty:"nadie en casa",alert_late:"aún en casa",private:"Privado",turns_age:"cumple {n}",saver_close:"Fotos – toca para mostrar el panel",alert_no_driver:"sin conductor",alert_driver_busy:"está ocupado/a",ride_by:"Conductor:",task_due:"tarea para hoy",task_overdue:"tarea atrasada"}};function ze(e){return(e?.locale?.language||navigator?.language||"en").toLowerCase().split("-")[0]}function Se(e,t){const a=ze(e);return Ae[a]?.[t]??Te[t]??t}function Ce(e){return e?.locale?.language||navigator?.language||"en"}function Pe(e){const t=e?.locale?.time_format;if("12"===t)return!0;if("24"===t)return!1;const a=new Intl.DateTimeFormat(Ce(e),{hour:"numeric"}).format(new Date(2020,0,1,13));return/\s?[AaPp]\.?[Mm]\.?/.test(a)||/1\s?PM/i.test(a)}function Ee(e,t){return new Intl.DateTimeFormat(Ce(e),{hour:Pe(e)?"numeric":"2-digit",minute:"2-digit",hour12:Pe(e)}).format(t)}function je(e,t){const a=new Date(2020,0,1,0,0,0,0);return a.setMinutes(t),Ee(e,a)}function Oe(e,t,a=1){const i=new Intl.DateTimeFormat(Ce(e),{weekday:t}),s=Array.from({length:7},(e,t)=>{const a=i.format(new Date(2024,0,7+t));return a.charAt(0).toUpperCase()+a.slice(1)});return Array.from({length:7},(e,t)=>s[(a+t)%7])}function Fe(e,t){const a=t.getTime()-Date.now();if(a<=0)return"";const i=new Intl.RelativeTimeFormat(Ce(e),{numeric:"always",style:"short"}),s=Math.round(a/6e4);if(s<60)return i.format(Math.max(1,s),"minute");const r=Math.round(s/60);return r<24?i.format(r,"hour"):i.format(Math.round(r/24),"day")}const Ie=["now","day","timeline","week","month","agenda"],Ne=["day","timeline","week","month","agenda"],Le=["#8B7CF6","#34D399","#FBBF24","#FB7185","#22D3EE","#C084FC","#A3E635","#FB923C","#F472B6","#60A5FA"],Re={"clear-night":"weather-night",cloudy:"weather-cloudy",fog:"weather-fog",hail:"weather-hail",lightning:"weather-lightning","lightning-rainy":"weather-lightning-rainy",partlycloudy:"weather-partly-cloudy",pouring:"weather-pouring",rainy:"weather-rainy",snowy:"weather-snowy","snowy-rainy":"weather-snowy-rainy",sunny:"weather-sunny",windy:"weather-windy","windy-variant":"weather-windy-variant",exceptional:"weather-cloudy-alert"},He=[[/zahnarzt|dentist|kieferortho/i,"🦷"],[/arzt|doctor|doktor|klinik|hospital|therapie|physio|impf/i,"🩺"],[/geburtstag|geb\.|birthday|jubiläum|jubilaeum|anniversary/i,"🎂"],[/schwimm|swim|hallenbad|baden/i,"🏊"],[/fußball|fussball|soccer|football|training/i,"⚽"],[/sport|gym|fitness|turnen|joggen|laufen|workout/i,"🏃"],[/reit|pferd|pony|horse/i,"🐴"],[/tanz|ballett|dance/i,"🩰"],[/klavier|gitarre|musik|music|chor|singen|band|orchester|instrument/i,"🎵"],[/schule|unterricht|klasse|klassenverbund|school|nachhilfe|lernen|prüfung|pruefung|klausur/i,"🎒"],[/kita|kindergarten|krippe|hort/i,"🧸"],[/frühstück|fruehstueck|breakfast/i,"🥐"],[/schlaf|nap|ruhezeit|mittagsschlaf/i,"😴"],[/mittag|lunch|abendessen|dinner|essen|kochen|restaurant|brunch/i,"🍽️"],[/kaffee|coffee|café|cafe/i,"☕"],[/urlaub|ferien|vacation|holiday|reise|trip|strand|beach/i,"🏖️"],[/flug|flight|airport|flughafen/i,"✈️"],[/zug|bahn|train|abfahrt|ankunft/i,"🚆"],[/kino|film|movie|cinema/i,"🎬"],[/party|feier|fest|celebration/i,"🎉"],[/einkauf|shopping|supermarkt|einkaufen|besorgung/i,"🛒"],[/putz|reinig|cleaning|wäsche|waesche|müll|muell|garbage|trash/i,"🧹"],[/spiel|freispiel|play|angebotszeit/i,"🧸"],[/meeting|besprechung|termin|call|konferenz|conference|office|büro|buero|arbeit|work/i,"💼"],[/friseur|haircut|hairdresser|frisör|frisoer/i,"💇"],[/kirche|church|gottesdienst|messe|religion/i,"⛪"],[/pause|hofpause|break/i,"⏸️"]],Be=/\p{Extended_Pictographic}/u,Ue=e=>new Date(e.length<=10?`${e}T23:59:59`:e),qe=e=>String(e).padStart(2,"0"),We=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,16),Ke=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,10),Ve=e=>{const t=new Date(e);return t.setHours(0,0,0,0),t},Je=(e,t)=>e.color||Le[t%Le.length],Ge=e=>{let t=0;for(let a=0;a<e.length;a++)t=31*t+e.charCodeAt(a)>>>0;return Le[t%Le.length]};function Ye(e){const t=e?.states??{},a=Object.keys(t).filter(e=>e.startsWith("calendar.")),i=e=>e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,""),s=[];for(const e of Object.keys(t)){if(!e.startsWith("person."))continue;const r=e.slice(7),n=t[e].attributes?.friendly_name??r,o=i(r),l=i(n),d=a.filter(e=>{const a=i(e.slice(9)),s=i(t[e].attributes?.friendly_name??"");return a===o||a.includes(o)||l.length>2&&(a.includes(l)||s.includes(l))});if(s.push({name:n,person:e,calendar:1===d.length?d[0]:d.length?d:""}),s.length>=10)break}return s}class Xe extends oe{constructor(){super(...arguments),this._events=[],this._view="day",this._day=((new Date).getDay()+6)%7,this._weekOffset=0,this._monthOffset=0,this._loadError=!1,this._loading=!1,this._fitPx=0,this._hiddenP=[],this._dragStartY=0,this._dragStartX=0,this._dragAxis="y",this._dragPx=1,this._dragGrid=30,this._suppressClick=!1,this._raw=[],this._countdowns=[],this._countdownKey="",this._family=[],this._fetchedKey="",this._tasks={},this._taskSig={},this._forecast={},this._weatherKey="",this._scrolledKey="",this._lastInteract=Date.now(),this._onInteract=()=>{this._saverOn&&(this._eatClick=!0,this.requestUpdate()),this._lastInteract=Date.now(),this._nightWindow()&&(this._wakeUntil=Date.now()+6e4*this._wakeMin,this.requestUpdate())},this._hadMotion=!1,this._wakeUntil=0,this._wasNight=!1,this._onVisible=()=>{"hidden"!==document.visibilityState&&this.hass&&this._config&&this._refetch()},this._onKeyDown=e=>{"Escape"===e.key&&this._dialog?(e.stopPropagation(),this._closeDialog()):"Tab"===e.key&&this._dialog&&this._trapTab(e)},this._calData=new Map,this._fetchGen=0,this._cacheTried=!1,this._subs=[],this._subKey="",this._prevWeek=()=>{this._weekOffset-=1},this._nextWeek=()=>{this._weekOffset+=1},this._thisWeek=()=>{const e=this._homePosition();this._weekOffset=e.week,this._day=e.day},this._prevMonth=()=>{this._monthOffset-=1},this._nextMonth=()=>{this._monthOffset+=1},this._thisMonth=()=>{this._monthOffset=0},this._swiped=!1,this._eatClick=!1,this._saverPhotos=[],this._saverUrl="",this._saverKey="",this._saverIdx=0,this._boardH=0,this._onSwipeStart=e=>{if(this._swipe=void 0,!this._config?.swipe||1!==e.touches.length||this._dialog||this._drag)return;const t=e.composedPath().filter(e=>e instanceof Element),a=t.some(e=>e.matches(".draggable, .switch, .tabs, input, select, textarea"));if(a)return;const i=e.touches[0],s=[...t,document.scrollingElement].filter(e=>!!e).map(e=>[e,e.scrollLeft]);this._swipe={x:i.clientX,y:i.clientY,t:e.timeStamp,scroll:s}},this._onSwipeEnd=e=>{const t=this._swipe;this._swipe=void 0;const a=e.changedTouches[0];if(!t||!a)return;const i=a.clientX-t.x,s=a.clientY-t.y;Math.abs(i)<60||Math.abs(i)<2*Math.abs(s)||e.timeStamp-t.t>800||t.scroll.some(([e,t])=>Math.abs(e.scrollLeft-t)>2)||(this._swiped=!0,this._swipeStep(i<0?1:-1))},this._onSwipeCancel=()=>{this._swipe=void 0},this._onClickAfterSwipe=e=>{(this._swiped||this._eatClick)&&(this._swiped=!1,this._eatClick=!1,e.stopPropagation(),e.preventDefault())},this._onDragMove=e=>{if(!this._drag)return;e.preventDefault();const t="x"===this._dragAxis?e.clientX-this._dragStartX:e.clientY-this._dragStartY,a=this._drag.moved||Math.abs(t)>4;this._drag={...this._drag,deltaMin:t/this._dragPx,moved:a}},this._onDragUp=()=>{window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp);const e=this._drag;e&&(e.moved?(this._suppressClick=!0,this._commitDrag(e)):this._drag=void 0)}}static async getConfigElement(){return await Promise.resolve().then(function(){return ot}),document.createElement("ha-family-board-card-editor")}static getStubConfig(e){const t=e?Ye(e):[];return{type:"custom:family-board-card",view:"day",time_grid:30,start_hour:6,end_hour:22,show_weekends:!0,show_now_line:!0,color_by:"person",persons:t.length?t:[{name:"Person 1",person:"",calendar:""},{name:"Person 2",person:"",calendar:""}]}}setConfig(e){if(!e.persons||!Array.isArray(e.persons))throw new Error(this._t("err_no_persons"));this._config=e;const t=this._enabledViews,a=e.view??"day";this._view=t.includes(a)?a:t[0];const i=this._homePosition();this._day=i.day,this._weekOffset=i.week,this._hiddenP=e.persons.map((e,t)=>e.hidden?t:-1).filter(e=>e>=0);const s=Number(e.col_min_width);Number.isFinite(s)&&s>=60?this.style.setProperty("--fb-col-min",`${Math.min(s,400)}px`):this.style.removeProperty("--fb-col-min"),this.toggleAttribute("compact",!0===e.compact),this.toggleAttribute("slim",!0===e.slim_header);const r=Number(e.event_size);Number.isFinite(r)&&r>=8&&r<=20?(this.style.setProperty("--fb-event-size",`${r}px`),this.style.setProperty("--fb-chip-size",`${Math.max(r-1,8)}px`)):(this.style.removeProperty("--fb-event-size"),this.style.removeProperty("--fb-chip-size"));const n=Number(e.radius);Number.isFinite(n)&&n>=0&&n<=20?(this.style.setProperty("--fb-radius",`${n}px`),this.style.setProperty("--fb-radius-sm",`${Math.max(n-2,2)}px`)):(this.style.removeProperty("--fb-radius"),this.style.removeProperty("--fb-radius-sm"));const o=Number(e.past_opacity);Number.isFinite(o)&&o>=10&&o<=100?this.style.setProperty("--fb-past-opacity",""+o/100):this.style.removeProperty("--fb-past-opacity"),this.isConnected&&this._startTimer()}get _enabledViews(){const e=this._config?.views,t=Array.isArray(e)?Ie.filter(t=>e.includes(t)):[];return t.length?t:"now"===this._config?.view?["now",...Ne]:[...Ne]}get _firstDayJs(){return"sunday"===this._config?.first_day?0:1}get _weekStartJs(){return"today"===this._config?.first_day?(new Date).getDay():this._firstDayJs}_todayIndex(){return((new Date).getDay()-this._weekStartJs+7)%7}_weekStart(e){const t=Ve(e);return t.setDate(t.getDate()-(t.getDay()-this._weekStartJs+7)%7),t}_homePosition(){const e=Math.trunc(Number(this._config?.day_offset??0));if(!Number.isFinite(e)||0===e)return{day:this._todayIndex(),week:0};const t=Ve(new Date),a=_e(t,e),i=me(this._weekStart(t),this._weekStart(a))/7;return{day:(a.getDay()-this._weekStartJs+7)%7,week:i}}getCardSize(){return 12}_scheduleTick(){const e=6e4-Date.now()%6e4+50;this._tick=window.setTimeout(()=>{this._kioskReturn(),this.requestUpdate(),this._scheduleTick()},e)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("visibilitychange",this._onVisible),window.addEventListener("focus",this._onVisible),this._startTimer(),this.addEventListener("pointerdown",this._onInteract),this.addEventListener("touchstart",this._onSwipeStart,{passive:!0}),this.addEventListener("touchend",this._onSwipeEnd,{passive:!0}),this.addEventListener("touchcancel",this._onSwipeCancel,{passive:!0}),this.addEventListener("click",this._onClickAfterSwipe,!0),this._scheduleTick(),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measureFit())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("visibilitychange",this._onVisible),window.removeEventListener("focus",this._onVisible),this.removeEventListener("pointerdown",this._onInteract),this._unsubscribe(),this._fetchedKey="",this.removeEventListener("touchstart",this._onSwipeStart),this.removeEventListener("touchend",this._onSwipeEnd),this.removeEventListener("touchcancel",this._onSwipeCancel),this.removeEventListener("click",this._onClickAfterSwipe,!0),this._stopTimer(),this._saverTimer&&(clearInterval(this._saverTimer),this._saverTimer=void 0),this._tick&&(clearTimeout(this._tick),this._tick=void 0),this._ro?.disconnect(),this._ro=void 0,window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp)}get _progressOn(){return!1!==this._config?.show_progress}_isCurrent(e){const t=Date.now();return e.ref.start.getTime()<=t&&t<e.ref.end.getTime()}_progressPct(e){const t=e.ref.start.getTime(),a=e.ref.end.getTime();return a<=t?0:Math.min(100,Math.max(0,(Date.now()-t)/(a-t)*100))}get _wakeMin(){return Math.max(Number(this._config.auto_return)||0,2)}get _motion(){const e=this._config?.night_wake_entity;return(Array.isArray(e)?e:e?[e]:[]).some(e=>"on"===this.hass?.states[e]?.state)}willUpdate(e){if(e.has("hass")){const e=this._motion;(e||this._hadMotion)&&this._nightWindow()&&(this._wakeUntil=Date.now()+6e4*this._wakeMin),this._hadMotion=e}}static _clockMin(e){const t=/^(\d{1,2}):(\d{2})/.exec(String(e??"").trim());if(!t)return null;const a=60*Number(t[1])+Number(t[2]);return a>=0&&a<1440?a:null}_nightWindow(){const e=Xe._clockMin(this._config?.night_start),t=Xe._clockMin(this._config?.night_end);if(null===e||null===t||e===t)return!1;const a=new Date,i=60*a.getHours()+a.getMinutes();return e<t?i>=e&&i<t:i>=e||i<t}get _night(){return this._nightWindow()&&!this._dialog&&Date.now()>=this._wakeUntil&&!this._motion}get _dataView(){return this._night?"now":this._view}_kioskReturn(){const e=Number(this._config?.auto_return??0);if(!Number.isFinite(e)||e<=0)return;if(Date.now()-this._lastInteract<6e4*e)return;if(this._dialog)return;const t=this._config.view??"day",a=this._enabledViews.includes(t)?t:this._enabledViews[0];this._view!==a&&(this._view=a);const i=this._homePosition();this._weekOffset!==i.week&&(this._weekOffset=i.week),0!==this._monthOffset&&(this._monthOffset=0),this._hiddenP.length&&(this._hiddenP=[]),this._day=i.day}_trapTab(e){const t=this.renderRoot,a=t.querySelector(".dialog");if(!a)return;const i=[...a.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])')].filter(e=>!e.disabled&&null!==e.offsetParent);if(!i.length)return;const s=i[0],r=i[i.length-1],n=t.activeElement,o=!!n&&a.contains(n);!e.shiftKey||o&&n!==s&&n!==a?e.shiftKey||o&&n!==r||(e.preventDefault(),s.focus()):(e.preventDefault(),r.focus())}_startTimer(){this._stopTimer();const e=this._config?.refresh_interval??300;e>0&&(this._timer=window.setInterval(()=>this._refetch(),1e3*e))}_stopTimer(){this._timer&&(clearInterval(this._timer),this._timer=void 0)}updated(e){(e.has("hass")||e.has("_config"))&&this.hass&&this._config?(this._maybeFetch(),this._maybeFetchWeather(),this._maybeFetchCountdowns(),this._maybeFetchTasks(),this._maybeLoadSaver()):(e.has("_view")||e.has("_weekOffset")||e.has("_monthOffset"))&&this.hass&&this._config&&(this._maybeFetch(),this._maybeFetchCountdowns()),!this._saverOn&&!this._night&&this.offsetHeight>200&&(this._boardH=this.offsetHeight),this._syncSaver();const t=this._night;this.toggleAttribute("night",t),t!==this._wasNight&&this.hass&&this._config&&(this._wasNight=t,this._maybeFetch(),this._maybeFetchCountdowns()),e.has("_dialog")&&this._manageDialogFocus(e.get("_dialog")),this._measureFit(),this._syncHeaderOffset(),this._maybeScrollToNow()}_syncHeaderOffset(){const e=this.renderRoot?.querySelector(".board"),t=e?.querySelector(".header-row");if(!e||!t)return;const a=`${t.offsetHeight}px`;e.style.getPropertyValue("--fb-head-h")!==a&&e.style.setProperty("--fb-head-h",a)}_measureFit(){if(this._applyFullHeight(),!this._config?.fit_height||"day"!==this._view)return void(0!==this._fitPx&&(this._fitPx=0));const e=this.renderRoot?.querySelector(".board");if(!e)return;const t=e.querySelector(".header-row"),a=e.querySelector(".allday-row"),i=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],s=this._dayWindow(i),r=s.endMin-s.startMin;if(r<=0)return;const n=(t?.offsetHeight??0)+(a?.offsetHeight??0),o=e.clientHeight-n-2;if(o<=0)return;const l=Math.min(96,Math.max(40,this._config.hour_height??64))/60,d=Math.max(40/60,Math.min(l,o/r));Math.abs(d-this._fitPx)>.02&&(this._fitPx=d)}_applyFullHeight(){const e=this.renderRoot?.querySelector(".board");if(!e)return;if(!this._config?.full_height)return void(e.style.height&&(e.style.height="",e.style.maxHeight=""));const t=e.getBoundingClientRect().top+window.scrollY,a=`${Math.max(200,Math.round(window.innerHeight-t-16))}px`;e.style.height!==a&&(e.style.height=a,e.style.maxHeight=a)}_maybeScrollToNow(){!1!==this._config?.scroll_to_now&&("day"===this._view?this._scrollDayToNow():"timeline"===this._view?this._scrollTimelineToNow():"agenda"===this._view&&this._scrollAgendaToToday())}_scrollOnce(e){const t=`${this._view}|${this._weekOffset}|${this._day}|${e}`;return t!==this._scrolledKey&&(this._scrolledKey=t,!0)}static _offsetIn(e,t){return t.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop}_scrollDayToNow(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0];if(!this._isRealToday(e))return;const t=this.renderRoot?.querySelector(".board"),a=this.renderRoot?.querySelector(".nowline");t&&a&&this._scrollOnce(String(this._config?.hour_height))&&requestAnimationFrame(()=>{const e=a.offsetTop-t.clientHeight/3;t.scrollTo({top:Math.max(0,e),behavior:"smooth"})})}_scrollTimelineToNow(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0];if(!this._isRealToday(e))return;const t=this.renderRoot?.querySelector(".tlwrap"),a=this.renderRoot?.querySelector(".tlnow");t&&a&&this._scrollOnce(String(this._config?.hour_width))&&requestAnimationFrame(()=>{const e=a.getBoundingClientRect().left-t.getBoundingClientRect().left+t.scrollLeft;t.scrollTo({left:Math.max(0,e-t.clientWidth/3),behavior:"smooth"})})}_scrollAgendaToToday(){const e=this._visibleDays.find(e=>this._isRealToday(e));if(void 0===e)return;const t=this.renderRoot?.querySelector(".agenda");if(!t)return;const a=Array.from(t.querySelectorAll(".agenda-day")),i=a.find(t=>Number(t.dataset.day)>=e);i&&this._scrollOnce(String(a.length))&&requestAnimationFrame(()=>{t.scrollTo({top:Math.max(0,Xe._offsetIn(t,i)),behavior:"smooth"})})}_manageDialogFocus(e){this._dialog&&!e?(this._restoreFocus=this.renderRoot?.activeElement,requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector(".dialog"),t=e?.querySelector("input:not([disabled])");(t??e)?.focus()})):!this._dialog&&e&&(this._restoreFocus?.focus?.(),this._restoreFocus=void 0)}_weekBounds(){const e=new Date,t=new Date(e);t.setHours(0,0,0,0),t.setDate(e.getDate()-(e.getDay()-this._weekStartJs+7)%7+7*this._weekOffset);const a=new Date(t);return a.setDate(t.getDate()+7),{monday:t,nextMonday:a}}_monthGrid(){const e=new Date,t=new Date(e.getFullYear(),e.getMonth()+this._monthOffset,1),a=(t.getDay()-this._firstDayJs+7)%7,i=Ve(new Date(t.getFullYear(),t.getMonth(),1-a)),s=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();return{gridStart:i,weeks:Math.ceil((a+s)/7),month:t.getMonth(),year:t.getFullYear()}}_fetchRange(){if("now"===this._dataView){const e=Ve(new Date);return{start:e,end:_e(e,8)}}if("month"===this._view){const{gridStart:e,weeks:t}=this._monthGrid();return{start:e,end:_e(e,7*t)}}const{monday:e,nextMonday:t}=this._weekBounds();return{start:e,end:t}}async _maybeFetch(){const e=this._config.persons.map(e=>this._calsOf(e).join("+")).join(",")+`|${this._familyCals().join("+")}`,t=`${"now"===this._dataView?`n${Ke(new Date)}`:"month"===this._view?`m${this._monthOffset}`:`w${this._weekOffset}${"today"===this._config.first_day?Ke(new Date):""}`}|${e}`;t!==this._fetchedKey&&(this._fetchedKey=t,this._cacheTried||(this._cacheTried=!0,this._loadCache(t)),await this._fetchEvents())}async _refetch(){this._fetchedKey="",await this._maybeFetch()}_taskEntities(){const e=[];for(const t of this._persons){const a=Array.isArray(t.tasks)?t.tasks:t.tasks?[t.tasks]:[];for(const t of a)t&&!e.includes(t)&&e.push(t)}return e}async _maybeFetchTasks(){const e=this._taskEntities();if(0===e.length)return void(Object.keys(this._tasks).length&&(this._tasks={},this._taskSig={}));const t=e.filter(e=>{const t=this.hass.states[e],a=t?`${t.state}|${t.last_changed}`:"missing";return this._taskSig[e]!==a&&(this._taskSig[e]=a,!0)});if(0===t.length)return;const a={...this._tasks};await Promise.all(t.map(async e=>{try{const t=await this.hass.callWS({type:"todo/item/list",entity_id:e});a[e]=t?.items??[]}catch(t){a[e]=[]}})),this._tasks=a}_tasksFor(e,t){if(this._isOff(e))return[];const a=this._persons[e],i=Array.isArray(a?.tasks)?a.tasks:a?.tasks?[a.tasks]:[];if(0===i.length)return[];const s=Ve(t),r=_e(s,1),n=new Date,o=Ve(n).getTime()===s.getTime(),l=[];for(const t of i)for(const a of this._tasks[t]??[]){if("needs_action"!==a.status||!a.due)continue;const i=Ue(a.due);if(isNaN(i.getTime()))continue;const d=i.getTime()<n.getTime();(i.getTime()>=s.getTime()&&i.getTime()<r.getTime()||d&&o)&&l.push({personIdx:e,entity:t,uid:a.uid,summary:a.summary,due:i,allDayDue:a.due.length<=10,overdue:d})}return l.sort((e,t)=>e.due.getTime()-t.due.getTime())}_countdownPatterns(){const e=this._config.countdowns;return(Array.isArray(e)?e:[]).map(e=>String(e).trim().toLowerCase()).filter(Boolean)}async _maybeFetchCountdowns(){const e=this._countdownPatterns(),t=Math.min(Math.max(Number(this._config.countdown_days??60)||60,1),366),a=[...this._config.persons.flatMap((e,t)=>this._calsOf(e).map(e=>[e,t])),...this._familyCals().map(e=>[e,-1])].filter(([e])=>this.hass.states[e]);if(!e.length||"now"!==this._dataView||!a.length)return this._countdowns.length&&(this._countdowns=[]),void(this._countdownKey="");const i=Ve(new Date),s=`${Ke(i)}|${t}|${e.join(",")}|${a.map(([e])=>e).join(",")}`;if(s===this._countdownKey)return;this._countdownKey=s;const r=encodeURIComponent(i.toISOString()),n=encodeURIComponent(_e(i,t+1).toISOString()),o=[];await Promise.all(a.map(async([t,a])=>{try{const i=await this.hass.callApi("GET",`calendars/${t}?start=${r}&end=${n}`);for(const s of i){const i=fe(s,a,t,"");if(!i||this._hidden(i.summary)||!this._allowed(i.summary))continue;if(this._isPrivate(t,s))continue;i.summary=this._cleanTitle(i.summary);const r=i.summary.toLowerCase();e.some(e=>r.includes(e))&&o.push(i)}}catch(e){}}));const l=new Set;this._countdowns=o.sort((e,t)=>e.start.getTime()-t.start.getTime()).filter(e=>{const t=`${e.summary}|${e.start.getTime()}`;return!l.has(t)&&(l.add(t),!0)})}_countdownBand(){const e=new Date,t=Ve(e),a=this._countdowns.filter(t=>t.start.getTime()>e.getTime()).slice(0,6);if(!a.length)return W;const i=new Intl.RelativeTimeFormat(this.hass.locale?.language||void 0,{numeric:"auto"});return U`<div class="cdband" role="list">
      ${a.map(e=>{const a=me(t,Ve(e.start)),s=0===a?Ee(this.hass,e.start):i.format(a,"day"),r=e.personIdx>=0?Je(this._persons[e.personIdx],e.personIdx):this._calMeta(e.calendar).color||"var(--secondary-text-color)",n=this._calIcon(e.calendar);return U`<span class="cdchip" role="listitem" style="--fc:${r}">
          ${n?U`<ha-icon .icon=${n}></ha-icon>`:Be.test(e.summary)?W:U`<span aria-hidden="true">${this._autoIcon(e.summary,!0)||"⏳"}</span>`}<span class="famtext">${this._shown(e.summary,e.start)}</span> <b>${s}</b>
        </span>`})}
    </div>`}async _maybeFetchWeather(){const e=this._config.weather_entity;if(!e||!1===this._config.show_weather||!this.hass.states[e])return Object.keys(this._forecast).length&&(this._forecast={}),void(this._weatherKey="");const t=`${e}|${(new Date).toISOString().slice(0,10)}`;if(t!==this._weatherKey){this._weatherKey=t;try{const t=await this.hass.callWS({type:"call_service",domain:"weather",service:"get_forecasts",service_data:{type:"daily"},target:{entity_id:e},return_response:!0}),a=t?.response?.[e]?.forecast??[],i={};for(const e of a)e?.datetime&&(i[Ke(new Date(e.datetime))]={temp:Math.round(e.temperature),low:"number"==typeof e.templow?Math.round(e.templow):void 0,condition:e.condition});this._forecast=i}catch(e){this._forecast={}}}}_weatherChip(e,t="full"){const a=this._forecast[Ke(e)];if(!a)return W;const i=Re[a.condition]||"weather-cloudy",s=this.hass.config?.unit_system?.temperature??"°",r=void 0===a.low?`${a.temp}${s}`:`${a.temp}${s} / ${a.low}${s}`,n="icon"===t?"":"short"===t?`${a.temp}${s}`:r;return U`<span class="wx ${t}" title="${a.condition} · ${r}">
      <ha-icon icon="mdi:${i}"></ha-icon>${n}
    </span>`}_hidden(e){const t=this._config.hide_patterns;if(!Array.isArray(t)||0===t.length)return!1;const a=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&a.includes(t)})}_allowed(e){const t=this._config.show_patterns;if(!Array.isArray(t)||0===t.length)return!0;const a=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&a.includes(t)})}_cleanTitle(e){const t=this._config.replace_patterns;if(!Array.isArray(t)||0===t.length)return e;let a=e;for(const e of t){const t=String(e),i=t.indexOf("=>"),s=(i>=0?t.slice(0,i):t).trim(),r=i>=0?t.slice(i+2).trim():"";0!==s.length&&(a=a.split(s).join(r))}return a.replace(/\s{2,}/g," ").trim()||e}_isPrivate(e,t){if(!0===t?.fb_private||!0===this._calMeta(e).private)return!0;const a=this._config.private_patterns;if(!Array.isArray(a)||0===a.length)return!1;const i=`${t?.summary??""} ${t?.description??""}`.toLowerCase();return a.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&i.includes(t)})}_makePrivate(e){e.summary=`🔒 ${this._t("private")}`,delete e.location,delete e.description,e.private=!0}_matchesTentative(e){const t=this._config.tentative_patterns;if(!Array.isArray(t)||0===t.length)return!1;const a=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&a.includes(t)})}_allCals(){const e=[...this._config.persons.flatMap(e=>this._calsOf(e)),...this._familyCals()];return[...new Set(e)].filter(e=>this.hass.states[e])}async _fetchEvents(){const e=++this._fetchGen,{start:t,end:a}=this._fetchRange(),i=encodeURIComponent(t.toISOString()),s=encodeURIComponent(a.toISOString()),r=this._allCals();let n=!1;this._loading=!0;const o=new Map;await Promise.all(r.map(async e=>{try{o.set(e,await this.hass.callApi("GET",`calendars/${e}?start=${i}&end=${s}`))}catch(e){n=!0}})),e===this._fetchGen&&(this._calData=o,this._rebuild(),this._loadError=n&&0===this._raw.length,this._loading=!1,this._saveCache(),this._subscribe(t,a,r))}_rebuild(){const e=[];this._config.persons.forEach((t,a)=>{const i=Je(t,a);for(const s of this._calsOf(t)){const r=this._calMeta(s).title_field;for(const n of this._calData.get(s)??[]){const o=fe(n,a,s,i);if(o){if(t.title_prefix?.trim()){const e=o.summary.trimStart().toLocaleLowerCase(),a=t.title_prefix.trim().toLocaleLowerCase();if(!e.startsWith(a)||/^[\p{L}\p{N}_]/u.test(e.slice(a.length)))continue}if(r){const e=n[r];"string"==typeof e&&e.trim()&&(o.summary=e.trim())}!this._hidden(o.summary)&&this._allowed(o.summary)&&(this._matchesTentative(o.summary)&&(o.tentative=!0),o.summary=this._cleanTitle(o.summary),this._isPrivate(s,n)&&this._makePrivate(o),e.push(o))}}}});const t=[];for(const e of this._familyCals())for(const a of this._calData.get(e)??[]){const i=fe(a,-1,e,this._calMeta(e).color??"");i&&!this._hidden(i.summary)&&this._allowed(i.summary)&&(i.summary=this._cleanTitle(i.summary),t.push(i))}let a=e;if(this._config.filter_duplicates){const t=new Set;a=e.filter(e=>{const a=`${e.personIdx}|${e.summary}|${e.start.getTime()}|${e.end.getTime()}`;return!t.has(a)&&(t.add(a),!0)})}this._family=t.sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.start.getTime()-t.start.getTime()),this._raw=a;const{monday:i}=this._weekBounds();this._events="month"===this._view?[]:a.flatMap(e=>function(e,t){return ve(e,t,7)}(e,i))}async _subscribe(e,t,a){const i=this.hass?.connection,s=`${e.toISOString()}|${t.toISOString()}|${a.join(",")}`;if(s!==this._subKey&&(this._unsubscribe(),this._subKey=s,"function"==typeof i?.subscribeMessage))for(const r of a)try{const a=await i.subscribeMessage(e=>{s===this._subKey&&Array.isArray(e?.events)&&(this._calData.set(r,e.events.map(ge)),this._rebuild(),this._saveCache())},{type:"calendar/event/subscribe",entity_id:r,start:e.toISOString(),end:t.toISOString()});if(s!==this._subKey)return void Promise.resolve(a()).catch(()=>{});this._subs.push(a)}catch(e){return}}_unsubscribe(){for(const e of this._subs)Promise.resolve(e()).catch(()=>{});this._subs=[],this._subKey=""}get _cacheId(){const e=this._config.persons.map(e=>this._calsOf(e).join("+")).join(",");return`family-board-card:${e}|${this._familyCals().join("+")}`}_saveCache(){try{const e=JSON.stringify({key:this._fetchedKey,at:Date.now(),cals:[...this._calData].map(([e,t])=>[e,t.map(t=>this._isPrivate(e,t)?{...t,summary:"",location:void 0,description:void 0,uid:void 0,fb_private:!0}:t)])});e.length<5e5&&localStorage.setItem(this._cacheId,e)}catch(e){}}_loadCache(e){try{const t=JSON.parse(localStorage.getItem(this._cacheId)??"null");if(!t||t.key!==e||Date.now()-t.at>864e5||!Array.isArray(t.cals))return;this._calData=new Map(t.cals),this._rebuild()}catch(e){}}_familyCals(){const e=this._config.family_calendars;return(Array.isArray(e)?e:e?[e]:[]).filter(Boolean)}_familyOn(e){const t=Ve(e).getTime(),a=_e(Ve(e),1).getTime();return this._family.filter(e=>e.start.getTime()<a&&e.end.getTime()>t)}_familyChip(e,t){const a=this._calMeta(e.calendar).color||"var(--secondary-text-color)",i=this._calIcon(e.calendar),s=!i&&this._config.auto_icons?this._autoIcon(e.summary):"",r=Ke(e.start)===Ke(t),n=!e.allDay&&r?Ee(this.hass,e.start):"",o=`${this._shown(e.summary,e.start)}${n?`, ${n}`:""} (${this._calLabel(e.calendar)})`;return U`<span class="famchip" style="--fc:${a}" title=${o}>
      ${i?U`<ha-icon .icon=${i}></ha-icon>`:W}${s}${n?U`<b>${n}</b> `:W}<span class="famtext">${this._shown(e.summary,e.start)}</span>
    </span>`}_familyBand(e){const t=this._familyOn(e);return t.length?U`<div class="famband" role="list" aria-label=${this._t("family")}>
      ${t.map(t=>U`<span role="listitem">${this._familyChip(t,e)}</span>`)}
    </div>`:W}_calsOf(e){return Array.isArray(e.calendar)?e.calendar.filter(Boolean):e.calendar?[e.calendar]:[]}_writableCals(e){return this._calsOf(e).filter(e=>this._canCreate(e))}_personCanCreate(e){return this._writableCals(e).length>0}_calFeatures(e){if(!e)return 0;const t=this.hass.states[e];return Number(t?.attributes?.supported_features??0)}_canCreate(e){return!!(1&this._calFeatures(e))}_canUpdate(e){return!!(4&this._calFeatures(e))}_canDelete(e){return!!(2&this._calFeatures(e))}get _persons(){return this._config.persons}get _grid(){return this._config.time_grid??30}get _tlPxPerMin(){return Math.min(240,Math.max(48,Number(this._config.hour_width)||96))/60}get _pxPerMin(){if(this._config.fit_height&&this._fitPx>0)return this._fitPx;return Math.min(96,Math.max(40,this._config.hour_height??64))/60}get _startMin(){return 60*(this._config.start_hour??6)}get _endMin(){return 60*(this._config.end_hour??22)}_dayWindow(e){const t=this._startMin,a=this._endMin;if(!1===this._config.trim_hours)return{startMin:t,endMin:a};const i=this._events.filter(t=>t.day===e&&!t.allDay);if(0===i.length)return{startMin:t,endMin:a};let s=Math.min(...i.map(e=>e.startMin)),r=Math.max(...i.map(e=>e.endMin));if(this._isRealToday(e)){const e=new Date,i=60*e.getHours()+e.getMinutes();i>=t&&i<=a&&(s=Math.min(s,i),r=Math.max(r,i))}let n=Math.max(t,60*Math.floor(s/60)),o=Math.min(a,60*Math.ceil(r/60));return o-n<360&&(o=Math.min(a,n+360),n=Math.max(t,o-360)),{startMin:n,endMin:o}}_jsDay(e){return(this._weekStartJs+e)%7}get _visibleDays(){const e=[0,1,2,3,4,5,6];return!1===this._config.show_weekends?e.filter(e=>{const t=this._jsDay(e);return 0!==t&&6!==t}):e}_t(e){return Se(this.hass,e)}_calMeta(e){return e&&this._config.calendars?.[e]||{}}_mapUrl(e){const t=this._config.map_url,a=encodeURIComponent(e);return"string"==typeof t&&t.includes("{location}")?t.replace("{location}",a):`https://www.google.com/maps/search/?api=1&query=${a}`}_calIcon(e){return this._calMeta(e).icon}_calIconEl(e){const t=this._calIcon(e.ref.calendar);return t?U`<ha-icon class="cicon" .icon=${t}></ha-icon>`:W}_calLabel(e){return this._calMeta(e).label??(this.hass.states[e]?.attributes?.friendly_name||e)}_eventColor(e){const t=this._config.color_by;return"location"===t&&e.location?Ge(e.location):"calendar"===t&&e.ref.calendar?this._calMeta(e.ref.calendar).color??Ge(e.ref.calendar):e.color}_isPast(e){return!1!==this._config.dim_past&&e.ref.end.getTime()<=Date.now()}_relativeDay(e){const t=me(new Date,e);return 0===t?this._t("today"):1===t?this._t("tomorrow"):-1===t?this._t("yesterday"):null}_isOff(e){return this._hiddenP.includes(e)}_togglePerson(e){this._hiddenP=this._isOff(e)?this._hiddenP.filter(t=>t!==e):[...this._hiddenP,e]}_timedFor(e,t){if(this._isOff(t))return[];const a=this._events.filter(a=>a.day===e&&a.personIdx===t&&!a.allDay&&!this._isBackground(a));return be(a)}_bgMinMin(){const e=Number(this._config.background_hours??3);return!Number.isFinite(e)||e<=0?0:60*e}_isBackground(e){const t=this._bgMinMin();return t>0&&!e.allDay&&e.endMin-e.startMin>=t}_bgFor(e,t){return this._isOff(t)?[]:this._events.filter(a=>a.day===e&&a.personIdx===t&&!a.allDay&&this._isBackground(a)).sort((e,t)=>t.endMin-t.startMin-(e.endMin-e.startMin))}_maxCols(){const e=Number(this._config.max_columns);return!Number.isFinite(e)||e<1?3:Math.min(Math.round(e),8)}_dayLayout(e,t){const a=this._timedFor(e,t),i=this._maxCols(),s=new Map;for(const e of a){const t=s.get(e.cluster);t?t.push(e):s.set(e.cluster,[e])}const r=[],n=[];for(const e of s.values()){if(e[0].cols<=i){r.push(...e);continue}let t=0,a=1/0,s=-1/0;for(const n of e)n.col<=i-2?r.push({...n,cols:i,span:Math.max(1,Math.min(n.span,i-n.col))}):(t++,a=Math.min(a,n.startMin),s=Math.max(s,n.endMin));t>0&&n.push({col:i-1,cols:i,startMin:a,endMin:s,count:t})}return{events:r,overflows:n}}_shown(e,t){if(!0!==this._config.birthday_age)return e;const a=function(e,t){const a=De.exec(e);if(!a)return null;if(void 0===a[2]&&!Me.test(e))return null;const i=t.getFullYear()-Number(a[1]??a[2]);return i<1||i>130?null:{title:(e.slice(0,a.index)+e.slice(a.index+a[0].length)).replace(/\s{2,}/g," ").trim()||e,age:i}}(e,t);return a?`${a.title} (${this._t("turns_age").replace("{n}",String(a.age))})`:e}_evTitle(e){const t=this._shown(e.title,e.ref.start),a=e.parts&&e.parts>1?`${t} (${e.part}/${e.parts})`:t,i=this._autoIcon(e.title);return i?`${i} ${a}`:a}_autoIcon(e,t=!1){if(!0!==this._config.auto_icons&&!t)return"";if(!e||Be.test(e))return"";const a=this._config.icon_patterns;if(Array.isArray(a)){const t=e.toLowerCase();for(const e of a){const a=String(e),i=a.indexOf("=>");if(i<0)continue;const s=a.slice(0,i).trim().toLowerCase(),r=a.slice(i+2).trim();if(s&&r&&t.includes(s))return r}}for(const[t,a]of He)if(t.test(e))return a;return""}_isTentative(e){return!0===e.ref.tentative}_showDayAgenda(e){this._day=e,this._enabledViews.includes("agenda")&&(this._view="agenda")}_openDayView(e){this._day=e,this._enabledViews.includes("day")&&(this._view="day")}_allDayFor(e,t){return this._isOff(t)?[]:this._events.filter(a=>a.day===e&&a.personIdx===t&&a.allDay)}_eventsFor(e,t){return this._isOff(t)?[]:this._events.filter(a=>a.day===e&&a.personIdx===t).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin)}_dateForDay(e){const{monday:t}=this._weekBounds();return _e(t,e)}_isRealToday(e){return 0===this._weekOffset&&e===this._todayIndex()}_dateLabel(e){return new Intl.DateTimeFormat(this.hass.locale?.language||void 0,{weekday:"long",day:"numeric",month:"long"}).format(e)}_evLabel(e){const t=e.allDay?this._t("all_day"):`${Ee(this.hass,e.ref.start)}–${Ee(this.hass,e.ref.end)}`,a=this._persons[e.personIdx],i=this._rideDriver(e.ref),s=void 0===i?"":null===i?this._t("alert_no_driver"):`${this._t("ride_by")} ${i}`;return[this._evTitle(e),t,a?this._personName(a,e.personIdx):"",s].filter(Boolean).join(", ")}_onItemKey(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),e.stopPropagation(),this._openEvent(t))}_dayHasEvents(e){return this._persons.some((t,a)=>this._eventsFor(e,a).length>0)}_personName(e,t){return e.name||this.hass.states[e.person??""]?.attributes?.friendly_name||`Person ${t+1}`}_avatar(e,t){const a=Je(e,t),i=e.person?this.hass.states[e.person]:void 0,s=i?.attributes?.entity_picture,r=this._personName(e,t).slice(0,2).toUpperCase();return s?U`<div
          class="avatar"
          aria-hidden="true"
          style="background-image:url('${s}');box-shadow:0 0 0 2px ${a}55"
        ></div>`:U`<div class="avatar initials" aria-hidden="true" style="background:${a}">
          ${r}
        </div>`}_badges(e){const t=Array.isArray(e.badges)?e.badges.filter(Boolean):[];return 0===t.length?W:U`<div class="pbadges">
      ${t.map(e=>{const t=this.hass.states[e];if(!t)return W;const a=t.attributes?.icon,i=t.attributes?.unit_of_measurement??"";return U`<span
          class="pbadge"
          title=${t.attributes?.friendly_name??e}
          role="button"
          tabindex="0"
          @click=${t=>{t.stopPropagation(),this._moreInfo(e)}}
          @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._moreInfo(e))}}
        >
          ${a?U`<ha-icon .icon=${a}></ha-icon>`:W}
          <span>${t.state}${i}</span>
        </span>`})}
    </div>`}_moreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_goToDate(e){this._showDate(e),this._view=this._enabledViews.includes("day")?"day":this._view}_showDate(e){const t=e=>{const t=Ve(e);return t.setDate(t.getDate()-(t.getDay()-this._weekStartJs+7)%7),t},a=me(t(Ve(new Date)),t(e))/7;this._weekOffset=a,this._day=(e.getDay()-this._weekStartJs+7)%7}_swipeStep(e){if("day"===this._view||"timeline"===this._view){const t=this._visibleDays;let a=this._dateForDay(this._day);for(let i=0;i<7&&(a=_e(a,e),!t.includes((a.getDay()-this._weekStartJs+7)%7));i++);this._showDate(a)}else"week"===this._view||"agenda"===this._view?this._weekOffset+=e:"month"===this._view&&(this._monthOffset+=e)}get _saverOn(){if(!this._config?.screensaver_media||!this._saverPhotos.length)return!1;if(this._dialog||this._night)return!1;const e=Math.max(Number(this._config.screensaver_after??10)||10,1);return Date.now()-this._lastInteract>=6e4*e}async _maybeLoadSaver(){const e=this._config.screensaver_media;if(!e)return this._saverKey="",void(this._saverPhotos.length&&(this._saverPhotos=[]));const t=`${e}|${(new Date).toISOString().slice(0,13)}`;if(t!==this._saverKey){this._saverKey=t;try{const t=await this.hass.callWS({type:"media_source/browse_media",media_content_id:e}),a=(t?.children??[]).filter(e=>e?.media_content_id&&("image"===e.media_class||String(e.media_content_type??"").startsWith("image/"))).map(e=>String(e.media_content_id));for(let e=a.length-1;e>0;e--){const t=Math.floor(Math.random()*(e+1));[a[e],a[t]]=[a[t],a[e]]}this._saverPhotos=a,this._saverIdx=0}catch(e){this._saverPhotos=[]}}}async _nextPhoto(){const e=this._saverPhotos;if(!e.length)return;const t=e[this._saverIdx%e.length];this._saverIdx=(this._saverIdx+1)%e.length;try{const e=await this.hass.callWS({type:"media_source/resolve_media",media_content_id:t}),a=String(e?.url??"");if(!a)return;const i=this.hass.hassUrl;this._saverUrl=a.startsWith("/")&&"function"==typeof i?i(a):a}catch(e){}}_syncSaver(){const e=this._saverOn;if(e&&!this._saverTimer){const e=Math.max(Number(this._config.screensaver_interval??20)||20,5);this._nextPhoto(),this._saverTimer=window.setInterval(()=>{this._nextPhoto(),this.requestUpdate()},1e3*e)}else!e&&this._saverTimer&&(clearInterval(this._saverTimer),this._saverTimer=void 0,this._saverUrl="")}_renderSaver(){const e=new Date,t=new Intl.DateTimeFormat(this.hass.locale?.language||void 0,{weekday:"long",day:"numeric",month:"long"}).format(e),a=this._saverUrl;return U`<ha-card
      class="saver"
      style=${this._boardH?`height:${this._boardH}px`:""}
      role="button"
      tabindex="0"
      aria-label="${Ee(this.hass,e)} ${t} – ${this._t("saver_close")}"
      @keydown=${e=>{"Enter"!==e.key&&" "!==e.key&&"Escape"!==e.key||(e.preventDefault(),this._lastInteract=Date.now(),this.requestUpdate())}}
    >
      ${a?U`<div class="saverbg" style="background-image:url('${a}')"></div>
              <img class="saverimg" src=${a} alt="" />`:W}
      <div class="saverclock">
        <span class="savertime">${Ee(this.hass,e)}</span>
        <span class="saverdate">${t}</span>
      </div>
    </ha-card>`}render(){if(!this._config||!this.hass)return W;if(this._night)return U`<ha-card class="nightcard">${this._renderNow()}</ha-card>`;if(this._saverOn)return this._renderSaver();const e=this._config.title??this._t("board_title");return U`
      <ha-card>
        <div class="top">
          <div class="title">${e}</div>
          ${this._enabledViews.length>1?U`<div
                  class="switch"
                  role="tablist"
                  @keydown=${e=>this._onTabKey(e,this._enabledViews,this._view,e=>this._view=e)}
                >
                  ${this._enabledViews.map(e=>U`<button
                        role="tab"
                        aria-selected=${this._view===e}
                        tabindex=${this._view===e?0:-1}
                        class=${this._view===e?"on":""}
                        @click=${()=>this._view=e}
                      >
                        ${this._t(e)}
                      </button>`)}
                </div>`:W}
        </div>
        ${this._config.show_focus&&"now"!==this._view?this._renderFocus():W}
        ${!(this._config.show_alerts||this._lateOn||this._ridesOn)||"day"!==this._view&&"timeline"!==this._view?W:this._renderAlerts()}
        ${"now"===this._view?this._renderNow():"day"===this._view?this._renderDay():"timeline"===this._view?this._renderTimeline():"week"===this._view?this._renderWeek():"month"===this._view?this._renderMonth():this._renderAgenda()}
      </ha-card>
      ${this._dialog?this._renderDialog():W}
    `}_focusFor(e){const t=Date.now(),a=this._raw.filter(t=>t.personIdx===e&&!t.allDay).sort((e,t)=>e.start.getTime()-t.start.getTime()),i=a.find(e=>e.start.getTime()<=t&&t<e.end.getTime()),s=a.find(e=>e.start.getTime()>t);return{current:i,next:s}}get _lateOn(){return Number(this._config.late_warning)>0}_lateWarnings(){if(!this._lateOn)return[];const e=this._persons.map(e=>e.person?this.hass.states[e.person]?.state:void 0);return function(e,t,a,i){if(!(i>0))return[];const s=a.getTime(),r=[];return t.forEach((t,a)=>{if("home"!==t)return;const n=e.filter(e=>{const t=(e.location??"").trim();if(e.personIdx!==a||e.allDay||!t||ye.test(t))return!1;const r=e.start.getTime();return r-6e4*i<=s&&s<r+6e5}).sort((e,t)=>e.start.getTime()-t.start.getTime())[0];n&&r.push({personIdx:a,title:n.summary,location:n.location.trim(),start:n.start})}),r}(this._raw,e,new Date,Number(this._config.late_warning)).filter(e=>!this._isOff(e.personIdx))}get _ridesOn(){return this._persons.some(e=>!0===e.driver)}get _rideWords(){const e=this._config.ride_patterns;return Array.isArray(e)&&e.length?e.map(String):we}get _drivers(){return this._persons.map((e,t)=>({idx:t,name:this._personName(e,t),on:!0===e.driver})).filter(e=>e.on).map(({idx:e,name:t})=>({idx:e,name:t}))}_rideDriver(e){if(!this._ridesOn||e.allDay||!ke(e.summary,this._rideWords))return;const t=$e(e,this._drivers);return void 0===t?null:this._personName(this._persons[t],t)}_rideTag(e){const t=this._rideDriver(e.ref);return void 0===t?W:U`<span class="eride ${null===t?"none":""}">🚗 ${t??"?"}</span>`}_renderAlerts(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],t=this._persons.map((e,t)=>t).filter(e=>!this._isOff(e)),a=this._events.filter(a=>a.day===e&&t.includes(a.personIdx)&&!this._isBackground(a)),i=new Date,s=this._config.show_alerts?function(e,t){const a=e.filter(e=>!e.allDay&&e.endMin>e.startMin),i=[];for(const e of t.persons){const s=a.filter(t=>t.personIdx===e).sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin);for(let t=0;t<s.length;t++)for(let a=t+1;a<s.length;a++){const r=s[t],n=s[a];if(n.startMin>=r.endMin)break;i.push({kind:"conflict",personIdx:e,startMin:Math.max(r.startMin,n.startMin),endMin:Math.min(r.endMin,n.endMin),titles:[r.title,n.title]})}if(t.gapMin>0){let a=-1,r="";for(const n of s)a>=0&&n.startMin-a>=t.gapMin&&i.push({kind:"gap",personIdx:e,startMin:a,endMin:n.startMin,titles:[r,n.title]}),n.endMin>a&&(a=n.endMin,r=n.title)}}if(t.persons.length>1){const e=new Set;for(const t of a)e.add(t.startMin),e.add(t.endMin);const s=[...e].sort((e,t)=>e-t);let r=null;for(let e=0;e<s.length-1;e++){const n=s[e],o=s[e+1],l=t.persons.filter(e=>a.some(t=>t.personIdx===e&&t.startMin<=n&&t.endMin>=o));l.length===t.persons.length?r&&r.endMin===n?r.endMin=o:(r={kind:"empty",startMin:n,endMin:o,titles:[]},i.push(r)):r=null}}const s=t.nowMin;return i.filter(e=>e.endMin>e.startMin&&(void 0===s||e.endMin>s)).sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin)}(a,{persons:t,gapMin:Math.max(0,this._config.gap_min??60),nowMin:this._isRealToday(e)?60*i.getHours()+i.getMinutes():void 0}):[],r=this._isRealToday(e)?this._lateWarnings():[],n=this._dateForDay(e),o=this._ridesOn?function(e,t){const a=[],i=t.now?.getTime();for(const s of e){if(s.allDay||!ke(s.summary,t.words))continue;if(s.start>=t.to||s.end<=t.from)continue;if(void 0!==i&&s.end.getTime()<=i)continue;const r=$e(s,t.drivers);if(void 0===r){a.push({kind:"no_driver",personIdx:s.personIdx,title:s.summary,start:s.start});continue}const n=e.find(e=>e!==s&&!e.allDay&&e.personIdx===r&&e.start<s.end&&s.start<e.end&&!(ke(e.summary,t.words)&&$e(e,t.drivers)!==r));n&&a.push({kind:"driver_busy",personIdx:s.personIdx,driverIdx:r,title:s.summary,start:s.start,busyWith:n.summary})}return a.sort((e,t)=>e.start.getTime()-t.start.getTime())}(this._raw.filter(e=>!this._isOff(e.personIdx)),{words:this._rideWords,drivers:this._drivers,from:n,to:_e(n,1),now:this._isRealToday(e)?i:void 0}):[];if(0===s.length&&0===r.length&&0===o.length)return W;const l={conflict:"⚠️",gap:"⏳",empty:"🏠"};return U`
      <div class="alerts">
        ${r.map(e=>U`
            <div class="alert a-late" title=${e.location}>
              <span>🚪</span>
              <span>
                <b>${this._personName(this._persons[e.personIdx],e.personIdx)}</b>
                ${this._t("alert_late")} – ${e.title}
                <small>${Ee(this.hass,e.start)}</small>
              </span>
            </div>
          `)}
        ${o.map(e=>{const t=this._personName(this._persons[e.personIdx],e.personIdx),a=void 0===e.driverIdx?"":this._personName(this._persons[e.driverIdx],e.driverIdx);return U`
            <div class="alert a-ride" title=${e.busyWith??e.title}>
              <span>🚗</span>
              <span>
                ${"no_driver"===e.kind?U`<b>${t}</b> ${e.title} – ${this._t("alert_no_driver")}`:U`<b>${a}</b> ${this._t("alert_driver_busy")} – ${e.title}`}
                <small>${Ee(this.hass,e.start)}</small>
              </span>
            </div>
          `})}
        ${s.map(e=>{const t=void 0===e.personIdx?"":this._personName(this._persons[e.personIdx],e.personIdx),a=`${je(this.hass,e.startMin)}–${je(this.hass,e.endMin)}`;return U`
            <div class="alert a-${e.kind}" title=${e.titles.join(" · ")}>
              <span>${l[e.kind]}</span>
              <span>
                ${t?U`<b>${t}</b> `:W}${this._t(`alert_${e.kind}`)}
                <small>${a}</small>
              </span>
            </div>
          `})}
      </div>
    `}_taskChip(e){const t=e.allDayDue?"":Ee(this.hass,e.due),a=e.overdue?this._t("task_overdue"):this._t("task_due");return U`
      <div
        class="taskchip ${e.overdue?"overdue":""}"
        tabindex="0"
        role="button"
        title="${e.summary} · ${a}${t?` ${t}`:""}"
        @click=${()=>this._moreInfo(e.entity)}
        @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._moreInfo(e.entity))}}
      >
        <span class="taskbox">${e.overdue?"!":"✓"}</span>
        <span class="tasktext">${e.summary}</span>
        ${t?U`<span class="tasktime">${t}</span>`:W}
      </div>
    `}_renderFocus(){return U`
      <div class="focus">
        ${this._persons.map((e,t)=>{if(this._isOff(t))return W;const{current:a,next:i}=this._focusFor(t),s=Je(e,t),r=e=>this._config.auto_icons?this._autoIcon(e.summary):"";return U`
            <div class="fchip" title=${this._personName(e,t)}>
              ${this._avatar(e,t)}
              <div class="fbody">
                <span class="fname">${this._personName(e,t)}</span>
                ${a?U`<span class="fnow">
                        <span class="fdot" style="background:${s}"></span>${r(a)}
                        ${this._shown(a.summary,a.start)}
                        <small>${this._t("until")} ${Ee(this.hass,a.end)}</small>
                      </span>`:i?U`<span class="fnext">
                          ${this._t("focus_next")}: ${r(i)}
                          ${this._shown(i.summary,i.start)}
                          <small>${Fe(this.hass,i.start)}</small>
                        </span>`:U`<span class="ffree">${this._t("focus_free")}</span>`}
              </div>
            </div>
          `})}
      </div>
    `}_allDayToday(e){const t=Date.now();return this._raw.filter(a=>a.personIdx===e&&a.allDay&&a.start.getTime()<=t&&t<a.end.getTime())}_nextLabel(e){if(Ke(e)===Ke(new Date))return e.getTime()-Date.now()<36e5?Fe(this.hass,e):Ee(this.hass,e);return`${this._relativeDay(e)??Oe(this.hass,"short",0)[e.getDay()]} ${Ee(this.hass,e)}`}_renderNow(){const e=new Date,t=new Intl.DateTimeFormat(this.hass.locale?.language||void 0,{weekday:"long",day:"numeric",month:"long"}).format(e),a=e=>this._config.auto_icons?this._autoIcon(e.summary):"",i=this._lateWarnings();return U`
      <div class="now">
        <div class="nowhead">
          <span class="nowclock">${Ee(this.hass,e)}</span>
          <span class="nowdate">${t}</span>
          ${this._weatherChip(e)}
          ${this._loading&&0===this._raw.length?U`<span class="spinner"></span>`:W}
        </div>
        ${this._familyBand(e)} ${this._countdownBand()}
        <ul class="nowlist">
          ${this._persons.map((t,s)=>{if(this._isOff(s))return W;const{current:r,next:n}=this._focusFor(s),o=Je(t,s),l=this._personName(t,s),d=t.person?this.hass.states[t.person]:void 0,c=this._allDayToday(s),h=r?Math.min(100,Math.max(0,(e.getTime()-r.start.getTime())/Math.max(1,r.end.getTime()-r.start.getTime())*100)):0;return U`
              <li class="nrow" style="--pc:${o}">
                ${this._avatar(t,s)}
                <div class="nbody">
                  <div class="nname">
                    ${l}${d?U`<span class="nstat">${this._statusLabel(d.state)}</span>`:W}
                  </div>
                  ${c.map(e=>U`<span class="nallday">${a(e)} ${this._shown(e.summary,e.start)}</span>`)}
                  ${r?U`<div class="ncur">
                          <span class="ndot" aria-hidden="true"></span>
                          <span class="ntitle"
                            >${a(r)} ${this._shown(r.summary,r.start)}</span
                          >
                          <span class="nuntil"
                            >${this._t("until")} ${Ee(this.hass,r.end)}</span
                          >
                          <div
                            class="nprog"
                            role="progressbar"
                            aria-label=${this._shown(r.summary,r.start)}
                            aria-valuenow=${Math.round(h)}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            <i style="width:${h}%"></i>
                          </div>
                        </div>`:U`<div class="ncur nfree">${this._t("focus_free")}</div>`}
                  ${(()=>{const e=i.find(e=>e.personIdx===s);return e?U`<div class="nlate">
                          🚪 ${e.title} ${Ee(this.hass,e.start)} · ${this._t("alert_late")}
                        </div>`:W})()}
                  ${n?U`<div class="nnext">
                          ${this._t("focus_next")}: ${a(n)}
                          ${this._shown(n.summary,n.start)}
                          <b>${this._nextLabel(n.start)}</b>
                        </div>`:W}
                </div>
              </li>
            `})}
        </ul>
      </div>
    `}_weekNav(){const{monday:e}=this._weekBounds();return U`
      <div class="weeknav">
        <button class="nav" aria-label=${this._t("prev_week")} @click=${this._prevWeek}>‹</button>
        <button class="nav-now" @click=${this._thisWeek}>
          ${function(e,t){const a=new Date(t);a.setDate(a.getDate()+6);const i=new Intl.DateTimeFormat(Ce(e),{day:"numeric",month:"short"});return`${i.format(t)} – ${i.format(a)}`}(this.hass,e)}
        </button>
        <button class="nav" aria-label=${this._t("next_week")} @click=${this._nextWeek}>›</button>
      </div>
    `}_onTabKey(e,t,a,i){const s=t.length,r=t.indexOf(a),n="ArrowRight"===e.key?(r+1)%s:"ArrowLeft"===e.key?(r-1+s)%s:"Home"===e.key?0:"End"===e.key?s-1:-1;if(n<0||0===s)return;e.preventDefault(),i(t[n]);const o=e.currentTarget;this.updateComplete.then(()=>o.querySelectorAll('[role="tab"]')[n]?.focus())}_renderDayTabs(){const e=Oe(this.hass,"short",this._weekStartJs);return U`
      <div
        class="tabs"
        role="tablist"
        @keydown=${e=>this._onTabKey(e,this._visibleDays,this._day,e=>this._day=e)}
      >
        ${this._visibleDays.map(t=>U`
            <button
              role="tab"
              aria-selected=${t===this._day}
              tabindex=${t===this._day?0:-1}
              class="${t===this._day?"on":""} ${this._isRealToday(t)?"today":""}"
              @click=${()=>this._day=t}
            >
              ${e[t]}
            </button>
          `)}
      </div>
    `}_renderDay(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],t=this._pxPerMin,a=60*t,{startMin:i,endMin:s}=this._dayWindow(e),r=(s-i)*t,n=Oe(this.hass,"long",this._weekStartJs),o=[];for(let e=i/60;e<=s/60;e++)o.push(e);const l=new Date,d=Math.max(i,Math.min(s,60*l.getHours()+l.getMinutes())),c=!1!==this._config.show_now_line&&this._isRealToday(e),h=this._dateForDay(e),p=this._persons.some((t,a)=>this._allDayFor(e,a).length>0||this._tasksFor(a,h).length>0);return U`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(e))??n[e]}
          ${this._weatherChip(this._dateForDay(e))}${this._loading&&0===this._raw.length?U`<span class="spinner"></span>`:W}
        </span>
        ${this._config.slim_header?this._renderDayTabs():W} ${this._weekNav()}
      </div>
      ${this._config.slim_header?W:this._renderDayTabs()}
      ${this._loadError?U`<div class="banner">${this._t("load_error")}</div>`:W}
      ${this._familyBand(this._dateForDay(e))}
      <div class="board">
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((e,t)=>{const a=e.person?this.hass.states[e.person]:void 0,i=this._isOff(t);return U`
              <div
                class="phead ${i?"off":""}"
                role="button"
                tabindex="0"
                title=${this._personName(e,t)}
                aria-pressed=${this._isOff(t)?"false":"true"}
                @click=${()=>this._togglePerson(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(t))}}
              >
                ${this._avatar(e,t)}
                ${i?W:U`<div class="pmeta">
                        <div class="pname">${this._personName(e,t)}</div>
                        <div class="pstatus">
                          ${a?this._statusLabel(a.state):""}
                        </div>
                        ${this._badges(e)}
                      </div>`}
              </div>
            `})}
        </div>
        ${p?U`
                <div class="allday-row">
                  <div class="axis-spacer allday-label">${this._t("all_day")}</div>
                  ${this._persons.map((t,a)=>U`
                      <div class="allday-cell ${this._isOff(a)?"off":""}">
                        ${this._tasksFor(a,h).map(e=>this._taskChip(e))}
                        ${this._allDayFor(e,a).map(e=>{const t=this._eventColor(e),a=this._isTentative(e);return U`
                            <div
                              class="adchip ${a?"tentative":""}"
                              style="border-left:3px ${a?"dashed":"solid"} ${t};background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff))"
                              title="${this._evTitle(e)}"
                              tabindex="0"
                              role="button"
                              @click=${()=>this._openEvent(e)}
                              aria-label=${this._evLabel(e)}
                              @keydown=${t=>this._onItemKey(t,e)}
                            >
                              ${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}
                            </div>
                          `})}
                      </div>
                    `)}
                </div>
              `:W}
        <div class="body" style="height:${r}px">
          <div class="axis">
            ${o.map(e=>U`<div class="hour" style="top:${(60*e-i)*t}px">
                  ${qe(e)}:00
                </div>`)}
          </div>
          ${this._persons.map((r,n)=>{const o=this._personCanCreate(r),l=this._dayLayout(e,n);return U`
              <div
                class="col ${o?"creatable":""} ${this._isOff(n)?"off":""}"
                @click=${a=>this._onColClick(a,n,e,t,i)}
                style="background-image:
                  repeating-linear-gradient(var(--fb-row-shade) 0 ${a}px, transparent ${a}px ${2*a}px),
                  repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${a/2}px),
                  repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${a}px)"
              >
                ${this._bgFor(e,n).filter(e=>e.endMin>i&&e.startMin<s).map((e,a)=>{const s=(e.startMin-i)*t,r=Math.max((e.endMin-e.startMin)*t-3,16),n=this._eventColor(e),o=this._isTentative(e);return U`
                      <div
                        class="band ${this._isPast(e)?"past":""} ${o?"tentative":""}"
                        tabindex="0"
                        role="button"
                        @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                        aria-label=${this._evLabel(e)}
                        @keydown=${t=>this._onItemKey(t,e)}
                        style="top:${s+1.5}px;height:${r}px;
                               border:1.5px dashed ${n}55;
                               background:${n}0d;
                               background:repeating-linear-gradient(45deg,
                                 color-mix(in srgb, ${n} 8%, transparent) 0 8px,
                                 transparent 8px 16px)"
                        title="${this._evTitle(e)} · ${je(this.hass,e.startMin)}–${je(this.hass,e.endMin)}"
                      >
                        <span
                          class="etitle"
                          style="margin-top:${19*a}px;
                                 background:${n}26;
                                 background:color-mix(in srgb, ${n} 16%, var(--card-background-color, #fff))"
                          >${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
                        >
                      </div>
                    `})}
                ${(()=>{let e=-1/0;return l.events.filter(e=>e.endMin>i&&e.startMin<s).map(a=>{const{sMin:s,eMin:r,dragging:n}=this._dragPreview(a);let o=(s-i)*t;const l=Math.max((r-s)*t-3,16),d=this._eventColor(a),c=a.col/a.cols*100,h=(a.span??1)/a.cols*100,p=this._isTentative(a),_=l<24,u=this._draggable(a);return _&&1===a.cols&&!n&&(o=Math.max(o,e+1),e=o+l),U`
                        <div
                          class="event ${this._isPast(a)?"past":""} ${p?"tentative":""} ${_?"slim":""} ${u?"draggable":""} ${n?"dragging":""}"
                          tabindex="0"
                          role="button"
                          @pointerdown=${e=>this._onEventPointerDown(e,a,"move")}
                          @click=${e=>{e.stopPropagation(),this._suppressClick?this._suppressClick=!1:this._openEvent(a)}}
                          aria-label=${this._evLabel(a)}
                          @keydown=${e=>this._onItemKey(e,a)}
                          style="top:${o+1.5}px;height:${l}px;
                               left:calc(${c}% + 2px);width:calc(${h}% - 4px);
                               border-left:3px ${p?"dashed":"solid"} ${d};
                               background:${d}40;
                               background:color-mix(in srgb, ${d} 32%, var(--card-background-color, #fff))"
                          title="${this._evTitle(a)} · ${je(this.hass,a.startMin)}–${je(this.hass,a.endMin)}"
                        >
                          <span class="etitle"
                            >${this._calIconEl(a)}${a.continuesBefore?"« ":""}${this._evTitle(a)}${l>32||n?W:this._rideTag(a)}</span
                          >
                          ${l>32||n?U`<span class="etime"
                                  >${je(this.hass,s)}–${je(this.hass,r)}${this._rideTag(a)}</span
                                >`:W}
                          ${this._progressOn&&this._isCurrent(a)&&!n?U`<div class="eprog">
                                  <div style="width:${this._progressPct(a)}%"></div>
                                </div>`:W}
                          ${u&&!_?U`<div
                                  class="rz"
                                  @pointerdown=${e=>this._onEventPointerDown(e,a,"resize")}
                                ></div>`:W}
                        </div>
                      `})})()}
                ${l.overflows.filter(e=>e.endMin>i&&e.startMin<s).map(a=>{const s=(a.startMin-i)*t,r=Math.max((a.endMin-a.startMin)*t-3,16),n=a.col/a.cols*100,o=100/a.cols;return U`
                      <div
                        class="event overflow"
                        tabindex="0"
                        role="button"
                        title="${a.count} ${this._t("more_events")}"
                        @click=${t=>{t.stopPropagation(),this._showDayAgenda(e)}}
                        @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showDayAgenda(e))}}
                        style="top:${s+1.5}px;height:${r}px;
                               left:calc(${n}% + 2px);width:calc(${o}% - 4px)"
                      >
                        <span class="etitle">+${a.count}</span>
                      </div>
                    `})}
              </div>
            `})}
          ${c?U`<div class="nowline" style="top:${(d-i)*t}px">
                  <span>${je(this.hass,d)}</span>
                </div>`:W}
          ${this._loading||this._loadError||this._dayHasEvents(e)?W:U`<div class="empty">${this._t("no_events")}</div>`}
        </div>
      </div>
    `}_renderTimeline(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],{startMin:t,endMin:a}=this._dayWindow(e),i=Math.min(240,Math.max(48,Number(this._config.hour_width)||96)),s=i/60,r=(a-t)*s,n=Oe(this.hass,"long",this._weekStartJs),o=[];for(let e=t/60;e<=a/60;e++)o.push(e);const l=new Date,d=60*l.getHours()+l.getMinutes(),c=!1!==this._config.show_now_line&&this._isRealToday(e)&&d>=t&&d<=a;return U`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(e))??n[e]}
          ${this._weatherChip(this._dateForDay(e))}${this._loading&&0===this._raw.length?U`<span class="spinner"></span>`:W}
        </span>
        ${this._config.slim_header?this._renderDayTabs():W} ${this._weekNav()}
      </div>
      ${this._config.slim_header?W:this._renderDayTabs()}
      ${this._loadError?U`<div class="banner">${this._t("load_error")}</div>`:W}
      ${this._familyBand(this._dateForDay(e))}
      <div class="tlwrap">
        <div class="tlgrid" style="min-width:calc(var(--fb-tl-label, 150px) + ${r}px)">
          <div class="tlhead">
            <div class="tlcorner"></div>
            <div class="tlhours" style="width:${r}px">
              ${o.map(e=>U`<span class="tlhour" style="left:${(60*e-t)*s}px"
                    >${qe(e)}:00</span
                  >`)}
            </div>
          </div>
          ${this._persons.map((n,o)=>{const l=this._isOff(o),d=l?[]:this._events.filter(t=>t.day===e&&t.personIdx===o),c=be(d),h=c.length?Math.max(...c.map(e=>e.cols)):1,p=this._personCanCreate(n),_=n.person?this.hass.states[n.person]:void 0;return U`
              <div class="tlrow ${l?"off":""}">
                <div
                  class="tlperson"
                  role="button"
                  tabindex="0"
                  aria-pressed=${this._isOff(o)?"false":"true"}
                  @click=${()=>this._togglePerson(o)}
                  @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(o))}}
                >
                  ${this._avatar(n,o)}
                  <div>
                    <div class="pname">${this._personName(n,o)}</div>
                    <div class="pstatus">${_?this._statusLabel(_.state):""}</div>
                  </div>
                </div>
                <div
                  class="tlcanvas ${p?"creatable":""}"
                  style="width:${r}px;height:${30*h+8}px;
                         background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${i}px),
                         repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${i/2}px)"
                  @click=${a=>this._onTimelineClick(a,o,e,s,t)}
                >
                  ${c.filter(e=>e.endMin>t&&e.startMin<a).map(e=>{const i=this._dragPreview(e),r=Math.max(i.sMin,t),n=Math.min(i.eMin,a),o=Math.max((n-r)*s-3,20),l=this._eventColor(e),d=this._isTentative(e),c=e.continuesBefore||e.startMin<t,h=e.continuesAfter||e.endMin>a,p=this._draggable(e);return U`
                        <div
                          class="tlbar ${this._isPast(e)?"past":""} ${d?"tentative":""} ${p?"draggable":""} ${i.dragging?"dragging":""}"
                          tabindex="0"
                          role="button"
                          @pointerdown=${t=>this._onEventPointerDown(t,e,"move","x")}
                          @click=${t=>{t.stopPropagation(),this._suppressClick?this._suppressClick=!1:this._openEvent(e)}}
                          aria-label=${this._evLabel(e)}
                          @keydown=${t=>this._onItemKey(t,e)}
                          style="left:${(r-t)*s+1.5}px;width:${o}px;
                                 top:${30*e.col+4}px;height:${24}px;
                                 border-left:3px ${d?"dashed":"solid"} ${l};
                                 background:${l}40;
                                 background:color-mix(in srgb, ${l} 32%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}${e.allDay?` · ${this._t("all_day")}`:` · ${je(this.hass,e.startMin)}–${je(this.hass,e.endMin)}`}"
                        >
                          <span class="etitle"
                            >${c?"« ":""}${this._evTitle(e)}${h?" »":""}</span
                          >
                          ${!e.allDay&&(o>120||i.dragging)?U`<span class="etime"
                                  >${je(this.hass,i.sMin)}–${je(this.hass,i.eMin)}</span
                                >`:W}
                          ${p?U`<div
                                  class="rzx"
                                  @pointerdown=${t=>this._onEventPointerDown(t,e,"resize","x")}
                                ></div>`:W}
                        </div>
                      `})}
                </div>
              </div>
            `})}
          ${c?U`<div
                  class="tlnow"
                  style="left:calc(var(--fb-tl-label, 150px) + ${(d-t)*s}px)"
                >
                  <span>${je(this.hass,d)}</span>
                </div>`:W}
        </div>
        ${this._loading||this._loadError||this._dayHasEvents(e)?W:U`<div class="empty">${this._t("no_events")}</div>`}
      </div>
    `}_onTimelineClick(e,t,a,i,s){const r=this._persons[t];if(!this._personCanCreate(r))return;const n=e.currentTarget.getBoundingClientRect();let o=s+(e.clientX-n.left)/i;const l=this._grid;o=Math.round(o/l)*l,o=Math.max(0,Math.min(o,1440-l)),this._openCreate(t,a,o)}_renderWeek(){const e=Oe(this.hass,"short",this._weekStartJs),t=this._persons.map((e,t)=>({p:e,i:t})).filter(({i:e})=>!0!==this._config.hide_empty_persons||this._events.some(t=>t.personIdx===e)),a=t.length>0?t:this._persons.map((e,t)=>({p:e,i:t})),i=`${this._familyCals().length?118:70}px repeat(${a.length}, minmax(110px, 1fr))`;return U`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${i}">
          <div class="corner"></div>
          ${a.map(({p:e,i:t})=>U`<div
                class="wphead ${this._isOff(t)?"off":""}"
                role="button"
                tabindex="0"
                aria-pressed=${this._isOff(t)?"false":"true"}
                @click=${()=>this._togglePerson(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._togglePerson(t))}}
              >
                ${this._avatar(e,t)}<span>${this._personName(e,t)}</span>
              </div>`)}
          ${this._visibleDays.map(t=>U`
              <div
                class="wday ${this._isRealToday(t)?"today":""}"
                role="button"
                tabindex="0"
                title=${this._t("day")}
                @click=${()=>this._openDayView(t)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openDayView(t))}}
              >
                <span class="sr">${this._dateLabel(this._dateForDay(t))}:</span>
                <b>${e[t]}</b>${this._weatherChip(this._dateForDay(t),"short")}
                ${this._familyOn(this._dateForDay(t)).map(e=>this._familyChip(e,this._dateForDay(t)))}
              </div>
              ${a.map(({p:e,i:a})=>{const i=this._personCanCreate(e);return U`
                  <div
                    class="wcell ${this._isRealToday(t)?"today":""} ${i?"creatable":""}"
                    @click=${()=>i&&this._openCreate(a,t)}
                  >
                    ${this._eventsFor(t,a).map(e=>{const t=this._eventColor(e),a=this._isTentative(e);return U`
                        <div
                          class="wchip ${this._isPast(e)?"past":""} ${a?"tentative":""}"
                          style="border-left:2.5px ${a?"dashed":"solid"} ${t};background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff))"
                          title="${this._evTitle(e)}"
                          tabindex="0"
                          role="button"
                          @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                          aria-label=${this._evLabel(e)}
                          @keydown=${t=>this._onItemKey(t,e)}
                        >
                          <span
                            >${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}</span
                          >
                          ${e.allDay?W:U`<small>${je(this.hass,e.startMin)}</small>`}
                        </div>
                      `})}
                  </div>
                `})}
            `)}
        </div>
      </div>
    `}_renderAgenda(){const e=Oe(this.hass,"long",this._weekStartJs),t=new Intl.DateTimeFormat(this.hass.locale?.language||"en",{day:"numeric",month:"short"}),a=e=>{if(!this._config.filter_duplicates)return e;const t=new Set;return e.filter(e=>{const a=`${this._evTitle(e)}|${e.ref.start.getTime()}|${e.ref.end.getTime()}`;return!t.has(a)&&(t.add(a),!0)})},i=this._visibleDays.find(e=>this._isRealToday(e)),s=this._config.hide_past&&void 0!==i?this._visibleDays.filter(e=>e>=i):this._visibleDays,r=s.map(e=>({d:e,items:a(this._events.filter(t=>t.day===e&&!this._isOff(t.personIdx)).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin))})).filter(e=>e.items.length>0||this._familyOn(this._dateForDay(e.d)).length>0||this._persons.some((t,a)=>this._tasksFor(a,this._dateForDay(e.d)).length>0));return U`
      <div class="weekhead">${this._weekNav()}</div>
      ${this._loadError?U`<div class="banner">${this._t("load_error")}</div>`:W}
      <div class="agenda">
        ${0===r.length?U`<div class="agenda-empty">
                ${this._loading?U`<span class="spinner"></span>`:this._t("no_events")}
              </div>`:r.map(a=>U`
                  <div class="agenda-day" data-day=${a.d}>
                    <div class="agenda-date ${this._isRealToday(a.d)?"today":""}">
                      ${this._relativeDay(this._dateForDay(a.d))??e[a.d]} ·
                      ${t.format(this._dateForDay(a.d))}
                      ${this._weatherChip(this._dateForDay(a.d))}
                    </div>
                    ${this._familyBand(this._dateForDay(a.d))}
                    ${a.items.map(e=>this._agendaRow(e))}
                    ${this._persons.flatMap((e,t)=>this._tasksFor(t,this._dateForDay(a.d)).map(e=>this._agendaTask(e)))}
                  </div>
                `)}
      </div>
    `}_agendaTask(e){const t=this._persons[e.personIdx],a=Je(t,e.personIdx);return U`
      <div
        class="agenda-row task ${e.overdue?"overdue":""}"
        tabindex="0"
        role="button"
        @click=${()=>this._moreInfo(e.entity)}
        @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._moreInfo(e.entity))}}
      >
        <span class="agenda-time"
          >${e.allDayDue?this._t("all_day"):Ee(this.hass,e.due)}</span
        >
        <span class="agenda-bar" style="background:${a}"></span>
        <span class="agenda-main">
          <span class="agenda-title">${e.overdue?"! ":"✓ "}${e.summary}</span>
          <span class="agenda-meta"
            >${this._personName(t,e.personIdx)} ·
            ${e.overdue?this._t("task_overdue"):this._t("task_due")}</span
          >
        </span>
      </div>
    `}_agendaRow(e){const t=this._eventColor(e),a=this._personName(this._persons[e.personIdx],e.personIdx),i=e.allDay?this._t("all_day"):`${je(this.hass,e.startMin)}–${je(this.hass,e.endMin)}`,s=this._isCurrent(e),r=this._isTentative(e),n=e.allDay||s||e.continuesBefore?"":Fe(this.hass,e.ref.start);return U`
      <div
        class="agenda-row ${this._isPast(e)?"past":""} ${s?"current":""} ${r?"tentative":""}"
        tabindex="0"
        role="button"
        @click=${()=>this._openEvent(e)}
        @keydown=${t=>this._onItemKey(t,e)}
      >
        <span class="agenda-time">${i}</span>
        <span class="agenda-bar" style="background:${t}"></span>
        <span class="agenda-main">
          <span class="agenda-title"
            >${this._calIconEl(e)}${e.continuesBefore?"« ":""}${this._evTitle(e)}${e.continuesAfter?" »":""}</span
          >
          <span class="agenda-meta"
            >${a}${e.location?` · ${e.location}`:""}${this._rideTag(e)}</span
          >
          ${s&&this._progressOn?U`<span class="agenda-prog"
                  ><span style="width:${this._progressPct(e)}%;background:${t}"></span
                ></span>`:W}
        </span>
        ${n?U`<span class="agenda-cd">${n}</span>`:W}
      </div>
    `}_renderMonth(){const{gridStart:e,weeks:t,month:a,year:i}=this._monthGrid(),s=7*t,r=Oe(this.hass,"short",this._firstDayJs),n=this.hass.locale?.language||"en",o=new Intl.DateTimeFormat(n,{month:"long",year:"numeric"}).format(new Date(i,a,1)),l=new Map;for(const t of this._raw)if(!this._isOff(t.personIdx))for(const a of ve(t,e,s)){const e=l.get(a.day);e?e.push(a):l.set(a.day,[a])}const d=Ve(new Date).getTime();return U`
      <div class="weekhead">
        <div class="weeknav">
          <button class="nav" aria-label=${this._t("prev_month")} @click=${this._prevMonth}>
            ‹
          </button>
          <button class="nav-now" @click=${this._thisMonth}>${o}</button>
          <button class="nav" aria-label=${this._t("next_month")} @click=${this._nextMonth}>
            ›
          </button>
        </div>
      </div>
      ${this._loadError?U`<div class="banner">${this._t("load_error")}</div>`:W}
      <div class="monthwrap">
        <div class="monthhead">${r.map(e=>U`<div class="mhcell">${e}</div>`)}</div>
        <div class="monthgrid">
          ${Array.from({length:s},(t,i)=>{const s=_e(e,i),r=s.getMonth()===a,n=s.getTime()===d,o=(l.get(i)||[]).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin);return U`
              <div
                class="mcell ${r?"":"out"} ${n?"today":""} ${0===s.getDay()||6===s.getDay()?"wkend":""}"
                role="button"
                tabindex="0"
                @click=${()=>this._goToDate(s)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._goToDate(s))}}
              >
                <span class="sr">${this._dateLabel(s)}:</span>
                <div class="mtop">
                  <div class="mdate ${n?"today":""}">${s.getDate()}</div>
                  ${this._weatherChip(s,"icon")}
                </div>
                <div class="mchips">
                  ${this._familyOn(s).map(e=>this._familyChip(e,s))}
                  ${o.slice(0,3).map(e=>{const t=this._eventColor(e),a=this._isTentative(e);return U`<div
                      class="mchip ${this._isPast(e)?"past":""} ${a?"tentative":""}"
                      style="background:${t}30;background:color-mix(in srgb, ${t} 22%, var(--card-background-color, #fff));border-left:2px ${a?"dashed":"solid"} ${t}"
                      title="${this._evTitle(e)}"
                      @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                    >
                      ${e.continuesBefore?"« ":""}${this._evTitle(e)}
                    </div>`})}
                  ${o.length>3?U`<div class="mmore">+${o.length-3}</div>
                          <span class="sr"
                            >${o.slice(3).map(e=>this._evTitle(e)).join(", ")}</span
                          >`:W}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_statusLabel(e){return"home"===e?this._t("status_home"):"not_home"===e?this._t("status_away"):"unknown"===e||"unavailable"===e?"–":e}_onColClick(e,t,a,i,s){const r=this._persons[t];if(!this._personCanCreate(r))return;const n=e.currentTarget.getBoundingClientRect();let o=s+(e.clientY-n.top)/i;const l=this._grid;o=Math.round(o/l)*l,o=Math.max(0,Math.min(o,1440-l)),this._openCreate(t,a,o)}_openCreate(e,t,a){const i=this._persons[e],s=this._writableCals(i);if(0===s.length)return;const r=Ve(this._dateForDay(t)),n=a??Math.max(this._startMin,540),o=new Date(r);o.setHours(0,n,0,0);const l=new Date(o.getTime()+36e5);this._dialog={mode:"create",personIdx:e,calendar:s[0],calendarOptions:s.length>1?s:void 0,canUpdate:!0,canDelete:!1,summary:"",location:"",description:"",allDay:!1,start:We(o),end:We(l),recurrenceRange:"",repeat:"",repeatUntil:""}}_openEvent(e){const t=e.ref;if(t.private)return;const a=t.calendar,i=this._canUpdate(a)&&!!t.uid,s=this._canDelete(a)&&!!t.uid;this._dialog={mode:"edit",personIdx:t.personIdx,calendar:a,uid:t.uid,recurrence_id:t.recurrence_id,recurring:!(!t.recurrence_id&&!t.rrule),recurrenceRange:"",repeat:"",repeatUntil:"",canUpdate:i,canDelete:s,summary:t.summary,location:t.location??"",description:t.description??"",allDay:t.allDay,start:t.allDay?Ke(t.start):We(t.start),end:t.allDay?Ke(_e(t.end,-1)):We(t.end)}}_dlgField(e,t){this._dialog&&(this._dialog={...this._dialog,[e]:t,error:void 0})}_toggleAllDay(e){if(!this._dialog)return;const t=this._dialog;e&&!t.allDay?this._dialog={...t,allDay:e,start:t.start.slice(0,10),end:t.end.slice(0,10),error:void 0}:!e&&t.allDay&&(this._dialog={...t,allDay:e,start:`${t.start}T09:00`,end:`${t.end}T10:00`,error:void 0})}_buildPayload(e){const t={summary:e.summary.trim()||this._t("default_title")};if(e.location.trim()&&(t.location=e.location.trim()),e.description.trim()&&(t.description=e.description.trim()),e.allDay){const a=new Date(`${e.end}T00:00:00`);a.setDate(a.getDate()+1),t.dtstart=e.start,t.dtend=Ke(a)}else t.dtstart=new Date(e.start).toISOString(),t.dtend=new Date(e.end).toISOString();const a="create"===e.mode?function(e,t,a){if(!e)return"";let i=`FREQ=${e}`;if(t)if(a)i+=`;UNTIL=${t.replace(/-/g,"")}`;else{const[e,a,s]=t.split("-").map(Number);i+=`;UNTIL=${new Date(e,a-1,s,23,59,59).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}`}return i}(e.repeat,e.repeatUntil,e.allDay):"";return a&&(t.rrule=a),t}_validate(e){const t=e.allDay?new Date(`${e.start}T00:00:00`):new Date(e.start),a=e.allDay?new Date(`${e.end}T00:00:00`):new Date(e.end);return isNaN(t.getTime())||isNaN(a.getTime())?this._t("err_invalid"):a.getTime()<t.getTime()?this._t("err_end_before"):e.allDay||a.getTime()!==t.getTime()?e.repeat&&e.repeatUntil&&e.repeatUntil<e.start.slice(0,10)?this._t("err_until_before"):null:this._t("err_end_equal")}_dragPreview(e){const t=this._drag;if(!t||t.raw!==e.ref)return{sMin:e.startMin,eMin:e.endMin,dragging:!1};const a=this._dragGrid;if("move"===t.mode){const i=Math.round((e.startMin+t.deltaMin)/a)*a;return{sMin:i,eMin:e.endMin+(i-e.startMin),dragging:!0}}const i=Math.max(a,Math.round((e.endMin-e.startMin+t.deltaMin)/a)*a);return{sMin:e.startMin,eMin:e.startMin+i,dragging:!0}}_draggable(e){return!1!==this._config.drag_drop&&!e.allDay&&!e.ref.private&&!e.ref.rrule&&!!e.ref.uid&&this._canUpdate(e.ref.calendar)&&!e.continuesBefore&&!e.continuesAfter}_onEventPointerDown(e,t,a,i="y"){0===e.button&&this._draggable(t)&&(e.stopPropagation(),this._dragStartY=e.clientY,this._dragStartX=e.clientX,this._dragAxis=i,this._dragPx="x"===i?this._tlPxPerMin:this._pxPerMin,this._dragGrid=this._grid,this._drag={raw:t.ref,mode:a,deltaMin:0,moved:!1,busy:!1},e.target.setPointerCapture?.(e.pointerId),window.addEventListener("pointermove",this._onDragMove),window.addEventListener("pointerup",this._onDragUp))}async _commitDrag(e){const t=e.raw,{start:a,end:i}=function(e,t,a,i,s){const r=Math.max(1,s),n=new Date(e);n.setHours(0,0,0,0);const o=n.getTime(),l=(e.getTime()-o)/6e4,d=(t.getTime()-e.getTime())/6e4;if("move"===i){const e=Math.round((l+a)/r)*r,t=new Date(o+6e4*e);return{start:t,end:new Date(t.getTime()+6e4*d)}}let c=Math.round((d+a)/r)*r;return c<r&&(c=r),{start:e,end:new Date(e.getTime()+6e4*c)}}(t.start,t.end,e.deltaMin,e.mode,this._dragGrid);if(a.getTime()!==t.start.getTime()||i.getTime()!==t.end.getTime()){this._drag={...e,busy:!0};try{const e={summary:t.summary,dtstart:a.toISOString(),dtend:i.toISOString()};t.location&&(e.location=t.location),t.description&&(e.description=t.description),await this.hass.callWS({type:"calendar/event/update",entity_id:t.calendar,uid:t.uid,recurrence_id:t.recurrence_id,recurrence_range:"",event:e}),this._drag=void 0,await this._refetch()}catch(e){this._drag=void 0,this._loadError=!1,await this._refetch()}}else this._drag=void 0}async _saveDialog(){if(!this._dialog)return;const e=this._dialog,t=this._validate(e);if(t)this._dialog={...e,error:t};else{this._dialog={...e,busy:!0,error:void 0};try{const t=this._buildPayload(e);"create"===e.mode?await this.hass.callWS({type:"calendar/event/create",entity_id:e.calendar,event:t}):await this.hass.callWS({type:"calendar/event/update",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:"",event:t}),this._dialog=void 0,await this._refetch()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}}async _deleteDialog(){if(!this._dialog||!this._dialog.uid)return;const e=this._dialog;this._dialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"calendar/event/delete",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:""}),this._dialog=void 0,await this._refetch()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("delete_failed")}}}_closeDialog(){this._dialog=void 0}_renderDialog(){const e=this._dialog,t="edit"===e.mode&&!e.canUpdate,a=this._calLabel(e.calendar),i="create"===e.mode?this._t("new_event"):t?this._t("event"):this._t("edit_event");return U`
      <div
        class="overlay"
        @click=${e=>{e.target===e.currentTarget&&this._closeDialog()}}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${i} tabindex="-1">
          <div class="dlg-head">
            <span>${i}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeDialog}>
              ✕
            </button>
          </div>
          ${e.calendarOptions&&e.calendarOptions.length>1?U`<label class="fld">
                  <span>${this._t("field_calendar")}</span>
                  <select
                    .value=${e.calendar}
                    @change=${e=>this._dlgField("calendar",e.target.value)}
                  >
                    ${e.calendarOptions.map(t=>U`<option value=${t} ?selected=${t===e.calendar}>
                          ${this._calLabel(t)}
                        </option>`)}
                  </select>
                </label>`:U`<div class="dlg-cal">${a}</div>`}

          <label class="fld">
            <span>${this._t("field_title")}</span>
            <input
              type="text"
              .value=${e.summary}
              ?disabled=${t}
              autofocus
              @input=${e=>this._dlgField("summary",e.target.value)}
            />
          </label>

          <label class="chk">
            <input
              type="checkbox"
              .checked=${e.allDay}
              ?disabled=${t}
              @change=${e=>this._toggleAllDay(e.target.checked)}
            />
            <span>${this._t("field_all_day")}</span>
          </label>

          <div class="row">
            <label class="fld">
              <span>${this._t("field_start")}</span>
              <input
                type=${e.allDay?"date":"datetime-local"}
                .value=${e.start}
                ?disabled=${t}
                @input=${e=>this._dlgField("start",e.target.value)}
              />
            </label>
            <label class="fld">
              <span>${this._t("field_end")}</span>
              <input
                type=${e.allDay?"date":"datetime-local"}
                .value=${e.end}
                ?disabled=${t}
                @input=${e=>this._dlgField("end",e.target.value)}
              />
            </label>
          </div>

          ${"create"!==e.mode||t?W:U`<div class="row">
                  <label class="fld">
                    <span>${this._t("field_repeat")}</span>
                    <select
                      .value=${e.repeat}
                      @change=${e=>this._dlgField("repeat",e.target.value)}
                    >
                      ${["","DAILY","WEEKLY","MONTHLY","YEARLY"].map(t=>U`<option value=${t} ?selected=${e.repeat===t}>
                            ${this._t(`repeat_${t.toLowerCase()||"none"}`)}
                          </option>`)}
                    </select>
                  </label>
                  ${e.repeat?U`<label class="fld">
                          <span>${this._t("field_repeat_until")}</span>
                          <input
                            type="date"
                            .value=${e.repeatUntil}
                            min=${e.start.slice(0,10)}
                            @input=${e=>this._dlgField("repeatUntil",e.target.value)}
                          />
                        </label>`:W}
                </div>`}

          <label class="fld">
            <span>
              ${this._t("field_location")}
              ${e.location.trim()?U`<a
                      class="maplink"
                      href=${this._mapUrl(e.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      @click=${e=>e.stopPropagation()}
                      >${this._t("open_map")}</a
                    >`:W}
            </span>
            <input
              type="text"
              .value=${e.location}
              ?disabled=${t}
              @input=${e=>this._dlgField("location",e.target.value)}
            />
          </label>

          <label class="fld">
            <span>${this._t("field_note")}</span>
            <textarea
              rows="2"
              .value=${e.description}
              ?disabled=${t}
              @input=${e=>this._dlgField("description",e.target.value)}
            ></textarea>
          </label>

          ${"edit"===e.mode&&e.recurring&&!t?U`<div class="recur">
                  <span class="recur-label">${this._t("recurring")}</span>
                  <label class="recur-opt">
                    <input
                      type="radio"
                      name="recur"
                      ?checked=${""===e.recurrenceRange}
                      @change=${()=>this._dlgField("recurrenceRange","")}
                    />
                    <span>${this._t("recur_this")}</span>
                  </label>
                  <label class="recur-opt">
                    <input
                      type="radio"
                      name="recur"
                      ?checked=${"THISANDFUTURE"===e.recurrenceRange}
                      @change=${()=>this._dlgField("recurrenceRange","THISANDFUTURE")}
                    />
                    <span>${this._t("recur_future")}</span>
                  </label>
                </div>`:W}
          ${t?U`<div class="ro-note">${this._t("read_only")}</div>`:W}
          ${e.error?U`<div class="dlg-error">${e.error}</div>`:W}

          <div class="dlg-actions">
            ${"edit"===e.mode&&e.canDelete?U`<button class="danger" ?disabled=${e.busy} @click=${this._deleteDialog}>
                    ${this._t("delete")}
                  </button>`:W}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${e.busy} @click=${this._closeDialog}>
              ${this._t("cancel")}
            </button>
            ${t?W:U`<button class="primary" ?disabled=${e.busy} @click=${this._saveDialog}>
                    ${e.busy?"…":this._t("save")}
                  </button>`}
          </div>
        </div>
      </div>
    `}}Xe.styles=n`
    :host {
      font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
      /* grid tokens — theme-aware, calm by default */
      --fb-hourline: var(--divider-color, #8884);
      --fb-halfhour: color-mix(in srgb, var(--divider-color, #8884) 45%, transparent);
      --fb-row-shade: color-mix(in srgb, var(--secondary-text-color, #888) 5%, transparent);
      /* secondary text on tinted event backgrounds: the theme's secondary grey
         drops below a readable contrast there (2.8:1 in dark mode), so derive
         it from the primary text colour instead */
      --fb-soft-text: color-mix(in srgb, var(--primary-text-color, #212121) 85%, transparent);
      /* customization tokens — override via theme or card-mod */
      --fb-accent: var(--primary-color);
      --fb-now-color: var(--error-color, #ff5252);
      --fb-radius: 7px;
      --fb-radius-sm: 5px;
      --fb-avatar-size: 34px;
      --fb-past-opacity: 0.5;
      --fb-title-size: 16px;
      --fb-name-size: 13px;
      --fb-event-size: 11.5px;
      --fb-time-size: 9.5px;
      --fb-chip-size: 10.5px;
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
    /* one-switch compact density */
    :host([compact]) {
      --fb-title-size: 14px;
      --fb-name-size: 11.5px;
      --fb-event-size: 10.5px;
      --fb-time-size: 9px;
      --fb-chip-size: 9.5px;
      --fb-avatar-size: 26px;
      --fb-event-pad: 2px 5px;
      --fb-head-pad: 5px 4px;
      --fb-axis-width: 44px;
    }
    :host([compact]) .top,
    :host([compact]) .dayhead,
    :host([compact]) .weekhead {
      padding: 6px 10px;
    }
    :host([compact]) .tabs {
      margin: 4px 10px 0;
    }
    :host([compact]) .focus {
      padding: 5px 10px;
    }
    :host([compact]) .fchip {
      padding: 4px 8px;
    }
    /* "now / next" glance bar */
    .alerts {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 12px 6px;
    }
    .alert {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 9px;
      border-radius: 999px;
      font-size: var(--fb-chip-size, 10.5px);
      line-height: 1.3;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .alert.a-conflict {
      border-color: color-mix(in srgb, var(--error-color, #db4437) 55%, transparent);
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
    }
    .alert.a-late {
      border-color: color-mix(in srgb, var(--error-color, #db4437) 70%, transparent);
      background: color-mix(in srgb, var(--error-color, #db4437) 18%, transparent);
      font-weight: 600;
    }
    .alert.a-ride {
      border-color: color-mix(in srgb, var(--warning-color, #ffa600) 60%, transparent);
      background: color-mix(in srgb, var(--warning-color, #ffa600) 16%, transparent);
    }
    .eride {
      margin-left: 6px;
      font-weight: 600;
      white-space: nowrap;
    }
    .eride.none {
      color: var(--error-color, #db4437);
    }
    .nlate {
      font-size: 14px;
      font-weight: 700;
      color: var(--error-color, #db4437);
    }
    .alert.a-gap {
      border-color: color-mix(in srgb, var(--warning-color, #ffa600) 60%, transparent);
      background: color-mix(in srgb, var(--warning-color, #ffa600) 14%, transparent);
    }
    .alert small {
      opacity: 0.7;
      margin-left: 3px;
    }
    .focus {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color);
      scrollbar-width: thin;
    }
    .fchip {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1 1 0;
      min-width: 160px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      padding: 6px 10px;
    }
    .fchip .avatar {
      flex: 0 0 auto;
    }
    .fbody {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.25;
    }
    .fname {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-weight: 600;
    }
    /* block, not flex: on a flex container text-overflow has no effect and a
       chip too narrow for its text would be cut mid-character */
    .fnow,
    .fnext,
    .ffree {
      font-size: 12.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .fnow small,
    .fnext small {
      margin-left: 3px;
    }
    .ffree {
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .fnow small,
    .fnext small {
      color: var(--secondary-text-color);
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .fdot {
      display: inline-block;
      vertical-align: middle;
      width: 8px;
      height: 8px;
      margin-right: 4px;
      border-radius: 50%;
      flex: 0 0 8px;
      animation: fb-pulse 2s ease-out infinite;
    }
    .title {
      font-weight: 600;
      font-size: var(--fb-title-size);
    }
    .switch,
    .tabs {
      display: inline-flex;
      gap: 2px;
      background: var(--secondary-background-color);
      border-radius: 9px;
      padding: 2px;
    }
    /* with many views the toggle may not fit a phone: scroll it, never the card */
    .switch {
      max-width: 100%;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .switch::-webkit-scrollbar {
      display: none;
    }
    .switch button {
      flex: none;
    }
    .switch button,
    .tabs button {
      border: none;
      cursor: pointer;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 5px 12px;
      border-radius: 999px;
      font: inherit;
      font-size: 13px;
      transition:
        background 0.12s ease,
        color 0.12s ease;
    }
    .switch button:hover:not(.on),
    .tabs button:hover:not(.on) {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .switch button.on,
    .tabs button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
      box-shadow: 0 1px 4px color-mix(in srgb, var(--primary-color) 45%, transparent);
    }
    .tabs button.today:not(.on) {
      box-shadow: inset 0 -2px 0 var(--fb-accent);
    }
    .tabs {
      margin: 8px 16px 0;
      flex-wrap: wrap;
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
    /* Wrapper only exists for the slim header; normally it must not affect
       layout at all, which is what display: contents buys us. */
    .pmeta {
      display: contents;
    }
    :host([slim]) .pmeta {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
    }
    :host([slim]) .phead {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 5px 6px;
    }
    :host([slim]) .pname,
    :host([slim]) .pstatus {
      text-align: left;
    }
    :host([slim]) .dayhead,
    :host([slim]) .weekhead {
      padding: 5px 12px;
    }
    :host([slim]) .tabs {
      margin: 0;
    }
    .dayname {
      font-weight: 700;
      font-size: 15.5px;
      display: inline-flex;
      align-items: center;
    }
    .weeknav {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .nav,
    .nav-now {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 7px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      padding: 5px 10px;
    }
    .nav {
      font-size: 16px;
      line-height: 1;
      padding: 4px 9px;
    }
    .nav-now {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .banner {
      margin: 8px 16px 0;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12.5px;
      color: var(--text-primary-color, #fff);
      background: var(--error-color, #ff5252);
    }
    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-left: 8px;
      vertical-align: middle;
      border: 2px solid var(--divider-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: fb-spin 0.7s linear infinite;
    }
    @keyframes fb-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 2s;
      }
    }
    .empty {
      position: absolute;
      top: 0;
      left: var(--fb-axis-width, 56px);
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      font-size: 13px;
      pointer-events: none;
    }
    .board {
      max-height: var(--fb-board-max-height, 58vh);
      overflow: auto;
      margin-top: 8px;
    }
    /* keep header, all-day and body columns pixel-aligned: borders must not
       change box width, or the vertical dividers break between the rows. */
    .axis-spacer,
    .phead,
    .axis,
    .col,
    .allday-cell,
    .allday-label {
      box-sizing: border-box;
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
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
      position: sticky;
      left: 0;
      background: inherit;
    }
    .phead {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      padding: var(--fb-head-pad, 10px 6px);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-left: 1px solid var(--divider-color);
      position: relative;
    }
    .taskchip {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 3px;
      padding: 2px 6px;
      border-radius: var(--fb-radius-sm, 5px);
      font-size: var(--fb-chip-size, 10.5px);
      line-height: 1.35;
      cursor: pointer;
      border: 1px dashed var(--divider-color);
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
    }
    .taskchip.overdue {
      border-style: solid;
      border-color: color-mix(in srgb, var(--warning-color, #ffa600) 65%, transparent);
      background: color-mix(in srgb, var(--warning-color, #ffa600) 14%, transparent);
    }
    .taskchip .taskbox {
      flex: 0 0 auto;
      width: 12px;
      height: 12px;
      border-radius: 3px;
      border: 1px solid var(--divider-color);
      font-size: 9px;
      line-height: 11px;
      text-align: center;
      opacity: 0.75;
    }
    .taskchip.overdue .taskbox {
      border-color: var(--warning-color, #ffa600);
      color: var(--warning-color, #ffa600);
      font-weight: 700;
      opacity: 1;
    }
    .taskchip .tasktime {
      flex: 0 0 auto;
      margin-left: auto;
      opacity: 0.7;
      font-variant-numeric: tabular-nums;
    }
    .taskchip .tasktext {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Sticks right below the person header: the board scrolls to the current
       time on load, and an all-day row inside the scroller would be gone
       before anyone saw it. The offset is the measured header height. */
    .allday-row {
      display: flex;
      position: sticky;
      top: var(--fb-head-h, 0px);
      z-index: 4;
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
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      border-left: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .adchip {
      border-radius: var(--fb-radius-sm);
      padding: 2px 6px;
      font-size: var(--fb-chip-size);
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .avatar {
      width: var(--fb-avatar-size);
      height: var(--fb-avatar-size);
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
      font-size: var(--fb-name-size);
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
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
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
    /* first hour label would be clipped by the header above */
    .hour:first-child {
      transform: none;
      margin-top: 1px;
    }
    .col {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      position: relative;
      border-left: 1px solid var(--divider-color);
    }
    .col.creatable {
      cursor: copy;
    }
    .event {
      position: absolute;
      border-radius: var(--fb-radius);
      padding: var(--fb-event-pad, 4px 7px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 2;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .event:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 4;
    }
    /* long "background" events (OGS, Freispiel …): faint full-width band behind
       the normal event blocks so short lessons keep the full column width. */
    .band {
      position: absolute;
      left: 2px;
      right: 2px;
      border-radius: var(--fb-radius);
      padding: 3px 7px;
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 1;
      display: flex;
      justify-content: flex-end; /* keep label clear of left-aligned event blocks */
      align-items: flex-start;
    }
    .band .etitle {
      max-width: 90%;
      font-weight: 600;
      font-size: 10px;
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 1px 8px;
    }
    .cicon {
      --mdc-icon-size: 13px;
      width: 13px;
      height: 13px;
      vertical-align: -2px;
      margin-right: 3px;
      opacity: 0.85;
    }
    .event.draggable {
      touch-action: none;
      cursor: grab;
    }
    .event.dragging {
      cursor: grabbing;
      z-index: 20;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
      opacity: 0.94;
      transition: none;
    }
    /* resize grabber at the bottom edge */
    .rz {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 9px;
      cursor: ns-resize;
      touch-action: none;
    }
    .rz::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 2px;
      width: 20px;
      height: 3px;
      transform: translateX(-50%);
      border-radius: 2px;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.12s ease;
    }
    .event.draggable:hover .rz::after {
      opacity: 0.4;
    }
    .event.tentative {
      opacity: 0.72;
      border-style: dashed;
      background-image: repeating-linear-gradient(
        135deg,
        transparent 0 6px,
        rgba(255, 255, 255, 0.06) 6px 12px
      );
    }
    .event.overflow {
      background: var(--secondary-background-color);
      border: 1px dashed var(--divider-color);
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      z-index: 6;
    }
    .event.overflow .etitle {
      font-weight: 700;
    }
    /* very short events (breaks etc.): thin single-line strip drawn on top so
       neighbours' min-height can't cover them */
    .event.slim {
      z-index: 3;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      padding: 0 5px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .event.slim .etitle {
      font-size: calc(var(--fb-event-size) - 1.5px);
      font-weight: 600;
    }
    .event.slim .etime,
    .event.slim .eprog {
      display: none;
    }
    .phead {
      cursor: pointer;
    }
    .phead.off,
    .col.off,
    .allday-cell.off {
      flex: 0 0 48px;
      min-width: 48px;
    }
    .phead.off .avatar,
    .wphead.off .avatar,
    .tlrow.off .avatar {
      opacity: 0.35;
      filter: grayscale(0.8);
    }
    .wphead {
      cursor: pointer;
    }
    .wphead.off span {
      opacity: 0.4;
    }
    .tlperson {
      cursor: pointer;
    }
    .tlrow.off .pname,
    .tlrow.off .pstatus {
      opacity: 0.4;
    }
    .pbadges {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 3px;
      margin-top: 2px;
    }
    .pbadge {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 10px;
      font-weight: 600;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 1px 7px;
      cursor: pointer;
      white-space: nowrap;
    }
    .pbadge ha-icon {
      --mdc-icon-size: 12px;
      width: 12px;
      height: 12px;
      display: inline-flex;
      align-items: center;
    }
    @media (pointer: coarse) {
      .switch button,
      .tabs button {
        padding: 8px 14px;
      }
    }
    /* phones: tighter columns, smaller chrome, everything still scrollable */
    @media (max-width: 600px) {
      .focus {
        flex-wrap: wrap;
        overflow-x: visible;
      }
      .fchip {
        min-width: 140px;
      }
      :host {
        --fb-col-min: 96px;
        --fb-avatar-size: 28px;
        --fb-axis-width: 42px;
        --fb-title-size: 14px;
        --fb-name-size: 11.5px;
        --fb-event-size: 10.5px;
        --fb-chip-size: 10px;
      }
      .top {
        flex-wrap: wrap;
        gap: 6px;
      }
      .switch button {
        padding: 5px 9px;
      }
      .phead {
        padding: 6px 4px;
        gap: 2px;
      }
      .hour {
        font-size: 9.5px;
        right: 4px;
      }
      .weeknav {
        gap: 4px;
      }
      .band .etitle {
        font-size: 9px;
        padding: 1px 6px;
      }
      .pbadge {
        font-size: 9px;
        padding: 1px 5px;
      }
    }
    .wchip,
    .adchip,
    .mchip {
      transition: box-shadow 0.12s ease;
    }
    .wchip:hover,
    .adchip:hover,
    .mchip:hover {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }
    .agenda-row {
      transition: background 0.12s ease;
    }
    .agenda-row.task .agenda-title {
      font-weight: 600;
    }
    .agenda-row.task.overdue .agenda-title {
      color: var(--warning-color, #ffa600);
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .wchip.tentative,
    .mchip.tentative,
    .adchip.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .agenda-row.tentative .agenda-bar {
      opacity: 0.55;
    }
    .agenda-row.tentative .agenda-title {
      font-style: italic;
    }
    .etitle {
      font-size: var(--fb-event-size);
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .etime {
      font-size: var(--fb-time-size);
      color: var(--fb-soft-text);
      font-variant-numeric: tabular-nums;
    }
    .nowline {
      position: absolute;
      left: var(--fb-axis-width, 56px);
      right: 0;
      border-top: 2px solid var(--fb-now-color);
      z-index: 7;
      pointer-events: none;
    }
    .nowline::after {
      content: "";
      position: absolute;
      left: -3px;
      top: -5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--fb-now-color);
      animation: fb-pulse 2s ease-out infinite;
    }
    @keyframes fb-pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--fb-now-color) 40%, transparent);
      }
      50% {
        box-shadow: 0 0 0 7px transparent;
      }
    }
    @keyframes fb-fade {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    .board,
    .weekwrap,
    .agenda,
    .monthgrid {
      animation: fb-fade 0.18s ease;
    }
    .board::-webkit-scrollbar,
    .weekwrap::-webkit-scrollbar,
    .agenda::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .board::-webkit-scrollbar-thumb,
    .weekwrap::-webkit-scrollbar-thumb,
    .agenda::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 8px;
    }
    @media (prefers-reduced-motion: reduce) {
      .board,
      .weekwrap,
      .agenda,
      .monthgrid,
      .nowline::after,
      .event {
        animation: none !important;
        transition: none !important;
      }
    }
    .nowline span {
      /* start at the axis' left edge, whatever its width; a long 12-hour label
         ("10:20 AM") may reach over the line, so it sits above the dot */
      position: absolute;
      left: calc(2px - var(--fb-axis-width, 56px));
      z-index: 1;
      white-space: nowrap;
      top: -8px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* timeline (horizontal) */
    .tlwrap {
      overflow: auto;
      max-height: var(--fb-board-max-height, 58vh);
      margin-top: 8px;
      animation: fb-fade 0.18s ease;
    }
    .tlgrid {
      position: relative;
    }
    .tlhead {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      height: 26px;
    }
    .tlcorner {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      background: inherit;
      z-index: 2;
    }
    .tlhours {
      position: relative;
    }
    .tlhour {
      position: absolute;
      top: 5px;
      transform: translateX(-50%);
      font-size: 10.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    /* the outer labels would be half cut off by the scroll box: pull the first
       one inside the grid and hang the last one to the left of its line */
    .tlhour:first-child {
      transform: none;
    }
    .tlhour:last-child {
      transform: translateX(-100%);
    }
    .tlrow {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
    }
    .tlperson {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      box-sizing: border-box;
      border-right: 1px solid var(--divider-color);
    }
    .tlperson .pname {
      font-size: 12.5px;
    }
    .tlcanvas {
      position: relative;
      flex: 0 0 auto;
    }
    .tlcanvas.creatable {
      cursor: copy;
    }
    .tlbar {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 7px;
      border-radius: var(--fb-radius);
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .tlbar.draggable {
      cursor: grab;
      touch-action: pan-y;
    }
    .tlbar.dragging {
      cursor: grabbing;
      z-index: 20;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
      opacity: 0.94;
      transition: none;
    }
    /* resize grabber on the right edge (timeline runs horizontally) */
    .rzx {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 9px;
      cursor: ew-resize;
      touch-action: none;
    }
    .rzx::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 3px;
      transform: translateY(-50%);
      height: 12px;
      width: 2px;
      border-radius: 1px;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.12s ease;
    }
    .tlbar:hover .rzx::after {
      opacity: 0.45;
    }
    .tlbar:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 3;
    }
    .tlbar.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .tlbar .etime {
      flex: 0 0 auto;
    }
    .tlnow {
      position: absolute;
      top: 0;
      bottom: 0;
      border-left: 2px solid var(--fb-now-color);
      z-index: 6;
      pointer-events: none;
    }
    .tlnow span {
      position: absolute;
      top: 2px;
      left: -1px;
      transform: translateX(-50%);
      white-space: nowrap; /* "10:20 AM" broke onto two lines */
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* agenda */
    .agenda {
      max-height: 60vh;
      overflow: auto;
      padding: 4px 0 8px;
    }
    .agenda-empty {
      padding: 28px 16px;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .agenda-day {
      padding: 0 12px;
    }
    .agenda-date {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
      font-weight: 600;
      font-size: 13px;
      padding: 8px 4px 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-date.today {
      color: var(--primary-color);
    }
    .agenda-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      cursor: pointer;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .agenda-time {
      flex: 0 0 auto;
      min-width: 92px;
      white-space: nowrap;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .agenda-bar {
      flex: 0 0 4px;
      align-self: stretch;
      border-radius: 2px;
    }
    .agenda-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .agenda-title {
      font-size: 13.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .agenda-meta {
      font-size: 11px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* month */
    .monthwrap {
      overflow: auto;
      max-height: 62vh;
      padding: 0 8px 8px;
    }
    .monthhead {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
    }
    .mhcell {
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .monthgrid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(64px, 1fr);
    }
    .mcell {
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 3px;
      cursor: pointer;
      overflow: hidden;
      box-sizing: border-box;
    }
    .mcell:nth-child(7n) {
      border-right: none;
    }
    .mcell.out {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 4%, transparent);
    }
    .mcell.out .mdate {
      opacity: 0.45;
    }
    .mcell:hover {
      background: var(--secondary-background-color);
    }
    .mcell.today {
      background: color-mix(in srgb, var(--fb-accent) 7%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--fb-accent);
    }
    .mcell.wkend:not(.today) {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 3.5%, transparent);
    }
    .mdate {
      font-size: 12px;
      font-weight: 600;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-variant-numeric: tabular-nums;
    }
    .mdate.today {
      background: var(--fb-accent);
      color: var(--text-primary-color, #fff);
      border-radius: 50%;
    }
    .mchips {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 2px;
    }
    .mchip {
      font-size: 10px;
      font-weight: 600;
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mmore {
      font-size: 9.5px;
      color: var(--secondary-text-color);
      padding-left: 4px;
    }
    /* text only for screen readers (the visible text stays part of the name) */
    .sr {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }
    /* containing block for .sr (the week's .wday already is one: sticky) */
    .mcell {
      position: relative;
    }

    /* shared family calendars: holidays, bin collection … above the people */
    .famband {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 6px;
      padding: 6px 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    .now .famband,
    .agenda .famband {
      padding: 0 0 8px;
      border-bottom: none;
    }
    .agenda .famband {
      padding-top: 6px;
    }
    .famchip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: 100%;
      min-width: 0;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.3;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px dashed var(--fc);
      background: color-mix(in srgb, var(--fc) 10%, var(--card-background-color, #fff));
      color: var(--primary-text-color);
    }
    .famchip ha-icon {
      --mdc-icon-size: 14px;
      color: var(--fc);
      flex: none;
    }
    .famchip b {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .famtext {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }
    .wday .famchip,
    .mchips .famchip {
      font-size: 10px;
      padding: 1px 6px;
      align-self: stretch;
    }
    /* the week's day column is narrow: let a title take two lines there */
    .wday .famchip {
      border-radius: 8px;
      flex-wrap: wrap;
      row-gap: 0;
    }
    .wday .famtext {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    .wday:has(.famchip) {
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 3px;
    }

    /* night screen: dark, dimmed, calm - for the hours nobody looks closely.
       Colours set outright (no opacity), so it stays dark on any theme and
       any page behind the card. */
    ha-card.saver {
      display: block;
      position: relative;
      overflow: hidden;
      height: 100%;
      min-height: 60vh;
      background: #000;
      cursor: pointer;
    }
    .saverbg {
      position: absolute;
      inset: -40px;
      background-size: cover;
      background-position: center;
      filter: blur(28px) brightness(0.55);
    }
    .saverimg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      animation: saverin 1.2s ease;
    }
    @keyframes saverin {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .saverclock {
      position: absolute;
      left: 24px;
      bottom: 20px;
      display: flex;
      flex-direction: column;
      color: #fff;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
    }
    .savertime {
      font-size: 64px;
      font-weight: 700;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .saverdate {
      font-size: 20px;
      margin-top: 6px;
    }
    @media (prefers-reduced-motion: reduce) {
      .saverimg {
        animation: none;
      }
    }
    :host([night]) ha-card {
      --ha-card-background: #000;
      --card-background-color: #000;
      --primary-text-color: #a3a3a3;
      --secondary-text-color: #747474;
      --divider-color: #1c1c1c;
      --secondary-background-color: #111;
      /* derived from the day's text colour on :host - redo it for the night */
      --fb-soft-text: #8c8c8c;
      display: block;
      background: #000;
      color: var(--primary-text-color);
    }
    :host([night]) .now {
      padding-top: 24px;
    }
    :host([night]) .nowclock {
      font-size: clamp(56px, 14vw, 120px);
      font-weight: 300;
      letter-spacing: -0.02em;
    }
    :host([night]) .nrow {
      background: #0b0b0b;
      border-left-color: color-mix(in srgb, var(--pc) 45%, #000);
    }
    :host([night]) .famchip,
    :host([night]) .cdchip {
      background: #111;
      border-color: #2a2a2a;
    }
    :host([night]) .avatar,
    :host([night]) .nprog,
    :host([night]) .ndot {
      filter: grayscale(0.5) brightness(0.6);
    }

    /* countdowns in the now view: "🏖️ Holiday · in 12 days" */
    .cdband {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 8px;
      margin: -2px 0 12px;
    }
    .cdchip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      min-width: 0;
      font-size: 13px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--fc) 14%, var(--card-background-color, #fff));
      border: 1px solid color-mix(in srgb, var(--fc) 45%, transparent);
    }
    .cdchip ha-icon {
      --mdc-icon-size: 15px;
      color: var(--fc);
      flex: none;
    }
    .cdchip b {
      font-weight: 700;
      white-space: nowrap;
      color: var(--fb-soft-text);
    }

    /* "now" view: large, calm glance for wall tablets and small displays */
    .now {
      padding: 12px 16px 16px;
    }
    .nowhead {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 4px 14px;
      margin-bottom: 12px;
    }
    .nowclock {
      font-size: clamp(32px, 7vw, 56px);
      font-weight: 700;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .nowdate {
      font-size: clamp(14px, 2.4vw, 18px);
      color: var(--secondary-text-color);
    }
    .nowhead .wx {
      align-self: center;
      margin-left: 0;
    }
    .nowlist {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
      gap: 10px;
    }
    .nrow {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 12px 14px;
      border-radius: var(--fb-radius);
      background: color-mix(in srgb, var(--pc) 9%, var(--card-background-color, #fff));
      border-left: 4px solid var(--pc);
      min-width: 0;
    }
    .nrow .avatar {
      width: 44px;
      height: 44px;
      flex: none;
      font-size: 15px;
    }
    .nbody {
      min-width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nname {
      font-weight: 700;
      font-size: 15px;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .nstat {
      font-weight: 400;
      font-size: 12px;
      color: var(--fb-soft-text);
    }
    .nallday {
      align-self: flex-start;
      font-size: 12px;
      font-weight: 600;
      padding: 1px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--pc) 22%, transparent);
    }
    .ncur {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 2px 8px;
      font-size: clamp(17px, 2.6vw, 22px);
      font-weight: 700;
      line-height: 1.25;
    }
    .ncur .ntitle {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .ndot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--pc);
      align-self: center;
      flex: none;
    }
    .nuntil {
      font-size: 13px;
      font-weight: 500;
      color: var(--fb-soft-text);
    }
    .nfree {
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .nprog {
      flex-basis: 100%;
      height: 4px;
      border-radius: 2px;
      background: color-mix(in srgb, var(--pc) 20%, transparent);
      overflow: hidden;
      margin-top: 2px;
    }
    .nprog i {
      display: block;
      height: 100%;
      background: var(--pc);
    }
    .nnext {
      font-size: 14px;
      color: var(--fb-soft-text);
      overflow-wrap: anywhere;
    }
    .nnext b {
      color: var(--primary-text-color);
      font-weight: 600;
      white-space: nowrap;
    }
    /* weather chip */
    .wx {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      vertical-align: middle;
      font-variant-numeric: tabular-nums;
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 2px 9px 2px 5px;
      margin-left: 6px;
    }
    .wx ha-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-text-color);
    }
    .agenda-date .wx {
      margin-left: 4px;
    }
    .wx.short {
      font-size: 11px;
      padding: 1px 6px 1px 3px;
      margin-left: 4px;
    }
    .wx.short ha-icon {
      --mdc-icon-size: 15px;
    }
    /* the week's day column is narrow: weather goes under the weekday */
    .wday:has(.wx) {
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 3px;
    }
    .wday .wx.short {
      margin-left: 0;
    }
    .wx.icon {
      background: none;
      padding: 0;
      margin: 0;
    }
    .wx.icon ha-icon {
      --mdc-icon-size: 15px;
      color: var(--secondary-text-color);
    }
    .mtop {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    /* faded past events + map link */
    .past {
      opacity: var(--fb-past-opacity);
    }
    /* progress bar inside a running day event */
    .eprog {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      background: var(--divider-color);
    }
    .eprog > div {
      height: 100%;
      background: var(--fb-now-color);
    }
    /* agenda: countdown + running progress */
    .agenda-cd {
      flex: 0 0 auto;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .agenda-row.current {
      background: color-mix(in srgb, var(--fb-accent) 6%, transparent);
    }
    .agenda-prog {
      display: block;
      height: 3px;
      margin-top: 4px;
      border-radius: 2px;
      background: var(--divider-color);
      overflow: hidden;
    }
    .agenda-prog > span {
      display: block;
      height: 100%;
    }
    .maplink {
      margin-left: 8px;
      font-size: 11px;
      color: var(--primary-color);
      text-decoration: none;
    }
    .maplink:hover {
      text-decoration: underline;
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
      cursor: pointer;
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
      background: color-mix(in srgb, var(--fb-accent) 8%, transparent);
    }
    .wchip {
      border-radius: var(--fb-radius-sm);
      padding: 3px 5px;
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      cursor: pointer;
    }
    .wchip span {
      font-size: var(--fb-chip-size);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wchip small {
      margin-left: auto;
      font-size: 8.5px;
      color: var(--fb-soft-text);
      font-variant-numeric: tabular-nums;
    }
    /* focus visibility for a11y */
    button:focus-visible,
    .event:focus-visible,
    .wchip:focus-visible,
    .adchip:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
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
      flex-wrap: wrap;
      gap: 10px;
    }
    /* Start and end sit side by side only while both actually fit. A flex item
       defaults to min-width: auto, so without the wrap the end field used to be
       pushed out past the dialog edge. How wide a datetime-local control is
       depends on the BROWSER locale (a 12-hour "09:50 AM" needs noticeably more
       room than "09:50"), so the breakpoint cannot be a fixed pixel value -
       min-content lets the browser decide and the row stacks when it must. */
    .row > .fld {
      flex: 1 1 auto;
      min-width: min-content;
    }
    .row .fld {
      flex: 1;
    }
    input,
    textarea,
    select {
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
    .recur {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 12px;
      margin-bottom: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--secondary-background-color);
    }
    .recur-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      width: 100%;
    }
    .recur-opt {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .recur-opt input {
      width: auto;
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
  `,e([he({attribute:!1})],Xe.prototype,"hass",void 0),e([pe()],Xe.prototype,"_config",void 0),e([pe()],Xe.prototype,"_events",void 0),e([pe()],Xe.prototype,"_view",void 0),e([pe()],Xe.prototype,"_day",void 0),e([pe()],Xe.prototype,"_weekOffset",void 0),e([pe()],Xe.prototype,"_monthOffset",void 0),e([pe()],Xe.prototype,"_dialog",void 0),e([pe()],Xe.prototype,"_loadError",void 0),e([pe()],Xe.prototype,"_loading",void 0),e([pe()],Xe.prototype,"_fitPx",void 0),e([pe()],Xe.prototype,"_hiddenP",void 0),e([pe()],Xe.prototype,"_drag",void 0),e([pe()],Xe.prototype,"_countdowns",void 0),e([pe()],Xe.prototype,"_family",void 0),e([pe()],Xe.prototype,"_tasks",void 0),e([pe()],Xe.prototype,"_forecast",void 0),e([pe()],Xe.prototype,"_saverPhotos",void 0),e([pe()],Xe.prototype,"_saverUrl",void 0),customElements.get("family-board-card")||customElements.define("family-board-card",Xe),window.customCards=window.customCards||[],window.customCards.push({type:"family-board-card",name:"Family Board Card",description:"Family calendar / who-is-where board for multiple people – day, timeline, week, month and agenda views.",preview:!0,documentationURL:"https://github.com/renespeaker/ha-family-board-card"}),console.info("%c FAMILY-BOARD-CARD %c v0.33.0 ","background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px","background:#222;color:#fff;border-radius:0 3px 3px 0");const Ze={l_title:"Card title",l_refresh_interval:"Auto refresh (sec., 0 = off)",l_view:"Default view",l_views:"Available views (switcher)",l_time_grid:"Time grid",l_start_hour:"Start hour",l_end_hour:"End hour",l_hour_height:"Height per hour",l_hour_width:"Timeline: width per hour",l_fit_height:"Auto-fit: squeeze the day so it fits without scrolling",l_full_height:"Full height: stretch to the bottom of the screen",l_trim_hours:"Hide empty hours at the edges",l_col_min_width:"Min. column width per person",l_background_hours:"Show long events as a background band from (hrs.)",l_max_columns:"Max. columns per day",l_first_day:"Week starts on",l_scroll_to_now:"Auto-scroll to now",l_swipe:"Swipe to page",l_night_start:"Night screen from",l_night_end:"Night screen until",l_night_wake_entity:"Wake on motion",l_screensaver_media:"Photo screensaver (media folder)",l_screensaver_after:"Photos after (min without touch)",l_screensaver_interval:"Seconds per photo",l_day_offset:"Start on (days from today)",l_slim_header:"Slim header",l_color_by:"Color by",l_show_weekends:"Show weekend",l_show_now_line:"Now line",l_dim_past:"Dim past events",l_show_progress:"Show progress bar",l_hide_patterns:"Hide events",l_show_patterns:"Only show events matching",l_replace_patterns:"Replace titles",l_filter_duplicates:"Merge duplicate events",l_hide_past:"Agenda: hide days that are over",l_tentative_patterns:"Mark as tentative",l_auto_icons:"Auto icons by keyword",l_icon_patterns:"Custom icon rules",l_show_focus:"“Now / next” bar",l_show_alerts:"Day check (double bookings, gaps, nobody home)",l_gap_min:"Flag a gap from (min., 0 = off)",l_late_warning:"Warn when still at home (min. before, 0 = off)",l_drag_drop:"Move events by dragging (day view)",l_family_calendars:"Family calendars",l_countdowns:"Countdowns",l_countdown_days:"Countdowns look ahead",l_weather_entity:"Weather entity",l_show_weather:"Show weather",l_hide_empty_persons:"Week: hide persons without events",l_auto_return:"Return to the start view after idle (min., 0 = off)",l_event_size:"Event font size",l_radius:"Corner radius of the blocks",l_past_opacity:"Opacity of past events",l_name:"Display name",l_person:"Person (avatar & status)",l_calendar:"Calendars (multiple possible)",l_tasks:"Task lists (due items appear on the board)",l_color:"Custom color (hex, optional)",l_badges:"Badges (e.g. battery, sensors)",l_hidden:"Hidden on start",l_driver:"Drives (pick-ups, drop-offs)",l_title_prefix:"Only events whose title starts with (optional)",l_ride_patterns:"Words for rides",l_private_patterns:"Private events",l_birthday_age:"Birthdays with age",l_compact:"Compact layout",l_map_url:"Map link (template)",h_scroll_to_now:"Day view to the current time, timeline to the now line, agenda to today",h_swipe:"Touch screens: swipe left or right for the next or previous day, week or month",h_night_start:"Wall tablet: a dark, dimmed clock with the next events; a tap wakes the board",h_night_end:"Morning: back to the normal board",h_screensaver_media:"A folder from Media, e.g. media-source://media_source/local/photos – a slideshow with clock after a while without touch; a tap brings the board back",h_night_wake_entity:"Motion or presence sensor: when it reports “on”, the board wakes like after a tap",h_day_offset:"0 = today, 1 = tomorrow, -1 = yesterday. For a display that should show the day ahead",h_slim_header:"Weekday buttons move up onto the navigation line and the avatar sits next to the name - saves about 40 px",h_hide_patterns:"Text patterns, e.g. “Recess” – matches are hidden",h_show_patterns:"Allow list: only events whose title contains one of the patterns",h_replace_patterns:"e.g. “Homeroom => Lesson” (without => the text is removed)",h_tentative_patterns:"Matches are drawn dashed / translucent",h_filter_duplicates:"The same event in several calendars is shown only once",h_hide_past:"The list starts at today. Paging back to an earlier week still shows everything",h_auto_return:"Kiosk: jumps back to “today” after X minutes without a touch",h_background_hours:"0 = off. Long all-day-ish events (after-school care …) as a subtle band",h_fit_height:"Compresses the day until everything is visible without scrolling",h_full_height:"For panel view / wall tablet",h_trim_hours:"Shows only the hours that actually contain events",h_col_min_width:"Below this the board scrolls horizontally",h_family_calendars:"Calendars for everyone – holidays, bin collection, school holidays. Shown above the people, never counted as a double booking",h_countdowns:'Now view: words like holiday or birthday - matching events show as "in 12 days" chips',h_countdown_days:"How many days ahead countdowns are shown (default 60)",h_weather_entity:"Daily forecast in the header (HA location)",h_auto_icons:"e.g. doctor → 🩺, sport → 🏃, birthday → 🎂 (titles with emoji stay untouched)",h_icon_patterns:"Own rules, e.g. “Grandma => 👵”",h_show_focus:"Compact bar above the views: what is running now / coming next",h_show_alerts:"Chips above the day and timeline views: one person booked twice, an unsupervised window between two events, or everyone out at the same time",h_gap_min:"How long a hole between two of a person's events has to be before it is worth a warning",h_late_warning:"An event with a place starts soon and the person entity still says home: warning in the day check and the now view",h_drag_drop:"Writable calendars only; drag to move, bottom edge changes the duration",h_views:"Which switchers appear at the top",h_tasks:"Open tasks due today - and overdue ones - show up as chips. Checking them off stays with your todo app or the Family Task Card",h_badges:"Small chips below the person header; click opens details",h_color:"Leave empty for the palette color",h_hidden:"Column starts collapsed; a click on the header brings it back",h_driver:"Rides such as “pick up Mia” get a driver; the day check warns when nobody drives or the driver is busy",h_ride_patterns:"Empty = pick up, drop off, ride, abholen, bringen …",h_birthday_age:"“Grandma’s birthday (1946)” or “Max *2019” shows as “… (turns 80)”",h_private_patterns:"Text in title or description, e.g. “#private” – shows only “Private” and the time",h_compact:"Smaller fonts and tighter spacing in a single switch",h_map_url:"{location} is substituted, e.g. https://maps.apple.com/?q={location}",o_person:"Person",o_location:"Location",o_calendar:"Calendar",o_monday:"Monday",o_sunday:"Sunday",o_today:"Today (rolling week)",g_views:"🗓️ Views",g_layout:"📐 Layout & size",g_filters:"🧹 Filters & clean-up",g_looks:"🎨 Appearance (fine-tuning)",g_kiosk:"🖥️ Kiosk & extras",w_title:"👨‍👩‍👧‍👦 Welcome to the family board!",w_text:"Ready in two clicks – the card detects your family automatically from the person and calendar entities of your Home Assistant.",w_detect:"✨ Step 1: detect persons automatically",w_hint:"Optionally afterwards: pick a profile (below) or fine-tune the settings in the groups. Of course you can also add persons by hand:",w_empty:"＋ Start empty",p_tablet:"🖥️ Wall tablet",p_tablet_title:"Full screen, auto-fit, return to today",p_phone:"📱 Phone",p_phone_title:"Agenda as start view, compact columns",p_reset:"🧩 Default",p_reset_title:"Reset the layout settings",s_persons:"People",s_calendars:"Calendars (color & label)",s_settings:"Settings",b_add_person:"＋ Add person",b_detect:"✨ Detect automatically",b_up:"Move up",b_down:"Move down",b_remove:"Remove",b_auto:"Automatic",ph_label:"Custom label",ph_icon:"Icon, e.g. mdi:school",ph_title_field:"Title from field (e.g. description)",cal_private:"Private – show only “Private” and the time",person_n:"Person",cal_hint_1:"Colors apply with “Color by: calendar”, labels in the event dialog. Icon = mdi icon in front of the title. “Title from field” uses e.g.",cal_hint_2:"instead of",cal_hint_3:"as the event title."},Qe={en:Ze,de:{l_title:"Kartentitel",l_refresh_interval:"Auto-Aktualisierung (Sek., 0 = aus)",l_view:"Standardansicht",l_views:"Verfügbare Ansichten (Umschalter)",l_time_grid:"Zeitraster",l_start_hour:"Startstunde",l_end_hour:"Endstunde",l_hour_height:"Höhe pro Stunde",l_hour_width:"Zeitstrahl: Breite pro Stunde",l_fit_height:"Auto-Fit: Tag ohne Scrollen einpassen",l_full_height:"Volle Höhe: bis zum unteren Bildschirmrand",l_trim_hours:"Leere Randstunden automatisch ausblenden",l_col_min_width:"Min. Spaltenbreite pro Person",l_background_hours:"Lange Termine als Hintergrund-Band ab (Std.)",l_max_columns:"Max. Spalten pro Tag",l_first_day:"Wochenstart",l_scroll_to_now:"Auto-Scroll zu jetzt",l_swipe:"Wischen zum Blättern",l_night_start:"Nachtbildschirm ab",l_night_end:"Nachtbildschirm bis",l_night_wake_entity:"Bei Bewegung aufwecken",l_screensaver_media:"Foto-Bildschirmschoner (Medienordner)",l_screensaver_after:"Fotos nach (Min. ohne Berührung)",l_screensaver_interval:"Sekunden pro Foto",l_day_offset:"Beginnt bei (Tage ab heute)",l_slim_header:"Schlanker Kopfbereich",l_color_by:"Einfärben nach",l_show_weekends:"Wochenende anzeigen",l_show_now_line:"Jetzt-Linie",l_dim_past:"Vergangene Termine ausgrauen",l_show_progress:"Fortschrittsbalken anzeigen",l_hide_patterns:"Termine ausblenden",l_show_patterns:"Nur Termine zeigen mit",l_replace_patterns:"Titel ersetzen",l_filter_duplicates:"Doppelte Termine zusammenfassen",l_hide_past:"Agenda: vergangene Tage ausblenden",l_tentative_patterns:"Als vorläufig markieren",l_auto_icons:"Auto-Symbole nach Stichwort",l_icon_patterns:"Eigene Symbol-Regeln",l_show_focus:"„Jetzt / als Nächstes“-Leiste",l_show_alerts:"Tages-Check (Doppelbuchung, Lücken, niemand zuhause)",l_gap_min:"Lücke melden ab (Min., 0 = aus)",l_late_warning:"Warnen, wenn noch zuhause (Min. vorher, 0 = aus)",l_drag_drop:"Termine per Ziehen verschieben (Tagesansicht)",l_family_calendars:"Familien-Kalender",l_countdowns:"Countdowns",l_countdown_days:"Countdowns schauen voraus",l_weather_entity:"Wetter-Entität",l_show_weather:"Wetter anzeigen",l_hide_empty_persons:"Woche: Personen ohne Termine ausblenden",l_auto_return:"Nach Inaktivität zur Startansicht (Min., 0 = aus)",l_event_size:"Schriftgröße Termine",l_radius:"Ecken-Radius der Blöcke",l_past_opacity:"Deckkraft vergangener Termine",l_name:"Anzeigename",l_person:"Person (Avatar & Status)",l_calendar:"Kalender (mehrere möglich)",l_tasks:"Aufgabenlisten (Fälliges erscheint im Board)",l_color:"Eigene Farbe (Hex, optional)",l_badges:"Badges (z. B. Akku, Sensoren)",l_hidden:"Beim Start ausgeblendet",l_driver:"Fährt (Abholen, Bringen)",l_title_prefix:"Nur Termine mit diesem Titelanfang (optional)",l_ride_patterns:"Wörter für Fahrten",l_private_patterns:"Private Termine",l_birthday_age:"Geburtstage mit Alter",l_compact:"Kompakte Darstellung",l_map_url:"Karten-Link (Vorlage)",h_scroll_to_now:"Tag zur aktuellen Uhrzeit, Zeitstrahl zur Jetzt-Linie, Agenda zu heute",h_swipe:"Touchscreens: nach links oder rechts wischen für den nächsten oder vorigen Tag, Woche oder Monat",h_night_start:"Wandtablet: dunkle, gedimmte Uhr mit den nächsten Terminen; Antippen weckt das Board",h_night_end:"Morgens: zurück zum normalen Board",h_screensaver_media:"Ein Ordner aus „Medien“, z. B. media-source://media_source/local/fotos – nach einer Weile ohne Berührung eine Diashow mit Uhr; Antippen holt das Board zurück",h_night_wake_entity:"Bewegungs- oder Präsenzmelder: meldet er „an“, wacht das Board auf wie nach einem Antippen",h_day_offset:"0 = heute, 1 = morgen, -1 = gestern. Für Anzeigen, die den kommenden Tag zeigen sollen",h_slim_header:"Wochentage rutschen auf die Navigationszeile und der Avatar neben den Namen – spart rund 40 px",h_hide_patterns:"Textmuster, z. B. „Hofpause“ – Treffer werden ausgeblendet",h_show_patterns:"Allow-Liste: nur Termine, deren Titel eines der Muster enthält",h_replace_patterns:"z. B. „Klassenverbund => Unterricht“ (ohne => wird der Text entfernt)",h_tentative_patterns:"Treffer werden gestrichelt/transparent dargestellt",h_filter_duplicates:"Gleicher Termin in mehreren Kalendern nur einmal",h_hide_past:"Die Liste beginnt bei heute. Blätterst du in eine frühere Woche, siehst du weiterhin alles",h_auto_return:"Kiosk: springt nach X Minuten ohne Berührung zurück zu „heute“",h_background_hours:"0 = aus. Lange Dauertermine (OGS, Betreuung …) als dezentes Band",h_fit_height:"Staucht den Tag, bis alles ohne Scrollen sichtbar ist",h_full_height:"Für Panel-Ansicht / Wandtablet",h_trim_hours:"Zeigt nur die Stunden, in denen wirklich Termine liegen",h_col_min_width:"Darunter wird horizontal gescrollt",h_family_calendars:"Kalender für alle – Feiertage, Müllabfuhr, Schulferien. Erscheinen über den Personen und zählen nie als Doppelbuchung",h_countdowns:'Jetzt-Ansicht: Stichworte wie Urlaub oder Geburtstag - passende Termine erscheinen als "in 12 Tagen"-Chips',h_countdown_days:"Wie viele Tage voraus Countdowns erscheinen (Standard 60)",h_weather_entity:"Tages-Vorhersage im Kopf (HA-Standort)",h_auto_icons:"z. B. Arzt → 🩺, Sport → 🏃, Geburtstag → 🎂 (Titel mit Emoji bleiben unberührt)",h_icon_patterns:"eigene Regeln, z. B. „Oma => 👵“",h_show_focus:"Kompakte Leiste über den Ansichten: was läuft jetzt / kommt als Nächstes",h_show_alerts:"Chips über Tages- und Zeitstrahl-Ansicht: eine Person doppelt verplant, eine unbetreute Lücke zwischen zwei Terminen oder alle gleichzeitig unterwegs",h_gap_min:"Ab welcher Länge ein Loch zwischen zwei Terminen einer Person eine Warnung wert ist",h_late_warning:"Ein Termin mit Ort beginnt gleich, die Person ist laut person-Entität noch zuhause: Warnung im Tages-Check und in der Jetzt-Ansicht",h_drag_drop:"Nur bei schreibbaren Kalendern; Ziehen verschiebt, unterer Rand ändert die Dauer",h_views:"Welche Umschalter oben erscheinen",h_tasks:"Heute fällige und überfällige Aufgaben erscheinen als Chips. Abhaken bleibt bei deiner To-do-App bzw. der Family Task Card",h_badges:"Kleine Chips unter dem Personenkopf; Klick öffnet Details",h_color:"Leer lassen für Palettenfarbe",h_hidden:"Spalte startet eingeklappt; ein Klick auf den Kopf holt sie zurück",h_driver:"Fahrten wie „Mia abholen“ bekommen einen Fahrer; der Tages-Check warnt, wenn niemand fährt oder der Fahrer belegt ist",h_ride_patterns:"Leer = abholen, bringen, Fahrt, pick up, drop off …",h_birthday_age:"„Geburtstag Oma (1946)“ oder „Max *2019“ wird zu „… (wird 80)“",h_private_patterns:"Text in Titel oder Beschreibung, z. B. „#privat“ – zeigt nur „Privat“ und die Uhrzeit",h_compact:"Kleinere Schriften und engere Abstände in einem Schalter",h_map_url:"{location} wird ersetzt, z. B. https://maps.apple.com/?q={location}",o_person:"Person",o_location:"Ort",o_calendar:"Kalender",o_monday:"Montag",o_sunday:"Sonntag",o_today:"Heute (rollende Woche)",g_views:"🗓️ Ansichten",g_layout:"📐 Layout & Größe",g_filters:"🧹 Filter & Aufräumen",g_looks:"🎨 Aussehen (Feintuning)",g_kiosk:"🖥️ Kiosk & Extras",w_title:"👨‍👩‍👧‍👦 Willkommen beim Familienplan!",w_text:"In zwei Klicks startklar – die Karte erkennt deine Familie automatisch aus den Personen- und Kalender-Entitäten deines Home Assistant.",w_detect:"✨ Schritt 1: Personen automatisch erkennen",w_hint:"Danach optional: Profil wählen (unten) oder Feinheiten in den Gruppen einstellen. Natürlich kannst du Personen auch von Hand anlegen:",w_empty:"＋ Leer starten",p_tablet:"🖥️ Wandtablet",p_tablet_title:"Vollbild, Auto-Fit, Rückkehr zu heute",p_phone:"📱 Handy",p_phone_title:"Agenda als Startansicht, kompakte Spalten",p_reset:"🧩 Standard",p_reset_title:"Layout-Einstellungen zurücksetzen",s_persons:"Personen",s_calendars:"Kalender (Farbe & Label)",s_settings:"Einstellungen",b_add_person:"＋ Person hinzufügen",b_detect:"✨ Automatisch erkennen",b_up:"Nach oben",b_down:"Nach unten",b_remove:"Entfernen",b_auto:"Automatisch",ph_label:"Eigenes Label",ph_icon:"Symbol, z. B. mdi:school",ph_title_field:"Titel aus Feld (z. B. description)",cal_private:"Privat – nur „Privat“ und die Uhrzeit zeigen",person_n:"Person",cal_hint_1:"Farben wirken bei „Einfärben nach: Kalender“, Labels im Termin-Dialog. Symbol = mdi-Icon vor dem Titel. „Titel aus Feld“ nutzt z. B.",cal_hint_2:"statt",cal_hint_3:"als Termin-Titel."},nl:{l_title:"Kaarttitel",l_refresh_interval:"Automatisch vernieuwen (sec., 0 = uit)",l_view:"Standaardweergave",l_views:"Beschikbare weergaves (wisselaar)",l_time_grid:"Tijdraster",l_start_hour:"Startuur",l_end_hour:"Einduur",l_hour_height:"Hoogte per uur",l_hour_width:"Tijdlijn: breedte per uur",l_fit_height:"Auto-fit: pas de dag aan zodat deze zonder scrollen past",l_full_height:"Volledige hoogte: rek uit tot de onderkant van het scherm",l_trim_hours:"Lege randuren automatisch verbergen",l_col_min_width:"Min. kolombreedte per persoon",l_background_hours:"Lange afspraken als achtergrondband tonen vanaf (uur)",l_max_columns:"Max. kolommen per dag",l_first_day:"Week begint op",l_scroll_to_now:"Automatisch scrollen naar nu",l_swipe:"Vegen om te bladeren",l_night_start:"Nachtscherm vanaf",l_night_end:"Nachtscherm tot",l_night_wake_entity:"Wakker worden bij beweging",l_screensaver_media:"Foto-screensaver (mediamap)",l_screensaver_after:"Foto's na (min. zonder aanraking)",l_screensaver_interval:"Seconden per foto",l_day_offset:"Start op (dagen vanaf vandaag)",l_slim_header:"Smalle koptekst",l_color_by:"Kleuren op basis van",l_show_weekends:"Weekend tonen",l_show_now_line:"Nu-lijn",l_dim_past:"Afgelopen afspraken dimmen",l_show_progress:"Voortgangsbalk tonen",l_hide_patterns:"Afspraken verbergen",l_show_patterns:"Toon alleen afspraken met",l_replace_patterns:"Titels vervangen",l_filter_duplicates:"Dubbele afspraken samenvoegen",l_hide_past:"Agenda: verberg voorbije dagen",l_tentative_patterns:"Markeren als voorlopig",l_auto_icons:"Automatische iconen op trefwoord",l_icon_patterns:"Eigen icoonregels",l_show_focus:"“Nu / straks”-balk",l_show_alerts:"Dagcheck (dubbele boekingen, gaten, niemand thuis)",l_gap_min:"Meld een gat vanaf (min., 0 = uit)",l_late_warning:"Waarschuw als nog thuis (min. vooraf, 0 = uit)",l_drag_drop:"Afspraken verplaatsen door te slepen (dagweergave)",l_family_calendars:"Gezinsagenda's",l_countdowns:"Aftellers (countdowns)",l_countdown_days:"Aftellers kijken vooruit",l_weather_entity:"Weer-entiteit",l_show_weather:"Weer tonen",l_hide_empty_persons:"Week: verberg personen zonder afspraken",l_auto_return:"Terug naar startweergave na inactiviteit (min., 0 = uit)",l_event_size:"Tekstgrootte afspraken",l_radius:"Hoekradius van de blokken",l_past_opacity:"Dekking van afgelopen afspraken",l_name:"Weergavenaam",l_person:"Persoon (avatar & status)",l_calendar:"Agenda's (meerdere mogelijk)",l_tasks:"Takenlijsten (openstaande punten verschijnen op het bord)",l_color:"Eigen kleur (hex, optioneel)",l_badges:"Badges (bijv. batterij, sensoren)",l_hidden:"Verborgen bij opstarten",l_driver:"Rijdt (ophalen, wegbrengen)",l_title_prefix:"Alleen afspraken waarvan de titel begint met (optioneel)",l_ride_patterns:"Woorden voor ritten",l_private_patterns:"Privé-afspraken",l_birthday_age:"Verjaardagen met leeftijd",l_compact:"Compacte weergave",l_map_url:"Kaartlink (sjabloon)",h_scroll_to_now:"Dagweergave naar huidige tijd, tijdlijn naar de nu-lijn, agenda naar vandaag",h_swipe:"Touchscreens: veeg naar links of rechts voor de volgende of vorige dag, week of maand",h_night_start:"Wandtablet: een donkere, gedimde klok met de eerstvolgende afspraken; tik om te wekken",h_night_end:"Ochtend: terug naar het normale bord",h_screensaver_media:"Een map uit Media, bijv. media-source://media_source/local/photos – een diavoorstelling met klok na een tijdje zonder aanraking; een tik brengt het bord terug",h_night_wake_entity:"Bewegings- of aanwezigheidssensor: zodra deze “aan” meldt, wordt het bord wakker zoals na een tik",h_day_offset:"0 = vandaag, 1 = morgen, -1 = gisteren. Voor een scherm dat de komende dag moet tonen",h_slim_header:"Weekdagknoppen schuiven naar de navigatieregel en de avatar staat naast de naam – bespaart circa 40 px",h_hide_patterns:"Tekstpatronen, bijv. “Pauze” – overeenkomsten worden verborgen",h_show_patterns:"Allow-list: alleen afspraken waarvan de titel een van de patronen bevat",h_replace_patterns:"bijv. “Mentoruur => Les” (zonder => wordt de tekst verwijderd)",h_tentative_patterns:"Overeenkomsten worden gestippeld / semi-transparant weergegeven",h_filter_duplicates:"Dezelfde afspraak in meerdere agenda's wordt slechts één keer getoond",h_hide_past:"De lijst begint bij vandaag. Terugbladeren naar een eerdere week toont nog steeds alles",h_auto_return:"Kiosk: springt na X minuten zonder aanraking terug naar “vandaag”",h_background_hours:"0 = uit. Lange (bijna) dagvullende afspraken (BSO, opvang …) als subtiele band",h_fit_height:"Comprimeert de dag totdat alles zonder scrollen zichtbaar is",h_full_height:"Voor paneelweergave / wandtablet",h_trim_hours:"Toont alleen de uren waarin daadwerkelijk afspraken staan",h_col_min_width:"Hieronder scrollt het bord horizontaal",h_family_calendars:"Agenda's voor iedereen – feestdagen, afvalkalender, schoolvakanties. Worden boven de personen getoond en tellen nooit als dubbele boeking",h_countdowns:'Nu-weergave: woorden zoals vakantie of verjaardag - passende afspraken verschijnen als "over 12 dagen"-chips',h_countdown_days:"Hoeveel dagen vooruit aftellers worden getoond (standaard 60)",h_weather_entity:"Dagelijkse verwachting in de koptekst (HA-locatie)",h_auto_icons:"bijv. dokter → 🩺, sport → 🏃, verjaardag → 🎂 (titels met emoji blijven ongewijzigd)",h_icon_patterns:"Eigen regels, bijv. “Oma => 👵”",h_show_focus:"Compacte balk boven de weergaves: wat is er nu bezig / wat komt hierna",h_show_alerts:"Chips boven de dag- en tijdlijnweergave: één persoon dubbel geboekt, een onbeheerd gat tussen twee afspraken of iedereen tegelijk van huis",h_gap_min:"Hoe lang een gat tussen twee afspraken van een persoon moet zijn voordat het een waarschuwing waard is",h_late_warning:"Een afspraak met locatie begint bijna en de persoon-entiteit meldt nog thuis: waarschuwing in de dagcheck en nu-weergave",h_drag_drop:"Alleen bij schrijfbare agenda's; sleep om te verplaatsen, onderrand wijzigt de duur",h_views:"Welke wisselaars bovenaan verschijnen",h_tasks:"Openstaande taken voor vandaag – en achterstallige – verschijnen als chips. Afvinken doe je in je taken-app of de Family Task Card",h_badges:"Kleine chips onder de persoonskop; klikken opent details",h_color:"Laat leeg voor de paletkleur",h_hidden:"Kolom start ingeklapt; een klik op de kop haalt hem terug",h_driver:"Ritten zoals “Mia ophalen” krijgen een bestuurder; de dagcheck waarschuwt als niemand rijdt of de bestuurder bezet is",h_ride_patterns:"Leeg = ophalen, brengen, rit, pick up, drop off …",h_birthday_age:"“Verjaardag Oma (1946)” of “Max *2019” wordt “… (wordt 80)”",h_private_patterns:"Tekst in titel of beschrijving, bijv. “#privé” – toont alleen “Privé” en de tijd",h_compact:"Kleinere lettertypes en krappere afstanden met één schakelaar",h_map_url:"{location} wordt vervangen, bijv. https://maps.apple.com/?q={location}",o_person:"Persoon",o_location:"Locatie",o_calendar:"Agenda",o_monday:"Maandag",o_sunday:"Zondag",o_today:"Vandaag (rollende week)",g_views:"🗓 Weergaves",g_layout:"📐 Indeling & grootte",g_filters:"🧹 Filters & opruimen",g_looks:"🎨 Uiterlijk (finetuning)",g_kiosk:"🖥 Kiosk & extra's",w_title:"👨‍👩‍👧‍👦 Welkom bij het gezinsbord!",w_text:"Klaar in twee klikken – de kaart herkent je gezin automatisch op basis van de persoons- en agenda-entiteiten in je Home Assistant.",w_detect:"✨ Stap 1: personen automatisch herkennen",w_hint:"Optioneel daarna: kies een profiel (hieronder) of stel de details in per groep. Natuurlijk kun je personen ook handmatig toevoegen:",w_empty:"＋ Leeg starten",p_tablet:"🖥 Wandtablet",p_tablet_title:"Volledig scherm, auto-fit, terug naar vandaag",p_phone:"📱 Telefoon",p_phone_title:"Agenda als startweergave, compacte kolommen",p_reset:"🧩 Standaard",p_reset_title:"Indelingsinstellingen herstellen",s_persons:"Personen",s_calendars:"Agenda's (kleur & label)",s_settings:"Instellingen",b_add_person:"＋ Persoon toevoegen",b_detect:"✨ Automatisch herkennen",b_up:"Omhoog",b_down:"Omlaag",b_remove:"Verwijderen",b_auto:"Automatisch",ph_label:"Eigen label",ph_icon:"Icoon, bijv. mdi:school",ph_title_field:"Titel uit veld (bijv. description)",cal_private:"Privé – toon alleen “Privé” en de tijd",person_n:"Persoon",cal_hint_1:"Kleuren werken bij “Kleuren op basis van: agenda”, labels in het afspraakvenster. Icoon = mdi-icoon vóór de titel. “Titel uit veld” gebruikt bijv.",cal_hint_2:"in plaats van",cal_hint_3:"als afspraaktitel."},fr:{l_title:"Titre de la carte",l_refresh_interval:"Actualisation auto (sec., 0 = désactivé)",l_view:"Vue par défaut",l_views:"Vues disponibles (sélecteur)",l_time_grid:"Grille horaire",l_start_hour:"Heure de début",l_end_hour:"Heure de fin",l_hour_height:"Hauteur par heure",l_hour_width:"Chronologie : largeur par heure",l_fit_height:"Ajustement auto : compresser la journée pour éviter le défilement",l_full_height:"Pleine hauteur : étirer jusqu'en bas de l'écran",l_trim_hours:"Masquer les heures vides aux extrémités",l_col_min_width:"Largeur min. de colonne par personne",l_background_hours:"Afficher les événements longs en bande de fond dès (h)",l_max_columns:"Colonnes max. par jour",l_first_day:"La semaine commence le",l_scroll_to_now:"Défilement auto vers l'heure actuelle",l_swipe:"Glisser pour changer de page",l_night_start:"Écran de nuit à partir de",l_night_end:"Écran de nuit jusqu'à",l_night_wake_entity:"Réveil par mouvement",l_screensaver_media:"Économiseur d'écran photo (dossier média)",l_screensaver_after:"Photos après (min sans contact)",l_screensaver_interval:"Secondes par photo",l_day_offset:"Commencer à (jours à partir d'aujourd'hui)",l_slim_header:"En-tête compact",l_color_by:"Colorer par",l_show_weekends:"Afficher le week-end",l_show_now_line:"Ligne de l'heure actuelle",l_dim_past:"Estomper les événements passés",l_show_progress:"Afficher la barre de progression",l_hide_patterns:"Masquer les événements",l_show_patterns:"Afficher uniquement les événements contenant",l_replace_patterns:"Remplacer les titres",l_filter_duplicates:"Fusionner les doublons",l_hide_past:"Agenda : masquer les jours passés",l_tentative_patterns:"Marquer comme provisoire",l_auto_icons:"Icônes auto par mot-clé",l_icon_patterns:"Règles d'icônes personnalisées",l_show_focus:"Barre « En cours / à suivre »",l_show_alerts:"Bilan du jour (doublons, creux, personne à la maison)",l_gap_min:"Signaler un creux dès (min, 0 = désactivé)",l_late_warning:"Avertir si encore à la maison (min avant, 0 = désactivé)",l_drag_drop:"Déplacer les événements par glisser-déposer (vue jour)",l_family_calendars:"Calendriers familiaux",l_countdowns:"Comptes à rebours",l_countdown_days:"Horizon des comptes à rebours",l_weather_entity:"Entité météo",l_show_weather:"Afficher la météo",l_hide_empty_persons:"Semaine : masquer les personnes sans événement",l_auto_return:"Retour à la vue initiale après inactivité (min, 0 = désactivé)",l_event_size:"Taille de police des événements",l_radius:"Rayon des coins des blocs",l_past_opacity:"Opacité des événements passés",l_name:"Nom d'affichage",l_person:"Personne (avatar et statut)",l_calendar:"Calendriers (plusieurs possibles)",l_tasks:"Listes de tâches (les échéances apparaissent sur le tableau)",l_color:"Couleur personnalisée (hex, optionnel)",l_badges:"Badges (ex. batterie, capteurs)",l_hidden:"Masqué au démarrage",l_driver:"Conduit (chercher, déposer)",l_title_prefix:"Uniquement les événements dont le titre commence par (optionnel)",l_ride_patterns:"Mots pour les trajets",l_private_patterns:"Événements privés",l_birthday_age:"Anniversaires avec âge",l_compact:"Disposition compacte",l_map_url:"Lien de carte (modèle)",h_scroll_to_now:"Vue jour sur l'heure actuelle, chronologie sur la ligne actuelle, agenda sur aujourd'hui",h_swipe:"Écrans tactiles : glisser à gauche ou à droite pour le jour, la semaine ou le mois suivant/précédent",h_night_start:"Tablette murale : horloge sombre et tamisée avec les prochains événements ; toucher réveille le tableau",h_night_end:"Matin : retour au tableau normal",h_screensaver_media:"Un dossier de Média, ex. media-source://media_source/local/photos – diaporama avec horloge après un temps sans contact ; toucher ramène le tableau",h_night_wake_entity:"Capteur de mouvement ou présence : lorsqu'il passe à « on », le tableau se réveille comme après un appui",h_day_offset:"0 = aujourd'hui, 1 = demain, -1 = hier. Pour un écran devant afficher le jour suivant",h_slim_header:"Les boutons des jours remontent sur la ligne de navigation et l'avatar se place à côté du nom – économise environ 40 px",h_hide_patterns:"Motifs de texte, ex. « Récréation » – les correspondances sont masquées",h_show_patterns:"Liste blanche : uniquement les événements dont le titre contient l'un des motifs",h_replace_patterns:"ex. « Vie de classe => Cours » (sans => le texte est supprimé)",h_tentative_patterns:"Les correspondances sont affichées en pointillés / translucides",h_filter_duplicates:"Un même événement présent dans plusieurs calendriers n'est affiché qu'une fois",h_hide_past:"La liste commence aujourd'hui. Revenir à une semaine précédente affiche toujours tout",h_auto_return:"Kiosque : revient à « aujourd'hui » après X minutes sans contact",h_background_hours:"0 = désactivé. Événements longs (garderie…) affichés en bande discrète",h_fit_height:"Compresse la journée jusqu'à ce que tout soit visible sans défiler",h_full_height:"Pour vue panneau / tablette murale",h_trim_hours:"Affiche uniquement les heures contenant réellement des événements",h_col_min_width:"En dessous de cette valeur, le tableau défile horizontalement",h_family_calendars:"Calendriers pour tous – jours fériés, poubelles, vacances scolaires. Affichés au-dessus des personnes, jamais comptés comme doublons",h_countdowns:'Vue actuelle : mots comme vacances ou anniversaire - les événements correspondants s\'affichent en puces "dans 12 jours"',h_countdown_days:"Nombre de jours à l'avance pour l'affichage des comptes à rebours (défaut 60)",h_weather_entity:"Prévisions du jour dans l'en-tête (emplacement HA)",h_auto_icons:"ex. médecin → 🩺, sport → 🏃, anniversaire → 🎂 (les titres avec emoji restent intacts)",h_icon_patterns:"Règles perso, ex. « Mamie => 👵 »",h_show_focus:"Barre compacte au-dessus des vues : ce qui est en cours / ce qui suit",h_show_alerts:"Puces au-dessus des vues jour et chronologie : personne réservée deux fois, créneau sans surveillance entre deux événements, ou tout le monde absent en même temps",h_gap_min:"Durée minimale d'un creux entre deux événements d'une personne avant de déclencher une alerte",h_late_warning:"Un événement avec lieu commence bientôt et l'entité personne indique toujours à la maison : alerte dans le bilan du jour et la vue actuelle",h_drag_drop:"Calendriers modifiables uniquement ; glisser pour déplacer, bord inférieur pour changer la durée",h_views:"Quels sélecteurs apparaissent en haut",h_tasks:"Les tâches ouvertes dues aujourd'hui – et en retard – s'affichent en puces. Les cocher se fait dans votre application todo ou la Family Task Card",h_badges:"Petites puces sous l'en-tête de la personne ; cliquer ouvre les détails",h_color:"Laisser vide pour utiliser la couleur de la palette",h_hidden:"La colonne démarre réduite ; un clic sur l'en-tête la rétablit",h_driver:"Les trajets comme « chercher Mia » reçoivent un conducteur ; le bilan du jour avertit si personne ne conduit ou si le conducteur est occupé",h_ride_patterns:"Vide = chercher, déposer, trajet, pick up, drop off …",h_birthday_age:"« Anniversaire Mamie (1946) » ou « Max *2019 » s'affiche « … (aura 80 ans) »",h_private_patterns:"Texte dans le titre ou la description, ex. « #privé » – affiche uniquement « Privé » et l'heure",h_compact:"Polices plus petites et espacements réduits en un seul bouton",h_map_url:"{location} est remplacé, ex. https://maps.apple.com/?q={location}",o_person:"Personne",o_location:"Lieu",o_calendar:"Calendrier",o_monday:"Lundi",o_sunday:"Dimanche",o_today:"Aujourd'hui (semaine glissante)",g_views:"🗓 Vues",g_layout:"📐 Disposition et taille",g_filters:"🧹 Filtres et nettoyage",g_looks:"🎨 Apparence (réglages fins)",g_kiosk:"🖥 Kiosque et extras",w_title:"👨‍👩‍👧‍👦 Bienvenue sur le tableau familial !",w_text:"Prêt en deux clics – la carte détecte automatiquement votre famille à partir des entités personne et calendrier de votre Home Assistant.",w_detect:"✨ Étape 1 : détecter les personnes automatiquement",w_hint:"Ensuite, en option : choisissez un profil (ci-dessous) ou affinez les réglages dans les groupes. Vous pouvez aussi ajouter des personnes manuellement :",w_empty:"＋ Démarrer à vide",p_tablet:"🖥 Tablette murale",p_tablet_title:"Plein écran, ajustement auto, retour à aujourd'hui",p_phone:"📱 Téléphone",p_phone_title:"Agenda comme vue de départ, colonnes compactes",p_reset:"🧩 Défaut",p_reset_title:"Réinitialiser les paramètres de disposition",s_persons:"Personnes",s_calendars:"Calendriers (couleur et libellé)",s_settings:"Paramètres",b_add_person:"＋ Ajouter une personne",b_detect:"✨ Détecter automatiquement",b_up:"Monter",b_down:"Descendre",b_remove:"Supprimer",b_auto:"Automatique",ph_label:"Libellé personnalisé",ph_icon:"Icône, ex. mdi:school",ph_title_field:"Titre depuis le champ (ex. description)",cal_private:"Privé – afficher uniquement « Privé » et l'heure",person_n:"Personne",cal_hint_1:"Les couleurs s'appliquent avec « Colorer par : calendrier », les libellés dans la boîte de dialogue. Icône = icône mdi devant le titre. « Titre depuis le champ » utilise ex.",cal_hint_2:"au lieu de",cal_hint_3:"comme titre d'événement."},es:{l_title:"Título de la tarjeta",l_refresh_interval:"Actualización automática (seg., 0 = desactivado)",l_view:"Vista predeterminada",l_views:"Vistas disponibles (selector)",l_time_grid:"Cuadrícula de tiempo",l_start_hour:"Hora de inicio",l_end_hour:"Hora de fin",l_hour_height:"Altura por hora",l_hour_width:"Línea de tiempo: ancho por hora",l_fit_height:"Autoajuste: comprimir el día para que quepa sin desplazar",l_full_height:"Altura completa: estirar hasta el borde inferior de la pantalla",l_trim_hours:"Ocultar horas vacías en los extremos",l_col_min_width:"Ancho mín. de columna por persona",l_background_hours:"Mostrar eventos largos como banda de fondo desde (h)",l_max_columns:"Máx. de columnas por día",l_first_day:"La semana empieza el",l_scroll_to_now:"Desplazamiento automático a ahora",l_swipe:"Deslizar para pasar página",l_night_start:"Pantalla nocturna desde",l_night_end:"Pantalla nocturna hasta",l_night_wake_entity:"Despertar con movimiento",l_screensaver_media:"Salvapantallas de fotos (carpeta multimedia)",l_screensaver_after:"Fotos tras (min sin tocar)",l_screensaver_interval:"Segundos por foto",l_day_offset:"Empezar en (días desde hoy)",l_slim_header:"Encabezado compacto",l_color_by:"Colorear por",l_show_weekends:"Mostrar fin de semana",l_show_now_line:"Línea de hora actual",l_dim_past:"Atenuar eventos pasados",l_show_progress:"Mostrar barra de progreso",l_hide_patterns:"Ocultar eventos",l_show_patterns:"Mostrar solo eventos que coincidan con",l_replace_patterns:"Reemplazar títulos",l_filter_duplicates:"Combinar eventos duplicados",l_hide_past:"Agenda: ocultar días pasados",l_tentative_patterns:"Marcar como provisional",l_auto_icons:"Iconos automáticos por palabra clave",l_icon_patterns:"Reglas de iconos personalizadas",l_show_focus:"Barra «Ahora / próximo»",l_show_alerts:"Revisión del día (dobles reservas, huecos, nadie en casa)",l_gap_min:"Marcar un hueco desde (min, 0 = desactivado)",l_late_warning:"Avisar si sigue en casa (min antes, 0 = desactivado)",l_drag_drop:"Mover eventos arrastrando (vista diaria)",l_family_calendars:"Calendarios familiares",l_countdowns:"Cuentas atrás",l_countdown_days:"Días de antelación en cuentas atrás",l_weather_entity:"Entidad meteorológica",l_show_weather:"Mostrar el tiempo",l_hide_empty_persons:"Semana: ocultar personas sin eventos",l_auto_return:"Volver a la vista inicial tras inactividad (min, 0 = desactivado)",l_event_size:"Tamaño de fuente de eventos",l_radius:"Radio de las esquinas de los bloques",l_past_opacity:"Opacidad de eventos pasados",l_name:"Nombre para mostrar",l_person:"Persona (avatar y estado)",l_calendar:"Calendarios (varios posibles)",l_tasks:"Listas de tareas (las pendientes aparecen en el panel)",l_color:"Color personalizado (hex, opcional)",l_badges:"Insignias (p. ej., batería, sensores)",l_hidden:"Oculto al iniciar",l_driver:"Conduce (recogidas, llevadas)",l_title_prefix:"Solo eventos cuyo título empieza por (opcional)",l_ride_patterns:"Palabras para trayectos",l_private_patterns:"Eventos privados",l_birthday_age:"Cumpleaños con edad",l_compact:"Diseño compacto",l_map_url:"Enlace de mapa (plantilla)",h_scroll_to_now:"Vista diaria a la hora actual, línea de tiempo a la línea actual, agenda a hoy",h_swipe:"Pantallas táctiles: desliza a izquierda o derecha para el día, semana o mes siguiente o anterior",h_night_start:"Tablet de pared: reloj oscuro y atenuado con los próximos eventos; un toque despierta el panel",h_night_end:"Mañana: vuelta al panel normal",h_screensaver_media:"Una carpeta de Medios, p. ej., media-source://media_source/local/photos – presentación con reloj tras un tiempo sin tocar; un toque devuelve el panel",h_night_wake_entity:"Sensor de movimiento o presencia: cuando reporta «on», el panel se despierta como tras un toque",h_day_offset:"0 = hoy, 1 = mañana, -1 = ayer. Para una pantalla que deba mostrar el día siguiente",h_slim_header:"Los botones de días suben a la barra de navegación y el avatar se sitúa junto al nombre – ahorra unos 40 px",h_hide_patterns:"Patrones de texto, p. ej., «Recreo» – las coincidencias se ocultan",h_show_patterns:"Lista permitida: solo eventos cuyo título contenga uno de los patrones",h_replace_patterns:"p. ej., «Tutoría => Clase» (sin => el texto se elimina)",h_tentative_patterns:"Las coincidencias se dibujan con línea discontinua / translúcidas",h_filter_duplicates:"El mismo evento en varios calendarios se muestra solo una vez",h_hide_past:"La lista empieza hoy. Al retroceder a una semana anterior se sigue mostrando todo",h_auto_return:"Quiosco: vuelve a «hoy» tras X minutos sin tocar la pantalla",h_background_hours:"0 = desactivado. Eventos largos (comedor, extraescolares…) como una banda sutil",h_fit_height:"Comprime el día hasta que todo sea visible sin desplazarse",h_full_height:"Para vista de panel / tablet de pared",h_trim_hours:"Muestra solo las horas que realmente contienen eventos",h_col_min_width:"Por debajo de este valor, el panel se desplaza horizontalmente",h_family_calendars:"Calendarios para todos – festivos, recogida de basura, vacaciones escolares. Se muestran sobre las personas y nunca cuentan como doble reserva",h_countdowns:'Vista actual: palabras como vacaciones o cumpleaños - los eventos coincidentes se muestran como etiquetas "en 12 días"',h_countdown_days:"Cuántos días hacia adelante se muestran las cuentas atrás (por defecto 60)",h_weather_entity:"Pronóstico diario en el encabezado (ubicación de HA)",h_auto_icons:"p. ej., médico → 🩺, deporte → 🏃, cumpleaños → 🎂 (los títulos con emoji no se modifican)",h_icon_patterns:"Reglas propias, p. ej., «Abuela => 👵»",h_show_focus:"Barra compacta sobre las vistas: qué está en curso / qué viene después",h_show_alerts:"Etiquetas sobre las vistas de día y línea de tiempo: una persona con doble reserva, un hueco sin supervisar entre dos eventos o todos fuera a la vez",h_gap_min:"Cuánto debe durar un hueco entre dos eventos de una persona para que merezca una advertencia",h_late_warning:"Un evento con ubicación empieza pronto y la entidad de la persona aún indica en casa: aviso en la revisión del día y en la vista actual",h_drag_drop:"Solo calendarios editables; arrastrar para mover, el borde inferior cambia la duración",h_views:"Qué selectores aparecen en la parte superior",h_tasks:"Las tareas pendientes para hoy – y las atrasadas – aparecen como etiquetas. Marcarlas como completadas se hace en tu app de tareas o en la Family Task Card",h_badges:"Pequeñas etiquetas bajo el encabezado de la persona; al hacer clic se abren los detalles",h_color:"Dejar vacío para usar el color de la paleta",h_hidden:"La columna inicia plegada; un clic en el encabezado la vuelve a mostrar",h_driver:"Trayectos como «recoger a Mia» reciben un conductor; la revisión del día avisa si nadie conduce o si el conductor está ocupado",h_ride_patterns:"Vacío = recoger, llevar, trayecto, pick up, drop off …",h_birthday_age:"«Cumpleaños de la abuela (1946)» o «Max *2019» se muestra como «… (cumple 80)»",h_private_patterns:"Texto en el título o descripción, p. ej., «#privado» – muestra solo «Privado» y la hora",h_compact:"Fuentes más pequeñas y espaciado más ajustado con un solo interruptor",h_map_url:"Se sustituye {location}, p. ej., https://maps.apple.com/?q={location}",o_person:"Persona",o_location:"Ubicación",o_calendar:"Calendario",o_monday:"Lunes",o_sunday:"Domingo",o_today:"Hoy (semana continua)",g_views:"🗓 Vistas",g_layout:"📐 Diseño y tamaño",g_filters:"🧹 Filtros y limpieza",g_looks:"🎨 Apariencia (ajustes finos)",g_kiosk:"🖥 Quiosco y extras",w_title:"👨‍👩‍👧‍👦 ¡Bienvenido al panel familiar!",w_text:"Listo en dos clics – la tarjeta detecta a tu familia automáticamente a partir de las entidades de persona y calendario de tu Home Assistant.",w_detect:"✨ Paso 1: detectar personas automáticamente",w_hint:"Opcionalmente después: elige un perfil (abajo) o ajusta los detalles en los grupos. Por supuesto, también puedes añadir personas manualmente:",w_empty:"＋ Empezar vacío",p_tablet:"🖥 Tablet de pared",p_tablet_title:"Pantalla completa, autoajuste, volver a hoy",p_phone:"📱 Teléfono",p_phone_title:"Agenda como vista inicial, columnas compactas",p_reset:"🧩 Predeterminado",p_reset_title:"Restablecer los ajustes de diseño",s_persons:"Personas",s_calendars:"Calendarios (color y etiqueta)",s_settings:"Ajustes",b_add_person:"＋ Añadir persona",b_detect:"✨ Detectar automáticamente",b_up:"Subir",b_down:"Bajar",b_remove:"Eliminar",b_auto:"Automático",ph_label:"Etiqueta personalizada",ph_icon:"Icono, p. ej., mdi:school",ph_title_field:"Título desde campo (p. ej., description)",cal_private:"Privado – mostrar solo «Privado» y la hora",person_n:"Persona",cal_hint_1:"Los colores se aplican con «Colorear por: calendario», las etiquetas en el diálogo del evento. Icono = icono mdi delante del título. «Título desde campo» usa p. ej.",cal_hint_2:"en lugar de",cal_hint_3:"como título del evento."}};function et(e,t){return Qe[e]?.[t]??Ze[t]??t}const tt=["now","day","timeline","week","month","agenda"],at=["day","timeline","week","month","agenda"],it=[{name:"name",selector:{text:{}}},{name:"person",selector:{entity:{filter:{domain:"person"}}}},{name:"calendar",selector:{entity:{filter:{domain:"calendar"},multiple:!0}}},{name:"title_prefix",selector:{text:{}}},{name:"badges",selector:{entity:{multiple:!0}}},{name:"color",selector:{text:{}}},{name:"hidden",selector:{boolean:{}}},{name:"driver",selector:{boolean:{}}}],st={name:"tasks",selector:{entity:{filter:{domain:"todo"},multiple:!0}}},rt=(e,t,a)=>({name:"",type:"expandable",title:e,icon:t,schema:a});class nt extends oe{constructor(){super(...arguments),this._t=e=>et(this._lang,e),this._label=e=>{const t=`l_${e.name}`,a=et(this._lang,t);return a===t?e.name:a},this._helper=e=>{const t=`h_${e.name}`,a=et(this._lang,t);return a===t?void 0:a}}setConfig(e){this._config=e}get _persons(){return Array.isArray(this._config.persons)?this._config.persons:[]}get _lang(){return ze(this.hass)}_personSchema(){const e=Object.keys(this.hass?.states??{}).some(e=>e.startsWith("todo."));return e?[...it,st]:it}_viewOptions(){return tt.map(e=>({value:e,label:Se(this.hass,e)}))}get _isFresh(){return!this._persons.some(e=>e.name||e.person||e.calendar)}get _settingsData(){return{...this._config,time_grid:String(this._config.time_grid??30)}}_schema(){const e=this._config,t=Array.isArray(e.views)&&e.views.length?e.views:at,a=t.includes("day"),i=t.includes("timeline"),s=t.includes("week"),r=[];(a||i)&&r.push({name:"start_hour",selector:{number:{min:0,max:23,mode:"box"}}},{name:"end_hour",selector:{number:{min:1,max:24,mode:"box"}}},{name:"trim_hours",selector:{boolean:{}}}),a&&r.push({name:"hour_height",selector:{number:{min:40,max:96,step:4,mode:"slider",unit_of_measurement:"px"}}},{name:"fit_height",selector:{boolean:{}}},{name:"col_min_width",selector:{number:{min:60,max:400,step:10,mode:"slider",unit_of_measurement:"px"}}},{name:"max_columns",selector:{number:{min:1,max:8,step:1,mode:"slider"}}},{name:"background_hours",selector:{number:{min:0,max:12,step:1,mode:"slider",unit_of_measurement:"h"}}}),i&&r.push({name:"hour_width",selector:{number:{min:48,max:240,step:8,mode:"slider",unit_of_measurement:"px"}}}),r.push({name:"slim_header",selector:{boolean:{}}},{name:"full_height",selector:{boolean:{}}});const n=[{name:"auto_return",selector:{number:{min:0,max:60,step:1,mode:"box",unit_of_measurement:"min"}}},{name:"scroll_to_now",selector:{boolean:{}}},{name:"swipe",selector:{boolean:{}}},{name:"night_start",selector:{time:{}}},{name:"night_end",selector:{time:{}}},{name:"screensaver_media",selector:{text:{}}},...e.screensaver_media?[{name:"screensaver_after",selector:{number:{min:1,max:120,step:1,mode:"slider",unit_of_measurement:"min"}}},{name:"screensaver_interval",selector:{number:{min:5,max:300,step:5,mode:"slider",unit_of_measurement:"s"}}}]:[],...e.night_start?[{name:"night_wake_entity",selector:{entity:{filter:{domain:["binary_sensor","input_boolean"]},multiple:!0}}}]:[],{name:"show_now_line",selector:{boolean:{}}},{name:"show_progress",selector:{boolean:{}}},{name:"family_calendars",selector:{entity:{filter:{domain:"calendar"},multiple:!0}}},...t.includes("now")?[{name:"countdowns",selector:{text:{multiple:!0}}}]:[],...t.includes("now")&&(e.countdowns?.length??0)>0?[{name:"countdown_days",selector:{number:{min:1,max:366,mode:"box",unit_of_measurement:"d"}}}]:[],{name:"weather_entity",selector:{entity:{filter:{domain:"weather"}}}},{name:"map_url",selector:{text:{}}}];return e.weather_entity&&n.push({name:"show_weather",selector:{boolean:{}}}),n.push({name:"refresh_interval",selector:{number:{min:0,max:3600,mode:"box",unit_of_measurement:"s"}}}),[{name:"title",selector:{text:{}}},rt(this._t("g_views"),"mdi:calendar-multiselect",[{name:"view",selector:{select:{mode:"dropdown",options:this._viewOptions()}}},{name:"views",selector:{select:{multiple:!0,options:this._viewOptions()}}},{name:"time_grid",selector:{select:{mode:"dropdown",options:[{value:"60",label:"60 min"},{value:"30",label:"30 min"},{value:"15",label:"15 min"}]}}},{name:"first_day",selector:{select:{mode:"dropdown",options:[{value:"monday",label:this._t("o_monday")},{value:"sunday",label:this._t("o_sunday")},{value:"today",label:this._t("o_today")}]}}},{name:"show_weekends",selector:{boolean:{}}},{name:"day_offset",selector:{number:{min:-14,max:14,step:1,mode:"box",unit_of_measurement:"d"}}}]),rt(this._t("g_layout"),"mdi:resize",r),rt(this._t("g_filters"),"mdi:broom",[{name:"hide_patterns",selector:{text:{multiple:!0}}},{name:"show_patterns",selector:{text:{multiple:!0}}},{name:"replace_patterns",selector:{text:{multiple:!0}}},{name:"filter_duplicates",selector:{boolean:{}}},...t.includes("agenda")?[{name:"hide_past",selector:{boolean:{}}}]:[],{name:"tentative_patterns",selector:{text:{multiple:!0}}},{name:"birthday_age",selector:{boolean:{}}},{name:"private_patterns",selector:{text:{multiple:!0}}},{name:"ride_patterns",selector:{text:{multiple:!0}}},...s?[{name:"hide_empty_persons",selector:{boolean:{}}}]:[]]),rt(this._t("g_looks"),"mdi:palette",[{name:"show_focus",selector:{boolean:{}}},{name:"show_alerts",selector:{boolean:{}}},{name:"late_warning",selector:{number:{min:0,max:120,step:5,mode:"slider",unit_of_measurement:"min"}}},...e.show_alerts?[{name:"gap_min",selector:{number:{min:0,max:240,step:15,mode:"slider",unit_of_measurement:"min"}}}]:[],{name:"drag_drop",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}},{name:"auto_icons",selector:{boolean:{}}},...e.auto_icons?[{name:"icon_patterns",selector:{text:{multiple:!0}}}]:[],{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"person",label:this._t("o_person")},{value:"location",label:this._t("o_location")},{value:"calendar",label:this._t("o_calendar")}]}}},{name:"dim_past",selector:{boolean:{}}},{name:"event_size",selector:{number:{min:9,max:16,step:.5,mode:"slider",unit_of_measurement:"px"}}},{name:"radius",selector:{number:{min:0,max:18,step:1,mode:"slider",unit_of_measurement:"px"}}},{name:"past_opacity",selector:{number:{min:10,max:100,step:5,mode:"slider",unit_of_measurement:"%"}}}]),rt(this._t("g_kiosk"),"mdi:tablet-dashboard",n)]}_emit(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_settingsChanged(e){e.stopPropagation();const t={...e.detail.value};"string"==typeof t.time_grid&&(t.time_grid=Number(t.time_grid)),this._emit({...this._config,...t,persons:this._persons,...this._config.calendars?{calendars:this._config.calendars}:{}})}_applyPreset(e){const t={...this._config,persons:this._persons},a=e=>e.forEach(e=>delete t[e]);"tablet"===e?Object.assign(t,{view:"day",full_height:!0,fit_height:!0,trim_hours:!0,scroll_to_now:!0,swipe:!0,auto_return:5}):"phone"===e?(Object.assign(t,{view:"agenda",col_min_width:96,swipe:!0}),a(["full_height","fit_height","auto_return"])):(a(["full_height","fit_height","trim_hours","auto_return","col_min_width","hour_height","hour_width","max_columns","background_hours","event_size","radius","past_opacity"]),t.view="day"),this._emit(t)}_personChanged(e,t){t.stopPropagation();const a={...t.detail.value};a.color||delete a.color,Array.isArray(a.badges)&&0===a.badges.length&&delete a.badges,a.hidden||delete a.hidden,a.driver||delete a.driver,Array.isArray(a.calendar)&&(0===a.calendar.length?delete a.calendar:1===a.calendar.length&&(a.calendar=a.calendar[0]));const i=this._persons.map((t,i)=>i===e?a:t);this._emit({...this._config,persons:i})}_personData(e){const t=Array.isArray(e.calendar)?e.calendar:e.calendar?[e.calendar]:[];return{...e,calendar:t}}_setPersonColor(e,t){const a=this._persons.map((a,i)=>{if(i!==e)return a;const s={...a};return t?s.color=t:delete s.color,s});this._emit({...this._config,persons:a})}_addPerson(){const e=[...this._persons,{name:"",person:"",calendar:""}];this._emit({...this._config,persons:e})}_autoDetect(){const e=Ye(this.hass);if(0===e.length)return;const t=new Set(this._persons.map(e=>e.person).filter(Boolean)),a=[...this._persons.filter(e=>e.name||e.person||e.calendar)];for(const i of e)t.has(i.person)||a.push(i);this._emit({...this._config,persons:a})}_removePerson(e){const t=this._persons.filter((t,a)=>a!==e);this._emit({...this._config,persons:t})}_movePerson(e,t){const a=[...this._persons],i=e+t;i<0||i>=a.length||([a[e],a[i]]=[a[i],a[e]],this._emit({...this._config,persons:a}))}_calsUsed(){const e=[];for(const t of this._persons){const a=Array.isArray(t.calendar)?t.calendar:t.calendar?[t.calendar]:[];for(const t of a)t&&!e.includes(t)&&e.push(t)}return e}_setCalMeta(e,t){const a={...this._config.calendars??{}},i={...a[e]??{}};void 0!==t.private&&(t.private?i.private=!0:delete i.private);for(const e of["color","label","icon","title_field"]){const a=t[e];void 0!==a&&(a?i[e]=a:delete i[e])}0===Object.keys(i).length?delete a[e]:a[e]=i;const s={...this._config,persons:this._persons};0===Object.keys(a).length?delete s.calendars:s.calendars=a,this._emit(s)}_calName(e){return this.hass.states[e]?.attributes?.friendly_name||e}_swatches(e,t){return U`
      <div class="swatches">
        ${Le.map(a=>U`
            <button
              class="swatch ${e?.toLowerCase()===a?"on":""}"
              style="background:${a}"
              title=${a}
              @click=${()=>t(a)}
            ></button>
          `)}
        <button
          class="swatch none ${e?"":"on"}"
          title=${this._t("b_auto")}
          @click=${()=>t()}
        >
          A
        </button>
      </div>
    `}render(){if(!this._config)return W;if(this._isFresh)return U`
        <div class="wizard">
          <div class="wtitle">${this._t("w_title")}</div>
          <div class="wtext">${this._t("w_text")}</div>
          <button class="wbtn primary" @click=${this._autoDetect}>${this._t("w_detect")}</button>
          <div class="wtext small">${this._t("w_hint")}</div>
          <button class="wbtn" @click=${this._addPerson}>${this._t("w_empty")}</button>
        </div>
      `;const e=this._persons,t=this._calsUsed();return U`
      <div class="presets">
        <button title=${this._t("p_tablet_title")} @click=${()=>this._applyPreset("tablet")}>
          ${this._t("p_tablet")}
        </button>
        <button title=${this._t("p_phone_title")} @click=${()=>this._applyPreset("phone")}>
          ${this._t("p_phone")}
        </button>
        <button title=${this._t("p_reset_title")} @click=${()=>this._applyPreset("reset")}>
          ${this._t("p_reset")}
        </button>
      </div>

      <div class="section-title">${this._t("s_persons")}</div>
      <div class="persons">
        ${e.map((t,a)=>U`
            <div class="person">
              <div class="person-head">
                <span
                  class="pdot"
                  style="background:${t.color||Le[a%Le.length]}"
                ></span>
                <span class="pidx">${t.name||`${this._t("person_n")} ${a+1}`}</span>
                <div class="ptools">
                  <button
                    class="icon"
                    title=${this._t("b_up")}
                    ?disabled=${0===a}
                    @click=${()=>this._movePerson(a,-1)}
                  >
                    ↑
                  </button>
                  <button
                    class="icon"
                    title=${this._t("b_down")}
                    ?disabled=${a===e.length-1}
                    @click=${()=>this._movePerson(a,1)}
                  >
                    ↓
                  </button>
                  <button
                    class="icon danger"
                    title=${this._t("b_remove")}
                    @click=${()=>this._removePerson(a)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              ${this._swatches(t.color,e=>this._setPersonColor(a,e))}
              <ha-form
                .hass=${this.hass}
                .data=${this._personData(t)}
                .schema=${this._personSchema()}
                .computeLabel=${this._label}
                .computeHelper=${this._helper}
                @value-changed=${e=>this._personChanged(a,e)}
              ></ha-form>
            </div>
          `)}
        <div class="addrow">
          <button class="add" @click=${this._addPerson}>${this._t("b_add_person")}</button>
          <button class="add detect" @click=${this._autoDetect}>${this._t("b_detect")}</button>
        </div>
      </div>

      ${t.length>1||this._config.calendars?U`
              <div class="section-title">${this._t("s_calendars")}</div>
              <div class="cals">
                ${t.map(e=>{const t=this._config.calendars?.[e]??{};return U`
                    <div class="cal">
                      <div class="cal-head">
                        <span
                          class="pdot"
                          style="background:${t.color||"var(--divider-color)"}"
                        ></span>
                        <span class="cal-name" title=${e}>${this._calName(e)}</span>
                        <input
                          class="cal-label"
                          type="text"
                          placeholder=${this._t("ph_label")}
                          .value=${t.label??""}
                          @change=${t=>this._setCalMeta(e,{label:t.target.value||null})}
                        />
                      </div>
                      ${this._swatches(t.color,t=>this._setCalMeta(e,{color:t??null}))}
                      <div class="cal-extra">
                        <input
                          type="text"
                          placeholder=${this._t("ph_icon")}
                          .value=${t.icon??""}
                          @change=${t=>this._setCalMeta(e,{icon:t.target.value||null})}
                        />
                        <input
                          type="text"
                          placeholder=${this._t("ph_title_field")}
                          .value=${t.title_field??""}
                          @change=${t=>this._setCalMeta(e,{title_field:t.target.value||null})}
                        />
                      </div>
                      <label class="cal-private">
                        <input
                          type="checkbox"
                          .checked=${!0===t.private}
                          @change=${t=>this._setCalMeta(e,{private:t.target.checked})}
                        />
                        ${this._t("cal_private")}
                      </label>
                    </div>
                  `})}
                <div class="hint">
                  ${this._t("cal_hint_1")} <code>description</code> ${this._t("cal_hint_2")}
                  <code>summary</code> ${this._t("cal_hint_3")}
                </div>
              </div>
            `:W}

      <div class="section-title">${this._t("s_settings")}</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._settingsData}
        .schema=${this._schema()}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `}}nt.styles=n`
    .wizard {
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }
    .wtitle {
      font-size: 17px;
      font-weight: 700;
    }
    .wtext {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.5;
    }
    .wtext.small {
      font-size: 12px;
    }
    .wbtn {
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 10px;
      padding: 12px;
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 600;
    }
    .wbtn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
    }
    .presets {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
    }
    .presets button {
      flex: 1;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 8px 10px;
      cursor: pointer;
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
    }
    .presets button:hover {
      border-color: var(--primary-color);
    }
    .section-title {
      font-weight: 600;
      font-size: 14px;
      margin: 14px 2px 8px;
    }
    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      line-height: 1.4;
      padding: 2px 2px 0;
    }
    .persons,
    .cals {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .person,
    .cal {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 8px 10px 6px;
    }
    .person-head,
    .cal-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .pdot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex: 0 0 12px;
    }
    .pidx {
      font-weight: 600;
      font-size: 13px;
      flex: 1;
    }
    .cal-name {
      font-weight: 600;
      font-size: 12.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cal-private {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      font-size: 13px;
    }
    .cal-extra {
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }
    .cal-extra input {
      flex: 1;
      min-width: 0;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      padding: 4px 8px;
    }
    .cal-label {
      margin-left: auto;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      padding: 4px 8px;
      width: 130px;
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
    .swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin: 2px 0 6px;
    }
    .swatch {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
    }
    .swatch.on {
      border-color: var(--primary-text-color);
      box-shadow: 0 0 0 2px var(--card-background-color, #fff) inset;
    }
    .swatch.none {
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
    }
    .addrow {
      display: flex;
      gap: 8px;
    }
    .addrow .add {
      flex: 1;
    }
    .add.detect {
      border-style: solid;
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
  `,e([he({attribute:!1})],nt.prototype,"hass",void 0),e([pe()],nt.prototype,"_config",void 0),customElements.define("ha-family-board-card-editor",nt);var ot=Object.freeze({__proto__:null,FamilyBoardCardEditor:nt});export{Le as FALLBACK_COLORS,Xe as FamilyBoardCard,Ye as autoDetectPersons};
