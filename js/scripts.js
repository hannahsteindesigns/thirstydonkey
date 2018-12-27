$(document).ready(function(){
  // fade in pretty
  $("#content").css("opacity", "1");

  // mobile nav
  $(".mobile-nav").click(function(){
    $(this).toggleClass("active");
    $("nav").slideToggle()
  });

  // load partials
  // var includes = $('[data-include]');
  // jQuery.each(includes, function(){
  //   var file = 'partials/' + $(this).data('include') + '.html';
  //   $(this).load(file);
  // });

  /* scroll to top */
  var scrolling = false,
      showArrow = function(){
        ($(window).scrollTop() > 300) ? $("#scrollTop").fadeIn() : $("#scrollTop").fadeOut();
      };
  $(window).scroll(function(){ scrolling = true; });
  setInterval(function(){
    if (scrolling) {
      scrolling = false;
      showArrow();
    }
  }, 250);
  showArrow();
  $("#scrollTop").click(function(){
    $("html,body").animate({
      scrollTop: 0
    }, 600);
  });
  // break out of script scrolling on user scroll
  $("html,body").bind("DOMMouseScroll touchmove wheel", function(e){
    scrolling = false;
    $("html,body").stop();
  });

  // scroll to section
  $("nav > a").each(function(i) {
    $(this).click(function(e){
      e.preventDefault();
      var target = this.hash,
          $target = $(target);
      $(".mobile-nav").trigger("click");
      $("html, body").stop().animate({
        "scrollTop": $target.offset().top
      }, 900, "swing", function(){
        history.pushState(null, null, target);
      });
    });
  });

  /* progressive image loading */
  // adapted from https://www.sourcetoad.com/dev-trends/progressive-loading-of-images/
  var lazyLoad = function(){
    $(".progressive").each(function(){
      var container = $(this),
          image = new Image(),
          previewImage = $(this).find(".lowres"),
          newImage = $("<img src='' class='overlay' alt='' />")
      image.onload = function(){
        newImage.attr("src", image.src).attr("alt", previewImage.attr("alt")).appendTo(container).css("opacity", "1");
        previewImage.css("opacity", "0");
      };

      image.src = previewImage.data("image");

    });
  }

  if ($(".progressive").length) {
    lazyLoad();
  }

  /* animations */
  // adapted from https://www.sitepoint.com/scroll-based-animations-jquery-css3/
  var animate = $('.animate article'),
      $window = $(window),
      checkView = function() {
        var windowHeight = $window.height(),
            windowTop = $window.scrollTop(),
            windowBottom = ( windowTop + windowHeight + 200 );

        $.each(animate, function(){
          var el = $(this),
              elHeight = el.outerHeight(),
              elTop = el.offset().top,
              elBottom = ( elTop + elHeight );

          if ( (elBottom >= windowTop) && (elTop <= windowBottom) ) {
            el.addClass("in-view");
            el.removeClass("slide");
          } else {
            el.removeClass("in-view");
          }

          if (windowTop === 0) {
            el.addClass("slide");
          }
        });
      };

      checkView();
      $window.on("scroll resize", checkView);

  /* contact form */
  // keep adaptive placeholders in place
  $("input, textarea").change(function(){
    var el = $(this);
    el.val().trim().length ? el.addClass("focus") : el.removeClass("focus");
  });
  // initialize validation
  $("#form").validate({
    errorElement: "div",
    errorPlacement: function(error, element) {
      error.appendTo( element.parent("div") );
    },
    showErrors: function(errorMap, errorList) {
      this.defaultShowErrors();
      $.each(errorMap, function(key, value) {
        var error = $("input[name='" + key + "']").nextAll("div");
        if (error.text() !== value) {
          error.html(value);
        }
      });
    },
    submitHandler: function(form, event) {
      submitForm(form);
    }
  });
  // submit form logic
  var submitForm = function(form) {
    var formMessages = $("#form-messages"),
        formData = $(form).serialize();
		$.ajax({
			type: "POST",
			url: $(form).attr("action"),
			data: formData
		})
		.done(function(response) {
			$(formMessages).removeClass("error").addClass("success");
      $("input, textarea").removeClass("focus");
			$(formMessages).hide().text(response).fadeIn();
			$('#name, #email, #message').val("");
      $(form).validate().resetForm();
      setTimeout(function(){
        $(formMessages).hide("slow");
      }, 10000);
		})
		.fail(function(data) {
			$(formMessages).removeClass("success").addClass("error");
			if (data.responseText !== "") {
				$(formMessages).hide().text(data.responseText).fadeIn();
			} else {
				$(formMessages).hide().text("Oops! Something went wrong and we couldn't send your message. Please try again.").fadeIn();
			}
		});
  };
  /* detect flex support & redirect */
  // detect adapted from http://johanronsse.be/2016/01/03/simple-flexbox-check/
  // var detectFlex = function(){
  //   var doc = document.documentElement,
  //       f = doc.style.flex,
  //       fw = doc.style.webkitFlex,
  //       updateLink = "http://dev.hannahsteindesigns.com/update";
  //       ( f === "" || fw === "" ) ? doc.className = "flex" : doc.className = "no-flex";
  //       if ( f === "" || fw === "" ) {
  //         doc.className = "flex";
  //       } else if (window.location.href != updateLink) {
  //         window.location.replace(updateLink);
  //       } else {
  //         return;
  //       }
  // };
  // detectFlex();
});
