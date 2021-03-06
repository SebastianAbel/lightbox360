/**
 * Lightbox v2.7.1
 * by Lokesh Dhakar - http://lokeshdhakar.com/projects/lightbox2/
 *
 * @license http://creativecommons.org/licenses/by/2.5/
 * - Free for use in both personal and commercial projects
 * - Attribution requires leaving author name, author link, and the license info intact
 */

(function() {
  // Use local alias
  var $ = jQuery;

  var LightboxOptions = (function() {
    function LightboxOptions() {
      this.fadeDuration                = 500;
      this.fitImagesInViewport         = true;
      this.resizeDuration              = 700;
      this.positionFromTop             = 50;
      this.showImageNumberLabel        = true;
      this.alwaysShowNavOnTouchDevices = false;
      this.wrapAround                  = false;
    }
    
    // Change to localize to non-english language
    LightboxOptions.prototype.albumLabel = function(curImageNum, albumSize) {
      return "Image " + curImageNum + " of " + albumSize;
    };

    return LightboxOptions;
  })();


  var Lightbox = (function() {
    function Lightbox(options) {
      this.options           = options;
      this.album             = [];
      this.currentImageIndex = void 0;
      this.init();
    }

    Lightbox.prototype.init = function() {
      this.enable();
      this.build();
    };

    // Loop through anchors and areamaps looking for either data-lightbox attributes or rel attributes
    // that contain 'lightbox'. When these are clicked, start lightbox.
    Lightbox.prototype.enable = function() {
      var self = this;
      $('body').on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function(event) {
        self.start($(event.currentTarget));
        return false;
      });
    };

    // Build html for the lightbox and the overlay.
    // Attach event handlers to the new DOM elements. click click click
    Lightbox.prototype.build = function() {
      var self = this;
      $("<div id='lightboxOverlay' class='lightboxOverlay'></div><div id='lightbox' class='lightbox'><div class='lb-outerContainer'><div class='lb-container'><canvas id='pano-canvas' class='lb-canvas' /><img class='lb-image' src='' /><div class='lb-nav'><a class='lb-prev' href='' ></a><a class='lb-next' href='' ></a></div><div class='lb-pano_nav'><a class='lb-pano_prev' href='' ></a><a class='lb-pano_play' href='' ></a><a class='lb-pano_pause' href='' ></a><a class='lb-pano_next' href='' ></a></div><div class='lb-pano_control'><a class='lb-pano_full' href='' ></a><a class='lb-pano_full_back' href='' ></a><input type=range class='lb-pano_zoom' min=0 value=40 max=100 /></div><div class='lb-loader'><a class='lb-cancel'></a></div></div></div><div class='lb-dataContainer'><div class='lb-data'><div class='lb-details'><span class='lb-caption'></span><span class='lb-number'></span></div><div class='lb-closeContainer'><a class='lb-close'></a></div></div></div></div>").appendTo($('body'));
      
      // Cache jQuery objects
      this.$lightbox       = $('#lightbox');
      this.$overlay        = $('#lightboxOverlay');
      this.$outerContainer = this.$lightbox.find('.lb-outerContainer');
      this.$container      = this.$lightbox.find('.lb-container');

      // Store css values for future lookup
      this.containerTopPadding = parseInt(this.$container.css('padding-top'), 10);
      this.containerRightPadding = parseInt(this.$container.css('padding-right'), 10);
      this.containerBottomPadding = parseInt(this.$container.css('padding-bottom'), 10);
      this.containerLeftPadding = parseInt(this.$container.css('padding-left'), 10);
     
      // Attach event handlers to the newly minted DOM elements
      this.$overlay.hide().on('click', function() {
        self.end();
        return false;
      });

      this.$lightbox.hide().on('click', function(event) {
        if ($(event.target).attr('id') === 'lightbox') {
          self.end();
        }
        return false;
      });

      this.$outerContainer.on('click', function(event) {
        if ($(event.target).attr('id') === 'lightbox') {
          self.end();
        }
        return false;
      });

      this.$lightbox.find('.lb-prev').on('click', function() {
        if (self.currentImageIndex === 0) {
          self.changeImage(self.album.length - 1);
        } else {
          self.changeImage(self.currentImageIndex - 1);
        }
        return false;
      });

      this.$lightbox.find('.lb-next').on('click', function() {
        if (self.currentImageIndex === self.album.length - 1) {
          self.changeImage(0);
        } else {
          self.changeImage(self.currentImageIndex + 1);
        }
        return false;
      });
      
      this.$lightbox.find('.lb-pano_prev').on('click', function() {
        if (self.currentImageIndex === 0) {
          self.changeImage(self.album.length - 1);
        } else {
          self.changeImage(self.currentImageIndex - 1);
        }
        return false;
      });

      this.$lightbox.find('.lb-pano_next').on('click', function() {
        if (self.currentImageIndex === self.album.length - 1) {
          self.changeImage(0);
        } else {
          self.changeImage(self.currentImageIndex + 1);
        }
        return false;
      }); 

      this.$lightbox.find('.lb-loader, .lb-close').on('click', function() {
        self.end();
        return false;
      });
      
      this.$lightbox.find('.lb-pano_full').on('click', function() {
        self.panoFullscreen();
        return false;
      });
      
      this.$lightbox.find('.lb-pano_full_back').on('click', function() {
        self.panoFullscreenBack();
        return false;
      });
      
      this.$lightbox.find('.lb-pano_zoom').on('input', function() {
        self.panoZoom(self.$lightbox.find('.lb-pano_zoom').val());
        return false;
      });
      
      this.$lightbox.find('.lb-pano_play').on('click', function() {
        self.panoPlay();
        return false;
      });
      
      this.$lightbox.find('.lb-pano_pause').on('click', function() {
        self.panoPause();
        return false;
      });
      
      this.panoWidth = this.$lightbox.find('.lb-canvas').width();
      this.panoHeight = this.$lightbox.find('.lb-canvas').height();
      this.$lightbox.find('.lb-canvas').width('auto');
      this.$lightbox.find('.lb-canvas').height('auto');
    };

    // Show overlay and lightbox. If the image is part of a set, add siblings to album array.
    Lightbox.prototype.start = function($link) {
      var self    = this;
      var $window = $(window);

      $window.on('resize', $.proxy(this.sizeOverlay, this));

      $('select, object, embed').css({
        visibility: "hidden"
      });

      this.sizeOverlay();

      this.album = [];
      var imageNumber = 0;

      function addToAlbum($link) {
        self.album.push({
          link: $link.attr('href'),
          title: $link.attr('data-title') || $link.attr('title'),
          panoType: $link.attr('pano-type'),
          panoWidth: $link.attr('pano-width'),
          panoHeight: $link.attr('pano-height'),
          panoFps: $link.attr('pano-fps')
        });
      }

      // Support both data-lightbox attribute and rel attribute implementations
      var dataLightboxValue = $link.attr('data-lightbox');
      var $links;

      if (dataLightboxValue) {
        $links = $($link.prop("tagName") + '[data-lightbox="' + dataLightboxValue + '"]');
        for (var i = 0; i < $links.length; i = ++i) {
          addToAlbum($($links[i]));
          if ($links[i] === $link[0]) {
            imageNumber = i;
          }
        }
      } else {
        if ($link.attr('rel') === 'lightbox') {
          // If image is not part of a set
          addToAlbum($link);
        } else {
          // If image is part of a set
          $links = $($link.prop("tagName") + '[rel="' + $link.attr('rel') + '"]');
          for (var j = 0; j < $links.length; j = ++j) {
            addToAlbum($($links[j]));
            if ($links[j] === $link[0]) {
              imageNumber = j;
            }
          }
        }
      }
      
      // Position Lightbox
      var top  = $window.scrollTop() + this.options.positionFromTop;
      var left = $window.scrollLeft();
      this.$lightbox.css({
        top: top + 'px',
        left: left + 'px'
      }).fadeIn(this.options.fadeDuration);

      this.changeImage(imageNumber);
    };

    // Hide most UI elements in preparation for the animated resizing of the lightbox.
    Lightbox.prototype.changeImage = function(imageNumber) {
      var self = this;

      this.disableKeyboardNav();
      var $image = this.$lightbox.find('.lb-image');

      this.$overlay.fadeIn(this.options.fadeDuration);

      $('.lb-loader').fadeIn('slow');
      this.$lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();
      this.$lightbox.find('.lb-canvas, .lb-pano_nav, .lb-pano_prev, .lb-pano_next, .lb-pano_control, .lb-pano_full, .lb-pano_full_back, .lb-pano_play, .lb-pano_pause').hide();

      this.$outerContainer.addClass('animating');

	  if (this.panoObject != null)
      {
      	if (this.panoObject.hasVideo())
      	{
      		this.panoObject.clearVideo();
      	}
      }
      this.currentImageIndex = imageNumber;
     
	  if (this.album[imageNumber].panoType == "sphere-video")
	  {
	  	var preloader = new Image();
	    if (this.panoObject == null)
		{
			this.panoObject = new Pano();
	    	this.panoObject.init(this.$lightbox.find('.lb-canvas').get(0));
	    }
	    if (this.panoObject.isAvailable())
	    {
	    	
	    	
    		preloader.width = this.album[imageNumber].panoWidth != null ? this.album[imageNumber].panoWidth : this.panoWidth;
      		preloader.height = this.album[imageNumber].panoHeight != null ? this.album[imageNumber].panoHeight : this.panoHeight;
	    
	    	$image.width(preloader.width);
        	$image.height(preloader.height);
	        
	        if (this.options.fitImagesInViewport) {
	          // Fit image inside the viewport.
	          // Take into account the border around the image and an additional 10px gutter on each side.
	
	          windowWidth    = $(window).width();
	          windowHeight   = $(window).height();
	          maxImageWidth  = windowWidth - this.containerLeftPadding - this.containerRightPadding - 20;
	          maxImageHeight = windowHeight - this.containerTopPadding - this.containerBottomPadding - 120;
	
	          // Is there a fitting issue?
	          if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
	            if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
	              imageWidth  = maxImageWidth;
	              imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
	              $image.width(imageWidth);
	              $image.height(imageHeight);
	            } else {
	              imageHeight = maxImageHeight;
	              imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
	              $image.width(imageWidth);
	              $image.height(imageHeight);
	            }
	          }
	        }
	        this.sizeContainer($image.width(), $image.height());
	      };
	      preloader.src = this.album[imageNumber].link;
	  }
	  else
	  {
	  
	      // When image to show is preloaded, we send the width and height to sizeContainer()
	      var preloader = new Image();
	      preloader.onload = function() {
	        var $preloader, imageHeight, imageWidth, maxImageHeight, maxImageWidth, windowHeight, windowWidth;
	        $image.attr('src', self.album[imageNumber].link);
	
	        $preloader = $(preloader);
	
		    if (self.album[imageNumber].panoType != null)
		    {
		    	if (self.panoObject == null)
			    {
					self.panoObject = new Pano();
			    	self.panoObject.init(self.$lightbox.find('.lb-canvas').get(0));
			    }
			    if (self.panoObject.isAvailable())
			    {
		    		preloader.width = self.album[imageNumber].panoWidth != null ? self.album[imageNumber].panoWidth : self.panoWidth;
		      		preloader.height = self.album[imageNumber].panoHeight != null ? self.album[imageNumber].panoHeight : self.panoHeight;
			    }
		    }
	
	        $image.width(preloader.width);
	        $image.height(preloader.height);
	        
	        
	        if (self.options.fitImagesInViewport) {
	          // Fit image inside the viewport.
	          // Take into account the border around the image and an additional 10px gutter on each side.
	
	          windowWidth    = $(window).width();
	          windowHeight   = $(window).height();
	          maxImageWidth  = windowWidth - self.containerLeftPadding - self.containerRightPadding - 20;
	          maxImageHeight = windowHeight - self.containerTopPadding - self.containerBottomPadding - 120;
	
	          // Is there a fitting issue?
	          if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
	            if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
	              imageWidth  = maxImageWidth;
	              imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
	              $image.width(imageWidth);
	              $image.height(imageHeight);
	            } else {
	              imageHeight = maxImageHeight;
	              imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
	              $image.width(imageWidth);
	              $image.height(imageHeight);
	            }
	          }
	        }
	        self.sizeContainer($image.width(), $image.height());
	      };
	
	      preloader.src = this.album[imageNumber].link;
	  }
     
    };

    // Stretch overlay to fit the viewport
    Lightbox.prototype.sizeOverlay = function() {
      this.$overlay
        .width($(window).width())
        .height($(document).height());
    };

    // Animate the size of the lightbox to fit the image we are showing
    Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight) {
      var self = this;
      
      var oldWidth  = this.$outerContainer.outerWidth();
      var oldHeight = this.$outerContainer.outerHeight();
      
      var newWidth  = imageWidth + this.containerLeftPadding + this.containerRightPadding;
      var newHeight = imageHeight + this.containerTopPadding + this.containerBottomPadding;
      
      function postResize() {
        self.$lightbox.find('.lb-dataContainer').width(newWidth);
        self.$lightbox.find('.lb-prevLink').height(newHeight);
        self.$lightbox.find('.lb-nextLink').height(newHeight);
        
        if ((self.album[self.currentImageIndex].panoType != null) && (self.panoObject.isAvailable()))
      	{
        	self.showPano(imageWidth, imageHeight);
      	}
      	else
      	{
      		self.showImage();
      	}
      }
      
      if (this.topChanged)
      {
      	this.$lightbox.addClass('animating');
			var top  = $(window).scrollTop() + this.options.positionFromTop;
      		this.$lightbox.animate({top: top + 'px'}, this.options.resizeDuration, 'swing', function() {
         		self.$lightbox.removeClass('animating');
         		self.topChanged = false;
        	});
      }

      if (oldWidth !== newWidth || oldHeight !== newHeight) {
        this.$outerContainer.animate({
          width: newWidth,
          height: newHeight
        }, this.options.resizeDuration, 'swing', function() {
          postResize();
        });
      } else {
        postResize();
      }
    };

    // Display the image and it's details and begin preload neighboring images.
    Lightbox.prototype.showImage = function() {
      this.$lightbox.find('.lb-loader').hide();
      this.$lightbox.find('.lb-image').fadeIn('slow'); 
      
      this.updateNav();
      this.updateDetails();
      this.preloadNeighboringImages();
      this.enableKeyboardNav();
     
    };

	// Display the image and it's details and begin preload neighboring images.
    Lightbox.prototype.showPano = function(panoWidth, panoHeight) {
      this.$lightbox.find('.lb-loader').hide();      
      this.$lightbox.find('.lb-canvas').fadeIn('slow');
      
      this.updatePanoNav();
      this.updateDetails();
      this.preloadNeighboringImages();
      this.enableKeyboardNav();
      
      this.$lightbox.find('.lb-canvas').get(0).width = panoWidth;
	  this.$lightbox.find('.lb-canvas').get(0).height = panoHeight;
	      
      this.panoObject.setSize(panoWidth, panoHeight);
      
      var $image = this.$lightbox.find('.lb-image');
      
      if (this.album[this.currentImageIndex].panoType == "sphere-video")
      {
      	this.panoObject.setVideo(this.album[this.currentImageIndex].link, 30);
      }
      else
      {
      	this.panoObject.setImage($image.get(0));
      }
      this.$lightbox.find('.lb-pano_zoom').val(this.panoObject.getFovScale());
      
    };

    // Display previous and next navigation if appropriate.
    Lightbox.prototype.updateNav = function() {
      // Check to see if the browser supports touch events. If so, we take the conservative approach
      // and assume that mouse hover events are not supported and always show prev/next navigation
      // arrows in image sets.
      
      var alwaysShowNav = false;
      
      try {
        document.createEvent("TouchEvent");
        alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices)? true: false;
      } catch (e) {}

      this.$lightbox.find('.lb-nav').show();
		
      if (this.album.length > 1) {
        if (this.options.wrapAround) {
          if (alwaysShowNav) {
            this.$lightbox.find('.lb-prev, .lb-next').css('opacity', '1');
          }
          this.$lightbox.find('.lb-prev, .lb-next').show();
        } else {
          if (this.currentImageIndex > 0) {
            this.$lightbox.find('.lb-prev').show();
            if (alwaysShowNav) {
              this.$lightbox.find('.lb-prev').css('opacity', '1');
            }
          }
          if (this.currentImageIndex < this.album.length - 1) {
            this.$lightbox.find('.lb-next').show();
            if (alwaysShowNav) {
              this.$lightbox.find('.lb-next').css('opacity', '1');
            }
          }
        }
      }
    };
    
       // Display previous and next navigation if appropriate.
    Lightbox.prototype.updatePanoNav = function() {
      // Check to see if the browser supports touch events. If so, we take the conservative approach
      // and assume that mouse hover events are not supported and always show prev/next navigation
      // arrows in image sets.
      
      var alwaysShowNav = true;
      /*
      try {
        document.createEvent("TouchEvent");
        alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices)? true: false;
      } catch (e) {}
	  */
      this.$lightbox.find('.lb-pano_nav').show();
      this.$lightbox.find('.lb-pano_control').show();
	  this.$lightbox.find('.lb-pano_full').show();
      this.$lightbox.find('.lb-pano_full').css('opacity', '1');
      this.$lightbox.find('.lb-pano_zoom').show();
      
      if (this.album[this.currentImageIndex].panoType == "sphere-video")
      {
	      this.$lightbox.find('.lb-pano_play').show();
	      this.$lightbox.find('.lb-pano_play').css('opacity', '1');
	      this.$lightbox.find('.lb-pano_pause').hide();
	      this.$lightbox.find('.lb-pano_pause').css('opacity', '1');
      }            
      if (this.album.length > 1) {
        if (this.options.wrapAround) {
          if (alwaysShowNav) {
            this.$lightbox.find('.lb-pano_prev, .lb-pano_next').css('opacity', '1');
          }
          this.$lightbox.find('.lb-pano_prev, .lb-pano_next').show();
        } else {
          if (this.currentImageIndex > 0) {
            this.$lightbox.find('.lb-pano_prev').show();
            if (alwaysShowNav) {
              this.$lightbox.find('.lb-pano_prev').css('opacity', '1');
            }
          }
          if (this.currentImageIndex < this.album.length - 1) {
            this.$lightbox.find('.lb-pano_next').show();
            if (alwaysShowNav) {
              this.$lightbox.find('.lb-pano_next').css('opacity', '1');
            }
          }
        }
      }
    }; 

    // Display caption, image number, and closing button.
    Lightbox.prototype.updateDetails = function() {
      var self = this;

      // Enable anchor clicks in the injected caption html.
      // Thanks Nate Wright for the fix. @https://github.com/NateWr
      if (typeof this.album[this.currentImageIndex].title !== 'undefined' && this.album[this.currentImageIndex].title !== "") {
        this.$lightbox.find('.lb-caption')
          .html(this.album[this.currentImageIndex].title)
          .fadeIn('fast')
          .find('a').on('click', function(event){
            location.href = $(this).attr('href');
          });
      }
    
      if (this.album.length > 1 && this.options.showImageNumberLabel) {
        this.$lightbox.find('.lb-number').text(this.options.albumLabel(this.currentImageIndex + 1, this.album.length)).fadeIn('fast');
      } else {
        this.$lightbox.find('.lb-number').hide();
      }
    
      this.$outerContainer.removeClass('animating');
    
      this.$lightbox.find('.lb-dataContainer').fadeIn(this.options.resizeDuration, function() {
        return self.sizeOverlay();
      });
    };

    // Preload previous and next images in set.
    Lightbox.prototype.preloadNeighboringImages = function() {
      if (this.album.length > this.currentImageIndex + 1) {
        var preloadNext = new Image();
        preloadNext.src = this.album[this.currentImageIndex + 1].link;
      }
      if (this.currentImageIndex > 0) {
        var preloadPrev = new Image();
        preloadPrev.src = this.album[this.currentImageIndex - 1].link;
      }
    };

    Lightbox.prototype.enableKeyboardNav = function() {
      $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
    };

    Lightbox.prototype.disableKeyboardNav = function() {
      $(document).off('.keyboard');
    };

    Lightbox.prototype.keyboardAction = function(event) {
      var KEYCODE_ESC        = 27;
      var KEYCODE_LEFTARROW  = 37;
      var KEYCODE_RIGHTARROW = 39;

      var keycode = event.keyCode;
      var key     = String.fromCharCode(keycode).toLowerCase();
      if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
        this.end();
      } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
        if (this.currentImageIndex !== 0) {
          this.changeImage(this.currentImageIndex - 1);
        } else if (this.options.wrapAround && this.album.length > 1) {
          this.changeImage(this.album.length - 1);
        }
      } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
        if (this.currentImageIndex !== this.album.length - 1) {
          this.changeImage(this.currentImageIndex + 1);
        } else if (this.options.wrapAround && this.album.length > 1) {
          this.changeImage(0);
        }
      }
    };

    // Closing time. :-(
    Lightbox.prototype.end = function() {
      this.disableKeyboardNav();
      $(window).off("resize", this.sizeOverlay);
      this.$lightbox.fadeOut(this.options.fadeDuration);
      this.$overlay.fadeOut(this.options.fadeDuration);
      $('select, object, embed').css({
        visibility: "visible"
      });
      
      if (this.panoObject != null)
      {
      	if (this.panoObject.hasVideo())
      	{
      		this.panoObject.clearVideo();
      	}
      }
    };
    
    
   
    Lightbox.prototype.panoFullscreen = function() {
      var self = this;
      if (this.panoObject != null)
      {
      	if (!this.panoObject.fullscreen())
      	{
      		this.$lightbox.find('.lb-pano_full').hide();
      		this.$lightbox.find('.lb-pano_zoom').hide();
      		
      		$('body').css({overflow: "hidden"});
      		this.$lightbox.addClass('animating');
      		      		
			var top = $(window).scrollTop();
			this.topChanged = true;
      		this.$lightbox.animate({top: top + 'px'}, this.options.resizeDuration, 'swing', function() {
         		self.$lightbox.removeClass('animating');
        	});
        	
        	var xDiff = self.$outerContainer.width() - self.$container.width();
        	var yDiff = self.$outerContainer.height() - self.$container.height();
        	
        	var fitSizeInterval = setInterval(function() {
				var w = self.$outerContainer.width() - xDiff;
				var h = self.$outerContainer.height() - yDiff;
				self.panoObject.setSize(w, h);
			}, 1000.0/60.0); 
        	
        	this.outerContainerFullBackWidth = self.$outerContainer.width();
        	this.outerContainerFullBackHeight = self.$outerContainer.height();
        	
			this.$outerContainer.addClass('animating');
			this.$outerContainer.animate({width: window.innerWidth, height: window.innerHeight}, this.options.resizeDuration, 'swing', function() 			{
         		self.$outerContainer.removeClass('animating');
         		clearInterval(fitSizeInterval);
				self.panoObject.setSize(self.$outerContainer.width() - xDiff, self.$outerContainer.height() - yDiff);
				
				self.$lightbox.find('.lb-pano_full_back').show();
			    self.$lightbox.find('.lb-pano_full_back').css('opacity', '1');
			    self.$lightbox.find('.lb-pano_zoom').show();
        	});          	
      	}
      }
    };


	Lightbox.prototype.panoFullscreenBack = function() {
      var self = this;
      if (this.panoObject != null)
      {
      	if (!this.panoObject.fullscreen())
      	{
      		this.$lightbox.find('.lb-pano_full_back').hide();
			this.$lightbox.find('.lb-pano_zoom').hide();
			
      		this.$lightbox.addClass('animating');
			var top  = $(window).scrollTop() + this.options.positionFromTop;
      		this.$lightbox.animate({top: top + 'px'}, this.options.resizeDuration, 'swing', function() {
         		self.$lightbox.removeClass('animating');
         		self.topChanged = false;
        	});
        	
        	var xDiff = self.$outerContainer.width() - self.$container.width();
        	var yDiff = self.$outerContainer.height() - self.$container.height();
        	
        	var fitSizeInterval = setInterval(function() {
				var w = self.$outerContainer.width() - xDiff;
				var h = self.$outerContainer.height() - yDiff;
				self.panoObject.setSize(w, h);
			}, 1000.0/60.0); 
        	
        	
			this.$outerContainer.addClass('animating');
			this.$outerContainer.animate({width: this.outerContainerFullBackWidth, height: this.outerContainerFullBackHeight}, this.options.resizeDuration, 'swing', function() 			{
         		self.$outerContainer.removeClass('animating');
         		clearInterval(fitSizeInterval);
				self.panoObject.setSize(self.$outerContainer.width() - xDiff, self.$outerContainer.height() - yDiff);
				
				self.$lightbox.find('.lb-pano_full').show();
			    self.$lightbox.find('.lb-pano_full').css('opacity', '1');
			    self.$lightbox.find('.lb-pano_zoom').show();
			    
			    $('body').css({overflow: "auto"});
        	});          	
      	}
      }
    };
    
    Lightbox.prototype.panoZoom = function(zoom) {
    	
      if (this.panoObject != null)
      {
      	this.panoObject.setFovScale(zoom);
      }
    }
    
    Lightbox.prototype.panoPlay = function() {
    	
      if (this.panoObject != null)
      {
      	this.$lightbox.find('.lb-pano_play').hide();
      	this.$lightbox.find('.lb-pano_pause').show();
      	this.panoObject.playVideo();
      }
    }
    
    Lightbox.prototype.panoPause = function() {
    	
      if (this.panoObject != null)
      {
      	this.$lightbox.find('.lb-pano_pause').hide();
      	this.$lightbox.find('.lb-pano_play').show();
      	this.panoObject.pauseVideo();
      }
    }
    
    
    return Lightbox;

  })();

  $(function() {
    var options  = new LightboxOptions();
    var lightbox = new Lightbox(options);
  });

}).call(this);
