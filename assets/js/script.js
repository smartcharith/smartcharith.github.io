$(function () {    


// setup your carousels as you normally would using JS
// or via data attributes according to the documentation
// https://getbootstrap.com/javascript/#carousel
$('#video-carousel').carousel({ interval: false }); //Disable auto-slide
}());

/*
* Video carousel - Dynamically load in YouTube videos based on 'data-id'
*/
//Load the YouTube Iframe API
var tag = document.createElement('script');

tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


//This will be the object name for interacting with the videos in the rest of this code
var videoArray = new Array();

//Function: onYouTubePlayerAPIReady - Run when API is ready
function onYouTubePlayerAPIReady() {

//Look for video 'data-id' in the '.youtube-video' div
var videos = document.querySelectorAll('#video-carousel .youtube-video');


//Loop through each div found
for (var i = 0; i < videos.length; i++) {

//Create an array to hold the video IDs from 'data-id'
dataset = videos[i].dataset.id;
cclang = videos[i].dataset.lang;
ccpolicy = videos[i].dataset.cc;
	
//This will be the variable name for inserting videos into the HTML divs
var divID = 'vid-' + i.toString();

//Setup video object, configure how videos should be presented
videoArray[i] = new YT.Player(divID, {
height: '100%',
width: '100%',
playerVars: {
'autoplay': 0,
'controls': 1,
'modestbranding': 1,
'rel': 0,
'showinfo': 0,
'loop': 1,
'iv_load_policy': 3,
'cc_lang_pref': cclang,
'cc_load_policy': ccpolicy
},
videoId: dataset, //Uses current looped ID from array
events: {
'onReady': onPlayerReady,
'onStateChange': onPlayerStateChange
}
});

}
}

//Function: onPlayerReady - Run when video player is ready
function onPlayerReady(event) {

//When the Bootstrap Carousel moves
$('#video-carousel').on('slide.bs.carousel', function () {

//Find each Iframe within '#video-carousel'
$(this).find('iframe').each(function(){

//Pause all YouTube videos
event.target.pauseVideo();

});


//Show custom video button
//$('.play-button-wrapper .btn-video').show();

});


}

//Function: onPlayerStateChange - Run when a videos state has changed
function onPlayerStateChange(event) {

//Find all custom video buttons within '#video-carousel'
$("#video-carousel").find('.play-button-wrapper .btn-video').each(function(){

//If video has Ended
if (event.data == YT.PlayerState.ENDED) {
$(this).fadeIn("Slow");//Fade out
$(this).find('i').attr("class", "fa fa-play");
}

//If video is Playing
if (event.data == YT.PlayerState.PLAYING) {
$(this).find('i').attr("class", "fa fa-pause");//Change icon
$(this).fadeOut("Slow");//Fade out
}

//If video is Paused
if (event.data == YT.PlayerState.PAUSED) {
$(this).fadeIn("Slow");//Fade out
$(this).find('i').attr("class", "fa fa-play");
}

//If video is Buffering
if (event.data == YT.PlayerState.BUFFERING) {
$(this).find('i').attr("class", "fa fa-circle-o-notch fa-spin fa-fw");
}

});
}

//Bind Click and Touchstart events to the custom video button
$( ".play-button-wrapper" ).bind("click touchstart", function() {

//Find the active carousel slide and target the Iframe within it
$("#video-carousel").find('.active iframe').each(function(){

//Find the integer from the div ID and split - Use objectID[1] to output the integer
var objectID = $(this).attr('id').split('-');


//If the active slide's video is Playing
if (videoArray[ objectID[1] ].getPlayerState() == 1) {
videoArray[ objectID[1] ].pauseVideo(); //Pause video on click

//If the active slide's video is Paused
} else if (videoArray[ objectID[1] ].getPlayerState() == 2) {
videoArray[ objectID[1] ].playVideo(); //Play video on click

//If the video is doing anything else
} else {
videoArray[ objectID[1] ].playVideo(); //Play video on click
}

});





// Navigation 
    $('.site-navigation').affix({
      offset: {
        top: $('.hero').height()
            }
    });

    var $window = $(window);
    function checkWidth() {
        var windowsize = $window.width();
        if (windowsize < 768) {
            $('.nav a').on('click', function(){
                $('.navbar-toggle').click() //bootstrap 3.x by Richard
            });
        }
    }
    // Execute on load
    checkWidth();
    // Bind event listener
    $(window).resize(checkWidth);

// Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.site-header',
        offset: 10
    });

//jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });

//Counters 
    if ($(".counter-start").length>0) {
        $(".counter-start").each(function() {
            var stat_item = $(this),
            offset = stat_item.offset().top;
            $(window).scroll(function() {
                if($(window).scrollTop() > (offset - 1000) && !(stat_item.hasClass('counting'))) {
                    stat_item.addClass('counting');
                    stat_item.countTo();
                }
            });
        });
    };


// Progress bar 
    var $section = $('.section-skills');
    function loadDaBars() {
        $('.progress .progress-bar').progressbar({
            transition_delay: 500,
            display_text: 'center'
        });
    }
    
    $(document).bind('scroll', function(ev) {
        var scrollOffset = $(document).scrollTop();
        var containerOffset = $section.offset().top - window.innerHeight;
        if (scrollOffset > containerOffset) {
            loadDaBars();
            // unbind event not to load scrolsl again
            $(document).unbind('scroll');
        }
    });

//Team Carousel
    $('#services-carousel').carousel({ interval: false });

    // Carousel touch support
    if($(".carousel-inner").length) {
        $(".carousel-inner").swipe({
            //Generic swipe handler for all directions
            swipeLeft: function (event, direction, distance, duration, fingerCount) {
                $(this).parent().carousel('next');
            },
            swipeRight: function () {
                $(this).parent().carousel('prev');
            },
            //Default is 75px, set to 0 for demo so any distance triggers swipe
            threshold: 50
        });
    }

// Slick.js   
    $('.review-carousel').slick({
        nextArrow: '<button class="slick rectangle slick-next"><i class="fa fa-angle-right" aria-hidden="true"></button>',
        prevArrow: '<button class="slick rectangle slick-prev"><i class="fa fa-angle-left" aria-hidden="true"></button>'
    });

    $('.clients-carousel').slick({
        arrows: false,
        slidesToShow: 5,
        responsive: [ {
            breakpoint : 992,
            settings: {
                slidesToShow: 2
            }
        },
        {
            breakpoint : 480,
            settings: {
                slidesToShow: 1
            }
      }]
    });

//shuffle.js
    var shuffleme = (function( $ ) {
      'use strict';
          var $grid = $('#grid'), //locate what we want to sort 
          $filterOptions = $('.portfolio-sorting li'),  //locate the filter categories

      init = function() {

        // None of these need to be executed synchronously
        setTimeout(function() {
          listen();
          setupFilters();
        }, 100);

        // instantiate the plugin
        $grid.shuffle({
          itemSelector: '[class*="col-"]', 
           group: Shuffle.ALL_ITEMS, 
        });
      },

        
      // Set up button clicks
      setupFilters = function() {
        var $btns = $filterOptions.children();
        $btns.on('click', function(e) {
          e.preventDefault();
          var $this = $(this),
              isActive = $this.hasClass( 'active' ),
              group = isActive ? 'all' : $this.data('group');

          // Hide current label, show current label in title
          if ( !isActive ) {
            $('.portfolio-sorting li a').removeClass('active');
          }

          $this.toggleClass('active');

          // Filter elements
          $grid.shuffle( 'shuffle', group );
        });

        $btns = null;
      },

      // Re layout shuffle when images load. This is only needed
      // below 768 pixels because the .picture-item height is auto and therefore
      // the height of the picture-item is dependent on the image
      // I recommend using imagesloaded to determine when an image is loaded
      // but that doesn't support IE7
      listen = function() {
        var debouncedLayout = $.throttle( 300, function() {
          $grid.shuffle('update');
        });

        // Get all images inside shuffle
        $grid.find('img').each(function() {
          var proxyImage;

          // Image already loaded
          if ( this.complete && this.naturalWidth !== undefined ) {
            return;
          }

          // If none of the checks above matched, simulate loading on detached element.
          proxyImage = new Image();
          $( proxyImage ).on('load', function() {
            $(this).off('load');
            debouncedLayout();
          });

          proxyImage.src = this.src;
        });

        // Because this method doesn't seem to be perfect.
        setTimeout(function() {
          debouncedLayout();
        }, 500);
      };      

      return {
        init: init
      };
    }( jQuery ));

    if($('#grid').length >0 ) { 
      shuffleme.init(); //filter portfolio
    };
}());
