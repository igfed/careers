///<reference path="../interfaces/jquery/jquery.d.ts" />
///<reference path="../interfaces/greensock/greensock.d.ts" />
///<reference path="../interfaces/Scrollman.d.ts" />
var Intro = (function () {
    function Intro(el) {
        var _this = this;
        this.el = el;
        //var bkBtn = <HTMLElement>this.el.querySelector('.backbtn');
        //if (bkBtn) {
        //    bkBtn.addEventListener('click', function(e){
        //        e.preventDefault();
        //
        //        var curLoc = window.location.pathname.split('/');
        //        var ix = curLoc.indexOf('en');
        //        if (ix === -1) ix = curLoc.indexOf('fr');
        //        var rootlang = curLoc.slice(0, ix+1).join('/');
        //        window.location = <any>(rootlang+'#areas');
        //    })
        //}
        var scrollDownBtn = this.el.querySelector('.morebtn');
        scrollDownBtn.addEventListener('click', function (e) {
            igTrack('SCROLL_MORE', scrollDownBtn.getAttribute('data-tracking-label'));
            ScrollMan.toNextElementFrom(_this.el);
        });
        this.build();
    }
    Intro.prototype.build = function () {
    };
    return Intro;
})();
///<reference path="components/Intro.ts" />
var Landing1 = (function () {
    function Landing1() {
        this.build();
    }
    Landing1.prototype.build = function () {
        new Intro(document.querySelector('.intro.section'));
    };
    return Landing1;
})();
window['Landing1'] = Landing1;
window.addEventListener('load', function () {
    window.removeEventListener('load', this);
    console.log('Landing1 onload');
    new Landing1();
});
