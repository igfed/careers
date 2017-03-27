!function(){"use strict";var e=(function(){return window.location.pathname.indexOf("/fr/")!==-1?"fr":"en"}(),new EventEmitter,function(){function e(){c=$(".ig-form"),l=c.find("form"),r=c.find("form").data("endpoint"),s=c.find("form").data("cancel"),t(),i()}function t(){var e=$(":input, textarea");e.change(function(e){$(this).addClass("dirty")}),$.validator.setDefaults({debug:!0,success:"valid"}),$.validator.addMethod("cdnPostal",function(e,t){return this.optional(t)||e.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/)},"Please specify a valid postal code."),l.validate({submitHandler:function(){n()},errorPlacement:function(e,t){$(t).closest(".row").find(".custom-error-location").length?$(t).closest(".row").find(".custom-error-location").append(e):$(t).parent().append(e)},rules:{phone:{required:!0,phoneUS:!0},phone2:{required:!0,phoneUS:!0},postal_code:{required:!0,cdnPostal:!0},firstname:{required:!0,maxlength:100},lastname:{required:!0,maxlength:100},email:{required:!0,maxlength:100},email2:{required:!0,maxlength:100}}}),l.find("button.cancel").on("click",function(){window.location.replace(s)})}function n(e){var t,n;return l.valid()&&(l.removeClass("server-error"),c.addClass("submitting"),t=l.serializeArray(),n=o(t),a(n)),!1}function o(e){return e}function a(e){$.ajax({method:"POST",url:r,data:e}).success(function(e){c.addClass("success"),c.removeClass("submitting")}).error(function(e){l.addClass("server-error"),c.removeClass("submitting"),ScrollMan.to($("#server-error"))})}function i(){$(".toggler").on("click",function(){$(".toggle-content").hide(),$("."+$(this).data("content")).show()})}var r,s,l,c;return{init:e}}()),t=function(){function e(){console.log("Carousel Initialized!"),$("[data-responsive-toggle] button").on("click",function(){$("body").toggleClass("site-header-is-active")}),t()}function t(){var e,t,n;$(".ig-carousel").each(function(o){n=$(this),e=n.data("prevArrowText")?'<button type="button" class="slick-prev"><span class="show-for-sr">'+n.data("prevArrowText")+"</span></button>":'<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',t=n.data("nextArrowText")?'<button type="button" class="slick-next"><span class="show-for-sr">'+n.data("nextArrowText")+"</span></button>":'<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',n.slick({adaptiveHeight:n.data("adaptiveHeight")||!1,arrows:n.data("arrows")||!1,autoPlay:n.data("autoPlay")||!1,dots:n.data("dots")||!1,fade:n.data("fade")||!1,infinite:n.data("infinite")||!1,mobileFirst:!0,nextArrow:t,prevArrow:e,responsive:n.data("responsive")||"",slide:n.data("slide")||"",slidesToScroll:n.data("slideToScroll")||1,slidesToShow:n.data("slidesToShow")||1,speed:n.data("speed")||300})})}return{init:e}}(),n=function(){function e(){t()}function t(){!function(e){e.fn.infoToggle=function(){return this.each(function(){function t(){s.on("click",n),e(window).on("resize",o),a()}function n(){a(),i.toggleClass("active"),window.setTimeout(a)}function o(){l&&r.css({height:"auto"})}function a(){var e;i.hasClass("active")?(e=r[0].scrollHeight,l=!0):(e=0,l=!1),r.css({height:e}),c&&r.attr("aria-hidden",!l)}var i=e(this),r=i.find(".info-toggle-content"),s=i.find(".info-toggle-trigger"),l=!1,c="true"===i.attr("info-toggle-aria");t()}),this}}(jQuery),function(e){e.fn.circleAnimation=function(t){return this.each(function(){function n(e){e=e?e:0,o(),a.lineWidth=l,a.beginPath(),a.arc(s,s,d,-h,f*-Math.min(e,t/100)-h,!0),a.stroke(),a.lineWidth=c,a.beginPath(),a.arc(s,s,d,-h,f*-e-h,!0),a.stroke(),u++,u<110&&window.requestAnimationFrame(function(){n(u/100)})}function o(){a.fillRect(0,0,i.width,i.width)}var a,i=this,r=e(this),s=i.width/2,l=7,c=1,d=s-l,u=0,f=2*Math.PI,h=Math.PI/2,p=(new Date).getTime()+"CA";r.is("canvas")&&(a=i.getContext("2d"),a.strokeStyle="#0d263c",a.fillStyle="#e5e8e8",r.attr("circle-animation-id",p),e("body").delegate("[circle-animation-id="+p+"]","startAnimate",function(){u=0,n()}),e("body").delegate("[circle-animation-id="+p+"]","clearAnimate",o))}),this}}(jQuery),function(e){e.fn.blockLink=function(){return this.each(function(){function t(){o.on("click",n)}function n(){location=a}var o=e(this),a=o.find("a").attr("href");t()}),this}}(jQuery),function(e){function t(){i=new o,a=new n(i),window.location.pathname.indexOf("/fr/")!==-1&&e("body").addClass("fr"),e('a[href^="#"]').on("click",function(t){var n=e(this.getAttribute("href"));n.length&&(t.preventDefault(),e("html, body").stop().animate({scrollTop:n.offset().top+52},750)),"#"!==n.selector&&(e("#main-menu-anchor").css({display:"none"}),e("body").removeClass("is-reveal-open branded"))}),e(".menu-icon").on("click",function(t){e("body").addClass("is-reveal-open branded")}),e(".top-bar .close-button.show-for-small-only").on("click",function(){e("#main-menu-anchor").css({display:"none"}),e("body").removeClass("is-reveal-open branded")}),e(window).resize(function(){e(window).width()>640&&e("body").removeClass("branded")})}function n(t){function n(){o(),e(".block-link").blockLink(),v=e(".our-business-slider"),e("#edge-overlay-content").find(".carousel-next").on("click",function(e){e.preventDefault(),v.slick("slickNext")}),e(".video-slide.slick-active").length?(e(".slick-list.draggable").css({height:"660px"}),e(".section.profiles-slider").css({backgroundColor:"#e5e8e8"})):(e(".slick-list.draggable").css({height:"auto"}),e(".section.profiles-slider").css({backgroundColor:"#7ec4b9"})),e(".profile-counter").each(function(){var t=e(this);t.find("canvas").circleAnimation(parseInt(t.find("p").html()))}),m=e(".profiles-slider"),e(window).on("hashchange",l),l(),e(window).on("resize",r),f(!0),e(window).on("scroll",s),h(),e(".info-toggle").infoToggle(),e(".top-bar + .screen").on("click",function(){e("a[data-toggle]").trigger("click")}),e(".share-toggle-trigger").on("click",function(t){t.preventDefault(),e(".info-toggle").addClass("active")}),e(".share-toggle-close").on("click",function(t){t.stopPropagation(),t.preventDefault(),e(".info-toggle").toggleClass("active")})}function o(){e("body").delegate(y,"click",function(){var t=e(this),n=t.attr("class").match(/toggle-(\S*)?($|\s)/)[1],o=t.parents($);o.find(y).removeClass("active"),o.find(C).removeClass("active"),t.addClass("active"),o.find(".content-"+n).addClass("active")})}function a(){var t,n=0;A&&(m.find(".slick-slide").removeClass("slick-complete"),m.find(".slick-active").addClass("slick-complete"),m.find(".slick-slide:not(.slick-complete)").find(".profile-counter canvas").trigger("clearAnimate"),m.find(".slick-complete").find(".profile-counter canvas").trigger("startAnimate"),m.find(".slick-active").is("[class*=profile-]")||S?m.addClass("contrast-arrow"):m.removeClass("contrast-arrow"),t=m.find(".profile-1-slide, .profile-2-slide"),t.css({height:"auto"}),t.each(function(){var t=e(this).outerHeight();t>n&&(n=t)}),t.css({height:n}))}function i(e,t){e.slick("slickSetOption","accessibility",t),e.slick("slickSetOption","draggable",t),e.slick("slickSetOption","swipe",t),e.slick("slickSetOption","touchMove",t)}function r(){w&&window.clearTimeout(w),w=window.setTimeout(f,250)}function s(){b&&window.clearTimeout(b),b=window.setTimeout(h,250)}function l(e){var t="#our-edge-";k||0!==location.hash.indexOf(t)||T.openOverlay(x,c,d,!0)}function c(t){var n;g(v,{dots:!1,slidesToShow:1,slidesToScroll:1}),n=v.find("."+location.hash.replace("#our-","")+":not(.slick-cloned)").attr("data-slick-index"),v.slick("slickGoTo",n,!0),v.on("afterChange",u),u(null,null,parseInt(e("#modalOverlay .slick-active").attr("data-slick-index"))),f(),k=!0}function d(t){var n,o=e("#modalOverlay > div");v.slick("unslick"),v.off("afterChange"),e(".overlay-repository").append(o),"pushState"in history?history.pushState("",document.title,location.pathname+location.search):(n=e(document).scrollTop(),location.hash="",e(document).scrollTop(n)),k=!1}function u(t,n,o){var a=(o+1)%(e(".slick-slide:not(.slick-cloned)").length-1),i=e(v.find("[data-slick-index="+a+"] .columns:first-child p").get(0)).html(),r="our-"+v.find("[data-slick-index="+o+"]").attr("class").match(/(edge-\S*)/)[1];e("#modalOverlay .carousel-next a").html(i),location.hash=r}function f(t){var n=e(window).width(),o=0,a=n<o;v.is(".slick-initialized")&&i(v,!a),S!==a?S=a:t&&p()}function h(){A||e(window).scrollTop()+e(window).height()>m.offset().top&&(A=!0,window.setTimeout(a,500))}function p(){g(m,{dots:!0,slidesToShow:1,slidesToScroll:1,adaptiveHeight:!0,prevArrow:'<span type="button" class="carousel-prev ga-careers-our-people-carousel-scroll"><img src="/content/dam/investorsgroup/app/careers/images/Arrow-MainArticle-Carousel-Black-L.png"></span>',nextArrow:'<span type="button" class="carousel-next ga-careers-our-people-carousel-scroll"><img src="/content/dam/investorsgroup/app/careers/images/Arrow-MainArticle-Carousel-Black-R.png"></span>'}),a(),m.on("afterChange",a)}function g(t,n){var o={speed:750,dots:!0,dotsClass:"slick-dots ga-careers-our-people-carousel-scroll",slidesToShow:2,slidesToScroll:2,infinite:!0,responsive:[{breakpoint:768,settings:{slidesToShow:1,slidesToScroll:1,infinite:!0}}]};t.slick(e.extend(o,n))}var v,m,w,b,k,y='[class*="toggle-"]:not([class*="info-toggle"])',C='[class*="content-"]',$=".multi-tab-outline",x=e("#edge-overlay-content"),T=t,S=(e("<div></div>"),!1),A=!1;n()}function o(){function t(){f=e("<div></div>"),f.attr("id","modalOverlay"),f.attr("class","reveal"),f.attr("data-reveal",!0),g.append(f),f.on("open.zf.reveal",a),e(window).on("closed.zf.reveal",o),e(window).on("resize",n),i(),new Foundation.Reveal(f)}function n(){h&&window.clearTimeout(h),h=window.setTimeout(u,250)}function o(e){m=!1,v.close&&v.close(e),d(),v={}}function a(t){t.preventDefault(),m=!0,e("body").addClass("is-reveal-open"),f.find("*").foundation(),v.open&&v.open(t),u()}function i(){var t=e("<span></span>");p=e("<button data-close></button>"),p.addClass("close-button"),p.attr("aria-label","Close modal"),t.attr("aria-hidden",!0),t.html("&times;"),p.append(t)}function r(){return m}function s(e,t,n,o){v.open=t,v.close=n,v.full=o,"string"==typeof e?l(e):c(e)}function l(t){e.ajax(t).done(c)}function c(e){f.html(e),f.append(p),v.full&&f.addClass("full"),f.foundation("open")}function d(){f.removeClass("full"),f.removeClass("tour"),f.html("")}function u(){var t=f.height(),n=e(window).height();t>n&&(f.css({top:0}),f.addClass("full"))}var f,h,p,g=e("body"),v={},m=!1;return t(),{openOverlay:s,isOpen:r}}var a,i;t()}(jQuery)}return{init:e}}(),o=function(){function e(){t()}function t(){var e,t,i={},r=["auto","metadata","none"];$(".ig-video-group").each(function(){e=$(this),i.account=e.data("account"),i.player=e.data("player"),n(i),e.find(".ig-video-js").each(function(e){t=$(this),i.id=t.data("id"),i.title=t.data("title")?t.data("title"):"",i.description=t.data("description")?t.data("description"):"",i.auto=t.data("autoplay")?"autoplay":"",i.ctrl=t.data("controls")?"controls":"",i.preload=r.indexOf(t.data("preload"))>-1?t.data("preload"):"auto",a.push(i.id),o(t,i,e)})})}function n(e){var t='<script src="//players.brightcove.net/'+e.account+"/"+e.player+'_default/index.min.js"></script>';$("body").append(t)}function o(e,t,n){var o='<div class="video-container"><span class="video-overlay '+t.id+'"></span><div class="video-container-responsive"><video data-setup=\'{"techOrder": ["html5"]}\' data-video-id="'+t.id+'" preload="'+t.preload+'" data-account="'+t.account+'" data-player="'+t.player+'" data-embed="default" data-application-id="'+n+'" class="video-js" id="'+t.id+'" '+t.ctrl+" "+t.auto+'></video></div></div><h2 class="video-title">'+t.title+'</h2><p class="video-description">'+t.description+"</p>";e.replaceWith(o)}var a=[];return{init:e}}(),a=function(){function e(){t()}function t(){function e(e){e.searchtype="office",e.name="",$(".zero-results").addClass("hide"),$.getJSON(o,e).always().done(function(e){var t=JSON.parse(e);t.length?($("body").addClass("is-reveal-open"),$("#searchResultsModal").removeClass("closed").html(""),n("office-template",t)):$(".zero-results").removeClass("hide")}).fail(function(e){console.log("Data could not be retrieved, please try again",e.status+" "+e.statusText)})}function t(){var e={},t=a.val();e.city="",e.lang=i,e.searchtype="con";for(var n=t.split(" "),o=0;o<n.length;o++){var s=r.locations.get(n[o]);s.length>0&&(e.city=s[0],n.splice(o,1))}return e.city||(e.city=n.join(" ")),e}function n(e,t){var n=document.getElementById(e).innerHTML;Mustache.parse(n);var o=Mustache.render(n,t);$("#searchResultsModal").append(o),$(document).foundation()}var o="https://search.investorsgroup.com/api/cwpsearch?",a=$("#FindAnOffice"),i="en";window.location.href.indexOf("/fr/")>-1&&(i="fr");var r={},s=["athabasca","bluffton","bonnyville","brooks","calgary","camrose","canmore","drayton valley","edmonton","fort mcmurray","fort saskatchewan","grande prairie","halkirk","hillcrest mines","hinton","leduc","lethbridge","lloydminster","medicine hat","morinville","peace river","pincher creek","provost","red deer","sherwood park","spruce grove","st. albert","stettler","sturgeon county","tofield","vermilion","wainwright","westlock","whitelaw","abbotsford","brackendale","burnaby","burns lake","campbell river","chase","chilliwack","comox","coquitlam","courtenay","cranbrook","dawson creek","duncan","fort nelson","fort st. john","invermere","kamloops","kelowna","langley","merritt","nanaimo","nelson","north vancouver","oliver","penticton","port alberni","powell river","prince george","qualicum beach","quesnel","revelstoke","richmond","saanichton","salmon arm","salt spring island","sechelt","sidney","smithers","surrey","terrace","trail","vancouver","vernon","victoria","westbank","williams lake","brandon","dauphin","flin flon","gillam","killarney","manitou","miami","morden","narol","portage la prairie","selkirk","swan river","the pas","virden","warren","winnipeg","bathurst","bedell","edmundston","fredericton","lansdowne","miramichi","moncton","quispamsis","rexton","rothesay","saint john","saint paul","sussex","blaketown","clarenville","corner brook","gander","grand falls - windsor","marystown","roaches line","st. john's","trinity","amherst","antigonish","barrington passage","belliveau cove","bridgetown","bridgewater","dartmouth","dayton","halifax","middleton","new glasgow","new minas","north sydney","pictou","port hawkesbury","sydney","truro","yellowknife","ajax","algonquin highlands","ancaster","atikokan","barrie","belleville","bowmanville","bracebridge","brampton","brantford","brockville","brooklin","burlington","cambridge","carleton place","chatham","clayton","clinton","cobourg","collingwood","concord","cornwall","dryden","dundas","dunsford","dutton","elliot lake","etobicoke","fort frances","gananoque","garson","greely","grimsby","guelph","haileybury","hamilton","hanover","hearst","huntsville","jerseyville","kanata","kapuskasing","kenora","kingston","kirkland lake","kitchener","langton","lindsay","london","maple","marathon","markham","merrickville","milton","minden","mississauga","mount forest","mount hope","nepean","new liskeard","newmarket","niagara falls","north bay","north york","oak ridges","oakville","orangeville","orillia","orton","oshawa","ottawa","owen sound","parry sound","pembroke","penetanguishene","perth","peterborough","petrolia","pickering","red lake","ridgetown","sarnia","sault ste. marie","scarborough","schreiber","simcoe","sioux lookout","st. catharines","st. marys","stouffville","stratford","sturgeon falls","sudbury","sundridge","thunder bay","tillsonburg","timmins","toronto","trenton","Uxbridge","val caron","walkerton","waterloo","welland","whitby","willowdale","windsor","wingham","woodbridge","charlottetown, pe","souris, pe","summerside, pe","wellington","anjou","boisbriand","boucherville","brossard","châteauguay","chicoutimi","côte saint-luc","dollard-des-ormeaux","gatineau","granby","laval","lévis","mirabel","montreal","new richmond","pointe-claire","québec","sept-iles","sherbrooke","ville st-laurent","westmount","eastend","estevan","esterhazy","foam lake","humboldt","kindersley","leader","maple creek","meadow lake","melfort","melville","moose jaw","north battleford","outlook","oxbow","prince albert","regina","regina beach","rosetown","saskatoon","shellbrook","swift current","watrous","watson","yorkton","whitehorse"];r.locations=new Bloodhound({datumTokenizer:Bloodhound.tokenizers.whitespace,queryTokenizer:Bloodhound.tokenizers.whitespace,local:s}),$(function(){$(".typeahead").typeahead({highlight:!0},{name:"locations",source:r.locations,limit:2}),$(".ig-search").submit(function(n){n.preventDefault();var o=t();e(o)}),$(document).on("click","#searchResultsModal .close-button",function(){$("#searchResultsModal").addClass("closed"),setTimeout(function(){$("body").removeClass("is-reveal-open")},400)})})}return{init:e}}(),i=function(){function i(){$(document).foundation(),$(".ig-form").length&&e.init(),$(".ig-carousel").length&&t.init(),$(".ig-search").length&&a.init(),$(".ig-careers").length&&n.init(),$(".ig-video-group").length&&o.init(),$(".ig-evt1").length&&evt1.init(".ig-evt1"),$(".ig-evt2").length&&evt2.init(".ig-evt2")}return{init:i}}();$(document).ready(function(){i.init()})}();