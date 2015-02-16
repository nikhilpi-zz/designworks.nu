$(document).ready(function() {
    $('#sidebar').scrollToFixed({
        marginTop: 10,
        limit: function(){
          return $('#footer').offset().top - $('#sidebar').outerHeight() - 40 ;
        },
        dontSetWidth: true
    });

    $(".fancybox").fancybox({
      // openEffect  : 'elastic',
      // closeEffect : 'elastic'
    });

    $('#email-btn').on("click", function() {
      console.log('click');
      $(this).attr("value","Thank You!");
    });
});