var wnd, doc, body, ie = 11,
    minFPwidth = 1024,
    minFPheight = 650,
    pageSlider,
    scrolling = false,
    pageSliderLoaded = false,
    pageSliderParams = {
        //Navigation
        menu: '#menu',
        lockAnchors: false,
        anchors: ['firstPage', 'secondPage', 'thirdPage', 'forthPage', 'fifthPage', 'sixthPage', 'seventhPage', 'eighthPage'],
        navigation: true,
        navigationPosition: 'right',
        //navigationTooltips: ['firstSlide', 'secondSlide', 'thirdSlide', 'forthSlide'],
        showActiveTooltip: false,
        slidesNavigation: true,
        slidesNavPosition: 'bottom',

        //Scrolling
        css3: true,
        scrollingSpeed: 600,
        autoScrolling: true,
        fitToSection: true,
        fitToSectionDelay: 1000,
        scrollBar: false,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: true,
        continuousVertical: false,
        normalScrollElements: '#element1, .element2',
        scrollOverflow: false,
        touchSensitivity: 15,
        normalScrollElementTouchThreshold: 5,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        //Design
        controlArrows: true,
        verticalCentered: true,
        resize: true,
        //sectionsColor: ['#ccc', '#f00', '#ff0', '#00f'],
        paddingTop: '0',
        paddingBottom: '0',
        fixedElements: '#header, #footer',
        responsiveWidth: 0,
        responsiveHeight: 0,

        //Custom selectors
        sectionSelector: '.slide_section',
        slideSelector: '.slide',

        //events
        onLeave: function (index, nextIndex, direction) {
            body.toggleClass('show_go_top header_fixed', nextIndex != 1);
        },
        afterLoad: function (anchorLink, index) {
            setSectionBS();
        },
        afterRender: function () {
            pageSliderLoaded = true;
        },
        afterResize: function () {
        },
        afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {

        },
        onSlideLeave: function (anchorLink, index, slideIndex, direction, nextSlideIndex) {
        }
    };

