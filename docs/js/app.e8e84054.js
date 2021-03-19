(function(e){function t(t){for(var r,n,l=t[0],s=t[1],c=t[2],p=0,h=[];p<l.length;p++)n=l[p],Object.prototype.hasOwnProperty.call(i,n)&&i[n]&&h.push(i[n][0]),i[n]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);u&&u(t);while(h.length)h.shift()();return o.push.apply(o,c||[]),a()}function a(){for(var e,t=0;t<o.length;t++){for(var a=o[t],r=!0,l=1;l<a.length;l++){var s=a[l];0!==i[s]&&(r=!1)}r&&(o.splice(t--,1),e=n(n.s=a[0]))}return e}var r={},i={app:0},o=[];function n(t){if(r[t])return r[t].exports;var a=r[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=r,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/risk-maps/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],s=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var u=s;o.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("cd49")},"034f":function(e,t,a){"use strict";a("85ec")},"1acf":function(e,t,a){"use strict";a("aaf2")},"85ec":function(e,t,a){},aaf2:function(e,t,a){},cd49:function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var r=a("2b0e"),i=a("5f5b"),o=a("b1e0"),n=(a("f9e3"),a("2dd8"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[a("b-navbar",{attrs:{type:"light",variant:"light"}},[a("b-container",[a("b-navbar-brand",[e._v("TrIAS risk maps")])],1)],1),a("Home"),a("footer",{staticClass:"bg-dark text-muted"},[a("b-container",[a("b-row",[a("b-col",{attrs:{cols:"9"}},[e._v(" Created by the "),a("a",{attrs:{href:"https://oscibio.inbo.be"}},[e._v("Open science lab for biodiversity")]),e._v(" for "),a("a",{attrs:{href:"http://trias-project.be"}},[e._v("Tracking Invasive Alien Species (TrIAS)")]),e._v(". ")]),a("b-col",{staticClass:"text-right",attrs:{cols:"3"}},[a("a",{attrs:{href:"https://github.com/trias-project/risk-maps/"}},[e._v("Source code")]),e._v(" version "),a("code",[a("a",{attrs:{href:"#"}},[e._v("x")])])])],1)],1)],1)],1)}),l=[],s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("main",[a("b-container",{staticClass:"mt-3 d-none"},[a("p",[e._v("Disclaimer ...")])]),a("b-container",{attrs:{fluid:""}},[a("b-row",[a("b-col",{staticClass:"bg-dark text-light pt-3"},[a("b-form",[a("b-row",[a("b-col",{attrs:{lg:"7"}},[a("b-form-group",{attrs:{label:"Species","label-cols":"3"}},[a("b-form-select",{attrs:{options:e.availableSpecies,size:"sm"},model:{value:e.speciesId,callback:function(t){e.speciesId=t},expression:"speciesId"}})],1)],1),a("b-col",{attrs:{lg:"5"}},[a("b-form-group",{attrs:{label:"Show","label-cols":"3"}},[a("b-form-radio-group",{attrs:{id:"btn-radios-1",options:e.modelOrRealizedOptions,buttons:"","button-variant":"outline-secondary",size:"sm",name:"radios-btn-default"},model:{value:e.modelOrRealized,callback:function(t){e.modelOrRealized=t},expression:"modelOrRealized"}})],1)],1)],1),a("b-row",[a("b-col",{attrs:{lg:"7"}},[a("b-form-group",{attrs:{label:"Model scenario","label-cols":"3"}},[a("b-form-select",{attrs:{options:e.availableScenarii,size:"sm",disabled:!e.modelCurrentlyVisible},model:{value:e.climateScenarioId,callback:function(t){e.climateScenarioId=t},expression:"climateScenarioId"}})],1)],1),a("b-col",{attrs:{lg:"5"}},[a("b-form-group",{attrs:{label:"Model type","label-cols":"3"}},[a("b-form-select",{attrs:{options:e.availableMapTypes,size:"sm",disabled:!e.modelCurrentlyVisible},model:{value:e.mapTypeId,callback:function(t){e.mapTypeId=t},expression:"mapTypeId"}})],1)],1)],1)],1)],1)],1),a("Map",{attrs:{"geotiff-url":e.geotiffUrl,"occurrences-url":e.occurrencesUrl,"overlays-conf":e.overlaysConf,topic:e.mapTopic,showOccurrenceLayer:e.occurrencesCurrentlyVisible,showGeotiffLayer:e.modelCurrentlyVisible}})],1)],1)},c=[],u=(a("d81d"),a("99af"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-row",{staticClass:"bg-light py-3"},[a("b-col",{attrs:{cols:"9"}},[a("b-alert",{attrs:{show:e.loadError,variant:"warning"}},[e._v("GeoTiff missing for this selection")]),a("div",{attrs:{id:"map"}})],1),a("b-col",{attrs:{cols:"3"}},[a("b-form",[a("b-form-group",{attrs:{label:"Overlays"}},[a("b-form-select",{attrs:{options:e.availableOverlaysForSelect,size:"sm"},model:{value:e.currentOverlayUrl,callback:function(t){e.currentOverlayUrl=t},expression:"currentOverlayUrl"}}),a("b-form-text",{attrs:{id:"highlightedRegion"}},[e._v(" "+e._s(e.highlightedFeatureName)+" ")])],1),a("b-form-group",{attrs:{label:"Data layer opacity"}},[a("b-form-input",{attrs:{disabled:!e.showGeotiffLayer,id:"opacity",type:"range",min:"0",max:"1",step:"0.01"},model:{value:e.geotifDataLayerOpacity,callback:function(t){e.geotifDataLayerOpacity=t},expression:"geotifDataLayerOpacity"}}),e.showGeotiffLayer?a("color-legend",{attrs:{"color-scale":e.colorScale,opacity:e.geotifDataLayerOpacity,topic:e.topic}}):e._e()],1)],1)],1)],1)}),p=[],h=(a("7db0"),a("b0c0"),a("d3b7"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{style:e.styleObjectDivPrepared,attrs:{id:"legend"}},[a("canvas",{ref:"canvas",style:e.styleCanvasPrepared,attrs:{height:e.canvasHeight,width:e.canvasWidth}}),a("svg",{staticStyle:{position:"absolute",left:"0px",top:"0px"},attrs:{height:e.styleDiv.height,width:e.styleDiv.width}},[a("g",{directives:[{name:"axis",rawName:"v-axis",value:{scale:e.legendScale,tickLabels:e.legendTickLabels},expression:"{'scale': legendScale, 'tickLabels': legendTickLabels}"}],staticClass:"axis",attrs:{transform:"translate("+(e.canvasWidth+1)+", "+e.styleDiv.margin.top+")"}})])])}),f=[],d=(a("159b"),a("5698")),y=r["default"].extend({name:"ColorLegend",props:["colorScale","opacity","topic"],data:function(){return{styleDiv:{height:200,width:200,margin:{top:10,right:170,bottom:10,left:2}}}},directives:{axis:function(e,t){var a=t.value.scale,r=t.value.tickLabels,i=d["a"](a).tickSize(6).tickFormat((function(e,t){return r[t]})).ticks(r.length-1);i(d["g"](e))}},watch:{opacity:{handler:function(e){this.clearCanvas(),this.renderColorRamp(e)}}},methods:{clearCanvas:function(){var e=this.ctx;null!=e&&e.clearRect(0,0,this.canvasWidth,this.canvasHeight)},addOpacityToColor:function(e,t){var a=d["b"](e);if(null!=a)return a.opacity=t,a+"";throw"colorStr is not a correct CSS color specifier"},renderColorRamp:function(e){var t=this,a=this.ctx;if(null==a)throw"No canvas context found";d["d"](this.styleDiv.height).forEach((function(r){a.fillStyle=t.addOpacityToColor(t.colorScale(t.legendScale.invert(r)),e),a.fillRect(0,r,t.canvasWidth,1)}))}},mounted:function(){this.renderColorRamp(this.opacity)},computed:{legendTickLabels:function(){return["0 - low ".concat(this.topic),"1 - high ".concat(this.topic)]},legendScale:function(){return d["e"]().range([this.styleDiv.height-this.styleDiv.margin.top-this.styleDiv.margin.bottom,1]).domain(this.colorScale.domain())},ctx:function(){return this.$refs.canvas.getContext("2d")},styleObjectDivPrepared:function(){return{display:"inline-block",position:"relative",height:this.styleDiv.height+"px",width:this.styleDiv.width+"px"}},styleCanvasPrepared:function(){return{height:this.canvasHeight+"px",width:this.canvasWidth+"px",border:"1px solid #000",position:"absolute",top:this.styleDiv.margin.top+"px",left:this.styleDiv.margin.left+"px"}},canvasWidth:function(){return this.styleDiv.width-this.styleDiv.margin.left-this.styleDiv.margin.right},canvasHeight:function(){return this.styleDiv.height-this.styleDiv.margin.top-this.styleDiv.margin.bottom}}}),v=y,m=a("2877"),b=Object(m["a"])(v,h,f,!1,null,null,null),g=b.exports,x=a("e11e"),O=a.n(x),L=a("d2d1"),w=a.n(L),S=a("7b8e"),C=a.n(S),k=a("a79f");window["proj4"]=k["a"];var D="",M=r["default"].extend({name:"Map",props:{geotiffUrl:{type:String,default:null},occurrencesUrl:{type:String,default:null},overlaysConf:{type:Array,default:function(){return[]}},topic:{type:String},showOccurrenceLayer:{type:Boolean},showGeotiffLayer:{type:Boolean}},data:function(){return{lMapObj:null,currentOverlayLayer:null,currentOverlayUrl:"",highlightedFeatureName:D,highlightedFeatureKeyValue:"",initialMapPosition:[50.47294859181385,4.4839374800019005],initialZoomLevel:8,occurrenceLayer:null,geotifDataLayer:null,georasterTopic:"risk",geotifDataLayerOpacity:.7,colorScale:d["f"](d["c"]).domain([0,1]),loadError:!1}},computed:{currentOverlayConf:function(){var e=this;return this.overlaysConf.find((function(t){return t.url===e.currentOverlayUrl}))},overlayLayerVisible:function(){return null!=this.currentOverlayLayer},availableOverlaysForSelect:function(){var e=this.overlaysConf.map((function(e){return{text:e.name,value:e.url}}));return e.unshift({text:"None",value:""}),e}},mounted:function(){this.initMap(this.initialMapPosition,this.initialZoomLevel),this.prepareOccurrenceLayer(this.occurrencesUrl),this.prepareGeotifLayer(this.geotiffUrl)},watch:{showGeotiffLayer:{handler:function(e){!0===e?this.geotifDataLayer.addTo(this.lMapObj):this.geotifDataLayer.removeFrom(this.lMapObj)}},showOccurrenceLayer:{handler:function(e){!0===e?(this.occurrenceLayer.addTo(this.lMapObj),this.occurrenceLayer.bringToFront()):this.occurrenceLayer.removeFrom(this.lMapObj)}},geotifDataLayerOpacity:{handler:function(e){this.geotifDataLayer.setOpacity(e)}},currentOverlayUrl:{handler:function(e){var t=this;this.currentOverlayLayer&&(this.currentOverlayLayer.removeFrom(this.lMapObj),this.currentOverlayLayer=null),""!==e&&fetch(e).then((function(e){return e.json()})).then((function(e){t.currentOverlayLayer=O.a.geoJSON(e,{style:t.overlayStyle,onEachFeature:t.onEachFeature}),t.currentOverlayLayer.addTo(t.lMapObj)}))}},geotiffUrl:{handler:function(e){this.geotifDataLayer.removeFrom(this.lMapObj),this.prepareGeotifLayer(e)}},occurrencesUrl:{handler:function(e){this.occurrenceLayer.removeFrom(this.lMapObj),this.prepareOccurrenceLayer(e)}}},components:{ColorLegend:g},methods:{resetHighlight:function(){this.currentOverlayLayer.resetStyle(),this.highlightedFeatureName=D,this.highlightedFeatureKeyValue=""},overlayStyle:function(){return{fillColor:"#DC571D",weight:2,opacity:1,color:"#DC571D",fillOpacity:0}},highlightFeature:function(e){var t=this;this.currentOverlayConf&&(this.highlightedFeatureName=e.target.feature.properties[this.currentOverlayConf.nameProperty],this.highlightedFeatureKeyValue=e.target.feature.properties[this.currentOverlayConf.keyProperty],this.currentOverlayLayer.eachLayer((function(e){e.feature.properties[t.currentOverlayConf.keyProperty]==t.highlightedFeatureKeyValue&&(e.setStyle({fillOpacity:.6}),O.a.Browser.ie||O.a.Browser.opera||O.a.Browser.edge||e.bringToFront())})))},onEachFeature:function(e,t){t.on({mouseover:this.highlightFeature,mouseout:this.resetHighlight})},initMap:function(e,t){this.lMapObj=O.a.map("map").setView(e,t);var a=O.a.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'});a.addTo(this.lMapObj)},prepareOccurrenceLayer:function(e){var t=this;fetch(e).then((function(e){return e.json()})).then((function(e){t.occurrenceLayer=O.a.geoJSON(e),t.showOccurrenceLayer&&t.occurrenceLayer.addTo(t.lMapObj)}))},prepareGeotifLayer:function(e){var t=this,a=function(e){if(!e.ok)throw Error(e.statusText);return e};fetch(e).then(a).then((function(e){return e.arrayBuffer()})).then((function(e){w()(e).then((function(e){t.geotifDataLayer=new C.a({georaster:e,opacity:t.geotifDataLayerOpacity,pixelValuesToColorFn:function(e){return e[0]<-1e4?"rgba(0, 0, 0, 0)":t.colorScale(e[0])},resolution:64}),t.showGeotiffLayer&&t.geotifDataLayer.addTo(t.lMapObj),t.loadError=!1}))})).catch((function(){t.loadError=!0}))}}}),P=M,T=(a("1acf"),Object(m["a"])(P,u,p,!1,null,"65cebc24",null)),_=T.exports,j=r["default"].extend({name:"Home",props:{},data:function(){var e=[{value:2489010,text:"Acridotheres cristatellus (Linnaeus, 1758)"},{value:2498388,text:"Aix galericulata (Linnaeus, 1758)"},{value:2498387,text:"Aix sponsa (Linnaeus, 1758)"},{value:2498110,text:"Anas sibilatrix Poeppig, 1829"},{value:5281901,text:"Campylopus introflexus Bridel, 1819"},{value:5189032,text:"Corbicula fluminalis (O.F.Müller, 1774)"},{value:8190231,text:"Corbicula fluminea (O.F.Müller, 1774)"},{value:3663237,text:"Cornus sanguinea subsp. australis (C.A.Mey.) Jáv."},{value:8421432,text:"Cornus sanguinea subsp. hungarica (Kárpáti) Soó"},{value:3082244,text:"Cornus sericea L."},{value:2715482,text:"Cyperus eragrostis Lam."},{value:2716226,text:"Cyperus esculentus L."},{value:5220136,text:"Dama dama (Linnaeus, 1758)"},{value:8745918,text:"Deroceras invadens Reise, Hutchinson, Schunack & Schlitt, 2011"},{value:7190901,text:"Graptemys pseudogeographica pseudogeographica"},{value:2891783,text:"Impatiens balfourii Hook.fil."},{value:2891774,text:"Impatiens capensis Meerb."},{value:2891770,text:"Impatiens glandulifera Royle"},{value:2891782,text:"Impatiens parviflora DC."},{value:9291405,text:"Massylaea vermiculata (O.F.Müller, 1774)"},{value:2479407,text:"Myiopsitta monachus (Boddaert, 1783)"},{value:2455523,text:"Orthriophis taeniurus (Cope, 1861)"},{value:9185677,text:"Podarcis siculus (Rafinesque-schmaltz, 1810)"},{value:5192470,text:"Potamopyrgus antipodarum (Gray, 1843)"},{value:5229055,text:"Psittacula eupatria (Linnaeus, 1766)"},{value:2479226,text:"Psittacula krameri (Scopoli, 1769)"},{value:3003709,text:"Rosa glauca Pourr."},{value:3003244,text:"Rosa multiflora Thunb."},{value:2992543,text:"Rubus laciniatus Willd."},{value:2993761,text:"Rubus spectabilis Pursh"},{value:4559541,text:"Sinanodonta woodiana (I.Lea, 1834)"},{value:9202318,text:"Symphyotrichum lanceolatum (Willd.) G.L.Nesom"},{value:3151618,text:"Symphyotrichum novae-angliae (L.) G.L.Nesom"},{value:3151558,text:"Symphyotrichum novi-belgii (L.) G.L.Nesom"},{value:7826906,text:"Thectocercus acuticaudatus (Vieillot, 1818)"},{value:2882849,text:"Vaccinium corymbosum L."},{value:7777960,text:"Vaccinium macrocarpum Aiton"}];return{speciesId:e[1].value,availableSpecies:e,climateScenarioId:"hist",availableScenarii:[{value:"hist",text:"model based on historical climate data"},{value:"rcp26",text:"model based on climate forecasts under RCP 2.6 for 2040-2070"},{value:"rcp45",text:"model based on climate forecasts under RCP 4.5 for 2040-2070"},{value:"rcp85",text:"model based on climate forecasts under RCP 8.5 for 2040-2070"}],mapTypeId:"",availableMapTypes:[{value:"",text:"risk map"},{value:"diff",text:"map of difference in risk between the RCP climate scenario risk maps and the risk map based on historical climate"},{value:"conf",text:"map of confidence of predicted risk for each risk map"}],modelOrRealized:"model",modelOrRealizedOptions:[{text:"Modelled data",value:"model"},{text:"Occurrence data",value:"realized"},{text:"Both",value:"both"}],publicPath:"/risk-maps/"}},methods:{},computed:{modelCurrentlyVisible:function(){return"realized"!==this.modelOrRealized},occurrencesCurrentlyVisible:function(){return"model"!==this.modelOrRealized},mapTopic:function(){switch(this.mapTypeId){case"diff":return"risk difference";case"conf":return"confidence";default:return"risk"}},overlaysConf:function(){var e=this;return[{filename:"ecoregions.geojson",label:"Ecoregions",keyProperty:"REGION",nameProperty:"REGION"},{filename:"bioregions.geojson",label:"Bioregions",keyProperty:"PK_UID",nameProperty:"name"}].map((function(t){return{url:"".concat(e.publicPath,"overlays/").concat(t.filename),name:t.label,keyProperty:t.keyProperty,nameProperty:t.nameProperty}}))},occurrencesUrl:function(){return"".concat(this.publicPath,"occurrences/be_").concat(this.speciesId,"_occurrences.geojson")},geotiffUrl:function(){return this.selectionMade?""===this.mapTypeId?"".concat(this.publicPath,"geotiffs/be_").concat(this.speciesId,"_").concat(this.climateScenarioId,".4326.tif"):"".concat(this.publicPath,"geotiffs/be_").concat(this.speciesId,"_").concat(this.climateScenarioId,"_").concat(this.mapTypeId,".4326.tif"):""},selectionMade:function(){return null!=this.climateScenarioId&&null!=this.speciesId&&null!=this.mapTypeId}},components:{Map:_}}),I=j,F=Object(m["a"])(I,s,c,!1,null,null,null),R=F.exports,z=r["default"].extend({name:"App",components:{Home:R}}),G=z,U=(a("034f"),Object(m["a"])(G,n,l,!1,null,null,null)),E=U.exports;r["default"].config.productionTip=!1,r["default"].use(i["a"]),r["default"].use(o["a"]),new r["default"]({render:function(e){return e(E)}}).$mount("#app")}});
//# sourceMappingURL=app.e8e84054.js.map