
$(document).ready(function(){$.getScript('//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.0.4/jquery.imagesloaded.min.js',function(){
$.getScript('//cdnjs.cloudflare.com/ajax/libs/jquery.isotope/2.0.0/isotope.pkgd.min.js',function(){

  /* activate jquery isotope */
  $('#posts').imagesLoaded( function(){
    $('#posts').isotope({
      itemSelector : '.item'
    });
  });
  
});
});
});