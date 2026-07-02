function e(e,t,i,r){var s,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,i,n):s(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let a=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new a(i,e,r)},o=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,r))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,_=g.trustedTypes,f=_?_.emptyScript:"",m=g.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!l(e,t),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);void 0!==r&&d(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:s}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){const a=r?.call(this);s?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,r)=>{if(i)e.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of r){const r=document.createElement("style"),s=t.litNonce;void 0!==s&&r.setAttribute("nonce",s),r.textContent=i.cssText,e.appendChild(r)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(void 0!==r&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,r=i._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=i.getPropertyOptions(r),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=r;const a=s.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,i,r=!1,s){if(void 0!==e){const a=this.constructor;if(!1===r&&(s=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??b)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:s},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==s||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,i,r)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,m?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,D=$.trustedTypes,A=D?D.createPolicy("lit-html",{createHTML:e=>e}):void 0,M="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+T,S=`<${E}>`,C=document,z=()=>C.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,O=Array.isArray,F="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,U=/>/g,I=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,B=/"/g,L=/^(?:script|style|textarea|title)$/i,j=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),W=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),q=new WeakMap,V=C.createTreeWalker(C,129);function J(e,t){if(!O(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const Y=(e,t)=>{const i=e.length-1,r=[];let s,a=2===t?"<svg>":3===t?"<math>":"",n=N;for(let t=0;t<i;t++){const i=e[t];let o,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===N?"!--"===l[1]?n=R:void 0!==l[1]?n=U:void 0!==l[2]?(L.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=I):void 0!==l[3]&&(n=I):n===I?">"===l[0]?(n=s??N,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,o=l[1],n=void 0===l[3]?I:'"'===l[3]?B:H):n===B||n===H?n=I:n===R||n===U?n=N:(n=I,s=void 0);const h=n===I&&e[t+1].startsWith("/>")?" ":"";a+=n===N?i+S:d>=0?(r.push(o),i.slice(0,d)+M+i.slice(d)+T+h):i+T+(-2===d?t:h)}return[J(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),r]};class G{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let s=0,a=0;const n=e.length-1,o=this.parts,[l,d]=Y(e,t);if(this.el=G.createElement(l,i),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=V.nextNode())&&o.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(M)){const t=d[a++],i=r.getAttribute(e).split(T),n=/([.?@])?(.*)/.exec(t);o.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?te:"?"===n[1]?ie:"@"===n[1]?re:ee}),r.removeAttribute(e)}else e.startsWith(T)&&(o.push({type:6,index:s}),r.removeAttribute(e));if(L.test(r.tagName)){const e=r.textContent.split(T),t=e.length-1;if(t>0){r.textContent=D?D.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],z()),V.nextNode(),o.push({type:2,index:++s});r.append(e[t],z())}}}else if(8===r.nodeType)if(r.data===E)o.push({type:2,index:s});else{let e=-1;for(;-1!==(e=r.data.indexOf(T,e+1));)o.push({type:7,index:s}),e+=T.length-1}s++}}static createElement(e,t){const i=C.createElement("template");return i.innerHTML=e,i}}function Z(e,t,i=e,r){if(t===W)return t;let s=void 0!==r?i._$Co?.[r]:i._$Cl;const a=P(t)?void 0:t._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),void 0===a?s=void 0:(s=new a(e),s._$AT(e,i,r)),void 0!==r?(i._$Co??=[])[r]=s:i._$Cl=s),void 0!==s&&(t=Z(e,s._$AS(e,t.values),s,r)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??C).importNode(t,!0);V.currentNode=r;let s=V.nextNode(),a=0,n=0,o=i[0];for(;void 0!==o;){if(a===o.index){let t;2===o.type?t=new X(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new se(s,this,e)),this._$AV.push(t),o=i[++n]}a!==o?.index&&(s=V.nextNode(),a++)}return V.currentNode=C,r}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),P(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>O(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,r="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=G.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{const e=new Q(r,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new G(e)),t}k(e){O(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const s of e)r===t.length?t.push(i=new X(this.O(z()),this.O(z()),this,this.options)):i=t[r],i._$AI(s),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,s){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(e,t=this,i,r){const s=this.strings;let a=!1;if(void 0===s)e=Z(this,e,t,0),a=!P(e)||e!==this._$AH&&e!==W,a&&(this._$AH=e);else{const r=e;let n,o;for(e=s[0],n=0;n<s.length-1;n++)o=Z(this,r[i+n],t,n),o===W&&(o=this._$AH[n]),a||=!P(o)||o!==this._$AH[n],o===K?e=K:e!==K&&(e+=(o??"")+s[n+1]),this._$AH[n]=o}a&&!r&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class re extends ee{constructor(e,t,i,r,s){super(e,t,i,r,s),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??K)===W)return;const i=this._$AH,r=e===K&&i!==K||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==K&&(i===K||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const ae=$.litHtmlPolyfillSupport;ae?.(G,X),($.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;class oe extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const r=i?.renderBefore??t;let s=r._$litPart$;if(void 0===s){const e=i?.renderBefore??null;r._$litPart$=s=new X(t.insertBefore(z(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}oe._$litElement$=!0,oe.finalized=!0,ne.litElementHydrateSupport?.({LitElement:oe});const le=ne.litElementPolyfillSupport;le?.({LitElement:oe}),(ne.litElementVersions??=[]).push("4.2.2");const de={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ce=(e=de,t,i)=>{const{kind:r,metadata:s}=i;let a=globalThis.litPropertyMetadata.get(s);if(void 0===a&&globalThis.litPropertyMetadata.set(s,a=new Map),"setter"===r&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===r){const{name:r}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(r,s,e,!0,i)},init(t){return void 0!==t&&this.C(r,void 0,e,t),t}}}if("setter"===r){const{name:r}=i;return function(i){const s=this[r];t.call(this,i),this.requestUpdate(r,s,e,!0,i)}}throw Error("Unsupported decorator location: "+r)};function he(e){return(t,i)=>"object"==typeof i?ce(e,t,i):((e,t,i)=>{const r=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),r?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function pe(e){return he({...e,state:!0,attribute:!1})}const ue=864e5;function ge(e,t,i,r){const s=!e?.start?.dateTime;let a,n;if(s){if(!e?.start?.date)return null;a=new Date(`${e.start.date}T00:00:00`),n=e.end?.date?new Date(`${e.end.date}T00:00:00`):new Date(a.getTime()+ue)}else a=new Date(e.start.dateTime),n=new Date(e.end?.dateTime??e.start.dateTime);return isNaN(a.getTime())||isNaN(n.getTime())?null:(n.getTime()<=a.getTime()&&(n=new Date(a.getTime()+(s?ue:6e4))),{personIdx:t,calendar:i,uid:e.uid,recurrence_id:e.recurrence_id,rrule:e.rrule,summary:e.summary||"Termin",description:e.description,location:e.location,allDay:s,start:a,end:n,color:r,tentative:!1})}function _e(e,t,i){const r=[];for(let s=0;s<i;s++){const i=new Date(t.getTime()+s*ue),a=new Date(i.getTime()+ue),n=Math.max(e.start.getTime(),i.getTime()),o=Math.min(e.end.getTime(),a.getTime());if(o<=n)continue;const l=e.allDay?0:Math.round((n-i.getTime())/6e4),d=e.allDay?1440:Math.round((o-i.getTime())/6e4);r.push({ref:e,personIdx:e.personIdx,day:s,startMin:l,endMin:Math.min(d,1440),title:e.summary,location:e.location,allDay:e.allDay,color:e.color,continuesBefore:e.start.getTime()<i.getTime(),continuesAfter:e.end.getTime()>a.getTime()})}return r}const fe={board_title:"Family board",day:"Day",week:"Week",month:"Month",agenda:"Agenda",all_day:"all-day",this_week:"This week",prev_week:"Previous week",next_week:"Next week",prev_month:"Previous month",next_month:"Next month",today:"Today",tomorrow:"Tomorrow",yesterday:"Yesterday",open_map:"Map",status_home:"home",status_away:"away",add_event:"Add event",new_event:"New event",event:"Event",edit_event:"Edit event",close:"Close",field_title:"Title",field_all_day:"All-day",field_start:"Start",field_end:"End",field_location:"Location",field_note:"Note",field_calendar:"Calendar",recurring:"Recurring event",recur_this:"This event only",recur_future:"This and following",read_only:"This calendar is read-only.",delete:"Delete",cancel:"Cancel",save:"Save",err_invalid:"Please enter valid times.",err_end_before:"End is before start.",err_end_equal:"End must be after start.",save_failed:"Saving failed.",delete_failed:"Deleting failed.",default_title:"Event",load_error:"Calendar could not be loaded.",no_events:"No events.",more_events:"more events"},me={en:fe,de:{board_title:"Familienplan",day:"Tag",week:"Woche",month:"Monat",agenda:"Agenda",all_day:"ganztägig",this_week:"Diese Woche",prev_week:"Vorherige Woche",next_week:"Nächste Woche",prev_month:"Vorheriger Monat",next_month:"Nächster Monat",today:"Heute",tomorrow:"Morgen",yesterday:"Gestern",open_map:"Karte",status_home:"zuhause",status_away:"unterwegs",add_event:"Termin hinzufügen",new_event:"Neuer Termin",event:"Termin",edit_event:"Termin bearbeiten",close:"Schließen",field_title:"Titel",field_all_day:"Ganztägig",field_start:"Start",field_end:"Ende",field_location:"Ort",field_note:"Notiz",field_calendar:"Kalender",recurring:"Wiederkehrender Termin",recur_this:"Nur dieser Termin",recur_future:"Dieser und folgende",read_only:"Dieser Kalender ist schreibgeschützt.",delete:"Löschen",cancel:"Abbrechen",save:"Speichern",err_invalid:"Bitte gültige Zeiten angeben.",err_end_before:"Ende liegt vor dem Start.",err_end_equal:"Ende muss nach dem Start liegen.",save_failed:"Speichern fehlgeschlagen.",delete_failed:"Löschen fehlgeschlagen.",default_title:"Termin",load_error:"Kalender konnte nicht geladen werden.",no_events:"Keine Termine.",more_events:"weitere Termine"}};function ve(e,t){const i=function(e){return(e?.locale?.language||navigator?.language||"en").toLowerCase().split("-")[0]}(e);return me[i]?.[t]??fe[t]??t}function ye(e){return e?.locale?.language||navigator?.language||"en"}function be(e){const t=e?.locale?.time_format;if("12"===t)return!0;if("24"===t)return!1;const i=new Intl.DateTimeFormat(ye(e),{hour:"numeric"}).format(new Date(2020,0,1,13));return/\s?[AaPp]\.?[Mm]\.?/.test(i)||/1\s?PM/i.test(i)}function xe(e,t){const i=new Date(2020,0,1,0,0,0,0);return i.setMinutes(t),function(e,t){return new Intl.DateTimeFormat(ye(e),{hour:be(e)?"numeric":"2-digit",minute:"2-digit",hour12:be(e)}).format(t)}(e,i)}function we(e,t,i=1){const r=new Intl.DateTimeFormat(ye(e),{weekday:t}),s=Array.from({length:7},(e,t)=>{const i=r.format(new Date(2024,0,7+t));return i.charAt(0).toUpperCase()+i.slice(1)});return Array.from({length:7},(e,t)=>s[(i+t)%7])}const $e=["day","week","month","agenda"],ke=["#8B7CF6","#34D399","#FBBF24","#FB7185","#22D3EE","#C084FC","#A3E635","#FB923C","#F472B6","#60A5FA"],De={"clear-night":"weather-night",cloudy:"weather-cloudy",fog:"weather-fog",hail:"weather-hail",lightning:"weather-lightning","lightning-rainy":"weather-lightning-rainy",partlycloudy:"weather-partly-cloudy",pouring:"weather-pouring",rainy:"weather-rainy",snowy:"weather-snowy","snowy-rainy":"weather-snowy-rainy",sunny:"weather-sunny",windy:"weather-windy","windy-variant":"weather-windy-variant",exceptional:"weather-cloudy-alert"},Ae=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,16),Me=e=>new Date(e.getTime()-6e4*e.getTimezoneOffset()).toISOString().slice(0,10),Te=e=>{const t=new Date(e);return t.setHours(0,0,0,0),t},Ee=(e,t)=>e.color||ke[t%ke.length],Se=e=>{let t=0;for(let i=0;i<e.length;i++)t=31*t+e.charCodeAt(i)>>>0;return ke[t%ke.length]};class Ce extends oe{constructor(){super(...arguments),this._events=[],this._view="day",this._day=((new Date).getDay()+6)%7,this._weekOffset=0,this._monthOffset=0,this._loadError=!1,this._loading=!1,this._fitPx=0,this._raw=[],this._fetchedKey="",this._forecast={},this._weatherKey="",this._scrolledKey="",this._onVisible=()=>{"hidden"!==document.visibilityState&&this.hass&&this._config&&this._refetch()},this._onKeyDown=e=>{"Escape"===e.key&&this._dialog&&(e.stopPropagation(),this._closeDialog())},this._prevWeek=()=>{this._weekOffset-=1},this._nextWeek=()=>{this._weekOffset+=1},this._thisWeek=()=>{this._weekOffset=0,this._day=this._todayIndex()},this._prevMonth=()=>{this._monthOffset-=1},this._nextMonth=()=>{this._monthOffset+=1},this._thisMonth=()=>{this._monthOffset=0}}static async getConfigElement(){return await Promise.resolve().then(function(){return Ne}),document.createElement("ha-family-board-card-editor")}static getStubConfig(){return{type:"custom:family-board-card",view:"day",time_grid:30,start_hour:6,end_hour:22,show_weekends:!0,show_now_line:!0,color_by:"person",persons:[{name:"Person 1",person:"",calendar:""},{name:"Person 2",person:"",calendar:""}]}}setConfig(e){if(!e.persons||!Array.isArray(e.persons))throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");this._config=e;const t=this._enabledViews,i=e.view??"day";this._view=t.includes(i)?i:t[0],this._day=this._todayIndex(),this.isConnected&&this._startTimer()}get _enabledViews(){const e=this._config?.views,t=Array.isArray(e)?$e.filter(t=>e.includes(t)):[];return t.length?t:[...$e]}get _firstDayJs(){return"sunday"===this._config?.first_day?0:1}_todayIndex(){return((new Date).getDay()-this._firstDayJs+7)%7}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("visibilitychange",this._onVisible),window.addEventListener("focus",this._onVisible),this._startTimer(),this._tick=window.setInterval(()=>this.requestUpdate(),6e4),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measureFit())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("visibilitychange",this._onVisible),window.removeEventListener("focus",this._onVisible),this._stopTimer(),this._tick&&(clearInterval(this._tick),this._tick=void 0),this._ro?.disconnect(),this._ro=void 0}get _progressOn(){return!1!==this._config?.show_progress}_isCurrent(e){const t=Date.now();return e.ref.start.getTime()<=t&&t<e.ref.end.getTime()}_progressPct(e){const t=e.ref.start.getTime(),i=e.ref.end.getTime();return i<=t?0:Math.min(100,Math.max(0,(Date.now()-t)/(i-t)*100))}_startTimer(){this._stopTimer();const e=this._config?.refresh_interval??300;e>0&&(this._timer=window.setInterval(()=>this._refetch(),1e3*e))}_stopTimer(){this._timer&&(clearInterval(this._timer),this._timer=void 0)}updated(e){(e.has("hass")||e.has("_config"))&&this.hass&&this._config&&(this._maybeFetch(),this._maybeFetchWeather()),e.has("_dialog")&&this._manageDialogFocus(e.get("_dialog")),this._measureFit(),this._maybeScrollToNow()}_measureFit(){if(!this._config?.fit_height||"day"!==this._view)return void(0!==this._fitPx&&(this._fitPx=0));const e=this.renderRoot?.querySelector(".board");if(!e)return;const t=e.querySelector(".header-row"),i=e.querySelector(".allday-row"),r=this._endMin-this._startMin;if(r<=0)return;const s=(t?.offsetHeight??0)+(i?.offsetHeight??0),a=e.clientHeight-s-2;if(a<=0)return;const n=Math.min(96,Math.max(40,this._config.hour_height??64))/60,o=Math.max(40/60,Math.min(n,a/r));Math.abs(o-this._fitPx)>.02&&(this._fitPx=o)}_maybeScrollToNow(){if("day"!==this._view||!1===this._config?.scroll_to_now)return;const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0];if(!this._isRealToday(e))return;const t=`${this._weekOffset}|${this._day}|${this._config?.hour_height}`;if(t===this._scrolledKey)return;const i=this.renderRoot?.querySelector(".board"),r=this.renderRoot?.querySelector(".nowline");i&&r&&(this._scrolledKey=t,requestAnimationFrame(()=>{const e=r.offsetTop-i.clientHeight/3;i.scrollTo({top:Math.max(0,e),behavior:"smooth"})}))}_manageDialogFocus(e){this._dialog&&!e?(this._restoreFocus=this.renderRoot?.activeElement,requestAnimationFrame(()=>{const e=this.renderRoot?.querySelector(".dialog input");e?.focus()})):!this._dialog&&e&&(this._restoreFocus?.focus?.(),this._restoreFocus=void 0)}_weekBounds(){const e=new Date,t=new Date(e);t.setHours(0,0,0,0),t.setDate(e.getDate()-(e.getDay()-this._firstDayJs+7)%7+7*this._weekOffset);const i=new Date(t);return i.setDate(t.getDate()+7),{monday:t,nextMonday:i}}_monthGrid(){const e=new Date,t=new Date(e.getFullYear(),e.getMonth()+this._monthOffset,1),i=(t.getDay()-this._firstDayJs+7)%7,r=Te(new Date(t.getFullYear(),t.getMonth(),1-i)),s=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();return{gridStart:r,weeks:Math.ceil((i+s)/7),month:t.getMonth(),year:t.getFullYear()}}_fetchRange(){if("month"===this._view){const{gridStart:e,weeks:t}=this._monthGrid();return{start:e,end:new Date(e.getTime()+7*t*ue)}}const{monday:e,nextMonday:t}=this._weekBounds();return{start:e,end:t}}async _maybeFetch(){const e=this._config.persons.map(e=>this._calsOf(e).join("+")).join(","),t=`${"month"===this._view?`m${this._monthOffset}`:`w${this._weekOffset}`}|${e}`;t!==this._fetchedKey&&(this._fetchedKey=t,await this._fetchEvents())}async _refetch(){this._fetchedKey="",await this._maybeFetch()}async _maybeFetchWeather(){const e=this._config.weather_entity;if(!e||!1===this._config.show_weather||!this.hass.states[e])return Object.keys(this._forecast).length&&(this._forecast={}),void(this._weatherKey="");const t=`${e}|${(new Date).toISOString().slice(0,10)}`;if(t!==this._weatherKey){this._weatherKey=t;try{const t=await this.hass.callWS({type:"call_service",domain:"weather",service:"get_forecasts",service_data:{type:"daily"},target:{entity_id:e},return_response:!0}),i=t?.response?.[e]?.forecast??[],r={};for(const e of i)e?.datetime&&(r[Me(new Date(e.datetime))]={temp:Math.round(e.temperature),condition:e.condition});this._forecast=r}catch(e){this._forecast={}}}}_weatherChip(e){const t=this._forecast[Me(e)];if(!t)return K;const i=De[t.condition]||"weather-cloudy",r=this.hass.config?.unit_system?.temperature??"°";return j`<span class="wx" title=${t.condition}>
      <ha-icon icon="mdi:${i}"></ha-icon>${t.temp}${r}
    </span>`}_hidden(e){const t=this._config.hide_patterns;if(!Array.isArray(t)||0===t.length)return!1;const i=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&i.includes(t)})}_matchesTentative(e){const t=this._config.tentative_patterns;if(!Array.isArray(t)||0===t.length)return!1;const i=e.toLowerCase();return t.some(e=>{const t=String(e).trim().toLowerCase();return t.length>0&&i.includes(t)})}async _fetchEvents(){const{start:e,end:t}=this._fetchRange(),i=e.toISOString(),r=t.toISOString(),s=[];let a=!1;this._loading=!0,await Promise.all(this._config.persons.flatMap((e,t)=>{const n=Ee(e,t);return this._calsOf(e).filter(e=>this.hass.states[e]).map(async e=>{try{const a=await this.hass.callApi("GET",`calendars/${e}?start=${encodeURIComponent(i)}&end=${encodeURIComponent(r)}`);for(const i of a){const r=ge(i,t,e,n);r&&!this._hidden(r.summary)&&(this._matchesTentative(r.summary)&&(r.tentative=!0),s.push(r))}}catch(e){a=!0}})})),this._raw=s;const{monday:n}=this._weekBounds();this._events="month"===this._view?[]:s.flatMap(e=>function(e,t){return _e(e,t,7)}(e,n)),this._loadError=a&&0===s.length,this._loading=!1}_calsOf(e){return Array.isArray(e.calendar)?e.calendar.filter(Boolean):e.calendar?[e.calendar]:[]}_writableCals(e){return this._calsOf(e).filter(e=>this._canCreate(e))}_personCanCreate(e){return this._writableCals(e).length>0}_calFeatures(e){if(!e)return 0;const t=this.hass.states[e];return Number(t?.attributes?.supported_features??0)}_canCreate(e){return!!(1&this._calFeatures(e))}_canUpdate(e){return!!(4&this._calFeatures(e))}_canDelete(e){return!!(2&this._calFeatures(e))}get _persons(){return this._config.persons}get _grid(){return this._config.time_grid??30}get _pxPerMin(){if(this._config.fit_height&&this._fitPx>0)return this._fitPx;return Math.min(96,Math.max(40,this._config.hour_height??64))/60}get _startMin(){return 60*(this._config.start_hour??6)}get _endMin(){return 60*(this._config.end_hour??22)}_jsDay(e){return(this._firstDayJs+e)%7}get _visibleDays(){const e=[0,1,2,3,4,5,6];return!1===this._config.show_weekends?e.filter(e=>{const t=this._jsDay(e);return 0!==t&&6!==t}):e}_t(e){return ve(this.hass,e)}_eventColor(e){const t=this._config.color_by;return"location"===t&&e.location?Se(e.location):"calendar"===t&&e.ref.calendar?Se(e.ref.calendar):e.color}_isPast(e){return!1!==this._config.dim_past&&e.ref.end.getTime()<=Date.now()}_relativeDay(e){const t=Math.round((Te(e).getTime()-Te(new Date).getTime())/ue);return 0===t?this._t("today"):1===t?this._t("tomorrow"):-1===t?this._t("yesterday"):null}_timedFor(e,t){const i=this._events.filter(i=>i.day===e&&i.personIdx===t&&!i.allDay&&!this._isBackground(i));return function(e){const t=[...e].sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin),i=[];let r=[],s=-1,a=0;const n=[],o=()=>{if(r.length){const e=Math.max(...r.map(e=>e.col))+1;r.forEach(t=>{t.cols=e,t.cluster=a}),a++}r=[]};for(const e of t){r.length&&e.startMin>=s&&(o(),n.length=0);let t=n.findIndex(t=>t<=e.startMin);-1===t?(t=n.length,n.push(e.endMin)):n[t]=e.endMin;const l={...e,col:t,cols:1,cluster:a};r.push(l),i.push(l),s=1===r.length?e.endMin:Math.max(s,e.endMin)}return o(),i}(i)}_bgMinMin(){const e=Number(this._config.background_hours??3);return!Number.isFinite(e)||e<=0?0:60*e}_isBackground(e){const t=this._bgMinMin();return t>0&&!e.allDay&&e.endMin-e.startMin>=t}_bgFor(e,t){return this._events.filter(i=>i.day===e&&i.personIdx===t&&!i.allDay&&this._isBackground(i)).sort((e,t)=>t.endMin-t.startMin-(e.endMin-e.startMin))}_maxCols(){const e=Number(this._config.max_columns);return!Number.isFinite(e)||e<1?3:Math.min(Math.round(e),8)}_dayLayout(e,t){const i=this._timedFor(e,t),r=this._maxCols(),s=new Map;for(const e of i){const t=s.get(e.cluster);t?t.push(e):s.set(e.cluster,[e])}const a=[],n=[];for(const e of s.values()){if(e[0].cols<=r){a.push(...e);continue}let t=0,i=1/0,s=-1/0;for(const n of e)n.col<=r-2?a.push({...n,cols:r}):(t++,i=Math.min(i,n.startMin),s=Math.max(s,n.endMin));t>0&&n.push({col:r-1,cols:r,startMin:i,endMin:s,count:t})}return{events:a,overflows:n}}_isTentative(e){return!0===e.ref.tentative}_showDayAgenda(e){this._day=e,this._enabledViews.includes("agenda")&&(this._view="agenda")}_allDayFor(e,t){return this._events.filter(i=>i.day===e&&i.personIdx===t&&i.allDay)}_eventsFor(e,t){return this._events.filter(i=>i.day===e&&i.personIdx===t).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin)}_dateForDay(e){const{monday:t}=this._weekBounds();return new Date(t.getTime()+e*ue)}_isRealToday(e){return 0===this._weekOffset&&e===this._todayIndex()}_onItemKey(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),e.stopPropagation(),this._openEvent(t))}_dayHasEvents(e){return this._persons.some((t,i)=>this._eventsFor(e,i).length>0)}_personName(e,t){return e.name||this.hass.states[e.person??""]?.attributes?.friendly_name||`Person ${t+1}`}_avatar(e,t){const i=Ee(e,t),r=e.person?this.hass.states[e.person]:void 0,s=r?.attributes?.entity_picture,a=this._personName(e,t).slice(0,2).toUpperCase();return s?j`<div
          class="avatar"
          style="background-image:url('${s}');box-shadow:0 0 0 2px ${i}55"
        ></div>`:j`<div class="avatar initials" style="background:${i}">${a}</div>`}_goToDate(e){const t=Te(new Date),i=e=>{const t=Te(e);return t.setDate(t.getDate()-(t.getDay()-this._firstDayJs+7)%7),t},r=Math.round((i(e).getTime()-i(t).getTime())/(7*ue));this._weekOffset=r,this._day=(e.getDay()-this._firstDayJs+7)%7,this._view=this._enabledViews.includes("day")?"day":this._view}render(){if(!this._config||!this.hass)return K;const e=this._config.title??this._t("board_title");return j`
      <ha-card>
        <div class="top">
          <div class="title">${e}</div>
          ${this._enabledViews.length>1?j`<div class="switch" role="tablist">
                ${this._enabledViews.map(e=>j`<button
                      role="tab"
                      aria-selected=${this._view===e}
                      class=${this._view===e?"on":""}
                      @click=${()=>this._view=e}
                    >
                      ${this._t(e)}
                    </button>`)}
              </div>`:K}
        </div>
        ${"day"===this._view?this._renderDay():"week"===this._view?this._renderWeek():"month"===this._view?this._renderMonth():this._renderAgenda()}
      </ha-card>
      ${this._dialog?this._renderDialog():K}
    `}_weekNav(){const{monday:e}=this._weekBounds();return j`
      <div class="weeknav">
        <button class="nav" aria-label=${this._t("prev_week")} @click=${this._prevWeek}>‹</button>
        <button class="nav-now" @click=${this._thisWeek}>
          ${function(e,t){const i=new Date(t.getTime()+5184e5),r=new Intl.DateTimeFormat(ye(e),{day:"numeric",month:"short"});return`${r.format(t)} – ${r.format(i)}`}(this.hass,e)}
        </button>
        <button class="nav" aria-label=${this._t("next_week")} @click=${this._nextWeek}>›</button>
      </div>
    `}_renderDayTabs(){const e=we(this.hass,"short",this._firstDayJs);return j`
      <div class="tabs" role="tablist">
        ${this._visibleDays.map(t=>j`
            <button
              role="tab"
              aria-selected=${t===this._day}
              class="${t===this._day?"on":""} ${this._isRealToday(t)?"today":""}"
              @click=${()=>this._day=t}
            >
              ${e[t]}
            </button>
          `)}
      </div>
    `}_renderDay(){const e=this._visibleDays.includes(this._day)?this._day:this._visibleDays[0],t=this._pxPerMin,i=60*t,r=this._startMin,s=this._endMin,a=(s-r)*t,n=we(this.hass,"long",this._firstDayJs),o=[];for(let e=r/60;e<=s/60;e++)o.push(e);const l=new Date,d=Math.max(r,Math.min(s,60*l.getHours()+l.getMinutes())),c=!1!==this._config.show_now_line&&this._isRealToday(e),h=this._persons.some((t,i)=>this._allDayFor(e,i).length>0);return j`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(e))??n[e]}
          ${this._weatherChip(this._dateForDay(e))}${this._loading?j`<span class="spinner"></span>`:K}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      ${this._loadError?j`<div class="banner">${this._t("load_error")}</div>`:K}
      <div class="board">
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((e,t)=>{const i=e.person?this.hass.states[e.person]:void 0;return j`
              <div class="phead">
                ${this._avatar(e,t)}
                <div class="pname">${this._personName(e,t)}</div>
                <div class="pstatus">${i?this._statusLabel(i.state):""}</div>
              </div>
            `})}
        </div>
        ${h?j`
              <div class="allday-row">
                <div class="axis-spacer allday-label">${this._t("all_day")}</div>
                ${this._persons.map((t,i)=>j`
                    <div class="allday-cell">
                      ${this._allDayFor(e,i).map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return j`
                          <div
                            class="adchip ${i?"tentative":""}"
                            style="border-left:3px ${i?"dashed":"solid"} ${t};background:${t}22"
                            title="${e.title}"
                            tabindex="0"
                            role="button"
                            @click=${()=>this._openEvent(e)}
                            @keydown=${t=>this._onItemKey(t,e)}
                          >
                            ${e.continuesBefore?"« ":""}${e.title}${e.continuesAfter?" »":""}
                          </div>
                        `})}
                    </div>
                  `)}
              </div>
            `:K}
        <div class="body" style="height:${a}px">
          <div class="axis">
            ${o.map(e=>j`<div class="hour" style="top:${(60*e-r)*t}px">
                  ${(e=>String(e).padStart(2,"0"))(e)}:00
                </div>`)}
          </div>
          ${this._persons.map((a,n)=>{const o=this._personCanCreate(a),l=this._dayLayout(e,n);return j`
              <div
                class="col ${o?"creatable":""}"
                @click=${i=>this._onColClick(i,n,e,t,r)}
                style="background-image:
                  repeating-linear-gradient(var(--fb-row-shade) 0 ${i}px, transparent ${i}px ${2*i}px),
                  repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${i/2}px),
                  repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${i}px)"
              >
                ${this._bgFor(e,n).filter(e=>e.endMin>r&&e.startMin<s).map((e,i)=>{const s=(e.startMin-r)*t,a=Math.max((e.endMin-e.startMin)*t-3,16),n=this._eventColor(e),o=this._isTentative(e);return j`
                      <div
                        class="band ${this._isPast(e)?"past":""} ${o?"tentative":""}"
                        tabindex="0"
                        role="button"
                        @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                        @keydown=${t=>this._onItemKey(t,e)}
                        style="top:${s+1.5}px;height:${a}px;
                               border-left:3px ${o?"dashed":"solid"} ${n};
                               background:linear-gradient(135deg, ${n}22, ${n}12)"
                        title="${e.title} · ${xe(this.hass,e.startMin)}–${xe(this.hass,e.endMin)}"
                      >
                        <span class="etitle" style="margin-top:${17*i}px"
                          >${e.continuesBefore?"« ":""}${e.title}${e.continuesAfter?" »":""}</span
                        >
                      </div>
                    `})}
                ${l.events.filter(e=>e.endMin>r&&e.startMin<s).map(e=>{const i=(e.startMin-r)*t,s=Math.max((e.endMin-e.startMin)*t-3,16),a=this._eventColor(e),n=e.col/e.cols*100,o=100/e.cols,l=this._isTentative(e);return j`
                      <div
                        class="event ${this._isPast(e)?"past":""} ${l?"tentative":""}"
                        tabindex="0"
                        role="button"
                        @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                        @keydown=${t=>this._onItemKey(t,e)}
                        style="top:${i+1.5}px;height:${s}px;
                               left:calc(${n}% + 2px);width:calc(${o}% - 4px);
                               border-left:3px ${l?"dashed":"solid"} ${a};
                               background:linear-gradient(135deg, ${a}55, ${a}3a)"
                        title="${e.title} · ${xe(this.hass,e.startMin)}–${xe(this.hass,e.endMin)}"
                      >
                        <span class="etitle">${e.continuesBefore?"« ":""}${e.title}</span>
                        ${s>32?j`<span class="etime"
                              >${xe(this.hass,e.startMin)}–${xe(this.hass,e.endMin)}</span
                            >`:K}
                        ${this._progressOn&&this._isCurrent(e)?j`<div class="eprog">
                              <div style="width:${this._progressPct(e)}%"></div>
                            </div>`:K}
                      </div>
                    `})}
                ${l.overflows.filter(e=>e.endMin>r&&e.startMin<s).map(i=>{const s=(i.startMin-r)*t,a=Math.max((i.endMin-i.startMin)*t-3,16),n=i.col/i.cols*100,o=100/i.cols;return j`
                      <div
                        class="event overflow"
                        tabindex="0"
                        role="button"
                        title="${i.count} ${this._t("more_events")}"
                        @click=${t=>{t.stopPropagation(),this._showDayAgenda(e)}}
                        @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showDayAgenda(e))}}
                        style="top:${s+1.5}px;height:${a}px;
                               left:calc(${n}% + 2px);width:calc(${o}% - 4px)"
                      >
                        <span class="etitle">+${i.count}</span>
                      </div>
                    `})}
              </div>
            `})}
          ${c?j`<div class="nowline" style="top:${(d-r)*t}px">
                <span>${xe(this.hass,d)}</span>
              </div>`:K}
          ${this._loading||this._loadError||this._dayHasEvents(e)?K:j`<div class="empty">${this._t("no_events")}</div>`}
        </div>
      </div>
    `}_renderWeek(){const e=we(this.hass,"short",this._firstDayJs),t=`70px repeat(${this._persons.length}, minmax(110px, 1fr))`;return j`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${t}">
          <div class="corner"></div>
          ${this._persons.map((e,t)=>j`<div class="wphead">
                ${this._avatar(e,t)}<span>${this._personName(e,t)}</span>
              </div>`)}
          ${this._visibleDays.map(t=>j`
              <div class="wday ${this._isRealToday(t)?"today":""}">
                <b>${e[t]}</b>
              </div>
              ${this._persons.map((e,i)=>{const r=this._personCanCreate(e);return j`
                  <div
                    class="wcell ${this._isRealToday(t)?"today":""} ${r?"creatable":""}"
                    @click=${()=>r&&this._openCreate(i,t)}
                  >
                    ${this._eventsFor(t,i).map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return j`
                        <div
                          class="wchip ${this._isPast(e)?"past":""} ${i?"tentative":""}"
                          style="border-left:2.5px ${i?"dashed":"solid"} ${t};background:${t}22"
                          title="${e.title}"
                          tabindex="0"
                          role="button"
                          @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                          @keydown=${t=>this._onItemKey(t,e)}
                        >
                          <span>${e.continuesBefore?"« ":""}${e.title}</span>
                          ${e.allDay?K:j`<small>${xe(this.hass,e.startMin)}</small>`}
                        </div>
                      `})}
                  </div>
                `})}
            `)}
        </div>
      </div>
    `}_renderAgenda(){const e=we(this.hass,"long",this._firstDayJs),t=new Intl.DateTimeFormat(this.hass.locale?.language||"en",{day:"numeric",month:"short"}),i=this._visibleDays.map(e=>({d:e,items:this._events.filter(t=>t.day===e).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin)})).filter(e=>e.items.length>0);return j`
      <div class="weekhead">${this._weekNav()}</div>
      ${this._loadError?j`<div class="banner">${this._t("load_error")}</div>`:K}
      <div class="agenda">
        ${0===i.length?j`<div class="agenda-empty">
              ${this._loading?j`<span class="spinner"></span>`:this._t("no_events")}
            </div>`:i.map(i=>j`
                <div class="agenda-day">
                  <div class="agenda-date ${this._isRealToday(i.d)?"today":""}">
                    ${this._relativeDay(this._dateForDay(i.d))??e[i.d]} ·
                    ${t.format(this._dateForDay(i.d))}
                    ${this._weatherChip(this._dateForDay(i.d))}
                  </div>
                  ${i.items.map(e=>this._agendaRow(e))}
                </div>
              `)}
      </div>
    `}_agendaRow(e){const t=this._eventColor(e),i=this._personName(this._persons[e.personIdx],e.personIdx),r=e.allDay?this._t("all_day"):`${xe(this.hass,e.startMin)}–${xe(this.hass,e.endMin)}`,s=this._isCurrent(e),a=this._isTentative(e),n=e.allDay||s||e.continuesBefore?"":function(e,t){const i=t.getTime()-Date.now();if(i<=0)return"";const r=new Intl.RelativeTimeFormat(ye(e),{numeric:"always",style:"short"}),s=Math.round(i/6e4);if(s<60)return r.format(Math.max(1,s),"minute");const a=Math.round(s/60);return a<24?r.format(a,"hour"):r.format(Math.round(a/24),"day")}(this.hass,e.ref.start);return j`
      <div
        class="agenda-row ${this._isPast(e)?"past":""} ${s?"current":""} ${a?"tentative":""}"
        tabindex="0"
        role="button"
        @click=${()=>this._openEvent(e)}
        @keydown=${t=>this._onItemKey(t,e)}
      >
        <span class="agenda-time">${r}</span>
        <span class="agenda-bar" style="background:${t}"></span>
        <span class="agenda-main">
          <span class="agenda-title"
            >${e.continuesBefore?"« ":""}${e.title}${e.continuesAfter?" »":""}</span
          >
          <span class="agenda-meta">${i}${e.location?` · ${e.location}`:""}</span>
          ${s&&this._progressOn?j`<span class="agenda-prog"
                ><span style="width:${this._progressPct(e)}%;background:${t}"></span
              ></span>`:K}
        </span>
        ${n?j`<span class="agenda-cd">${n}</span>`:K}
      </div>
    `}_renderMonth(){const{gridStart:e,weeks:t,month:i,year:r}=this._monthGrid(),s=7*t,a=we(this.hass,"short",this._firstDayJs),n=this.hass.locale?.language||"en",o=new Intl.DateTimeFormat(n,{month:"long",year:"numeric"}).format(new Date(r,i,1)),l=new Map;for(const t of this._raw)for(const i of _e(t,e,s)){const e=l.get(i.day);e?e.push(i):l.set(i.day,[i])}const d=Te(new Date).getTime();return j`
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
      ${this._loadError?j`<div class="banner">${this._t("load_error")}</div>`:K}
      <div class="monthwrap">
        <div class="monthhead">${a.map(e=>j`<div class="mhcell">${e}</div>`)}</div>
        <div class="monthgrid">
          ${Array.from({length:s},(t,r)=>{const s=new Date(e.getTime()+r*ue),a=s.getMonth()===i,n=s.getTime()===d,o=(l.get(r)||[]).sort((e,t)=>Number(t.allDay)-Number(e.allDay)||e.startMin-t.startMin);return j`
              <div
                class="mcell ${a?"":"out"}"
                role="button"
                tabindex="0"
                @click=${()=>this._goToDate(s)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._goToDate(s))}}
              >
                <div class="mdate ${n?"today":""}">${s.getDate()}</div>
                <div class="mchips">
                  ${o.slice(0,3).map(e=>{const t=this._eventColor(e),i=this._isTentative(e);return j`<div
                      class="mchip ${this._isPast(e)?"past":""} ${i?"tentative":""}"
                      style="background:${t}22;border-left:2px ${i?"dashed":"solid"} ${t}"
                      title="${e.title}"
                      @click=${t=>{t.stopPropagation(),this._openEvent(e)}}
                    >
                      ${e.continuesBefore?"« ":""}${e.title}
                    </div>`})}
                  ${o.length>3?j`<div class="mmore">+${o.length-3}</div>`:K}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_statusLabel(e){return"home"===e?this._t("status_home"):"not_home"===e?this._t("status_away"):"unknown"===e||"unavailable"===e?"–":e}_onColClick(e,t,i,r,s){const a=this._persons[t];if(!this._personCanCreate(a))return;const n=e.currentTarget.getBoundingClientRect();let o=s+(e.clientY-n.top)/r;const l=this._grid;o=Math.round(o/l)*l,o=Math.max(0,Math.min(o,1440-l)),this._openCreate(t,i,o)}_openCreate(e,t,i){const r=this._persons[e],s=this._writableCals(r);if(0===s.length)return;const a=Te(this._dateForDay(t)),n=i??Math.max(this._startMin,540),o=new Date(a.getTime()+6e4*n),l=new Date(o.getTime()+36e5);this._dialog={mode:"create",personIdx:e,calendar:s[0],calendarOptions:s.length>1?s:void 0,canUpdate:!0,canDelete:!1,summary:"",location:"",description:"",allDay:!1,start:Ae(o),end:Ae(l),recurrenceRange:""}}_openEvent(e){const t=e.ref,i=t.calendar,r=this._canUpdate(i)&&!!t.uid,s=this._canDelete(i)&&!!t.uid;this._dialog={mode:"edit",personIdx:t.personIdx,calendar:i,uid:t.uid,recurrence_id:t.recurrence_id,recurring:!(!t.recurrence_id&&!t.rrule),recurrenceRange:"",canUpdate:r,canDelete:s,summary:t.summary,location:t.location??"",description:t.description??"",allDay:t.allDay,start:t.allDay?Me(t.start):Ae(t.start),end:t.allDay?Me(new Date(t.end.getTime()-ue)):Ae(t.end)}}_dlgField(e,t){this._dialog&&(this._dialog={...this._dialog,[e]:t,error:void 0})}_toggleAllDay(e){if(!this._dialog)return;const t=this._dialog;e&&!t.allDay?this._dialog={...t,allDay:e,start:t.start.slice(0,10),end:t.end.slice(0,10),error:void 0}:!e&&t.allDay&&(this._dialog={...t,allDay:e,start:`${t.start}T09:00`,end:`${t.end}T10:00`,error:void 0})}_buildPayload(e){const t={summary:e.summary.trim()||this._t("default_title")};if(e.location.trim()&&(t.location=e.location.trim()),e.description.trim()&&(t.description=e.description.trim()),e.allDay){const i=new Date(`${e.end}T00:00:00`);i.setDate(i.getDate()+1),t.dtstart=e.start,t.dtend=Me(i)}else t.dtstart=new Date(e.start).toISOString(),t.dtend=new Date(e.end).toISOString();return t}_validate(e){const t=e.allDay?new Date(`${e.start}T00:00:00`):new Date(e.start),i=e.allDay?new Date(`${e.end}T00:00:00`):new Date(e.end);return isNaN(t.getTime())||isNaN(i.getTime())?this._t("err_invalid"):i.getTime()<t.getTime()?this._t("err_end_before"):e.allDay||i.getTime()!==t.getTime()?null:this._t("err_end_equal")}async _saveDialog(){if(!this._dialog)return;const e=this._dialog,t=this._validate(e);if(t)this._dialog={...e,error:t};else{this._dialog={...e,busy:!0,error:void 0};try{const t=this._buildPayload(e);"create"===e.mode?await this.hass.callWS({type:"calendar/event/create",entity_id:e.calendar,event:t}):await this.hass.callWS({type:"calendar/event/update",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:"",event:t}),this._dialog=void 0,await this._refetch()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("save_failed")}}}}async _deleteDialog(){if(!this._dialog||!this._dialog.uid)return;const e=this._dialog;this._dialog={...e,busy:!0,error:void 0};try{await this.hass.callWS({type:"calendar/event/delete",entity_id:e.calendar,uid:e.uid,recurrence_id:e.recurrence_id,recurrence_range:e.recurring?e.recurrenceRange:""}),this._dialog=void 0,await this._refetch()}catch(t){this._dialog={...e,busy:!1,error:t?.message||this._t("delete_failed")}}}_closeDialog(){this._dialog=void 0}_renderDialog(){const e=this._dialog,t="edit"===e.mode&&!e.canUpdate,i=this.hass.states[e.calendar]?.attributes?.friendly_name||e.calendar,r="create"===e.mode?this._t("new_event"):t?this._t("event"):this._t("edit_event");return j`
      <div
        class="overlay"
        @click=${e=>{e.target===e.currentTarget&&this._closeDialog()}}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${r}>
          <div class="dlg-head">
            <span>${r}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeDialog}>
              ✕
            </button>
          </div>
          ${e.calendarOptions&&e.calendarOptions.length>1?j`<label class="fld">
                <span>${this._t("field_calendar")}</span>
                <select
                  .value=${e.calendar}
                  @change=${e=>this._dlgField("calendar",e.target.value)}
                >
                  ${e.calendarOptions.map(t=>j`<option value=${t} ?selected=${t===e.calendar}>
                        ${this.hass.states[t]?.attributes?.friendly_name||t}
                      </option>`)}
                </select>
              </label>`:j`<div class="dlg-cal">${i}</div>`}

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

          <label class="fld">
            <span>
              ${this._t("field_location")}
              ${e.location.trim()?j`<a
                    class="maplink"
                    href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.location)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click=${e=>e.stopPropagation()}
                    >${this._t("open_map")}</a
                  >`:K}
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

          ${"edit"===e.mode&&e.recurring&&!t?j`<div class="recur">
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
              </div>`:K}
          ${t?j`<div class="ro-note">${this._t("read_only")}</div>`:K}
          ${e.error?j`<div class="dlg-error">${e.error}</div>`:K}

          <div class="dlg-actions">
            ${"edit"===e.mode&&e.canDelete?j`<button class="danger" ?disabled=${e.busy} @click=${this._deleteDialog}>
                  ${this._t("delete")}
                </button>`:K}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${e.busy} @click=${this._closeDialog}>
              ${this._t("cancel")}
            </button>
            ${t?K:j`<button class="primary" ?disabled=${e.busy} @click=${this._saveDialog}>
                  ${e.busy?"…":this._t("save")}
                </button>`}
          </div>
        </div>
      </div>
    `}}Ce.styles=n`
    :host {
      font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
      /* grid tokens — theme-aware, calm by default */
      --fb-hourline: var(--divider-color, #8884);
      --fb-halfhour: color-mix(in srgb, var(--divider-color, #8884) 45%, transparent);
      --fb-row-shade: color-mix(in srgb, var(--secondary-text-color, #888) 5%, transparent);
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
    .dayname {
      font-weight: 600;
      font-size: 15px;
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
      left: 56px;
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
      max-height: 58vh;
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
      border-radius: var(--fb-radius);
      padding: 4px 7px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 2;
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
      color: var(--secondary-text-color);
      background: var(--card-background-color, var(--ha-card-background));
      border-radius: 4px;
      padding: 0 4px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .etime {
      font-size: var(--fb-time-size);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .nowline {
      position: absolute;
      left: 56px;
      right: 0;
      border-top: 2px solid var(--fb-now-color);
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
      flex: 0 0 92px;
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
    /* weather chip */
    .wx {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      vertical-align: middle;
      font-variant-numeric: tabular-nums;
    }
    .wx ha-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-text-color);
    }
    .agenda-date .wx {
      margin-left: 4px;
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
      color: var(--secondary-text-color);
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
      gap: 10px;
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
  `,e([he({attribute:!1})],Ce.prototype,"hass",void 0),e([pe()],Ce.prototype,"_config",void 0),e([pe()],Ce.prototype,"_events",void 0),e([pe()],Ce.prototype,"_view",void 0),e([pe()],Ce.prototype,"_day",void 0),e([pe()],Ce.prototype,"_weekOffset",void 0),e([pe()],Ce.prototype,"_monthOffset",void 0),e([pe()],Ce.prototype,"_dialog",void 0),e([pe()],Ce.prototype,"_loadError",void 0),e([pe()],Ce.prototype,"_loading",void 0),e([pe()],Ce.prototype,"_fitPx",void 0),e([pe()],Ce.prototype,"_forecast",void 0),customElements.get("family-board-card")||customElements.define("family-board-card",Ce),window.customCards=window.customCards||[],window.customCards.push({type:"family-board-card",name:"Family Board Card",description:"Familienkalender / Wer-ist-wann-wo Übersicht für mehrere Personen.",preview:!0,documentationURL:"https://github.com/renespeaker/ha-family-board-card"}),console.info("%c FAMILY-BOARD-CARD %c v0.13.1 ","background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px","background:#222;color:#fff;border-radius:0 3px 3px 0");const ze=[{name:"title",selector:{text:{}}},{name:"view",selector:{select:{mode:"dropdown",options:[{value:"day",label:"Tag"},{value:"week",label:"Woche"},{value:"month",label:"Monat"},{value:"agenda",label:"Agenda"}]}}},{name:"views",selector:{select:{multiple:!0,options:[{value:"day",label:"Tag"},{value:"week",label:"Woche"},{value:"month",label:"Monat"},{value:"agenda",label:"Agenda"}]}}},{name:"time_grid",selector:{select:{mode:"dropdown",options:[{value:"60",label:"60 min"},{value:"30",label:"30 min"},{value:"15",label:"15 min"}]}}},{name:"start_hour",selector:{number:{min:0,max:23,mode:"box"}}},{name:"end_hour",selector:{number:{min:1,max:24,mode:"box"}}},{name:"first_day",selector:{select:{mode:"dropdown",options:[{value:"monday",label:"Montag"},{value:"sunday",label:"Sonntag"}]}}},{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"person",label:"Person"},{value:"location",label:"Ort"},{value:"calendar",label:"Kalender"}]}}},{name:"hour_height",selector:{number:{min:40,max:96,step:4,mode:"slider",unit_of_measurement:"px"}}},{name:"max_columns",selector:{number:{min:1,max:8,step:1,mode:"slider"}}},{name:"fit_height",selector:{boolean:{}}},{name:"background_hours",selector:{number:{min:0,max:12,step:1,mode:"slider",unit_of_measurement:"h"}}},{name:"show_weekends",selector:{boolean:{}}},{name:"show_now_line",selector:{boolean:{}}},{name:"scroll_to_now",selector:{boolean:{}}},{name:"dim_past",selector:{boolean:{}}},{name:"show_progress",selector:{boolean:{}}},{name:"hide_patterns",selector:{text:{multiple:!0}}},{name:"tentative_patterns",selector:{text:{multiple:!0}}},{name:"weather_entity",selector:{entity:{filter:{domain:"weather"}}}},{name:"show_weather",selector:{boolean:{}}},{name:"refresh_interval",selector:{number:{min:0,max:3600,mode:"box",unit_of_measurement:"s"}}}],Pe={title:"Kartentitel",refresh_interval:"Auto-Aktualisierung (Sek., 0 = aus)",view:"Standardansicht",views:"Verfügbare Ansichten (Umschalter)",time_grid:"Zeitraster",start_hour:"Startstunde",end_hour:"Endstunde",hour_height:"Höhe pro Stunde (max. bei Auto-Fit)",fit_height:"Auto-Fit: Tag ohne Scrollen einpassen",background_hours:"Lange Termine als Hintergrund-Band ab (Std., 0 = aus)",max_columns:"Max. Spalten pro Tag (dichte Termine)",first_day:"Wochenstart",scroll_to_now:"Auto-Scroll zu jetzt",color_by:"Einfärben nach",show_weekends:"Wochenende anzeigen",show_now_line:"Jetzt-Linie",dim_past:"Vergangene Termine ausgrauen",show_progress:"Fortschrittsbalken anzeigen",hide_patterns:"Termine ausblenden (Text-Muster)",tentative_patterns:"Als vorläufig markieren (Text-Muster)",weather_entity:"Wetter-Entität (weather.*)",show_weather:"Wetter anzeigen",name:"Anzeigename",person:"Person (Avatar & Status)",calendar:"Kalender (Termine, mehrere möglich)",color:"Farbe (optional)"},Oe=[{name:"name",selector:{text:{}}},{name:"person",selector:{entity:{filter:{domain:"person"}}}},{name:"calendar",selector:{entity:{filter:{domain:"calendar"},multiple:!0}}},{name:"color",selector:{text:{}}}];class Fe extends oe{setConfig(e){this._config=e}get _persons(){return Array.isArray(this._config.persons)?this._config.persons:[]}get _settingsData(){return{...this._config,time_grid:String(this._config.time_grid??30)}}_emit(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_settingsChanged(e){e.stopPropagation();const t={...e.detail.value};"string"==typeof t.time_grid&&(t.time_grid=Number(t.time_grid)),this._emit({...this._config,...t,persons:this._persons})}_personChanged(e,t){t.stopPropagation();const i={...t.detail.value};i.color||delete i.color,Array.isArray(i.calendar)&&(0===i.calendar.length?delete i.calendar:1===i.calendar.length&&(i.calendar=i.calendar[0]));const r=this._persons.map((t,r)=>r===e?i:t);this._emit({...this._config,persons:r})}_personData(e){const t=Array.isArray(e.calendar)?e.calendar:e.calendar?[e.calendar]:[];return{...e,calendar:t}}_addPerson(){const e=[...this._persons,{name:"",person:"",calendar:""}];this._emit({...this._config,persons:e})}_removePerson(e){const t=this._persons.filter((t,i)=>i!==e);this._emit({...this._config,persons:t})}_movePerson(e,t){const i=[...this._persons],r=e+t;r<0||r>=i.length||([i[e],i[r]]=[i[r],i[e]],this._emit({...this._config,persons:i}))}render(){if(!this._config)return K;const e=this._persons;return j`
      <div class="section-title">Personen</div>
      <div class="persons">
        ${0===e.length?j`<div class="hint">Noch keine Person. Füge unten die erste hinzu.</div>`:K}
        ${e.map((t,i)=>j`
            <div class="person">
              <div class="person-head">
                <span class="pidx">${t.name||`Person ${i+1}`}</span>
                <div class="ptools">
                  <button
                    class="icon"
                    title="Nach oben"
                    ?disabled=${0===i}
                    @click=${()=>this._movePerson(i,-1)}
                  >
                    ↑
                  </button>
                  <button
                    class="icon"
                    title="Nach unten"
                    ?disabled=${i===e.length-1}
                    @click=${()=>this._movePerson(i,1)}
                  >
                    ↓
                  </button>
                  <button
                    class="icon danger"
                    title="Entfernen"
                    @click=${()=>this._removePerson(i)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <ha-form
                .hass=${this.hass}
                .data=${this._personData(t)}
                .schema=${Oe}
                .computeLabel=${e=>Pe[e.name]??e.name}
                @value-changed=${e=>this._personChanged(i,e)}
              ></ha-form>
            </div>
          `)}
        <button class="add" @click=${this._addPerson}>＋ Person hinzufügen</button>
      </div>

      <div class="section-title">Darstellung</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._settingsData}
        .schema=${ze}
        .computeLabel=${e=>Pe[e.name]??e.name}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `}}Fe.styles=n`
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
  `,e([he({attribute:!1})],Fe.prototype,"hass",void 0),e([pe()],Fe.prototype,"_config",void 0),customElements.define("ha-family-board-card-editor",Fe);var Ne=Object.freeze({__proto__:null,FamilyBoardCardEditor:Fe});export{Ce as FamilyBoardCard};
