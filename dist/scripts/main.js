!function(){"use strict";var e=(function(){return window.location.pathname.indexOf("/fr/")!==-1?"fr":"en"}(),new EventEmitter,function(){function e(){c=$(".ig-form"),l=c.find("form"),r=c.find("form").data("endpoint"),s=c.find("form").data("cancel"),n(),i()}function n(){var e=$(":input, textarea");e.change(function(e){$(this).addClass("dirty")}),$.validator.setDefaults({debug:!0,success:"valid"}),$.validator.addMethod("cdnPostal",function(e,n){return this.optional(n)||e.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/)},"Please specify a valid postal code."),l.validate({submitHandler:function(){t()},errorPlacement:function(e,n){$(n).closest(".row").find(".custom-error-location").length?$(n).closest(".row").find(".custom-error-location").append(e):$(n).parent().append(e)},rules:{phone:{required:!0,phoneUS:!0},phone2:{required:!0,phoneUS:!0},postal_code:{required:!0,cdnPostal:!0},firstname:{required:!0,maxlength:100},lastname:{required:!0,maxlength:100},email:{required:!0,maxlength:100},email2:{required:!0,maxlength:100}}}),l.find("button.cancel").on("click",function(){window.location.replace(s)})}function t(e){var n,t;return l.valid()&&(l.removeClass("server-error"),c.addClass("submitting"),n=l.serializeArray(),t=o(n),a(t)),!1}function o(e){return e}function a(e){$.ajax({method:"POST",url:r,data:e}).success(function(e){c.addClass("success"),c.removeClass("submitting")}).error(function(e){l.addClass("server-error"),c.removeClass("submitting"),ScrollMan.to($("#server-error"))})}function i(){$(".toggler").on("click",function(){$(".toggle-content").hide(),$("."+$(this).data("content")).show()})}var r,s,l,c;return{init:e}}()),n=function(){function e(){console.log("Carousel Initialized!"),$("[data-responsive-toggle] button").on("click",function(){$("body").toggleClass("site-header-is-active")}),n()}function n(){var e,n,t;$(".ig-carousel").each(function(o){t=$(this),e=t.data("prevArrowText")?'<button type="button" class="slick-prev"><span class="show-for-sr">'+t.data("prevArrowText")+"</span></button>":'<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',n=t.data("nextArrowText")?'<button type="button" class="slick-next"><span class="show-for-sr">'+t.data("nextArrowText")+"</span></button>":'<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',t.slick({adaptiveHeight:t.data("adaptiveHeight")||!1,arrows:t.data("arrows")||!1,autoPlay:t.data("autoPlay")||!1,dots:t.data("dots")||!1,fade:t.data("fade")||!1,infinite:t.data("infinite")||!1,mobileFirst:!0,nextArrow:n,prevArrow:e,responsive:t.data("responsive")||"",slide:t.data("slide")||"",slidesToScroll:t.data("slideToScroll")||1,slidesToShow:t.data("slidesToShow")||1,speed:t.data("speed")||300})})}return{init:e}}(),t=function(){function e(){n()}function n(){!function(e){e.fn.infoToggle=function(){return this.each(function(){function n(){s.on("click",t),e(window).on("resize",o),a()}function t(){a(),i.toggleClass("active"),window.setTimeout(a)}function o(){l&&r.css({height:"auto"})}function a(){var e;i.hasClass("active")?(e=r[0].scrollHeight,l=!0):(e=0,l=!1),r.css({height:e}),c&&r.attr("aria-hidden",!l)}var i=e(this),r=i.find(".info-toggle-content"),s=i.find(".info-toggle-trigger"),l=!1,c="true"===i.attr("info-toggle-aria");n()}),this}}(jQuery),function(e){e.fn.circleAnimation=function(n){return this.each(function(){function t(e){e=e?e:0,o(),a.lineWidth=l,a.beginPath(),a.arc(s,s,d,-h,f*-Math.min(e,n/100)-h,!0),a.stroke(),a.lineWidth=c,a.beginPath(),a.arc(s,s,d,-h,f*-e-h,!0),a.stroke(),u++,u<110&&window.requestAnimationFrame(function(){t(u/100)})}function o(){a.fillRect(0,0,i.width,i.width)}var a,i=this,r=e(this),s=i.width/2,l=7,c=1,d=s-l,u=0,f=2*Math.PI,h=Math.PI/2,p=(new Date).getTime()+"CA";r.is("canvas")&&(a=i.getContext("2d"),a.strokeStyle="#0d263c",a.fillStyle="#e5e8e8",r.attr("circle-animation-id",p),e("body").delegate("[circle-animation-id="+p+"]","startAnimate",function(){u=0,t()}),e("body").delegate("[circle-animation-id="+p+"]","clearAnimate",o))}),this}}(jQuery),function(e){e.fn.blockLink=function(){return this.each(function(){function n(){o.on("click",t)}function t(){location=a}var o=e(this),a=o.find("a").attr("href");n()}),this}}(jQuery),function(e){function n(){i=new o,a=new t(i),window.location.pathname.indexOf("/fr/")!==-1&&e("body").addClass("fr"),e('a[href^="#"]').on("click",function(n){var t=e(this.getAttribute("href"));t.length&&(n.preventDefault(),e("html, body").stop().animate({scrollTop:t.offset().top+52},750)),"#"!==t.selector&&(e("#main-menu-anchor").css({display:"none"}),e("body").removeClass("is-reveal-open branded"))}),e(".menu-icon").on("click",function(n){e("body").addClass("is-reveal-open branded")}),e(".top-bar .close-button.show-for-small-only").on("click",function(){e("#main-menu-anchor").css({display:"none"}),e("body").removeClass("is-reveal-open branded")}),e(window).resize(function(){e(window).width()>640&&e("body").removeClass("branded")})}function t(n){function t(){o(),e(".block-link").blockLink(),m=e(".our-business-slider"),e("#edge-overlay-content").find(".carousel-next").on("click",function(e){e.preventDefault(),m.slick("slickNext")}),e(".video-slide.slick-active").length?(e(".slick-list.draggable").css({height:"660px"}),e(".section.profiles-slider").css({backgroundColor:"#e5e8e8"})):(e(".slick-list.draggable").css({height:"auto"}),e(".section.profiles-slider").css({backgroundColor:"#7ec4b9"})),e(".profile-counter").each(function(){var n=e(this);n.find("canvas").circleAnimation(parseInt(n.find("p").html()))}),v=e(".profiles-slider"),e(window).on("hashchange",l),l(),e(window).on("resize",r),f(!0),e(window).on("scroll",s),h(),e(".info-toggle").infoToggle(),e(".top-bar + .screen").on("click",function(){e("a[data-toggle]").trigger("click")}),e(".share-toggle-trigger").on("click",function(n){n.preventDefault(),e(".info-toggle").addClass("active")}),e(".share-toggle-close").on("click",function(n){n.stopPropagation(),n.preventDefault(),e(".info-toggle").toggleClass("active")})}function o(){e("body").delegate(y,"click",function(){var n=e(this),t=n.attr("class").match(/toggle-(\S*)?($|\s)/)[1],o=n.parents(x);o.find(y).removeClass("active"),o.find(C).removeClass("active"),n.addClass("active"),o.find(".content-"+t).addClass("active")})}function a(){var n,t=0;A&&(v.find(".slick-slide").removeClass("slick-complete"),v.find(".slick-active").addClass("slick-complete"),v.find(".slick-slide:not(.slick-complete)").find(".profile-counter canvas").trigger("clearAnimate"),v.find(".slick-complete").find(".profile-counter canvas").trigger("startAnimate"),v.find(".slick-active").is("[class*=profile-]")||S?v.addClass("contrast-arrow"):v.removeClass("contrast-arrow"),n=v.find(".profile-1-slide, .profile-2-slide"),n.css({height:"auto"}),n.each(function(){var n=e(this).outerHeight();n>t&&(t=n)}),n.css({height:t}))}function i(e,n){e.slick("slickSetOption","accessibility",n),e.slick("slickSetOption","draggable",n),e.slick("slickSetOption","swipe",n),e.slick("slickSetOption","touchMove",n)}function r(){w&&window.clearTimeout(w),w=window.setTimeout(f,250)}function s(){b&&window.clearTimeout(b),b=window.setTimeout(h,250)}function l(e){var n="#our-edge-";k||0!==location.hash.indexOf(n)||T.openOverlay($,c,d,!0)}function c(n){var t;g(m,{dots:!1,slidesToShow:1,slidesToScroll:1}),t=m.find("."+location.hash.replace("#our-","")+":not(.slick-cloned)").attr("data-slick-index"),m.slick("slickGoTo",t,!0),m.on("afterChange",u),u(null,null,parseInt(e("#modalOverlay .slick-active").attr("data-slick-index"))),f(),k=!0}function d(n){var t,o=e("#modalOverlay > div");m.slick("unslick"),m.off("afterChange"),e(".overlay-repository").append(o),"pushState"in history?history.pushState("",document.title,location.pathname+location.search):(t=e(document).scrollTop(),location.hash="",e(document).scrollTop(t)),k=!1}function u(n,t,o){var a=(o+1)%(e(".slick-slide:not(.slick-cloned)").length-1),i=e(m.find("[data-slick-index="+a+"] .columns:first-child p").get(0)).html(),r="our-"+m.find("[data-slick-index="+o+"]").attr("class").match(/(edge-\S*)/)[1];e("#modalOverlay .carousel-next a").html(i),location.hash=r}function f(n){var t=e(window).width(),o=0,a=t<o;m.is(".slick-initialized")&&i(m,!a),S!==a?S=a:n&&p()}function h(){A||e(window).scrollTop()+e(window).height()>v.offset().top&&(A=!0,window.setTimeout(a,500))}function p(){g(v,{dots:!0,slidesToShow:1,slidesToScroll:1,adaptiveHeight:!0,prevArrow:'<span type="button" class="carousel-prev"><img src="/content/dam/investorsgroup/app/careers/images/Arrow-MainArticle-Carousel-Black-L.png"></span>',nextArrow:'<span type="button" class="carousel-next"><img src="/content/dam/investorsgroup/app/careers/images/Arrow-MainArticle-Carousel-Black-R.png"></span>'}),a(),v.on("afterChange",a)}function g(n,t){var o={speed:750,dots:!0,slidesToShow:2,slidesToScroll:2,infinite:!0,responsive:[{breakpoint:768,settings:{slidesToShow:1,slidesToScroll:1,infinite:!0}}]};n.slick(e.extend(o,t))}var m,v,w,b,k,y='[class*="toggle-"]:not([class*="info-toggle"])',C='[class*="content-"]',x=".multi-tab-outline",$=e("#edge-overlay-content"),T=n,S=(e("<div></div>"),!1),A=!1;t()}function o(){function n(){f=e("<div></div>"),f.attr("id","modalOverlay"),f.attr("class","reveal"),f.attr("data-reveal",!0),g.append(f),f.on("open.zf.reveal",a),e(window).on("closed.zf.reveal",o),e(window).on("resize",t),i(),new Foundation.Reveal(f)}function t(){h&&window.clearTimeout(h),h=window.setTimeout(u,250)}function o(e){v=!1,m.close&&m.close(e),d(),m={}}function a(n){n.preventDefault(),v=!0,e("body").addClass("is-reveal-open"),f.find("*").foundation(),m.open&&m.open(n),u()}function i(){var n=e("<span></span>");p=e("<button data-close></button>"),p.addClass("close-button"),p.attr("aria-label","Close modal"),n.attr("aria-hidden",!0),n.html("&times;"),p.append(n)}function r(){return v}function s(e,n,t,o){m.open=n,m.close=t,m.full=o,"string"==typeof e?l(e):c(e)}function l(n){e.ajax(n).done(c)}function c(e){f.html(e),f.append(p),m.full&&f.addClass("full"),f.foundation("open")}function d(){f.removeClass("full"),f.removeClass("tour"),f.html("")}function u(){var n=f.height(),t=e(window).height();n>t&&(f.css({top:0}),f.addClass("full"))}var f,h,p,g=e("body"),m={},v=!1;return n(),{openOverlay:s,isOpen:r}}var a,i;n()}(jQuery)}return{init:e}}(),o=function(){function e(){n()}function n(){var e,n,i={},r=["auto","metadata","none"];$(".ig-video-group").each(function(){e=$(this),i.account=e.data("account"),i.player=e.data("player"),t(i),e.find(".ig-video-js").each(function(e){n=$(this),i.id=n.data("id"),i.title=n.data("title")?n.data("title"):"",i.description=n.data("description")?n.data("description"):"",i.auto=n.data("autoplay")?"autoplay":"",i.ctrl=n.data("controls")?"controls":"",i.preload=r.indexOf(n.data("preload"))>-1?n.data("preload"):"auto",a.push(i.id),o(n,i,e)})})}function t(e){var n='<script src="//players.brightcove.net/'+e.account+"/"+e.player+'_default/index.min.js"></script>';$("body").append(n)}function o(e,n,t){var o='<div class="video-container"><span class="video-overlay '+n.id+'"></span><div class="video-container-responsive"><video data-video-id="'+n.id+'" preload="'+n.preload+'" data-account="'+n.account+'" data-player="'+n.player+'" data-embed="default" data-application-id="'+t+'" class="video-js" id="'+n.id+'" '+n.ctrl+" "+n.auto+'></video></div></div><h2 class="video-title">'+n.title+'</h2><p class="video-description">'+n.description+"</p>";e.replaceWith(o)}var a=[];return{init:e}}(),a=function(){function e(){n()}function n(){function e(e){e.searchtype="office",e.name="",$(".zero-results").addClass("hide"),$.getJSON(o,e).always().done(function(e){var n=JSON.parse(e);n.length?($("body").addClass("is-reveal-open"),$("#searchResultsModal").removeClass("closed").html(""),t("office-template",n)):$(".zero-results").removeClass("hide")}).fail(function(e){console.log("Data could not be retrieved, please try again",e.status+" "+e.statusText)})}function n(){var e={},n=a.val();e.city="",e.lang=i,e.searchtype="con";for(var t=n.split(" "),o=0;o<t.length;o++){var s=r.locations.get(t[o]);s.length>0&&(e.city=s[0],t.splice(o,1))}return e.city||(e.city=t.join(" ")),e}function t(e,n){var t=document.getElementById(e).innerHTML;Mustache.parse(t);var o=Mustache.render(t,n);$("#searchResultsModal").append(o),$(document).foundation()}var o="https://search.investorsgroup.com/api/cwpsearch?",a=$("#FindAnOffice"),i="en";window.location.href.indexOf("/fr/")>-1&&(i="fr");var r={},s=["athabasca","bluffton","bonnyville","brooks","calgary","camrose","canmore","drayton valley","edmonton","fort mcmurray","fort saskatchewan","grande prairie","halkirk","hillcrest mines","hinton","leduc","lethbridge","lloydminster","medicine hat","morinville","peace river","pincher creek","provost","red deer","sherwood park","spruce grove","st. albert","stettler","sturgeon county","tofield","vermilion","wainwright","westlock","whitelaw","abbotsford","brackendale","burnaby","burns lake","campbell river","chase","chilliwack","comox","coquitlam","courtenay","cranbrook","dawson creek","duncan","fort nelson","fort st. john","invermere","kamloops","kelowna","langley","merritt","nanaimo","nelson","north vancouver","oliver","penticton","port alberni","powell river","prince george","qualicum beach","quesnel","revelstoke","richmond","saanichton","salmon arm","salt spring island","sechelt","sidney","smithers","surrey","terrace","trail","vancouver","vernon","victoria","westbank","williams lake","brandon","dauphin","flin flon","gillam","killarney","manitou","miami","morden","narol","portage la prairie","selkirk","swan river","the pas","virden","warren","winnipeg","bathurst","bedell","edmundston","fredericton","lansdowne","miramichi","moncton","quispamsis","rexton","rothesay","saint john","saint paul","sussex","blaketown","clarenville","corner brook","gander","grand falls - windsor","marystown","roaches line","st. john's","trinity","amherst","antigonish","barrington passage","belliveau cove","bridgetown","bridgewater","dartmouth","dayton","halifax","middleton","new glasgow","new minas","north sydney","pictou","port hawkesbury","sydney","truro","yellowknife","ajax","algonquin highlands","ancaster","atikokan","barrie","belleville","bowmanville","bracebridge","brampton","brantford","brockville","brooklin","burlington","cambridge","carleton place","chatham","clayton","clinton","cobourg","collingwood","concord","cornwall","dryden","dundas","dunsford","dutton","elliot lake","etobicoke","fort frances","gananoque","garson","greely","grimsby","guelph","haileybury","hamilton","hanover","hearst","huntsville","jerseyville","kanata","kapuskasing","kenora","kingston","kirkland lake","kitchener","langton","lindsay","london","maple","marathon","markham","merrickville","milton","minden","mississauga","mount forest","mount hope","nepean","new liskeard","newmarket","niagara falls","north bay","north york","oak ridges","oakville","orangeville","orillia","orton","oshawa","ottawa","owen sound","parry sound","pembroke","penetanguishene","perth","peterborough","petrolia","pickering","red lake","ridgetown","sarnia","sault ste. marie","scarborough","schreiber","simcoe","sioux lookout","st. catharines","st. marys","stouffville","stratford","sturgeon falls","sudbury","sundridge","thunder bay","tillsonburg","timmins","toronto","trenton","Uxbridge","val caron","walkerton","waterloo","welland","whitby","willowdale","windsor","wingham","woodbridge","charlottetown, pe","souris, pe","summerside, pe","wellington","anjou","boisbriand","boucherville","brossard","châteauguay","chicoutimi","côte saint-luc","dollard-des-ormeaux","gatineau","granby","laval","lévis","mirabel","montreal","new richmond","pointe-claire","québec","sept-iles","sherbrooke","ville st-laurent","westmount","eastend","estevan","esterhazy","foam lake","humboldt","kindersley","leader","maple creek","meadow lake","melfort","melville","moose jaw","north battleford","outlook","oxbow","prince albert","regina","regina beach","rosetown","saskatoon","shellbrook","swift current","watrous","watson","yorkton","whitehorse"];r.locations=new Bloodhound({datumTokenizer:Bloodhound.tokenizers.whitespace,queryTokenizer:Bloodhound.tokenizers.whitespace,local:s}),$(function(){$(".typeahead").typeahead({highlight:!0},{name:"locations",source:r.locations,limit:2}),$(".ig-search").submit(function(t){t.preventDefault();var o=n();e(o)}),$(document).on("click","#searchResultsModal .close-button",function(){$("#searchResultsModal").addClass("closed"),setTimeout(function(){$("body").removeClass("is-reveal-open")},400)})})}return{init:e}}(),i=function(){function i(){$(document).foundation(),$(".ig-form").length&&e.init(),$(".ig-carousel").length&&n.init(),$(".ig-search").length&&a.init(),$(".ig-careers").length&&t.init(),$(".ig-video-group").length&&o.init()}return{init:i}}();$(document).ready(function(){i.init()})}();
