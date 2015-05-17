/*
 http://creativecommons.org/licenses/by/2.5/
 - Free for use in both personal and commercial projects
 - Attribution requires leaving author name, author link, and the license info intact
*/
(function(){var c=jQuery,x=function(){function c(){this.ja=500;this.za=!0;this.ua=700;this.Da=50;this.Fa=!0;this.la=this.xa=!1}c.prototype.wa=function(a,d){return"Image "+a+" of "+d};return c}(),B=function(){function b(a){this.options=a;this.ca=[];this.da=void 0;this.init()}b.prototype.init=function(){this.enable();this.ya()};b.prototype.enable=function(){var a=this;c("body").on("click","a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]",function(d){a.start(c(d.currentTarget));
return!1})};b.prototype.ya=function(){var a=this;c("<div id='lightboxOverlay' class='lightboxOverlay'></div><div id='lightbox' class='lightbox'><div class='lb-outerContainer'><div class='lb-container'><canvas id='pano-canvas' class='lb-canvas' /><img class='lb-image' src='' /><div class='lb-nav'><a class='lb-prev' href='' ></a><a class='lb-next' href='' ></a></div><div class='lb-pano_nav'><a class='lb-pano_prev' href='' ></a><a class='lb-pano_next' href='' ></a></div><div class='lb-loader'><a class='lb-cancel'></a></div></div></div><div class='lb-dataContainer'><div class='lb-data'><div class='lb-details'><span class='lb-caption'></span><span class='lb-number'></span></div><div class='lb-closeContainer'><a class='lb-close'></a></div></div></div></div>").appendTo(c("body"));
this.ba=c("#lightbox");this.ia=c("#lightboxOverlay");this.fa=this.ba.find(".lb-outerContainer");this.ha=this.ba.find(".lb-container");this.pa=parseInt(this.ha.css("padding-top"),10);this.oa=parseInt(this.ha.css("padding-right"),10);this.ma=parseInt(this.ha.css("padding-bottom"),10);this.na=parseInt(this.ha.css("padding-left"),10);this.ia.hide().on("click",function(){a.end();return!1});this.ba.hide().on("click",function(d){"lightbox"===c(d.target).attr("id")&&a.end();return!1});this.fa.on("click",
function(d){"lightbox"===c(d.target).attr("id")&&a.end();return!1});this.ba.find(".lb-prev").on("click",function(){0===a.da?a.ea(a.ca.length-1):a.ea(a.da-1);return!1});this.ba.find(".lb-next").on("click",function(){a.da===a.ca.length-1?a.ea(0):a.ea(a.da+1);return!1});this.ba.find(".lb-pano_prev").on("click",function(){0===a.da?a.ea(a.ca.length-1):a.ea(a.da-1);return!1});this.ba.find(".lb-pano_next").on("click",function(){a.da===a.ca.length-1?a.ea(0):a.ea(a.da+1);return!1});this.ba.find(".lb-loader, .lb-close").on("click",
function(){a.end();return!1});this.Ca=this.ba.find(".lb-canvas").width();this.Ba=this.ba.find(".lb-canvas").height();this.ba.find(".lb-canvas").width("auto");this.ba.find(".lb-canvas").height("auto")};b.prototype.start=function(a){function d(a){b.ca.push({link:a.attr("href"),title:a.attr("data-title")||a.attr("title"),sa:a.attr("pano-type")})}var b=this,f=c(window);f.on("resize",c.proxy(this.ka,this));c("select, object, embed").css({visibility:"hidden"});this.ka();this.ca=[];var k=0,e=a.attr("data-lightbox");
if(e)for(var e=c(a.prop("tagName")+'[data-lightbox="'+e+'"]'),g=0;g<e.length;g=++g)d(c(e[g])),e[g]===a[0]&&(k=g);else if("lightbox"===a.attr("rel"))d(a);else for(e=c(a.prop("tagName")+'[rel="'+a.attr("rel")+'"]'),g=0;g<e.length;g=++g)d(c(e[g])),e[g]===a[0]&&(k=g);a=f.scrollTop()+this.options.Da;f=f.scrollLeft();this.ba.css({top:a+"px",left:f+"px"}).fadeIn(this.options.ja);this.ea(k)};b.prototype.ea=function(a){var d=this;this.qa();var b=this.ba.find(".lb-image");this.ia.fadeIn(this.options.ja);c(".lb-loader").fadeIn("slow");
this.ba.find(".lb-image, .lb-nav, .lb-prev, .lb-next, .lb-pano_nav, .lb-pano_prev, .lb-pano_next, .lb-dataContainer, .lb-numbers, .lb-caption, .lb-canvas").hide();this.fa.addClass("animating");var f=new Image;f.onload=function(){var k,e;b.attr("src",d.ca[a].link);c(f);null!=d.ca[a].sa&&(null==d.ga&&(d.ga=new Pano,d.ga.init(d.ba.find(".lb-canvas").get(0))),d.ga.isAvailable()&&(f.width=d.Ca,f.height=d.Ba));b.width(f.width);b.height(f.height);d.options.za&&(k=c(window).width(),e=c(window).height(),k=
k-d.na-d.oa-20,e=e-d.pa-d.ma-120,f.width>k||f.height>e)&&(f.width/k>f.height/e?(e=k,k=parseInt(f.height/(f.width/e),10)):(k=e,e=parseInt(f.width/(f.height/k),10)),b.width(e),b.height(k));d.Ha(b.width(),b.height())};f.src=this.ca[a].link;this.da=a};b.prototype.ka=function(){this.ia.width(c(window).width()).height(c(document).height())};b.prototype.Ha=function(a,d){function c(){b.ba.find(".lb-dataContainer").width(g);b.ba.find(".lb-prevLink").height(m);b.ba.find(".lb-nextLink").height(m);null!=b.ca[b.da].sa&&
b.ga.isAvailable()?b.Ga(a,d):b.Ea()}var b=this,k=this.fa.outerWidth(),e=this.fa.outerHeight(),g=a+this.na+this.oa,m=d+this.pa+this.ma;k!==g||e!==m?this.fa.animate({width:g,height:m},this.options.ua,"swing",function(){c()}):c()};b.prototype.Ea=function(){this.ba.find(".lb-loader").hide();this.ba.find(".lb-image").fadeIn("slow");this.Ia();this.va();this.ta();this.ra()};b.prototype.Ga=function(a,b){this.ba.find(".lb-loader").hide();this.ba.find(".lb-canvas").fadeIn("slow");this.Ja();this.va();this.ta();
this.ra();this.ba.find(".lb-canvas").get(0).width=a;this.ba.find(".lb-canvas").get(0).height=b;this.ga.setSize(a,b);var c=this.ba.find(".lb-image");this.ga.setImage(c.get(0))};b.prototype.Ia=function(){var a=!1;try{document.createEvent("TouchEvent"),a=this.options.xa?!0:!1}catch(b){}this.ba.find(".lb-nav").show();1<this.ca.length&&(this.options.la?(a&&this.ba.find(".lb-prev, .lb-next").css("opacity","1"),this.ba.find(".lb-prev, .lb-next").show()):(0<this.da&&(this.ba.find(".lb-prev").show(),a&&this.ba.find(".lb-prev").css("opacity",
"1")),this.da<this.ca.length-1&&(this.ba.find(".lb-next").show(),a&&this.ba.find(".lb-next").css("opacity","1"))))};b.prototype.Ja=function(){this.ba.find(".lb-pano_nav").show();1<this.ca.length&&(this.options.la?(this.ba.find(".lb-pano_prev, .lb-pano_next").css("opacity","1"),this.ba.find(".lb-pano_prev, .lb-pano_next").show()):(0<this.da&&(this.ba.find(".lb-pano_prev").show(),this.ba.find(".lb-pano_prev").css("opacity","1")),this.da<this.ca.length-1&&(this.ba.find(".lb-pano_next").show(),this.ba.find(".lb-pano_next").css("opacity",
"1"))))};b.prototype.va=function(){var a=this;if("undefined"!==typeof this.ca[this.da].title&&""!==this.ca[this.da].title)this.ba.find(".lb-caption").html(this.ca[this.da].title).fadeIn("fast").find("a").on("click",function(){location.href=c(this).attr("href")});1<this.ca.length&&this.options.Fa?this.ba.find(".lb-number").text(this.options.wa(this.da+1,this.ca.length)).fadeIn("fast"):this.ba.find(".lb-number").hide();this.fa.removeClass("animating");this.ba.find(".lb-dataContainer").fadeIn(this.options.ua,
function(){return a.ka()})};b.prototype.ta=function(){this.ca.length>this.da+1&&((new Image).src=this.ca[this.da+1].link);0<this.da&&((new Image).src=this.ca[this.da-1].link)};b.prototype.ra=function(){c(document).on("keyup.keyboard",c.proxy(this.Aa,this))};b.prototype.qa=function(){c(document).off(".keyboard")};b.prototype.Aa=function(a){a=a.keyCode;var b=String.fromCharCode(a).toLowerCase();if(27===a||b.match(/x|o|c/))this.end();else if("p"===b||37===a)0!==this.da?this.ea(this.da-1):this.options.la&&
1<this.ca.length&&this.ea(this.ca.length-1);else if("n"===b||39===a)this.da!==this.ca.length-1?this.ea(this.da+1):this.options.la&&1<this.ca.length&&this.ea(0)};b.prototype.end=function(){this.qa();c(window).off("resize",this.ka);this.ba.fadeOut(this.options.ja);this.ia.fadeOut(this.options.ja);c("select, object, embed").css({visibility:"visible"})};return b}();c(function(){var b=new x;new B(b)})}).call(this);
