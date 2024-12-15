$(function () {
    // Setup your carousels
    $('#video-carousel').carousel({ interval: false }); // Disable auto-slide

    /*
     * Load YouTube Iframe API for the video carousel
     */
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var videoArray = [];

    function onYouTubePlayerAPIReady() {
        // Look for video 'data-id' in the '.youtube-video' div
        var videos = document.querySelectorAll('#video-carousel .youtube-video');
        videos.forEach((video, index) => {
            const dataset = video.dataset.id;
            const cclang = video.dataset.lang;
            const ccpolicy = video.dataset.cc;
            const divID = `vid-${index}`;

            // Setup YouTube Player
            videoArray[index] = new YT.Player(divID, {
                height: '100%',
                width: '100%',
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    loop: 1,
                    iv_load_policy: 3,
                    cc_lang_pref: cclang,
                    cc_load_policy: ccpolicy,
                },
                videoId: dataset,
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
            });
        });
    }

    function onPlayerReady(event) {
        // Pause all videos on carousel slide change
        $('#video-carousel').on('slide.bs.carousel', function () {
            $('#video-carousel iframe').each(() => {
                event.target.pauseVideo();
            });
        });
    }

    function onPlayerStateChange(event) {
        // Manage Play/Pause buttons
        $("#video-carousel .play-button-wrapper .btn-video").each(function () {
            const $button = $(this);

            if (event.data === YT.PlayerState.ENDED) {
                $button.fadeIn("slow").find('i').attr("class", "fa fa-play");
            } else if (event.data === YT.PlayerState.PLAYING) {
                $button.find('i').attr("class", "fa fa-pause").fadeOut("slow");
            } else if (event.data === YT.PlayerState.PAUSED) {
                $button.fadeIn("slow").find('i').attr("class", "fa fa-play");
            }
        });
    }

    // Play/Pause Button Handler
    $(".play-button-wrapper").on("click touchstart", function () {
        $("#video-carousel .active iframe").each(function () {
            const objectID = $(this).attr('id').split('-')[1];
            const playerState = videoArray[objectID].getPlayerState();

            if (playerState === YT.PlayerState.PLAYING) {
                videoArray[objectID].pauseVideo();
            } else {
                videoArray[objectID].playVideo();
            }
        });
    });

    /*
     * General Navigation and Scroll Behavior
     */
    $('.site-navigation').affix({
        offset: {
            top: $('.hero').height(),
        },
    });

    const $window = $(window);

    function checkWidth() {
        const windowsize = $window.width();
        if (windowsize < 768) {
            $('.nav a').on('click', function () {
                $('.navbar-toggle').click();
            });
        }
    }

    checkWidth();
    $window.resize(checkWidth);

    // Highlight navigation on scroll
    $('body').scrollspy({
        target: '.site-header',
        offset: 10,
    });

    // Smooth scrolling for page links
    $(document).on('click', '.page-scroll a', function (event) {
        const $anchor = $(this);
        $('html, body').stop().animate(
            {
                scrollTop: $($anchor.attr('href')).offset().top,
            },
            1000,
            'easeInOutExpo'
        );
        event.preventDefault();
    });

    /*
     * Counters
     */
    if ($(".counter-start").length > 0) {
        $(".counter-start").each(function () {
            const stat_item = $(this);
            const offset = stat_item.offset().top;

            $(window).scroll(function () {
                if ($(window).scrollTop() > offset - 1000 && !stat_item.hasClass('counting')) {
                    stat_item.addClass('counting');
                    stat_item.countTo();
                }
            });
        });
    }

    /*
     * Progress Bars
     */
    const $section = $('.section-skills');

    function loadDaBars() {
        $('.progress .progress-bar').progressbar({
            transition_delay: 500,
            display_text: 'center',
        });
    }

    $(document).on('scroll', function () {
        const scrollOffset = $(document).scrollTop();
        const containerOffset = $section.offset().top - window.innerHeight;

        if (scrollOffset > containerOffset) {
            loadDaBars();
            $(document).off('scroll');
        }
    });

    /*
     * Team Carousel
     */
    $('#services-carousel').carousel({ interval: false });

    // Touch support for carousel
    if ($(".carousel-inner").length) {
        $(".carousel-inner").swipe({
            swipeLeft: function () {
                $(this).parent().carousel('next');
            },
            swipeRight: function () {
                $(this).parent().carousel('prev');
            },
            threshold: 50,
        });
    }

    /*
     * Slick.js Carousels
     */
    $('.review-carousel').slick({
        nextArrow: '<button class="slick rectangle slick-next"><i class="fa fa-angle-right" aria-hidden="true"></button>',
        prevArrow: '<button class="slick rectangle slick-prev"><i class="fa fa-angle-left" aria-hidden="true"></button>',
    });

    $('.clients-carousel').slick({
        arrows: false,
        slidesToShow: 5,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    });

    /*
     * Shuffle.js for Portfolio Filtering
     */
    const shuffleme = (function ($) {
        'use strict';
        const $grid = $('#grid');
        const $filterOptions = $('.portfolio-sorting li');

        function init() {
            setTimeout(function () {
                listen();
                setupFilters();
            }, 100);

            $grid.shuffle({
                itemSelector: '[class*="col-"]',
                group: Shuffle.ALL_ITEMS,
            });
        }

        function setupFilters() {
            const $btns = $filterOptions.children();

            $btns.on('click', function (e) {
                e.preventDefault();
                const $this = $(this);
                const isActive = $this.hasClass('active');
                const group = isActive ? 'all' : $this.data('group');

                if (!isActive) {
                    $('.portfolio-sorting li a').removeClass('active');
                }

                $this.toggleClass('active');
                $grid.shuffle('shuffle', group);
            });
        }

        function listen() {
            const debouncedLayout = $.throttle(300, function () {
                $grid.shuffle('update');
            });

            $grid.find('img').each(function () {
                if (this.complete && this.naturalWidth !== undefined) {
                    return;
                }

                const proxyImage = new Image();
                $(proxyImage).on('load', function () {
                    $(this).off('load');
                    debouncedLayout();
                });

                proxyImage.src = this.src;
            });

            setTimeout(debouncedLayout, 500);
        }

        return {
            init: init,
        };
    })(jQuery);

    if ($('#grid').length > 0) {
        shuffleme.init();
    }
});