function ieCheck() {

    var myNav = navigator.userAgent.toLowerCase(),
        html = document.documentElement;

    if ((myNav.indexOf('msie') != -1)) {
        ie = ((myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false);
        html.className += ' mustdie';
        html.className += ' ie' + ie;
    } else if (!!myNav.match(/trident.*rv\:11\./)) {
        ie = 11;
        html.className += ' ie' + ie;
    }

    if (myNav.indexOf('safari') != -1) {
        if (myNav.indexOf('chrome') == -1) {
            html.className += ' safari';
        } else {
            html.className += ' chrome';
        }
    }

    if (myNav.indexOf('firefox') != -1) {
        html.className += ' firefox';
    }

    if ((myNav.indexOf('windows') != -1)) {
        html.className += ' windows';
    }
}

ieCheck();

if (ie < 9) {
    alert('Обновите браузер');
} else {

    $(function ($) {

        wnd = $(window);
        doc = $(document);
        body = $('body');

        $('.openMenu').on ('click', function () {
            body.toggleClass('open_menu');
            return false;
        });

        $('.closeMenu').on ('click', function () {
            body.removeClass('open_menu');
            return false;
        });

        body.delegate('.scrollDown', 'click', function () {
            var curSection = $(this).closest('.slide_section');

            if (pageSliderLoaded) {
                $.fn.fullpage.moveTo(curSection.index() + 2);
            } else {
                if (curSection.next().length) {
                    scrolling = true;
                    docScrollTo(curSection.next().offset().top, 600, function () {
                        scrolling = false;
                    });
                }
            }

            return false;

        }).delegate('.menuLink', 'click', function () {
            var firedEl = $(this), targetSection = $(firedEl.attr('href'));

            if (pageSliderLoaded) {
                $.fn.fullpage.moveTo(targetSection.index() + 1);
            } else {
                docScrollTo(targetSection.offset().top, 600, function () {
                    scrolling = false;
                    //firedEl.parent().addClass('active').siblings().removeClass('active');
                });
            }

            return false;
        });

    });

    function getPseudoAttr(el, prop, val) {
        var ret = window.getComputedStyle(
            el[0], prop
        ).getPropertyValue(val);

        return ret;
    }

    function docScrollTo(pos, speed, callback) {

        $('html,body').animate({'scrollTop': pos}, speed, function () {
            if (typeof(callback) == 'function') {
                callback();
            }
        });
    }

    function setSectionBS() {
        var section = $('.slide_section');

        section.each(function () {
            var sctn = $(this);
            sctn.backstretch(getBSImg(sctn), {fade: 0});
        });
    }

    function getBSImg(el) {

        if (wnd.width() < 1024 && el.attr('data-bs-1024') != void 0) {
            return el.attr('data-bs-1024');
        }

        return el.attr('data-bs');

    }

    $(window).on('load', function () {
        if (ie < 9) return;

        checkSections();

        initMainSlider();

        fitMainSlider();

    }).on('resize', function () {
        if (ie < 9) return;

        checkSections();

        fitMainSlider();

        setSectionBS();

    }).on('scroll', function () {
        if (ie < 9) return;

        if (!scrolling) {

            setTimeout(function () {
                var activeSctn = 0, sctn = $('.slide_section');

                for (var i = 0; i < sctn.length; i++) {
                    if (doc.scrollTop() >= $(sctn[i]).offset().top) {
                        activeSctn = i;
                        continue;
                    }
                }

                $('.menuLink[href=#' + $(sctn[activeSctn]).attr('id') + ']').parent().addClass('active').siblings().removeClass('active');
            }, 10);
        }

    });

    function checkSections() {

        if (wnd.width() < 1024) {
            $('.selfSection').not('.self').each(function () {
                var stamp = getRandomInt(100000, 10000000), sctn = $(this), parent = sctn.closest('.selfSectionParent'), spacer = $('<div class="selfSpacer" />').attr('data-self-stamp', stamp);

                sctn
                    .addClass('self')
                    .attr('data-self-stamp', stamp)
                    .after(spacer);

                var newSctn = $('<div class="slide_section fp-section fp-table" />')
                    .addClass(sctn.attr('data-self-section'))
                    //.attr('data-bs', sctn.attr('data-bs'))
                    .attr('data-bs-1024', sctn.attr('data-bs-1024'))
                    .attr('id', sctn.attr('data-self-section-id'))
                    .append($('<div class="scroll-down_btn scrollDown" />'))
                    .append(
                        $('<div class="fp-tableCell" />')
                            .append($('<div class="section_inner" />').append(sctn))
                    );

                parent.find('.backstretch').remove();

                newSctn.insertAfter(parent);

            });
        } else {
            $('.selfSection.self').each(function () {
                var sctn = $(this),
                    stamp = sctn.attr('data-self-stamp'),
                    parent = sctn.closest('.slide_section'),
                    spacer = $('.selfSpacer[data-self-stamp=' + stamp + ']');

                sctn.removeClass('self').attr('data-self-stamp', stamp).insertAfter(spacer);

                parent.find('.backstretch').remove();

                parent.remove();

                spacer.remove();

            });
        }


    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function fitMainSlider() {

        var allowFP = (getPseudoAttr(body, ':before', 'content')).replace(/\D*/ig, '') * 1;

        if (!allowFP) {

            if (pageSliderLoaded) {

                pageSliderLoaded = false;

                $.fn.fullpage.destroy();

                $('#fp-nav').remove();

            }
        } else {
            if (!pageSliderLoaded) {
                initMainSlider();
            }
        }
    }

    function initMainSlider() {

        if (pageSliderLoaded) {
            return;
        } else {
        }

        $('.fp-table').removeAttr('style').removeClass('fp-table');

        $('.fp-tableCell').each(function (ind) {
            var cell = $(this);

            cell.after(cell.html());
            cell.remove();
        });

        $('.pageSlider').fullpage(pageSliderParams);

    }

}
